"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const reviewSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  authorName: z.string().min(2, "Tell us your name").max(80),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  content: z.string().min(20, "Please write at least 20 characters").max(2000),
  // Honeypot: real users never fill this in.
  website: z.string().max(0).optional(),
});

export interface ActionResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function submitReview(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  if (parsed.data.website) {
    // Silently accept and drop: spam bots should not learn they were caught.
    return { ok: true, message: "Thank you — your review is awaiting moderation." };
  }

  if (!isSupabaseConfigured) {
    return {
      ok: true,
      message:
        "Thank you. Reviews are stored once a Supabase project is connected — nothing was saved in demo mode.",
    };
  }

  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error("Database unavailable");

    const user = await getCurrentUser();

    const { error } = await supabase.from("reviews").insert({
      product_id: parsed.data.productId,
      user_id: user?.id ?? null,
      author_name: parsed.data.authorName,
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      content: parsed.data.content,
      status: "pending",
      is_verified_purchase: false,
    });

    if (error) throw error;

    revalidatePath(`/product/${parsed.data.productSlug}`);
    return {
      ok: true,
      message: "Thank you — your review has been submitted and will appear once approved.",
    };
  } catch (error) {
    return {
      ok: false,
      message: `We could not save your review: ${(error as Error).message}`,
    };
  }
}
