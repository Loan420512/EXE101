"use client";

/**
 * ==============================================================================
 * FILE: components/CardSheet.tsx
 * MỤC ĐÍCH: (U2.3) Phiếu xem trước trồi lên từ mép dưới cho thiết bị cảm ứng.
 * - Thay cho panel hover chỉ có trên desktop
 * - Nghe thử (âm mô phỏng), yêu thích, vào trang chi tiết — mỗi thứ một chạm
 * - Đóng bằng nền mờ, nút đóng, Esc, hoặc vuốt xuống
 * - Không tự phát tiếng (luật 8) — âm chỉ chạy khi người dùng bấm
 * ==============================================================================
 */

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { type Instrument, ELEMENT_CONFIG } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import InstrumentIllustration from "@/components/InstrumentIllustration";
import {
  IconClose, IconHeart, IconHeartFilled, IconMusicNote, IconArrowRight,
} from "@/components/icons";

interface Props {
  instrument: Instrument | null;
  onClose: () => void;
}

const SWIPE_DISMISS_PX = 80; // vuốt xuống quá chừng này thì đóng

export default function CardSheet({ instrument: inst, onClose }: Props) {
  const favorites = useFavorites();
  const primaryRef = useRef<HTMLAnchorElement | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!inst) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inst, onClose]);

  if (!inst) return null;

  const cfg = ELEMENT_CONFIG[inst.element];
  const isFav = favorites.includes(inst.id);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = startY.current;
    startY.current = null;
    if (from === null) return;
    if ((e.changedTouches[0]?.clientY ?? from) - from > SWIPE_DISMISS_PX) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      style={{ backgroundColor: "rgba(4,4,8,0.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${inst.name} — xem nhanh`}
        className="sheet-rise w-full max-w-lg rounded-t-[12px] border-[3px] border-b-0 border-[#16141A]
          bg-[#14161E] px-5 pt-2 pb-[76px] sm:pb-6"
        style={{ boxShadow: `inset 0 4px 0 0 ${cfg.color}, 0 -8px 40px rgba(0,0,0,0.5)` }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Tay kéo gợi ý vuốt xuống */}
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/25" aria-hidden />

        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 shrink-0 rounded-[4px] border-2 overflow-hidden flex items-center justify-center"
            style={{ borderColor: cfg.color, backgroundColor: cfg.color + "20" }}
          >
            <InstrumentIllustration instrumentId={inst.id} element={inst.element} size={80} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: cfg.color }}>
              Hành {inst.elementName} • Âm {inst.tone} • Nốt {inst.noteName}
            </p>
            <h3 className="font-display font-black text-2xl text-white leading-tight mt-0.5">
              {inst.name}
            </h3>
            <p className="text-xs text-white/65 mt-1.5" style={{ lineHeight: "var(--lh-body)" }}>
              {inst.summaryVerbatim}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Đóng phiếu xem trước"
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-[4px] text-white/60
              hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconClose size={16} aria-hidden />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
          <Link
            ref={primaryRef}
            href={`/nhac-cu/${inst.slug}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 rounded-[4px] border-[2px] px-3 py-2.5
              text-[13px] font-black text-[#16141A] transition-transform active:scale-[0.98]"
            style={{ backgroundColor: cfg.color, borderColor: "#16141A" }}
          >
            Xem chi tiết <IconArrowRight size={14} aria-hidden />
          </Link>

          <button
            onClick={() => soundEngine.playElementTone(inst.element, true)}
            aria-label={`Nghe thử âm ${inst.noteName} (âm mô phỏng)`}
            className="flex items-center gap-1.5 rounded-[4px] border-2 border-white/25 px-3 py-2.5
              text-[12px] font-bold text-white hover:bg-white/10 transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconMusicNote size={14} aria-hidden />
            {inst.noteName}
          </button>

          <button
            onClick={() => {
              toggleFavorite(inst.id);
              try { navigator.vibrate?.(10); } catch { /* trình duyệt không cho thì bỏ qua */ }
            }}
            aria-label={isFav ? `Bỏ ${inst.name} khỏi yêu thích` : `Thêm ${inst.name} vào yêu thích`}
            aria-pressed={isFav}
            className={`w-11 flex items-center justify-center rounded-[4px] border-2 transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]
              ${isFav ? "border-[#D23A22] text-[#D23A22] bg-[#D23A22]/10" : "border-white/25 text-white/60 hover:text-white"}`}
          >
            {isFav ? <IconHeartFilled size={16} aria-hidden /> : <IconHeart size={16} aria-hidden />}
          </button>
        </div>

        <p className="mt-3 text-[11px] text-white/40">
          Vuốt xuống hoặc bấm nền để đóng. Âm thanh là âm mô phỏng.
        </p>
      </div>
    </div>
  );
}
