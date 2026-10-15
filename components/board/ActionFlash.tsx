"use client";

/**
 * ==============================================================================
 * FILE: components/board/ActionFlash.tsx
 * MỤC ĐÍCH: (U6) Hoạt ảnh rõ ràng cho ba nước đi — Chọn nhạc cụ / Trình tấu / Phá âm.
 * Lớp phủ trong suốt, không chặn chạm, tự biến mất sau ~1 giây.
 * ==============================================================================
 */

import React from "react";
import { IconMusicNote, IconSparkles, IconSwords } from "@/components/icons";

export type FlashKind = "pick" | "present" | "break";
export interface BoardFlash {
  kind: FlashKind;
  title: string;
  detail: string;
  color: string;
}

const META: Record<FlashKind, { Icon: typeof IconMusicNote; anim: string }> = {
  pick: { Icon: IconMusicNote, anim: "board-flash-pick" },
  present: { Icon: IconSparkles, anim: "board-flash-present" },
  break: { Icon: IconSwords, anim: "board-flash-break" },
};

export default function ActionFlash({ flash }: { flash: BoardFlash | null }) {
  if (!flash) return null;
  const { Icon, anim } = META[flash.kind];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-[38%] z-40 flex justify-center px-4"
    >
      <div
        className={`relative flex items-center gap-3 rounded-[6px] border-[3px] border-[#16141A]
          px-5 py-3 shadow-[5px_5px_0px_#16141A] ${anim}`}
        style={{ backgroundColor: flash.color, color: "#16141A" }}
      >
        <Icon size={26} aria-hidden />
        <div className="leading-tight">
          <p className="font-display font-black text-body-sm sm:text-body">{flash.title}</p>
          <p className="text-label font-bold opacity-80">{flash.detail}</p>
        </div>
        <span className="board-ring" style={{ borderColor: flash.color }} />
      </div>
    </div>
  );
}
