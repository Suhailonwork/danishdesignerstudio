import type { Metadata } from "next";

import { PageHero } from "@/components/store/page-hero";
import { WishlistClient } from "@/components/store/wishlist-client";
import { getGlobalSeo } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true },
    title: "Wishlist",
    description: "The Danish Designer Studio pieces you have saved for later.",
    path: "/wishlist",
  });
}

export default function WishlistPage() {
  return (
    <>
      <PageHero
        title="Your wishlist"
        eyebrow="Saved pieces"
        description="Everything you have set aside. Saved to this browser, and kept until you clear it."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
        size="sm"
      />
      <div className="container-lux py-12 lg:py-16">
        <WishlistClient />
      </div>
    </>
  );
}
