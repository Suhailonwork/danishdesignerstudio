"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";

import { submitContact, type ContactResult } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(
    submitContact,
    null
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" label="Your name" required error={state?.fieldErrors?.name} />
        <Input
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
          error={state?.fieldErrors?.email}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="phone" type="tel" label="Phone (optional)" autoComplete="tel" />
        <Input
          name="subject"
          label="Subject"
          required
          placeholder="Sizing, order status, custom piece…"
          error={state?.fieldErrors?.subject}
        />
      </div>

      <Textarea
        name="message"
        label="Message"
        required
        rows={6}
        placeholder="Tell us about the occasion, the date and what you have in mind."
        error={state?.fieldErrors?.message}
      />

      {state ? (
        <p
          role="status"
          className={cn(
            "border px-4 py-3 text-sm",
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          )}
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </Button>
    </form>
  );
}
