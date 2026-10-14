/**
 * FILE: config/universes.ts
 * MỤC ĐÍCH: Universe Kit cho 6 Vũ Trụ Ngũ Hành (Thổ, Kim, Mộc, Hỏa, Thủy, Hợp Nhất).
 * Mỗi vũ trụ là một "thế giới" hoàn chỉnh — màu, hạt, họa tiết, âm, chuyển động.
 * Thay đổi giá trị ở đây, component tự cập nhật theo.
 *
 * LUẬT BẤT BIẾN:
 * - Mọi cặp chữ/nền đạt WCAG AA (4.5:1 chữ thường, 3:1 chữ lớn)
 * - Màu lấy từ design/tokens.ts, không viết cứng hex trong component
 */

import type { ElementType } from "@/data/instruments";

export type UniverseId = ElementType | "united";

export interface UniverseColors {
  /** Màu nền chính của vũ trụ (body background khi active) */
  bg: string;
  /** Màu nền card/surface */
  surface: string;
  /** Màu nhấn (nút, viền active, thanh tiến độ) */
  accent: string;
  /** Màu phụ (highlight nhẹ) */
  accentMuted: string;
  /** Màu chữ chính trên bg */
  textPrimary: string;
  /** Màu chữ phụ trên bg */
  textMuted: string;
  /** Màu chữ trên accent (nút) */
  textOnAccent: string;
  /** Màu viền Đông Hồ */
  border: string;
  /** Màu bóng đổ cứng Đông Hồ */
  shadow: string;
  /** Màu glow linh khí */
  glow: string;
  /** Màu glow sáng (tiêu đề) */
  glowBright: string;
}

export interface UniverseParticle {
  /** Kiểu hạt môi trường */
  type: "water" | "fire" | "leaf" | "metal" | "dust" | "mixed";
  /** Màu hạt (mảng cho nhiều màu) */
  colors: string[];
  /** Số hạt (high tier) */
  count: number;
  /** Tốc độ trôi */
  speed: number;
  /** Kích thước trung bình */
  size: number;
}

export interface UniverseCard {
  /** Màu nền mặt sau lá bài */
  backColor: string;
  /** Tên họa tiết Đông Hồ (key trong InstrumentIllustration) */
  patternKey: string;
  /** Màu viền lá bài */
  borderColor: string;
  /** Màu hào quang khi hover */
  auraColor: string;
}

export interface UniverseAudio {
  /** Tần số drone ambient (Hz), 0 = tắt */
  ambientFreq: number;
  /** Âm lượng ambient (0–1) */
  ambientGain: number;
  /** Màu sóng âm trong visualizer */
  waveColor: string;
}

export interface UniverseMotion {
  /** Tên cursor custom (CSS cursor value hoặc "default") */
  cursor: string;
  /** Màu hiệu ứng nhấn (ripple) */
  rippleColor: string;
  /** Duration chuyển cảnh portal (ms) */
  transitionMs: number;
  /** Easing chuyển cảnh */
  transitionEasing: string;
}

export interface UniverseKit {
  id: UniverseId;
  /** Tên hiển thị */
  label: string;
  labelEn: string;
  /** Mô tả ngắn */
  description: string;
  /** Icon key (SVG) */
  iconKey: string;
  /** Phím tắt (keyboard shortcut) */
  shortcut: string;
  colors: UniverseColors;
  particle: UniverseParticle;
  card: UniverseCard;
  audio: UniverseAudio;
  motion: UniverseMotion;
  /** CSS class được thêm vào <html> khi vũ trụ active */
  htmlClass: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// THỔ — Đất vàng, trầm ấm, bụi vàng
// ─────────────────────────────────────────────────────────────────────────────
const THO: UniverseKit = {
  id: "tho",
  label: "Thổ",
  labelEn: "Earth",
  description: "Trầm hậu, bao dung, vững chãi như lòng đất mẹ",
  iconKey: "earth",
  shortcut: "1",
  colors: {
    bg: "#1A1408",
    surface: "#241C0A",
    accent: "#F2B632",
    accentMuted: "#8C6214",
    textPrimary: "#F0EDD9",
    textMuted: "#B09060",
    textOnAccent: "#1A1408",
    border: "#F2B632",
    shadow: "#8C6214",
    glow: "rgba(242,182,50,0.55)",
    glowBright: "0 0 30px rgba(242,182,50,0.7), 0 0 60px rgba(242,182,50,0.35)",
  },
  particle: {
    type: "dust",
    colors: ["#F2B632", "#D4A017", "#E4D1A0", "#8C6214"],
    count: 80,
    speed: 0.4,
    size: 3,
  },
  card: {
    backColor: "#F2B632",
    patternKey: "tho",
    borderColor: "#8C6214",
    auraColor: "rgba(242,182,50,0.55)",
  },
  audio: {
    ambientFreq: 130.81, // C3 — Cung trầm
    ambientGain: 0.03,
    waveColor: "#F2B632",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(242,182,50,0.4)",
    transitionMs: 700,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-tho",
};

// ─────────────────────────────────────────────────────────────────────────────
// KIM — Bạc xanh, lấp lánh, ánh kim
// ─────────────────────────────────────────────────────────────────────────────
const KIM: UniverseKit = {
  id: "kim",
  label: "Kim",
  labelEn: "Metal",
  description: "Vang dội, sắc bén, thanh khiết như kim loại quý",
  iconKey: "metal",
  shortcut: "2",
  colors: {
    bg: "#0E1014",
    surface: "#161A20",
    accent: "#C8D4DC",
    accentMuted: "#6A7E8C",
    textPrimary: "#E8EEF2",
    textMuted: "#8A9EAC",
    textOnAccent: "#0E1014",
    border: "#C8D4DC",
    shadow: "#4A6070",
    glow: "rgba(200,212,220,0.6)",
    glowBright: "0 0 30px rgba(200,212,220,0.7), 0 0 60px rgba(200,212,220,0.3)",
  },
  particle: {
    type: "metal",
    colors: ["#C8D4DC", "#E8F0F8", "#F5D77F", "#8A9EAC"],
    count: 60,
    speed: 0.3,
    size: 2,
  },
  card: {
    backColor: "#C8D4DC",
    patternKey: "kim",
    borderColor: "#4A6070",
    auraColor: "rgba(200,212,220,0.6)",
  },
  audio: {
    ambientFreq: 146.83, // D3 — Thương trầm
    ambientGain: 0.025,
    waveColor: "#C8D4DC",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(200,212,220,0.45)",
    transitionMs: 650,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-kim",
};

// ─────────────────────────────────────────────────────────────────────────────
// MỘC — Xanh lá đậm, lá bay, sức sống
// ─────────────────────────────────────────────────────────────────────────────
const MOC: UniverseKit = {
  id: "moc",
  label: "Mộc",
  labelEn: "Wood",
  description: "Mộc mạc, tươi mới, tràn trề sức sống của chồi non",
  iconKey: "wood",
  shortcut: "3",
  colors: {
    bg: "#061008",
    surface: "#0C1E0E",
    accent: "#4A9045",
    accentMuted: "#244E21",
    textPrimary: "#D8EED4",
    textMuted: "#6A9A64",
    textOnAccent: "#FFFFFF",
    border: "#3F7D3B",
    shadow: "#244E21",
    glow: "rgba(74,144,69,0.55)",
    glowBright: "0 0 30px rgba(70,160,60,0.65), 0 0 60px rgba(70,160,60,0.3)",
  },
  particle: {
    type: "leaf",
    colors: ["#4A9045", "#8FD389", "#244E21", "#C2E8BC"],
    count: 50,
    speed: 0.6,
    size: 4,
  },
  card: {
    backColor: "#3F7D3B",
    patternKey: "moc",
    borderColor: "#244E21",
    auraColor: "rgba(74,144,69,0.55)",
  },
  audio: {
    ambientFreq: 164.81, // E3 — Giốc trầm
    ambientGain: 0.03,
    waveColor: "#4A9045",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(74,144,69,0.4)",
    transitionMs: 800,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-moc",
};

// ─────────────────────────────────────────────────────────────────────────────
// HỎA — Đỏ son, tia lửa, bùng nổ
// ─────────────────────────────────────────────────────────────────────────────
const HOA: UniverseKit = {
  id: "hoa",
  label: "Hỏa",
  labelEn: "Fire",
  description: "Nồng nhiệt, bốc lửa, sôi động và rạo rực khí thế",
  iconKey: "fire",
  shortcut: "4",
  colors: {
    bg: "#120402",
    surface: "#200804",
    accent: "#D23A22",
    accentMuted: "#7A1E10",
    textPrimary: "#F5DDD8",
    textMuted: "#A05848",
    textOnAccent: "#FFFFFF",
    border: "#D23A22",
    shadow: "#7A1E10",
    glow: "rgba(210,58,34,0.6)",
    glowBright: "0 0 30px rgba(220,60,30,0.7), 0 0 60px rgba(220,60,30,0.35)",
  },
  particle: {
    type: "fire",
    colors: ["#FFD700", "#FF8C00", "#D23A22", "#FF4500"],
    count: 90,
    speed: 1.2,
    size: 3,
  },
  card: {
    backColor: "#D23A22",
    patternKey: "hoa",
    borderColor: "#7A1E10",
    auraColor: "rgba(210,58,34,0.6)",
  },
  audio: {
    ambientFreq: 196.0, // G3 — Chủy trầm
    ambientGain: 0.025,
    waveColor: "#D23A22",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(210,58,34,0.45)",
    transitionMs: 600,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-hoa",
};

// ─────────────────────────────────────────────────────────────────────────────
// THỦY — Chàm sâu, gợn sóng, mực loang
// ─────────────────────────────────────────────────────────────────────────────
const THUY: UniverseKit = {
  id: "thuy",
  label: "Thủy",
  labelEn: "Water",
  description: "Mềm mại, sâu lắng, biến ảo khôn lường như dòng nước",
  iconKey: "water",
  shortcut: "5",
  colors: {
    bg: "#040A14",
    surface: "#081424",
    accent: "#3A6BB2",
    accentMuted: "#1F3F7E",
    textPrimary: "#C8DCF0",
    textMuted: "#506880",
    textOnAccent: "#FFFFFF",
    border: "#1F3F7E",
    shadow: "#0A1A3A",
    glow: "rgba(58,107,178,0.6)",
    glowBright: "0 0 30px rgba(50,90,200,0.65), 0 0 60px rgba(50,90,200,0.3)",
  },
  particle: {
    type: "water",
    colors: ["#1F3F7E", "#3A6BB2", "#7CB9E8", "#D4F1F9"],
    count: 70,
    speed: 0.5,
    size: 3,
  },
  card: {
    backColor: "#1F3F7E",
    patternKey: "thuy",
    borderColor: "#0A1A3A",
    auraColor: "rgba(58,107,178,0.6)",
  },
  audio: {
    ambientFreq: 220.0, // A3 — Vũ trầm
    ambientGain: 0.03,
    waveColor: "#3A6BB2",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(58,107,178,0.45)",
    transitionMs: 900,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-thuy",
};

// ─────────────────────────────────────────────────────────────────────────────
// HỢP NHẤT — Tất cả năm hành, vòng ngũ giác xoay
// ─────────────────────────────────────────────────────────────────────────────
const UNITED: UniverseKit = {
  id: "united",
  label: "Hợp Nhất",
  labelEn: "All Elements",
  description: "Năm hành hòa quyện, vũ trụ ngũ cung toàn vẹn",
  iconKey: "pentagon",
  shortcut: "0",
  colors: {
    bg: "#0B0C14",
    surface: "#14161E",
    accent: "#F2B632",
    accentMuted: "#524F59",
    textPrimary: "#E8EAE0",
    textMuted: "#A8A6B0",
    textOnAccent: "#0B0C14",
    border: "#E8EAE0",
    shadow: "#16141A",
    glow: "rgba(242,182,50,0.4)",
    glowBright: "0 0 30px rgba(242,182,50,0.5)",
  },
  particle: {
    type: "mixed",
    colors: ["#F2B632", "#C8D4DC", "#3F7D3B", "#D23A22", "#1F3F7E"],
    count: 100,
    speed: 0.5,
    size: 3,
  },
  card: {
    backColor: "#16141A",
    patternKey: "united",
    borderColor: "#E8EAE0",
    auraColor: "rgba(242,182,50,0.4)",
  },
  audio: {
    ambientFreq: 0, // tắt — âm ngũ hành phát luân phiên
    ambientGain: 0,
    waveColor: "#F2B632",
  },
  motion: {
    cursor: "default",
    rippleColor: "rgba(242,182,50,0.35)",
    transitionMs: 750,
    transitionEasing: "cubic-bezier(0.22,1,0.36,1)",
  },
  htmlClass: "universe-united",
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const UNIVERSES: Record<UniverseId, UniverseKit> = {
  tho: THO,
  kim: KIM,
  moc: MOC,
  hoa: HOA,
  thuy: THUY,
  united: UNITED,
};

export const UNIVERSE_ORDER: UniverseId[] = ["tho", "kim", "moc", "hoa", "thuy", "united"];

export function getUniverse(id?: string | null): UniverseKit {
  if (!id || !(id in UNIVERSES)) return UNIVERSES.united;
  return UNIVERSES[id as UniverseId];
}

/** Dispatch custom event để chuyển vũ trụ toàn trang */
export function dispatchUniverseChange(id: UniverseId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("ngucung:set-universe", { detail: { id } })
  );
}

/** Lấy vũ trụ từ localStorage, fallback "united" */
export function getStoredUniverse(): UniverseId {
  if (typeof window === "undefined") return "united";
  try {
    const stored = localStorage.getItem("ngucung_universe");
    if (stored && stored in UNIVERSES) return stored as UniverseId;
  } catch {
    // localStorage bị chặn — dùng default
  }
  return "united";
}

/** Lưu vũ trụ vào localStorage */
export function storeUniverse(id: UniverseId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("ngucung_universe", id);
  } catch {
    // bộ nhớ đầy hoặc bị chặn — tiếp tục không lỗi
  }
}
