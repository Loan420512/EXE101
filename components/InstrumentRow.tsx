"use client";

/**
 * FILE: components/InstrumentRow.tsx
 * Hàng ngang nhạc cụ phong cách streaming:
 * - Cuộn ngang có snap, edge-peek gợi cuộn
 * - Nút mũi tên trên desktop, vuốt cảm ứng
 * - Phím mũi tên khi focus trong hàng
 * - Nhớ vị trí cuộn
 * - Thẻ phóng to 1.25× khi hover, hiện preview info
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { type Instrument, ELEMENT_CONFIG } from "@/data/instruments";
import { dispatchSceneChange } from "@/data/scenes";
import { type SceneKey } from "@/data/scenes";
import { soundEngine } from "@/lib/audio";
import InstrumentIllustration from "@/components/InstrumentIllustration";
import { toggleFavorite, useFavorites } from "@/lib/favorites";
import { IconChevronLeft, IconChevronRight, IconMusicNote, IconHeart, IconHeartFilled, IconArrowRight } from "@/components/icons";

interface InstrumentRowProps {
  title: string;
  subtitle?: string;
  instruments: Instrument[];
  accentColor?: string;
  /** Màu tag tiêu đề hàng */
  tagColor?: string;
  onCardClick?: (inst: Instrument) => void;
}

const CARD_W = 160; // px — chiều rộng mỗi thẻ (desktop)
const CARD_GAP = 12; // px — khoảng cách giữa thẻ

export default function InstrumentRow({
  title,
  subtitle,
  instruments,
  accentColor = "#F2B632",
  tagColor,
  onCardClick,
}: InstrumentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    // Cuộn khoảng 3 thẻ
    el.scrollBy({ left: dir * (CARD_W + CARD_GAP) * 3, behavior: "smooth" });
  };

  return (
    <section className="relative py-2">
      {/* TIÊU ĐỀ */}
      <div className="flex items-baseline gap-3 px-4 sm:px-6 mb-3">
        {tagColor && (
          <span
            className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: tagColor }}
            aria-hidden
          />
        )}
        <h3 className="font-display font-black text-lg text-white">{title}</h3>
        {subtitle && (
          <span className="text-sm text-white/50">{subtitle}</span>
        )}
        {instruments.length > 5 && (
          <Link
            href="/bo-bai"
            className="ml-auto text-xs font-bold flex items-center gap-1 hover:underline focus-visible:outline-2 focus-visible:outline-[#D23A22]"
            style={{ color: accentColor }}
          >
            Xem tất cả <IconArrowRight size={14} aria-hidden />
          </Link>
        )}
      </div>

      {/* NÚT MŨI TÊN TRÁI */}
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-1)}
            aria-label={`Cuộn hàng ${title} sang trái`}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center
              bg-gradient-to-r from-black/80 to-transparent
              text-white hover:text-[#F2B632] transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconChevronLeft size={24} aria-hidden />
          </button>
        )}

        {/* HÀNG CUỘN */}
        <div
          ref={scrollRef}
          role="list"
          aria-label={`Hàng ${title}`}
          className="flex gap-3 overflow-x-auto px-4 sm:px-6 pb-3
            scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { scrollBy(1); e.preventDefault(); }
            if (e.key === "ArrowLeft") { scrollBy(-1); e.preventDefault(); }
          }}
        >
          {instruments.map((inst) => (
            <InstrumentCard
              key={inst.id}
              instrument={inst}
              isHovered={hoveredId === inst.id}
              onHover={(id) => setHoveredId(id)}
              onLeave={() => setHoveredId(null)}
              onClick={onCardClick}
            />
          ))}
        </div>

        {/* NÚT MŨI TÊN PHẢI */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy(1)}
            aria-label={`Cuộn hàng ${title} sang phải`}
            className="absolute right-0 top-0 bottom-0 z-10 w-16 flex items-center justify-center
              bg-gradient-to-l from-black/80 to-transparent
              text-white hover:text-[#F2B632] transition-colors
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconChevronRight size={24} aria-hidden />
          </button>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Thẻ nhạc cụ đơn lẻ trong hàng
// ─────────────────────────────────────────────────────────────────────────────
interface CardProps {
  instrument: Instrument;
  isHovered: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick?: (inst: Instrument) => void;
}

function InstrumentCard({ instrument: inst, isHovered, onHover, onLeave, onClick }: CardProps) {
  const cfg = ELEMENT_CONFIG[inst.element];
  const favorites = useFavorites();
  const isFav = favorites.includes(inst.id);

  const handleClick = () => {
    dispatchSceneChange(inst.element as SceneKey);
    onClick?.(inst);
  };

  const handlePlaySound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundEngine.playElementTone(inst.element, true);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(inst.id);
    // Rung nhẹ phản hồi trên di động, tôn trọng khi trình duyệt không cho
    try { navigator.vibrate?.(10); } catch { /* bỏ qua */ }
  };

  return (
    <div
      role="listitem"
      className="relative flex-shrink-0 snap-start"
      style={{ width: CARD_W }}
      onMouseEnter={() => onHover(inst.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(inst.id)}
      onBlur={onLeave}
    >
      <div
        className={`relative rounded-[4px] overflow-hidden border-2 cursor-pointer
          transition-all duration-200 origin-bottom
          ${isHovered ? "scale-[1.25] z-20" : "scale-100 z-0"}
        `}
        style={{
          borderColor: isHovered ? cfg.color : "#16141A",
          boxShadow: isHovered
            ? `0 0 0 1px ${cfg.color}, 4px 4px 0px #16141A, 0 0 24px ${cfg.color}40`
            : "3px 3px 0px #16141A",
        }}
      >
        {/* Tranh nhạc cụ */}
        <div
          className="w-full flex items-center justify-center"
          style={{ backgroundColor: cfg.color + "20" }}
          onClick={handleClick}
        >
          <InstrumentIllustration
            instrumentId={inst.id}
            element={inst.element}
            size={CARD_W}
            className="w-full h-auto"
          />
        </div>

        {/* Info dưới thẻ */}
        <div
          className="p-2.5"
          style={{ backgroundColor: "#141618" }}
          onClick={handleClick}
        >
          <p className="font-display font-black text-[13px] text-white truncate">{inst.name}</p>
          <p className="text-[11px] font-medium mt-0.5" style={{ color: cfg.color }}>
            Họ {inst.elementName} • {inst.tone}
          </p>
        </div>

        {/* Preview panel khi hover */}
        {isHovered && (
          <div
            className="absolute inset-x-0 bottom-full mb-2 rounded-[4px] p-3 border-2
              bg-[#0E1014]/96 backdrop-blur-sm z-30"
            style={{ borderColor: cfg.color, boxShadow: `0 0 16px ${cfg.color}40` }}
          >
            <p className="text-[11px] font-bold text-white/70 mb-1 line-clamp-2">
              {inst.summaryVerbatim}
            </p>
            <div className="flex gap-1.5 mt-2">
              {/* Nghe thử */}
              <button
                onClick={handlePlaySound}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[3px] text-[11px] font-bold
                  border border-white/20 text-white hover:bg-white/10 transition-colors"
                aria-label={`Nghe thử ${inst.noteName}`}
              >
                <IconMusicNote size={12} aria-hidden />
                {inst.noteName}
              </button>
              {/* Yêu thích */}
              <button
                onClick={handleFav}
                className={`w-8 flex items-center justify-center rounded-[3px] border transition-colors
                  ${isFav
                    ? "border-red-500 text-red-500 bg-red-500/10"
                    : "border-white/20 text-white/50 hover:text-white"
                  }`}
                aria-label={isFav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                aria-pressed={isFav}
              >
                {isFav ? <IconHeartFilled size={12} aria-hidden /> : <IconHeart size={12} aria-hidden />}
              </button>
            </div>
            {/* Link chi tiết */}
            <Link
              href={`/nhac-cu/${inst.slug}`}
              className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-[3px] text-[11px] font-bold
                border-2 transition-colors"
              style={{
                borderColor: cfg.color, color: cfg.color,
                backgroundColor: cfg.color + "15",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Chi tiết <IconArrowRight size={11} aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
