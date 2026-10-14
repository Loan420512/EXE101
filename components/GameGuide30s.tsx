"use client";

/**
 * ==============================================================================
 * FILE: components/GameGuide30s.tsx
 * MỤC ĐÍCH: Trực quan hóa kịch bản 'Chơi trong 30 giây' qua 4 bước tự chuyển.
 * QUY CÁCH:
 * - Tự động chuyển bước sau 4.5 giây (kèm nút Tạm dừng/Tiếp tục và 4 chấm bấm chọn)
 * - 4 khu vực mô phỏng bàn cờ: Chợ Nhạc (ngửa), Trên tay, Bản nhạc đã đặt, Điểm số
 * - Kịch bản 4 bước chuẩn xác theo thiết kế game
 * ==============================================================================
 */

import React, { useState, useEffect } from "react";
import { GAMEPLAY_30S_STEPS } from "@/data/content";
import { ElementType } from "@/data/instruments";
import { IconPause, IconPlay, IconLightbulb, IconStore, IconHand, IconScore, IconTrophy } from "@/components/icons";

// Helper map tên nhạc cụ sang Element để gắn màu trực quan
const INSTRUMENT_ELEMENT_MAP: Record<string, { element: ElementType; color: string; tone: string }> = {
  "Đàn nhị": { element: "thuy", color: "#1F3F7E", tone: "Vũ" },
  "Cồng chiêng": { element: "kim", color: "#DDE3E8", tone: "Thương" },
  "Thanh la": { element: "kim", color: "#DDE3E8", tone: "Thương" },
  "Phách": { element: "moc", color: "#3F7D3B", tone: "Giốc" },
  "Trống cơm": { element: "tho", color: "#F2B632", tone: "Cung" },
  "Đàn đá": { element: "tho", color: "#F2B632", tone: "Cung" },
  "Đàn bầu": { element: "thuy", color: "#1F3F7E", tone: "Vũ" },
  "Đàn tranh": { element: "thuy", color: "#1F3F7E", tone: "Vũ" },
  "Sáo trúc": { element: "moc", color: "#3F7D3B", tone: "Giốc" },
  "Tù và": { element: "tho", color: "#F2B632", tone: "Cung" },
};

function MiniCard({
  name,
  isHighlighted = false,
}: {
  name: string;
  isHighlighted?: boolean;
}) {
  const cleanName = name.replace(/\s*\(.*?\)\s*/g, "");
  const info = INSTRUMENT_ELEMENT_MAP[cleanName] || {
    element: "thuy",
    color: "#1F3F7E",
    tone: "Vũ",
  };
  const isLight = info.element === "kim" || info.element === "tho";

  return (
    <div
      style={{
        backgroundColor: info.color,
        color: isLight ? "#16141A" : "#FFFFFF",
      }}
      className={`px-2.5 py-1.5 rounded-[3px] border-2 border-[#16141A] dark:border-[#E8EAE0] text-xs font-bold 
        shadow-[2px_2px_0px_#16141A] flex items-center justify-between gap-2 transition-all duration-300 ${
          isHighlighted
            ? "scale-105 ring-2 ring-[#D23A22] animate-pulse"
            : ""
        }`}
    >
      <span className="truncate">{cleanName}</span>
      <span className="text-[10px] opacity-80 font-mono px-1 rounded bg-black/15">
        {info.tone}
      </span>
    </div>
  );
}

export default function GameGuide30s() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Tự động chuyển bước sau 4.5s
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % GAMEPLAY_30S_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const stepData = GAMEPLAY_30S_STEPS[currentStep];

  return (
    <section id="choi-30s" className="py-20 realm-moc relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TIÊU ĐỀ */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-black tracking-widest uppercase text-[#8FD98A] on-photo-kicker block mb-2">
          HƯỚNG DẪN SIÊU TỐC
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl on-photo-heading">
          Chơi trong 30 giây
        </h2>
        <p className="mt-2 text-sm on-photo-muted">
          Xem một lượt đi mẫu điển hình để nắm ngay cơ chế kết hợp ngũ âm và ghi điểm.
        </p>
      </div>

      {/* KHUNG MINH HỌA CHÍNH */}
      <div className="bg-white dark:bg-[#1D1B22] rounded-[4px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[6px_6px_0px_#16141A] dark:shadow-[6px_6px_0px_#E8EAE0] p-6 lg:p-8">
        {/* THANH ĐIỀU KHIỂN & CÁC CHẤM BƯỚC */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#16141A]/20 dark:border-[#E8EAE0]/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg text-[#D23A22]">
              {stepData.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* 4 Chấm bước */}
            <div className="flex items-center gap-2">
              {GAMEPLAY_30S_STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`w-4 h-4 rounded-full border-2 border-[#16141A] transition-all duration-200 ${
                    currentStep === idx
                      ? "bg-[#D23A22] scale-125"
                      : "bg-[#DDE3E8] hover:bg-[#F2B632]"
                  }`}
                  aria-label={`Chuyển đến bước ${idx + 1}`}
                  title={`Bước ${idx + 1}`}
                />
              ))}
            </div>

            {/* Nút Play / Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-xs font-bold px-2.5 py-1 rounded border border-[#16141A] dark:border-[#E8EAE0] bg-stone-100 dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0]"
            >
              <span className="inline-flex items-center gap-1">
                {isPlaying ? <><IconPause size={12} aria-hidden /> Tạm dừng</> : <><IconPlay size={12} aria-hidden /> Tự chạy</>}
              </span>
            </button>
          </div>
        </div>

        {/* MÔ TẢ HÀNH ĐỘNG CỦA BƯỚC HIỆN TẠI */}
        <div className="mb-6 p-4 rounded bg-[#E8EAE0]/60 dark:bg-stone-800/60 border-l-4 border-l-[#F2B632] flex items-center gap-3">
          <IconLightbulb size={20} aria-hidden className="flex-shrink-0" />
          <p className="text-sm font-semibold text-[#16141A] dark:text-[#E8EAE0]">
            {stepData.actionText}
          </p>
        </div>

        {/* BÀN CỜ MÔ PHỎNG: 4 KHU VỰC */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* KHU VỰC 1: CHỢ NHẠC (5 LÁ NGỬA) */}
          <div className="md:col-span-6 p-4 rounded-[4px] border-2 border-dashed border-[#16141A]/50 dark:border-[#E8EAE0]/50 bg-stone-50 dark:bg-stone-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-[#16141A] dark:text-[#E8EAE0]">
                  <span className="inline-flex items-center gap-1.5"><IconStore size={16} aria-hidden /> Chợ Nhạc (Ngửa trên bàn)</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {stepData.marketCards.length} lá
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stepData.marketCards.map((card, idx) => (
                  <MiniCard
                    key={idx}
                    name={card}
                    isHighlighted={currentStep === 1 && card === "Đàn nhị"}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#524F59] dark:text-[#A8A6B0] mt-3 italic">
              Nơi mọi người chơi cùng quan sát và chọn lấy nhạc cụ vào tay.
            </p>
          </div>

          {/* KHU VỰC 2: BÀI TRÊN TAY */}
          <div className="md:col-span-6 p-4 rounded-[4px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-stone-50 dark:bg-stone-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-[#16141A] dark:text-[#E8EAE0]">
                  <span className="inline-flex items-center gap-1.5"><IconHand size={16} aria-hidden /> Bài trên tay bạn</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {stepData.handCards.length} lá
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {stepData.handCards.map((card, idx) => (
                  <MiniCard
                    key={idx}
                    name={card}
                    isHighlighted={
                      (currentStep === 1 && card === "Đàn nhị") ||
                      (currentStep === 2 && ["Đàn bầu", "Đàn tranh", "Đàn nhị"].includes(card))
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#524F59] dark:text-[#A8A6B0] mt-3 italic">
              Bí mật cầm trên tay, tìm kiếm cơ hội tạo tổ hợp hòa thanh.
            </p>
          </div>

          {/* KHU VỰC 3: BẢN NHẠC ĐÃ ĐẶT (TRÌNH TẤU) */}
          <div className="md:col-span-8 p-4 rounded-[4px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-white dark:bg-stone-900">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase text-[#D23A22]">
                <span className="inline-flex items-center gap-1.5"><IconScore size={16} aria-hidden /> Bản nhạc đã đặt (Trình tấu hợp lệ)</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#3F7D3B] text-white">
                {stepData.playedCards.length > 0 ? "Bộ 3 Họ Thủy (Hợp tấu)" : "Chưa hạ bài"}
              </span>
            </div>

            {stepData.playedCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
                {stepData.playedCards.map((card, idx) => (
                  <MiniCard key={idx} name={card} isHighlighted={true} />
                ))}
              </div>
            ) : (
              <div className="h-14 border border-dashed border-black/20 dark:border-white/20 rounded flex items-center justify-center text-xs text-[#524F59] dark:text-[#A8A6B0]">
                (Trống — Chờ đủ điều kiện để hạ bài)
              </div>
            )}
          </div>

          {/* KHU VỰC 4: ĐIỂM SỐ */}
          <div className="md:col-span-4 p-4 rounded-[4px] border-2 border-[#16141A] dark:border-[#E8EAE0] bg-[#F2B632]/25 dark:bg-[#F2B632]/10 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-black uppercase text-[#16141A] dark:text-[#E8EAE0]">
              <span className="inline-flex items-center gap-1.5"><IconTrophy size={16} aria-hidden /> Điểm tích lũy</span>
            </span>
            <span className="font-display font-black text-4xl text-[#D23A22] my-1">
              +{stepData.points}
            </span>
            <span className="text-[11px] font-bold text-[#524F59] dark:text-[#A8A6B0]">
              {stepData.points === 4 ? "Ghi 4 điểm từ Hợp tấu!" : "Mục tiêu: 15 điểm"}
            </span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
