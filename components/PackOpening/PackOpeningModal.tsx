"use client";

/**
 * ==============================================================================
 * FILE: components/PackOpening/PackOpeningModal.tsx
 * MỤC ĐÍCH: Trải nghiệm "Mở gói bài" (5 lá ngẫu nhiên):
 * - Bao gói giấy điệp đỏ Đông Hồ, kéo hoặc bấm để xé mở
 * - Lật từng lá kèm âm thanh ngũ âm và hiệu ứng biến ảo
 * - Tự động cập nhật tiến độ vào Bộ sưu tập (localStorage)
 * ==============================================================================
 */

import React, { useState } from "react";
import { INSTRUMENTS, Instrument } from "@/data/instruments";
import CardFace from "@/components/CardFace";
import { soundEngine } from "@/lib/audio";
import { IconCardBack, IconClose, IconGift } from "@/components/icons";

interface PackOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCardsUnlocked?: (newCards: Instrument[]) => void;
}

function pickRandom5(): Instrument[] {
  return [...INSTRUMENTS].sort(() => Math.random() - 0.5).slice(0, 5);
}

export default function PackOpeningModal({
  isOpen,
  onClose,
  onCardsUnlocked,
}: PackOpeningModalProps) {
  const [packOpened, setPackOpened] = useState(false);
  const [packCards, setPackCards] = useState<Instrument[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false, false]);

  if (!isOpen) return null;

  const handleOpenPack = () => {
    const picked = pickRandom5();
    setPackCards(picked);
    setPackOpened(true);
    setRevealed([false, false, false, false, false]);
    soundEngine.playElementTone("hoa", true);

    // Lưu vào localStorage bộ sưu tập
    try {
      const saved = localStorage.getItem("ngucung_collection") || "[]";
      const currentIds: string[] = JSON.parse(saved);
      const newIds = Array.from(new Set([...currentIds, ...picked.map((c) => c.id)]));
      localStorage.setItem("ngucung_collection", JSON.stringify(newIds));
      if (onCardsUnlocked) {
        onCardsUnlocked(picked);
      }
    } catch {
      // bỏ qua lỗi nếu localStorage bị chặn
    }
  };

  const handleRevealCard = (index: number) => {
    if (revealed[index]) return;
    const next = [...revealed];
    next[index] = true;
    setRevealed(next);

    const inst = packCards[index];
    if (inst) {
      soundEngine.playElementTone(inst.element, true);
    }
  };

  const allRevealed = revealed.every(Boolean);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pack-opening-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#E8EAE0] dark:bg-[#1D1B22] border-[3px] border-[#16141A] dark:border-[#E8EAE0] rounded-[6px] shadow-[8px_8px_0px_#16141A] dark:shadow-[8px_8px_0px_#E8EAE0] p-6 text-center">
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          aria-label="Đóng mở gói bài"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center font-bold text-sm bg-white dark:bg-stone-800 border-[2px] border-[#16141A] dark:border-[#E8EAE0] rounded shadow-[2px_2px_0px_#16141A] hover:bg-stone-100 cursor-pointer"
        >
          <IconClose size={14} aria-hidden />
        </button>

        <h2 id="pack-opening-title" className="font-display font-black text-2xl sm:text-3xl text-[#16141A] dark:text-[#E8EAE0] mb-2">
          {packOpened ? "Gói bài 5 lá của bạn" : "Xé gói bài Ngũ Cung"}
        </h2>
        <p className="text-xs sm:text-sm text-[#524F59] dark:text-[#A8A6B0] mb-6">
          {packOpened
            ? "Bấm vào từng lá bài để lật mở nhạc cụ và thanh âm tương ứng!"
            : "Mỗi gói chứa 5 lá bài ngẫu nhiên. Bấm hoặc giữ gói bài để xé niêm phong!"}
        </p>

        {!packOpened ? (
          /* BAO BÌ GÓI BÀI ĐÔNG HỒ */
          <div className="flex flex-col items-center justify-center py-8">
            <button
              onClick={handleOpenPack}
              className="group relative w-56 h-80 rounded-[8px] border-[4px] border-[#16141A] bg-[#D23A22] text-[#FFFFFF] shadow-[6px_8px_0px_#16141A] p-4 flex flex-col justify-between items-center cursor-pointer hover:-translate-y-2 hover:shadow-[8px_12px_0px_#16141A] active:translate-y-0 transition-all"
            >
              <div className="w-full text-center border-b-2 border-white/30 pb-2">
                <span className="text-[10px] font-black tracking-widest uppercase block text-[#F2B632]">
                  ĐẶC BIỆT • 5 LÁ
                </span>
                <span className="font-display font-black text-xl tracking-wider block">
                  NGŨ CUNG
                </span>
              </div>

              {/* Họa tiết phong bao Đông Hồ */}
              <div className="w-24 h-24 rounded-full border-2 border-[#F2B632] flex items-center justify-center bg-black/10">
                <span className="font-display font-black text-2xl text-[#F2B632] group-hover:scale-110 transition-transform">
                  開
                </span>
              </div>

              <div className="w-full text-center border-t-2 border-white/30 pt-2">
                <span className="text-xs font-bold bg-[#F2B632] text-[#16141A] px-3 py-1 rounded inline-block">
                  Bấm để xé gói
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* LƯỚI 5 LÁ BÀI LẬT */
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 justify-items-center mb-6">
              {packCards.map((inst, index) => (
                <div key={inst.id} className="flex flex-col items-center">
                  {revealed[index] ? (
                    <div className="animate-scale-in">
                      <CardFace
                        name={inst.name}
                        element={inst.element}
                        tone={inst.tone}
                        noteName={inst.noteName}
                        instrumentId={inst.id}
                        variant={index % 3}
                        size="sm"
                        isInteractive={false}
                      />
                    </div>
                  ) : (
                    /* LƯNG BÀI CHỜ LẬT */
                    <button
                      onClick={() => handleRevealCard(index)}
                      className="w-28 h-40 rounded-[4px] border-[3px] border-[#16141A] bg-[#16141A] text-[#F2B632] shadow-[3px_3px_0px_#16141A] flex flex-col items-center justify-center p-2 cursor-pointer hover:-translate-y-1 hover:shadow-[4px_6px_0px_#16141A] transition-all"
                    >
                      <IconCardBack size={28} aria-hidden className="mb-1" />
                      <span className="text-[10px] font-bold">Bấm để lật</span>
                    </button>
                  )}
                  <span className="text-[11px] font-bold mt-1 text-[#16141A] dark:text-[#E8EAE0]">
                    {revealed[index] ? inst.name : `Lá ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>

            {allRevealed && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const shuffled = [...INSTRUMENTS].sort(() => Math.random() - 0.5);
                    setPackCards(shuffled.slice(0, 5));
                    setPackOpened(false);
                    setRevealed([false, false, false, false, false]);
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#3F7D3B] text-white rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#346a30] cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5"><IconGift size={14} aria-hidden /> Mở tiếp gói khác</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold bg-white dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0] rounded border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] hover:bg-stone-100 cursor-pointer"
                >
                  Xem Bộ sưu tập
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
