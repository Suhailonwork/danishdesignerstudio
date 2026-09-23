import type { Metadata } from "next";

import { LegalPage, legalMetadata } from "@/components/store/legal-page";

export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return legalMetadata("terms", "Terms & Conditions");
}

export default function Page() {
  return <LegalPage slug="terms" />;
}
