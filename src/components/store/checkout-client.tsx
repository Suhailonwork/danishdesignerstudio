"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, Lock, ShoppingBag, Tag, Wallet } from "lucide-react";

import { placeOrder, validateCoupon, type CheckoutResult } from "@/actions/orders";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { cn, formatPrice } from "@/lib/utils";

import { useStore } from "./store-provider";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Other",
];

export function CheckoutClient({ defaultEmail, defaultName }: { defaultEmail?: string; defaultName?: string }) {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart, hydrated } = useStore();
  const [state, formAction, pending] = useActionState<CheckoutResult | null, FormData>(
    placeOrder,
    null
  );

  const [coupon, setCoupon] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [couponPending, setCouponPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  useEffect(() => {
    if (state?.ok && state.orderNumber) {
      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(state.orderNumber)}`);
    }
  }, [state, clearCart, router]);

  async function onApplyCoupon() {
    if (!coupon.trim()) return;
    setCouponPending(true);
    const result = await validateCoupon(coupon, cartSubtotal);
    setCouponPending(false);
    setCouponMessage({ ok: result.ok, text: result.message });
    if (result.ok) {
      setDiscount(result.discount);
      setAppliedCode(result.code);
    } else {
      setDiscount(0);
      setAppliedCode(null);
    }
  }

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-9 w-9" strokeWidth={1.1} />}
        title="There is nothing to check out"
        description="Add a piece to your bag and it will appear here."
        action={<ButtonLink href="/shop">Browse the collection</ButtonLink>}
      />
    );
  }

  const total = Math.max(0, cartSubtotal - discount);

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          cart.map((line) => ({
            productId: line.productId,
            variantId: line.variantId ?? null,
            size: line.size ?? null,
            color: line.color ?? null,
            quantity: line.quantity,
          }))
        )}
      />
      <input type="hidden" name="couponCode" value={appliedCode ?? ""} />
      <input type="hidden" name="paymentMethod" value={paymentMethod} />

      <div className="space-y-10">
        <section aria-labelledby="contact-heading" className="space-y-5">
          <h2 id="contact-heading" className="font-display text-2xl">
            1. Contact details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="email"
              type="email"
              label="Email"
              required
              defaultValue={defaultEmail}
              autoComplete="email"
              error={state?.fieldErrors?.email}
            />
            <Input
              name="phone"
              type="tel"
              label="Phone"
              required
              autoComplete="tel"
              placeholder="+91 90000 00000"
              error={state?.fieldErrors?.phone}
            />
          </div>
        </section>

        <section aria-labelledby="shipping-heading" className="space-y-5">
          <h2 id="shipping-heading" className="font-display text-2xl">
            2. Shipping address
          </h2>
          <Input
            name="fullName"
            label="Full name"
            required
            defaultValue={defaultName}
            autoComplete="name"
            error={state?.fieldErrors?.fullName}
          />
          <Input
            name="line1"
            label="Address line 1"
            required
            autoComplete="address-line1"
            error={state?.fieldErrors?.line1}
          />
          <Input
            name="line2"
            label="Address line 2 (optional)"
            autoComplete="address-line2"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              name="city"
              label="City"
              required
              autoComplete="address-level2"
              error={state?.fieldErrors?.city}
            />
            <Select name="state" label="State" required defaultValue="Uttar Pradesh">
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
            <Input
              name="postalCode"
              label="PIN code"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              error={state?.fieldErrors?.postalCode}
            />
          </div>
          <Input name="country" label="Country" defaultValue="India" autoComplete="country-name" />
          <Textarea
            name="notes"
            label="Order notes (optional)"
            rows={3}
            placeholder="Delivery instructions, event date, or anything our team should know."
          />
        </section>

        <section aria-labelledby="payment-heading" className="space-y-5">
          <h2 id="payment-heading" className="font-display text-2xl">
            3. Payment
          </h2>

          <div className="grid gap-3">
            {[
              {
                value: "razorpay" as const,
                icon: CreditCard,
                title: "Razorpay",
                text: "UPI, cards, net banking and wallets. Secure 256-bit encryption.",
              },
              {
                value: "cod" as const,
                icon: Wallet,
                title: "Cash on delivery",
                text: "Pay the courier when your parcel arrives. Available across India.",
              },
            ].map((option) => {
              const Icon = option.icon;
              const active = paymentMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPaymentMethod(option.value)}
                  aria-pressed={active}
                  className={cn(
                    "flex items-start gap-4 border p-5 text-left transition-colors",
                    active ? "border-ink bg-white" : "border-line hover:border-line-strong"
                  )}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.4} />
                  <span className="flex-1">
                    <span className="block text-sm text-ink">{option.title}</span>
                    <span className="mt-0.5 block text-xs text-ash">{option.text}</span>
                  </span>
                  <span
                    className={cn(
                      "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border",
                      active ? "border-ink" : "border-line-strong"
                    )}
                  >
                    {active ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="flex items-center gap-2 text-xs text-ash">
            <Lock className="h-3.5 w-3.5" />
            Card details are handled by the payment gateway — Danish Designer Studio never stores them.
          </p>
        </section>
      </div>

      {/* Summary */}
      <aside className="h-max lg:sticky lg:top-28" aria-label="Order summary">
        <div className="border border-line bg-white p-6 lg:p-7">
          <h2 className="font-display text-xl">Order summary</h2>

          <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
            {cart.map((line) => (
              <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-3">
                <span className="relative aspect-3/4 w-14 shrink-0 overflow-hidden bg-ivory-deep">
                  <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.6rem] text-ivory">
                    {line.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    href={`/product/${line.slug}`}
                    className="line-clamp-2 text-xs leading-snug text-ink hover:text-gold"
                  >
                    {line.name}
                  </Link>
                  <span className="mt-0.5 block text-[0.7rem] text-ash">
                    {[line.size, line.color].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span className="shrink-0 text-xs tabular-nums">
                  {formatPrice(line.unitPrice * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-3 border-t border-line pt-5">
            <label htmlFor="coupon" className="text-[0.68rem] uppercase tracking-[0.16em] text-ash">
              Discount code
            </label>
            <div className="flex">
              <input
                id="coupon"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                placeholder="WELCOME20"
                className="min-w-0 flex-1 border border-r-0 border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={couponPending}
                className="inline-flex shrink-0 items-center gap-1.5 border border-ink bg-ink px-4 text-[0.68rem] uppercase tracking-[0.14em] text-ivory disabled:opacity-60"
              >
                {couponPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Tag className="h-3.5 w-3.5" />
                )}
                Apply
              </button>
            </div>
            {couponMessage ? (
              <p
                className={cn(
                  "text-xs",
                  couponMessage.ok ? "text-emerald-700" : "text-danger"
                )}
                role="status"
              >
                {couponMessage.text}
              </p>
            ) : null}
          </div>

          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ash">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(cartSubtotal)}</dd>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-ash">Discount ({appliedCode})</dt>
                <dd className="tabular-nums text-wine">−{formatPrice(discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-ash">Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-base">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>

          {state && !state.ok ? (
            <p
              className="mt-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
              role="alert"
            >
              {state.message}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Place order
          </Button>

          <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-ash">
            By placing this order you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/return-policy" className="underline underline-offset-2">
              return policy
            </Link>
            .
          </p>
        </div>
      </aside>
    </form>
  );
}
