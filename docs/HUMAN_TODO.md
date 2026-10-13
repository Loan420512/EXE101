# DANH SÁCH HẠNG MỤC DÀNH CHO CON NGƯỜI (HUMAN_TODO.MD)

Tài liệu này ghi nhận các công việc bắt buộc phải do con người (đội ngũ dự án Team 35, cố vấn chuyên môn, chuyên gia văn hóa, luật sư) thẩm định và hoàn thiện, không thể thay thế bằng mã tự động.

---

1. **Tranh khắc gỗ và minh họa mỹ thuật**:
   - Thay thế các họa tiết vector phỏng mẫu bằng bản scan tranh khắc gỗ dân gian Đông Hồ chính thức hoặc bản vẽ minh họa chi tiết của nghệ nhân cho 15 nhạc cụ.
   - Thư mục lưu trữ: `public/images/cards/` và `public/images/hero/`.

2. **Thu âm nhạc cụ thật tại phòng thu chuyên nghiệp**:
   - Ghi âm tiếng đàn và bộ gõ thật của 15 nhạc cụ dân tộc Việt Nam do các nghệ nhân biểu diễn ở tiêu chuẩn 48kHz/24bit không nén.
   - Xuất file `.mp3` / `.webm` tối ưu web đặt vào `public/audio/`.
   - Cập nhật trường `audioUrl` tương ứng trong `data/instruments.ts`.

3. **Thẩm định nội dung âm luật & văn hóa truyền thống**:
   - Mời nhà nghiên cứu âm nhạc cổ truyền (Viện Âm nhạc Quốc gia / Cố vấn chuyên môn) duyệt lại cấu trúc cấu tạo, cách chơi, lý do gán hành cho từng nhạc cụ trong `data/instruments.ts`.
   - Khi được duyệt, gỡ bỏ nhãn `"Bản nháp"` trên trang và trong dữ liệu.

4. **Kiểm chứng pháp lý về bảo vệ dữ liệu trẻ em**:
   - Rà soát Nghị định 13/2023/NĐ-CP của Việt Nam về Bảo vệ dữ liệu cá nhân (đặc biệt quy định đối với trẻ em dưới 16 tuổi cần sự đồng ý của cha mẹ/người giám hộ).
   - Luật sư / cố vấn pháp lý duyệt văn bản Chính sách quyền riêng tư (`/quyen-rieng-tu`) và Điều khoản sử dụng (`/dieu-khoan`).

5. **Xác thực số liệu thị trường & khảo sát người dùng**:
   - Thẩm định các số liệu định lượng về thói quen tiếp cận âm nhạc dân tộc của giới trẻ lấy từ báo cáo nghiên cứu Checkpoint 1 của nhóm.
   - Gắn nhãn nguồn khảo sát chính xác và loại bỏ các giả định chưa được kiểm chứng.

6. **Điền khóa dịch vụ ngoài khi triển khai thực tế**:
   - Cung cấp API Key thật cho Resend (`RESEND_API_KEY`) để gửi email kích hoạt double opt-in.
   - Cung cấp Site Key & Secret Key thật cho Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`).
   - Cấu hình chuỗi kết nối cơ sở dữ liệu PostgreSQL / Neon thật trong biến môi trường `.env`.

7. **Đăng ký tên miền & Chứng chỉ bảo mật**:
   - Đăng ký tên miền chính thức (ví dụ: `ngucunggame.vn` hoặc `ngucung.edu.vn`).
   - Thiết lập bản ghi DNS, TLS/SSL certificate và CDN caching trên Vercel / Cloudflare.
