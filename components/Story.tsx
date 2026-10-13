"use client";

/**
 * ==============================================================================
 * FILE: components/Story.tsx
 * MỤC ĐÍCH: Phần câu chuyện sản phẩm và bảng so sánh 4 phương thức tiếp cận văn hóa.
 * NỘI DUNG:
 * - Thông điệp: 'Văn hóa vẫn còn đó. Chỉ thiếu một cách để chạm vào.'
 * - Bảng so sánh 4 dòng: Bảo tàng, Sách giáo khoa, Lớp học, Ngũ Cung.
 * ==============================================================================
 */

import React from "react";
import { STORY_CONTENT } from "@/data/content";

export default function Story() {
  return (
    <section id="cau-chuyen" className="py-20 bg-stone-100/60 dark:bg-black/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TIÊU ĐỀ & TRÍCH DẪN */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black tracking-widest uppercase text-[#D23A22] block mb-2">
            CÂU CHUYỆN SẢN PHẨM
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0] leading-snug">
            &ldquo;{STORY_CONTENT.quote}&rdquo;
          </h2>
          <p className="mt-4 text-base text-[#524F59] dark:text-[#A8A6B0]">
            {STORY_CONTENT.description}
          </p>
        </div>

        {/* BẢNG SO SÁNH 4 DÒNG */}
        <div className="rounded-[4px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[6px_6px_0px_#16141A] dark:shadow-[6px_6px_0px_#E8EAE0] overflow-hidden bg-white dark:bg-[#1D1B22]">
          {/* TIÊU ĐỀ CỘT TRÊN DESKTOP */}
          <div className="hidden sm:grid grid-cols-12 bg-[#DDE3E8] dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0] font-display font-black text-xs uppercase tracking-wider py-3 px-4 border-b-[3px] border-[#16141A] dark:border-[#E8EAE0]">
            <div className="col-span-3">{STORY_CONTENT.comparisonHeaders[0]}</div>
            <div className="col-span-4">{STORY_CONTENT.comparisonHeaders[1]}</div>
            <div className="col-span-5">{STORY_CONTENT.comparisonHeaders[2]}</div>
          </div>

          {/* CÁC DÒNG SO SÁNH */}
          <div className="divide-y-[2px] divide-[#16141A]/20 dark:divide-[#E8EAE0]/20">
            {STORY_CONTENT.comparisons.map((row, index) => {
              const isHighlight = row.highlight;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 sm:p-5 transition-colors ${
                    isHighlight
                      ? "bg-[#F2B632]/25 dark:bg-[#F2B632]/15 border-l-8 border-l-[#D23A22]"
                      : "hover:bg-stone-50 dark:hover:bg-stone-800/40"
                  }`}
                >
                  {/* CỘT 1: HÌNH THỨC */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    {isHighlight ? (
                      <span className="w-3 h-3 rounded-full bg-[#D23A22] animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#524F59]" />
                    )}
                    <span
                      className={`font-display font-black text-base sm:text-lg ${
                        isHighlight
                          ? "text-[#D23A22] dark:text-[#F2B632]"
                          : "text-[#16141A] dark:text-[#E8EAE0]"
                      }`}
                    >
                      {row.source}
                    </span>
                  </div>

                  {/* CỘT 2: TRẢI NGHIỆM */}
                  <div className="sm:col-span-4 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-bold text-[#524F59] uppercase">
                      Cách trải nghiệm:
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isHighlight
                          ? "text-[#16141A] dark:text-white font-bold"
                          : "text-[#524F59] dark:text-[#A8A6B0]"
                      }`}
                    >
                      {row.experience}
                    </span>
                  </div>

                  {/* CỘT 3: CẢM XÚC ĐỌNG LẠI */}
                  <div className="sm:col-span-5 flex flex-col justify-center">
                    <span className="sm:hidden text-[10px] font-bold text-[#524F59] uppercase">
                      Cảm xúc đọng lại:
                    </span>
                    <span
                      className={`text-xs sm:text-sm ${
                        isHighlight
                          ? "text-[#16141A] dark:text-[#E8EAE0] font-bold"
                          : "text-[#524F59] dark:text-[#A8A6B0]"
                      }`}
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
