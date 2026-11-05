import type { ZiweiChart, Palace, Period } from '../types';

/** Mức độ vận hạn. */
export type FortuneLevel = 'tốt' | 'xấu' | 'ổn định';

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
  /** Mức độ vận hạn. */
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
 * Tính danh sách đại hạn (10 năm) từ các chu kỳ đã có trong lá số.
 *
 * @param chart - Lá số Tử Vi.
 * @param currentAge - Tuổi hiện tại của đương số.
 * @param birthYear - Năm sinh dương lịch.
 * @returns Tối đa 8 đại hạn, sắp xếp theo tuổi tăng dần.
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
    .sort((a, b) => a.startAge - b.startAge)
    .slice(0, 8);

  return daiHanPeriods.map((period) => {
    const palace = chart.palaces.find((candidate) => candidate.branch === period.palaceBranch);
    if (!palace) {
      return createDefaultDecade(period, currentAge, birthYear);
    }

    const ageStart = period.startAge;
    const ageEnd = period.endAge;
    const isCurrent = currentAge >= ageStart && currentAge <= ageEnd;
    const fortune = calculateFortuneLevel(palace);

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
      `Đại hạn ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là giai đoạn XẤU, nhiều tai nạn, bệnh tật, có thể gặp cảnh phá sản, chia ly. ' +
      'Cần đặc biệt cẩn trọng, tránh đầu tư mạo hiểm, giữ gìn sức khỏe. ' +
      'Nếu không cẩn thận, có thể gặp đại nạn.'
    );
  }

  if (fortune === 'tốt') {
    return (
      `Đại hạn ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
      'Đây là giai đoạn TỐT, nhiều may mắn, tài lộc dồi dào, sự nghiệp thăng tiến. ' +
      'Nên mạnh dạn đầu tư, nắm bắt cơ hội. ' +
      'Có thể gặp quý nhân phù trợ, thành công lớn.'
    );
  }

  return (
    `Đại hạn ${ageStart}-${ageEnd} tuổi, cung ${palace.name} với chính tinh ${majorStars}. ` +
    'Đây là giai đoạn ỔN ĐỊNH, có thăng có trầm. ' +
    'Cần cân bằng, không nên quá mạo hiểm.'
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
        return `Sự nghiệp nhiều thách thức, có thể bị sa thải, giáng chức. ${majorStars.includes('Kình Dương') ? 'Cẩn trọng tranh chấp kiện tụng với đồng nghiệp, có thể bị tiểu nhân hãm hại.' : ''} Nên giữ vững, tránh thay đổi lớn.`;
      }
      return `Sự nghiệp ổn định, có thăng có trầm. Nên cân bằng, không nên quá mạo hiểm.`;

    case 'wealth':
      if (fortune === 'tốt') {
        return `Tài lộc vững, có khoản thu bất ngờ. ${majorStars.includes('Lộc Tồn') ? 'Đặc biệt may mắn về tiền bạc.' : ''} Có thể đầu tư.`;
      }
      if (fortune === 'xấu') {
        return `Tài lộc bấp bênh, có thể phá sản, mất tiền lớn. ${majorStars.includes('Địa Không') ? 'Tuyệt đối tránh đầu tư mạo hiểm.' : ''} Nên giữ tiền mặt.`;
      }
      return `Tài lộc trung bình, thu nhập ổn định. Không nên đầu tư quá nhiều.`;

    case 'love':
      if (fortune === 'tốt') {
        return `Tình cảm thuận lợi. ${majorStars.includes('Hồng Loan') ? 'Có hỷ sự, kết hôn.' : ''} Mối quan hệ vững bền.`;
      }
      if (fortune === 'xấu') {
        return `Tình cảm nhiều trắc trở, dễ gặp cảnh chia ly, cô độc. ${majorStars.includes('Đào Hoa') ? 'Cẩn trọng người thứ ba.' : ''} Cần thấu hiểu nhau.`;
      }
      return `Tình cảm ổn định, cần dành thời gian cho nhau.`;

    case 'health':
      if (fortune === 'tốt') {
        return `Sức khỏe tốt, tinh thần minh mẫn. Nên duy trì lối sống lành mạnh.`;
      }
      if (fortune === 'xấu') {
        return `Có thể gặp bệnh nặng, cần phòng ngừa. ${majorStars.includes('Hỏa Tinh') ? 'Cẩn trọng tai nạn bất ngờ.' : ''} Nên khám sức khỏe định kỳ.`;
      }
      return `Sức khỏe trung bình, cần chú ý nghỉ ngơi.`;

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
    fortune: 'ổn định',
    isCurrent: currentAge >= startAge && currentAge <= endAge,
    summary: 'Đại hạn ổn định, cần cân bằng.',
    aspects: {
      career: 'Sự nghiệp ổn định.',
      wealth: 'Tài lộc trung bình.',
      love: 'Tình cảm ổn định.',
      health: 'Sức khỏe trung bình.',
    },
  };
}
