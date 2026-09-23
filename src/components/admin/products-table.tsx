"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Pencil, Search } from "lucide-react";
import { toast } from "sonner";

import type { Category, Product } from "@/types";
import {
  bulkProductAction,
  deleteProduct,
  duplicateProduct,
  setProductFlag,
} from "@/actions/admin/products";
import { AdminTable, ConfirmAction, EmptyRow, Pill, Td } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { effectivePrice, formatPrice } from "@/lib/utils";

type SortKey = "newest" | "name" | "price" | "stock" | "sold";

export function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 15;

  const filtered = useMemo(() => {
    let list = [...products];
    const needle = query.trim().toLowerCase();

    if (needle) {
      list = list.filter((p) =>
        [p.name, p.sku, p.categoryName, ...p.tags]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(needle))
      );
    }
    if (category) list = list.filter((p) => p.categorySlug === category);
    if (status === "published") list = list.filter((p) => p.isPublished);
    if (status === "draft") list = list.filter((p) => !p.isPublished);
    if (status === "low") {
      list = list.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold);
    }
    if (status === "out") list = list.filter((p) => p.stockQuantity <= 0);

    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        list.sort(
          (a, b) => effectivePrice(b.price, b.salePrice) - effectivePrice(a.price, a.salePrice)
        );
        break;
      case "stock":
        list.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
      case "sold":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [products, query, category, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  async function runBulk(action: Parameters<typeof bulkProductAction>[1]) {
    const result = await bulkProductAction(selected, action);
    if (result.ok) {
      toast.success(result.message);
      setSelected([]);
    } else {
      toast.error(result.message);
    }
  }

  async function toggleFlag(id: string, published: boolean) {
    const result = await setProductFlag(id, "is_published", !published);
    if (result.ok) toast.success(published ? "Unpublished." : "Published.");
    else toast.error(result.message);
  }

  async function onDuplicate(id: string) {
    const result = await duplicateProduct(id);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  const allVisibleSelected = visible.length > 0 && visible.every((p) => selected.includes(p.id));

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, SKU or tag"
            aria-label="Search products"
            className="w-full border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by category"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort products"
          className="border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        >
          <option value="newest">Newest</option>
          <option value="name">Name A–Z</option>
          <option value="price">Highest price</option>
          <option value="stock">Lowest stock</option>
          <option value="sold">Best selling</option>
        </select>
      </div>

      {selected.length ? (
        <div className="flex flex-wrap items-center gap-2 border border-line bg-white px-4 py-3">
          <span className="text-sm text-ash">{selected.length} selected</span>
          <span className="flex-1" />
          <Button size="sm" variant="outline" onClick={() => runBulk("publish")}>
            Publish
          </Button>
          <Button size="sm" variant="outline" onClick={() => runBulk("unpublish")}>
            Unpublish
          </Button>
          <Button size="sm" variant="outline" onClick={() => runBulk("feature")}>
            Feature
          </Button>
          <ConfirmAction
            label="Delete selected"
            confirmLabel="Delete permanently"
            onConfirm={async () => {
              const result = await bulkProductAction(selected, "delete");
              if (result.ok) setSelected([]);
              return result;
            }}
            className="ml-2"
          />
        </div>
      ) : null}

      <AdminTable
        head={[
          <input
            key="all"
            type="checkbox"
            checked={allVisibleSelected}
            onChange={(event) =>
              setSelected(
                event.target.checked
                  ? Array.from(new Set([...selected, ...visible.map((p) => p.id)]))
                  : selected.filter((id) => !visible.some((p) => p.id === id))
              )
            }
            aria-label="Select all on this page"
            className="h-4 w-4 accent-ink"
          />,
          "Product",
          "Category",
          "Price",
          "Stock",
          "Status",
          "",
        ]}
      >
        {visible.length ? (
          visible.map((product) => {
            const price = effectivePrice(product.price, product.salePrice);
            const stockTone =
              product.stockQuantity <= 0
                ? "danger"
                : product.stockQuantity <= product.lowStockThreshold
                  ? "warning"
                  : "success";

            return (
              <tr key={product.id} className="hover:bg-ivory-deep/30">
                <Td>
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, product.id]
                          : current.filter((id) => id !== product.id)
                      )
                    }
                    aria-label={`Select ${product.name}`}
                    className="h-4 w-4 accent-ink"
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <span className="relative aspect-3/4 w-10 shrink-0 overflow-hidden bg-ivory-deep">
                      <Image
                        src={product.images[0]?.url ?? "/media/banners/og-default.v3.jpg"}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="block max-w-72 truncate text-sm text-ink hover:text-gold"
                      >
                        {product.name}
                      </Link>
                      <span className="mt-0.5 block text-xs text-ash">{product.sku}</span>
                    </span>
                  </div>
                </Td>
                <Td className="text-sm text-ash">{product.categoryName ?? "—"}</Td>
                <Td>
                  <span className="text-sm tabular-nums">{formatPrice(price)}</span>
                  {product.salePrice ? (
                    <span className="ml-2 text-xs tabular-nums text-ash line-through">
                      {formatPrice(product.price)}
                    </span>
                  ) : null}
                </Td>
                <Td>
                  <Pill tone={stockTone}>
                    {product.stockQuantity <= 0 ? "Out" : `${product.stockQuantity}`}
                  </Pill>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <Pill tone={product.isPublished ? "success" : "muted"}>
                      {product.isPublished ? "Live" : "Draft"}
                    </Pill>
                    {product.isFeatured ? <Pill>Featured</Pill> : null}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-ash hover:text-ink"
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFlag(product.id, product.isPublished)}
                      className="text-ash hover:text-ink"
                      aria-label={product.isPublished ? "Unpublish" : "Publish"}
                    >
                      {product.isPublished ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicate(product.id)}
                      className="text-ash hover:text-ink"
                      aria-label={`Duplicate ${product.name}`}
                    >
                      <Copy className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <ConfirmAction
                      label=""
                      onConfirm={() => deleteProduct(product.id)}
                    />
                  </div>
                </Td>
              </tr>
            );
          })
        ) : (
          <EmptyRow colSpan={7}>No products match these filters.</EmptyRow>
        )}
      </AdminTable>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-ash">
            Page {safePage} of {totalPages} · {filtered.length} products
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
