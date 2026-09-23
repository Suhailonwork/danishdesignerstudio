import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { Pagination, ProductGrid } from "@/components/store/product-grid";
import { ProductSidebar, ProductToolbar } from "@/components/store/product-filters";
import {
  getActiveCategories,
  getCollectionBySlug,
  getCollections,
  getGlobalSeo,
  getProductFacets,
  getProducts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
} from "@/lib/seo/structured-data";
import { parseProductParams, toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";

export const revalidate = 300;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.filter((c) => c.isActive).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [collection, seo] = await Promise.all([getCollectionBySlug(slug), getGlobalSeo()]);
  if (!collection) return { title: "Collection not found" };

  return buildMetadata({
    global: seo,
    seo: collection.seo,
    title: collection.name,
    description:
      collection.description ??
      `Shop the ${collection.name} from Danish Designer Studio — curated Indian menswear with free delivery across India.`,
    path: `/collection/${collection.slug}`,
    image: collection.bannerImage,
  });
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParamsInput>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const collection = await getCollectionBySlug(slug);
  if (!collection || !collection.isActive) notFound();

  const filters = parseProductParams(query, { collection: collection.slug });
  const [result, facets, categories] = await Promise.all([
    getProducts(filters),
    getProductFacets(),
    getActiveCategories(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Collections", url: "/collections" },
            { name: collection.name, url: `/collection/${collection.slug}` },
          ]),
          collectionPageSchema(collection, `/collection/${collection.slug}`),
          itemListSchema(result.items, collection.name, `/collection/${collection.slug}`),
        ]}
      />

      <PageHero
        eyebrow="Collection"
        title={collection.name}
        description={collection.description}
        image={collection.bannerImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
          { label: collection.name },
        ]}
      />

      <div className="container-lux py-12 lg:py-16">
        <div className="flex gap-10 xl:gap-14">
          <Suspense fallback={<div className="hidden w-60 lg:block" />}>
            <ProductSidebar
              facets={facets}
              categories={categories}
              collections={[]}
              hideCollection
            />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<div className="h-16" />}>
              <ProductToolbar
                total={result.total}
                facets={facets}
                categories={categories}
                collections={[]}
                hideCollection
              />
            </Suspense>

            <div className="pt-10">
              <ProductGrid products={result.items} showUrgency />
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              baseParams={toURLSearchParams(query)}
              basePath={`/collection/${collection.slug}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
