import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HomeSection } from "@/types";
import { Reveal } from "@/components/ui/reveal";

import { HeroContent } from "./hero-content";

interface HeroCard {
  eyebrow?: string;
  title?: string;
  image?: string;
  cta?: { label: string; href: string };
}

export function Hero({ section }: { section: HomeSection }) {
  const config = section.config as {
    primaryImage?: string;
    primaryVideo?: string;
    primaryCta?: { label: string; href: string };
    cards?: HeroCard[];
  };

  const cards = (config.cards ?? []).slice(0, 2);

  return (
    <section className="container-lux pt-6 pb-16 md:pt-8 lg:pb-24" aria-label="Featured">
      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr] lg:gap-5">
        {/* Primary editorial panel */}
        <div className="group relative min-h-[26rem] overflow-hidden bg-ink sm:min-h-[34rem] lg:min-h-[44rem]">
          {config.primaryVideo ? (
            <video
              src={config.primaryVideo}
              poster={config.primaryImage}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={config.primaryImage ?? "/media/banners/hero-primary.v3.jpg"}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/25 to-ink/10" />

          <HeroContent
            title={section.title}
            subtitle={section.subtitle}
            cta={config.primaryCta}
          />
        </div>

        {/* Secondary stacked cards */}
        <div className="grid gap-4 lg:gap-5">
          {cards.map((card, index) => (
            <Reveal
              key={`${card.title}-${index}`}
              delay={0.15 + index * 0.12}
              y={26}
              className="min-h-[15rem] sm:min-h-[17rem] lg:min-h-0"
            >
            <Link
              href={card.cta?.href ?? "/shop"}
              className="group relative flex h-full min-h-[15rem] overflow-hidden bg-ink sm:min-h-[17rem] lg:min-h-0"
            >
              <Image
                src={card.image ?? "/media/banners/hero-kurta.v3.jpg"}
                alt=""
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/15 to-transparent" />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-ivory">
                {card.eyebrow ? (
                  <span className="bg-ivory px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-ink">
                    {card.eyebrow}
                  </span>
                ) : null}
                <h2 className="text-3xl sm:text-4xl">{card.title}</h2>
                {card.cta ? (
                  <span className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-ivory/90">
                    {card.cta.label}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                ) : null}
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
