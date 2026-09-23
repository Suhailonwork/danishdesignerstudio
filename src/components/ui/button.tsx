import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "soft" | "danger" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-ink-soft border border-ink hover:-translate-y-[1px] hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
  ghost: "text-ink hover:bg-ivory-deep border border-transparent",
  soft: "bg-ivory-deep text-ink border border-line hover:border-line-strong hover:bg-white",
  danger: "bg-danger text-white border border-danger hover:opacity-90",
  link: "text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink px-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.72rem] uppercase tracking-[0.14em]",
  md: "h-11 px-6 text-[0.75rem] uppercase tracking-[0.16em]",
  lg: "h-14 px-9 text-[0.8rem] uppercase tracking-[0.18em]",
  icon: "h-10 w-10 p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

export function ButtonLink({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
  prefetch,
  ...props
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  prefetch?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
