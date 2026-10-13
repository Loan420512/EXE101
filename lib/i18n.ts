/**
 * ==============================================================================
 * FILE: lib/i18n.ts
 * MỤC ĐÍCH: Hỗ trợ đa ngôn ngữ Tiếng Việt (VI - mặc định) và Tiếng Anh (EN)
 * ==============================================================================
 */

export type Locale = "vi" | "en";

export const DICTIONARY = {
  vi: {
    brand: "Ngũ Cung",
    slogan: "Thu thập ngũ hành. Nghe văn hóa.",
    targetAge: "Dành cho độ tuổi 7+",
    nav: {
      home: "Trang chủ",
      instruments: "15 Nhạc cụ",
      wuxing: "Ngũ Hành",
      rules: "Luật chơi",
      playground: "Sân chơi ngũ âm",
      quiz: "Trắc nghiệm",
      playOnline: "Chơi thử ngay",
      register: "Đăng ký bộ bài",
    },
    elements: {
      tho: "Thổ (Cung - C4)",
      kim: "Kim (Thương - D4)",
      moc: "Mộc (Giốc - E4)",
      hoa: "Hỏa (Chủy - G4)",
      thuy: "Thủy (Vũ - A4)",
    },
    actions: {
      pickMarket: "Chọn từ Chợ Nhạc",
      presentCombo: "Trình tấu tổ hợp",
      breakSound: "Phá âm tương khắc",
      restart: "Chơi lại",
      toggleSound: "Bật/Tắt âm thanh",
    },
    combos: {
      nguCung: "Ngũ Cung Hòa Điệu (8 điểm)",
      hopTau: "Hợp Tấu (4 điểm)",
      dongAm: "Đồng Âm (2 điểm)",
      lienHoan: "Liên Hoàn Tương Sinh (2 điểm + 1 lá Chợ)",
    },
  },
  en: {
    brand: "Ngu Cung",
    slogan: "Collect the Five Elements. Hear the Heritage.",
    targetAge: "Ages 7+",
    nav: {
      home: "Home",
      instruments: "15 Instruments",
      wuxing: "Five Elements",
      rules: "Game Rules",
      playground: "Pentatonic Synth",
      quiz: "Quiz",
      playOnline: "Play Now",
      register: "Register Deck",
    },
    elements: {
      tho: "Earth (Gong / C4)",
      kim: "Metal (Shang / D4)",
      moc: "Wood (Jiao / E4)",
      hoa: "Fire (Zhi / G4)",
      thuy: "Water (Yu / A4)",
    },
    actions: {
      pickMarket: "Draft from Market",
      presentCombo: "Perform Harmonious Combo",
      breakSound: "Elemental Counter (Pha Am)",
      restart: "Restart Game",
      toggleSound: "Toggle Audio",
    },
    combos: {
      nguCung: "Five Tones Harmony (8 pts)",
      hopTau: "Ensemble (Hop Tau - 4 pts)",
      dongAm: "Unison (Dong Am - 2 pts)",
      lienHoan: "Sheng Cycle (Lien Hoan - 2 pts + 1 Market Card)",
    },
  },
};

export function getDictionary(locale: Locale = "vi") {
  return DICTIONARY[locale] || DICTIONARY.vi;
}
