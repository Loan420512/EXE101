"use client";

/**
 * ==============================================================================
 * FILE: components/Collection/CollectionModal.tsx
 * MỤC ĐÍCH: Quản lý "Bộ sưu tập" 15 nhạc cụ của người chơi (lưu localStorage):
 * - Thống kê tiến độ x/15 nhạc cụ đã sưu tầm
 * - Huy hiệu danh dự khi hoàn thành từng họ ngũ hành
 * - Nút "Mở gói bài mới" ngay trong bộ sưu tập
 * ==============================================================================
 */

import React, { useState } from "react";
import { INSTRUMENTS, ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import CardFace from "@/components/CardFace";
import { IconQuestion, IconClose, IconGift, IconMedal, IconLock, IconCrown } from "@/components/icons";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPackClick: () => void;
}

function loadCollected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("ngucung_collection") || "[]";
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export default function CollectionModal({
  isOpen,
  onClose,
  onOpenPackClick,
}: CollectionModalProps) {
  const [collectedIds] = useState<string[]>(() => loadCollected());
  const [filter, setFilter] = useState<ElementType | "all">("all");

  if (!isOpen) return null;

  const totalCollected = collectedIds.length;
  const elements: ElementType[] = ["tho", "kim", "moc", "hoa", "thuy"];

  // Kiểm tra huy hiệu từng họ
  const badges = elements.map((el) => {
    const familyInstruments = INSTRUMENTS.filter((i) => i.element === el);
    const count = familyInstruments.filter((i) => collectedIds.includes(i.id)).length;
    const isComplete = count === familyInstruments.length;
    const names = {
      tho: "Huy hiệu Trầm Tích Thổ",
      kim: "Huy hiệu Chuông Đồng Kim",
      moc: "Huy hiệu Rừng Tre Mộc",
      hoa: "Huy hiệu Lửa Thiêng Hỏa",
      thuy: "Huy hiệu Suối Nguồn Thủy",
    };
    return {
      element: el,
      name: names[el],
      count,
      total: familyInstruments.length,
      isComplete,
      color: ELEMENT_CONFIG[el].color,
    };
  });

  const isGrandMaster = totalCollected >= 15;

  const filteredInstruments = INSTRUMENTS.filter((inst) => {
    return filter === "all" || inst.element === filter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#E8EAE0] dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] rounded-[6px] shadow-[8px_8px_0px_#16141A] dark:shadow-[8px_8px_0px_#E8EAE0] p-6 flex flex-col overflow-hidden">
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          aria-label="Đóng Bộ sưu tập"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center font-bold text-sm bg-white dark:bg-stone-800 border-[2px] border-[#16141A] dark:border-[#E8EAE0] rounded shadow-[2px_2px_0px_#16141A] hover:bg-stone-100 cursor-pointer z-10"
        >
          <IconClose size={14} aria-hidden />
        </button>

        {/* TIÊU ĐỀ & TIẾN ĐỘ TỔNG */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-stone-300 dark:border-stone-700 pb-4 mb-4">
          <div>
            <h2 id="collection-title" className="font-display font-black text-2xl sm:text-3xl text-[#16141A] dark:text-[#E8EAE0]">
              Bộ sưu tập Nhạc Cụ
            </h2>
            <p className="text-xs text-[#524F59] dark:text-[#A8A6B0]">
              Tiến độ sưu tầm: <span className="font-bold text-[#D23A22]">{totalCollected}/15</span> nhạc cụ dân tộc
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPackClick();
              }}
              className="px-3 py-1.5 text-xs font-bold bg-[#D23A22] text-white rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#b8311c] cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5"><IconGift size={14} aria-hidden /> Mở gói bài mới</span>
            </button>
          </div>
        </div>

        {/* KHU VỰC HUY HIỆU DANH DỰ NGŨ HÀNH */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4 bg-white/70 dark:bg-stone-900/60 p-3 rounded border border-[#16141A]/20">
          {badges.map((b) => (
            <div
              key={b.element}
              className={`p-2 rounded border flex flex-col items-center text-center transition-all ${
                b.isComplete
                  ? "border-[#16141A] shadow-[2px_2px_0px_#16141A] bg-amber-50 dark:bg-stone-800"
                  : "border-dashed border-stone-300 dark:border-stone-700 opacity-60"
              }`}
            >
              <span className="mb-0.5">{b.isComplete ? <IconMedal size={20} className="text-[#F2B632]" aria-hidden /> : <IconLock size={20} aria-hidden />}</span>
              <span className="text-[10px] font-bold leading-tight">{b.name}</span>
              <span className="text-[9px] mt-0.5 opacity-80">
                {b.count}/{b.total} lá
              </span>
            </div>
          ))}

          {/* Huy hiệu tối cao Ngũ Cung Toàn Bích */}
          <div
            className={`p-2 rounded border flex flex-col items-center text-center transition-all ${
              isGrandMaster
                ? "border-[#16141A] shadow-[2px_2px_0px_#16141A] bg-amber-100 dark:bg-amber-950 font-bold"
                : "border-dashed border-stone-300 dark:border-stone-700 opacity-50"
            }`}
          >
            <span className="mb-0.5">{isGrandMaster ? <IconCrown size={20} className="text-[#F2B632]" aria-hidden /> : <IconLock size={20} aria-hidden />}</span>
            <span className="text-[10px] font-bold leading-tight">Đại Sứ Toàn Bích</span>
            <span className="text-[9px] mt-0.5">{totalCollected}/15 lá</span>
          </div>
        </div>

        {/* THANH LỌC HÀNH */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 text-xs font-bold rounded border ${
              filter === "all"
                ? "bg-[#16141A] text-white border-[#16141A]"
                : "bg-white dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0]"
            }`}
          >
            Tất cả (15)
          </button>
          {elements.map((el) => {
            const cfg = ELEMENT_CONFIG[el];
            const isSelected = filter === el;
            return (
              <button
                key={el}
                onClick={() => setFilter(el)}
                style={isSelected ? { backgroundColor: cfg.color, color: el === "kim" || el === "tho" ? "#16141A" : "#FFFFFF" } : {}}
                className={`px-2.5 py-1 text-xs font-bold rounded border border-[#16141A] ${
                  !isSelected ? "bg-white dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0]" : ""
                }`}
              >
                {cfg.name} ({cfg.tone})
              </button>
            );
          })}
        </div>

        {/* LƯỚI BÀI ĐÃ THU THẬP & CHƯA MỞ */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-2">
          {filteredInstruments.map((inst) => {
            const isUnlocked = collectedIds.includes(inst.id);
            return (
              <div key={inst.id} className="flex flex-col items-center">
                {isUnlocked ? (
                  <CardFace
                    name={inst.name}
                    element={inst.element}
                    tone={inst.tone}
                    noteName={inst.noteName}
                    instrumentId={inst.id}
                    size="sm"
                    isInteractive={false}
                  />
                ) : (
                  <div className="w-28 h-40 rounded-[4px] border-[2px] border-dashed border-stone-400 dark:border-stone-600 bg-stone-200/50 dark:bg-stone-800/50 flex flex-col items-center justify-center p-2 text-center text-stone-500">
                    <IconQuestion size={22} aria-hidden className="mb-1" />
                    <span className="text-[10px] font-bold">{inst.name}</span>
                    <span className="text-[9px]">Chưa sưu tầm</span>
                  </div>
                )}
                <span className="text-[11px] font-bold mt-1 text-[#16141A] dark:text-[#E8EAE0]">
                  {inst.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
