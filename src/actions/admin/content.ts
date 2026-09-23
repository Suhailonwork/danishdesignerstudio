"use server";

import { z } from "zod";

import { seoToRow } from "@/lib/data/mappers";
import { readingTime, slugify } from "@/lib/utils";

import { getWritableClient, revalidateStorefront, type AdminResult } from "./core";

function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

function seoFromForm(formData: FormData, fallbackImage?: string | null) {
  return seoToRow({
    metaTitle: (formData.get("metaTitle") as string) || null,
    metaDescription: (formData.get("metaDescription") as string) || null,
    keywords: String(formData.get("keywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    canonicalUrl: (formData.get("canonicalUrl") as string) || null,
    ogTitle: (formData.get("ogTitle") as string) || null,
    ogDescription: (formData.get("ogDescription") as string) || null,
    ogImage: (formData.get("ogImage") as string) || fallbackImage || null,
    noIndex: checkbox(formData, "noIndex"),
    noFollow: checkbox(formData, "noFollow"),
  });
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required").max(120),
  slug: z.string().max(120).optional(),
  description: z.string().max(1000).optional(),
  image: z.string().max(500).optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export async function saveCategory(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const row = {
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    image: parsed.data.image || null,
    display_order: parsed.data.displayOrder,
    is_active: checkbox(formData, "isActive"),
    seo: seoFromForm(formData, parsed.data.image),
  };

  const { error } = parsed.data.id
    ? await access.client.from("categories").update(row).eq("id", parsed.data.id)
    : await access.client.from("categories").insert(row);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront([`/category/${slug}`, "/admin/categories"]);
  return { ok: true, message: parsed.data.id ? "Category saved." : "Category created." };
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const collectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required").max(120),
  slug: z.string().max(120).optional(),
  description: z.string().max(1000).optional(),
  bannerImage: z.string().max(500).optional(),
  thumbnail: z.string().max(500).optional(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  startsAt: z.string().max(40).optional(),
  endsAt: z.string().max(40).optional(),
});

export async function saveCollection(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const parsed = collectionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const row = {
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    banner_image: parsed.data.bannerImage || null,
    thumbnail: parsed.data.thumbnail || null,
    display_order: parsed.data.displayOrder,
    is_active: checkbox(formData, "isActive"),
    is_featured: checkbox(formData, "isFeatured"),
    starts_at: parsed.data.startsAt || null,
    ends_at: parsed.data.endsAt || null,
    seo: seoFromForm(formData, parsed.data.bannerImage),
  };

  const { data, error } = parsed.data.id
    ? await access.client
        .from("collections")
        .update(row)
        .eq("id", parsed.data.id)
        .select("id")
        .single()
    : await access.client.from("collections").insert(row).select("id").single();

  if (error) return { ok: false, message: error.message };

  // Product membership
  const productIds = formData.getAll("productIds").map(String).filter(Boolean);
  const collectionId = String(data.id);
  await access.client.from("collection_products").delete().eq("collection_id", collectionId);
  if (productIds.length) {
    await access.client.from("collection_products").insert(
      productIds.map((productId, index) => ({
        collection_id: collectionId,
        product_id: productId,
        display_order: index + 1,
      }))
    );
  }

  await revalidateStorefront([`/collection/${slug}`, "/admin/collections"]);
  return { ok: true, message: parsed.data.id ? "Collection saved." : "Collection created." };
}

/* ------------------------------------------------------------------ */
/* Blog                                                                */
/* ------------------------------------------------------------------ */

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required").max(200),
  slug: z.string().max(200).optional(),
  excerpt: z.string().min(10, "Write a short excerpt").max(400),
  content: z.string().min(50, "The article needs some content").max(60000),
  coverImage: z.string().max(500).optional(),
  authorName: z.string().max(120).optional(),
  categoryId: z.string().optional(),
  publishedAt: z.string().max(40).optional(),
});

export async function saveBlogPost(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const slug = slugify(parsed.data.slug || parsed.data.title);

  const faqs: { question: string; answer: string }[] = [];
  const questions = formData.getAll("faqQuestion").map(String);
  const answers = formData.getAll("faqAnswer").map(String);
  questions.forEach((question, index) => {
    if (question.trim() && answers[index]?.trim()) {
      faqs.push({ question: question.trim(), answer: answers[index].trim() });
    }
  });

  const row = {
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    cover_image: parsed.data.coverImage || null,
    author_name: parsed.data.authorName || "Danish Designer Studio Studio",
    category_id: parsed.data.categoryId || null,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    status: checkbox(formData, "isPublished") ? "published" : "draft",
    published_at: parsed.data.publishedAt || new Date().toISOString(),
    reading_minutes: readingTime(parsed.data.content),
    faqs,
    seo: seoFromForm(formData, parsed.data.coverImage),
  };

  const { error } = parsed.data.id
    ? await access.client.from("blog_posts").update(row).eq("id", parsed.data.id)
    : await access.client.from("blog_posts").insert(row);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront([`/blog/${slug}`, "/blog", "/admin/blog"]);
  return { ok: true, message: parsed.data.id ? "Article saved." : "Article created." };
}

/* ------------------------------------------------------------------ */
/* Static pages                                                        */
/* ------------------------------------------------------------------ */

const pageSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  content: z.string().min(20, "Add some page content").max(60000),
});

export async function savePage(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const parsed = pageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const slug = slugify(parsed.data.slug);
  const row = {
    title: parsed.data.title,
    slug,
    content: parsed.data.content,
    is_published: checkbox(formData, "isPublished"),
    seo: seoFromForm(formData),
    updated_at: new Date().toISOString(),
  };

  const { error } = parsed.data.id
    ? await access.client.from("pages").update(row).eq("id", parsed.data.id)
    : await access.client.from("pages").insert(row);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront([`/${slug}`, "/admin/pages"]);
  return { ok: true, message: parsed.data.id ? "Page saved." : "Page created." };
}

/* ------------------------------------------------------------------ */
/* Homepage sections                                                   */
/* ------------------------------------------------------------------ */

export async function saveHomeSection(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const id = String(formData.get("id") ?? "");
  const configRaw = String(formData.get("config") ?? "{}");

  let config: unknown;
  try {
    config = JSON.parse(configRaw);
  } catch {
    return {
      ok: false,
      message: "The section configuration is not valid JSON.",
      fieldErrors: { config: "Invalid JSON" },
    };
  }

  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const row = {
    type: String(formData.get("type") ?? "editorial"),
    title: (formData.get("title") as string) || null,
    subtitle: (formData.get("subtitle") as string) || null,
    display_order: Number(formData.get("displayOrder") ?? 0),
    is_active: checkbox(formData, "isActive"),
    config,
  };

  const { error } = id
    ? await access.client.from("home_sections").update(row).eq("id", id)
    : await access.client.from("home_sections").insert(row);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/homepage"]);
  return { ok: true, message: id ? "Section saved." : "Section created." };
}

/* ------------------------------------------------------------------ */
/* Simple resources: banners, testimonials, navigation, coupons        */
/* ------------------------------------------------------------------ */

export async function saveBanner(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { ok: false, message: "A banner title is required.", fieldErrors: { title: "Required" } };

  const row = {
    title,
    subtitle: (formData.get("subtitle") as string) || null,
    eyebrow: (formData.get("eyebrow") as string) || null,
    image: String(formData.get("image") ?? ""),
    mobile_image: (formData.get("mobileImage") as string) || null,
    link_url: String(formData.get("linkUrl") ?? "/shop"),
    button_text: String(formData.get("buttonText") ?? "Shop now"),
    placement: String(formData.get("placement") ?? "home_hero"),
    display_order: Number(formData.get("displayOrder") ?? 0),
    is_active: checkbox(formData, "isActive"),
  };

  const { error } = id
    ? await access.client.from("banners").update(row).eq("id", id)
    : await access.client.from("banners").insert(row);

  if (error) return { ok: false, message: error.message };
  await revalidateStorefront(["/admin/banners"]);
  return { ok: true, message: id ? "Banner saved." : "Banner created." };
}

export async function saveTestimonial(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const id = String(formData.get("id") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!authorName || content.length < 10) {
    return {
      ok: false,
      message: "Add an author name and a review of at least 10 characters.",
      fieldErrors: {
        ...(authorName ? {} : { authorName: "Required" }),
        ...(content.length >= 10 ? {} : { content: "Too short" }),
      },
    };
  }

  const row = {
    author_name: authorName,
    location: (formData.get("location") as string) || null,
    rating: Number(formData.get("rating") ?? 5),
    content,
    image: (formData.get("image") as string) || null,
    display_order: Number(formData.get("displayOrder") ?? 0),
    is_active: checkbox(formData, "isActive"),
  };

  const { error } = id
    ? await access.client.from("testimonials").update(row).eq("id", id)
    : await access.client.from("testimonials").insert(row);

  if (error) return { ok: false, message: error.message };
  await revalidateStorefront(["/admin/testimonials"]);
  return { ok: true, message: id ? "Testimonial saved." : "Testimonial created." };
}

export async function saveNavigationItem(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const id = String(formData.get("id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { ok: false, message: "A label is required.", fieldErrors: { label: "Required" } };

  const row = {
    label,
    href: String(formData.get("href") ?? "/"),
    badge: (formData.get("badge") as string) || null,
    location: String(formData.get("location") ?? "main"),
    display_order: Number(formData.get("displayOrder") ?? 0),
    is_active: checkbox(formData, "isActive"),
  };

  const { error } = id
    ? await access.client.from("navigation_items").update(row).eq("id", id)
    : await access.client.from("navigation_items").insert(row);

  if (error) return { ok: false, message: error.message };
  await revalidateStorefront(["/admin/navigation"]);
  return { ok: true, message: id ? "Link saved." : "Link created." };
}

export async function saveCoupon(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const id = String(formData.get("id") ?? "");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (code.length < 3) {
    return { ok: false, message: "Enter a coupon code.", fieldErrors: { code: "Required" } };
  }

  const row = {
    code,
    description: (formData.get("description") as string) || null,
    discount_type: String(formData.get("discountType") ?? "percentage"),
    discount_value: Number(formData.get("discountValue") ?? 0),
    min_order_value: Number(formData.get("minOrderValue") ?? 0),
    max_discount: formData.get("maxDiscount") ? Number(formData.get("maxDiscount")) : null,
    usage_limit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
    starts_at: (formData.get("startsAt") as string) || null,
    expires_at: (formData.get("expiresAt") as string) || null,
    is_active: checkbox(formData, "isActive"),
  };

  const { error } = id
    ? await access.client.from("coupons").update(row).eq("id", id)
    : await access.client.from("coupons").insert(row);

  if (error) return { ok: false, message: error.message };
  await revalidateStorefront(["/admin/coupons"]);
  return { ok: true, message: id ? "Coupon saved." : "Coupon created." };
}

/* ------------------------------------------------------------------ */
/* Reviews moderation                                                  */
/* ------------------------------------------------------------------ */

export async function setReviewStatus(
  id: string,
  status: "approved" | "rejected" | "pending"
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from("reviews").update({ status }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/reviews"]);
  return { ok: true, message: `Review ${status}.` };
}

export async function setReviewFeatured(id: string, featured: boolean): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from("reviews").update({ is_featured: featured }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/reviews"]);
  return { ok: true, message: "Updated." };
}
