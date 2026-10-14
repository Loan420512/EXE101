# VẤN ĐỀ ĐÃ BIẾT & CÂN NHẮC CÂN BẰNG GAME (KNOWN_ISSUES.MD)

Tài liệu này ghi lại các vấn đề đã biết, điểm mất cân bằng luật chơi được ghi nhận trong quá trình thử nghiệm để nhóm cân nhắc khi tổ chức playtest thực tế.

---

## 1. Cân Bằng Luật Chơi (Game Balance Considerations)

1. **Sức mạnh của combo "Ngũ Cung" (8 điểm)**:
   - *Hiện tượng*: Một người chơi tích lũy đủ 5 họ bài và trình tấu sẽ đạt ngay 8 điểm (hơn 50% số điểm cần để chạm mốc thắng 15 điểm).
   - *Cân nhắc Playtest*: Xem xét việc yêu cầu người chơi phải có 5 nhạc cụ khác biệt thuộc 5 họ, hoặc bổ sung điều kiện để đối thủ có cơ hội dùng hành động "Phá âm" làm gián đoạn trước khi người chơi kịp trình tấu.

2. **Hành động "Phá âm" trong bàn 2 người so với bàn 5 người**:
   - *Hiện tượng*: Trong bàn 2 người, việc một người chơi dùng Phá âm để ép đối thủ duy nhất bỏ lá bài họ bị khắc có tác động triệt tiêu rất mạnh. Trong khi đó, ở bàn 5 người, việc làm giảm bài của một đối thủ có thể tạo lợi thế vô tình cho 3 người chơi còn lại.
   - *Cân nhắc Playtest*: Theo dõi tỷ lệ chọn hành động Phá âm giữa các quy mô bàn chơi khác nhau trong các buổi thử nghiệm người dùng.

3. **Cơ chế thưởng rút thêm bài từ combo "Liên hoàn"**:
   - *Hiện tượng*: Combo Liên hoàn vừa cho 2 điểm vừa cho phép lấy thêm 1 lá từ Chợ Nhạc. Nếu người chơi liên tục tích lũy các cặp tương sinh, tay bài có thể duy trì dồi dào tài nguyên.
   - *Cân nhắc Playtest*: Đảm bảo giới hạn 7 lá trên tay (HAND_LIMIT = 7) được thực thi nghiêm ngặt vào cuối lượt để tránh tích trữ quá đà.

---

## 2. Kỹ Thuật & Giả Lập Môi Trường Cục Bộ

1. **Khóa dịch vụ ngoài ở chế độ phát triển (Dev Fallback)**:
   - Khi chưa có khóa `RESEND_API_KEY`: Hệ thống tự động chuyển sang chế độ in nội dung email ra Console và ghi log vào file `storage/emails.log`, mã xác thực OTP/link double opt-in vẫn hoạt động bình thường.
   - Khi chưa có khóa Cloudflare Turnstile: Biểu mẫu tự động chấp nhận token kiểm thử `1x00000000000000000000AA` của Cloudflare.
   - Rate limit: Sử dụng in-memory LRU token bucket khi chưa kết nối Redis/Upstash.

---

## 3. Ghi nhận đợt U1/U2 (2026-10-14)

1. **Hai lỗi eslint có trước, nằm ngoài phạm vi U1/U2 (chưa sửa để không đổi hành vi)**:
   - `app/admin/page.tsx:61` — `react-hooks/set-state-in-effect`: admin gọi `setLoading(true)` đồng bộ trong effect fetch.
   - `app/choi-thu-ngay/page.tsx:206` — cùng rule: cờ `setIsBotThinking(true)` đồng bộ trong effect bot.
   - Kế hoạch sửa: chuyển cờ sang ref-guard hoặc `useSyncExternalStore` như `lib/favorites.ts` khi làm U6 (bàn chơi mới).
2. **Chưa chụp được ảnh màn hình tự động**: in-app browser của phiên làm việc không cấp viewport nhìn thấy (viewport 0x0), mọi kiểm chứng U1/U2 chạy qua DOM scan + evaluate script. Việc chấm điểm thị giác (cột "rớt dòng 360→1920") cần QA chạy Playwright hoặc mắt người ở vòng tiếp theo.
3. **U2.3 còn dở**: bottom sheet xem trước trên cảm ứng và preload dữ liệu chi tiết khi hover chưa làm (ghi rõ trong docs/TASKS.md).
