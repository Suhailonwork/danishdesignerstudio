"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AdminSignInForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Supabase is not connected", {
        description: "Add your project keys to .env.local to enable admin sign-in.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      toast.error("Sign-in failed", { description: error.message });
      return;
    }

    router.push(redirectTo);
    router.refresh();
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 border border-line bg-white p-8 lg:p-10"
      noValidate
    >
      <div className="space-y-2">
        <ShieldCheck className="h-7 w-7 text-ink" strokeWidth={1.2} />
        <h1 className="font-display text-2xl">Admin sign in</h1>
        <p className="text-sm text-ash">
          This area is restricted to Danish Designer Studio administrators.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Supabase is not connected. The admin panel is browsable in demo mode, but sign-in and all
          saving are disabled until you add <code className="bg-white/60 px-1">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and <code className="bg-white/60 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
      ) : null}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <KeyRound className="h-4 w-4" />
        )}
        Sign in
      </Button>
    </form>
  );
}
