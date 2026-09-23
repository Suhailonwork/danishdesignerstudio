import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { HomepageBuilder } from "@/components/admin/homepage-builder";
import { AdminPageHeader } from "@/components/admin/ui";
import { getHomeSections } from "@/lib/data/queries";

export const metadata = { title: "Homepage" };

export default async function AdminHomepagePage() {
  const sections = await getHomeSections();

  return (
    <>
      <AdminPageHeader
        title="Homepage"
        description="Every band on the homepage is a section here. Reorder them, hide them, or change their copy and imagery."
        actions={
          <Link
            href="/"
            target="_blank"
            className="inline-flex h-10 items-center gap-2 border border-line px-5 text-[0.7rem] uppercase tracking-[0.14em] hover:border-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </Link>
        }
      />
      <HomepageBuilder sections={sections} />
    </>
  );
}
