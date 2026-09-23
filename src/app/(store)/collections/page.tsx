import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { getActiveCollections, getGlobalSeo } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    title: "Collections",
    description:
      "Explore Danish Designer Studio collections — wedding, groom, festive, Eid and reception edits, each curated for the occasion.",
    path: "/collections",
  });
}

export default async function CollectionsPage() {
  const collections = await getActiveCollections();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Collections", url: "/collections" },
        ])}
      />

      <PageHero
        eyebrow="Curated edits"
        title="Collections"
        description="Each collection is assembled around an occasion — so you can start from the moment rather than the garment."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Collections" }]}
      />

      <div className="container-lux py-14 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {collections.map((collection, index) => (
            <Reveal key={collection.id} delay={(index % 2) * 0.08}>
              <Link
                href={`/collection/${collection.slug}`}
                className="group relative block min-h-[24rem] overflow-hidden bg-ink lg:min-h-[30rem]"
              >
                <Image
                  src={collection.bannerImage ?? "/media/banners/og-default.v3.jpg"}
                  alt={collection.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-transparent" />
                <div className="relative flex h-full min-h-[24rem] flex-col justify-end gap-3 p-8 text-ivory lg:min-h-[30rem] lg:p-10">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/70">
                    {collection.productCount ?? 0} pieces
                    {collection.isFeatured ? " · Featured" : ""}
                  </p>
                  <h2 className="text-3xl lg:text-4xl">{collection.name}</h2>
                  {collection.description ? (
                    <p className="max-w-md text-sm leading-relaxed text-ivory/85">
                      {collection.description}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.2em]">
                    View collection
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
