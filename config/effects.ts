/**
 * FILE: config/effects.ts
 * MỤC ĐÍCH: Thông số hiệu ứng biến ảo, nền sống, phân hạng thiết bị.
 * Sửa số liệu ở đây, không sửa trong shader/component.
 */

import { ELEMENT_COLORS, MOTION, SPACE } from "@/design/tokens";
import type { ElementType } from "@/data/instruments";
import type { Atmosphere } from "@/config/sections";

export interface BaseEffectConfig {
  durationMs: number;
  particleCount: number;
  colors: string[];
  speedMin: number;
  speedMax: number;
  sizeMin: number;
  sizeMax: number;
}

export interface ThuyEffectConfig extends BaseEffectConfig {
  waveRingCount: number;
  dropCount: number;
  gravity: number;
  maxWaveRadius: number;
}

export interface HoaEffectConfig extends BaseEffectConfig {
  emberCount: number;
  horizontalSway: number;
  haloRadius: number;
  blendMode: GlobalCompositeOperation;
}

export interface MocEffectConfig extends BaseEffectConfig {
  bambooCount: number;
  leavesPerBamboo: number;
  stemMaxWidth: number;
  maxHeightRatio: number;
}

export interface KimEffectConfig extends BaseEffectConfig {
  rayWidth: number;
  soundRingCount: number;
  sparkleCount: number;
  sparkleSize: number;
}

export interface ThoEffectConfig extends BaseEffectConfig {
  stoneShardCount: number;
  dustParticleCount: number;
  cardScaleStart: number;
}

export interface AllEffectsConfig {
  thuy: ThuyEffectConfig;
  hoa: HoaEffectConfig;
  moc: MocEffectConfig;
  kim: KimEffectConfig;
  tho: ThoEffectConfig;
}

export const EFFECTS_CONFIG: AllEffectsConfig = {
  thuy: {
    durationMs: MOTION.cardMs,
    particleCount: 40,
    colors: [ELEMENT_COLORS.thuy.fill, "#3A6BB2", ELEMENT_COLORS.thuy.glow, "#D4F1F9", "#FFFFFF"],
    speedMin: 3.5,
    speedMax: 7.0,
    sizeMin: 2.5,
    sizeMax: 6.0,
    waveRingCount: 3,
    dropCount: 36,
    gravity: 0.28,
    maxWaveRadius: 180,
  },
  hoa: {
    durationMs: MOTION.cardMs,
    particleCount: 60,
    colors: ["#FFD700", ELEMENT_COLORS.hoa.glow, "#FF4500", ELEMENT_COLORS.hoa.fill, "#FFE4B5"],
    speedMin: 2.5,
    speedMax: 6.5,
    sizeMin: 2.0,
    sizeMax: 5.5,
    emberCount: 50,
    horizontalSway: 35,
    haloRadius: 140,
    blendMode: "lighter",
  },
  moc: {
    durationMs: MOTION.cardMs,
    particleCount: 30,
    colors: [ELEMENT_COLORS.moc.fill, "#5BA855", ELEMENT_COLORS.moc.glow, "#244E21", "#C2E8BC"],
    speedMin: 1.5,
    speedMax: 4.0,
    sizeMin: 3.0,
    sizeMax: 7.0,
    bambooCount: 5,
    leavesPerBamboo: 4,
    stemMaxWidth: 7,
    maxHeightRatio: 1.3,
  },
  kim: {
    durationMs: MOTION.cardMs,
    particleCount: 35,
    colors: [ELEMENT_COLORS.kim.fill, ELEMENT_COLORS.kim.glow, "#E6C687", "#FFFFFF", "#B8860B"],
    speedMin: 2.0,
    speedMax: 5.0,
    sizeMin: 2.0,
    sizeMax: 6.0,
    rayWidth: 45,
    soundRingCount: 3,
    sparkleCount: 14,
    sparkleSize: 16,
  },
  tho: {
    durationMs: MOTION.cardMs,
    particleCount: 45,
    colors: [ELEMENT_COLORS.tho.fill, "#B3821B", "#8C6214", ELEMENT_COLORS.tho.glow, "#E4D1A0"],
    speedMin: 3.0,
    speedMax: 7.5,
    sizeMin: 3.0,
    sizeMax: 8.0,
    stoneShardCount: 20,
    dustParticleCount: 35,
    cardScaleStart: 0.65,
  },
};

export const BACKGROUND_CONFIG = {
  maxDprHigh: 1.5,
  maxDprMid: 1.15,
  maxDprLow: 1,
  particleCount: { high: 420, mid: 180, low: 0, min: 0 },
  frameBudgetMs: 20,
  jankWindowMs: 1000,
  pointerInkRadius: 0.18,
  pointerAttract: 0.35,
  vignette: 0.35,
  patternContrast: 0.12,
  drumRotateSpeed: 0.015,
  cloudSpeed: 0.04,
  waveSpeed: 0.06,
  sparkleDensity: 0.04,
  lerp: MOTION.sectionLerp,
  maxTiltDeg: SPACE.maxTiltDeg,
} as const;

export const ATMOSPHERE_COLORS: Record<
  Atmosphere,
  { a: string; b: string; c: string; particle: ElementType | "mix" }
> = {
  mix: {
    a: ELEMENT_COLORS.tho.fill,
    b: ELEMENT_COLORS.thuy.fill,
    c: ELEMENT_COLORS.hoa.fill,
    particle: "mix",
  },
  tho: {
    a: ELEMENT_COLORS.tho.fill,
    b: "#E4D1A0",
    c: "#8C6214",
    particle: "tho",
  },
  kim: {
    a: ELEMENT_COLORS.kim.fill,
    b: ELEMENT_COLORS.kim.glow,
    c: "#B8860B",
    particle: "kim",
  },
  moc: {
    a: ELEMENT_COLORS.moc.fill,
    b: ELEMENT_COLORS.moc.glow,
    c: "#244E21",
    particle: "moc",
  },
  hoa: {
    a: ELEMENT_COLORS.hoa.fill,
    b: ELEMENT_COLORS.hoa.glow,
    c: "#4A0C08",
    particle: "hoa",
  },
  thuy: {
    a: ELEMENT_COLORS.thuy.fill,
    b: ELEMENT_COLORS.thuy.glow,
    c: "#0A1A3A",
    particle: "thuy",
  },
};
