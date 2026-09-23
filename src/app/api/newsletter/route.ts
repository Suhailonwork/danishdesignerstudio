import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email(),
  source: z.string().max(60).optional(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (supabase) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        { email: parsed.data.email.toLowerCase(), source: parsed.data.source ?? "site" },
        { onConflict: "email" }
      );

    if (error) {
      // A duplicate is a success from the subscriber's point of view.
      if (!error.message.toLowerCase().includes("duplicate")) {
        return NextResponse.json(
          { error: "We could not save your subscription. Please try again." },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({
    message: "Welcome — use code WELCOME20 for 20% off your first order.",
  });
}
