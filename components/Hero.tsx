"use client";

/**
 * ==============================================================================
 * FILE: components/Hero.tsx
 * MỤC ĐÍCH: Phần Hero giới thiệu với 5 lá bài xòe quạt tương tác hiệu ứng biến ảo.
 * QUY CÁCH:
 * - Tiêu đề: 'Bộ bài năm hành, mười lăm nhạc cụ Việt Nam'
 * - 4 thông tin nhanh: 2 đến 5 người, 15 đến 20 phút, từ 13 tuổi, 45 lá
 * - Quạt 5 lá bài ngũ hành: Rê chuột nâng lên; Bấm vào chạy âm thanh + hiệu ứng biến ảo
 * - Sau hiệu ứng hiện ô thông tin tính chất họ và các nhạc cụ bên trong
 * ==============================================================================
 */

import React, { useState } from "react";
import CardFace from "./CardFace";
import { ElementType } from "@/data/instruments";
import { HERO_CONTENT, WUXING_DATA } from "@/data/content";
import { EffectTargetRect } from "@/effects/types";
import { soundEngine } from "@/lib/audio";

interface HeroProps {
  onTriggerEffect: (
    element: ElementType,
    rect: EffectTargetRect,
    onFinish: () => void
  ) => void;
  isEffectRunning: boolean;
}

const FAN_CARDS: {
  element: ElementType;
  instrumentName: string;
  tone: string;
  rotation: number;
  translateX: number;
  translateY: number;
}[] = [
  { element: "tho", instrumentName: "Đàn đá", tone: "Cung", rotation: -20, translateX: -60, translateY: 15 },
  { element: "kim", instrumentName: "Cồng chiêng", tone: "Thương", rotation: -10, translateX: -30, translateY: 5 },
  { element: "moc", instrumentName: "Sáo trúc", tone: "Giốc", rotation: 0, translateX: 0, translateY: 0 },
  { element: "hoa", instrumentName: "Đàn tỳ bà", tone: "Chủy", rotation: 10, translateX: 30, translateY: 5 },
  { element: "thuy", instrumentName: "Đàn bầu", tone: "Vũ", rotation: 20, translateX: 60, translateY: 15 },
];

export default function Hero({ onTriggerEffect, isEffectRunning }: HeroProps) {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>("thuy");
  const [animatingCard, setAnimatingCard] = useState<ElementType | null>(null);

  const handleCardClick = (
    element: ElementType,
    rect: EffectTargetRect
  ) => {
    if (isEffectRunning) return; // Khóa bấm chồng hiệu ứng

    // Phát âm thanh của họ bài
    soundEngine.playElementTone(element);
    setAnimatingCard(element);

    // Kích hoạt hiệu ứng canvas toàn màn hình
    onTriggerEffect(element, rect, () => {
      setAnimatingCard(null);
      setSelectedElement(element);
    });
  };

  const selectedElementData = WUXING_DATA.elements.find(
    (el) => el.id === selectedElement
  );

  return (
    <section id="hero" className="relative pt-12 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* CỘT TRÁI: TIÊU ĐỀ, MÔ TẢ & THÔNG TIN NHANH */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#F2B632] border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#D23A22]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#16141A]">
                {HERO_CONTENT.badge}
              </span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#16141A] dark:text-[#E8EAE0] leading-[1.12]">
              {HERO_CONTENT.title}
            </h1>

            <p className="text-base sm:text-lg text-[#524F59] dark:text-[#A8A6B0] max-w-2xl leading-relaxed">
              {HERO_CONTENT.description}
            </p>

            {/* CỤM NÚT KÊU GỌI HÀNH ĐỘNG */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#dang-ky"
                className="px-6 py-3.5 rounded-[4px] bg-[#D23A22] text-white font-display font-black 
                  text-base border-[3px] border-[#16141A] dark:border-[#E8EAE0] 
                  shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] 
                  hover:-translate-y-1 hover:shadow-[6px_6px_0px_#16141A] active:translate-y-0.5 transition-all"
              >
                {HERO_CONTENT.primaryCta}
              </a>
              <a
                href="#bo-bai"
                className="px-6 py-3.5 rounded-[4px] bg-white dark:bg-[#1D1B22] text-[#16141A] dark:text-[#E8EAE0] 
                  font-display font-bold text-base border-[3px] border-[#16141A] dark:border-[#E8EAE0] 
                  shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] 
                  hover:-translate-y-1 hover:shadow-[6px_6px_0px_#16141A] active:translate-y-0.5 transition-all"
              >
                {HERO_CONTENT.secondaryCta}
              </a>
            </div>

            {/* 4 THÔNG TIN NHANH */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-[2px] border-[#16141A]/20 dark:border-[#E8EAE0]/20">
              {HERO_CONTENT.quickFacts.map((fact, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/70 dark:bg-[#1D1B22]/70 rounded-[4px] border-[2px] border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] flex flex-col"
                >
                  <span className="text-[11px] font-bold text-[#524F59] dark:text-[#A8A6B0] uppercase">
                    {fact.label}
                  </span>
                  <span className="font-display font-black text-base text-[#16141A] dark:text-[#E8EAE0]">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: QUẠT 5 LÁ BÀI VÀ Ô THÔNG TIN HỌ BÀI */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* LỜI NHẮC TƯƠNG TÁC */}
            <div className="mb-4 text-xs font-bold text-[#524F59] dark:text-[#A8A6B0] flex items-center gap-1.5 bg-white/60 dark:bg-black/30 px-3 py-1 rounded-full border border-current/20">
              <span>✦ Rê chuột để nâng lá • Bấm lá để xem hiệu ứng biến ảo</span>
            </div>

            {/* VÙNG XÒE QUẠT 5 LÁ BÀI */}
            <div className="relative w-full h-80 sm:h-96 flex items-center justify-center pt-8">
              <div className="relative flex items-center justify-center w-64 h-80">
                {FAN_CARDS.map((card, idx) => {
                  const isCurrentAnimating = animatingCard === card.element;
                  const isSelected = selectedElement === card.element;

                  return (
                    <div
                      key={card.element}
                      style={{
                        transform: `translateX(${card.translateX}px) translateY(${card.translateY}px) rotate(${card.rotation}deg)`,
                        transformOrigin: "bottom center",
                        zIndex: isSelected ? 30 : 10 + idx,
                      }}
                      className="absolute transition-transform duration-300 hover:!scale-110 hover:!z-40 hover:!-translate-y-6"
                    >
                      <CardFace
                        name={card.instrumentName}
                        element={card.element}
                        tone={card.tone}
                        size="md"
                        isAnimating={isCurrentAnimating}
                        onClick={(rect) => handleCardClick(card.element, rect)}
                        className={isSelected ? "ring-4 ring-[#16141A] dark:ring-white" : ""}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ô THÔNG TIN HỌ BÀI ĐANG CHỌN (HIỆN SAU KHI BẤM HOẶC CHỌN) */}
            {selectedElementData && (
              <div
                style={{
                  borderLeftColor: selectedElementData.color,
                  borderLeftWidth: "6px",
                }}
                className="w-full mt-4 p-4 rounded-[4px] bg-white dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: selectedElementData.color }}
                      className="w-3.5 h-3.5 rounded-full border border-[#16141A]"
                    />
                    <h2 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0]">
                      Họ {selectedElementData.name} — Âm {selectedElementData.tone}
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">
                    {selectedElementData.note}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0] mb-2 italic">
                  &ldquo;{selectedElementData.character}&rdquo;
                </p>

                <div className="text-xs font-semibold text-[#16141A] dark:text-[#E8EAE0]">
                  <span className="text-[#524F59] dark:text-[#A8A6B0]">3 Nhạc cụ đại diện: </span>
                  <span className="font-bold underline decoration-2 decoration-[#D23A22]">
                    {selectedElementData.instrumentsText}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
