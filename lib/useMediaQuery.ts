"use client";

/**
 * FILE: lib/useMediaQuery.ts
 * MỤC ĐÍCH: đọc media query như một store ngoài (useSyncExternalStore),
 * không cần setState trong useEffect.
 * - server/SSR luôn trả về false để tránh hydration mismatch
 * - dùng cho "(hover: none)" (quyết định bottom sheet hay panel hover) và "(prefers-reduced-motion: reduce)"
 */

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** true trên thiết bị chạm (không có con trỏ bay) */
export const useIsTouch = () => useMediaQuery("(hover: none) and (pointer: coarse)");
