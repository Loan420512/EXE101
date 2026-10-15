"use client";

/**
 * FILE: app/tong-ket/page.tsx — U7 "Ngũ Cung của bạn" (Wrapped)
 * Bộ thẻ trượt kiểu story — dữ liệu thật trên máy + mẫu khi chưa có gì.
 * Nhãn "Bản thử · Chỉ dữ liệu trên máy này".
 * Chia sẻ bằng Web Share hoặc clipboard — chỉ số đếm, không có dữ liệu cá nhân.
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { useFavorites } from "@/lib/favorites";
import { useCollection } from "@/lib/collection";
import { INSTRUMENTS, ELEMENT_CONFIG, type ElementType } from "@/data/instruments";
import {
  IconArrowRight, IconArrowLeft, IconShare, IconStar, IconCheck,
} from "@/components/icons";
import InstrumentArt from "@/components/InstrumentArt";

const ELEMENT_ORDER_TYPED: ElementType[] = ["tho", "kim", "moc", "hoa", "thuy"];

function computeStats(favorites: string[], collection: string[]) {
  const favInsts = INSTRUMENTS.filter((i) => favorites.includes(i.id));
  // Họ yêu thích nhất
  const counts: Record<ElementType, number> = { tho: 0, kim: 0, moc: 0, hoa: 0, thuy: 0 };
  favInsts.forEach((i) => counts[i.element]++);
  const topEl = ELEMENT_ORDER_TYPED.reduce((a, b) => counts[a] >= counts[b] ? a : b);
  const topInst = favInsts[0] ?? INSTRUMENTS[0]!;
  const owned = collection.filter((id) => INSTRUMENTS.some((i) => i.id === id)).length;
  return {
    total: favInsts.length,
    owned,
    topEl,
    topInst,
    counts,
    isMock: favInsts.length === 0,
  };
}

const STORY_SLIDES = (stats: ReturnType<typeof computeStats>) => [
  {
    id: "cover",
    bg: "#0B0C14",
    accent: "#F2B632",
    content: (
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="text-label font-black tracking-widest text-white/40 uppercase">Ngũ Cung của bạn</span>
        {stats.isMock && (
          <span className="text-micro font-black px-2 py-0.5 rounded border border-[#F2B632]/40 text-[#F2B632]/70">
            Bản thử · Dữ liệu mẫu
          </span>
        )}
        <div className="font-display font-black text-h1 text-white leading-tight">
          {stats.total}<span className="text-h3 text-white/50">/15</span>
        </div>
        <p className="text-body-sm text-white/70">nhạc cụ bạn đã bấm yêu thích</p>
        <p className="text-label text-white/55">
          Đã sưu được {stats.owned}/15 lá trong bộ bài
        </p>
        <p className="text-body-sm text-white/40 max-w-xs">
          {stats.isMock
            ? "Chưa có dữ liệu thật — đây là bản xem trước. Bấm nút yêu thích trên nhạc cụ bất kỳ để thêm vào."
            : "Đây là hành trình âm nhạc của bạn trên máy này."
          }
        </p>
      </div>
    ),
  },
  {
    id: "top-element",
    bg: ELEMENT_CONFIG[stats.topEl].color + "22",
    accent: ELEMENT_CONFIG[stats.topEl].color,
    content: (
      <div className="flex flex-col items-center gap-5 text-center">
        <p className="text-body-sm text-white/50">Họ yêu thích nhất</p>
        <div
          className="w-24 h-24 rounded-full border-[4px] border-[#16141A] flex items-center justify-center
            font-display font-black text-h3 shadow-[6px_6px_0px_#16141A]"
          style={{ backgroundColor: ELEMENT_CONFIG[stats.topEl].color, color: ELEMENT_CONFIG[stats.topEl].textColor }}
        >
          {ELEMENT_CONFIG[stats.topEl].tone[0]}
        </div>
        <h2 className="font-display font-black text-h3 text-white">
          Họ {ELEMENT_CONFIG[stats.topEl].name}
        </h2>
        <p className="text-body-sm text-white/60">
          Âm {ELEMENT_CONFIG[stats.topEl].tone} · {ELEMENT_CONFIG[stats.topEl].note}
        </p>
        <p className="text-body-sm text-white/40 max-w-xs italic">
          {stats.topEl === "thuy" && "Mềm mại, sâu lắng như dòng nước"}
          {stats.topEl === "hoa" && "Bùng cháy, nhiệt huyết như ngọn lửa"}
          {stats.topEl === "moc" && "Tươi mới, tràn trề sức sống"}
          {stats.topEl === "kim" && "Vang dội, sắc bén như kim khí"}
          {stats.topEl === "tho" && "Trầm hậu, vững chãi như đất mẹ"}
        </p>
      </div>
    ),
  },
  {
    id: "top-instrument",
    bg: "#16141A",
    accent: ELEMENT_CONFIG[stats.topInst.element].color,
    content: (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-body-sm text-white/50">Nhạc cụ nổi bật</p>
        <InstrumentArt
          instrumentId={stats.topInst.id}
          element={stats.topInst.element}
          size={140}
          className="rounded-[6px]"
        />
        <h2 className="font-display font-black text-h4 text-white">{stats.topInst.name}</h2>
        <p className="text-body-sm text-white/60">{stats.topInst.summaryVerbatim}</p>
      </div>
    ),
  },
  {
    id: "breakdown",
    bg: "#0B0C14",
    accent: "#E8EAE0",
    content: (
      <div className="w-full space-y-3">
        <p className="text-body-sm text-white/50 text-center mb-4">Yêu thích theo hành</p>
        {ELEMENT_ORDER_TYPED.map((el) => {
          const cfg = ELEMENT_CONFIG[el];
          const n = stats.counts[el];
          return (
            <div key={el} className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cfg.color }} />
              <span className="text-body-sm font-bold text-white w-16 shrink-0">Họ {cfg.name}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(n / 3) * 100}%`, backgroundColor: cfg.color }}
                />
              </div>
              <span className="text-label font-bold tabular-nums shrink-0" style={{ color: cfg.color }}>
                {n}/3
              </span>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    id: "cta",
    bg: "#D23A22" + "22",
    accent: "#D23A22",
    content: (
      <div className="flex flex-col items-center gap-6 text-center">
        <IconStar size={48} className="text-[#F2B632]" aria-hidden />
        <h2 className="font-display font-black text-h4 text-white">
          {stats.total === 15
            ? "Hoàn thành! Bộ sưu tập đầy đủ"
            : `Còn ${15 - stats.total} nhạc cụ nữa`}
        </h2>
        <p className="text-body-sm text-white/60 max-w-xs">
          {stats.total === 15
            ? "Đã bấm yêu thích đủ 15 nhạc cụ ngũ hành. Thử chơi để chinh phục điểm cao!"
            : "Tiếp tục khám phá và thêm nhạc cụ vào danh sách yêu thích của bạn."
          }
        </p>
        <Link
          href="/duyet"
          className="tap inline-flex items-center gap-2 px-6 py-3 rounded-[4px] font-black text-body-sm
            bg-[#D23A22] text-white border-[3px] border-[#16141A] shadow-[3px_3px_0px_#16141A]
            hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#16141A] transition-all
            focus-visible:outline-2 focus-visible:outline-white"
        >
          Khám phá thêm <IconArrowRight size={16} aria-hidden />
        </Link>
      </div>
    ),
  },
];

export default function TongKetPage() {
  const favorites = useFavorites();
  const collection = useCollection();
  const stats = computeStats(favorites, collection);
  const slides = STORY_SLIDES(stats);
  const [current, setCurrent] = useState(0);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const goNext = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const goPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  // Điều hướng bằng bàn phím: ← → và Home/End
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Home") setCurrent(0);
      if (e.key === "End") setCurrent(slides.length - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const shareStory = async () => {
    const text = `Tôi đã bấm yêu thích ${stats.total}/15 nhạc cụ trên Ngũ Cung, đã sưu được `
      + `${stats.owned}/15 lá. Họ nhiều nhất: ${ELEMENT_CONFIG[stats.topEl].name}.`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: "Ngũ Cung của tôi", text });
        setShareMsg("Đã mở bảng chia sẻ.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setShareMsg("Đã sao chép câu chuyện vào clipboard.");
      } else {
        setShareMsg("Trình duyệt này không cho chia sẻ — bạn có thể ghi lại tay.");
      }
    } catch {
      setShareMsg("Chia sẻ bị hoãn — không có gì gửi đi.");
    }
  };

  const slide = slides[current]!;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere="mix" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        {/* Tiêu đề + nhãn */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display font-black text-h3 text-white">Ngũ Cung của bạn</h1>
          <span className="text-micro font-black border border-white/20 text-white/40 px-2 py-0.5 rounded">
            Bản thử · Dữ liệu trên máy này
          </span>
        </div>

        {/* Story card */}
        <div
          className="relative w-full max-w-sm rounded-[8px] border-[3px] border-[#16141A] overflow-hidden
            shadow-[8px_8px_0px_#16141A] transition-all duration-500 min-h-[480px] flex flex-col"
          style={{ backgroundColor: slide.bg }}
        >
          {/* Progress dots */}
          <div className="flex gap-1.5 px-4 pt-4 shrink-0">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Thẻ ${i + 1}`}
                aria-current={i === current}
                className="flex-1 h-1 rounded-full transition-all"
                style={{ backgroundColor: i === current ? slide.accent : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>

          {/* Nội dung */}
          <div className="flex-1 flex items-center justify-center p-8">
            {slide.content}
          </div>

          {/* Điều hướng touch */}
          <div className="flex gap-2 px-4 pb-5 shrink-0">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="tap flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-[4px]
                border border-white/20 text-white/60
                hover:text-white disabled:opacity-30 text-body-sm font-bold
                focus-visible:outline-2 focus-visible:outline-[#D23A22]"
            >
              <IconArrowLeft size={14} aria-hidden /> Trước
            </button>
            <button
              onClick={goNext}
              disabled={current === slides.length - 1}
              className="tap flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-[4px]
                border-2 border-[#16141A] font-bold text-body-sm
                shadow-[2px_2px_0px_#16141A] disabled:opacity-30 hover:-translate-y-0.5 transition-all
                focus-visible:outline-2 focus-visible:outline-[#D23A22]"
              style={{ backgroundColor: slide.accent, color: current < 2 ? "#16141A" : "white" }}
            >
              {current === slides.length - 1 ? "Hoàn thành" : (
                <>Tiếp <IconArrowRight size={14} aria-hidden /></>
              )}
            </button>
          </div>
        </div>

        {/* Chia sẻ */}
        <button
          onClick={shareStory}
          className="tap mt-6 flex items-center gap-2 text-body-sm font-bold text-white/60
            hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#D23A22]"
        >
          <IconShare size={16} aria-hidden /> Chia sẻ kết quả (không có dữ liệu cá nhân)
        </button>
        {shareMsg && (
          <p className="mt-2 flex items-center gap-1.5 text-label text-white/50" role="status" aria-live="polite">
            <IconCheck size={12} aria-hidden /> {shareMsg}
          </p>
        )}
      </main>
    </div>
  );
}
