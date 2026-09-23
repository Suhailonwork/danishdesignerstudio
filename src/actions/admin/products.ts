"use server";

import { z } from "zod";

import { slugify } from "@/lib/utils";
import { seoToRow } from "@/lib/data/mappers";
import { stockStatusFor } from "@/lib/data/seed";

import { getWritableClient, revalidateStorefront, type AdminResult } from "./core";

const csv = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Product name is required").max(200),
  slug: z.string().max(200).optional(),
  sku: z.string().max(60).optional(),
  categoryId: z.string().optional(),
  brand: z.string().max(80).optional(),
  shortDescription: z.string().max(400).optional(),
  description: z.string().max(8000).optional(),
  price: z.coerce.number().min(0, "Price must be zero or more"),
  salePrice: z.coerce.number().min(0).optional(),
  costPrice: z.coerce.number().min(0).optional(),
  stockQuantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  material: z.string().max(120).optional(),
  fabric: z.string().max(160).optional(),
  careInstructions: z.string().max(1000).optional(),
  videoUrl: z.string().max(400).optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(400).optional(),
  canonicalUrl: z.string().max(400).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().max(400).optional(),
  ogImage: z.string().max(500).optional(),
});

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

export async function saveProduct(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult<{ id: string }>> {
  const parsed = productSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const input = parsed.data;
  const slug = slugify(input.slug || input.name);
  const stockQuantity = input.stockQuantity;
  const lowStockThreshold = input.lowStockThreshold ?? 5;

  const tags = csv(formData.get("tags"));
  const sizes = csv(formData.get("sizes"));
  const colors = csv(formData.get("colors"));
  const collectionIds = formData.getAll("collectionIds").map(String).filter(Boolean);
  const imageUrls = formData
    .getAll("imageUrls")
    .map(String)
    .map((url) => url.trim())
    .filter(Boolean);

  const row = {
    name: input.name,
    slug,
    sku: input.sku || `DDS-${slug.slice(0, 10).toUpperCase()}`,
    category_id: input.categoryId || null,
    brand: input.brand || "Danish Designer Studio",
    short_description: input.shortDescription || null,
    description: input.description || null,
    price: input.price,
    sale_price: input.salePrice && input.salePrice > 0 ? input.salePrice : null,
    cost_price: input.costPrice && input.costPrice > 0 ? input.costPrice : null,
    stock_quantity: stockQuantity,
    low_stock_threshold: lowStockThreshold,
    stock_status: stockStatusFor(stockQuantity, lowStockThreshold),
    material: input.material || null,
    fabric: input.fabric || null,
    care_instructions: input.careInstructions || null,
    tags,
    sizes,
    colors,
    video_url: input.videoUrl || null,
    is_featured: checkbox(formData, "isFeatured"),
    is_trending: checkbox(formData, "isTrending"),
    is_best_seller: checkbox(formData, "isBestSeller"),
    is_new_arrival: checkbox(formData, "isNewArrival"),
    is_published: checkbox(formData, "isPublished"),
    display_order: input.displayOrder ?? 0,
    seo: seoToRow({
      metaTitle: input.metaTitle || null,
      metaDescription: input.metaDescription || null,
      keywords: tags,
      canonicalUrl: input.canonicalUrl || null,
      ogTitle: input.ogTitle || null,
      ogDescription: input.ogDescription || null,
      ogImage: input.ogImage || imageUrls[0] || null,
      noIndex: checkbox(formData, "noIndex"),
      noFollow: checkbox(formData, "noFollow"),
    }),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = input.id
    ? await access.client.from("products").update(row).eq("id", input.id).select("id").single()
    : await access.client.from("products").insert(row).select("id").single();

  if (error) return { ok: false, message: error.message };

  const productId = String(data.id);

  // Images: replace the set so ordering always matches what the admin arranged.
  if (imageUrls.length) {
    await access.client.from("product_images").delete().eq("product_id", productId);
    const { error: imageError } = await access.client.from("product_images").insert(
      imageUrls.map((url, index) => ({
        product_id: productId,
        url,
        alt: `${input.name} — view ${index + 1}`,
        display_order: index + 1,
      }))
    );
    if (imageError) return { ok: false, message: `Images: ${imageError.message}` };
  }

  // Collection membership.
  await access.client.from("collection_products").delete().eq("product_id", productId);
  if (collectionIds.length) {
    const { error: collectionError } = await access.client.from("collection_products").insert(
      collectionIds.map((collectionId, index) => ({
        collection_id: collectionId,
        product_id: productId,
        display_order: index + 1,
      }))
    );
    if (collectionError) return { ok: false, message: `Collections: ${collectionError.message}` };
  }

  // Variants: regenerate the size x colour matrix, preserving known stock.
  if (sizes.length && colors.length) {
    const { data: existing } = await access.client
      .from("product_variants")
      .select("size, color, stock_quantity")
      .eq("product_id", productId);

    const previous = new Map(
      (existing ?? []).map((v) => [`${v.size}::${v.color}`, Number(v.stock_quantity ?? 0)])
    );

    await access.client.from("product_variants").delete().eq("product_id", productId);

    const variants = colors.flatMap((color) =>
      sizes.map((size) => ({
        product_id: productId,
        sku: `${slug.slice(0, 6).toUpperCase()}-${color.slice(0, 3).toUpperCase()}-${size}`,
        size,
        color,
        stock_quantity: previous.get(`${size}::${color}`) ?? 0,
        is_active: true,
      }))
    );

    const { error: variantError } = await access.client.from("product_variants").insert(variants);
    if (variantError) return { ok: false, message: `Variants: ${variantError.message}` };
  }

  await revalidateStorefront([`/product/${slug}`, "/admin/products", "/admin/inventory"]);

  return {
    ok: true,
    message: input.id ? "Product saved." : "Product created.",
    data: { id: productId },
  };
}

export async function duplicateProduct(id: string): Promise<AdminResult<{ id: string }>> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { data: source, error } = await access.client
    .from("products")
    .select("*, product_images ( url, alt, display_order )")
    .eq("id", id)
    .single();

  if (error || !source) return { ok: false, message: error?.message ?? "Product not found." };

  const { product_images: images, id: _ignored, created_at, updated_at, ...rest } = source as
    Record<string, unknown> & { product_images?: Record<string, unknown>[] };
  void _ignored;
  void created_at;
  void updated_at;

  const now = new Date().toISOString();
  const copy = {
    ...rest,
    name: `${String(rest.name)} (copy)`,
    slug: `${String(rest.slug)}-copy-${Math.random().toString(36).slice(2, 6)}`,
    sku: `${String(rest.sku)}-C`,
    is_published: false,
    created_at: now,
    updated_at: now,
  };

  const { data: created, error: insertError } = await access.client
    .from("products")
    .insert(copy)
    .select("id")
    .single();

  if (insertError) return { ok: false, message: insertError.message };

  if (images?.length) {
    await access.client.from("product_images").insert(
      images.map((image) => ({
        product_id: created.id,
        url: image.url,
        alt: image.alt,
        display_order: image.display_order,
      }))
    );
  }

  await revalidateStorefront(["/admin/products"]);
  return { ok: true, message: "Product duplicated.", data: { id: String(created.id) } };
}

export async function deleteProduct(id: string): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/products"]);
  return { ok: true, message: "Product deleted." };
}

export async function setProductFlag(
  id: string,
  column: "is_published" | "is_featured" | "is_trending" | "is_best_seller" | "is_new_arrival",
  value: boolean
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from("products").update({ [column]: value }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/products"]);
  return { ok: true, message: "Updated." };
}

export async function bulkProductAction(
  ids: string[],
  action: "publish" | "unpublish" | "delete" | "feature" | "unfeature"
): Promise<AdminResult> {
  if (!ids.length) return { ok: false, message: "Select at least one product." };

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const table = access.client.from("products");
  const { error } =
    action === "delete"
      ? await table.delete().in("id", ids)
      : await table
          .update({
            ...(action === "publish" ? { is_published: true } : {}),
            ...(action === "unpublish" ? { is_published: false } : {}),
            ...(action === "feature" ? { is_featured: true } : {}),
            ...(action === "unfeature" ? { is_featured: false } : {}),
          })
          .in("id", ids);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/products"]);
  return { ok: true, message: `${ids.length} product${ids.length === 1 ? "" : "s"} updated.` };
}
