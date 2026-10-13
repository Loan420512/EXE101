/**
 * ==============================================================================
 * FILE: components/LivingBackground/ParticleSystem.ts
 * MỤC ĐÍCH: Hệ thống hạt ngũ hành (Instanced Particles) trên WebGL / Canvas 2D:
 * - Thủy: Giọt nước, gợn sóng lăn tăn
 * - Hỏa: Tàn lửa bập bùng bay lên
 * - Mộc: Lá tre, phấn hoa lơ lửng
 * - Kim: Bụi kim loại lấp lánh phản chiếu
 * - Thổ: Cát vàng, mảnh đá trầm tĩnh
 * ==============================================================================
 */

import { ElementType } from "@/data/instruments";
import { ELEMENT_COLORS } from "@/design/tokens";

export interface BackgroundParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  rotation: number;
  vRot: number;
  element: ElementType;
  color: string;
}

export class ElementalParticleSystem {
  private particles: BackgroundParticle[] = [];
  private maxCount: number = 200;
  private width: number = 800;
  private height: number = 600;
  private currentElement: ElementType | "mix" = "mix";

  constructor(count: number = 180) {
    this.maxCount = count;
  }

  public setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }

  public setAtmosphere(element: ElementType | "mix", count?: number) {
    this.currentElement = element;
    if (count !== undefined) {
      this.maxCount = count;
    }
    this.reseed();
  }

  public reseed() {
    this.particles = [];
    const elements: ElementType[] =
      this.currentElement === "mix"
        ? ["tho", "kim", "moc", "hoa", "thuy"]
        : [this.currentElement];

    for (let i = 0; i < this.maxCount; i++) {
      const el = elements[i % elements.length]!;
      this.particles.push(this.spawnParticle(el, true));
    }
  }

  private spawnParticle(el: ElementType, randomY: boolean = false): BackgroundParticle {
    const color = ELEMENT_COLORS[el].fill;
    let vx = (Math.random() - 0.5) * 0.4;
    let vy = (Math.random() - 0.5) * 0.4;
    let size = Math.random() * 3 + 2;

    switch (el) {
      case "hoa": // Hỏa: tàn lửa bay lên
        vy = -(Math.random() * 0.8 + 0.3);
        vx = (Math.random() - 0.5) * 0.6;
        size = Math.random() * 2.5 + 1.5;
        break;
      case "thuy": // Thủy: rơi chậm hoặc lượn sóng
        vy = Math.random() * 0.6 + 0.2;
        vx = Math.sin(Math.random() * Math.PI) * 0.3;
        size = Math.random() * 3 + 2;
        break;
      case "moc": // Mộc: lá tre lượn ngang
        vx = Math.random() * 0.5 + 0.2;
        vy = Math.sin(Math.random() * Math.PI) * 0.3;
        size = Math.random() * 4 + 2;
        break;
      case "kim": // Kim: lóe sáng tại chỗ
        vx = (Math.random() - 0.5) * 0.2;
        vy = (Math.random() - 0.5) * 0.2;
        size = Math.random() * 2 + 1;
        break;
      case "tho": // Thổ: hạt cát chậm rãi
        vx = (Math.random() - 0.5) * 0.15;
        vy = Math.random() * 0.25 + 0.05;
        size = Math.random() * 3.5 + 1.5;
        break;
    }

    const baseAlpha = Math.random() * 0.25 + 0.08;

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : (vy < 0 ? this.height + 10 : -10),
      vx,
      vy,
      size,
      alpha: baseAlpha,
      baseAlpha,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
      element: el,
      color,
    };
  }

  public update(pointerX: number, pointerY: number, attract: boolean = true) {
    const w = this.width;
    const h = this.height;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]!;

      // Chuyển động cơ bản
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;

      // Hút nhẹ về con trỏ nếu ở gần (< 120px)
      if (attract && pointerX >= 0 && pointerY >= 0) {
        const dx = pointerX - p.x;
        const dy = pointerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 1) {
          const force = (1 - dist / 140) * 0.18;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
          p.alpha = Math.min(0.5, p.baseAlpha * 2.2);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }
      }

      // Xoay vòng màn hình
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]!;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      switch (p.element) {
        case "moc": // Hình lá tre thon dài
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "kim": // Hình thoi lấp lánh 4 cánh
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          break;
        case "tho": // Mảnh đá góc cạnh
          ctx.beginPath();
          ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.fill();
          break;
        case "hoa": // Đốm lửa tròn nhạt
        case "thuy": // Giọt nước tròn mềm
        default:
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }
}
