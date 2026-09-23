"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, MoreHorizontal, User } from "lucide-react";

import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { useStore } from "./store-provider";

/**
 * Fixed bottom navigation for phones, as in the reference. Thumb-reachable,
 * five destinations, with live wishlist count. Hidden from lg upwards.
 */
export function MobileBottomNav({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const { wishlist, hydrated, openPanel } = useStore();

  // Never overlay the checkout flow — every pixel there is needed.
  if (pathname.startsWith("/checkout") || pathname.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const itemClass = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.6rem] uppercase tracking-[0.1em] transition-colors",
      active ? "text-ink" : "text-ash"
    );

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/97 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="flex items-stretch">
        <li className="flex flex-1">
          <Link href="/" className={itemClass(isActive("/"))} aria-current={isActive("/") ? "page" : undefined}>
            <Home className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            Home
          </Link>
        </li>
        <li className="flex flex-1">
          <Link
            href="/shop"
            className={itemClass(isActive("/shop"))}
            aria-current={isActive("/shop") ? "page" : undefined}
          >
            <LayoutGrid className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            Shop
          </Link>
        </li>
        <li className="flex flex-1">
          <Link
            href="/wishlist"
            className={itemClass(isActive("/wishlist"))}
            aria-current={isActive("/wishlist") ? "page" : undefined}
          >
            <span className="relative">
              <Heart className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              {hydrated && wishlist.length > 0 ? (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-wine px-1 text-[0.58rem] font-semibold text-ivory">
                  {wishlist.length}
                </span>
              ) : null}
            </span>
            Wishlist
          </Link>
        </li>
        <li className="flex flex-1">
          {user ? (
            <Link
              href="/account"
              className={itemClass(isActive("/account"))}
              aria-current={isActive("/account") ? "page" : undefined}
            >
              <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              Account
            </Link>
          ) : (
            <button type="button" onClick={() => openPanel("auth")} className={itemClass(false)}>
              <User className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              Sign in
            </button>
          )}
        </li>
        <li className="flex flex-1">
          <button type="button" onClick={() => openPanel("menu")} className={itemClass(false)}>
            <MoreHorizontal className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            More
          </button>
        </li>
      </ul>
    </nav>
  );
}
