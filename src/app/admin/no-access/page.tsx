import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "No access" };

export default async function NoAccessPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-amber-600" strokeWidth={1.2} />
      <h1 className="mt-6 font-display text-3xl">Administrator access required</h1>
      <p className="mt-4 text-sm leading-relaxed text-ash">
        {user
          ? `You are signed in as ${user.email}, which is not an administrator account. Ask an existing admin to grant you access from Admin → Users, or sign in with an admin account.`
          : "Sign in with an administrator account to open this panel."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/admin/sign-in">Sign in</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to storefront
        </ButtonLink>
      </div>
      <p className="mt-8 text-xs text-ash">
        Need to promote the first admin?{" "}
        <Link href="/admin/users" className="underline underline-offset-4">
          See the setup note on the Users page
        </Link>
        .
      </p>
    </div>
  );
}
