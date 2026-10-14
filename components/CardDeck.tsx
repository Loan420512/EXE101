"use client";

/**
 * ==============================================================================
 * FILE: components/CardDeck.tsx
 * MỤC ĐÍCH: Lưới trưng bày 15 nhạc cụ truyền thống kèm bộ lọc 5 họ và modal chi tiết.
 * QUY CÁCH:
 * - Nút lọc 5 họ: Tất cả, Thổ, Kim, Mộc, Hỏa, Thủy
 * - Lưới 15 lá bài CardFace phong cách Đông Hồ
 * - Bấm lá bài -> kích hoạt hiệu ứng biến ảo ngũ hành -> mở ModalInstrument
 * ==============================================================================
 */

import React, { useState } from "react";
import CardFace from "./CardFace";
import ModalInstrument from "./ModalInstrument";
import { INSTRUMENTS, Instrument, ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";
import { soundEngine } from "@/lib/audio";

interface CardDeckProps {
  onTriggerEffect: (
    element: ElementType,
    rect: EffectTargetRect,
    onFinish: () => void
  ) => void;
  isEffectRunning: boolean;
}

export default function CardDeck({
  onTriggerEffect,
  isEffectRunning,
}: CardDeckProps) {
  const [filter, setFilter] = useState<ElementType | "all">("all");
  const [activeModalInstrument, setActiveModalInstrument] = useState<Instrument | null>(null);
  const [modalOriginRect, setModalOriginRect] = useState<EffectTargetRect | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  const filteredInstruments =
    filter === "all"
      ? INSTRUMENTS
      : INSTRUMENTS.filter((inst) => inst.element === filter);

  const handleFilterChange = (newFilter: ElementType | "all") => {
    setFilter(newFilter);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ngucung:set-scene", {
          detail: { element: newFilter === "all" ? "default" : newFilter, duration: 8000 },
        })
      );
    }
  };

  const handleCardClick = (inst: Instrument, rect: EffectTargetRect) => {
    if (isEffectRunning) return; // Chống bấm chồng

    // Phát âm thanh của họ
    soundEngine.playElementTone(inst.element);
    setAnimatingCardId(inst.id);

    // Kích hoạt chuyển cảnh nền đồng bộ với họ lá bài
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ngucung:set-scene", {
          detail: { element: inst.element, duration: 6000 },
        })
      );
    }

    // Kích hoạt hiệu ứng canvas toàn màn hình
    onTriggerEffect(inst.element, rect, () => {
      setAnimatingCardId(null);
      setModalOriginRect(rect);
      setActiveModalInstrument(inst);
    });
  };

  const filterOptions: { id: ElementType | "all"; label: string; color?: string }[] = [
    { id: "all", label: "Tất cả (15 nhạc cụ)" },
    { id: "tho", label: "Thổ • Cung", color: ELEMENT_CONFIG.tho.color },
    { id: "kim", label: "Kim • Thương", color: ELEMENT_CONFIG.kim.color },
    { id: "moc", label: "Mộc • Giốc", color: ELEMENT_CONFIG.moc.color },
    { id: "hoa", label: "Hỏa • Chủy", color: ELEMENT_CONFIG.hoa.color },
    { id: "thuy", label: "Thủy • Vũ", color: ELEMENT_CONFIG.thuy.color },
  ];

  return (
    <section id="bo-bai" className="py-20 realm-thuy relative overflow-hidden" style={{ backgroundColor: "var(--bg-diep)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TIÊU ĐỀ */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-black tracking-widest uppercase text-[#1B3B7A] dark:text-[#7CB9E8] block mb-2" style={{ lineHeight: "var(--lh-caption)" }}>
          THƯ VIỆN BÀI NGŨ CUNG
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]" style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}>
          Mười lăm nhạc cụ truyền thống
        </h2>
        <p className="mt-2 text-sm text-[#524F59] dark:text-[#A8A6B0]" style={{ lineHeight: "var(--lh-body)" }}>
          Mỗi nhạc cụ gồm 3 lá bài, tổng cộng 45 lá bài trong một bộ. Bấm vào từng lá bài để chiêm ngưỡng hiệu ứng biến ảo ngũ hành và nghe thử âm nốt.
        </p>
      </div>

      {/* THANH LỌC THEO 5 HỌ BÀI */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleFilterChange(opt.id)}
              style={
                isActive && opt.color
                  ? { backgroundColor: opt.color, color: opt.id === "kim" || opt.id === "tho" ? "#16141A" : "#FFFFFF" }
                  : {}
              }
              className={`px-3.5 py-1.5 rounded-[4px] border-2 border-[#16141A] dark:border-[#E8EAE0] text-xs font-bold 
                shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] transition-all duration-150 ${
                  isActive && !opt.color
                    ? "bg-[#16141A] text-white dark:bg-[#E8EAE0] dark:text-[#16141A]"
                    : !isActive
                    ? "bg-white dark:bg-[#1D1B22] text-[#16141A] dark:text-[#E8EAE0] hover:bg-stone-100 dark:hover:bg-stone-800"
                    : ""
                }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* LƯỚI 15 LÁ BÀI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
        {filteredInstruments.map((inst) => (
          <div key={inst.id} className="flex flex-col items-center">
            <CardFace
              name={inst.name}
              element={inst.element}
              tone={inst.tone}
              noteName={inst.noteName}
              size="md"
              isAnimating={animatingCardId === inst.id}
              onClick={(rect) => handleCardClick(inst, rect)}
            />
            <div className="mt-2 text-center">
              <span className="text-[11px] font-semibold text-[#524F59] dark:text-[#A8A6B0]">
                3 lá trong bộ
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CHI TIẾT NHẠC CỤ */}
      <ModalInstrument
        instrument={activeModalInstrument}
        originRect={modalOriginRect}
        onClose={() => {
          setActiveModalInstrument(null);
          setModalOriginRect(null);
        }}
      />
      </div>
    </section>
  );
}
