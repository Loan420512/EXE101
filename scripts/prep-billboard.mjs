/**
 * FILE: scripts/prep-billboard.mjs
 * Chuẩn bị ảnh nền cho carousel Billboard (npm run billboard).
 *
 * Vì sao cần: billboard rộng tới ~1920px nhưng ảnh user thả vào thường chỉ
 * 550–700px. next/image KHÔNG phóng to quá bề rộng file gốc, nên nếu để
 * nguyên thì trình duyệt tự kéo giãn ảnh nhỏ → vỡ, mờ. Script này xuất một
 * bản master 1920px (kèm 1280px) đã khử nhiễu nén + làm nét để billboard
 * luôn nhận đủ số pixel nó cần.
 *
 * Cách dùng:
 *   1. Thả ảnh gốc vào public/images/billboard/  (tên file có chứa slug nhạc cụ,
 *      ví dụ dan-bau → "danbau...", "ken-bau" → "kenbau...").
 *   2. npm run billboard          (thêm --force để xử lý lại dù đã có bản cũ)
 *   3. Dán đoạn BACKGROUNDS in ra vào data/billboard.ts (script báo rõ id nào
 *      khớp file nào; id không khớp tên file nào thì bị bỏ qua).
 *
 * Ảnh đã xử lý ghi vào public/images/billboard/optimized/ — không ghi đè ảnh gốc.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "public", "images", "billboard");
const OUT_DIR = path.join(SRC_DIR, "optimized");
const FORCE = process.argv.includes("--force");

/** Billboard cao min(90vh, 640px), rộng tối đa ~1920 → khung 16:9 là đủ. */
const ASPECT = 16 / 9;
const TARGETS = [
  { width: 1920, sigma: 1.15, webp: 82, avif: 72 },
  { width: 1280, sigma: 0.85, webp: 80, avif: 70 },
];

/** Nguồn quá nhỏ thì dù phóng cũng vẫn mềm — báo để user tìm ảnh lớn hơn. */
const SMALL_SOURCE_WARN = 900;

/** Đọc id nhạc cụ thật từ data/instruments.ts khỏi phải ghi tay danh sách. */
function loadInstrumentIds() {
  const src = fs.readFileSync(path.join(ROOT, "data", "instruments.ts"), "utf8");
  const ids = [...src.matchAll(/^\s{4}id:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
  if (!ids.length) throw new Error("Không đọc được id nào từ data/instruments.ts");
  return ids;
}

const INSTRUMENT_IDS = loadInstrumentIds();

const dashless = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Tên file → id nhạc cụ (so khớp bỏ dấu, bỏ gạch). */
function matchInstrument(fileBase) {
  const key = dashless(fileBase);
  const hits = INSTRUMENT_IDS.map((id) => ({ id, probe: dashless(id) }))
    .filter(({ probe }) => probe.length >= 4 && key.includes(probe))
    // ưu tiên id khớp dài nhất để "danda" không ăn nhầm của "dan-bau"
    .sort((a, b) => b.probe.length - a.probe.length);
  return hits.length ? hits[0].id : null;
}

function isFresh(outPath, inPath) {
  if (FORCE || !fs.existsSync(outPath)) return false;
  return fs.statSync(outPath).mtimeMs >= fs.statSync(inPath).mtimeMs;
}

async function processOne(srcPath, outBase, target) {
  const { width, sigma, webp, avif } = target;
  const height = Math.round(width / ASPECT);
  const common = {
    fit: "cover",
    position: "entropy",
    withoutEnlargement: false,
    kernel: sharp.kernel.lanczos3,
  };

  // median(3) tắt các vệt nén/JPEG trước khi phóng, nếu không phóng lên là
  // vệt thành "ô vuông" nhìn như ảnh vệ tinh.
  const base = () =>
    sharp(srcPath)
      .median(3)
      .rotate()
      .resize({ width, height, ...common })
      .modulate({ brightness: 1.03, saturation: 1.07 })
      .sharpen({ sigma, m1: 1.4, m2: 0.6, threshold: 1 });

  const webpPath = `${outBase}-${width}.webp`;
  await base().webp({ quality: webp, effort: 5 }).toFile(webpPath);

  const avifPath = `${outBase}-${width}.avif`;
  await base().avif({ quality: avif, effort: 5 }).toFile(avifPath);

  const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0);
  console.log(
    `    ${width}px  webp ${kb(webpPath)}KB · avif ${kb(avifPath)}KB`
  );
  return { webpPath, avifPath };
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Không có thư mục ${SRC_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .filter((f) => !dashless(f).startsWith("optimized"));

  if (!files.length) {
    console.log("Chưa có ảnh gốc nào trong public/images/billboard/ — chạy xong rồi thả ảnh vào.");
    return;
  }

  /** id → đường dẫn webp master để in ra đoạn BACKGROUNDS */
  const resolved = new Map();
  const unmatched = [];

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const id = matchInstrument(path.basename(file, path.extname(file)));
    if (!id) {
      unmatched.push(file);
      continue;
    }

    const meta = await sharp(srcPath).metadata();
    const scale = (TARGETS[0].width / meta.width).toFixed(1);
    console.log(`\n  ${file}  →  ${id}  (${meta.width}×${meta.height}, phóng ${scale}×)`);
    if (meta.width < SMALL_SOURCE_WARN) {
      console.log(`    ⚠  Ảnh nguồn nhỏ hơn ${SMALL_SOURCE_WARN}px — sẽ mềm hơn ảnh gốc lớn; thay ảnh ~1600×900 khi có.`);
    }

    const outBase = path.join(OUT_DIR, id);
    if (isFresh(`${outBase}-1920.webp`, srcPath)) {
      console.log("    ↷  Bản 1920 đã mới, bỏ qua (dùng --force để xử lý lại)");
    } else {
      for (const target of TARGETS) await processOne(srcPath, outBase, target);
    }
    resolved.set(id, `/images/billboard/optimized/${id}-1920.webp`);
  }

  const lines = [...resolved.entries()].map(
    ([id, p]) => `  "${id}": "${p}",`
  );
  console.log("\n=== DÁN VÀO BACKGROUNDS trong data/billboard.ts ===");
  console.log(lines.join("\n") || "  (chưa có ảnh nào khớp id nhạc cụ)");

  if (unmatched.length) {
    console.log("\n⚠  Không nhận ra nhạc cụ từ tên file (bỏ qua):");
    unmatched.forEach((f) => console.log(`   - ${f}`));
    console.log(`   Gợi ý: tên file phải chứa slug không gạch, ví dụ "danbau.jpg" cho dan-bau.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
