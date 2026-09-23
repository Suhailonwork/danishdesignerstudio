"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Password reset is unavailable", {
        description: "Connect a Supabase project to enable it.",
      });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) {
      toast.error("Could not send the reset link", { description: error.message });
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <MailCheck className="mx-auto h-8 w-8 text-emerald-700" strokeWidth={1.3} />
        <h1 className="font-display text-2xl">Check your inbox</h1>
        <p className="text-sm text-ash">
          If an account exists for that address, a password reset link is on its way.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h1 className="font-display text-2xl">Reset your password</h1>
        <p className="text-sm text-ash">
          Enter the email on your account and we will send you a secure reset link.
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Password reset requires a connected Supabase project.
        </p>
      ) : null}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Send reset link
      </Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Password reset is unavailable");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) {
      toast.error("Could not update your password", { description: error.message });
      return;
    }
    toast.success("Password updated");
    router.push("/account");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <h1 className="font-display text-2xl">Choose a new password</h1>
        <p className="text-sm text-ash">
          Open this page from the link in your email, then set a new password below.
        </p>
      </div>

      <Input
        label="New password"
        type="password"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register("confirmPassword")}
      />

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Update password
      </Button>
    </form>
  );
}
