/**
 * FILE: config/sections.ts
 * MỤC ĐÍCH: Ánh xạ từng khối trang với hành nền sống (không cắt đột ngột).
 */

import type { ElementType } from "@/data/instruments";

export type SectionId =
  | "hero"
  | "cau-chuyen"
  | "choi-30s"
  | "bo-bai"
  | "ngu-hanh"
  | "luat-choi"
  | "dang-ky"
  | "doi-ngu";

export type Atmosphere = ElementType | "mix";

export const SECTION_ATMOSPHERE: Record<SectionId, Atmosphere> = {
  hero: "mix",
  "cau-chuyen": "tho",
  "choi-30s": "moc",
  "bo-bai": "mix",
  "ngu-hanh": "mix",
  "luat-choi": "kim",
  "dang-ky": "thuy",
  "doi-ngu": "hoa",
};

export const SECTION_IDS: SectionId[] = [
  "hero",
  "cau-chuyen",
  "choi-30s",
  "bo-bai",
  "ngu-hanh",
  "luat-choi",
  "dang-ky",
  "doi-ngu",
];
