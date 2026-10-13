"use client";

/**
 * ==============================================================================
 * FILE: components/WaveformVisualizer.tsx
 * MỤC ĐÍCH: Biểu đồ phổ tần / sóng âm chạy theo thời gian thực (WebAudio AnalyserNode)
 * khi người dùng bấm nghe thử âm thanh nhạc cụ.
 * ==============================================================================
 */

import React, { useEffect, useRef } from "react";
import { soundEngine } from "@/lib/audio";
import { ElementType, ELEMENT_CONFIG } from "@/data/instruments";

interface WaveformVisualizerProps {
  element: ElementType;
  isPlaying: boolean;
  className?: string;
}

export default function WaveformVisualizer({
  element,
  isPlaying,
  className = "",
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = soundEngine.getAnalyser();
    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 32);
    const cfg = ELEMENT_CONFIG[element];

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Trạng thái nghỉ: sóng phẳng nhẹ
        dataArray.fill(2);
      }

      const barCount = 24;
      const barWidth = w / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const val = isPlaying ? dataArray[i % dataArray.length] || 0 : Math.sin(i * 0.5) * 4 + 6;
        const barHeight = Math.max(3, (val / 255) * h * 0.95);
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        ctx.fillStyle = cfg.color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Đỉnh sáng của thanh phổ tần
        ctx.fillStyle = "#16141A";
        ctx.fillRect(x, y, barWidth, 1.5);
      }
    };

    draw();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [element, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={36}
      className={`rounded border border-[#16141A]/30 bg-black/5 dark:bg-white/5 ${className}`}
      aria-label="Biểu đồ sóng âm nhạc cụ"
    />
  );
}
