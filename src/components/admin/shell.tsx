"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BadgePercent,
  Boxes,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  Link2,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  Package,
  PanelsTopLeft,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Users,
  UsersRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV: { heading: string; items: { href: string; label: string; icon: typeof Package }[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/collections", label: "Collections", icon: PanelsTopLeft },
    ],
  },
  {
    heading: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: UsersRound },
      { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    heading: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage", icon: LayoutTemplate },
      { href: "/admin/banners", label: "Banners", icon: ImageIcon },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/navigation", label: "Navigation", icon: Link2 },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    heading: "Configuration",
    items: [
      { href: "/admin/seo", label: "SEO", icon: Search },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
];

export function AdminShell({
  children,
  user,
  demoMode,
}: {
  children: React.ReactNode;
  user: { fullName: string; email: string } | null;
  demoMode: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Admin">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-display text-xl text-white">Danish</span>
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-white/60 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.heading} className="mb-6">
            <p className="px-3 pb-2 text-[0.58rem] uppercase tracking-[0.2em] text-white/35">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xs px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-white/12 text-white"
                          : "text-white/65 hover:bg-white/6 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xs px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/6 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          View storefront
        </Link>
        <Link
          href="/account/sign-out"
          className="flex items-center gap-3 rounded-xs px-3 py-2.5 text-sm text-white/65 transition-colors hover:bg-white/6 hover:text-white"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
          Sign out
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-ivory-deep/40">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-ink/60"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-line bg-ivory/92 backdrop-blur-md">
          <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="-ml-1 grid h-10 w-10 place-items-center text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <AdminBreadcrumb pathname={pathname} />

            <div className="ml-auto flex items-center gap-4">
              {user ? (
                <div className="hidden text-right sm:block">
                  <p className="text-sm leading-tight text-ink">{user.fullName}</p>
                  <p className="text-xs text-ash">{user.email}</p>
                </div>
              ) : null}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs text-ivory">
                {user ? user.fullName.slice(0, 1).toUpperCase() : "?"}
              </span>
            </div>
          </div>

          {demoMode ? (
            <p className="border-t border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 lg:px-8">
              <strong className="font-semibold">Demo mode.</strong> Supabase is not connected, so
              the panel is read-only and shows bundled sample data. Add your keys to{" "}
              <code className="bg-white/60 px-1">.env.local</code> and run the migration to enable
              editing.
            </p>
          ) : null}
        </header>

        <main className="px-4 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

function AdminBreadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean).slice(1);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-2 text-sm text-ash">
        <li>
          <Link href="/admin" className="hover:text-ink">
            Admin
          </Link>
        </li>
        {parts.map((part, index) => (
          <li key={`${part}-${index}`} className="flex items-center gap-2">
            <span className="text-line-strong">/</span>
            <span className={cn("truncate capitalize", index === parts.length - 1 && "text-ink")}>
              {part.length > 18 ? `${part.slice(0, 8)}…` : part.replace(/-/g, " ")}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
