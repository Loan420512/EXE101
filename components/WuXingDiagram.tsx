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
  const nodePositions: Record<ElementType, { cx: number; cy: number; labelX: number; labelY: number }> = {
    hoa: { cx: 160, cy: 50, labelX: 160, labelY: 28 },   // Đỉnh: Hỏa (Đỏ)
    tho: { cx: 260, cy: 125, labelX: 285, labelY: 130 }, // Phải trên: Thổ (Vàng)
    kim: { cx: 225, cy: 245, labelX: 245, labelY: 265 }, // Phải dưới: Kim (Bạc)
    thuy: { cx: 95, cy: 245, labelX: 75, labelY: 265 },  // Trái dưới: Thủy (Xanh dương)
    moc: { cx: 60, cy: 125, labelX: 35, labelY: 130 },   // Trái trên: Mộc (Xanh lá)
  };

  const handleSelectElement = (elemId: ElementType) => {
    setActiveElementId(elemId);
    soundEngine.playElementTone(elemId);
  };

  const currentElement = WUXING_DATA.elements.find((e) => e.id === activeElementId)!;

  return (
    <section id="ngu-hanh" className="py-20 realm-tho relative overflow-hidden" style={{ backgroundColor: "var(--bg-diep)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TIÊU ĐỀ */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest uppercase text-[#F2B632] block mb-2" style={{ lineHeight: "var(--lh-caption)" }}>
            TRIẾT LÝ ÂM DƯƠNG NGŨ HÀNH
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#16141A] dark:text-[#E8EAE0]" style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}>
            {WUXING_DATA.title}
          </h2>
          <p className="mt-2 text-sm text-[#524F59] dark:text-[#A8A6B0]" style={{ lineHeight: "var(--lh-body)" }}>
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

                {/* ĐƯỜNG LIÊN KẾT TƯƠNG SINH (Vòng tròn ngoài: Mộc -> Hỏa -> Thổ -> Kim -> Thủy -> Mộc) */}
                {relationMode === "sheng" && (
                  <g className="transition-opacity duration-300">
                    <path
                      d={`M ${nodePositions.moc.cx} ${nodePositions.moc.cy} L ${nodePositions.hoa.cx} ${nodePositions.hoa.cy} L ${nodePositions.tho.cx} ${nodePositions.tho.cy} L ${nodePositions.kim.cx} ${nodePositions.kim.cy} L ${nodePositions.thuy.cx} ${nodePositions.thuy.cy} Z`}
                      fill="none"
                      stroke="#3F7D3B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* ĐƯỜNG LIÊN KẾT TƯƠNG KHẮC (Hình sao ngũ giác: Mộc -> Thổ -> Thủy -> Hỏa -> Kim -> Mộc) */}
                {relationMode === "ke" && (
                  <g className="transition-opacity duration-300">
                    <path
                      d={`M ${nodePositions.moc.cx} ${nodePositions.moc.cy} L ${nodePositions.tho.cx} ${nodePositions.tho.cy} L ${nodePositions.thuy.cx} ${nodePositions.thuy.cy} L ${nodePositions.hoa.cx} ${nodePositions.hoa.cy} L ${nodePositions.kim.cx} ${nodePositions.kim.cy} Z`}
                      fill="none"
                      stroke="#D23A22"
                      strokeWidth="3"
                      strokeDasharray="6 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

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
                      {/* Vòng hào quang khi chọn */}
                      {isSelected && (
                        <circle
                          cx={pos.cx}
                          cy={pos.cy}
                          r="28"
                          fill="none"
                          stroke={elem.color}
                          strokeWidth="3"
                          className="animate-ping opacity-75"
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

                      {/* Tên âm ở ngoài nút */}
                      <text
                        x={pos.labelX}
                        y={pos.labelY}
                        textAnchor="middle"
                        fill="currentColor"
                        fontWeight="800"
                        fontSize="11"
                        className="font-display opacity-80 pointer-events-none"
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
