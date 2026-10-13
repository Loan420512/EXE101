/**
 * ==============================================================================
 * FILE: effects/kim.ts
 * MỤC ĐÍCH: Vẽ hiệu ứng biến ảo họ KIM (Thương) trên Canvas toàn màn hình.
 * ĐẶC TRƯNG:
 * - Vệt sáng ánh kim/đồng quét chéo dứt khoát ngang mặt bài
 * - Ba vòng sóng âm tròn lan tỏa từ tâm điểm
 * - Ánh lấp lánh hình ngôi sao 4 cánh tỏa sáng xung quanh
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi số sao lấp lánh, độ rộng vệt sáng: sửa trong `config/effects.ts` (mục `kim`).
 * ==============================================================================
 */

import { EffectRendererState } from "./types";
import { EFFECTS_CONFIG } from "@/config/effects";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
}

let cachedSparkles: Sparkle[] | null = null;

export function renderKimEffect(
  ctx: CanvasRenderingContext2D,
  state: EffectRendererState
) {
  const cfg = EFFECTS_CONFIG.kim;
  const { cardRect, progress, isLowPerf } = state;
  const sparkleCount = isLowPerf ? Math.floor(cfg.sparkleCount / 2) : cfg.sparkleCount;

  if (progress < 0.05 || !cachedSparkles || cachedSparkles.length !== sparkleCount) {
    cachedSparkles = [];
    for (let i = 0; i < sparkleCount; i++) {
      cachedSparkles.push({
        x: cardRect.x - 30 + Math.random() * (cardRect.width + 60),
        y: cardRect.y - 30 + Math.random() * (cardRect.height + 60),
        size: cfg.sparkleSize * (0.6 + Math.random() * 0.8),
        rotation: Math.random() * Math.PI,
        delay: Math.random() * 0.35,
      });
    }
  }

  ctx.save();

  // 1. Ba vòng sóng âm tròn lan ra từ tâm lá bài
  const soundRings = cfg.soundRingCount; // 3 vòng tròn
  for (let r = 0; r < soundRings; r++) {
    const ringOffset = r * 0.2;
    const ringProgress = Math.min(1, Math.max(0, (progress - ringOffset) / (1 - ringOffset)));
    if (ringProgress <= 0 || ringProgress >= 1) continue;

    const radius = ringProgress * (cardRect.width * 1.25);
    const ringAlpha = (1 - ringProgress) * 0.8;

    ctx.beginPath();
    ctx.arc(cardRect.centerX, cardRect.centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 2.5 * (1 - ringProgress * 0.5);
    ctx.strokeStyle = `rgba(245, 215, 127, ${ringAlpha})`;
    ctx.stroke();

    // Vòng phụ màu bạc trắng
    ctx.beginPath();
    ctx.arc(cardRect.centerX, cardRect.centerY, radius * 0.95, 0, Math.PI * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(221, 227, 232, ${ringAlpha * 0.7})`;
    ctx.stroke();
  }

  // 2. Vệt sáng đồng quét chéo ngang mặt bài
  const sweepProgress = Math.min(1, progress * 1.5);
  if (sweepProgress < 1) {
    ctx.save();
    // Tạo vùng clip theo diện tích lá bài để vệt sáng quét ngang mặt bài
    ctx.beginPath();
    ctx.rect(cardRect.x, cardRect.y, cardRect.width, cardRect.height);
    ctx.clip();

    const sweepX = cardRect.x - cardRect.width + sweepProgress * (cardRect.width * 3);
    const grad = ctx.createLinearGradient(
      sweepX - cfg.rayWidth,
      cardRect.y,
      sweepX + cfg.rayWidth,
      cardRect.y + cardRect.height
    );
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.5, "rgba(255, 235, 160, 0.9)");
    grad.addColorStop(0.7, "rgba(221, 227, 232, 0.95)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    // Khối quét chéo 45 độ
    ctx.moveTo(sweepX - 40, cardRect.y);
    ctx.lineTo(sweepX + 40, cardRect.y);
    ctx.lineTo(sweepX + cardRect.height + 40, cardRect.y + cardRect.height);
    ctx.lineTo(sweepX + cardRect.height - 40, cardRect.y + cardRect.height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 3. Ánh lấp lánh hình sao 4 cánh
  if (cachedSparkles) {
    cachedSparkles.forEach((sp) => {
      const spProg = Math.max(0, Math.min(1, (progress - sp.delay) / 0.5));
      if (spProg <= 0 || spProg >= 1) return;

      const scale = Math.sin(spProg * Math.PI);
      const curSize = sp.size * scale;

      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(sp.rotation);

      // Vẽ sao 4 cánh (four-pointed star)
      ctx.fillStyle = "#FFF7D6";
      ctx.beginPath();
      ctx.moveTo(0, -curSize);
      ctx.quadraticCurveTo(0, 0, curSize, 0);
      ctx.quadraticCurveTo(0, 0, 0, curSize);
      ctx.quadraticCurveTo(0, 0, -curSize, 0);
      ctx.quadraticCurveTo(0, 0, 0, -curSize);
      ctx.closePath();
      ctx.fill();

      // Tâm sao trắng sáng
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, 0, curSize * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  ctx.restore();
}
