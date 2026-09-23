import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";

const SUGGESTIONS = [
  { href: "/shop", label: "Shop all" },
  { href: "/collections", label: "Collections" },
  { href: "/category/sherwani", label: "Sherwani" },
  { href: "/category/kurta-pajama", label: "Kurta Pajama" },
  { href: "/blog", label: "The journal" },
  { href: "/contact", label: "Contact us" },
];

/** Shared by the root 404 and the storefront segment's own not-found boundary. */
export function NotFoundBody() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-20">
      <div className="max-w-xl text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-6xl leading-none lg:text-8xl">Not found</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ash">
          The page you were looking for has moved, or never existed. Here is the way back.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Browse the shop
          </ButtonLink>
        </div>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-line pt-8 text-sm">
          {SUGGESTIONS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-ash transition-colors hover:text-ink">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
