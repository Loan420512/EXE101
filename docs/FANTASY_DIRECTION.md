# ĐỊNH HƯỚNG KỲ ẢO: "CÕI NGŨ ÂM"

> Biến "Ngũ Cung" thành một thế giới kỳ ảo có bản sắc Việt.

---

## Tầm nhìn

Người xem bước vào **"Cõi Ngũ Âm"**, nơi năm hành là năm vùng đất sống động. Lá bài phát sáng linh khí, âm thanh hiện thành hình, nền giấy điệp thở nhịp nhàng.

**Nguyên tắc vàng**: Kỳ ảo nhưng không cản đọc.
- Chữ luôn nằm trên "bảng giấy" yên tĩnh (nền giấy điệp, thẻ, cuộn giấy, tấm gỗ).
- Hiệu ứng kỳ ảo sống ở nền, rìa, khoảng trống, chuyển cảnh.

---

## 5 Vùng Đất (Realms)

| Hành | Tên vùng | Màu nền | Hạt | Ánh sáng |
|------|----------|---------|-----|----------|
| **Thổ** | Đất Vàng Cung | `#F2B632` | Bụi vàng dâng lên | Ấm, amber |
| **Kim** | Điện Kim Thương | `#C8D4DC` | Mảnh bạc/ánh kim | Lạnh, trắng xanh |
| **Mộc** | Rừng Trúc Giốc | `#3A7535` | Lá bay, phấn xanh | Xanh lục tươi |
| **Hỏa** | Đài Lửa Chủy | `#CC3520` | Than hồng, lửa | Đỏ rực, warm |
| **Thủy** | Hồ Chàm Vũ | `#1B3B7A` | Bong bóng nước | Xanh chàm, mát |

---

## Magical Moments — Một trang, một khoảnh khắc chính

| Trang / Section | Khoảnh khắc kỳ ảo |
|---|---|
| **Hero** | Quạt 5 lá bài phát hào quang, tiêu đề phát sáng nhẹ theo hành đang chọn |
| **Bộ bài** | Lưới lá bài: mỗi lá có aura pulse khi hover; bấm → hiệu ứng biến ảo canvas |
| **Ngũ hành** | Sơ đồ ngũ giác sáng lên theo chiều tương sinh; đường tương khắc rung |
| **Sân chơi** | Âm thanh hiện thành sóng hình ảnh (waveform) theo màu ngũ hành |
| **Nhạc cụ** | Ảnh nhạc cụ có light-ray khi hover; bấm → âm thanh + ripple |

---

## Diorama Layers (Hero Section)

```
Layer 4 (foreground): Quạt 5 lá bài — parallax mạnh nhất
Layer 3 (midground):  Hạt linh khí nổi — parallax vừa
Layer 2 (background): Họa tiết Đông Hồ SVG mờ — parallax nhẹ
Layer 1 (base):       Nền giấy điệp WebGL — tĩnh / cố định
```

---

## Fallback

| Tier | Hiệu ứng |
|------|----------|
| High | WebGL đầy đủ, hạt instanced, aura glow, diorama parallax |
| Mid  | WebGL giảm hạt, CSS aura nhẹ |
| Low  | Canvas 2D đơn giản, không parallax |
| Min  | CSS tĩnh (gradient + màu ngũ hành), prefers-reduced-motion |

---

## Nút Tạm Dừng & Accessibility

- Nút "⏸ Tạm dừng nền" cố định góc dưới phải — **luôn hiển thị**.
- `prefers-reduced-motion: reduce` → tắt toàn bộ animation, giữ màu sắc.
- Không có nhấp nháy > 3Hz.
