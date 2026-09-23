"use client";

import Image from "next/image";
import Link from "next/link";

import type {
  Banner,
  Category,
  Collection,
  Coupon,
  NavigationItem,
  Product,
  SitePage,
  Testimonial,
} from "@/types";
import {
  saveBanner,
  saveCategory,
  saveCollection,
  saveCoupon,
  saveNavigationItem,
  savePage,
  saveTestimonial,
} from "@/actions/admin/content";
import { formatDate, formatPrice } from "@/lib/utils";

import { ResourceManager, type FieldDef } from "./resource-manager";
import { Pill, Td } from "./ui";

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

const categoryFields: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true, half: true },
  { name: "slug", label: "URL slug", type: "text", half: true, hint: "Leave blank to generate." },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "image", label: "Category image", type: "image", bucket: "category-images" },
  { name: "displayOrder", label: "Display order", type: "number", half: true, defaultValue: 0 },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true, half: true },
];

export function CategoriesManager({ categories }: { categories: Category[] }) {
  return (
    <ResourceManager<Category & { id: string }>
      table="categories"
      title="Categories"
      description="Shown in the Explore menu, the shop filters and the footer."
      createLabel="New category"
      items={categories}
      head={["Category", "Slug", "Products", "Order", "Status"]}
      fields={categoryFields}
      action={saveCategory}
      seo={{ pathPrefix: "/category", slugField: "slug", titleField: "name", imageField: "image" }}
      revalidate={["/shop"]}
      toFormValues={(item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
        image: item.image ?? "",
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      })}
      columns={(item) => (
        <>
          <Td>
            <div className="flex items-center gap-3">
              {item.image ? (
                <span className="relative aspect-4/5 w-9 shrink-0 overflow-hidden bg-ivory-deep">
                  <Image src={item.image} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ) : null}
              <span className="text-sm">{item.name}</span>
            </div>
          </Td>
          <Td className="text-xs text-ash">/{item.slug}</Td>
          <Td className="text-sm tabular-nums">{item.productCount ?? 0}</Td>
          <Td className="text-sm tabular-nums text-ash">{item.displayOrder}</Td>
          <Td>
            <Pill tone={item.isActive ? "success" : "muted"}>
              {item.isActive ? "Active" : "Hidden"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const collectionFields: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true, half: true },
  { name: "slug", label: "URL slug", type: "text", half: true, hint: "Leave blank to generate." },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "bannerImage", label: "Banner image", type: "image", bucket: "collection-images" },
  { name: "thumbnail", label: "Thumbnail", type: "image", bucket: "collection-images" },
  { name: "startsAt", label: "Starts on", type: "date", half: true, hint: "Optional." },
  { name: "endsAt", label: "Ends on", type: "date", half: true, hint: "Optional." },
  { name: "displayOrder", label: "Display order", type: "number", half: true, defaultValue: 0 },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true, half: true },
  {
    name: "isFeatured",
    label: "Featured",
    type: "toggle",
    hint: "Eligible for the homepage collection banners.",
  },
];

export function CollectionsManager({
  collections,
  products,
}: {
  collections: Collection[];
  products: Product[];
}) {
  return (
    <ResourceManager<Collection & { id: string }>
      table="collections"
      title="Collections"
      description="Curated edits such as Wedding, Groom or Eid. Publish one and it appears on the storefront immediately."
      createLabel="New collection"
      items={collections}
      head={["Collection", "Slug", "Products", "Window", "Status"]}
      fields={collectionFields}
      action={saveCollection}
      seo={{
        pathPrefix: "/collection",
        slugField: "slug",
        titleField: "name",
        imageField: "bannerImage",
      }}
      revalidate={["/collections"]}
      toFormValues={(item) => ({
        name: item.name,
        slug: item.slug,
        description: item.description ?? "",
        bannerImage: item.bannerImage ?? "",
        thumbnail: item.thumbnail ?? "",
        startsAt: item.startsAt ?? "",
        endsAt: item.endsAt ?? "",
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        isFeatured: item.isFeatured,
      })}
      extraFormContent={(item) => (
        <fieldset className="border border-line p-5">
          <legend className="px-2 text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            Products in this collection
          </legend>
          <div className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-2">
            {products.map((product) => (
              <label key={product.id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  defaultChecked={
                    item ? product.collectionSlugs.includes(item.slug) : false
                  }
                  className="h-4 w-4 shrink-0 accent-ink"
                />
                <span className="truncate">{product.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      columns={(item) => (
        <>
          <Td>
            <div className="flex items-center gap-3">
              {item.thumbnail || item.bannerImage ? (
                <span className="relative aspect-square w-9 shrink-0 overflow-hidden bg-ivory-deep">
                  <Image
                    src={(item.thumbnail || item.bannerImage)!}
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
              ) : null}
              <span className="text-sm">{item.name}</span>
            </div>
          </Td>
          <Td className="text-xs text-ash">/{item.slug}</Td>
          <Td className="text-sm tabular-nums">{item.productCount ?? 0}</Td>
          <Td className="text-xs text-ash">
            {item.startsAt || item.endsAt
              ? `${item.startsAt ? formatDate(item.startsAt) : "—"} → ${
                  item.endsAt ? formatDate(item.endsAt) : "—"
                }`
              : "Always on"}
          </Td>
          <Td>
            <div className="flex flex-wrap gap-1.5">
              <Pill tone={item.isActive ? "success" : "muted"}>
                {item.isActive ? "Active" : "Hidden"}
              </Pill>
              {item.isFeatured ? <Pill>Featured</Pill> : null}
            </div>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Banners                                                             */
/* ------------------------------------------------------------------ */

const bannerFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, half: true },
  { name: "eyebrow", label: "Eyebrow", type: "text", half: true },
  { name: "subtitle", label: "Subtitle", type: "text" },
  { name: "image", label: "Image", type: "image", bucket: "site-assets" },
  { name: "mobileImage", label: "Mobile image (optional)", type: "image", bucket: "site-assets" },
  { name: "buttonText", label: "Button text", type: "text", half: true, defaultValue: "Shop now" },
  { name: "linkUrl", label: "Button link", type: "text", half: true, defaultValue: "/shop" },
  {
    name: "placement",
    label: "Placement",
    type: "select",
    half: true,
    options: [
      { value: "home_hero", label: "Homepage hero" },
      { value: "home_hero_card", label: "Homepage hero card" },
      { value: "home_promo", label: "Homepage promotion" },
      { value: "shop_top", label: "Shop page" },
    ],
  },
  { name: "displayOrder", label: "Display order", type: "number", half: true, defaultValue: 0 },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true },
];

export function BannersManager({ banners }: { banners: Banner[] }) {
  return (
    <ResourceManager<Banner & { id: string }>
      table="banners"
      title="Banners"
      description="Promotional imagery used across the storefront."
      createLabel="New banner"
      items={banners}
      head={["Banner", "Placement", "Link", "Order", "Status"]}
      fields={bannerFields}
      action={saveBanner}
      toFormValues={(item) => ({
        title: item.title,
        eyebrow: item.eyebrow ?? "",
        subtitle: item.subtitle ?? "",
        image: item.image,
        mobileImage: item.mobileImage ?? "",
        buttonText: item.buttonText,
        linkUrl: item.linkUrl,
        placement: item.placement,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      })}
      columns={(item) => (
        <>
          <Td>
            <div className="flex items-center gap-3">
              {item.image ? (
                <span className="relative aspect-video w-14 shrink-0 overflow-hidden bg-ivory-deep">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
              ) : null}
              <span className="text-sm">{item.title}</span>
            </div>
          </Td>
          <Td className="text-xs text-ash">{item.placement.replace(/_/g, " ")}</Td>
          <Td className="text-xs text-ash">{item.linkUrl}</Td>
          <Td className="text-sm tabular-nums text-ash">{item.displayOrder}</Td>
          <Td>
            <Pill tone={item.isActive ? "success" : "muted"}>
              {item.isActive ? "Active" : "Hidden"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const testimonialFields: FieldDef[] = [
  { name: "authorName", label: "Customer name", type: "text", required: true, half: true },
  { name: "location", label: "Location", type: "text", half: true },
  {
    name: "rating",
    label: "Rating",
    type: "select",
    half: true,
    defaultValue: "5",
    options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} stars` })),
  },
  { name: "displayOrder", label: "Display order", type: "number", half: true, defaultValue: 0 },
  { name: "content", label: "Review", type: "textarea", rows: 5, required: true },
  { name: "image", label: "Avatar (optional)", type: "image", bucket: "avatars" },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true },
];

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <ResourceManager<Testimonial & { id: string }>
      table="testimonials"
      title="Testimonials"
      description="Shown in the homepage testimonial carousel."
      createLabel="New testimonial"
      items={testimonials}
      head={["Customer", "Rating", "Review", "Order", "Status"]}
      fields={testimonialFields}
      action={saveTestimonial}
      toFormValues={(item) => ({
        authorName: item.authorName,
        location: item.location ?? "",
        rating: item.rating,
        displayOrder: item.displayOrder,
        content: item.content,
        image: item.image ?? "",
        isActive: item.isActive,
      })}
      columns={(item) => (
        <>
          <Td>
            <p className="text-sm">{item.authorName}</p>
            <p className="mt-0.5 text-xs text-ash">{item.location}</p>
          </Td>
          <Td className="text-sm tabular-nums">{item.rating}/5</Td>
          <Td className="max-w-80 truncate text-xs text-ash">{item.content}</Td>
          <Td className="text-sm tabular-nums text-ash">{item.displayOrder}</Td>
          <Td>
            <Pill tone={item.isActive ? "success" : "muted"}>
              {item.isActive ? "Active" : "Hidden"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

const navFields: FieldDef[] = [
  { name: "label", label: "Label", type: "text", required: true, half: true },
  { name: "href", label: "Link", type: "text", required: true, half: true, defaultValue: "/" },
  {
    name: "location",
    label: "Location",
    type: "select",
    half: true,
    options: [
      { value: "main", label: "Main navigation" },
      { value: "footer_customer", label: "Footer — customer" },
      { value: "footer_categories", label: "Footer — categories" },
      { value: "footer_policies", label: "Footer — policies" },
    ],
  },
  { name: "badge", label: "Badge", type: "text", half: true, placeholder: "HOT" },
  { name: "displayOrder", label: "Display order", type: "number", half: true, defaultValue: 0 },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true, half: true },
];

export function NavigationManager({ items }: { items: NavigationItem[] }) {
  return (
    <ResourceManager<NavigationItem & { id: string }>
      table="navigation_items"
      title="Navigation"
      description="Header and footer links. Reorder with the display order field."
      createLabel="New link"
      items={items}
      head={["Label", "Link", "Location", "Order", "Status"]}
      fields={navFields}
      action={saveNavigationItem}
      toFormValues={(item) => ({
        label: item.label,
        href: item.href,
        location: item.location,
        badge: item.badge ?? "",
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      })}
      columns={(item) => (
        <>
          <Td>
            <span className="text-sm">{item.label}</span>
            {item.badge ? (
              <span className="ml-2 bg-wine px-1.5 py-0.5 text-[0.55rem] uppercase tracking-[0.1em] text-ivory">
                {item.badge}
              </span>
            ) : null}
          </Td>
          <Td className="text-xs text-ash">{item.href}</Td>
          <Td className="text-xs text-ash">{item.location.replace(/_/g, " ")}</Td>
          <Td className="text-sm tabular-nums text-ash">{item.displayOrder}</Td>
          <Td>
            <Pill tone={item.isActive ? "success" : "muted"}>
              {item.isActive ? "Active" : "Hidden"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Coupons                                                             */
/* ------------------------------------------------------------------ */

const couponFields: FieldDef[] = [
  { name: "code", label: "Code", type: "text", required: true, half: true, placeholder: "WELCOME20" },
  {
    name: "discountType",
    label: "Discount type",
    type: "select",
    half: true,
    options: [
      { value: "percentage", label: "Percentage" },
      { value: "fixed", label: "Fixed amount (₹)" },
    ],
  },
  { name: "discountValue", label: "Discount value", type: "number", half: true, required: true },
  { name: "maxDiscount", label: "Maximum discount (₹)", type: "number", half: true },
  { name: "minOrderValue", label: "Minimum order (₹)", type: "number", half: true, defaultValue: 0 },
  { name: "usageLimit", label: "Usage limit", type: "number", half: true, hint: "Blank for unlimited." },
  { name: "startsAt", label: "Starts on", type: "date", half: true },
  { name: "expiresAt", label: "Expires on", type: "date", half: true },
  { name: "description", label: "Description", type: "textarea", rows: 2 },
  { name: "isActive", label: "Active", type: "toggle", defaultValue: true },
];

export function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  return (
    <ResourceManager<Coupon & { id: string }>
      table="coupons"
      title="Coupons"
      description="Discount codes customers can apply at checkout. Validation happens server-side."
      createLabel="New coupon"
      items={coupons}
      head={["Code", "Discount", "Minimum", "Used", "Status"]}
      fields={couponFields}
      action={saveCoupon}
      toFormValues={(item) => ({
        code: item.code,
        discountType: item.discountType,
        discountValue: item.discountValue,
        maxDiscount: item.maxDiscount ?? "",
        minOrderValue: item.minOrderValue,
        usageLimit: item.usageLimit ?? "",
        startsAt: item.startsAt ?? "",
        expiresAt: item.expiresAt ?? "",
        description: item.description ?? "",
        isActive: item.isActive,
      })}
      columns={(item) => (
        <>
          <Td>
            <p className="text-sm tracking-wide">{item.code}</p>
            <p className="mt-0.5 max-w-56 truncate text-xs text-ash">{item.description}</p>
          </Td>
          <Td className="text-sm">
            {item.discountType === "percentage"
              ? `${item.discountValue}%`
              : formatPrice(item.discountValue)}
            {item.maxDiscount ? (
              <span className="ml-1 text-xs text-ash">max {formatPrice(item.maxDiscount)}</span>
            ) : null}
          </Td>
          <Td className="text-sm tabular-nums text-ash">
            {item.minOrderValue ? formatPrice(item.minOrderValue) : "—"}
          </Td>
          <Td className="text-sm tabular-nums text-ash">
            {item.usedCount}
            {item.usageLimit ? ` / ${item.usageLimit}` : ""}
          </Td>
          <Td>
            <Pill tone={item.isActive ? "success" : "muted"}>
              {item.isActive ? "Active" : "Paused"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Static pages                                                        */
/* ------------------------------------------------------------------ */

const pageFields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, half: true },
  { name: "slug", label: "URL slug", type: "text", required: true, half: true },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    rows: 16,
    required: true,
    hint: "Simple markdown: ## heading, ### subheading, **bold**, - list.",
  },
  { name: "isPublished", label: "Published", type: "toggle", defaultValue: true },
];

export function PagesManager({ pages }: { pages: SitePage[] }) {
  return (
    <ResourceManager<SitePage & { id: string }>
      table="pages"
      title="Pages"
      description="Policy and information pages, each with its own SEO."
      createLabel="New page"
      items={pages}
      head={["Page", "URL", "Updated", "Status"]}
      fields={pageFields}
      action={savePage}
      seo={{ pathPrefix: "", slugField: "slug", titleField: "title" }}
      toFormValues={(item) => ({
        title: item.title,
        slug: item.slug,
        content: item.content,
        isPublished: item.isPublished,
      })}
      columns={(item) => (
        <>
          <Td className="text-sm">{item.title}</Td>
          <Td className="text-xs text-ash">
            <Link href={`/${item.slug}`} target="_blank" className="hover:text-ink">
              /{item.slug}
            </Link>
          </Td>
          <Td className="text-xs text-ash">{formatDate(item.updatedAt)}</Td>
          <Td>
            <Pill tone={item.isPublished ? "success" : "muted"}>
              {item.isPublished ? "Published" : "Draft"}
            </Pill>
          </Td>
        </>
      )}
    />
  );
}
