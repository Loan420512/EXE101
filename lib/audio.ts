/**
 * ==============================================================================
 * FILE: lib/audio.ts
 * MỤC ĐÍCH: Bộ tổng hợp âm thanh WebAudio chuẩn thang ngũ âm (Cung, Thương, Giốc, Chủy, Vũ).
 * TÍNH NĂNG:
 * - 5 âm sắc riêng biệt tổng hợp thuần bằng Web Audio API (không dùng Tone.js để giữ bundle nhẹ).
 * - Mặc định tắt (Muted), bật bằng nút rõ ràng, lưu trạng thái.
 * - Master AnalyserNode kết nối trực tiếp để vẽ sóng âm (Waveform / Frequency) chạy thật.
 * - Hỗ trợ phát nốt theo tần số tự do / quãng tám cho Sân chơi ngũ âm (/san-choi-ngu-am).
 * - Bộ phát ambient ngẫu nhiên tĩnh lặng theo hành đang hiển thị.
 * ==============================================================================
 */

import { ElementType } from "@/data/instruments";

// Tần số ngũ cung chuẩn Quãng 4 (Hz)
export const BASE_FREQUENCIES: Record<ElementType, number> = {
  tho: 261.63, // C4 - Cung
  kim: 293.66, // D4 - Thương
  moc: 329.63, // E4 - Giốc
  hoa: 392.00, // G4 - Chủy
  thuy: 440.00, // A4 - Vũ
};

// Bảng tần số 3 quãng tám (Octave 3, 4, 5) cho Sân chơi ngũ âm
export const OCTAVE_FREQUENCIES: Record<ElementType, { oct3: number; oct4: number; oct5: number }> = {
  tho: { oct3: 130.81, oct4: 261.63, oct5: 523.25 },
  kim: { oct3: 146.83, oct4: 293.66, oct5: 587.33 },
  moc: { oct3: 164.81, oct4: 329.63, oct5: 659.25 },
  hoa: { oct3: 196.00, oct4: 392.00, oct5: 783.99 },
  thuy: { oct3: 220.00, oct4: 440.00, oct5: 880.00 },
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Mặc định tắt theo yêu cầu
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();

        // Tạo AnalyserNode
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        // Tạo Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    this.getContext();
    return this.analyser;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.getContext();
    } else {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  private getDestinationNode(ctx: AudioContext): AudioNode {
    return this.masterGain || ctx.destination;
  }

  /**
   * Phát âm thanh ngũ cung chuẩn theo hành
   */
  public playElementTone(element: ElementType, forcePlay: boolean = false) {
    if (this.isMuted && !forcePlay) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      switch (element) {
        case "thuy":
          this.playThuy(ctx, BASE_FREQUENCIES.thuy);
          break;
        case "hoa":
          this.playHoa(ctx, BASE_FREQUENCIES.hoa);
          break;
        case "moc":
          this.playMoc(ctx, BASE_FREQUENCIES.moc);
          break;
        case "kim":
          this.playKim(ctx, BASE_FREQUENCIES.kim);
          break;
        case "tho":
          this.playTho(ctx, BASE_FREQUENCIES.tho);
          break;
      }
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  /**
   * Phát nốt theo tần số tự do cho bàn phím ngũ âm
   */
  public playCustomTone(element: ElementType, freq: number, durationSec: number = 0.8) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    switch (element) {
      case "thuy":
        this.playThuy(ctx, freq, durationSec);
        break;
      case "hoa":
        this.playHoa(ctx, freq, durationSec);
        break;
      case "moc":
        this.playMoc(ctx, freq, durationSec);
        break;
      case "kim":
        this.playKim(ctx, freq, durationSec);
        break;
      case "tho":
        this.playTho(ctx, freq, durationSec);
        break;
    }
  }

  // 1. THỦY: Sine wave trượt cao độ kèm vibrato mềm mại
  private playThuy(ctx: AudioContext, baseFreq: number, duration: number = 1.2) {
    const now = ctx.currentTime;
    const dest = this.getDestinationNode(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.5, now);
    lfoGain.gain.setValueAtTime(8, now);
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + duration);

    osc.type = "sine";
    osc.frequency.setValueAtTime(baseFreq * 0.95, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 2. HỎA: Sawtooth qua Lowpass filter ấm áp
  private playHoa(ctx: AudioContext, baseFreq: number, duration: number = 0.5) {
    const now = ctx.currentTime;
    const dest = this.getDestinationNode(ctx);

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(baseFreq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(baseFreq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + duration);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 3. MỘC: Triangle wave gõ thanh gỗ / tre khô
  private playMoc(ctx: AudioContext, baseFreq: number, duration: number = 0.35) {
    const now = ctx.currentTime;
    const dest = this.getDestinationNode(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.97, now + duration * 0.8);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 4. KIM: Chuông đồng nhiều hài âm ngân vang
  private playKim(ctx: AudioContext, baseFreq: number, duration: number = 1.8) {
    const now = ctx.currentTime;
    const dest = this.getDestinationNode(ctx);

    const partials = [
      { ratio: 1.0, gainVal: 0.2 },
      { ratio: 2.76, gainVal: 0.12 },
      { ratio: 5.4, gainVal: 0.07 },
      { ratio: 8.9, gainVal: 0.03 },
    ];

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.85, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    master.connect(dest);

    partials.forEach(({ ratio, gainVal }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      pGain.gain.setValueAtTime(gainVal, now);
      pGain.gain.exponentialRampToValueAtTime(0.00001, now + duration / Math.sqrt(ratio));

      osc.connect(pGain);
      pGain.connect(master);

      osc.start(now);
      osc.stop(now + duration);
    });
  }

  // 5. THỔ: Trầm ấm kết hợp tiếng gõ trống
  private playTho(ctx: AudioContext, baseFreq: number, duration: number = 0.9) {
    const now = ctx.currentTime;
    const dest = this.getDestinationNode(ctx);

    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.type = "sine";
    toneOsc.frequency.setValueAtTime(baseFreq, now);

    toneGain.gain.setValueAtTime(0.001, now);
    toneGain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    toneOsc.connect(toneGain);
    toneGain.connect(dest);

    toneOsc.start(now);
    toneOsc.stop(now + duration);

    // Tiếng đập trống đất
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(140, now);
    kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

    kickGain.gain.setValueAtTime(0.3, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    kickOsc.connect(kickGain);
    kickGain.connect(dest);

    kickOsc.start(now);
    kickOsc.stop(now + 0.25);
  }

  /**
   * Phát nhạc nền ambient ngẫu nhiên tĩnh lặng theo hành (âm lượng cực nhỏ)
   */
  public startAmbient(element: ElementType) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAmbient();

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = BASE_FREQUENCIES[element] / 2; // Hạ quãng tám cho trầm tĩnh

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2.0); // Âm lượng siêu nhỏ 3%

      osc.connect(gain);
      gain.connect(this.getDestinationNode(ctx));
      osc.start();

      this.ambientOsc = osc;
      this.ambientGain = gain;
    } catch {
      // bỏ qua lỗi nếu audioContext chưa được cấp quyền
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {}
    }
    setTimeout(() => {
      if (this.ambientOsc) {
        try {
          this.ambientOsc.stop();
          this.ambientOsc.disconnect();
        } catch {}
        this.ambientOsc = null;
      }
    }, 600);
  }
}

export const soundEngine = new SoundEngine();
