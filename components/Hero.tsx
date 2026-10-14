"use client";

/**
 * ==============================================================================
 * FILE: components/Hero.tsx
 * MỤC ĐÍCH: Hero "Cõi Ngũ Âm" — khoảnh khắc đầu tiên người xem bước vào.
 * THIẾT KẾ:
 * - Diorama 3 lớp: nền Đông Hồ mờ → hạt linh khí nổi → quạt 5 lá bài
 * - Tiêu đề phát sáng nhẹ (text-shadow glow) theo hành đang chọn
 * - Badge "Bản xem trước" với đốm sáng pulse
 * - 4 thông tin nhanh trên "bảng giấy" Đông Hồ
 * - Ô thông tin hành đang chọn: border trái màu hành + glow nhẹ
 * - Nguyên tắc vàng: tiêu đề trên nền trắng ngà, hiệu ứng ở nền/rìa
 * ==============================================================================
 */

import React, { useState, useRef, useEffect } from "react";
import CardFace from "./CardFace";
import { ElementType } from "@/data/instruments";
import { HERO_CONTENT, WUXING_DATA } from "@/data/content";
import { EffectTargetRect } from "@/effects/types";
import { soundEngine } from "@/lib/audio";
import { dispatchSceneChange } from "@/data/scenes";

interface HeroProps {
  onTriggerEffect: (element: ElementType, rect: EffectTargetRect, onFinish: () => void) => void;
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
  { element: "tho",  instrumentName: "Đàn đá",     tone: "Cung",   rotation: -20, translateX: -60, translateY: 15 },
  { element: "kim",  instrumentName: "Cồng chiêng", tone: "Thương", rotation: -10, translateX: -30, translateY: 5  },
  { element: "moc",  instrumentName: "Sáo trúc",    tone: "Giốc",   rotation:   0, translateX:   0, translateY: 0  },
  { element: "hoa",  instrumentName: "Đàn tỳ bà",   tone: "Chủy",   rotation:  10, translateX:  30, translateY: 5  },
  { element: "thuy", instrumentName: "Đàn bầu",     tone: "Vũ",     rotation:  20, translateX:  60, translateY: 15 },
];

// Halo sát chữ + hào quang đa tầng — nổi bật trên nền giấy điệp sáng lẫn tối, giữ nét chữ sắc sảo
const ELEMENT_TEXT_GLOW: Record<ElementType, string> = {
  tho:  "0 1px 2px rgba(26,23,32,0.18), 0 0 8px rgba(242,182,50,0.9), 0 0 24px rgba(242,182,50,0.6), 0 0 44px rgba(242,182,50,0.35)",
  kim:  "0 1px 2px rgba(26,23,32,0.18), 0 0 8px rgba(160,205,240,0.95), 0 0 24px rgba(160,205,240,0.65), 0 0 44px rgba(160,205,240,0.4)",
  moc:  "0 1px 2px rgba(26,23,32,0.18), 0 0 8px rgba(60,165,55,0.9), 0 0 24px rgba(60,165,55,0.6), 0 0 44px rgba(60,165,55,0.35)",
  hoa:  "0 1px 2px rgba(26,23,32,0.18), 0 0 8px rgba(230,55,30,0.9), 0 0 24px rgba(230,55,30,0.6), 0 0 44px rgba(230,55,30,0.4)",
  thuy: "0 1px 2px rgba(26,23,32,0.18), 0 0 8px rgba(50,120,250,0.9), 0 0 24px rgba(50,120,250,0.6), 0 0 44px rgba(50,120,250,0.35)",
};

const ELEMENT_AURA: Record<ElementType, string> = {
  tho:  "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(242,182,50,0.38) 0%, transparent 72%)",
  kim:  "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(180,210,230,0.4) 0%, transparent 72%)",
  moc:  "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(70,170,60,0.32) 0%, transparent 72%)",
  hoa:  "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(220,60,30,0.32) 0%, transparent 72%)",
  thuy: "radial-gradient(ellipse 70% 55% at 50% 58%, rgba(70,130,255,0.36) 0%, transparent 72%)",
};

// Border trái màu hành
const ELEMENT_BORDER_COLOR: Record<ElementType, string> = {
  tho:  "#F2B632",
  kim:  "#C8D4DC",
  moc:  "#3A7535",
  hoa:  "#CC3520",
  thuy: "#1B3B7A",
};

// Dongho SVG pattern mờ (inline SVG, tiết kiệm request)
function DonghoPattern({ element }: { element: ElementType | null }) {
  const colors: Record<ElementType, string> = {
    tho:  "#F2B63220",
    kim:  "#C8D4DC25",
    moc:  "#3A753520",
    hoa:  "#CC352020",
    thuy: "#1B3B7A22",
  };
  const c = element ? colors[element] : "#F2B63215";

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none select-none layer-drift-slow"
      aria-hidden="true"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Vòng trống đồng đồng tâm */}
      {[60, 110, 160, 200, 240].map((r, i) => (
        <circle key={i} cx="200" cy="220" r={r} fill="none" stroke={c} strokeWidth={i === 0 ? 3 : 1.5} strokeDasharray={i % 2 === 0 ? "8 6" : "4 8"} />
      ))}
      {/* Mây xoắn phong cách Đông Hồ */}
      <path d="M 60 80 Q 80 60 100 80 Q 120 100 140 80 Q 160 60 180 80" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <path d="M 220 320 Q 240 300 260 320 Q 280 340 300 320 Q 320 300 340 320" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* Sóng nước */}
      <path d="M 20 200 Q 60 190 100 200 Q 140 210 180 200 Q 220 190 260 200 Q 300 210 340 200 Q 370 194 390 200" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Chấm hoa văn */}
      {[50, 350, 50, 350, 200].map((x, i) => (
        <circle key={`dot-${i}`} cx={x} cy={[50, 50, 350, 350, 200][i]} r="3" fill={c} />
      ))}
    </svg>
  );
}

export default function Hero({ onTriggerEffect, isEffectRunning }: HeroProps) {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>("thuy");
  const [animatingCard, setAnimatingCard] = useState<ElementType | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Cập nhật glow tiêu đề khi hành thay đổi
  useEffect(() => {
    if (titleRef.current && selectedElement) {
      titleRef.current.style.textShadow = ELEMENT_TEXT_GLOW[selectedElement];
    }
  }, [selectedElement]);

  const handleCardClick = (element: ElementType, rect: EffectTargetRect) => {
    if (isEffectRunning) return;
    soundEngine.playElementTone(element);
    setAnimatingCard(element);
    dispatchSceneChange(element);
    onTriggerEffect(element, rect, () => {
      setAnimatingCard(null);
      setSelectedElement(element);
    });
  };

  const selectedElementData = WUXING_DATA.elements.find((el) => el.id === selectedElement);
  const borderColor = selectedElement ? ELEMENT_BORDER_COLOR[selectedElement] : "#F2B632";

  return (
    <section id="hero" className="relative pt-12 pb-24 overflow-hidden">
      {/* --- DIORAMA LAYER 1: Họa tiết Đông Hồ mờ (parallax chậm) --- */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-60" aria-hidden="true">
        <DonghoPattern element={selectedElement} />
      </div>

      {/* --- DIORAMA LAYER 2: Hạt linh khí nổi (CSS, fallback) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden layer-drift-mid" aria-hidden="true">
        {/* Các chấm linh khí trang trí */}
        {[
          { top: "15%", left: "8%",  size: 6, opacity: 0.3, delay: "0s" },
          { top: "30%", left: "92%", size: 4, opacity: 0.25, delay: "1.2s" },
          { top: "65%", left: "5%",  size: 5, opacity: 0.2, delay: "2.1s" },
          { top: "80%", left: "88%", size: 3, opacity: 0.3, delay: "0.7s" },
          { top: "45%", left: "95%", size: 6, opacity: 0.2, delay: "1.8s" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              backgroundColor: selectedElement ? ELEMENT_BORDER_COLOR[selectedElement] : "#F2B632",
              opacity: p.opacity,
              filter: "blur(1px)",
              animation: `layer-drift ${3 + i * 0.8}s ease-in-out infinite ${p.delay}`,
            }}
          />
        ))}
      </div>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* CỘT TRÁI: TIÊU ĐỀ + CTA + THÔNG TIN NHANH */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#F2B632] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[2px_2px_0px_#1A1720] dark:shadow-[2px_2px_0px_#EAE8D8] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#CC3520] animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-[#1A1720]">
                {HERO_CONTENT.badge}
              </span>
            </div>

            {/* Tiêu đề — "bảng giấy" yên tĩnh, glow nhẹ là hiệu ứng */}
            <h1
              ref={titleRef}
              className="font-display font-black text-4xl sm:text-5xl lg:text-6xl on-photo-heading"
              style={{
                lineHeight: "var(--lh-heading-tight)",
                textShadow: selectedElement ? ELEMENT_TEXT_GLOW[selectedElement] : "none",
                transition: "text-shadow 0.6s ease",
              }}
            >
              {HERO_CONTENT.title}
            </h1>

            <p
              className="text-base sm:text-lg on-photo-muted max-w-2xl"
              style={{ lineHeight: "var(--lh-body)" }}
            >
              {HERO_CONTENT.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#dang-ky"
                className="px-6 py-3.5 rounded-[4px] bg-[#CC3520] text-white font-display font-black
                  text-base border-[3px] border-[#1A1720] dark:border-[#EAE8D8]
                  shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8]
                  hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1A1720]
                  dark:hover:shadow-[6px_6px_0px_#EAE8D8]
                  active:translate-y-0.5 transition-all duration-150 min-h-[44px] inline-flex items-center"
                style={{ lineHeight: "1.2" }}
              >
                {HERO_CONTENT.primaryCta}
              </a>
              <a
                href="#bo-bai"
                className="px-6 py-3.5 rounded-[4px] bg-white dark:bg-[#1E1C23] text-[#1A1720] dark:text-[#EAE8D8]
                  font-display font-bold text-base border-[3px] border-[#1A1720] dark:border-[#EAE8D8]
                  shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8]
                  hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1A1720]
                  dark:hover:shadow-[6px_6px_0px_#EAE8D8]
                  active:translate-y-0.5 transition-all duration-150 min-h-[44px] inline-flex items-center"
                style={{ lineHeight: "1.2" }}
              >
                {HERO_CONTENT.secondaryCta}
              </a>
            </div>

            {/* 4 Thông tin nhanh — "bảng giấy" Đông Hồ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-[2px] border-[#1A1720]/15 dark:border-[#EAE8D8]/15">
              {HERO_CONTENT.quickFacts.map((fact, index) => (
                <div
                  key={index}
                  className="p-3 rounded-[4px] border-[2px] border-[#1A1720] dark:border-[#EAE8D8]
                    shadow-[2px_2px_0px_#1A1720] dark:shadow-[2px_2px_0px_#EAE8D8]
                    flex flex-col paper-board"
                >
                  <span
                    className="text-[11px] font-bold text-[#534E5C] dark:text-[#A8A4B2] uppercase"
                    style={{ lineHeight: "1.5" }}
                  >
                    {fact.label}
                  </span>
                  <span
                    className="font-display font-black text-base text-[#1A1720] dark:text-[#EAE8D8]"
                    style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
                  >
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: QUẠT LÁ BÀI + Ô THÔNG TIN */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Lời nhắc */}
            <div className="mb-4 text-xs font-bold text-[#534E5C] dark:text-[#A8A4B2] flex items-center gap-1.5
              bg-white/70 dark:bg-black/30 px-3 py-1.5 rounded-full border border-[#1A1720]/15 dark:border-[#EAE8D8]/15">
              <span>✦ Rê chuột để nâng lá • Bấm lá để xem hiệu ứng biến ảo</span>
            </div>

            {/* --- DIORAMA LAYER 3: Quạt 5 lá bài — thấp hơn trên mobile, không drift cả cụm --- */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96 flex items-end sm:items-center justify-center pt-1 sm:pt-4 lg:pt-8">
              {selectedElement && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                  style={{ backgroundImage: ELEMENT_AURA[selectedElement] }}
                />
              )}
              <div className="relative flex items-center justify-center w-56 h-64 sm:w-64 sm:h-80 scale-[0.82] sm:scale-95 lg:scale-100 origin-bottom">
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
                        className={isSelected ? "ring-4 ring-[#1A1720]/60 dark:ring-white/60" : ""}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ô thông tin hành đang chọn */}
            {selectedElementData && (
              <div
                className="w-full mt-4 p-4 rounded-[4px] bg-white dark:bg-[#1E1C23]
                  border-[3px] border-[#1A1720] dark:border-[#EAE8D8]
                  transition-all duration-500 paper-board"
                style={{
                  borderLeftColor: borderColor,
                  borderLeftWidth: "6px",
                  boxShadow: `4px 4px 0px #1A1720, 0 0 28px ${borderColor}66, 0 0 48px ${borderColor}33`,
                }}
              >
                <div className="flex items-center justify-between border-b-2 border-black/10 dark:border-white/10 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: borderColor }}
                      className="w-3.5 h-3.5 rounded-full border border-[#1A1720] flex-shrink-0"
                    />
                    <h2
                      className="font-display font-black text-lg text-[#1A1720] dark:text-[#EAE8D8]"
                      style={{ lineHeight: "var(--lh-heading)" }}
                    >
                      Họ {selectedElementData.name} — Âm {selectedElementData.tone}
                    </h2>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 tabular-nums">
                    {selectedElementData.note}
                  </span>
                </div>

                <p
                  className="text-xs sm:text-sm text-[#534E5C] dark:text-[#A8A4B2] mb-2 italic"
                  style={{ lineHeight: "var(--lh-body)" }}
                >
                  &ldquo;{selectedElementData.character}&rdquo;
                </p>

                <div className="text-xs font-semibold text-[#1A1720] dark:text-[#EAE8D8]">
                  <span className="text-[#534E5C] dark:text-[#A8A4B2]">3 Nhạc cụ đại diện: </span>
                  <span className="font-bold underline decoration-2" style={{ textDecorationColor: borderColor }}>
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
