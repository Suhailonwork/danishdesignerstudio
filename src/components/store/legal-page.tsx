import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { Prose } from "@/components/ui/primitives";
import { getGlobalSeo, getPageBySlug } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils";

/** Shared renderer for the admin-managed static pages (policies, terms, etc.). */
export async function legalMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const [page, seo] = await Promise.all([getPageBySlug(slug), getGlobalSeo()]);
  return buildMetadata({
    global: seo,
    seo: page?.seo,
    title: page?.title ?? fallbackTitle,
    description:
      page?.seo?.metaDescription ??
      `${page?.title ?? fallbackTitle} for Danish Designer Studio — how we handle your order, data and returns.`,
    path: `/${slug}`,
  });
}

export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPageBySlug(slug);
  if (!page || !page.isPublished) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: page.title, url: `/${page.slug}` },
        ])}
      />

      <PageHero
        title={page.title}
        eyebrow="Legal"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: page.title }]}
        size="sm"
      />

      <div className="container-lux py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-10 text-xs text-ash">
            Last updated {formatDate(page.updatedAt)}
          </p>
          <Prose content={page.content} />
        </div>
      </div>
    </>
  );
}
