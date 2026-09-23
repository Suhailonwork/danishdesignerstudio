import Link from "next/link";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";

import type { Paginated, Product } from "@/types";
import { EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  columns = 4,
  showUrgency = false,
}: {
  products: Product[];
  columns?: 3 | 4;
  showUrgency?: boolean;
}) {
  if (!products.length) {
    return (
      <EmptyState
        icon={<PackageSearch className="h-9 w-9" strokeWidth={1.1} />}
        title="No pieces match these filters"
        description="Try widening the price range, clearing a colour, or browsing the full collection."
        action={
          <ButtonLink href="/shop" size="sm" variant="outline">
            View all products
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-12 lg:gap-x-7",
        columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3"
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
          showUrgency={showUrgency}
          sizes={
            columns === 4
              ? "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
              : "(min-width: 768px) 30vw, 45vw"
          }
        />
      ))}
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  baseParams,
  basePath,
}: {
  page: number;
  totalPages: number;
  baseParams: URLSearchParams;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams(baseParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          rel="prev"
          aria-label="Previous page"
          className="grid h-10 w-10 place-items-center border border-line text-ink transition-colors hover:border-ink"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}

      {pages.map((p, index) => {
        const previous = pages[index - 1];
        return (
          <span key={p} className="flex items-center gap-2">
            {previous && p - previous > 1 ? (
              <span className="px-1 text-ash-light">…</span>
            ) : null}
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid h-10 min-w-10 place-items-center border px-3 text-sm transition-colors",
                p === page
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-ink hover:border-ink"
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          rel="next"
          aria-label="Next page"
          className="grid h-10 w-10 place-items-center border border-line text-ink transition-colors hover:border-ink"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}

export function paginationMeta(result: Paginated<Product>) {
  const from = (result.page - 1) * result.perPage + 1;
  const to = Math.min(result.page * result.perPage, result.total);
  return { from, to };
}
