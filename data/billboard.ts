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
 *   1. Thả ảnh gốc vào public/images/billboard/ — tên file có chứa slug nhạc cụ
 *      không dấu, không gạch (muốn nền cho Đàn bầu → "danbau...jpg"). Khuyên
 *      ~1920×1080; ảnh nhỏ hơn vẫn dùng được nhưng sẽ mềm.
 *   2. Chạy  npm run billboard  → khử vệt nén, phóng lên master 1920px, làm nét,
 *      xuất webp + avif (1280 và 1920) vào public/images/billboard/optimized/.
 *   3. Thêm dòng vào BACKGROUNDS bên dưới theo đoạn script in ra.
 * Slide nào chưa có nền sẽ tự dùng cảnh hành (LivingBackground) như cũ.
 * ==============================================================================
 */

import { INSTRUMENTS, type Instrument, type ElementType } from "@/data/instruments";

/**
 * Nền của một slide. Ảnh đã được scripts/prep-billboard.mjs phóng sẵn tới
 * 1920px — KHÔNG đưa ảnh gốc nhỏ vào đây, vì next/image không phóng to quá
 * bề rộng file nguồn nên trình duyệt phải tự giãn → vỡ và mờ.
 */
export interface SlideBackground {
  srcSetAvif: string;
  srcSetWebp: string;
  /** ảnh dự phòng cho trình duyệt không có <picture> */
  webpUrl: string;
  /** bề rộng ảnh gốc user đưa — nhỏ thì nền được phủ hạt giấy để đỡ lộ nét vỡ */
  sourceWidth: number;
}

export interface BillboardSlide {
  instrument: Instrument;
  /** null = dùng cảnh hành hiện tại */
  background: SlideBackground | null;
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

/**
 * Ảnh nền theo id nhạc cụ. `base` là đường dẫn không đuôi, không cỡ —
 * các phần mở rộng do scripts/prep-billboard.mjs sinh ra:
 *   <base>-1280.webp | <base>-1280.avif | <base>-1920.webp | <base>-1920.avif
 * `sourceWidth` = bề rộng ảnh gốc user thả vào (để biết nền nào cần phủ hạt giấy).
 */
const BACKGROUNDS: Record<string, { base: string; sourceWidth: number }> = {
  "ken-bau": { base: "/images/billboard/optimized/ken-bau", sourceWidth: 640 },
  "dan-bau": { base: "/images/billboard/optimized/dan-bau", sourceWidth: 665 },
  "sao-truc": { base: "/images/billboard/optimized/sao-truc", sourceWidth: 547 },
  "cong-chieng": { base: "/images/billboard/optimized/cong-chieng", sourceWidth: 2560 },
};

/** Dựng srcSet avif/webp từ base — 1280 cho màn nhỏ, 1920 cho desktop. */
function toBackground({ base, sourceWidth }: { base: string; sourceWidth: number }): SlideBackground {
  return {
    srcSetAvif: `${base}-1280.avif 1280w, ${base}-1920.avif 1920w`,
    srcSetWebp: `${base}-1280.webp 1280w, ${base}-1920.webp 1920w`,
    webpUrl: `${base}-1920.webp`,
    sourceWidth,
  };
}

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
    background: BACKGROUNDS[id] ? toBackground(BACKGROUNDS[id]) : null,
    tagline: TAGLINES_BY_ID[id],
  }];
});
