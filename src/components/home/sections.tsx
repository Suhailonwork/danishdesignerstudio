import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CreditCard, Percent, Shield, Truck } from "lucide-react";
import { InstagramIcon } from "@/components/ui/brand-icons";
import type { LucideIcon } from "lucide-react";

import type { Category, Collection, HomeSection } from "@/types";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "@/components/store/newsletter-form";

/* ------------------------------------------------------------------ */
/* Featured categories                                                 */
/* ------------------------------------------------------------------ */

export function FeaturedCategories({
  section,
  categories,
}: {
  section: HomeSection;
  categories: Category[];
}) {
  const limit = Number((section.config as { limit?: number }).limit ?? 6);
  const items = categories.slice(0, limit);
  if (!items.length) return null;

  return (
    <section className="container-lux py-16 lg:py-24">
      <SectionHeading
        title={section.title ?? "Shop by category"}
        subtitle={section.subtitle ?? undefined}
        className="mb-12"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {items.map((category, index) => (
          <Reveal key={category.id} delay={Math.min(index, 5) * 0.05}>
            <Link href={`/category/${category.slug}`} className="group block">
              <div className="relative aspect-4/5 overflow-hidden bg-ivory-deep">
                <Image
                  src={category.image ?? "/media/banners/og-default.v3.jpg"}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 45vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-ink/10 transition-colors duration-500 group-hover:bg-ink/25" />
              </div>
              <div className="pt-3.5 text-center">
                <h3 className="text-base transition-colors duration-300 group-hover:text-gold">
                  {category.name}
                </h3>
                <p className="mt-0.5 text-xs text-ash">{category.productCount ?? 0} pieces</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Inspiration — editorial triptych from the reference                 */
/* ------------------------------------------------------------------ */

export function InspirationSection({ section }: { section: HomeSection }) {
  const config = section.config as {
    images?: string[];
    cta?: { label: string; href: string };
  };
  const images = config.images ?? [];

  return (
    <section className="container-lux py-16 lg:py-24">
      <div className="grid gap-1 md:grid-cols-3">
        <div className="relative flex min-h-[24rem] flex-col justify-center overflow-hidden bg-ink p-8 text-ivory md:col-span-1 lg:p-12">
          {images[0] ? (
            <>
              <Image
                src={images[0]}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/55" />
            </>
          ) : null}
          <div className="relative space-y-6">
            {section.subtitle ? (
              <span className="inline-block bg-ivory px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-ink">
                {section.subtitle}
              </span>
            ) : null}
            <h2 className="text-3xl leading-tight lg:text-[2.6rem]">{section.title}</h2>
            {config.cta ? (
              <Link
                href={config.cta.href}
                className="group inline-flex items-center gap-3 border-b border-ivory/60 pb-1.5 text-[0.7rem] uppercase tracking-[0.2em]"
              >
                {config.cta.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
            ) : null}
          </div>
        </div>

        {images.slice(1, 3).map((image, index) => (
          <div key={image} className="group relative min-h-[24rem] overflow-hidden bg-ivory-deep">
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Editorial split                                                      */
/* ------------------------------------------------------------------ */

export function EditorialSection({ section }: { section: HomeSection }) {
  const config = section.config as {
    body?: string;
    cta?: { label: string; href: string };
    images?: string[];
  };
  const [primary, secondary] = config.images ?? [];

  return (
    <section className="container-lux py-16 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="max-w-lg space-y-6">
            {section.subtitle ? (
              <p className="flex items-center gap-2 text-sm text-ash">
                <InstagramIcon className="h-4 w-4 text-wine" />
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="text-3xl leading-tight sm:text-4xl lg:text-[2.9rem]">
              {section.title}
            </h2>
            {config.body ? (
              <p className="text-[0.95rem] leading-relaxed text-ash">{config.body}</p>
            ) : null}
            {config.cta ? (
              <ButtonLink href={config.cta.href} variant="outline">
                {config.cta.label}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="order-1 lg:order-2">
          <div className="relative grid grid-cols-5 gap-4">
            {secondary ? (
              <div className="relative col-span-2 aspect-3/4 self-end overflow-hidden bg-ivory-deep">
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            {primary ? (
              <div className="relative col-span-3 aspect-4/5 overflow-hidden bg-ivory-deep">
                <Image
                  src={primary}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Full-bleed marquee banner                                            */
/* ------------------------------------------------------------------ */

export function MarqueeBanner({ section }: { section: HomeSection }) {
  const config = section.config as {
    image?: string;
    video?: string;
    cta?: { label: string; href: string };
  };
  const words = Array.from({ length: 6 }, () => section.title ?? "New Arrivals");

  return (
    <section className="relative isolate my-10 min-h-[22rem] overflow-hidden bg-ink lg:min-h-[30rem]">
      {config.video ? (
        <video
          src={config.video}
          poster={config.image}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      ) : config.image ? (
        <Image src={config.image} alt="" fill sizes="100vw" className="object-cover opacity-90" />
      ) : null}
      <div className="absolute inset-0 bg-ink/35" />

      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-max items-center animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1}>
            {words.map((word, index) => (
              <span
                key={`${group}-${index}`}
                className="px-6 font-display text-[3.5rem] uppercase leading-none text-transparent lg:text-[6rem]"
                style={{ WebkitTextStroke: "1px rgba(250,248,245,0.55)" }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      {config.cta ? (
        <div className="relative flex min-h-[22rem] items-center justify-center lg:min-h-[30rem]">
          <ButtonLink
            href={config.cta.href}
            size="lg"
            className="border-ink bg-ink/90 text-ivory backdrop-blur-sm hover:bg-ink"
          >
            {config.cta.label}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust badges                                                         */
/* ------------------------------------------------------------------ */

const TRUST_ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  shield: Shield,
  "credit-card": CreditCard,
  percent: Percent,
};

export function TrustBadges({ section }: { section: HomeSection }) {
  const badges =
    (section.config as { badges?: { icon: string; title: string; text: string }[] }).badges ?? [];
  if (!badges.length) return null;

  return (
    <section className="border-y border-line bg-white">
      <div className="container-lux grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => {
          const Icon = TRUST_ICONS[badge.icon] ?? Shield;
          return (
            <div key={badge.title} className="flex items-start gap-4">
              <Icon className="h-7 w-7 shrink-0 text-ink" strokeWidth={1.2} />
              <div>
                <h3 className="text-base">{badge.title}</h3>
                <p className="mt-0.5 text-sm text-ash">{badge.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Collection banners                                                   */
/* ------------------------------------------------------------------ */

export function CollectionBanners({
  section,
  collections,
}: {
  section: HomeSection;
  collections: Collection[];
}) {
  const config = section.config as { limit?: number; featuredOnly?: boolean };
  const items = (config.featuredOnly ? collections.filter((c) => c.isFeatured) : collections).slice(
    0,
    Number(config.limit ?? 3)
  );
  if (!items.length) return null;

  return (
    <section className="container-lux py-16 lg:py-24">
      <SectionHeading
        title={section.title ?? "Collections"}
        subtitle={section.subtitle ?? undefined}
        className="mb-12"
      />
      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        {items.map((collection, index) => (
          <Reveal key={collection.id} delay={index * 0.08}>
            <Link
              href={`/collection/${collection.slug}`}
              className="group relative block min-h-[22rem] overflow-hidden bg-ink lg:min-h-[26rem]"
            >
              <Image
                src={collection.bannerImage ?? "/media/banners/og-default.v3.jpg"}
                alt={collection.name}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-transparent" />
              <div className="relative flex h-full min-h-[22rem] flex-col justify-end gap-2 p-7 text-ivory lg:min-h-[26rem]">
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/70">
                  {collection.productCount ?? 0} pieces
                </p>
                <h3 className="text-2xl lg:text-3xl">{collection.name}</h3>
                {collection.description ? (
                  <p className="line-clamp-2 max-w-sm text-sm text-ivory/80">
                    {collection.description}
                  </p>
                ) : null}
                <span className="mt-2 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.2em]">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Instagram grid                                                       */
/* ------------------------------------------------------------------ */

export function InstagramSection({ section }: { section: HomeSection }) {
  const config = section.config as { images?: string[]; url?: string; handle?: string };
  const images = config.images ?? [];
  if (!images.length) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-lux mb-10 text-center">
        <a
          href={config.url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 font-display text-2xl transition-colors hover:text-gold"
        >
          <InstagramIcon className="h-5 w-5 text-wine" />
          {section.title ?? "Follow on Instagram"}
        </a>
        {section.subtitle ? <p className="mt-2 text-sm text-ash">{section.subtitle}</p> : null}
      </div>

      <div className="grid grid-cols-3 gap-1 lg:grid-cols-6">
        {images.map((image, index) => (
          <a
            key={image}
            href={config.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-ivory-deep"
            aria-label={`View post ${index + 1} on Instagram`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 16vw, 33vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <span className="absolute inset-0 grid place-items-center bg-ink/0 text-ivory opacity-0 transition-all duration-400 group-hover:bg-ink/45 group-hover:opacity-100">
              <InstagramIcon className="h-6 w-6" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter                                                           */
/* ------------------------------------------------------------------ */

export function NewsletterSection({ section }: { section: HomeSection }) {
  return (
    <section className="border-y border-line bg-white">
      <div className="container-lux grid items-center gap-8 py-16 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        <div className="space-y-3">
          <h2 className="max-w-xl text-3xl leading-tight sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="max-w-lg text-sm text-ash">{section.subtitle}</p>
          ) : null}
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
