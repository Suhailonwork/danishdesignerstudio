"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import type { AnnouncementItem } from "@/types";

export function AnnouncementBar({ items }: { items: AnnouncementItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[index] ?? items[0];

  return (
    <div className="relative overflow-hidden bg-ink text-ivory">
      <div className="container-lux flex h-10 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 text-center text-[0.68rem] tracking-[0.14em] uppercase sm:text-xs"
          >
            <span className="text-ivory/85">{item.text}</span>
            {item.linkText ? (
              <Link
                href={item.href || "/shop"}
                className="underline decoration-ivory/40 underline-offset-4 transition-colors hover:decoration-ivory"
              >
                {item.linkText}
              </Link>
            ) : null}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
