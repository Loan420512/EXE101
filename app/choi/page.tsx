"use client";

/**
 * FILE: app/choi/page.tsx — U6 Trung tâm Chơi
 * Màn hub với thẻ lớn cho: Học chơi, Chơi với bot, Chuyền máy,
 * Chơi trực tuyến (Sắp có), Thử thách hôm nay.
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import {
  IconGamepad, IconUsers, IconQuestion, IconStar, IconArrowRight,
  IconLink, IconShield,
} from "@/components/icons";
import { ELEMENT_CONFIG, ELEMENT_ORDER, type ElementType } from "@/data/instruments";

/**
 * Hạt giống thử thách hôm nay — tính từ ngày thật của máy người chơi.
 * Next chặn đọc đồng hồ lúc prerender ở Client Component, nên chỉ gọi sau khi
 * máy khách chạy (xem useEffect trong ChoiPage).
 */
function todaySeedFrom(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

/** Ô chờ khi chưa kịp tính hạt giống — không hiện số giả. */
function ChallengeSkeleton() {
  return (
    <div
      className="flex items-center gap-5 p-5 rounded-[4px] border-2 border-white/10 bg-white/5 animate-pulse"
      aria-label="Đang tải thử thách hôm nay"
      role="status"
    >
      <div className="w-14 h-14 rounded-full bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-40 rounded bg-white/10" />
        <div className="h-3 w-64 max-w-full rounded bg-white/8" />
      </div>
    </div>
  );
}

/** Đọc 4 số cuối hạt giống thành một hành — chỉ để đổi màu thẻ, không phải xếp hạng. */
function seedElement(seed: string): ElementType {
  const n = parseInt(seed.slice(-4), 10) || 0;
  return ELEMENT_ORDER[n % 5]!;
}

function ChallengeCard({ seed, element }: { seed: string; element: ElementType }) {
  const day = Number(seed.slice(-2));
  const cfg = ELEMENT_CONFIG[element];
  return (
    <Link
      href={`/choi-thu-ngay?mode=bot&seed=${seed}`}
      className="flex items-center gap-5 p-5 rounded-[4px] border-2 border-white/15
        bg-white/5 hover:bg-white/10 transition-all group
        focus-visible:outline-2 focus-visible:outline-[#D23A22]"
    >
      <div
        className="w-14 h-14 rounded-full border-[3px] border-[#16141A] flex flex-col items-center
          justify-center shrink-0 font-display font-black text-lg text-[#16141A] leading-none"
        style={{ backgroundColor: cfg.color, boxShadow: "3px 3px 0px #16141A" }}
      >
        {day}
        <span className="text-micro font-bold opacity-70">ngày</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-black text-base text-white">Ván đặc biệt hôm nay</p>
        <p className="text-body-sm text-white/55 mt-0.5">
          Xào bài theo hạt giống #{seed.slice(-4)} · Chủ đề hành {cfg.name} — {cfg.note}
        </p>
      </div>
      <IconArrowRight size={20} className="text-white/40 group-hover:text-white transition-colors shrink-0" aria-hidden />
    </Link>
  );
}

/** Bốn thẻ chế độ — màu lấy từ token hành, không viết hex cứng. */
const GAME_MODES: {
  id: string; title: string; sub: string; icon: React.ReactNode;
  element: ElementType; href: string; badge: string | null;
}[] = [
  {
    id: "hoc-choi",
    title: "Học chơi",
    sub: "Hướng dẫn tương tác từng bước · Xong trong 2 phút",
    icon: <IconQuestion size={32} aria-hidden />,
    element: "tho",
    href: "/luat-choi",
    badge: null,
  },
  {
    id: "bot",
    title: "Chơi với Bot",
    sub: "Đấu trí cùng máy · 1–4 đối thủ · Không cần người chơi khác",
    icon: <IconGamepad size={32} aria-hidden />,
    element: "hoa",
    href: "/choi-thu-ngay?mode=bot",
    badge: null,
  },
  {
    id: "pass",
    title: "Chuyền máy",
    sub: "2–5 người dùng chung một thiết bị · Gia đình, lớp học",
    icon: <IconUsers size={32} aria-hidden />,
    element: "moc",
    href: "/choi-thu-ngay?mode=pass",
    badge: null,
  },
  {
    id: "online",
    title: "Chơi trực tuyến",
    sub: "Phòng chơi mã 4 ký tự · 2–5 người · Cần bật máy chủ realtime",
    icon: <IconLink size={32} aria-hidden />,
    element: "thuy",
    href: "/choi-thu-ngay?mode=online",
    badge: "Sắp có",
  },
];

export default function ChoiPage() {
  const [seed, setSeed] = useState<string | null>(null);

  // Đọc ngày của máy người chơi sau khi trang hiện ra (prerender không được đọc đồng hồ)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSeed(todaySeedFrom(new Date())));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere="mix" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 pb-20">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-8 mb-2">
          Trung tâm Chơi
        </h1>
        <p className="text-white/50 text-sm mb-10">Chọn chế độ để bắt đầu ván đấu</p>

        {/* Thẻ chế độ chơi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {GAME_MODES.map((mode) => {
            const cfg = ELEMENT_CONFIG[mode.element];
            return (
            <Link
              key={mode.id}
              href={mode.href}
              className="group relative flex flex-col gap-3 p-6 rounded-[4px] border-[3px] border-[#16141A]
                overflow-hidden transition-all duration-150
                shadow-[4px_4px_0px_#16141A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#16141A]
                active:translate-y-0.5 active:shadow-[2px_2px_0px_#16141A]
                focus-visible:outline-2 focus-visible:outline-white"
              style={{ backgroundColor: cfg.color }}
              aria-label={mode.title}
            >
              {mode.badge && (
                <span
                  className="absolute top-3 right-3 text-micro font-black px-2 py-0.5 rounded
                    bg-[#16141A] text-white"
                >
                  {mode.badge}
                </span>
              )}

              <div style={{ color: cfg.textColor }}>{mode.icon}</div>

              <div>
                <h2
                  className="font-display font-black text-h4 leading-tight"
                  style={{ color: cfg.textColor }}
                >
                  {mode.title}
                </h2>
                <p
                  className="text-body-sm mt-1"
                  style={{ color: cfg.textColor, opacity: 0.8 }}
                >
                  {mode.sub}
                </p>
              </div>

              <div
                className="flex items-center gap-1 text-body-sm font-bold mt-auto"
                style={{ color: cfg.textColor }}
              >
                Bắt đầu <IconArrowRight size={16} aria-hidden />
              </div>

              {/* Họa tiết góc */}
              <div
                className="absolute -bottom-4 -right-4 text-[80px] font-display font-black
                  leading-none pointer-events-none select-none"
                style={{ color: cfg.textColor, opacity: 0.06 }}
                aria-hidden
              >
                {mode.title[0]}
              </div>
            </Link>
            );
          })}
        </div>

        {/* Thử thách hôm nay */}
        <section className="mb-10">
          <h2 className="font-display font-black text-xl text-white mb-4 flex items-center gap-2">
            <IconStar size={20} aria-hidden />
            Thử thách hôm nay
          </h2>
          {seed
            ? <ChallengeCard seed={seed} element={seedElement(seed)} />
            : <ChallengeSkeleton />
          }
        </section>

        {/* Hướng dẫn nhanh */}
        <section className="bg-white/4 border border-white/10 rounded-[4px] p-5">
          <h2 className="font-display font-black text-base text-white mb-3 flex items-center gap-2">
            <IconShield size={16} aria-hidden /> Luật chơi nhanh
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { n: "2–5", label: "Người chơi" },
              { n: "45", label: "Lá bài" },
              { n: "15đ", label: "Mốc thắng" },
              { n: "~15'", label: "Thời lượng" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="font-display font-black text-h3 text-white">{n}</p>
                <p className="text-label text-white/40">{label}</p>
              </div>
            ))}
          </div>
          <Link
            href="/luat-choi"
            className="mt-4 text-label font-bold text-[#F2B632] hover:underline flex items-center gap-1"
          >
            Xem luật đầy đủ <IconArrowRight size={12} aria-hidden />
          </Link>
        </section>
      </main>
    </div>
  );
}
