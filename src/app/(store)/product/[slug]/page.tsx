import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { DetailsTabs } from "@/components/product/details-tabs";
import { ProductGallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductReviews } from "@/components/product/reviews";
import { ProductCard } from "@/components/store/product-card";
import { Breadcrumbs } from "@/components/ui/primitives";
import {
  getAllProducts,
  getApprovedReviews,
  getGlobalSeo,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, productSchema } from "@/lib/seo/structured-data";
import { discountPercent } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.filter((p) => p.isPublished).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, seo] = await Promise.all([getProductBySlug(slug), getGlobalSeo()]);
  if (!product) return { title: "Product not found" };

  return buildMetadata({
    global: seo,
    seo: product.seo,
    title: product.name,
    description:
      product.shortDescription ?? product.description ?? `Shop ${product.name} at Danish Designer Studio.`,
    path: `/product/${product.slug}`,
    image: product.images[0]?.url,
    type: "product",
    keywords: product.tags,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.isPublished) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getApprovedReviews(product.id),
  ]);

  const discount = discountPercent(product.price, product.salePrice);

  return (
    <>
      <JsonLd
        data={[
          productSchema(product, reviews),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Shop", url: "/shop" },
            ...(product.categorySlug && product.categoryName
              ? [{ name: product.categoryName, url: `/category/${product.categorySlug}` }]
              : []),
            { name: product.name, url: `/product/${product.slug}` },
          ]),
        ]}
      />

      <div className="container-lux py-6 lg:py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(product.categorySlug && product.categoryName
              ? [{ label: product.categoryName, href: `/category/${product.categorySlug}` }]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-lux pb-16 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 xl:gap-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            badge={discount > 0 ? `Save ${discount}%` : product.isNewArrival ? "New" : null}
            videoUrl={product.videoUrl}
          />
          <PurchasePanel product={product} />
        </div>

        <div className="mt-20 space-y-20">
          <DetailsTabs product={product} />

          <ProductReviews
            productId={product.id}
            productSlug={product.slug}
            reviews={reviews}
            ratingAverage={product.ratingAverage}
            ratingCount={product.ratingCount}
          />

          {related.length ? (
            <section className="border-t border-line pt-12" aria-label="You may also like">
              <h2 className="mb-9 text-2xl lg:text-3xl">You may also like</h2>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 lg:gap-x-7">
                {related.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          ) : null}

          <RecentlyViewed
            current={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              image: product.images[0]?.url ?? "/media/banners/og-default.v3.jpg",
              price: product.price,
              salePrice: product.salePrice ?? null,
            }}
          />
        </div>
      </div>
    </>
  );
}
