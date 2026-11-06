import type { Palace, ZiweiChart } from '../types';
import type { BrightnessLevel, MutagenType } from '../types/enums';
import { collectPalaceStars } from './star-utils';
import { getTamPhuong } from './palace-meanings';

/** Mức độ vận hạn 3 cấp (giữ tương thích với dữ liệu/UI cũ). */
export type FortuneLevel = 'tốt' | 'xấu' | 'ổn định';

/** Mức độ vận hạn 5 cấp, phản ánh sắc thái chi tiết hơn. */
export type FortuneRating = 'ratTot' | 'tot' | 'onDinh' | 'bienDong' | 'khoKhan';

/** Nhãn hiển thị cho thang đánh giá 5 cấp. */
export const FORTUNE_RATING_LABELS: Readonly<Record<FortuneRating, string>> = {
  ratTot: 'Rất thuận lợi',
  tot: 'Thuận lợi',
  onDinh: 'Ổn định',
  bienDong: 'Biến động',
  khoKhan: 'Khó khăn',
};

/**
 * Quy đổi độ sáng chính tinh sang thang điểm chuẩn hóa 1-5.
 * Đây là mô hình heuristic minh bạch, không phải công thức số học
 * chính thống của Tử Vi.
 */
export const BRIGHTNESS_FORTUNE_SCORE: Readonly<Record<BrightnessLevel, number>> = {
  mieu: 5,
  vuong: 4,
  dac: 4,
  binh: 3,
  ham: 1,
};

/** Điểm trung tính cho cung Vô Chính Diệu. */
const NEUTRAL_FORTUNE_SCORE = 3;

/** Điều chỉnh theo Tứ Hóa của sao trong cung. */
const MUTAGEN_FORTUNE_ADJUSTMENT: Readonly<Record<MutagenType, number>> = {
  hoaLoc: 0.4,
  hoaQuyen: 0.2,
  hoaKhoa: 0.2,
  hoaKy: -0.6,
};

/** Điểm cộng mỗi cát tinh và mức trần cộng. */
const AUSPICIOUS_STAR_BONUS = 0.1;
const AUSPICIOUS_STAR_BONUS_CAP = 0.4;

/** Điểm trừ mỗi hung tinh và mức trần trừ. */
const MALEFIC_STAR_PENALTY = -0.15;
const MALEFIC_STAR_PENALTY_CAP = -0.45;

/** Mức trừ của Tuần hoặc Triệt. */
const TUAN_TRIET_PENALTY = -0.3;

/** Tỉ trọng điểm bản cung và tam phương tứ chính. */
const OWN_PALACE_WEIGHT = 0.6;
const TAM_PHUONG_WEIGHT = 0.4;

/** Kẹp điểm trong khoảng 1-5 và làm tròn một chữ số thập phân. */
function normalizeScore(score: number): number {
  const clamped = Math.max(1, Math.min(5, score));
  return Math.round(clamped * 10) / 10;
}

/**
 * Tính điểm nền (1-5) cho một cung dựa trên chính cung đó.
 *
 * Cách tính:
 * - Không có cung hoặc Vô Chính Diệu: 3.
 * - Nền = trung bình độ sáng chính tinh (Miếu 5, Vượng/Đắc 4, Bình 3, Hãm 1).
 * - Cộng Tứ Hóa, trừ Tuần/Triệt, cộng cát tinh, trừ hung tinh.
 * - Làm tròn một chữ số thập phân rồi kẹp trong 1-5.
 *
 * Đây là heuristic minh bạch phục vụ hiển thị, không phải công thức
 * số học chính thống của Tử Vi.
 */
export function calculatePalaceBaseScore(palace?: Palace): number {
  if (!palace || palace.majorStars.length === 0) {
    return NEUTRAL_FORTUNE_SCORE;
  }

  const brightnessTotal = palace.majorStars.reduce(
    (sum, star) => sum + BRIGHTNESS_FORTUNE_SCORE[star.brightness ?? 'binh'],
    0
  );
  let score = brightnessTotal / palace.majorStars.length;

  for (const star of collectPalaceStars(palace)) {
    if (star.mutagen) {
      score += MUTAGEN_FORTUNE_ADJUSTMENT[star.mutagen];
    }
  }

  if (palace.hasTuan) score += TUAN_TRIET_PENALTY;
  if (palace.hasTriet) score += TUAN_TRIET_PENALTY;

  score += Math.min(
    palace.auspiciousStars.length * AUSPICIOUS_STAR_BONUS,
    AUSPICIOUS_STAR_BONUS_CAP
  );
  score += Math.max(
    palace.maleficStars.length * MALEFIC_STAR_PENALTY,
    MALEFIC_STAR_PENALTY_CAP
  );

  return normalizeScore(score);
}

/**
 * Tính điểm tổng hợp (1-5) cho một cung trong toàn cảnh lá số.
 *
 * Điểm này kết hợp:
 * - 60% điểm nền của bản cung (độ sáng chính tinh, Tứ Hóa, Tuần/Triệt,
 *   cát tinh/hung tinh).
 * - 40% trung bình điểm nền của ba cung tam phương tứ chính.
 *
 * Nhờ đó một cung không còn bị đánh giá chỉ bởi vài chính tinh tại chỗ mà
 * còn chịu ảnh hưởng của thế đứng toàn lá số. Nếu thiếu cung hoặc thiếu
 * cung liên quan, điểm quay về nền của bản cung.
 *
 * Đây là thang đánh giá tổng hợp phục vụ luận giải, không phải một công
 * thức số học duy nhất được coi là chính thống trong Tử Vi.
 */
export function calculatePalaceComprehensiveScore(
  chart: ZiweiChart,
  palace?: Palace
): number {
  const ownScore = calculatePalaceBaseScore(palace);
  if (!palace) return ownScore;

  const relatedPalaces = getTamPhuong(palace.id)
    .related.map((relatedId) => chart.palaces.find((candidate) => candidate.id === relatedId))
    .filter((related): related is Palace => related !== undefined);

  if (relatedPalaces.length === 0) return ownScore;

  const relatedAverage =
    relatedPalaces.reduce((sum, related) => sum + calculatePalaceBaseScore(related), 0) /
    relatedPalaces.length;

  return normalizeScore(
    ownScore * OWN_PALACE_WEIGHT + relatedAverage * TAM_PHUONG_WEIGHT
  );
}

/**
 * Tên cũ của điểm nền, giữ lại để không phá vỡ các nơi gọi chỉ có một cung.
 * Các màn hình cần đánh giá toàn cảnh nên dùng
 * `calculatePalaceComprehensiveScore`.
 */
export function calculatePalaceFortuneScore(palace?: Palace): number {
  return calculatePalaceBaseScore(palace);
}

/** Suy ra mức độ vận hạn 3 cấp từ điểm 1-5 (giữ tương thích). */
export function fortuneLevelFromScore(score: number): FortuneLevel {
  if (score >= 3.75) return 'tốt';
  if (score >= 2.75) return 'ổn định';
  return 'xấu';
}

/**
 * Suy ra mức độ vận hạn 5 cấp từ điểm 1-5.
 *
 * Thang này chỉ là quy ước hiển thị dựa trên thang điểm tổng hợp
 * (độ sáng, Tứ Hóa, Tuần/Triệt, phụ tinh, tam phương tứ chính), không
 * phải công thức số học chính thống của Tử Vi.
 */
export function getFortuneRating(score: number): FortuneRating {
  if (score >= 4.5) return 'ratTot';
  if (score >= 3.75) return 'tot';
  if (score >= 2.75) return 'onDinh';
  if (score >= 1.75) return 'bienDong';
  return 'khoKhan';
}
