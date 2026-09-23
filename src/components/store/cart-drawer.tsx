"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/primitives";

import { lineKey, useStore } from "./store-provider";

/** Shared between the drawer and the full /cart page. */
export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { cart, updateQuantity, removeFromCart } = useStore();

  if (!cart.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" strokeWidth={1.2} />}
        title="Your bag is empty"
        description="Pieces you add will appear here. Start with the new collection or the best sellers."
        action={
          <ButtonLink href="/shop" size="sm" onClick={onNavigate}>
            Browse the shop
          </ButtonLink>
        }
        className="border-0 bg-transparent py-10"
      />
    );
  }

  return (
    <ul className="divide-y divide-line">
      {cart.map((item) => {
        const key = lineKey(item);
        return (
          <li key={key} className="flex gap-4 py-5 first:pt-0">
            <Link
              href={`/product/${item.slug}`}
              onClick={onNavigate}
              className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-ivory-deep"
            >
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
            </Link>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/product/${item.slug}`}
                  onClick={onNavigate}
                  className="line-clamp-2 text-sm leading-snug text-ink transition-colors hover:text-gold"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromCart(key)}
                  className="shrink-0 text-ash transition-colors hover:text-danger"
                  aria-label={`Remove ${item.name} from bag`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              <p className="text-xs text-ash">
                {[item.size, item.color].filter(Boolean).join(" · ") || item.sku}
              </p>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="inline-flex items-center border border-line">
                  <button
                    type="button"
                    onClick={() => updateQuantity(key, item.quantity - 1)}
                    className="grid h-8 w-8 place-items-center text-ash transition-colors hover:text-ink"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(key, item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="grid h-8 w-8 place-items-center text-ash transition-colors hover:text-ink disabled:opacity-40"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm tabular-nums text-ink">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                  {item.compareAtPrice && item.compareAtPrice > item.unitPrice ? (
                    <p className="text-xs tabular-nums text-ash line-through">
                      {formatPrice(item.compareAtPrice * item.quantity)}
                    </p>
                  ) : null}
                </div>
              </div>

              {item.quantity >= item.maxQuantity ? (
                <p className="text-[0.7rem] text-amber-700">Maximum available stock reached</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartDrawer() {
  const { panel, closePanel, cart, cartSubtotal, cartSavings } = useStore();

  return (
    <Drawer
      open={panel === "cart"}
      onClose={closePanel}
      title={
        <span className="flex items-baseline gap-2">
          Shopping bag
          <span className="text-xs uppercase tracking-[0.16em] text-ash">({cart.length})</span>
        </span>
      }
      footer={
        cart.length ? (
          <div className="space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ash">Subtotal</span>
                <span className="tabular-nums text-ink">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartSavings > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-ash">You save</span>
                  <span className="tabular-nums text-wine">−{formatPrice(cartSavings)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-ash">Shipping</span>
                <span className="text-ink">Free</span>
              </div>
            </div>
            <div className="grid gap-2.5">
              <ButtonLink href="/checkout" onClick={closePanel} className="w-full">
                Checkout
              </ButtonLink>
              <ButtonLink href="/cart" variant="outline" onClick={closePanel} className="w-full">
                View bag
              </ButtonLink>
            </div>
            <p className="text-center text-[0.7rem] text-ash">
              Taxes included. Free delivery all over India.
            </p>
          </div>
        ) : null
      }
    >
      <CartLines onNavigate={closePanel} />
    </Drawer>
  );
}
