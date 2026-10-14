/**
 * ==============================================================================
 * FILE: app/nhac-cu/[slug]/page.tsx
 * MỤC ĐÍCH: Trang bách khoa chuyên sâu cho từng nhạc cụ dân tộc trong 15 nhạc cụ.
 * - (U3.1) Hero tràn lề nhuộm màu hành + 5 tab nội dung (Giới thiệu/Cấu tạo/
 *   Cách chơi/Âm sắc/Ngũ hành)
 * - Nút nghe nốt WebAudio kèm WaveformVisualizer thời gian thực
 * - Danh sách nhạc cụ liên quan (cùng họ, sinh, khắc) + Prev/Next (U3.4)
 * - Chia sẻ mạng xã hội / sao chép link
 * ==============================================================================
 */

import React from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  IconBook, IconBlocks, IconHand, IconMusicNote, IconTaiji,
} from "@/components/icons";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import ColorRibbon from "@/components/ColorRibbon";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import CardFace from "@/components/CardFace";
import {
  INSTRUMENTS,
  getInstrument,
  relatedInstruments,
  ELEMENT_CONFIG,
} from "@/data/instruments";
import InstrumentClientActions from "./InstrumentClientActions";
import InstrumentTabs, { type InstrumentTab } from "./InstrumentTabs";
import PrevNextNav from "./PrevNextNav";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return INSTRUMENTS.map((inst) => ({ slug: inst.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const inst = getInstrument(slug);
  if (!inst) return { title: "Nhạc cụ không tìm thấy | Ngũ Cung" };

  return {
    title: `${inst.name} (${inst.tone}) — Ngũ Cung Việt Nam`,
    description: `${inst.name} thuộc hành ${inst.elementName} (âm ${inst.tone}, nốt ${inst.noteName}). ${inst.description.slice(0, 150)}...`,
    openGraph: {
      title: `${inst.name} — Nhạc Cụ Hành ${inst.elementName} | Ngũ Cung`,
      description: inst.summaryVerbatim,
      type: "article",
    },
  };
}

export default async function InstrumentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const inst = getInstrument(slug);

  if (!inst) {
    notFound();
  }

  const related = relatedInstruments(slug);
  const cfg = ELEMENT_CONFIG[inst.element];
  const idx = INSTRUMENTS.findIndex((i) => i.slug === inst.slug);
  const prev = idx > 0 ? INSTRUMENTS[idx - 1] : null;
  const next = idx >= 0 && idx < INSTRUMENTS.length - 1 ? INSTRUMENTS[idx + 1] : null;

  const tabs: InstrumentTab[] = [
    {
      id: "gioi-thieu",
      label: "Giới thiệu",
      heading: "Giới thiệu lịch sử",
      body: inst.description,
      icon: <IconBook size={16} aria-hidden />,
    },
    {
      id: "cau-tao",
      label: "Cấu tạo",
      heading: "Cấu tạo nhạc cụ",
      body: inst.structure,
      icon: <IconBlocks size={16} aria-hidden />,
    },
    {
      id: "cach-choi",
      label: "Cách chơi",
      heading: "Kỹ thuật diễn tấu",
      body: inst.playMethod,
      icon: <IconHand size={16} aria-hidden />,
    },
    {
      id: "am-sac",
      label: "Âm sắc",
      heading: "Âm sắc mô tả",
      body: inst.timbre,
      note: `Nốt chuẩn ${inst.noteName} (${inst.noteFrequency}) · tiếng nghe là âm mô phỏng`,
      icon: <IconMusicNote size={16} aria-hidden />,
    },
    {
      id: "ngu-hanh",
      label: "Ngũ hành",
      heading: `Vì sao thuộc hành ${inst.elementName}?`,
      body: inst.elementReason,
      note: `Hành ${cfg.name} • Âm ${inst.tone} — ${cfg.description}`,
      icon: <IconTaiji size={16} aria-hidden />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere={inst.element} activeScene={inst.element} />

      <Header />

      <main className={`flex-1 w-full realm-${inst.element}`}>
        {/* ============================ HERO TRÀN LỀ ============================ */}
        <section
          className="border-b-[3px] border-[#1A1720] dark:border-[#EAE8D8]"
          style={{
            backgroundImage: `linear-gradient(180deg, ${cfg.color}2E 0%, ${cfg.color}14 45%, rgba(0,0,0,0) 100%)`,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pb-12">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold text-[#534E5C] dark:text-[#A8A4B2]">
              <Link href="/" className="hover:text-[#CC3520]">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/duyet" className="hover:text-[#CC3520]">
                Duyệt
              </Link>
              <span>/</span>
              <span className="text-[#1A1720] dark:text-[#EAE8D8] font-bold">{inst.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-10">
              {/* Lá bài lớn — điểm neo cho View Transition */}
              <div className="flex-shrink-0">
                <ViewTransition name={`card-${inst.id}`}>
                  <CardFace
                    name={inst.name}
                    element={inst.element}
                    tone={inst.tone}
                    noteName={inst.noteName}
                    instrumentId={inst.id}
                    size="lg"
                    isInteractive={true}
                  />
                </ViewTransition>
              </div>

              <div className="flex-1 w-full min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    style={{ backgroundColor: cfg.color, color: cfg.textColor }}
                    className="px-2.5 py-1 rounded-[4px] border-[2px] border-[#1A1720] text-xs font-black uppercase tracking-wider"
                  >
                    Hành {inst.elementName} • Âm {inst.tone}
                  </span>
                  <span className="px-2.5 py-1 rounded-[4px] bg-[#E8EAE0] dark:bg-stone-800 border-[2px] border-[#1A1720] dark:border-[#EAE8D8] text-xs font-mono font-bold tabular-nums">
                    Nốt {inst.noteName} ({inst.noteFrequency})
                  </span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#F2B632] text-[#1A1720] border-[2px] border-[#1A1720] text-[10px] font-black uppercase">
                    {inst.status}
                  </span>
                </div>

                <h1
                  className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-[#1A1720] dark:text-[#EAE8D8] mb-2"
                  style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
                >
                  {inst.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#534E5C] dark:text-[#A8A4B2] mb-4" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.nameGlossEn} • {inst.copiesInDeck} lá trong bộ bài tiêu chuẩn 45 lá
                </p>

                {/* Trích đoạn đặc tính nguyên văn */}
                <div
                  className="p-3.5 rounded-[4px] bg-white/70 dark:bg-[#1E1C23]/70 text-xs sm:text-sm italic font-medium mb-6 max-w-3xl"
                  style={{
                    borderLeft: `5px solid ${cfg.color}`,
                    lineHeight: "var(--lh-body)",
                  }}
                >
                  &ldquo;{inst.summaryVerbatim}&rdquo;
                </div>

                <InstrumentClientActions
                  element={inst.element}
                  instrumentName={inst.name}
                  noteName={inst.noteName}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ======================= NỘI DUNG TAB + LIÊN QUAN ======================= */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <InstrumentTabs tabs={tabs} accent={cfg.color} accentText={cfg.textColor} />

          {/* Trước / Tiếp — điều hướng giữa 15 nhạc cụ (phím ← →) */}
          <PrevNextNav prev={prev} next={next} />

          {/* Nhạc cụ liên quan trong bộ bài */}
          <div className="mb-16 mt-12">
            <div className="text-center mb-8">
              <h3 className="font-display font-black text-2xl text-[#16141A] dark:text-[#E8EAE0]">
                Nhạc cụ liên quan trong Ngũ Cung
              </h3>
              <p className="text-xs text-[#524F59] dark:text-[#A8A6B0] mt-1">
                Các nhạc cụ cùng họ hòa thanh và các hành tương sinh / tương khắc
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/nhac-cu/${r.slug}`}
                  className="group flex flex-col items-center"
                >
                  <ViewTransition name={`card-${r.id}`}>
                    <CardFace
                      name={r.name}
                      element={r.element}
                      tone={r.tone}
                      noteName={r.noteName}
                      instrumentId={r.id}
                      size="sm"
                      isInteractive={true}
                    />
                  </ViewTransition>
                  <span className="mt-2 text-xs font-bold text-[#16141A] dark:text-[#E8EAE0] group-hover:text-[#D23A22]">
                    {r.name} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <ColorRibbon />
        </div>
      </main>

      <TeamFaqFooter />
    </div>
  );
}
