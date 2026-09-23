import type { Metadata } from "next";
import Image from "next/image";
import { Award, Hand, Leaf, Ruler } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/store/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { getGlobalSeo, getSiteSettings } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 3600;

const TIMELINE = [
  {
    year: "2020",
    date: "01 January 2020",
    title: "The atelier opens",
    body: "Danish Designer Studio was founded to make Indian menswear that is stylish and built to last. Every design starts with care and confidence — clothing meant to help you express yourself, not costume you.",
  },
  {
    year: "2021",
    date: "21 July 2021",
    title: "Real style, real you",
    body: "We began blending bold silhouettes with comfort you can actually trust through a long day. Made for risk-takers, dreamers and everyday leaders — and for the people watching them.",
  },
  {
    year: "2023",
    date: "14 March 2023",
    title: "The groom collection",
    body: "Our first fully hand-worked groom line launched: zardozi, dabka and pearl craft on raw silk, each piece taking well over a hundred hours in the workshop.",
  },
  {
    year: "2026",
    date: "Today",
    title: "Shipping worldwide",
    body: "Thousands of celebrations later, we ship to customers across India and beyond — still cutting, finishing and checking every piece in the same workshop.",
  },
];

const VALUES = [
  {
    icon: Hand,
    title: "Hand craft first",
    text: "Zardozi, dabka, chikankari and mirror work, done by hand by artisans we know by name.",
  },
  {
    icon: Ruler,
    title: "Fit that lasts",
    text: "Extra seam allowance at the waist and sleeve, so a local tailor can adjust without touching the embroidery.",
  },
  {
    icon: Leaf,
    title: "Honest fabric",
    text: "Raw silk, dupion, pure linen and cotton — named plainly on every product page, never dressed up.",
  },
  {
    icon: Award,
    title: "Finished properly",
    text: "Lined, weighted and pressed. Turn any piece inside out and the back of the work tells the story.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getGlobalSeo(), getSiteSettings()]);
  return buildMetadata({
    global: seo,
    title: "About us",
    description: `${settings.description} Read the story behind the atelier, our craft and our values.`,
    path: "/about",
    image: settings.pageImages.aboutHero,
  });
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About us", url: "/about" },
        ])}
      />

      <PageHero
        title="Quality you feel, values you wear"
        eyebrow="About us"
        description="Over five years of crafting Indian menswear — and a process built to understand the person before the garment."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
        image={settings.pageImages.aboutHero}
        size="lg"
      />

      {/* Intro split */}
      <section className="container-lux py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="grid grid-cols-5 gap-4">
              <div className="relative col-span-3 aspect-4/5 overflow-hidden bg-ivory-deep">
                <Image
                  src={settings.pageImages.aboutPrimary}
                  alt="Danish Designer Studio editorial"
                  fill
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="relative col-span-2 aspect-3/4 self-end overflow-hidden bg-ivory-deep">
                <Image
                  src={settings.pageImages.aboutSecondary}
                  alt="Inside the Danish Designer Studio atelier"
                  fill
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="max-w-xl space-y-5">
              <p className="eyebrow">Since 2020</p>
              <h2 className="text-3xl leading-tight sm:text-4xl">
                Big moments deserve bold style
              </h2>
              <p className="leading-relaxed text-ash">
                At Danish Designer Studio we make clothing that rises to the occasion. Whether it is a
                celebration, a new chapter, or a milestone that matters, our pieces are designed to
                make you look and feel unforgettable.
              </p>
              <p className="leading-relaxed text-ash">
                Since 2020 we have blended elegance, edge and confidence into every garment — so
                that when your big moment comes, you are ready to own it. Made for memories. Worn
                for greatness.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <ButtonLink href="/shop">Shop the collection</ButtonLink>
                <ButtonLink href="/contact" variant="outline">
                  Talk to a stylist
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line bg-white">
        <div className="container-lux py-16 lg:py-20">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things we refuse to compromise on"
            className="mb-14"
          />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={index * 0.07}>
                  <div className="space-y-3">
                    <Icon className="h-7 w-7 text-ink" strokeWidth={1.1} />
                    <h3 className="text-lg">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-ash">{value.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-lux py-16 lg:py-24">
        <SectionHeading
          eyebrow="The story"
          title="Danish Designer Studio big moments"
          subtitle="From a single workshop to wardrobes across the world."
          className="mb-16"
        />

        <ol className="relative mx-auto max-w-5xl">
          <span
            aria-hidden="true"
            className="absolute left-4 top-2 bottom-2 w-px bg-line md:left-1/2"
          />
          {TIMELINE.map((entry, index) => (
            <li key={entry.year} className="relative pb-12 last:pb-0">
              <Reveal delay={0.05}>
                <div
                  className={`grid gap-4 pl-12 md:grid-cols-2 md:gap-12 md:pl-0 ${
                    index % 2 === 0 ? "" : "md:[direction:rtl]"
                  }`}
                >
                  <div className="[direction:ltr] md:text-right">
                    <div
                      className={`border border-line bg-white p-6 lg:p-8 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <p className="font-display text-3xl">{entry.year}</p>
                      <h3 className="mt-2 text-lg">{entry.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ash">{entry.body}</p>
                    </div>
                  </div>
                  <div
                    className={`[direction:ltr] flex items-center ${
                      index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                    }`}
                  >
                    <p className="text-sm text-ash">{entry.date}</p>
                  </div>
                </div>
              </Reveal>
              <span
                aria-hidden="true"
                className="absolute left-4 top-8 h-3 w-3 -translate-x-1/2 rounded-full border border-line-strong bg-ivory md:left-1/2"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* Contact strip */}
      <section className="border-t border-line bg-white">
        <div className="container-lux grid items-center gap-8 py-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <h2 className="text-3xl">Visit the atelier</h2>
            <p className="max-w-lg text-sm leading-relaxed text-ash">
              {settings.address}. Appointments are recommended during wedding season — message us
              on WhatsApp and we will set aside a fitting slot.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/contact">Contact us</ButtonLink>
            <ButtonLink href="/collections" variant="outline">
              View collections
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
