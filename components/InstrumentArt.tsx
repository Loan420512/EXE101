"use client";

/**
 * ==============================================================================
 * FILE: components/InstrumentArt.tsx
 * MỤC ĐÍCH: (U1.7) Một chỗ duy nhất để vẽ "hình nhạc cụ" trên lá bài/phiếu xem trước.
 * - Ưu tiên ảnh thật đã cắt nền trong public/images/cards/<id>.png
 * - Chưa có ảnh thì tự quay lại tranh SVG Đông Hồ (InstrumentIllustration)
 * - 3 lá cùng nhạc cụ lệch nhẹ theo variant để giữ cảm giác bản in mộc bản
 * - Ảnh chỉ là minh họa (tên nhạc cụ đã có trong thẻ) nên alt rỗng
 * ==============================================================================
 */

import React from "react";
import Image from "next/image";
import { type ElementType, getInstrumentPhoto } from "@/data/instruments";
import InstrumentIllustration from "@/components/InstrumentIllustration";

interface Props {
  instrumentId: string;
  element: ElementType;
  /** cạnh hộp vuông chứa hình (px) */
  size?: number;
  /** 0–2: biến thể bản in */
  variant?: number;
  className?: string;
  /** ảnh đầu trang/canh gác — tải sớm */
  priority?: boolean;
}

/** Mỗi biến thể lệch một chút: không xoay, nghiêng trái, nghiêng phải */
const VARIANT_TILT = ["0deg", "-2.5deg", "2deg"];

export default function InstrumentArt({
  instrumentId,
  element,
  size = 88,
  variant = 0,
  className = "",
  priority = false,
}: Props) {
  const photo = getInstrumentPhoto(instrumentId);

  if (!photo) {
    return (
      <InstrumentIllustration
        instrumentId={instrumentId}
        element={element}
        variant={variant}
        size={size}
        className={className}
      />
    );
  }

  return (
    <Image
      src={photo}
      alt=""
      aria-hidden
      width={size}
      height={size}
      priority={priority}
      draggable={false}
      className={`object-contain ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${VARIANT_TILT[variant] ?? "0deg"})`,
        filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.32))",
      }}
    />
  );
}
