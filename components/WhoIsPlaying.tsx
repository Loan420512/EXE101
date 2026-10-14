"use client";

/**
 * FILE: components/WhoIsPlaying.tsx
 * Màn "Ai đang chơi?" (U2.5) — tối đa 5 hồ sơ lưu trên máy + Khách.
 * - Hiện lần đầu khi chưa từng chọn hồ sơ; mở lại bằng event "ngucung:show-profiles"
 * - Hồ sơ "Bé" tạo nhanh bằng một chạm; avatar là hành tự vẽ (icon SVG)
 * - Bỏ qua nhanh bằng "Khách"; không chặn thao tác; tôn trọng reduced-motion
 */

import React, { useEffect, useRef, useState } from "react";
import { useIsClient } from "@/lib/useIsClient";
import { UNIVERSES, type UniverseId } from "@/config/universes";
import {
  addProfile,
  removeProfile,
  setCurrentProfile,
  useProfiles,
  MAX_PROFILES,
  GUEST_PROFILE,
} from "@/lib/profiles";
import {
  IconEarth, IconMetal, IconLeaf, IconFire, IconWave, IconPentagon,
  IconPlus, IconClose, IconUser, IconChild,
} from "@/components/icons";

export const SHOW_PROFILES_EVENT = "ngucung:show-profiles";

const AVATAR_ICON: Record<UniverseId, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
  tho: IconEarth, kim: IconMetal, moc: IconLeaf, hoa: IconFire, thuy: IconWave, united: IconPentagon,
};

function Avatar({ avatar, size = 56 }: { avatar: UniverseId; size?: number }) {
  const kit = UNIVERSES[avatar];
  const Icon = AVATAR_ICON[avatar] ?? IconPentagon;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border-[3px] shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: kit.colors.surface,
        borderColor: kit.colors.accent,
        boxShadow: `3px 3px 0px ${kit.colors.shadow}`,
        color: kit.colors.accent,
      }}
      aria-hidden
    >
      <Icon size={Math.round(size * 0.45)} />
    </span>
  );
}

export default function WhoIsPlaying() {
  const { profiles, hasChosen } = useProfiles();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<UniverseId>("tho");
  const [isKid, setIsKid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isClient = useIsClient();

  // Gate chỉ hiện khi chưa từng chọn hồ sơ (suy ra, không setState trong effect)
  const gateNeeded = isClient && !hasChosen;
  const visible = open || gateNeeded;

  // Mở lại khi có yêu cầu (Header, trang Hồ sơ)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(SHOW_PROFILES_EVENT, handler);
    return () => window.removeEventListener(SHOW_PROFILES_EVENT, handler);
  }, []);

  // Esc đóng khi đã có hồ sơ; focus vào lựa chọn đầu tiên
  useEffect(() => {
    if (!visible) return;
    firstRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && hasChosen) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, hasChosen]);

  if (!visible) return null;

  const choose = (id: string) => {
    setCurrentProfile(id);
    setAdding(false);
    setError(null);
    setOpen(false);
    try { navigator.vibrate?.(12); } catch { /* bỏ qua */ }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const p = addProfile({ name, avatar, isKid });
    if (!p) {
      setError(name.trim() ? "Tên chưa hợp lệ — hãy nhập chữ cái thường ngày." : "Hãy nhập tên trước nhé.");
      return;
    }
    setName("");
    setIsKid(false);
    setAdding(false);
    setError(null);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal={hasChosen ? true : undefined}
      aria-labelledby="who-playing-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(6,6,10,0.88)", backdropFilter: "blur(6px)" }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl rounded-[6px] border-[3px] border-[#16141A] bg-[#14161E] p-6 sm:p-8"
        style={{ boxShadow: "6px 6px 0px #00000055, 0 0 0 1px #F2B63233" }}
      >
        {hasChosen && (
          <button
            onClick={() => setOpen(false)}
            aria-label="Đóng, giữ hồ sơ hiện tại"
            className="float-right -mt-2 -mr-2 w-9 h-9 inline-flex items-center justify-center rounded text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#F2B632]"
          >
            <IconClose size={16} aria-hidden />
          </button>
        )}

        <h2 id="who-playing-title" className="font-display font-black text-3xl sm:text-4xl text-white leading-[1.15]">
          Ai đang chơi?
        </h2>
        <p className="text-sm text-white/60 mt-2 mb-6">
          Chọn một hồ sơ để Ngũ Cung nhớ bạn đã nghe và chơi gì. Mọi thứ chỉ lưu trên máy này.
        </p>

        {adding ? (
          /* FORM TẠO HỒ SƠ MỚI */
          <form onSubmit={handleAdd} className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">Tên của bạn</span>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null); }}
                maxLength={24}
                autoFocus
                placeholder="Ví dụ: Bé Bống, Anh Hai…"
                className="mt-1 w-full rounded-[4px] border-2 border-[#F2B632]/60 bg-[#0E1014] px-3 py-2.5 text-white placeholder:text-white/30 focus:outline-2 focus:outline-[#F2B632]"
              />
            </label>

            <div>
              <span className="text-xs font-bold text-white/70 uppercase tracking-wide">Chọn hành đại diện</span>
              <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Hành đại diện">
                {(["tho", "kim", "moc", "hoa", "thuy"] as UniverseId[]).map((id) => {
                  const kit = UNIVERSES[id];
                  const active = avatar === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setAvatar(id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border-2 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-white ${
                        active ? "text-[#16141A]" : "text-white/70 border-white/20 hover:border-white/50"
                      }`}
                      style={active ? { backgroundColor: kit.colors.accent, borderColor: kit.colors.accent } : undefined}
                    >
                      <Avatar avatar={id} size={20} /> {kit.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isKid}
                onChange={(e) => setIsKid(e.target.checked)}
                className="w-5 h-5 accent-[#F2B632]"
              />
              <span className="inline-flex items-center gap-1.5 text-sm text-white/80 font-semibold">
                <IconChild size={16} aria-hidden /> Đây là hồ sơ của bé (7–12) — chữ to hơn, an toàn hơn
              </span>
            </label>

            {error && (
              <p role="alert" className="text-xs font-bold text-[#FF8C6B]">{error}</p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[4px] font-black text-sm text-[#16141A] bg-[#F2B632] border-2 border-[#16141A] shadow-[3px_3px_0px_#00000066] hover:-translate-y-px active:translate-y-px active:shadow-none transition-all focus-visible:outline-2 focus-visible:outline-white"
              >
                Tạo hồ sơ
              </button>
              <button
                type="button"
                onClick={() => { setAdding(false); setError(null); }}
                className="px-5 py-2.5 rounded-[4px] font-bold text-sm text-white/70 border-2 border-white/20 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#F2B632]"
              >
                Quay lại
              </button>
            </div>
          </form>
        ) : (
          /* LƯỚI HỒ SƠ */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profiles.map((p, i) => (
                <div key={p.id} className="relative">
                  <button
                    ref={i === 0 ? firstRef : undefined}
                    onClick={() => choose(p.id)}
                    className="w-full flex flex-col items-center gap-2.5 rounded-[6px] border-2 border-white/12 bg-white/[0.04] px-3 py-4 hover:border-[#F2B632]/70 hover:bg-white/[0.08] transition-all focus-visible:outline-2 focus-visible:outline-[#F2B632]"
                  >
                    <Avatar avatar={p.avatar} />
                    <span className="font-bold text-sm text-white truncate max-w-full">{p.name}</span>
                    {p.isKid && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-[3px] bg-[#3F7D3B] text-white">
                        <IconChild size={10} aria-hidden /> Bé
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => removeProfile(p.id)}
                    aria-label={`Xóa hồ sơ ${p.name}`}
                    className="absolute -top-2 -right-2 w-7 h-7 inline-flex items-center justify-center rounded-full bg-[#D23A22] text-white border-2 border-[#16141A] opacity-70 hover:opacity-100 transition-opacity focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <IconClose size={11} aria-hidden />
                  </button>
                </div>
              ))}

              {profiles.length < MAX_PROFILES && (
                <button
                  onClick={() => setAdding(true)}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-[6px] border-2 border-dashed border-white/25 px-3 py-4 text-white/60 hover:border-[#F2B632]/70 hover:text-white transition-all min-h-[120px] focus-visible:outline-2 focus-visible:outline-[#F2B632]"
                >
                  <IconPlus size={26} aria-hidden />
                  <span className="font-bold text-sm">Thêm hồ sơ</span>
                </button>
              )}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => choose(GUEST_PROFILE.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] font-black text-sm text-[#16141A] bg-[#C8D4DC] border-2 border-[#16141A] shadow-[3px_3px_0px_#00000066] hover:-translate-y-px active:translate-y-px active:shadow-none transition-all focus-visible:outline-2 focus-visible:outline-white"
              >
                <IconUser size={16} aria-hidden /> Vào nhanh với tư cách Khách
              </button>
              <span className="text-xs text-white/40">
                Khách vẫn nghe, chơi, đổi vũ trụ được — chỉ không lưu hồ sơ riêng.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
