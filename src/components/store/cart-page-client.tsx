"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/primitives";
import { formatPrice } from "@/lib/utils";

import { CartLines } from "./cart-drawer";
import { useStore } from "./store-provider";

export function CartPageClient() {
  const { cart, cartSubtotal, cartSavings, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="aspect-3/4 w-24" />
              <div className="flex-1 space-y-3 py-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
      <div>
        <CartLines />
        {cart.length ? (
          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 text-sm text-ash underline underline-offset-4 hover:text-ink"
          >
            Continue shopping
          </Link>
        ) : null}
      </div>

      {cart.length ? (
        <aside className="h-max border border-line bg-white p-7" aria-label="Order summary">
          <h2 className="font-display text-xl">Order summary</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ash">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(cartSubtotal)}</dd>
            </div>
            {cartSavings > 0 ? (
              <div className="flex items-center justify-between">
                <dt className="text-ash">Discount applied</dt>
                <dd className="tabular-nums text-wine">−{formatPrice(cartSavings)}</dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <dt className="text-ash">Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4 text-base">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(cartSubtotal)}</dd>
            </div>
          </dl>

          <ButtonLink href="/checkout" className="mt-7 w-full">
            Proceed to checkout
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>

          <ul className="mt-6 space-y-2.5 text-xs text-ash">
            <li className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5" strokeWidth={1.5} />
              Free delivery across India
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              Secure 256-bit encrypted checkout
            </li>
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
