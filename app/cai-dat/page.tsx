"use client";

/**
 * FILE: app/cai-dat/page.tsx — U7 Cài đặt
 * Cỡ chữ A-/A+, tương phản cao, giảm chuyển động, sáng/tối, hiệu ứng,
 * chế độ Bé, PIN phụ huynh (UI giao diện — PIN thật cần bcrypt, ghi HUMAN_TODO).
 */

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LivingBackground from "@/components/LivingBackground/LivingBackground";
import { useSettings, resetSettings } from "@/lib/settings";
import {
  IconSettings, IconWarning, IconChild, IconLock, IconArrowRight, IconClose,
} from "@/components/icons";

export default function CaiDatPage() {
  const [settings, update] = useSettings();
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [showPinEntry, setShowPinEntry] = useState(false);
  /** Khóa phụ huynh ở mức giao diện: có PIN là phải mở khóa mới thấy cài đặt. */
  const [unlocked, setUnlocked] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");

  const locked = Boolean(settings.parentPin) && !unlocked;

  const tryUnlock = () => {
    if (unlockInput === settings.parentPin) {
      setUnlocked(true);
      setUnlockError("");
      setUnlockInput("");
      return;
    }
    setUnlockError("PIN chưa đúng. Thử lại hoặc xóa dữ liệu máy này ở cuối màn khóa.");
  };

  // PIN giả đơn giản (HUMAN_TODO: thay bằng hash thật)
  const setPin = () => {
    if (pinInput.length < 4) { setPinError("PIN cần ít nhất 4 số."); return; }
    update({ parentPin: pinInput });
    setPinInput("");
    setPinError("");
    setShowPinEntry(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B0C14", color: "#E8EAE0" }}>
      <LivingBackground forceAtmosphere="mix" />
      <Header />
      <div className="h-[62px]" aria-hidden />

      <main id="main-content" className="flex-1 max-w-lg mx-auto w-full px-4 py-10 space-y-8">
        <h1 className="font-display font-black text-3xl text-white flex items-center gap-2">
          <IconSettings size={28} aria-hidden /> Cài đặt
        </h1>

        {locked ? (
          <section className="bg-white/4 border border-white/10 rounded-[4px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <IconLock size={18} className="text-[#F2B632]" aria-hidden />
              <h2 className="font-display font-black text-body-sm uppercase tracking-wider text-white">
                Khu vực phụ huynh
              </h2>
            </div>
            <p className="text-body-sm text-white/60">
              Màn này đang bị khoá bằng PIN. Nhập PIN để vào Cỡ chữ, Tương phản, Chuyển động, Chế độ Bé và các mục khác.
            </p>
            <div className="flex gap-2 items-start">
              <div className="flex-1 max-w-[220px]">
                <label htmlFor="unlock-pin" className="sr-only">Mã PIN</label>
                <input
                  id="unlock-pin"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={8}
                  value={unlockInput}
                  onChange={(e) => { setUnlockInput(e.target.value.replace(/\D/g, "")); setUnlockError(""); }}
                  onKeyDown={(e) => { if (e.key === "Enter") tryUnlock(); }}
                  placeholder="PIN"
                  className="w-full px-3 py-2.5 rounded-[3px] border-2 border-[#16141A] bg-white/8 text-white
                    text-body font-black tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#F2B632]"
                />
              </div>
              <button
                onClick={tryUnlock}
                disabled={unlockInput.length < 4}
                className="tap px-4 py-2.5 rounded-[4px] bg-[#F2B632] text-[#16141A] text-body-sm font-black
                  border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] disabled:opacity-40
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]"
              >
                Mở khóa
              </button>
            </div>
            {unlockError && (
              <p role="alert" className="text-label font-bold text-[#FFB4A2] flex items-start gap-2">
                <IconWarning size={15} className="shrink-0 mt-0.5" aria-hidden /> {unlockError}
              </p>
            )}
            <p className="text-label text-white/40 border-t border-white/10 pt-3">
              Quên PIN? Cài đặt chỉ nằm trong trình duyệt này — xóa dữ liệu máy sẽ mở lại toàn bộ.
              {" "}
              <button
                onClick={() => { if (confirm("Xóa toàn bộ cài đặt trên máy này để mở khóa?")) resetSettings(); }}
                className="font-bold text-white/70 hover:text-white underline focus-visible:outline-2 focus-visible:outline-[#D23A22]"
              >
                Xóa cài đặt
              </button>
            </p>
          </section>
        ) : (
          <>

        {/* CỠ CHỮ */}
        <SettingGroup title="Cỡ chữ">
          <div className="flex gap-2">
            {(["default", "large", "xlarge"] as const).map((v) => (
              <button
                key={v}
                onClick={() => update({ fontSize: v })}
                aria-pressed={settings.fontSize === v}
                className={`tap flex-1 py-3 rounded-[4px] border-2 font-bold transition-all
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${settings.fontSize === v
                    ? "bg-[#F2B632] text-[#16141A] border-[#16141A] shadow-[2px_2px_0px_#16141A]"
                    : "border-white/20 text-white/60 hover:text-white"
                  }`}
                style={{ fontSize: v === "default" ? 14 : v === "large" ? 16 : 18 }}
              >
                {v === "default" ? "A" : v === "large" ? "A+" : "A++"}
              </button>
            ))}
          </div>
        </SettingGroup>

        {/* TƯƠNG PHẢN */}
        <SettingGroup title="Tương phản">
          <ToggleRow
            label="Tương phản cao"
            desc="Tăng độ tương phản chữ và nền để dễ đọc hơn"
            on={settings.contrast === "high"}
            onChange={(v) => update({ contrast: v ? "high" : "default" })}
          />
        </SettingGroup>

        {/* CHUYỂN ĐỘNG */}
        <SettingGroup title="Chuyển động & Hiệu ứng">
          <div className="space-y-3">
            <div className="flex gap-2">
              {(["full", "reduced", "none"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => update({ motion: v })}
                  aria-pressed={settings.motion === v}
                  className={`tap flex-1 py-2.5 rounded-[4px] border-2 text-label font-bold transition-all
                    focus-visible:outline-2 focus-visible:outline-[#D23A22]
                    ${settings.motion === v
                      ? "bg-[#F2B632] text-[#16141A] border-[#16141A] shadow-[2px_2px_0px_#16141A]"
                      : "border-white/20 text-white/60 hover:text-white"
                    }`}
                >
                  {v === "full" ? "Đầy đủ" : v === "reduced" ? "Giảm" : "Tắt"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(["full", "medium", "minimal"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => update({ effects: v })}
                  aria-pressed={settings.effects === v}
                  className={`tap flex-1 py-2.5 rounded-[4px] border-2 text-label font-bold transition-all
                    focus-visible:outline-2 focus-visible:outline-[#D23A22]
                    ${settings.effects === v
                      ? "bg-[#3F7D3B] text-white border-[#16141A] shadow-[2px_2px_0px_#16141A]"
                      : "border-white/20 text-white/60 hover:text-white"
                    }`}
                >
                  {v === "full" ? "Hiệu ứng đầy đủ" : v === "medium" ? "Vừa" : "Tối giản"}
                </button>
              ))}
            </div>
          </div>
        </SettingGroup>

        {/* MÀU */}
        <SettingGroup title="Giao diện sáng / tối">
          <div className="flex gap-2">
            {(["auto", "light", "dark"] as const).map((v) => (
              <button
                key={v}
                onClick={() => update({ colorScheme: v })}
                aria-pressed={settings.colorScheme === v}
                className={`tap flex-1 py-2.5 rounded-[4px] border-2 text-label font-bold transition-all
                  focus-visible:outline-2 focus-visible:outline-[#D23A22]
                  ${settings.colorScheme === v
                    ? "bg-[#F2B632] text-[#16141A] border-[#16141A] shadow-[2px_2px_0px_#16141A]"
                    : "border-white/20 text-white/60 hover:text-white"
                  }`}
              >
                {v === "auto" ? "Tự động" : v === "light" ? "Sáng" : "Tối"}
              </button>
            ))}
          </div>
        </SettingGroup>

        {/* CHẾ ĐỘ BÉ */}
        <SettingGroup
          title="Chế độ Bé"
          icon={<IconChild size={16} aria-hidden />}
          badge="7–12 tuổi"
        >
          <ToggleRow
            label="Bật chế độ Bé"
            desc="Chữ lớn hơn, câu đơn giản hơn, ẩn đăng ký và chia sẻ ra ngoài"
            on={settings.kidMode}
            onChange={(v) => update({ kidMode: v })}
          />
        </SettingGroup>

        {/* PIN PHỤ HUYNH */}
        <SettingGroup
          title="Mã PIN Phụ huynh"
          icon={<IconLock size={16} aria-hidden />}
        >
          <p className="text-label text-white/50 mb-3">
            Khoá cài đặt và đăng ký bằng PIN 4–8 số. Chỉ lưu trên máy này.
          </p>
          <div className="flex items-center gap-2 text-label text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded p-2 mb-3">
            <IconWarning size={14} aria-hidden />
            <span>PIN chưa được mã hóa — không dùng PIN quan trọng. Ghi HUMAN_TODO để bổ sung bcrypt.</span>
          </div>
          {settings.parentPin
            ? <div className="flex flex-wrap items-center gap-3">
                <span className="text-body-sm text-white/60">PIN đã đặt: ••••</span>
                <button
                  onClick={() => setUnlocked(false)}
                  className="tap px-3 rounded-[3px] border-2 border-white/25 text-label font-bold text-white/70
                    hover:text-white focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                >
                  Khóa lại ngay
                </button>
                <button
                  onClick={() => update({ parentPin: null })}
                  className="text-label text-red-400 hover:underline focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                >
                  Xóa PIN
                </button>
              </div>
            : showPinEntry
              ? <div className="flex gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="4–8 chữ số"
                    className="flex-1 px-3 py-2 rounded-[3px] border-2 border-[#16141A] bg-white/8
                      text-white text-body-sm focus:outline-none focus:ring-2 focus:ring-[#F2B632]"
                    onKeyDown={(e) => { if (e.key === "Enter") setPin(); }}
                    aria-label="Nhập mã PIN"
                  />
                  <button
                    onClick={setPin}
                    className="tap px-4 py-2 rounded-[4px] bg-[#F2B632] text-[#16141A] text-body-sm font-black
                      border-2 border-[#16141A] shadow-[2px_2px_0px_#16141A] focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setShowPinEntry(false)}
                    className="tap w-10 h-10 flex items-center justify-center rounded-full text-white/50 hover:text-white"
                  >
                    <IconClose size={16} aria-hidden />
                  </button>
                </div>
              : <button
                  onClick={() => setShowPinEntry(true)}
                  className="tap text-body-sm font-bold text-[#F2B632] hover:underline flex items-center gap-1
                    focus-visible:outline-2 focus-visible:outline-[#D23A22]"
                >
                  Đặt PIN <IconArrowRight size={14} aria-hidden />
                </button>
          }
          {pinError && <p className="text-label text-red-400 mt-2">{pinError}</p>}
        </SettingGroup>

        {/* ĐẶT LẠI */}
        <div className="pt-4 border-t border-white/8">
          <button
            onClick={() => { if (confirm("Đặt lại tất cả cài đặt về mặc định?")) resetSettings(); }}
            className="text-body-sm text-white/40 hover:text-white/70 hover:underline
              focus-visible:outline-2 focus-visible:outline-[#D23A22]"
          >
            Đặt lại toàn bộ cài đặt về mặc định
          </button>
        </div>

        {/* LIÊN KẾT */}
        <div className="flex gap-4 text-label text-white/30">
          <Link href="/ho-so" className="hover:text-white/60 hover:underline">Hồ sơ</Link>
          <span>·</span>
          <Link href="/tong-ket" className="hover:text-white/60 hover:underline">Ngũ Cung của bạn</Link>
        </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingGroup({ title, children, icon, badge }: {
  title: string; children: React.ReactNode;
  icon?: React.ReactNode; badge?: string;
}) {
  return (
    <section className="bg-white/4 border border-white/10 rounded-[4px] p-5 space-y-3">
      <div className="flex items-center gap-2">
        {icon && <span className="text-white/60">{icon}</span>}
        <h2 className="font-display font-black text-body-sm uppercase tracking-wider text-white">{title}</h2>
        {badge && (
          <span className="text-micro font-black text-white/40 border border-white/20 px-1.5 py-0.5 rounded ml-1">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function ToggleRow({ label, desc, on, onChange }: {
  label: string; desc?: string; on: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-body-sm font-bold text-white">{label}</p>
        {desc && <p className="text-label text-white/40 mt-0.5">{desc}</p>}
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className="tap shrink-0 flex items-center justify-center rounded-full
          focus-visible:outline-2 focus-visible:outline-[#D23A22]"
      >
        {/* Ruột công tắc dẹt 48×24 nằm trong vùng chạm 44×44 — không bị bóp vuông */}
        <span
          aria-hidden
          className={`relative block w-12 h-6 rounded-full border-2 transition-colors
            ${on ? "bg-[#3F7D3B] border-[#16141A]" : "bg-white/15 border-white/25"}`}
        >
          <span
            className="absolute top-[2px] left-[2px] w-5 h-5 rounded-full bg-white border-2 border-[#16141A] transition-transform duration-200"
            style={{ transform: on ? "translateX(22px)" : "translateX(0)" }}
          />
        </span>
        <span className="sr-only">{on ? "Bật" : "Tắt"}</span>
      </button>
    </div>
  );
}
