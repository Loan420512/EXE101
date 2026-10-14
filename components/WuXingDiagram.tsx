"use client";

/**
 * ==============================================================================
 * FILE: components/WuXingDiagram.tsx
 * MỤC ĐÍCH: Sơ đồ ngũ giác tương tác trực quan cho Ngũ âm và Ngũ hành.
 * QUY CÁCH:
 * - Nút chuyển chế độ: Tương sinh / Tương khắc
 * - Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → về Mộc
 * - Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc
 * - Bấm vào từng hành để nghe nốt và xem đặc tính, nhạc cụ, quy luật vận hành
 * ==============================================================================
 */

import React, { useState } from "react";
import { WUXING_DATA } from "@/data/content";
import { ElementType } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";

export default function WuXingDiagram() {
  const [relationMode, setRelationMode] = useState<"sheng" | "ke">("sheng");
  const [activeElementId, setActiveElementId] = useState<ElementType>("moc");

  // Vị trí 5 hành trên vòng tròn ngũ giác (tọa độ SVG 320x320)
  // Góc: 0 = đỉnh (Hỏa: -90 deg), sau đó quay theo chiều kim đồng hồ
  // labelX/Y: nhãn âm đặt ra ngoài đủ xa, tránh chồng chéo với tên hành và đường kẻ
  const nodePositions: Record<ElementType, { cx: number; cy: number; labelX: number; labelY: number }> = {
    hoa:  { cx: 160, cy: 52,  labelX: 160, labelY: 22  }, // Đỉnh trên — nhãn lên cao
    tho:  { cx: 258, cy: 126, labelX: 294, labelY: 128 }, // Phải trên — nhãn ra xa phải
    kim:  { cx: 222, cy: 244, labelX: 248, labelY: 268 }, // Phải dưới — nhãn xuống phải
    thuy: { cx: 98,  cy: 244, labelX: 72,  labelY: 268 }, // Trái dưới — nhãn xuống trái
    moc:  { cx: 62,  cy: 126, labelX: 26,  labelY: 128 }, // Trái trên — nhãn ra xa trái
  };

  const handleSelectElement = (elemId: ElementType) => {
    setActiveElementId(elemId);
    soundEngine.playElementTone(elemId);
  };

  const currentElement = WUXING_DATA.elements.find((e) => e.id === activeElementId)!;

  return (
    <section id="ngu-hanh" className="py-20 realm-tho relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TIÊU ĐỀ */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-[#F2B632] on-photo-kicker block mb-2" style={{ lineHeight: "var(--lh-caption)" }}>
            TRIẾT LÝ ÂM DƯƠNG NGŨ HÀNH
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl on-photo-heading" style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}>
            {WUXING_DATA.title}
          </h2>
          <p className="mt-2 text-sm on-photo-muted" style={{ lineHeight: "var(--lh-body)" }}>
            {WUXING_DATA.description}
          </p>
        </div>

        {/* NÚT CHUYỂN TƯƠNG SINH / TƯƠNG KHẮC */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setRelationMode("sheng")}
            className={`dongho-btn px-5 py-2.5 text-xs font-bold ${
              relationMode === "sheng"
                ? "bg-[#3F7D3B] text-white"
                : "bg-white dark:bg-[#1D1B22] text-[#16141A] dark:text-[#E8EAE0]"
            }`}
          >
            🌿 Vòng Tương Sinh (Nuôi dưỡng)
          </button>
          <button
            onClick={() => setRelationMode("ke")}
            className={`dongho-btn px-5 py-2.5 text-xs font-bold ${
              relationMode === "ke"
                ? "bg-[#D23A22] text-white"
                : "bg-white dark:bg-[#1D1B22] text-[#16141A] dark:text-[#E8EAE0]"
            }`}
          >
            ⚡ Sao Tương Khắc (Chế ngự)
          </button>
        </div>

        {/* KHUNG HIỂN THỊ TƯƠNG TÁC: SƠ ĐỒ SVG & THẺ THÔNG TIN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-[#1D1B22] rounded-[4px] border-[3px] border-[#16141A] dark:border-[#E8EAE0] shadow-[6px_6px_0px_#16141A] dark:shadow-[6px_6px_0px_#E8EAE0] p-6 lg:p-10">
          {/* CỘT TRÁI: SƠ ĐỒ NGŨ GIÁC SVG */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-[320px] h-[320px]">
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full select-none"
                aria-label="Sơ đồ ngũ hành ngũ âm"
              >
                <defs>
                  {/* Mũi tên đầu đường kẻ */}
                  <marker
                    id="arrow-sheng"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill="#3F7D3B" />
                  </marker>
                  <marker
                    id="arrow-ke"
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill="#D23A22" />
                  </marker>
                </defs>

                {/* VÒNG TRÒN NỀN MỜ */}
                <circle
                  cx="160"
                  cy="160"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* ĐƯỜNG LIÊN KẾT TƯƠNG SINH (Vòng ngũ giác ngoài: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc)
                    Mỗi cạnh là một <line> riêng có mũi tên để thấy chiều nuôi dưỡng rõ ràng */}
                {relationMode === "sheng" && (() => {
                  const shengPairs: [ElementType, ElementType][] = [
                    ["moc", "hoa"], ["hoa", "tho"], ["tho", "kim"], ["kim", "thuy"], ["thuy", "moc"],
                  ];
                  return (
                    <g>
                      {shengPairs.map(([from, to], i) => {
                        const f = nodePositions[from];
                        const t = nodePositions[to];
                        // Rút ngắn đường kẻ để không chui vào bên trong node (r=22)
                        const dx = t.cx - f.cx;
                        const dy = t.cy - f.cy;
                        const len = Math.sqrt(dx * dx + dy * dy);
                        const pad = 24; // khoảng cách từ tâm node đến đầu đường
                        const x1 = f.cx + (dx / len) * pad;
                        const y1 = f.cy + (dy / len) * pad;
                        const x2 = t.cx - (dx / len) * pad;
                        const y2 = t.cy - (dy / len) * pad;
                        return (
                          <line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="#3F7D3B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            markerEnd="url(#arrow-sheng)"
                            opacity="0.9"
                          />
                        );
                      })}
                    </g>
                  );
                })()}

                {/* ĐƯỜNG LIÊN KẾT TƯƠNG KHẮC (Sao ngũ giác: Mộc→Thổ, Thổ→Thủy, Thủy→Hỏa, Hỏa→Kim, Kim→Mộc)
                    Mỗi đường chéo là một <line> riêng — tránh fill ẩn khi dùng path Z */}
                {relationMode === "ke" && (() => {
                  const kePairs: [ElementType, ElementType][] = [
                    ["moc", "tho"], ["tho", "thuy"], ["thuy", "hoa"], ["hoa", "kim"], ["kim", "moc"],
                  ];
                  return (
                    <g>
                      {kePairs.map(([from, to], i) => {
                        const f = nodePositions[from];
                        const t = nodePositions[to];
                        const dx = t.cx - f.cx;
                        const dy = t.cy - f.cy;
                        const len = Math.sqrt(dx * dx + dy * dy);
                        const pad = 24;
                        const x1 = f.cx + (dx / len) * pad;
                        const y1 = f.cy + (dy / len) * pad;
                        const x2 = t.cx - (dx / len) * pad;
                        const y2 = t.cy - (dy / len) * pad;
                        return (
                          <line
                            key={i}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="#D23A22"
                            strokeWidth="2"
                            strokeDasharray="5 3"
                            strokeLinecap="round"
                            markerEnd="url(#arrow-ke)"
                            opacity="0.85"
                          />
                        );
                      })}
                    </g>
                  );
                })()}

                {/* 5 NÚT NGŨ HÀNH */}
                {WUXING_DATA.elements.map((elem) => {
                  const pos = nodePositions[elem.id as ElementType];
                  const isSelected = activeElementId === elem.id;

                  return (
                    <g
                      key={elem.id}
                      onClick={() => handleSelectElement(elem.id as ElementType)}
                      className="cursor-pointer group"
                    >
                      {/* Vòng hào quang khi chọn — dùng pulse opacity thay ping scale để không bị lệch trong SVG */}
                      {isSelected && (
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r="30"
                          fill="none"
                          stroke={elem.color}
                          strokeWidth="2.5"
                          strokeOpacity="0.6"
                          className="animate-pulse"
                        />
                      )}

                      {/* Nút chính */}
                      <circle
                        cx={pos.cx}
                        cy={pos.cy}
                        r="22"
                        fill={elem.color}
                        stroke="#16141A"
                        strokeWidth="3"
                        className="group-hover:scale-110 transition-transform origin-center"
                      />

                      {/* Tên hành ở tâm nút */}
                      <text
                        x={pos.cx}
                        y={pos.cy + 5}
                        textAnchor="middle"
                        fill={elem.textColor}
                        fontWeight="900"
                        fontSize="13"
                        className="font-display pointer-events-none"
                      >
                        {elem.name}
                      </text>

                      {/* Tên âm ở ngoài nút — căn theo hướng của từng node */}
                      <text
                        x={pos.labelX}
                        y={pos.labelY}
                        textAnchor={
                          elem.id === "hoa"  ? "middle" :
                          elem.id === "tho"  ? "start"  :
                          elem.id === "kim"  ? "start"  :
                          elem.id === "thuy" ? "end"    :
                          /* moc */            "end"
                        }
                        fill="currentColor"
                        fontWeight="700"
                        fontSize="11"
                        className="font-display pointer-events-none opacity-70"
                      >
                        {elem.tone}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#524F59] dark:text-[#A8A6B0] mt-3">
              ✦ Bấm vào nút hành để nghe âm thanh và xem thông tin chi tiết
            </span>
          </div>

          {/* CỘT PHẢI: BẢNG GIẢI NGHĨA QUY LUẬT CỦA HÀNH ĐANG CHỌN */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div
              style={{
                backgroundColor: `${currentElement.color}20`,
                borderColor: currentElement.color,
              }}
              className="p-5 rounded-[4px] border-2 border-[#16141A] dark:border-[#E8EAE0] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-black/15 dark:border-white/15 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: currentElement.color }}
                    className="w-4 h-4 rounded-full border border-black inline-block"
                  />
                  <h3 className="font-display font-black text-2xl text-[#16141A] dark:text-[#E8EAE0]">
                    Họ {currentElement.name} • Âm {currentElement.tone}
                  </h3>
                </div>
                <button
                  onClick={() => soundEngine.playElementTone(activeElementId, true)}
                  className="px-2.5 py-1 rounded bg-[#16141A] text-white dark:bg-[#E8EAE0] dark:text-[#16141A] text-xs font-bold flex items-center gap-1"
                >
                  <span>🔊 {currentElement.note}</span>
                </button>
              </div>

              <p className="text-sm font-medium text-[#16141A] dark:text-[#E8EAE0]">
                {currentElement.character}
              </p>

              <div className="text-xs text-[#524F59] dark:text-[#A8A6B0]">
                <strong className="text-[#16141A] dark:text-[#E8EAE0]">Các nhạc cụ đại diện: </strong>
                {currentElement.instrumentsText}
              </div>

              {/* MỐI QUAN HỆ ĐANG XEM */}
              <div className="mt-2 p-3 rounded bg-white dark:bg-[#1D1B22] border border-[#16141A]/20 dark:border-[#E8EAE0]/20">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase text-[#D23A22]">
                    {relationMode === "sheng" ? "🌿 Quy luật Tương sinh:" : "⚡ Quy luật Tương khắc:"}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#16141A] dark:text-[#E8EAE0]">
                  {relationMode === "sheng" ? currentElement.shengDesc : currentElement.keDesc}
                </p>
              </div>
            </div>

            {/* MÔ TẢ ĐẦY ĐỦ QUY LUẬT TOÀN DIỆN */}
            <div className="p-4 rounded-[4px] bg-[#E8EAE0] dark:bg-stone-800/60 border border-[#16141A]/30 dark:border-[#E8EAE0]/30 text-xs space-y-1.5">
              <div className="font-bold text-[#16141A] dark:text-[#E8EAE0]">
                <strong>Vòng tương sinh: </strong> Mộc sinh Hỏa → Hỏa sinh Thổ → Thổ sinh Kim → Kim sinh Thủy → Thủy sinh Mộc.
              </div>
              <div className="font-bold text-[#16141A] dark:text-[#E8EAE0]">
                <strong>Vòng tương khắc: </strong> Mộc khắc Thổ → Thổ khắc Thủy → Thủy khắc Hỏa → Hỏa khắc Kim → Kim khắc Mộc.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
