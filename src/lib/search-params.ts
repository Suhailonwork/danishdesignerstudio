import type { ProductFilters, ProductSort } from "@/types";

export type SearchParamsInput = Record<string, string | string[] | undefined>;

const SORTS: ProductSort[] = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "best_selling",
  "rating",
];

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ? raw.trim() : undefined;
}

/** Turns URL query parameters into the typed filter object the data layer expects. */
export function parseProductParams(
  params: SearchParamsInput,
  overrides: Partial<ProductFilters> = {}
): ProductFilters {
  const sortParam = first(params.sort) as ProductSort | undefined;
  const availability = first(params.availability);

  return {
    q: first(params.q),
    category: first(params.category),
    collection: first(params.collection),
    sizes: toArray(params.size),
    colors: toArray(params.color),
    tags: toArray(params.tag),
    minPrice: toNumber(params.minPrice),
    maxPrice: toNumber(params.maxPrice),
    availability:
      availability === "in_stock" || availability === "out_of_stock" ? availability : undefined,
    sort: sortParam && SORTS.includes(sortParam) ? sortParam : "newest",
    page: Math.max(1, toNumber(params.page) ?? 1),
    perPage: 12,
    trending: first(params.trending) === "1" || undefined,
    bestSeller: first(params.bestSeller) === "1" || undefined,
    newArrival: first(params.newArrival) === "1" || undefined,
    ...overrides,
  };
}

/** Rebuilds a URLSearchParams for pagination links. */
export function toURLSearchParams(params: SearchParamsInput) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    toArray(value).forEach((v) => search.append(key, v));
  }
  return search;
}
