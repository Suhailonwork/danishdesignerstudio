/** Domain model shared by the storefront, the admin panel and the data layer. */

export type UUID = string;

export interface SeoFields {
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string[] | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: UUID | null;
  displayOrder: number;
  isActive: boolean;
  seo?: SeoFields | null;
  productCount?: number;
}

export interface Collection {
  id: UUID;
  name: string;
  slug: string;
  description?: string | null;
  bannerImage?: string | null;
  thumbnail?: string | null;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  seo?: SeoFields | null;
  productCount?: number;
}

export interface ProductImage {
  id: UUID;
  url: string;
  alt: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: UUID;
  productId: UUID;
  sku: string;
  size?: string | null;
  color?: string | null;
  colorHex?: string | null;
  price?: number | null;
  salePrice?: number | null;
  stockQuantity: number;
  isActive: boolean;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  sku: string;
  categoryId?: UUID | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  brand: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  material?: string | null;
  fabric?: string | null;
  careInstructions?: string | null;
  tags: string[];
  sizes: string[];
  colors: string[];
  images: ProductImage[];
  videoUrl?: string | null;
  variants: ProductVariant[];
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  displayOrder: number;
  relatedProductIds: string[];
  collectionSlugs: string[];
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
  seo?: SeoFields | null;
  createdAt: string;
  updatedAt: string;
}

export type HomeSectionType =
  | "hero"
  | "featured_categories"
  | "new_arrivals"
  | "best_sellers"
  | "trending"
  | "editorial"
  | "collection_banner"
  | "inspiration"
  | "testimonials"
  | "instagram"
  | "newsletter"
  | "trust_badges"
  | "marquee_banner";

export interface HomeSection {
  id: UUID;
  type: HomeSectionType;
  title?: string | null;
  subtitle?: string | null;
  displayOrder: number;
  isActive: boolean;
  /** Flexible per-type payload so new sections never need a schema change. */
  config: Record<string, unknown>;
}

export interface Banner {
  id: UUID;
  title: string;
  subtitle?: string | null;
  eyebrow?: string | null;
  image: string;
  mobileImage?: string | null;
  linkUrl: string;
  buttonText: string;
  placement: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: UUID;
  authorName: string;
  location?: string | null;
  rating: number;
  content: string;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface Review {
  id: UUID;
  productId: UUID;
  productName?: string;
  userId?: UUID | null;
  authorName: string;
  rating: number;
  title?: string | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface BlogCategory {
  id: UUID;
  name: string;
  slug: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: UUID;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string;
  readingMinutes: number;
  faqs: BlogFaq[];
  seo?: SeoFields | null;
}

export interface SitePage {
  id: UUID;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  seo?: SeoFields | null;
  updatedAt: string;
}

export type NavLocation = "main" | "footer_customer" | "footer_categories" | "footer_policies";

export interface NavigationItem {
  id: UUID;
  label: string;
  href: string;
  parentId?: UUID | null;
  badge?: string | null;
  displayOrder: number;
  isActive: boolean;
  location: NavLocation;
}

export interface Coupon {
  id: UUID;
  code: string;
  description?: string | null;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
}

export interface Address {
  id: UUID;
  userId: UUID;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type ShippingAddress = Omit<Address, "id" | "userId" | "isDefault" | "label">;

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface OrderItem {
  id: UUID;
  productId: UUID;
  variantId?: UUID | null;
  name: string;
  slug: string;
  image?: string | null;
  sku: string;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  userId?: UUID | null;
  email: string;
  phone: string;
  customerName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string | null;
  trackingNumber?: string | null;
  courier?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: UUID;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  isAdmin?: boolean;
}

export interface MediaItem {
  id: UUID;
  name: string;
  url: string;
  bucket: string;
  path: string;
  mimeType: string;
  sizeBytes: number;
  alt?: string | null;
  folder?: string | null;
  createdAt: string;
}

export interface InventoryTransaction {
  id: UUID;
  productId: UUID;
  productName?: string;
  variantId?: UUID | null;
  changeType: "restock" | "sale" | "adjustment" | "return" | "damage";
  quantityChange: number;
  quantityAfter: number;
  reason?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

export interface AnnouncementItem {
  text: string;
  linkText: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

/** Imagery on the hand-written pages, so those are editable too. */
export interface PageImages {
  aboutHero: string;
  aboutPrimary: string;
  aboutSecondary: string;
  contactHero: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  taxRate: number;
  announcements: AnnouncementItem[];
  socials: SocialLink[];
  footerDescription: string;
  newsletterHeading: string;
  newsletterSubtext: string;
  instagramHandle: string;
  pageImages: PageImages;
}

export interface GlobalSeo {
  siteTitle: string;
  titleTemplate: string;
  metaDescription: string;
  keywords: string[];
  defaultOgImage: string;
  twitterHandle: string;
  twitterCardType: "summary" | "summary_large_image";
  organizationName: string;
  organizationLogo: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  googleSiteVerification?: string | null;
}

export interface CartLine {
  productId: UUID;
  variantId?: string | null;
  slug: string;
  name: string;
  image: string;
  sku: string;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  compareAtPrice?: number | null;
  quantity: number;
  maxQuantity: number;
}

export interface WishlistLine {
  productId: UUID;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number | null;
}

export type ProductSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "best_selling"
  | "rating";

export interface ProductFilters {
  category?: string;
  collection?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  availability?: "in_stock" | "out_of_stock";
  tags?: string[];
  sort?: ProductSort;
  page?: number;
  perPage?: number;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  includeUnpublished?: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
