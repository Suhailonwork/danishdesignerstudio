import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs, Prose } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import {
  getBlogPostBySlug,
  getGlobalSeo,
  getPublishedPosts,
} from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/structured-data";
import { formatDate } from "@/lib/utils";

export const revalidate = 900;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [post, seo] = await Promise.all([getBlogPostBySlug(slug), getGlobalSeo()]);
  if (!post) return { title: "Article not found" };

  return buildMetadata({
    global: seo,
    seo: post.seo,
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const allPosts = await getPublishedPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.categorySlug === post.categorySlug)
    .slice(0, 3);
  const fallbackRelated = related.length
    ? related
    : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const faq = faqSchema(post.faqs);

  return (
    <article>
      <JsonLd
        data={[
          articleSchema(post),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Journal", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
          ...(faq ? [faq] : []),
        ]}
      />

      <header className="container-lux pt-8 lg:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Journal", href: "/blog" },
            { label: post.title },
          ]}
        />

        <div className="mx-auto mt-8 max-w-3xl text-center">
          <p className="eyebrow">{post.categoryName}</p>
          <h1 className="mt-4 text-4xl leading-tight lg:text-[3.25rem]">{post.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ash">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-ash">
            <span>{post.authorName}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      <div className="container-lux mt-10 lg:mt-14">
        <div className="relative mx-auto aspect-16/9 max-w-5xl overflow-hidden bg-ivory-deep">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-lux py-14 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Prose content={post.content} />

          {post.tags.length ? (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-8">
              <span className="eyebrow mr-2">Tags</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="border border-line px-3 py-1.5 text-xs capitalize text-ash transition-colors hover:border-ink hover:text-ink"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          {post.faqs.length ? (
            <section className="mt-14" aria-labelledby="post-faq">
              <h2 id="post-faq" className="mb-6 text-2xl">
                Frequently asked
              </h2>
              <dl className="divide-y divide-line border-y border-line">
                {post.faqs.map((item) => (
                  <div key={item.question} className="py-5">
                    <dt className="text-base text-ink">{item.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-ash">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-ash hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the journal
            </Link>
            <ButtonLink href="/shop" variant="outline" size="sm">
              Shop the collection
            </ButtonLink>
          </div>
        </div>

        {fallbackRelated.length ? (
          <section className="mt-20" aria-label="Related articles">
            <h2 className="mb-9 text-2xl">Keep reading</h2>
            <div className="grid gap-x-7 gap-y-10 md:grid-cols-3">
              {fallbackRelated.map((item) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="group block">
                  <div className="relative aspect-4/3 overflow-hidden bg-ivory-deep">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover transition-transform duration-[1100ms] group-hover:scale-105"
                    />
                  </div>
                  <p className="eyebrow mt-4">{item.categoryName}</p>
                  <h3 className="mt-2 text-lg leading-snug transition-colors group-hover:text-gold">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
