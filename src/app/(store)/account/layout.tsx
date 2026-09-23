import Link from "next/link";
import { Heart, LogOut, MapPin, Package, UserRound } from "lucide-react";

import { PageHero } from "@/components/store/page-hero";
import { getCurrentUser } from "@/lib/auth";

const LINKS = [
  { href: "/account", label: "Overview", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/profile", label: "Profile & addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <PageHero
        eyebrow="My account"
        title={user ? `Hello, ${user.fullName.split(" ")[0]}` : "My account"}
        description={
          user
            ? "Track orders, update your details and manage saved addresses."
            : "Sign in to track orders, save addresses and keep your wishlist across devices."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
        size="sm"
      />

      <div className="container-lux py-12 lg:py-16">
        {user ? (
          <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-16">
            <nav aria-label="Account" className="h-max lg:sticky lg:top-28">
              <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
                {LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.href} className="shrink-0">
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink lg:border-0 lg:border-b lg:px-0 lg:py-3.5"
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.4} />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li className="shrink-0">
                  <Link
                    href="/account/sign-out"
                    className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-ash transition-colors hover:border-danger hover:text-danger lg:border-0 lg:px-0 lg:py-3.5"
                  >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.4} />
                    Sign out
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}
