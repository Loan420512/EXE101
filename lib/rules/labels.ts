/**
 * ==============================================================================
 * FILE: lib/rules/labels.ts
 * MỤC ĐÍCH: Nhãn người đọc cho các tổ hợp và hành — dùng chung cho bàn chơi
 * và màn tổng kết. Thuần hiển thị, không chứa luật.
 * ==============================================================================
 */

import type { ComboKind, ElementType } from "./types";

export const COMBO_LABELS: Record<ComboKind | string, { label: string; desc: string; score: number }> = {
  "ngu-cung": { label: "Ngũ Cung Hòa Điệu", desc: "5 lá đủ 5 hành khác nhau", score: 8 },
  "hop-tau": { label: "Hợp Tấu", desc: "3 nhạc cụ khác nhau cùng họ", score: 4 },
  "dong-am": { label: "Đồng Âm", desc: "3 lá cùng họ (có trùng loại)", score: 2 },
  "lien-hoan": { label: "Liên Hoàn Tương Sinh", desc: "Cặp sinh Mộc→Hỏa→Thổ→Kim→Thủy + nhận 1 lá Chợ", score: 2 },
};

export const ELEMENT_NOTES: Record<ElementType, string> = {
  tho: "Cung (C4)",
  kim: "Thương (D4)",
  moc: "Giốc (E4)",
  hoa: "Chủy (G4)",
  thuy: "Vũ (A4)",
};
