import { redirect } from "next/navigation";

import { AdminSignInForm } from "@/components/admin/sign-in-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Sign in" };

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, user] = await Promise.all([searchParams, getCurrentUser()]);
  if (user?.isAdmin) redirect(next ?? "/admin");

  return (
    <div className="mx-auto max-w-md py-10">
      <AdminSignInForm redirectTo={next ?? "/admin"} />
    </div>
  );
}
