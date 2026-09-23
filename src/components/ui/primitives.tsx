import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "dark" | "sale" | "muted" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-white/95 text-ink border-line",
    dark: "bg-ink text-ivory border-ink",
    sale: "bg-wine text-ivory border-wine",
    muted: "bg-ivory-deep text-ash border-line",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 border px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  align = "center",
  className,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  align?: "center" | "left";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        action ? "md:flex-row md:items-end md:justify-between md:text-left" : "",
        className
      )}
    >
      <div className={cn("space-y-3", align === "center" && !action ? "max-w-2xl" : "")}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="text-3xl leading-tight sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {subtitle ? <p className="text-sm text-ash sm:text-base">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Rating({
  value,
  count,
  size = "sm",
  showValue = false,
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}) {
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              dimension,
              star <= rounded ? "fill-gold text-gold" : "fill-transparent text-line-strong"
            )}
            strokeWidth={1.4}
          />
        ))}
      </span>
      <span className="sr-only">{value.toFixed(1)} out of 5 stars</span>
      {showValue ? <span className="text-xs text-ink">{value.toFixed(1)}</span> : null}
      {typeof count === "number" ? (
        <span className="text-xs text-ash">({count})</span>
      ) : null}
    </div>
  );
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-ash">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-ink" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="h-3 w-3 text-line-strong" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 border border-dashed border-line bg-white/60 px-6 py-16 text-center",
        className
      )}
    >
      {icon ? <div className="text-ash-light">{icon}</div> : null}
      <div className="space-y-2">
        <h3 className="font-display text-xl">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-sm text-ash">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-3/4 w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}

export function Prose({ content, className }: { content: string; className?: string }) {
  // Intentionally small markdown subset: headings, bold, lists, paragraphs.
  const blocks = content.split(/\n{2,}/);
  return (
    <div className={cn("space-y-5 text-[0.95rem] leading-[1.75] text-ink-soft", className)}>
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="pt-2 font-display text-xl text-ink">
              {trimmed.slice(4)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-3 font-display text-2xl text-ink">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return (
            <ol key={index} className="ml-5 list-decimal space-y-2 marker:text-ash">
              {trimmed.split("\n").map((line, i) => (
                <li key={i}>{renderInline(line.replace(/^\d+\.\s/, ""))}</li>
              ))}
            </ol>
          );
        }
        if (trimmed.startsWith("- ")) {
          return (
            <ul key={index} className="ml-5 list-disc space-y-2 marker:text-line-strong">
              {trimmed.split("\n").map((line, i) => (
                <li key={i}>{renderInline(line.replace(/^-\s/, ""))}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
