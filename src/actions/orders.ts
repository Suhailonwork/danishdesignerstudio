"use server";

import { z } from "zod";

import type { CartLine, Coupon } from "@/types";
import { getCurrentUser } from "@/lib/auth";
import { findCoupon, getProductById } from "@/lib/data/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

const lineSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  quantity: z.coerce.number().int().min(1).max(20),
});

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  fullName: z.string().min(2, "Enter your full name").max(120),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  line1: z.string().min(3, "Enter your address").max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, "Enter your city").max(80),
  state: z.string().min(2, "Enter your state").max(80),
  postalCode: z.string().min(4, "Enter your PIN code").max(12),
  country: z.string().min(2).max(80).default("India"),
  paymentMethod: z.enum(["razorpay", "cod"]),
  couponCode: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
  items: z.string().min(2),
});

export interface CheckoutResult {
  ok: boolean;
  message: string;
  orderNumber?: string;
  fieldErrors?: Record<string, string>;
}

function applyCoupon(subtotal: number, coupon: Coupon | null) {
  if (!coupon || !coupon.isActive) return 0;
  if (subtotal < coupon.minOrderValue) return 0;
  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) return 0;
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return 0;
  if (typeof coupon.usageLimit === "number" && coupon.usedCount >= coupon.usageLimit) return 0;

  const raw =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return Math.min(Math.round(capped), subtotal);
}

/** Validates a coupon against a subtotal without placing an order. */
export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await findCoupon(code);
  if (!coupon) return { ok: false as const, message: "That code is not recognised." };

  const discount = applyCoupon(subtotal, coupon);
  if (discount <= 0) {
    return {
      ok: false as const,
      message:
        subtotal < coupon.minOrderValue
          ? `This code needs a minimum order of ₹${coupon.minOrderValue.toLocaleString("en-IN")}.`
          : "This code is no longer available.",
    };
  }

  return {
    ok: true as const,
    message: `${coupon.code} applied — you saved ₹${discount.toLocaleString("en-IN")}.`,
    discount,
    code: coupon.code,
  };
}

function orderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DDS-${year}-${random}`;
}

export async function placeOrder(
  _prev: CheckoutResult | null,
  formData: FormData
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  let rawLines: unknown;
  try {
    rawLines = JSON.parse(parsed.data.items);
  } catch {
    return { ok: false, message: "Your bag could not be read. Please refresh and try again." };
  }

  const lines = z.array(lineSchema).min(1).safeParse(rawLines);
  if (!lines.success) {
    return { ok: false, message: "Your bag is empty." };
  }

  // Re-price and re-check stock on the server: client values are never trusted.
  const priced: (CartLine & { productName: string })[] = [];
  for (const line of lines.data) {
    const product = await getProductById(line.productId);
    if (!product || !product.isPublished) {
      return { ok: false, message: "One of the pieces in your bag is no longer available." };
    }

    const variant = line.variantId
      ? product.variants.find((v) => v.id === line.variantId)
      : product.variants.find(
          (v) =>
            (!line.size || v.size === line.size) && (!line.color || v.color === line.color)
        );

    const available = variant ? variant.stockQuantity : product.stockQuantity;
    if (available < line.quantity) {
      return {
        ok: false,
        message: `Only ${available} left of ${product.name}${
          line.size ? ` (${line.size})` : ""
        }. Please adjust your bag.`,
      };
    }

    const unitPrice =
      variant?.salePrice ?? variant?.price ?? product.salePrice ?? product.price;

    priced.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      productName: product.name,
      image: product.images[0]?.url ?? "",
      sku: variant?.sku ?? product.sku,
      size: line.size ?? null,
      color: line.color ?? null,
      unitPrice,
      compareAtPrice: product.salePrice ? product.price : null,
      quantity: line.quantity,
      maxQuantity: available,
    });
  }

  const subtotal = priced.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const coupon = parsed.data.couponCode ? await findCoupon(parsed.data.couponCode) : null;
  const discount = applyCoupon(subtotal, coupon);
  const shipping = 0;
  const tax = 0;
  const total = subtotal - discount + shipping + tax;
  const number = orderNumber();

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      orderNumber: number,
      message:
        "Order simulated. Connect Supabase to persist real orders, inventory movements and payments.",
    };
  }

  try {
    const admin = getSupabaseAdminClient();
    const client = admin ?? (await getSupabaseServerClient());
    if (!client) throw new Error("Database unavailable");

    const user = await getCurrentUser();

    const { data: order, error: orderError } = await client
      .from("orders")
      .insert({
        order_number: number,
        user_id: user?.id ?? null,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        customer_name: parsed.data.fullName,
        status: "pending",
        payment_status: parsed.data.paymentMethod === "cod" ? "unpaid" : "unpaid",
        payment_method: parsed.data.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay",
        shipping_address: {
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          line1: parsed.data.line1,
          line2: parsed.data.line2 ?? null,
          city: parsed.data.city,
          state: parsed.data.state,
          postalCode: parsed.data.postalCode,
          country: parsed.data.country,
        },
        subtotal,
        discount,
        shipping,
        tax,
        total,
        coupon_code: discount > 0 ? coupon?.code ?? null : null,
        notes: parsed.data.notes ?? null,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const { error: itemsError } = await client.from("order_items").insert(
      priced.map((line) => ({
        order_id: order.id,
        product_id: line.productId,
        variant_id: line.variantId,
        name: line.name,
        slug: line.slug,
        image: line.image,
        sku: line.sku,
        size: line.size,
        color: line.color,
        unit_price: line.unitPrice,
        quantity: line.quantity,
        total: line.unitPrice * line.quantity,
      }))
    );

    if (itemsError) throw itemsError;

    // Stock movement needs elevated rights; skipped gracefully without a service key.
    if (admin) {
      for (const line of priced) {
        await admin.rpc("adjust_stock", {
          p_product_id: line.productId,
          p_variant_id: line.variantId,
          p_quantity_change: -line.quantity,
          p_change_type: "sale",
          p_reason: `Order ${number}`,
        });
      }
      if (discount > 0 && coupon) {
        await admin
          .from("coupons")
          .update({ used_count: coupon.usedCount + 1 })
          .eq("id", coupon.id);
      }
    }

    return {
      ok: true,
      orderNumber: number,
      message: "Order placed successfully.",
    };
  } catch (error) {
    return {
      ok: false,
      message: `We could not place your order: ${(error as Error).message}`,
    };
  }
}
