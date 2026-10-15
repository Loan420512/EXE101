"use client";

/**
 * ==============================================================================
 * FILE: components/board/GameSummary.tsx
 * MỤC ĐÍCH: (U6) Màn tổng kết sau ván — toàn màn hình, không phải hộp thoại nhỏ.
 * Chỉ hiển thị số liệu thật mà lõi luật đã ghi: điểm, số Hợp tấu, từng tổ hợp
 * đã trình tấu. Không xếp hạng ảo, không nhận định bịa.
 * ==============================================================================
 */

import React from "react";
import Link from "next/link";
import type { GameState } from "@/lib/rules/types";
import { ELEMENT_CONFIG } from "@/data/instruments";
import { COMBO_LABELS } from "@/lib/rules/labels";
import { IconTrophy, IconCycle, IconSparkles, IconArrowRight, IconScroll } from "@/components/icons";

interface Props {
  game: GameState;
  onRestart: () => void;
}

export default function GameSummary({ game, onRestart }: Props) {
  const ranked = [...game.players].sort(
    (a, b) => (b.score !== a.score ? b.score - a.score : b.hopTauCount - a.hopTauCount)
  );
  const winner = ranked[0];
  const isDraw = ranked.length > 1 && winner && ranked[1] &&
    winner.score === ranked[1].score && winner.hopTauCount === ranked[1].hopTauCount;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "linear-gradient(180deg, #14121B 0%, #0B0C14 60%)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Tổng kết ván chơi"
    >
      <div className="mx-auto max-w-3xl px-4 py-10 flex flex-col gap-6">
        {/* Ngôi vị */}
        <header className="text-center space-y-3">
          <span className="text-label font-black uppercase tracking-widest text-white/45">
            Ván kết thúc
          </span>
          <div className="mx-auto w-16 h-16 rounded-[6px] border-[3px] border-[#16141A] bg-[#F2B632]
            flex items-center justify-center shadow-[4px_4px_0px_#16141A]">
            <IconTrophy size={34} className="text-[#16141A]" aria-hidden />
          </div>
          <h1 className="font-display font-black text-h2 text-white">
            {isDraw ? "Hòa — phân định bằng số Hợp tấu" : winner ? `${winner.name} thắng ván này` : "Ván kết thúc"}
          </h1>
          <p className="text-body-sm text-white/55">
            Điểm cao nhất {ranked[0]?.score ?? 0} · {game.log.length} diễn biến đã ghi
          </p>
        </header>

        {/* Bảng điểm */}
        <ol className="list-none m-0 p-0 space-y-3">
          {ranked.map((p, idx) => (
            <li key={p.id} className="surface-night p-4">
              <div className="flex items-center gap-3">
                <span
                  className="w-9 h-9 shrink-0 rounded-[4px] border-2 border-[#16141A] flex items-center justify-center
                    font-display font-black text-body-sm"
                  style={{ backgroundColor: idx === 0 ? "#F2B632" : "rgba(255,255,255,.12)", color: idx === 0 ? "#16141A" : "#fff" }}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-black text-body text-white truncate">
                    {p.name}
                    {p.isBot && <span className="ml-2 text-micro font-bold text-white/45">máy</span>}
                  </p>
                  <p className="text-label text-white/55">
                    {p.hopTauCount} Hợp tấu · {p.presentedHistory.length} lượt trình tấu
                  </p>
                </div>
                <p className="font-display font-black text-h3 tabular-nums text-white shrink-0">
                  {p.score}
                  <span className="text-label font-bold text-white/40"> điểm</span>
                </p>
              </div>

              {/* Dấu tiến độ */}
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (p.score / 15) * 100)}%`, backgroundColor: "#D23A22" }}
                />
              </div>

              {p.presentedHistory.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5 list-none m-0 p-0">
                  {p.presentedHistory.map((h, i) => {
                    const lead = ELEMENT_CONFIG[h.cards[0]!.element];
                    const meta = COMBO_LABELS[h.combo] ?? { label: h.combo };
                    return (
                      <li
                        key={i}
                        className="text-micro font-bold rounded-[3px] px-1.5 py-0.5 border"
                        style={{ backgroundColor: lead.color + "22", color: lead.color, borderColor: lead.color + "55" }}
                      >
                        {meta.label} +{h.score}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ol>

        {/* Diễn biến cuối */}
        <details className="surface-night p-4">
          <summary className="text-label font-bold text-white/70 cursor-pointer flex items-center gap-2">
            <IconScroll size={16} aria-hidden /> Xem {Math.min(game.log.length, 40)} diễn biến cuối
          </summary>
          <ul className="mt-3 space-y-1 list-none m-0 p-0 text-label text-white/60">
            {game.log.slice(-40).reverse().map((entry, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-white/25 tabular-nums shrink-0">{game.log.length - i}</span>
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </details>

        {/* Hành động */}
        <footer className="flex flex-wrap gap-3 pb-10">
          <button
            onClick={onRestart}
            className="tap flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 rounded-[4px]
              border-[3px] border-[#16141A] bg-[#D23A22] text-white font-black text-body-sm
              shadow-[3px_3px_0px_#16141A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#16141A]
              active:translate-y-0 active:shadow-none transition-all
              focus-visible:outline-2 focus-visible:outline-white"
          >
            <IconCycle size={18} aria-hidden /> Chia bài ván mới
          </button>
          <Link
            href="/luat-choi"
            className="cta-ghost flex-1 justify-center min-w-[160px]"
          >
            <IconSparkles size={16} aria-hidden /> Xem lại luật
          </Link>
          <Link
            href="/choi"
            className="cta-ghost flex-1 justify-center min-w-[160px]"
          >
            Trung tâm Chơi <IconArrowRight size={16} aria-hidden />
          </Link>
        </footer>
      </div>
    </div>
  );
}
