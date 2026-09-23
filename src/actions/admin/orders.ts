"use server";

import type { OrderStatus, PaymentStatus } from "@/types";

import { getWritableClient, revalidateStorefront, type AdminResult } from "./core";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "unpaid",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

export async function updateOrder(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing order reference." };

  const status = String(formData.get("status") ?? "") as OrderStatus;
  const paymentStatus = String(formData.get("paymentStatus") ?? "") as PaymentStatus;

  if (!ORDER_STATUSES.includes(status) || !PAYMENT_STATUSES.includes(paymentStatus)) {
    return { ok: false, message: "Unknown status value." };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client
    .from("orders")
    .update({
      status,
      payment_status: paymentStatus,
      tracking_number: (formData.get("trackingNumber") as string) || null,
      courier: (formData.get("courier") as string) || null,
      notes: (formData.get("notes") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/orders", `/admin/orders/${id}`, "/account/orders"]);
  return { ok: true, message: "Order updated." };
}

/**
 * Cancelling returns the reserved stock to inventory so the catalogue stays
 * accurate without a manual adjustment.
 */
export async function cancelOrder(id: string, restock: boolean): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { data: order, error: readError } = await access.client
    .from("orders")
    .select("order_number, status, order_items ( product_id, variant_id, quantity )")
    .eq("id", id)
    .single();

  if (readError || !order) return { ok: false, message: readError?.message ?? "Order not found." };
  if (order.status === "cancelled") return { ok: false, message: "This order is already cancelled." };

  const { error } = await access.client
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  if (restock) {
    const items = (order.order_items ?? []) as {
      product_id: string;
      variant_id: string | null;
      quantity: number;
    }[];

    for (const item of items) {
      await access.client.rpc("adjust_stock", {
        p_product_id: item.product_id,
        p_variant_id: item.variant_id,
        p_quantity_change: item.quantity,
        p_change_type: "return",
        p_reason: `Cancelled order ${order.order_number}`,
      });
    }
  }

  await revalidateStorefront(["/admin/orders", "/admin/inventory"]);
  return { ok: true, message: restock ? "Order cancelled and stock returned." : "Order cancelled." };
}
