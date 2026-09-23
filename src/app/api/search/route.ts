import { NextResponse } from "next/server";

import { getSearchSuggestions } from "@/lib/data/queries";

export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").slice(0, 80);

  if (query.trim().length < 2) {
    return NextResponse.json({ products: [], categories: [], collections: [] });
  }

  const { products, categories, collections } = await getSearchSuggestions(query);

  // Trim the payload: the suggestion list only needs a handful of fields.
  return NextResponse.json({
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      categoryName: product.categoryName,
      images: product.images.slice(0, 1),
    })),
    categories: categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    collections: collections.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
  });
}
