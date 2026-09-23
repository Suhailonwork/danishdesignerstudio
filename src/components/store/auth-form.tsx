"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, Mail, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox, Input } from "@/components/ui/field";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export type AuthMode = "login" | "register";

export function AuthForm({
  mode: initialMode = "login",
  onSuccess,
  redirectTo = "/account",
  compact = false,
}: {
  mode?: AuthMode;
  onSuccess?: () => void;
  redirectTo?: string;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const signIn = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const signUp = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" },
  });

  const onSignIn = signIn.handleSubmit(async (values) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Sign-in is unavailable", {
        description: "Connect a Supabase project to enable accounts.",
      });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error("Could not sign you in", { description: error.message });
      return;
    }
    toast.success("Welcome back");
    onSuccess?.();
    router.push(redirectTo);
    router.refresh();
  });

  const onSignUp = signUp.handleSubmit(async (values) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("Registration is unavailable", {
        description: "Connect a Supabase project to enable accounts.",
      });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: `${values.firstName} ${values.lastName}`.trim() },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    if (error) {
      toast.error("Could not create your account", { description: error.message });
      return;
    }
    if (data.session) {
      toast.success("Account created");
      onSuccess?.();
      router.push(redirectTo);
      router.refresh();
    } else {
      toast.success("Check your inbox", {
        description: "Confirm your email address to finish creating the account.",
      });
      setMode("login");
    }
  });

  return (
    <div className="space-y-7">
      {/* Tab switch, mirroring the reference drawer */}
      <div className="grid grid-cols-2 border border-line">
        {(["login", "register"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={cn(
              "py-3 text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300",
              mode === value ? "bg-ink text-ivory" : "bg-transparent text-ash hover:text-ink"
            )}
          >
            {value === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>

      {!isSupabaseConfigured ? (
        <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
          Accounts are disabled until a Supabase project is connected. Add your keys to
          <code className="mx-1 bg-white/70 px-1">.env.local</code>
          to enable sign-in, registration and order history.
        </p>
      ) : null}

      {mode === "login" ? (
        <form onSubmit={onSignIn} className="space-y-5" noValidate>
          <div className="space-y-1">
            <h2 className={cn("font-display", compact ? "text-2xl" : "text-3xl")}>
              Welcome back
            </h2>
            <p className="text-sm text-ash">
              Sign in to see your orders, wishlist and saved addresses.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={signIn.formState.errors.email?.message}
            {...signIn.register("email")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              error={signIn.formState.errors.password?.message}
              {...signIn.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[2.1rem] text-ash transition-colors hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Checkbox label="Remember me" {...signIn.register("remember")} />
            <Link
              href="/account/forgot-password"
              className="text-xs text-ash underline underline-offset-4 hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={signIn.formState.isSubmitting}>
            {signIn.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Sign in
          </Button>
        </form>
      ) : (
        <form onSubmit={onSignUp} className="space-y-5" noValidate>
          <div className="space-y-1">
            <h2 className={cn("font-display", compact ? "text-2xl" : "text-3xl")}>
              Welcome aboard
            </h2>
            <p className="text-sm text-ash">
              Create an account for faster checkout and order tracking.
            </p>
          </div>

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={signUp.formState.errors.email?.message}
            {...signUp.register("email")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              autoComplete="given-name"
              error={signUp.formState.errors.firstName?.message}
              {...signUp.register("firstName")}
            />
            <Input
              label="Last name"
              autoComplete="family-name"
              error={signUp.formState.errors.lastName?.message}
              {...signUp.register("lastName")}
            />
          </div>

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={signUp.formState.errors.password?.message}
            {...signUp.register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={signUp.formState.errors.confirmPassword?.message}
            {...signUp.register("confirmPassword")}
          />

          <Button type="submit" className="w-full" disabled={signUp.formState.isSubmitting}>
            {signUp.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Create account
          </Button>

          <p className="text-[0.7rem] leading-relaxed text-ash">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </form>
      )}

      <p className="flex items-center justify-center gap-2 border-t border-line pt-5 text-xs text-ash">
        <Mail className="h-3.5 w-3.5" />
        Need help? Write to support@danishdesignerstudio.com
      </p>
    </div>
  );
}
