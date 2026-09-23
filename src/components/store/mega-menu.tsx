"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import type { Category, Collection } from "@/types";

/**
 * Explore mega menu.
 *
 * Anchored to the header rather than to the "Explore" nav item: a fixed-width
 * panel hung off a link near the left edge gets clipped by the viewport, which
 * is exactly what happened before. Spanning the header container instead means
 * it can never overflow, at any width or zoom level.
 */
export function MegaMenu({
  open,
  categories,
  collections,
  onMouseEnter,
  onNavigate,
}: {
  open: boolean;
  categories: Category[];
  collections: Collection[];
  onMouseEnter: () => void;
  onNavigate: () => void;
}) {
  const featured = collections.find((c) => c.isFeatured) ?? collections[0];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mega"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={onMouseEnter}
          className="absolute inset-x-0 top-full z-50 hidden border-b border-line bg-white shadow-[0_30px_70px_-45px_rgba(0,0,0,0.55)] lg:block"
        >
          <div className="container-lux">
            <div className="grid grid-cols-[1fr_1fr_1.15fr] gap-10 py-9 xl:gap-16">
              <div>
                <p className="eyebrow mb-5">Categories</p>
                <ul className="space-y-3">
                  {categories.slice(0, 6).map((category, index) => (
                    <motion.li
                      key={category.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 + index * 0.03 }}
                    >
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={onNavigate}
                        className="flex items-center justify-between gap-4 text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        <span className="link-underline">{category.name}</span>
                        <span className="text-xs text-ash-light">{category.productCount ?? 0}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow mb-5">Collections</p>
                <ul className="space-y-3">
                  {collections.slice(0, 6).map((collection, index) => (
                    <motion.li
                      key={collection.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.08 + index * 0.03 }}
                    >
                      <Link
                        href={`/collection/${collection.slug}`}
                        onClick={onNavigate}
                        className="text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        <span className="link-underline">{collection.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {featured ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="space-y-3"
                >
                  <p className="eyebrow">Featured</p>
                  <Link
                    href={`/collection/${featured.slug}`}
                    onClick={onNavigate}
                    className="group block"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-ivory-deep">
                      <Image
                        src={
                          featured.bannerImage ??
                          featured.thumbnail ??
                          "/media/banners/og-default.v3.jpg"
                        }
                        alt={featured.name}
                        fill
                        sizes="(min-width: 1280px) 26vw, 32vw"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-3 font-display text-lg">{featured.name}</p>
                    {featured.description ? (
                      <p className="mt-0.5 line-clamp-1 text-xs text-ash">
                        {featured.description}
                      </p>
                    ) : null}
                    <span className="mt-2 inline-flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.18em] text-ink">
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </motion.div>
              ) : null}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
