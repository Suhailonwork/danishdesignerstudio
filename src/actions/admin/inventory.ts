"use server";

import { z } from "zod";

import { stockStatusFor } from "@/lib/data/seed";

import { getWritableClient, revalidateStorefront, type AdminResult } from "./core";

const adjustSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  mode: z.enum(["increase", "decrease", "set"]),
  quantity: z.coerce.number().int().min(0),
  reason: z.string().max(200).optional(),
});

/**
 * Single entry point for every stock movement. It writes the new level and an
 * audit row, so inventory history is always complete.
 */
export async function adjustInventory(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const parsed = adjustSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid quantity." };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { productId, variantId, mode, quantity, reason } = parsed.data;
  const targetVariant = variantId && variantId !== "all" ? variantId : null;

  const { data: product, error: readError } = await access.client
    .from("products")
    .select("id, name, stock_quantity, low_stock_threshold")
    .eq("id", productId)
    .single();

  if (readError || !product) {
    return { ok: false, message: readError?.message ?? "Product not found." };
  }

  let variantAfter: number | null = null;

  if (targetVariant) {
    const { data: variant, error: variantError } = await access.client
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", targetVariant)
      .single();

    if (variantError || !variant) {
      return { ok: false, message: variantError?.message ?? "Variant not found." };
    }

    const current = Number(variant.stock_quantity ?? 0);
    variantAfter =
      mode === "set" ? quantity : mode === "increase" ? current + quantity : current - quantity;
    variantAfter = Math.max(0, variantAfter);

    const { error: updateError } = await access.client
      .from("product_variants")
      .update({ stock_quantity: variantAfter })
      .eq("id", targetVariant);

    if (updateError) return { ok: false, message: updateError.message };
  }

  // Product level always reflects the sum of its variants when variants exist.
  const { data: variants } = await access.client
    .from("product_variants")
    .select("stock_quantity")
    .eq("product_id", productId);

  const current = Number(product.stock_quantity ?? 0);
  const threshold = Number(product.low_stock_threshold ?? 5);

  const productAfter = variants?.length
    ? variants.reduce((sum, v) => sum + Number(v.stock_quantity ?? 0), 0)
    : Math.max(
        0,
        mode === "set" ? quantity : mode === "increase" ? current + quantity : current - quantity
      );

  const { error: productError } = await access.client
    .from("products")
    .update({
      stock_quantity: productAfter,
      stock_status: stockStatusFor(productAfter, threshold),
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (productError) return { ok: false, message: productError.message };

  const change = productAfter - current;
  await access.client.from("inventory_transactions").insert({
    product_id: productId,
    variant_id: targetVariant,
    change_type: mode === "increase" ? "restock" : mode === "decrease" ? "adjustment" : "adjustment",
    quantity_change: change,
    quantity_after: productAfter,
    reason: reason || (mode === "set" ? "Stock count set" : "Manual adjustment"),
    created_by: access.actor,
  });

  await revalidateStorefront(["/admin/inventory", "/admin/products"]);

  return {
    ok: true,
    message: `${product.name}: stock is now ${productAfter}${
      targetVariant ? ` (variant ${variantAfter})` : ""
    }.`,
  };
}

export async function setLowStockThreshold(
  productId: string,
  threshold: number
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { data: product } = await access.client
    .from("products")
    .select("stock_quantity")
    .eq("id", productId)
    .single();

  const quantity = Number(product?.stock_quantity ?? 0);

  const { error } = await access.client
    .from("products")
    .update({
      low_stock_threshold: threshold,
      stock_status: stockStatusFor(quantity, threshold),
    })
    .eq("id", productId);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/inventory"]);
  return { ok: true, message: "Threshold updated." };
}
