import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/store/password-forms";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md border border-line bg-white p-8 lg:p-10">
      <ForgotPasswordForm />
    </div>
  );
}
