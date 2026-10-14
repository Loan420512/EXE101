/**
 * ==============================================================================
 * FILE: components/LivingBackground/CssFallbackBackground.tsx
 * MỤC ĐÍCH: Nền dự phòng thuần CSS — kết hợp ảnh quang cảnh, trống đồng và màu hành.
 * Dùng khi: prefers-reduced-motion, thiết bị phân hạng Min/Low, WebGL không khả dụng.
 * Tôn trọng tính dễ đọc (WCAG 2.2 AA) và mang trọn vẹn hồn cốt Cõi Ngũ Cung.
 * ==============================================================================
 */

import React from "react";
import { SCENES, DRUM_ASSET, type SceneKey, getSceneByElement } from "@/data/scenes";

interface CssFallbackBackgroundProps {
  currentScene?: SceneKey;
}

export default function CssFallbackBackground({ currentScene = "default" }: CssFallbackBackgroundProps) {
  const scene = getSceneByElement(currentScene);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden select-none bg-[#16141A]"
      aria-hidden="true"
    >
      {/* 1. Lớp ảnh quang cảnh tĩnh thực */}
      <picture className="absolute inset-0 w-full h-full opacity-30 transition-opacity duration-700">
        <source type="image/avif" srcSet={scene.srcSetAvif} sizes="100vw" />
        <source type="image/webp" srcSet={scene.srcSetWebp} sizes="100vw" />
        <img
          src={scene.webpUrl}
          alt={scene.alt}
          className="w-full h-full object-cover object-center filter saturate-[0.8] contrast-[1.05]"
          loading="eager"
        />
      </picture>

      {/* 2. Lớp phủ gradient tương phản */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{
          background: scene.overlayGradient,
        }}
      />

      {/* 3. Lớp Trống Đồng Đông Sơn thực (góc trên bên phải) */}
      <div className="absolute -top-24 md:-top-36 -right-24 md:-right-36 w-[500px] h-[500px] md:w-[750px] md:h-[750px] opacity-15">
        <picture className="block w-full h-full">
          <source type="image/avif" srcSet={DRUM_ASSET.srcSetWebp.replace(/\.webp/g, ".avif")} sizes="750px" />
          <source type="image/webp" srcSet={DRUM_ASSET.srcSetWebp} sizes="750px" />
          <img
            src={DRUM_ASSET.webpUrl}
            alt={DRUM_ASSET.alt}
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(242,182,50,0.2)]"
            loading="lazy"
          />
        </picture>
      </div>

      {/* 4. Vân giấy điệp nhẹ */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0) 2px,
              rgba(255,255,255,0) 6px,
              rgba(255,255,255,0.03) 8px
            )
          `,
        }}
      />
    </div>
  );
}
