"use client";

/**
 * ==============================================================================
 * FILE: components/board/HandFan.tsx
 * MỤC ĐÍCH: (U6) Bài trên tay xòe như cánh quạt, chạm bằng một ngón cái.
 * - Lá giữa cao nhất, hai lá biên nghiêng dần và hạ xuống → thành quạt
 * - Lá nằm trong tổ hợp đang trình tấu/phá âm được → làm sáng (viền nhấp nháy)
 * - Mỗi lá là nút 44px, điều hướng bằng phím mũi tên
 * Không đổi luật: chỉ hiển thị CardInstance mà lõi luật trả về.
 * ==============================================================================
 */

import React, { useLayoutEffect, useRef, useState } from "react";
import type { CardInstance } from "@/lib/rules/types";
import { ELEMENT_CONFIG } from "@/data/instruments";
import InstrumentArt from "@/components/InstrumentArt";

interface Props {
  cards: CardInstance[];
  /** instanceId thuộc nước đi hợp lệ → làm sáng */
  legalIds?: string[];
  /** lá vừa rút về: cho bay lên khi xuất hiện */
  enteringId?: string | null;
  disabled?: boolean;
  onSelect?: (card: CardInstance) => void;
  label?: string;
}

export default function HandFan({
  cards,
  legalIds = [],
  enteringId = null,
  disabled = false,
  onSelect,
  label = "Bài trên tay",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => setWidth(el.clientWidth || 360);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = cards.length;
  if (n === 0) {
    return (
      <div ref={wrapRef} className="flex items-center justify-center h-[150px] text-body-sm text-white/45 italic">
        Tay bài trống — hãy nhặt một lá từ Chợ Nhạc.
      </div>
    );
  }

  const mid = (n - 1) / 2;
  // Bước ngang và bề rộng lá: quạt luôn nằm gọn trong màn, kể cả 360px.
  const step = Math.min(64, Math.max(30, (width - 20) / Math.max(n + 1.2, 3.4)));
  const cardW = Math.round(Math.min(96, Math.max(48, step * 1.55)));
  const spread = n > 1 ? Math.min(9, 26 / (n - 1)) : 0;

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        const btns = Array.from(
          e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-fan-card]")
        );
        const at = btns.indexOf(document.activeElement as HTMLButtonElement);
        if (at < 0) return;
        e.preventDefault();
        const next = e.key === "ArrowRight" ? Math.min(at + 1, btns.length - 1) : Math.max(at - 1, 0);
        btns[next]?.focus();
      }}
      className="relative w-full"
      style={{ height: cardW + 78 }}
    >
      {cards.map((card, i) => {
        const off = i - mid;
        const cfg = ELEMENT_CONFIG[card.element];
        const isLegal = legalIds.includes(card.instanceId);
        const zIndex = isLegal ? 40 + i : 10 + i;
        return (
          <button
            key={card.instanceId}
            data-fan-card
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(card)}
            aria-label={`${card.name} — họ ${cfg.name}${isLegal ? ", có trong nước đi hợp lệ" : ""}`}
            className={`absolute bottom-0 flex flex-col items-center gap-1 rounded-[4px]
              border-[2px] border-[#16141A] bg-[#FFFDF9] px-1 pt-1 pb-1.5 text-[#16141A]
              transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.22,1,.36,1)]
              hover:!-translate-y-2 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-[#D23A22]
              disabled:cursor-not-allowed disabled:opacity-50
              ${isLegal ? "board-legal" : ""}
              ${card.instanceId === enteringId ? "board-fan-in" : ""}`}
            style={{
              left: `calc(50% + ${off * step}px)`,
              width: cardW,
              height: cardW + 70,
              transform: `translateX(-50%) rotate(${off * spread}deg)`,
              transformOrigin: "50% 135%",
              zIndex,
              boxShadow: isLegal
                ? `4px 6px 0px rgba(22,20,26,.9)`
                : `2px 4px 0px rgba(22,20,26,.75)`,
            }}
          >
            <span
              className="w-full truncate rounded-[3px] px-1 text-center text-micro font-black leading-tight"
              style={{ backgroundColor: cfg.color, color: cfg.textColor }}
            >
              {cfg.name}
            </span>
            <InstrumentArt
              instrumentId={card.instrumentId}
              element={card.element}
              size={Math.round(cardW * 0.72)}
              className="mx-auto shrink-0"
            />
            <span className="w-full text-center text-micro font-bold leading-tight text-[#16141A]">
              {card.name}
            </span>
            <span
              aria-hidden
              className="mt-auto w-full rounded-[2px] py-0.5 text-center text-[0.6rem] font-black tracking-wide"
              style={{ backgroundColor: cfg.color + "22", color: cfg.textColor }}
            >
              {cfg.tone}
            </span>
          </button>
        );
      })}
    </div>
  );
}
