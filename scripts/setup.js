/**
 * ==============================================================================
 * FILE: scripts/setup.js
 * MỤC ĐÍCH: Tự động hóa thiết lập môi trường cục bộ ("npm run setup"):
 * - Kiểm tra file .env (tự copy từ .env.example nếu chưa có)
 * - Tạo thư mục lưu trữ cục bộ (storage/emails, storage/data)
 * - Kiểm tra Node.js & dependencies
 * - Khởi tạo dữ liệu seed ban đầu cho đăng ký và bộ bài
 * ==============================================================================
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

console.log("🌸 [Ngũ Cung] Bắt đầu thiết lập môi trường phát triển...");

// 1. Kiểm tra .env
const envPath = path.join(root, ".env");
const envExamplePath = path.join(root, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log("✅ Đã tự động tạo .env từ .env.example");
} else if (fs.existsSync(envPath)) {
  console.log("ℹ️ Đã tồn tại .env");
}

// 2. Tạo các thư mục lưu trữ cục bộ cần thiết
const dirs = [
  path.join(root, "storage"),
  path.join(root, "storage", "emails"),
  path.join(root, "storage", "data"),
  path.join(root, "public", "audio"),
  path.join(root, "public", "images", "cards"),
  path.join(root, "public", "images", "hero"),
  path.join(root, "public", "images", "families"),
  path.join(root, "public", "images", "team"),
];

dirs.forEach((d) => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    // Tạo file .gitkeep
    fs.writeFileSync(path.join(d, ".gitkeep"), "");
  }
});
console.log("✅ Đã kiểm tra và tạo đầy đủ các thư mục storage/ và public/ assets.");

// 3. Khởi tạo file seed giả lập nếu chưa có DB Postgres ngoài
const seedFilePath = path.join(root, "storage", "data", "seed_registrations.json");
if (!fs.existsSync(seedFilePath)) {
  const initialSeed = [
    {
      id: "reg-demo-1",
      name: "Phụ huynh Minh An",
      email: "parent.minhan@example.com",
      childNickname: "Bé Bo",
      ageGroup: "7-12",
      parentConsent: true,
      timeSlot: "Cuối tuần - Buổi sáng (09:00 - 10:30)",
      confirmed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "reg-demo-2",
      name: "Nguyễn Hải Đăng",
      email: "haidang.music@example.com",
      childNickname: "Đăng",
      ageGroup: "13-17",
      parentConsent: true,
      timeSlot: "Cuối tuần - Buổi chiều (14:30 - 16:00)",
      confirmed: true,
      createdAt: new Date().toISOString(),
    },
  ];
  fs.writeFileSync(seedFilePath, JSON.stringify(initialSeed, null, 2), "utf-8");
  console.log("✅ Đã nạp dữ liệu mẫu seed_registrations.json ban đầu.");
}

console.log("🎉 [Ngũ Cung] Thiết lập thành công! Hãy chạy 'npm run dev' để bắt đầu.");
