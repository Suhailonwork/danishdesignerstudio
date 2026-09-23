"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";
import { AlertTriangle, Loader2, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { AdminResult } from "@/actions/admin/core";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-ash">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Card({
  title,
  description,
  children,
  actions,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-line bg-white", className)}>
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-base text-ink">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-ash">{description}</p> : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const tones = {
    default: "border-line",
    warning: "border-amber-200 bg-amber-50/60",
    danger: "border-rose-200 bg-rose-50/60",
    success: "border-emerald-200 bg-emerald-50/60",
  };

  return (
    <div className={cn("border bg-white p-5", tones[tone])}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ash">{label}</p>
        {icon ? <span className="text-ash">{icon}</span> : null}
      </div>
      <p className="mt-3 font-display text-3xl tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ash">{hint}</p> : null}
    </div>
  );
}

export function SubmitButton({
  children = "Save changes",
  className,
  variant = "primary",
}: {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} variant={variant}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {children}
    </Button>
  );
}

export function FormFeedback({ state }: { state: AdminResult | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={cn(
        "border px-4 py-3 text-sm",
        state.ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-rose-200 bg-rose-50 text-rose-900"
      )}
    >
      {state.message}
    </p>
  );
}

export function Toggle({
  name,
  label,
  description,
  defaultChecked,
  onChange,
  checked,
}: {
  name?: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
        className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
      />
      <span>
        <span className="block text-sm text-ink">{label}</span>
        {description ? <span className="block text-xs text-ash">{description}</span> : null}
      </span>
    </label>
  );
}

/** Destructive action with an inline confirmation step. */
export function ConfirmAction({
  label = "Delete",
  confirmLabel = "Confirm delete",
  onConfirm,
  icon,
  className,
}: {
  label?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<AdminResult>;
  icon?: ReactNode;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  async function run() {
    setPending(true);
    const result = await onConfirm();
    setPending(false);
    setConfirming(false);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={cn(
          "inline-flex items-center gap-1.5 text-xs text-ash transition-colors hover:text-danger",
          className
        )}
      >
        {icon ?? <Trash2 className="h-3.5 w-3.5" />}
        {label}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="inline-flex items-center gap-1.5 border border-danger px-2.5 py-1 text-xs text-danger disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
        {confirmLabel}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-ash hover:text-ink"
      >
        Cancel
      </button>
    </span>
  );
}

export function AdminTable({
  head,
  children,
  empty,
}: {
  head: ReactNode[];
  children: ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[46rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {head.map((cell, index) => (
              <th
                key={index}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-[0.64rem] uppercase tracking-[0.14em] text-ash first:pl-0 last:pr-0"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty ? (
        <p className="border-t border-line py-10 text-center text-sm text-ash">
          Nothing here yet.
        </p>
      ) : null}
    </div>
  );
}

export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-4 align-middle first:pl-0 last:pr-0", className)}>{children}</td>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "muted";
}) {
  const tones = {
    default: "border-line bg-ivory-deep text-ink",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-rose-200 bg-rose-50 text-rose-800",
    muted: "border-line bg-white text-ash",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap border px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.12em]",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-ash">
        {children}
      </td>
    </tr>
  );
}

export function LinkButton({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center gap-2 px-5 text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
        variant === "primary"
          ? "border border-ink bg-ink text-ivory hover:bg-ink-soft"
          : "border border-line text-ink hover:border-ink"
      )}
    >
      {children}
    </Link>
  );
}
