import "server-only";

import { cache } from "react";

import type {
  Banner,
  BlogCategory,
  BlogPost,
  Category,
  Collection,
  Coupon,
  Customer,
  GlobalSeo,
  HomeSection,
  InventoryTransaction,
  MediaItem,
  NavigationItem,
  Order,
  Paginated,
  Product,
  ProductFilters,
  Review,
  SitePage,
  SiteSettings,
  Testimonial,
} from "@/types";
import { getSupabasePublicClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { effectivePrice } from "@/lib/utils";

import {
  mapBanner,
  mapBlogPost,
  mapCategory,
  mapCollection,
  mapCoupon,
  mapCustomer,
  mapHomeSection,
  mapInventoryTransaction,
  mapMedia,
  mapNavigationItem,
  mapOrder,
  mapPage,
  mapProduct,
  mapReview,
  mapTestimonial,
} from "./mappers";
import {
  seedBanners,
  seedBlogCategories,
  seedBlogPosts,
  seedCategories,
  seedCollections,
  seedCoupons,
  seedCustomers,
  seedGlobalSeo,
  seedHomeSections,
  seedInventoryTransactions,
  seedMedia,
  seedNavigation,
  seedOrders,
  seedPages,
  seedProducts,
  seedReviews,
  seedSettings,
  seedTestimonials,
} from "./seed";

const PRODUCT_SELECT = `
  *,
  categories:category_id ( id, name, slug ),
  product_images ( id, url, alt, display_order ),
  product_variants ( id, product_id, sku, size, color, color_hex, price, sale_price, stock_quantity, is_active ),
  collection_products ( collections ( id, name, slug ) )
`;

/** Every Supabase read funnels through here so a misconfigured or unreachable
 *  database degrades to demo content instead of a 500. */
async function fromSupabase<T>(
  run: (client: NonNullable<Awaited<ReturnType<typeof getSupabaseServerClient>>>) => Promise<T | null>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const client = getSupabasePublicClient();
    if (!client) return fallback;
    const result = await run(client);
    if (result === null || result === undefined) return fallback;
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[data] Supabase read failed, using demo data:", (error as Error).message);
    }
    return fallback;
  }
}

/* ==========================================================================
   Products
   ========================================================================== */

export function applyProductFilters(products: Product[], filters: ProductFilters = {}) {
  const {
    category,
    collection,
    q,
    minPrice,
    maxPrice,
    sizes,
    colors,
    availability,
    tags,
    featured,
    trending,
    bestSeller,
    newArrival,
    includeUnpublished,
  } = filters;

  let result = products.filter((p) => includeUnpublished || p.isPublished);

  if (category) result = result.filter((p) => p.categorySlug === category);
  if (collection) result = result.filter((p) => p.collectionSlugs.includes(collection));
  if (featured) result = result.filter((p) => p.isFeatured);
  if (trending) result = result.filter((p) => p.isTrending);
  if (bestSeller) result = result.filter((p) => p.isBestSeller);
  if (newArrival) result = result.filter((p) => p.isNewArrival);

  if (q) {
    const needle = q.toLowerCase().trim();
    result = result.filter((p) =>
      [p.name, p.shortDescription, p.description, p.categoryName, p.brand, ...p.tags, ...p.colors]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle))
    );
  }

  if (typeof minPrice === "number") {
    result = result.filter((p) => effectivePrice(p.price, p.salePrice) >= minPrice);
  }
  if (typeof maxPrice === "number") {
    result = result.filter((p) => effectivePrice(p.price, p.salePrice) <= maxPrice);
  }
  if (sizes?.length) result = result.filter((p) => p.sizes.some((s) => sizes.includes(s)));
  if (colors?.length) result = result.filter((p) => p.colors.some((c) => colors.includes(c)));
  if (tags?.length) result = result.filter((p) => p.tags.some((t) => tags.includes(t)));
  if (availability === "in_stock") result = result.filter((p) => p.stockQuantity > 0);
  if (availability === "out_of_stock") result = result.filter((p) => p.stockQuantity <= 0);

  return result;
}

export function sortProducts(products: Product[], sort: ProductFilters["sort"] = "newest") {
  const items = [...products];
  switch (sort) {
    case "price_asc":
      return items.sort(
        (a, b) => effectivePrice(a.price, a.salePrice) - effectivePrice(b.price, b.salePrice)
      );
    case "price_desc":
      return items.sort(
        (a, b) => effectivePrice(b.price, b.salePrice) - effectivePrice(a.price, a.salePrice)
      );
    case "name_asc":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "best_selling":
      return items.sort((a, b) => b.soldCount - a.soldCount);
    case "rating":
      return items.sort((a, b) => b.ratingAverage - a.ratingAverage);
    case "newest":
    default:
      return items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function paginate<T>(items: T[], page = 1, perPage = 12): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

/** Full catalogue (cached per request). Small catalogues are cheaper to filter
 *  in memory than to round-trip for each facet combination. */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("products")
      .select(PRODUCT_SELECT)
      .order("display_order", { ascending: true })
      .limit(1000);
    if (error) throw error;
    return (data ?? []).map((row) => mapProduct(row as Record<string, unknown>));
  }, seedProducts);
});

export async function getProducts(filters: ProductFilters = {}): Promise<Paginated<Product>> {
  const all = await getAllProducts();
  const filtered = applyProductFilters(all, filters);
  const sorted = sortProducts(filtered, filters.sort);
  return paginate(sorted, filters.page ?? 1, filters.perPage ?? 12);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const byId = all.filter((p) => product.relatedProductIds.includes(p.id) && p.isPublished);
  if (byId.length >= limit) return byId.slice(0, limit);

  const fallback = all.filter(
    (p) =>
      p.id !== product.id &&
      p.isPublished &&
      !byId.some((b) => b.id === p.id) &&
      (p.categorySlug === product.categorySlug ||
        p.collectionSlugs.some((c) => product.collectionSlugs.includes(c)))
  );
  return [...byId, ...fallback].slice(0, limit);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const all = await getAllProducts();
  return ids.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

export async function getProductFacets() {
  const products = (await getAllProducts()).filter((p) => p.isPublished);
  const sizes = new Set<string>();
  const colors = new Map<string, string>();
  const tags = new Set<string>();
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  for (const p of products) {
    p.sizes.forEach((s) => sizes.add(s));
    p.tags.forEach((t) => tags.add(t));
    p.variants.forEach((v) => {
      if (v.color) colors.set(v.color, v.colorHex ?? "#999999");
    });
    p.colors.forEach((c) => {
      if (!colors.has(c)) colors.set(c, "#999999");
    });
    const price = effectivePrice(p.price, p.salePrice);
    min = Math.min(min, price);
    max = Math.max(max, price);
  }

  const sizeOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
  return {
    sizes: Array.from(sizes).sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)),
    colors: Array.from(colors.entries()).map(([name, hex]) => ({ name, hex })),
    tags: Array.from(tags).sort(),
    minPrice: Number.isFinite(min) ? Math.floor(min / 500) * 500 : 0,
    maxPrice: Math.ceil(max / 500) * 500,
  };
}

/* ==========================================================================
   Taxonomy
   ========================================================================== */

export const getCategories = cache(async (): Promise<Category[]> => {
  const categories = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapCategory(row as Record<string, unknown>));
  }, seedCategories);

  const products = await getAllProducts();
  return categories.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.categorySlug === c.slug && p.isPublished).length,
  }));
});

export async function getActiveCategories() {
  return (await getCategories()).filter((c) => c.isActive);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}

export const getCollections = cache(async (): Promise<Collection[]> => {
  const collections = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("collections")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapCollection(row as Record<string, unknown>));
  }, seedCollections);

  const products = await getAllProducts();
  return collections.map((c) => ({
    ...c,
    productCount: products.filter((p) => p.collectionSlugs.includes(c.slug) && p.isPublished)
      .length,
  }));
});

export async function getActiveCollections() {
  const now = Date.now();
  return (await getCollections()).filter((c) => {
    if (!c.isActive) return false;
    if (c.startsAt && new Date(c.startsAt).getTime() > now) return false;
    if (c.endsAt && new Date(c.endsAt).getTime() < now) return false;
    return true;
  });
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  return (await getCollections()).find((c) => c.slug === slug) ?? null;
}

/* ==========================================================================
   Homepage, settings, navigation
   ========================================================================== */

export const getHomeSections = cache(async (): Promise<HomeSection[]> => {
  const sections = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("home_sections")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapHomeSection(row as Record<string, unknown>));
  }, seedHomeSections);
  return [...sections].sort((a, b) => a.displayOrder - b.displayOrder);
});

export async function getActiveHomeSections() {
  return (await getHomeSections()).filter((s) => s.isActive);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client.from("site_settings").select("data").eq("id", 1).single();
    if (error) throw error;
    const stored = (data?.data ?? {}) as Partial<SiteSettings>;
    return { ...seedSettings, ...stored } as SiteSettings;
  }, seedSettings);
});

export const getGlobalSeo = cache(async (): Promise<GlobalSeo> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client.from("global_seo").select("data").eq("id", 1).single();
    if (error) throw error;
    const stored = (data?.data ?? {}) as Partial<GlobalSeo>;
    return { ...seedGlobalSeo, ...stored } as GlobalSeo;
  }, seedGlobalSeo);
});

export const getNavigation = cache(async (): Promise<NavigationItem[]> => {
  const items = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("navigation_items")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapNavigationItem(row as Record<string, unknown>));
  }, seedNavigation);
  return items.filter((i) => i.isActive);
});

export async function getNavigationFor(location: NavigationItem["location"]) {
  return (await getNavigation())
    .filter((i) => i.location === location)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export const getBanners = cache(async (): Promise<Banner[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapBanner(row as Record<string, unknown>));
  }, seedBanners);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const items = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map((row) => mapTestimonial(row as Record<string, unknown>));
  }, seedTestimonials);
  return items;
});

export async function getActiveTestimonials() {
  return (await getTestimonials()).filter((t) => t.isActive);
}

/* ==========================================================================
   Reviews
   ========================================================================== */

export const getAllReviews = cache(async (): Promise<Review[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("reviews")
      .select("*, products:product_id ( name )")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapReview(row as Record<string, unknown>));
  }, seedReviews);
});

export async function getApprovedReviews(productId: string) {
  return (await getAllReviews()).filter(
    (r) => r.productId === productId && r.status === "approved"
  );
}

/* ==========================================================================
   Blog & pages
   ========================================================================== */

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await fromSupabase(async (client) => {
    const { data, error } = await client
      .from("blog_posts")
      .select("*, blog_categories:category_id ( name, slug )")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapBlogPost(row as Record<string, unknown>));
  }, seedBlogPosts);
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
});

export async function getPublishedPosts() {
  const now = Date.now();
  return (await getBlogPosts()).filter(
    (p) => p.status === "published" && new Date(p.publishedAt).getTime() <= now
  );
}

export async function getBlogPostBySlug(slug: string) {
  return (await getBlogPosts()).find((p) => p.slug === slug) ?? null;
}

export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client.from("blog_categories").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
    }));
  }, seedBlogCategories);
});

export const getPages = cache(async (): Promise<SitePage[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client.from("pages").select("*").order("title");
    if (error) throw error;
    return (data ?? []).map((row) => mapPage(row as Record<string, unknown>));
  }, seedPages);
});

export async function getPageBySlug(slug: string) {
  return (await getPages()).find((p) => p.slug === slug) ?? null;
}

/* ==========================================================================
   Commerce
   ========================================================================== */

export const getCoupons = cache(async (): Promise<Coupon[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client.from("coupons").select("*").order("code");
    if (error) throw error;
    return (data ?? []).map((row) => mapCoupon(row as Record<string, unknown>));
  }, seedCoupons);
});

export async function findCoupon(code: string) {
  const normalized = code.trim().toUpperCase();
  return (await getCoupons()).find((c) => c.code === normalized) ?? null;
}

export const getOrders = cache(async (): Promise<Order[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("orders")
      .select("*, order_items ( * )")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
  }, seedOrders);
});

export async function getOrderByNumber(orderNumber: string) {
  return (await getOrders()).find((o) => o.orderNumber === orderNumber) ?? null;
}

export async function getOrderById(id: string) {
  return (await getOrders()).find((o) => o.id === id) ?? null;
}

/** Orders for the signed-in customer. Runs through the RLS-scoped client. */
export async function getMyOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const client = await getSupabaseServerClient();
    if (!client) return [];
    const { data, error } = await client
      .from("orders")
      .select("*, order_items ( * )")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapOrder(row as Record<string, unknown>));
  } catch {
    return [];
  }
}

export const getCustomers = cache(async (): Promise<Customer[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []).map((row) => mapCustomer(row as Record<string, unknown>));
  }, seedCustomers);
});

export const getMediaItems = cache(async (): Promise<MediaItem[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []).map((row) => mapMedia(row as Record<string, unknown>));
  }, seedMedia);
});

export const getInventoryTransactions = cache(async (): Promise<InventoryTransaction[]> => {
  return fromSupabase(async (client) => {
    const { data, error } = await client
      .from("inventory_transactions")
      .select("*, products:product_id ( name )")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data ?? []).map((row) => mapInventoryTransaction(row as Record<string, unknown>));
  }, seedInventoryTransactions);
});

/* ==========================================================================
   Dashboard aggregates
   ========================================================================== */

export async function getDashboardStats() {
  const [orders, products, customers] = await Promise.all([
    getOrders(),
    getAllProducts(),
    getCustomers(),
  ]);

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === "paid" && o.status !== "cancelled" && o.status !== "refunded"
  );
  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  );
  const outOfStock = products.filter((p) => p.stockQuantity <= 0);

  const salesByDay = new Map<string, number>();
  for (const order of paidOrders) {
    const key = order.createdAt.slice(0, 10);
    salesByDay.set(key, (salesByDay.get(key) ?? 0) + order.total);
  }
  const series = Array.from(salesByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, total]) => ({ date, total }));

  const topProducts = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);

  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    revenue,
    orderCount: orders.length,
    customerCount: customers.length,
    productCount: products.length,
    publishedCount: products.filter((p) => p.isPublished).length,
    lowStock,
    outOfStock,
    recentOrders: orders.slice(0, 6),
    recentCustomers: customers.slice(0, 5),
    topProducts,
    series,
    statusCounts,
    averageOrderValue: paidOrders.length ? Math.round(revenue / paidOrders.length) : 0,
  };
}

/* ==========================================================================
   Search
   ========================================================================== */

export async function searchProducts(query: string, limit = 8) {
  if (!query.trim()) return [];
  const all = await getAllProducts();
  return applyProductFilters(all, { q: query }).slice(0, limit);
}

export async function getSearchSuggestions(query: string) {
  const [products, categories, collections] = await Promise.all([
    searchProducts(query, 6),
    getActiveCategories(),
    getActiveCollections(),
  ]);
  const needle = query.toLowerCase().trim();
  return {
    products,
    categories: categories.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4),
    collections: collections.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4),
  };
}
