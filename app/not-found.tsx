import React from "react";
import Link from "next/link";
import LivingBackground from "@/components/LivingBackground/LivingBackground";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <LivingBackground forceAtmosphere="mix" />

      <div className="relative z-10 max-w-md w-full bg-[#FAFAF5] dark:bg-[#1D1B22] p-8 rounded border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[6px_6px_0px_#16141A] dark:shadow-[6px_6px_0px_#E8EAE0]">
        {/* LOGO CHÍNH THỨC */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-auto aspect-[676/369] bg-white dark:bg-stone-800 p-1.5 rounded border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A]">
            <picture>
              <source type="image/webp" srcSet="/images/logo/logongucung.webp" />
              <img
                src="/images/logo/logongucung.png"
                alt="Logo Ngũ Cung Card Game"
                className="h-full w-auto object-contain"
                width={116}
                height={64}
              />
            </picture>
          </div>
        </div>

        <span className="text-xs font-black tracking-widest uppercase text-[#D23A22] block mb-2">
          LỖI 404 — LẠC BƯỚC KHỎI CÕI NGŨ ÂM
        </span>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0] mb-4">
          Không tìm thấy trang này
        </h1>

        <p className="text-sm text-[#524F59] dark:text-[#A8A6B0] mb-6 leading-relaxed">
          Giai điệu bạn đang tìm kiếm dường như đã hòa tan vào cõi sương mù. Hãy trở về trang chủ để cùng tiếp tục hành trình khám phá 15 nhạc cụ dân gian.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D23A22] text-white font-black text-sm uppercase tracking-wider rounded border-2 border-[#16141A] shadow-[3px_3px_0px_#16141A] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#16141A] transition-all"
        >
          <span>Trở về Trang Chủ</span>
        </Link>
      </div>
    </main>
  );
}
