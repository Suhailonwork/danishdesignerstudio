"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xs border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ash-light transition-colors duration-200 focus:border-ink focus:outline-none disabled:bg-ivory-deep disabled:text-ash aria-[invalid=true]:border-danger";

export function FieldShell({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="block text-[0.68rem] uppercase tracking-[0.16em] text-ash"
        >
          {label}
          {required ? <span className="ml-1 text-danger">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ash">{hint}</p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, wrapperClassName, id, required, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={wrapperClassName}
    >
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, className)}
        {...props}
      />
    </FieldShell>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, wrapperClassName, id, required, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={wrapperClassName}
    >
      <textarea
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, "min-h-28 resize-y leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
});

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, wrapperClassName, id, required, children, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      className={wrapperClassName}
    >
      <select
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(controlBase, "appearance-none bg-[length:0] pr-10", className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b6a67' stroke-width='1.4'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 1rem center",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
});

export function Checkbox({
  label,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-ink"
        {...props}
      />
      <label htmlFor={inputId} className="cursor-pointer text-sm leading-snug text-ink">
        {label}
      </label>
    </div>
  );
}
