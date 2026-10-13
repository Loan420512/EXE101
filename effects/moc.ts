/**
 * ==============================================================================
 * FILE: effects/moc.ts
 * MỤC ĐÍCH: Vẽ hiệu ứng biến ảo họ MỘC (Giốc) trên Canvas toàn màn hình.
 * ĐẶC TRƯNG:
 * - 5 thân tre mọc từ mép dưới lá bài vươn lên
 * - Thân tre vừa mọc vừa uốn nhẹ tự nhiên
 * - Lá tre nảy ra nhịp nhàng dọc thân, cuối cùng mờ dần
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi số thân tre, chiều cao mọc, màu sắc: sửa trong `config/effects.ts` (mục `moc`).
 * ==============================================================================
 */

import { EffectRendererState } from "./types";
import { EFFECTS_CONFIG } from "@/config/effects";

interface BambooStem {
  xOffsetRatio: number; // Vị trí xuất phát ở mép dưới lá bài (0 -> 1)
  bendFactor: number;   // Độ uốn cong nhẹ
  maxHeight: number;    // Chiều cao tối đa khi vươn lên
  color: string;
}

let cachedBamboos: BambooStem[] | null = null;

export function renderMocEffect(
  ctx: CanvasRenderingContext2D,
  state: EffectRendererState
) {
  const cfg = EFFECTS_CONFIG.moc;
  const { cardRect, progress } = state;
  const bambooCount = cfg.bambooCount; // 5 thân tre theo đề bài

  if (!cachedBamboos || cachedBamboos.length !== bambooCount) {
    cachedBamboos = [
      { xOffsetRatio: 0.12, bendFactor: -18, maxHeight: cardRect.height * 1.15, color: "#244E21" },
      { xOffsetRatio: 0.32, bendFactor: -8,  maxHeight: cardRect.height * 1.30, color: "#3F7D3B" },
      { xOffsetRatio: 0.50, bendFactor: 6,   maxHeight: cardRect.height * 1.40, color: "#5BA855" },
      { xOffsetRatio: 0.68, bendFactor: 14,  maxHeight: cardRect.height * 1.25, color: "#3F7D3B" },
      { xOffsetRatio: 0.88, bendFactor: 22,  maxHeight: cardRect.height * 1.10, color: "#244E21" },
    ];
  }

  // Tốc độ mọc vươn lên trong nửa đầu, mờ dần ở nửa sau
  const growProgress = Math.min(1, progress * 1.6);
  const fadeAlpha = progress > 0.65 ? Math.max(0, (1 - progress) / 0.35) : 1;

  ctx.save();
  ctx.globalAlpha = fadeAlpha;

  cachedBamboos.forEach((bamboo) => {
    const startX = cardRect.x + bamboo.xOffsetRatio * cardRect.width;
    const startY = cardRect.y + cardRect.height;
    const currentHeight = bamboo.maxHeight * growProgress;

    // Vẽ thân tre với các đốt tre
    const segments = 4;
    const segmentHeight = currentHeight / segments;

    let currentX = startX;
    let currentY = startY;

    for (let s = 0; s < segments; s++) {
      if (s * segmentHeight > currentHeight) break;

      const segProgress = Math.min(1, (currentHeight - s * segmentHeight) / segmentHeight);
      const nextY = currentY - segmentHeight * segProgress;
      const bend = Math.sin((s / segments) * Math.PI) * bamboo.bendFactor * growProgress;
      const nextX = startX + bend;

      // Nét vẽ thân tre
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(nextX, nextY);
      ctx.strokeStyle = bamboo.color;
      ctx.lineWidth = Math.max(2, cfg.stemMaxWidth * (1 - (s / segments) * 0.35));
      ctx.lineCap = "round";
      ctx.stroke();

      // Đốt tre
      ctx.beginPath();
      ctx.arc(nextX, nextY, ctx.lineWidth * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = "#8FD389";
      ctx.fill();

      // Nảy lá tre dọc thân nếu đã mọc qua đốt đó
      if (progress > 0.25 && s > 0 && s < segments) {
        const leafSide = s % 2 === 0 ? 1 : -1;
        const leafLength = 22 * Math.min(1, (progress - 0.25) * 2.5);
        const leafAngle = leafSide * 0.65 - 0.4;

        ctx.save();
        ctx.translate(nextX, nextY);
        ctx.rotate(leafAngle);

        ctx.beginPath();
        ctx.ellipse(leafLength * 0.5, 0, leafLength * 0.5, 4.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#8FD389";
        ctx.fill();

        ctx.restore();
      }

      currentX = nextX;
      currentY = nextY;
    }
  });

  ctx.restore();
}
