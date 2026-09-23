import { CategoriesManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getCategories } from "@/lib/data/queries";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Categories drive the shop navigation and the /category/… URLs. Each one has its own SEO."
      />
      <CategoriesManager categories={categories} />
    </>
  );
}
