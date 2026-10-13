/**
 * ==============================================================================
 * FILE: components/LivingBackground/CssFallbackBackground.tsx
 * MỤC ĐÍCH: Nền dự phòng thuần CSS & SVG khi thiết bị thuộc phân hạng Low/Min
 * hoặc người dùng bật `prefers-reduced-motion` hay tắt WebGL.
 * ==============================================================================
 */

import React from "react";

export default function CssFallbackBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none bg-[#E8EAE0] dark:bg-[#0B1026] transition-colors duration-500"
      aria-hidden="true"
    >
      {/* 1. Họa tiết trống đồng Đông Hồ SVG mờ ở tâm */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04] dark:opacity-[0.08] text-[#16141A] dark:text-[#F2B632]"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="200" cy="200" r="180" />
        <circle cx="200" cy="200" r="150" strokeDasharray="6 4" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="90" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="50" />
        {/* Mặt trời 14 tia */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i * 360) / 14;
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 15;
          const y1 = 200 + Math.sin(rad) * 15;
          const x2 = 200 + Math.cos(rad) * 45;
          const y2 = 200 + Math.sin(rad) * 45;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="3" />;
        })}
      </svg>

      {/* 2. Dải ngũ sắc mềm mại Đông Hồ ở góc màn hình */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none bg-gradient-to-br from-[#F2B632] via-[#D23A22] to-[#1F3F7E]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 blur-3xl pointer-events-none bg-gradient-to-tr from-[#3F7D3B] via-[#DDE3E8] to-[#F2B632]" />
    </div>
  );
}
