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
import ColorRibbon from "@/components/ColorRibbon";
import EffectCanvas from "@/components/EffectCanvas";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { INSTRUMENTS, Instrument, ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { EffectTargetRect } from "@/effects/types";
import { soundEngine } from "@/lib/audio";

export default function BoBaiPage() {
  const [filter, setFilter] = useState<ElementType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="min-h-screen flex flex-col bg-[#E8EAE0] dark:bg-[#141318] text-[#16141A] dark:text-[#E8EAE0]">
      {/* NỀN SỐNG WEBGL ĐỒNG BỘ VỚI BỘ LỌC HÀNH */}
      <LivingBackground forceAtmosphere={filter === "all" ? "mix" : filter} />

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
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
          <span className="text-xs font-black tracking-widest uppercase text-[#F2B632] block mb-2">
            THƯ VIỆN ĐẦY ĐỦ 45 LÁ BÀI
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#16141A] dark:text-[#E8EAE0]">
            Bộ bài Ngũ Cung
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#524F59] dark:text-[#A8A6B0]">
            Mỗi bộ bài gồm 15 nhạc cụ thuộc 5 hành. Mỗi nhạc cụ được in 3 bản sao giống nhau, tạo thành bộ 45 lá tiêu chuẩn cho 2 đến 5 người chơi.
          </p>
        </div>

        {/* CÔNG CỤ TÌM KIẾM & BỘ LỌC HÀNH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1D1B22] p-4 rounded-[4px] border-[2px] border-[#16141A] dark:border-[#E8EAE0] shadow-[3px_3px_0px_#16141A]">
          {/* Ô TÌM KIẾM */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm nhạc cụ, âm điệu (Đàn bầu, Cung...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-[#16141A] dark:border-[#E8EAE0] bg-[#E8EAE0]/30 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-[#D23A22]"
            />
          </div>

          {/* CÁC NÚT LỌC HÀNH */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-xs font-bold border border-[#16141A] ${
                filter === "all" ? "bg-[#16141A] text-white" : "bg-stone-100 dark:bg-stone-800"
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
                  style={isSelected ? { backgroundColor: cfg.color, color: el === "kim" || el === "tho" ? "#16141A" : "#FFFFFF" } : {}}
                  className={`px-3 py-1 rounded text-xs font-bold border border-[#16141A] ${
                    !isSelected ? "bg-white dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0]" : ""
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
                size="md"
                isAnimating={animatingCardId === inst.id}
                onClick={(rect) => handleCardClick(inst, rect)}
              />
              <div className="mt-2 text-center text-xs font-semibold">
                <span className="block text-[#16141A] dark:text-[#E8EAE0] font-bold">
                  {inst.name}
                </span>
                <span className="text-[10px] text-[#524F59] dark:text-[#A8A6B0]">
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
          }}
        />

        <ColorRibbon />
      </main>

      <TeamFaqFooter />

      <EffectCanvas
        activeEffect={activeEffect}
        onComplete={handleEffectComplete}
      />
    </div>
  );
}
