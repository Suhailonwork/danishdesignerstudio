import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/store/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getGlobalSeo } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "Sign in",
    description: "Sign in to your Danish Designer Studio account.",
    path: "/account/sign-in",
  });
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; mode?: string }>;
}) {
  const [{ next, mode }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (user) redirect(next ?? "/account");

  return (
    <div className="mx-auto max-w-md border border-line bg-white p-8 lg:p-10">
      <AuthForm
        mode={mode === "register" ? "register" : "login"}
        redirectTo={next ?? "/account"}
      />
    </div>
  );
}
