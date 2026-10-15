"use client";

/**
 * FILE: app/phong-nhac/page.tsx — U5 Phòng Nhạc
 * Chơi nhạc cụ ngay trên trình duyệt:
 * - 5 nốt ngũ âm theo hành, bố cục chạm: dây / gõ / thổi
 * - Hiệu ứng gợn ripple khi chạm
 * - Khu vực "Ghi và lặp" (3 lớp + vận chuyển, nhãn Sắp có) và "Hợp tấu tương sinh"
 *   (chọn 2 nhạc cụ, nghe 2 âm mô phỏng cùng lúc, đọc quan hệ theo chu trình luật)
 * - Âm mô phỏng Web Audio, ghi rõ nhãn "âm mô phỏng"
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import Header from "@/components/Header";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import InstrumentArt from "@/components/InstrumentArt";
import {
  INSTRUMENTS, ELEMENT_CONFIG, ELEMENT_ORDER, type ElementType, type Instrument,
} from "@/data/instruments";
import { soundEngine, OCTAVE_FREQUENCIES } from "@/lib/audio";
import { player } from "@/lib/player";
import { SHENG_CYCLE, KE_CYCLE } from "@/lib/rules/engine";
import { COMBO_LABELS } from "@/lib/rules/labels";
import { dispatchSceneChange } from "@/data/scenes";
import type { SceneKey } from "@/data/scenes";
import {
  IconCycle, IconUsers, IconVolume, IconVolumeMute, IconInfo, IconMusicNote,
  IconClose, IconSparkles, IconWarning,
} from "@/components/icons";

// Đại diện 1 nhạc cụ cho mỗi hành (5 nhạc cụ chính)
const FEATURED_INSTRUMENTS = ELEMENT_ORDER.map((el) =>
  INSTRUMENTS.find((i) => i.element === el)!
);

// Bố cục phím theo loại nhạc cụ
const LAYOUT_TYPE: Record<string, "string" | "percussion" | "wind"> = {
  "dan-bau": "string", "dan-tranh": "string", "dan-nhi": "string",
  "dan-ty-ba": "string", "dan-trung": "string",
  "cong-chieng": "percussion", "trong-dong": "percussion", "thanh-la": "percussion",
  "trong-com": "percussion", "trong-chau": "percussion", "phach": "percussion",
  "dan-da": "percussion",
  "sao-truc": "wind", "ken-bau": "wind", "tu-va": "wind",
};

const NOTE_NAMES = ["Cung", "Thương", "Giốc", "Chủy", "Vũ"];
const NOTE_ELEMENTS: ElementType[] = ["tho", "kim", "moc", "hoa", "thuy"];

interface Ripple { id: number; x: number; y: number; color: string }

export default function PhongNhacPage() {
  const [activeInst, setActiveInst] = useState(FEATURED_INSTRUMENTS[0]!);
  const [pressedNote, setPressedNote] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundEngine.getIsMuted());
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounter = useRef(0);

  const layout = LAYOUT_TYPE[activeInst.id] ?? "percussion";
  const cfg = ELEMENT_CONFIG[activeInst.element];

  const toggleSound = () => setIsMuted(soundEngine.toggleMute());

  // Đổi cảnh nền khi chọn nhạc cụ
  useEffect(() => {
    dispatchSceneChange(activeInst.element as SceneKey);
  }, [activeInst.element]);

  const playNote = useCallback((noteIdx: number, e?: React.PointerEvent | React.MouseEvent) => {
    const el = NOTE_ELEMENTS[noteIdx]!;
    const freqs = OCTAVE_FREQUENCIES[el];
    const freq = freqs.oct4;
    soundEngine.playCustomTone(el, freq, 1.0);

    setPressedNote(noteIdx);
    setTimeout(() => setPressedNote(null), 200);

    // Rung thật trên máy hỗ trợ (Android/Chrome); iOS không có API này nên bỏ qua.
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(18); } catch { /* trình duyệt từ chối */ }
    }

    // Ripple
    const rect = (e?.currentTarget as HTMLElement)?.getBoundingClientRect?.();
    const x = e && rect ? e.clientX - rect.left : 50;
    const y = e && rect ? e.clientY - rect.top : 50;
    const id = ++rippleCounter.current;
    const color = ELEMENT_CONFIG[el].color;
    setRipples((prev) => [...prev, { id, x, y, color }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere={activeInst.element} activeScene={activeInst.element} />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full px-4 sm:px-6 pb-28">

        {/* Tiêu đề + nhãn âm mô phỏng + công tắc tiếng */}
        <div className="flex flex-wrap items-center gap-3 mt-8 mb-2">
          <h1 className="font-display font-black text-h2 text-white">Phòng Nhạc</h1>
          <span className="surface-night text-micro font-bold px-2.5 py-1 text-white/70">
            Âm mô phỏng · Chưa phải thu âm thật
          </span>
          <button
            onClick={toggleSound}
            aria-pressed={!isMuted}
            className={`tap ml-auto flex items-center gap-2 px-4 py-2 rounded-[4px] border-2
              border-[#16141A] font-black text-body-sm transition-all
              shadow-[2px_2px_0px_#16141A] active:translate-y-0.5 active:shadow-none
              focus-visible:outline-2 focus-visible:outline-[#D23A22]
              ${isMuted ? "bg-white/10 text-white/70" : "text-white"}`}
            style={isMuted ? undefined : { backgroundColor: cfg.color, color: cfg.textColor }}
          >
            {isMuted ? <IconVolumeMute size={18} aria-hidden /> : <IconVolume size={18} aria-hidden />}
            {isMuted ? "Bật tiếng" : "Tắt tiếng"}
          </button>
        </div>

        {isMuted && (
          <p className="text-body-sm text-white/55 mb-4 flex items-center gap-2">
            <IconInfo size={16} aria-hidden />
            Đang tắt tiếng — chạm vẫn thấy rung và gợn, nhưng chưa nghe được âm.
          </p>
        )}

        {/* CHỌN NHẠC CỤ */}
        <div
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6"
          role="tablist"
          aria-label="Chọn nhạc cụ"
        >
          {FEATURED_INSTRUMENTS.map((inst) => {
            const c = ELEMENT_CONFIG[inst.element];
            const active = inst.id === activeInst.id;
            return (
              <button
                key={inst.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveInst(inst)}
                className={`tap shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-[4px]
                  border-2 border-[#16141A] font-bold text-[13px] transition-all
                  shadow-[2px_2px_0px_#16141A] focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${active
                    ? "shadow-[3px_3px_0px_#16141A] -translate-y-0.5"
                    : "opacity-60 hover:opacity-90"
                  }`}
                style={{ backgroundColor: active ? c.color : c.color + "25", color: active ? c.textColor : "white" }}
              >
                <span className="text-label font-black uppercase tracking-wide">{c.name}</span>
                <span className="font-display font-black text-xs">{inst.name}</span>
                <span className="text-label opacity-70">{c.tone}</span>
              </button>
            );
          })}
        </div>

        {/* BÀN PHÍM NHẠC CỤ */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <p className="text-sm font-medium text-white/60 mb-2">
            {layout === "string" && "Bấm/chạm dây để gảy âm"}
            {layout === "percussion" && "Bấm/chạm mặt trống để gõ âm"}
            {layout === "wind" && "Bấm/chạm lỗ sáo để thổi âm"}
          </p>

          {layout === "string" && (
            <StringLayout notes={NOTE_NAMES} noteEls={NOTE_ELEMENTS}
              pressedNote={pressedNote} ripples={ripples} onPlay={playNote} />
          )}
          {layout === "percussion" && (
            <PercussionLayout notes={NOTE_NAMES} noteEls={NOTE_ELEMENTS}
              pressedNote={pressedNote} ripples={ripples} onPlay={playNote} />
          )}
          {layout === "wind" && (
            <WindLayout notes={NOTE_NAMES} noteEls={NOTE_ELEMENTS}
              pressedNote={pressedNote} ripples={ripples} onPlay={playNote} />
          )}

          {/* Đưa nhạc cụ này vào trình phát toàn cục (U4) */}
          <button
            onClick={() => player.playTrack(activeInst)}
            className="tap mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px]
              border-2 border-[#16141A] font-black text-body-sm text-white/80
              bg-white/8 hover:bg-white/16 shadow-[2px_2px_0px_#16141A]
              active:translate-y-0.5 active:shadow-none transition-all
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            <IconMusicNote size={16} aria-hidden />
            Nghe cả lá {activeInst.name}
          </button>
        </div>

        {/* KHU VỰC: GHI VÀ LẶP + HỢP TẤU — dựng đủ giao diện, phần chưa chạy gắn nhãn "Sắp có" */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
          <LoopStudioUI activeInst={activeInst} />
          <EnsembleUI activeInst={activeInst} />
        </div>
      </main>
    </div>
  );
}

// ─── Bố cục dây (String) ────────────────────────────────────────────────────
function StringLayout({ notes, noteEls, pressedNote, ripples, onPlay }: KeyboardProps) {
  return (
    <div className="w-full max-w-lg space-y-3" role="group" aria-label="5 dây ngũ âm">
      {notes.map((note, i) => {
        const cfg = ELEMENT_CONFIG[noteEls[i]!];
        const pressed = pressedNote === i;
        const noteRipples = ripples.filter((r) => r.color === cfg.color);
        return (
          <button
            key={note}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPlay(i, e); }}
            className={`tap relative w-full h-14 rounded-[4px] border-[3px] border-[#16141A]
              overflow-hidden cursor-pointer transition-all duration-75
              shadow-[3px_3px_0px_#16141A] focus-visible:outline-2 focus-visible:outline-[#D23A22]
              ${pressed ? "translate-y-0.5 shadow-[1px_1px_0px_#16141A]" : "hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#16141A]"}`}
            style={{ backgroundColor: pressed ? cfg.color : cfg.color + "30" }}
            aria-label={`Gảy dây ${note} (${cfg.note})`}
          >
            {/* Dây */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
              <div
                className="w-full h-[2px] transition-transform"
                style={{
                  backgroundColor: cfg.color,
                  transform: pressed ? "scaleY(3)" : "scaleY(1)",
                }}
              />
            </div>
            {/* Nhãn */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="font-display font-black text-sm text-white">{note}</span>
              <span className="text-label font-bold text-white/60">{cfg.note}</span>
            </div>
            <Ripples ripples={noteRipples} />
          </button>
        );
      })}
    </div>
  );
}

// ─── Bố cục gõ (Percussion) ─────────────────────────────────────────────────
function PercussionLayout({ notes, noteEls, pressedNote, ripples, onPlay }: KeyboardProps) {
  return (
    <div className="grid grid-cols-5 gap-3 w-full max-w-lg" role="group" aria-label="5 mặt gõ ngũ âm">
      {notes.map((note, i) => {
        const cfg = ELEMENT_CONFIG[noteEls[i]!];
        const pressed = pressedNote === i;
        const noteRipples = ripples.filter((r) => r.color === cfg.color);
        return (
          <button
            key={note}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPlay(i, e); }}
            className={`tap relative aspect-square rounded-full border-[3px] border-[#16141A]
              overflow-hidden cursor-pointer transition-all
              shadow-[4px_4px_0px_#16141A] focus-visible:outline-2 focus-visible:outline-[#D23A22]
              ${pressed ? "scale-95 shadow-[1px_1px_0px_#16141A]" : "hover:scale-105 hover:shadow-[6px_6px_0px_#16141A]"}`}
            style={{ backgroundColor: pressed ? cfg.color : cfg.color + "25" }}
            aria-label={`Gõ ${note} (${cfg.note})`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-black text-base text-white">{note}</span>
              <span className="text-label font-bold text-white/60">{cfg.note}</span>
            </div>
            {/* Vòng tròn đồng tâm trang trí */}
            <div className="absolute inset-[20%] rounded-full border border-[#16141A]/30 pointer-events-none" />
            <div className="absolute inset-[35%] rounded-full border border-[#16141A]/20 pointer-events-none" />
            <Ripples ripples={noteRipples} />
          </button>
        );
      })}
    </div>
  );
}

// ─── Bố cục thổi (Wind) ─────────────────────────────────────────────────────
function WindLayout({ notes, noteEls, pressedNote, ripples, onPlay }: KeyboardProps) {
  return (
    <div className="relative w-full max-w-xs" role="group" aria-label="5 lỗ sáo ngũ âm">
      {/* Thân ống sáo */}
      <div className="h-14 bg-[#3A7535] rounded-[4px] border-[3px] border-[#16141A] shadow-[4px_4px_0px_#16141A]
        flex items-center px-6 gap-3 relative overflow-hidden">
        {/* Lỗ thổi */}
        <div className="w-4 h-4 rounded-full bg-[#16141A] border-2 border-[#16141A] shrink-0" />
        {/* 5 lỗ bấm */}
        {notes.map((note, i) => {
          const cfg = ELEMENT_CONFIG[noteEls[i]!];
          const pressed = pressedNote === i;
          const noteRipples = ripples.filter((r) => r.color === cfg.color);
          return (
            <button
              key={note}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPlay(i, e); }}
              className={`tap relative w-9 h-9 rounded-full border-[3px] border-[#16141A]
                flex-1 max-w-[44px] overflow-hidden cursor-pointer transition-all
                focus-visible:outline-2 focus-visible:outline-[#D23A22]
                ${pressed ? "scale-90" : "hover:scale-110"}`}
              style={{ backgroundColor: pressed ? cfg.color : cfg.color + "70" }}
              aria-label={`Thổi ${note} (${cfg.note})`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-micro font-black text-white">
                {note[0]}
              </span>
              <Ripples ripples={noteRipples} />
            </button>
          );
        })}
      </div>
      {/* Nhãn nốt bên dưới */}
      <div className="flex gap-3 px-6 mt-2 justify-end">
        {notes.map((note, i) => {
          const cfg = ELEMENT_CONFIG[noteEls[i]!];
          return (
            <span key={note} className="flex-1 max-w-[44px] text-center text-label font-bold" style={{ color: cfg.color }}>
              {cfg.note}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ripple effect ───────────────────────────────────────────────────────────
function Ripples({ ripples }: { ripples: Ripple[] }) {
  return (
    <>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full animate-ping"
          style={{
            left: r.x - 16, top: r.y - 16, width: 32, height: 32,
            backgroundColor: r.color + "60",
            animationDuration: "0.5s",
          }}
        />
      ))}
    </>
  );
}

// ─── Ghi và lặp (U5) ─────────────────────────────────────────────────────────
// Dải sóng minh hoạ dùng biên độ cố định — không random để giao diện ổn định.
const LANE_SHAPE = [0.30, 0.58, 0.42, 0.74, 0.36, 0.66, 0.50, 0.82, 0.32, 0.70, 0.54, 0.78];
const LOOP_TEMPOS = [72, 88, 104];
const LOOP_BEATS = [4, 8, 16];

function SoonBadge() {
  return (
    <span className="text-micro font-black border border-[#F2B632]/45 text-[#F2B632] px-2 py-0.5 rounded shrink-0">
      Sắp có
    </span>
  );
}

function LaneDot({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label} — Sắp có`}
      title={`${label} — Sắp có`}
      className="tap-dot opacity-35 cursor-not-allowed text-white/70"
    >
      {icon}
    </button>
  );
}

function LoopStudioUI({ activeInst }: { activeInst: Instrument }) {
  const cfg = ELEMENT_CONFIG[activeInst.element];
  const [tempo, setTempo] = useState(88);
  const [beats, setBeats] = useState(8);

  const choiceChip = (isActive: boolean) =>
    `tap flex-1 py-2.5 rounded-[4px] border-2 text-label font-bold transition-all
     focus-visible:outline-2 focus-visible:outline-[#D23A22]
     ${isActive
       ? "bg-[#F2B632] text-[#16141A] border-[#16141A] shadow-[2px_2px_0px_#16141A]"
       : "border-white/20 text-white/60 hover:text-white"}`;

  return (
    <section
      className="bg-white/4 border border-white/10 rounded-[4px] p-5"
      aria-labelledby="ghi-va-lap-heading"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/55"><IconCycle size={20} aria-hidden /></span>
        <h2 id="ghi-va-lap-heading" className="font-display font-black text-h4 text-white">
          Ghi và lặp
        </h2>
        <SoonBadge />
      </div>
      <p className="text-label text-white/45 mb-4 kid-advanced">
        Ghi một vòng ngắn rồi phát lặp, chồng thêm nhạc cụ khác — tối đa 3 lớp.
      </p>
      <p className="text-body-sm text-white/55 mb-4 kid-simple">
        Thu tiếng một câu ngắn, nghe đi nghe lại, rồi chồng thêm nhạc cụ khác.
      </p>

      {/* 3 lane */}
      <ul className="space-y-2">
        {[0, 1, 2].map((i) => {
          const filled = i === 0;
          return (
            <li
              key={i}
              className={`flex items-center gap-2 rounded-[4px] border-2 px-2 py-1
                ${filled ? "border-[#16141A] bg-white/6" : "border-dashed border-white/15"}`}
            >
              <span
                className="shrink-0 w-10 text-micro font-black uppercase tracking-wide"
                style={{ color: filled ? cfg.color : "rgba(255,255,255,.35)" }}
              >
                Lớp {i + 1}
              </span>

              {filled ? (
                <>
                  <InstrumentArt
                    instrumentId={activeInst.id}
                    element={activeInst.element}
                    size={36}
                    variant={0}
                    className="shrink-0 rounded-[3px] border-2 border-[#16141A]"
                  />
                  <span className="shrink-0 text-label font-bold text-white/80 max-w-[88px] truncate">
                    {activeInst.name}
                  </span>
                </>
              ) : (
                <span className="shrink-0 text-label text-white/35">Bỏ trống</span>
              )}

              {/* Dải sóng minh hoạ (chưa phải sóng thu thật) */}
              <span className="flex-1 min-w-0 flex items-end gap-[3px] h-7" aria-hidden>
                {LANE_SHAPE.map((h, j) => (
                  <span
                    key={j}
                    className="flex-1 rounded-[1px]"
                    style={{
                      height: `${(filled ? h : 0.12) * 100}%`,
                      backgroundColor: filled ? cfg.color + "99" : "rgba(255,255,255,.14)",
                    }}
                  />
                ))}
              </span>

              <span className="shrink-0 flex items-center -mr-2">
                <LaneDot label={`Tắt tiếng lớp ${i + 1}`} icon={<IconVolumeMute size={14} aria-hidden />} />
                <LaneDot label={`Xoá lớp ${i + 1}`} icon={<IconClose size={14} aria-hidden />} />
              </span>
            </li>
          );
        })}
      </ul>

      {/* Thước phách */}
      <div className="flex items-end gap-1 mt-4" aria-hidden>
        {Array.from({ length: beats }, (_, i) => (
          <span key={i} className="flex-1 flex flex-col items-center gap-1">
            <span
              className="w-[2px] rounded"
              style={{
                height: i % 4 === 0 ? 14 : 7,
                backgroundColor: i % 4 === 0 ? cfg.color : "rgba(255,255,255,.22)",
              }}
            />
            {i % 4 === 0 && (
              <span className="text-micro font-bold text-white/35 leading-none">{i + 1}</span>
            )}
          </span>
        ))}
      </div>

      {/* Nhịp độ + độ dài vòng */}
      <div className="mt-4 space-y-2">
        <p className="text-micro font-black uppercase tracking-wider text-white/40">Nhịp độ</p>
        <div className="flex gap-2">
          {LOOP_TEMPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTempo(t)}
              aria-pressed={tempo === t}
              className={choiceChip(tempo === t)}
            >
              {t} BPM
            </button>
          ))}
        </div>
        <p className="text-micro font-black uppercase tracking-wider text-white/40 pt-1">Độ dài vòng</p>
        <div className="flex gap-2">
          {LOOP_BEATS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBeats(b)}
              aria-pressed={beats === b}
              className={choiceChip(beats === b)}
            >
              {b} phách
            </button>
          ))}
        </div>
      </div>

      {/* Vận chuyển — khoá cho tới khi có trình thu âm */}
      <div className="flex items-center gap-2 flex-wrap mt-5">
        <button
          type="button"
          disabled
          aria-label="Ghi vòng — Sắp có"
          title="Sắp có — cần trình thu âm"
          className="tap inline-flex items-center gap-2 px-4 rounded-[4px] border-2 border-[#16141A]
            bg-[#D23A22] text-white font-black text-body-sm opacity-45 cursor-not-allowed"
        >
          <span className="w-3 h-3 rounded-full bg-white" aria-hidden />
          Ghi vòng {beats} phách
        </button>
        <button
          type="button"
          disabled
          aria-label="Phát lặp — Sắp có"
          title="Sắp có — cần trình thu âm"
          className="tap inline-flex items-center gap-2 px-4 rounded-[4px] border-2 border-white/20
            text-white/70 font-black text-body-sm opacity-45 cursor-not-allowed"
        >
          <IconCycle size={16} aria-hidden />
          Lặp
        </button>
        <button
          type="button"
          disabled
          aria-label="Xoá tất cả lớp — Sắp có"
          title="Sắp có — cần trình thu âm"
          className="tap inline-flex items-center gap-2 px-4 rounded-[4px] border-2 border-white/20
            text-white/70 font-black text-body-sm opacity-45 cursor-not-allowed"
        >
          <IconClose size={16} aria-hidden />
          Xoá hết
        </button>
      </div>

      <p className="flex gap-2 text-label text-white/40 mt-3 kid-advanced">
        <IconWarning size={14} className="shrink-0 mt-0.5" aria-hidden />
        <span>
          Nhịp độ và độ dài vòng chỉ là lựa chọn trên màn này, chưa lưu đi đâu. Nút Ghi cần micro
          và trình thu âm nhạc cụ thật nên đang khoá.
        </span>
      </p>
      <p className="flex gap-2 text-body-sm text-white/55 mt-3 kid-simple">
        <IconWarning size={14} className="shrink-0" aria-hidden />
        <span>Nút Ghi chưa bật được vì cần micro thu tiếng đàn thật.</span>
      </p>
    </section>
  );
}

// ─── Hợp tấu tương sinh (U5) ─────────────────────────────────────────────────
type EnsembleRelation = {
  label: string;
  detail: string;
  color: string;
  mark: React.ReactNode;
};

/** Quan hệ ngũ hành giữa hai hành — đọc từ chu trình tương sinh / tương khắc của lõi luật. */
function relationOf(a: ElementType, b: ElementType): EnsembleRelation {
  const A = ELEMENT_CONFIG[a];
  const B = ELEMENT_CONFIG[b];

  if (a === b) {
    return {
      label: `Cùng họ ${A.name}`,
      detail: `Hai nhạc cụ cùng một hành, âm chồng lên nhau. Trên bàn chơi, ba lá cùng họ ghép thành `
        + `${COMBO_LABELS["dong-am"]!.label} (${COMBO_LABELS["dong-am"]!.score} điểm), `
        + `hoặc ${COMBO_LABELS["hop-tau"]!.label} (${COMBO_LABELS["hop-tau"]!.score} điểm) nếu là ba nhạc cụ khác nhau.`,
      color: A.color,
      mark: <IconMusicNote size={16} aria-hidden />,
    };
  }
  if (SHENG_CYCLE[a] === b) {
    return {
      label: `${A.name} sinh ${B.name} · Tương sinh`,
      detail: `${A.name} nuôi ${B.name}: lớp ${B.name} lớn lên trên lớp ${A.name}, hai âm quyện nhau `
        + `chứ không đánh nhau. Trên bàn chơi, hai lá ${A.name} và ${B.name} ghép thành `
        + `${COMBO_LABELS["lien-hoan"]!.label} (${COMBO_LABELS["lien-hoan"]!.score} điểm) `
        + `và được nhận thêm 1 lá từ Chợ Nhạc.`,
      color: "#3F7D3B",
      mark: <IconSparkles size={16} aria-hidden />,
    };
  }
  if (SHENG_CYCLE[b] === a) {
    return {
      label: `${B.name} sinh ${A.name} · Tương sinh`,
      detail: `${B.name} nuôi ${A.name}: lớp ${A.name} nhận đỡ từ lớp ${B.name}, hai âm quyện nhau `
        + `chứ không đánh nhau. Trên bàn chơi, hai lá ${A.name} và ${B.name} ghép thành `
        + `${COMBO_LABELS["lien-hoan"]!.label} (${COMBO_LABELS["lien-hoan"]!.score} điểm) `
        + `và được nhận thêm 1 lá từ Chợ Nhạc.`,
      color: "#3F7D3B",
      mark: <IconSparkles size={16} aria-hidden />,
    };
  }
  if (KE_CYCLE[a] === b) {
    return {
      label: `${A.name} khắc ${B.name} · Tương khắc`,
      detail: `${A.name} chèn ép ${B.name}: hai âm đẩy nhau, lớp sau bị lớp trước dìm. Trên bàn chơi, `
        + `lá ${A.name} dùng để Phá âm lá ${B.name} của đối thủ.`,
      color: "#D23A22",
      mark: <IconWarning size={16} aria-hidden />,
    };
  }
  if (KE_CYCLE[b] === a) {
    return {
      label: `${B.name} khắc ${A.name} · Tương khắc`,
      detail: `${B.name} chèn ép ${A.name}: hai âm đẩy nhau, lớp trước bị lớp sau dìm. Trên bàn chơi, `
        + `lá ${B.name} dùng để Phá âm lá ${A.name} của đối thủ.`,
      color: "#D23A22",
      mark: <IconWarning size={16} aria-hidden />,
    };
  }
  return {
    label: `${A.name} — ${B.name}`,
    detail: "Hai hành không sinh cũng không khắc nhau theo vòng Ngũ Cung.",
    color: "#F2B632",
    mark: <IconInfo size={16} aria-hidden />,
  };
}

function EnsembleUI({ activeInst }: { activeInst: Instrument }) {
  const [aId, setAId] = useState(activeInst.id);
  const [bId, setBId] = useState(
    () => INSTRUMENTS.find((i) => SHENG_CYCLE[activeInst.element] === i.element && i.id !== activeInst.id)?.id
      ?? INSTRUMENTS[1]!.id
  );

  const a = INSTRUMENTS.find((i) => i.id === aId) ?? INSTRUMENTS[0]!;
  const b = INSTRUMENTS.find((i) => i.id === bId) ?? INSTRUMENTS[1]!;
  const rel = relationOf(a.element, b.element);

  const playPair = () => {
    for (const inst of [a, b]) {
      soundEngine.playCustomTone(inst.element, OCTAVE_FREQUENCIES[inst.element].oct4, 1.0);
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate(18); } catch { /* trình duyệt từ chối */ }
    }
  };

  const selectCls =
    `tap w-full px-3 py-2 rounded-[3px] border-2 border-[#16141A] text-body-sm font-bold
     focus-visible:outline-2 focus-visible:outline-[#D23A22] cursor-pointer`;

  return (
    <section
      className="bg-white/4 border border-white/10 rounded-[4px] p-5"
      aria-labelledby="hop-tau-heading"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/55"><IconUsers size={20} aria-hidden /></span>
        <h2 id="hop-tau-heading" className="font-display font-black text-h4 text-white">
          Hợp tấu tương sinh
        </h2>
        <SoonBadge />
      </div>
      <p className="text-label text-white/45 mb-4 kid-advanced">
        Chọn hai nhạc cụ, nghe nốt của hai hành vang cùng lúc và đọc quan hệ theo luật Ngũ Cung.
      </p>
      <p className="text-body-sm text-white/55 mb-4 kid-simple">
        Chọn hai nhạc cụ, bấm nghe để xem hai tiếng có hợp nhau không.
      </p>

      {/* Hai ô chọn nhạc cụ */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-end">
        {([a, b] as const).map((inst, idx) => {
          const c = ELEMENT_CONFIG[inst.element];
          const isA = idx === 0;
          return (
            <React.Fragment key={idx}>
              {!isA && (
                <span className="hidden sm:flex items-center justify-center font-display font-black text-white/40 pb-3">
                  +
                </span>
              )}
              <label className="block">
                <span className="block text-micro font-black uppercase tracking-wider text-white/40 mb-1">
                  Lớp {isA ? "1" : "2"}
                </span>
                <select
                  value={inst.id}
                  onChange={(e) => (isA ? setAId(e.target.value) : setBId(e.target.value))}
                  aria-label={`Chọn nhạc cụ cho lớp ${isA ? "1" : "2"}`}
                  className={selectCls}
                  style={{ backgroundColor: c.color, color: c.textColor }}
                >
                  {INSTRUMENTS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — họ {o.elementName}
                    </option>
                  ))}
                </select>
                <span className="flex items-center gap-2 mt-1.5">
                  <InstrumentArt
                    instrumentId={inst.id}
                    element={inst.element}
                    size={28}
                    variant={idx}
                    className="shrink-0 rounded-[3px] border-2 border-[#16141A]"
                  />
                  <span className="text-label font-bold" style={{ color: c.color }}>
                    {c.tone} · {c.note}
                  </span>
                </span>
              </label>
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setAId(activeInst.id)}
        className="text-label font-bold text-white/45 hover:text-white/80 underline underline-offset-2
          mt-2 focus-visible:outline-2 focus-visible:outline-[#D23A22]"
      >
        Lấy nhạc cụ đang chơi ({activeInst.name}) làm lớp 1
      </button>

      {/* Đọc quan hệ ngũ hành */}
      <div
        className="mt-4 rounded-[4px] border-2 p-4"
        style={{ borderColor: rel.color, backgroundColor: rel.color + "1F" }}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ color: rel.color }}>{rel.mark}</span>
          <p className="font-display font-black text-body-sm text-white">{rel.label}</p>
        </div>
        <p className="text-label text-white/70 leading-relaxed">{rel.detail}</p>
      </div>

      {/* Vận chuyển */}
      <div className="flex items-center gap-2 flex-wrap mt-4">
        <button
          type="button"
          onClick={playPair}
          className="tap inline-flex items-center gap-2 px-5 rounded-[4px] border-2 border-[#16141A]
            font-black text-body-sm text-white shadow-[2px_2px_0px_#16141A]
            active:translate-y-0.5 active:shadow-none transition-all
            focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          style={{ backgroundColor: rel.color }}
          aria-label={`Nghe ${a.name} và ${b.name} cùng lúc — âm mô phỏng`}
        >
          <IconMusicNote size={16} aria-hidden />
          Nghe hai âm cùng lúc
        </button>
        <button
          type="button"
          disabled
          aria-label="Hợp tấu ba nhạc cụ — Sắp có"
          title="Sắp có"
          className="tap inline-flex items-center gap-2 px-4 rounded-[4px] border-2 border-white/20
            text-white/70 font-black text-body-sm opacity-45 cursor-not-allowed"
        >
          <IconUsers size={16} aria-hidden />
          Chồng lớp thứ 3
        </button>
      </div>

      <p className="flex gap-2 text-label text-white/40 mt-3 kid-advanced">
        <IconInfo size={14} className="shrink-0 mt-0.5" aria-hidden />
        <span>
          Hai âm phát ra là âm mô phỏng bằng Web Audio, chưa phải thu âm nhạc cụ thật. Hợp tấu
          nhiều người và lưu bản hợp tấu là tính năng Sắp có.
        </span>
      </p>
      <p className="text-body-sm text-white/50 mt-3 kid-simple">
        Hai tiếng ở đây do máy tạo ra, chưa phải tiếng đàn thật. Chơi cùng bạn đang làm, sắp có.
      </p>
    </section>
  );
}

type KeyboardProps = {
  notes: string[];
  noteEls: ElementType[];
  pressedNote: number | null;
  ripples: Ripple[];
  onPlay: (i: number, e?: React.PointerEvent | React.MouseEvent) => void;
};
