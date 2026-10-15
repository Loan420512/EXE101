"use client";

/**
 * FILE: components/BottomNav.tsx
 * Thanh tab đáy cho điện thoại — 5 điểm chạm chính, tối thiểu 44px.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCompass,
  IconLibrary,
  IconGamepad,
  IconMusicNote,
  IconUser,
} from "@/components/icons";

const TABS = [
  { href: "/", label: "Khám phá", Icon: IconCompass, match: (p: string) => p === "/" },
  {
    href: "/duyet",
    label: "Duyệt",
    Icon: IconLibrary,
    match: (p: string) => p.startsWith("/duyet") || p.startsWith("/bo-bai") || p.startsWith("/nhac-cu"),
  },
  {
    href: "/choi-thu-ngay",
    label: "Chơi",
    Icon: IconGamepad,
    match: (p: string) => p.startsWith("/choi-thu"),
  },
  {
    href: "/san-choi-ngu-am",
    label: "Nhạc",
    Icon: IconMusicNote,
    match: (p: string) => p.startsWith("/san-choi") || p.startsWith("/quiz"),
  },
  { href: "/ho-so", label: "Tôi", Icon: IconUser, match: (p: string) => p.startsWith("/ho-so") },
] as const;

export default function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[#0B0C14]/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Điều hướng đáy"
    >
      <ul className="grid grid-cols-5 h-14">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 h-full min-h-[44px] text-[11px] font-bold
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${active ? "text-[#F2B632]" : "text-white/55 hover:text-white"}`}
              >
                <Icon size={20} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
