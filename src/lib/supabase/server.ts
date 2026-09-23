import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { SUPABASE_ANON_KEY, SUPABASE_URL, getServiceRoleKey, isSupabaseConfigured } from "./config";

/**
 * Request-scoped client that carries the signed-in user's session and therefore
 * runs under Row Level Security. Returns null when Supabase is not configured.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Trusted client that bypasses RLS. Only ever call this from server code that has
 * already verified the caller is an administrator.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const serviceKey = getServiceRoleKey();
  if (!isSupabaseConfigured || !serviceKey) return null;
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Read-only anon client for cacheable public reads (no cookies involved). */
export function getSupabasePublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
