"use client";

/**
 * FILE: components/Billboard.tsx
 * Billboard toàn màn hình phong cách streaming × Đông Hồ.
 * - 8 slide khai báo trong data/billboard.ts, tự chuyển mỗi 3.6s
 * - Cách chuyển: kéo ngang (translate3d trên track) + parallax nhẹ cho nội dung,
 *   easing ease-out mượt — không "bụp" đổi tức thì
 * - Bước nhảy không kề nhau (chấm chỉ số, vòng lặp cuối→đầu): tan biến nhanh
 * - Ảnh nền riêng theo từng nhạc cụ: khai báo trong BACKGROUNDS (data/billboard.ts)
 * - Chữ nằm trên bảng gradient tối bên trái, scrim để toàn cố định khi slide chạy
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
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
const N = SLIDES.length;

const SCENE_KEY: Record<ElementType, SceneKey> = {
  hoa: "hoa", thuy: "thuy", moc: "moc", tho: "tho", kim: "kim",
};

const AUTO_INTERVAL = 3600; // ms — billboard tự chuyển, không có nút dừng

/** Thời gian + đường cong "kéo qua" của track */
const SLIDE_MS = 720;
const SLIDE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const FADE_MS = 380; // cho cú nhảy xa (chấm chỉ số, cuối→đầu)
/** Nội dung dịch ít hơn track → cảm giác có chiều sâu khi kéo */
const PARALLAX_PCT = 7;

export default function Billboard() {
  const [activeIdx, setActiveIdx] = useState(0);
  /** "slide" = kéo ngang, "fade" = nhảy xa thì tan biến */
  const [moveMode, setMoveMode] = useState<"slide" | "fade">("slide");
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const current = SLIDES[activeIdx];
  const active = current.instrument;

  const goTo = useCallback((idx: number) => {
    const target = SLIDES[idx];
    if (!target || idx === activeIdx) return;
    // Chỉ kéo ngang khi sang slide kề nhau; nhảy xa (chấm chỉ số, cuối→đầu) thì tan biến
    setMoveMode(Math.abs(idx - activeIdx) === 1 ? "slide" : "fade");
    setActiveIdx(idx);
    dispatchSceneChange(SCENE_KEY[target.instrument.element]);
  }, [activeIdx]);

  // Nhảy xa: chạy fade bằng Web Animations API -> luôn khởi động lại được mà không
  // phải mount lại node (mount lại sẽ làm mất animation của cú kéo ngay sau đó)
  useEffect(() => {
    if (moveMode !== "fade") return;
    const node = trackRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = node.animate(
      [{ opacity: 0.45 }, { opacity: 1 }],
      { duration: FADE_MS, easing: "ease-out", fill: "none" }
    );
    return () => anim.cancel();
  }, [activeIdx, moveMode]);

  const next = useCallback(() => {
    goTo((activeIdx + 1) % N);
  }, [activeIdx, goTo]);

  const prev = useCallback(() => {
    goTo((activeIdx - 1 + N) % N);
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

  const isSlide = moveMode === "slide";

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "min(90vh, 640px)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Billboard — đang hiển thị: ${active.name} họ ${active.elementName}`}
    >
      {/* ══ TRACK: cả 8 slide nằm ngang, kéo bằng translate3d ══ */}
      <div
        ref={trackRef}
        className="h-full flex"
        style={{
          width: `${N * 100}%`,
          transform: `translate3d(${(-activeIdx * 100) / N}%, 0, 0)`,
          transition: isSlide
            ? `transform ${SLIDE_MS}ms ${SLIDE_EASING}`
            : "none",
          willChange: "transform",
        }}
      >
        {SLIDES.map((s, i) => {
          const inst = s.instrument;
          const cfg = ELEMENT_CONFIG[inst.element];
          const isActive = i === activeIdx;
          const tagline = s.tagline ?? ELEMENT_TAGLINES[inst.element];
          const offset = i - activeIdx;

          return (
            <div
              key={inst.id}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${100 / N}%` }}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              {/* Lớp nền riêng của nhạc cụ (chưa có ảnh thì dùng ScenePhotoStack của hành) */}
              {s.background && (
                <div className="absolute inset-0 overflow-hidden" aria-hidden>
                  {/* <picture> trực tiếp vì ảnh đã được scripts/prep-billboard.mjs
                      phóng + nén sẵn; đi qua next/image chỉ tổ nén lần hai. */}
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={s.background.srcSetAvif}
                      sizes="100vw"
                    />
                    <source
                      type="image/webp"
                      srcSet={s.background.srcSetWebp}
                      sizes="100vw"
                    />
                    <img
                      src={s.background.webpUrl}
                      alt=""
                      className="w-full h-full object-cover object-center"
                      /* Nền carousel tự xoay sau 3.6s nên phải tải sẵn cả 4
                         slide — để lazy thì ảnh kịp hiện giữa cú kéo (trắng xóa).
                         Chỉ slide đầu ưu tiên cao, còn lại tải nền ở mức thấp. */
                      loading="eager"
                      fetchPriority={i === 0 ? "high" : "low"}
                      decoding="async"
                    />
                  </picture>
                  {/* Ảnh nguồn nhỏ thì phủ thêm hạt giấy để chỗ bị mềm nhìn như
                      nhòe mực in, không như ảnh vỡ. */}
                  <div
                    className="billboard-grain"
                    style={{
                      opacity: s.background.sourceWidth < 900 ? 0.5 : 0.26,
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right,
                        rgba(6,6,10,0.38) 0%,
                        rgba(6,6,10,0.14) 45%,
                        transparent 75%)`,
                    }}
                  />
                </div>
              )}

              {/* Quầng sáng màu hành của slide */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 60% 70% at 80% 50%,
                    ${cfg.color}18 0%, transparent 70%)`,
                }}
                aria-hidden
              />

              {/* Nội dung — dịch ít hơn track để tạo parallax */}
              <div
                className="relative z-10 h-full max-w-screen-xl mx-auto px-6 sm:px-10 flex items-center"
                style={{
                  transform: `translate3d(${offset * PARALLAX_PCT}%, 0, 0)`,
                  transition: isSlide
                    ? `transform ${SLIDE_MS}ms ${SLIDE_EASING}`
                    : "none",
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">

                  {/* CỘT TRÁI: Chữ */}
                  <div className="lg:col-span-6 flex flex-col gap-5">

                    {/* Tag hành */}
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[11px] font-black uppercase tracking-wider border-2"
                        style={{
                          backgroundColor: cfg.color,
                          color: cfg.textColor,
                          borderColor: "#16141A",
                          boxShadow: "2px 2px 0px #16141A",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: cfg.textColor }}
                        />
                        Họ {inst.elementName} • Âm {inst.tone}
                      </span>
                      <span className="text-[11px] font-bold text-white/75 border border-white/30 px-2 py-0.5 rounded">
                        {inst.status}
                      </span>
                    </div>

                    {/* Câu giá trị — 3 giây */}
                    <p className="text-base font-semibold text-white/85 max-w-sm leading-relaxed">
                      Thu thập ngũ hành. Nghe văn hóa. Bộ bài 15 nhạc cụ Việt Nam.
                    </p>

                    {/* Tên nhạc cụ lớn */}
                    <h2
                      className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1]"
                      style={{
                        textShadow: `0 2px 6px rgba(0,0,0,0.55), 0 0 40px ${cfg.color}60`,
                      }}
                    >
                      {inst.name}
                    </h2>

                    {/* Tagline */}
                    <p className="text-lg text-white/95 font-medium max-w-md">
                      {tagline}
                    </p>

                    {/* Mô tả ngắn */}
                    <p className="text-sm text-white/80 max-w-sm leading-relaxed line-clamp-2">
                      {inst.summaryVerbatim}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Link
                        href={`/nhac-cu/${inst.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] font-black text-sm
                          text-[#16141A] border-2 border-[#16141A] shadow-[3px_3px_0px_#16141A]
                          hover:-translate-y-px hover:shadow-[4px_4px_0px_#16141A]
                          active:translate-y-px active:shadow-none transition-all duration-120
                          focus-visible:outline-2 focus-visible:outline-white"
                        style={{ backgroundColor: cfg.color }}
                      >
                        <IconInfo size={16} aria-hidden />
                        Xem chi tiết
                      </Link>

                      <button
                        onClick={() => soundEngine.playElementTone(inst.element, true)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] font-bold text-sm
                          text-white bg-white/12 border border-white/25 backdrop-blur-sm
                          hover:bg-white/20 transition-all duration-120
                          focus-visible:outline-2 focus-visible:outline-white"
                        aria-label={`Nghe thử âm ${inst.tone} (${inst.noteName})`}
                      >
                        <IconMusicNote size={16} aria-hidden />
                        Nghe {inst.noteName}
                      </button>

                      <Link
                        href="/choi-thu-ngay"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] font-bold text-sm
                          text-white bg-[#D23A22]/80 border border-[#D23A22] backdrop-blur-sm
                          hover:bg-[#D23A22] transition-all duration-120
                          focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <IconGamepad size={18} aria-hidden />
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
                        filter: `drop-shadow(0 20px 40px ${cfg.color}50)`,
                      }}
                    >
                      <InstrumentArt
                        instrumentId={inst.id}
                        element={inst.element}
                        size={280}
                        priority={isActive}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══ SCRIM CỔ ĐỊNH: chữ luôn đọc được, không bị trượt theo track ══
          Cảnh nền phía sau (ScenePhotoStack) đã có overlay riêng nên lớp này chỉ cần đủ đậm
          ở mép trái — đẩy lên cao quá cả bảng sẽ thành đen như mực. */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: `
            linear-gradient(to right,
              rgba(6,6,10,0.72) 0%,
              rgba(6,6,10,0.46) 36%,
              rgba(6,6,10,0.12) 64%,
              transparent 84%
            ),
            linear-gradient(to top,
              rgba(6,6,10,0.42) 0%,
              transparent 38%
            )
          `,
        }}
        aria-hidden
      />

      {/* Trên điện thoại chữ trải đầy ngang nên scrim trái không đủ: thêm màn
          tối dọc riêng cho màn nhỏ, giữ ảnh thấy được mà chữ vẫn rõ. */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none lg:hidden"
        style={{
          background: `linear-gradient(to top,
            rgba(6,6,10,0.82) 0%,
            rgba(6,6,10,0.55) 45%,
            rgba(6,6,10,0.28) 100%
          )`,
        }}
        aria-hidden
      />

      {/* ── CHẤM CHỈ SỐ ── mỗi nút rộng 44px để đủ vùng chạm, chấm nhỏ nằm bên trong */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center">
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
              className="tap-dot group focus-visible:outline-2 focus-visible:outline-white"
            >
              <span
                aria-hidden
                className={`block rounded-full transition-all duration-300 group-hover:opacity-90 ${
                  isAct ? "tap-dot-bar" : "tap-dot-cell opacity-50"
                }`}
                style={{ backgroundColor: isAct ? cfg.color : "#E8EAE0" }}
              />
            </button>
          );
        })}
      </div>

      {/* ── NÚT CHUYỂN TRÁI/PHẢI ── */}
      <button
        onClick={prev}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center
          rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/60
          transition-all duration-150 focus-visible:outline-2 focus-visible:outline-white"
      >
        <IconChevronLeft size={20} aria-hidden />
      </button>
      <button
        onClick={next}
        aria-label="Slide tiếp theo"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center
          rounded-full bg-black/40 border border-white/20 text-white hover:bg-black/60
          transition-all duration-150 focus-visible:outline-2 focus-visible:outline-white"
      >
        <IconChevronRight size={20} aria-hidden />
      </button>
    </section>
  );
}
