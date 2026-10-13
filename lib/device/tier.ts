/**
 * FILE: lib/device/tier.ts
 * MỤC ĐÍCH: Phân hạng thiết bị để chọn WebGL đầy đủ / Canvas 2D / chỉ CSS.
 */

export type DeviceTier = "high" | "mid" | "low" | "min";

export function detectDeviceTier(input?: {
  reducedMotion?: boolean;
  saveData?: boolean;
  cores?: number;
  memoryGb?: number;
  gpuTier?: number;
  webgl?: boolean;
}): DeviceTier {
  const reducedMotion = input?.reducedMotion ?? false;
  const saveData = input?.saveData ?? false;
  const cores = input?.cores ?? 8;
  const memoryGb = input?.memoryGb ?? 8;
  const gpuTier = input?.gpuTier ?? 2;
  const webgl = input?.webgl ?? true;

  if (reducedMotion || !webgl) return "min";
  if (saveData || memoryGb <= 2 || cores <= 2 || gpuTier <= 0) return "low";
  if (memoryGb <= 4 || cores <= 4 || gpuTier === 1) return "mid";
  return "high";
}

export function readBrowserHints(): {
  reducedMotion: boolean;
  saveData: boolean;
  cores: number;
  memoryGb: number;
  webgl: boolean;
} {
  if (typeof window === "undefined") {
    return { reducedMotion: false, saveData: false, cores: 8, memoryGb: 8, webgl: true };
  }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const canvas = document.createElement("canvas");
  const webgl = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: Boolean(nav.connection?.saveData),
    cores: navigator.hardwareConcurrency || 4,
    memoryGb: nav.deviceMemory ?? 4,
    webgl,
  };
}
