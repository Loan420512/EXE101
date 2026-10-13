"use client";

/**
 * ==============================================================================
 * FILE: components/CardFace.tsx
 * MỤC ĐÍCH: Component hiển thị mặt lá bài theo chuẩn phong cách Đông Hồ của Ngũ Cung.
 * QUY CÁCH:
 * - Dùng màu nguyên bản của hành (Thổ, Kim, Mộc, Hỏa, Thủy)
 * - Viền đen dày 3px, bóng đổ cứng lệch không mờ
 * - Tên âm ở góc trên (Cung, Thương, Giốc, Chủy, Vũ)
 * - Tên nhạc cụ ở dưới
 * - Các vạch cao độ nhỏ trang trí
 * - Không dùng tranh vẽ/hình ảnh placeholder bên ngoài
 * ==============================================================================
 */

import React, { useRef } from "react";
import { ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";

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
}

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
}: CardFaceProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cfg = ELEMENT_CONFIG[element];

  const handleClick = (e: React.MouseEvent) => {
    if (!isInteractive || !onClick) return;
    e.stopPropagation();

    if (cardRef.current) {
      const domRect = cardRef.current.getBoundingClientRect();
      const rect: EffectTargetRect = {
        x: domRect.left,
        y: domRect.top,
        width: domRect.width,
        height: domRect.height,
        centerX: domRect.left + domRect.width / 2,
        centerY: domRect.top + domRect.height / 2,
      };
      onClick(rect);
    }
  };

  // Kích thước lá bài
  const sizeClasses = {
    sm: "w-28 h-40 p-2 text-xs",
    md: "w-40 h-56 p-3 text-sm",
    lg: "w-52 h-72 p-4 text-base",
  }[size];

  // Animation class tương ứng theo từng hành khi đang bấm
  const animClass = isAnimating
    ? {
        thuy: "anim-card-thuy",
        hoa: "anim-card-hoa",
        moc: "anim-card-moc",
        kim: "anim-card-kim",
        tho: "anim-card-tho",
      }[element]
    : "";

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      style={{
        backgroundColor: cfg.color,
        color: cfg.textColor,
      }}
      className={`relative select-none rounded-[4px] border-[3px] border-[#16141A] 
        shadow-[4px_4px_0px_#16141A] transition-all duration-200 flex flex-col justify-between 
        ${sizeClasses} 
        ${
          isInteractive
            ? "cursor-pointer hover:-translate-y-2 hover:shadow-[6px_8px_0px_#16141A] active:translate-y-0 active:shadow-[2px_2px_0px_#16141A]"
            : ""
        } 
        ${animClass} ${className}`}
    >
      {/* Góc trên: Tên âm & Tên Hành */}
      <div className="flex items-start justify-between border-b-[2px] border-current/25 pb-1">
        <div className="flex flex-col leading-tight">
          <span className="font-display font-black tracking-wider text-xs md:text-sm uppercase">
            {tone}
          </span>
          <span className="text-[10px] opacity-85 font-semibold">
            Hành {cfg.name}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-current/30 bg-black/10">
            {noteName || cfg.note}
          </span>
        </div>
      </div>

      {/* Phần giữa: Biểu tượng hoa văn ngũ hành & Vài vạch cao độ nhỏ */}
      <div className="my-auto flex flex-col items-center justify-center py-2 relative">
        {/* Vạch cao độ tượng trưng (Pitch markings) */}
        <div className="flex flex-col gap-1 items-center w-full my-2 opacity-75">
          <div className="w-12 h-[2px] bg-current rounded-full" />
          <div className="w-8 h-[2px] bg-current rounded-full" />
          <div className="w-16 h-[2px] bg-current rounded-full" />
          <div className="w-10 h-[2px] bg-current rounded-full" />
          <div className="w-14 h-[2px] bg-current rounded-full" />
        </div>

        {/* Khung triện con dấu tên hành */}
        <div className="mt-1 px-2.5 py-1 rounded border-2 border-current font-display font-black text-sm tracking-widest bg-current/10">
          {cfg.name}
        </div>
      </div>

      {/* Góc dưới: Tên Nhạc Cụ & Viền đáy */}
      <div className="border-t-[2px] border-current/25 pt-1.5 flex flex-col">
        <span className="font-display font-bold text-center text-xs md:text-sm tracking-tight truncate drop-shadow-sm">
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
