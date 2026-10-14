/**
 * FILE: data/scenes.ts
 * MỤC ĐÍCH: Bảng tài sản và siêu dữ liệu cho các cảnh nền Ngũ Cung (Mặc định + 5 Hành) & Lớp Trống Đồng.
 * Nguồn sự thật duy nhất về tên file nén, văn bản mô tả, độ tương phản và nguồn gốc tài sản.
 */

import { ELEMENT_COLORS } from "@/design/tokens";
import type { ElementType } from "@/data/instruments";

export type SceneKey = "default" | ElementType;

export interface SceneData {
  id: string;
  element: SceneKey;
  name: string;
  tone: string;
  title: string;
  tagline: string;
  description: string;
  alt: string;
  baseFile: string;
  webpUrl: string;
  avifUrl: string;
  srcSetWebp: string;
  srcSetAvif: string;
  overlayGradient: string;
  accentColor: string;
  glowColor: string;
  credit: {
    title: string;
    description: string;
    source: string;
    license: string;
  };
}

export const SCENES: Record<SceneKey, SceneData> = {
  default: {
    id: "scene-default",
    element: "default",
    name: "Cõi Ngũ Âm",
    tone: "Cung — Thương — Giốc — Chủy — Vũ",
    title: "Toàn Cảnh Cõi Ngũ Cung",
    tagline: "Thu thập ngũ hành. Nghe văn hóa.",
    description: "Toàn cảnh non nước và phố thị nhìn từ trên cao, nơi 5 dòng âm thanh dân gian cùng hòa tấu.",
    alt: "Toàn cảnh thành phố ven vịnh nhìn từ trên cao trong làn sương sớm và ánh sáng rực rỡ, biểu tượng cho không gian hòa quyện của Cõi Ngũ Cung.",
    baseFile: "nen-mac-dinh",
    webpUrl: "/images/backgroundweb/nen-mac-dinh.webp",
    avifUrl: "/images/backgroundweb/nen-mac-dinh.avif",
    srcSetWebp: "/images/backgroundweb/nen-mac-dinh-640.webp 640w, /images/backgroundweb/nen-mac-dinh-1280.webp 1280w, /images/backgroundweb/nen-mac-dinh-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/nen-mac-dinh-640.avif 640w, /images/backgroundweb/nen-mac-dinh-1280.avif 1280w, /images/backgroundweb/nen-mac-dinh-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(22, 20, 26, 0.78) 0%, rgba(30, 27, 36, 0.82) 50%, rgba(22, 20, 26, 0.92) 100%)",
    accentColor: "#F2B632",
    glowColor: "rgba(242, 182, 50, 0.28)",
    credit: {
      title: "Defaultbackgroundweb.jpg (Bản nén: nen-mac-dinh)",
      description: "Ảnh chụp toàn cảnh thành phố ven vịnh từ trên cao.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
  tho: {
    id: "scene-tho",
    element: "tho",
    name: "Cõi Thổ — Âm Cung",
    tone: "Cung (C4)",
    title: "Đồi Cát Sa Thạch Hoàng Hôn",
    tagline: "Vững chãi, trầm ấm, nuôi dưỡng vạn vật",
    description: "Cồn cát vàng uốn lượn dưới vầng hoàng hôn sa mạc, biểu trưng cho sự trù phú và độ trầm hùng của nhạc cụ đất đá.",
    alt: "Đồi cát vàng mênh mông dưới ánh hoàng hôn rực rỡ, những đường lượn sóng cát biểu trưng cho âm Cung họ Thổ trầm hùng vững chãi.",
    baseFile: "canh-tho",
    webpUrl: "/images/backgroundweb/canh-tho.webp",
    avifUrl: "/images/backgroundweb/canh-tho.avif",
    srcSetWebp: "/images/backgroundweb/canh-tho-640.webp 640w, /images/backgroundweb/canh-tho-1280.webp 1280w, /images/backgroundweb/canh-tho-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/canh-tho-640.avif 640w, /images/backgroundweb/canh-tho-1280.avif 1280w, /images/backgroundweb/canh-tho-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(45, 30, 10, 0.75) 0%, rgba(35, 24, 12, 0.82) 50%, rgba(20, 15, 10, 0.94) 100%)",
    accentColor: ELEMENT_COLORS.tho.fill,
    glowColor: ELEMENT_COLORS.tho.glow,
    credit: {
      title: "earth.jpg (Bản nén: canh-tho)",
      description: "Đồi cát vàng lúc hoàng hôn / bình minh rực rỡ.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
  kim: {
    id: "scene-kim",
    element: "kim",
    name: "Cõi Kim — Âm Thương",
    tone: "Thương (D4)",
    title: "Núi Đá Vôi Vịnh Biển Thượng Giới",
    tagline: "Sắc sảo, vang ngân, sáng trong như gương",
    description: "Những cột đá vôi hùng vĩ vươn lên giữa làn nước xanh phẳng lặng như gương, vang vọng âm thanh kim khí ngàn năm.",
    alt: "Quần thể núi đá vôi kỳ vĩ vươn lên giữa vịnh biển phẳng lặng, phản chiếu ánh sáng kiêu hãnh của họ Kim âm Thương.",
    baseFile: "canh-kim",
    webpUrl: "/images/backgroundweb/canh-kim.webp",
    avifUrl: "/images/backgroundweb/canh-kim.avif",
    srcSetWebp: "/images/backgroundweb/canh-kim-640.webp 640w, /images/backgroundweb/canh-kim-1280.webp 1280w, /images/backgroundweb/canh-kim-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/canh-kim-640.avif 640w, /images/backgroundweb/canh-kim-1280.avif 1280w, /images/backgroundweb/canh-kim-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(30, 28, 20, 0.75) 0%, rgba(25, 23, 20, 0.84) 50%, rgba(15, 15, 18, 0.94) 100%)",
    accentColor: ELEMENT_COLORS.kim.fill,
    glowColor: ELEMENT_COLORS.kim.glow,
    credit: {
      title: "metal.jpg (Bản nén: canh-kim)",
      description: "Núi đá vôi nhô lên giữa vịnh biển phẳng lặng.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
  moc: {
    id: "scene-moc",
    element: "moc",
    name: "Cõi Mộc — Âm Giốc",
    tone: "Giốc (E4)",
    title: "Thung Lũng Ruộng Bậc Thang Xanh Ngát",
    tagline: "Sinh sôi, tươi mát, thanh thoát tre trúc",
    description: "Những triền ruộng bậc thang uốn lượn ôm trọn mây ngàn, biểu trưng cho sự sống trỗi dậy và âm sắc trong trẻo của tre gỗ.",
    alt: "Thung lũng ruộng bậc thang xanh ngát ngút ngàn uốn lượn mềm mại qua các triền đồi, sinh khí họ Mộc âm Giốc tràn đầy nhựa sống.",
    baseFile: "canh-moc",
    webpUrl: "/images/backgroundweb/canh-moc.webp",
    avifUrl: "/images/backgroundweb/canh-moc.avif",
    srcSetWebp: "/images/backgroundweb/canh-moc-640.webp 640w, /images/backgroundweb/canh-moc-1280.webp 1280w, /images/backgroundweb/canh-moc-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/canh-moc-640.avif 640w, /images/backgroundweb/canh-moc-1280.avif 1280w, /images/backgroundweb/canh-moc-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(12, 35, 18, 0.76) 0%, rgba(10, 28, 16, 0.84) 50%, rgba(8, 20, 14, 0.95) 100%)",
    accentColor: ELEMENT_COLORS.moc.fill,
    glowColor: ELEMENT_COLORS.moc.glow,
    credit: {
      title: "wood.jpg (Bản nén: canh-moc)",
      description: "Thung lũng ruộng bậc thang xanh ngát ngút ngàn.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
  hoa: {
    id: "scene-hoa",
    element: "hoa",
    name: "Cõi Hỏa — Âm Chủy",
    tone: "Chủy (G4)",
    title: "Đêm Đèn Trời Hoa Đăng Rực Rỡ",
    tagline: "Bùng cháy, nhiệt huyết, thăng hoa rạng ngời",
    description: "Hàng ngàn chiếc đèn trời mang theo nguyện ước thắp sáng màn đêm, thể hiện sự nồng nhiệt và sức mạnh bùng nổ của âm Chủy.",
    alt: "Vô số ngọn đèn trời lung linh bay lên giữa bầu trời đêm lấp lánh ánh than hồng, biểu trưng cho ngọn lửa bùng cháy của họ Hỏa âm Chủy.",
    baseFile: "canh-hoa",
    webpUrl: "/images/backgroundweb/canh-hoa.webp",
    avifUrl: "/images/backgroundweb/canh-hoa.avif",
    srcSetWebp: "/images/backgroundweb/canh-hoa-640.webp 640w, /images/backgroundweb/canh-hoa-1280.webp 1280w, /images/backgroundweb/canh-hoa-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/canh-hoa-640.avif 640w, /images/backgroundweb/canh-hoa-1280.avif 1280w, /images/backgroundweb/canh-hoa-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(48, 12, 10, 0.76) 0%, rgba(36, 10, 10, 0.84) 50%, rgba(20, 8, 8, 0.95) 100%)",
    accentColor: ELEMENT_COLORS.hoa.fill,
    glowColor: ELEMENT_COLORS.hoa.glow,
    credit: {
      title: "fire.jpg (Bản nén: canh-hoa)",
      description: "Đèn trời hoa đăng bay rực rỡ trong đêm.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
  thuy: {
    id: "scene-thuy",
    element: "thuy",
    name: "Cõi Thủy — Âm Vũ",
    tone: "Vũ (A4)",
    title: "Thác Nước Rừng Sâu Hùng Vĩ",
    tagline: "Uốn lượn, sâu thẳm, dịu mát hiền hòa",
    description: "Dòng thác nhiều tầng đổ nước êm đềm giữa rừng già tĩnh lặng, mang linh khí mềm mại và chiều sâu huyền bí của họ Thủy.",
    alt: "Thác nước tự nhiên nhiều tầng tuôn chảy giữa rừng xanh thẳm, bọt nước tung trắng xóa mang lại sự mát dịu của họ Thủy âm Vũ.",
    baseFile: "canh-thuy",
    webpUrl: "/images/backgroundweb/canh-thuy.webp",
    avifUrl: "/images/backgroundweb/canh-thuy.avif",
    srcSetWebp: "/images/backgroundweb/canh-thuy-640.webp 640w, /images/backgroundweb/canh-thuy-1280.webp 1280w, /images/backgroundweb/canh-thuy-2560.webp 2560w",
    srcSetAvif: "/images/backgroundweb/canh-thuy-640.avif 640w, /images/backgroundweb/canh-thuy-1280.avif 1280w, /images/backgroundweb/canh-thuy-2560.avif 2560w",
    overlayGradient: "linear-gradient(180deg, rgba(8, 22, 42, 0.76) 0%, rgba(7, 18, 36, 0.85) 50%, rgba(6, 12, 24, 0.96) 100%)",
    accentColor: ELEMENT_COLORS.thuy.fill,
    glowColor: ELEMENT_COLORS.thuy.glow,
    credit: {
      title: "water.jpg (Bản nén: canh-thuy)",
      description: "Thác nước nhiều tầng giữa rừng xanh nguyên sinh.",
      source: "Tài sản nội bộ dự án Ngũ Cung",
      license: "Sử dụng nội bộ dự án Ngũ Cung",
    },
  },
};

export const DRUM_ASSET = {
  id: "asset-trong-dong",
  name: "Trống Đồng Đông Sơn",
  alt: "Mặt trống đồng Đông Sơn tròn với hình tượng ngôi sao trung tâm, chim lạc và hoa văn cổ truyền màu vàng đồng trên nền trong suốt.",
  baseFile: "trong-dong",
  pngUrl: "/images/backgroundweb/trong-dong.png",
  webpUrl: "/images/backgroundweb/trong-dong.webp",
  avifUrl: "/images/backgroundweb/trong-dong.avif",
  srcSetWebp: "/images/backgroundweb/trong-dong-640.webp 640w, /images/backgroundweb/trong-dong-1280.webp 1280w, /images/backgroundweb/trong-dong-2560.webp 2560w",
  credit: {
    title: "defaultwebbackground.png (Bản nén: trong-dong)",
    description: "Mặt trống đồng tròn vàng đồng trên nền trong suốt.",
    source: "Tài sản nội bộ dự án Ngũ Cung",
    license: "Sử dụng nội bộ dự án Ngũ Cung",
  },
} as const;

export const LOGO_ASSET = {
  id: "asset-logo-ngucung",
  name: "Logo Ngũ Cung Card Game",
  alt: "Logo Ngũ Cung: Tranh khắc gỗ nghệ thuật với người gõ cồng, 5 lá bài ngũ hành và dòng chữ NGŨ CUNG CARD GAME trên nền trong suốt.",
  baseFile: "logongucung",
  pngUrl: "/images/logo/logongucung.png",
  webpUrl: "/images/logo/logongucung.webp",
  credit: {
    title: "logongucung.png (Bản nén: logongucung)",
    description: "Tranh khắc gỗ hình chữ nhật đứng (người gõ cồng, 5 lá bài, chữ NGŨ CUNG CARD GAME, nền trong suốt).",
    source: "Tài sản nội bộ dự án Ngũ Cung",
    license: "Sử dụng nội bộ dự án Ngũ Cung",
  },
} as const;

export function getSceneByElement(element?: string | null): SceneData {
  if (!element || !(element in SCENES)) {
    return SCENES.default;
  }
  return SCENES[element as SceneKey];
}
