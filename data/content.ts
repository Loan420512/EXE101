/**
 * ==============================================================================
 * FILE: data/content.ts
 * MỤC ĐÍCH: Lưu trữ toàn bộ nội dung văn bản trên website Ngũ Cung.
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Muốn đổi tiêu đề, mô tả, tagline: sửa trong `HERO_CONTENT`
 * - Muốn đổi bảng so sánh câu chuyện: sửa trong `STORY_CONTENT`
 * - Muốn sửa kịch bản 4 bước 30 giây: sửa trong `GAMEPLAY_30S_STEPS`
 * - Muốn sửa luật chơi rút gọn, bảng điểm: sửa trong `RULES_CONTENT`
 * - Muốn sửa danh sách câu hỏi thường gặp: sửa trong `FAQ_LIST`
 * - Muốn sửa danh sách đội ngũ và giảng viên: sửa trong `TEAM_MEMBERS` và `ADVISOR`
 * ==============================================================================
 */

export const TARGET_AGE = "7+";

export const SITE_METADATA = {
  title: "Ngũ Cung (Five Tones) — Board Game Âm Nhạc Truyền Thống Việt Nam",
  tagline: "Collect the elements. Hear the culture.",
  description: "Card game giáo dục dựa trên ngũ âm và ngũ hành Việt Nam. Bộ bài 15 nhạc cụ, 45 lá bài mang hồn dân tộc vào trải nghiệm tương tác hiện đại.",
  bannerDemoText: "Bản demo: nội dung là bản nháp",
  targetAudience: "Trẻ em từ 7 tuổi, học sinh và gia đình (7+)",
  contactEmail: "lienhe@ngucunggame.vn",
};

export const HERO_CONTENT = {
  badge: "BỘ BÀI GIÁO DỤC ÂM NHẠC VIỆT NAM",
  title: "Bộ bài năm hành, mười lăm nhạc cụ Việt Nam",
  description: "Trải nghiệm trò chơi thẻ bài chiến thuật kết hợp ngũ âm truyền thống và triết lý ngũ hành tương sinh tương khắc. Khám phá thanh âm ngàn năm qua từng ván bài sống động.",
  primaryCta: "Đăng ký chơi thử",
  secondaryCta: "Xem bộ bài",
  quickFacts: [
    { label: "Số người chơi", value: "2 - 5 người", icon: "users" },
    { label: "Thời lượng", value: "15 - 20 phút", icon: "clock" },
    { label: "Độ tuổi", value: "Từ 7 tuổi (7+)", icon: "user-check" },
    { label: "Quy mô", value: "45 lá bài", icon: "layers" },
  ],
};

export const STORY_CONTENT = {
  quote: "Văn hóa vẫn còn đó. Chỉ thiếu một cách để chạm vào.",
  description: "Âm nhạc dân tộc không hề xa lạ hay khó cảm, nó chỉ đang thiếu một chiếc cầu nối gần gũi với thế hệ trẻ hôm nay.",
  comparisonHeaders: ["Hình thức tiếp cận", "Cách chúng ta trải nghiệm", "Cảm xúc đọng lại"],
  comparisons: [
    {
      source: "Bảo tàng",
      experience: "Nhìn, nghe, đọc chú thích",
      retention: "Trang nghiêm nhưng khoảng cách, dễ quên sau khi rời bước",
      highlight: false,
    },
    {
      source: "Sách giáo khoa",
      experience: "Đọc để nhớ, nhớ để thi",
      retention: "Lý thuyết khô khan, học vẹt tên gọi và niên đại",
      highlight: false,
    },
    {
      source: "Lớp học",
      experience: "Nghe giảng, ghi chép",
      retention: "Thụ động tiếp thu, khó hình dung âm sắc và tinh thần",
      highlight: false,
    },
    {
      source: "Ngũ Cung",
      experience: "Cầm lá bài, ghép bản nhạc, nhớ vì từng chơi",
      retention: "Khắc sâu tự nhiên qua chiến thuật, hòa âm và niềm vui chiến thắng",
      highlight: true,
    },
  ],
};

export const GAMEPLAY_30S_STEPS = [
  {
    stepNumber: 1,
    title: "Bước 1: Quan sát Chợ Nhạc & Bài trên tay",
    description: "Chợ Nhạc trải 5 lá ngửa giữa bàn. Trên tay bạn đang cầm 4 lá bài với các nhạc cụ khác nhau.",
    marketCards: ["Đàn nhị", "Cồng chiêng", "Thanh la", "Phách", "Trống cơm"],
    handCards: ["Đàn bầu", "Đàn tranh", "Sáo trúc", "Tù và"],
    playedCards: [],
    points: 0,
    actionText: "Quan sát Chợ Nhạc có Đàn nhị (Thủy) phù hợp với Đàn bầu & Đàn tranh trên tay.",
  },
  {
    stepNumber: 2,
    title: "Bước 2: Lấy nhạc cụ về tay",
    description: "Bạn thực hiện hành động 'Chọn nhạc cụ': rút lá Đàn nhị từ Chợ Nhạc đưa vào bài trên tay.",
    marketCards: ["Cồng chiêng", "Thanh la", "Phách", "Trống cơm"],
    handCards: ["Đàn bầu", "Đàn tranh", "Đàn nhị", "Sáo trúc", "Tù và"],
    playedCards: [],
    points: 0,
    actionText: "Lấy Đàn nhị về tay thành công! Bài trên tay giờ có bộ ba Đàn bầu - Đàn tranh - Đàn nhị.",
  },
  {
    stepNumber: 3,
    title: "Bước 3: Hợp tấu cùng họ Thủy",
    description: "Đàn bầu, Đàn tranh, Đàn nhị là 3 nhạc cụ khác nhau nhưng cùng thuộc họ Thủy (âm Vũ).",
    marketCards: ["Cồng chiêng", "Thanh la", "Phách", "Trống cơm"],
    handCards: ["Sáo trúc", "Tù và"],
    playedCards: ["Đàn bầu (Thủy)", "Đàn tranh (Thủy)", "Đàn nhị (Thủy)"],
    points: 0,
    actionText: "Đủ điều kiện Hợp tấu: 3 lá cùng họ Thủy với 3 nhạc cụ khác biệt hoàn toàn!",
  },
  {
    stepNumber: 4,
    title: "Bước 4: Trình tấu & Ghi điểm",
    description: "Hạ tổ hợp 3 lá xuống bàn trình tấu giai điệu. Bạn xuất sắc ghi trọn vẹn 4 điểm!",
    marketCards: ["Cồng chiêng", "Thanh la", "Phách", "Trống cơm", "Đàn đá (rút mới)"],
    handCards: ["Sáo trúc", "Tù và"],
    playedCards: ["Đàn bầu (Thủy)", "Đàn tranh (Thủy)", "Đàn nhị (Thủy)"],
    points: 4,
    actionText: "Trình tấu hoàn tất! Ghi 4 điểm Hợp tấu. Lượt chơi tiếp tục hướng tới mốc 15 điểm.",
  },
];

export const RULES_CONTENT = {
  title: "Luật chơi rút gọn",
  subtitle: "Dễ học trong 3 phút, chiều sâu chiến thuật bất tận",
  setup: {
    title: "Chuẩn bị",
    items: [
      "Xáo trộn bộ bài 45 lá (15 nhạc cụ × 3 lá mỗi loại).",
      "Mỗi người chơi được chia 5 lá bài ban đầu vào tay kín.",
      "Lật 5 lá bài ngửa ở giữa bàn để tạo thành 'Chợ Nhạc'.",
      "Đặt phần bài còn lại làm Chồng bài rút úp.",
    ],
  },
  turnActions: {
    title: "Mỗi lượt chọn 1 trong 3 hành động",
    actions: [
      {
        name: "1. Chọn nhạc cụ",
        desc: "Lấy 1 lá từ Chợ Nhạc về tay rồi lật bù 1 lá mới, hoặc rút 1 lá úp từ Chồng bài.",
      },
      {
        name: "2. Trình tấu",
        desc: "Đặt xuống bàn một tổ hợp hòa thanh hợp lệ (Đồng âm, Hợp tấu, Liên hoàn hoặc Ngũ Cung) để ghi điểm.",
      },
      {
        name: "3. Phá âm",
        desc: "Đổi 2 lá trên tay vào Chợ Nhạc để làm mới thế trận hoặc phá chuỗi kết hợp của đối thủ.",
      },
    ],
  },
  scoring: [
    { combo: "Đồng âm", requirement: "3 lá cùng họ bài (bất kể trùng nhạc cụ)", score: "2 điểm", badge: "Cơ bản" },
    { combo: "Hợp tấu", requirement: "3 lá cùng họ bài, 3 nhạc cụ khác nhau", score: "4 điểm", badge: "Chiến thuật" },
    { combo: "Liên hoàn", requirement: "2 lá thuộc 2 họ liền nhau theo chiều Tương sinh", score: "2 điểm + Rút thêm 1 lá", badge: "Lợi thế" },
    { combo: "Ngũ Cung", requirement: "Đủ 5 họ bài (Thổ, Kim, Mộc, Hỏa, Thủy) trong một lượt", score: "8 điểm", badge: "Thượng thừa" },
  ],
  winCondition: "Người chơi đầu tiên đạt từ 15 điểm trở lên sẽ kích hoạt vòng kết thúc. Người có tổng điểm cao nhất sau vòng đấu giành chiến thắng chung cuộc.",
};

export const WUXING_DATA = {
  title: "Ngũ âm & Ngũ hành",
  subtitle: "Sự tương tác huyền diệu giữa thanh âm và vạn vật",
  description: "Trong âm nhạc cổ truyền Á Đông, năm thanh âm cơ bản (Cung, Thương, Giốc, Chủy, Vũ) tương ứng mật thiết với năm yếu tố ngũ hành tạo nên vũ trụ. Bấm vào từng cung bậc để khám phá mối quan hệ tương sinh tương khắc.",
  elements: [
    {
      id: "tho",
      name: "Thổ",
      tone: "Cung",
      color: "#F2B632",
      textColor: "#16141A",
      note: "C4 (261.6 Hz)",
      character: "Trầm hậu, bao dung, vững chãi như lòng đất mẹ",
      instrumentsText: "Đàn đá, Trống cơm, Tù và",
      shengTo: "kim", // Thổ sinh Kim
      keTo: "thuy",   // Thổ khắc Thủy
      shengDesc: "Thổ sinh Kim: Đất ấp ủ nuôi dưỡng kim loại quý",
      keDesc: "Thổ khắc Thủy: Đất đắp bờ ngăn dòng nước xiết",
    },
    {
      id: "kim",
      name: "Kim",
      tone: "Thương",
      color: "#DDE3E8",
      textColor: "#16141A",
      note: "D4 (293.7 Hz)",
      character: "Vang dội, sắc bén, thanh khiết và bền bỉ",
      instrumentsText: "Cồng chiêng, Trống đồng, Thanh la",
      shengTo: "thuy", // Kim sinh Thủy
      keTo: "moc",    // Kim khắc Mộc
      shengDesc: "Kim sinh Thủy: Kim loại nung chảy hóa lỏng thành dòng",
      keDesc: "Kim khắc Mộc: Rìu đồng đốn ngã cây rừng",
    },
    {
      id: "thuy",
      name: "Thủy",
      tone: "Vũ",
      color: "#1F3F7E",
      textColor: "#FFFFFF",
      note: "A4 (440.0 Hz)",
      character: "Mềm mại, sâu lắng, biến ảo khôn lường như dòng nước",
      instrumentsText: "Đàn bầu, Đàn tranh, Đàn nhị",
      shengTo: "moc", // Thủy sinh Mộc
      keTo: "hoa",    // Thủy khắc Hỏa
      shengDesc: "Thủy sinh Mộc: Nguồn nước mát lành tưới tắm cây cối xanh tươi",
      keDesc: "Thủy khắc Hỏa: Nước dập tắt ngọn lửa thiêu",
    },
    {
      id: "moc",
      name: "Mộc",
      tone: "Giốc",
      color: "#3F7D3B",
      textColor: "#FFFFFF",
      note: "E4 (329.6 Hz)",
      character: "Mộc mạc, tươi mới, tràn trề sức sống của chồi non vươn lên",
      instrumentsText: "Đàn t'rưng, Sáo trúc, Phách",
      shengTo: "hoa", // Mộc sinh Hỏa
      keTo: "tho",    // Mộc khắc Thổ
      shengDesc: "Mộc sinh Hỏa: Gỗ bén lửa cháy sáng rực rỡ",
      keDesc: "Mộc khắc Thổ: Rễ cây đâm xuyên cạn kiệt dinh dưỡng đất",
    },
    {
      id: "hoa",
      name: "Hỏa",
      tone: "Chủy",
      color: "#D23A22",
      textColor: "#FFFFFF",
      note: "G4 (392.0 Hz)",
      character: "Nồng nhiệt, bốc lửa, sôi động và rạo rực khí thế",
      instrumentsText: "Kèn bầu, Trống chầu, Đàn tỳ bà",
      shengTo: "tho", // Hỏa sinh Thổ
      keTo: "kim",    // Hỏa khắc Kim
      shengDesc: "Hỏa sinh Thổ: Tro tàn lửa cháy bồi đắp thành đất đai màu mỡ",
      keDesc: "Hỏa khắc Kim: Lửa đỏ nung chảy kim khí cứng cỏi",
    },
  ],
};

export const FAQ_LIST = [
  {
    q: "Ngũ Cung là gì và lấy cảm hứng từ đâu?",
    a: "Ngũ Cung là board game thẻ bài giáo dục văn hóa, kết hợp giữa hệ ngũ âm truyền thống của Việt Nam (Cung, Thương, Giốc, Chủy, Vũ) và quy luật ngũ hành tương sinh tương khắc. Trò chơi giúp người chơi tiếp cận 15 nhạc cụ dân tộc một cách tự nhiên và thú vị.",
  },
  {
    q: "Độ tuổi nào phù hợp để chơi trò chơi này?",
    a: "Trò chơi được thiết kế tối ưu cho trẻ em từ 7 tuổi trở lên (7+), học sinh và gia đình. Luật chơi tinh gọn, dễ nắm bắt chỉ sau 1 ván hướng dẫn ngắn với hình minh họa sinh động nhưng có chiều sâu chiến thuật cao.",
  },
  {
    q: "Âm thanh phát trên website có phải là tiếng thu âm nhạc cụ thật không?",
    a: "LƯU Ý: Âm thanh trên website hiện tại là âm thanh tổng hợp thử nghiệm qua WebAudio (nốt tổng hợp dựa trên tần số ngũ cung), CHƯA PHẢI tiếng thu âm nhạc cụ thật. Bản chính thức sau này sẽ sử dụng bản thu âm phòng thu chất lượng cao của các nghệ nhân dân tộc.",
  },
  {
    q: "Dự án bao giờ sẽ ra mắt bản bài in vật lý?",
    a: "Hiện dự án đang trong giai đoạn hoàn thiện thiết kế mỹ thuật Đông Hồ và thử nghiệm gameplay cùng người chơi thử nghiệm. Dự kiến các bộ bài mẫu đầu tiên sẽ được in thử và gửi tới người đăng ký vào quý tiếp theo.",
  },
  {
    q: "Một ván chơi có thể có bao nhiêu người tham gia?",
    a: "Bộ bài tiêu chuẩn 45 lá hỗ trợ tốt nhất cho nhóm từ 2 đến 5 người chơi, với thời lượng trung bình từ 15 đến 20 phút mỗi ván.",
  },
];

export const TEAM_MEMBERS = [
  { name: "Lê Thị Hồng Loan", role: "Team Lead, Producer", bio: "Định hướng sản phẩm và điều phối toàn bộ dự án." },
  { name: "Nguyễn Quang Vinh", role: "Game Designer", bio: "Thiết kế cơ chế thẻ bài, nhịp điệu ván đấu và bảng tính điểm." },
  { name: "Nguyễn Lê Hữu Trí", role: "Technical Developer", bio: "Phát triển nền tảng trải nghiệm số và tương tác ngũ âm." },
  { name: "Nguyễn Phan Quốc Anh", role: "Art & Designer", bio: "Sáng tạo phong cách đồ họa phỏng cảm hứng tranh dân gian Đông Hồ." },
  { name: "Nguyễn Phước Thiện Tâm", role: "Marketing & Business Planner", bio: "Lập kế hoạch truyền thông và tiếp cận cộng đồng người chơi trẻ." },
  { name: "Trần Đăng Nguyên", role: "Cultural Research", bio: "Nghiên cứu sử liệu, âm luật ngũ cung và đặc tính các nhạc cụ dân tộc." },
];

export const ADVISOR = {
  name: "Ngo Thi Tuyet Minh",
  title: "Giảng viên hướng dẫn",
  note: "Cố vấn chuyên môn định hướng dự án và phương pháp tiếp cận giáo dục văn hóa.",
};
