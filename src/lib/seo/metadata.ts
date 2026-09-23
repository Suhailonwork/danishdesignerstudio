import type { Metadata } from "next";

import type { GlobalSeo, SeoFields } from "@/types";
import { absoluteUrl, truncate } from "@/lib/utils";

export function toAbsolute(path?: string | null) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return absoluteUrl(path);
}

interface BuildMetadataArgs {
  global: GlobalSeo;
  /** Page-specific overrides stored in Supabase and edited from the admin panel. */
  seo?: SeoFields | null;
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  keywords?: string[];
  /** Skip the global title template — for pages whose title already carries the brand. */
  absoluteTitle?: boolean;
}

/** The literal suffix the global title template appends, e.g. " | Danish Designer Studio". */
function templateSuffix(template: string) {
  const suffix = template.replace("%s", "").trim();
  return suffix.length > 1 ? suffix : "";
}

/**
 * Single source of truth for page metadata. Admin-managed SEO always wins over
 * the derived defaults, which is what makes the SEO editor actually effective.
 */
export function buildMetadata({
  global,
  seo,
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  keywords,
  absoluteTitle,
}: BuildMetadataArgs): Metadata {
  const adminTitle = seo?.metaTitle?.trim();
  const resolvedTitle = adminTitle || title;

  /*
   * The root layout applies `titleTemplate` to every plain string title. Two
   * cases must opt out of it, or the brand name is printed twice:
   *   1. an admin-authored meta title — what they typed in the SEO editor is
   *      exactly what should ship, which also keeps the editor preview honest;
   *   2. a title that already ends with the template's own suffix.
   */
  const suffix = templateSuffix(global.titleTemplate);
  const skipTemplate =
    absoluteTitle ||
    Boolean(adminTitle) ||
    (suffix.length > 0 && resolvedTitle.trim().endsWith(suffix));
  const resolvedDescription = truncate(
    seo?.metaDescription?.trim() || description || global.metaDescription,
    300
  );
  const canonical = seo?.canonicalUrl?.trim() || absoluteUrl(path);
  const ogImage =
    toAbsolute(seo?.ogImage) ?? toAbsolute(image) ?? toAbsolute(global.defaultOgImage)!;

  const index = global.robotsIndex && !seo?.noIndex;
  const follow = global.robotsFollow && !seo?.noFollow;

  return {
    title: skipTemplate ? { absolute: resolvedTitle } : resolvedTitle,
    description: resolvedDescription,
    keywords: seo?.keywords?.length ? seo.keywords : (keywords ?? global.keywords),
    alternates: { canonical },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: type === "product" ? "website" : type,
      siteName: global.organizationName,
      title: seo?.ogTitle?.trim() || resolvedTitle,
      description: seo?.ogDescription?.trim() || resolvedDescription,
      url: canonical,
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: global.twitterCardType,
      site: global.twitterHandle,
      creator: global.twitterHandle,
      title: seo?.ogTitle?.trim() || resolvedTitle,
      description: seo?.ogDescription?.trim() || resolvedDescription,
      images: [ogImage],
    },
  };
}
