# NGUỒN TÀI NGUYÊN VÀ GIẤY PHÉP (CREDITS.MD)

Tài liệu này ghi nhận toàn bộ hình ảnh nền, trống đồng và biểu trưng được sử dụng trong dự án Web App Ngũ Cung.
Tuân thủ nguyên tắc: Sử dụng đúng file gốc được cung cấp nội bộ dự án, không bịa nguồn hay sự kiện.

---

## 1. Bảng Đối Chiếu Ảnh Nền (Background Scenes)

| Tên File Gốc (`assets-src/`) | Tên Bản Nén (`public/images/backgroundweb/`) | Vai Trò & Mô Tả Ngữ Nghĩa | Định Dạng & Kích Thước Sinh Ra | Nguồn Cung Cấp & Bản Quyền |
|---|---|---|---|---|
| `Defaultbackgroundweb.jpg` | `nen-mac-dinh` | **NỀN MẶC ĐỊNH**: Toàn cảnh thành phố ven vịnh nhìn từ trên cao trong làn sương sớm và ánh sáng rực rỡ. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `defaultwebbackground.png` | `trong-dong` | **LỚP TRỐNG ĐỒNG**: Mặt trống đồng Đông Sơn tròn, vàng đồng trên nền trong suốt (RGBA alpha = 0). | AVIF, WebP (640w, 1280w, 2560w) + PNG master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `earth.jpg` | `canh-tho` | **CẢNH THỔ (Âm Cung - C4)**: Đồi cát vàng sa thạch lúc hoàng hôn / bình minh rực rỡ, trầm ấm vững chãi. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `metal.jpg` | `canh-kim` | **CẢNH KIM (Âm Thương - D4)**: Núi đá vôi nhô lên giữa vịnh biển phẳng lặng, sắc sảo sáng trong. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `wood.jpg` | `canh-moc` | **CẢNH MỘC (Âm Giốc - E4)**: Thung lũng ruộng bậc thang xanh ngát ngút ngàn, sinh sôi tươi mát. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `fire.jpg` | `canh-hoa` | **CẢNH HỎA (Âm Chủy - G4)**: Đèn trời hoa đăng bay rực rỡ trong đêm, bùng cháy nhiệt huyết. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |
| `water.jpg` | `canh-thuy` | **CẢNH THỦY (Âm Vũ - A4)**: Thác nước nhiều tầng giữa rừng xanh nguyên sinh, uốn lượn sâu thẳm. | AVIF, WebP (640w, 1280w, 2560w) + master | Tài sản nội bộ dự án Ngũ Cung. Sử dụng nội bộ dự án. |

---

## 2. Logo & Biểu Tượng (Brand Assets)

| Tên File Gốc (`assets-src/`) | Tên Xuất Bản (`public/images/logo/` & `public/`) | Mô Tả | Kích Thước |
|---|---|---|---|
| `logongucung.png` | `logongucung.webp`, `logongucung.png`, `logo-ngucung.webp` | Tranh khắc gỗ hình chữ nhật đứng: người gõ cồng, 5 lá bài ngũ hành, dòng chữ "NGŨ CUNG CARD GAME", nền trong suốt. | Kích thước gốc (676x369), nén WebP 95% & PNG |
| `logongucung.png` | `public/favicon-32x32.png`, `public/favicon.ico` | Biểu tượng favicon trình duyệt. | 32x32 px |
| `logongucung.png` | `public/apple-touch-icon.png` | Biểu tượng màn hình chính thiết bị Apple iOS. | 180x180 px |
| `logongucung.png` | `public/icon-192.png`, `public/icon-512.png` | Biểu tượng ứng dụng PWA Android / Chrome. | 192x192 px, 512x512 px |

---

## 3. Quy Ước Codebase

1. Trong mã nguồn và dữ liệu, **chỉ tham chiếu tên bản nén** (`/images/backgroundweb/nen-mac-dinh.webp`, `/images/logo/logongucung.webp`, v.v.), không tham chiếu trực tiếp tên file gốc.
2. File gốc được lưu trữ nguyên vẹn tại `assets-src/` và được theo dõi trong Git để phục vụ pipeline tự động (`npm run images`).
