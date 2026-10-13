/**
 * ==============================================================================
 * FILE: lib/audio.ts
 * MỤC ĐÍCH: Bộ tổng hợp âm thanh WebAudio cho 5 thanh âm Ngũ Cung (C4, D4, E4, G4, A4).
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Không dùng file âm thanh bên ngoài, tổng hợp hoàn toàn bằng Web Audio API.
 * - Muốn chỉnh âm lượng hoặc tần số cơ bản: sửa `BASE_FREQUENCIES` bên dưới.
 * - Thổ (Cung - C4): Âm trầm kèm tiếng đập trống (kick click)
 * - Kim (Thương - D4): Chuông nhiều hài âm ngân dài (metallic chime / bells)
 * - Mộc (Giốc - E4): Triangle wave gõ khô ngắn gọn (wood block / marimba)
 * - Hỏa (Chủy - G4): Sawtooth wave qua Lowpass filter ấm áp, ngắn
 * - Thủy (Vũ - A4): Sine wave trượt cao độ kèm vibrato mềm mại
 * ==============================================================================
 */

import { ElementType } from "@/data/instruments";

// Tần số ngũ cung chuẩn (Hz)
export const BASE_FREQUENCIES: Record<ElementType, number> = {
  tho: 261.63, // C4 - Cung
  kim: 293.66, // D4 - Thương
  moc: 329.63, // E4 - Giốc
  hoa: 392.00, // G4 - Chủy
  thuy: 440.00, // A4 - Vũ
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // Mặc định tắt âm thanh theo yêu cầu

  constructor() {
    // AudioContext sẽ được khởi tạo khi có tương tác đầu tiên của người dùng
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.getContext();
    }
    return this.isMuted;
  }

  /**
   * Phát âm thanh ngũ cung tương ứng theo hành
   * @param element 'tho' | 'kim' | 'moc' | 'hoa' | 'thuy'
   * @param forcePlay Nếu true sẽ phát bất chấp trạng thái Mute (dành riêng cho nút 'Nghe âm thử' trong modal)
   */
  public playElementTone(element: ElementType, forcePlay: boolean = false) {
    if (this.isMuted && !forcePlay) return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      switch (element) {
        case "thuy":
          this.playThuy(ctx);
          break;
        case "hoa":
          this.playHoa(ctx);
          break;
        case "moc":
          this.playMoc(ctx);
          break;
        case "kim":
          this.playKim(ctx);
          break;
        case "tho":
          this.playTho(ctx);
          break;
      }
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  // 1. THỦY (A4 - 440Hz): Sine trượt cao độ kèm vibrato nhẹ
  private playThuy(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // LFO cho vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
    lfoGain.gain.setValueAtTime(8, now); // biên độ dao động nốt
    lfo.connect(osc.frequency);
    lfo.start(now);
    lfo.stop(now + 1.2);

    osc.type = "sine";
    // Trượt cao độ: xuất phát thấp hơn 20Hz rồi lượn lên 440Hz rồi thả nhẹ
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(435, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // 2. HỎA (G4 - 392Hz): Sawtooth qua Lowpass filter, ngắn, ấm áp
  private playHoa(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(392, now);

    // Lowpass filter mở ra rồi khép lại nhanh như ngọn lửa bùng lên
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 3. MỘC (E4 - 329.63Hz): Triangle wave gõ khô ngắn (marimba/phách)
  private playMoc(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(329.63, now);
    // Tiếng gõ ban đầu có độ rơi cao độ nhẹ để tạo cảm giác gõ thanh tre
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 4. KIM (D4 - 293.66Hz): Chuông nhiều hài âm ngân dài (metallic bells)
  private playKim(ctx: AudioContext) {
    const now = ctx.currentTime;
    const baseFreq = 293.66;
    // Tổng hợp cộng các bội âm không điều hòa đặc trưng của chuông đồng
    const partials = [
      { ratio: 1.0, gainVal: 0.2 },
      { ratio: 2.76, gainVal: 0.12 },
      { ratio: 5.4, gainVal: 0.07 },
      { ratio: 8.9, gainVal: 0.03 },
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    masterGain.connect(ctx.destination);

    partials.forEach(({ ratio, gainVal }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      pGain.gain.setValueAtTime(gainVal, now);
      pGain.gain.exponentialRampToValueAtTime(0.00001, now + (1.8 / Math.sqrt(ratio)));

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  // 5. THỔ (C4 - 261.63Hz): Trầm kèm tiếng trống (kick thump)
  private playTho(ctx: AudioContext) {
    const now = ctx.currentTime;

    // Nốt chính C4
    const toneOsc = ctx.createOscillator();
    const toneGain = ctx.createGain();
    toneOsc.type = "sine";
    toneOsc.frequency.setValueAtTime(261.63, now);

    toneGain.gain.setValueAtTime(0.001, now);
    toneGain.gain.linearRampToValueAtTime(0.24, now + 0.04);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    toneOsc.connect(toneGain);
    toneGain.connect(ctx.destination);

    toneOsc.start(now);
    toneOsc.stop(now + 0.9);

    // Tiếng trống trầm thình thịch kèm theo
    const kickOsc = ctx.createOscillator();
    const kickGain = ctx.createGain();
    kickOsc.type = "sine";
    kickOsc.frequency.setValueAtTime(140, now);
    kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.2);

    kickGain.gain.setValueAtTime(0.35, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    kickOsc.connect(kickGain);
    kickGain.connect(ctx.destination);

    kickOsc.start(now);
    kickOsc.stop(now + 0.28);
  }
}

// Singleton export để dùng thống nhất toàn app
export const soundEngine = new SoundEngine();
