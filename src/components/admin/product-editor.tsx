"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import type { Category, Collection, Product } from "@/types";
import { saveProduct } from "@/actions/admin/products";
import type { AdminResult } from "@/actions/admin/core";
import { Input, Select, Textarea } from "@/components/ui/field";
import { cn, discountPercent, formatPrice, slugify } from "@/lib/utils";

import { ImageListField } from "./image-field";
import { MediaPicker } from "./media-picker";
import { SeoEditor } from "./seo-editor";
import { Card, FormFeedback, SubmitButton, Toggle } from "./ui";

const TABS = [
  "General",
  "Pricing",
  "Inventory",
  "Variants",
  "Images",
  "Organisation",
  "SEO",
] as const;
type Tab = (typeof TABS)[number];

export function ProductEditor({
  product,
  categories,
  collections,
}: {
  product?: Product;
  categories: Category[];
  collections: Collection[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("General");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? 0);
  const [sizes, setSizes] = useState((product?.sizes ?? ["S", "M", "L", "XL", "XXL"]).join(", "));
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));

  const [state, formAction] = useActionState<AdminResult | null, FormData>(saveProduct, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success(state.message);
      const created = (state.data as { id?: string } | undefined)?.id;
      if (created && !product) router.push(`/admin/products/${created}`);
      else router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, product, router]);

  const discount = discountPercent(price, salePrice);
  const sizeList = sizes.split(",").map((s) => s.trim()).filter(Boolean);
  const colorList = colors.split(",").map((c) => c.trim()).filter(Boolean);

  return (
    <form action={formAction} className="space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-line" role="tablist">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
              tab === item ? "border-ink text-ink" : "border-transparent text-ash hover:text-ink"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Panels — kept mounted so unsaved input in other tabs still submits */}
      <div className={tab === "General" ? "block" : "hidden"}>
        <Card title="Product details">
          <div className="space-y-5">
            <Input
              name="name"
              label="Product name"
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!product) setSlug(slugify(event.target.value));
              }}
              error={state?.fieldErrors?.name}
            />
            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                name="slug"
                label="URL slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                hint={`/product/${slug || "your-product"}`}
              />
              <Input name="sku" label="SKU" defaultValue={product?.sku ?? ""} />
            </div>
            <Textarea
              name="shortDescription"
              label="Short description"
              rows={2}
              defaultValue={product?.shortDescription ?? ""}
              hint="One sentence, shown under the product title and used as the default meta description."
            />
            <Textarea
              name="description"
              label="Full description"
              rows={10}
              defaultValue={product?.description ?? ""}
              hint="Supports simple markdown: ## headings, **bold**, - lists."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              <Input name="brand" label="Brand" defaultValue={product?.brand ?? "Danish Designer Studio"} />
              <Input name="material" label="Material" defaultValue={product?.material ?? ""} />
              <Input name="fabric" label="Fabric" defaultValue={product?.fabric ?? ""} />
            </div>
            <Textarea
              name="careInstructions"
              label="Care instructions"
              rows={3}
              defaultValue={product?.careInstructions ?? ""}
            />
          </div>
        </Card>
      </div>

      <div className={tab === "Pricing" ? "block" : "hidden"}>
        <Card title="Pricing">
          <div className="grid gap-5 lg:grid-cols-3">
            <Input
              name="price"
              label="Regular price (₹)"
              type="number"
              min={0}
              step={1}
              required
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              error={state?.fieldErrors?.price}
            />
            <Input
              name="salePrice"
              label="Sale price (₹)"
              type="number"
              min={0}
              step={1}
              value={salePrice || ""}
              onChange={(event) => setSalePrice(Number(event.target.value))}
              hint="Leave empty for no discount."
            />
            <Input
              name="costPrice"
              label="Cost price (₹)"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.costPrice ?? ""}
              hint="Internal only — never shown to customers."
            />
          </div>

          <div className="mt-6 border border-line bg-ivory-deep/40 p-5 text-sm">
            <p className="eyebrow mb-2">Customer sees</p>
            <p className="flex flex-wrap items-baseline gap-3">
              <span className="font-display text-2xl">
                {formatPrice(salePrice && salePrice < price ? salePrice : price)}
              </span>
              {discount > 0 ? (
                <>
                  <span className="text-ash line-through">{formatPrice(price)}</span>
                  <span className="border border-wine bg-wine px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-ivory">
                    Save {discount}%
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </Card>
      </div>

      <div className={tab === "Inventory" ? "block" : "hidden"}>
        <Card
          title="Inventory"
          description="Product-level stock. When variants exist, the total is recalculated from them."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <Input
              name="stockQuantity"
              label="Stock quantity"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.stockQuantity ?? 0}
            />
            <Input
              name="lowStockThreshold"
              label="Low stock threshold"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.lowStockThreshold ?? 5}
              hint="A warning appears at or below this level."
            />
            <Input
              name="displayOrder"
              label="Display order"
              type="number"
              min={0}
              step={1}
              defaultValue={product?.displayOrder ?? 0}
            />
          </div>

          {product ? (
            <p className="mt-5 text-sm text-ash">
              For day-to-day restocking use the{" "}
              <Link href="/admin/inventory" className="underline underline-offset-4">
                inventory screen
              </Link>
              , which records an audit trail for every movement.
            </p>
          ) : null}
        </Card>
      </div>

      <div className={tab === "Variants" ? "block" : "hidden"}>
        <Card
          title="Sizes and colours"
          description="Saving regenerates the size × colour matrix. Existing variant stock is preserved."
        >
          <div className="space-y-5">
            <Input
              name="sizes"
              label="Sizes"
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              hint="Comma separated, in the order they should appear."
            />
            <Input
              name="colors"
              label="Colours"
              value={colors}
              onChange={(event) => setColors(event.target.value)}
              hint="Comma separated, e.g. Black, Ivory, Maroon."
            />

            {sizeList.length && colorList.length ? (
              <div className="border border-line bg-ivory-deep/40 p-5">
                <p className="eyebrow mb-3">
                  {sizeList.length * colorList.length} variants will exist
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {colorList.flatMap((color) =>
                    sizeList.map((size) => (
                      <span
                        key={`${color}-${size}`}
                        className="border border-line bg-white px-2.5 py-1 text-[0.68rem] text-ash"
                      >
                        {color} · {size}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-ash">
                Add at least one size and one colour to generate variants.
              </p>
            )}

            {product?.variants.length ? (
              <div className="overflow-x-auto border border-line">
                <table className="w-full min-w-[30rem] text-sm">
                  <thead className="border-b border-line bg-ivory-deep/40 text-left">
                    <tr>
                      <th className="px-4 py-2.5 text-[0.64rem] uppercase tracking-[0.12em] text-ash">
                        SKU
                      </th>
                      <th className="px-4 py-2.5 text-[0.64rem] uppercase tracking-[0.12em] text-ash">
                        Colour
                      </th>
                      <th className="px-4 py-2.5 text-[0.64rem] uppercase tracking-[0.12em] text-ash">
                        Size
                      </th>
                      <th className="px-4 py-2.5 text-[0.64rem] uppercase tracking-[0.12em] text-ash">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {product.variants.slice(0, 40).map((variant) => (
                      <tr key={variant.id}>
                        <td className="px-4 py-2.5 text-xs text-ash">{variant.sku}</td>
                        <td className="px-4 py-2.5">{variant.color}</td>
                        <td className="px-4 py-2.5">{variant.size}</td>
                        <td className="px-4 py-2.5 tabular-nums">{variant.stockQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <div className={tab === "Images" ? "block" : "hidden"}>
        <Card title="Images" description="Upload to Supabase Storage or paste an image URL.">
          <ImageListField
            name="imageUrls"
            label="Product gallery"
            defaultValues={product?.images.map((image) => image.url) ?? []}
            bucket="product-images"
          />
          <div className="mt-6">
            <MediaPicker
              name="videoUrl"
              label="Product video (optional)"
              kind="video"
              aspect="wide"
              bucket="product-images"
              defaultValue={product?.videoUrl ?? ""}
              hint="Shown as a Play button over the gallery on the product page."
            />
          </div>
        </Card>
      </div>

      <div className={tab === "Organisation" ? "block" : "hidden"}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Category and collections">
            <div className="space-y-5">
              <Select name="categoryId" label="Category" defaultValue={product?.categoryId ?? ""}>
                <option value="">Uncategorised</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>

              <fieldset>
                <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.16em] text-ash">
                  Collections
                </legend>
                <div className="space-y-2.5">
                  {collections.map((collection) => (
                    <label key={collection.id} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        name="collectionIds"
                        value={collection.id}
                        defaultChecked={product?.collectionSlugs.includes(collection.slug)}
                        className="h-4 w-4 accent-ink"
                      />
                      {collection.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Input
                name="tags"
                label="Tags"
                defaultValue={product?.tags.join(", ") ?? ""}
                hint="Comma separated. Used for search and SEO keywords."
              />
            </div>
          </Card>

          <Card title="Visibility and merchandising">
            <div className="space-y-4">
              <Toggle
                name="isPublished"
                label="Published"
                description="Visible on the storefront and in search results."
                defaultChecked={product?.isPublished ?? true}
              />
              <Toggle
                name="isFeatured"
                label="Featured"
                description="Eligible for featured homepage slots."
                defaultChecked={product?.isFeatured ?? false}
              />
              <Toggle
                name="isNewArrival"
                label="New arrival"
                description="Appears in the New Arrivals section."
                defaultChecked={product?.isNewArrival ?? false}
              />
              <Toggle
                name="isTrending"
                label="Trending"
                description="Appears in the Trending Products section."
                defaultChecked={product?.isTrending ?? false}
              />
              <Toggle
                name="isBestSeller"
                label="Best seller"
                description="Appears in the Most Purchased section."
                defaultChecked={product?.isBestSeller ?? false}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className={tab === "SEO" ? "block" : "hidden"}>
        <SeoEditor
          seo={product?.seo}
          path={`/product/${slug || "your-product"}`}
          fallbackTitle={name || "Product name"}
          fallbackDescription={product?.shortDescription}
          fallbackImage={product?.images[0]?.url}
        />
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-ivory/95 py-4 backdrop-blur-sm">
        <SubmitButton>{product ? "Save product" : "Create product"}</SubmitButton>
        {product ? (
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-ash hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on storefront
          </Link>
        ) : null}
        <span className="flex-1" />
        <div className="w-full sm:w-auto">
          <FormFeedback state={state} />
        </div>
      </div>
    </form>
  );
}
