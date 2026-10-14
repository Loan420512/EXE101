"use client";

/**
 * ==============================================================================
 * FILE: app/ho-so/page.tsx
 * MỤC ĐÍCH: (U2.5) Trang Hồ sơ — nhìn lại hồ sơ đang chơi trên máy này.
 * - Đổi hồ sơ nhanh bằng một chạm, mở lại màn "Ai đang chơi?" đầy đủ
 * - Số nhạc cụ đã yêu thích (số liệu thật của chính máy, không phải social proof)
 * - Chế độ Bé + mã PIN phụ huynh thuộc pha U4 nên để trống, không bịa tính năng
 * ==============================================================================
 */

import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { SHOW_PROFILES_EVENT } from "@/components/WhoIsPlaying";
import { UNIVERSES, type UniverseId } from "@/config/universes";
import { UniverseGlyph } from "@/components/UniverseGlyph";
import { GUEST_PROFILE, setCurrentProfile, useProfiles } from "@/lib/profiles";
import { useFavorites } from "@/lib/favorites";
import { INSTRUMENTS } from "@/data/instruments";
import { IconUser, IconHeart, IconChevronRight } from "@/components/icons";

export default function HoSoPage() {
  const { profiles, currentId, current, hasChosen } = useProfiles();
  const favorites = useFavorites();
  const active = current ?? GUEST_PROFILE;
  const kit = UNIVERSES[active.avatar as UniverseId] ?? UNIVERSES.united;
  const favCount = favorites.filter((id) => INSTRUMENTS.some((i) => i.id === id)).length;

  return (
    <div className="min-h-screen flex flex-col">
      <LivingBackground forceAtmosphere="tho" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="page-ho-so" className="flex-1 max-w-lg mx-auto px-4 py-10 sm:py-12 w-full">
        {/* HỒ SƠ ĐANG DÙNG */}
        <section className="dongho-box p-6 sm:p-8 bg-[#FAFAF5] text-[#1A1720]">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#534E5C]">
            {hasChosen ? "Đang chơi" : "Chưa chọn hồ sơ"}
          </p>
          <div className="mt-3 flex items-center gap-4">
            <span
              className="w-16 h-16 shrink-0 rounded-full border-[3px] border-[#1A1720] flex items-center justify-center"
              style={{ backgroundColor: kit.colors.accent + "33", color: kit.colors.accent }}
              aria-hidden
            >
              {active.avatar === "united" ? <IconUser size={26} /> : <UniverseGlyph avatar={active.avatar} size={26} />}
            </span>
            <div className="min-w-0">
              <h1 className="font-display font-black text-2xl leading-tight">{active.name}</h1>
              <p className="text-xs font-bold text-[#534E5C] mt-0.5">
                {active.avatar === "united"
                  ? "Hồ sơ khách — dữ liệu vẫn lưu trên máy này"
                  : `Hành ${kit.label} • ${kit.description}`}
              </p>
            </div>
          </div>

          {/* SỐ LIỆU THẬT CỦA MÁY */}
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[4px] border-2 border-[#1A1720] bg-[#E8EAE0] p-3">
              <dt className="text-[10px] font-black uppercase tracking-wider text-[#534E5C] flex items-center gap-1.5">
                <IconHeart size={12} aria-hidden /> Yêu thích
              </dt>
              <dd className="font-display font-black text-2xl tabular-nums">{favCount}</dd>
            </div>
            <div className="rounded-[4px] border-2 border-[#1A1720] bg-[#E8EAE0] p-3">
              <dt className="text-[10px] font-black uppercase tracking-wider text-[#534E5C]">
                Nhạc cụ đã có
              </dt>
              <dd className="font-display font-black text-2xl tabular-nums">{INSTRUMENTS.length}</dd>
            </div>
          </dl>

          <button
            onClick={() => window.dispatchEvent(new Event(SHOW_PROFILES_EVENT))}
            className="mt-6 w-full flex items-center justify-center gap-1.5 rounded-[4px] border-[3px] border-[#1A1720]
              bg-[#F2B632] px-4 py-2.5 text-[13px] font-black text-[#1A1720] shadow-[4px_4px_0px_#1A1720]
              transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D23A22]"
          >
            Đổi hồ sơ — Ai đang chơi? <IconChevronRight size={14} aria-hidden />
          </button>
        </section>

        {/* DANH SÁCH HỒ SƠ TRÊN MÁY */}
        {profiles.length > 0 && (
          <section className="mt-8" aria-label="Hồ sơ trên máy này">
            <h2 className="font-display font-black text-sm uppercase tracking-wider text-white/70 mb-3">
              Hồ sơ trên máy này ({profiles.length}/5)
            </h2>
            <ul className="space-y-2">
              {profiles.map((p) => {
                const pkit = UNIVERSES[p.avatar as UniverseId] ?? UNIVERSES.united;
                const isCurrent = p.id === currentId;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => setCurrentProfile(p.id)}
                      aria-pressed={isCurrent}
                      className={`w-full flex items-center gap-3 rounded-[4px] border-[3px] px-3 py-2.5 text-left
                        transition-colors focus-visible:outline-2 focus-visible:outline-[#D23A22]
                        ${isCurrent
                          ? "border-[#EAE8D8] bg-white/10 text-white"
                          : "border-white/20 text-white/75 hover:border-white/50 hover:text-white"
                        }`}
                    >
                      <span
                        className="w-9 h-9 shrink-0 rounded-full border-2 flex items-center justify-center"
                        style={{ backgroundColor: pkit.colors.accent + "33", borderColor: pkit.colors.accent, color: pkit.colors.accent }}
                        aria-hidden
                      >
                        {p.avatar === "united" ? <IconUser size={16} /> : <UniverseGlyph avatar={p.avatar} size={16} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black truncate">{p.name}</span>
                        <span className="block text-[11px] text-white/50">
                          {isCurrent ? "Đang dùng" : `Hành ${pkit.label}`}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <p className="mt-8 text-xs text-white/45 leading-relaxed" style={{ lineHeight: "var(--lh-body)" }}>
          Chế độ Bé, hồ sơ gia đình và mã PIN phụ huynh mở ở pha U4. Mọi dữ liệu ở đây chỉ nằm
          trên máy bạn — Ngũ Cung không gửi đi đâu và không có quảng cáo hay theo dõi.
        </p>
      </main>

      <TeamFaqFooter />
    </div>
  );
}
