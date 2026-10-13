/**
 * ==============================================================================
 * FILE: config/effects.ts
 * MỤC ĐÍCH: Tập trung toàn bộ thông số hiệu ứng biến ảo của 5 họ bài (Thổ, Kim, Mộc, Hỏa, Thủy).
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn tăng/giảm thời gian chạy hiệu ứng: sửa `durationMs` (mặc định 800ms)
 * - Muốn tăng/giảm số lượng hạt: sửa `particleCount`
 * - Muốn đổi màu hạt phát sáng: sửa các mảng màu `colors`
 * - Muốn đổi tốc độ bay/kích thước: sửa `speedMin`, `speedMax`, `sizeMin`, `sizeMax`
 * - Khi sửa ở đây, hiệu ứng Canvas sẽ tự động áp dụng thông số mới mà không cần sửa code vẽ!
 * ==============================================================================
 */

export interface BaseEffectConfig {
  durationMs: number;       // Thời lượng hiệu ứng tính bằng mili-giây (~800ms)
  particleCount: number;    // Số lượng hạt cơ bản (sẽ chia đôi nếu máy yếu)
  colors: string[];         // Bảng màu cho hiệu ứng
  speedMin: number;         // Tốc độ tối thiểu
  speedMax: number;         // Tốc độ tối đa
  sizeMin: number;          // Kích thước hạt/nét nhỏ nhất (px)
  sizeMax: number;          // Kích thước hạt/nét lớn nhất (px)
}

export interface ThuyEffectConfig extends BaseEffectConfig {
  waveRingCount: number;    // Số vòng sóng elip loang ra từ tâm
  dropCount: number;        // Số giọt nước bắn lên
  gravity: number;          // Gia tốc trọng lực cho giọt nước rơi
  maxWaveRadius: number;    // Bán kính sóng tối đa (px)
}

export interface HoaEffectConfig extends BaseEffectConfig {
  emberCount: number;       // Số tàn lửa bốc lên
  horizontalSway: number;   // Biên độ dao động ngang (lắc lư)
  haloRadius: number;       // Bán kính vầng sáng cam nhấp nháy sau lá bài
  blendMode: GlobalCompositeOperation; // Blend mode "lighter"
}

export interface MocEffectConfig extends BaseEffectConfig {
  bambooCount: number;      // Số thân tre mọc từ mép dưới lá bài (mặc định 5)
  leavesPerBamboo: number;  // Số lá nảy ra dọc mỗi thân tre
  stemMaxWidth: number;     // Độ dày tối đa của thân tre (px)
  maxHeightRatio: number;   // Chiều cao mọc tối đa theo tỉ lệ chiều cao lá bài
}

export interface KimEffectConfig extends BaseEffectConfig {
  rayWidth: number;         // Độ rộng vệt sáng đồng quét chéo
  soundRingCount: number;   // Số vòng sóng âm tròn lan tỏa (yêu cầu 3 vòng)
  sparkleCount: number;     // Số ánh lấp lánh hình sao 4 cánh
  sparkleSize: number;      // Kích thước sao 4 cánh
}

export interface ThoEffectConfig extends BaseEffectConfig {
  stoneShardCount: number;  // Số mảnh đá bay từ 4 phía ghép vào lá bài
  dustParticleCount: number;// Số hạt bụi tỏa ra khi va đập
  cardScaleStart: number;   // Tỉ lệ bắt đầu phóng lên (từ nhỏ và mờ)
}

export interface AllEffectsConfig {
  thuy: ThuyEffectConfig;
  hoa: HoaEffectConfig;
  moc: MocEffectConfig;
  kim: KimEffectConfig;
  tho: ThoEffectConfig;
}

export const EFFECTS_CONFIG: AllEffectsConfig = {
  // 1. THỦY: Các vòng sóng elip loang ra từ giữa lá bài, giọt nước bắn lên rồi rơi theo trọng lực
  thuy: {
    durationMs: 800,
    particleCount: 40,
    colors: ["#1F3F7E", "#3A6BB2", "#7CB9E8", "#D4F1F9", "#FFFFFF"],
    speedMin: 3.5,
    speedMax: 7.0,
    sizeMin: 2.5,
    sizeMax: 6.0,
    waveRingCount: 3,
    dropCount: 36,
    gravity: 0.28,
    maxWaveRadius: 180,
  },

  // 2. HỎA: Tàn lửa (vàng, cam, đỏ, blend "lighter") bay lên với dao động ngang, vầng sáng cam nhấp nháy
  hoa: {
    durationMs: 800,
    particleCount: 60,
    colors: ["#FFD700", "#FF8C00", "#FF4500", "#D23A22", "#FFE4B5"],
    speedMin: 2.5,
    speedMax: 6.5,
    sizeMin: 2.0,
    sizeMax: 5.5,
    emberCount: 50,
    horizontalSway: 35,
    haloRadius: 140,
    blendMode: "lighter",
  },

  // 3. MỘC: 5 thân tre mọc từ mép dưới lá bài, vừa mọc vừa uốn nhẹ, lá nảy ra dọc thân, mờ dần
  moc: {
    durationMs: 800,
    particleCount: 30,
    colors: ["#3F7D3B", "#5BA855", "#8FD389", "#244E21", "#C2E8BC"],
    speedMin: 1.5,
    speedMax: 4.0,
    sizeMin: 3.0,
    sizeMax: 7.0,
    bambooCount: 5,
    leavesPerBamboo: 4,
    stemMaxWidth: 7,
    maxHeightRatio: 1.3,
  },

  // 4. KIM: Vệt sáng đồng quét chéo ngang mặt bài, ba vòng sóng âm tròn lan ra, vài ánh lấp lánh hình sao bốn cánh
  kim: {
    durationMs: 800,
    particleCount: 35,
    colors: ["#DDE3E8", "#F5D77F", "#E6C687", "#FFFFFF", "#B8860B"],
    speedMin: 2.0,
    speedMax: 5.0,
    sizeMin: 2.0,
    sizeMax: 6.0,
    rayWidth: 45,
    soundRingCount: 3,
    sparkleCount: 14,
    sparkleSize: 16,
  },

  // 5. THỔ: Các mảnh đá và bụi từ bốn phía bay vào ghép lại thành lá bài, rồi đám bụi nhỏ tỏa ra
  tho: {
    durationMs: 800,
    particleCount: 45,
    colors: ["#F2B632", "#B3821B", "#8C6214", "#D8A33A", "#E4D1A0"],
    speedMin: 3.0,
    speedMax: 7.5,
    sizeMin: 3.0,
    sizeMax: 8.0,
    stoneShardCount: 20,
    dustParticleCount: 35,
    cardScaleStart: 0.65,
  },
};
