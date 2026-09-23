"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "right" | "left" | "top";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  labelledBy?: string;
}

/**
 * Accessible slide-over: focus is moved in on open, restored on close, Escape
 * closes, and background scroll is locked while it is open.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    const timer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]");
      if (target) target.focus();
      else panelRef.current?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      window.clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const axis = side === "top" ? { y: "-100%" } : { x: side === "right" ? "100%" : "-100%" };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : "Panel"}
            tabIndex={-1}
            initial={axis}
            animate={{ x: 0, y: 0 }}
            exit={axis}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute flex flex-col bg-ivory shadow-[0_0_80px_-20px_rgba(0,0,0,0.45)]",
              side === "top"
                ? "inset-x-0 top-0 max-h-[85vh]"
                : cn(
                    "top-0 h-full w-full max-w-[26rem]",
                    side === "right" ? "right-0" : "left-0"
                  ),
              className
            )}
          >
            <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-7">
              <div className="min-w-0 font-display text-lg">{title}</div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ash transition-colors hover:border-ink hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 md:px-7">
              {children}
            </div>
            {footer ? (
              <footer className="border-t border-line bg-white px-5 py-5 md:px-7">{footer}</footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
