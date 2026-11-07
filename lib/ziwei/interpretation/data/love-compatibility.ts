import type { MajorStarId, MutagenType, PalaceId } from '../../types/enums';

/** Khóa cặp chính tinh, sắp xếp lexicographic theo id: `a|b`. */
export type MajorStarPairKey = `${MajorStarId}|${MajorStarId}`;

/** Ngữ cảnh của ba cung tam phương đi kèm cung Phu Thê. */
export const PHU_THE_SUPPORT_CONTEXT: Readonly<Partial<Record<PalaceId, string>>> = {
  phucDuc: 'nền phúc, nếp sống gia đình và cảm giác an yên',
  quanLoc: 'công việc, trách nhiệm và cách chia sẻ gánh nặng',
  thienDi: 'cách hai người bước ra xã hội, bạn bè và môi trường sống',
};

/** Ý nghĩa của Tứ Hóa trong bối cảnh hôn nhân. */
export const MUTAGEN_LOVE_MEANINGS: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'may mắn, niềm vui và sự hỗ trợ về vật chất/tình cảm',
  hoaQuyen: 'ý muốn chủ động, dễ thành kiểm soát; cần chia sẻ quyết định',
  hoaKhoa: 'lời nói, danh tiếng và cách dùng lý trí; cần mềm mỏng',
  hoaKy: 'dễ hiểu lầm, khó nói ra; cần giữ lời và lắng nghe',
};

/** Ý nghĩa chung khi cung Phu Thê có Tuần hoặc Triệt. */
export const TUAN_TRIET_LOVE_MEANING =
  'một số mặt của hôn nhân đến chậm hoặc cần thời gian mới rõ; không phải điều xấu tuyệt đối.';

/** Ghi chú tình cảm cho cặp chính tinh cùng nằm trong cung Phu Thê. */
export const PHU_THE_PAIR_LOVE_NOTES: Readonly<
  Partial<Record<MajorStarPairKey, string>>
> = {
  'cuMon|thienCo':
    'lý trí + lời nói, dễ trao đổi nhưng dễ tranh luận; giữ thiện chí, đừng biến thành thắng thua.',
  'thaiAm|thienCo':
    'lý trí + cảm xúc, bổ khuyết nếu lắng nghe; tránh một bên phân tích quá nhiều, một bên thu mình.',
  'thienCo|thienLuong':
    'hiểu biết + che chở, dễ nương tựa; tránh lý sự quá mức.',
  'thaiAm|thienDong':
    'dịu dàng, an nhàn, giàu cảm xúc; cần người chủ động và nói rõ nhu cầu.',
  'thienPhu|tuVi':
    'ổn định, coi trọng gia đình, có khả năng vun đắp; tránh bảo thủ.',
  'thatSat|tuVi':
    'mạnh mẽ, quyết đoán, dễ áp đặt; cần nhường nhịn và chia sẻ quyền quyết định.',
  'phaQuan|tuVi':
    'nhiều thay đổi, thích phá cách; cần không gian riêng và thống nhất ranh giới.',
  'thamLang|tuVi':
    'sức hút, nhiều ham muốn, thích trải nghiệm; cần chung thủy và tiết chế.',
  'thamLang|vuKhuc':
    'thực tế + ham muốn, hấp dẫn nhưng dễ lệch nhịp; cần cân bằng công việc và tình cảm.',
  'liemTrinh|thatSat':
    'nguyên tắc + mạnh mẽ, dễ xung đột; cần mềm mỏng và tránh gay gắt.',
  'cuMon|thaiDuong':
    'tự tin + lời nói, dễ va chạm quan điểm; cần tôn trọng và lắng nghe.',
  'cuMon|thienDong':
    'dễ chịu + lời nói, cần giữ hòa khí, tránh cãi vã vặt.',
  'thaiAm|thaiDuong':
    'âm dương bổ trợ, dễ cân bằng nếu không cực đoan; cần chia sẻ cảm xúc.',
  'thienPhu|thienTuong':
    'điềm tĩnh + dung hòa, nền tảng ổn định; cần tránh thiếu quyết đoán.',
};
