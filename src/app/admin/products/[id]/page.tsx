import { notFound } from "next/navigation";

import { ProductEditor } from "@/components/admin/product-editor";
import { AdminPageHeader } from "@/components/admin/ui";
import { getCategories, getCollections, getProductById } from "@/lib/data/queries";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? product.name : "Product" };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    getProductById(id),
    getCategories(),
    getCollections(),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description={`SKU ${product.sku} · ${product.stockQuantity} in stock · ${product.soldCount} sold`}
      />
      <ProductEditor product={product} categories={categories} collections={collections} />
    </>
  );
}
