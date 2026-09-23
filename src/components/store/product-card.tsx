"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

import type { Product } from "@/types";
import { Badge, Rating } from "@/components/ui/primitives";
import { cn, discountPercent, effectivePrice, formatPrice, seededNumber } from "@/lib/utils";

import { useStore } from "./store-provider";

export function ProductCard({
  product,
  priority = false,
  showUrgency = false,
  className,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw",
}: {
  product: Product;
  priority?: boolean;
  showUrgency?: boolean;
  className?: string;
  sizes?: string;
}) {
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [hovered, setHovered] = useState(false);

  const price = effectivePrice(product.price, product.salePrice);
  const discount = discountPercent(product.price, product.salePrice);
  const outOfStock = product.stockQuantity <= 0;
  const primary = product.images[0];
  const secondary = product.images[1] ?? primary;
  const wishlisted = hydrated && isWishlisted(product.id);
  const soldRecently = seededNumber(product.slug, 2, 14);

  function quickAdd() {
    if (outOfStock) return;
    const variant =
      product.variants.find((v) => v.stockQuantity > 0 && v.isActive) ?? product.variants[0];
    addToCart({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      image: primary?.url ?? "/media/banners/og-default.v3.jpg",
      sku: variant?.sku ?? product.sku,
      size: variant?.size ?? product.sizes[0] ?? null,
      color: variant?.color ?? product.colors[0] ?? null,
      unitPrice: price,
      compareAtPrice: product.salePrice ? product.price : null,
      quantity: 1,
      maxQuantity: Math.max(1, variant?.stockQuantity ?? product.stockQuantity),
    });
  }

  return (
    <article
      className={cn("group relative flex flex-col", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-ivory-deep">
        <Link href={`/product/${product.slug}`} className="block" tabIndex={-1} aria-hidden="true">
          <div className="relative aspect-3/4 w-full">
            <Image
              src={primary?.url ?? "/media/banners/og-default.v3.jpg"}
              alt={primary?.alt ?? product.name}
              fill
              sizes={sizes}
              priority={priority}
              className={cn(
                "object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                hovered && secondary !== primary ? "opacity-0 scale-105" : "opacity-100 scale-100",
                outOfStock && "grayscale-[0.4]"
              )}
            />
            {secondary !== primary ? (
              <Image
                src={secondary.url}
                alt=""
                aria-hidden="true"
                fill
                sizes={sizes}
                className={cn(
                  "object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              />
            ) : null}
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 ? <Badge tone="default">Up to {discount}%</Badge> : null}
          {product.isNewArrival && !outOfStock ? <Badge tone="dark">New</Badge> : null}
          {outOfStock ? <Badge tone="muted">Sold out</Badge> : null}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: primary?.url ?? "/media/banners/og-default.v3.jpg",
              price: product.price,
              salePrice: product.salePrice ?? null,
            })
          }
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border bg-white/92 backdrop-blur-sm transition-all duration-300",
            wishlisted
              ? "border-wine text-wine"
              : "border-line text-ink opacity-0 focus-visible:opacity-100 group-hover:opacity-100"
          )}
        >
          <Heart className={cn("h-4 w-4", wishlisted && "fill-wine")} strokeWidth={1.5} />
        </button>

        {/* Quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={quickAdd}
            disabled={outOfStock}
            className="flex w-full items-center justify-center gap-2 bg-ink/95 py-3 text-[0.68rem] uppercase tracking-[0.16em] text-ivory backdrop-blur-sm transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:bg-ash/80"
          >
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.6} />
            {outOfStock ? "Out of stock" : "Add to bag"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ash">
          {product.categoryName}
        </p>
        <h3 className="text-[0.95rem] leading-snug">
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 text-ink transition-colors duration-300 hover:text-gold"
          >
            {product.name}
          </Link>
        </h3>

        {product.ratingCount > 0 ? (
          <Rating value={product.ratingAverage} count={product.ratingCount} />
        ) : null}

        {showUrgency && !outOfStock ? (
          <p className="text-[0.7rem] text-wine">
            {soldRecently} sold in the last 12 hours
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1.5">
          <span className="text-[0.95rem] tabular-nums text-ink">{formatPrice(price)}</span>
          {discount > 0 ? (
            <span className="text-xs tabular-nums text-ash line-through">
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
