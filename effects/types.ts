/**
 * ==============================================================================
 * FILE: effects/types.ts
 * MỤC ĐÍCH: Định nghĩa kiểu dữ liệu dùng chung cho các hàm vẽ hiệu ứng Canvas ngũ hành.
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Khi cần thêm thuộc tính cho hiệu ứng (tọa độ bài, kích thước khung vẽ), bổ sung tại đây.
 * ==============================================================================
 */

export interface EffectTargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface EffectRendererState {
  canvasWidth: number;
  canvasHeight: number;
  cardRect: EffectTargetRect;
  progress: number; // Từ 0.0 (bắt đầu) đến 1.0 (kết thúc)
  elapsedMs: number;
  durationMs: number;
  isLowPerf: boolean; // Nếu CPU <= 4 luồng thì true
}
