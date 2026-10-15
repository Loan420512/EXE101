"use client";

/**
 * FILE: app/thu-vien/page.tsx — U4 Thư viện
 * Ba ngăn: "Danh sách của tôi" (yêu thích), "Bộ sưu tập x/15" (lá đã sưu được),
 * "Playlist mẫu". Tất cả đọc dữ liệu thật trên máy người dùng, không gọi server.
 * MiniPlayer và màn "Đang phát" do PlayerLayer trong RootLayout lo — trang này
 * không tự dựng lại kẻo hai player chồng nhau.
 */

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import InstrumentArt from "@/components/InstrumentArt";
import { INSTRUMENTS, ELEMENT_CONFIG, ELEMENT_ORDER, type Instrument } from "@/data/instruments";
import { useFavorites, toggleFavorite } from "@/lib/favorites";
import { useCollection } from "@/lib/collection";
import { player, SAMPLE_PLAYLISTS } from "@/lib/player";
import {
  IconHeart, IconHeartFilled, IconPlay, IconArrowRight, IconWarning,
} from "@/components/icons";

const TOTAL = INSTRUMENTS.length;

type TabId = "mine" | "collection" | "playlists";

const TABS: { id: TabId; label: string }[] = [
  { id: "mine", label: "Danh sách của tôi" },
  { id: "collection", label: "Bộ sưu tập" },
  { id: "playlists", label: "Playlist mẫu" },
];

/** useSyncExternalStore trả mảng mới mỗi lần đọc → page này sẽ lặp vô hạn nếu
 *  không khoá tham chiếu. Favorites đã cache trong lib/favorites; collection cũng vậy. */
export default function ThuVienPage() {
  const [tab, setTab] = useState<TabId>("mine");
  const favorites = useFavorites();
  const collection = useCollection();

  const favInstruments = INSTRUMENTS.filter((i) => favorites.includes(i.id));
  const collected = INSTRUMENTS.filter((i) => collection.includes(i.id));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere="mix" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 pb-32">
        <div className="flex flex-wrap items-baseline gap-3 mt-8 mb-6">
          <h1 className="font-display font-black text-h1 text-white">Thư viện</h1>
          <span className="text-body-sm text-white/45">Tất cả chỉ lưu trên máy này</span>
        </div>

        {/* TABS */}
        <div className="flex gap-1 mb-8 bg-white/5 p-1 rounded-[4px] max-w-xl" role="tablist">
          {TABS.map((t) => {
            const count = t.id === "mine" ? favInstruments.length
              : t.id === "collection" ? collected.length
              : SAMPLE_PLAYLISTS.length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 px-3 rounded-[3px] text-label font-bold transition-all
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${tab === t.id
                    ? "bg-[#F2B632] text-[#16141A] shadow-[1px_1px_0px_#16141A]"
                    : "text-white/60 hover:text-white"}`}
              >
                {t.label} <span className="tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {tab === "mine" && <MineTab instruments={favInstruments} favorites={favorites} />}
        {tab === "collection" && <CollectionTab collectedIds={collection} />}
        {tab === "playlists" && <PlaylistTab />}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NGĂN 1 — DANH SÁCH CỦA TÔI (yêu thích)
   ══════════════════════════════════════════════════════════════ */
function MineTab({ instruments, favorites }: { instruments: Instrument[]; favorites: string[] }) {
  if (instruments.length === 0) {
    return (
      <EmptyState
        icon={<IconHeart size={40} className="text-white/25" aria-hidden />}
        title="Chưa có nhạc cụ nào trong danh sách"
        desc="Mở bất kỳ nhạc cụ nào rồi bấm nút yêu thích; chúng sẽ hiện ở đây."
        action={<Link href="/duyet" className="cta-ghost">Duyệt nhạc cụ <IconArrowRight size={16} aria-hidden /></Link>}
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 list-none m-0 p-0">
      {instruments.map((inst) => (
        <li key={inst.id}>
          <InstrumentCard inst={inst} isFav={favorites.includes(inst.id)} />
        </li>
      ))}
    </ul>
  );
}

function InstrumentCard({ inst, isFav }: { inst: Instrument; isFav: boolean }) {
  const cfg = ELEMENT_CONFIG[inst.element];

  return (
    <div className="group relative rounded-[4px] border-2 border-[#16141A] overflow-hidden
      shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#16141A]
      transition-all duration-150">
      <button
        onClick={() => player.playTrack(inst)}
        className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[#D23A22]"
        aria-label={`Nghe ${inst.name} — âm mô phỏng`}
      >
        <InstrumentArt instrumentId={inst.id} element={inst.element} size={120} className="w-full" />
        <div className="p-2" style={{ backgroundColor: cfg.color + "15" }}>
          <p className="text-label font-bold text-white truncate">{inst.name}</p>
          <p className="text-micro font-medium" style={{ color: cfg.color }}>
            Họ {inst.elementName} · {inst.tone}
          </p>
        </div>
      </button>
      <button
        onClick={() => toggleFavorite(inst.id)}
        aria-pressed={isFav}
        className="tap absolute top-1.5 right-1.5 flex items-center justify-center rounded-full
          bg-black/55 text-white focus-visible:outline-2 focus-visible:outline-[#D23A22]
          transition-opacity"
        aria-label={isFav ? `Bỏ yêu thích ${inst.name}` : `Thêm ${inst.name} vào yêu thích`}
      >
        {isFav
          ? <IconHeartFilled size={16} className="text-[#E04428]" aria-hidden />
          : <IconHeart size={16} aria-hidden />}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NGĂN 2 — BỘ SƯU TẬP x/15 (lá đã sưu được khi mở gói bài)
   ══════════════════════════════════════════════════════════════ */
function CollectionTab({ collectedIds }: { collectedIds: string[] }) {
  const done = collectedIds.length;

  return (
    <div className="space-y-8">
      <section className="surface-night p-5">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2 className="font-display font-black text-h4 text-white">Tiến độ thu thập</h2>
          <p className="font-display font-black text-h3 tabular-nums" style={{ color: "#F2B632" }}>
            {done}
            <span className="text-body text-white/40">/{TOTAL}</span>
          </p>
        </div>
        <div
          className="h-3 rounded-full overflow-hidden bg-white/12"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-label="Số nhạc cụ đã sưu được"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(done / TOTAL) * 100}%`, backgroundColor: "#F2B632" }}
          />
        </div>
        <p className="text-label text-white/55 mt-3">
          {done === 0
            ? "Chưa sưu được lá nào. Mở gói bài ở trang Bộ Bài để bắt đầu."
            : done === TOTAL
            ? "Bạn đã sưu đủ 15 nhạc cụ ngũ hành."
            : `Còn ${TOTAL - done} nhạc cụ nữa để đủ bộ.`}
        </p>
        {done === 0 && (
          <Link href="/bo-bai" className="cta-ghost mt-4 inline-flex">
            Mở gói bài <IconArrowRight size={16} aria-hidden />
          </Link>
        )}
      </section>

      {ELEMENT_ORDER.map((el) => {
        const family = INSTRUMENTS.filter((i) => i.element === el);
        const cfg = ELEMENT_CONFIG[el];
        const got = family.filter((i) => collectedIds.includes(i.id)).length;
        return (
          <section key={el} aria-labelledby={`tl-${el}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} aria-hidden />
              <h3 id={`tl-${el}`} className="font-display font-black text-body text-white">
                Họ {cfg.name} · Âm {cfg.tone}
              </h3>
              <span className="text-label font-bold tabular-nums ml-auto" style={{ color: cfg.color }}>
                {got}/{family.length}
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-3 list-none m-0 p-0">
              {family.map((inst) => {
                const has = collectedIds.includes(inst.id);
                return (
                  <li key={inst.id}>
                    <Link
                      href={`/nhac-cu/${inst.id}`}
                      className={`block relative rounded-[4px] border-2 border-[#16141A] overflow-hidden
                        transition-opacity focus-visible:outline-2 focus-visible:outline-[#D23A22]
                        ${has ? "" : "opacity-45"}`}
                      style={{ boxShadow: has ? `3px 3px 0px ${cfg.color}60` : "none" }}
                      aria-label={`${inst.name} — ${has ? "đã sưu được" : "chưa sưu được"}`}
                    >
                      <InstrumentArt instrumentId={inst.id} element={inst.element} size={80} className="w-full" />
                      <div className="p-2 text-center" style={{ backgroundColor: cfg.color + "15" }}>
                        <p className="text-label font-bold text-white truncate">{inst.name}</p>
                        <p className="text-micro font-bold" style={{ color: has ? cfg.color : "rgba(255,255,255,.35)" }}>
                          {has ? "Đã có" : "Chưa sưu"}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NGĂN 3 — PLAYLIST MẪU
   ══════════════════════════════════════════════════════════════ */
function PlaylistTab() {
  const empty = SAMPLE_PLAYLISTS.filter((p) => p.tracks.length === 0);

  return (
    <div className="space-y-4">
      <p className="text-body-sm text-white/50 flex items-center gap-2">
        <IconWarning size={16} aria-hidden />
        Playlist mẫu dựng sẵn · Âm mô phỏng, chưa phải thu âm thật
      </p>

      {SAMPLE_PLAYLISTS.map((pl) => {
        const lead = pl.tracks[0];
        const cfg = lead ? ELEMENT_CONFIG[lead.instrument.element] : ELEMENT_CONFIG.tho;
        return (
          <article
            key={pl.id}
            className="surface-night p-4 flex flex-col gap-3"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-black text-body text-white">{pl.name}</h3>
                <p className="text-label text-white/55 mt-1">{pl.description}</p>
                <p className="text-micro text-white/40 mt-1 tabular-nums">
                  {pl.tracks.length} nhạc cụ · {pl.tracks.map((t) => t.instrument.tone).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => {
                  pl.tracks.forEach((t) => player.addToQueue(t.instrument));
                  if (lead) player.playTrack(lead.instrument);
                }}
                disabled={pl.tracks.length === 0}
                className="tap shrink-0 flex items-center justify-center rounded-full
                  border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A]
                  hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all
                  disabled:opacity-30 disabled:hover:translate-y-0
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                style={{ backgroundColor: cfg.color, color: cfg.textColor }}
                aria-label={`Phát playlist ${pl.name}`}
              >
                <IconPlay size={18} aria-hidden />
              </button>
            </div>

            <ul className="flex gap-2 overflow-x-auto scrollbar-hide m-0 p-0 list-none">
              {pl.tracks.map((t) => {
                const tc = ELEMENT_CONFIG[t.instrument.element];
                return (
                  <li key={t.instrument.id} className="shrink-0 flex flex-col items-center gap-1">
                    <InstrumentArt
                      instrumentId={t.instrument.id}
                      element={t.instrument.element}
                      size={48}
                      className="rounded-[3px] border border-[#16141A]"
                    />
                    <span className="text-micro font-bold" style={{ color: tc.color }}>
                      {t.instrument.tone}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        );
      })}

      {empty.length > 0 && (
        <p className="text-label text-white/40">
          {empty.length} playlist đang chờ nối âm thanh thật.
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DÙNG CHUNG
   ══════════════════════════════════════════════════════════════ */
function EmptyState({ icon, title, desc, action }: {
  icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      {icon}
      <h2 className="font-display font-black text-h4 text-white">{title}</h2>
      <p className="text-body text-white/50 max-w-sm">{desc}</p>
      {action}
    </div>
  );
}
