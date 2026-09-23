import type { Metadata } from "next";
import { Suspense } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { ProductGrid, Pagination } from "@/components/store/product-grid";
import { ProductSidebar, ProductToolbar } from "@/components/store/product-filters";
import { ProductCardSkeleton } from "@/components/ui/primitives";
import {
  getActiveCategories,
  getActiveCollections,
  getGlobalSeo,
  getProductFacets,
  getProducts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";
import { parseProductParams, toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    title: "Shop All Indian Menswear",
    description:
      "Browse the full Danish Designer Studio catalogue — sherwanis, bandhgala suits, jodhpuri sets, kurta pajamas and nehru jackets, with free delivery across India.",
    path: "/shop",
  });
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const params = await searchParams;
  const filters = parseProductParams(params);

  const [result, facets, categories, collections] = await Promise.all([
    getProducts(filters),
    getProductFacets(),
    getActiveCategories(),
    getActiveCollections(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
          ]),
          itemListSchema(result.items, "Danish Designer Studio — all products", "/shop"),
        ]}
      />

      <PageHero
        eyebrow="The catalogue"
        title="Shop all"
        description="Every piece in the atelier, from everyday linen kurtas to fully hand-worked groom sherwanis."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        size="sm"
      />

      <div className="container-lux py-12 lg:py-16">
        <div className="flex gap-10 xl:gap-14">
          <Suspense fallback={<div className="hidden w-60 lg:block" />}>
            <ProductSidebar facets={facets} categories={categories} collections={collections} />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<div className="h-16" />}>
              <ProductToolbar
                total={result.total}
                facets={facets}
                categories={categories}
                collections={collections}
              />
            </Suspense>

            <div className="pt-10">
              <Suspense
                fallback={
                  <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <ProductGrid products={result.items} showUrgency />
              </Suspense>
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              baseParams={toURLSearchParams(params)}
              basePath="/shop"
            />
          </div>
        </div>
      </div>
    </>
  );
}
