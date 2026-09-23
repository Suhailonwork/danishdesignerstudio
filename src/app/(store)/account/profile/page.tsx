import type { Metadata } from "next";

import { AddressBook, ProfileForm } from "@/components/store/profile-forms";
import type { Address } from "@/types";
import { requireUser } from "@/lib/auth";
import { getGlobalSeo } from "@/lib/data/queries";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();
  return buildMetadata({
    global: seo,
    seo: { noIndex: true, noFollow: true },
    title: "Profile & addresses",
    description: "Update your Danish Designer Studio profile and shipping addresses.",
    path: "/account/profile",
  });
}

async function loadAddresses(userId: string): Promise<Address[]> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: String(row.id),
      userId: String(row.user_id),
      label: String(row.label ?? "Home"),
      fullName: String(row.full_name ?? ""),
      phone: String(row.phone ?? ""),
      line1: String(row.line1 ?? ""),
      line2: (row.line2 as string | null) ?? null,
      city: String(row.city ?? ""),
      state: String(row.state ?? ""),
      postalCode: String(row.postal_code ?? ""),
      country: String(row.country ?? "India"),
      isDefault: Boolean(row.is_default),
    }));
  } catch {
    return [];
  }
}

export default async function ProfilePage() {
  const user = await requireUser("/account/profile");
  const addresses = await loadAddresses(user.id);

  return (
    <div className="space-y-8">
      <ProfileForm fullName={user.fullName} phone={null} email={user.email} />
      <AddressBook addresses={addresses} />
    </div>
  );
}
