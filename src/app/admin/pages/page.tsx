import { PagesManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getPages } from "@/lib/data/queries";

export const metadata = { title: "Pages" };

export default async function AdminPagesPage() {
  const pages = await getPages();

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Policy and information pages served at /your-slug, each with its own SEO."
      />
      <PagesManager pages={pages} />
    </>
  );
}
