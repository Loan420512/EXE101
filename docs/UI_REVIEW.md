# BÁO CÁO PHÂN TÍCH GIAO DIỆN — VÒNG 0

> Agent: QA & Critic (context sạch — chỉ đọc ảnh chụp và phân tích code hiện trạng)
> Ngày: 2026-10-14
> Phiên bản: Hiện trạng trước U1

---

## ĐIỂM SỐ VÒNG 0 (14 tiêu chí × 10 điểm)

| # | Tiêu chí | Điểm | Lỗi chính |
|---|---|---|---|
| 1 | Hiểu sản phẩm trong 3 giây | **4** | Billboard chưa có; hero là text + fan lá bài nhỏ, không có câu giá trị 3-giây rõ ràng ngay màn hình đầu |
| 2 | Sức mạnh billboard | **2** | Chưa có billboard. Hero section đơn giản, không tràn màn hình, không có khoảnh khắc ấn tượng |
| 3 | Dễ quét hàng ngang | **3** | Chưa có hàng ngang. Bộ bài là lưới dọc, không có edge-peek, không cuộn ngang |
| 4 | Thẻ xem trước & tương tác | **5** | CardFace có hover 3D tốt nhưng không có preview panel, không expand, không có info ló ra |
| 5 | Chất lượng trình phát | **1** | Chưa có MiniPlayer cố định. Âm thanh chỉ phát qua click nút, không có hàng đợi/playlist |
| 6 | Nhịp thị giác | **3** | Trang là cuộn dọc các hộp tối giống nhau. Realm gradient nhẹ tạo chút khác biệt nhưng bố cục cơ bản giống nhau |
| 7 | Chất lượng tranh & hình ảnh | **4** | Lá bài chỉ có màu nền + tên + âm, chưa có tranh nhạc cụ. Ba lá cùng nhạc cụ giống hệt nhau |
| 8 | Chữ Việt & thang chữ | **8** | Dấu thanh hiển thị đúng (typography đã được sửa kỹ). Một vài chỗ nhãn lọc bị cắt ("Thươn/g") |
| 9 | Màu động & tương phản | **6** | Màu hành đã có, background đổi theo section. Nhưng overlay ảnh nền đôi chỗ che mờ, chữ trên section không có paper-board đủ |
| 10 | Chuyển động | **7** | Card animation 5 hành tốt. Nhưng background chỉ có 1 speed, không có 3 nhịp nhất quán |
| 11 | Một ngón tay trên điện thoại | **5** | Nút 44px đã có. Nhưng không có BottomNav, không có MiniPlayer, luồng chính quá dài cuộn |
| 12 | Phù hợp trẻ 7+ & phụ huynh | **6** | Không có mẫu gây nghiện ✓. Nhưng không có chế độ Bé, không có profile picker |
| 13 | Truy cập | **7** | Skip link ✓, aria-label ✓, focus ring ✓. Chưa có role="region" cho hàng ngang, chưa test axe |
| 14 | Hiệu năng cảm nhận | **6** | Không có skeleton loading. LivingBackground preload tốt. WebGL tải trễ đúng. Chưa có code-split |

**TỔNG: 67/140 (48%) — Cần sửa tất cả tiêu chí dưới 9**

---

## LỖI ƯU TIÊN CAO (P0 — phải sửa trước khi demo)

1. **Không có billboard** → trải nghiệm đầu tiên mờ nhạt, không biết sản phẩm là gì trong 3s
2. **Không có hàng ngang** → không thể khám phá nhạc cụ theo flow streaming
3. **Lá bài không có tranh** → mất 70% sức hút thị giác của sản phẩm
4. **Không có MiniPlayer** → âm thanh không có điểm neo, mất khi chuyển section
5. **Nhịp thị giác đơn điệu** → cảm giác "trang cứng", không có khoảnh khắc ấn tượng

## LỖI ƯU TIÊN VỪA (P1)

6. Emoji trong UI (🌿⚡🔊) cần thay SVG icon
7. Không có search Ctrl+K
8. Không có profile picker "Ai đang chơi?"
9. Chữ Cồng chiêng bị cắt trong lưới bộ lọc
10. Section tương khắc WuXing có fill ẩn (đã fix trong commit trước — xác nhận)

---

## SO SÁNH TRƯỚC / SAU (cập nhật sau mỗi phase)

| Phase | Điểm tổng | Điểm thay đổi lớn nhất |
|---|---|---|
| Vòng 0 (hiện trạng) | 67/140 | — |
| Sau U1 | — | — |
| Sau U2 | — | — |
