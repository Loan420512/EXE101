"use client";

/**
 * FILE: components/CommandPalette.tsx
 * Bảng lệnh + tìm kiếm tức thì toàn màn hình (U3.2).
 * - Mở: phím "/" (ngoài ô nhập) hoặc Ctrl+K / Cmd+K
 * - Tìm chịu không dấu và gõ sai nhẹ; nhóm theo loại; điều hướng bằng phím
 * - Lịch sử tìm gần đây lưu trên máy
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchItems, loadSearchHistory, pushSearchHistory,
  buildSearchIndex, type SearchItem, type SearchItemType,
} from "@/lib/search";
import {
  IconSearch, IconMusicNote, IconHome, IconCommand, IconArrowRight, IconClock,
} from "@/components/icons";

export const OPEN_PALETTE_EVENT = "ngucung:open-palette";

const TYPE_LABEL: Record<SearchItemType, string> = {
  "nhac-cu": "Nhạc cụ",
  trang: "Trang",
  lenh: "Lệnh",
};

function TypeIcon({ type }: { type: SearchItemType }) {
  if (type === "nhac-cu") return <IconMusicNote size={16} aria-hidden />;
  if (type === "trang") return <IconHome size={16} aria-hidden />;
  return <IconCommand size={16} aria-hidden />;
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rawActiveIdx, setActiveIdx] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIdx(0);
    setHistory(loadSearchHistory());
  }, []);

  // Phím nóng toàn trang
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setActiveIdx(0);
        setHistory(loadSearchHistory());
        return;
      }
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openPalette]);

  useEffect(() => {
    const handler = () => openPalette();
    window.addEventListener(OPEN_PALETTE_EVENT, handler);
    return () => window.removeEventListener(OPEN_PALETTE_EVENT, handler);
  }, [openPalette]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    return searchItems(query);
  }, [query]);

  const flatItems: SearchItem[] = useMemo(() => {
    if (results) return results.items;
    // Gợi ý khi chưa gõ: lịch sử + vài trang chính
    const idx = buildSearchIndex();
    const histItems = history
      .map((h) => idx.find((i) => i.label.toLowerCase().startsWith(h.toLowerCase())) ?? null)
      .filter(Boolean).slice(0, 4) as SearchItem[];
    const home = idx.filter((i) => i.type === "trang").slice(0, 4);
    return [...histItems, ...home.filter((h) => !histItems.includes(h))];
  }, [results, history]);

  const select = useCallback((item: SearchItem) => {
    if (query.trim()) pushSearchHistory(query);
    setOpen(false);
    if (item.run) item.run();
    else if (item.href) router.push(item.href);
  }, [query, router]);

  // Con trỏ đang chọn: suy ra từ danh sách (không setState trong effect)
  const activeIdx = flatItems.length === 0 ? 0 : ((rawActiveIdx % flatItems.length) + flatItems.length) % flatItems.length;

  // Cuộn item đang chọn vào tầm nhìn
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  if (!open) return null;

  const grouped: Array<{ type: SearchItemType; items: SearchItem[] }> = [];
  for (const t of ["nhac-cu", "trang", "lenh"] as SearchItemType[]) {
    const items = flatItems.filter((i) => i.type === t);
    if (items.length) grouped.push({ type: t, items });
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (flatItems.length ? (i + 1) % flatItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (flatItems.length ? (i - 1 + flatItems.length) % flatItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[activeIdx];
      if (item) select(item);
    }
  };

  let runningIdx = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm và bảng lệnh"
      className="fixed inset-0 z-[95] flex items-start justify-center pt-[12vh] px-4"
      style={{ backgroundColor: "rgba(4,4,8,0.82)", backdropFilter: "blur(8px)" }}
      onClick={() => setOpen(false)}
      onKeyDown={onKeyDown}
    >
      <div
        className="w-full max-w-xl rounded-[6px] border-[3px] border-[#16141A] bg-[#14161E] overflow-hidden"
        style={{ boxShadow: "6px 6px 0px rgba(0,0,0,0.4), 0 0 40px rgba(242,182,50,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ô nhập */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b-2 border-white/10">
          <IconSearch size={18} className="text-[#F2B632] shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            placeholder="Gõ tên nhạc cụ, trang, hoặc lệnh… (thử “dan bau”)"
            aria-label="Tìm kiếm"
            aria-controls="palette-results"
            aria-activedescendant={flatItems[activeIdx] ? `palette-opt-${activeIdx}` : undefined}
            className="flex-1 bg-transparent text-white text-base placeholder:text-white/30 focus:outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] font-bold text-white/40 border border-white/20 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Danh sách kết quả */}
        <div
          id="palette-results"
          ref={listRef}
          role="listbox"
          aria-label="Kết quả"
          className="max-h-[52vh] overflow-y-auto py-2"
        >
          {!query.trim() && history.length > 0 && (
            <div className="px-4 pb-1">
              <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/40">
                <IconClock size={11} aria-hidden /> Tìm gần đây
              </p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {history.map((h) => (
                  <button
                    key={h}
                    onClick={() => setQuery(h)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20 text-white/70 hover:border-[#F2B632]/70 hover:text-white transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {grouped.map(({ type, items }) => (
            <div key={type} role="group" aria-label={TYPE_LABEL[type]}>
              <p className="px-4 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-white/40">
                {TYPE_LABEL[type]}
              </p>
              {items.map((item) => {
                runningIdx += 1;
                const idx = runningIdx;
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    id={`palette-opt-${idx}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => select(item)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-[#F2B632]/15" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[#F2B632] shrink-0"><TypeIcon type={item.type} /></span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-sm text-white truncate">{item.label}</span>
                      <span className="block text-xs text-white/50 truncate">{item.sub}</span>
                    </span>
                    {isActive && <IconArrowRight size={14} className="text-white/60 shrink-0" aria-hidden />}
                  </button>
                );
              })}
            </div>
          ))}

          {flatItems.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-bold text-white/70">
                Chưa tìm thấy “{query}”.
              </p>
              <p className="text-xs text-white/45 mt-1.5">
                Thử gõ không dấu (ví dụ “dan bau”), hoặc duyệt tất cả nhạc cụ trong Bộ bài.
              </p>
            </div>
          )}
        </div>

        {/* Chú thích phím */}
        <div className="flex items-center gap-4 px-4 py-2 border-t-2 border-white/10 text-[10px] font-bold text-white/40">
          <span>↑↓ di chuyển</span><span>Enter mở</span><span>Esc đóng</span>
          <span className="ml-auto hidden sm:inline">Mở nhanh bằng “/” hoặc Ctrl K</span>
        </div>
      </div>
    </div>
  );
}
