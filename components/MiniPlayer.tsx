"use client";

/**
 * FILE: components/MiniPlayer.tsx — U4
 * Mini-player cố định đáy: tranh nhạc cụ, tên, họ, phát/tạm dừng, prev/next,
 * thanh tiến độ bấm/kéo được, sóng âm nhỏ, nút mở NowPlaying toàn màn.
 * - Không tự phát (muted mặc định)
 * - Ẩn khi queue trống
 * - Màu accent đổi theo hành đang phát
 * - Nằm trên BottomNav trên mobile (mb = 56px khi có BottomNav)
 */

import React, { useEffect, useRef, useState } from "react";
import { player, type PlayerState } from "@/lib/player";
import { ELEMENT_CONFIG } from "@/data/instruments";
import InstrumentArt from "@/components/InstrumentArt";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import {
  IconPlay, IconPause, IconSkipPrev, IconSkipNext,
  IconClose, IconChevronDown,
} from "@/components/icons";

interface MiniPlayerProps {
  /** Callback khi bấm mũi tên "mở rộng" → màn NowPlaying */
  onExpand?: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const [ps, setPs] = useState<PlayerState>(player.state);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return player.onUpdate(setPs);
  }, []);

  const track = ps.queue[ps.currentIndex] ?? null;
  if (!ps.isVisible || !track) return null;

  const inst = track.instrument;
  const cfg = ELEMENT_CONFIG[inst.element];

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = (e.clientX - rect.left) / rect.width;
    player.seek(pct);
  };

  return (
    <div
      className="fixed bottom-14 md:bottom-0 inset-x-0 z-50 select-none"
      role="region"
      aria-label="Mini player nhạc cụ"
    >
      {/* Thanh tiến độ — 44px vùng chạm, vạch mỏng 4px nhìn thấy rõ */}
      <div
        ref={progressRef}
        className="h-4 w-full flex items-center cursor-pointer"
        style={{ backgroundColor: "transparent" }}
        onClick={handleProgressClick}
        role="slider"
        tabIndex={0}
        aria-valuenow={Math.round(ps.progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(ps.progress * 100)}% của bản âm mô phỏng`}
        aria-label="Tiến độ phát"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") player.seek(ps.progress + 0.1);
          if (e.key === "ArrowLeft") player.seek(ps.progress - 0.1);
        }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: cfg.color + "30" }}>
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${ps.progress * 100}%`, backgroundColor: cfg.color }}
          />
        </div>
      </div>

      {/* Body player */}
      <div
        className="bg-[#0E1018]/95 backdrop-blur-md border-t border-white/10 px-3 py-2
          flex items-center gap-3"
        style={{ borderTopColor: cfg.color + "50" }}
      >
        {/* Tranh nhạc cụ */}
        <button
          onClick={onExpand}
          className="shrink-0 relative focus-visible:outline-2 focus-visible:outline-[#D23A22] rounded"
          aria-label="Mở màn Đang phát"
        >
          <InstrumentArt
            instrumentId={inst.id}
            element={inst.element}
            size={44}
            className="rounded-[3px] border-2 border-[#16141A]"
          />
        </button>

        {/* Tên + họ */}
        <button
          onClick={onExpand}
          className="flex-1 min-w-0 text-left focus-visible:outline-none"
          aria-label={`Đang phát: ${inst.name} — bản thử, âm mô phỏng`}
        >
          <p className="text-label font-bold text-white truncate leading-tight">{inst.name}</p>
          <p
            className="text-micro font-medium truncate"
            style={{ color: ps.error ? "#F2B632" : cfg.color }}
          >
            {ps.error
              ? ps.error
              : ps.isBuffering
                ? "Đang soạn âm…"
                : `Họ ${inst.elementName} · ${inst.tone} · ${inst.noteName}`}
          </p>
        </button>

        {/* Sóng âm nhỏ */}
        <div className="hidden sm:block shrink-0">
          <WaveformVisualizer
            element={inst.element}
            isPlaying={ps.isPlaying}
            className="w-[72px] h-[28px]"
          />
        </div>

        {/* Điều khiển */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => player.prev()}
            className="tap w-10 h-10 flex items-center justify-center rounded-full
              text-white/70 hover:text-white transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
            aria-label="Nhạc cụ trước"
          >
            <IconSkipPrev size={18} aria-hidden />
          </button>

          <button
            onClick={() => player.toggle()}
            disabled={Boolean(ps.error)}
            className="tap w-10 h-10 flex items-center justify-center rounded-full
              border-2 border-white/20 text-white hover:border-white/50
              transition-all focus-visible:outline-2 focus-visible:outline-[#D23A22]
              disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: ps.isPlaying ? cfg.color + "30" : "transparent" }}
            aria-label={ps.isPlaying ? "Tạm dừng" : "Phát"}
            aria-pressed={ps.isPlaying}
          >
            {ps.isPlaying
              ? <IconPause size={18} aria-hidden />
              : <IconPlay size={18} aria-hidden />
            }
          </button>

          <button
            onClick={() => player.next()}
            className="tap w-10 h-10 flex items-center justify-center rounded-full
              text-white/70 hover:text-white transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
            aria-label="Nhạc cụ tiếp theo"
          >
            <IconSkipNext size={18} aria-hidden />
          </button>

          {/* Mở NowPlaying */}
          <button
            onClick={onExpand}
            className="tap w-10 h-10 flex items-center justify-center rounded-full
              text-white/40 hover:text-white transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
            aria-label="Mở màn đang phát toàn màn"
          >
            <IconChevronDown size={18} className="rotate-180" aria-hidden />
          </button>
        </div>

        {/* Đóng player */}
        <button
          onClick={() => player.clearQueue()}
          className="tap w-8 h-8 flex items-center justify-center rounded-full
            text-white/30 hover:text-white/70 transition-colors
            focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          aria-label="Đóng trình phát"
        >
          <IconClose size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
