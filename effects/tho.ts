/**
 * ==============================================================================
 * FILE: effects/tho.ts
 * MỤC ĐÍCH: Vẽ hiệu ứng biến ảo họ THỔ (Cung) trên Canvas toàn màn hình.
 * ĐẶC TRƯNG:
 * - Các mảnh đá từ bốn phía bay xoáy vào ghép lại thành khối lá bài
 * - Một đám bụi đất nhỏ tỏa ra xung quanh vị trí ghép nối
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi số mảnh đá, số hạt bụi, màu sắc: sửa trong `config/effects.ts` (mục `tho`).
 * ==============================================================================
 */

import { EffectRendererState } from "./types";
import { EFFECTS_CONFIG } from "@/config/effects";

interface StoneShard {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  size: number;
  color: string;
  points: { dx: number; dy: number }[];
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

let cachedShards: StoneShard[] | null = null;
let cachedDust: DustParticle[] | null = null;

export function renderThoEffect(
  ctx: CanvasRenderingContext2D,
  state: EffectRendererState
) {
  const cfg = EFFECTS_CONFIG.tho;
  const { cardRect, progress, isLowPerf } = state;
  const shardCount = isLowPerf ? Math.floor(cfg.stoneShardCount / 2) : cfg.stoneShardCount;
  const dustCount = isLowPerf ? Math.floor(cfg.dustParticleCount / 2) : cfg.dustParticleCount;

  // Khởi tạo mảnh đá bay từ 4 phía
  if (progress < 0.05 || !cachedShards || cachedShards.length !== shardCount) {
    cachedShards = [];
    for (let i = 0; i < shardCount; i++) {
      // 4 phía xung quanh
      const side = Math.floor(Math.random() * 4);
      let fromX = 0;
      let fromY = 0;
      const distance = 160 + Math.random() * 140;

      if (side === 0) { // Trên
        fromX = cardRect.centerX + (Math.random() - 0.5) * cardRect.width * 2;
        fromY = cardRect.centerY - distance;
      } else if (side === 1) { // Dưới
        fromX = cardRect.centerX + (Math.random() - 0.5) * cardRect.width * 2;
        fromY = cardRect.centerY + distance;
      } else if (side === 2) { // Trái
        fromX = cardRect.centerX - distance;
        fromY = cardRect.centerY + (Math.random() - 0.5) * cardRect.height * 2;
      } else { // Phải
        fromX = cardRect.centerX + distance;
        fromY = cardRect.centerY + (Math.random() - 0.5) * cardRect.height * 2;
      }

      const toX = cardRect.x + Math.random() * cardRect.width;
      const toY = cardRect.y + Math.random() * cardRect.height;
      const size = cfg.sizeMin + Math.random() * (cfg.sizeMax - cfg.sizeMin);

      cachedShards.push({
        fromX,
        fromY,
        toX,
        toY,
        size,
        color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
        points: [
          { dx: -size, dy: -size * 0.7 },
          { dx: size * 0.8, dy: -size },
          { dx: size, dy: size * 0.6 },
          { dx: -size * 0.5, dy: size },
        ],
      });
    }

    // Khởi tạo bụi đất văng ra
    cachedDust = [];
    for (let j = 0; j < dustCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.5 + Math.random() * 3.5;
      cachedDust.push({
        x: cardRect.centerX + (Math.random() - 0.5) * cardRect.width * 0.8,
        y: cardRect.centerY + (Math.random() - 0.5) * cardRect.height * 0.8,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        size: 2 + Math.random() * 4,
      });
    }
  }

  ctx.save();

  // 1. Mảnh đá bay vào (chạy trong 65% thời gian đầu)
  const flyProgress = Math.min(1, progress * 1.54);
  const shardAlpha = progress < 0.65 ? 1 : Math.max(0, (1 - progress) / 0.35);

  if (cachedShards) {
    cachedShards.forEach((shard) => {
      // Ease out cubic
      const t = 1 - Math.pow(1 - flyProgress, 3);
      const curX = shard.fromX + (shard.toX - shard.fromX) * t;
      const curY = shard.fromY + (shard.toY - shard.fromY) * t;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate((1 - t) * Math.PI * 2);
      ctx.globalAlpha = shardAlpha;
      ctx.fillStyle = shard.color;
      ctx.strokeStyle = "#8C6214";
      ctx.lineWidth = 1;

      // Đa giác mảnh đá
      ctx.beginPath();
      ctx.moveTo(shard.points[0].dx, shard.points[0].dy);
      for (let p = 1; p < shard.points.length; p++) {
        ctx.lineTo(shard.points[p].dx, shard.points[p].dy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    });
  }

  // 2. Bụi đất tỏa ra khi các mảnh chạm đích (nửa sau của hiệu ứng)
  if (progress > 0.45 && cachedDust) {
    const dustProg = (progress - 0.45) / 0.55;
    const dustAlpha = (1 - dustProg) * 0.75;

    ctx.save();
    ctx.globalAlpha = Math.max(0, dustAlpha);
    ctx.fillStyle = "#E4D1A0";

    cachedDust.forEach((d) => {
      const curX = d.x + d.vx * dustProg * 40;
      const curY = d.y + d.vy * dustProg * 40;
      ctx.beginPath();
      ctx.arc(curX, curY, d.size * (1 + dustProg * 0.8), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  ctx.restore();
}
