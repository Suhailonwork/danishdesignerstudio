import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHero } from "@/components/store/page-hero";
import { Pagination, ProductGrid } from "@/components/store/product-grid";
import { ProductSidebar, ProductToolbar } from "@/components/store/product-filters";
import { EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import {
  getActiveCategories,
  getActiveCollections,
  getGlobalSeo,
  getProductFacets,
  getProducts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { parseProductParams, toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}): Promise<Metadata> {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const seo = await getGlobalSeo();

  return buildMetadata({
    global: seo,
    // Search result pages should never be indexed — thin, infinite surface.
    seo: { noIndex: true, noFollow: false },
    title: query ? `Search results for “${query}”` : "Search",
    description: `Search the Danish Designer Studio catalogue${query ? ` for ${query}` : ""}.`,
    path: "/search",
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const filters = parseProductParams(params);

  const [result, facets, categories, collections] = await Promise.all([
    query ? getProducts(filters) : Promise.resolve(null),
    getProductFacets(),
    getActiveCategories(),
    getActiveCollections(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : "Search the collection"}
        description={
          result
            ? `${result.total} ${result.total === 1 ? "piece" : "pieces"} match your search.`
            : "Search by silhouette, fabric, colour or occasion."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        size="sm"
      />

      <div className="container-lux py-12 lg:py-16">
        {!query ? (
          <EmptyState
            title="What are you looking for?"
            description="Try searching for a sherwani, a bandhgala, or a colour such as ivory."
            action={<ButtonLink href="/shop">Browse everything</ButtonLink>}
          />
        ) : (
          <div className="flex gap-10 xl:gap-14">
            <Suspense fallback={<div className="hidden w-60 lg:block" />}>
              <ProductSidebar facets={facets} categories={categories} collections={collections} />
            </Suspense>

            <div className="min-w-0 flex-1">
              <Suspense fallback={<div className="h-16" />}>
                <ProductToolbar
                  total={result?.total ?? 0}
                  facets={facets}
                  categories={categories}
                  collections={collections}
                />
              </Suspense>

              <div className="pt-10">
                <ProductGrid products={result?.items ?? []} />
              </div>

              {result ? (
                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  baseParams={toURLSearchParams(params)}
                  basePath="/search"
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
