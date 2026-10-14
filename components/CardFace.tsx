"use client";

/**
 * ==============================================================================
 * FILE: components/CardFace.tsx
 * MỤC ĐÍCH: Lá bài 3D — tiêu chuẩn "Cõi Ngũ Âm":
 * - Tilt 3D + specular sheen theo con trỏ
 * - KIM: Ánh xà cừ cầu vồng (iridescent)
 * - Hover: Aura glow (linh khí) theo màu hành — CSS var(--glow-*)
 * - Shimmer sweep cho lá KIM khi hover
 * - Spirit particles: 3–4 hạt linh khí nổi lên khi hover (CSS, không canvas)
 * - WCAG 2.2 AA: Enter/Space, focus ring, aria-label
 * ==============================================================================
 */

import React, { useRef, useState, useCallback } from "react";
import { ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";
import InstrumentIllustration from "@/components/InstrumentIllustration";

interface CardFaceProps {
  name: string;
  element: ElementType;
  tone: string;
  noteName?: string;
  onClick?: (rect: EffectTargetRect) => void;
  isAnimating?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  isInteractive?: boolean;
  instrumentId?: string;
  /** 0–2: biến thể tranh cho các lá cùng nhạc cụ */
  variant?: number;
}

// Map hành → CSS variable glow
const ELEMENT_AURA_CLASS: Record<ElementType, string> = {
  tho:  "card-aura-tho",
  kim:  "card-aura-kim",
  moc:  "card-aura-moc",
  hoa:  "card-aura-hoa",
  thuy: "card-aura-thuy",
};

// Hạt linh khí: vị trí + hướng ngẫu nhiên
const SPIRIT_PARTICLES = [
  { top: "70%", left: "20%",  dx: "-6px",  delay: "0s",    size: 4 },
  { top: "60%", left: "50%",  dx: "0px",   delay: "0.15s", size: 3 },
  { top: "75%", left: "78%",  dx: "6px",   delay: "0.05s", size: 5 },
  { top: "55%", left: "35%",  dx: "-4px",  delay: "0.25s", size: 3 },
];

export default function CardFace({
  name,
  element,
  tone,
  noteName,
  onClick,
  isAnimating = false,
  className = "",
  size = "md",
  isInteractive = true,
  instrumentId,
  variant = 0,
}: CardFaceProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cfg = ELEMENT_CONFIG[element];

  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 0, y: 0, glareX: 50, glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) * 2 - 1;
      const py = (y / rect.height) * 2 - 1;
      const maxTilt = 12;
      setTilt({ x: -py * maxTilt, y: px * maxTilt, glareX: (x / rect.width) * 100, glareY: (y / rect.height) * 100 });
    },
    [isInteractive]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  }, []);

  const handlePointerEnter = useCallback(() => { setIsHovered(true); }, []);

  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!isInteractive || !onClick) return;
    if (e) e.stopPropagation();
    if (cardRef.current) {
      const domRect = cardRef.current.getBoundingClientRect();
      onClick({
        x: domRect.left, y: domRect.top,
        width: domRect.width, height: domRect.height,
        centerX: domRect.left + domRect.width / 2,
        centerY: domRect.top + domRect.height / 2,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(e); }
  };

  const sizeClasses = { sm: "w-28 h-40 p-2 text-xs", md: "w-40 h-56 p-3 text-sm", lg: "w-52 h-72 p-4 text-base" }[size];

  const animClass = isAnimating
    ? { thuy: "anim-card-thuy", hoa: "anim-card-hoa", moc: "anim-card-moc", kim: "anim-card-kim", tho: "anim-card-tho" }[element]
    : "";

  const auraClass = ELEMENT_AURA_CLASS[element];

  return (
    <div
      ref={cardRef}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={`${name} - Hành ${cfg.name} (Âm ${tone})`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        backgroundColor: cfg.color,
        color: cfg.textColor,
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered
          ? "transform 0.08s ease-out, box-shadow 0.2s ease"
          : "transform 0.4s ease-out, box-shadow 0.35s ease",
      }}
      className={`relative select-none rounded-[4px] border-[3px] border-[#1A1720]
        flex flex-col justify-between overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-[#CC3520] focus:ring-offset-2
        ${sizeClasses}
        ${auraClass}
        ${isHovered ? "card-aura-active" : "shadow-[4px_4px_0px_#1A1720]"}
        ${isInteractive ? "cursor-pointer active:translate-y-0.5" : ""}
        ${animClass} ${className}`}
    >
      {/* 1. SPECULAR SHEEN — ánh sáng theo con trỏ */}
      {isInteractive && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.45 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0) 60%)`,
            mixBlendMode: "overlay",
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. KIM: Ánh xà cừ cầu vồng */}
      {element === "kim" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `linear-gradient(${tilt.y * 8 + 45}deg, rgba(255,182,193,0.4) 0%, rgba(176,224,230,0.5) 30%, rgba(255,248,220,0.6) 60%, rgba(221,160,221,0.4) 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. KIM: Shimmer sweep khi hover */}
      {element === "kim" && isHovered && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ animation: "shimmer-sweep 1.2s ease-in-out" }}
          />
        </div>
      )}

      {/* 4. SPIRIT PARTICLES — hạt linh khí nổi lên khi hover */}
      {isInteractive && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {SPIRIT_PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-0"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: cfg.color,
                filter: "brightness(1.5) blur(0.5px)",
                ["--dx" as string]: p.dx,
                animation: `spirit-rise 1.2s ease-out ${p.delay} forwards`,
              }}
            />
          ))}
        </div>
      )}

      {/* 5. GÓC TRÊN: ÂM + HÀNH */}
      <div className="flex items-start justify-between border-b-[2px] border-current/25 pb-1 relative z-10">
        <div className="flex flex-col leading-tight">
          <span className="font-display font-black tracking-wider text-xs md:text-sm uppercase" style={{ lineHeight: "1.18" }}>
            {tone}
          </span>
          <span className="text-[10px] opacity-85 font-semibold" style={{ lineHeight: "1.4" }}>
            Hành {cfg.name}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-current/30 bg-black/10">
            {noteName || cfg.note}
          </span>
        </div>
      </div>

      {/* 6. PHẦN GIỮA: TRANH NHẠC CỤ */}
      <div
        className="my-auto flex flex-col items-center justify-center py-1 relative z-10 transition-transform duration-75"
        style={{ transform: isHovered ? `translate3d(${tilt.y * 0.4}px, ${-tilt.x * 0.4}px, 0)` : "none" }}
      >
        {instrumentId ? (
          <InstrumentIllustration
            instrumentId={instrumentId}
            element={element}
            variant={variant}
            size={size === "lg" ? 120 : size === "sm" ? 64 : 88}
            className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]"
          />
        ) : (
          <div className="flex flex-col gap-1 items-center w-full my-2 opacity-75">
            <div className="w-12 h-[2px] bg-current rounded-full" />
            <div className="w-8  h-[2px] bg-current rounded-full" />
            <div className="w-16 h-[2px] bg-current rounded-full" />
            <div className="w-10 h-[2px] bg-current rounded-full" />
            <div className="w-14 h-[2px] bg-current rounded-full" />
          </div>
        )}
        <div className="mt-1 px-2.5 py-1 rounded border-2 border-current font-display font-black text-[10px] md:text-xs tracking-widest bg-black/10">
          {cfg.name}
        </div>
      </div>

      {/* 7. GÓC DƯỚI: TÊN NHẠC CỤ */}
      <div className="border-t-[2px] border-current/25 pt-1.5 flex flex-col relative z-10">
        <span className="font-display font-bold text-center text-xs md:text-sm tracking-tight truncate drop-shadow-sm" style={{ lineHeight: "1.3" }}>
          {name}
        </span>
        <div className="flex justify-between items-center text-[9px] opacity-75 mt-0.5">
          <span>Ngũ Cung</span>
          <span>1/45</span>
        </div>
      </div>
    </div>
  );
}
