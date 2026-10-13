/**
 * FILE: app/dev/typography/page.tsx
 * MỤC ĐÍCH: Trang kiểm thử typography chữ Việt — dấu thanh không bị cắt.
 * TRUY CẬP: /dev/typography (chỉ dùng nội bộ khi phát triển)
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev: Kiểm Thử Typography Chữ Việt | Ngũ Cung",
  robots: { index: false, follow: false },
};

const TONE_MARK_ROWS = [
  { label: "Dấu sắc + mũ",    chars: "Ắ Ặ Ẳ Ẵ Ằ Ế Ệ Ể Ễ Ề Ố Ộ Ổ Ỗ Ồ Ứ Ự Ử Ữ Ừ" },
  { label: "Dấu nặng thấp",   chars: "ạ ặ ậ ộ ợ ụ ự ị ệ" },
  { label: "Hỗn hợp cao+thấp", chars: "Tiếng Việt — Tứ quý mộc — Ngũ hành tương sinh" },
  { label: "Câu đầy đủ",      chars: "Sáo trúc vang ngân bên dòng sông Đà Nẵng, đàn bầu rỉ rả một đêm mưa Hà Nội." },
  { label: "Heading tiêu đề", chars: "Cõi Ngũ Âm — Nơi Văn Hóa Thở" },
];

const SIZE_SCALE = [
  { cls: "text-6xl font-black",  label: "h1 — 60px/black" },
  { cls: "text-5xl font-black",  label: "h1 — 48px/black" },
  { cls: "text-4xl font-bold",   label: "h2 — 36px/bold" },
  { cls: "text-3xl font-bold",   label: "h2 — 30px/bold" },
  { cls: "text-2xl font-semibold", label: "h3 — 24px/semibold" },
  { cls: "text-xl font-semibold",  label: "h3 — 20px/semibold" },
  { cls: "text-lg font-medium",  label: "body lg — 18px" },
  { cls: "text-base font-normal",label: "body — 16px" },
  { cls: "text-sm font-normal",  label: "caption — 14px" },
  { cls: "text-xs font-normal",  label: "caption xs — 12px" },
];

export default function TypographyTestPage() {
  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <header>
        <h1 className="font-display font-black text-4xl text-[#1A1720] dark:text-[#EAE8D8]" style={{ lineHeight: "var(--lh-heading-tight)" }}>
          Kiểm Thử Typography — Dấu Thanh Việt
        </h1>
        <p className="mt-2 text-[#534E5C] dark:text-[#A8A4B2]" style={{ lineHeight: "var(--lh-body)" }}>
          Trang nội bộ để kiểm tra dấu thanh không bị cắt, line-height, và bộ phông chữ.
        </p>
        <div className="mt-4 flex gap-3 text-xs font-mono">
          <span className="px-2 py-1 bg-[#CC3520] text-white rounded">DEV ONLY</span>
          <span className="px-2 py-1 bg-[#1A1720] dark:bg-[#EAE8D8] text-white dark:text-[#1A1720] rounded">noindex</span>
        </div>
      </header>

      {/* ============ PHẦN 1: DẤU THANH HEADING ============ */}
      <section aria-labelledby="section-tone-heading">
        <h2 id="section-tone-heading" className="font-display font-black text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-6 border-b-[3px] border-[#F2B632] pb-2" style={{ lineHeight: "var(--lh-heading)" }}>
          1. Dấu Thanh — Playfair Display (Heading)
        </h2>
        <div className="space-y-6">
          {TONE_MARK_ROWS.map((row, i) => (
            <div key={i} className="p-4 paper-board rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8]">
              <div className="text-[10px] font-bold uppercase text-[#534E5C] dark:text-[#A8A4B2] mb-2 tracking-widest">
                {row.label}
              </div>
              {/* h1 size */}
              <div className="font-display font-black text-4xl text-[#1A1720] dark:text-[#EAE8D8] mb-2 overflow-visible" style={{ lineHeight: "var(--lh-heading-tight)", paddingTop: "0.05em", paddingBottom: "0.05em" }}>
                {row.chars}
              </div>
              {/* h3 size */}
              <div className="font-display font-semibold text-xl text-[#534E5C] dark:text-[#A8A4B2] overflow-visible" style={{ lineHeight: "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}>
                {row.chars}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PHẦN 2: DẤU THANH BODY TEXT ============ */}
      <section aria-labelledby="section-body">
        <h2 id="section-body" className="font-display font-black text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-6 border-b-[3px] border-[#3A7535] pb-2" style={{ lineHeight: "var(--lh-heading)" }}>
          2. Dấu Thanh — Be Vietnam Pro (Body)
        </h2>
        <div className="space-y-4">
          {TONE_MARK_ROWS.map((row, i) => (
            <div key={i} className="p-4 paper-board rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8]">
              <div className="text-[10px] font-bold uppercase text-[#534E5C] dark:text-[#A8A4B2] mb-1 tracking-widest">{row.label}</div>
              <p className="font-sans text-base text-[#1A1720] dark:text-[#EAE8D8] overflow-visible" style={{ lineHeight: "var(--lh-body)" }}>
                {row.chars}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PHẦN 3: THANG KÍCH THƯỚC ============ */}
      <section aria-labelledby="section-scale">
        <h2 id="section-scale" className="font-display font-black text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-6 border-b-[3px] border-[#1B3B7A] pb-2" style={{ lineHeight: "var(--lh-heading)" }}>
          3. Thang Kích Thước — Playfair Display
        </h2>
        <div className="space-y-4">
          {SIZE_SCALE.map((s, i) => (
            <div key={i} className="p-4 paper-board rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8]">
              <div className="text-[10px] font-mono text-[#534E5C] dark:text-[#A8A4B2] mb-1">{s.label}</div>
              <div
                className={`font-display text-[#1A1720] dark:text-[#EAE8D8] overflow-visible ${s.cls}`}
                style={{ lineHeight: i < 2 ? "var(--lh-heading-tight)" : "var(--lh-heading)", paddingTop: "0.05em", paddingBottom: "0.05em" }}
              >
                Ngũ Cung — Tứ quý Mộc: Sáo trúc Ắ Ặ
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PHẦN 4: SỐ TABULAR ============ */}
      <section aria-labelledby="section-numbers">
        <h2 id="section-numbers" className="font-display font-black text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-6 border-b-[3px] border-[#CC3520] pb-2" style={{ lineHeight: "var(--lh-heading)" }}>
          4. Số Tabular & Mono
        </h2>
        <div className="p-6 paper-board rounded-[4px] border-[3px] border-[#1A1720] dark:border-[#EAE8D8] space-y-4">
          <div className="tabular-nums font-sans text-3xl font-black text-[#1A1720] dark:text-[#EAE8D8]" data-tabular="true">
            1.000 điểm &nbsp;|&nbsp; 45 lá bài &nbsp;|&nbsp; 15 nhạc cụ
          </div>
          <div className="font-mono text-base text-[#534E5C] dark:text-[#A8A4B2]">
            C4 = 261.63 Hz &nbsp;|&nbsp; D4 = 293.66 Hz &nbsp;|&nbsp; E4 = 329.63 Hz
          </div>
          <div className="tabular-nums font-sans text-lg text-[#CC3520]" data-tabular="true">
            Điểm: 0001 0010 0011 0100 0101 (căn đều)
          </div>
        </div>
      </section>

      {/* ============ PHẦN 5: MÀU NGŨ HÀNH ============ */}
      <section aria-labelledby="section-colors">
        <h2 id="section-colors" className="font-display font-black text-2xl text-[#1A1720] dark:text-[#EAE8D8] mb-6 border-b-[3px] border-[#F2B632] pb-2" style={{ lineHeight: "var(--lh-heading)" }}>
          5. Màu & Aura 5 Hành
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { name: "Thổ", color: "#F2B632", glow: "rgba(242,182,50,0.5)", text: "#1A1720" },
            { name: "Kim", color: "#C8D4DC", glow: "rgba(200,212,220,0.6)", text: "#1A1720" },
            { name: "Mộc", color: "#3A7535", glow: "rgba(58,117,53,0.5)", text: "#FFFFFF" },
            { name: "Hỏa", color: "#CC3520", glow: "rgba(204,53,32,0.55)", text: "#FFFFFF" },
            { name: "Thủy", color: "#1B3B7A", glow: "rgba(27,59,122,0.55)", text: "#FFFFFF" },
          ].map((el) => (
            <div
              key={el.name}
              className="p-4 rounded-[4px] border-[3px] border-[#1A1720] flex flex-col gap-1"
              style={{
                backgroundColor: el.color,
                color: el.text,
                boxShadow: `4px 4px 0px #1A1720, 0 0 20px ${el.glow}`,
              }}
            >
              <span className="font-display font-black text-xl" style={{ lineHeight: "var(--lh-heading)" }}>{el.name}</span>
              <span className="font-mono text-xs opacity-80">{el.color}</span>
              <span className="text-xs mt-1" style={{ lineHeight: "var(--lh-body)" }}>Ắ Ặ Ề Ộ Ứ</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-[#8C8599] dark:text-[#7A7688] py-8" style={{ lineHeight: "var(--lh-body)" }}>
        Trang kiểm thử nội bộ — Không xuất bản ra bên ngoài.
      </footer>
    </main>
  );
}
