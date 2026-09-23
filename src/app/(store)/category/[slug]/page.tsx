import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { Pagination, ProductGrid } from "@/components/store/product-grid";
import { ProductSidebar, ProductToolbar } from "@/components/store/product-filters";
import {
  getActiveCollections,
  getCategories,
  getCategoryBySlug,
  getGlobalSeo,
  getProductFacets,
  getProducts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/structured-data";
import { parseProductParams, toURLSearchParams, type SearchParamsInput } from "@/lib/search-params";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.filter((c) => c.isActive).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [category, seo] = await Promise.all([getCategoryBySlug(slug), getGlobalSeo()]);
  if (!category) return { title: "Category not found" };

  return buildMetadata({
    global: seo,
    seo: category.seo,
    title: `${category.name} for Men`,
    description:
      category.description ??
      `Shop ${category.name.toLowerCase()} from Danish Designer Studio — premium fabrics, hand finishing and free delivery across India.`,
    path: `/category/${category.slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParamsInput>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category || !category.isActive) notFound();

  const filters = parseProductParams(query, { category: category.slug });
  const [result, facets, collections] = await Promise.all([
    getProducts(filters),
    getProductFacets(),
    getActiveCollections(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            { name: category.name, url: `/category/${category.slug}` },
          ]),
          itemListSchema(result.items, category.name, `/category/${category.slug}`),
        ]}
      />

      <PageHero
        eyebrow="Category"
        title={category.name}
        description={category.description}
        image={category.image}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      <div className="container-lux py-12 lg:py-16">
        <div className="flex gap-10 xl:gap-14">
          <Suspense fallback={<div className="hidden w-60 lg:block" />}>
            <ProductSidebar
              facets={facets}
              categories={[]}
              collections={collections}
              hideCategory
            />
          </Suspense>

          <div className="min-w-0 flex-1">
            <Suspense fallback={<div className="h-16" />}>
              <ProductToolbar
                total={result.total}
                facets={facets}
                categories={[]}
                collections={collections}
                hideCategory
              />
            </Suspense>

            <div className="pt-10">
              <ProductGrid products={result.items} showUrgency />
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              baseParams={toURLSearchParams(query)}
              basePath={`/category/${category.slug}`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
