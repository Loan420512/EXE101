/**
 * ==============================================================================
 * FILE: components/LivingBackground/CssFallbackBackground.tsx
 * MỤC ĐÍCH: Nền dự phòng thuần CSS — ảnh quang cảnh + lớp phủ tối.
 * Dùng khi: prefers-reduced-motion, thiết bị phân hạng Min/Low, WebGL không khả dụng.
 * Trống đồng (defaultwebbackground.png) chưa dùng ở bước này.
 * ==============================================================================
 */

import React from "react";
import { type SceneKey, getSceneByElement } from "@/data/scenes";
import { ScenePhotoStack } from "./ScenePhotoStack";

interface CssFallbackBackgroundProps {
  currentScene?: SceneKey;
}

export default function CssFallbackBackground({ currentScene = "default" }: CssFallbackBackgroundProps) {
  const scene = getSceneByElement(currentScene);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden select-none bg-[#16141A]" aria-hidden="true">
      <ScenePhotoStack activeSceneKey={currentScene} overlay={scene.overlayGradient} />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
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
