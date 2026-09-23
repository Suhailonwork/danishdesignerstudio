import { SiteSettingsForm } from "@/components/admin/settings-forms";
import { AdminPageHeader } from "@/components/admin/ui";
import { getSiteSettings } from "@/lib/data/queries";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Brand, contact details, the announcement bar, social profiles and footer copy."
      />
      <SiteSettingsForm settings={settings} />
    </>
  );
}
