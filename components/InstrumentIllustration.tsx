/**
 * FILE: components/InstrumentIllustration.tsx
 * MỤC ĐÍCH: Tranh minh họa SVG phong cách Đông Hồ cho 15 nhạc cụ.
 * - Nền họa tiết theo họ (hành), viền đen dày, màu phẳng, hơi lệch bản in
 * - Placeholder chất lượng cao — thay bằng tranh thật khi họa sĩ vẽ xong
 * - Ghi HUMAN_TODO: thay bằng bản vẽ tay / scan tranh khắc gỗ chính thức
 *
 * HUMAN_TODO: Thay thế toàn bộ SVG này bằng tranh khắc gỗ Đông Hồ chính thức
 * của 15 nhạc cụ do nghệ nhân vẽ và thẩm định văn hóa.
 */

import React from "react";
import type { ElementType } from "@/data/instruments";

interface IllustrationProps {
  instrumentId: string;
  element: ElementType;
  size?: number;
  className?: string;
  /** 0–2: biến thể nhẹ để 3 lá cùng nhạc cụ không giống hệt nhau (mục 14) */
  variant?: number;
}

// Màu nền họa tiết theo hành
const ELEMENT_BG: Record<ElementType, string> = {
  tho: "#F2B632",
  kim: "#DDE3E8",
  moc: "#3F7D3B",
  hoa: "#D23A22",
  thuy: "#1F3F7E",
};

const ELEMENT_BG2: Record<ElementType, string> = {
  tho: "#E4A820",
  kim: "#C8D0D8",
  moc: "#2E6A2A",
  hoa: "#B82E18",
  thuy: "#152E6A",
};

const ELEMENT_TEXT: Record<ElementType, string> = {
  tho: "#16141A",
  kim: "#16141A",
  moc: "#FFFFFF",
  hoa: "#FFFFFF",
  thuy: "#FFFFFF",
};

// Họa tiết nền theo hành (SVG pattern nhỏ)
function ElementPattern({ element }: { element: ElementType }) {
  const c = ELEMENT_BG2[element];
  switch (element) {
    case "tho":
      // Sóng cát
      return (
        <g opacity="0.3">
          {[0, 12, 24, 36].map((y, i) => (
            <path key={i} d={`M0 ${y + 6}Q6 ${y} 12 ${y + 6}Q18 ${y + 12} 24 ${y + 6}`}
              stroke={c} strokeWidth="1.5" fill="none" />
          ))}
        </g>
      );
    case "kim":
      // Hoa tinh thể
      return (
        <g opacity="0.25">
          {[6, 18, 30, 42].map((cx, i) => (
            [6, 18, 30].map((cy, j) => (
              <polygon key={`${i}-${j}`}
                points={`${cx},${cy - 5} ${cx + 4},${cy} ${cx},${cy + 5} ${cx - 4},${cy}`}
                stroke={c} strokeWidth="1" fill="none" />
            ))
          ))}
        </g>
      );
    case "moc":
      // Lá tre
      return (
        <g opacity="0.3">
          {[[4, 8], [12, 4], [20, 10], [8, 20], [18, 22], [28, 14], [32, 6]].map(([x, y], i) => (
            <path key={i} d={`M${x},${y} Q${x + 4},${y - 6} ${x + 8},${y}`}
              stroke={c} strokeWidth="1.5" fill="none" />
          ))}
        </g>
      );
    case "hoa":
      // Ngọn lửa nhỏ
      return (
        <g opacity="0.3">
          {[[6, 30], [14, 25], [22, 32], [10, 40], [26, 38]].map(([x, y], i) => (
            <path key={i} d={`M${x},${y} Q${x - 3},${y - 8} ${x},${y - 14} Q${x + 3},${y - 8} ${x},${y}`}
              stroke={c} strokeWidth="1.5" fill="none" />
          ))}
        </g>
      );
    case "thuy":
      // Gợn sóng nước
      return (
        <g opacity="0.3">
          {[8, 18, 28, 38].map((y, i) => (
            <path key={i} d={`M0 ${y}Q8 ${y - 6} 16 ${y}Q24 ${y + 6} 32 ${y}Q40 ${y - 6} 48 ${y}`}
              stroke={c} strokeWidth="1.5" fill="none" />
          ))}
        </g>
      );
  }
}

// Vẽ nhạc cụ theo ID — phong cách Đông Hồ đơn giản hoá
function InstrumentShape({ id, element }: { id: string; element: ElementType }) {
  const tc = ELEMENT_TEXT[element];
  const stroke = "#16141A";
  const sw = 2;

  switch (id) {
    case "dan-da":
      // Đàn đá — hàng đá treo
      return (
        <g>
          <line x1="14" y1="12" x2="66" y2="12" stroke={stroke} strokeWidth={sw + 0.5} strokeLinecap="round" />
          {[18, 26, 34, 42, 50, 58].map((x, i) => {
            const h = 12 + i * 2;
            return (
              <g key={x}>
                <line x1={x} y1="12" x2={x} y2={18} stroke={stroke} strokeWidth="1" />
                <rect x={x - 4} y={18} width={8} height={h} rx="1"
                  fill={tc} stroke={stroke} strokeWidth={sw} />
              </g>
            );
          })}
        </g>
      );
    case "trong-com":
      // Trống cơm — hình trụ đứng
      return (
        <g>
          <ellipse cx="40" cy="22" rx="16" ry="5" fill={tc} stroke={stroke} strokeWidth={sw} />
          <rect x="24" y="22" width="32" height="22" fill={tc} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="40" cy="44" rx="16" ry="5" fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Cơm ở tâm */}
          <ellipse cx="40" cy="22" rx="5" ry="2" fill={stroke} />
          <ellipse cx="40" cy="44" rx="5" ry="2" fill={stroke} />
        </g>
      );
    case "tu-va":
      // Tù và — sừng cong
      return (
        <g>
          <path d="M20 48 Q15 30 22 18 Q30 8 45 10 Q55 12 60 20"
            fill="none" stroke={stroke} strokeWidth={sw + 1} strokeLinecap="round" />
          <ellipse cx="60" cy="22" rx="8" ry="5"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="20" cy="47" rx="3.5" ry="3"
            fill={stroke} />
        </g>
      );
    case "cong-chieng":
      // Cồng chiêng — đĩa tròn có núm
      return (
        <g>
          <circle cx="40" cy="33" r="20" fill={tc} stroke={stroke} strokeWidth={sw + 0.5} />
          <circle cx="40" cy="33" r="5" fill={stroke} />
          <circle cx="40" cy="33" r="13" fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
      );
    case "trong-dong": {
      // Trống đồng — trống hình thang
      // Làm tròn tọa độ 3 số lẻ để server/client serialize giống hệt nhau (tránh hydration mismatch)
      const rd = (n: number) => Math.round(n * 1000) / 1000;
      return (
        <g>
          <ellipse cx="40" cy="18" rx="20" ry="6" fill={tc} stroke={stroke} strokeWidth={sw} />
          <path d="M20 18 L24 48 L56 48 L60 18" fill={tc} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="40" cy="48" rx="16" ry="5" fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Ngôi sao tâm */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line key={i} x1={rd(40 + 2 * Math.cos(r))} y1={rd(18 + 2 * Math.sin(r))}
                x2={rd(40 + 7 * Math.cos(r))} y2={rd(18 + 7 * Math.sin(r))}
                stroke={stroke} strokeWidth="1.5" />
            );
          })}
        </g>
      );
    }
    case "thanh-la":
      // Thanh la — đĩa mỏng treo
      return (
        <g>
          <line x1="35" y1="14" x2="45" y2="14" stroke={stroke} strokeWidth="2" />
          <line x1="40" y1="14" x2="40" y2="20" stroke={stroke} strokeWidth="1.5" />
          <circle cx="40" cy="36" r="16" fill={tc} stroke={stroke} strokeWidth={sw + 0.5} />
          <circle cx="40" cy="36" r="10" fill="none" stroke={stroke} strokeWidth="1" />
        </g>
      );
    case "dan-trung":
      // Đàn t'rưng — ống nứa xếp bậc
      return (
        <g>
          <line x1="14" y1="20" x2="66" y2="14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 17 + i * 8;
            const yTop = 20 - i * 1;
            const h = 16 + i * 3;
            return (
              <g key={i}>
                <line x1={x} y1={yTop} x2={x + 1} y2={yTop + 4} stroke={stroke} strokeWidth="1" />
                <rect x={x - 2} y={yTop + 4} width={5} height={h} rx="2"
                  fill={tc} stroke={stroke} strokeWidth={1.5} />
              </g>
            );
          })}
        </g>
      );
    case "sao-truc":
      // Sáo trúc — ống ngang dài
      return (
        <g>
          <rect x="12" y="28" width="56" height="9" rx="4.5"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Lỗ thổi và các lỗ bấm */}
          <circle cx="18" cy="32.5" r="2.5" fill={stroke} />
          {[28, 35, 40, 45, 50, 55].map((x, i) => (
            <circle key={i} cx={x} cy={32.5} r={1.8} fill={stroke} />
          ))}
        </g>
      );
    case "phach":
      // Phách — bảng gỗ và 2 que gõ
      return (
        <g>
          <rect x="22" y="30" width="36" height="12" rx="2"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          <line x1="28" y1="42" x2="28" y2="55" stroke={tc} strokeWidth="4" strokeLinecap="round" />
          <line x1="32" y1="42" x2="30" y2="55" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="52" y1="42" x2="52" y2="55" stroke={tc} strokeWidth="4" strokeLinecap="round" />
          <line x1="56" y1="42" x2="54" y2="55" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          {/* Dây gõ tách đôi */}
          <line x1="36" y1="30" x2="34" y2="18" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38" y1="30" x2="38" y2="18" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case "ken-bau":
      // Kèn bầu — thân kèn + loa bầu
      return (
        <g>
          <rect x="14" y="25" width="32" height="12" rx="3"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Loa bầu */}
          <path d="M46 22 Q60 16 64 33 Q60 50 46 43 Z"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Dăm kèn */}
          <rect x="10" y="28" width="6" height="6" rx="3"
            fill={stroke} />
          {/* Lỗ bấm */}
          {[20, 27, 34].map((x, i) => (
            <circle key={i} cx={x} cy={31} r={2} fill={stroke} />
          ))}
        </g>
      );
    case "trong-chau":
      // Trống chầu — trống nhỏ + roi
      return (
        <g>
          <ellipse cx="36" cy="26" rx="14" ry="4" fill={tc} stroke={stroke} strokeWidth={sw} />
          <rect x="22" y="26" width="28" height="16" fill={tc} stroke={stroke} strokeWidth={sw} />
          <ellipse cx="36" cy="42" rx="14" ry="4" fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Roi chầu */}
          <line x1="52" y1="20" x2="62" y2="50" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="62" cy="50" r="2" fill={stroke} />
        </g>
      );
    case "dan-ty-ba":
      // Đàn tỳ bà — thân hình lê
      return (
        <g>
          {/* Thân đàn */}
          <path d="M40 48 Q26 44 24 32 Q22 18 32 14 Q40 10 48 14 Q58 18 56 32 Q54 44 40 48Z"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Cần đàn */}
          <rect x="37" y="6" width="6" height="12" rx="2"
            fill={tc} stroke={stroke} strokeWidth="1.5" />
          {/* Dây đàn */}
          {[34, 37, 43, 46].map((x, i) => (
            <line key={i} x1={x} y1="14" x2={x} y2="46" stroke={stroke} strokeWidth="1" />
          ))}
          {/* Phím bấm */}
          {[18, 22, 26].map((y, i) => (
            <line key={i} x1={32} y1={y} x2={48} y2={y - i} stroke={stroke} strokeWidth="1.5" />
          ))}
        </g>
      );
    case "dan-bau":
      // Đàn bầu — hộp ngang + que gảy + bầu
      return (
        <g>
          {/* Hộp cộng hưởng */}
          <rect x="10" y="34" width="50" height="10" rx="2"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Cần đàn */}
          <line x1="56" y1="34" x2="62" y2="16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          {/* Bầu */}
          <ellipse cx="62" cy="14" rx="5" ry="7" fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Dây */}
          <line x1="12" y1="34" x2="62" y2="17" stroke={stroke} strokeWidth="1.5" />
        </g>
      );
    case "dan-tranh":
      // Đàn tranh — hộp hình thang 16 dây
      return (
        <g>
          <path d="M10 40 L14 22 L66 26 L62 44 Z"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Ngựa đàn */}
          {[18, 23, 28, 33, 38, 43, 48, 53].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={26 + i * 0.5} x2={x - 1} y2={40 + i * 0.5}
                stroke={stroke} strokeWidth="1" />
              <circle cx={x - 0.5} cy={33 + i * 0.5} r="1.5"
                fill={stroke} />
            </g>
          ))}
        </g>
      );
    case "dan-nhi":
      // Đàn nhị — thân ống, hai dây, cung vĩ
      return (
        <g>
          {/* Cần đàn thẳng */}
          <rect x="38" y="8" width="4" height="40" rx="2"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Hộp cộng hưởng */}
          <circle cx="40" cy="46" r="8" fill={tc} stroke={stroke} strokeWidth={sw} />
          {/* Hai dây */}
          <line x1="38" y1="10" x2="37" y2="54" stroke={stroke} strokeWidth="1" />
          <line x1="42" y1="10" x2="43" y2="54" stroke={stroke} strokeWidth="1" />
          {/* Cung vĩ */}
          <path d="M50 12 Q58 30 50 48" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="12" x2="50" y2="48" stroke={stroke} strokeWidth="1" />
        </g>
      );
    default:
      // Fallback: hình ngũ giác đơn giản
      return (
        <g>
          <polygon points="40,12 62,28 54,52 26,52 18,28"
            fill={tc} stroke={stroke} strokeWidth={sw} />
          <text x="40" y="36" textAnchor="middle" fontSize="10"
            fill={stroke} fontWeight="bold">
            {id.slice(0, 4)}
          </text>
        </g>
      );
  }
}

export default function InstrumentIllustration({
  instrumentId,
  element,
  size = 80,
  className = "",
  variant = 0,
}: IllustrationProps) {
  const bg = ELEMENT_BG[element];
  const v = ((Math.trunc(variant) % 3) + 3) % 3;

  // Biến thể theo lá: họa tiết lệch vị trí, hình hơi xoay, độ lệch bản in khác nhau
  const patternTransform =
    v === 1 ? "translate(4 3)" : v === 2 ? "translate(-3 5)" : undefined;
  const shapeTransform =
    v === 1 ? "rotate(1.6 40 33)" : v === 2 ? "rotate(-1.4 40 33) translate(0.8 -0.6)" : undefined;
  const misprintX = v === 1 ? 2 : v === 2 ? 0.5 : 1;
  const misprintY = v === 1 ? 1 : v === 2 ? 2 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 66"
      className={className}
      role="img"
      aria-label={`Minh họa ${instrumentId}`}
    >
      <defs>
        <clipPath id={`clip-${instrumentId}`}>
          <rect x="2" y="2" width="76" height="62" rx="3" />
        </clipPath>
      </defs>

      {/* Nền họa tiết */}
      <rect x="2" y="2" width="76" height="62" rx="3" fill={bg} />
      <clipPath id={`pat-clip-${instrumentId}`}>
        <rect x="2" y="2" width="76" height="62" rx="3" />
      </clipPath>
      <g clipPath={`url(#pat-clip-${instrumentId})`} transform={patternTransform}>
        <ElementPattern element={element} />
      </g>

      {/* Tranh nhạc cụ */}
      <g clipPath={`url(#clip-${instrumentId})`} transform={shapeTransform}>
        <InstrumentShape id={instrumentId} element={element} />
      </g>

      {/* Viền Đông Hồ */}
      <rect x="2" y="2" width="76" height="62" rx="3"
        fill="none" stroke="#16141A" strokeWidth="3" />
      {/* Hiệu ứng lệch bản in nhẹ — khác nhau theo biến thể */}
      <rect x={misprintX} y={misprintY} width="76" height="62" rx="3"
        fill="none" stroke="#16141A" strokeWidth="0.5" opacity={v === 0 ? 0.3 : 0.4} />
    </svg>
  );
}
