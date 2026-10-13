/**
 * ==============================================================================
 * FILE: lib/rules/rng.ts
 * MỤC ĐÍCH: Bộ sinh số ngẫu nhiên có hạt giống (Mulberry32 PRNG)
 * Đảm bảo tính lặp lại (reproducibility) cho kiểm thử và gỡ lỗi ván chơi.
 * ==============================================================================
 */

export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(array: T[], rand: () => number = Math.random): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}
