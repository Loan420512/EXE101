# NHẬT KÝ QUYẾT ĐỊNH KIẾN TRÚC & THIẾT KẾ (DECISIONS.MD)

Tài liệu này ghi nhận toàn bộ các quyết định kỹ thuật, quy tắc thiết kế và cơ chế giải quyết điểm mơ hồ trong dự án Web App "Ngũ Cung".

---

## 1. Đối tượng mục tiêu: Độ tuổi 7+

- **Vấn đề**: Tài liệu dự thảo ban đầu đề cập độ tuổi 13+, nhưng nhóm đã thống nhất điều chỉnh độ tuổi mục tiêu thành 7+ (trẻ em từ 7 tuổi, học sinh tiểu học, gia đình).
- **Quyết định**:
  1. Cập nhật biến cấu hình tập trung trong `data/content.ts` thành `7+`.
  2. **Ngôn ngữ & Giao diện**: Dùng câu ngắn gọn, trong sáng; các thuật ngữ âm nhạc cổ truyền (Cung, Thương, Giốc, Chủy, Vũ, tương sinh, tương khắc) đều có chú thích ngữ nghĩa trực quan hoặc tooltip hình ảnh. Kích thước nút bấm tối thiểu 44px, chữ lớn dễ đọc.
  3. **Luật chơi cho bé**: Bên cạnh luật chuẩn đầy đủ, bổ sung tab "Giải thích cho bé" với hình ảnh trực quan, 4 bước ngắn gọn.
  4. **Bảo vệ trẻ em trực tuyến**:
     - Tuyệt đối không tích hợp ô chat văn bản tự do giữa người chơi, không nội dung bên thứ 3, không quảng cáo.
     - Chế độ chơi trực tuyến: Tên hiển thị người chơi được chọn từ danh sách nhạc cụ/con vật dân gian hoặc nhập chuỗi ngắn (tối đa 12 ký tự) có bộ lọc từ ngữ. Mã phòng 4 ký tự ngắn gọn, dễ đọc.
     - Đăng ký chơi thử: Trẻ dưới 13 tuổi không được tự điền email. Biểu mẫu có câu cảnh báo rõ ràng: "Phụ huynh điền thay bé" và yêu cầu email của người lớn kèm ô cam kết đồng thuận của cha mẹ/người giám hộ.
  5. **An toàn giác quan**: Mọi hiệu ứng ánh sáng không nhấp nháy tần số cao (>3Hz), không gây giật mình. Âm thanh WebAudio mặc định tắt (Muted), khi mở có âm lượng mặc định nhỏ nhẹ, êm tai.

---

## 2. Làm rõ các điểm mơ hồ trong Luật chơi (Pure TypeScript Engine)

- **Vấn đề**: Bản tóm tắt luật chơi để lại một số câu hỏi về thứ tự và hành vi biên.
- **Quyết định**:
  1. **Hành động Phá âm**:
     - Người chơi bỏ 1 lá thuộc họ X.
     - *Điều kiện hợp lệ*: Nước đi này CHỈ hợp lệ khi có ít nhất một đối thủ đang nắm giữ lá thuộc họ Y (trong đó X khắc Y: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc). Nếu không ai có lá bị khắc, người chơi không thể chọn Phá âm.
     - *Chọn mục tiêu*: Nếu có nhiều đối thủ cùng giữ lá họ Y, người đánh được quyền chỉ định đối thủ bị ảnh hưởng. Đối thủ bị chỉ định sẽ tự chọn lá họ Y trên tay mình để bỏ vào cọc bỏ.
  2. **Liên hoàn theo chiều Tương sinh (Directed Sequence)**:
     - Khẳng định tính có hướng một chiều: Mộc -> Hỏa -> Thổ -> Kim -> Thủy -> Mộc.
     - Ví dụ: Cặp (Mộc, Hỏa) hợp lệ; nhưng cặp (Hỏa, Mộc) là nghịch chiều, không được tính Liên hoàn.
     - Phần thưởng Liên hoàn: Ghi 2 điểm VÀ được chọn lấy thêm 1 lá từ Chợ Nhạc (sau đó bù cọc rút vào Chợ).
  3. **Kết thúc ván & Xử lý cọc bài**:
     - Khi người chơi đạt từ 15 điểm: Kích hoạt vòng cuối cùng để các người chơi còn lại hoàn thành đủ số lượt trong vòng đó, đảm bảo công bằng lượt đi.
     - Tiebreak (Hòa điểm): Ưu tiên người tạo được nhiều bộ "Hợp tấu" hơn. Nếu vẫn bằng nhau, đồng hạng chiến thắng.
     - Cọc rút hết bài: Tự động gom cọc bài bỏ (discard pile), xáo trộn ngẫu nhiên để làm cọc rút mới. Nếu cả cọc rút lẫn cọc bỏ đều cạn kiệt, ván đấu lập tức tính điểm hiện có để kết thúc.

---

## 3. Lựa chọn Công nghệ & Thư viện

- **Âm thanh**: Dùng Web Audio API thuần (synthesizer với OscillatorNode, GainNode, BiquadFilterNode) cho 5 âm sắc ngũ hành (Thổ C4, Kim D4, Mộc E4, Hỏa G4, Thủy A4). Không dùng Tone.js để tiết kiệm ~120KB JavaScript bundle ban đầu.
- **Hoạt ảnh & Chuyển động**: Dùng GSAP + ScrollTrigger cho các chuỗi hoạt ảnh cuộn kể chuyện ghim trang, kết hợp Lenis smooth scrolling. Dùng CSS/Tailwind cho vi tương tác hover/click nhỏ. Không sử dụng song song Framer Motion để tránh phình dung lượng và xung đột vòng đời render.
- **WebGL & Shader**: Xây dựng shader GLSL tự viết cho giấy điệp (fbm fractal brownian motion, xơ giấy, vệt mực, ánh kim) trên nền Three.js / WebGL thuần, có cơ chế Dynamic Resolution Scaling và FPS Guardian (hạ cấp khi khung hình > 20ms liên tục 1s).
- **Phân hạng thiết bị (Device Tiering)**: 4 cấp độ (High: WebGL đầy đủ hạt + hậu kỳ; Mid: WebGL giảm hạt không hậu kỳ; Low: Canvas 2D mộc; Min: CSS/SVG tĩnh khi bật prefers-reduced-motion hoặc máy cực yếu).
- **Dịch vụ Realtime**: Triển khai standalone Node.js WebSocket server nhẹ với logic state server-authoritative, đảm bảo bot thay thế người thoát và hỗ trợ reconnect mượt mà.

---

## 4. Quản lý Tài nguyên Hình ảnh & Dọn dẹp File (Asset Pipeline)

- **Vấn đề**: Các file ảnh nền phong cảnh và logo cung cấp có dung lượng và kích thước khác nhau (từ 640px đến 1200px), cần đảm bảo tải nhanh trên di động lẫn sắc nét trên màn hình lớn Retina/4K, đồng thời bảo vệ alpha transparency của trống đồng và logo.
- **Quyết định**:
  1. **Bảo tồn ảnh gốc**: Chuyển toàn bộ ảnh gốc vào `assets-src/backgroundweb/` và `assets-src/logo/`, không xóa hay sửa trực tiếp file gốc.
  2. **Pipeline nén đa tầng (`scripts/optimize-images.mjs`)**:
     - Sử dụng thư viện `sharp` tích hợp vào lệnh `npm run images`.
     - Xuất 3 kích thước: 640w (mobile), 1280w (laptop/desktop), 2560w (màn hình lớn Retina).
     - Định dạng kép AVIF (quality 80) ưu tiên cho trình duyệt hiện đại + WebP (quality 85) tương thích rộng, kèm bản master không hậu tố kích thước.
     - Riêng ảnh `trong-dong` và `logo`: Bảo tồn 100% kênh alpha trong suốt (alphaQuality: 90-95) và sinh thêm bản PNG tối ưu.
  3. **Biểu tượng Favicon & PWA**: Tự động sinh `favicon-32x32.png`, `favicon.ico`, `apple-touch-icon.png` (180x180), `icon-192.png` và `icon-512.png` từ logo chính thức.
  4. **Dọn sạch file rác**: Xóa triệt để 5 file SVG mặc định của Next.js (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) không còn sử dụng.

---

## 5. Cấu Trúc Dữ Liệu Cảnh & Hiệu Ứng Nền (`data/scenes.ts` & `config/effects.ts`)

- **Vấn đề**: Việc chuyển đổi giữa cảnh mặc định và 5 cảnh hành khi tương tác cần đảm bảo liền mạch, không giật cục, duy trì độ tương phản chữ (WCAG 2.2 AA) và có đầy đủ mô tả trợ năng `alt`.
- **Quyết định**:
  1. **Nguồn sự thật `data/scenes.ts`**: Tập trung hóa siêu dữ liệu cho 6 cảnh (mặc định + 5 hành) gồm: tên tiếng Việt, cung bậc âm sắc (Cung/Thương/Giốc/Chủy/Vũ), mô tả chi tiết, văn bản trợ năng `alt`, đường dẫn `srcSet` AVIF & WebP, màu phủ gradient và nguồn tài sản.
  2. **Cấu hình hiệu ứng chuyển cảnh `config/effects.ts` (`SCENE_TRANSITION_CONFIG`)**:
     - Thời gian chuyển cảnh: 900ms với easing `cubic-bezier(0.22, 1, 0.36, 1)`.
     - Lớp trống đồng (`trong-dong`): Đặt lệch góc trên bên phải, độ mờ nhẹ (opacity ~0.18), hiệu ứng xoay chậm 240 giây/vòng tĩnh tại, tạo chiều sâu văn hóa Đông Sơn mà không gây phân tâm.
     - Lớp phủ gradient tương phản (`overlayGradient`): Đậm ở rìa và phía trên để chữ và nội dung bài đọc luôn đạt độ tương phản chuẩn WCAG 2.2 AA.

---

## 6. Kiến Trúc Nền Đa Tầng "Cõi Ngũ Âm" (LivingBackground Multi-Layer)

- **Vấn đề**: Kết hợp đồng thời ảnh phong cảnh thực tế, trống đồng Đông Sơn, shader giấy điệp WebGL và hạt ngũ hành sao cho không làm lu mờ văn bản, không giật lag và đem lại ấn tượng thị giác sâu lắng, đậm chất văn hóa Việt.
- **Quyết định**:
  1. **5 Lớp hiển thị chuyên biệt**:
     - *Lớp 1 (Layer -4)*: 6 ảnh quang cảnh thực (mặc định + 5 hành) crossfade mượt 1000ms, độ mờ 35% trên nền đen sâu (#16141A).
     - *Lớp 2 (Layer -3)*: Lớp phủ gradient theo hành bảo vệ độ sắc nét của chữ đọc (WCAG 2.2 AA).
     - *Lớp 3 (Layer -2)*: Mặt Trống Đồng Đông Sơn thực (`trong-dong`) xoay chậm 240 giây/vòng lệch góc trên bên phải, đổ bóng vàng kim mờ ảo.
     - *Lớp 4 (Layer -2 WebGL)*: Shader giấy điệp fbm với chế độ hòa trộn `mix-blend-overlay` / `mix-blend-screen`, tương tác sóng mực theo chuột và vảy điệp lấp lánh.
     - *Lớp 5 (Layer -1 2D)*: Hạt ngũ hành linh khí instanced bay lượn.
  2. **Tương thích & Trợ năng**:
     - Nút "⏸ Tạm dừng nền" tạm dừng đồng thời cả shader, hạt và chuyển động xoay của trống đồng.
     - Tôn trọng `prefers-reduced-motion`: triệt tiêu hoàn toàn hiệu ứng xoay.
     - Dự phòng `CssFallbackBackground`: tải ảnh quang cảnh tĩnh và trống đồng tĩnh khi thiết bị ở phân hạng Min hoặc không hỗ trợ WebGL.
  3. **Cơ chế chuyển cảnh linh hoạt**:
     - Tự động chuyển theo section khi cuộn (`SECTION_SCENE_MAP`).
     - Hỗ trợ sự kiện toàn cục `ngucung:set-scene` để các component con (lá bài, sơ đồ ngũ hành, bộ sưu tập) có thể kích hoạt chuyển cảnh theo hành ngay lập tức.

---

## 7. Gắn Logo Chính Thức "Ngũ Cung Card Game"

- **Vấn đề**: Logo là tranh khắc gỗ hình chữ nhật ngang (người gõ cồng, 5 lá bài ngũ hành và chữ "NGŨ CUNG CARD GAME"), nền trong suốt và nét khắc mực đen. Cần hiển thị sắc nét trên cả giao diện sáng lẫn tối mà không làm biến dạng tỷ lệ gốc (676:369).
- **Quyết định**:
  1. **Thay thế toàn diện**: Thay thế toàn bộ các placeholder cũ (ô vuông đỏ chữ "ngũ" ở Header, chữ "NC" ở Footer).
  2. **Vị trí tích hợp**:
     - Header: Đặt logo tỷ lệ chuẩn với khung viền giấy điệp Đông Hồ, hỗ trợ hover phóng nhẹ.
     - Footer: Gắn logo tại phần giới thiệu dự án chân trang.
     - Metadata & OpenGraph: Cấu hình `images` trong `app/layout.tsx` trỏ tới `/images/logo/logongucung.png`.
     - PWA Manifest: Khai báo icon 192px và 512px trong `manifest.json`.
     - Trang 404: Tạo trang `app/not-found.tsx` mang nhận diện thương hiệu hoàn chỉnh.
  3. **Bảo vệ tương phản thị giác**: Bọc trong thẻ chứa giấy ngà `#FAFAF5` (nền sáng) và giấy sẫm `#25222E` (nền tối) có viền mực Đông Hồ, đảm bảo nét chữ "NGŨ CUNG CARD GAME" không bao giờ bị chìm trên nền đen.




