"use client";

/**
 * ==============================================================================
 * FILE: app/quiz/page.tsx
 * MỤC ĐÍCH: Trắc nghiệm tương tác "Bạn hợp họ nào trong Ngũ Cung" (/quiz):
 * - 5 câu hỏi tình huống sinh động, dễ hiểu cho trẻ từ 7 tuổi và gia đình
 * - Tính điểm và trả về kết quả 1 trong 5 hành ngũ sắc kèm 1 lá bài đại diện
 * - Phát âm thanh ngũ âm của hành kết quả
 * - Thẻ kết quả kèm nút sao chép chia sẻ
 * - Ghi chú rõ: Đây là trò chơi giải trí vui khám phá văn hóa.
 * ==============================================================================
 */

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import TeamFaqFooter from "@/components/TeamFaqFooter";
import ColorRibbon from "@/components/ColorRibbon";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import CardFace from "@/components/CardFace";
import { ElementType, ELEMENT_CONFIG, INSTRUMENTS, Instrument } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";

interface Question {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    icon: string;
    element: ElementType;
  }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Khi nghe nhạc, âm thanh nào khiến bạn thấy cuốn hút nhất?",
    subtitle: "Hãy chọn cảm xúc đầu tiên bạn liên tưởng tới",
    options: [
      { text: "Tiếng trống trầm ấm, vững chãi, đôn hậu", icon: "🥁", element: "tho" },
      { text: "Tiếng chuông ngân vang, sắc sảo, trong trẻo", icon: "🔔", element: "kim" },
      { text: "Tiếng sáo vi vu, mộc mạc như gió qua lũy tre", icon: "🎋", element: "moc" },
      { text: "Tiếng đàn sôi động, rực lửa, bùng nổ khí thế", icon: "🔥", element: "hoa" },
      { text: "Tiếng vĩ lượn sóng, mềm mại, sâu lắng như dòng sông", icon: "🌊", element: "thuy" },
    ],
  },
  {
    id: 2,
    question: "Bạn thích ở trong không gian thiên nhiên nào nhất?",
    subtitle: "Nơi giúp bạn cảm thấy thư giãn và tràn đầy năng lượng",
    options: [
      { text: "Vùng đất cao nguyên, đồi đất màu mỡ rộng lớn", icon: "⛰️", element: "tho" },
      { text: "Đỉnh núi đá vôi hùng vĩ, bầu trời sáng lấp lánh", icon: "✨", element: "kim" },
      { text: "Khu rừng nhiệt đới bạt ngàn chồi non xanh mát", icon: "🌲", element: "moc" },
      { text: "Bên đống lửa trại rực rỡ dưới bầu trời đêm", icon: "⛺", element: "hoa" },
      { text: "Bờ biển xanh biếc hay suối nguồn róc rách", icon: "🏝️", element: "thuy" },
    ],
  },
  {
    id: 3,
    question: "Khi chơi trò chơi cùng bạn bè, phong cách của bạn là gì?",
    subtitle: "Cách bạn thường hành động trong một nhóm",
    options: [
      { text: "Bình tĩnh, là điểm tựa đáng tin cậy cho cả đội", icon: "🛡️", element: "tho" },
      { text: "Quyết đoán, đưa ra chiến lược chính xác và sắc bén", icon: "⚔️", element: "kim" },
      { text: "Khéo léo, kết nối mọi người và tạo niềm vui tự nhiên", icon: "🤝", element: "moc" },
      { text: "Nhiệt huyết, truyền lửa và xung phong dẫn đầu", icon: "🚀", element: "hoa" },
      { text: "Biến hóa, linh hoạt ứng biến theo mọi tình huống", icon: "🔄", element: "thuy" },
    ],
  },
  {
    id: 4,
    question: "Màu sắc nào trong tranh dân gian Đông Hồ thu hút bạn nhất?",
    subtitle: "Màu sắc mang lại cho bạn cảm giác thân thuộc",
    options: [
      { text: "Vàng nghệ ấm áp của đất mẹ phù sa", icon: "🟡", element: "tho" },
      { text: "Bạc ánh sáng của kim loại và mẹ điệp", icon: "⚪", element: "kim" },
      { text: "Xanh lá tre mộc mạc của cỏ cây đồng nội", icon: "🟢", element: "moc" },
      { text: "Đỏ son thắm đượm như hoa đào ngày Tết", icon: "🔴", element: "hoa" },
      { text: "Chàm sẫm huyền bí của dòng nước và trời đêm", icon: "🔵", element: "thuy" },
    ],
  },
  {
    id: 5,
    question: "Nếu được học một nhạc cụ dân tộc ngay hôm nay, bạn muốn thử:",
    subtitle: "Nhạc cụ nào khơi gợi sự tò mò trong bạn?",
    options: [
      { text: "Đàn đá cổ xưa với tiếng gõ trầm hùng ngàn năm", icon: "🪨", element: "tho" },
      { text: "Trống đồng hay Cồng chiêng vang dội khắp buôn làng", icon: "🪘", element: "kim" },
      { text: "Sáo trúc hay Đàn T'rưng rộn rã trong trẻo", icon: "🪈", element: "moc" },
      { text: "Kèn bầu hay Đàn tỳ bà biến ảo rộn ràng", icon: "🎺", element: "hoa" },
      { text: "Đàn bầu độc huyền hay Đàn tranh réo rắt dịu êm", icon: "🎻", element: "thuy" },
    ],
  },
];

const REPRESENTATIVE_INSTRUMENTS: Record<ElementType, string> = {
  tho: "dan-da",
  kim: "trong-dong",
  moc: "sao-truc",
  hoa: "dan-ty-ba",
  thuy: "dan-bau",
};

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [scores, setScores] = useState<Record<ElementType, number>>({
    tho: 0,
    kim: 0,
    moc: 0,
    hoa: 0,
    thuy: 0,
  });
  const [resultElement, setResultElement] = useState<ElementType | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const handleSelectOption = (el: ElementType) => {
    const nextScores = { ...scores, [el]: scores[el] + 1 };
    setScores(nextScores);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Tính hành có điểm cao nhất
      let bestEl: ElementType = "tho";
      let maxScore = -1;
      (Object.keys(nextScores) as ElementType[]).forEach((key) => {
        if (nextScores[key] > maxScore) {
          maxScore = nextScores[key];
          bestEl = key;
        }
      });
      setResultElement(bestEl);
      soundEngine.playElementTone(bestEl, true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({ tho: 0, kim: 0, moc: 0, hoa: 0, thuy: 0 });
    setResultElement(null);
  };

  const handleShareResult = async () => {
    if (!resultElement || typeof window === "undefined") return;
    const cfg = ELEMENT_CONFIG[resultElement];
    const text = `Tôi vừa làm trắc nghiệm Ngũ Cung và kết quả là hợp với hành ${cfg.name} (Âm ${cfg.tone})! Hãy cùng khám phá tại ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kết quả trắc nghiệm Ngũ Cung: Hành ${cfg.name}`,
          text,
          url: window.location.href,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  };

  const currentQ = QUIZ_QUESTIONS[currentStep]!;
  const repInst: Instrument | undefined = resultElement
    ? INSTRUMENTS.find((i) => i.id === REPRESENTATIVE_INSTRUMENTS[resultElement])
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#16141A] dark:text-[#E8EAE0]">
      <LivingBackground forceAtmosphere={resultElement || "mix"} />

      <Header />

      <main className={`flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full realm-${resultElement || "hoa"}`}>
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
        <div className="text-center mb-8">
          <span className="text-xs font-black tracking-widest uppercase text-[#A36A00] dark:text-[#F2B632] block mb-2">
            TRẮC NGHIỆM TƯƠNG TÁC VĂN HÓA
          </span>
          <h1
            className="font-display font-black text-3xl sm:text-4xl text-[#1A1720] dark:text-[#EAE8D8]"
            style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
          >
            Bạn hợp họ nào trong Ngũ Cung?
          </h1>
          <p
            className="mt-2 text-xs sm:text-sm text-[#534E5C] dark:text-[#A8A4B2]"
            style={{ lineHeight: "var(--lh-body)" }}
          >
            Trả lời 5 câu hỏi vui ngắn để khám phá thanh âm cổ truyền đại diện cho tâm hồn bạn.
          </p>
          <div className="inline-block mt-2 px-2.5 py-1 rounded-[4px] bg-amber-100 dark:bg-stone-800 text-[11px] font-bold text-[#1A1720] dark:text-[#EAE8D8] border border-amber-300 dark:border-stone-700">
            Trò chơi giải trí vui • Khám phá sở thích âm nhạc truyền thống
          </div>
        </div>

        {!resultElement ? (
          /* ========================================================
             GIAO DIỆN CÂU HỎI TRẮC NGHIỆM
             ======================================================== */
          <div className="bg-white dark:bg-[#1E1C23] p-6 sm:p-8 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[6px_6px_0px_#1A1720] dark:shadow-[6px_6px_0px_#EAE8D8] paper-board animate-fade-in">
            {/* THANH TIẾN ĐỘ */}
            <div className="flex items-center justify-between text-xs font-bold mb-3 text-[#534E5C] dark:text-[#A8A4B2]">
              <span>Câu hỏi {currentStep + 1} / {QUIZ_QUESTIONS.length}</span>
              <span className="tabular-nums">{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden mb-6">
              <div
                className="bg-[#CC3520] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* NỘI DUNG CÂU HỎI */}
            <div className="mb-6">
              <h2
                className="font-display font-black text-xl sm:text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-1"
                style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
              >
                {currentQ.question}
              </h2>
              <p className="text-xs text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
                {currentQ.subtitle}
              </p>
            </div>

            {/* DANH SÁCH 5 LỰA CHỌN */}
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.element)}
                  className="w-full p-4 rounded-[4px] border-2 border-[#1A1720] dark:border-[#EAE8D8] bg-[#E8EAE0]/30 dark:bg-stone-800/80 text-left hover:bg-amber-50 dark:hover:bg-stone-700/80 hover:-translate-y-0.5 active:translate-y-0 shadow-[2px_2px_0px_#1A1720] dark:shadow-[2px_2px_0px_#EAE8D8] transition-all cursor-pointer flex items-center gap-3.5 paper-board"
                >
                  <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1A1720] dark:text-[#EAE8D8]">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ========================================================
             KẾT QUẢ TRẮC NGHIỆM
             ======================================================== */
          <div className="bg-white dark:bg-[#1E1C23] p-6 sm:p-10 rounded-[6px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] shadow-[8px_8px_0px_#1A1720] dark:shadow-[8px_8px_0px_#EAE8D8] paper-board text-center animate-scale-in">
            <span className="text-xs font-black tracking-widest uppercase text-[#CC3520] block mb-1">
              CHÚC MỪNG BẠN • KẾT QUẢ ĐÃ SẴN SÀNG
            </span>
            <h2
              className="font-display font-black text-3xl sm:text-4xl text-[#1A1720] dark:text-[#EAE8D8] mb-2"
              style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em" }}
            >
              Bạn mang tâm hồn họ {ELEMENT_CONFIG[resultElement].name}
            </h2>
            <p className="text-sm font-black text-[#A36A00] dark:text-[#F2B632] mb-6">
              Âm sắc chủ đạo: {ELEMENT_CONFIG[resultElement].tone} (Nốt {ELEMENT_CONFIG[resultElement].note})
            </p>

            {/* LÁ BÀI 3D ĐẠI DIỆN */}
            {repInst && (
              <div className="flex flex-col items-center justify-center my-6">
                <CardFace
                  name={repInst.name}
                  element={repInst.element}
                  tone={repInst.tone}
                  noteName={repInst.noteName}
                  size="md"
                  isInteractive={true}
                />
                <span className="mt-3 text-xs font-bold text-stone-600 dark:text-stone-300">
                  Lá bài đại diện: <strong>{repInst.name}</strong>
                </span>
              </div>
            )}

            {/* MÔ TẢ ĐẶC TÍNH */}
            <div className="p-4 rounded bg-stone-100 dark:bg-stone-800 text-xs sm:text-sm text-[#16141A] dark:text-[#E8EAE0] leading-relaxed max-w-xl mx-auto mb-8 border border-stone-300 dark:border-stone-700">
              {ELEMENT_CONFIG[resultElement].description}
            </div>

            {/* CỤM NÚT TƯƠNG TÁC */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => soundEngine.playElementTone(resultElement, true)}
                className="px-4 py-2 text-xs font-bold bg-[#D23A22] text-white rounded border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] hover:bg-[#b8311c] cursor-pointer flex items-center gap-2"
              >
                <span>🎵</span>
                <span>Nghe lại thanh âm {ELEMENT_CONFIG[resultElement].tone}</span>
              </button>

              <button
                onClick={handleShareResult}
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-stone-700 text-[#16141A] dark:text-[#E8EAE0] rounded border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] hover:bg-stone-50 cursor-pointer flex items-center gap-2"
              >
                <span>🔗</span>
                <span>{shareCopied ? "✓ Đã sao chép!" : "Chia sẻ kết quả"}</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold bg-stone-200 dark:bg-stone-800 text-[#16141A] dark:text-[#E8EAE0] rounded border-2 border-[#16141A] dark:border-[#E8EAE0] shadow-[2px_2px_0px_#16141A] hover:bg-stone-300 cursor-pointer"
              >
                🔄 Chơi lại Quiz
              </button>
            </div>
          </div>
        )}

        <ColorRibbon />
      </main>

      <TeamFaqFooter />
    </div>
  );
}
