import type { BlogPost, Collection, GlobalSeo, Order, Product, Review, SiteSettings } from "@/types";
import { absoluteUrl, effectivePrice } from "@/lib/utils";

import { toAbsolute } from "./metadata";

type Json = Record<string, unknown>;

export function organizationSchema(settings: SiteSettings, seo: GlobalSeo): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl()}/#organization`,
    name: seo.organizationName,
    url: absoluteUrl(),
    logo: toAbsolute(seo.organizationLogo),
    description: settings.description,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "IN",
    },
    sameAs: settings.socials.map((s) => s.url),
  };
}

export function websiteSchema(settings: SiteSettings, seo: GlobalSeo): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl()}/#website`,
    name: seo.siteTitle,
    url: absoluteUrl(),
    description: seo.metaDescription,
    publisher: { "@id": `${absoluteUrl()}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function productSchema(product: Product, reviews: Review[] = []): Json {
  const price = effectivePrice(product.price, product.salePrice);
  const availability =
    product.stockQuantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const schema: Json = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/product/${product.slug}#product`),
    name: product.name,
    description: product.shortDescription ?? product.description ?? product.name,
    sku: product.sku,
    image: product.images.map((image) => toAbsolute(image.url)),
    brand: { "@type": "Brand", name: product.brand },
    category: product.categoryName ?? undefined,
    material: product.material ?? undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "INR",
      price: String(price),
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${absoluteUrl()}/#organization` },
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180)
        .toISOString()
        .slice(0, 10),
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      },
    },
  };

  if (product.ratingCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.ratingAverage.toFixed(1),
      reviewCount: product.ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (reviews.length) {
    schema.review = reviews.slice(0, 5).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.authorName },
      datePublished: review.createdAt.slice(0, 10),
      reviewBody: review.content,
      name: review.title ?? undefined,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  return schema;
}

export function itemListSchema(products: Product[], listName: string, path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/product/${product.slug}`),
      name: product.name,
    })),
  };
}

export function collectionPageSchema(collection: Collection, path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description ?? undefined,
    url: absoluteUrl(path),
    image: toAbsolute(collection.bannerImage),
  };
}

export function articleSchema(post: BlogPost): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${post.slug}#article`),
    headline: post.title,
    description: post.excerpt,
    image: [toAbsolute(post.coverImage)],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: post.authorName },
    publisher: { "@id": `${absoluteUrl()}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    keywords: post.tags.join(", "),
    articleSection: post.categoryName,
    wordCount: post.content.split(/\s+/).length,
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]): Json | null {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function orderSchema(order: Order): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Order",
    orderNumber: order.orderNumber,
    orderStatus: `https://schema.org/OrderStatus/Order${
      order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }`,
    priceCurrency: "INR",
    price: String(order.total),
    acceptedOffer: order.items.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: item.name, sku: item.sku },
      price: String(item.unitPrice),
      priceCurrency: "INR",
      eligibleQuantity: { "@type": "QuantitativeValue", value: item.quantity },
    })),
  };
}
