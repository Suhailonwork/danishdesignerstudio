"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Loader2, SlidersHorizontal, X } from "lucide-react";

import type { Category, Collection } from "@/types";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

export interface Facets {
  sizes: string[];
  colors: { name: string; hex: string }[];
  tags: string[];
  minPrice: number;
  maxPrice: number;
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "best_selling", label: "Best selling" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "name_asc", label: "Alphabetical" },
];

function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setParam = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else if (value !== null && value !== "") {
          params.set(key, value);
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const current = searchParams.getAll(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setParam({ [key]: next });
    },
    [searchParams, setParam]
  );

  return { router, pathname, searchParams, setParam, toggleMulti, pending };
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-6">
      <h3 className="mb-4 text-[0.68rem] uppercase tracking-[0.18em] text-ink">{title}</h3>
      {children}
    </div>
  );
}

function FilterBody({
  facets,
  categories,
  collections,
  hideCategory,
  hideCollection,
}: {
  facets: Facets;
  categories: Category[];
  collections: Collection[];
  hideCategory?: boolean;
  hideCollection?: boolean;
}) {
  const { searchParams, setParam, toggleMulti } = useFilterState();

  const selectedSizes = searchParams.getAll("size");
  const selectedColors = searchParams.getAll("color");
  const availability = searchParams.get("availability") ?? "";
  const maxPrice = Number(searchParams.get("maxPrice") ?? facets.maxPrice);

  return (
    <div className="space-y-6">
      {!hideCategory && categories.length ? (
        <FilterGroup title="Category">
          <ul className="space-y-2.5">
            {categories.map((category) => {
              const active = searchParams.get("category") === category.slug;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => setParam({ category: active ? null : category.slug })}
                    className={cn(
                      "flex w-full items-center justify-between text-sm transition-colors",
                      active ? "text-ink" : "text-ash hover:text-ink"
                    )}
                    aria-pressed={active}
                  >
                    <span className={cn(active && "underline underline-offset-4")}>
                      {category.name}
                    </span>
                    <span className="text-xs text-ash-light">{category.productCount ?? 0}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      ) : null}

      {!hideCollection && collections.length ? (
        <FilterGroup title="Collection">
          <ul className="space-y-2.5">
            {collections.map((collection) => {
              const active = searchParams.get("collection") === collection.slug;
              return (
                <li key={collection.id}>
                  <button
                    type="button"
                    onClick={() => setParam({ collection: active ? null : collection.slug })}
                    className={cn(
                      "flex w-full items-center justify-between text-sm transition-colors",
                      active ? "text-ink" : "text-ash hover:text-ink"
                    )}
                    aria-pressed={active}
                  >
                    <span className={cn(active && "underline underline-offset-4")}>
                      {collection.name}
                    </span>
                    <span className="text-xs text-ash-light">{collection.productCount ?? 0}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      ) : null}

      <FilterGroup title="Price">
        <div className="space-y-3">
          <input
            type="range"
            min={facets.minPrice}
            max={facets.maxPrice}
            step={500}
            defaultValue={maxPrice}
            onChange={(event) => {
              const value = event.target.value;
              window.clearTimeout((window as unknown as { __priceTimer?: number }).__priceTimer);
              (window as unknown as { __priceTimer?: number }).__priceTimer = window.setTimeout(
                () => setParam({ maxPrice: value === String(facets.maxPrice) ? null : value }),
                420
              );
            }}
            aria-label="Maximum price"
            className="w-full accent-ink"
          />
          <div className="flex justify-between text-xs text-ash">
            <span>{formatPrice(facets.minPrice)}</span>
            <span>Up to {formatPrice(maxPrice)}</span>
          </div>
        </div>
      </FilterGroup>

      {facets.sizes.length ? (
        <FilterGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleMulti("size", size)}
                  aria-pressed={active}
                  className={cn(
                    "min-w-11 border px-3 py-2 text-xs transition-colors",
                    active
                      ? "border-ink bg-ink text-ivory"
                      : "border-line text-ink hover:border-ink"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </FilterGroup>
      ) : null}

      {facets.colors.length ? (
        <FilterGroup title="Colour">
          <ul className="space-y-2.5">
            {facets.colors.map((color) => {
              const active = selectedColors.includes(color.name);
              return (
                <li key={color.name}>
                  <button
                    type="button"
                    onClick={() => toggleMulti("color", color.name)}
                    aria-pressed={active}
                    className="flex w-full items-center gap-2.5 text-sm"
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 rounded-full border",
                        active ? "ring-1 ring-ink ring-offset-2" : "border-line-strong"
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                    <span className={cn(active ? "text-ink" : "text-ash")}>{color.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      ) : null}

      <FilterGroup title="Availability">
        <div className="space-y-2.5">
          {[
            { value: "", label: "All products" },
            { value: "in_stock", label: "In stock" },
            { value: "out_of_stock", label: "Out of stock" },
          ].map((option) => (
            <label key={option.value || "all"} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="availability"
                checked={availability === option.value}
                onChange={() => setParam({ availability: option.value || null })}
                className="h-3.5 w-3.5 accent-ink"
              />
              <span className={availability === option.value ? "text-ink" : "text-ash"}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

export function ProductToolbar({
  total,
  facets,
  categories,
  collections,
  hideCategory,
  hideCollection,
}: {
  total: number;
  facets: Facets;
  categories: Category[];
  collections: Collection[];
  hideCategory?: boolean;
  hideCollection?: boolean;
}) {
  const { searchParams, setParam, pending } = useFilterState();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeFilters = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    const add = (key: string, prefix = "") => {
      searchParams.getAll(key).forEach((value) => {
        chips.push({
          label: `${prefix}${value.replace(/-/g, " ")}`,
          clear: () =>
            setParam({ [key]: searchParams.getAll(key).filter((v) => v !== value) }),
        });
      });
    };
    if (!hideCategory) add("category");
    if (!hideCollection) add("collection");
    add("size", "Size ");
    add("color");
    if (searchParams.get("availability")) {
      chips.push({
        label: searchParams.get("availability") === "in_stock" ? "In stock" : "Out of stock",
        clear: () => setParam({ availability: null }),
      });
    }
    if (searchParams.get("maxPrice")) {
      chips.push({
        label: `Under ${formatPrice(Number(searchParams.get("maxPrice")))}`,
        clear: () => setParam({ maxPrice: null }),
      });
    }
    return chips;
  }, [searchParams, setParam, hideCategory, hideCollection]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilters.length ? (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-ink text-[0.6rem] text-ivory">
                {activeFilters.length}
              </span>
            ) : null}
          </button>
          <p className="flex items-center gap-2 text-sm text-ash">
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {total} {total === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-[0.68rem] uppercase tracking-[0.14em] text-ash">
            Sort
          </label>
          <select
            id="sort"
            value={searchParams.get("sort") ?? "newest"}
            onChange={(event) => setParam({ sort: event.target.value })}
            className="border border-line bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeFilters.length ? (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {activeFilters.map((chip, index) => (
            <button
              key={`${chip.label}-${index}`}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-1.5 text-xs capitalize text-ink transition-colors hover:border-ink"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setParam({
                category: hideCategory ? searchParams.get("category") : null,
                collection: hideCollection ? searchParams.get("collection") : null,
                size: null,
                color: null,
                availability: null,
                maxPrice: null,
              })
            }
            className="text-xs text-ash underline underline-offset-4 hover:text-ink"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        title="Filters"
        footer={
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            Show {total} results
          </Button>
        }
      >
        <FilterBody
          facets={facets}
          categories={categories}
          collections={collections}
          hideCategory={hideCategory}
          hideCollection={hideCollection}
        />
      </Drawer>
    </>
  );
}

export function ProductSidebar(props: {
  facets: Facets;
  categories: Category[];
  collections: Collection[];
  hideCategory?: boolean;
  hideCollection?: boolean;
}) {
  return (
    <aside className="hidden w-60 shrink-0 lg:block xl:w-64" aria-label="Product filters">
      <FilterBody {...props} />
    </aside>
  );
}
