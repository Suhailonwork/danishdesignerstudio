"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Reads a JSON array out of localStorage as a React external store.
 *
 * Using `useSyncExternalStore` (rather than a mount effect) means the server
 * snapshot is empty, the client snapshot is the real value, and updates from
 * other tabs propagate without an extra render pass.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
/** Snapshots must be referentially stable or React re-renders forever. */
const cache = new Map<string, { raw: string | null; value: unknown[] }>();

const EMPTY: unknown[] = [];

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getSnapshot(key: string): unknown[] {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value;

  let value: unknown[] = EMPTY;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) value = parsed;
    } catch {
      value = EMPTY;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set!.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

/** Writes the value and notifies every subscriber in this tab. */
export function writeLocalArray(key: string, value: unknown[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing or a full quota: state simply does not persist.
  }
  emit(key);
}

export function useLocalArray<T>(key: string): { value: T[]; hydrated: boolean } {
  const subscribeToKey = useCallback((listener: Listener) => subscribe(key, listener), [key]);
  const clientSnapshot = useCallback(() => getSnapshot(key), [key]);
  const serverSnapshot = useCallback(() => EMPTY, []);

  const value = useSyncExternalStore(subscribeToKey, clientSnapshot, serverSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeToKey,
    () => true,
    () => false
  );

  return useMemo(() => ({ value: value as T[], hydrated }), [value, hydrated]);
}
