"use client";

/**
 * ==============================================================================
 * FILE: app/san-choi-ngu-am/page.tsx
 * MỤC ĐÍCH: Sân chơi ngũ âm tương tác (/san-choi-ngu-am):
 * - Bàn phím 5 nốt (Cung, Thương, Giốc, Chủy, Vũ) hỗ trợ 3 quãng tám (Trầm - Trung - Cao)
 * - Tương tác qua chuột, chạm màn hình hoặc bàn phím máy tính (phím 1-5, A-G)
 * - Chọn âm sắc mô phỏng theo 5 hành (Thổ, Kim, Mộc, Hỏa, Thủy)
 * - Ghi âm chuỗi nốt 10 giây, phát lại và chia sẻ giai điệu bằng URL
 * ==============================================================================
 */

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import { IconLink } from "@/components/icons";
import { ElementType, ELEMENT_CONFIG } from "@/data/instruments";
import { soundEngine, OCTAVE_FREQUENCIES } from "@/lib/audio";

interface RecordedNote {
  element: ElementType;
  octave: "oct3" | "oct4" | "oct5";
  timeMs: number;
}

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const [selectedTimbre, setSelectedTimbre] = useState<ElementType>("tho");
  const [octave, setOctave] = useState<"oct3" | "oct4" | "oct5">("oct4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeKey, setActiveKey] = useState<ElementType | null>(null);

  // Trạng thái ghi âm 10s
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<RecordedNote[]>(() => {
    const melodyParam = searchParams.get("melody");
    if (melodyParam) {
      try {
        const decoded: RecordedNote[] = JSON.parse(decodeURIComponent(melodyParam));
        if (Array.isArray(decoded)) return decoded;
      } catch {}
    }
    return [];
  });
  const recordStartTimeRef = useRef<number>(0);
  const [recordProgress, setRecordProgress] = useState(0);

  // Trạng thái phát lại
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const notesList: { id: ElementType; name: string; tone: string; note: string; keyHint: string }[] = [
    { id: "tho", name: "Thổ", tone: "Cung", note: "C", keyHint: "1 (A)" },
    { id: "kim", name: "Kim", tone: "Thương", note: "D", keyHint: "2 (S)" },
    { id: "moc", name: "Mộc", tone: "Giốc", note: "E", keyHint: "3 (D)" },
    { id: "hoa", name: "Hỏa", tone: "Chủy", note: "G", keyHint: "4 (F)" },
    { id: "thuy", name: "Thủy", tone: "Vũ", note: "A", keyHint: "5 (G)" },
  ];

  // Phát nốt nhạc
  const playNote = useCallback(
    (el: ElementType, oct: "oct3" | "oct4" | "oct5" = octave) => {
      const freq = OCTAVE_FREQUENCIES[el][oct];
      soundEngine.playCustomTone(selectedTimbre, freq, 0.7);
      setIsPlaying(true);
      setActiveKey(el);
      setTimeout(() => setActiveKey(null), 200);
      setTimeout(() => setIsPlaying(false), 800);

      if (isRecording) {
        const elapsed = performance.now() - recordStartTimeRef.current;
        setRecordedNotes((prev) => [...prev, { element: el, octave: oct, timeMs: elapsed }]);
      }
    },
    [octave, selectedTimbre, isRecording]
  );

  // Điều khiển bàn phím máy tính
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key.toLowerCase()) {
        case "1":
        case "a":
          playNote("tho");
          break;
        case "2":
        case "s":
          playNote("kim");
          break;
        case "3":
        case "d":
          playNote("moc");
          break;
        case "4":
        case "f":
          playNote("hoa");
          break;
        case "5":
        case "g":
          playNote("thuy");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playNote]);

  // Bộ đếm thời gian ghi âm 10 giây
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      const elapsed = performance.now() - recordStartTimeRef.current;
      const progress = Math.min(100, (elapsed / 10000) * 100);
      setRecordProgress(progress);

      if (elapsed >= 10000) {
        setIsRecording(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    soundEngine.setMuted(false);
    setRecordedNotes([]);
    setRecordProgress(0);
    recordStartTimeRef.current = performance.now();
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  // Phát lại giai điệu
  const handlePlayback = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    soundEngine.setMuted(false);
    setIsPlayingBack(true);

    recordedNotes.forEach((n) => {
      setTimeout(() => {
        const freq = OCTAVE_FREQUENCIES[n.element][n.octave];
        soundEngine.playCustomTone(selectedTimbre, freq, 0.7);
        setActiveKey(n.element);
        setTimeout(() => setActiveKey(null), 200);
      }, n.timeMs);
    });

    const totalDuration = recordedNotes[recordedNotes.length - 1]?.timeMs || 1000;
    setTimeout(() => setIsPlayingBack(false), totalDuration + 800);
  };

  // Chia sẻ giai điệu qua liên kết
  const handleShareMelody = async () => {
    if (recordedNotes.length === 0 || typeof window === "undefined") return;
    const encoded = encodeURIComponent(JSON.stringify(recordedNotes));
    const url = `${window.location.origin}/san-choi-ngu-am?melody=${encoded}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere={selectedTimbre} />

      <Header />

      <main className={`flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full realm-${selectedTimbre}`}>
        {/* NÚT QUAY LẠI */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC3520] hover:underline"
          >
            ← Quay lại Trang chủ Ngũ Cung
          </Link>
        </div>

        {/* TIÊU ĐỀ */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-black tracking-widest uppercase text-[#A36A00] dark:text-[#F2B632] block mb-2">
            TƯƠNG TÁC ÂM HỌC TRỰC TUYẾN
          </span>
          <h1
            className="font-display font-black text-3xl sm:text-5xl text-[#1A1720] dark:text-[#EAE8D8]"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Sân chơi Ngũ Âm
          </h1>
          <p
            className="mt-3 text-sm sm:text-base text-[#534E5C] dark:text-[#A8A4B2]"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            Bấm các nốt Cung, Thương, Giốc, Chủy, Vũ bằng phím số (1-5) hoặc chuột. Ghi âm giai điệu của riêng bạn và chia sẻ cùng bạn bè!
          </p>
        </div>

        {/* BẢNG ĐIỀU KHIỂN: ÂM SẮC HÀNH & QUÃNG TÁM */}
        <div className="bg-white dark:bg-[#1E1C23] p-6 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[6px_6px_0px_#1A1720] dark:shadow-[6px_6px_0px_#EAE8D8] paper-board mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-stone-200 dark:border-stone-800 pb-6 mb-6">
            {/* CHỌN ÂM SẮC HÀNH */}
            <div className="w-full md:w-auto">
              <span className="text-xs font-black tracking-wider uppercase block text-[#524F59] dark:text-[#A8A6B0] mb-2">
                1. Chọn âm sắc nhạc cụ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(["tho", "kim", "moc", "hoa", "thuy"] as ElementType[]).map((el) => {
                  const cfg = ELEMENT_CONFIG[el];
                  const isSelected = selectedTimbre === el;
                  return (
                    <button
                      key={el}
                      onClick={() => setSelectedTimbre(el)}
                      style={isSelected ? { backgroundColor: cfg.color, color: el === "kim" || el === "tho" ? "#16141A" : "#FFFFFF" } : {}}
                      className={`px-3 py-1.5 rounded text-xs font-bold border-2 border-[#16141A] cursor-pointer transition-transform ${
                        !isSelected ? "bg-stone-100 dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0]" : "scale-105 shadow-[2px_2px_0px_#16141A]"
                      }`}
                    >
                      {cfg.name} ({cfg.tone})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHỌN QUÃNG TÁM */}
            <div className="w-full md:w-auto">
              <span className="text-xs font-black tracking-wider uppercase block text-[#524F59] dark:text-[#A8A6B0] mb-2">
                2. Chọn quãng tám:
              </span>
              <div className="inline-flex rounded border-2 border-[#16141A] bg-stone-100 dark:bg-stone-800 p-0.5">
                <button
                  onClick={() => setOctave("oct3")}
                  className={`px-3 py-1 text-xs font-bold rounded ${octave === "oct3" ? "bg-[#16141A] text-white" : ""}`}
                >
                  Trầm (Quãng 3)
                </button>
                <button
                  onClick={() => setOctave("oct4")}
                  className={`px-3 py-1 text-xs font-bold rounded ${octave === "oct4" ? "bg-[#16141A] text-white" : ""}`}
                >
                  Chuẩn (Quãng 4)
                </button>
                <button
                  onClick={() => setOctave("oct5")}
                  className={`px-3 py-1 text-xs font-bold rounded ${octave === "oct5" ? "bg-[#16141A] text-white" : ""}`}
                >
                  Bổng (Quãng 5)
                </button>
              </div>
            </div>
          </div>

          {/* BÀN PHÍM NĂM NỐT NGŨ CUNG */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 mb-8">
            {notesList.map((n) => {
              const cfg = ELEMENT_CONFIG[n.id];
              const isHit = activeKey === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => playNote(n.id)}
                  style={{
                    backgroundColor: isHit ? "#16141A" : cfg.color,
                    color: isHit ? "#FFFFFF" : cfg.textColor,
                  }}
                  className={`h-40 rounded-[6px] border-[3px] border-[#16141A] flex flex-col justify-between p-4 text-center cursor-pointer select-none transition-all duration-75 shadow-[4px_6px_0px_#16141A] active:translate-y-1 active:shadow-[1px_1px_0px_#16141A] ${
                    isHit ? "scale-95 ring-4 ring-[#D23A22]" : "hover:-translate-y-1"
                  }`}
                >
                  <div className="flex justify-between items-center text-[11px] font-bold opacity-80">
                    <span>{n.keyHint}</span>
                    <span>{n.note}</span>
                  </div>

                  <div className="my-auto">
                    <span className="font-display font-black text-2xl sm:text-3xl block leading-tight">
                      {n.tone}
                    </span>
                    <span className="text-xs font-semibold block mt-1">
                      Hành {n.name}
                    </span>
                  </div>

                  <div className="text-[10px] font-mono font-bold bg-black/10 rounded py-0.5">
                    {OCTAVE_FREQUENCIES[n.id][octave]} Hz
                  </div>
                </button>
              );
            })}
          </div>

          {/* KHU VỰC GHI ÂM 10S & PHÁT LẠI */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-100 dark:bg-stone-800 p-4 rounded border border-[#16141A]/20">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-4 py-2 bg-[#D23A22] text-white text-xs font-bold rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#b8311c] cursor-pointer flex items-center gap-2"
                >
                  <span>⏺</span> Ghi âm 10 giây
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded border-2 border-red-500 animate-pulse cursor-pointer flex items-center gap-2"
                >
                  <span>⏹</span> Dừng ghi ({Math.round(10 - (recordProgress / 10))}s)
                </button>
              )}

              {recordedNotes.length > 0 && !isRecording && (
                <>
                  <button
                    onClick={handlePlayback}
                    disabled={isPlayingBack}
                    className="px-4 py-2 bg-[#3F7D3B] text-white text-xs font-bold rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#346a30] cursor-pointer disabled:opacity-50"
                  >
                    {isPlayingBack ? "Đang phát..." : "▶ Nghe lại"}
                  </button>

                  <button
                    onClick={handleShareMelody}
                    className="px-3.5 py-2 bg-white dark:bg-stone-700 text-[#16141A] dark:text-[#E8EAE0] text-xs font-bold rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-stone-50 cursor-pointer"
                  >
                    {shareCopied ? "✓ Đã copy link!" : <span className="inline-flex items-center gap-1.5"><IconLink size={13} aria-hidden /> Chia sẻ giai điệu</span>}
                  </button>
                </>
              )}
            </div>

            {/* THANH SÓNG ÂM THỜI GIAN THỰC */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-500">Phổ tần:</span>
              <WaveformVisualizer element={selectedTimbre} isPlaying={isPlaying || isPlayingBack} />
            </div>
          </div>

          {/* TIẾN ĐỘ GHI ÂM */}
          {isRecording && (
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#D23A22] h-full transition-all duration-75"
                style={{ width: `${recordProgress}%` }}
              />
            </div>
          )}
        </div>
      </main>

      <TeamFaqFooter />
    </div>
  );
}

export default function SanChoiNguAmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E8EAE0] p-8 text-center font-bold">Đang tải sân chơi...</div>}>
      <PlaygroundInner />
    </Suspense>
  );
}
