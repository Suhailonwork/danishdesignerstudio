import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HomeSection, Product } from "@/types";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

export function ProductSection({
  section,
  products,
  showUrgency = false,
}: {
  section: HomeSection;
  products: Product[];
  showUrgency?: boolean;
}) {
  if (!products.length) return null;

  const cta = (section.config as { cta?: { label: string; href: string } }).cta;

  return (
    <section className="container-lux py-16 lg:py-24">
      <SectionHeading
        title={section.title ?? ""}
        subtitle={section.subtitle ?? undefined}
        className="mb-12"
      />

      <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={Math.min(index, 4) * 0.06} as="div">
            <ProductCard product={product} showUrgency={showUrgency} />
          </Reveal>
        ))}
      </div>

      {cta ? (
        <div className="mt-14 flex justify-center">
          <Link
            href={cta.href}
            className="group inline-flex items-center gap-3 border-b border-ink pb-1.5 text-[0.72rem] uppercase tracking-[0.2em] text-ink"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
