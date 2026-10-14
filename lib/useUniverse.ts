/**
 * FILE: lib/useUniverse.ts
 * Hook quản lý trạng thái vũ trụ hiện tại.
 * - Store ngoài React qua useSyncExternalStore (không setState trong effect)
 * - Lắng nghe event "ngucung:set-universe", nhớ vũ trụ gần nhất qua localStorage
 * - Phím tắt 1–5 và 0
 */
"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  type UniverseId,
  getStoredUniverse,
  storeUniverse,
  dispatchUniverseChange,
  UNIVERSES,
} from "@/config/universes";

const listeners = new Set<() => void>();
let current: UniverseId | null = null;
let bound = false;

function ensureBound() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener("ngucung:set-universe", (e) => {
    const id = (e as CustomEvent<{ id?: UniverseId }>).detail?.id;
    if (id && id in UNIVERSES) {
      current = id;
      storeUniverse(id);
      listeners.forEach((l) => l());
    }
  });
}

function subscribe(cb: () => void) {
  ensureBound();
  if (current === null) current = getStoredUniverse();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): UniverseId {
  if (current === null) current = getStoredUniverse();
  return current;
}

function getServerSnapshot(): UniverseId {
  return "united";
}

export function useUniverse() {
  const universeId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Phím tắt 0–5
  useEffect(() => {
    const map: Record<string, UniverseId> = {
      "1": "tho", "2": "kim", "3": "moc", "4": "hoa", "5": "thuy", "0": "united",
    };
    const handler = (e: KeyboardEvent) => {
      // Bỏ qua khi đang gõ input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) return;
      const id = map[e.key];
      if (id) dispatchUniverseChange(id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const setUniverse = useCallback((id: UniverseId) => {
    dispatchUniverseChange(id);
  }, []);

  return { universeId, setUniverse, universe: UNIVERSES[universeId] };
}
