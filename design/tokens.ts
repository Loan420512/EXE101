/**
 * FILE: design/tokens.ts
 * MỤC ĐÍCH: Một nguồn sự thật cho màu, chữ, bo góc, viền, bóng Đông Hồ.
 * HƯỚNG DẪN: Đổi màu ở đây rồi đồng bộ biến CSS trong app/globals.css (cùng tên).
 * Không nhúng hex trực tiếp trong component — lấy từ file này hoặc class Tailwind theme.
 */

export const PALETTE = {
  diep: "#E8EAE0",
  card: "#FFFFFF",
  ink: "#16141A",
  muted: "#524F59",
  diepDark: "#141318",
  cardDark: "#1D1B22",
  inkDark: "#E8EAE0",
  mutedDark: "#A8A6B0",
  nightSky: "#0B1026",
  drumSun: "#F2B632",
} as const;

export const ELEMENT_COLORS = {
  tho: { fill: "#F2B632", text: "#16141A", glow: "#D4A017" },
  kim: { fill: "#DDE3E8", text: "#16141A", glow: "#F5D77F" },
  moc: { fill: "#3F7D3B", text: "#FFFFFF", glow: "#8FD389" },
  hoa: { fill: "#D23A22", text: "#FFFFFF", glow: "#FF8C00" },
  thuy: { fill: "#1F3F7E", text: "#FFFFFF", glow: "#7CB9E8" },
} as const;

export const SPACE = {
  radius: 4,
  borderWidth: 3,
  shadowSm: "2px 2px 0px var(--border-color)",
  shadow: "4px 4px 0px var(--border-color)",
  shadowLg: "6px 6px 0px var(--border-color)",
  shadowXl: "8px 8px 0px var(--border-color)",
  touchMinPx: 44,
  maxTiltDeg: 12,
} as const;

/** Ba cấp bóng Đông Hồ dùng trong component — không viết cứng box-shadow. */
export const SHADOW = {
  sm: SPACE.shadowSm,
  md: SPACE.shadow,
  lg: SPACE.shadowLg,
} as const;

export const TYPE = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
} as const;

/** Thang chữ streaming × Đông Hồ — dùng với line-height chữ Việt. */
export const TYPE_SCALE = {
  display: { size: "4.5rem", lineHeight: "var(--lh-heading-tight)" },
  h1: { size: "2.5rem", lineHeight: "var(--lh-heading-tight)" },
  h2: { size: "1.75rem", lineHeight: "var(--lh-heading)" },
  h3: { size: "1.25rem", lineHeight: "var(--lh-heading)" },
  body: { size: "1rem", lineHeight: "var(--lh-body)" },
  caption: { size: "0.75rem", lineHeight: "var(--lh-caption)" },
  kicker: { size: "0.6875rem", lineHeight: "var(--lh-caption)" },
} as const;

export const MOTION = {
  fastMs: 120,
  baseMs: 200,
  slowMs: 400,
  portalMs: 700,
  cardMs: 800,
  sectionLerp: 0.08,
  easingOut: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;
