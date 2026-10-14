"use client";

/**
 * ==============================================================================
 * FILE: components/UniverseGlyph.tsx
 * MỤC ĐÍCH: (U1.4/U2.5) Một nguồn duy nhất cho glyph 6 vũ trụ hành + avatar tròn.
 * - Icons SVG tự vẽ, không emoji
 * - Mọi màu lấy từ config/universes (luật 8: không hex cứng trong component)
 * ==============================================================================
 */

import React from "react";
import { UNIVERSES, type UniverseId } from "@/config/universes";
import {
  IconEarth, IconMetal, IconLeaf, IconFire, IconWave, IconPentagon,
} from "@/components/icons";

type GlyphProps = { size?: number; className?: string; "aria-hidden"?: boolean };

const GLYPH: Record<UniverseId, React.ComponentType<GlyphProps>> = {
  tho: IconEarth,
  kim: IconMetal,
  moc: IconLeaf,
  hoa: IconFire,
  thuy: IconWave,
  united: IconPentagon,
};

/** Chỉ vẽ hình biểu tượng của hành (không có nền) */
export function UniverseGlyph({ avatar, size = 14 }: { avatar: UniverseId; size?: number }) {
  const Icon = GLYPH[avatar] ?? IconPentagon;
  return <Icon size={size} aria-hidden />;
}

/** Vòng tròn màu hành đựng glyph — dùng cho avatar hồ sơ */
export function UniverseAvatar({
  avatar,
  size = 24,
  borderWidth = 2,
}: {
  avatar: UniverseId;
  size?: number;
  borderWidth?: number;
}) {
  const kit = UNIVERSES[avatar];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth,
        borderStyle: "solid",
        borderColor: kit.colors.accent,
        backgroundColor: kit.colors.accent + "33",
        color: kit.colors.accent,
      }}
      aria-hidden
    >
      <UniverseGlyph avatar={avatar} size={Math.round(size * 0.55)} />
    </span>
  );
}
