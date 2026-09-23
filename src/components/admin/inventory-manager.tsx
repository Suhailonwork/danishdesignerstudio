"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useMemo, useState } from "react";
import { Check, Minus, Plus, Search, Settings2 } from "lucide-react";
import { toast } from "sonner";

import type { InventoryTransaction, Product } from "@/types";
import { adjustInventory, setLowStockThreshold } from "@/actions/admin/inventory";
import type { AdminResult } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input, Select, Textarea } from "@/components/ui/field";
import { AdminTable, Card, EmptyRow, Pill, SubmitButton, Td } from "@/components/admin/ui";
import { cn, formatDate, titleCase } from "@/lib/utils";

export function InventoryManager({
  products,
  transactions,
}: {
  products: Product[];
  transactions: InventoryTransaction[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [active, setActive] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter((p) =>
        [p.name, p.sku].some((field) => field.toLowerCase().includes(needle))
      );
    }
    if (filter === "low") {
      list = list.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold);
    }
    if (filter === "out") list = list.filter((p) => p.stockQuantity <= 0);
    return list.sort((a, b) => a.stockQuantity - b.stockQuantity);
  }, [products, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            aria-label="Search inventory"
            className="w-full border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ink"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "low", "out"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "border px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.12em] transition-colors",
                filter === value
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-ash hover:border-ink hover:text-ink"
              )}
            >
              {value === "all" ? "All" : value === "low" ? "Low stock" : "Out of stock"}
            </button>
          ))}
        </div>
      </div>

      <Card title="Stock levels" description="Click adjust to restock, reduce or set an exact count.">
        <AdminTable head={["Product", "SKU", "Variants", "Threshold", "Stock", ""]}>
          {filtered.length ? (
            filtered.map((product) => {
              const tone =
                product.stockQuantity <= 0
                  ? "danger"
                  : product.stockQuantity <= product.lowStockThreshold
                    ? "warning"
                    : "success";

              return (
                <tr key={product.id} className="hover:bg-ivory-deep/30">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="relative aspect-3/4 w-9 shrink-0 overflow-hidden bg-ivory-deep">
                        <Image
                          src={product.images[0]?.url ?? "/media/banners/og-default.v3.jpg"}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="max-w-64 truncate text-sm hover:text-gold"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </Td>
                  <Td className="text-xs text-ash">{product.sku}</Td>
                  <Td className="text-sm text-ash">{product.variants.length || "—"}</Td>
                  <Td className="text-sm tabular-nums text-ash">{product.lowStockThreshold}</Td>
                  <Td>
                    <Pill tone={tone}>
                      {product.stockQuantity <= 0
                        ? "Out of stock"
                        : `${product.stockQuantity} in stock`}
                    </Pill>
                  </Td>
                  <Td className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setActive(product)}>
                      <Settings2 className="h-3.5 w-3.5" />
                      Adjust
                    </Button>
                  </Td>
                </tr>
              );
            })
          ) : (
            <EmptyRow colSpan={6}>Nothing matches this filter.</EmptyRow>
          )}
        </AdminTable>
      </Card>

      <Card title="Stock history" description="Every movement, with who made it and why.">
        <AdminTable head={["When", "Product", "Type", "Change", "After", "Reason"]}>
          {transactions.length ? (
            transactions.slice(0, 25).map((entry) => (
              <tr key={entry.id}>
                <Td className="whitespace-nowrap text-xs text-ash">
                  {formatDate(entry.createdAt)}
                </Td>
                <Td className="max-w-56 truncate text-sm">{entry.productName ?? entry.productId}</Td>
                <Td>
                  <Pill tone={entry.changeType === "sale" ? "muted" : "default"}>
                    {titleCase(entry.changeType)}
                  </Pill>
                </Td>
                <Td
                  className={cn(
                    "tabular-nums text-sm",
                    entry.quantityChange < 0 ? "text-danger" : "text-emerald-700"
                  )}
                >
                  {entry.quantityChange > 0 ? "+" : ""}
                  {entry.quantityChange}
                </Td>
                <Td className="tabular-nums text-sm">{entry.quantityAfter}</Td>
                <Td className="max-w-56 truncate text-xs text-ash">{entry.reason ?? "—"}</Td>
              </tr>
            ))
          ) : (
            <EmptyRow colSpan={6}>No stock movements recorded yet.</EmptyRow>
          )}
        </AdminTable>
      </Card>

      <AdjustDrawer key={active?.id ?? "none"} product={active} onClose={() => setActive(null)} />
    </div>
  );
}

function AdjustDrawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [mode, setMode] = useState<"increase" | "decrease" | "set">("increase");
  const [threshold, setThreshold] = useState(product?.lowStockThreshold ?? 5);

  const runAdjust = useCallback(
    async (prev: AdminResult | null, formData: FormData) => {
      const result = await adjustInventory(prev, formData);
      if (result.ok) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
      return result;
    },
    [onClose]
  );

  const [, formAction] = useActionState<AdminResult | null, FormData>(runAdjust, null);

  async function saveThreshold() {
    if (!product) return;
    const result = await setLowStockThreshold(product.id, threshold);
    if (result.ok) toast.success("Threshold updated.");
    else toast.error(result.message);
  }

  return (
    <Drawer open={Boolean(product)} onClose={onClose} title="Adjust stock">
      {product ? (
        <div className="space-y-7">
          <div>
            <p className="text-sm text-ink">{product.name}</p>
            <p className="mt-1 text-xs text-ash">
              {product.sku} · currently {product.stockQuantity} in stock
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="mode" value={mode} />

            <fieldset>
              <legend className="mb-2 text-[0.68rem] uppercase tracking-[0.16em] text-ash">
                Action
              </legend>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { value: "increase", label: "Restock", icon: Plus },
                    { value: "decrease", label: "Reduce", icon: Minus },
                    { value: "set", label: "Set exact", icon: Check },
                  ] as const
                ).map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setMode(option.value)}
                      aria-pressed={mode === option.value}
                      className={cn(
                        "flex items-center justify-center gap-1.5 border py-2.5 text-xs transition-colors",
                        mode === option.value
                          ? "border-ink bg-ink text-ivory"
                          : "border-line text-ash hover:border-ink hover:text-ink"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {product.variants.length ? (
              <Select name="variantId" label="Variant" defaultValue="all">
                <option value="all">Whole product</option>
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.color} · {variant.size} ({variant.stockQuantity} in stock)
                  </option>
                ))}
              </Select>
            ) : null}

            <Input
              name="quantity"
              label="Quantity"
              type="number"
              min={0}
              step={1}
              defaultValue={1}
              required
            />

            <Textarea
              name="reason"
              label="Reason"
              rows={2}
              placeholder="Atelier batch received, stock count correction…"
            />

            <SubmitButton>Apply adjustment</SubmitButton>
          </form>

          <div className="space-y-3 border-t border-line pt-6">
            <Input
              label="Low stock threshold"
              type="number"
              min={0}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              hint="A warning appears on the dashboard at or below this level."
            />
            <Button variant="outline" size="sm" onClick={saveThreshold}>
              Save threshold
            </Button>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
