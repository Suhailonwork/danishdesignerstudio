"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface ProfileResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Enter your full name").max(120),
  phone: z.string().max(20).optional(),
});

const addressSchema = z.object({
  label: z.string().max(40).optional(),
  fullName: z.string().min(2, "Enter the recipient name").max(120),
  phone: z.string().min(7, "Enter a contact number").max(20),
  line1: z.string().min(3, "Enter the address").max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, "Enter the city").max(80),
  state: z.string().min(2, "Enter the state").max(80),
  postalCode: z.string().min(4, "Enter the PIN code").max(12),
  country: z.string().min(2).max(80).default("India"),
  isDefault: z.union([z.literal("on"), z.literal("")]).optional(),
});

function collectErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function updateProfile(
  _prev: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: collectErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Please sign in again." };

  if (!isSupabaseConfigured) {
    return { ok: false, message: "Connect Supabase to save profile changes." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Database unavailable." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName, phone: parsed.data.phone || null })
    .eq("id", user.id);

  if (error) return { ok: false, message: `Could not save: ${error.message}` };

  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { ok: true, message: "Profile updated." };
}

export async function saveAddress(
  _prev: ProfileResult | null,
  formData: FormData
): Promise<ProfileResult> {
  const parsed = addressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: collectErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Please sign in again." };

  if (!isSupabaseConfigured) {
    return { ok: false, message: "Connect Supabase to save addresses." };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Database unavailable." };

  const isDefault = parsed.data.isDefault === "on";

  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    label: parsed.data.label || "Home",
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    line1: parsed.data.line1,
    line2: parsed.data.line2 || null,
    city: parsed.data.city,
    state: parsed.data.state,
    postal_code: parsed.data.postalCode,
    country: parsed.data.country,
    is_default: isDefault,
  });

  if (error) return { ok: false, message: `Could not save: ${error.message}` };

  revalidatePath("/account/profile");
  return { ok: true, message: "Address saved." };
}

export async function deleteAddress(id: string): Promise<ProfileResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Please sign in again." };

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Database unavailable." };

  const { error } = await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, message: `Could not delete: ${error.message}` };

  revalidatePath("/account/profile");
  return { ok: true, message: "Address removed." };
}
