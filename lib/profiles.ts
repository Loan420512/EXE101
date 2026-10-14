/**
 * FILE: lib/profiles.ts
 * Hồ sơ người dùng trên máy (tối đa 5) cho màn "Ai đang chơi?" — U2.5.
 * - Chỉ lưu localStorage, không gửi đi đâu (luật 10). Bọc try/catch, vẫn chạy khi bộ nhớ bị chặn.
 * - Không có tài khoản, không có dữ liệu cá nhân ra ngoài máy.
 */

"use client";

import { useSyncExternalStore } from "react";
import type { UniverseId } from "@/config/universes";

export const MAX_PROFILES = 5;
const STORE_KEY = "ngucung_profiles";
const CURRENT_KEY = "ngucung_profile";
export const PROFILES_EVENT = "ngucung:profiles-changed";

export interface Profile {
  id: string;
  name: string;
  /** Avatar = hành (linh vật/thị giác của hành); "united" = Khách */
  avatar: UniverseId;
  /** Chế độ Bé 7–12 do phụ huynh bật khi tạo hồ sơ */
  isKid: boolean;
}

export const GUEST_PROFILE: Profile = {
  id: "guest",
  name: "Khách",
  avatar: "united",
  isKid: false,
};

const MAX_NAME = 24;
/** Lọc tên: ký tự bình thường + tiếng Việt, độ dài hữu hạn (không HTML/emoji trôi nổi) */
export function sanitizeName(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{M} .\-]+/gu, "")
    .trim()
    .slice(0, MAX_NAME);
}

function readProfiles(): Profile[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (p) =>
          p && typeof p.id === "string" && typeof p.name === "string" &&
          (p.avatar === undefined || typeof p.avatar === "string")
      )
      .slice(0, MAX_PROFILES)
      .map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar ?? "united",
        isKid: Boolean(p.isKid),
      }));
  } catch {
    return [];
  }
}

function readCurrentId(): string | null {
  try {
    return window.localStorage.getItem(CURRENT_KEY);
  } catch {
    return null;
  }
}

function write(list: Profile[], currentId: string | null | undefined) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(list));
    if (currentId !== undefined) {
      if (currentId === null) window.localStorage.removeItem(CURRENT_KEY);
      else window.localStorage.setItem(CURRENT_KEY, currentId);
    }
  } catch {
    // bộ nhớ đầy/bị chặn — giữ phiên hiện tại, không crash
  }
  window.dispatchEvent(new CustomEvent(PROFILES_EVENT));
}

export function addProfile(input: { name: string; avatar: UniverseId; isKid?: boolean }): Profile | null {
  const list = readProfiles();
  if (list.length >= MAX_PROFILES) return null;
  const name = sanitizeName(input.name);
  if (!name) return null;
  const profile: Profile = {
    id: `p-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`,
    name,
    avatar: input.avatar,
    isKid: Boolean(input.isKid),
  };
  write([...list, profile], profile.id);
  return profile;
}

export function removeProfile(id: string) {
  const list = readProfiles().filter((p) => p.id !== id);
  const cur = readCurrentId();
  write(list, cur === id ? null : cur);
}

export function setCurrentProfile(id: string | null) {
  write(readProfiles(), id);
}

// ── Store cho React ──

interface ProfilesSnapshot {
  profiles: Profile[];
  currentId: string | null;
}

let cache: ProfilesSnapshot | null = null;
const listeners = new Set<() => void>();
let bound = false;

/**
 * Snapshot phía server phải là MỘT object cố định. Trả object mới mỗi lần gọi
 * khiến React báo "The result of getServerSnapshot should be cached" và dễ
 * rơi vào vòng lặp render.
 */
const SERVER_SNAPSHOT: ProfilesSnapshot = { profiles: [], currentId: null };

function ensureBound() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener(PROFILES_EVENT, () => {
    cache = null; // đọc lại từ storage
    listeners.forEach((l) => l());
  });
  // Trang khác/tab khác đổi hồ sơ
  window.addEventListener("storage", (e) => {
    if (e.key === STORE_KEY || e.key === CURRENT_KEY) {
      cache = null;
      listeners.forEach((l) => l());
    }
  });
}

function getSnapshot(): ProfilesSnapshot {
  if (cache === null) {
    if (typeof window === "undefined") {
      return SERVER_SNAPSHOT;
    }
    cache = { profiles: readProfiles(), currentId: readCurrentId() };
  }
  return cache;
}

function getServerSnapshot(): ProfilesSnapshot {
  return SERVER_SNAPSHOT;
}

function subscribe(cb: () => void) {
  ensureBound();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProfiles() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const current =
    snap.currentId === "guest"
      ? GUEST_PROFILE
      : snap.profiles.find((p) => p.id === snap.currentId) ?? null;
  return {
    profiles: snap.profiles,
    currentId: snap.currentId,
    current,
    /** Chưa từng chọn hồ sơ (khác với đã chọn rồi) */
    hasChosen: snap.currentId !== null,
  };
}
