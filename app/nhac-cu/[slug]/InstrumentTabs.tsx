"use client";

/**
 * ==============================================================================
 * FILE: app/nhac-cu/[slug]/InstrumentTabs.tsx
 * MỤC ĐÍCH: (U3.1) Bảng 5 tab nội dung của trang chi tiết nhạc cụ.
 * - Tab: Giới thiệu / Cấu tạo / Cách chơi / Âm sắc / Ngũ hành
 * - Chuẩn WAI-ARIA tabs: tablist + tab + tabpanel, điều hướng ← → Home End
 * - Ô tab cuộn ngang trên máy nhỏ; mảng gạch chân màu theo hành
 * - Nội dung trống hiển thị "Đang cập nhật" (không bịa dữ liệu — luật 4)
 * ==============================================================================
 */

import React, { useRef, useState } from "react";

export interface InstrumentTab {
  /** định danh ổn định cho aria */
  id: string;
  /** nhãn ngắn hiện trên ô tab */
  label: string;
  /** tiêu đề đầy đủ trong panel */
  heading: string;
  /** nội dung; để trống sẽ hiện "Đang cập nhật" */
  body: string;
  /** icon SVG truyền từ server component */
  icon?: React.ReactNode;
  /** ghi chú nhỏ dưới tiêu đề panel */
  note?: string;
}

interface Props {
  tabs: InstrumentTab[];
  /** màu nhấn của hành (token ELEMENT_COLORS.fill) */
  accent: string;
  /** màu chữ đặt trên màu nhấn */
  accentText: string;
}


export default function InstrumentTabs({ tabs, accent, accentText }: Props) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (next: number) => {
    const n = tabs.length;
    const idx = ((next % n) + n) % n;
    setActive(idx);
    tabRefs.current[idx]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        move(active + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        move(active - 1);
        break;
      case "Home":
        e.preventDefault();
        move(0);
        break;
      case "End":
        e.preventDefault();
        move(tabs.length - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        document.getElementById(`panel-${tabs[active].id}`)?.focus();
        break;
      default:
        break;
    }
  };

  const current = tabs[active];

  return (
    <section aria-label={`Nội dung chi tiết: ${current.label}`} className="mb-12">
      {/* DẢI TAB — cuộn ngang khi hẹp */}
      <div
        role="tablist"
        aria-label="Chủ đề trong bài bách khoa"
        aria-orientation="horizontal"
        className="scrollbar-hide flex gap-1.5 overflow-x-auto border-b-[3px] border-[#1A1720] dark:border-[#EAE8D8] pb-0"
      >
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={[
                "group relative flex shrink-0 items-center gap-2 rounded-t-[6px] border-[3px] border-b-0",
                "px-3.5 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-[13px] font-black uppercase tracking-wide",
                "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D23A22]",
                isActive
                  ? "border-[#1A1720] dark:border-[#EAE8D8] -mb-[3px] pb-[calc(0.75rem+3px)]"
                  : "border-transparent text-[#534E5C] dark:text-[#A8A4B2] hover:text-[#1A1720] dark:hover:text-[#EAE8D8]",
              ].join(" ")}
              style={isActive ? { backgroundColor: accent, color: accentText } : undefined}
            >
              <span className="shrink-0" aria-hidden>{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PANEL — đổi nội dung khi chuyển tab */}
      <div
        key={current.id}
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        tabIndex={0}
        className="tab-panel-in rounded-b-[6px] rounded-tr-[6px] bg-white/90 dark:bg-[#1E1C23]/90 p-5 sm:p-8 focus-visible:outline-2 focus-visible:outline-[#D23A22]"
        style={{ boxShadow: "inset 0 3px 0 0 " + accent }}
      >
        <h2
          className="font-display font-black text-lg sm:text-2xl uppercase text-[#1A1720] dark:text-[#EAE8D8] mb-1 flex items-center gap-2"
          style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em" }}
        >
          <span className="text-[#D23A22]" aria-hidden>{current.icon}</span>
          {current.heading}
        </h2>
        {current.note && (
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#534E5C] dark:text-[#A8A4B2] mb-4">
            {current.note}
          </p>
        )}
        <p
          className="text-sm sm:text-base text-[#3C3844] dark:text-[#CFCCD6] max-w-3xl"
          style={{ lineHeight: "var(--lh-body)" }}
        >
          {current.body.trim() ? current.body : "Đang cập nhật — đội Ngũ Cung vẫn đang bổ sung phần này."}
        </p>
      </div>
    </section>
  );
}

