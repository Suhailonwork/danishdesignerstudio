import type { MetadataRoute } from "next";

import { getGlobalSeo } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getGlobalSeo();

  // A site-wide noindex switch in the admin panel must also shut crawlers out here.
  if (!seo.robotsIndex) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: absoluteUrl("/sitemap.xml"),
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/checkout",
          "/checkout/",
          "/cart",
          "/search",
          "/api/",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
