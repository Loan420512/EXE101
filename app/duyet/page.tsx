"use client";

/**
 * FILE: app/duyet/page.tsx — Trang Duyệt (U3.3)
 * ô duyệt màu lớn theo Hành + bộ lọc chip (Âm / Nốt), tìm nhanh không dấu.
 * - Bắt đầu từ ô hành → danh sách nhạc cụ → chi tiết (cửa U3: <3 thao tác)
 * - Data chỉ từ data/instruments.ts (luật 5: không bịa dữ liệu)
 */

import React, { useMemo, useState, ViewTransition } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import CardFace from "@/components/CardFace";
import { useUniverse } from "@/lib/useUniverse";
import { normalizeVi } from "@/lib/search";
import {
  INSTRUMENTS, ELEMENT_CONFIG, ELEMENT_ORDER,
  type ElementType, type Instrument,
} from "@/data/instruments";
import { IconClose, IconSearch } from "@/components/icons";

const TONES = ELEMENT_ORDER.map((el) => ELEMENT_CONFIG[el].tone);

export default function DuyetPage() {
  const { universeId } = useUniverse();
  const [element, setElement] = useState<ElementType | "all">("all");
  const [tone, setTone] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  // vũ trụ hành đang bật → gợi ý lọc tương ứng (chỉ khi chưa tự chọn)
  const suggested: ElementType | "all" =
    universeId !== "united" && ELEMENT_ORDER.includes(universeId as ElementType)
      ? (universeId as ElementType)
      : "all";

  const effectiveElement = element === "all" && suggested !== "all" ? suggested : element;

  const results = useMemo(() => {
    const nq = normalizeVi(q);
    return INSTRUMENTS.filter((i: Instrument) => {
      if (effectiveElement !== "all" && i.element !== effectiveElement) return false;
      if (tone !== "all" && i.tone !== tone) return false;
      if (nq) {
        const hay = normalizeVi(
          `${i.name} ${i.elementName} ${i.tone} ${i.noteName} ${i.summaryVerbatim}`
        );
        if (!nq.split(" ").every((w) => hay.includes(w))) return false;
      }
      return true;
    });
  }, [effectiveElement, tone, q]);

  const hasFilter = effectiveElement !== "all" || tone !== "all" || q !== "";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere={effectiveElement === "all" ? undefined : effectiveElement} />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 pb-16">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-6">
          Duyệt bộ sưu tập
        </h1>
        <p className="text-white/60 text-sm mt-2 mb-8 max-w-lg">
          15 nhạc cụ truyền thống, chia theo 5 hành và 5 âm. Chọn một ô màu để bắt đầu.
        </p>

        {/* Ô duyệt màu lớn */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          role="group"
          aria-label="Lọc theo hành"
        >
          <button
            type="button"
            onClick={() => setElement("all")}
            aria-pressed={effectiveElement === "all"}
            className={`relative flex flex-col justify-end rounded-[4px] overflow-hidden border-[3px] border-[#16141A]
              min-h-[110px] p-3 text-left transition-all duration-150 hover:-translate-y-1
              focus-visible:outline-2 focus-visible:outline-white
              ${effectiveElement === "all" ? "bg-[#F2B632] text-[#16141A] shadow-[4px_4px_0px_#16141A]" : "bg-white/8 text-white"}`}
          >
            <span className="font-display font-black text-lg leading-tight">Tất cả</span>
            <span className="text-[12px] font-semibold opacity-75">{INSTRUMENTS.length} nhạc cụ</span>
          </button>

          {ELEMENT_ORDER.map((el) => {
            const cfg = ELEMENT_CONFIG[el];
            const count = INSTRUMENTS.filter((i) => i.element === el).length;
            const active = effectiveElement === el;
            return (
              <button
                key={el}
                type="button"
                onClick={() => setElement(active ? "all" : el)}
                aria-pressed={active}
                className="group relative flex flex-col justify-end rounded-[4px] overflow-hidden border-[3px] border-[#16141A]
                  min-h-[110px] transition-all duration-150 hover:-translate-y-1
                  focus-visible:outline-2 focus-visible:outline-white"
                style={{
                  backgroundColor: cfg.color,
                  boxShadow: active ? "4px 4px 0px #FFFFFF66, inset 0 0 0 3px #16141A" : "4px 4px 0px #16141A",
                }}
              >
                <span
                  className="absolute top-2 right-2 opacity-25 font-display font-black text-4xl leading-none select-none"
                  style={{ color: cfg.textColor }}
                  aria-hidden
                >
                  {cfg.tone}
                </span>
                <span className="relative z-10 p-3 block">
                  <span className="font-display font-black text-lg leading-tight block" style={{ color: cfg.textColor }}>
                    Hành {cfg.name}
                  </span>
                  <span className="text-[12px] font-semibold opacity-80 block" style={{ color: cfg.textColor }}>
                    Âm {cfg.tone} · {cfg.note}
                  </span>
                  <span className="text-[11px] font-bold opacity-60 block mt-0.5" style={{ color: cfg.textColor }}>
                    {count} nhạc cụ
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Bộ lọc chip + tìm nhanh */}
        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Lọc theo âm">
          <span className="text-xs font-black uppercase tracking-wide text-white/50 mr-1">Âm</span>
          <button
            type="button"
            onClick={() => setTone("all")}
            aria-pressed={tone === "all"}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold border-2 transition-colors focus-visible:outline-2 focus-visible:outline-white ${
              tone === "all" ? "bg-white text-[#16141A] border-white" : "text-white/70 border-white/20 hover:border-white/50"
            }`}
          >
            Tất cả
          </button>
          {TONES.map((t) => {
            const el = ELEMENT_ORDER.find((e) => ELEMENT_CONFIG[e].tone === t)!;
            const cfg = ELEMENT_CONFIG[el];
            const active = tone === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTone(active ? "all" : t)}
                aria-pressed={active}
                className="px-3 py-1.5 rounded-[4px] text-xs font-bold border-2 transition-all focus-visible:outline-2 focus-visible:outline-white"
                style={{
                  backgroundColor: active ? cfg.color : "transparent",
                  borderColor: active ? cfg.color : "rgba(255,255,255,0.2)",
                  color: active ? cfg.textColor : "rgba(255,255,255,0.7)",
                }}
              >
                {t}
              </button>
            );
          })}

          <label className="relative ml-auto flex items-center">
            <span className="sr-only">Tìm nhanh theo tên</span>
            <IconSearch size={14} className="absolute left-2.5 text-white/40" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="gõ tên… (không dấu được)"
              className="w-44 sm:w-56 rounded-[4px] border-2 border-white/20 bg-[#0E1014] pl-8 pr-7 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-2 focus:outline-[#F2B632]"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Xóa từ khóa" className="absolute right-2 text-white/50 hover:text-white">
                <IconClose size={12} aria-hidden />
              </button>
            )}
          </label>
        </div>

        {/* Số kết quả + xóa lọc */}
        <div className="mt-6 flex items-center gap-3">
          <p className="text-sm text-white/60" aria-live="polite">
            {results.length} kết quả
            {hasFilter && (
              <>
                {effectiveElement !== "all" && <> · Hành {ELEMENT_CONFIG[effectiveElement as ElementType].name}</>}
                {tone !== "all" && <> · Âm {tone}</>}
                {q && <> · “{q}”</>}
              </>
            )}
          </p>
          {hasFilter && (
            <button
              type="button"
              onClick={() => { setElement("all"); setTone("all"); setQ(""); }}
              className="text-xs font-bold text-[#F2B632] hover:underline focus-visible:outline-2 focus-visible:outline-[#F2B632] rounded"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Lưới kết quả */}
        {results.length === 0 ? (
          <div className="mt-10 rounded-[6px] border-[3px] border-[#16141A] bg-[#14161E] p-8 text-center" style={{ boxShadow: "5px 5px 0px #00000055" }}>
            <p className="font-display font-black text-xl text-white">Chưa thấy nhạc cụ nào</p>
            <p className="text-sm text-white/60 mt-2">
              Thử bỏ bớt bộ lọc, hoặc xem <Link href="/bo-bai" className="text-[#F2B632] font-bold hover:underline">toàn bộ bộ bài</Link>.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 list-none p-0">
            {results.map((inst, i) => (
              <li key={inst.id}>
                <Link
                  href={`/nhac-cu/${inst.slug}`}
                  className="block focus-visible:outline-2 focus-visible:outline-[#F2B632] rounded-[4px]"
                  aria-label={`Xem chi tiết ${inst.name}`}
                >
                  <ViewTransition name={`card-${inst.id}`}>
                    <CardFace
                      name={inst.name}
                      element={inst.element}
                      tone={inst.tone}
                      noteName={inst.noteName}
                      instrumentId={inst.id}
                      variant={i % 3}
                      size="md"
                      isInteractive
                    />
                  </ViewTransition>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <TeamFaqFooter />
    </div>
  );
}
