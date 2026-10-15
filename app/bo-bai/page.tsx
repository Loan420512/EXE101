"use client";

/**
 * ==============================================================================
 * FILE: app/bo-bai/page.tsx
 * MỤC ĐÍCH: Trang chuyên đề tra cứu toàn bộ 45 lá bài và 15 nhạc cụ (/bo-bai).
 * ==============================================================================
 */

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import CardFace from "@/components/CardFace";
import ModalInstrument from "@/components/ModalInstrument";
import EffectCanvas from "@/components/EffectCanvas";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import PackOpeningModal from "@/components/PackOpening/PackOpeningModal";
import CollectionModal from "@/components/Collection/CollectionModal";
import { INSTRUMENTS, Instrument, ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";
import { soundEngine } from "@/lib/audio";
import { dispatchSceneChange } from "@/data/scenes";

export default function BoBaiPage() {
  const [filter, setFilter] = useState<ElementType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [activeModalInstrument, setActiveModalInstrument] = useState<Instrument | null>(null);
  const [modalOriginRect, setModalOriginRect] = useState<EffectTargetRect | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  const [activeEffect, setActiveEffect] = useState<{
    element: ElementType;
    cardRect: EffectTargetRect;
    onFinish: () => void;
  } | null>(null);

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

  const handleCardClick = (inst: Instrument, rect: EffectTargetRect) => {
    if (activeEffect) return;
    soundEngine.playElementTone(inst.element);
    setAnimatingCardId(inst.id);

    dispatchSceneChange(inst.element);

    handleTriggerEffect(inst.element, rect, () => {
      setAnimatingCardId(null);
      setModalOriginRect(rect);
      setActiveModalInstrument(inst);
    });
  };

  const filteredInstruments = INSTRUMENTS.filter((inst) => {
    const matchFilter = filter === "all" || inst.element === filter;
    const matchSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.tone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.elementName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere={filter === "all" ? "mix" : filter} />

      <Header
        onOpenPack={() => setIsPackModalOpen(true)}
        onOpenCollection={() => setIsCollectionModalOpen(true)}
      />

      <main className="below-header flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full realm-thuy">
        {/* NÚT QUAY VỀ TRANG CHỦ */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D23A22] hover:underline"
          >
            ← Quay lại Trang chủ Ngũ Cung
          </Link>
        </div>

        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-[#A36A00] dark:text-[#F2B632] block mb-2">
            THƯ VIỆN ĐẦY ĐỦ 45 LÁ BÀI
          </span>
          <h1
            className="font-display font-black text-3xl sm:text-5xl on-photo-heading"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Bộ bài Ngũ Cung
          </h1>
          <p
            className="mt-3 text-sm sm:text-base on-photo-muted"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            Mỗi bộ bài gồm 15 nhạc cụ thuộc 5 hành. Mỗi nhạc cụ được in 3 bản sao giống nhau, tạo thành bộ 45 lá tiêu chuẩn cho 2 đến 5 người chơi.
          </p>
        </div>

        {/* CÔNG CỤ TÌM KIẾM & BỘ LỌC HÀNH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1E1C23] p-4 rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[4px_4px_0px_#1A1720] dark:shadow-[4px_4px_0px_#EAE8D8] paper-board">
          {/* Ô TÌM KIẾM */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm nhạc cụ, âm điệu (Đàn bầu, Cung...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border-[2px] border-[#1A1720] dark:border-[#EAE8D8] bg-[#E8EAE0]/40 dark:bg-[#141318] text-[#1A1720] dark:text-[#EAE8D8] placeholder-[#534E5C]/70 dark:placeholder-[#A8A4B2]/70 focus:outline-none focus:ring-2 focus:ring-[#CC3520]"
            />
          </div>

          {/* CÁC NÚT LỌC HÀNH */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-black border-[2px] border-[#1A1720] dark:border-[#EAE8D8] transition-all min-h-[36px] ${
                filter === "all"
                  ? "bg-[#1A1720] text-white shadow-[2px_2px_0px_#CC3520]"
                  : "bg-stone-100 dark:bg-stone-800 text-[#1A1720] dark:text-[#EAE8D8] hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              Tất cả (15)
            </button>
            {(["tho", "kim", "moc", "hoa", "thuy"] as ElementType[]).map((el) => {
              const cfg = ELEMENT_CONFIG[el];
              const isSelected = filter === el;
              return (
                <button
                  key={el}
                  onClick={() => setFilter(el)}
                  style={
                    isSelected
                      ? {
                          backgroundColor: cfg.color,
                          color: el === "kim" || el === "tho" ? "#1A1720" : "#FFFFFF",
                          boxShadow: "2px 2px 0px #1A1720",
                        }
                      : {}
                  }
                  className={`px-3 py-1.5 rounded-[4px] text-xs font-black border-[2px] border-[#1A1720] dark:border-[#EAE8D8] transition-all min-h-[36px] ${
                    !isSelected ? "bg-white dark:bg-[#141318] text-[#1A1720] dark:text-[#EAE8D8] hover:bg-stone-100" : ""
                  }`}
                >
                  {cfg.name} • {cfg.tone}
                </button>
              );
            })}
          </div>
        </div>

        {/* LƯỚI BÀI */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center mb-16">
          {filteredInstruments.map((inst) => (
            <div key={inst.id} className="flex flex-col items-center">
              <CardFace
                name={inst.name}
                element={inst.element}
                tone={inst.tone}
                noteName={inst.noteName}
                instrumentId={inst.id}
                size="md"
                isAnimating={animatingCardId === inst.id}
                onClick={(rect) => handleCardClick(inst, rect)}
              />
              <div className="mt-2 text-center text-xs font-semibold">
                <span className="block on-photo-heading font-bold">
                  {inst.name}
                </span>
                <span className="text-[10px] on-photo-muted">
                  3 lá / bộ (45 lá)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL CHI TIẾT */}
        <ModalInstrument
          instrument={activeModalInstrument}
          originRect={modalOriginRect}
          onClose={() => {
            setActiveModalInstrument(null);
            setModalOriginRect(null);
            dispatchSceneChange("default");
          }}
        />
      </main>

      <TeamFaqFooter />

      {/* HIỆU ỨNG BIẾN ẢO CANVAS */}
      <EffectCanvas
        activeEffect={activeEffect}
        onComplete={handleEffectComplete}
      />

      {/* MODAL MỞ GÓI BÀI 5 LÁ */}
      <PackOpeningModal
        isOpen={isPackModalOpen}
        onClose={() => setIsPackModalOpen(false)}
        onCardsUnlocked={() => {}}
      />

      {/* MODAL BỘ SƯU TẬP */}
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
