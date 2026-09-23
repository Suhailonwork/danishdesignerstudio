import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/store/password-forms";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md border border-line bg-white p-8 lg:p-10">
      <ResetPasswordForm />
    </div>
  );
}
