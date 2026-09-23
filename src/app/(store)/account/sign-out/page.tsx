import type { Metadata } from "next";

import { SignOutClient } from "@/components/store/sign-out-client";

export const metadata: Metadata = {
  title: "Signing out",
  robots: { index: false, follow: false },
};

export default function SignOutPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <SignOutClient />
    </div>
  );
}
