"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured, DEMO_MODE_MESSAGE } from "@/lib/supabase/config";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminResult<T = unknown> {
  ok: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string>;
}

/**
 * Every admin write goes through here. It refuses unless the caller is an
 * authenticated administrator, and prefers the service-role client so RLS does
 * not have to be relaxed for management tables.
 */
export async function getWritableClient(): Promise<
  { ok: true; client: SupabaseClient; actor: string } | { ok: false; message: string }
> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: DEMO_MODE_MESSAGE };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Your session expired. Please sign in again." };
  if (!user.isAdmin) return { ok: false, message: "You do not have permission to do that." };

  const client = getSupabaseAdminClient() ?? (await getSupabaseServerClient());
  if (!client) return { ok: false, message: "Database unavailable." };

  return { ok: true, client, actor: user.email };
}

const STORE_PATHS = ["/", "/shop", "/collections", "/blog"];

export async function revalidateStorefront(extra: string[] = []) {
  for (const path of [...STORE_PATHS, ...extra]) {
    try {
      revalidatePath(path);
    } catch {
      // revalidatePath throws outside a request scope; safe to ignore.
    }
  }
}

/** Generic upsert used by the simpler admin resources. */
export async function upsertRecord(
  table: string,
  values: Record<string, unknown>,
  id?: string | null,
  revalidate: string[] = []
): Promise<AdminResult<{ id: string }>> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const query = id
    ? access.client.from(table).update(values).eq("id", id).select("id").single()
    : access.client.from(table).insert(values).select("id").single();

  const { data, error } = await query;
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront([`/admin/${table}`, ...revalidate]);
  return { ok: true, message: id ? "Saved." : "Created.", data: { id: String(data.id) } };
}

export async function deleteRecord(
  table: string,
  id: string,
  revalidate: string[] = []
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from(table).delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(revalidate);
  return { ok: true, message: "Deleted." };
}

export async function toggleBoolean(
  table: string,
  id: string,
  column: string,
  value: boolean,
  revalidate: string[] = []
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client.from(table).update({ [column]: value }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(revalidate);
  return { ok: true, message: "Updated." };
}

export async function reorderRecords(
  table: string,
  orderedIds: string[],
  revalidate: string[] = []
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  for (const [index, id] of orderedIds.entries()) {
    const { error } = await access.client
      .from(table)
      .update({ display_order: index + 1 })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
  }

  await revalidateStorefront(revalidate);
  return { ok: true, message: "Order updated." };
}

/** Single-row settings documents (site_settings, global_seo). */
export async function saveSingleton(
  table: string,
  data: Record<string, unknown>
): Promise<AdminResult> {
  const access = await getWritableClient();
  if (!access.ok) return { ok: false, message: access.message };

  const { error } = await access.client
    .from(table)
    .upsert({ id: 1, data, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) return { ok: false, message: error.message };

  await revalidateStorefront(["/admin/settings", "/admin/seo"]);
  return { ok: true, message: "Settings saved." };
}
