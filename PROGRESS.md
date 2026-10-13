# TIẾN ĐỘ NÂNG CẤP DỰ ÁN NGŨ CUNG (PROGRESS.MD)

Khẩu hiệu: *"Thu thập ngũ hành. Nghe văn hóa."*  
Đối tượng mục tiêu: **7+** (Trẻ em từ 7 tuổi, gia đình, học sinh)  
Thời gian khởi tạo: 2026-10-13  
Trạng thái tổng thể: Đang triển khai liên tục từ M1 đến M7.

---

## 1. Danh Sách Mốc & Trạng Thái

| Mốc | Tên Mốc & Nội Dung Chính | Trạng Thái | Cổng Nghiệm Thu |
|---|---|---|---|
| **M1** | **Nền tảng, Token, Cấu hình, Docker, CI**<br>• Thiết lập token chuẩn Đông Hồ, biến CSS<br>• Cập nhật target age 7+ trong `content.ts`<br>• Viết Dockerfile, docker-compose.yml<br>• Cấu hình CI GitHub Actions<br>• Scripts `setup`, `dev`, `test` | **Đang thực hiện** | Typecheck, lint, build pass; setup & dev chạy sạch |
| **M2** | **Nền sống WebGL & Phân hạng thiết bị**<br>• Canvas WebGL cố định nền (shader fbm giấy điệp, sợi điệp lấp lánh)<br>• Họa tiết Đông Hồ xoay chậm (mây, sóng, trống đồng)<br>• Hạt GPU instanced theo hành<br>• Tương tác chuột/chạm mực loang<br>• Chuyển màu theo section & Dark mode "đêm trống đồng"<br>• Nút tạm dừng nền, tự hạ cấp 4 tier (high/mid/low/min), fallback CSS | **Chờ M1** | 60 FPS tier cao, tự hạ cấp mượt mà, fallback CSS khi không có WebGL |
| **M3** | **Lá bài 3D & 5 Hiệu ứng điện ảnh**<br>• Lá bài 3D tilt theo chuột/gyro, ánh xà cừ kim loại<br>• 5 hiệu ứng biến ảo (Thủy, Hỏa, Mộc, Kim, Thổ) với object pool<br>• Chuyển cảnh liền mạch từ lá bài sang chi tiết<br>• Tính năng "Mở gói bài" (xé 5 lá, lật thẻ)<br>• "Bộ sưu tập" (lưu localStorage, tiến độ x/15, huy hiệu)<br>• VÒNG PHÊ BÌNH 1 | **Chờ M2** | Không rác bộ nhớ, không rò rỉ bộ nhớ qua RAF; Vòng phê bình 1 đạt |
| **M4** | **Cuộn, Âm thanh & Nội dung tương tác**<br>• GSAP ScrollTrigger + Lenis smooth scroll<br>• WebAudio API thuần (ngũ âm C4, D4, E4, G4, A4), ambient theo hành, analyser visualizer<br>• 15 trang chi tiết `/nhac-cu/[slug]` đầy đủ<br>• Sơ đồ ngũ hành tương tác `/ngu-hanh`<br>• Sân chơi ngũ âm `/san-choi-ngu-am` (ghi âm 10s, chia sẻ URL)<br>• Quiz "Bạn hợp họ nào" `/quiz` (5 câu, chia sẻ kết quả) | **Chờ M3** | 15 trang nhạc cụ hoàn chỉnh; âm thanh mặc định tắt; analyser chạy thật |
| **M5** | **Lõi luật, Bot, Chuyền máy, Đăng ký & Admin**<br>• Module TypeScript thuần `lib/rules` độc lập React<br>• Chuẩn luật 45 lá, 3 hành động, 4 combo, Phá âm tương khắc chọn đối thủ, vòng kết thúc 15đ, tiebreak, xáo cọc<br>• Bot thông minh không bao giờ phạm luật<br>• Chế độ Chuyền máy 2 - 5 người<br>• `/choi-thu` đăng ký chơi thử (Zod, double opt-in, rate limit, Cloudflare Turnstile, nhóm tuổi 7+, phụ huynh điền thay bé <13)<br>• `/admin` quản trị đăng ký, xuất CSV, phễu nhu cầu<br>• Phân tích hành vi tôn trọng riêng tư (không bên thứ ba)<br>• Đa ngôn ngữ tiếng Việt & tiếng Anh | **Chờ M4** | 100% test lõi luật pass; luồng đăng ký chạy hoàn chỉnh; admin CSV chuẩn |
| **M6** | **Chơi trực tuyến thời gian thực**<br>• Dịch vụ Node.js WebSocket độc lập<br>• Phòng chơi 2 - 5 người qua mã phòng ngắn gọn<br>• Server-authoritative logic, chống gian lận<br>• Tự động reconnect khi mất kết nối<br>• Bot thay thế khi người chơi thoát | **Chờ M5** | 2 tab trình duyệt chơi trọn vẹn ván; rớt mạng kết nối lại giữ nguyên trạng thái |
| **M7** | **SEO, PWA, Kiểm thử toàn diện & Bàn giao**<br>• SEO: metadata, sitemap, robots, JSON-LD, OG image<br>• PWA: Service Worker offline tra cứu bài và luật<br>• WCAG 2.2 AA (bàn phím, nhãn aria, contrast, 44px touch target, skip link)<br>• Vitest mô phỏng 1000+ ván bot kiểm chứng tính đúng đắn<br>• Playwright E2E cho luồng chính<br>• Bàn giao tài liệu: `QUALITY_REPORT.md`, `KNOWN_ISSUES.md`, `DECISIONS.md`, `DEMO_SCRIPT.md`, `HUMAN_TODO.md` | **Chờ M6** | Build pass, test pass, Lighthouse di động >= 90/95/95/95 |

---

## 2. Lệnh Chạy Lại & Kiểm Thử (Rerun Commands)

```bash
# 1. Cài đặt và chuẩn bị môi trường
npm run setup

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Kiểm tra kiểu dữ liệu TypeScript (strict)
npx tsc --noEmit

# 4. Chạy kiểm thử đơn vị & mô phỏng luật chơi (Vitest)
npm test

# 5. Build kiểm tra sản phẩm hoàn chỉnh
npm run build
```

---

## 3. Nhật Ký Cập Nhật
- **2026-10-13 16:30**: Khởi tạo Implementation Plan và `PROGRESS.md`. Dọn dẹp lỗi hàm trùng lặp trong `data/instruments.ts`. Sửa hướng tương sinh `isShengAdjacent`. Chuẩn bị triển khai M1.
