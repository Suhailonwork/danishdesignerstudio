import type {
  Banner,
  BlogPost,
  Category,
  Collection,
  Coupon,
  Customer,
  HomeSection,
  InventoryTransaction,
  MediaItem,
  NavigationItem,
  Order,
  Product,
  ProductImage,
  ProductVariant,
  Review,
  SeoFields,
  SitePage,
  Testimonial,
} from "@/types";
import { readingTime } from "@/lib/utils";
import { stockStatusFor } from "./seed";

/* Row shapes are loose on purpose: Supabase returns `any`-ish JSON and we
   normalise it here, once, instead of sprinkling casts through the UI. */
type Row = Record<string, unknown>;

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number.parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
};
const bool = (v: unknown, fallback = false) => (typeof v === "boolean" ? v : fallback);
const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : []);
const nullableStr = (v: unknown) => (typeof v === "string" && v.length ? v : null);

export function mapSeo(value: unknown): SeoFields | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Row;
  return {
    metaTitle: nullableStr(v.meta_title ?? v.metaTitle),
    metaDescription: nullableStr(v.meta_description ?? v.metaDescription),
    keywords: Array.isArray(v.keywords) ? arr(v.keywords) : null,
    canonicalUrl: nullableStr(v.canonical_url ?? v.canonicalUrl),
    ogTitle: nullableStr(v.og_title ?? v.ogTitle),
    ogDescription: nullableStr(v.og_description ?? v.ogDescription),
    ogImage: nullableStr(v.og_image ?? v.ogImage),
    noIndex: bool(v.no_index ?? v.noIndex),
    noFollow: bool(v.no_follow ?? v.noFollow),
  };
}

export function mapCategory(row: Row): Category {
  return {
    id: str(row.id),
    name: str(row.name),
    slug: str(row.slug),
    description: nullableStr(row.description),
    image: nullableStr(row.image),
    parentId: nullableStr(row.parent_id),
    displayOrder: num(row.display_order),
    isActive: bool(row.is_active, true),
    seo: mapSeo(row.seo),
    productCount: typeof row.product_count === "number" ? row.product_count : undefined,
  };
}

export function mapCollection(row: Row): Collection {
  return {
    id: str(row.id),
    name: str(row.name),
    slug: str(row.slug),
    description: nullableStr(row.description),
    bannerImage: nullableStr(row.banner_image),
    thumbnail: nullableStr(row.thumbnail),
    displayOrder: num(row.display_order),
    isActive: bool(row.is_active, true),
    isFeatured: bool(row.is_featured),
    startsAt: nullableStr(row.starts_at),
    endsAt: nullableStr(row.ends_at),
    seo: mapSeo(row.seo),
    productCount: typeof row.product_count === "number" ? row.product_count : undefined,
  };
}

export function mapProductImage(row: Row): ProductImage {
  return {
    id: str(row.id),
    url: str(row.url),
    alt: str(row.alt),
    displayOrder: num(row.display_order),
  };
}

export function mapVariant(row: Row): ProductVariant {
  return {
    id: str(row.id),
    productId: str(row.product_id),
    sku: str(row.sku),
    size: nullableStr(row.size),
    color: nullableStr(row.color),
    colorHex: nullableStr(row.color_hex),
    price: row.price === null || row.price === undefined ? null : num(row.price),
    salePrice: row.sale_price === null || row.sale_price === undefined ? null : num(row.sale_price),
    stockQuantity: num(row.stock_quantity),
    isActive: bool(row.is_active, true),
  };
}

export function mapProduct(row: Row): Product {
  const category = (row.categories ?? row.category) as Row | null | undefined;
  const images = Array.isArray(row.product_images)
    ? (row.product_images as Row[]).map(mapProductImage).sort((a, b) => a.displayOrder - b.displayOrder)
    : [];
  const variants = Array.isArray(row.product_variants)
    ? (row.product_variants as Row[]).map(mapVariant)
    : [];
  const collectionLinks = Array.isArray(row.collection_products)
    ? (row.collection_products as Row[])
        .map((cp) => {
          const col = cp.collections as Row | undefined;
          return col ? str(col.slug) : "";
        })
        .filter(Boolean)
    : [];

  const stockQuantity = num(row.stock_quantity);
  const threshold = num(row.low_stock_threshold, 5);

  return {
    id: str(row.id),
    name: str(row.name),
    slug: str(row.slug),
    sku: str(row.sku),
    categoryId: nullableStr(row.category_id),
    categorySlug: category ? str(category.slug) : null,
    categoryName: category ? str(category.name) : null,
    brand: str(row.brand, "Danish Designer Studio"),
    shortDescription: nullableStr(row.short_description),
    description: nullableStr(row.description),
    price: num(row.price),
    salePrice: row.sale_price === null || row.sale_price === undefined ? null : num(row.sale_price),
    costPrice: row.cost_price === null || row.cost_price === undefined ? null : num(row.cost_price),
    stockQuantity,
    lowStockThreshold: threshold,
    stockStatus:
      (nullableStr(row.stock_status) as Product["stockStatus"]) ??
      stockStatusFor(stockQuantity, threshold),
    material: nullableStr(row.material),
    fabric: nullableStr(row.fabric),
    careInstructions: nullableStr(row.care_instructions),
    tags: arr(row.tags),
    sizes: arr(row.sizes),
    colors: arr(row.colors),
    images: images.length
      ? images
      : [
          {
            id: `${str(row.id)}-placeholder`,
            url: "/media/banners/og-default.v3.jpg",
            alt: str(row.name),
            displayOrder: 1,
          },
        ],
    videoUrl: nullableStr(row.video_url),
    variants,
    isFeatured: bool(row.is_featured),
    isTrending: bool(row.is_trending),
    isBestSeller: bool(row.is_best_seller),
    isNewArrival: bool(row.is_new_arrival),
    isPublished: bool(row.is_published, true),
    displayOrder: num(row.display_order),
    relatedProductIds: arr(row.related_product_ids),
    collectionSlugs: collectionLinks,
    ratingAverage: num(row.rating_average),
    ratingCount: num(row.rating_count),
    soldCount: num(row.sold_count),
    seo: mapSeo(row.seo),
    createdAt: str(row.created_at, new Date().toISOString()),
    updatedAt: str(row.updated_at, new Date().toISOString()),
  };
}

export function mapHomeSection(row: Row): HomeSection {
  return {
    id: str(row.id),
    type: str(row.type) as HomeSection["type"],
    title: nullableStr(row.title),
    subtitle: nullableStr(row.subtitle),
    displayOrder: num(row.display_order),
    isActive: bool(row.is_active, true),
    config: (row.config && typeof row.config === "object" ? row.config : {}) as Record<
      string,
      unknown
    >,
  };
}

export function mapBanner(row: Row): Banner {
  return {
    id: str(row.id),
    title: str(row.title),
    subtitle: nullableStr(row.subtitle),
    eyebrow: nullableStr(row.eyebrow),
    image: str(row.image),
    mobileImage: nullableStr(row.mobile_image),
    linkUrl: str(row.link_url, "/shop"),
    buttonText: str(row.button_text, "Shop now"),
    placement: str(row.placement, "home_hero"),
    displayOrder: num(row.display_order),
    isActive: bool(row.is_active, true),
  };
}

export function mapTestimonial(row: Row): Testimonial {
  return {
    id: str(row.id),
    authorName: str(row.author_name),
    location: nullableStr(row.location),
    rating: num(row.rating, 5),
    content: str(row.content),
    image: nullableStr(row.image),
    isActive: bool(row.is_active, true),
    displayOrder: num(row.display_order),
  };
}

export function mapReview(row: Row): Review {
  const product = row.products as Row | undefined;
  return {
    id: str(row.id),
    productId: str(row.product_id),
    productName: product ? str(product.name) : undefined,
    userId: nullableStr(row.user_id),
    authorName: str(row.author_name, "Customer"),
    rating: num(row.rating, 5),
    title: nullableStr(row.title),
    content: str(row.content),
    status: (str(row.status, "pending") as Review["status"]) ?? "pending",
    isFeatured: bool(row.is_featured),
    isVerifiedPurchase: bool(row.is_verified_purchase),
    createdAt: str(row.created_at, new Date().toISOString()),
  };
}

export function mapBlogPost(row: Row): BlogPost {
  const category = row.blog_categories as Row | undefined;
  const content = str(row.content);
  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    excerpt: str(row.excerpt),
    content,
    coverImage: str(row.cover_image, "/media/banners/og-default.v3.jpg"),
    authorName: str(row.author_name, "Danish Designer Studio Studio"),
    categorySlug: category ? str(category.slug) : str(row.category_slug, "style-guides"),
    categoryName: category ? str(category.name) : str(row.category_name, "Style Guides"),
    tags: arr(row.tags),
    status: (str(row.status, "draft") as BlogPost["status"]) ?? "draft",
    publishedAt: str(row.published_at, new Date().toISOString()),
    readingMinutes: num(row.reading_minutes) || readingTime(content),
    faqs: Array.isArray(row.faqs)
      ? (row.faqs as Row[]).map((f) => ({
          question: str(f.question),
          answer: str(f.answer),
        }))
      : [],
    seo: mapSeo(row.seo),
  };
}

export function mapPage(row: Row): SitePage {
  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    content: str(row.content),
    isPublished: bool(row.is_published, true),
    seo: mapSeo(row.seo),
    updatedAt: str(row.updated_at, new Date().toISOString()),
  };
}

export function mapNavigationItem(row: Row): NavigationItem {
  return {
    id: str(row.id),
    label: str(row.label),
    href: str(row.href, "#"),
    parentId: nullableStr(row.parent_id),
    badge: nullableStr(row.badge),
    displayOrder: num(row.display_order),
    isActive: bool(row.is_active, true),
    location: (str(row.location, "main") as NavigationItem["location"]) ?? "main",
  };
}

export function mapCoupon(row: Row): Coupon {
  return {
    id: str(row.id),
    code: str(row.code).toUpperCase(),
    description: nullableStr(row.description),
    discountType: (str(row.discount_type, "percentage") as Coupon["discountType"]) ?? "percentage",
    discountValue: num(row.discount_value),
    minOrderValue: num(row.min_order_value),
    maxDiscount:
      row.max_discount === null || row.max_discount === undefined ? null : num(row.max_discount),
    usageLimit:
      row.usage_limit === null || row.usage_limit === undefined ? null : num(row.usage_limit),
    usedCount: num(row.used_count),
    startsAt: nullableStr(row.starts_at),
    expiresAt: nullableStr(row.expires_at),
    isActive: bool(row.is_active, true),
  };
}

export function mapOrder(row: Row): Order {
  const items = Array.isArray(row.order_items)
    ? (row.order_items as Row[]).map((item) => ({
        id: str(item.id),
        productId: str(item.product_id),
        variantId: nullableStr(item.variant_id),
        name: str(item.name),
        slug: str(item.slug),
        image: nullableStr(item.image),
        sku: str(item.sku),
        size: nullableStr(item.size),
        color: nullableStr(item.color),
        unitPrice: num(item.unit_price),
        quantity: num(item.quantity, 1),
        total: num(item.total),
      }))
    : [];

  const address = (row.shipping_address ?? {}) as Row;

  return {
    id: str(row.id),
    orderNumber: str(row.order_number),
    userId: nullableStr(row.user_id),
    email: str(row.email),
    phone: str(row.phone),
    customerName: str(row.customer_name),
    status: (str(row.status, "pending") as Order["status"]) ?? "pending",
    paymentStatus: (str(row.payment_status, "unpaid") as Order["paymentStatus"]) ?? "unpaid",
    paymentMethod: str(row.payment_method, "Razorpay"),
    shippingAddress: {
      fullName: str(address.fullName ?? address.full_name),
      phone: str(address.phone),
      line1: str(address.line1),
      line2: nullableStr(address.line2),
      city: str(address.city),
      state: str(address.state),
      postalCode: str(address.postalCode ?? address.postal_code),
      country: str(address.country, "India"),
    },
    items,
    subtotal: num(row.subtotal),
    discount: num(row.discount),
    shipping: num(row.shipping),
    tax: num(row.tax),
    total: num(row.total),
    couponCode: nullableStr(row.coupon_code),
    trackingNumber: nullableStr(row.tracking_number),
    courier: nullableStr(row.courier),
    notes: nullableStr(row.notes),
    createdAt: str(row.created_at, new Date().toISOString()),
    updatedAt: str(row.updated_at, new Date().toISOString()),
  };
}

export function mapCustomer(row: Row): Customer {
  return {
    id: str(row.id),
    email: str(row.email),
    fullName: str(row.full_name, "Customer"),
    phone: nullableStr(row.phone),
    avatarUrl: nullableStr(row.avatar_url),
    ordersCount: num(row.orders_count),
    totalSpent: num(row.total_spent),
    createdAt: str(row.created_at, new Date().toISOString()),
    isAdmin: bool(row.is_admin),
  };
}

export function mapMedia(row: Row): MediaItem {
  return {
    id: str(row.id),
    name: str(row.name),
    url: str(row.url),
    bucket: str(row.bucket, "site-assets"),
    path: str(row.path),
    mimeType: str(row.mime_type, "image/jpeg"),
    sizeBytes: num(row.size_bytes),
    alt: nullableStr(row.alt),
    folder: nullableStr(row.folder),
    createdAt: str(row.created_at, new Date().toISOString()),
  };
}

export function mapInventoryTransaction(row: Row): InventoryTransaction {
  const product = row.products as Row | undefined;
  return {
    id: str(row.id),
    productId: str(row.product_id),
    productName: product ? str(product.name) : undefined,
    variantId: nullableStr(row.variant_id),
    changeType: (str(row.change_type, "adjustment") as InventoryTransaction["changeType"]) ??
      "adjustment",
    quantityChange: num(row.quantity_change),
    quantityAfter: num(row.quantity_after),
    reason: nullableStr(row.reason),
    createdBy: nullableStr(row.created_by),
    createdAt: str(row.created_at, new Date().toISOString()),
  };
}

/** Domain -> DB column names, used by the admin write paths. */
export function seoToRow(seo: SeoFields | null | undefined) {
  if (!seo) return null;
  return {
    meta_title: seo.metaTitle ?? null,
    meta_description: seo.metaDescription ?? null,
    keywords: seo.keywords ?? null,
    canonical_url: seo.canonicalUrl ?? null,
    og_title: seo.ogTitle ?? null,
    og_description: seo.ogDescription ?? null,
    og_image: seo.ogImage ?? null,
    no_index: seo.noIndex ?? false,
    no_follow: seo.noFollow ?? false,
  };
}
