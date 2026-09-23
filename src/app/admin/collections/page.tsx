import { CollectionsManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getAllProducts, getCollections } from "@/lib/data/queries";

export const metadata = { title: "Collections" };

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([getCollections(), getAllProducts()]);

  return (
    <>
      <AdminPageHeader
        title="Collections"
        description="Create a seasonal edit, assign products, and it appears on the storefront without a deploy."
      />
      <CollectionsManager collections={collections} products={products} />
    </>
  );
}
