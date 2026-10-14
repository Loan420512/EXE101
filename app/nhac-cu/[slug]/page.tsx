/**
 * ==============================================================================
 * FILE: app/nhac-cu/[slug]/page.tsx
 * MỤC ĐÍCH: Trang bách khoa chuyên sâu cho từng nhạc cụ dân tộc trong 15 nhạc cụ:
 * - Thông tin đầy đủ: Cấu tạo, Cách chơi, Âm sắc, Quan hệ ngũ hành tương sinh tương khắc
 * - Nút nghe nốt WebAudio kèm WaveformVisualizer thời gian thực
 * - Danh sách nhạc cụ liên quan (cùng họ, sinh, khắc)
 * - Nút chia sẻ mạng xã hội / sao chép link
 * ==============================================================================
 */

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
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

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere={inst.element} activeScene={inst.element} />

      <Header />

      <main className={`flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full realm-${inst.element}`}>
        {/* THANH ĐIỀU HƯỚNG VỤN BÁNH MÌ (BREADCRUMB) */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-bold text-[#534E5C] dark:text-[#A8A4B2]">
          <Link href="/" className="hover:text-[#CC3520]">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/bo-bai" className="hover:text-[#CC3520]">
            Bộ bài
          </Link>
          <span>/</span>
          <span className="text-[#1A1720] dark:text-[#EAE8D8] font-bold">{inst.name}</span>
        </nav>

        {/* KHỐI NỘI DUNG CHÍNH */}
        <div className="bg-white dark:bg-[#1E1C23] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] rounded-[6px] shadow-[6px_6px_0px_#1A1720] dark:shadow-[6px_6px_0px_#EAE8D8] paper-board p-6 sm:p-10 mb-12">
          {/* PHẦN ĐẦU: LÁ BÀI 3D & TIÊU ĐỀ */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b-2 border-stone-200 dark:border-stone-800 pb-8 mb-8">
            <div className="flex-shrink-0">
              <CardFace
                name={inst.name}
                element={inst.element}
                tone={inst.tone}
                noteName={inst.noteName}
                size="lg"
                isInteractive={true}
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
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
                  className="font-display font-black text-3xl sm:text-5xl text-[#1A1720] dark:text-[#EAE8D8] mb-3"
                  style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
                >
                  {inst.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-[#534E5C] dark:text-[#A8A4B2] mb-4" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.nameGlossEn} • 3 lá trong bộ bài tiêu chuẩn 45 lá
                </p>

                {/* TRÍCH ĐOẠN ĐẶC TÍNH NGUYÊN VĂN */}
                <div
                  className="p-3.5 rounded-[4px] bg-[#E8EAE0]/70 dark:bg-stone-800 text-xs sm:text-sm italic font-medium mb-6"
                  style={{
                    borderLeft: `5px solid ${cfg.color}`,
                    lineHeight: "var(--lh-body)",
                  }}
                >
                  &ldquo;{inst.summaryVerbatim}&rdquo;
                </div>
              </div>

              {/* TƯƠNG TÁC ÂM THANH & CHIA SẺ */}
              <InstrumentClientActions
                element={inst.element}
                instrumentName={inst.name}
                noteName={inst.noteName}
              />
            </div>
          </div>

          {/* CÁC PHẦN NỘI DUNG CHI TIẾT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
            {/* CỘT 1 */}
            <div className="space-y-6">
              <div>
                <h2
                  className="font-display font-black text-base uppercase text-[#1A1720] dark:text-[#EAE8D8] mb-2 flex items-center gap-2"
                  style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
                >
                  <span>📖</span> Giới thiệu lịch sử
                </h2>
                <p className="text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.description}
                </p>
              </div>

              <div>
                <h2
                  className="font-display font-black text-base uppercase text-[#1A1720] dark:text-[#EAE8D8] mb-2 flex items-center gap-2"
                  style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
                >
                  <span>🪵</span> Cấu tạo nhạc cụ
                </h2>
                <p className="text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.structure}
                </p>
              </div>
            </div>

            {/* CỘT 2 */}
            <div className="space-y-6">
              <div>
                <h2
                  className="font-display font-black text-base uppercase text-[#1A1720] dark:text-[#EAE8D8] mb-2 flex items-center gap-2"
                  style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
                >
                  <span>🖐️</span> Kỹ thuật diễn tấu
                </h2>
                <p className="text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.playMethod}
                </p>
              </div>

              <div>
                <h2
                  className="font-display font-black text-base uppercase text-[#1A1720] dark:text-[#EAE8D8] mb-2 flex items-center gap-2"
                  style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
                >
                  <span>⚡</span> Vì sao thuộc hành {inst.elementName}?
                </h2>
                <p className="text-[#534E5C] dark:text-[#A8A4B2] bg-amber-50/60 dark:bg-stone-800/60 p-3 rounded-[4px] border-2 border-amber-200 dark:border-stone-700" style={{ lineHeight: "var(--lh-body)" }}>
                  {inst.elementReason}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NHẠC CỤ LIÊN QUAN TRONG BỘ BÀI */}
        <div className="mb-16">
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
                <CardFace
                  name={r.name}
                  element={r.element}
                  tone={r.tone}
                  noteName={r.noteName}
                  size="sm"
                  isInteractive={true}
                />
                <span className="mt-2 text-xs font-bold text-[#16141A] dark:text-[#E8EAE0] group-hover:text-[#D23A22]">
                  {r.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <ColorRibbon />
      </main>

      <TeamFaqFooter />
    </div>
  );
}
