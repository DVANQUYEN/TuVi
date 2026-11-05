import type { ZiweiChart, Palace, EarthlyBranch } from '../types';
import { EARTHLY_BRANCHES } from '../types';
import type { FortuneLevel } from './decade-fortune';

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
  /** Mức độ vận hạn. */
  fortune: FortuneLevel;
  /** Điểm tổng quan (1-5). */
  score: number;
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
 * @param chart - Lá số Tử Vi.
 * @param year - Năm dương lịch cần xem.
 * @param _birthYear - Năm sinh dương lịch (giữ cho tương thích API).
 * @returns Vận hạn lưu niên của năm.
 */
export function calculateYearlyFortune(
  chart: ZiweiChart,
  year: number,
  _birthYear: number
): YearlyFortune {
  const zodiac = getChineseZodiac(year);
  const yearBranch = getYearBranch(year);

  const palace =
    chart.palaces.find((candidate) => candidate.branch === yearBranch) ?? chart.palaces[0];

  const fortune = calculateFortuneLevel(palace);
  const score = calculateFortuneScore(palace);

  return {
    year,
    zodiac,
    palaceId: palace.id,
    palaceName: palace.name,
    fortune,
    score,
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
 * Xác định mức độ vận hạn từ độ sáng các chính tinh trong cung.
 */
function calculateFortuneLevel(palace: Palace): FortuneLevel {
  const majorStars = palace.majorStars;
  if (majorStars.length === 0) return 'ổn định';

  const brightnessScore = majorStars.reduce((score, star) => {
    switch (star.brightness) {
      case 'mieu':
        return score + 3;
      case 'vuong':
        return score + 2;
      case 'dac':
        return score + 1;
      case 'binh':
        return score + 0;
      case 'ham':
        return score - 2;
      default:
        return score;
    }
  }, 0);

  if (brightnessScore >= 4) return 'tốt';
  if (brightnessScore <= -2) return 'xấu';
  return 'ổn định';
}

/**
 * Quy đổi độ sáng chính tinh thành điểm tổng quan (1-5).
 */
function calculateFortuneScore(palace: Palace): number {
  const majorStars = palace.majorStars;
  if (majorStars.length === 0) return 3;

  const score = majorStars.reduce((sum, star) => {
    switch (star.brightness) {
      case 'mieu':
        return sum + 2;
      case 'vuong':
        return sum + 1.5;
      case 'dac':
        return sum + 1;
      case 'binh':
        return sum + 0.5;
      case 'ham':
        return sum - 1;
      default:
        return sum;
    }
  }, 0);

  return Math.max(1, Math.min(5, Math.round(score)));
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
      'Đây là năm XẤU, có thể gặp tai nạn, bệnh tật, mất tiền, hoặc cảnh chia ly. ' +
      'Cần đặc biệt cẩn trọng trong mọi quyết định. ' +
      'Tránh đầu tư mạo hiểm, tránh đi xa, giữ gìn sức khỏe.'
    );
  }

  if (fortune === 'tốt') {
    return (
      `Năm ${year} (${zodiac}), cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là năm TỐT, nhiều may mắn, tài lộc dồi dào. ' +
      'Nên mạnh dạn hành động, nắm bắt cơ hội. ' +
      'Có thể gặp quý nhân phù trợ, thành công lớn.'
    );
  }

  return (
    `Năm ${year} (${zodiac}), cung ${palace.name} với chính tinh ${majorStars}. ` +
    'Đây là năm ỔN ĐỊNH, có thăng có trầm. ' +
    'Cần cân bằng, không nên quá mạo hiểm.'
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
        return `Sự nghiệp nhiều thách thức, có thể bị sa thải, giáng chức. Nên giữ vững, tránh thay đổi lớn.`;
      }
      return `Sự nghiệp ổn định, có thăng có trầm. Nên cân bằng.`;

    case 'wealth':
      if (fortune === 'tốt') {
        return `Tài lộc vững, có khoản thu bất ngờ. Có thể đầu tư.`;
      }
      if (fortune === 'xấu') {
        return `Tài lộc bấp bênh, có thể phá sản, mất tiền lớn. Nên giữ tiền mặt.`;
      }
      return `Tài lộc trung bình, thu nhập ổn định.`;

    case 'love':
      if (fortune === 'tốt') {
        return `Tình cảm thuận lợi. ${majorStars.includes('Hồng Loan') ? 'Có hỷ sự.' : ''} Mối quan hệ vững bền.`;
      }
      if (fortune === 'xấu') {
        return `Tình cảm nhiều trắc trở, dễ gặp cảnh chia ly, cô độc. Cần thấu hiểu nhau.`;
      }
      return `Tình cảm ổn định, cần dành thời gian cho nhau.`;

    case 'health':
      if (fortune === 'tốt') {
        return `Sức khỏe tốt, tinh thần minh mẫn. Nên duy trì lối sống lành mạnh.`;
      }
      if (fortune === 'xấu') {
        return `Có thể gặp bệnh nặng, cần phòng ngừa. Nên khám sức khỏe định kỳ.`;
      }
      return `Sức khỏe trung bình, cần chú ý nghỉ ngơi.`;

    default:
      return '';
  }
}

/**
 * Tạo lời khuyên chung cho năm.
 */
function generateYearlyAdvice(fortune: FortuneLevel): string {
  if (fortune === 'tốt') {
    return 'Tận dụng cơ hội, mạnh dạn hành động. Giữ vững tinh thần lạc quan.';
  }
  if (fortune === 'xấu') {
    return 'Có thể gặp đại nạn, cần đặc biệt cẩn trọng. Tránh rủi ro, giữ gìn sức khỏe.';
  }
  return 'Cân bằng, không nên quá mạo hiểm. Giữ vững tinh thần.';
}
