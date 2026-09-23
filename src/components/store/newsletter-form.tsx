"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "loading") return;

    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Enter a valid email address");
      return;
    }

    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const payload = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Subscription failed");
      setState("done");
      setEmail("");
      toast.success("You're on the list", {
        description: payload.message ?? "Your 20% welcome code is on its way.",
      });
    } catch (error) {
      setState("idle");
      toast.error("Could not subscribe", { description: (error as Error).message });
    }
  }

  if (state === "done") {
    return (
      <p
        className={cn(
          "flex items-center gap-2 border border-line bg-ivory-deep px-5 py-4 text-sm text-ink",
          className
        )}
      >
        <Check className="h-4 w-4 text-emerald-700" />
        Thank you — check your inbox for the welcome code.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full items-stretch", className)}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        className="min-w-0 flex-1 border border-line border-r-0 bg-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-ash-light focus:border-ink"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex shrink-0 items-center gap-2 bg-ink px-6 text-[0.7rem] uppercase tracking-[0.16em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Subscribe
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
