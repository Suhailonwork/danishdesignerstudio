import type { MetadataRoute } from "next";

import {
  getActiveCategories,
  getActiveCollections,
  getAllProducts,
  getPages,
  getPublishedPosts,
} from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections, posts, pages] = await Promise.all([
    getAllProducts(),
    getActiveCategories(),
    getActiveCollections(),
    getPublishedPosts(),
    getPages(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    {
      url: absoluteUrl("/collections"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((product) => product.isPublished && !product.seo?.noIndex)
    .map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((category) => !category.seo?.noIndex)
    .map((category) => ({
      url: absoluteUrl(`/category/${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = collections
    .filter((collection) => !collection.seo?.noIndex)
    .map((collection) => ({
      url: absoluteUrl(`/collection/${collection.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => !post.seo?.noIndex)
    .map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => page.isPublished && !page.seo?.noIndex)
    .map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: new Date(page.updatedAt),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...postRoutes,
    ...pageRoutes,
  ];
}
