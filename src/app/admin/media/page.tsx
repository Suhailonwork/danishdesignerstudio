import { MediaLibrary } from "@/components/admin/media-library";
import { AdminPageHeader } from "@/components/admin/ui";
import { getMediaItems } from "@/lib/data/queries";

export const metadata = { title: "Media" };

export default async function AdminMediaPage() {
  const items = await getMediaItems();

  return (
    <>
      <AdminPageHeader
        title="Media library"
        description="Every image uploaded from the admin panel, ready to reuse anywhere."
      />
      <MediaLibrary items={items} />
    </>
  );
}
