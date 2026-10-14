import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SRC_BG = path.join(ROOT_DIR, 'assets-src', 'backgroundweb');
const SRC_LOGO = path.join(ROOT_DIR, 'assets-src', 'logo');
const DEST_BG = path.join(ROOT_DIR, 'public', 'images', 'backgroundweb');
const DEST_LOGO = path.join(ROOT_DIR, 'public', 'images', 'logo');
const DEST_PUBLIC = path.join(ROOT_DIR, 'public');

// Ensure destination directories exist
fs.mkdirSync(DEST_BG, { recursive: true });
fs.mkdirSync(DEST_LOGO, { recursive: true });

const BG_CONFIG = [
  { src: 'Defaultbackgroundweb.jpg', dest: 'nen-mac-dinh', isTransparent: false },
  { src: 'defaultwebbackground.png', dest: 'trong-dong', isTransparent: true },
  { src: 'earth.jpg', dest: 'canh-tho', isTransparent: false },
  { src: 'metal.jpg', dest: 'canh-kim', isTransparent: false },
  { src: 'wood.jpg', dest: 'canh-moc', isTransparent: false },
  { src: 'fire.jpg', dest: 'canh-hoa', isTransparent: false },
  { src: 'water.jpg', dest: 'canh-thuy', isTransparent: false },
];

const TARGET_WIDTHS = [640, 1280, 2560];

async function optimizeBackgrounds() {
  console.log('--- ĐANG TỐI ƯU HÓA ẢNH NỀN VÀ TRỐNG ĐỒNG ---');
  for (const item of BG_CONFIG) {
    const srcPath = path.join(SRC_BG, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[CẢNH BÁO] Không tìm thấy file nguồn: ${srcPath}`);
      continue;
    }

    const image = sharp(srcPath);
    const metadata = await image.metadata();
    console.log(`\nĐang xử lý ${item.src} -> ${item.dest} (${metadata.width}x${metadata.height})`);

    // 1. Sinh các bản theo widths: 640, 1280, 2560
    for (const width of TARGET_WIDTHS) {
      // WebP
      const webpPath = path.join(DEST_BG, `${item.dest}-${width}.webp`);
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: false, fit: 'inside' })
        .webp({ quality: item.isTransparent ? 90 : 85, effort: 4, alphaQuality: 90 })
        .toFile(webpPath);
      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1);

      // AVIF
      const avifPath = path.join(DEST_BG, `${item.dest}-${width}.avif`);
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: false, fit: 'inside' })
        .avif({ quality: 80, effort: 4 })
        .toFile(avifPath);
      const avifSize = (fs.statSync(avifPath).size / 1024).toFixed(1);

      console.log(`  ✓ ${item.dest}-${width} => WebP: ${webpSize}KB | AVIF: ${avifSize}KB`);
    }

    // 2. Sinh bản mặc định không gắn hậu tố width (dùng 1280 hoặc kích thước gốc)
    const masterWebp = path.join(DEST_BG, `${item.dest}.webp`);
    await sharp(srcPath)
      .resize({ width: Math.min(1920, metadata.width || 1280), withoutEnlargement: true })
      .webp({ quality: item.isTransparent ? 90 : 85, effort: 4 })
      .toFile(masterWebp);

    const masterAvif = path.join(DEST_BG, `${item.dest}.avif`);
    await sharp(srcPath)
      .resize({ width: Math.min(1920, metadata.width || 1280), withoutEnlargement: true })
      .avif({ quality: 80, effort: 4 })
      .toFile(masterAvif);

    if (item.isTransparent) {
      const masterPng = path.join(DEST_BG, `${item.dest}.png`);
      await sharp(srcPath)
        .png({ compressionLevel: 8 })
        .toFile(masterPng);
      console.log(`  ✓ ${item.dest}.png (trong suốt master)`);
    }
  }
}

async function optimizeLogoAndIcons() {
  console.log('\n--- ĐANG TỐI ƯU HÓA LOGO VÀ SINH ICONS/FAVICON ---');
  const logoSrc = path.join(SRC_LOGO, 'logongucung.png');
  if (!fs.existsSync(logoSrc)) {
    console.error(`[LỖI] Không tìm thấy logo nguồn: ${logoSrc}`);
    return;
  }

  // 1. Tối ưu logo web
  const logoPngDest = path.join(DEST_LOGO, 'logongucung.png');
  await sharp(logoSrc).png({ compressionLevel: 9 }).toFile(logoPngDest);

  const logoWebpDest = path.join(DEST_LOGO, 'logongucung.webp');
  await sharp(logoSrc).webp({ quality: 95, effort: 5, alphaQuality: 95 }).toFile(logoWebpDest);

  // Kebab-case alias
  fs.copyFileSync(logoPngDest, path.join(DEST_LOGO, 'logo-ngucung.png'));
  fs.copyFileSync(logoWebpDest, path.join(DEST_LOGO, 'logo-ngucung.webp'));
  console.log(`  ✓ Logo: logongucung.png & logongucung.webp (WebP: ${(fs.statSync(logoWebpDest).size / 1024).toFixed(1)}KB)`);

  // 2. Favicon & App Icons
  // Lấy biểu tượng trống đồng / logo trung tâm vuông để làm app icon sắc nét
  const iconSizes = [
    { name: 'favicon-32x32.png', size: 32, dir: DEST_PUBLIC },
    { name: 'apple-touch-icon.png', size: 180, dir: DEST_PUBLIC },
    { name: 'icon-192.png', size: 192, dir: DEST_PUBLIC },
    { name: 'icon-512.png', size: 512, dir: DEST_PUBLIC },
  ];

  for (const { name, size, dir } of iconSizes) {
    const outPath = path.join(dir, name);
    await sharp(logoSrc)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    console.log(`  ✓ Icon ${name} (${size}x${size}): ${(fs.statSync(outPath).size / 1024).toFixed(1)}KB`);
  }

  // Favicon.ico (32x32 png copy)
  const icoPath = path.join(DEST_PUBLIC, 'favicon.ico');
  await sharp(logoSrc)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(icoPath);
  console.log(`  ✓ Favicon.ico: ${(fs.statSync(icoPath).size / 1024).toFixed(1)}KB`);
}

async function run() {
  try {
    await optimizeBackgrounds();
    await optimizeLogoAndIcons();
    console.log('\n=== TỐI ƯU HÓA HÌNH ẢNH HOÀN TẤT THÀNH CÔNG ===\n');
  } catch (err) {
    console.error('Lỗi tối ưu hình ảnh:', err);
    process.exit(1);
  }
}

run();
