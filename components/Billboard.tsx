"use client";

/**
 * FILE: components/Billboard.tsx
 * Billboard toàn màn hình phong cách streaming × Đông Hồ.
 * - Xoay 8 slide (data/billboard.ts), tự chuyển mỗi 4s
 * - Chỉ dừng khi chuột đang rê trên bảng — không có nút pause, không có thanh tiến độ
 * - Ảnh nền riêng theo từng nhạc cụ: khai báo trong BACKGROUNDS (data/billboard.ts)
 * - Lá bài nghiêng 3D, tranh/ảnh nhạc cụ nổi bật
 * - Chữ trên "bảng gradient tối" bên trái — không đặt chữ lên vùng sáng ảnh
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { BILLBOARD_SLIDES, ELEMENT_TAGLINES, type BillboardSlide } from "@/data/billboard";
import { type SceneKey } from "@/data/scenes";
import { dispatchSceneChange } from "@/data/scenes";
import { soundEngine } from "@/lib/audio";
import InstrumentArt from "@/components/InstrumentArt";
import {
  IconMusicNote, IconGamepad,
  IconInfo, IconChevronLeft, IconChevronRight,
} from "@/components/icons";

const SLIDES: BillboardSlide[] = BILLBOARD_SLIDES;

const SCENE_KEY: Record<ElementType, SceneKey> = {
  hoa: "hoa", thuy: "thuy", moc: "moc", tho: "tho", kim: "kim",
};

const AUTO_INTERVAL = 4000; // ms — billboard tự chuyển, không có nút dừng

export default function Billboard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slide = SLIDES[activeIdx];
  const active = slide.instrument;
  const elCfg = ELEMENT_CONFIG[active.element];
  const tagline = slide.tagline ?? ELEMENT_TAGLINES[active.element];

  const goTo = useCallback((idx: number) => {
    const next = SLIDES[idx];
    if (!next) return;
    setActiveIdx(idx);
    dispatchSceneChange(SCENE_KEY[next.instrument.element]);
  }, []);

  const next = useCallback(() => {
    goTo((activeIdx + 1) % SLIDES.length);
  }, [activeIdx, goTo]);

  const prev = useCallback(() => {
    goTo((activeIdx - 1 + SLIDES.length) % SLIDES.length);
  }, [activeIdx, goTo]);

  // Tự chuyển sau AUTO_INTERVAL; chỉ dừng khi chuột đang rê trên billboard
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setTimeout(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeIdx, isHovered, next]);

  // Phím mũi tên
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const handlePlaySound = () => {
    soundEngine.playElementTone(active.element, true);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "min(90vh, 640px)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Billboard — đang hiển thị: ${active.name} họ ${active.elementName}`}
    >
      {/* ── LỚP 1: ẢNH NỀN RIÊNG CỦA NHẠC CỤ (nếu có trong BACKGROUNDS) ── */}
      {/* Chưa có ảnh thì mặc định rơi về ScenePhotoStack của LivingBackground (z-[-4]) */}
      {slide.backgroundUrl && (
        <div
          key={`bg-${active.id}`}
          className="absolute inset-0 z-0 overflow-hidden billboard-bg-in"
          aria-hidden
        >
          <Image
            src={slide.backgroundUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dịu bớt nửa trái để chữ không bị chìm trong ảnh */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right,
                rgba(6,6,10,0.55) 0%,
                rgba(6,6,10,0.25) 45%,
                transparent 75%)`,
            }}
          />
        </div>
      )}

      {/* ── GRADIENT CHE BÊN TRÁI (text readability) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right,
              rgba(6,6,10,0.92) 0%,
              rgba(6,6,10,0.75) 35%,
              rgba(6,6,10,0.25) 60%,
              transparent 80%
            ),
            linear-gradient(to top,
              rgba(6,6,10,0.7) 0%,
              transparent 40%
            )
          `,
        }}
        aria-hidden
      />

      {/* ── GRADIENT MÀU HÀNH — accent sắc đẹp ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 60% 70% at 80% 50%,
            ${elCfg.color}18 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      {/* ── NỘI DUNG BILLBOARD ── */}
      <div className="relative z-10 h-full max-w-screen-xl mx-auto px-6 sm:px-10 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">

          {/* CỘT TRÁI: Chữ */}
          <div className="lg:col-span-6 flex flex-col gap-5">

            {/* Tag hành */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[11px] font-black uppercase tracking-wider border-2"
                style={{
                  backgroundColor: elCfg.color,
                  color: elCfg.textColor,
                  borderColor: "#16141A",
                  boxShadow: "2px 2px 0px #16141A",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: elCfg.textColor }}
                />
                Họ {active.elementName} • Âm {active.tone}
              </span>
              <span className="text-[11px] font-bold text-white/50 border border-white/20 px-2 py-0.5 rounded">
                {active.status}
              </span>
            </div>

            {/* Câu giá trị — 3 giây */}
            <p className="text-base font-semibold text-white/70 max-w-sm leading-relaxed">
              Thu thập ngũ hành. Nghe văn hóa. Bộ bài 15 nhạc cụ Việt Nam.
            </p>

            {/* Tên nhạc cụ lớn */}
            <h2
              className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1]"
              style={{
                textShadow: `0 2px 4px rgba(0,0,0,0.8), 0 0 40px ${elCfg.color}60`,
              }}
            >
              {active.name}
            </h2>

            {/* Tagline */}
            <p className="text-lg text-white/80 font-medium max-w-md">
              {tagline}
            </p>

            {/* Mô tả ngắn */}
            <p className="text-sm text-white/60 max-w-sm leading-relaxed line-clamp-2">
              {active.summaryVerbatim}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/nhac-cu/${active.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] font-black text-sm
                  text-[#16141A] border-2 border-[#16141A] shadow-[3px_3px_0px_#16141A]
                  hover:-translate-y-px hover:shadow-[4px_4px_0px_#16141A]
                  active:translate-y-px active:shadow-none transition-all duration-120
                  focus-visible:outline-2 focus-visible:outline-white"
                style={{ backgroundColor: elCfg.color }}
              >
                <IconInfo size={16} aria-hidden />
                Xem chi tiết
              </Link>

              <button
                onClick={handlePlaySound}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] font-bold text-sm
                  text-white bg-white/12 border border-white/25 backdrop-blur-sm
                  hover:bg-white/20 transition-all duration-120
                  focus-visible:outline-2 focus-visible:outline-white"
                aria-label={`Nghe thử âm ${active.tone} (${active.noteName})`}
              >
                <IconMusicNote size={16} aria-hidden />
                Nghe {active.noteName}
              </button>

              <Link
                href="/choi-thu-ngay"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] font-bold text-sm
                  text-white bg-[#D23A22]/80 border border-[#D23A22] backdrop-blur-sm
                  hover:bg-[#D23A22] transition-all duration-120
                  focus-visible:outline-2 focus-visible:outline-white"
              >
                <IconGamepad size={16} aria-hidden />
                Chơi ngay
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: Tranh nhạc cụ 3D nghiêng */}
          <div className="hidden lg:flex lg:col-span-6 items-center justify-center">
            <div
              className="relative"
              style={{
                transform: "perspective(800px) rotateY(-12deg) rotateX(4deg)",
                filter: `drop-shadow(0 20px 40px ${elCfg.color}50)`,
              }}
            >
              <InstrumentArt
                instrumentId={active.id}
                element={active.element}
                size={280}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CHẤM CHỈ SỐ ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((s, i) => {
          const inst = s.instrument;
          const isAct = i === activeIdx;
          const cfg = ELEMENT_CONFIG[inst.element];
          return (
            <button
              key={inst.id}
              onClick={() => goTo(i)}
              aria-label={`Chuyển sang ${inst.name}`}
              aria-current={isAct}
              className={`rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white ${
                isAct ? "w-6 h-2.5" : "w-2.5 h-2.5 opacity-50 hover:opacity-80"
              }`}
              style={{ backgroundColor: isAct ? cfg.color : "#E8EAE0" }}
            />
          );
        })}
      </div>

      {/* ── NÚT CHUYỂN TRÁI/PHẢI ── */}
      <button
        onClick={prev}
        aria-label="Hành trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center
          rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/60
          transition-all duration-150 focus-visible:outline-2 focus-visible:outline-white"
      >
        <IconChevronLeft size={20} aria-hidden />
      </button>
      <button
        onClick={next}
        aria-label="Hành tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center
          rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/60
          transition-all duration-150 focus-visible:outline-2 focus-visible:outline-white"
      >
        <IconChevronRight size={20} aria-hidden />
      </button>
    </section>
  );
}
