"use client";

/**
 * ==============================================================================
 * FILE: components/TeamFaqFooter.tsx
 * MỤC ĐÍCH: Giới thiệu Đội ngũ Team 35, Giảng viên hướng dẫn, Hỏi đáp (FAQ) và Chân trang.
 * QUY CÁCH:
 * - 6 thành viên Team 35 + Giảng viên hướng dẫn Ngo Thi Tuyet Minh
 * - 5 câu hỏi thường gặp (kèm ghi chú âm thanh WebAudio là nốt thử nghiệm)
 * - Chân trang phong cách tranh khắc gỗ Đông Hồ
 * ==============================================================================
 */

import React, { useState } from "react";
import { TEAM_MEMBERS, ADVISOR, FAQ_LIST, SITE_METADATA } from "@/data/content";

export default function TeamFaqFooter() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <footer id="doi-ngu" className="pt-20 pb-12 bg-stone-200/70 dark:bg-[#121116] border-t-[3px] border-[#16141A] dark:border-[#E8EAE0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= PHẦN 1: ĐỘI NGŨ TEAM 35 ================= */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black tracking-widest uppercase text-[#3F7D3B] block mb-2">
              NHỮNG NGƯỜI SÁNG TẠO
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]">
              Đội ngũ Team 35
            </h2>
            <p className="mt-2 text-sm text-[#524F59] dark:text-[#A8A6B0]">
              Nhóm sinh viên nhiệt huyết với tình yêu âm nhạc dân tộc và khao khát đưa văn hóa vào đời sống đương đại.
            </p>
          </div>

          {/* LƯỚI 6 THÀNH VIÊN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {TEAM_MEMBERS.map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-[4px] bg-white dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F2B632] text-[#16141A]">
                      TEAM 35
                    </span>
                    <span className="text-xs font-bold text-[#D23A22]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0]">
                    {member.name}
                  </h3>
                  <div className="text-xs font-bold text-[#3F7D3B] dark:text-[#7CB9E8] mb-2">
                    {member.role}
                  </div>
                  <p className="text-xs text-[#524F59] dark:text-[#A8A6B0] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* GIẢNG VIÊN HƯỚNG DẪN */}
          <div className="max-w-xl mx-auto p-5 rounded-[4px] bg-[#E8EAE0] dark:bg-stone-800/80 border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A] dark:shadow-[4px_4px_0px_#E8EAE0] flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-[#D23A22] text-white font-display font-black text-xl flex items-center justify-center border-2 border-[#16141A]">
              GV
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D23A22]">
                {ADVISOR.title}
              </span>
              <h4 className="font-display font-black text-lg text-[#16141A] dark:text-[#E8EAE0]">
                {ADVISOR.name}
              </h4>
              <p className="text-xs text-[#524F59] dark:text-[#A8A6B0] mt-0.5">
                {ADVISOR.note}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PHẦN 2: HỎI ĐÁP (FAQ) ================= */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-[#D23A22] block mb-2">
              GIẢI ĐÁP THẮC MẮC
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_LIST.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-[4px] bg-white dark:bg-[#1D1B22] border-[2px] border-[#16141A] dark:border-[#E8EAE0] shadow-[3px_3px_0px_#16141A] dark:shadow-[3px_3px_0px_#E8EAE0] overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-display font-black text-sm sm:text-base text-[#16141A] dark:text-[#E8EAE0]"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg font-mono text-[#D23A22]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0] border-t border-black/10 dark:border-white/10 leading-relaxed bg-[#E8EAE0]/30 dark:bg-stone-800/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PHẦN 3: CHÂN TRANG ĐÔNG HỒ ================= */}
        <div className="pt-8 border-t-2 border-[#16141A]/20 dark:border-[#E8EAE0]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#524F59] dark:text-[#A8A6B0]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#D23A22] text-white font-display font-black text-xs flex items-center justify-center">
              NC
            </div>
            <span className="font-bold text-[#16141A] dark:text-[#E8EAE0]">
              Ngũ Cung (Five Tones)
            </span>
            <span>— {SITE_METADATA.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Đồ án môn học • Team 35</span>
            <span>© 2026 Dự án Ngũ Cung</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
