/**
 * FILE: lib/collection.ts — U4
 * Bộ sưu tập nhạc cụ đã sưu được (mở gói bài). Lưu localStorage "ngucung_collection"
 * đúng như key mà PackOpeningModal và CollectionModal đang dùng — không tạo key mới.
 * "Danh sách của tôi" (yêu thích) là kho khác: ngucung_favorites.
 */

"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ngucung_collection";
export const COLLECTION_EVENT = "ngucung:collection-changed";

export function loadCollection(): string[] {
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

/** Phát sự kiện để mọi nơi đang đọc bộ sưu tập vẽ lại (sau khi mở gói bài). */
export function notifyCollectionChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COLLECTION_EVENT));
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COLLECTION_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(COLLECTION_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Danh sách id nhạc cụ đã sưu được. Mảng rỗng ổn định để không loop render. */
const EMPTY: string[] = [];
function getSnapshot(): string[] {
  const list = loadCollection();
  if (list.length === 0) return EMPTY;
  const key = list.join(",");
  if (key !== cachedKey) {
    cachedKey = key;
    cachedList = list;
  }
  return cachedList;
}
let cachedKey = "";
let cachedList: string[] = EMPTY;

export function useCollection(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}
