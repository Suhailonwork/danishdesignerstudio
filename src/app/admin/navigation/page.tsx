import { NavigationManager } from "@/components/admin/managers";
import { AdminPageHeader } from "@/components/admin/ui";
import { getNavigation } from "@/lib/data/queries";

export const metadata = { title: "Navigation" };

export default async function AdminNavigationPage() {
  const items = await getNavigation();

  return (
    <>
      <AdminPageHeader
        title="Navigation"
        description="Header and footer links, grouped by location."
      />
      <NavigationManager items={items} />
    </>
  );
}
