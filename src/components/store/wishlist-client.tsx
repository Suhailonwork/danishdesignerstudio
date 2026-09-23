"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/primitives";
import { discountPercent, effectivePrice, formatPrice } from "@/lib/utils";

import { useStore } from "./store-provider";

export function WishlistClient() {
  const { wishlist, removeFromWishlist, addToCart, hydrated } = useStore();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-3/4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <EmptyState
        icon={<Heart className="h-9 w-9" strokeWidth={1.1} />}
        title="Your wishlist is empty"
        description="Tap the heart on any piece to save it here for later."
        action={<ButtonLink href="/shop">Browse the collection</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4 lg:gap-x-7">
      {wishlist.map((item) => {
        const price = effectivePrice(item.price, item.salePrice);
        const discount = discountPercent(item.price, item.salePrice);

        return (
          <article key={item.productId} className="group flex flex-col">
            <div className="relative overflow-hidden bg-ivory-deep">
              <Link href={`/product/${item.slug}`}>
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
              <button
                type="button"
                onClick={() => removeFromWishlist(item.productId)}
                aria-label={`Remove ${item.name} from wishlist`}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-white/92 text-ink transition-colors hover:border-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-4 line-clamp-2 text-[0.95rem] leading-snug">
              <Link href={`/product/${item.slug}`} className="hover:text-gold">
                {item.name}
              </Link>
            </h2>

            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="text-sm tabular-nums">{formatPrice(price)}</span>
              {discount > 0 ? (
                <span className="text-xs tabular-nums text-ash line-through">
                  {formatPrice(item.price)}
                </span>
              ) : null}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() =>
                addToCart({
                  productId: item.productId,
                  variantId: null,
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                  sku: item.productId,
                  size: null,
                  color: null,
                  unitPrice: price,
                  compareAtPrice: item.salePrice ? item.price : null,
                  quantity: 1,
                  maxQuantity: 10,
                })
              }
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to bag
            </Button>
          </article>
        );
      })}
    </div>
  );
}
