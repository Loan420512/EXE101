/**
 * ==============================================================================
 * FILE: effects/thuy.ts
 * MỤC ĐÍCH: Vẽ hiệu ứng biến ảo họ THỦY (Vũ) trên Canvas toàn màn hình.
 * ĐẶC TRƯNG:
 * - Các vòng sóng elip loang rộng từ giữa lá bài
 * - Giọt nước bắn lên rồi rơi xuống theo gia tốc trọng lực
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi màu sắc, số giọt nước, tốc độ, gia tốc: hãy sửa tại `config/effects.ts` (mục `thuy`).
 * - Không cần chỉnh sửa tọa độ hay công thức vẽ tại đây.
 * ==============================================================================
 */

import { EffectRendererState } from "./types";
import { EFFECTS_CONFIG } from "@/config/effects";

interface WaterDrop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

let cachedDrops: WaterDrop[] | null = null;

export function renderThuyEffect(
  ctx: CanvasRenderingContext2D,
  state: EffectRendererState
) {
  const cfg = EFFECTS_CONFIG.thuy;
  const { cardRect, progress, isLowPerf } = state;
  const count = isLowPerf ? Math.floor(cfg.dropCount / 2) : cfg.dropCount;

  // Khởi tạo các giọt nước bắn ra ở đầu hiệu ứng
  if (progress < 0.05 || !cachedDrops || cachedDrops.length !== count) {
    cachedDrops = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // Bắn chếch lên trên (180 - 360 độ)
      const speed = cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin);
      cachedDrops.push({
        x: cardRect.centerX + (Math.random() - 0.5) * (cardRect.width * 0.6),
        y: cardRect.centerY + (Math.random() - 0.5) * (cardRect.height * 0.4),
        vx: Math.cos(angle) * speed * 1.2,
        vy: Math.sin(angle) * speed * 1.5,
        size: cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin),
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
      });
    }
  }

  // 1. Vẽ các vòng sóng elip loang ra từ giữa lá bài
  const rings = cfg.waveRingCount;
  for (let r = 0; r < rings; r++) {
    const ringOffset = r * 0.22;
    const ringProgress = Math.min(1, Math.max(0, (progress - ringOffset) / (1 - ringOffset)));
    if (ringProgress <= 0 || ringProgress >= 1) continue;

    const radiusX = ringProgress * cfg.maxWaveRadius * (cardRect.width / 120);
    const radiusY = radiusX * 0.58; // Tỉ lệ elip
    const alpha = (1 - ringProgress) * 0.85;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cardRect.centerX, cardRect.centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.lineWidth = 3.5 * (1 - ringProgress * 0.6);
    ctx.strokeStyle = `rgba(124, 185, 232, ${alpha})`;
    ctx.stroke();

    // Vòng sóng viền trong đậm hơn
    ctx.beginPath();
    ctx.ellipse(cardRect.centerX, cardRect.centerY, radiusX * 0.85, radiusY * 0.85, 0, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = `rgba(31, 63, 126, ${alpha * 0.6})`;
    ctx.stroke();
    ctx.restore();
  }

  // 2. Vẽ các giọt nước bắn lên và rơi theo trọng lực
  if (cachedDrops) {
    const elapsedSec = (progress * cfg.durationMs) / 1000;
    const fadeAlpha = 1 - Math.pow(progress, 1.8);

    cachedDrops.forEach((d) => {
      // Tọa độ tính theo phương trình chuyển động ném xiên: y = y0 + vy*t + 0.5*g*t^2
      const curX = d.x + d.vx * elapsedSec * 60;
      const curY = d.y + d.vy * elapsedSec * 60 + 0.5 * cfg.gravity * Math.pow(elapsedSec * 60, 2);

      ctx.save();
      ctx.globalAlpha = Math.max(0, fadeAlpha);
      ctx.fillStyle = d.color;

      // Giọt nước hình giọt lệ thuôn dài theo hướng rơi
      ctx.beginPath();
      ctx.arc(curX, curY, d.size * (1 - progress * 0.3), 0, Math.PI * 2);
      ctx.fill();

      // Điểm sáng phản chiếu trên giọt nước
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(curX - d.size * 0.3, curY - d.size * 0.3, d.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }
}
