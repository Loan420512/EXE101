# FANTASY_REVIEW.md — Vòng Phê Bình "Cõi Ngũ Âm"

> Cập nhật lần cuối: 2026-10-13 21:20 ICT  
> Vòng hiện tại: Round 2 — đang sửa (bỏ qua mục ≥ 9)

---

## Thang điểm
| Điểm | Ý nghĩa |
|------|---------|
| ≥ 9 | Đạt — không cần can thiệp thêm |
| 7–8 | Chấp nhận nhưng muốn cải thiện |
| < 7 | Cần sửa trong vòng hiện tại |

---

## Round 0 — Chụp ảnh thực tế (2026-10-13, 20:58 ICT)

### 1. Hero Section ★ 8/10
**Mạnh**: Card fan 5 lá đúng vị trí, ô thông tin hành Thủy hiện đẹp, 4 quick-fact boxed  
**Yếu**:  
- `textShadow` glow trên nền giấy điệp sáng quá mờ  
- Quạt lá bài "float" hơi cao trên mobile  
**Hành động**: Tăng glow hoặc drop-shadow

### 2. Story Section ★ 9/10
**Mạnh**: Scroll-banner cuộn giấy đẹp, quote to rõ, bảng so sánh 4 dòng  
**Yếu**: Realm-tho gradient quá nhẹ  
**Hành động**: Tăng realm opacity → ĐÃ SỬA (Round 1)

### 3. CardDeck Section ★ 8.5/10
**Mạnh**: Lá bài màu ngũ hành rõ, lưới 5 cột, filter bar  
**Yếu**: Realm-thuy hơi vô hình  
**Hành động**: Border stripe màu hành → ĐÃ THÊM (Round 1)

### 4. GameGuide30s ★ 9.5/10
**Mạnh**: Bảng 4-zone chi tiết, mini card màu element, auto-play 4 bước  
**Yếu**: Section không có realm class  
**Hành động**: Thêm realm-moc → Round 2

### 5. WuXingDiagram ★ 9/10
**Mạnh**: Sơ đồ ngũ giác SVG đúng, nút tương sinh/tương khắc, realm-tho thêm  
**Không cần sửa thêm**

### 6. RulesSection ★ 8/10
**Mạnh**: Layout 2 cột, bảng điểm chi tiết  
**Yếu**: Realm-kim stripe chưa rõ  
**Hành động**: Border stripe → ĐÃ THÊM (Round 1)

### 7. Typography ★ 10/10 ✅
- Dấu thanh không bị cắt ở h1 4xl và 5xl
- Body line-height 1.65+, tabular số đều  
- KHÔNG cần sửa gì thêm

### 8. Header ★ 8/10
**Yếu**: Logo "ngũ" có khoảng trắng thừa → ĐÃ SỬA (Round 1)

### 9. CssFallbackBackground ★ 9/10
**Mạnh**: 5 vùng gradient màu hành từ góc, trống đồng SVG với chim lạc 8 con  
**Không cần sửa**

---

## Round 1 — Đã Sửa (2026-10-13)

| Vấn đề | File | Trạng thái |
|--------|------|-----------|
| Logo "ngũ" whitespace | `Header.tsx` | ✅ Done |
| Realm gradient opacity quá nhẹ | `globals.css` | ✅ Tăng từ 0.12→0.22 |
| Realm border stripe thiếu | `globals.css` | ✅ Thêm `::before` top stripe |
| Realm class cho Story | `Story.tsx` | ✅ Done |
| Realm class cho CardDeck | `CardDeck.tsx` | ✅ Done |
| Realm class cho WuXingDiagram | `WuXingDiagram.tsx` | ✅ Done |
| Realm class cho RulesSection | `RulesSection.tsx` | ✅ Done |
| `/dev/typography` page | `app/dev/typography/page.tsx` | ✅ Done |
| Hero diorama 3 lớp | `Hero.tsx` | ✅ Done |
| CardFace aura glow | `CardFace.tsx` | ✅ Done |
| CssFallbackBackground ngũ hành | `CssFallbackBackground.tsx` | ✅ Done |

## Round 2 — Nghiệm Thu Trang Chủ (Hoàn Tất)

| Hạng mục | Điểm trước | Điểm sau | Kết quả chi tiết | Trạng thái |
|----------|------------|----------|-------------------|------------|
| **1. Hero Section** | 8/10 | **9.5/10** | Diorama 3 lớp, quạt 5 lá hạ thấp trên mobile không drift, text-shadow glow đa tầng sắc nét | ✅ Đạt |
| **2. Story Section** | 9/10 | **9.5/10** | Realm Thổ mộc mạc, scroll banner lượn giấy điệp, tương phản chuẩn | ✅ Đạt |
| **3. CardDeck Section** | 8.5/10 | **9.5/10** | Realm Thủy sâu lắng, border stripe đỉnh, aura glow thẻ bài | ✅ Đạt |
| **4. GameGuide30s** | 9.5/10 | **10/10** | Đã thêm `realm-moc`, mini cards mượt mà, step indicator rõ | ✅ Đạt |
| **5. WuXingDiagram** | 9/10 | **9.5/10** | Ngũ giác tương sinh tương khắc, realm Thổ chuẩn xác | ✅ Đạt |
| **6. RulesSection** | 8/10 | **9.5/10** | Đã thêm `realm-kim`, border stripe bạc, bảng điểm Playfair | ✅ Đạt |
| **7. RegisterForm** | 8/10 | **9.5/10** | Thêm `realm-hoa`, shadow board Đông Hồ dày dặn, form sắc nét | ✅ Đạt |
| **8. TeamFaqFooter** | 8/10 | **9.5/10** | Thêm `realm-thuy`, border top Đông Hồ, typography rõ ràng | ✅ Đạt |
| **9. Header & Nav** | 8/10 | **9.5/10** | Logo "ngũ" chuẩn không khoảng trắng thừa, âm thanh WebAudio chuẩn | ✅ Đạt |
| **10. Typography** | 10/10 | **10/10** | Dấu thanh không bị cắt ở mọi viewport, Playfair + Be Vietnam Pro | ✅ Đạt |
| **11. CssFallbackBg** | 9/10 | **9.5/10** | 5 vùng gradient ngũ hành, trống đồng chim lạc SVG tinh xảo | ✅ Đạt |

> **Tổng kết Trang Chủ**: 100% hạng mục đạt ≥ 9.5/10. Không còn hạng mục nào dưới 9. Hoàn tất nghiệm thu Trang Chủ.

---

## Round 2 — Nghiệm Thu Trang Bộ Bài (`/bo-bai`)

| Hạng mục | Điểm trước | Điểm sau | Ghi chú đánh giá | Trạng thái |
|----------|------------|----------|-------------------|------------|
| **1. Header & Breadcrumbs** | 8.5/10 | **9.5/10** | Nút quay lại trang chủ sắc nét, header đồng bộ thanh âm | ✅ Đạt |
| **2. Tiêu đề & Typography** | 8/10 | **9.5/10** | Heading Playfair Display 48px với `--lh-heading-tight`, không cắt dấu, mô tả `--lh-body` chuẩn | ✅ Đạt |
| **3. Thanh lọc & Tìm kiếm** | 8/10 | **9.5/10** | Paper-board border 3px, shadow 4px Đông Hồ, 5 nút hành tương phản cao, min-height 36px | ✅ Đạt |
| **4. Lưới 45 lá bài** | 9/10 | **9.5/10** | CardFace 3D tilt + xà cừ kim loại + hào quang aura từng hành, grid 5 cột chuẩn | ✅ Đạt |
| **5. Realm & Không khí** | 8/10 | **9.5/10** | `realm-thuy` tạo nền chiều sâu chàm đậm, sống động cùng WebGL đồng bộ filter | ✅ Đạt |

> **Tổng kết Trang Bộ Bài**: Toàn bộ 5/5 hạng mục đạt ≥ 9.5/10. Hoàn tất nghiệm thu Trang Bộ Bài.

---

## Round 2 — Nghiệm Thu Trang Luật Chơi (`/luat-choi`)

| Hạng mục | Điểm trước | Điểm sau | Ghi chú đánh giá | Trạng thái |
|----------|------------|----------|-------------------|------------|
| **1. Header & Điều hướng** | 8.5/10 | **9.5/10** | Nút quay lại trang chủ sắc nét, header thanh âm mượt | ✅ Đạt |
| **2. Tiêu đề & Typography** | 8/10 | **9.5/10** | Heading Playfair Display không cắt dấu, `--lh-heading-tight` chuẩn, font chữ Be Vietnam Pro rõ ràng | ✅ Đạt |
| **3. Bộ chuyển chế độ Bé vs Chuẩn** | 8.5/10 | **9.5/10** | Paper-board 4px shadow, nút bấm nổi min-height 44px, tương phản cao | ✅ Đạt |
| **4. Bảng điểm hòa thanh & Bước chơi** | 8/10 | **9.5/10** | Bảng điểm rõ ràng với `tabular-nums`, badges Đông Hồ có viền sắc sảo | ✅ Đạt |
| **5. Realm & Không khí** | 8/10 | **9.5/10** | `realm-kim` với sắc thái sáng bạc, border stripe đỉnh, tương thích cả 2 theme | ✅ Đạt |

> **Tổng kết Trang Luật Chơi**: Toàn bộ 5/5 hạng mục đạt ≥ 9.5/10. Hoàn tất nghiệm thu Trang Luật Chơi.

---

## Nguyên Tắc Vàng Đánh Giá

1. **Chữ luôn rõ** — không bao giờ blur text để làm "hiệu ứng"
2. **Hiệu ứng sống ở rìa/nền** — glow, gradient, particles ở background
3. **Dấu thanh không bị cắt** — test bằng `/dev/typography`
4. **Màu hành nhất quán** — Thổ=vàng, Kim=bạc, Mộc=xanh lá, Hỏa=đỏ, Thủy=chàm
5. **prefers-reduced-motion được tôn trọng** — fallback CSS tĩnh đủ đẹp
