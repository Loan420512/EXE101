"use client";

/**
 * FILE: app/page.tsx — Trang Khám Phá (Explore) — streaming × Đông Hồ
 *
 * CẤU TRÚC MỚI (U2):
 * 0. LivingBackground (nền WebGL)
 * 1. Header mới (sticky, ẩn khi cuộn xuống)
 * 2. Billboard toàn màn hình (auto-rotate 5 hành, pause, mũi tên)
 * 3. Hàng ngang: "Tiếp tục khám phá" — 15 nhạc cụ mới nhất
 * 4. Hàng ngang theo 5 họ riêng (màu từng hành)
 * 5. Dải "Chơi trong 30 giây" — kết nối GameGuide30s
 * 6. Dải ô duyệt màu lớn (browse by element)
 * 7. Dải Câu chuyện (Story) — cuộn dọc
 * 8. WuXingDiagram — sơ đồ tương tác
 * 9. RulesSection, RegisterForm, TeamFaqFooter
 * 10. MiniPlayer (sắp tới), EffectCanvas, Modals
 */

import React, { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Billboard from "@/components/Billboard";
import InstrumentRow from "@/components/InstrumentRow";
import Story from "@/components/Story";
import GameGuide30s from "@/components/GameGuide30s";
import CardDeck from "@/components/CardDeck";
import WuXingDiagram from "@/components/WuXingDiagram";
import RulesSection from "@/components/RulesSection";
import RegisterForm from "@/components/RegisterForm";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import EffectCanvas from "@/components/EffectCanvas";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import PackOpeningModal from "@/components/PackOpening/PackOpeningModal";
import CollectionModal from "@/components/Collection/CollectionModal";
import { INSTRUMENTS, ELEMENT_CONFIG, type ElementType } from "@/data/instruments";
import { useFavorites } from "@/lib/favorites";
import type { EffectTargetRect } from "@/effects/types";
import { SECTION_IDS, type SectionId } from "@/config/sections";
import Link from "next/link";
import { IconGamepad, IconArrowRight } from "@/components/icons";

// Nhạc cụ theo từng họ
const BY_ELEMENT = (el: ElementType) => INSTRUMENTS.filter((i) => i.element === el);

// Ô duyệt màu lớn — 5 hành
const BROWSE_TILES = [
  { element: "tho" as ElementType, label: "Họ Thổ", sub: "Cung · C4", count: 3 },
  { element: "kim" as ElementType, label: "Họ Kim", sub: "Thương · D4", count: 3 },
  { element: "moc" as ElementType, label: "Họ Mộc", sub: "Giốc · E4", count: 3 },
  { element: "hoa" as ElementType, label: "Họ Hỏa", sub: "Chủy · G4", count: 3 },
  { element: "thuy" as ElementType, label: "Họ Thủy", sub: "Vũ · A4", count: 3 },
];

export default function Home() {
  const [currentSection, setCurrentSection] = useState<SectionId>("hero");
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const favorites = useFavorites();
  const [activeEffect, setActiveEffect] = useState<{
    element: ElementType;
    cardRect: EffectTargetRect;
    onFinish: () => void;
  } | null>(null);

  // Yêu thích lưu trên máy — hàng "Yêu thích của bạn" chỉ hiện khi có dữ liệu thật
  const favoriteInstruments = INSTRUMENTS.filter((i) => favorites.includes(i.id));

  // Theo dõi section đang cuộn để đổi bầu không khí WebGL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const id = entry.target.id as SectionId;
            if (SECTION_IDS.includes(id)) setCurrentSection(id);
          }
        });
      },
      { threshold: 0.35 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleTriggerEffect = useCallback(
    (element: ElementType, cardRect: EffectTargetRect, onFinish: () => void) => {
      if (activeEffect) return;
      setActiveEffect({ element, cardRect, onFinish });
    },
    [activeEffect]
  );

  const handleEffectComplete = useCallback(() => {
    if (activeEffect) {
      activeEffect.onFinish();
      setActiveEffect(null);
    }
  }, [activeEffect]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      {/* 0. NỀN SỐNG WEBGL */}
      <LivingBackground currentSection={currentSection} />

      {/* 1. HEADER */}
      <Header
        onOpenPack={() => setIsPackModalOpen(true)}
        onOpenCollection={() => setIsCollectionModalOpen(true)}
      />

      {/* Offset cho header cố định (đã bỏ ribbon, chừa 6px thở) */}
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 flex flex-col">

        {/* ══════════════════════════════════════════
            2. BILLBOARD TOÀN MÀN HÌNH
        ══════════════════════════════════════════ */}
        <section id="hero" aria-label="Nổi bật">
          <Billboard />
        </section>

        {/* ══════════════════════════════════════════
            3. HÀNG NGANG: TẤT CẢ 15 NHẠC CỤ
        ══════════════════════════════════════════ */}
        <div className="mt-8 space-y-8">
          {favoriteInstruments.length > 0 && (
            <InstrumentRow
              title="Yêu thích của bạn"
              subtitle="Đã lưu trên máy của bạn"
              instruments={favoriteInstruments}
              accentColor="#D23A22"
              tagColor="#D23A22"
            />
          )}
          <InstrumentRow
            title="Khám phá 15 nhạc cụ"
            subtitle="Tất cả nhạc cụ truyền thống Việt Nam"
            instruments={INSTRUMENTS}
            accentColor="#F2B632"
          />

          {/* ══ HÀNG THEO HỌ ══ */}
          {(["hoa", "thuy", "moc", "tho", "kim"] as ElementType[]).map((el) => {
            const cfg = ELEMENT_CONFIG[el];
            return (
              <InstrumentRow
                key={el}
                title={`Họ ${cfg.name} — Âm ${cfg.tone}`}
                subtitle={`${cfg.note} · ${cfg.description}`}
                instruments={BY_ELEMENT(el)}
                accentColor={cfg.color}
                tagColor={cfg.color}
              />
            );
          })}
        </div>

        {/* ══════════════════════════════════════════
            4. DẢI Ô DUYỆT MÀU LỚN (Browse by Element)
        ══════════════════════════════════════════ */}
        <section
          id="duyet"
          className="mt-16 px-4 sm:px-6 max-w-screen-xl mx-auto w-full"
          aria-label="Duyệt theo họ nhạc cụ"
        >
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-display font-black text-2xl text-white">Duyệt theo Hành</h2>
            <span className="text-sm text-white/50">Chọn họ để nghe và khám phá</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {BROWSE_TILES.map(({ element, label, sub, count }) => {
              const cfg = ELEMENT_CONFIG[element];
              return (
                <Link
                  key={element}
                  href={`/bo-bai?element=${element}`}
                  className="group relative flex flex-col justify-end rounded-[4px] overflow-hidden
                    border-[3px] border-[#16141A] cursor-pointer
                    transition-all duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-white"
                  style={{
                    backgroundColor: cfg.color,
                    boxShadow: `4px 4px 0px #16141A, 0 0 0 1px ${cfg.color}`,
                    minHeight: 120,
                  }}
                  aria-label={`Duyệt ${label} — ${count} nhạc cụ`}
                >
                  {/* Họa tiết nhẹ góc trên phải */}
                  <div
                    className="absolute top-2 right-2 opacity-20 font-display font-black text-5xl leading-none"
                    style={{ color: cfg.textColor }}
                    aria-hidden
                  >
                    {cfg.tone[0]}
                  </div>

                  <div className="relative z-10 p-3">
                    <p
                      className="font-display font-black text-lg leading-tight"
                      style={{ color: cfg.textColor }}
                    >
                      {label}
                    </p>
                    <p className="text-[12px] font-semibold mt-0.5 opacity-75" style={{ color: cfg.textColor }}>
                      {sub}
                    </p>
                    <p className="text-[11px] mt-1 font-bold opacity-60" style={{ color: cfg.textColor }}>
                      {count} nhạc cụ
                    </p>
                  </div>

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            5. DẢI "CHƠI TRONG 30 GIÂY"
        ══════════════════════════════════════════ */}
        <div id="choi-30s" className="mt-16">
          <GameGuide30s />
        </div>

        {/* ══════════════════════════════════════════
            6. DẢI CÂU CHUYỆN
        ══════════════════════════════════════════ */}
        <div id="cau-chuyen">
          <Story />
        </div>

        {/* ══════════════════════════════════════════
            7. BỘ BÀI 15 NHẠC CỤ (lưới chi tiết + modal)
        ══════════════════════════════════════════ */}
        <CardDeck
          onTriggerEffect={handleTriggerEffect}
          isEffectRunning={!!activeEffect}
        />

        {/* ══════════════════════════════════════════
            8. NGŨ ÂM & NGŨ HÀNH (sơ đồ tương tác)
        ══════════════════════════════════════════ */}
        <div id="ngu-hanh">
          <WuXingDiagram />
        </div>

        {/* ══════════════════════════════════════════
            9. DẢI CTA CHƠI NGAY
        ══════════════════════════════════════════ */}
        <section
          className="py-16 px-4 sm:px-6 text-center"
          aria-label="Kêu gọi chơi ngay"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(210,58,34,0.08) 50%, transparent 100%)",
          }}
        >
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mb-4">
            Chơi ngay — không cần đăng ký
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto mb-8">
            Thử đấu với bot, học luật trong 2 phút, hoặc chuyền máy cho cả nhà cùng chơi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/choi-thu-ngay"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[4px] font-black text-base
                bg-[#D23A22] text-white border-[3px] border-[#16141A]
                shadow-[4px_4px_0px_#16141A] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#16141A]
                active:translate-y-0.5 active:shadow-none transition-all duration-150
                focus-visible:outline-2 focus-visible:outline-white"
            >
              <IconGamepad size={18} aria-hidden />
              Chơi thử ngay
            </Link>
            <Link
              href="/luat-choi"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[4px] font-bold text-base
                bg-white/8 text-white border-[2px] border-white/25
                hover:bg-white/15 transition-all duration-150
                focus-visible:outline-2 focus-visible:outline-white"
            >
              Xem luật chơi <IconArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            10. LUẬT CHƠI RÚT GỌN
        ══════════════════════════════════════════ */}
        <div id="luat-choi">
          <RulesSection />
        </div>

        {/* ══════════════════════════════════════════
            11. ĐĂNG KÝ CHƠI THỬ
        ══════════════════════════════════════════ */}
        <div id="dang-ky">
          <RegisterForm />
        </div>

        {/* ══════════════════════════════════════════
            12. ĐỘI NGŨ & FOOTER
        ══════════════════════════════════════════ */}
        <div id="doi-ngu">
          <TeamFaqFooter />
        </div>
      </main>

      {/* CANVAS HIỆU ỨNG BIẾN ẢO */}
      <EffectCanvas
        activeEffect={activeEffect}
        onComplete={handleEffectComplete}
      />

      {/* MODALS */}
      <PackOpeningModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        onCardsUnlocked={() => {}}
      />
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onOpenPackClick={() => {
          setIsCollectionModalOpen(false);
          setIsPackModalOpen(true);
        }}
      />
    </div>
  );
}
