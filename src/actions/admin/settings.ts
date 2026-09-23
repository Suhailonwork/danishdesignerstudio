"use server";

import type { GlobalSeo, SiteSettings } from "@/types";
import { getSiteSettings, getGlobalSeo } from "@/lib/data/queries";

import { getWritableClient, revalidateStorefront, type AdminResult } from "./core";

function parseJson<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function saveSingleton(table: string, data: unknown): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client
    .from(table)
    .upsert({ id: 1, data, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/settings", "/admin/seo", "/sitemap.xml", "/robots.txt"]);
  return { ok: true, message: "Saved." };
}

export async function saveSiteSettings(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const current = await getSiteSettings();

  const next: SiteSettings = {
    ...current,
    siteName: String(formData.get("siteName") ?? current.siteName),
    tagline: String(formData.get("tagline") ?? current.tagline),
    description: String(formData.get("description") ?? current.description),
    logoUrl: String(formData.get("logoUrl") ?? current.logoUrl),
    email: String(formData.get("email") ?? current.email),
    phone: String(formData.get("phone") ?? current.phone),
    whatsapp: String(formData.get("whatsapp") ?? current.whatsapp),
    address: String(formData.get("address") ?? current.address),
    footerDescription: String(formData.get("footerDescription") ?? current.footerDescription),
    newsletterHeading: String(formData.get("newsletterHeading") ?? current.newsletterHeading),
    newsletterSubtext: String(formData.get("newsletterSubtext") ?? current.newsletterSubtext),
    instagramHandle: String(formData.get("instagramHandle") ?? current.instagramHandle),
    pageImages: {
      aboutHero: String(formData.get("pageImages.aboutHero") ?? current.pageImages.aboutHero),
      aboutPrimary: String(formData.get("pageImages.aboutPrimary") ?? current.pageImages.aboutPrimary),
      aboutSecondary: String(
        formData.get("pageImages.aboutSecondary") ?? current.pageImages.aboutSecondary
      ),
      contactHero: String(formData.get("pageImages.contactHero") ?? current.pageImages.contactHero),
    },
    announcements: parseJson(formData.get("announcements"), current.announcements),
    socials: parseJson(formData.get("socials"), current.socials),
  };

  return saveSingleton("site_settings", next);
}

export async function saveGlobalSeo(
  _prev: AdminResult | null,
  formData: FormData
): Promise<AdminResult> {
  const current = await getGlobalSeo();

  const next: GlobalSeo = {
    ...current,
    siteTitle: String(formData.get("siteTitle") ?? current.siteTitle),
    titleTemplate: String(formData.get("titleTemplate") ?? current.titleTemplate),
    metaDescription: String(formData.get("metaDescription") ?? current.metaDescription),
    keywords: String(formData.get("keywords") ?? current.keywords.join(", "))
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    defaultOgImage: String(formData.get("defaultOgImage") ?? current.defaultOgImage),
    twitterHandle: String(formData.get("twitterHandle") ?? current.twitterHandle),
    twitterCardType:
      (String(formData.get("twitterCardType") ?? current.twitterCardType) as GlobalSeo["twitterCardType"]) ??
      "summary_large_image",
    organizationName: String(formData.get("organizationName") ?? current.organizationName),
    organizationLogo: String(formData.get("organizationLogo") ?? current.organizationLogo),
    robotsIndex: formData.get("robotsIndex") === "on",
    robotsFollow: formData.get("robotsFollow") === "on",
    googleSiteVerification: (formData.get("googleSiteVerification") as string) || null,
  };

  return saveSingleton("global_seo", next);
}

/** Promote or demote a customer to administrator. */
export async function setUserRole(
  userId: string,
  role: "admin" | "staff" | "customer"
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client
    .from("profiles")
    .update({ role, is_admin: role !== "customer" })
    .eq("id", userId);

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/users"]);
  return { ok: true, message: `Role updated to ${role}.` };
}
