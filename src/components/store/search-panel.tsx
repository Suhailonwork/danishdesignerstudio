"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";

import type { Product } from "@/types";
import { effectivePrice, formatPrice } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";

import { useStore } from "./store-provider";

interface Suggestions {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  collections: { id: string; name: string; slug: string }[];
}

const POPULAR = ["Sherwani", "Kurta Pajama", "Bandhgala", "Jodhpuri", "Wedding", "Ivory"];
const MIN_QUERY = 2;

export function SearchPanel() {
  const { panel, closePanel } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestions | null>(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const open = panel === "search";
  const [wasOpen, setWasOpen] = useState(open);

  // Reset the field when the panel closes, without an extra effect pass.
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open && query) {
      setQuery("");
      setResults(null);
    }
  }

  const trimmed = query.trim();
  const active = trimmed.length >= MIN_QUERY;

  useEffect(() => {
    if (trimmed.length < MIN_QUERY) return;

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        setResults((await response.json()) as Suggestions);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResults(null);
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => window.clearTimeout(timer);
  }, [trimmed]);

  const submit = useCallback(
    (value: string) => {
      const next = value.trim();
      if (!next) return;
      closePanel();
      router.push(`/search?q=${encodeURIComponent(next)}`);
    },
    [closePanel, router]
  );

  const visible = active ? results : null;

  return (
    <Drawer open={open} onClose={closePanel} side="top" title="Search" className="md:max-h-[80vh]">
      <div className="mx-auto w-full max-w-4xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(query);
          }}
          role="search"
          className="flex items-center gap-3 border-b border-ink pb-4"
        >
          <Search className="h-5 w-5 shrink-0 text-ash" strokeWidth={1.5} />
          <input
            data-autofocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for sherwani, kurta, bandhgala…"
            aria-label="Search products"
            className="w-full bg-transparent py-2 font-display text-xl outline-none placeholder:text-ash-light md:text-2xl"
          />
          {loading && active ? <Loader2 className="h-4 w-4 animate-spin text-ash" /> : null}
        </form>

        {!active ? (
          <div className="pt-7">
            <p className="eyebrow mb-4">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => submit(term)}
                  className="border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {visible ? (
          visible.products.length || visible.categories.length || visible.collections.length ? (
            <div className="grid gap-8 pt-7 md:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="eyebrow mb-4">Products</p>
                <ul className="space-y-3">
                  {visible.products.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closePanel}
                        className="group flex items-center gap-4"
                      >
                        <span className="relative aspect-3/4 w-14 shrink-0 overflow-hidden bg-ivory-deep">
                          <Image
                            src={product.images[0]?.url ?? "/media/banners/og-default.v3.jpg"}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-ink">{product.name}</span>
                          <span className="block text-xs text-ash">{product.categoryName}</span>
                        </span>
                        <span className="shrink-0 text-sm tabular-nums text-ink">
                          {formatPrice(effectivePrice(product.price, product.salePrice))}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {visible.products.length ? (
                  <button
                    type="button"
                    onClick={() => submit(query)}
                    className="mt-5 text-sm underline underline-offset-4"
                  >
                    See all results for “{trimmed}”
                  </button>
                ) : null}
              </div>

              <div className="space-y-7">
                {visible.categories.length ? (
                  <div>
                    <p className="eyebrow mb-3">Categories</p>
                    <ul className="space-y-2">
                      {visible.categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/category/${category.slug}`}
                            onClick={closePanel}
                            className="text-sm text-ink-soft hover:text-ink"
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {visible.collections.length ? (
                  <div>
                    <p className="eyebrow mb-3">Collections</p>
                    <ul className="space-y-2">
                      {visible.collections.map((collection) => (
                        <li key={collection.id}>
                          <Link
                            href={`/collection/${collection.slug}`}
                            onClick={closePanel}
                            className="text-sm text-ink-soft hover:text-ink"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="font-display text-xl">No matches for “{trimmed}”</p>
              <p className="mt-2 text-sm text-ash">
                Try a silhouette — sherwani, bandhgala, jodhpuri — or browse the full shop.
              </p>
              <Link
                href="/shop"
                onClick={closePanel}
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                Browse all products
              </Link>
            </div>
          )
        ) : null}
      </div>
    </Drawer>
  );
}
