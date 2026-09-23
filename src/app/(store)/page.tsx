import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { ProductSection } from "@/components/home/product-section";
import {
  CollectionBanners,
  EditorialSection,
  FeaturedCategories,
  InspirationSection,
  InstagramSection,
  MarqueeBanner,
  NewsletterSection,
  TrustBadges,
} from "@/components/home/sections";
import { Testimonials } from "@/components/home/testimonials";
import type { HomeSection, Product } from "@/types";
import {
  getActiveCategories,
  getActiveCollections,
  getActiveHomeSections,
  getActiveTestimonials,
  getAllProducts,
  getGlobalSeo,
  getSiteSettings,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { sortProducts } from "@/lib/data/queries";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getGlobalSeo(), getSiteSettings()]);
  return buildMetadata({
    global: seo,
    title: seo.siteTitle,
    description: settings.description,
    path: "/",
    // The site title already carries the brand; don't let the template repeat it.
    absoluteTitle: true,
  });
}

function pickProducts(products: Product[], section: HomeSection): Product[] {
  const config = section.config as { limit?: number; productIds?: string[] };
  const limit = Number(config.limit ?? 8);

  if (Array.isArray(config.productIds) && config.productIds.length) {
    const chosen = config.productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p) && p!.isPublished);
    if (chosen.length) return chosen.slice(0, limit);
  }

  const published = products.filter((p) => p.isPublished);

  switch (section.type) {
    case "new_arrivals": {
      const flagged = published.filter((p) => p.isNewArrival);
      return sortProducts(flagged.length ? flagged : published, "newest").slice(0, limit);
    }
    case "best_sellers": {
      const flagged = published.filter((p) => p.isBestSeller);
      return sortProducts(flagged.length ? flagged : published, "best_selling").slice(0, limit);
    }
    case "trending": {
      const flagged = published.filter((p) => p.isTrending);
      return sortProducts(flagged.length ? flagged : published, "rating").slice(0, limit);
    }
    default:
      return published.slice(0, limit);
  }
}

export default async function HomePage() {
  const [sections, products, categories, collections, testimonials] = await Promise.all([
    getActiveHomeSections(),
    getAllProducts(),
    getActiveCategories(),
    getActiveCollections(),
    getActiveTestimonials(),
  ]);

  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <Hero key={section.id} section={section} />;

          case "featured_categories":
            return (
              <FeaturedCategories key={section.id} section={section} categories={categories} />
            );

          case "new_arrivals":
          case "best_sellers":
          case "trending":
            return (
              <ProductSection
                key={section.id}
                section={section}
                products={pickProducts(products, section)}
                showUrgency={section.type !== "new_arrivals"}
              />
            );

          case "inspiration":
            return <InspirationSection key={section.id} section={section} />;

          case "editorial":
            return <EditorialSection key={section.id} section={section} />;

          case "marquee_banner":
            return <MarqueeBanner key={section.id} section={section} />;

          case "trust_badges":
            return <TrustBadges key={section.id} section={section} />;

          case "collection_banner":
            return (
              <CollectionBanners key={section.id} section={section} collections={collections} />
            );

          case "testimonials":
            return (
              <Testimonials key={section.id} section={section} testimonials={testimonials} />
            );

          case "instagram":
            return <InstagramSection key={section.id} section={section} />;

          case "newsletter":
            return <NewsletterSection key={section.id} section={section} />;

          default:
            return null;
        }
      })}
    </>
  );
}
