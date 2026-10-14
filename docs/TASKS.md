# BẢNG NHIỆM VỤ NGŨ CUNG — CẤU TRÚC ĐA AGENT

> Cập nhật lần cuối: 2026-10-14 (U0 kickoff)
> Mọi thay đổi file quan trọng: ghi vào cột "Bằng chứng" trước khi đánh dấu Xong.
> Xung đột thị giác → Art Director quyết. Xung đột "xong chưa" → QA quyết.

---

## PHÂN CÔNG AGENT

| Agent | Vai trò | File chịu trách nhiệm chính |
|---|---|---|
| **Art Director** | Giữ bản sắc Đông Hồ × streaming, duyệt màn hình, nhịp thị giác | Tất cả — duyệt sau khi từng agent xong |
| **Design-System Engineer** | Token, thành phần, icon SVG, Universe Kit, hệ thiết kế | `config/universes.ts`, `design/tokens.ts`, `app/globals.css`, `components/ui/*` |
| **Experience Engineer** | Khám phá, hàng ngang, thẻ, billboard, chuyển trang | `app/page.tsx`, `app/(explore)/*`, `components/Billboard.tsx`, `components/InstrumentRow.tsx` |
| **Audio Engineer** | Trình phát, Phòng Nhạc, âm tổng hợp, Media Session | `lib/audio.ts`, `lib/player.ts`, `components/MiniPlayer.tsx`, `app/phong-nhac/*` |
| **Game Engineer** | Trung tâm chơi, bàn chơi mới, bot, lõi luật | `app/choi-thu-ngay/*`, `components/GameBoard.tsx`, `lib/rules/*` |
| **Illustrator-Engineer** | Tranh SVG 15 nhạc cụ, mặt lá bài mới | `components/InstrumentIllustration.tsx`, `public/images/cards/*` |
| **QA & Critic** | Chấm điểm, test, Lighthouse, axe-core | `docs/UI_REVIEW.md`, `docs/UX_TESTS.md` |

---

## P0 — U0: NỀN MÓNG (Bắt buộc hoàn thành trước P1)

### U0.1 — Chụp & Chấm điểm vòng 0
| # | Việc | Agent | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| 0.1 | Chụp màn hình hiện trạng (360/768/1280/1920) | QA | ✅ | Kiểm tra qua browser + phân tích ảnh user |
| 0.2 | Chấm điểm 14 tiêu chí vòng 0 | QA | ✅ | Xem `docs/UI_REVIEW.md` |
| 0.3 | Ghi kế hoạch & TASKS.md | Art Director | ✅ | File này |
| 0.4 | Xác minh stack & ngân sách | Design-System | ✅ | Next 16.4, Tailwind v4, sharp, vitest — OK |

---

## P0 — U1: KHUNG & HỆ THIẾT KẾ

### U1.1 — Universe Kit & Token
| # | Việc | Agent | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| 1.1 | Tạo `config/universes.ts` với 6 Universe Kit (5 hành + Hợp Nhất) | Design-System | ✅ | 6 kit đủ màu/hạt/card/audio/motion; `dispatchUniverseChange` + localStorage |
| 1.2 | Mở rộng `design/tokens.ts` — motion tokens, 3 shadow levels, typography scale | Design-System | ✅ | Diff tokens.ts (+23 dòng motion/shadow) |
| 1.3 | Cập nhật `app/globals.css` — thêm universe CSS vars, loại bỏ duplicate | Design-System | ✅ | `html.universe-*`, `--uni-*`, `billboard-progress`, `universe-ripple`, `scrollbar-hide` |
| 1.4 | Tạo bộ icon SVG tự vẽ (24px grid) thay emoji | Illustrator | ✅ | `components/icons/index.tsx` — 63 icon; quét DOM 7 trang: 0 emoji còn lại |
| 1.5 | Cập nhật Header: logo lớn, nav gọn, bộ chọn vũ trụ, ẩn khi cuộn xuống | Experience | ✅ | `Header.tsx` có UNIVERSE_ICONS + useUniverse; nav 6 vũ trụ |
| 1.6 | Thêm BottomNav (mobile tab bar) | Experience | ✅ | `components/BottomNav.tsx` gắn trong `layout.tsx` |
| 1.7 | Tranh SVG 15 nhạc cụ phong cách Đông Hồ | Illustrator | ✅ | `InstrumentIllustration.tsx` — 15 hình + họa tiết 5 hành; sửa hydration mismatch trống đồng (làm tròn tọa độ) |
| 1.8 | Mặt lá bài mới với tranh nhạc cụ + biến thể 3 lá | Illustrator | ✅ | `CardFace` nhận `variant`; `PackOpeningModal` truyền `index % 3`; lệch bản in/họa tiết theo biến thể |

### U1 Cổng kiểm tra
- [x] Không còn emoji trong giao diện (kiểm chứng DOM scan `/`, `/quiz`, `/luat-choi`, `/nhac-cu/dan-bau`, `/ho-so`, `/choi-thu-ngay`, `/bo-bai` — chỉ còn glyph ✓/✦ trang trí, không phải emoji)
- [ ] Không rớt dòng ở thanh điều hướng (360→1920) — **chưa chụp được màn hình** (in-app browser không có viewport); cần mắt người hoặc Playwright xác nhận
- [x] Đổi vũ trụ chạy được (`ngucung:set-universe`; phím tắt 1–5, 0 qua store; nhớ localStorage — kiểm chứng `stored: "moc"` sau phím 3)
- [x] TypeScript pass, build pass (tsc 0 lỗi; build đủ routes; vitest 10/10)

---

## P0 — U2: KHÁM PHÁ (Explore)

### U2.1 — Billboard & Layout
| # | Việc | Agent | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| 2.1 | Xây Billboard toàn màn hình với auto-rotate, nút pause, text board | Experience | ✅ | `Billboard.tsx`: xoay 6s, pause, dừng khi hover, mũi tên + phím, progress bar, câu giá trị 3 giây |
| 2.2 | Hàng ngang InstrumentRow: snap cuộn, arrow nav, edge peek | Experience | ✅ | `InstrumentRow.tsx`: snap-x, nút mũi tên có can-scroll, preview panel hover |
| 2.3 | Thẻ xem trước CardPreview: hover expand, preview panel | Experience | ✅ | Hover phóng 1.25× + panel (nghe thử, yêu thích, chi tiết); `router.prefetch` trang chi tiết khi hover/focus (Set chống gọi trùng); `components/CardSheet.tsx` bottom sheet cho máy cảm ứng (một chạm, vuốt xuống/Esc/nền để đóng) |
| 2.4 | Dải xen kẽ: Story strip, Ngũ hành xoay, "Chơi 30s", ô duyệt màu | Experience | 🔄 | Ô duyệt màu + GameGuide30s + Story + WuXing đã nối trên trang chủ; nhịp dải tùy biến chưa hết |
| 2.5 | Màn "Ai đang chơi?" (profile picker) | Experience | ✅ | `components/WhoIsPlaying.tsx` + `lib/profiles.ts` (tối đa 5 hồ sơ, localStorage try/catch); tự hiện lần đầu, mở lại qua event/`/ho-so`; Header hiện avatar hành + tên; DOM verify: tạo "Bé Bống" hành Hỏa → `ngucung_profiles` có bản ghi, header đổi nhãn |

### U2 Cổng kiểm tra
- [ ] Người mới hiểu sản phẩm trong 3 giây nhìn billboard — cần test 5 người xem lạ (vòng QA)
- [x] Hàng ngang cuộn bằng chuột/vuốt/phím (snap + scrollBy + keydown; verify DOM trên máy)
- [x] Không còn hộp tối giống nhau liên tiếp (billboard → rows → ô màu → 30s → story → deck xen kẽ)

### U2.6 — Yêu thích lưu trên máy (nối sớm từ U4.4 vì nút đã hiện)
| # | Việc | Agent | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| 2.6 | `lib/favorites.ts` (localStorage + try/catch) + hàng "Yêu thích của bạn" chỉ hiện khi có dữ liệu | Experience | ✅ | useSyncExternalStore; DOM verify: thêm `dan-bau, trong-dong` → hàng xuất hiện; Xóa localStorage → hàng ẩn |

---

## P0 — U3: CHI TIẾT, TÌM KIẾM, DUYỆT

| # | Việc | Agent | Trạng thái | Bằng chứng |
|---|---|---|---|---|
| 3.1 | Trang chi tiết nhạc cụ tràn lề, tab layout | Experience | ✅ | Hero tràn lề nhuộm gradient màu hành + 5 tab `InstrumentTabs.tsx` (Giới thiệu/Cấu tạo/Cách chơi/Âm sắc/Ngũ hành), ARIA tablist + ←→/Home/End, panel trống hiện "Đang cập nhật" |
| 3.2 | Tìm kiếm Ctrl+K toàn màn hình | Experience | ✅ | `components/CommandPalette.tsx` (Ctrl/Cmd K, "/", Esc, ↑↓ Enter, lịch sử trên máy) + `lib/search.ts`; DOM verify: Ctrl K → "dan bau" → Enter ra `/nhac-cu/dan-bau`, đúng 1 kết quả |
| 3.3 | Trang Duyệt với ô màu lớn + bộ lọc | Experience | ✅ | `app/duyet/page.tsx`: 6 ô màu lớn (Tất cả + 5 hành), chip lọc theo Âm, ô tìm không dấu, gợi ý hành theo vũ trụ đang chọn; Header + BottomNav + "Xem tất cả" cùng trỏ `/duyet` |
| 3.4 | View Transitions giữa trang | Experience | ✅ | `<ViewTransition name={card-${id}}>` ở lưới `/duyet`, hero và lá liên quan ở trang chi tiết; `PrevNextNav.tsx` thêm link rel prev/next + phím ← → |

### U3 Cổng
- [x] Gõ "dan bau" → thấy Đàn bầu trong <3 thao tác (Ctrl K = 1, gõ = 2, Enter = 3; DOM ghi nhận `/nhac-cu/dan-bau`)

---

## P1 — U4: TRÌNH PHÁT, THƯ VIỆN, HỒ SƠ

| # | Việc | Agent | Trạng thái |
|---|---|---|---|
| 4.1 | MiniPlayer cố định đáy | Audio | ⏳ |
| 4.2 | Màn "Đang phát" toàn màn | Audio | ⏳ |
| 4.3 | Playlist hệ thống + playlist cá nhân | Audio | ⏳ |
| 4.4 | Danh sách của tôi + Bộ sưu tập | Experience | ⏳ |
| 4.5 | Hồ sơ + chế độ Bé + Phụ huynh PIN | Experience | ⏳ |

---

## P1 — U5: PHÒNG NHẠC

| # | Việc | Agent | Trạng thái |
|---|---|---|---|
| 5.1 | Giao diện chạm 5 họ nhạc cụ | Audio | ⏳ |
| 5.2 | Âm Karplus-Strong, gõ, thổi | Audio | ⏳ |
| 5.3 | Ghi và lặp (3 lớp max) | Audio | ⏳ |
| 5.4 | Chế độ "Chơi theo nhịp" | Audio | ⏳ |

---

## P1 — U6: CHƠI

| # | Việc | Agent | Trạng thái |
|---|---|---|---|
| 6.1 | Trung tâm chơi (màn Chơi) | Game | ⏳ |
| 6.2 | Bàn chơi mới (quạt bài + hoạt ảnh 3 hành động) | Game | ⏳ |
| 6.3 | Màn tổng kết + Xem lại ván | Game | ⏳ |
| 6.4 | Thử thách hôm nay | Game | ⏳ |
| 6.5 | Chơi trực tuyến BroadcastChannel (bản thử) | Game | ⏳ |

---

## P2 — U7: WRAPPED, HÀNH TRÌNH, STUDIO

| # | Việc | Agent | Trạng thái |
|---|---|---|---|
| 7.1 | "Ngũ Cung của bạn" — thẻ story Wrapped | Experience | ⏳ |
| 7.2 | Hành trình học 5 chương | Experience | ⏳ |
| 7.3 | /studio (cờ môi trường) | Design-System | ⏳ |

---

## P2 — U8: ĐÁNH BÓNG & BÀN GIAO

| # | Việc | Agent | Trạng thái |
|---|---|---|---|
| 8.1 | Chế độ TV (10-foot UI) | Experience | ⏳ |
| 8.2 | Chế độ Giới thiệu 60s | Experience | ⏳ |
| 8.3 | Vòng phê bình cuối + Lighthouse mobile ≥90 | QA | ⏳ |
| 8.4 | Tài liệu bàn giao đầy đủ | Art Director | ⏳ |

---

## CHÚ THÍCH TRẠNG THÁI
- ✅ Xong (có bằng chứng)
- 🔄 Đang làm
- ⏳ Chờ
- ❌ Chặn / Lỗi
- 🚫 Bỏ qua (có lý do)
