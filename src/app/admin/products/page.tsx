import { Plus } from "lucide-react";

import { ProductsTable } from "@/components/admin/products-table";
import { AdminPageHeader, LinkButton } from "@/components/admin/ui";
import { getAllProducts, getCategories } from "@/lib/data/queries";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in the catalogue. Search, filter, edit or bulk-update them here.`}
        actions={
          <LinkButton href="/admin/products/new" variant="primary">
            <Plus className="h-3.5 w-3.5" />
            New product
          </LinkButton>
        }
      />
      <ProductsTable products={products} categories={categories} />
    </>
  );
}
