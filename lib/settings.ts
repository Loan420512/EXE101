/**
 * FILE: lib/settings.ts — U7
 * Cài đặt người dùng: cỡ chữ, tương phản cao, giảm chuyển động, sáng/tối, hiệu ứng.
 * Lưu localStorage, không gửi đi đâu.
 */
"use client";

import { useSyncExternalStore } from "react";

const KEY = "ngucung_settings";

export interface AppSettings {
  fontSize: "default" | "large" | "xlarge";
  contrast: "default" | "high";
  motion: "full" | "reduced" | "none";
  colorScheme: "auto" | "light" | "dark";
  effects: "full" | "medium" | "minimal";
  kidMode: boolean;
  parentPin: string | null; // bcrypt hash sẽ bổ sung sau; hiện giản lược
}

const DEFAULTS: AppSettings = {
  fontSize: "default",
  contrast: "default",
  motion: "full",
  colorScheme: "auto",
  effects: "full",
  kidMode: false,
  parentPin: null,
};

const SETTINGS_EVENT = "ngucung:settings-changed";

function read(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { return { ...DEFAULTS }; }
}

/** Đọc cài đặt đang lưu — dùng cho bootstrap lúc trang hiện ra. */
export function readSettings(): AppSettings { return read(); }

function write(s: AppSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: s }));
  applyToDOM(s);
}

export function applyToDOM(s: AppSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  // Font size
  const fontMap = { default: "100%", large: "112.5%", xlarge: "125%" };
  root.style.setProperty("--user-font-scale", fontMap[s.fontSize]);
  // Contrast
  root.classList.toggle("contrast-high", s.contrast === "high");
  // Motion
  root.classList.toggle("motion-reduced", s.motion !== "full");
  root.classList.toggle("motion-none", s.motion === "none");
  // Kid mode
  root.classList.toggle("kid-mode", s.kidMode);
  // Effects
  root.classList.toggle("effects-medium", s.effects === "medium");
  root.classList.toggle("effects-minimal", s.effects === "minimal");
  // Color scheme
  if (s.colorScheme !== "auto") {
    root.setAttribute("data-color-scheme", s.colorScheme);
  } else {
    root.removeAttribute("data-color-scheme");
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SETTINGS_EVENT, cb);
  return () => window.removeEventListener(SETTINGS_EVENT, cb);
}

// useSyncExternalStore cần snapshot ổn định: chỉ dựng object mới khi chuỗi localStorage đổi.
let cachedSnapshot: AppSettings | null = null;
let cachedRaw: string | null | undefined;
const SERVER_SNAPSHOT: AppSettings = { ...DEFAULTS };

function getSnapshot(): AppSettings {
  const raw = typeof window === "undefined" ? null : localStorage.getItem(KEY);
  if (cachedSnapshot === null || raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = read();
  }
  return cachedSnapshot;
}

export function useSettings(): [AppSettings, (patch: Partial<AppSettings>) => void] {
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const update = (patch: Partial<AppSettings>) => {
    write({ ...read(), ...patch });
  };
  return [settings, update];
}

export function updateSetting<K extends keyof AppSettings>(key: K, val: AppSettings[K]) {
  write({ ...read(), [key]: val });
}

export function resetSettings() {
  try { localStorage.removeItem(KEY); } catch {}
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { ...DEFAULTS } }));
  applyToDOM({ ...DEFAULTS });
}
