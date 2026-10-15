/**
 * ==============================================================================
 * FILE: data/billboard.ts
 * MỤC ĐÍCH: Tài liệu cấu hình cho carousel Billboard ở trang chủ.
 * - SLIDE_ORDER: thứ tự + danh sách nhạc cụ xuất hiện trên carousel
 * - TAGLINES_BY_ID: câu giới thiệu riêng cho từng nhạc cụ (không có thì fallback
 *   về tagline của cả hành)
 * - BACKGROUNDS: ảnh nền đứng sau mỗi slide
 *
 * CÁCH ĐỔ ẢNH NỀN VÀO (phần user sẽ làm):
 *   1. Đặt ảnh vào public/images/billboard/<slug>.jpg  (khuyên 1600×900,
 *      nửa trái tối để chữ đọc được, hoặc để ảnh gốc rồi mình xử lý)
 *   2. Thêm một dòng vào BACKGROUNDS:  "dan-tranh": "/images/billboard/dan-tranh.jpg"
 * Slide nào chưa có nền sẽ tự dùng cảnh hành (LivingBackground) như cũ.
 * ==============================================================================
 */

import { INSTRUMENTS, type Instrument, type ElementType } from "@/data/instruments";

export interface BillboardSlide {
  instrument: Instrument;
  /** Đường dẫn ảnh nền đứng sau slide — null = dùng cảnh hành hiện tại */
  backgroundUrl: string | null;
  /** Câu tagline riêng; bỏ trống thì lấy tagline của hành */
  tagline?: string;
}

/**
 * Một nhạc cụ đại diện cho mỗi hành (5 slide cũ) + 3 nhạc cụ nổi bật thêm vào.
 * Thứ tự xen kẽ hành để nền đổi màu liên tục, không bị lặp.
 */
const SLIDE_ORDER: string[] = [
  "ken-bau",     // Hỏa
  "dan-bau",     // Thủy
  "sao-truc",    // Mộc
  "dan-da",      // Thổ
  "cong-chieng", // Kim
  "dan-tranh",   // Thủy — thêm mới
  "trong-dong",  // Kim  — thêm mới
  "trong-com",   // Thổ  — thêm mới
];

/** Ảnh nền theo id nhạc cụ — thêm dòng khi có file trong public/images/billboard */
const BACKGROUNDS: Record<string, string> = {
  "ken-bau": "/images/billboard/kenbaubackgroundbillboard.jpg",
  "dan-bau": "/images/billboard/danbaubackgroundbillboard.jpg",
  "sao-truc": "/images/billboard/saotrucbackgroundbillboard.jpg",
  "cong-chieng": "/images/billboard/congchiengbackgroundbillboard.jpg",
};

/** Tagline riêng cho vài nhạc cụ để 2 slide cùng hành không trùng chữ */
const TAGLINES_BY_ID: Record<string, string> = {
  "dan-tranh": "Từng dây rung ngân, trong trẻo như tiếng nước chảy",
  "trong-dong": "Tiếng trống gọi mưa, vang dội cả sân đình",
  "trong-com": "Dẻo mềm nhịp trống cơm, vui như hội làng",
};

/** Tagline chung của cả hành — dùng khi nhạc cụ không có tagline riêng */
export const ELEMENT_TAGLINES: Record<ElementType, string> = {
  hoa: "Bùng cháy, nhiệt huyết, tỏa sáng rực rỡ",
  thuy: "Mềm mại, sâu lắng, biến ảo khôn lường",
  moc: "Mộc mạc, tươi mới, tràn trề sức sống",
  tho: "Trầm hậu, bao dung, vững chãi như đất",
  kim: "Vang dội, sắc bén, ngân vọng ngàn năm",
};

const BY_ID = new Map(INSTRUMENTS.map((i) => [i.id, i]));

export const BILLBOARD_SLIDES: BillboardSlide[] = SLIDE_ORDER.flatMap((id) => {
  const instrument = BY_ID.get(id);
  if (!instrument) {
    console.warn(`[billboard] Không tìm thấy nhạc cụ "${id}" — bỏ qua slide này.`);
    return [];
  }
  return [{
    instrument,
    backgroundUrl: BACKGROUNDS[id] ?? null,
    tagline: TAGLINES_BY_ID[id],
  }];
});
