"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Heart, LogOut, Search, ShoppingBag, User } from "lucide-react";

import type { Category, Collection, NavigationItem, SiteSettings } from "@/types";
import type { SessionUser } from "@/lib/auth";
import { Drawer } from "@/components/ui/drawer";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SocialLinks } from "./social-links";
import { useStore } from "./store-provider";

export function MobileMenu({
  navigation,
  categories,
  collections,
  settings,
  user,
}: {
  navigation: NavigationItem[];
  categories: Category[];
  collections: Collection[];
  settings: SiteSettings;
  user: SessionUser | null;
}) {
  const { panel, closePanel, openPanel, cartCount, wishlist } = useStore();
  const [open, setOpen] = useState<"categories" | "collections" | null>("categories");

  return (
    <Drawer
      open={panel === "menu"}
      onClose={closePanel}
      side="left"
      title="Menu"
      footer={
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-center text-[0.68rem] uppercase tracking-[0.12em]">
            <button
              type="button"
              onClick={() => {
                closePanel();
                setTimeout(() => openPanel("search"), 260);
              }}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-ink"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
              Search
            </button>
            <Link
              href="/wishlist"
              onClick={closePanel}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-ink"
            >
              <Heart className="h-4 w-4" strokeWidth={1.5} />
              Wishlist ({wishlist.length})
            </Link>
            <Link
              href="/cart"
              onClick={closePanel}
              className="flex flex-col items-center gap-1.5 border border-line py-3 text-ink"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              Bag ({cartCount})
            </Link>
          </div>
          <SocialLinks links={settings.socials} className="justify-center gap-6" />
        </div>
      }
    >
      <nav className="space-y-7">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={closePanel}
                className="flex items-center justify-between border-b border-line py-3.5 font-display text-xl text-ink"
              >
                {item.label}
                {item.badge ? (
                  <span className="bg-wine px-2 py-0.5 text-[0.55rem] font-semibold tracking-[0.1em] text-ivory">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <Accordion
          title="Categories"
          expanded={open === "categories"}
          onToggle={() => setOpen(open === "categories" ? null : "categories")}
        >
          <ul className="space-y-2.5 pt-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  onClick={closePanel}
                  className="flex items-center justify-between text-sm text-ink-soft"
                >
                  {category.name}
                  <span className="text-xs text-ash-light">{category.productCount ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Accordion>

        <Accordion
          title="Collections"
          expanded={open === "collections"}
          onToggle={() => setOpen(open === "collections" ? null : "collections")}
        >
          <ul className="space-y-2.5 pt-3">
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link
                  href={`/collection/${collection.slug}`}
                  onClick={closePanel}
                  className="text-sm text-ink-soft"
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>
        </Accordion>

        <div className="space-y-3 border-t border-line pt-6">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={closePanel}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                {user.fullName}
              </Link>
              <Link
                href="/account/orders"
                onClick={closePanel}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                My orders
              </Link>
              <Link
                href="/account/sign-out"
                onClick={closePanel}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Sign out
              </Link>
            </>
          ) : (
            <ButtonLink
              href="/account/sign-in"
              onClick={closePanel}
              variant="outline"
              className="w-full"
            >
              Sign in / Register
            </ButtonLink>
          )}
        </div>
      </nav>
    </Drawer>
  );
}

function Accordion({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-4">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between py-1 text-[0.7rem] uppercase tracking-[0.18em] text-ash"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", expanded && "rotate-180")}
        />
      </button>
      {expanded ? children : null}
    </div>
  );
}
