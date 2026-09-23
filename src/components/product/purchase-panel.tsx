"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BellRing, Check, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge, Rating } from "@/components/ui/primitives";
import { useStore } from "@/components/store/store-provider";
import { cn, discountPercent, effectivePrice, formatPrice } from "@/lib/utils";

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, hydrated } = useStore();

  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    product.variants.forEach((variant) => {
      if (variant.color && !seen.has(variant.color)) {
        seen.set(variant.color, variant.colorHex ?? "#999999");
      }
    });
    product.colors.forEach((color) => {
      if (!seen.has(color)) seen.set(color, "#999999");
    });
    return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
  }, [product]);

  const [color, setColor] = useState(colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [notifyRequested, setNotifyRequested] = useState(false);

  const variant = useMemo(() => {
    if (!product.variants.length) return null;
    return (
      product.variants.find(
        (v) => (!color || v.color === color) && (!size || v.size === size) && v.isActive
      ) ?? null
    );
  }, [product.variants, color, size]);

  const available = variant ? variant.stockQuantity : product.stockQuantity;
  const outOfStock = available <= 0;
  const lowStock = !outOfStock && available <= product.lowStockThreshold;

  const unitPrice = effectivePrice(
    variant?.price ?? product.price,
    variant?.salePrice ?? product.salePrice
  );
  const discount = discountPercent(product.price, product.salePrice);
  const wishlisted = hydrated && isWishlisted(product.id);

  function sizeAvailability(candidate: string) {
    if (!product.variants.length) return product.stockQuantity;
    return product.variants
      .filter((v) => v.size === candidate && (!color || v.color === color))
      .reduce((sum, v) => sum + v.stockQuantity, 0);
  }

  function buildLine() {
    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "/media/banners/og-default.v3.jpg",
      sku: variant?.sku ?? product.sku,
      size,
      color,
      unitPrice,
      compareAtPrice: product.salePrice ? product.price : null,
      quantity,
      maxQuantity: Math.max(1, available),
    };
  }

  function handleAdd(open = true) {
    if (outOfStock) return;
    if (product.sizes.length && !size) {
      toast.error("Choose a size first");
      return;
    }
    addToCart(buildLine(), { open });
  }

  function handleBuyNow() {
    if (outOfStock) return;
    if (product.sizes.length && !size) {
      toast.error("Choose a size first");
      return;
    }
    addToCart(buildLine(), { open: false, silent: true });
    router.push("/checkout");
  }

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{product.categoryName}</p>
          {product.isNewArrival ? <Badge tone="dark">New arrival</Badge> : null}
          {product.isBestSeller ? <Badge tone="muted">Best seller</Badge> : null}
        </div>

        <h1 className="text-3xl leading-tight lg:text-[2.6rem]">{product.name}</h1>

        {product.ratingCount > 0 ? (
          <Rating value={product.ratingAverage} count={product.ratingCount} showValue />
        ) : null}

        {product.shortDescription ? (
          <p className="max-w-xl text-[0.95rem] leading-relaxed text-ash">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline gap-3 border-y border-line py-5">
        <span className="text-3xl tabular-nums">{formatPrice(unitPrice)}</span>
        {discount > 0 ? (
          <>
            <span className="text-lg tabular-nums text-ash line-through">
              {formatPrice(product.price)}
            </span>
            <Badge tone="sale">Save {discount}%</Badge>
          </>
        ) : null}
        <span className="w-full text-xs text-ash">Inclusive of all taxes · Free delivery</span>
      </div>

      {/* Colour */}
      {colors.length > 1 ? (
        <fieldset className="space-y-3">
          <legend className="text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            Colour: <span className="text-ink">{color}</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {colors.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => setColor(option.name)}
                aria-pressed={color === option.name}
                aria-label={option.name}
                title={option.name}
                className={cn(
                  "h-9 w-9 rounded-full border transition-all duration-300",
                  color === option.name
                    ? "border-ink ring-1 ring-ink ring-offset-2"
                    : "border-line-strong hover:border-ink"
                )}
                style={{ backgroundColor: option.hex }}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* Size */}
      {product.sizes.length ? (
        <fieldset className="space-y-3">
          <legend className="flex w-full items-center justify-between text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            <span>
              Size: <span className="text-ink">{size ?? "Select"}</span>
            </span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {product.sizes.map((option) => {
              const stock = sizeAvailability(option);
              const disabled = stock <= 0;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSize(option);
                    setQuantity(1);
                  }}
                  disabled={disabled}
                  aria-pressed={size === option}
                  className={cn(
                    "relative min-w-13 border px-4 py-3 text-sm transition-colors duration-300",
                    size === option
                      ? "border-ink bg-ink text-ivory"
                      : "border-line text-ink hover:border-ink",
                    disabled &&
                      "cursor-not-allowed border-line text-ash-light line-through hover:border-line"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-ash">
            Not sure of your size? Our stylists can check your measurements on WhatsApp.
          </p>
        </fieldset>
      ) : null}

      {/* Stock line */}
      <div className="flex items-center gap-2 text-sm">
        {outOfStock ? (
          <span className="text-danger">Out of stock in this combination</span>
        ) : lowStock ? (
          <span className="text-amber-700">Only {available} left — selling fast</span>
        ) : (
          <span className="flex items-center gap-1.5 text-emerald-800">
            <Check className="h-4 w-4" /> In stock, ready to dispatch
          </span>
        )}
      </div>

      {/* Quantity + actions */}
      {!outOfStock ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-stretch gap-3">
            <div className="inline-flex items-center border border-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-12 w-11 place-items-center text-ash transition-colors hover:text-ink"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(available, q + 1))}
                disabled={quantity >= available}
                className="grid h-12 w-11 place-items-center text-ash transition-colors hover:text-ink disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button size="lg" className="h-12 flex-1" onClick={() => handleAdd()}>
              <ShoppingBag className="h-4 w-4" />
              Add to bag
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="h-12 flex-1" onClick={handleBuyNow}>
              Buy it now
            </Button>
            <Button
              variant="soft"
              size="lg"
              className={cn("h-12 w-12 px-0", wishlisted && "border-wine text-wine")}
              aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={wishlisted}
              onClick={() =>
                toggleWishlist({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  image: product.images[0]?.url ?? "/media/banners/og-default.v3.jpg",
                  price: product.price,
                  salePrice: product.salePrice ?? null,
                })
              }
            >
              <Heart className={cn("h-4 w-4", wishlisted && "fill-wine")} strokeWidth={1.6} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifyRequested ? (
            <p className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-900">
              <Check className="h-4 w-4" />
              We will email you the moment this is back in stock.
            </p>
          ) : (
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full"
              onClick={() => {
                setNotifyRequested(true);
                toast.success("You're on the waitlist", {
                  description: "We'll be in touch as soon as it returns.",
                });
              }}
            >
              <BellRing className="h-4 w-4" />
              Notify me when available
            </Button>
          )}
          <Button
            variant="soft"
            size="lg"
            className="h-12 w-full"
            onClick={() =>
              toggleWishlist({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? "/media/banners/og-default.v3.jpg",
                price: product.price,
                salePrice: product.salePrice ?? null,
              })
            }
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-wine")} strokeWidth={1.6} />
            {wishlisted ? "Saved to wishlist" : "Save to wishlist"}
          </Button>
        </div>
      )}

      <ul className="space-y-2.5 border-t border-line pt-6 text-sm text-ash">
        <li className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 shrink-0" strokeWidth={1.4} />
          Free delivery across India · dispatched in 2 working days
        </li>
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0" strokeWidth={1.4} />
          Seven-day returns and one free size exchange
        </li>
        <li className="text-xs">
          SKU: <span className="text-ink">{variant?.sku ?? product.sku}</span>
        </li>
      </ul>
    </div>
  );
}
