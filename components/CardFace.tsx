"use client";

/**
 * ==============================================================================
 * FILE: components/CardFace.tsx
 * MỤC ĐÍCH: Lá bài 3D tương tác chuẩn thẩm mỹ Tranh Đông Hồ & Ngũ Cung:
 * - Nghiêng 3D (3D Tilt) mượt mà theo con trỏ chuột và cảm ứng với perspective
 * - Ánh phản chiếu (Specular sheen) chạy dọc thân bài theo góc nghiêng
 * - Riêng lá KIM: Có lớp ánh xà cừ (Iridescent Pearlescent) chuyển sắc cầu vồng nhẹ
 * - Họa tiết thị sai (Parallax) phân tầng
 * - Hỗ trợ đầy đủ phím Enter / Space, quản lý focus cho WCAG 2.2 AA
 * ==============================================================================
 */

import React, { useRef, useState, useCallback } from "react";
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

  // Trạng thái nghiêng 3D và ánh sáng phản chiếu
  const [tilt, setTilt] = useState<{ x: number; y: number; glareX: number; glareY: number }>({
    x: 0,
    y: 0,
    glareX: 50,
    glareY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isInteractive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width) * 2 - 1; // -1 đến 1
      const py = (y / rect.height) * 2 - 1; // -1 đến 1

      const maxTilt = 12; // góc nghiêng tối đa 12 độ
      setTilt({
        x: -py * maxTilt, // Lật trục X
        y: px * maxTilt,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100,
      });
    },
    [isInteractive]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (!isInteractive || !onClick) return;
    if (e) e.stopPropagation();

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Kích thước lá bài
  const sizeClasses = {
    sm: "w-28 h-40 p-2 text-xs",
    md: "w-40 h-56 p-3 text-sm",
    lg: "w-52 h-72 p-4 text-base",
  }[size];

  // Animation class tương ứng theo từng hành khi đang kích hoạt hiệu ứng
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
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "transform 0.08s ease-out" : "transform 0.4s ease-out, box-shadow 0.3s ease",
      }}
      className={`relative select-none rounded-[4px] border-[3px] border-[#16141A] 
        shadow-[4px_4px_0px_#16141A] flex flex-col justify-between overflow-hidden
        focus:outline-none focus:ring-2 focus:ring-[#D23A22] focus:ring-offset-2
        ${sizeClasses} 
        ${
          isInteractive
            ? "cursor-pointer hover:shadow-[7px_10px_0px_#16141A] active:translate-y-0 active:shadow-[2px_2px_0px_#16141A]"
            : ""
        } 
        ${animClass} ${className}`}
    >
      {/* 1. LỚP PHẢN CHIẾU ÁNH SÁNG CHẠY THEO CON TRỎ (SPECULAR SHEEN) */}
      {isInteractive && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.45 : 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`,
            mixBlendMode: "overlay",
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. HIỆU ỨNG ÁNH XÀ CỪ ĐẶC TRƯNG RIÊNG CHO LÁ KIM (MOTHER-OF-PEARL IRIDESCENCE) */}
      {element === "kim" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `linear-gradient(${tilt.y * 8 + 45}deg, rgba(255,182,193,0.4) 0%, rgba(176,224,230,0.5) 30%, rgba(255,248,220,0.6) 60%, rgba(221,160,221,0.4) 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. GÓC TRÊN: TÊN ÂM & TÊN HÀNH */}
      <div className="flex items-start justify-between border-b-[2px] border-current/25 pb-1 relative z-10">
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

      {/* 4. PHẦN GIỮA: HOA VĂN THỊ SAI & VẠCH CAO ĐỘ ĐÔNG HỒ */}
      <div
        className="my-auto flex flex-col items-center justify-center py-2 relative z-10 transition-transform duration-75"
        style={{
          transform: isHovered ? `translate3d(${tilt.y * 0.4}px, ${-tilt.x * 0.4}px, 0)` : "none",
        }}
      >
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

      {/* 5. GÓC DƯỚI: TÊN NHẠC CỤ & VIỀN ĐÁY */}
      <div className="border-t-[2px] border-current/25 pt-1.5 flex flex-col relative z-10">
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
