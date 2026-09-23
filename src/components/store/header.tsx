"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Heart, Home, Menu, Search, ShoppingBag, User } from "lucide-react";

import type { Category, Collection, NavigationItem, SiteSettings } from "@/types";
import type { SessionUser } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/utils";

import { AnnouncementBar } from "./announcement-bar";
import { SocialLinks } from "./social-links";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart-drawer";
import { SearchPanel } from "./search-panel";
import { AuthDrawer } from "./auth-drawer";
import { MobileMenu } from "./mobile-menu";
import { MobileSearchBar } from "./mobile-search-bar";
import { MegaMenu } from "./mega-menu";

interface HeaderProps {
  settings: SiteSettings;
  navigation: NavigationItem[];
  categories: Category[];
  collections: Collection[];
  user: SessionUser | null;
}

export function Header({ settings, navigation, categories, collections, user }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, cartSubtotal, wishlist, openPanel, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mega menu whenever navigation happens. Adjusting state during
  // render avoids a second render pass from an effect.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (exploreOpen) setExploreOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the mega menu, as it does every other overlay on the site.
  useEffect(() => {
    if (!exploreOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExploreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [exploreOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>

      <AnnouncementBar items={settings.announcements} />

      {/* Utility row — desktop only, matches the reference's social strip */}
      <div className="hidden border-b border-line bg-ivory lg:block">
        <div className="container-lux flex h-10 items-center justify-between">
          <SocialLinks links={settings.socials} className="gap-5" iconClassName="h-3.5 w-3.5" />
          <div className="flex items-center gap-6 text-[0.68rem] uppercase tracking-[0.16em] text-ash">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="link-underline">
              {settings.phone}
            </a>
            <span className="text-line-strong">|</span>
            <span>Free delivery across India</span>
          </div>
        </div>
      </div>

      <header
        onMouseLeave={() => setExploreOpen(false)}
        className={cn(
          "sticky top-0 z-50 border-b border-line bg-ivory/92 backdrop-blur-md transition-shadow duration-500",
          scrolled ? "shadow-[0_12px_40px_-28px_rgba(0,0,0,0.55)]" : ""
        )}
      >
        <div
          className={cn(
            "container-lux grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-all duration-500",
            scrolled ? "h-16 lg:h-[4.5rem]" : "h-[4.5rem] lg:h-24"
          )}
        >
          {/* Left: navigation */}
          <nav aria-label="Primary" className="flex min-w-0 items-center gap-1">
            <button
              type="button"
              onClick={() => openPanel("menu")}
              className="-ml-1 flex items-center gap-1.5 text-ink lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[0.7rem] uppercase tracking-[0.12em] sm:text-xs">Menu</span>
            </button>

            <Link
              href="/"
              aria-label="Home"
              className={cn(
                "hidden h-10 w-10 place-items-center text-ink transition-colors hover:text-gold lg:grid",
                pathname === "/" && "text-gold"
              )}
            >
              <Home className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            </Link>

            <ul className="hidden items-center gap-5 whitespace-nowrap lg:flex xl:gap-7">
              {navigation.slice(0, 2).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    data-active={isActive(item.href)}
                    className="link-underline relative inline-flex items-start gap-1 whitespace-nowrap text-sm tracking-wide text-ink"
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="-mt-1 shrink-0 bg-wine px-1.5 py-0.5 text-[0.55rem] font-semibold leading-none tracking-[0.1em] text-ivory">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  type="button"
                  onClick={() => setExploreOpen((v) => !v)}
                  onMouseEnter={() => setExploreOpen(true)}
                  onFocus={() => setExploreOpen(true)}
                  aria-expanded={exploreOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 whitespace-nowrap text-sm tracking-wide text-ink"
                >
                  Explore
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-300",
                      exploreOpen && "rotate-180"
                    )}
                    strokeWidth={1.6}
                  />
                </button>
              </li>

              {navigation.slice(2).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    data-active={isActive(item.href)}
                    className="link-underline whitespace-nowrap text-sm tracking-wide text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Centre: logo */}
          <Link href="/" className="justify-self-center" aria-label={`${settings.siteName} home`}>
            <Image
              src="/logo.svg"
              alt={settings.siteName}
              width={160}
              height={56}
              priority
              className={cn(
                "w-auto transition-all duration-500",
                scrolled ? "h-10 lg:h-11" : "h-11 lg:h-14"
              )}
            />
          </Link>

          {/* Right: utilities */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:gap-6">
            <button
              type="button"
              onClick={() => openPanel("search")}
              className="hidden items-center gap-2 text-ink transition-colors hover:text-gold lg:flex"
              aria-label="Search products"
            >
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              <span className="hidden text-sm xl:inline">Search</span>
            </button>

            <Link
              href="/wishlist"
              className="relative hidden items-center gap-2 text-ink transition-colors hover:text-gold lg:flex"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <span className="relative">
                <Heart className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                {hydrated && wishlist.length > 0 ? (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[0.6rem] font-semibold text-ivory">
                    {wishlist.length}
                  </span>
                ) : null}
              </span>
              <span className="hidden text-sm xl:inline">Wishlist</span>
            </Link>

            {user ? (
              <Link
                href="/account"
                className="hidden items-center gap-2 text-ink transition-colors hover:text-gold lg:flex"
              >
                <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                <span className="hidden max-w-24 truncate text-sm xl:inline">
                  {user.fullName.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openPanel("auth")}
                className="hidden items-center gap-2 text-ink transition-colors hover:text-gold lg:flex"
              >
                <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                <span className="hidden text-sm xl:inline">Sign In</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => openPanel("cart")}
              className="flex items-center gap-2 text-ink transition-colors hover:text-gold"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <span className="relative">
                <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                {hydrated && cartCount > 0 ? (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[0.6rem] font-semibold text-ivory">
                    {cartCount}
                  </span>
                ) : null}
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.12em] sm:text-xs lg:hidden">
                Cart
              </span>
              <span className="hidden text-sm tabular-nums lg:inline">
                {hydrated ? formatPrice(cartSubtotal) : formatPrice(0)}
              </span>
            </button>
          </div>
        </div>
        <MegaMenu
          open={exploreOpen}
          categories={categories}
          collections={collections}
          onMouseEnter={() => setExploreOpen(true)}
          onNavigate={() => setExploreOpen(false)}
        />

        <MobileSearchBar />
      </header>

      <CartDrawer />
      <SearchPanel />
      <AuthDrawer />
      <MobileMenu
        navigation={navigation}
        categories={categories}
        collections={collections}
        settings={settings}
        user={user}
      />
    </>
  );
}
