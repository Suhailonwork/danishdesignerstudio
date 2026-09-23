"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-20">
      <div className="max-w-lg text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 font-display text-4xl lg:text-5xl">We hit a snag</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ash">
          The page could not be loaded. Trying again usually fixes it — if it keeps happening,
          write to support@danishdesignerstudio.com and we will look into it.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-ash-light">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
