import type { Metadata } from "next";

import { NotFoundBody } from "@/components/store/not-found-body";

import StoreLayout from "./(store)/layout";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Unmatched URLs resolve to the root boundary, so it reuses the storefront
 * chrome — a 404 should still let people navigate and search.
 */
export default function NotFound() {
  return (
    <StoreLayout>
      <NotFoundBody />
    </StoreLayout>
  );
}
