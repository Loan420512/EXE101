/**
 * FILE: components/icons/index.tsx
 * Bộ icon SVG tự vẽ — lưới 24px, nét 1.75px, không emoji trong UI.
 * Tất cả prop className và aria-hidden được truyền qua.
 */
import React from "react";

interface IconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
  title?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconPlay({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="5,3 19,12 5,21" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPause({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="5" y="3" width="4" height="18" rx="1" fill="currentColor" stroke="none" />
      <rect x="15" y="3" width="4" height="18" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSkipNext({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="4,4 16,12 4,20" fill="currentColor" stroke="none" />
      <rect x="18" y="4" width="2.5" height="16" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSkipPrev({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="20,4 8,12 20,20" fill="currentColor" stroke="none" />
      <rect x="3.5" y="4" width="2.5" height="16" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconVolume({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="3,9 3,15 7,15 13,20 13,4 7,9" />
      <path d="M17 9a5 5 0 0 1 0 6" />
    </svg>
  );
}

export function IconVolumeMute({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="3,9 3,15 7,15 13,20 13,4 7,9" />
      <line x1="17" y1="9" x2="23" y2="15" />
      <line x1="23" y1="9" x2="17" y2="15" />
    </svg>
  );
}

export function IconSearch({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

export function IconPlus({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function IconCheck({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polyline points="4,12 9,17 20,6" />
    </svg>
  );
}

export function IconClose({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="4" y1="4" x2="20" y2="20" />
      <line x1="20" y1="4" x2="4" y2="20" />
    </svg>
  );
}

export function IconChevronRight({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polyline points="9,4 17,12 9,20" />
    </svg>
  );
}

export function IconChevronLeft({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polyline points="15,4 7,12 15,20" />
    </svg>
  );
}

export function IconChevronDown({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polyline points="4,8 12,16 20,8" />
    </svg>
  );
}

export function IconHeart({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function IconHeartFilled({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function IconList({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function IconGrid({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconHome({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
      <rect x="9" y="14" width="6" height="7" rx="1" />
    </svg>
  );
}

export function IconCompass({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGamepad({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="2" y="7" width="20" height="11" rx="5" />
      <line x1="7" y1="12" x2="11" y2="12" />
      <line x1="9" y1="10" x2="9" y2="14" />
      <circle cx="16" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMusicNote({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="16.5" r="2.5" />
      <polyline points="9,18.5 9,7 20,5 20,16.5" />
    </svg>
  );
}

export function IconLibrary({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="3" y="3" width="4" height="18" rx="1" />
      <rect x="10" y="3" width="4" height="18" rx="1" />
      <path d="M17 3l4 1v16l-4 1V3z" />
    </svg>
  );
}

export function IconUser({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconSettings({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function IconShare({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function IconInfo({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth={3} strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

export function IconDrum({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <ellipse cx="12" cy="8" rx="9" ry="3.5" />
      <line x1="3" y1="8" x2="3" y2="16" />
      <line x1="21" y1="8" x2="21" y2="16" />
      <path d="M3 16c0 1.93 4.03 3.5 9 3.5s9-1.57 9-3.5" />
      <line x1="15" y1="2" x2="9" y2="4" />
      <line x1="9" y1="2" x2="15" y2="4" />
    </svg>
  );
}

export function IconPentagon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="12,2 22,9 18,21 6,21 2,9" />
    </svg>
  );
}

/** Biểu tượng trống đồng Đông Sơn — ngôi sao 6 tia đơn giản */
export function IconDongSon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 12 + 4 * Math.cos(rad);
        const y1 = 12 + 4 * Math.sin(rad);
        const x2 = 12 + 9 * Math.cos(rad);
        const y2 = 12 + 9 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </svg>
  );
}

export function IconEarth({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="3" y="13" width="18" height="6" rx="2" />
      <rect x="7" y="7" width="10" height="6" rx="1" />
      <rect x="10" y="3" width="4" height="4" rx="1" />
    </svg>
  );
}

export function IconFire({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
      <path d="M10 14c0 1.1.9 2 2 2s2-.9 2-2" />
    </svg>
  );
}

export function IconLeaf({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M2 20c4-8 12-12 20-16" />
      <path d="M22 4C18 8 16 14 12 18c-2 2-5 3-8 4" />
    </svg>
  );
}

export function IconMetal({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="12,2 22,20 2,20" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  );
}

export function IconWave({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </svg>
  );
}

export function IconStar({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

export function IconClock({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function IconArrowRight({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <polyline points="15,6 21,12 15,18" />
    </svg>
  );
}

export function IconBolt({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <polygon points="13,2 4,14 12,14 11,22 20,10 12,10" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTarget({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCardBack({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <polygon points="12,7 15,12 12,17 9,12" />
    </svg>
  );
}

export function IconQuestion({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.8-1.2 1.6V14" />
      <line x1="12" y1="17" x2="12" y2="17.2" strokeWidth={2.5} />
    </svg>
  );
}

export function IconLightbulb({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z" />
    </svg>
  );
}

// ── Bộ icon bổ sung cho U1 (thay emoji còn sót trong UI) ──

export function IconChild({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M12 10.5v6" />
      <path d="M7.5 13.5 12 12l4.5 1.5" />
      <path d="M9.5 20 12 16.5 14.5 20" />
    </svg>
  );
}

export function IconScroll({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M6 4h12a2 2 0 0 1 2 2v1H8" />
      <path d="M8 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
      <path d="M6 7H5a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h1" />
      <line x1="10" y1="11" x2="17" y2="11" />
      <line x1="10" y1="14.5" x2="17" y2="14.5" />
    </svg>
  );
}

export function IconBalloon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 3c-3.6 0-6 2.7-6 6 0 3.8 3.2 6.6 5.2 7.4l.8.6.8-.6c2-.8 5.2-3.6 5.2-7.4 0-3.3-2.4-6-6-6z" />
      <path d="M12 17v1.5" />
      <path d="M12 18.5c-1.5 1.5-1.5 2.5 0 2.5s1.5-1 0-2.5z" />
    </svg>
  );
}

export function IconBook({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 1-2-2V5z" />
      <path d="M20 5a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 0 2-2V5z" />
    </svg>
  );
}

export function IconBlocks({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
      <rect x="8.5" y="4.5" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconHand({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 11V6a1.5 1.5 0 0 1 3 0v7" />
      <path d="M8 12l-1.6 1.6a1.5 1.5 0 0 0-.3 1.8l2 3.5A5 5 0 0 0 12.5 22H14a7 7 0 0 0 7-7v-2" />
    </svg>
  );
}

export function IconLink({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4L11.2 6.4" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0L5 12.6a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4" />
    </svg>
  );
}

export function IconWarning({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 3.5 21 19.5H3L12 3.5z" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <line x1="12" y1="17" x2="12" y2="17.2" strokeWidth={2.5} />
    </svg>
  );
}

export function IconGift({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="4" y="9" width="16" height="4" rx="1" />
      <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      <path d="M12 9v12" />
      <path d="M12 9C10 9 7.5 8 7.5 5.8A2.3 2.3 0 0 1 12 5.5a2.3 2.3 0 0 1 4.5.3C16.5 8 14 9 12 9z" />
    </svg>
  );
}

export function IconCrown({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M4 18 3 7l5 4 4-6 4 6 5-4-1 11H4z" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

export function IconTrophy({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M8 4h8v6a4 4 0 0 1-8 0V4z" />
      <path d="M8 5H5.5a.5.5 0 0 0-.5.5C5 8.5 6.5 10 8 10" />
      <path d="M16 5h2.5a.5.5 0 0 1 .5.5C19 8.5 17.5 10 16 10" />
      <path d="M12 14v3" />
      <path d="M8.5 20.5h7" />
      <path d="M9.5 17.5h5L15 20.5H9l.5-3z" />
    </svg>
  );
}

export function IconBell({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 4a6 6 0 0 0-6 6c0 4-1.5 5.5-2 6h16c-.5-.5-2-2-2-6a6 6 0 0 0-6-6z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
      <line x1="12" y1="2" x2="12" y2="4" />
    </svg>
  );
}

export function IconMountain({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M3 19 10 7l4 6.5" />
      <path d="M10.5 19 15.5 11 21 19H3" />
    </svg>
  );
}

export function IconSparkles({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
      <path d="M5 14.5l.6 1.6 1.6.6-1.6.6L5 19l-.6-1.7-1.6-.6 1.6-.6L5 14.5z" />
    </svg>
  );
}

export function IconTree({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 3 7 10h3l-4 6h6" />
      <path d="M12 3l5 7h-3l4 6h-6" />
      <line x1="12" y1="16" x2="12" y2="21" />
      <line x1="9.5" y1="21" x2="14.5" y2="21" />
    </svg>
  );
}

export function IconTent({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 5 3.5 19h17L12 5z" />
      <path d="M12 9.5 9 19" />
      <path d="M12 9.5 15 19" />
    </svg>
  );
}

export function IconIsland({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M14 14c-3.5 0-6.5 2-8 5h18c-1.5-2-4.5-2.5-6.5-2.5" />
      <path d="M13 14V6" />
      <path d="M13 6c3-3.5 6-3 7.5-1.5C18 6.5 15.5 8 13 7.5" />
      <path d="M13 8.5c-2.5-1-4.5-.5-6 1 2 .5 4 1 6 0" />
    </svg>
  );
}

export function IconShield({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 3 5 5.5V11c0 5 3 8.5 7 10 4-1.5 7-5 7-10V5.5L12 3z" />
      <polyline points="9,11.5 11.5,14 15.5,9.5" />
    </svg>
  );
}

export function IconSwords({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M4 4l9 9" />
      <path d="M13 13l2-2 5-5-2.5-.5L15 3" />
      <path d="M11 15l-4 4 2 2 4-4" />
      <path d="M20 4l-9 9" />
      <path d="M11 13l-2-2-5-5 .5 2.5L3 9" />
      <path d="M13 15l4 4-2 2-4-4" />
    </svg>
  );
}

export function IconUsers({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3.5 20c0-3.5 2.5-5.5 5.5-5.5s5.5 2 5.5 5.5" />
      <circle cx="17.5" cy="9.5" r="2.5" />
      <path d="M16 14.8c2.6-.4 4.5 1.6 4.5 4.2" />
    </svg>
  );
}

export function IconRocket({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M12 15c-2-4.5-.5-9.5 2.5-12 3 3 4.5 8 2.5 12" />
      <path d="M12 15l-2.5 1L7 12.5C5.5 13 4 14.5 4 16.5l3.5-.5" />
      <path d="M17 16 19.5 17 20 13c1.5 1.5 2 3.5 1.5 5.5l-3-.5" />
      <path d="M10.5 17.5 12 21l1.5-3.5" />
      <circle cx="13.6" cy="8.5" r="1.4" />
    </svg>
  );
}

export function IconCycle({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <polyline points="18,2.5 18,6.5 14,6.5" />
    </svg>
  );
}

export function IconStore({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M4 4h16l1 4a2.5 2.5 0 0 1-4.5 1.5A2.5 2.5 0 0 1 12 11a2.5 2.5 0 0 1-4.5-1.5A2.5 2.5 0 0 1 3 8l1-4z" />
      <path d="M5 12.5V20h14v-7.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function IconScore({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="16" x2="17" y2="16" />
      <circle cx="8" cy="14" r="2.2" fill="currentColor" stroke="none" />
      <line x1="10.2" y1="14" x2="10.2" y2="7" />
      <circle cx="16" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <line x1="18.2" y1="12" x2="18.2" y2="5.5" />
    </svg>
  );
}

export function IconFlag({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <line x1="5" y1="3" x2="5" y2="21" />
      <path d="M5 4h14l-3.5 4.5L19 13H5" />
    </svg>
  );
}

export function IconTaiji({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a4.5 4.5 0 0 1 0 9a4.5 4.5 0 0 0 0 9" />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="1.1" />
    </svg>
  );
}

export function IconLock({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <line x1="12" y1="14" x2="12" y2="16.5" />
    </svg>
  );
}

export function IconMedal({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...base(size)} className={className} {...rest}>
      <path d="M8.5 3 10.8 9" />
      <path d="M15.5 3 13.2 9" />
      <path d="M6.5 3h11" />
      <circle cx="12" cy="15.5" r="5.5" />
      <path d="M12 12.8l.85 1.7 1.9.28-1.38 1.34.33 1.9L12 18.9l-1.7.86.33-1.9-1.38-1.34 1.9-.28.85-1.7z" fill="currentColor" stroke="none" />
    </svg>
  );
}
