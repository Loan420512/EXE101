/**
 * ==============================================================================
 * FILE: effects/hoa.ts
 * MỤC ĐÍCH: Vẽ hiệu ứng biến ảo họ HỎA (Chủy) trên Canvas toàn màn hình.
 * ĐẶC TRƯNG:
 * - Tàn lửa (vàng, cam, đỏ, blend mode "lighter") bốc lên theo dao động sóng sin ngang
 * - Vầng sáng cam bập bùng nhấp nháy tỏa ra từ phía sau lá bài
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi màu tàn lửa, số lượng hạt, bán kính vầng sáng: sửa trong `config/effects.ts` (mục `hoa`).
 * ==============================================================================
 */

import { EffectRendererState } from "./types";
import { EFFECTS_CONFIG } from "@/config/effects";

interface EmberParticle {
  startX: number;
  startY: number;
  speedY: number;
  swaySpeed: number;
  swayPhase: number;
  size: number;
  color: string;
}

let cachedEmbers: EmberParticle[] | null = null;

export function renderHoaEffect(
  ctx: CanvasRenderingContext2D,
  state: EffectRendererState
) {
  const cfg = EFFECTS_CONFIG.hoa;
  const { cardRect, progress, isLowPerf } = state;
  const count = isLowPerf ? Math.floor(cfg.emberCount / 2) : cfg.emberCount;

  // Khởi tạo tàn lửa
  if (progress < 0.05 || !cachedEmbers || cachedEmbers.length !== count) {
    cachedEmbers = [];
    for (let i = 0; i < count; i++) {
      cachedEmbers.push({
        startX: cardRect.x + Math.random() * cardRect.width,
        startY: cardRect.y + cardRect.height * (0.4 + Math.random() * 0.6),
        speedY: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
        swaySpeed: 4 + Math.random() * 6,
        swayPhase: Math.random() * Math.PI * 2,
        size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      });
    }
  }

  ctx.save();
  // Sử dụng blend mode "lighter" theo đúng yêu cầu
  ctx.globalCompositeOperation = cfg.blendMode;

  // 1. Vầng sáng cam nhấp nháy sau lá bài
  const flicker = 0.8 + 0.2 * Math.sin(progress * Math.PI * 8);
  const haloAlpha = Math.sin(progress * Math.PI) * 0.7 * flicker;
  const gradient = ctx.createRadialGradient(
    cardRect.centerX,
    cardRect.centerY,
    cardRect.width * 0.2,
    cardRect.centerX,
    cardRect.centerY,
    cfg.haloRadius * (cardRect.width / 100)
  );
  gradient.addColorStop(0, `rgba(255, 140, 0, ${haloAlpha * 0.9})`);
  gradient.addColorStop(0.4, `rgba(210, 58, 34, ${haloAlpha * 0.6})`);
  gradient.addColorStop(1, "rgba(210, 58, 34, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cardRect.centerX, cardRect.centerY, cfg.haloRadius * (cardRect.width / 100), 0, Math.PI * 2);
  ctx.fill();

  // 2. Tàn lửa bay lên với dao động ngang
  if (cachedEmbers) {
    const elapsedSec = (progress * cfg.durationMs) / 1000;
    const fadeOut = 1 - Math.pow(progress, 1.4);

    cachedEmbers.forEach((e) => {
      // Chuyển động Y hướng lên, X dao động hình sin
      const curY = e.startY - e.speedY * elapsedSec * 80;
      const curX = e.startX + Math.sin(elapsedSec * e.swaySpeed + e.swayPhase) * cfg.horizontalSway;

      const emberSize = Math.max(0.5, e.size * (1 - progress * 0.6));

      ctx.beginPath();
      ctx.arc(curX, curY, emberSize, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.globalAlpha = Math.max(0, fadeOut);
      ctx.fill();

      // Hạt lửa sáng rực tâm
      ctx.beginPath();
      ctx.arc(curX, curY, emberSize * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    });
  }

  ctx.restore();
}
