"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import type { Order } from "@/types";
import { cancelOrder, updateOrder } from "@/actions/admin/orders";
import type { AdminResult } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Card, ConfirmAction, FormFeedback, SubmitButton } from "@/components/admin/ui";
import { formatDate, formatPrice, orderStatusTone, titleCase } from "@/lib/utils";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;

const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded", "partially_refunded"] as const;

export function OrderDetail({ order }: { order: Order }) {
  const [state, formAction] = useActionState<AdminResult | null, FormData>(updateOrder, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <Card
          title={`Items (${order.items.length})`}
          actions={
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-ash hover:text-ink"
            >
              <Printer className="h-3.5 w-3.5" />
              Print invoice
            </button>
          }
        >
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                {item.image ? (
                  <span className="relative aspect-3/4 w-14 shrink-0 overflow-hidden bg-ivory-deep">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} target="_blank" className="text-sm hover:text-gold">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-ash">
                    {item.sku}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="tabular-nums">{formatPrice(item.unitPrice)}</p>
                  <p className="mt-1 text-xs text-ash">× {item.quantity}</p>
                </div>
                <p className="w-24 shrink-0 text-right text-sm tabular-nums">
                  {formatPrice(item.total)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ash">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-ash">
                  Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                </dt>
                <dd className="tabular-nums text-wine">−{formatPrice(order.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-ash">Shipping</dt>
              <dd className="tabular-nums">
                {order.shipping ? formatPrice(order.shipping) : "Free"}
              </dd>
            </div>
            {order.tax > 0 ? (
              <div className="flex justify-between">
                <dt className="text-ash">Tax</dt>
                <dd className="tabular-nums">{formatPrice(order.tax)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Customer">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2">Contact</p>
              <p className="text-sm">{order.customerName}</p>
              <p className="mt-1 text-sm text-ash">{order.email}</p>
              <p className="text-sm text-ash">{order.phone}</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Shipping address</p>
              <address className="text-sm not-italic leading-relaxed text-ink-soft">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 ? (
                  <>
                    <br />
                    {order.shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </address>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Fulfilment">
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="id" value={order.id} />

            <Select name="status" label="Order status" defaultValue={order.status}>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>

            <Select name="paymentStatus" label="Payment status" defaultValue={order.paymentStatus}>
              {PAYMENT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {titleCase(value)}
                </option>
              ))}
            </Select>

            <Input name="courier" label="Courier" defaultValue={order.courier ?? ""} />
            <Input
              name="trackingNumber"
              label="Tracking number"
              defaultValue={order.trackingNumber ?? ""}
              hint="Shared with the customer in their account."
            />
            <Textarea
              name="notes"
              label="Internal notes"
              rows={3}
              defaultValue={order.notes ?? ""}
            />

            <FormFeedback state={state} />
            <SubmitButton>Update order</SubmitButton>
          </form>
        </Card>

        <Card title="Summary">
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ash">Placed</dt>
              <dd>{formatDate(order.createdAt, { hour: "2-digit", minute: "2-digit" })}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ash">Payment method</dt>
              <dd>{order.paymentMethod}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ash">Status</dt>
              <dd>
                <span
                  className={`inline-flex border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em] ${orderStatusTone(order.status)}`}
                >
                  {titleCase(order.status)}
                </span>
              </dd>
            </div>
          </dl>

          {order.status !== "cancelled" ? (
            <div className="mt-6 space-y-3 border-t border-line pt-5">
              <p className="text-xs text-ash">
                Cancelling returns every item to stock and records the movement in the inventory
                history.
              </p>
              <ConfirmAction
                label="Cancel order and restock"
                confirmLabel="Yes, cancel it"
                onConfirm={() => cancelOrder(order.id, true)}
              />
            </div>
          ) : null}
        </Card>

        <Button variant="outline" className="w-full" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / download invoice
        </Button>
      </div>
    </div>
  );
}
