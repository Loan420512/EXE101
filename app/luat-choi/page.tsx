"use client";

/**
 * ==============================================================================
 * FILE: app/luat-choi/page.tsx
 * MỤC ĐÍCH: Trang luật chơi hoàn chỉnh (/luat-choi) gồm 2 chế độ:
 * 1. "Giải thích cho bé (7+)" (Câu ngắn, nhiều hình, trực quan, dễ hiểu)
 * 2. "Luật tiêu chuẩn đầy đủ" (Quy tắc chuẩn cho giải đấu / playtest)
 * ==============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import ColorRibbon from "@/components/ColorRibbon";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { RULES_CONTENT } from "@/data/content";
import { IconCardBack, IconLibrary, IconMusicNote, IconBolt, IconGrid, IconChild, IconScroll, IconBalloon, IconStar, IconGift, IconCrown, IconTrophy } from "@/components/icons";

export default function LuatChoiPage() {
  const [tab, setTab] = useState<"standard" | "kids">("kids");

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere="kim" />

      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full realm-kim">
        {/* NÚT QUAY LẠI */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC3520] hover:underline"
          >
            ← Quay lại Trang chủ Ngũ Cung
          </Link>
        </div>

        {/* TIÊU ĐỀ CHÍNH */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black tracking-widest uppercase text-[#A36A00] dark:text-[#F2B632] block mb-2">
            HƯỚNG DẪN LUẬT BÀI CHI TIẾT
          </span>
          <h1
            className="font-display font-black text-3xl sm:text-5xl text-[#1A1720] dark:text-[#EAE8D8]"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Luật chơi Ngũ Cung
          </h1>
          <p
            className="mt-3 text-sm sm:text-base text-[#534E5C] dark:text-[#A8A4B2]"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            Bộ bài gồm 45 lá (15 nhạc cụ × 3 lá mỗi loại). 2 đến 5 người chơi cùng hòa tấu và tranh tài để chạm mốc 15 điểm vinh quang.
          </p>
        </div>

        {/* NÚT CHUYỂN CHẾ ĐỘ: GIẢI THÍCH CHO BÉ VS LUẬT TIÊU CHUẨN */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 rounded-[6px] bg-white dark:bg-[#1E1C23] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
            <button
              onClick={() => setTab("kids")}
              className={`px-4 py-2 rounded text-xs sm:text-sm font-black transition-all ${
                tab === "kids"
                  ? "bg-[#CC3520] text-white shadow-[2px_2px_0px_#1A1720]"
                  : "text-[#1A1720] dark:text-[#EAE8D8] hover:text-[#CC3520]"
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><IconChild size={16} aria-hidden /> Dành cho bé (7+) & Người mới</span>
            </button>
            <button
              onClick={() => setTab("standard")}
              className={`px-4 py-2 rounded text-xs sm:text-sm font-black transition-all ${
                tab === "standard"
                  ? "bg-[#1A1720] text-white shadow-[2px_2px_0px_#CC3520]"
                  : "text-[#1A1720] dark:text-[#EAE8D8] hover:text-[#CC3520]"
              }`}
            >
              <span className="inline-flex items-center gap-1.5"><IconScroll size={16} aria-hidden /> Luật thi đấu chuẩn</span>
            </button>
          </div>
        </div>

        {tab === "kids" ? (
          /* ========================================================
             1. BẢN GIẢI THÍCH CHO BÉ 7+ (NGẮN, NHIỀU HÌNH, DỄ HIỂU)
             ======================================================== */
          <div className="space-y-8 animate-fade-in">
            {/* THÔNG ĐIỆP BÉ 7+ */}
            <div className="p-4 rounded bg-amber-50 dark:bg-amber-950/40 border-2 border-[#F2B632] flex items-center gap-3">
              <IconBalloon size={30} className="text-[#D23A22] shrink-0" aria-hidden />
              <p className="text-xs sm:text-sm font-semibold text-[#16141A] dark:text-[#E8EAE0]">
                Chào các bạn nhỏ! Trò chơi Ngũ Cung rất dễ và vui. Bé chỉ cần nhớ <strong>3 việc trong mỗi lượt</strong> và ghép các bản nhạc hay để ghi điểm thôi!
              </p>
            </div>

            {/* BƯỚC 1: CHUẨN BỊ BÀN CHƠI */}
            <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
              <h2
                className="font-display font-black text-xl text-[#CC3520] mb-3 flex items-center gap-2"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                <span className="inline-flex w-7 h-7 items-center justify-center rounded-full border-2 border-current text-sm">1</span> Bắt đầu ván chơi như thế nào?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="p-3 rounded bg-[#E8EAE0]/40 dark:bg-stone-800 border-2 border-[#1A1720]/20 dark:border-[#EAE8D8]/20">
                  <IconCardBack size={28} aria-hidden className="mb-1" />
                  <strong className="text-[#1A1720] dark:text-[#EAE8D8]">Mỗi người 5 lá</strong>
                  <p className="text-[#534E5C] dark:text-[#A8A4B2] mt-1" style={{ lineHeight: "var(--lh-body)" }}>Bé cầm kín trên tay, không cho bạn khác nhìn nhé.</p>
                </div>
                <div className="p-3 rounded bg-[#E8EAE0]/40 dark:bg-stone-800 border-2 border-[#1A1720]/20 dark:border-[#EAE8D8]/20">
                  <IconGrid size={28} aria-hidden className="mb-1" />
                  <strong className="text-[#1A1720] dark:text-[#EAE8D8]">Chợ Nhạc 5 lá</strong>
                  <p className="text-[#534E5C] dark:text-[#A8A4B2] mt-1" style={{ lineHeight: "var(--lh-body)" }}>Lật ngửa 5 lá ở giữa bàn để ai cũng chọn được.</p>
                </div>
                <div className="p-3 rounded bg-[#E8EAE0]/40 dark:bg-stone-800 border-2 border-[#1A1720]/20 dark:border-[#EAE8D8]/20">
                  <IconLibrary size={28} aria-hidden className="mb-1" />
                  <strong className="text-[#1A1720] dark:text-[#EAE8D8]">Chồng bài rút</strong>
                  <p className="text-[#534E5C] dark:text-[#A8A4B2] mt-1" style={{ lineHeight: "var(--lh-body)" }}>Để úp ở giữa bàn để rút bù khi Chợ hết lá.</p>
                </div>
              </div>
            </div>

            {/* BƯỚC 2: MỖI LƯỢT CHỌN 1 TRONG 3 VIỆC */}
            <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
              <h2
                className="font-display font-black text-xl text-[#3A7535] mb-4 flex items-center gap-2"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                <span className="inline-flex w-7 h-7 items-center justify-center rounded-full border-2 border-current text-sm">2</span> Đến lượt mình, bé chọn 1 việc duy nhất:
              </h2>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded bg-stone-50 dark:bg-stone-800 border-2 border-[#16141A] flex gap-3">
                  <IconGrid size={28} aria-hidden className="flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0]">A. Chọn nhạc cụ (Lấy bài)</h3>
                    <p className="text-stone-600 dark:text-stone-300 mt-0.5">
                      Bé lấy 1 lá thích nhất từ Chợ Nhạc về tay mình. Sau đó rút 1 lá mới từ cọc úp bù vào Chợ.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded bg-stone-50 dark:bg-stone-800 border-2 border-[#16141A] flex gap-3">
                  <IconMusicNote size={28} aria-hidden className="flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0]">B. Trình tấu (Ghi điểm)</h3>
                    <p className="text-stone-600 dark:text-stone-300 mt-0.5">
                      Bé đặt xuống bàn một bài nhạc hợp lệ (xem bảng điểm bên dưới) để ghi điểm cho mình!
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded bg-stone-50 dark:bg-stone-800 border-2 border-[#16141A] flex gap-3">
                  <IconBolt size={28} aria-hidden className="flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0]">C. Phá âm (Khắc chế đối thủ)</h3>
                    <p className="text-stone-600 dark:text-stone-300 mt-0.5">
                      Bé bỏ 1 lá trên tay xuống. Nếu đối thủ có lá bị lá của bé khắc (ví dụ: Nước dập Lửa, Rìu chặt Cây), đối thủ đó phải bỏ 1 lá bị khắc đi!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BƯỚC 3: CÁCH TÍNH ĐIỂM DỄ NHỚ */}
            <div className="bg-white dark:bg-[#1D1B22] p-6 rounded-[6px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A]">
              <h2 className="font-display font-black text-xl text-[#F2B632] mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F2B632] text-[#16141A] text-base font-black border-2 border-[#16141A]">3</span> Ghép bài thế nào được nhiều điểm nhất?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded bg-amber-50/70 dark:bg-stone-800 border border-[#16141A]/20">
                  <span className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0] block">
                    Đồng âm: 2 điểm
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 mt-1">3 lá cùng một màu họ (ví dụ: 3 lá màu đỏ Hỏa).</p>
                </div>
                <div className="p-3.5 rounded bg-amber-50/70 dark:bg-stone-800 border border-[#16141A]/20">
                  <span className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0] block">
                    Hợp tấu: 4 điểm <span className="inline-flex items-center align-[-1px]"><IconStar size={14} className="text-[#F2B632]" aria-hidden /></span>
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 mt-1">3 lá cùng màu nhưng 3 nhạc cụ khác nhau hoàn toàn!</p>
                </div>
                <div className="p-3.5 rounded bg-amber-50/70 dark:bg-stone-800 border border-[#16141A]/20">
                  <span className="font-bold text-sm text-[#16141A] dark:text-[#E8EAE0] block">
                    Liên hoàn: 2 điểm + Lấy thêm 1 lá <span className="inline-flex items-center align-[-1px]"><IconGift size={14} aria-hidden /></span>
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 mt-1">2 lá đi liền nhau theo vòng tương sinh (Mộc sinh Hỏa, Hỏa sinh Thổ...).</p>
                </div>
                <div className="p-3.5 rounded bg-amber-100 dark:bg-amber-950/60 border-2 border-[#16141A]">
                  <span className="font-bold text-sm text-[#D23A22] block">
                    Ngũ Cung: 8 điểm <span className="inline-flex items-center align-[-1px]"><IconCrown size={14} aria-hidden /></span> (Siêu điểm!)
                  </span>
                  <p className="text-stone-600 dark:text-stone-300 mt-1">Đủ 5 lá của cả 5 màu (Thổ, Kim, Mộc, Hỏa, Thủy)!</p>
                </div>
              </div>
            </div>

            {/* BƯỚC 4: KHI NÀO CHIẾN THẮNG? */}
            <div className="p-4 rounded bg-[#3F7D3B] text-white border-2 border-[#16141A] shadow-[3px_3px_0px_#16141A]">
              <h2 className="font-display font-black text-lg mb-1 flex items-center gap-2">
                <IconTrophy size={20} aria-hidden /> Ai đạt 15 điểm trước sẽ thắng cuộc!
              </h2>
              <p className="text-xs sm:text-sm opacity-90">
                Khi có bạn chạm mốc 15 điểm, mọi người chơi nốt lượt trong vòng đó. Bạn nào nhiều điểm nhất sẽ là người chiến thắng vẻ vang!
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================
             2. LUẬT TIÊU CHUẨN ĐẦY ĐỦ (DÀNH CHO GIẢI ĐẤU & PLAYTEST)
             ======================================================== */
          <div className="space-y-8 animate-fade-in">
            {/* THIẾT LẬP */}
            <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
              <h2
                className="font-display font-black text-xl text-[#1A1720] dark:text-[#EAE8D8] mb-3"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                1. Quy cách bộ bài & Thiết lập ván chơi
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                {RULES_CONTENT.setup.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
                <li>Giới hạn tay bài cuối lượt: Tối đa 7 lá trên tay. Nếu thừa, người chơi phải chọn lá để bỏ vào Chồng bài bỏ.</li>
              </ul>
            </div>

            {/* 3 HÀNH ĐỘNG MỖI LƯỢT */}
            <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
              <h2
                className="font-display font-black text-xl text-[#1A1720] dark:text-[#EAE8D8] mb-3"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                2. Ba hành động lựa chọn trong lượt
              </h2>
              <div className="space-y-4 text-xs sm:text-sm">
                {RULES_CONTENT.turnActions.actions.map((act, i) => (
                  <div key={i} className="p-3.5 rounded bg-[#E8EAE0]/30 dark:bg-stone-800 border-2 border-[#1A1720]/15 dark:border-[#EAE8D8]/15">
                    <strong className="text-[#1A1720] dark:text-[#EAE8D8] font-bold block mb-1">
                      {act.name}
                    </strong>
                    <p className="text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                      {act.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BẢNG ĐIỂM TỔ HỢP */}
            <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
              <h2
                className="font-display font-black text-xl text-[#1A1720] dark:text-[#EAE8D8] mb-3"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                3. Bảng điểm tổ hợp hòa thanh
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#1A1720] dark:border-[#EAE8D8]">
                      <th className="py-2.5 px-3 font-bold text-[#1A1720] dark:text-[#EAE8D8]">Bản nhạc</th>
                      <th className="py-2.5 px-3 font-bold text-[#1A1720] dark:text-[#EAE8D8]">Điều kiện kết hợp</th>
                      <th className="py-2.5 px-3 font-bold text-[#1A1720] dark:text-[#EAE8D8]">Điểm số</th>
                      <th className="py-2.5 px-3 font-bold text-[#1A1720] dark:text-[#EAE8D8]">Cấp bậc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RULES_CONTENT.scoring.map((row, i) => (
                      <tr key={i} className="border-b border-stone-200 dark:border-stone-800">
                        <td className="py-2.5 px-3 font-bold text-[#CC3520]">{row.combo}</td>
                        <td className="py-2.5 px-3 text-[#534E5C] dark:text-[#A8A4B2]">{row.requirement}</td>
                        <td className="py-2.5 px-3 font-black text-[#1A1720] dark:text-[#EAE8D8] tabular-nums">{row.score}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#F2B632] text-[#1A1720] font-black text-[10px] border border-[#1A1720]">
                            {row.badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ĐIỀU KIỆN KẾT THÚC & TIEBREAK */}
            <div className="bg-white dark:bg-[#1D1B22] p-6 rounded-[6px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[4px_4px_0px_#16141A]">
              <h2 className="font-display font-black text-xl text-[#16141A] dark:text-[#E8EAE0] mb-3">
                4. Kết thúc ván đấu & Phân định hòa điểm
              </h2>
              <p className="text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0] leading-relaxed mb-3">
                {RULES_CONTENT.winCondition}
              </p>
              <div className="p-3 rounded bg-amber-50 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-700">
                <strong>Quy tắc phân định hòa (Tiebreak):</strong> Nếu hai hoặc nhiều người chơi có cùng điểm số khi kết thúc vòng, người chơi nào sở hữu số lần trình tấu combo <em>Hợp tấu</em> nhiều hơn sẽ giành chiến thắng chung cuộc.
              </div>
            </div>
          </div>
        )}

        <ColorRibbon />
      </main>

      <TeamFaqFooter />
    </div>
  );
}
