import { ProductEditor } from "@/components/admin/product-editor";
import { AdminPageHeader } from "@/components/admin/ui";
import { getCategories, getCollections } from "@/lib/data/queries";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);

  return (
    <>
      <AdminPageHeader
        title="New product"
        description="Create a product, then publish it when the images and copy are ready."
      />
      <ProductEditor categories={categories} collections={collections} />
    </>
  );
}
