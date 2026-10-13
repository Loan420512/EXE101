"use client";

/**
 * ==============================================================================
 * FILE: components/EffectCanvas.tsx
 * MỤC ĐÍCH: Canvas toàn màn hình (pointer-events none) chạy hiệu ứng biến ảo ngũ hành ~0.8s.
 * ĐẶC TÍNH KỸ THUẬT:
 * - Tôn trọng `prefers-reduced-motion` (nếu bật: bỏ animation, gọi onComplete ngay lập tức)
 * - Tự động giảm một nửa số hạt nếu máy yếu (`hardwareConcurrency <= 4`)
 * - Khóa bấm chồng hiệu ứng (được quản lý qua state isPlaying)
 * - Khi hiệu ứng kết thúc, gọi callback `onComplete` để mở nội dung/modal.
 * ==============================================================================
 */

import React, { useEffect, useRef } from "react";
import { ElementType } from "@/data/instruments";
import { EffectTargetRect, EffectRendererState } from "@/effects/types";
import { EFFECTS_CONFIG } from "@/config/effects";
import { renderThuyEffect } from "@/effects/thuy";
import { renderHoaEffect } from "@/effects/hoa";
import { renderMocEffect } from "@/effects/moc";
import { renderKimEffect } from "@/effects/kim";
import { renderThoEffect } from "@/effects/tho";

interface EffectCanvasProps {
  activeEffect: {
    element: ElementType;
    cardRect: EffectTargetRect;
  } | null;
  onComplete: () => void;
}

export default function EffectCanvas({
  activeEffect,
  onComplete,
}: EffectCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activeEffect) return;

    // 1. Kiểm tra prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // 2. Kiểm tra phần cứng máy yếu (CPU <= 4 luồng)
    const isLowPerf =
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;

    const canvas = canvasRef.current;
    if (!canvas) {
      onComplete();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      onComplete();
      return;
    }

    // Thiết lập kích thước canvas theo DPR màn hình để nét vẽ sắc sảo
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const cfg = EFFECTS_CONFIG[activeEffect.element];
    const duration = cfg.durationMs || 800;
    const startTime = performance.now();
    let animId: number;

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      const state: EffectRendererState = {
        canvasWidth: width,
        canvasHeight: height,
        cardRect: activeEffect.cardRect,
        progress,
        elapsedMs: elapsed,
        durationMs: duration,
        isLowPerf,
      };

      // Gọi renderer riêng biệt của từng họ
      switch (activeEffect.element) {
        case "thuy":
          renderThuyEffect(ctx, state);
          break;
        case "hoa":
          renderHoaEffect(ctx, state);
          break;
        case "moc":
          renderMocEffect(ctx, state);
          break;
        case "kim":
          renderKimEffect(ctx, state);
          break;
        case "tho":
          renderThoEffect(ctx, state);
          break;
      }

      if (progress < 1) {
        animId = requestAnimationFrame(renderFrame);
      } else {
        ctx.clearRect(0, 0, width, height);
        onComplete();
      }
    };

    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, [activeEffect, onComplete]);

  if (!activeEffect) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 transition-none"
      aria-hidden="true"
    />
  );
}
