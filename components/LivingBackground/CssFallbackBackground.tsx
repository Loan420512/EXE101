/**
 * ==============================================================================
 * FILE: components/LivingBackground/CssFallbackBackground.tsx
 * MỤC ĐÍCH: Nền dự phòng thuần CSS — "Cõi Ngũ Âm" đơn giản hóa.
 * Dùng khi: prefers-reduced-motion, thiết bị phân hạng Min/Low, WebGL không khả dụng.
 * Hiệu ứng: Gradient ngũ hành tĩnh, trống đồng SVG mờ, không animation.
 * ==============================================================================
 */

import React from "react";

export default function CssFallbackBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none"
      style={{ backgroundColor: "var(--bg-diep)" }}
      aria-hidden="true"
    >
      {/* Nền chính: Giấy điệp texture CSS */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(0,0,0,0.015) 0px,
              rgba(0,0,0,0) 2px,
              rgba(0,0,0,0) 6px,
              rgba(0,0,0,0.015) 8px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(0,0,0,0.01) 0px,
              rgba(0,0,0,0) 2px,
              rgba(0,0,0,0) 6px,
              rgba(0,0,0,0.01) 8px
            )
          `,
        }}
      />

      {/* 5 Vùng đất: Gradient màu hành lan từ góc màn hình */}
      {/* Thổ (vàng) — góc trên trái */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-tho)", opacity: 0.07 }}
      />
      {/* Kim (bạc) — góc trên phải */}
      <div
        className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-kim)", opacity: 0.08 }}
      />
      {/* Mộc (xanh) — giữa trái */}
      <div
        className="absolute top-1/3 -left-24 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-moc)", opacity: 0.06 }}
      />
      {/* Hỏa (đỏ) — giữa phải */}
      <div
        className="absolute top-1/2 -right-24 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-hoa)", opacity: 0.06 }}
      />
      {/* Thủy (chàm) — góc dưới */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: "var(--color-thuy)", opacity: 0.08 }}
      />

      {/* Trống đồng Đông Hồ SVG — tâm màn hình, mờ */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-[#1A1720] dark:text-[#EAE8D8]"
        style={{ opacity: 0.035 }}
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="190" />
        <circle cx="200" cy="200" r="165" strokeDasharray="8 5" />
        <circle cx="200" cy="200" r="140" />
        <circle cx="200" cy="200" r="112" strokeDasharray="5 5" />
        <circle cx="200" cy="200" r="85" />
        <circle cx="200" cy="200" r="55" />
        {/* Mặt trời 14 tia */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14;
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 12;
          const y1 = 200 + Math.sin(rad) * 12;
          const x2 = 200 + Math.cos(rad) * 48;
          const y2 = 200 + Math.sin(rad) * 48;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2.5" />;
        })}
        {/* Chim lạc 8 con */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8 + 22.5;
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + Math.cos(rad) * 118;
          const cy = 200 + Math.sin(rad) * 118;
          return (
            <g key={`bird-${i}`} transform={`translate(${cx},${cy}) rotate(${angle + 90})`}>
              <path d="M 0 -5 Q -4 0 0 5 Q 4 0 0 -5 Z" fill="currentColor" opacity="0.5" />
            </g>
          );
        })}
      </svg>

      {/* Viền vignette nhẹ */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.06) 100%)",
        }}
      />
    </div>
  );
}
