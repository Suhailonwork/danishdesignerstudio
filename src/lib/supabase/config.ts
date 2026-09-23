/**
 * Supabase is optional at build/dev time. Until real credentials are present the
 * app serves bundled demo content so the storefront is fully browsable and
 * `next build` never fails on a missing environment variable.
 */

const PLACEHOLDER_HINTS = ["your-project", "your-anon", "your-service", "example", "changeme"];

function isRealValue(value: string | undefined | null) {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length < 16) return false;
  return !PLACEHOLDER_HINTS.some((hint) => trimmed.toLowerCase().includes(hint));
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const isSupabaseConfigured = isRealValue(SUPABASE_URL) && isRealValue(SUPABASE_ANON_KEY);

/** Server-only. Never import this into a Client Component. */
export function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return isRealValue(key) ? key! : null;
}

export const DEMO_MODE_MESSAGE =
  "Supabase is not connected yet. The site is running on bundled demo data — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to go live.";
