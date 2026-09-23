"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { Product } from "@/types";
import { Prose } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const TABS = ["Description", "Specifications", "Shipping", "Returns"] as const;
type Tab = (typeof TABS)[number];

export function DetailsTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");
  const [openMobile, setOpenMobile] = useState<Tab | null>("Description");

  const specs: [string, string | null | undefined][] = [
    ["Brand", product.brand],
    ["Category", product.categoryName],
    ["Material", product.material],
    ["Fabric", product.fabric],
    ["Available sizes", product.sizes.join(", ") || null],
    ["Available colours", product.colors.join(", ") || null],
    ["SKU", product.sku],
    ["Care", product.careInstructions],
  ];

  const content: Record<Tab, React.ReactNode> = {
    Description: (
      <Prose content={product.description ?? product.shortDescription ?? "Details coming soon."} />
    ),
    Specifications: (
      <dl className="divide-y divide-line">
        {specs
          .filter(([, value]) => Boolean(value))
          .map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-ash">{label}</dt>
              <dd className="text-sm leading-relaxed text-ink-soft">{value}</dd>
            </div>
          ))}
      </dl>
    ),
    Shipping: (
      <Prose
        content={`Free shipping is included on every order within India, with dispatch inside two working days and delivery in three to six working days depending on your city.

### Made to measure

Made-to-measure pieces take four to six weeks in the atelier, and up to ten weeks for heavily hand-worked sherwanis. Our team confirms the exact timeline within 24 hours of your order.

### International

We ship worldwide by tracked courier. Parcels usually clear customs and arrive within seven to twelve working days. Import duties are payable by the recipient.`}
      />
    ),
    Returns: (
      <Prose
        content={`Ready-to-wear pieces can be returned within seven days of delivery, provided they are unworn, unwashed and still carry their tags.

### Exchanges

One size exchange per order is free within India, subject to availability. If your size is unavailable we refund in full.

### What we cannot accept

Made-to-measure garments and altered pieces cannot be returned. If an item arrives damaged or incorrect, tell us within 48 hours and we will replace or refund it in full.`}
      />
    ),
  };

  return (
    <section className="border-t border-line pt-12" aria-label="Product details">
      {/* Desktop tabs */}
      <div className="hidden lg:block">
        <div role="tablist" aria-label="Product information" className="flex gap-8 border-b border-line">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              type="button"
              id={`tab-${tab}`}
              aria-selected={active === tab}
              aria-controls={`panel-${tab}`}
              onClick={() => setActive(tab)}
              className={cn(
                "relative -mb-px border-b-2 pb-4 text-[0.72rem] uppercase tracking-[0.18em] transition-colors",
                active === tab
                  ? "border-ink text-ink"
                  : "border-transparent text-ash hover:text-ink"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="max-w-3xl pt-8"
        >
          {content[active]}
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="lg:hidden">
        {TABS.map((tab) => {
          const expanded = openMobile === tab;
          return (
            <div key={tab} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpenMobile(expanded ? null : tab)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between py-4 text-[0.72rem] uppercase tracking-[0.16em] text-ink"
              >
                {tab}
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")}
                />
              </button>
              {expanded ? <div className="pb-6">{content[tab]}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
