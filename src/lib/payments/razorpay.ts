import "server-only";

import crypto from "node:crypto";

/**
 * Razorpay integration seam.
 *
 * Nothing here is required for the store to work — checkout falls back to Cash
 * on Delivery / manual confirmation when keys are absent. Add
 * RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to switch it on; no other file needs to
 * change. Card and UPI credentials never touch this application.
 */

const KEY_ID = process.env.RAZORPAY_KEY_ID?.trim() ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim() ?? "";

export const isRazorpayConfigured = KEY_ID.length > 8 && KEY_SECRET.length > 8;

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

/** Creates a Razorpay order for the given rupee amount. */
export async function createRazorpayOrder(
  amountInRupees: number,
  receipt: string,
  notes: Record<string, string> = {}
): Promise<RazorpayOrder> {
  if (!isRazorpayConfigured) {
    throw new Error("Razorpay is not configured on this deployment.");
  }

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify({
      // Razorpay works in the smallest currency unit.
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt,
      notes,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay order failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  return (await response.json()) as RazorpayOrder;
}

/**
 * Verifies the signature Razorpay returns to the browser after payment.
 * Always verify server-side before marking an order paid.
 */
export function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!isRazorpayConfigured) return false;

  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(input.signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Verifies a Razorpay webhook body against the shared webhook secret. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
