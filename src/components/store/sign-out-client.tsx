"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutClient() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const supabase = getSupabaseBrowserClient();
      if (supabase) await supabase.auth.signOut();
      if (cancelled) return;
      setDone(true);
      router.refresh();
      window.setTimeout(() => router.push("/"), 900);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="space-y-5">
      {done ? (
        <>
          <h1 className="font-display text-3xl">You are signed out</h1>
          <p className="text-sm text-ash">Taking you back to the storefront…</p>
          <ButtonLink href="/" variant="outline" size="sm">
            Go home now
          </ButtonLink>
        </>
      ) : (
        <>
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-ash" />
          <p className="text-sm text-ash">Signing you out…</p>
        </>
      )}
    </div>
  );
}
