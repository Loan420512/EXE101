# UI_REVIEW — bảng chấm & tự phê bình

Sản phẩm: web Ngũ Cung (khám phá 15 nhạc cụ dân tộc + bộ bài 45 lá, 7+).
Cách chấm: 12 thước đo × 10 điểm, lấy từ ảnh chụp bản đang chạy (`npm run shoot`),
không chấm bằng cảm tính. Ảnh + số đo: `docs/ui-review/v0/` (96 ảnh: 12 route ×
4 cỡ màn 360/768/1280/1920 × sáng & tối) và `docs/ui-review/v0/manifest.json`.

Thước đo: 1 hiểu trong 3 giây · 2 khoảnh khắc ấn tượng · 3 nhịp & đa dạng bố cục ·
4 phân cấp thị giác · 5 chữ Việt & thang chữ · 6 màu & tương phản · 7 chất lượng
hình ảnh & lá bài · 8 chuyển động · 9 điện thoại một ngón tay · 10 phù hợp trẻ 7+ ·
11 truy cập · 12 hiệu năng cảm nhận.

---

## VÒNG 0 — hiện trạng (2026-10-15)

### Số đo khách quan

| Trang | Cao trang @1280 | Chạm < 44px | Chữ < 13px | Lỗi console |
|---|---|---|---|---|
| `/` Khám phá | **9.991px (~11 màn)** · @360 **15.430px (~43 màn)** | **47/61** | **261** | 0 |
| `/bo-bai` | 2.759px | **30/30 (100%)** | 148 | 0 |
| `/duyet` | 2.650px | 29/50 | 128 | 0 |
| `/ngu-hanh` | 2.604px | 25/27 | 55 | 0 |
| `/luat-choi` | 3.035px | **26/26 (100%)** | 37 | 0 |
| `/quiz` | 2.319px | 24/29 | 41 | 0 |
| `/san-choi-ngu-am` | 2.227px | 33/38 | 70 | 0 |
| `/nhac-cu/dan-bau` | 2.640px | 27/38 | 75 | 0 |
| `/choi-thu-ngay` | 1.965px | 10/26 | 108 | 0 |
| `/choi-thu` | 1.460px | 2/3 | 7 | 0 |
| `/ho-so` | 2.093px | 23/25 | 41 | 0 |
| `/admin` | 900px | 2/4 | 21 | 0 |

Không trang nào tràn ngang. Không trang nào có lỗi console.

### Điểm từng trang (vòng 0)

| Trang | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | TB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | 6 | 6 | 3 | 5 | 4 | 4 | 7 | 6 | 3 | 6 | 4 | 4 | **4,8** |
| `/nhac-cu/[slug]` | 7 | 6 | 5 | 6 | 5 | 4 | 7 | 7 | 5 | 7 | 5 | 6 | **5,8** |
| `/duyet` | 7 | 6 | 5 | 6 | 6 | 6 | 7 | 6 | 6 | 7 | 6 | 7 | **6,2** |
| `/bo-bai` | 6 | 5 | 4 | 5 | 5 | 4 | 7 | 5 | 4 | 6 | 4 | 5 | **5,0** |
| `/ngu-hanh` | 5 | 5 | 3 | 4 | 5 | 4 | 6 | 6 | 4 | 6 | 5 | 5 | **4,8** |
| `/luat-choi` | 5 | 4 | 3 | 5 | 5 | 4 | 5 | 4 | 4 | 6 | 5 | 5 | **4,5** |
| `/quiz` | 6 | 5 | 4 | 5 | 6 | 5 | 6 | 5 | 5 | 7 | 6 | 6 | **5,4** |
| `/san-choi-ngu-am` | 6 | 6 | 4 | 5 | 5 | 5 | 5 | 6 | 5 | 6 | 5 | 6 | **5,3** |
| `/choi-thu-ngay` | 6 | 5 | 4 | 5 | 5 | 6 | **3** | 5 | 5 | 7 | 5 | 6 | **5,1** |
| `/choi-thu` | 7 | 5 | 5 | 6 | 7 | 7 | 6 | 4 | 6 | 7 | 6 | 6 | **6,0** |
| `/ho-so` | 6 | 4 | 4 | 5 | 5 | 6 | 5 | 4 | 5 | 6 | 5 | 6 | **5,0** |
| `/admin` | 7 | 3 | 5 | 6 | 6 | 6 | 4 | 3 | 4 | n/a | 5 | 6 | **5,1** |

Trung bình toàn cục: **5,2/10**.

### 8 điểm yếu lớn nhất (chụp được, sửa được)

1. **Trang chủ là một cuộn dọc 11 màn (43 màn trên điện thoại) toàn hộp tối giống nhau.**
   Ảnh: `home-1280-dark.png`, `home-360-dark.png`. Không có nhịp, không có điểm dừng,
   người lớn không cuộn hết, trẻ 7 tuổi càng không. → Phải cắt còn 3–4 khối khác kiểu,
   phần còn lại đẩy sang màn riêng.
2. **Chữ đặt trực tiếp lên ảnh nền sáng, không đạt tương phản.** `/bo-bai`, `/luat-choi`,
   `/ngu-hanh`, `/nhac-cu/[slug]`: tiêu đề và đoạn mở đầu nằm trên ảnh thành phố/bãi biển,
   hộp trích dẫn trong suốt đè lên cát. Vi phạm đúng điều cấm của đề bài ("chữ nằm trên
   nền đặc hoặc gradient tối"). → Mọi khối chữ phải có bảng giấy đặc hoặc scrim đủ đậm.
3. **Billboard: chữ chìm, nút chính tối trên nền tối.** `home-1280-dark.png`: "Kèn bầu"
   xám trên ảnh đông người, "Xem chi tiết" đỏ sẫm trên nền đỏ sẫm. Ảnh nền quá rối,
   không có vùng tối dành riêng cho chữ. → Dịch subject sang phải, scrim trái đậm hơn,
   nút chính đổi sang màu hành sáng.
4. **39–47/61 vùng chạm dưới 44px; `/bo-bai` và `/luat-choi` là 100%.** Không đạt WCAG
   2.2 AA lẫn yêu cầu "một ngón cái". → Sàn 44px cho mọi `a`/`button`.
5. **261 chỗ chữ nhỏ hơn 13px ở trang chủ** (9–12px), gồm cả nhãn điều hướng đáy.
   Chữ Việt 9–10px dễ mất dấu. → Thang chữ mới, sàn 12px cho nhãn, 16px cho thân.
6. **Lá bài trong bàn chơi không có tranh.** `choi-thu-ngay-1280-dark.png`: cả 5 lá Chợ Nhạc
   là icon nốt nhạc placeholder trong khi `/duyet` đã có ảnh thật. Nội dung là ngôi sao
   mà ngôi sao đang biến mất ở màn quan trọng nhất. → Nối `InstrumentArt` vào lá bài in-game.
7. **Trùng lặp nội dung và khoảng chết.** `/ngu-hanh` có hai hero gần như giống nhau
   ("Ngũ Âm & Ngũ Hành" hai lần); `/nhac-cu/dan-bau` có một khoảng trống lớn giữa hàng
   nút hành động (một nút không render). → Gộp hero, sửa hàng nút.
8. **Nhãn hành trên header là 5 ô màu không chữ, khó hiểu với người mới và trẻ nhỏ**;
   nút "Tạm dừng nền" và vòng "N" trôi nổi đè lên nội dung ở mọi trang.
   → Icon + chữ, và đưa các nút nổi vào một cụm điều khiển có chủ đích.

### Kết luận vòng 0

Đạt: không tràn ngang, không lỗi console, ảnh nhạc cụ thật đã vào lá bài,
chuyển động billboard mượt, có đủ sáng/tối.
Chưa đạt: 1/2/3/4/5/7/9/11 — tức là phần *bố cục, chữ, tương phản, truy cập*,
không phải phần nội dung. Đây là lý do phải thiết kế lại từ bố cục, không chỉnh từng chỗ.
