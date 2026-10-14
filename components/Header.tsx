"use client";

/**
 * FILE: components/Header.tsx
 * Thanh điều hướng streaming-era × Đông Hồ:
 * - Logo cân đối, nav gọn, bộ chọn vũ trụ 5 hành, tìm kiếm, âm thanh, hồ sơ
 * - Ẩn khi cuộn xuống, hiện lại khi cuộn lên
 * - Không có thanh "Bản demo" màu vàng (đã bỏ theo review)
 * - Dải màu 5 hành vẫn giữ ở đáy header
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { soundEngine } from "@/lib/audio";
import { UNIVERSES } from "@/config/universes";
import type { UniverseId } from "@/config/universes";
import { useUniverse } from "@/lib/useUniverse";
import { useProfiles, GUEST_PROFILE } from "@/lib/profiles";
import { SHOW_PROFILES_EVENT } from "@/components/WhoIsPlaying";
import { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";
import {
  IconVolume, IconVolumeMute, IconSearch, IconGamepad,
  IconMusicNote, IconCompass, IconLibrary, IconUser, IconDrum,
} from "@/components/icons";
import { UniverseAvatar, UniverseGlyph } from "@/components/UniverseGlyph";

interface HeaderProps {
  onOpenPack?: () => void;
  onOpenCollection?: () => void;
}

const NAV_LINKS = [
  { label: "Khám phá", href: "/", icon: <IconCompass size={16} aria-hidden /> },
  { label: "Duyệt", href: "/duyet", icon: <IconLibrary size={16} aria-hidden /> },
  { label: "Chơi", href: "/choi-thu-ngay", icon: <IconGamepad size={16} aria-hidden /> },
  { label: "Nhạc", href: "/san-choi-ngu-am", icon: <IconMusicNote size={16} aria-hidden /> },
  { label: "Luật", href: "/luat-choi", icon: <IconDrum size={16} aria-hidden /> },
];

export default function Header({ onOpenPack, onOpenCollection }: HeaderProps = {}) {
  const [isMuted, setIsMuted] = useState(() => soundEngine.getIsMuted());
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { universeId, setUniverse } = useUniverse();
  const { current: profile, hasChosen } = useProfiles();
  const activeProfile = profile ?? GUEST_PROFILE;

  // Ẩn/hiện khi cuộn
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) { setVisible(true); }
      else if (y > lastScrollY.current + 8) { setVisible(false); }
      else if (y < lastScrollY.current - 4) { setVisible(true); }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundEngine.playElementTone("tho", true);
  };

  const uKit = UNIVERSES[universeId];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* MAIN NAV */}
      <div
        className="bg-[#0B0C14]/92 backdrop-blur-md border-b border-white/8"
        style={{ borderBottomColor: uKit.colors.border + "30" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">

          {/* LOGO */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-[#D23A22] rounded-sm"
            aria-label="Ngũ Cung — Trang chủ"
          >
            <picture>
              <source type="image/webp" srcSet="/images/logo/logongucung.webp" />
              <img
                src="/images/logo/logongucung.png"
                alt=""
                aria-hidden
                className="h-8 w-auto object-contain"
                width={56}
                height={32}
              />
            </picture>
            <span
              className="hidden sm:block font-display font-black text-[15px] tracking-tight whitespace-nowrap"
              style={{ color: uKit.colors.textPrimary }}
            >
              NGŨ CUNG
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-1 ml-4" aria-label="Điều hướng chính">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[13px] font-semibold
                  text-white/70 hover:text-white hover:bg-white/8 transition-all duration-150
                  focus-visible:outline-2 focus-visible:outline-[#D23A22] whitespace-nowrap"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* SPACER */}
          <div className="flex-1" />

          {/* BỘ CHỌN VŨ TRỤ */}
          <div
            className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-[4px] border border-white/10"
            role="group"
            aria-label="Chọn vũ trụ ngũ hành (phím 1–5, 0)"
          >
            {(["tho", "kim", "moc", "hoa", "thuy", "united"] as UniverseId[]).map((id) => {
              const u = UNIVERSES[id];
              const isActive = universeId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setUniverse(id)}
                  title={`${u.label} — phím ${u.shortcut}`}
                  aria-label={`${u.label} — phím ${u.shortcut}`}
                  aria-pressed={isActive}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[3px] flex items-center justify-center
                    transition-all duration-150
                    focus-visible:outline-2 focus-visible:outline-[#D23A22]
                    ${isActive
                      ? "scale-110 shadow-[0_0_8px_2px_var(--glow)]"
                      : "opacity-50 hover:opacity-80"
                    }`}
                  style={{
                    backgroundColor: isActive ? u.colors.accent : u.colors.accent + "40",
                    color: isActive ? u.colors.textOnAccent : u.colors.accent,
                    ["--glow" as string]: u.colors.glow,
                  }}
                >
                  <UniverseGlyph avatar={id} />
                </button>
              );
            })}
          </div>

          {/* TÌM KIẾM */}
          <button
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Tìm kiếm (Ctrl+K)"
            title="Tìm kiếm Ctrl+K"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-[4px] text-white/60 hover:text-white
              hover:bg-white/8 transition-all focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconSearch size={18} aria-hidden />
          </button>

          {/* ÂM THANH */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            aria-pressed={!isMuted}
            title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            className={`w-9 h-9 flex items-center justify-center rounded-[4px] transition-all
              focus-visible:outline-2 focus-visible:outline-[#D23A22]
              ${isMuted
                ? "text-white/40 hover:text-white/70 hover:bg-white/8"
                : "text-[#3F7D3B] hover:bg-[#3F7D3B]/15"
              }`}
          >
            {isMuted ? <IconVolumeMute size={18} aria-hidden /> : <IconVolume size={18} aria-hidden />}
          </button>

          {/* HỒ SƠ — hiện avatar hành của người đang chơi */}
          <button
            onClick={() => window.dispatchEvent(new Event(SHOW_PROFILES_EVENT))}
            aria-label={hasChosen ? `Hồ sơ: ${activeProfile.name} — đổi hồ sơ` : "Chọn hồ sơ người chơi"}
            title={hasChosen ? `Đang chơi: ${activeProfile.name} — bấm để đổi hồ sơ` : "Ai đang chơi?"}
            className="h-9 min-w-9 px-1.5 flex items-center justify-center gap-1.5 rounded-[4px] text-white/60
              hover:text-white hover:bg-white/8 transition-all
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            {!hasChosen || activeProfile.avatar === "united" ? (
              <IconUser size={18} aria-hidden />
            ) : (
              <UniverseAvatar avatar={activeProfile.avatar} size={24} />
            )}
            {hasChosen && (
              <span className="hidden lg:block text-[12px] font-bold max-w-[90px] truncate">
                {activeProfile.name}
              </span>
            )}
          </button>

          {/* NÚT CHƠI — CTA chính */}
          <Link
            href="/choi-thu-ngay"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-[13px] font-black
              border-2 border-[#D23A22] bg-[#D23A22] text-white
              shadow-[2px_2px_0px_#7A1E10] hover:-translate-y-px hover:shadow-[3px_3px_0px_#7A1E10]
              active:translate-y-px active:shadow-none transition-all duration-120
              focus-visible:outline-2 focus-visible:outline-white whitespace-nowrap"
          >
            <IconGamepad size={14} aria-hidden />
            Chơi ngay
          </Link>
        </div>
      </div>

      {/* DẢI 5 MÀU NGŨ HÀNH — signature Ngũ Cung */}
      <div className="five-element-ribbon" aria-hidden="true" />
    </header>
  );
}
