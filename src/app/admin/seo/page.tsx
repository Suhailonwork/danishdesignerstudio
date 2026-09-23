import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { GlobalSeoForm } from "@/components/admin/settings-forms";
import { AdminPageHeader, Card } from "@/components/admin/ui";
import { getGlobalSeo } from "@/lib/data/queries";

export const metadata = { title: "SEO" };

const RESOURCE_LINKS = [
  { href: "/admin/products", label: "Product SEO", hint: "Open a product → SEO tab" },
  { href: "/admin/categories", label: "Category SEO", hint: "Edit a category → SEO panel" },
  { href: "/admin/collections", label: "Collection SEO", hint: "Edit a collection → SEO panel" },
  { href: "/admin/blog", label: "Article SEO", hint: "Open an article → SEO panel" },
  { href: "/admin/pages", label: "Page SEO", hint: "Edit a page → SEO panel" },
];

export default async function AdminSeoPage() {
  const seo = await getGlobalSeo();

  return (
    <>
      <AdminPageHeader
        title="SEO"
        description="Global metadata, social cards and crawling. Per-page SEO lives with each resource."
        actions={
          <>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 border border-line px-5 text-[0.7rem] uppercase tracking-[0.14em] hover:border-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Sitemap
            </Link>
            <Link
              href="/robots.txt"
              target="_blank"
              className="inline-flex h-10 items-center gap-2 border border-line px-5 text-[0.7rem] uppercase tracking-[0.14em] hover:border-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              robots.txt
            </Link>
          </>
        }
      />

      <div className="mb-6">
        <Card title="Per-page SEO" description="Every resource carries its own title, description, canonical, social image and index rules.">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border border-line p-4 transition-colors hover:border-ink"
                >
                  <p className="text-sm text-ink">{item.label}</p>
                  <p className="mt-1 text-xs text-ash">{item.hint}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <GlobalSeoForm seo={seo} />
    </>
  );
}
