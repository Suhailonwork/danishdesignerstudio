import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { EmptyState } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getBlogCategories, getGlobalSeo, getPublishedPosts } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const revalidate = 900;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    title: "The Journal",
    description:
      "Styling guides, fabric explainers and wedding planning notes from the Danish Designer Studio atelier.",
    path: "/blog",
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, posts, categories] = await Promise.all([
    searchParams,
    getPublishedPosts(),
    getBlogCategories(),
  ]);

  const filtered = category ? posts.filter((p) => p.categorySlug === category) : posts;
  const [lead, ...rest] = filtered;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Journal", url: "/blog" },
        ])}
      />

      <PageHero
        eyebrow="The journal"
        title="Notes from the atelier"
        description="Practical guides on fit, fabric and colour — written by the people who cut the cloth."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
      />

      <div className="container-lux py-14 lg:py-20">
        {/* Category filter */}
        <nav aria-label="Journal categories" className="mb-12 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={cn(
              "border px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
              !category ? "border-ink bg-ink text-ivory" : "border-line text-ash hover:border-ink hover:text-ink"
            )}
          >
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/blog?category=${item.slug}`}
              className={cn(
                "border px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
                category === item.slug
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-ash hover:border-ink hover:text-ink"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {!filtered.length ? (
          <EmptyState
            title="No articles here yet"
            description="Try another category — new pieces are published every few weeks."
          />
        ) : (
          <>
            {/* Lead article */}
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="group grid gap-8 border-b border-line pb-14 lg:grid-cols-2 lg:items-center lg:gap-14"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-ivory-deep">
                  <Image
                    src={lead.coverImage}
                    alt={lead.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4">
                  <p className="eyebrow">{lead.categoryName}</p>
                  <h2 className="text-3xl leading-tight lg:text-[2.6rem]">{lead.title}</h2>
                  <p className="max-w-xl leading-relaxed text-ash">{lead.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-ash">
                    <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {lead.readingMinutes} min read
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-ink">
                    Read the article
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>

            {/* Grid */}
            <div className="grid gap-x-7 gap-y-14 pt-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 0.07}>
                  <article>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="relative aspect-4/3 overflow-hidden bg-ivory-deep">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                      </div>
                      <p className="eyebrow mt-5">{post.categoryName}</p>
                      <h2 className="mt-2 text-xl leading-snug transition-colors group-hover:text-gold">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ash">
                        {post.excerpt}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-ash">
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                        <span>{post.readingMinutes} min read</span>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
