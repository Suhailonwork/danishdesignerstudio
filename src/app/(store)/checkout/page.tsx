import type { Metadata } from "next";

import { CheckoutClient } from "@/components/store/checkout-client";
import { PageHero } from "@/components/store/page-hero";
import { getCurrentUser } from "@/lib/auth";
import { getGlobalSeo } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "Checkout",
    description: "Complete your Danish Designer Studio order.",
    path: "/checkout",
  });
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <>
      <PageHero
        title="Checkout"
        eyebrow="Almost there"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Bag", href: "/cart" },
          { label: "Checkout" },
        ]}
        size="sm"
      />
      <div className="container-lux py-12 lg:py-16">
        <CheckoutClient defaultEmail={user?.email} defaultName={user?.fullName} />
      </div>
    </>
  );
}
