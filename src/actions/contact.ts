"use server";

import { z } from "zod";

import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const contactSchema = z.object({
  name: z.string().min(2, "Tell us your name").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(2, "Add a subject").max(140),
  message: z.string().min(10, "Please add a little more detail").max(2000),
  website: z.string().max(0).optional(),
});

export interface ContactResult {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContact(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors };
  }

  if (parsed.data.website) {
    return { ok: true, message: "Thank you — we will be in touch shortly." };
  }

  if (isSupabaseConfigured) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      });
      if (error) {
        return {
          ok: false,
          message: "We could not send your message. Please email support@danishdesignerstudio.com.",
        };
      }
    }
  }

  return {
    ok: true,
    message: "Thank you — our team replies within one working day.",
  };
}
