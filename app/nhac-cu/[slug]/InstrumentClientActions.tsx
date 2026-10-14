"use client";

/**
 * ==============================================================================
 * FILE: app/nhac-cu/[slug]/InstrumentClientActions.tsx
 * MỤC ĐÍCH: Nút nghe thử âm thanh có WaveformVisualizer và nút chia sẻ trang chi tiết.
 * ==============================================================================
 */

import React, { useState } from "react";
import { ElementType } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { IconMusicNote, IconLink } from "@/components/icons";

interface Props {
  element: ElementType;
  instrumentName: string;
  noteName: string;
}

export default function InstrumentClientActions({
  element,
  instrumentName,
  noteName,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlaySound = () => {
    setIsPlaying(true);
    soundEngine.playElementTone(element, true);
    setTimeout(() => setIsPlaying(false), 1400);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${instrumentName} — Ngũ Cung`,
          text: `Khám phá nhạc cụ ${instrumentName} trong bộ bài giáo dục âm nhạc Ngũ Cung!`,
          url,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-stone-100 dark:bg-stone-800/60 p-4 rounded border border-[#16141A]/20">
      {/* NÚT NGHE ÂM THỬ */}
      <button
        onClick={handlePlaySound}
        className="px-4 py-2 bg-[#D23A22] text-white text-xs font-bold rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#b8311c] cursor-pointer flex items-center gap-2 active:translate-y-[1px]"
      >
        <IconMusicNote size={14} aria-hidden />
        <span>Nghe âm thử ({noteName})</span>
      </button>

      {/* BIỂU ĐỒ SÓNG ÂM ANALYSER CHẠY THẬT */}
      <WaveformVisualizer element={element} isPlaying={isPlaying} />

      {/* NÚT CHIA SẺ LIÊN KẾT */}
      <button
        onClick={handleShare}
        className="px-3 py-2 bg-white dark:bg-stone-700 text-[#16141A] dark:text-[#E8EAE0] text-xs font-bold rounded border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] hover:bg-stone-50 cursor-pointer flex items-center gap-1.5"
      >
        <IconLink size={14} aria-hidden />
        <span>{copied ? "Đã sao chép!" : "Chia sẻ nhạc cụ"}</span>
      </button>
    </div>
  );
}
