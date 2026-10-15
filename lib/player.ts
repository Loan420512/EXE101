/**
 * FILE: lib/player.ts — U4 Music Player State
 * Trình phát nhạc cụ: queue, track, play/pause, prev/next.
 * - Chỉ lưu trạng thái trong phiên (không localStorage vì không cần persist nhạc đang phát)
 * - Phát âm tổng hợp qua soundEngine — chưa có audioUrl thật → nhãn "Bản thử"
 * - Không tự phát (isMuted mặc định true)
 * - Dispatches event "ngucung:player" để MiniPlayer / NowPlaying cập nhật
 */

"use client";

import { INSTRUMENTS, type Instrument } from "@/data/instruments";
import { soundEngine } from "@/lib/audio";
import { dispatchSceneChange } from "@/data/scenes";
import type { SceneKey } from "@/data/scenes";

export interface Track {
  instrument: Instrument;
  /** Nhãn "Bản thử" — chưa có file âm thanh thật */
  isMock: true;
}

export interface PlayerState {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  isVisible: boolean;
  /** 0–1 — progress giả cho UI (tổng thời lượng = 2.0s cho âm tổng hợp) */
  progress: number;
  /** "Đang chuẩn bị âm" — true trongframes đầu sau lệnh phát */
  isBuffering: boolean;
  /** Lỗi phát âm (trình duyệt không có Web Audio) — null khi bình thường */
  error: string | null;
}

const PLAYER_EVENT = "ngucung:player";

const state: PlayerState = {
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  isVisible: false,
  progress: 0,
  isBuffering: false,
  error: null,
};

let progressTimer: ReturnType<typeof setInterval> | null = null;
let bufferingTimer: ReturnType<typeof setTimeout> | null = null;

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PLAYER_EVENT, { detail: { ...state } }));
}

function stopProgress() {
  if (progressTimer) { clearInterval(progressTimer); progressTimer = null; }
}

/** Nhãn "đang soạn âm" ngắn sau lệnh phát — AudioContext thật cần một nhịp để khởi tạo. */
function clearBuffering() {
  if (bufferingTimer) { clearTimeout(bufferingTimer); bufferingTimer = null; }
  state.isBuffering = false;
}

function startProgress(duration = 1800) {
  stopProgress();
  const step = 50;
  const inc = step / duration;
  progressTimer = setInterval(() => {
    state.progress = Math.min(1, state.progress + inc);
    emit();
    if (state.progress >= 1) {
      stopProgress();
      state.isPlaying = false;
      state.progress = 0;
      emit();
    }
  }, step);
}

export const player = {
  get current(): Track | null {
    return state.currentIndex >= 0 ? (state.queue[state.currentIndex] ?? null) : null;
  },
  get state(): Readonly<PlayerState> { return state; },

  playTrack(inst: Instrument) {
    // Thêm vào queue nếu chưa có, hoặc nhảy tới nếu đã có
    let idx = state.queue.findIndex((t) => t.instrument.id === inst.id);
    if (idx === -1) {
      state.queue = [...state.queue, { instrument: inst, isMock: true }];
      idx = state.queue.length - 1;
    }
    state.currentIndex = idx;
    state.isPlaying = false;
    state.isVisible = true;
    state.progress = 0;
    state.error = null;
    emit();
    // Phát âm mô phỏng — chỉ chạy khi người dùng vừa bấm nghe
    player.play();
    // Đổi cảnh nền
    dispatchSceneChange(inst.element as SceneKey);
  },

  play() {
    if (!player.current) return;
    if (!soundEngine.isSupported()) {
      state.isPlaying = false;
      state.isBuffering = false;
      state.error = "Trình duyệt này không có Web Audio, chưa phát được âm mô phỏng.";
      emit();
      return;
    }
    state.error = null;
    state.isPlaying = true;
    state.isBuffering = true;
    emit();
    // Bấm Phát là người dùng xin nghe: mở tiếng nếu đang tắt (mặc định của trang là tắt tiếng)
    if (soundEngine.getIsMuted()) soundEngine.setMuted(false);
    // Âm tổng hợp cần một nhịp khởi tạo AudioContext — gắn nhãn "Đang soạn âm" cho nhịp đó
    if (bufferingTimer) clearTimeout(bufferingTimer);
    bufferingTimer = setTimeout(() => {
      bufferingTimer = null;
      state.isBuffering = false;
      emit();
    }, 240);
    soundEngine.playElementTone(player.current.instrument.element, false);
    startProgress(2000);
  },

  pause() {
    state.isPlaying = false;
    state.isBuffering = false;
    stopProgress();
    if (bufferingTimer) { clearTimeout(bufferingTimer); bufferingTimer = null; }
    emit();
  },

  toggle() {
    if (state.isPlaying) player.pause(); else player.play();
  },

  next() {
    if (!state.queue.length) return;
    state.currentIndex = (state.currentIndex + 1) % state.queue.length;
    state.progress = 0;
    state.isPlaying = false;
    clearBuffering();
    emit();
    player.play();
  },

  prev() {
    if (!state.queue.length) return;
    state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
    state.progress = 0;
    state.isPlaying = false;
    clearBuffering();
    emit();
    player.play();
  },

  seek(progress: number) {
    state.progress = Math.max(0, Math.min(1, progress));
    emit();
  },

  addToQueue(inst: Instrument) {
    if (state.queue.some((t) => t.instrument.id === inst.id)) return;
    state.queue = [...state.queue, { instrument: inst, isMock: true }];
    if (state.currentIndex === -1) state.currentIndex = 0;
    state.isVisible = true;
    emit();
  },

  clearQueue() {
    state.queue = [];
    state.currentIndex = -1;
    state.isPlaying = false;
    state.isVisible = false;
    state.progress = 0;
    state.error = null;
    stopProgress();
    clearBuffering();
    emit();
  },

  show() { state.isVisible = true; emit(); },
  hide() { state.isVisible = false; emit(); },

  onUpdate(cb: (s: PlayerState) => void) {
    if (typeof window === "undefined") return () => {};
    const handler = (e: Event) => cb((e as CustomEvent<PlayerState>).detail);
    window.addEventListener(PLAYER_EVENT, handler);
    return () => window.removeEventListener(PLAYER_EVENT, handler);
  },
};

/** Playlist mẫu cục bộ — 5 hành đại diện */
export const SAMPLE_PLAYLISTS = [
  {
    id: "ngu-cung",
    name: "Ngũ Cung Hòa Điệu",
    description: "Một nhạc cụ mỗi hành — bản nhạc ngũ âm đầy đủ",
    tracks: (["dan-bau", "cong-chieng", "sao-truc", "ken-bau", "dan-da"] as const)
      .map((id) => INSTRUMENTS.find((i) => i.id === id)!)
      .filter(Boolean)
      .map((i): Track => ({ instrument: i, isMock: true })),
  },
  {
    id: "thuy-am",
    name: "Họ Thủy — Âm Vũ (A4)",
    description: "Đàn bầu, Đàn tranh, Đàn nhị",
    tracks: INSTRUMENTS.filter((i) => i.element === "thuy")
      .map((i): Track => ({ instrument: i, isMock: true })),
  },
  {
    id: "hoa-am",
    name: "Họ Hỏa — Âm Chủy (G4)",
    description: "Kèn bầu, Trống chầu, Đàn tỳ bà",
    tracks: INSTRUMENTS.filter((i) => i.element === "hoa")
      .map((i): Track => ({ instrument: i, isMock: true })),
  },
];
