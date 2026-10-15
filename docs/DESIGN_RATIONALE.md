# DESIGN_RATIONALE — vì sao chọn hướng này

Tài liệu quyết định thiết kế cho đợt làm lại UI 2026-10-15.
Ảnh hiện trạng: `docs/ui-review/v0/` · Ảnh chấm vòng 0: `docs/UI_REVIEW.md`
Ba bản phác: `docs/design-directions/` (`dir-A-san-dien.png`, `dir-B-coi-cuon.png`,
`dir-C-ban-dieu-khien.png`).

---

## 1. Nguyên tắc rút ra từ sản phẩm streaming/âm nhạc hạng nhất

Chỉ lấy nguyên tắc, không sao chép bố cục, hình ảnh, câu chữ hay thương hiệu của bất kỳ ai.

1. **Một màn hình, một quyết định.** Trang chủ của các nền tảng lớn luôn mở bằng đúng một
   đối tượng nổi bật rồi mới tới danh sách; người dùng chọn, không phải đọc.
2. **Ngón cái là giao diện.** Netflix bản mobile chuyển sang feed dọc vì "the thumb becomes
   the interface" — hành động chính phải nằm trong vùng với tới của một ngón, mọi thứ khác
   đẩy xuống dưới. ([uxdesignerpro.com](https://uxdesignerpro.com/new-netflix-mobile-ux/))
3. **Phát hiện bằng cảm xúc trước, thông tin sau.** "Emotional sampling": cho nghe/xem thử
   6 giây rồi mới giải thích. Với nhạc cụ, điều này nghĩa là *nghe trước, đọc sau*.
4. **Nền tối là mặc định, ảnh là ngôi sao.** Spotify giữ khung gần đen (#121212/#181818)
   để bìa và màu nội dung tỏa sáng; màu động lấy từ chính nội dung đang xem.
   ([open-design.ai](https://open-design.ai/plugins/design-system-spotify/))
5. **Tiết chế số lượng.** Nguyên tắc công khai của Spotify cho hệ sinh thái: không hiển thị
   quá ~20 mục trong một tập, luôn có đường "xem tất cả" để đi tiếp.
   ([developer.spotify.com](https://developer.spotify.com/documentation/design))
6. **Độ sâu để phân cấp, kính mờ để lớp phủ — dùng có chừng mực.** Các xu hướng 2026
   (độ sâu, glassmorphism, cá nhân bố cục) chỉ đáng dùng khi nó nói lên thứ tự quan trọng.
   ([muz.li](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/))
7. **Mọi khối đều có đủ trạng thái**, kể cả trạng thái rỗng — trạng thái rỗng phải kèm
   việc kế tiếp, không phải một khoảng trắng.

Bản dịch sang Ngũ Cung: billboard điện ảnh một nhạc cụ · hàng thẻ dọc có mép lộ ·
màu cả trang đổi theo hành · chữ không bao giờ đè ảnh · nội dung văn hóa thật, thiếu thì
hở ra chứ không bịa.

---

## 2. Ba hướng đã phác và chấm

### Hướng A — "Sàn Diễn"
Billboard điện ảnh toàn màn, chữ nằm trên vệt tối dốc; dưới là hàng lá bài giấy nghiêng
đổi nền; khối nội dung đặt trên **tấm giấy đặc** (giấy điệp) chứ không đè ảnh.
Cấu trúc: 1 màn hero + 3 khối khác kiểu + footer. Cuộn ước tính ~3 màn (880px @1280).
`dir-A-san-dien.png`

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | TB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | 8 | 8 | 9 | 9 | 8 | 9 | 7 | 7 | 8 | 7 | 8 | **8,1** |

Điểm yếu còn lại: dễ quay về "hero + hàng thẻ" nếu không giữ nhịp khối; cần cơ chế
"đổi màu theo hành" rõ hơn nữa.

### Hướng B — "Cõi Cuộn"
Mỗi hành là một màn hình đầy màu hành, cuộn dính từng cõi, ray hình thoi Đông Hồ bên trái,
nền ảnh chỉ còn là lớp mờ dưới màu. Ấn tượng nhất nhưng:
`dir-B-coi-cuon.png`

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | TB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 9 | 7 | 8 | 9 | 7 | 5 | 7 | 6 | 7 | 5 | 8 | **6,9** |

Loại vì: **ảnh nhạc cụ — ngôi sao — bị màu đè mất (7 = 5)**; cuộn dính từng màn gây khó
cho bàn phím và trình đọc màn hình (11 = 5); người mới không hiểu sản phẩm trong 3 giây
vì không thấy "bộ bài" đâu (1 = 6); nền Thổ/Vàng và Kim/Bạc không đủ tương phản cho chữ
sáng.

### Hướng C — "Bàn Điều Khiển"
Ứng dụng 3 cột kiểu console: ray trái (điều hướng + 6 vũ trụ), giữa là canvas đổi màu,
phải là "đang phát" + hàng đợi, dưới là mini-player luôn trực.
`dir-C-ban-dieu-khien.png`

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | TB |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 8 | 7 | 7 | 8 | 7 | 7 | 8 | 6 | 5 | 6 | 6 | 7 | **6,8** |

Loại làm hướng chính vì: ba cột không co được xuống một ngón cái trên 360px (9 = 5),
mật độ chữ nhỏ dày, trông như công cụ hơn là sản phẩm giải trí cho trẻ 7+ (10 = 6).

---

## 3. Hướng chọn: **A "Sàn Diễn"**, mượn hai cơ chế của B và C

Lý do, theo đúng thứ tự ưu tiên của đề bài:

1. **A thắng ở chính chỗ hiện trạng yếu nhất**: chữ không đè ảnh (khối giấy đặc),
   một hành động chính mỗi màn, và cuộn ngắn. Vòng 0 chấm trang chủ 4,8 — A là hướng
   duy nhất vừa chấm cao vừa sửa trực tiếp 8 điểm yếu đã đo.
2. **Giữ đúng bản sắc Đông Hồ**: viền đen 2px, bóng đổ cứng 3–5px, lá bài nghiêng
   ~0,6°, màu phẳng — đặt trên nền tối của streaming chứ không thay thế nó.
3. **Mượn của C**: mini-player cố định đáy + ray chuyển vũ trụ (bên desktop), vì
   "màu cả trang đổi theo nội dung" là yêu cầu rõ của đề bài và C giải quyết nó tốt nhất.
   Trên mobile, hai thứ này thu về tab bar + thanh vuốt, không giữ cột.
4. **Mượn của B**: mỗi hành có một "sân khấu" màu riêng ở trang Duyệt và trang chi tiết
   (nền màu hành đặc + ảnh đặt trong khung), để đa vũ trụ là cảm giác thật, không phải
   sticker.
5. **Không phá những gì đang chạy**: 15 nhạc cụ, lõi luật, đường dẫn, nền WebGL,
   ảnh thẻ, billboard carousel đều giữ; thay đổi nằm ở lớp bố cục, token và thành phần.

Rủi ro đã biết và cách chặn:
* A có thể trượt về "hero + lưới thẻ" đại trà → buộc mỗi trang có ≥1 khối không đối xứng
  và lá bài luôn nghiêng/đổ bóng cứng (dấu ấn Đông Hồ), chấm lại ở vòng 1.
* Mini-player dễ vi phạm "không tự phát tiếng" → player chỉ hiện khi người dùng đã bấm
  nghe, không bao giờ tự chạy.
* Ba màu hành nền đặc (Kim/Thổ) dễ tụt tương phản → mọi cặp nền/chữ phải qua phép đo AA
  trong token, không viết tay.
