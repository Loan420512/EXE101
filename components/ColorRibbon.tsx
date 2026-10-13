"use client";

/**
 * ==============================================================================
 * FILE: components/ColorRibbon.tsx
 * MỤC ĐÍCH: Dải 5 màu ngũ hành (Thổ, Kim, Mộc, Hỏa, Thủy) làm dải phân cách giữa các phần.
 * ==============================================================================
 */

import React from "react";

export default function ColorRibbon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-2 flex border-y-[2px] border-[#16141A] dark:border-[#E8EAE0] ${className}`}
      aria-hidden="true"
    >
      <div className="flex-1 bg-[#F2B632]" title="Thổ" />
      <div className="flex-1 bg-[#DDE3E8]" title="Kim" />
      <div className="flex-1 bg-[#3F7D3B]" title="Mộc" />
      <div className="flex-1 bg-[#D23A22]" title="Hỏa" />
      <div className="flex-1 bg-[#1F3F7E]" title="Thủy" />
    </div>
  );
}
