"use client";

/**
 * FILE: components/NowPlaying.tsx — U4
 * Màn "Đang phát" toàn màn:
 * - Lá bài lớn, trực quan hóa sóng âm theo hành
 * - Màu nền gradient đổi theo hành đang phát
 * - Hàng đợi cuộn, kéo thả thứ tự (đơn giản: bấm để nhảy)
 * - Nút: Phát/Tạm dừng, Trước/Sau, lặp, xáo trộn (UI), hẹn giờ tắt (Sắp có)
 * - "Mô tả âm bằng chữ" cho accessibility
 */

import React, { useEffect, useRef, useState } from "react";
import { player, type PlayerState } from "@/lib/player";
import { ELEMENT_CONFIG } from "@/data/instruments";
import CardFace from "@/components/CardFace";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import {
  IconPlay, IconPause, IconSkipPrev, IconSkipNext,
  IconClose, IconMusicNote, IconClock, IconWarning,
} from "@/components/icons";

interface NowPlayingProps {
  onClose: () => void;
}

export default function NowPlaying({ onClose }: NowPlayingProps) {
  const [ps, setPs] = useState<PlayerState>(player.state);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return player.onUpdate(setPs);
  }, []);

  // Đóng bằng Esc
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Mở màn: chuyển focus vào trong dialog để bàn phím không lọt ra trang phía sau
  useEffect(() => {
    const frame = requestAnimationFrame(() => dialogRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const track = ps.queue[ps.currentIndex] ?? null;
  if (!track) return null;

  const inst = track.instrument;
  const cfg = ELEMENT_CONFIG[inst.element];

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[60] flex flex-col overflow-hidden outline-none"
      style={{
        background: `linear-gradient(160deg, ${cfg.color}55 0%, #0B0C14 45%, #0B0C14 100%)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Màn đang phát"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2 shrink-0">
        <button
          onClick={onClose}
          className="tap w-10 h-10 flex items-center justify-center rounded-full
            text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          aria-label="Thu nhỏ"
        >
          <IconClose size={20} aria-hidden />
        </button>
        <p className="text-label font-black uppercase tracking-widest text-white/50">Đang phát</p>
        <div className="w-10" />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-6 overflow-y-auto">

        {/* Lá bài lớn */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div
            style={{ filter: `drop-shadow(0 0 40px ${cfg.color}80)` }}
            className="transition-all duration-700"
          >
            <CardFace
              name={inst.name}
              element={inst.element}
              tone={inst.tone}
              noteName={inst.noteName}
              instrumentId={inst.id}
              size="lg"
              isInteractive={false}
            />
          </div>

          {/* Tên + Họ */}
          <div className="text-center">
            <h2 className="font-display font-black text-2xl text-white">{inst.name}</h2>
            <p className="text-sm font-medium mt-1" style={{ color: cfg.color }}>
              Họ {inst.elementName} · Âm {inst.tone} ({inst.noteName})
            </p>
            <span
              className="inline-block mt-2 text-micro font-black px-2 py-0.5 rounded border"
              style={{ borderColor: cfg.color + "60", color: cfg.color }}
            >
              Bản thử · Âm mô phỏng, chưa phải thu âm thật
            </span>
          </div>
        </div>

        {/* Cột phải: điều khiển + hàng đợi */}
        <div className="flex flex-col gap-6 w-full max-w-sm">

          {/* Trạng thái: lỗi / đang soạn âm / sẵn sàng */}
          <p className="flex items-center gap-2 text-label" role="status" aria-live="polite">
            {ps.error ? (
              <>
                <IconWarning size={14} className="shrink-0 text-[#D23A22]" aria-hidden />
                <span className="text-[#F2B632]">{ps.error}</span>
              </>
            ) : ps.isBuffering ? (
              <>
                <span className="shrink-0 w-2 h-2 rounded-full bg-[#F2B632] animate-pulse" aria-hidden />
                <span className="text-white/60">Đang soạn âm mô phỏng…</span>
              </>
            ) : (
              <>
                <span
                  className="shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: cfg.color }}
                  aria-hidden
                />
                <span className="text-white/60">
                  {ps.isPlaying ? "Đang phát bản thử" : "Sẵn sàng — bấm Phát để nghe"}
                </span>
              </>
            )}
          </p>

          {/* Visualizer */}
          <WaveformVisualizer
            element={inst.element}
            isPlaying={ps.isPlaying}
            className="w-full h-12"
          />

          {/* Thanh tiến độ */}
          <div className="space-y-1">
            <div
              className="h-2 rounded-full cursor-pointer"
              style={{ backgroundColor: cfg.color + "25" }}
              role="slider"
              tabIndex={0}
              aria-label="Tiến độ bản thử"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(ps.progress * 100)}
              aria-valuetext={`${Math.round(ps.progress * 100)}% của 2.0 giây âm mô phỏng`}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                player.seek((e.clientX - rect.left) / rect.width);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") player.seek(ps.progress + 0.1);
                if (e.key === "ArrowLeft") player.seek(ps.progress - 0.1);
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${ps.progress * 100}%`, backgroundColor: cfg.color }}
              />
            </div>
            <div className="flex justify-between text-label text-white/40 font-mono">
              <span>{Math.round(ps.progress * 2.0 * 10) / 10}s</span>
              <span>2.0s</span>
            </div>
          </div>

          {/* Điều khiển chính */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => player.prev()}
              className="tap w-12 h-12 flex items-center justify-center rounded-full
                text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D23A22]"
              aria-label="Nhạc cụ trước"
            >
              <IconSkipPrev size={24} aria-hidden />
            </button>

            <button
              onClick={() => player.toggle()}
              disabled={Boolean(ps.error)}
              className="tap w-16 h-16 flex items-center justify-center rounded-full
                border-[3px] border-[#16141A] text-[#16141A] font-black
                shadow-[4px_4px_0px_#16141A] hover:-translate-y-0.5
                hover:shadow-[6px_6px_0px_#16141A] active:translate-y-0.5
                active:shadow-none transition-all
                disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none"
              style={{ backgroundColor: cfg.color }}
              aria-label={ps.isPlaying ? "Tạm dừng" : "Phát"}
              aria-pressed={ps.isPlaying}
            >
              {ps.isPlaying
                ? <IconPause size={28} aria-hidden />
                : <IconPlay size={28} aria-hidden />
              }
            </button>

            <button
              onClick={() => player.next()}
              className="tap w-12 h-12 flex items-center justify-center rounded-full
                text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-[#D23A22]"
              aria-label="Nhạc cụ tiếp theo"
            >
              <IconSkipNext size={24} aria-hidden />
            </button>
          </div>

          {/* Mô tả âm bằng chữ (accessibility) */}
          <details className="mt-2">
            <summary className="text-label text-white/40 cursor-pointer hover:text-white/60 flex items-center gap-1.5">
              <IconMusicNote size={12} aria-hidden /> Mô tả âm thanh
            </summary>
            <p className="mt-2 text-label text-white/60 leading-relaxed">
              {inst.timbre} · {inst.summaryVerbatim}
            </p>
          </details>

          {/* Hẹn giờ tắt — Sắp có */}
          <div className="flex items-center gap-2 opacity-40 cursor-not-allowed">
            <IconClock size={14} aria-hidden />
            <span className="text-label text-white">Hẹn giờ tắt</span>
            <span className="text-micro font-bold text-white/50 border border-white/20 px-1.5 py-0.5 rounded ml-auto">
              Sắp có
            </span>
          </div>
        </div>
      </div>

      {/* Hàng đợi */}
      {ps.queue.length >= 1 && (
        <div className="shrink-0 border-t border-white/8 bg-black/30 px-4 py-3">
          <p className="text-label font-black uppercase tracking-widest text-white/40 mb-2">
            Hàng đợi ({ps.queue.length})
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {ps.queue.map((t, i) => {
              const qCfg = ELEMENT_CONFIG[t.instrument.element];
              const isActive = i === ps.currentIndex;
              return (
                <button
                  key={t.instrument.id}
                  onClick={() => {
                    if (ps.currentIndex !== i) player.playTrack(t.instrument);
                  }}
                  className={`tap shrink-0 flex flex-col items-center gap-1 rounded-[4px] px-3 py-2
                    border-2 transition-all focus-visible:outline-2 focus-visible:outline-[#D23A22]
                    ${isActive ? "border-[#16141A] shadow-[2px_2px_0px_#16141A]" : "border-white/15 opacity-60 hover:opacity-90"}`}
                  style={{ backgroundColor: isActive ? qCfg.color : qCfg.color + "20" }}
                  aria-label={t.instrument.name}
                  aria-current={isActive}
                >
                  <span className="text-label font-black leading-tight" style={{ color: isActive ? qCfg.textColor : "white" }}>
                    {t.instrument.name}
                  </span>
                  <span className="text-micro font-bold opacity-70" style={{ color: isActive ? qCfg.textColor : "white" }}>
                    {t.instrument.tone}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
