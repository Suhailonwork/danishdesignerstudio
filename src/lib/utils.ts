import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "₹0";
  return inrFormatter.format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function discountPercent(price: number, salePrice?: number | null) {
  if (!salePrice || salePrice >= price || price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function effectivePrice(price: number, salePrice?: number | null) {
  return salePrice && salePrice > 0 && salePrice < price ? salePrice : price;
}

export function truncate(input: string, max = 160) {
  const clean = input.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Stable pseudo-random helper so demo data renders identically on server + client. */
export function seededNumber(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 1000) / 1000;
  return Math.round(min + normalized * (max - min));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function parseNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export function orderStatusTone(status: string) {
  switch (status) {
    case "delivered":
    case "paid":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "shipped":
    case "confirmed":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "processing":
    case "pending":
    case "unpaid":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "cancelled":
    case "failed":
    case "returned":
      return "bg-rose-50 text-rose-800 border-rose-200";
    case "refunded":
    case "partially_refunded":
      return "bg-violet-50 text-violet-800 border-violet-200";
    default:
      return "bg-ivory-deep text-ash border-line";
  }
}

export function titleCase(input: string) {
  return input
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
