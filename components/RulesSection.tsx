"use client";

/**
 * ==============================================================================
 * FILE: components/RulesSection.tsx
 * MỤC ĐÍCH: Trình bày luật chơi rút gọn và bảng tính điểm chi tiết của Ngũ Cung.
 * QUY CÁCH:
 * - Chuẩn bị (5 lá mỗi người, 5 lá Chợ Nhạc)
 * - 3 hành động mỗi lượt: Chọn nhạc cụ, Trình tấu, Phá âm
 * - Bảng điểm: Đồng âm (2đ), Hợp tấu (4đ), Liên hoàn (2đ + 1 lá), Ngũ Cung (8đ)
 * - Điều kiện kết thúc: 15 điểm
 * ==============================================================================
 */

import React from "react";
import { RULES_CONTENT } from "@/data/content";

export default function RulesSection() {
  return (
    <section id="luat-choi" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TIÊU ĐỀ */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-black tracking-widest uppercase text-[#D23A22] block mb-2">
          HỆ THỐNG CƠ CHẾ BÀI
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]">
          {RULES_CONTENT.title}
        </h2>
        <p className="mt-2 text-sm text-[#524F59] dark:text-[#A8A6B0]">
          {RULES_CONTENT.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* CỘT TRÁI: CHUẨN BỊ & 3 HÀNH ĐỘNG MỖI LƯỢT */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {/* KHỐI 1: CHUẨN BỊ */}
          <div className="p-6 rounded-[4px] bg-white dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0]">
            <h3 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0] mb-3 flex items-center gap-2">
              <span>🃏</span> {RULES_CONTENT.setup.title}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0]">
              {RULES_CONTENT.setup.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#D23A22] font-black">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* KHỐI 2: 3 HÀNH ĐỘNG MỖI LƯỢT */}
          <div className="p-6 rounded-[4px] bg-white dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0]">
            <h3 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0] mb-3 flex items-center gap-2">
              <span>⚡</span> {RULES_CONTENT.turnActions.title}
            </h3>
            <div className="space-y-3">
              {RULES_CONTENT.turnActions.actions.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded bg-stone-50 dark:bg-stone-800/60 border border-black/10 dark:border-white/10"
                >
                  <span className="font-display font-black text-sm text-[#16141A] dark:text-[#E8EAE0] block">
                    {act.name}
                  </span>
                  <p className="text-xs text-[#524F59] dark:text-[#A8A6B0] mt-0.5">
                    {act.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG ĐIỂM & ĐIỀU KIỆN KẾT THÚC */}
        <div className="md:col-span-6 flex flex-col gap-6">
          {/* BẢNG TÍNH ĐIỂM */}
          <div className="p-6 rounded-[4px] bg-white dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0]">
            <h3 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0] mb-3 flex items-center gap-2">
              <span>🎯</span> Bảng hòa thanh & Điểm số
            </h3>

            <div className="divide-y divide-black/10 dark:divide-white/10">
              {RULES_CONTENT.scoring.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-sm text-[#16141A] dark:text-[#E8EAE0]">
                        {item.combo}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-700 text-[#524F59] dark:text-[#A8A6B0]">
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-xs text-[#524F59] dark:text-[#A8A6B0] mt-0.5">
                      {item.requirement}
                    </span>
                  </div>

                  <span className="font-display font-black text-base text-[#D23A22] whitespace-nowrap px-2.5 py-1 rounded bg-[#D23A22]/10 border border-[#D23A22]/30">
                    {item.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ĐIỀU KIỆN KẾT THÚC VÒNG CHƠI */}
          <div className="p-5 rounded-[4px] bg-[#F2B632]/25 dark:bg-[#F2B632]/10 border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] flex items-center gap-3">
            <span className="text-3xl">🏁</span>
            <div>
              <h4 className="font-display font-black text-sm text-[#16141A] dark:text-[#E8EAE0] uppercase">
                Điều kiện phân định thắng bại
              </h4>
              <p className="text-xs text-[#524F59] dark:text-[#A8A6B0] mt-1">
                {RULES_CONTENT.winCondition}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
