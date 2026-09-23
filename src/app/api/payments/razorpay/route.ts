import { NextResponse } from "next/server";
import { z } from "zod";

import {
  createRazorpayOrder,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from "@/lib/payments/razorpay";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const createSchema = z.object({
  action: z.literal("create"),
  orderNumber: z.string().min(3).max(40),
});

const verifySchema = z.object({
  action: z.literal("verify"),
  orderNumber: z.string().min(3).max(40),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(3),
});

export async function POST(request: Request) {
  if (!isRazorpayConfigured) {
    return NextResponse.json(
      { error: "Razorpay is not configured on this deployment." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  // --- Create a payment order -------------------------------------------------
  const create = createSchema.safeParse(body);
  if (create.success) {
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, email")
      .eq("order_number", create.data.orderNumber)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    try {
      const rzp = await createRazorpayOrder(Number(order.total), order.order_number, {
        orderNumber: order.order_number,
      });
      return NextResponse.json({
        orderId: rzp.id,
        amount: rzp.amount,
        currency: rzp.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
      });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 502 });
    }
  }

  // --- Verify a completed payment ---------------------------------------------
  const verify = verifySchema.safeParse(body);
  if (verify.success) {
    const valid = verifyRazorpaySignature({
      orderId: verify.data.razorpayOrderId,
      paymentId: verify.data.razorpayPaymentId,
      signature: verify.data.razorpaySignature,
    });

    if (!valid) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 400 });
    }

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payment_reference: verify.data.razorpayPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", verify.data.orderNumber);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
