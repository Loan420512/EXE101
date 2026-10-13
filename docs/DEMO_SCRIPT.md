# KỊCH BẢN TRÌNH DIỄN SẢN PHẨM (DEMO_SCRIPT.MD)

Dự án: **Ngũ Cung — Bộ Bài Âm Nhạc Dân Gian (Target Age 7+)**  
Thời lượng khuyến nghị: **5 – 7 Phút**

---

## 1. Mở Đầu: Tinh Thần Tranh Đông Hồ & Nền WebGL Sống Động (1 Phút)

- **Địa chỉ**: Trang chủ `/`
- **Hành động & Điểm nhấn**:
  1. Giới thiệu khẩu hiệu: *"Thu thập ngũ hành. Nghe văn hóa."*
  2. Chỉ vào nền WebGL giấy điệp: shader fbm tạo các hạt xơ điệp lấp lánh phản quang, trống đồng Ngọc Lũ xoay chậm rãi theo nhịp thở.
  3. Di chuyển chuột hoặc chạm tay: quan sát vết loang mực ngũ hành tự nhiên.
  4. Nhấn nút **Bật âm thanh** ở góc phải: nghe nốt ngũ âm tĩnh lặng phát ra từ Web Audio API thuần.

---

## 2. Lá Bài 3D & Tính Năng "Mở Gói Bài" (1 Phút)

- **Địa chỉ**: Trang chủ `/` hoặc trang bộ bài `/bo-bai`
- **Hành động & Điểm nhấn**:
  1. Rê chuột lên lá bài "Trống đồng" hoặc "Đàn đá": quan sát hiệu ứng 3D tilt và vệt phản quang xà cừ kim loại độc bản.
  2. Nhấn nút **Mở gói bài 5 lá**:
     - Hiệu ứng xé gói Đông Hồ kèm âm thanh tách giòn giã.
     - 5 lá bài ngũ hành bật ra, người xem lật từng lá để xem độ hiếm.
     - Sau khi mở xong, hệ thống tự động lưu vào **Bộ sưu tập** (LocalStorage tiến độ x/15 lá).
  3. Mở modal **Bộ sưu tập**: quan sát huy hiệu ngũ hành và huy hiệu "Đại Sư Ngũ Cung" khi hoàn tất.

---

## 3. Bách Khoa 15 Nhạc Cụ & Visualizer Sóng Âm (1 Phút)

- **Địa chỉ**: `/nhac-cu/dan-da` hoặc bất kỳ nhạc cụ nào
- **Hành động & Điểm nhấn**:
  1. Trình diễn trang chi tiết nhạc cụ: cấu tạo, thang âm tương ứng (Cung C4), xuất xứ lịch sử.
  2. Nhấn nút **"Nghe thử âm sắc"**:
     - Web Audio API tổng hợp nốt Cung ấm trầm.
     - Khung Waveform Visualizer bên cạnh vẽ trực tiếp dạng sóng và tần số thực từ `AnalyserNode`.
  3. Nhấn vào liên kết các nhạc cụ cùng hệ Thổ hoặc tương sinh để trải nghiệm tính liền mạch.

---

## 4. Sân Chơi Ngũ Âm & Trắc Nghiệm Văn Hóa (1 Phút)

- **Địa chỉ 1**: `/san-choi-ngu-am`
  - Đánh thử 5 phím ngũ âm (Cung, Thương, Giốc, Chủy, Vũ) qua 3 quãng tám.
  - Nhấn "Ghi âm giai điệu (10s)", chơi một đoạn ngắn và nhấn "Sao chép liên kết chia sẻ (`?melody=`)".
- **Địa chỉ 2**: `/quiz`
  - Trả lời 5 câu hỏi văn hóa trắc nghiệm sinh động.
  - Xem kết quả "Bạn hợp họ nào" và nhận lá bài đại diện tương ứng.

---

## 5. Bàn Đấu Ngũ Cung: Bot AI & Realtime WebSocket (1.5 Phút)

- **Địa chỉ**: `/choi-thu-ngay`
- **Hành động & Điểm nhấn**:
  1. **Chế độ Đấu với Máy (Bot AI)**:
     - Nhặt 1 lá từ Chợ Nhạc (5 lá sẵn sàng).
     - Giới thiệu trợ lý tổ hợp tự động cho bé 7+: nút "Trình tấu ngay (+X điểm)" hiển thị rõ ràng khi tay đủ điều kiện combo (Ngũ Cung 8đ, Hợp tấu 4đ, Liên hoàn 2đ).
     - Bấm thử hành động Phá âm tương khắc khi đối thủ giữ lá bị khắc.
     - Quan sát Máy suy nghĩ và tự động đi nước đi tối ưu không bao giờ phạm luật.
  2. **Chế độ Chuyền máy (Pass & Play)**:
     - Đổi sang chế độ Chuyền máy 2–5 người: trình diễn màn hình che "Chuyển máy cho Người 2! Nhấn để mở bài" đảm bảo bí mật.
  3. **Chế độ Phòng Online (Realtime WebSocket)**:
     - Chuyển sang tab "Phòng Online": nhấn "Tạo phòng mới", lấy mã 4 ký tự (ví dụ: `NGUC`).
     - Mở tab ẩn danh (Incognito), nhập mã phòng và tham gia: 2 tab đồng bộ trạng thái ngay lập tức qua WebSocket port 4000.

---

## 6. Đăng Ký Chơi Thử 7+ & Admin Dashboard (0.5 Phút)

- **Địa chỉ 1**: `/choi-thu`
  - Điền biểu mẫu với độ tuổi 7–12: hệ thống tự động yêu cầu tên phụ huynh và email người lớn kèm cam kết đồng thuận.
  - Gửi đăng ký: nhận mã xác nhận và thông báo thân thiện.
- **Địa chỉ 2**: `/admin`
  - Đăng nhập bảng điều khiển admin: quan sát biểu đồ phân bố độ tuổi 7+, phễu nhu cầu cộng đồng.
  - Nhấn **"Xuất File CSV (UTF-8)"**: tải về tệp bảng tính mở được ngay trên Excel không bị lỗi font chữ tiếng Việt.

---

## 7. Kết Thúc
Khẳng định cam kết gìn giữ văn hóa âm nhạc cổ truyền bằng công nghệ web hiện đại đẳng cấp thế giới.
