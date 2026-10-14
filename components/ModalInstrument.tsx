"use client";

/**
 * ==============================================================================
 * FILE: components/ModalInstrument.tsx
 * MỤC ĐÍCH: Modal giới thiệu chi tiết từng nhạc cụ trong 15 nhạc cụ Ngũ Cung.
 * QUY CÁCH:
 * - Mở ra với hiệu ứng loe từ vị trí lá bài (clip-path / scale origin)
 * - Nút 'Nghe âm thử' (phát trực tiếp WebAudio bất kể trạng thái Mute)
 * - Đầy đủ các trường: Giới thiệu, Cấu tạo, Cách chơi, Âm sắc, Vì sao thuộc hành đó
 * - Đánh dấu tem 'Bản nháp' theo đúng yêu cầu dự án
 * ==============================================================================
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Instrument } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";
import { EffectTargetRect } from "@/effects/types";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { IconMusicNote, IconBook, IconBlocks, IconHand, IconScore, IconTaiji, IconClose } from "@/components/icons";

interface ModalInstrumentProps {
  instrument: Instrument | null;
  originRect?: EffectTargetRect | null;
  onClose: () => void;
}

export default function ModalInstrument({
  instrument,
  onClose,
}: ModalInstrumentProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!instrument) return null;

  const handlePlaySound = () => {
    setIsPlaying(true);
    // Nút "Nghe âm thử" trong modal được phép phát bất chấp Mute
    soundEngine.playElementTone(instrument.element, true);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          borderTopColor: instrument.elementColor,
          borderTopWidth: "8px",
        }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1D1B22] 
          rounded-[4px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] 
          shadow-[8px_8px_0px_#16141A] dark:shadow-[8px_8px_0px_#E8EAE0] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* NÚT ĐÓNG MODAL */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded bg-[#E8EAE0] dark:bg-stone-800 border-2 border-[#16141A] dark:border-[#E8EAE0] 
            flex items-center justify-center font-black text-lg text-[#16141A] dark:text-[#E8EAE0] 
            hover:bg-[#D23A22] hover:text-white transition-colors"
          aria-label="Đóng"
        >
          <IconClose size={16} aria-hidden />
        </button>

        {/* HEADER MODAL */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            style={{
              backgroundColor: instrument.elementColor,
              color: instrument.textColor,
            }}
            className="px-2.5 py-0.5 rounded-[3px] border border-[#16141A] text-xs font-black uppercase"
          >
            Họ {instrument.elementName} • Âm {instrument.tone}
          </span>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[#524F59] dark:text-[#A8A6B0]">
            Nốt {instrument.noteName} ({instrument.noteFrequency})
          </span>
          <span className="px-2 py-0.5 rounded bg-[#F2B632] text-[#16141A] border border-[#16141A] text-[10px] font-black uppercase tracking-wider">
            {instrument.status}
          </span>
        </div>

        {/* TÊN NHẠC CỤ, BIỂU ĐỒ SÓNG ÂM & NÚT NGHE ÂM THỬ */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black/10 dark:border-white/10 pb-4 mb-6">
          <div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]">
              {instrument.name}
            </h2>
            <Link
              href={`/nhac-cu/${instrument.slug}`}
              className="inline-block mt-1 text-xs font-bold text-[#D23A22] hover:underline"
            >
              Mở trang riêng của nhạc cụ →
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <WaveformVisualizer
              element={instrument.element}
              isPlaying={isPlaying}
            />
            <button
              onClick={handlePlaySound}
              className="dongho-btn px-4 py-2 bg-[#D23A22] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#b52a14] cursor-pointer"
            >
              <span className="inline-flex items-center gap-1"><IconMusicNote size={14} aria-hidden /> Nghe âm thử ({instrument.noteName})</span>
            </button>
          </div>
        </div>

        {/* TRÍCH ĐOẠN NGUYÊN VĂN THIẾT KẾ */}
        <div className="mb-6 p-3.5 rounded bg-[#E8EAE0] dark:bg-stone-800/80 border-l-4 border-l-[#D23A22] text-xs sm:text-sm italic font-medium text-[#16141A] dark:text-[#E8EAE0]">
          &ldquo;{instrument.summaryVerbatim}&rdquo;
        </div>

        {/* CHI TIẾT CÁC MỤC THÔNG TIN */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* 1. GIỚI THIỆU */}
          <div>
            <h4 className="font-display font-black text-sm uppercase text-[#16141A] dark:text-[#E8EAE0] mb-1">
              <span className="inline-flex items-center gap-1.5"><IconBook size={16} aria-hidden /> Giới thiệu</span>
            </h4>
            <p className="text-[#524F59] dark:text-[#A8A6B0] leading-relaxed">
              {instrument.description}
            </p>
          </div>

          {/* 2. CẤU TẠO */}
          <div>
            <h4 className="font-display font-black text-sm uppercase text-[#16141A] dark:text-[#E8EAE0] mb-1">
              <span className="inline-flex items-center gap-1.5"><IconBlocks size={16} aria-hidden /> Cấu tạo</span>
            </h4>
            <p className="text-[#524F59] dark:text-[#A8A6B0] leading-relaxed">
              {instrument.structure}
            </p>
          </div>

          {/* 3. CÁCH CHƠI */}
          <div>
            <h4 className="font-display font-black text-sm uppercase text-[#16141A] dark:text-[#E8EAE0] mb-1">
              <span className="inline-flex items-center gap-1.5"><IconHand size={16} aria-hidden /> Cách chơi</span>
            </h4>
            <p className="text-[#524F59] dark:text-[#A8A6B0] leading-relaxed">
              {instrument.playMethod}
            </p>
          </div>

          {/* 4. ÂM SẮC */}
          <div>
            <h4 className="font-display font-black text-sm uppercase text-[#16141A] dark:text-[#E8EAE0] mb-1">
              <span className="inline-flex items-center gap-1.5"><IconScore size={16} aria-hidden /> Âm sắc</span>
            </h4>
            <p className="text-[#524F59] dark:text-[#A8A6B0] leading-relaxed">
              {instrument.timbre}
            </p>
          </div>

          {/* 5. VÌ SAO THUỘC HÀNH ĐÓ */}
          <div className="p-3 rounded bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-700">
            <h4 className="font-display font-black text-sm uppercase text-[#B3821B] dark:text-[#F2B632] mb-1">
              <span className="inline-flex items-center gap-1.5"><IconTaiji size={16} aria-hidden /> Vì sao thuộc hành {instrument.elementName}?</span>
            </h4>
            <p className="text-[#16141A] dark:text-[#E8EAE0] leading-relaxed">
              {instrument.elementReason}
            </p>
          </div>
        </div>

        {/* THÔNG BÁO BẢN NHÁP DƯỚI ĐÁY */}
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-center text-[11px] text-[#524F59] dark:text-[#A8A6B0]">
          <span>Quy mô: 3 lá / bộ bài (tổng 45 lá)</span>
          <span>Nội dung dữ liệu: Bản nháp thử nghiệm</span>
        </div>
      </div>
    </div>
  );
}
