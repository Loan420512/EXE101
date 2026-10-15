/**
 * ==============================================================================
 * FILE: data/instruments.ts
 * MỤC ĐÍCH: Dữ liệu chuẩn của 15 nhạc cụ truyền thống Việt Nam trong bộ bài Ngũ Cung.
 * HƯỚNG DẪN CHỈNH SỬA:
 * - Dữ liệu nguyên văn theo mô tả thiết kế của dự án, không tự thêm thắt niên đại/sự kiện.
 * - Muốn sửa thông tin một nhạc cụ: tìm theo `id` hoặc `name` bên dưới.
 * - Muốn thêm hình ảnh minh họa thật sau này: thêm đường dẫn vào trường `imageSrc`.
 * ==============================================================================
 */

import { ELEMENT_COLORS } from "@/design/tokens";

export type ElementType = "tho" | "kim" | "moc" | "hoa" | "thuy";

export const ELEMENT_ORDER: ElementType[] = ["tho", "kim", "moc", "hoa", "thuy"];

/** Chiều tương sinh: Thổ → Kim → Thủy → Mộc → Hỏa → Thổ */
export const SHENG_NEXT: Record<ElementType, ElementType> = {
  tho: "kim",
  kim: "thuy",
  thuy: "moc",
  moc: "hoa",
  hoa: "tho",
};

/** Chiều tương khắc */
export const KE_NEXT: Record<ElementType, ElementType> = {
  tho: "thuy",
  kim: "moc",
  thuy: "hoa",
  moc: "tho",
  hoa: "kim",
};

export interface Instrument {
  id: string;
  slug: string;
  name: string;
  nameGlossEn: string;
  element: ElementType;
  elementName: string;
  tone: string;
  toneVietnamese: string;
  noteFrequency: string;
  noteName: string;
  elementColor: string;
  textColor: string;
  summaryVerbatim: string;
  description: string;
  structure: string;
  playMethod: string;
  timbre: string;
  elementReason: string;
  copiesInDeck: number;
  status: "Bản nháp";
  imageUrl?: string;
  audioUrl?: string;
}

export const ELEMENT_CONFIG = {
  tho: {
    name: "Thổ",
    nameEn: "Earth",
    tone: "Cung",
    color: ELEMENT_COLORS.tho.fill,
    textColor: ELEMENT_COLORS.tho.text,
    note: "C4",
    freq: 261.63,
    description: "Âm trầm ấm, đôn hậu, tượng trưng cho đất mẹ nuôi dưỡng vạn vật.",
  },
  kim: {
    name: "Kim",
    nameEn: "Metal",
    tone: "Thương",
    color: ELEMENT_COLORS.kim.fill,
    textColor: ELEMENT_COLORS.kim.text,
    note: "D4",
    freq: 293.66,
    description: "Âm sắc trong trẻo, vang dội, sắc sảo như kim loại quý.",
  },
  moc: {
    name: "Mộc",
    nameEn: "Wood",
    tone: "Giốc",
    color: ELEMENT_COLORS.moc.fill,
    textColor: ELEMENT_COLORS.moc.text,
    note: "E4",
    freq: 329.63,
    description: "Âm mộc mạc, tươi tắn, thanh thoát như tiếng gió qua rặng tre ngút ngàn.",
  },
  hoa: {
    name: "Hỏa",
    nameEn: "Fire",
    tone: "Chủy",
    color: ELEMENT_COLORS.hoa.fill,
    textColor: ELEMENT_COLORS.hoa.text,
    note: "G4",
    freq: 392.00,
    description: "Âm ấm áp, rực rỡ, nhiệt huyết và biến ảo như ngọn lửa bùng cháy.",
  },
  thuy: {
    name: "Thủy",
    nameEn: "Water",
    tone: "Vũ",
    color: ELEMENT_COLORS.thuy.fill,
    textColor: ELEMENT_COLORS.thuy.text,
    note: "A4",
    freq: 440.00,
    description: "Âm mềm mại, uốn lượn, lắng đọng khôn lường như dòng nước luân chuyển.",
  },
} as const;

export const INSTRUMENTS: Instrument[] = [
  // ===================== THỔ (CUNG) =====================
  {
    id: "dan-da",
    slug: "dan-da",
    name: "Đàn đá",
    nameGlossEn: "lithophone",
    element: "tho",
    elementName: "Thổ",
    tone: "Cung",
    toneVietnamese: "Cung",
    noteName: "C4",
    noteFrequency: "261.6 Hz",
    elementColor: "#F2B632",
    textColor: "#16141A",
    summaryVerbatim: "Thanh đá gõ ra các cao độ, phát hiện ở Tây Nguyên năm 1949 tại Đắk Lắk.",
    description: "Nhạc cụ gõ cổ xưa của đồng bào Tây Nguyên, phát hiện năm 1949 tại Đắk Lắk. Mỗi phiến đá tự nhiên được ghè đẽo để phát ra một cao độ xác định.",
    structure: "Gồm tập hợp các thanh đá có kích thước, độ dày mỏng và chiều dài khác nhau xếp trên giá hoặc đặt trên mặt phẳng.",
    playMethod: "Dùng dùi gõ vào các phiến đá để tạo nên giai điệu trầm hùng hoặc thánh thót.",
    timbre: "Vang, đanh, mang âm hưởng thô mộc và huyền bí của núi rừng đại ngàn.",
    elementReason: "Được chế tác hoàn toàn từ đá tự nhiên khai thác từ lòng đất núi rừng (hành Thổ).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-da.png",
  },
  {
    id: "trong-com",
    slug: "trong-com",
    name: "Trống cơm",
    nameGlossEn: "rice drum",
    element: "tho",
    elementName: "Thổ",
    tone: "Cung",
    toneVietnamese: "Cung",
    noteName: "C4",
    noteFrequency: "261.6 Hz",
    elementColor: "#F2B632",
    textColor: "#16141A",
    summaryVerbatim: "Trống hai mặt, tâm mặt trống dán cơm nghiền để chỉnh âm.",
    description: "Nhạc cụ gõ truyền thống quen thuộc trong âm nhạc dân gian Việt Nam, có cấu tạo hai mặt độc đáo với tập quán dán cơm nghiền vào tâm màng trống.",
    structure: "Thân hình ống thon ở giữa, hai đầu bịt da; chính giữa mặt trống dán một nắm cơm nghiền dẻo để định âm và hãm bớt tạp âm.",
    playMethod: "Đeo trống ngang bụng, dùng cả hai bàn tay vỗ hoặc gõ vào hai mặt trống.",
    timbre: "Trầm ấm, đục vừa phải, nẩy và đầy đặn, giữ nhịp duyên dáng.",
    elementReason: "Sử dụng tinh bột lúa gạo - sản vật thuần túy từ đất trồng trọt (hành Thổ) - để định hình âm hưởng.",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/trong-com.png",
  },
  {
    id: "tu-va",
    slug: "tu-va",
    name: "Tù và",
    nameGlossEn: "horn",
    element: "tho",
    elementName: "Thổ",
    tone: "Cung",
    toneVietnamese: "Cung",
    noteName: "C4",
    noteFrequency: "261.6 Hz",
    elementColor: "#F2B632",
    textColor: "#16141A",
    summaryVerbatim: "Làm từ sừng trâu hoặc vỏ ốc, dùng để báo hiệu.",
    description: "Nhạc cụ thổi thô sơ nhưng uy lực, bắt nguồn từ đời sống săn bắt, canh phòng và tín ngưỡng dân gian từ thời tiền sử.",
    structure: "Làm từ sừng trâu khoét rỗng hoặc vỏ ốc biển lớn, ở chóp có lỗ thổi để môi tạo rung chấn.",
    playMethod: "Đặt môi vào lỗ thổi và dùng luồng hơi mạnh từ bụng thổi dồn để phát ra tiếng rền vang.",
    timbre: "Trầm hùng, ngân xa, có sức vang vọng xuyên qua núi rừng và thung lũng.",
    elementReason: "Bắt nguồn từ vật liệu tự nhiên gắn liền với động vật cày cuốc trên đồng ruộng đất đai (hành Thổ).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/tu-va.png",
  },

  // ===================== KIM (THƯƠNG) =====================
  {
    id: "cong-chieng",
    slug: "cong-chieng",
    name: "Cồng chiêng",
    nameGlossEn: "gongs",
    element: "kim",
    elementName: "Kim",
    tone: "Thương",
    toneVietnamese: "Thương",
    noteName: "D4",
    noteFrequency: "293.7 Hz",
    elementColor: "#DDE3E8",
    textColor: "#16141A",
    summaryVerbatim: "Hợp kim đồng, Tây Nguyên, UNESCO công nhận năm 2005.",
    description: "Kiệt tác truyền khẩu và phi vật thể nhân loại được UNESCO công nhận năm 2005, linh hồn trong không gian văn hóa cồng chiêng Tây Nguyên.",
    structure: "Đúc bằng hợp kim đồng pha thiếc hoặc chì; cồng có núm ở giữa, chiêng mặt phẳng không núm.",
    playMethod: "Dùng dùi bọc vải hoặc nắm tay đánh vào núm/mặt chiêng, tay kia chặn hoặc mở để biến đổi độ ngân.",
    timbre: "Ngân vang mênh mang, nhiều tầng hài âm kim loại ấm và sâu lắng.",
    elementReason: "Đúc bằng kim khí hợp kim đồng đặc trưng (hành Kim).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/cong-chieng.png",
  },
  {
    id: "trong-dong",
    slug: "trong-dong",
    name: "Trống đồng",
    nameGlossEn: "bronze drum",
    element: "kim",
    elementName: "Kim",
    tone: "Thương",
    toneVietnamese: "Thương",
    noteName: "D4",
    noteFrequency: "293.7 Hz",
    elementColor: "#DDE3E8",
    textColor: "#16141A",
    summaryVerbatim: "Văn hóa Đông Sơn, hơn 2.000 năm.",
    description: "Biểu tượng thiêng liêng của nền văn minh lúa nước và văn hóa Đông Sơn rực rỡ với bề dày lịch sử hơn hai nghìn năm dựng nước.",
    structure: "Đúc bằng đồng thau nguyên khối với tang trống, thân trống và mặt trống khắc họa tiết sao nhiều cánh, chim Lạc, cảnh lễ hội.",
    playMethod: "Dùng dùi lớn gõ vào tâm mặt trống trong các nghi lễ trang trọng, cầu mùa hoặc tập hợp cộng đồng.",
    timbre: "Hùng tráng, uy nghi, rền vang khắp núi non sông nước.",
    elementReason: "Đỉnh cao của kỹ nghệ luyện kim đúc đồng cổ đại của người Việt (hành Kim).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/trong-dong.png",
  },
  {
    id: "thanh-la",
    slug: "thanh-la",
    name: "Thanh la",
    nameGlossEn: "small gong",
    element: "kim",
    elementName: "Kim",
    tone: "Thương",
    toneVietnamese: "Thương",
    noteName: "D4",
    noteFrequency: "293.7 Hz",
    elementColor: "#DDE3E8",
    textColor: "#16141A",
    summaryVerbatim: "Chiêng nhỏ, mặt phẳng, dùng trong chèo, tuồng.",
    description: "Nhạc cụ gõ bằng đồng có kích thước nhỏ, đóng vai trò tạo điểm nhấn sinh động trong dàn nhạc sân khấu truyền thống chèo và tuồng.",
    structure: "Mặt phẳng hình đĩa tròn bằng hợp kim đồng mỏng, có gờ mép uốn quanh và dây xỏ để cầm.",
    playMethod: "Một tay xách dây giữ thanh la, tay kia cầm dùi gỗ nhỏ gõ vào tâm hoặc mép đĩa.",
    timbre: "Vang lảnh lót, sắc sảo, dứt khoát, mang lại không khí náo nhiệt.",
    elementReason: "Chế tác từ đồng cán mỏng, đặc trưng cho chất âm thanh khiết của kim loại (hành Kim).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/thanh-la.png",
  },

  // ===================== MỘC (GIỐC) =====================
  {
    id: "dan-trung",
    slug: "dan-trung",
    name: "Đàn t'rưng",
    nameGlossEn: "bamboo xylophone",
    element: "moc",
    elementName: "Mộc",
    tone: "Giốc",
    toneVietnamese: "Giốc",
    noteName: "E4",
    noteFrequency: "329.6 Hz",
    elementColor: "#3F7D3B",
    textColor: "#FFFFFF",
    summaryVerbatim: "Ống nứa xếp trên giá, Tây Nguyên.",
    description: "Nhạc cụ gõ độc đáo của các dân tộc Tây Nguyên (Ba Na, Gia Rai), gắn bó sâu sắc với nương rẫy và lễ hội buôn làng.",
    structure: "Gồm hàng loạt ống nứa hoặc trúc có độ dài ngắn, đường kính khác nhau được vát một đầu, liên kết bằng dây treo trên giá gỗ.",
    playMethod: "Dùng hai dùi gõ nhẹ lên thân ống nứa để tạo chuỗi giai điệu vui tươi, rộn rã.",
    timbre: "Trong trẻo, lảnh lót như tiếng suối reo và gió thổi qua rừng tre trúc.",
    elementReason: "Được làm hoàn toàn từ thân tre nứa thiên nhiên của núi rừng (hành Mộc).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-trung.png",
  },
  {
    id: "sao-truc",
    slug: "sao-truc",
    name: "Sáo trúc",
    nameGlossEn: "bamboo flute",
    element: "moc",
    elementName: "Mộc",
    tone: "Giốc",
    toneVietnamese: "Giốc",
    noteName: "E4",
    noteFrequency: "329.6 Hz",
    elementColor: "#3F7D3B",
    textColor: "#FFFFFF",
    summaryVerbatim: "Sáo thổi ngang bằng ống trúc.",
    description: "Nhạc cụ hơi kinh điển gắn liền với hình ảnh đồng quê thanh bình và tâm hồn người Việt từ bao đời nay.",
    structure: "Ống trúc hoặc nứa thẳng, nhẵn bóng, có lỗ thổi ngang, lỗ định âm và hệ thống các lỗ bấm nốt.",
    playMethod: "Đặt môi ngang lỗ thổi, điều tiết luồng hơi và ngón tay bịt/mở các lỗ nốt để tạo cao độ và luyến láy.",
    timbre: "Bay bổng, réo rắt, êm đềm và thanh thoát.",
    elementReason: "Làm từ ống trúc tự nhiên, biểu trưng cho sức sống dẻo dai của cây cỏ (hành Mộc).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/sao-truc.png",
  },
  {
    id: "phach",
    slug: "phach",
    name: "Phách",
    nameGlossEn: "clappers",
    element: "moc",
    elementName: "Mộc",
    tone: "Giốc",
    toneVietnamese: "Giốc",
    noteName: "E4",
    noteFrequency: "329.6 Hz",
    elementColor: "#3F7D3B",
    textColor: "#FFFFFF",
    summaryVerbatim: "Nhạc cụ giữ nhịp trong ca trù.",
    description: "Linh hồn giữ nhịp của nghệ thuật ca trù truyền thống, điều phối từng khổ đàn và tiếng hát của đào nương.",
    structure: "Gồm bàn phách bằng gỗ cứng hoặc thanh tre già và hai que gõ (một que chẻ đôi, một que đặc).",
    playMethod: "Đào nương cầm hai que gõ đều đặn vào bàn phách tạo nên các tiếng chát, tom nhịp nhàng chuẩn xác.",
    timbre: "Giòn giã, dứt khoát, thanh đanh nhưng ấm áp chất gỗ.",
    elementReason: "Chế tác từ các loại gỗ và tre chọn lọc lâu năm (hành Mộc).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/phach.png",
  },

  // ===================== HỎA (CHỦY) =====================
  {
    id: "ken-bau",
    slug: "ken-bau",
    name: "Kèn bầu",
    nameGlossEn: "gourd oboe",
    element: "hoa",
    elementName: "Hỏa",
    tone: "Chủy",
    toneVietnamese: "Chủy",
    noteName: "G4",
    noteFrequency: "392.0 Hz",
    elementColor: "#D23A22",
    textColor: "#FFFFFF",
    summaryVerbatim: "Kèn lưỡi gà, loa loe như quả bầu.",
    description: "Nhạc cụ hơi kèn dăm có âm lượng lớn, thường dẫn đầu dàn nhạc trong lễ hội, tang lễ truyền thống và nhã nhạc cung đình.",
    structure: "Gồm ống thổi có lưỡi gà (dăm kèn), thân kèn bằng gỗ khoan lỗ và phần loa kèn loe rộng làm từ vỏ bầu khô hoặc gỗ hình quả bầu.",
    playMethod: "Ngậm dăm kèn thổi lấy hơi liên tục (thổi luồn hơi) kết hợp bấm các lỗ trên thân kèn.",
    timbre: "Rực rỡ, chói lọi, da diết và mang năng lượng bùng nổ.",
    elementReason: "Âm sắc chói chang, sôi nổi, luôn đốt cháy bầu không khí lễ hội như ngọn lửa bùng phát (hành Hỏa).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/ken-bau.png",
  },
  {
    id: "trong-chau",
    slug: "trong-chau",
    name: "Trống chầu",
    nameGlossEn: "praise drum",
    element: "hoa",
    elementName: "Hỏa",
    tone: "Chủy",
    toneVietnamese: "Chủy",
    noteName: "G4",
    noteFrequency: "392.0 Hz",
    elementColor: "#D23A22",
    textColor: "#FFFFFF",
    summaryVerbatim: "Trống nhỏ dùng trong ca trù.",
    description: "Nhạc cụ do chính người thưởng thức (quan viên) cầm chầu trong ca trù, vừa để chấm điểm vừa thể hiện sự tán thưởng tinh tế.",
    structure: "Trống nhỏ hình trụ ngắn, hai mặt bịt da trâu thuộc kỹ, tang trống bằng gỗ mít dày dặn.",
    playMethod: "Dùng roi chầu bằng gỗ gõ vào mặt trống (tiếng thùng) hoặc gõ vào tang trống (tiếng cắc) để biểu thị lời khen chê.",
    timbre: "Đanh giòn, dứt khoát, tạo cảm xúc sôi động khích lệ nghệ sĩ.",
    elementReason: "Truyền lửa hưng phấn và khen ngợi nồng nhiệt cho cuộc diễn xướng (hành Hỏa).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/trong-chau.png",
  },
  {
    id: "dan-ty-ba",
    slug: "dan-ty-ba",
    name: "Đàn tỳ bà",
    nameGlossEn: "pear lute",
    element: "hoa",
    elementName: "Hỏa",
    tone: "Chủy",
    toneVietnamese: "Chủy",
    noteName: "G4",
    noteFrequency: "392.0 Hz",
    elementColor: "#D23A22",
    textColor: "#FFFFFF",
    summaryVerbatim: "Đàn dây gảy hình quả lê, bốn dây.",
    description: "Cây đàn quý phái có lịch sử lâu đời, đóng vai trò trụ cột trong nhã nhạc cung đình Huế và các ban hòa nhạc thính phòng cổ điển.",
    structure: "Thân đàn bằng gỗ hình nửa quả lê bổ dọc, mặt đàn phẳng, cần đàn gắn các phím bấm và mắc 4 dây tơ hoặc nilon.",
    playMethod: "Dùng móng gảy trên tay phải tỉa, vê dây liên hồi, tay trái nhấn phím luyến láy điêu luyện.",
    timbre: "Trong trẻo, tươi sáng, biến hóa linh hoạt từ dịu êm đến cuồn cuộn mãnh liệt.",
    elementReason: "Kỹ thuật vê dây dồn dập rực rỡ như những đợt sóng lửa bập bùng (hành Hỏa).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-ty-ba.png",
  },

  // ===================== THỦY (VŨ) =====================
  {
    id: "dan-bau",
    slug: "dan-bau",
    name: "Đàn bầu",
    nameGlossEn: "monochord",
    element: "thuy",
    elementName: "Thủy",
    tone: "Vũ",
    toneVietnamese: "Vũ",
    noteName: "A4",
    noteFrequency: "440.0 Hz",
    elementColor: "#1F3F7E",
    textColor: "#FFFFFF",
    summaryVerbatim: "Đàn một dây, uốn cần để luyến láy.",
    description: "Độc huyền cầm độc nhất vô nhị của dân tộc Việt Nam, chỉ có một dây duy nhất nhưng diễn tả trọn vẹn mọi cung bậc hỷ nộ ái ố của tâm hồn.",
    structure: "Hộp cộng hưởng dài bằng gỗ, một đầu có cọc căng dây, đầu kia có vòi đàn (cần đàn mềm dẻo) xuyên qua quả bầu khô.",
    playMethod: "Tay phải cầm que gảy nhẹ tạo nốt bồi âm ở các điểm chia dây, đồng thời tay trái uốn cần đàn để luyến láy cao độ mượt mà.",
    timbre: "Ngân nga, uyển chuyển, nghẹn ngào và lay động lòng người như tiếng ru của mẹ.",
    elementReason: "Âm thanh uốn lượn liên tục không ngắt quãng, mềm mại và uyển chuyển như dòng nước chảy (hành Thủy).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-bau.png",
  },
  {
    id: "dan-tranh",
    slug: "dan-tranh",
    name: "Đàn tranh",
    nameGlossEn: "zither",
    element: "thuy",
    elementName: "Thủy",
    tone: "Vũ",
    toneVietnamese: "Vũ",
    noteName: "A4",
    noteFrequency: "440.0 Hz",
    elementColor: "#1F3F7E",
    textColor: "#FFFFFF",
    summaryVerbatim: "Thường 16 dây, mỗi dây một con nhạn.",
    description: "Cây đàn dây thanh nhã phổ biến khắp ba miền, có mặt trong đờn ca tài tử Nam Bộ, nhã nhạc cung đình và âm nhạc thính phòng truyền thống.",
    structure: "Thân đàn bằng gỗ ngô đồng uốn cong hình vòm, trên mặt đàn gắn các con nhạn di động đỡ từng dây đàn (thường 16 hoặc 17, 19 dây).",
    playMethod: "Tay phải đeo móng gảy bấm dây tạo giai điệu, tay trái nhấn nhá trên đoạn dây phía sau nhạn để rung, mổ, vỗ nốt.",
    timbre: "Trong trẻo, lanh lảnh, róc rách như dòng suối trong luồn qua khe đá.",
    elementReason: "Giai điệu rải chuỗi (arpeggio) mượt mà như những con sóng nước lăn tăn vỗ bờ (hành Thủy).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-tranh.png",
  },
  {
    id: "dan-nhi",
    slug: "dan-nhi",
    name: "Đàn nhị",
    nameGlossEn: "two-string fiddle",
    element: "thuy",
    elementName: "Thủy",
    tone: "Vũ",
    toneVietnamese: "Vũ",
    noteName: "A4",
    noteFrequency: "440.0 Hz",
    elementColor: "#1F3F7E",
    textColor: "#FFFFFF",
    summaryVerbatim: "Đàn cò, hai dây, kéo bằng vĩ.",
    description: "Nhạc cụ dây kéo quen thuộc còn gọi là đàn cò, giữ vai trò dẫn dắt linh hồn giai điệu trong chèo, tuồng, cải lương và nhã nhạc.",
    structure: "Ống cộng hưởng bịt da trăn hoặc da kỳ đà, cần đàn thẳng bằng gỗ cứng, căng 2 dây tơ hoặc kim loại; vĩ đàn luồn giữa hai dây.",
    playMethod: "Tay phải cầm vĩ miết đẩy qua lại giữa hai dây, tay trái bấm vuốt nhẹ trên cần đàn để biến hóa cao độ liên tục.",
    timbre: "Da diết, nức nở, réo rắt và sâu lắng tựa dòng nước mắt tri âm.",
    elementReason: "Cung vĩ lượn sóng liên hồi không gián đoạn, mang đặc tính dạt dào và biến chuyển của nước (hành Thủy).",
    copiesInDeck: 3,
    status: "Bản nháp",
    imageUrl: "/images/cards/dan-nhi.png",
  },
];

/** Ảnh thật của nhạc cụ trong public/images/cards — null nếu chưa có ảnh */
export function getInstrumentPhoto(id: string): string | null {
  return INSTRUMENTS.find((item) => item.id === id)?.imageUrl ?? null;
}

export function getInstrument(slug: string): Instrument | undefined {
  return INSTRUMENTS.find((item) => item.slug === slug);
}

export function relatedInstruments(slug: string): Instrument[] {
  const current = getInstrument(slug);
  if (!current) return [];
  const sameFamily = INSTRUMENTS.filter(
    (item) => item.element === current.element && item.slug !== slug,
  );
  const shengFamily = INSTRUMENTS.filter((item) => item.element === SHENG_NEXT[current.element]);
  const keFamily = INSTRUMENTS.filter((item) => item.element === KE_NEXT[current.element]);
  const extra = [shengFamily[0], keFamily[0]].filter(
    (item): item is Instrument => Boolean(item),
  );
  return [...sameFamily, ...extra];
}

export function isShengAdjacent(a: ElementType, b: ElementType): boolean {
  return SHENG_NEXT[a] === b;
}

