import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/components/store/legal-page";

export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata("return-policy", "Return Policy");
}

export default function Page() {
  return <LegalPage slug="return-policy" />;
}
