"use client";

/**
 * FILE: app/ho-so/page.tsx
 * Hồ sơ tối thiểu cho BottomNav / Header — picker đầy đủ thuộc U4.
 */

import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { IconUser } from "@/components/icons";

export default function HoSoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LivingBackground forceAtmosphere="tho" />
      <Header />
      <div className="h-[62px]" aria-hidden />
      <main id="page-ho-so" className="flex-1 max-w-lg mx-auto px-4 py-12 w-full">
        <div className="dongho-box p-8 text-center bg-[#FAFAF5] text-[#1A1720]">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full border-[3px] border-[#1A1720] flex items-center justify-center bg-[#F2B632]">
            <IconUser size={28} aria-hidden />
          </div>
          <h1 className="font-display font-black text-2xl mb-2">Hồ sơ của tôi</h1>
          <p className="text-sm text-[#534E5C] leading-relaxed">
            Chế độ Bé, hồ sơ gia đình và mã PIN phụ huynh sẽ mở ở pha U4.
            Hiện tại bạn có thể khám phá nhạc cụ, chơi thử và đổi vũ trụ ngũ hành (phím 1–5, 0).
          </p>
        </div>
      </main>
      <TeamFaqFooter />
    </div>
  );
}
