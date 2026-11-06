import type { ZiweiChart, Palace, Period } from '../types';
import {
  calculatePalaceBaseScore,
  calculatePalaceComprehensiveScore,
  fortuneLevelFromScore,
  getFortuneRating,
} from './fortune-score';
import type { FortuneLevel, FortuneRating } from './fortune-score';

export { fortuneLevelFromScore };
export type { FortuneLevel, FortuneRating };

/** Đại hạn (chu kỳ 10 năm) của lá số. */
export interface DecadeFortune {
  /** Khoảng tuổi dạng "20-29". */
  decade: string;
  /** Khoảng tuổi [bắt đầu, kết thúc]. */
  ageRange: [number, number];
  /** Khoảng năm dương lịch tương ứng. */
  yearRange: [number, number];
  /** Mã cung của đại hạn. */
  palaceId: string;
  /** Tên cung của đại hạn. */
  palaceName: string;
  /** Tên các chính tinh trong cung. */
  majorStars: string[];
  /** Tên các phụ tinh trong cung. */
  minorStars: string[];
  /** Điểm tổng quan của cung đại hạn (1-5). */
  score: number;
  /** Mức độ vận hạn 5 cấp, suy ra từ score. */
  rating: FortuneRating;
  /** Mức độ vận hạn 3 cấp, suy ra từ score. */
  fortune: FortuneLevel;
  /** Đại hạn đang diễn ra tại tuổi hiện tại. */
  isCurrent: boolean;
  /** Tóm tắt 3-4 câu. */
  summary: string;
  /** Lời khuyên theo từng khía cạnh. */
  aspects: {
    career: string;
    wealth: string;
    love: string;
    health: string;
  };
}

/**
 * Quy đổi một cung thành điểm tổng quan (1-5).
 *
 * Dùng chung mô hình chuẩn hóa với Khái quát lá số và lưu niên để điểm
 * không thể đảo ngược giữa các màn hình: một chính tinh Miếu cho 5,
 * Đắc cho 4, Hãm cho 1. Đây là heuristic minh bạch, không phải công
 * thức số học chính thống của Tử Vi.
 */
export function calculatePalaceScore(palace: Palace): number {
  return calculatePalaceBaseScore(palace);
}

/**
 * Tính danh sách đại hạn (10 năm) từ các chu kỳ đã có trong lá số.
 *
 * @param chart - Lá số Tử Vi.
 * @param currentAge - Tuổi hiện tại của đương số.
 * @param birthYear - Năm sinh dương lịch.
 * @returns Tất cả đại hạn hợp lệ, sắp xếp theo tuổi tăng dần.
 */
export function calculateDecadeFortune(
  chart: ZiweiChart,
  currentAge: number,
  birthYear: number
): DecadeFortune[] {
  const daiHanPeriods = chart.periods
    .filter(
      (period): period is Period & { startAge: number; endAge: number } =>
        period.type === 'daiHan' &&
        typeof period.startAge === 'number' &&
        typeof period.endAge === 'number'
    )
    .sort((a, b) => a.startAge - b.startAge);

  return daiHanPeriods.map((period) => {
    const palace = chart.palaces.find((candidate) => candidate.branch === period.palaceBranch);
    if (!palace) {
      return createDefaultDecade(period, currentAge, birthYear);
    }

    const ageStart = period.startAge;
    const ageEnd = period.endAge;
    const isCurrent = currentAge >= ageStart && currentAge <= ageEnd;
    const score = calculatePalaceComprehensiveScore(chart, palace);
    const rating = getFortuneRating(score);
    const fortune = fortuneLevelFromScore(score);

    return {
      decade: `${ageStart}-${ageEnd}`,
      ageRange: [ageStart, ageEnd],
      yearRange: [birthYear + ageStart, birthYear + ageEnd],
      palaceId: palace.id,
      palaceName: palace.name,
      majorStars: palace.majorStars.map((star) => star.name),
      minorStars: [
        ...palace.auspiciousStars,
        ...palace.maleficStars,
        ...palace.otherStars,
      ].map((star) => star.name),
      score,
      rating,
      fortune,
      isCurrent,
      summary: generateDecadeSummary(palace, ageStart, ageEnd, fortune),
      aspects: {
        career: generateAspectAdvice(palace, 'career', fortune),
        wealth: generateAspectAdvice(palace, 'wealth', fortune),
        love: generateAspectAdvice(palace, 'love', fortune),
        health: generateAspectAdvice(palace, 'health', fortune),
      },
    };
  });
}

/**
 * Tạo tóm tắt cho một đại hạn.
 */
function generateDecadeSummary(
  palace: Palace,
  ageStart: number,
  ageEnd: number,
  fortune: FortuneLevel
): string {
  const majorStars = palace.majorStars.map((star) => star.name).join(', ') || 'Vô Chính Diệu';

  if (fortune === 'xấu') {
    return (
      `Đại vận ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là giai đoạn cần đặc biệt thận trọng: có nguy cơ tai nạn, bệnh tật, thất thoát tài chính hoặc chia ly. ' +
      'Nên giữ tâm bình ổn, tránh đầu tư mạo hiểm và chăm sóc sức khỏe chu đáo. ' +
      'Kiên trì và tiết chế sẽ giúp giảm bớt nghịch cảnh.'
    );
  }

  if (fortune === 'tốt') {
    return (
      `Đại vận ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là giai đoạn thuận lợi: vận khí hanh thông, tài lộc và sự nghiệp có nhiều thuận lợi. ' +
      'Nên nắm bắt cơ hội, đồng thời giữ sự cân bằng trong công việc và đời sống. ' +
      'Quý nhân có thể xuất hiện, giúp thành quả thêm vững chắc.'
    );
  }

  return (
    `Đại vận ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
    'Đây là giai đoạn ổn định, có thăng có trầm. ' +
    'Nên giữ nhịp độ ổn định, tránh mạo hiểm quá mức.'
  );
}

/**
 * Tạo lời khuyên cho một khía cạnh trong đại hạn.
 */
function generateAspectAdvice(
  palace: Palace,
  aspect: string,
  fortune: FortuneLevel
): string {
  const majorStars = palace.majorStars.map((star) => star.name);

  switch (aspect) {
    case 'career':
      if (fortune === 'tốt') {
        return `Sự nghiệp thăng tiến, có cơ hội mới. ${majorStars.includes('Tử Vi') ? 'Phù hợp với vai trò lãnh đạo.' : ''} Nên nắm bắt cơ hội.`;
      }
      if (fortune === 'xấu') {
        return `Sự nghiệp có thử thách, công việc có thể biến động. ${majorStars.includes('Kình Dương') ? 'Cẩn trọng tranh chấp với đồng nghiệp và giữ hòa khí trong công việc.' : ''} Nên giữ vững chuyên môn, tránh thay đổi lớn khi chưa chuẩn bị.`;
      }
      return `Sự nghiệp ổn định, có thăng có trầm. Nên giữ cân bằng, tránh mạo hiểm quá mức.`;

    case 'wealth':
      if (fortune === 'tốt') {
        return `Tài lộc vững, có thể có khoản thu bất ngờ. ${majorStars.includes('Lộc Tồn') ? 'Đặc biệt thuận lợi về tiền bạc.' : ''} Có thể cân nhắc đầu tư trong khả năng.`;
      }
      if (fortune === 'xấu') {
        return `Tài lộc cần thận trọng, tránh đầu tư mạo hiểm. ${majorStars.includes('Địa Không') ? 'Nên giữ khoản dự phòng và tránh các cam kết tài chính lớn.' : ''} Nên giữ tiền mặt và chi tiêu có kế hoạch.`;
      }
      return `Tài lộc ổn định, thu nhập ổn định. Không nên đầu tư quá nhiều.`;

    case 'love':
      if (fortune === 'tốt') {
        return `Tình cảm thuận lợi. ${majorStars.includes('Hồng Loan') ? 'Có hỷ sự, có thể tính chuyện kết hôn.' : ''} Mối quan hệ vững bền.`;
      }
      if (fortune === 'xấu') {
        return `Tình cảm có thể gặp hiểu lầm, cần lắng nghe và nhường nhịn để giữ hòa khí. ${majorStars.includes('Đào Hoa') ? 'Cần giữ chừng mực với người khác giới.' : ''} Sự chân thành sẽ giúp hàn gắn.`;
      }
      return `Tình cảm ổn định, cần dành thời gian cho nhau.`;

    case 'health':
      if (fortune === 'tốt') {
        return `Sức khỏe ổn định, tinh thần minh mẫn. Nên duy trì lối sống lành mạnh.`;
      }
      if (fortune === 'xấu') {
        return `Sức khỏe cần chú ý, nên khám định kỳ và giữ lối sống điều độ. ${majorStars.includes('Hỏa Tinh') ? 'Cẩn trọng rủi ro bất ngờ khi đi lại.' : ''}`;
      }
      return `Sức khỏe ổn định, cần chú ý nghỉ ngơi.`;

    default:
      return '';
  }
}

/**
 * Tạo đại hạn mặc định khi không tìm thấy cung tương ứng.
 */
function createDefaultDecade(
  period: Pick<Period, 'startAge' | 'endAge'> & { startAge: number; endAge: number },
  currentAge: number,
  birthYear: number
): DecadeFortune {
  const { startAge, endAge } = period;

  return {
    decade: `${startAge}-${endAge}`,
    ageRange: [startAge, endAge],
    yearRange: [birthYear + startAge, birthYear + endAge],
    palaceId: 'unknown',
    palaceName: 'Không xác định',
    majorStars: [],
    minorStars: [],
    score: 3,
    rating: 'onDinh',
    fortune: 'ổn định',
    isCurrent: currentAge >= startAge && currentAge <= endAge,
    summary: 'Đại vận ổn định, cần giữ cân bằng.',
    aspects: {
      career: 'Sự nghiệp ổn định.',
      wealth: 'Tài lộc ổn định.',
      love: 'Tình cảm ổn định.',
      health: 'Sức khỏe ổn định.',
    },
  };
}
