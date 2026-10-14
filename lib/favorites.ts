/**
 * FILE: lib/favorites.ts
 * Danh sách nhạc cụ yêu thích — lưu trên máy người dùng (localStorage), không gửi đi đâu.
 * Luật bất biến #10: mọi lưu trữ bọc try/catch, vẫn chạy khi bộ nhớ trống hoặc bị chặn.
 * Sự kiện "ngucung:favorites-changed" phát toàn trang để UI cập nhật theo.
 */

"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ngucung_favorites";
export const FAVORITES_EVENT = "ngucung:favorites-changed";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(list: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // bộ nhớ đầy hoặc bị chặn — giữ trạng thái trong phiên, không crash
  }
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { count: list.length } }));
}

export function isFavorite(id: string): boolean {
  return loadFavorites().includes(id);
}

/** Bật/tắt yêu thích, trả về trạng thái mới */
export function toggleFavorite(id: string): boolean {
  const list = loadFavorites();
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
    save(list);
    return false;
  }
  list.push(id);
  save(list);
  return true;
}

/** Xóa toàn bộ dữ liệu cá nhân (dùng chung cho trang Hồ sơ/Cài đặt sau này) */
export function clearFavorites() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // bỏ qua — bộ nhớ bị chặn
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: { count: 0 } }));
  }
}

// ── Store cho React (useSyncExternalStore — không setState trong effect) ──

const EMPTY: string[] = [];
let cache: string[] | null = null;
const listeners = new Set<() => void>();
let bound = false;

function ensureBound() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener(FAVORITES_EVENT, () => {
    cache = loadFavorites();
    listeners.forEach((l) => l());
  });
}

function subscribe(cb: () => void) {
  ensureBound();
  if (cache === null) cache = loadFavorites();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): string[] {
  if (cache === null) cache = loadFavorites();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

/** Mảng id nhạc cụ yêu thích, cập nhật tức thì khi thay đổi */
export function useFavorites(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
