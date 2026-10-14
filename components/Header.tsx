"use client";

/**
 * ==============================================================================
 * FILE: components/Header.tsx
 * MỤC ĐÍCH: Header điều hướng phong cách Đông Hồ và nút Bật/Tắt âm thanh tổng hợp WebAudio.
 * QUY CÁCH:
 * - Thanh trên cùng: 'Bản demo: nội dung là bản nháp'
 * - Nút âm thanh mặc định: TẮT (người dùng bấm để bật)
 * - Điều hướng cuộn mượt tới các phần chính của trang và liên kết /bo-bai
 * ==============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import { soundEngine } from "@/lib/audio";
import { SITE_METADATA } from "@/data/content";

interface HeaderProps {
  onOpenPack?: () => void;
  onOpenCollection?: () => void;
}

export default function Header({ onOpenPack, onOpenCollection }: HeaderProps = {}) {
  const [isMuted, setIsMuted] = useState(() => soundEngine.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    // Nếu vừa bật, phát thử một nốt Thổ để xác nhận kích hoạt AudioContext
    if (!nextMuted) {
      soundEngine.playElementTone("tho", true);
    }
  };

  const navLinks = [
    { label: "Giới thiệu", href: "/#hero" },
    { label: "Bộ bài", href: "/bo-bai" },
    { label: "Ngũ hành", href: "/ngu-hanh" },
    { label: "Luật chơi", href: "/luat-choi" },
    { label: "Ngũ âm", href: "/san-choi-ngu-am" },
    { label: "Quiz", href: "/quiz" },
    { label: "Đăng ký", href: "/#dang-ky" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#E8EAE0] dark:bg-[#141318] border-b-[3px] border-[#16141A] dark:border-[#E8EAE0]">


      {/* 2. THANH ĐIỀU HƯỚNG CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* LOGO CHÍNH THỨC NGŨ CUNG */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D23A22] rounded py-1">
          <picture className="group-hover:scale-105 transition-transform">
            <source type="image/webp" srcSet="/images/logo/logongucung.webp" />
            <img
              src="/images/logo/logongucung.png"
              alt="Logo Ngũ Cung Card Game"
              className="h-9 sm:h-10 w-auto object-contain dark:brightness-110"
              width={80}
              height={44}
            />
          </picture>
          <span className="font-display font-black text-base tracking-tight text-[#16141A] dark:text-[#E8EAE0] leading-none whitespace-nowrap">
            NGŨ CUNG
          </span>
        </Link>

        {/* MENU DESKTOP – căn giữa, chiếm phần còn lại */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 text-[13px] font-semibold">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[#16141A] dark:text-[#E8EAE0] hover:text-[#D23A22] dark:hover:text-[#F2B632] transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CỤM NÚT TÁC VỤ: BẬT/TẮT ÂM THANH & CTA */}
        <div className="flex-shrink-0 flex items-center gap-3">
          {/* NÚT ÂM THANH (MẶC ĐỊNH TẮT) */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Bật âm thanh nốt ngũ cung" : "Tắt âm thanh"}
            className={`px-3 py-1.5 rounded-[4px] border-[2px] border-[#16141A] dark:border-[#E8EAE0] 
              text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] 
              transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] ${
                isMuted
                  ? "bg-stone-200 dark:bg-stone-800 text-[#524F59] dark:text-[#A8A6B0]"
                  : "bg-[#3F7D3B] text-white"
              }`}
          >
            {isMuted ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span>Âm thanh: Tắt</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>Âm thanh: Bật</span>
              </>
            )}
          </button>

          {/* NÚT MỞ GÓI BÀI */}
          {onOpenPack && (
            <button
              onClick={onOpenPack}
              className="px-2.5 py-1.5 rounded-[4px] bg-[#F2B632] text-[#16141A] border-[2px] border-[#16141A] dark:border-[#E8EAE0] text-xs font-black shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1"
              title="Mở gói 5 lá bài ngẫu nhiên"
            >
              <span>🎁</span>
              <span className="hidden md:inline">Mở gói</span>
            </button>
          )}

          {/* NÚT BỘ SƯU TẬP */}
          {onOpenCollection && (
            <button
              onClick={onOpenCollection}
              className="px-2.5 py-1.5 rounded-[4px] bg-white dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0] border-[2px] border-[#16141A] dark:border-[#E8EAE0] text-xs font-bold shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-1"
              title="Xem bộ sưu tập và huy hiệu"
            >
              <span>🎴</span>
              <span className="hidden md:inline">Bộ sưu tập</span>
            </button>
          )}

          {/* NÚT THỬ NGAY */}
          <a
            href="#dang-ky"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-[4px] bg-[#D23A22] text-white 
              border-[2px] border-[#16141A] dark:border-[#E8EAE0] text-xs font-bold 
              shadow-[2px_2px_0px_#16141A] dark:shadow-[2px_2px_0px_#E8EAE0] hover:-translate-y-0.5"
          >
            Chơi thử
          </a>

          {/* NÚT HAMBURGER MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded border-2 border-[#16141A] dark:border-[#E8EAE0]"
            aria-label="Menu"
          >
            <svg className="w-5 h-5 text-[#16141A] dark:text-[#E8EAE0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#E8EAE0] dark:bg-[#141318] border-t-2 border-[#16141A] dark:border-[#E8EAE0] px-4 py-3 flex flex-col gap-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-sm font-bold text-[#16141A] dark:text-[#E8EAE0] border-b border-black/10 dark:border-white/10"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/bo-bai"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 text-sm font-bold text-[#D23A22]"
          >
            → Xem toàn bộ thư viện 15 nhạc cụ (/bo-bai)
          </Link>
        </div>
      )}
    </header>
  );
}
