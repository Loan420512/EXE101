"use client";

/**
 * ==============================================================================
 * FILE: components/Story.tsx
 * MỤC ĐÍCH: Phần câu chuyện sản phẩm — realm Thổ (đất, vàng, ấm áp).
 * NỘI DUNG:
 * - Thông điệp: 'Văn hóa vẫn còn đó. Chỉ thiếu một cách để chạm vào.'
 * - Bảng so sánh 4 dòng: Bảo tàng, Sách giáo khoa, Lớp học, Ngũ Cung.
 * - Cuộn giấy scroll-banner với viền Đông Hồ dày
 * - Realm Thổ: gradient vàng nhẹ từ đáy section
 * ==============================================================================
 */

import React from "react";
import { STORY_CONTENT } from "@/data/content";

export default function Story() {
  return (
    <section
      id="cau-chuyen"
      className="py-20 realm-tho relative overflow-hidden"
    >
      {/* Hoa văn trang trí rìa trái */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#F2B632]/40 dark:bg-[#F5C040]/30" aria-hidden="true" />
      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-[#1A1720]/20 dark:bg-[#EAE8D8]/20" aria-hidden="true" />
      {/* Hoa văn rìa phải */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#F2B632]/40 dark:bg-[#F5C040]/30" aria-hidden="true" />
      <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-[#1A1720]/20 dark:bg-[#EAE8D8]/20" aria-hidden="true" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">

        {/* CUỘN GIẤY TIÊU ĐỀ — scroll-banner */}
        <div className="scroll-banner rounded-[4px] text-center px-8 py-8 mb-14 relative">
          <span
            className="text-xs font-black tracking-widest uppercase text-[#CC3520] block mb-3"
            style={{ lineHeight: "var(--lh-caption)" }}
          >
            CÂU CHUYỆN SẢN PHẨM
          </span>
          <h2
            className="font-display font-black text-3xl sm:text-4xl text-[#1A1720] dark:text-[#EAE8D8]"
            style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}
          >
            &ldquo;{STORY_CONTENT.quote}&rdquo;
          </h2>
          <p
            className="mt-4 text-base text-[#534E5C] dark:text-[#A8A4B2] max-w-2xl mx-auto"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            {STORY_CONTENT.description}
          </p>
          {/* Trang trí: chấm vàng hai bên */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F2B632] border border-[#1A1720]" aria-hidden="true" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F2B632] border border-[#1A1720]" aria-hidden="true" />
        </div>

        {/* BẢNG SO SÁNH */}
        <div className="rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[6px_6px_0px_#1A1720] dark:shadow-[6px_6px_0px_#EAE8D8] overflow-hidden bg-white dark:bg-[#1E1C23]">
          {/* Tiêu đề cột */}
          <div className="hidden sm:grid grid-cols-12 bg-[#C8D4DC] dark:bg-stone-800 text-[#1A1720] dark:text-[#EAE8D8] font-display font-black text-xs uppercase tracking-wider py-3 px-4 border-b-[3px] border-[#1A1720] dark:border-[#EAE8D8]">
            <div className="col-span-3">{STORY_CONTENT.comparisonHeaders[0]}</div>
            <div className="col-span-4">{STORY_CONTENT.comparisonHeaders[1]}</div>
            <div className="col-span-5">{STORY_CONTENT.comparisonHeaders[2]}</div>
          </div>

          {/* Các dòng so sánh */}
          <div className="divide-y-[2px] divide-[#1A1720]/15 dark:divide-[#EAE8D8]/15">
            {STORY_CONTENT.comparisons.map((row, index) => {
              const isHighlight = row.highlight;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-5 transition-colors ${
                    isHighlight
                      ? "bg-[#F2B632]/20 dark:bg-[#F5C040]/12 border-l-8 border-l-[#CC3520]"
                      : "hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
                  }`}
                >
                  {/* CỘT 1: Hình thức */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    {isHighlight ? (
                      <span className="w-3 h-3 rounded-full bg-[#CC3520] animate-ping flex-shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#534E5C] flex-shrink-0" />
                    )}
                    <span
                      className={`font-display font-black text-base sm:text-lg ${
                        isHighlight ? "text-[#CC3520] dark:text-[#F5C040]" : "text-[#1A1720] dark:text-[#EAE8D8]"
                      }`}
                      style={{ lineHeight: "var(--lh-heading)" }}
                    >
                      {row.source}
                    </span>
                  </div>

                  {/* CỘT 2: Trải nghiệm */}
                  <div className="sm:col-span-4 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-bold text-[#534E5C] uppercase" style={{ lineHeight: "1.5" }}>
                      Cách trải nghiệm:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isHighlight ? "text-[#1A1720] dark:text-white font-bold" : "text-[#534E5C] dark:text-[#A8A4B2]"
                      }`}
                      style={{ lineHeight: "var(--lh-body)" }}
                    >
                      {row.experience}
                    </span>
                  </div>

                  {/* CỘT 3: Cảm xúc đọng lại */}
                  <div className="sm:col-span-5 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-bold text-[#534E5C] uppercase" style={{ lineHeight: "1.5" }}>
                      Cảm xúc đọng lại:
                    </span>
                    <span
                      className={`text-xs sm:text-sm ${
                        isHighlight ? "text-[#1A1720] dark:text-[#EAE8D8] font-bold" : "text-[#534E5C] dark:text-[#A8A4B2]"
                      }`}
                      style={{ lineHeight: "var(--lh-body)" }}
                    >
                      {row.retention}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
