"use client";

/**
 * ==============================================================================
 * FILE: components/board/TableFelt.tsx
 * MỤC ĐÍCH: (U6) Giữa bàn chơi — Chợ Nhạc 5 lá, kẹp giữa là Cọc rút và Cọc bỏ
 * như hai chồng bài thật. Lá chợ đang chọn được thì sáng lên; lá hết chợ thì
 * hiện trạng thái rỗng, không để khoảng trống vô nghĩa.
 * ==============================================================================
 */

import React from "react";
import type { CardInstance } from "@/lib/rules/types";
import { ELEMENT_CONFIG } from "@/data/instruments";
import InstrumentArt from "@/components/InstrumentArt";
import { IconCardBack, IconMusicNote } from "@/components/icons";

interface Props {
  market: CardInstance[];
  deckCount: number;
  discardCount: number;
  /** tới lượt người thật và tay chưa đầy → chợ nhặt được */
  canPick: boolean;
  onPick: (index: number) => void;
}

export default function TableFelt({ market, deckCount, discardCount, canPick, onPick }: Props) {
  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      <Pile label="Cọc rút" count={deckCount} tone="draw" />

      {/* CHỢ NHẠC — chính giữa bàn */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <IconStoreMark />
          <h2 className="font-display font-black text-body-sm sm:text-body text-white text-center">
            Chợ Nhạc
          </h2>
          <span className="text-micro font-black uppercase tracking-wider text-white/45">
            chọn 1 lá về tay
          </span>
        </div>

        {market.length === 0 ? (
          <div className="h-[132px] sm:h-[150px] rounded-[6px] border-2 border-dashed border-white/25
            flex flex-col items-center justify-center gap-1 text-center px-3">
            <p className="text-body-sm font-bold text-white/70">Chợ Nhạc đang trống</p>
            <p className="text-label text-white/45">Bỏ lượt hoặc chờ ván kết thúc theo luật hiện hành.</p>
          </div>
        ) : (
          <ul
            className="grid list-none m-0 p-0 gap-2 sm:gap-3"
            style={{ gridTemplateColumns: `repeat(${market.length}, minmax(0, 1fr))` }}
          >
            {market.map((card, idx) => {
              const cfg = ELEMENT_CONFIG[card.element];
              const live = canPick;
              return (
                <li key={card.instanceId}>
                  <button
                    type="button"
                    disabled={!live}
                    onClick={() => onPick(idx)}
                    aria-label={`Nhặt ${card.name} — họ ${cfg.name} về tay`}
                    className={`tap group flex w-full flex-col items-center gap-1 rounded-[5px]
                      border-[2px] border-[#16141A] bg-[#FFFDF9] px-1 py-1.5 text-[#16141A]
                      transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]
                      ${live ? "board-legal hover:-translate-y-1.5 cursor-pointer" : "opacity-70 cursor-not-allowed"}`}
                    style={{ minHeight: 132 }}
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
                      size={56}
                      variant={idx % 3}
                      className="mx-auto"
                    />
                    <span className="w-full text-center text-label font-bold leading-tight">
                      {card.name}
                    </span>
                    <span
                      className="mt-auto w-full rounded-[2px] py-0.5 text-center text-micro font-black"
                      style={{ backgroundColor: cfg.color + "22", color: cfg.textColor }}
                    >
                      Nhặt
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Pile label="Cọc bỏ" count={discardCount} tone="discard" />
    </div>
  );
}

/** Chồng bài úp / ngửa — vẽ bằng lớp lang để trông như số lá thật. */
function Pile({ label, count, tone }: { label: string; count: number; tone: "draw" | "discard" }) {
  const layers = Math.min(4, Math.max(1, Math.ceil(count / 8)));
  const empty = count === 0;
  return (
    <div className="shrink-0 flex flex-col items-center justify-end gap-1.5 w-[58px] sm:w-[76px]">
      <div className="relative w-full" style={{ height: 96 }} aria-hidden>
        {Array.from({ length: layers }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-x-0 rounded-[4px] border-[2px]"
            style={{
              bottom: i * 6,
              height: 84,
              backgroundColor: tone === "draw" ? (empty ? "rgba(255,255,255,.08)" : "#1F3F7E") : "#3A3542",
              borderColor: "#16141A",
              boxShadow: "2px 2px 0px rgba(22,20,26,.8)",
              opacity: empty ? 0.5 : 1,
            }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex h-[84px] items-center justify-center">
          {tone === "draw" ? (
            <IconCardBack size={30} className={empty ? "text-white/25" : "text-white/85"} aria-hidden />
          ) : (
            <IconMusicNote size={26} className={empty ? "text-white/25" : "text-white/70"} aria-hidden />
          )}
        </div>
      </div>
      <p className="text-micro font-black uppercase tracking-wider text-white/55 text-center leading-tight">
        {label}
      </p>
      <p className="-mt-1 font-display font-black text-body-sm text-white tabular-nums">{count}</p>
    </div>
  );
}

function IconStoreMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2B632" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
      <path d="M3 9l2-5h14l2 5" />
      <path d="M4 9v10h16V9" />
      <path d="M9 19v-6h6v6" />
    </svg>
  );
}
