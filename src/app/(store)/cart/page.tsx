import type { Metadata } from "next";

import { CartPageClient } from "@/components/store/cart-page-client";
import { PageHero } from "@/components/store/page-hero";
import { getGlobalSeo } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true },
    title: "Shopping bag",
    description: "Review the pieces in your Danish Designer Studio shopping bag before checkout.",
    path: "/cart",
  });
}

export default function CartPage() {
  return (
    <>
      <PageHero
        title="Shopping bag"
        eyebrow="Checkout"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bag" }]}
        size="sm"
      />
      <div className="container-lux py-12 lg:py-16">
        <CartPageClient />
      </div>
    </>
  );
}
