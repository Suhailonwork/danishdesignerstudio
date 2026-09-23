import { BannersManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getBanners } from "@/lib/data/queries";

export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await getBanners();

  return (
    <>
      <AdminPageHeader
        title="Banners"
        description="Promotional imagery. Homepage hero content is edited under Homepage."
      />
      <BannersManager banners={banners} />
    </>
  );
}
