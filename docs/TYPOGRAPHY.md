# HƯỚNG DẪN TYPOGRAPHY CHỮ VIỆT (TYPOGRAPHY.MD)

---

## 1. Bộ Phông

| Vai trò | Font | Nguồn | Subset | Format |
|---------|------|-------|--------|--------|
| **Heading** | Playfair Display | Google Fonts (OFL) | `vietnamese, latin` | woff2 |
| **Body / UI** | Be Vietnam Pro | Google Fonts (OFL) | `vietnamese, latin` | woff2 |
| Trang trí (tùy chọn) | SVG hand-drawn | Tự thiết kế | — | SVG inline |

**Quy tắc**:
- Tối đa **2 font family** + các yếu tố thủ công SVG.
- `font-display: swap` bắt buộc — tránh FOIT (Flash of Invisible Text).
- Tải bởi `next/font/google` — tự động subset, tự động host (không CDN bên ngoài).

---

## 2. Line Height & Dấu Thanh

| Loại | `line-height` | Lý do |
|------|--------------|-------|
| `h1` | `1.18` | Tiêu đề lớn — dấu Ắ, Ộ vẫn đủ chỗ |
| `h2, h3` | `1.28` | Heading thường |
| Body (`p`, `li`, `td`) | `1.65` | Đủ chỗ dấu thanh trên + dưới |
| Caption / label nhỏ | `1.50` | Không cắt dấu huyền/sắc |

**Test dấu thanh bắt buộc** (xem `/dev/typography`):
- Hàng chứa toàn dấu cao: `Ắ Ằ Ẳ Ẵ Ặ Ế Ề Ể Ễ Ệ`
- Hàng chứa dấu huyền thấp: `Ờ Ồ Ổ Ỗ Ộ Ừ Ử Ữ Ự`
- Câu hỗn hợp: `Tứ quý mộc: Sáo trúc nổi tiếng nhất Việt Nam`

---

## 3. Quy Tắc Kích Thước Chữ

```
h1 (hero): clamp(2.25rem, 5vw + 1rem, 4.5rem)   — tối thiểu 36px
h2:         clamp(1.5rem, 3vw + 0.75rem, 2.5rem) — tối thiểu 24px
h3:         1.25rem – 1.5rem
body:       1rem (16px)
caption:    0.75rem – 0.875rem (12–14px)
```

**Không** dùng chữ nhỏ hơn 12px cho bất kỳ văn bản thật nào.

---

## 4. Font Feature Settings

```css
body {
  font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
```

---

## 5. Overflow Wrap

```css
body {
  overflow-wrap: break-word;
  word-break: break-word;
}
```
Cần thiết cho từ ghép tiếng Việt dài (v.d. "Tương-sinh-tương-khắc") trên màn hình nhỏ.

---

## 6. Test Page

Route: `/dev/typography`  
Nội dung kiểm tra:
- Tất cả 134 tổ hợp dấu thanh + nguyên âm
- heading h1–h4 Playfair Display
- body + caption Be Vietnam Pro
- Số tabular-nums
- RTL/LTR mix
