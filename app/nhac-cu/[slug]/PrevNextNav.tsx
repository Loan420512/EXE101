"use client";

/**
 * FILE: app/nhac-cu/[slug]/PrevNextNav.tsx
 * Nút Trước / Tiếp giữa 15 nhạc cụ + phím tắt ← → (U3.4).
 * - Link Next.js (giữ prefetch), ViewTransition cho morph card→card
 * - Phím ←/→ bị bỏ qua khi đang gõ input/textarea
 */

import React, { useEffect } from "react";
import Link from "next/link";
import { ViewTransition } from "react";
import { useRouter } from "next/navigation";
import type { Instrument } from "@/data/instruments";
import { IconArrowLeft, IconArrowRight } from "@/components/icons";

interface PrevNextNavProps {
  prev: Instrument | null;
  next: Instrument | null;
}

export default function PrevNextNav({ prev, next }: PrevNextNavProps) {
  const router = useRouter();

  // Phím tắt ← / →
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        t?.isContentEditable
      ) return;
      if (e.key === "ArrowLeft" && prev) router.push(`/nhac-cu/${prev.slug}`);
      else if (e.key === "ArrowRight" && next) router.push(`/nhac-cu/${next.slug}`);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, router]);

  if (!prev && !next) return null;

  const btnBase =
    "inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] font-bold text-sm border-[2px] border-[#1A1720] " +
    "transition-all duration-150 hover:-translate-y-px active:translate-y-px focus-visible:outline-2 focus-visible:outline-[#D23A22] max-w-[46%]";

  return (
    <nav aria-label="Nhạc cụ trước / tiếp theo" className="flex items-center justify-between gap-3 mb-10">
      {prev ? (
        <ViewTransition name={`card-${prev.id}`}>
          <Link
            href={`/nhac-cu/${prev.slug}`}
            rel="prev"
            className={btnBase + " bg-white/70 text-[#1A1720] shadow-[3px_3px_0px_#1A1720]"}
            aria-label={`Nhạc cụ trước: ${prev.name} (phím ←)`}
          >
            <IconArrowLeft size={16} aria-hidden />
            <span className="truncate">{prev.name}</span>
          </Link>
        </ViewTransition>
      ) : (
        <span />
      )}
      {next ? (
        <ViewTransition name={`card-${next.id}`}>
          <Link
            href={`/nhac-cu/${next.slug}`}
            rel="next"
            className={btnBase + " bg-[#F2B632] text-[#16141A] shadow-[3px_3px_0px_#1A1720]"}
            aria-label={`Nhạc cụ tiếp theo: ${next.name} (phím →)`}
          >
            <span className="truncate">{next.name}</span>
            <IconArrowRight size={16} aria-hidden />
          </Link>
        </ViewTransition>
      ) : (
        <span />
      )}
    </nav>
  );
}
