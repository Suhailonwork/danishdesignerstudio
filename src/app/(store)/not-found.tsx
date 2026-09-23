import type { Metadata } from "next";

import { NotFoundBody } from "@/components/store/not-found-body";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function StoreNotFound() {
  return <NotFoundBody />;
}
