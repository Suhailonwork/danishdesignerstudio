"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

/**
 * Staggered entrance for the hero copy — headline, rule, subtitle, button —
 * so the panel resolves rather than snapping in. Honours reduced-motion.
 */
export function HeroContent({
  title,
  subtitle,
  cta,
}: {
  title?: string | null;
  subtitle?: string | null;
  cta?: { label: string; href: string };
}) {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 py-16 text-center text-ivory">
      <motion.h1
        {...rise(0.05)}
        className="max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-[4.75rem]"
      >
        {title}
      </motion.h1>

      <motion.span
        aria-hidden="true"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, scaleX: 0 },
              animate: { opacity: 1, scaleX: 1 },
              transition: { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const },
            })}
        className="mt-5 block h-px w-32 origin-center bg-ivory/45 sm:w-44"
      />

      {subtitle ? (
        <motion.p
          {...rise(0.38)}
          className="mt-5 max-w-md text-sm tracking-[0.05em] text-ivory/85 sm:text-base"
        >
          {subtitle}
        </motion.p>
      ) : null}

      {cta ? (
        <motion.div {...rise(0.5)}>
          <ButtonLink
            href={cta.href}
            size="lg"
            className="mt-9 border-ivory bg-ivory text-ink hover:bg-white"
          >
            {cta.label}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </motion.div>
      ) : null}
    </div>
  );
}
