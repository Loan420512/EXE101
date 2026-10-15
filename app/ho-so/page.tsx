"use client";

/**
 * ==============================================================================
 * FILE: app/ho-so/page.tsx
 * MỤC ĐÍCH: (U2.5 + U7) Trang Hồ sơ — nhìn lại hồ sơ đang chơi trên máy này.
 * - Đổi hồ sơ nhanh bằng một chạm, mở lại màn "Ai đang chơi?" đầy đủ
 * - Số liệu thật của chính máy: nhạc cụ đã yêu thích, nhạc cụ đã sưu được
 * - Lối vào Cài đặt (cỡ chữ, tương phản, chuyển động, chế độ Bé, PIN phụ huynh)
 * - Không bịa thành tích: chưa có thời gian chơi hay bảng xếp hạng
 * ==============================================================================
 */

import Link from "next/link";
import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { SHOW_PROFILES_EVENT } from "@/components/WhoIsPlaying";
import { UNIVERSES, type UniverseId } from "@/config/universes";
import { UniverseGlyph } from "@/components/UniverseGlyph";
import { GUEST_PROFILE, setCurrentProfile, useProfiles } from "@/lib/profiles";
import { useFavorites } from "@/lib/favorites";
import { useCollection } from "@/lib/collection";
import { useSettings } from "@/lib/settings";
import { INSTRUMENTS } from "@/data/instruments";
import {
  IconUser, IconHeart, IconChevronRight, IconSettings, IconChild, IconLock, IconLibrary,
} from "@/components/icons";

export default function HoSoPage() {
  const { profiles, currentId, current, hasChosen } = useProfiles();
  const favorites = useFavorites();
  const collection = useCollection();
  const [settings] = useSettings();
  const active = current ?? GUEST_PROFILE;
  const kit = UNIVERSES[active.avatar as UniverseId] ?? UNIVERSES.united;
  const favCount = favorites.filter((id) => INSTRUMENTS.some((i) => i.id === id)).length;
  const ownedCount = collection.filter((id) => INSTRUMENTS.some((i) => i.id === id)).length;

  return (
    <div className="min-h-screen flex flex-col">
      <LivingBackground forceAtmosphere="tho" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="page-ho-so" className="flex-1 max-w-lg mx-auto px-4 py-10 sm:py-12 w-full">
        {/* HỒ SƠ ĐANG DÙNG */}
        <section className="dongho-box p-6 sm:p-8 bg-[#FAFAF5] text-[#1A1720]">
          <p className="text-micro font-black uppercase tracking-wider text-[#534E5C]">
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
              <h1 className="font-display font-black text-h3 leading-tight">{active.name}</h1>
              <p className="text-label font-bold text-[#534E5C] mt-0.5">
                {active.avatar === "united"
                  ? "Hồ sơ khách — dữ liệu vẫn lưu trên máy này"
                  : `Hành ${kit.label} • ${kit.description}`}
              </p>
            </div>
          </div>

          {/* SỐ LIỆU THẬT CỦA MÁY */}
          <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-[4px] border-2 border-[#1A1720] bg-[#E8EAE0] p-3">
              <dt className="text-micro font-black uppercase tracking-wider text-[#534E5C] flex items-center gap-1.5">
                <IconHeart size={12} aria-hidden /> Yêu thích
              </dt>
              <dd className="font-display font-black text-h3 tabular-nums">{favCount}</dd>
            </div>
            <div className="rounded-[4px] border-2 border-[#1A1720] bg-[#E8EAE0] p-3">
              <dt className="text-micro font-black uppercase tracking-wider text-[#534E5C]">
                Đã sưu được
              </dt>
              <dd className="font-display font-black text-h3 tabular-nums">
                {ownedCount}<span className="text-label font-black text-[#534E5C]">/{INSTRUMENTS.length}</span>
              </dd>
            </div>
            <div className="rounded-[4px] border-2 border-[#1A1720] bg-[#E8EAE0] p-3">
              <dt className="text-micro font-black uppercase tracking-wider text-[#534E5C]">
                Hồ sơ trên máy
              </dt>
              <dd className="font-display font-black text-h3 tabular-nums">{profiles.length}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => window.dispatchEvent(new Event(SHOW_PROFILES_EVENT))}
              className="tap w-full flex items-center justify-center gap-1.5 rounded-[4px] border-[3px] border-[#1A1720]
                bg-[#F2B632] px-4 text-body-sm font-black text-[#1A1720] shadow-[4px_4px_0px_#1A1720]
                transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D23A22]"
            >
              Đổi hồ sơ — Ai đang chơi? <IconChevronRight size={14} aria-hidden />
            </button>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/cai-dat"
                className="tap flex-1 inline-flex items-center justify-center gap-1.5 rounded-[4px]
                  border-[3px] border-[#1A1720] bg-white px-4 text-body-sm font-black text-[#1A1720]
                  shadow-[3px_3px_0px_#1A1720] transition-transform
                  active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D23A22]"
              >
                <IconSettings size={16} aria-hidden /> Cài đặt
              </Link>
              <Link
                href="/thu-vien"
                className="tap flex-1 inline-flex items-center justify-center gap-1.5 rounded-[4px]
                  border-[3px] border-[#1A1720] bg-white px-4 text-body-sm font-black text-[#1A1720]
                  shadow-[3px_3px_0px_#1A1720] transition-transform
                  active:translate-x-[1px] active:translate-y-[1px] active:shadow-none
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D23A22]"
              >
                <IconLibrary size={16} aria-hidden /> Thư viện
              </Link>
            </div>
          </div>

          {/* TRẠNG THÁI ĐANG BẬT */}
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Cài đặt đang bật">
            {settings.kidMode && (
              <li>
                <span className="inline-flex items-center gap-1.5 text-micro font-black px-2.5 py-1 rounded-[3px] bg-[#3F7D3B] text-white">
                  <IconChild size={12} aria-hidden /> Chế độ Bé đang bật
                </span>
              </li>
            )}
            {settings.parentPin && (
              <li>
                <span className="inline-flex items-center gap-1.5 text-micro font-black px-2.5 py-1 rounded-[3px] bg-[#1A1720] text-[#FAFAF5]">
                  <IconLock size={12} aria-hidden /> Cài đặt có khoá PIN
                </span>
              </li>
            )}
            {settings.fontSize !== "default" && (
              <li>
                <span className="inline-flex items-center gap-1.5 text-micro font-black px-2.5 py-1 rounded-[3px] border-2 border-[#1A1720] text-[#1A1720]">
                  Chữ {settings.fontSize === "large" ? "lớn" : "rất lớn"}
                </span>
              </li>
            )}
            {(settings.motion !== "full" || settings.contrast !== "default") && (
              <li>
                <span className="inline-flex items-center gap-1.5 text-micro font-black px-2.5 py-1 rounded-[3px] border-2 border-[#1A1720] text-[#1A1720]">
                  {settings.contrast === "high" ? "Tương phản cao" : "Chuyển động giảm"}
                </span>
              </li>
            )}
            {!settings.kidMode && !settings.parentPin && settings.fontSize === "default"
              && settings.motion === "full" && settings.contrast === "default" && (
              <li>
                <span className="text-micro font-bold text-[#534E5C] px-1">
                  Đang để cài đặt mặc định của máy
                </span>
              </li>
            )}
          </ul>
        </section>

        {/* DANH SÁCH HỒ SƠ TRÊN MÁY */}
        <section className="mt-8" aria-label="Hồ sơ trên máy này">
          <h2 className="font-display font-black text-body-sm uppercase tracking-wider text-white/70 mb-3">
            Hồ sơ trên máy này ({profiles.length}/5)
          </h2>
          {profiles.length === 0 ? (
            <p className="rounded-[4px] border-2 border-dashed border-white/20 p-4 text-label text-white/55">
              Chưa tạo hồ sơ riêng — mọi người đang dùng chung Hồ sơ khách. Bấm “Đổi hồ sơ — Ai
              đang chơi?” ở trên để đặt tên cho từng người.
            </p>
          ) : (
            <ul className="space-y-2">
              {profiles.map((p) => {
                const pkit = UNIVERSES[p.avatar as UniverseId] ?? UNIVERSES.united;
                const isCurrent = p.id === currentId;
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => setCurrentProfile(p.id)}
                      aria-pressed={isCurrent}
                      className={`tap w-full flex items-center gap-3 rounded-[4px] border-[3px] px-3 text-left
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
                        <span className="block text-body-sm font-black truncate">{p.name}</span>
                        <span className="block text-micro text-white/50">
                          {isCurrent ? "Đang dùng" : `Hành ${pkit.label}`}
                        </span>
                      </span>
                      <IconChevronRight size={14} className="shrink-0 opacity-50" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="mt-8 text-label text-white/45 leading-relaxed" style={{ lineHeight: "var(--lh-body)" }}>
          Chế độ Bé, cỡ chữ, tương phản và mã PIN phụ huynh đang bật ở <Link href="/cai-dat" className="text-[#F2B632] font-bold underline underline-offset-2">Cài đặt</Link>.
          Trang “Ngũ Cung của bạn” kể lại chuyện của máy bạn ở <Link href="/tong-ket" className="text-[#F2B632] font-bold underline underline-offset-2">đây</Link>.
          Mọi dữ liệu chỉ nằm trên máy bạn — Ngũ Cung không gửi đi đâu và không có quảng cáo hay theo dõi.
        </p>
      </main>

      <TeamFaqFooter />
    </div>
  );
}
