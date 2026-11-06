import type { ZiweiChart, Palace, EarthlyBranch } from '../types';
import { EARTHLY_BRANCHES } from '../types';
import {
  calculatePalaceComprehensiveScore,
  fortuneLevelFromScore,
  getFortuneRating,
} from './fortune-score';
import type { FortuneLevel, FortuneRating } from './fortune-score';

/** Vận hạn lưu niên của một năm. */
export interface YearlyFortune {
  /** Năm dương lịch. */
  year: number;
  /** Can chi hiển thị, ví dụ "Bính Ngọ". */
  zodiac: string;
  /** Mã cung lưu niên. */
  palaceId: string;
  /** Tên cung lưu niên. */
  palaceName: string;
  /** Mức độ vận hạn 3 cấp. */
  fortune: FortuneLevel;
  /** Mức độ vận hạn 5 cấp. */
  rating: FortuneRating;
  /** Điểm tổng quan (1-5). */
  score: number;
  /** Điểm cung đại hạn đang chi phối năm (1-5), nếu có. */
  decadeScore?: number;
  /** Tóm tắt vận hạn. */
  summary: string;
  /** Lời khuyên theo từng khía cạnh. */
  aspects: {
    career: string;
    wealth: string;
    love: string;
    health: string;
  };
  /** Lời khuyên chung. */
  advice: string;
}

const HEAVENLY_STEMS_LABELS = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
] as const;

const EARTHLY_BRANCH_LABELS = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const;

/**
 * Tính vận hạn lưu niên cho một năm.
 *
 * Tiểu vận chịu ảnh hưởng của đại vận đang chi phối: điểm năm =
 * 65% điểm cung đại hạn + 35% điểm cung lưu niên. Tỉ trọng này giữ
 * đại vận làm nền nhưng vẫn để từng năm có dao động riêng, tránh việc
 * mọi năm trong cùng một đại vận cho ra cùng một nhãn.
 *
 * @param chart - Lá số Tử Vi.
 * @param year - Năm dương lịch cần xem.
 * @param birthYear - Năm sinh dương lịch, dùng để xác định đại vận theo tuổi.
 * @returns Vận hạn lưu niên của năm.
 */
export function calculateYearlyFortune(
  chart: ZiweiChart,
  year: number,
  birthYear: number
): YearlyFortune {
  const zodiac = getChineseZodiac(year);
  const yearBranch = getYearBranch(year);

  const palace =
    chart.palaces.find((candidate) => candidate.branch === yearBranch) ?? chart.palaces[0];

  const yearPalaceScore = calculatePalaceComprehensiveScore(chart, palace);
  const decadeScore = findDecadeScore(chart, year - birthYear);
  const score =
    decadeScore === undefined
      ? yearPalaceScore
      : Math.max(
          1,
          Math.min(5, Math.round((0.65 * decadeScore + 0.35 * yearPalaceScore) * 10) / 10)
        );
  const rating = getFortuneRating(score);
  const fortune = fortuneLevelFromScore(score);

  return {
    year,
    zodiac,
    palaceId: palace.id,
    palaceName: palace.name,
    fortune,
    rating,
    score,
    decadeScore,
    summary: generateYearlySummary(palace, year, zodiac, fortune),
    aspects: {
      career: generateAspectAdvice(palace, 'career', fortune),
      wealth: generateAspectAdvice(palace, 'wealth', fortune),
      love: generateAspectAdvice(palace, 'love', fortune),
      health: generateAspectAdvice(palace, 'health', fortune),
    },
    advice: generateYearlyAdvice(fortune),
  };
}

/**
 * Tìm điểm cung đại hạn đang chi phối độ tuổi cho trước.
 */
function findDecadeScore(chart: ZiweiChart, age: number): number | undefined {
  const period = chart.periods.find(
    (candidate) =>
      candidate.type === 'daiHan' &&
      typeof candidate.startAge === 'number' &&
      typeof candidate.endAge === 'number' &&
      age >= candidate.startAge &&
      age <= candidate.endAge
  );
  if (!period) return undefined;

  const palace = chart.palaces.find((candidate) => candidate.branch === period.palaceBranch);
  return palace ? calculatePalaceComprehensiveScore(chart, palace) : undefined;
}

/**
 * Lấy can chi hiển thị của một năm dương lịch.
 */
function getChineseZodiac(year: number): string {
  const stemIndex = (((year - 4) % 10) + 10) % 10;
  const branchIndex = (((year - 4) % 12) + 12) % 12;

  return `${HEAVENLY_STEMS_LABELS[stemIndex]} ${EARTHLY_BRANCH_LABELS[branchIndex]}`;
}

/**
 * Lấy địa chi của năm dương lịch theo mã enum.
 */
function getYearBranch(year: number): EarthlyBranch {
  const branchIndex = (((year - 4) % 12) + 12) % 12;
  return EARTHLY_BRANCHES[branchIndex];
}

/**
 * Tạo tóm tắt vận hạn năm.
 */
function generateYearlySummary(
  palace: Palace,
  year: number,
  zodiac: string,
  fortune: FortuneLevel
): string {
  const majorStars = palace.majorStars.map((star) => star.name).join(', ') || 'Vô Chính Diệu';

  if (fortune === 'xấu') {
    return (
      `Năm ${year} (${zodiac}), cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là năm cần đặc biệt thận trọng: có nguy cơ tai nạn, bệnh tật, mất tiền hoặc chia ly. ' +
      'Nên giữ tâm bình ổn, tránh đầu tư mạo hiểm và chăm sóc sức khỏe. ' +
      'Kiên trì và tiết chế sẽ giúp giảm bớt nghịch cảnh.'
    );
  }

  if (fortune === 'tốt') {
    return (
      `Năm ${year} (${zodiac}), cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là năm thuận lợi: vận khí hanh thông, tài lộc và sự nghiệp có nhiều thuận lợi. ' +
      'Nên nắm bắt cơ hội, đồng thời giữ sự cân bằng. ' +
      'Quý nhân có thể xuất hiện, giúp thành quả thêm vững chắc.'
    );
  }

  return (
    `Năm ${year} (${zodiac}), cung ${palace.name} với chính tinh ${majorStars}. ` +
    'Đây là năm ổn định, có thăng có trầm. ' +
    'Nên giữ nhịp độ ổn định, tránh mạo hiểm quá mức.'
  );
}

/**
 * Tạo lời khuyên cho một khía cạnh trong năm.
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
        return `Sự nghiệp thăng tiến, có cơ hội mới. ${majorStars.includes('Tử Vi') ? 'Phù hợp với vai trò lãnh đạo.' : ''} Nên nắm bắt.`;
      }
      if (fortune === 'xấu') {
        return `Sự nghiệp có thử thách, công việc có thể biến động. Nên giữ vững chuyên môn, tránh thay đổi lớn khi chưa chuẩn bị.`;
      }
      return `Sự nghiệp ổn định, có thăng có trầm. Nên giữ cân bằng.`;

    case 'wealth':
      if (fortune === 'tốt') {
        return `Tài lộc vững, có thể có khoản thu bất ngờ. Có thể cân nhắc đầu tư trong khả năng.`;
      }
      if (fortune === 'xấu') {
        return `Tài lộc cần thận trọng, tránh đầu tư mạo hiểm. Nên giữ tiền mặt và chi tiêu có kế hoạch.`;
      }
      return `Tài lộc ổn định, thu nhập ổn định.`;

    case 'love':
      if (fortune === 'tốt') {
        return `Tình cảm thuận lợi. ${majorStars.includes('Hồng Loan') ? 'Có hỷ sự.' : ''} Mối quan hệ vững bền.`;
      }
      if (fortune === 'xấu') {
        return `Tình cảm có thể gặp hiểu lầm, cần lắng nghe và nhường nhịn để giữ hòa khí.`;
      }
      return `Tình cảm ổn định, cần dành thời gian cho nhau.`;

    case 'health':
      if (fortune === 'tốt') {
        return `Sức khỏe ổn định, tinh thần minh mẫn. Nên duy trì lối sống lành mạnh.`;
      }
      if (fortune === 'xấu') {
        return `Sức khỏe cần chú ý, nên khám định kỳ và giữ lối sống điều độ.`;
      }
      return `Sức khỏe ổn định, cần chú ý nghỉ ngơi.`;

    default:
      return '';
  }
}

/**
 * Tạo lời khuyên chung cho năm.
 */
function generateYearlyAdvice(fortune: FortuneLevel): string {
  if (fortune === 'tốt') {
    return 'Tận dụng thời cơ, chủ động hành động nhưng vẫn giữ sự cân bằng. Giữ tinh thần lạc quan.';
  }
  if (fortune === 'xấu') {
    return 'Nên thận trọng, tránh rủi ro không cần thiết và giữ gìn sức khỏe. Kiên trì sẽ giúp vượt qua nghịch cảnh.';
  }
  return 'Giữ nhịp độ ổn định, tránh mạo hiểm quá mức. Giữ tâm bình ổn.';
}
