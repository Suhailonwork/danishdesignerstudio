import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isAdmin: boolean;
  role: "admin" | "staff" | "customer";
}

/** The signed-in user, or null. Safe to call from any Server Component. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  if (!isSupabaseConfigured) return null;

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, is_admin, role")
      .eq("id", user.id)
      .maybeSingle();

    const role = (profile?.role as SessionUser["role"]) ?? "customer";

    return {
      id: user.id,
      email: user.email ?? "",
      fullName:
        (profile?.full_name as string | undefined) ??
        (user.user_metadata?.full_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "Customer",
      avatarUrl: (profile?.avatar_url as string | null) ?? null,
      isAdmin: Boolean(profile?.is_admin) || role === "admin" || role === "staff",
      role,
    };
  } catch {
    return null;
  }
});

export async function requireUser(redirectTo = "/account") {
  const user = await getCurrentUser();
  if (!user) redirect(`/account/sign-in?next=${encodeURIComponent(redirectTo)}`);
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/sign-in");
  if (!user.isAdmin) redirect("/admin/no-access");
  return user;
}

/**
 * Admin routes stay reachable while Supabase is unconfigured so the panel can be
 * explored, but every write is blocked by `assertAdminWrite`.
 */
export async function getAdminContext() {
  const user = await getCurrentUser();
  return {
    user,
    demoMode: !isSupabaseConfigured,
    canWrite: isSupabaseConfigured && Boolean(user?.isAdmin),
  };
}
