/**
 * ==============================================================================
 * FILE: app/ngu-hanh/page.tsx
 * MỤC ĐÍCH: Trang chuyên đề Ngũ Âm & Ngũ Hành (/ngu-hanh):
 * - Sơ đồ ngũ giác tương tác Đông Hồ
 * - Chuyển đổi linh hoạt giữa Tương Sinh (vòng tròn) và Tương Khắc (ngôi sao)
 * - Khám phá 5 hành (Thổ, Kim, Mộc, Hỏa, Thủy) và thanh âm tương ứng
 * ==============================================================================
 */

import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import WuXingDiagram from "@/components/WuXingDiagram";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";

export const metadata: Metadata = {
  title: "Ngũ Âm & Ngũ Hành — Triết Lý Âm Nhạc Cổ Truyền | Ngũ Cung",
  description: "Khám phá mối tương tác huyền diệu giữa năm cung bậc âm nhạc Cung, Thương, Giốc, Chủy, Vũ và ngũ hành tương sinh tương khắc.",
};

export default function NguHanhPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere="mix" />

      <Header />

      <main className="below-header flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full realm-tho">
        {/* NÚT QUAY LẠI */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC3520] hover:underline"
          >
            ← Quay lại Trang chủ Ngũ Cung
          </Link>
        </div>

        {/* GIỚI THIỆU CHUYÊN ĐỀ */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-[#A36A00] dark:text-[#F2B632] block mb-2">
            TRIẾT LÝ ÂM HỌC Á ĐÔNG
          </span>
          <h1
            className="font-display font-black text-3xl sm:text-5xl text-[#1A1720] dark:text-[#EAE8D8]"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Ngũ Âm & Ngũ Hành
          </h1>
          <p
            className="mt-3 text-sm sm:text-base text-[#534E5C] dark:text-[#A8A4B2]"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            Trời đất có ngũ hành, con người có ngũ tạng, âm nhạc có ngũ thanh. Mỗi cung bậc mang một tính cách, một sắc thái và vận hành theo quy luật sinh khắc ngàn đời.
          </p>
        </div>

        {/* SƠ ĐỒ NGŨ HÀNH TƯƠNG TÁC */}
        <WuXingDiagram />
      </main>

      <TeamFaqFooter />
    </div>
  );
}
