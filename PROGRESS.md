# TIẾN ĐỘ NÂNG CẤP DỰ ÁN NGŨ CUNG (PROGRESS.MD)

Khẩu hiệu: *"Thu thập ngũ hành. Nghe văn hóa."*  
Đối tượng mục tiêu: **7+** (Trẻ em từ 7 tuổi, gia đình, học sinh)  
Thời gian khởi tạo: 2026-10-13  
Trạng thái tổng thể: **HOÀN THÀNH M1–M9 — NỀN ẢNH NGŨ HÀNH HOẠT ĐỘNG ĐẦY ĐỦ**

---

## 1. Danh Sách Mốc & Trạng Thái

| Mốc | Tên Mốc & Nội Dung Chính | Trạng Thái | Cổng Nghiệm Thu |
|---|---|---|---|
| **M1** | **Nền tảng, Token, Cấu hình, Docker, CI**<br>• Thiết lập token chuẩn Đông Hồ, biến CSS<br>• Cập nhật target age 7+ trong `content.ts`<br>• Viết Dockerfile, docker-compose.yml<br>• Cấu hình CI GitHub Actions<br>• Scripts `setup`, `dev`, `test` | **Hoàn thành** | Typecheck, lint, build pass; setup & dev chạy sạch |
| **M2** | **Nền sống WebGL & Phân hạng thiết bị**<br>• Canvas WebGL cố định nền (shader fbm giấy điệp, sợi điệp lấp lánh)<br>• Họa tiết Đông Hồ xoay chậm (mây, sóng, trống đồng)<br>• Hạt GPU instanced theo hành<br>• Tương tác chuột/chạm mực loang<br>• Chuyển màu theo section & Dark mode "đêm trống đồng"<br>• Nút tạm dừng nền, tự hạ cấp 4 tier (high/mid/low/min), fallback CSS | **Hoàn thành** | 60 FPS tier cao, tự hạ cấp mượt mà, fallback CSS khi không có WebGL |
| **M3** | **Lá bài 3D & 5 Hiệu ứng điện ảnh**<br>• Lá bài 3D tilt theo chuột/gyro, ánh xà cừ kim loại<br>• 5 hiệu ứng biến ảo (Thủy, Hỏa, Mộc, Kim, Thổ) với object pool<br>• Chuyển cảnh liền mạch từ lá bài sang chi tiết<br>• Tính năng "Mở gói bài" (xé 5 lá, lật thẻ)<br>• "Bộ sưu tập" (lưu localStorage, tiến độ x/15, huy hiệu)<br>• VÒNG PHÊ BÌNH 1 | **Hoàn thành** | Không rác bộ nhớ, không rò rỉ bộ nhớ qua RAF; Vòng phê bình 1 đạt |
| **M4** | **Cuộn, Âm thanh & Nội dung tương tác**<br>• GSAP ScrollTrigger + Lenis smooth scroll<br>• WebAudio API thuần (ngũ âm C4, D4, E4, G4, A4), ambient theo hành, analyser visualizer<br>• 15 trang chi tiết `/nhac-cu/[slug]` đầy đủ<br>• Sơ đồ ngũ hành tương tác `/ngu-hanh`<br>• Sân chơi ngũ âm `/san-choi-ngu-am` (ghi âm 10s, chia sẻ URL)<br>• Quiz "Bạn hợp họ nào" `/quiz` (5 câu, chia sẻ kết quả) | **Hoàn thành** | 15 trang nhạc cụ hoàn chỉnh; âm thanh mặc định tắt; analyser chạy thật |
| **M5** | **Lõi luật, Bot, Chuyền máy, Đăng ký & Admin**<br>• Module TypeScript thuần `lib/rules` độc lập React<br>• Chuẩn luật 45 lá, 3 hành động, 4 combo, Phá âm tương khắc chọn đối thủ, vòng kết thúc 15đ, tiebreak, xáo cọc<br>• Bot thông minh không bao giờ phạm luật<br>• Chế độ Chuyền máy 2 - 5 người<br>• `/choi-thu` đăng ký chơi thử (Zod, double opt-in, rate limit, Cloudflare Turnstile, nhóm tuổi 7+, phụ huynh điền thay bé <13)<br>• `/admin` quản trị đăng ký, xuất CSV, phễu nhu cầu<br>• Phân tích hành vi tôn trọng riêng tư (không bên thứ ba)<br>• Đa ngôn ngữ tiếng Việt & tiếng Anh | **Hoàn thành** | 100% test lõi luật pass (9/9 test, 1,000 ván bot không lỗi); luồng đăng ký chạy hoàn chỉnh; admin CSV chuẩn UTF-8 |
| **M6** | **Chơi trực tuyến thời gian thực**<br>• Dịch vụ Node.js WebSocket độc lập<br>• Phòng chơi 2 - 5 người qua mã phòng ngắn gọn<br>• Server-authoritative logic, chống gian lận<br>• Tự động reconnect khi mất kết nối<br>• Bot thay thế khi người chơi thoát | **Hoàn thành** | 2 tab trình duyệt chơi trọn vẹn ván; rớt mạng kết nối lại giữ nguyên trạng thái; test WebSocket pass |
| **M7** | **SEO, PWA, Kiểm thử toàn diện & Bàn giao**<br>• SEO: metadata, sitemap, robots, JSON-LD, OG image<br>• PWA: Service Worker offline tra cứu bài và luật<br>• WCAG 2.2 AA (bàn phím, nhãn aria, contrast, 44px touch target, skip link)<br>• Vitest mô phỏng 1000+ ván bot kiểm chứng tính đúng đắn<br>• Playwright E2E cho luồng chính<br>• Bàn giao tài liệu: `QUALITY_REPORT.md`, `KNOWN_ISSUES.md`, `DECISIONS.md`, `DEMO_SCRIPT.md`, `HUMAN_TODO.md` | **Hoàn thành** | Build pass (33 routes), test pass (10/10), WCAG 2.2 AA, PWA offline, tài liệu bàn giao đầy đủ |
| **M8** | **Cõi Ngũ Âm — Kỳ ảo & Typography Việt**<br>• Design system "Cõi Ngũ Âm": 5 realm variables (tho/kim/moc/hoa/thuy), glow tokens, diorama layers<br>• Hero diorama 3 lớp (SVG Đông Hồ + hạt linh khí + quạt 5 lá)<br>• Title glow theo hành đang chọn (text-shadow CSS transition)<br>• Realm gradient sections: Story=tho, CardDeck=thuy, WuXing=tho, Rules=kim, GameGuide=moc, Register=hoa, Footer=thuy<br>• Realm border stripe `::before` đường màu hành phía đầu mỗi section<br>• CardFace aura glow + KIM shimmer + spirit particles on hover<br>• CssFallbackBackground: 5 gradient blobs + trống đồng SVG cải tiến<br>• Typography: `--lh-heading-tight: 1.18`, `--lh-heading: 1.28`, `--lh-body: 1.65` — test tại `/dev/typography`<br>• `docs/FANTASY_DIRECTION.md`, `docs/TYPOGRAPHY.md`, `docs/FANTASY_REVIEW.md` | **Hoàn thành** | Build pass, TypeScript pass, dấu thanh không cắt ở mọi kích thước, realm gradients hiển thị đúng tất cả sections |

---

## 2. Lệnh Chạy Lại & Kiểm Thử (Rerun Commands)

```bash
# 1. Cài đặt và chuẩn bị môi trường
npm run setup

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Khởi chạy máy chủ WebSocket chơi trực tuyến
npm run realtime

# 4. Kiểm tra kiểu dữ liệu TypeScript (strict)
npx tsc --noEmit

# 5. Chạy kiểm thử đơn vị & mô phỏng luật chơi (Vitest)
npm test

# 6. Build kiểm tra sản phẩm hoàn chỉnh
npm run build

# 7. Kiểm thử typography dấu thanh (dev)
open http://localhost:3000/dev/typography
```

---

## 3. Nhật Ký Cập Nhật
- **2026-10-13 16:30**: Khởi tạo Implementation Plan và `PROGRESS.md`. Dọn dẹp lỗi hàm trùng lặp trong `data/instruments.ts`. Sửa hướng tương sinh `isShengAdjacent`. Chuẩn bị triển khai M1.
- **2026-10-13 17:30**: Hoàn thành M1 (Tokens Đông Hồ, Docker, CI, Scripts).
- **2026-10-13 18:00**: Hoàn thành M2 (WebGL living background giấy điệp, particles, device tiering).
- **2026-10-13 18:45**: Hoàn thành M3 (3D Card Tilt, xà cừ kim loại, pack opening, collection modal, Vòng phê bình 1).
- **2026-10-13 19:15**: Hoàn thành M4 (WebAudio synthesizer, visualizer, 15 trang nhạc cụ, sơ đồ ngũ hành, sân chơi ngũ âm, quiz).
- **2026-10-13 19:42**: Hoàn thành M5 (Lõi luật TypeScript thuần `lib/rules`, Bot AI không phạm luật, test mô phỏng 1,000 ván đấu đạt 100%, trang `/choi-thu-ngay` đấu Bot & Chuyền máy, trang `/choi-thu` Zod + Double Opt-in + Bảo vệ trẻ 7+, trang `/admin` Dashboard + xuất CSV UTF-8, từ điển đa ngôn ngữ `lib/i18n.ts`).
- **2026-10-13 20:01**: Hoàn thành M6 (Máy chủ độc lập `server/realtime.js` WebSocket port 4000, phòng chơi 2-5 người mã 4 ký tự, server-authoritative state giấu bài đối thủ, tự động reconnect và bot tiếp quản khi rớt mạng, tích hợp sảnh phòng trực tuyến tại `/choi-thu-ngay`, test tích hợp `server/realtime.test.js` đạt 100%).
- **2026-10-13 20:07**: Hoàn thành M7 (SEO sitemap.ts, robots.ts, JSON-LD Schema, PWA manifest.json & Service Worker offline, WCAG 2.2 AA skip link & 44px targets, bàn giao `docs/QUALITY_REPORT.md` & `docs/DEMO_SCRIPT.md`). Toàn bộ 7 mốc hoàn thành xuất sắc!
- **2026-10-13 21:05**: Hoàn thành M8 (Cõi Ngũ Âm). 5 realm gradients + border stripes, Hero diorama 3 lớp, title glow theo hành, CardFace aura + shimmer + particles, CssFallbackBackground cải tiến, typography line-height chuẩn chữ Việt, trang `/dev/typography` kiểm thử dấu thanh, tài liệu `docs/FANTASY_DIRECTION.md` + `docs/TYPOGRAPHY.md` + `docs/FANTASY_REVIEW.md`. TypeScript pass, build pass, 33 routes.
- **2026-10-13 21:52**: Hoàn thành Vòng Phê Bình Round 2 cho Trang Chủ (Home). Toàn bộ 11 hạng mục đạt điểm 9.5 – 10/10: Hero glow đa tầng sắc nét, quạt 5 lá chuẩn mobile, realm-moc cho GameGuide30s, realm-hoa cho RegisterForm, realm-thuy cho Footer. Dấu thanh chuẩn hoàn hảo theo `docs/TYPOGRAPHY.md`.
- **2026-10-14 13:46**: **M9 - Hạng mục 1 (Chuẩn hóa & Tối ưu tài nguyên)**: Chuyển toàn bộ ảnh gốc vào `assets-src/`, xóa 5 file thừa SVG của Next.js, tạo `scripts/optimize-images.mjs` với `npm run images` nén tự động 7 ảnh nền (640w, 1280w, 2560w định dạng AVIF + WebP) bảo toàn kênh alpha trống đồng, sinh bộ logo & icon hoàn chỉnh (favicon, touch-icon, icon-192, icon-512).
- **2026-10-14 13:49**: **M9 - Hạng mục 2 (Dữ liệu & Cấu hình cảnh)**: Thiết lập `data/scenes.ts` quản lý 6 cảnh (mặc định + 5 hành) và trống đồng; cấu hình `SCENE_TRANSITION_CONFIG` trong `config/effects.ts` (900ms transition, 240s trống đồng xoay chậm, gradient overlay bảo toàn contrast); lập `docs/CREDITS.md` minh bạch hóa nguồn gốc và giấy phép tài sản.
- **2026-10-14 13:52**: **M9 - Hạng mục 3 (Nền Web LivingBackground & Trống Đồng)**: Nâng cấp kiến trúc nền 5 tầng: (1) 6 cảnh quang cảnh thực AVIF/WebP crossfade, (2) gradient overlay bảo vệ contrast WCAG, (3) Trống đồng Đông Sơn `trong-dong` xoay chậm 240s lệch góc trên phải, (4) WebGL shader giấy điệp & vệt mực loang, (5) hạt linh khí instanced; hỗ trợ sự kiện `ngucung:set-scene` chuyển cảnh toàn cục; cập nhật fallback `CssFallbackBackground`.
- **2026-10-14 13:55**: **M9 - Hạng mục 4 (Gắn Logo Duy Nhất)**: Thay thế hoàn toàn các ô placeholder bằng logo chính thức `logongucung.webp/png` trên Header, Footer, OpenGraph metadata, PWA manifest (icon 192/512) và trang 404 `app/not-found.tsx` với khung viền giấy điệp bảo vệ tương phản sáng/tối.
- **2026-10-14 13:57**: **M9 - Hạng mục 5 (Hiệu Ứng Chuyển Cảnh Khi Bấm Lá Bài)**: Kết nối trọn vẹn 3 tầng tương tác khi bấm lá bài và bộ lọc hành: phát âm sắc ngũ hành (C4/D4/E4/G4/A4), bùng nổ hoạt họa hạt ngũ hành trên `EffectCanvas.tsx`, và tự động chuyển cảnh nền sang cảnh tương ứng (`canh-hoa`, `canh-thuy`, `canh-moc`, `canh-kim`, `canh-tho`) trong 6000ms.
- **2026-10-14**: **M9 - Commit nền ảnh đầy đủ**: Hoàn chỉnh và commit toàn bộ pipeline nền ảnh ngũ hành: `ScenePhotoStack` mới (xếp chồng 6 ảnh, crossfade CSS 1000ms), `LivingBackground` lắng nghe `ngucung:set-scene`, preload 6 ảnh 1280.webp trong `layout.tsx`, `CardDeck`/`Hero` gọi `dispatchSceneChange` khi bấm lá và reset khi đóng modal. Build pass 33 routes, TypeScript pass.
- **2026-10-14 (chiều) — U1/U2 đa vũ trụ (đợt này)**: (1) Thay toàn bộ emoji còn sót bằng icon SVG tự vẽ — bộ icons tăng từ 41 lên 63 icon (child, scroll, balloon, book, blocks, hand, link, warning, gift, crown, trophy, bell, mountain, sparkles, tree, tent, island, shield, swords, users, rocket, cycle, store, score, flag, taiji, lock, medal); quét DOM 7 trang công khai: 0 emoji. (2) Quiz bỏ emoji làm biểu tượng, chuyển sang `QUIZ_ICON_MAP` + chấm màu hành thật. (3) `lib/favorites.ts`: danh sách yêu thích lưu localStorage (try/catch, dùng `useSyncExternalStore`), hàng "Yêu thích của bạn" trên trang chủ chỉ hiện khi có dữ liệu thật (đã verify bằng DOM). (4) `lib/useUniverse.ts` viết lại theo store ngoài React — phím 1–5/0, event `ngucung:set-universe`, nhớ localStorage (đã verify). (5) `InstrumentIllustration`: prop `variant` 0–2 tạo biến thể nhẹ (họa tiết lệch, hình xoay, độ lệch bản in) cho 3 lá cùng nhạc cụ; `CardFace` + `PackOpeningModal` truyền variant theo vị trí. (6) Sửa hydration mismatch tọa độ Math.sin ngôi sao trống đồng (làm tròn 3 số lẻ) — console sạch lỗi. (7) Thẻ hover phóng đúng chuẩn 1.25× theo spec. Bằng chứng: tsc 0 lỗi, eslint còn 2 lỗi cũ có trước (admin, choi-thu-ngay — ghi KNOWN_ISSUES), vitest 10/10 pass, `npm run build` pass đủ routes.


- **2026-10-14 (tối) — U2.5 + U3 + phần còn lại của U2.3**: (1) **U2.5** màn "Ai đang chơi?" (`components/WhoIsPlaying.tsx` + `lib/profiles.ts`): tối đa 5 hồ sơ lưu localStorage (try/catch, `useSyncExternalStore`), tạo nhanh 1 chạm + chế độ Bé, avatar là hành; Header hiển thị avatar + tên, nút mở lại bằng event `ngucung:show-profiles`; trang `/ho-so` viết lại thành hồ sơ thật (đổi hồ sơ, số nhạc cụ đã yêu thích — số của máy, không phải social proof). (2) **U3.2** tìm kiếm tức thì: `lib/search.ts` chuẩn hóa tiếng Việt (bỏ dấu + đ→d + NFC), thang điểm 100/95/80/70/35 theo token để chịu không dấu và gõ sai nhẹ; `components/CommandPalette.tsx` (Ctrl/Cmd K, `/`, Esc, ↑↓ wrap, Enter, lịch sử 6 món trên máy, nhóm Nhạc cụ/Trang/Lệnh). (3) **U3.3** `/duyet`: 6 ô màu lớn, chip lọc theo Âm, tìm không dấu, gợi ý hành theo vũ trụ đang chơi; Header/BottomNav/"Xem tất cả" đều trỏ `/duyet`. (4) **U3.1** trang chi tiết: hero tràn lề gradient màu hành + 5 tab ARIA (`InstrumentTabs.tsx`), dùng cả trường `timbre` previously chưa hiển thị, số lá lấy từ `inst.copiesInDeck` thay vì viết cứng "3". (5) **U3.4** `<ViewTransition name="card-{id}">` nối lưới duyệt ↔ hero chi tiết ↔ lá liên quan, `PrevNextNav` thêm link rel prev/next và phím ← →. (6) **U2.3** chốt: `router.prefetch` trang chi tiết khi hover/focus (Set chống gọi trùng) và `components/CardSheet.tsx` bottom sheet cho máy cảm ứng (vuốt xuống/Esc/nền để đóng, không tự phát tiếng). (7) Hydration-safe: `lib/useIsClient.ts` + `lib/useMediaQuery.ts` đọc trạng thái trình duyệt qua `useSyncExternalStore` thay vì setState trong effect — hết lỗi lint `set-state-in-effect` ở code mới. (8) Tách `components/UniverseGlyph.tsx` (glyph 6 hành + avatar tròn) dùng chung cho Header và `/ho-so`. Bằng chứng: `tsc --noEmit` 0 lỗi, eslint 0 lỗi ở file mới (còn 2 lỗi cũ admin/choi-thu-ngay), `vitest` 25/25 (16 tìm kiếm + 9 luật, gồm mô phỏng 1000 ván), `npm run build` pass 35 routes; DOM verify luồng Ctrl K → "dan bau" → Enter ra `/nhac-cu/dan-bau` (cổng U3 <3 thao tác) và tạo hồ sơ "Bé Bống" ghi đúng localStorage.

- **2026-10-15 (sáng) — Ảnh thật cho 15 lá bài**: 15 ảnh cắt nền do user cung cấp đổi tên thành `public/images/cards/<slug>.png` (ASCII hết, bỏ hậu tố `-removebg-preview`), đổ vào trường `imageUrl` sẵn có của từng nhạc cụ trong `data/instruments.ts` + helper mới `getInstrumentPhoto(id)`. Thành phần mới `components/InstrumentArt.tsx`: ưu tiên ảnh thật (next/image, `object-contain`, đổ bóng 2px, nghiêng nhẹ theo `variant` để 3 lá cùng nhạc cụ vẫn khác nhau), chưa có ảnh thì tự quay lại tranh SVG Đông Hồ. Nối vào 4 điểm hiển thị hình: `CardFace` (lá bài), `InstrumentRow` (hàng ngang), `Billboard` (canh gác, có `priority`), `CardSheet` (phiếu cảm ứng). Bằng chứng: `/_next/image?url=/images/cards/dan-bau.png` trả 200 image/png ~8KB; DOM trang chủ có 46 thẻ ảnh lá bài, `/nhac-cu/dan-bau` đúng 5 ảnh (hero + 4 lá liên quan); tsc 0 lỗi, eslint 0 lỗi.
