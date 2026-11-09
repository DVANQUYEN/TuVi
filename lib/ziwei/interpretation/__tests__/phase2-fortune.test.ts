import { createElement } from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { createChartEngine } from '../../engine/sao-menh.engine';
import { calculateDecadeFortune } from '../decade-fortune';
import {
  BRIGHTNESS_FORTUNE_SCORE,
  FORTUNE_RATING_LABELS,
  calculatePalaceBaseScore,
  calculatePalaceComprehensiveScore,
  calculatePalaceFortuneScore,
  fortuneLevelFromScore,
  getFortuneRating,
} from '../fortune-score';
import { calculateYearlyFortune } from '../yearly-fortune';
import { generateTimeline } from '../timeline';
import { detectStarGroups, STAR_GROUPS } from '../star-groups';
import { ADVANCED_COMBINATIONS } from '../data/advanced-combinations';
import { ZiweiInterpreter } from '../interpreter';
import { ChartSummary } from '@/components/interpretation/ChartSummary';
import type { BrightnessLevel, Palace, Star, ZiweiChart } from '../../types';
import type { BirthInfo } from '../../types/input';

const BIRTH_YEAR = 1990;

const BIRTH_INFO: BirthInfo = {
  name: 'Phase 2 Test',
  gender: 'nam',
  calendarType: 'solar',
  year: BIRTH_YEAR,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
};

const chart = createChartEngine().generateChart(BIRTH_INFO);

// Mẫu thật: 18/7/2004 13:00, nam, dương lịch, Hà Nội.
const SAMPLE_BIRTH_YEAR = 2004;
const SAMPLE_BIRTH_INFO: BirthInfo = {
  name: 'Mẫu 18/7/2004',
  gender: 'nam',
  calendarType: 'solar',
  year: SAMPLE_BIRTH_YEAR,
  month: 7,
  day: 18,
  hour: 13,
  minute: 0,
  location: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

const sampleChart = createChartEngine().generateChart(SAMPLE_BIRTH_INFO);

/** Lá số tối thiểu chỉ gồm các cung, đủ cho các hàm tính điểm toàn cảnh. */
function makeChart(palaces: Palace[]): ZiweiChart {
  return { palaces } as unknown as ZiweiChart;
}

function makeMajorStar(
  id: string,
  name: string,
  brightness: BrightnessLevel = 'mieu'
): Star {
  return {
    id,
    name,
    category: 'major',
    element: 'kim',
    nature: 'cat',
    brightness,
  };
}

function makeSupportingStar(
  id: string,
  name: string,
  overrides: Partial<Star> = {}
): Star {
  return {
    id,
    name,
    category: 'phuTinh',
    element: 'kim',
    nature: 'cat',
    ...overrides,
  };
}

function makeStars(
  count: number,
  prefix: string,
  overrides: Partial<Star> = {}
): Star[] {
  return Array.from({ length: count }, (_, index) =>
    makeSupportingStar(`${prefix}${index}`, `${prefix} ${index}`, overrides)
  );
}

function makePalace(overrides: Partial<Palace> & Pick<Palace, 'id' | 'majorStars'>): Palace {
  return {
    index: 0,
    name: overrides.id,
    stem: 'giap',
    branch: 'ty',
    element: 'moc',
    isBodyPalace: false,
    isOriginalPalace: false,
    auspiciousStars: [],
    maleficStars: [],
    otherStars: [],
    changsheng12: '',
    boshi12: '',
    suiqian12: '',
    majorPeriod: { startAge: 0, endAge: 10 },
    minorPeriodAges: [],
    hasTuan: false,
    hasTriet: false,
    tuanTrietRole: { tuan: null, triet: null },
    ...overrides,
  };
}

function palaceComprehensiveScoreOfChart(palaceId: string): number {
  const palace = chart.palaces.find((candidate) => candidate.id === palaceId);
  if (!palace) throw new Error(`Không tìm thấy cung ${palaceId}`);
  return calculatePalaceComprehensiveScore(chart, palace);
}

function samplePalaceComprehensiveScoreOfChart(palaceId: string): number {
  const palace = sampleChart.palaces.find((candidate) => candidate.id === palaceId);
  if (!palace) throw new Error(`Không tìm thấy cung ${palaceId}`);
  return calculatePalaceComprehensiveScore(sampleChart, palace);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('calculatePalaceBaseScore', () => {
  it('trả về 3 cho cung Vô Chính Diệu hoặc không có cung', () => {
    expect(calculatePalaceBaseScore(makePalace({ id: 'menh', majorStars: [] }))).toBe(3);
    expect(calculatePalaceBaseScore(undefined)).toBe(3);
  });

  it('trả về đúng một chữ số thập phân theo độ sáng Miếu/Vượng/Đắc/Bình/Hãm', () => {
    const score = (brightnesses: BrightnessLevel[]): number =>
      calculatePalaceBaseScore(
        makePalace({
          id: 'menh',
          majorStars: brightnesses.map((brightness, index) =>
            makeMajorStar(`star${index}`, `Sao ${index}`, brightness)
          ),
        })
      );

    // Miếu 5, Vượng 4 -> trung bình 4.5 (giữ nguyên, không làm tròn thành 5).
    expect(score(['mieu', 'vuong'])).toBe(4.5);
    // Vượng 4, Đắc 4, Bình 3 -> trung bình 11/3 ≈ 3.666... -> 3.7.
    expect(score(['vuong', 'dac', 'binh'])).toBe(3.7);
    // Đắc 4, Bình 3, Bình 3 -> trung bình 10/3 ≈ 3.333... -> 3.3.
    expect(score(['dac', 'binh', 'binh'])).toBe(3.3);
    // Miếu 5, Miếu 5, Hãm 1 -> trung bình 11/3 ≈ 3.666... -> 3.7.
    expect(score(['mieu', 'mieu', 'ham'])).toBe(3.7);
    // Tổng đủ 5 mức: (5 + 4 + 4 + 3 + 1) / 5 = 3.4.
    expect(score(['mieu', 'vuong', 'dac', 'binh', 'ham'])).toBe(3.4);
  });

  it('kẹp điểm trong khoảng 1-5', () => {
    const score = (brightnesses: BrightnessLevel[]): number =>
      calculatePalaceBaseScore(
        makePalace({
          id: 'menh',
          majorStars: brightnesses.map((brightness, index) =>
            makeMajorStar(`star${index}`, `Sao ${index}`, brightness)
          ),
        })
      );

    // 3 Miếu đều 5 -> trung bình 5, kẹp trên 5.
    expect(score(['mieu', 'mieu', 'mieu'])).toBe(5);
    // 5 Đắc đều 4 -> trung bình 4, không còn chạm biên trên.
    expect(score(['dac', 'dac', 'dac', 'dac', 'dac'])).toBe(4);
    // Hãm 1 -> biên dưới 1.
    expect(score(['ham'])).toBe(1);
    // 2 Hãm đều 1 -> trung bình 1, kẹp dưới 1.
    expect(score(['ham', 'ham'])).toBe(1);
  });
});

describe('calculatePalaceBaseScore chi tiết', () => {
  const binhPalace = (overrides: Partial<Palace> = {}): Palace =>
    makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('binh', 'Bình', 'binh')],
      ...overrides,
    });

  const hoaLoc = makeSupportingStar('hoaLoc', 'Hóa Lộc', { mutagen: 'hoaLoc' });
  const hoaQuyen = makeSupportingStar('hoaQuyen', 'Hóa Quyền', {
    mutagen: 'hoaQuyen',
  });
  const hoaKhoa = makeSupportingStar('hoaKhoa', 'Hóa Khoa', {
    mutagen: 'hoaKhoa',
  });
  const hoaKy = makeSupportingStar('hoaKy', 'Hóa Kỵ', { mutagen: 'hoaKy' });

  it('ánh xạ độ sáng chuẩn Miếu 5, Vượng 4, Đắc 4, Bình 3, Hãm 1', () => {
    expect(BRIGHTNESS_FORTUNE_SCORE).toEqual({
      mieu: 5,
      vuong: 4,
      dac: 4,
      binh: 3,
      ham: 1,
    });
  });

  it('điểm một sao: Miếu 5, Đắc 4, Hãm 1; Vô Chính Diệu 3', () => {
    const single = (brightness: BrightnessLevel): number =>
      calculatePalaceBaseScore(
        makePalace({
          id: 'menh',
          majorStars: [makeMajorStar('sao', 'Sao', brightness)],
        })
      );

    expect(single('mieu')).toBe(5);
    expect(single('dac')).toBe(4);
    expect(single('ham')).toBe(1);
    expect(calculatePalaceBaseScore(makePalace({ id: 'menh', majorStars: [] }))).toBe(3);
  });

  it('cộng đúng Hóa Lộc +0.4 và giữ một chữ số thập phân', () => {
    const oneCat = makeStars(1, 'cat');

    // Bình 3 + 1 cát tinh 0.1 = 3.1.
    expect(calculatePalaceBaseScore(binhPalace({ auspiciousStars: oneCat }))).toBe(3.1);
    // Thêm Hóa Lộc 0.4 -> 3.5 (không làm tròn lên 4).
    expect(
      calculatePalaceBaseScore(
        binhPalace({ auspiciousStars: oneCat, otherStars: [hoaLoc] })
      )
    ).toBe(3.5);
  });

  it('cộng đúng Hóa Quyền +0.2', () => {
    const threeCat = makeStars(3, 'cat');

    // Bình 3 + 3 cát tinh 0.3 = 3.3.
    expect(calculatePalaceBaseScore(binhPalace({ auspiciousStars: threeCat }))).toBe(3.3);
    // Thêm Hóa Quyền 0.2 -> 3.5.
    expect(
      calculatePalaceBaseScore(
        binhPalace({ auspiciousStars: threeCat, otherStars: [hoaQuyen] })
      )
    ).toBe(3.5);
  });

  it('cộng đúng Hóa Khoa +0.2', () => {
    const threeCat = makeStars(3, 'cat');

    expect(calculatePalaceBaseScore(binhPalace({ auspiciousStars: threeCat }))).toBe(3.3);
    expect(
      calculatePalaceBaseScore(
        binhPalace({ auspiciousStars: threeCat, otherStars: [hoaKhoa] })
      )
    ).toBe(3.5);
  });

  it('trừ đúng Hóa Kỵ -0.6', () => {
    const vuongPalace = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('vuong', 'Vượng', 'vuong')],
    });

    expect(calculatePalaceBaseScore(vuongPalace)).toBe(4);
    // Vượng 4 - Hóa Kỵ 0.6 = 3.4.
    expect(calculatePalaceBaseScore({ ...vuongPalace, otherStars: [hoaKy] })).toBe(3.4);
  });

  it('trừ Tuần và Triệt mỗi thứ 0.3', () => {
    const pair = makePalace({
      id: 'menh',
      majorStars: [
        makeMajorStar('mieu', 'Miếu', 'mieu'),
        makeMajorStar('vuong', 'Vượng', 'vuong'),
      ],
    });

    // Miếu 5 + Vượng 4 -> trung bình 4.5.
    expect(calculatePalaceBaseScore(pair)).toBe(4.5);
    // 4.5 - 0.3 = 4.2.
    expect(calculatePalaceBaseScore({ ...pair, hasTuan: true })).toBe(4.2);
    expect(calculatePalaceBaseScore({ ...pair, hasTriet: true })).toBe(4.2);
    // 4.5 - 0.3 - 0.3 = 3.9.
    expect(calculatePalaceBaseScore({ ...pair, hasTuan: true, hasTriet: true })).toBe(3.9);
  });

  it('giới hạn cộng cát tinh tối đa 0.4 và trừ hung tinh tối đa 0.45', () => {
    // Nếu không có trần, 10 cát tinh sẽ là 3 + 1.0 = 4; có trần chỉ còn 3.4.
    expect(
      calculatePalaceBaseScore(binhPalace({ auspiciousStars: makeStars(4, 'cat') }))
    ).toBe(3.4);
    expect(
      calculatePalaceBaseScore(binhPalace({ auspiciousStars: makeStars(10, 'cat') }))
    ).toBe(3.4);

    // Nếu không có trần, 10 hung tinh sẽ là 3 - 1.5 = 1.5; có trần còn 2.55 -> 2.6.
    const hungStars = makeStars(10, 'hung', { nature: 'hung' });
    expect(
      calculatePalaceBaseScore(binhPalace({ maleficStars: hungStars.slice(0, 4) }))
    ).toBe(2.6);
    expect(
      calculatePalaceBaseScore(binhPalace({ maleficStars: hungStars }))
    ).toBe(2.6);
  });

  it('kẹp điểm trong 1-5 sau khi làm tròn', () => {
    const top = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
      auspiciousStars: makeStars(4, 'cat'),
      otherStars: [hoaLoc],
    });
    expect(calculatePalaceBaseScore(top)).toBe(5);

    const bottom = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('ham', 'Hãm', 'ham')],
      maleficStars: makeStars(4, 'hung', { nature: 'hung' }),
      hasTuan: true,
      hasTriet: true,
    });
    expect(calculatePalaceBaseScore(bottom)).toBe(1);
  });

  it('giữ một chữ số thập phân, không làm tròn về số nguyên', () => {
    const palace = (brightnesses: BrightnessLevel[]): number =>
      calculatePalaceBaseScore(
        makePalace({
          id: 'menh',
          majorStars: brightnesses.map((brightness, index) =>
            makeMajorStar(`star${index}`, `Sao ${index}`, brightness)
          ),
        })
      );

    // 4.5 giữ nguyên.
    expect(palace(['mieu', 'vuong'])).toBe(4.5);
    // 3.5 giữ nguyên.
    expect(palace(['dac', 'binh'])).toBe(3.5);
    expect(palace(['vuong', 'binh'])).toBe(3.5);
    // Bình 3 + Hóa Lộc 0.4 = 3.4.
    expect(calculatePalaceBaseScore(binhPalace({ otherStars: [hoaLoc] }))).toBe(3.4);
  });

  it('giữ tương thích: calculatePalaceFortuneScore là điểm nền', () => {
    const palace = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
      auspiciousStars: makeStars(1, 'cat'),
    });

    expect(calculatePalaceFortuneScore(palace)).toBe(calculatePalaceBaseScore(palace));
    expect(calculatePalaceFortuneScore(palace)).toBe(5);
  });
});

describe('calculatePalaceComprehensiveScore', () => {
  it('trộn 60% điểm bản cung và 40% trung bình tam phương', () => {
    const own = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
    });
    const related = [
      makePalace({
        id: 'taiBach',
        majorStars: [makeMajorStar('binh1', 'Bình 1', 'binh')],
      }),
      makePalace({
        id: 'quanLoc',
        majorStars: [makeMajorStar('binh2', 'Bình 2', 'binh')],
      }),
      makePalace({
        id: 'thienDi',
        majorStars: [makeMajorStar('binh3', 'Bình 3', 'binh')],
      }),
    ];

    const ownScore = calculatePalaceBaseScore(own);
    const relatedAverage =
      related.reduce((sum, palace) => sum + calculatePalaceBaseScore(palace), 0) /
      related.length;

    const comprehensive = calculatePalaceComprehensiveScore(makeChart([own, ...related]), own);

    expect(ownScore).toBe(5);
    expect(relatedAverage).toBe(3);
    expect(comprehensive).toBe(4.2);
    expect(comprehensive).toBe(
      Math.round((ownScore * 0.6 + relatedAverage * 0.4) * 10) / 10
    );
  });

  it('làm tròn một chữ số thập phân khi tam phương lệch nhau', () => {
    const own = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
    });
    const related = [
      makePalace({
        id: 'taiBach',
        majorStars: [makeMajorStar('mieu2', 'Miếu 2', 'mieu')],
      }),
      makePalace({
        id: 'quanLoc',
        majorStars: [makeMajorStar('dac2', 'Đắc 2', 'dac')],
      }),
      makePalace({
        id: 'thienDi',
        majorStars: [makeMajorStar('ham2', 'Hãm 2', 'ham')],
      }),
    ];

    // Bản cung 5; tam phương trung bình (5 + 4 + 1) / 3 = 10/3.
    // 5 * 0.6 + (10/3) * 0.4 = 4.333... -> 4.3.
    expect(calculatePalaceComprehensiveScore(makeChart([own, ...related]), own)).toBe(4.3);
  });

  it('chỉ dùng các cung liên quan tìm thấy khi lá số thiếu cung', () => {
    const own = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
    });
    const onlyRelated = makePalace({
      id: 'taiBach',
      majorStars: [makeMajorStar('dac', 'Đắc', 'dac')],
    });

    // 5 * 0.6 + 4 * 0.4 = 4.6.
    expect(
      calculatePalaceComprehensiveScore(makeChart([own, onlyRelated]), own)
    ).toBe(4.6);
  });

  it('quay về điểm bản cung khi không có cung hoặc không có tam phương', () => {
    const own = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('mieu', 'Miếu', 'mieu')],
    });

    expect(calculatePalaceComprehensiveScore(makeChart([own]), own)).toBe(5);
    expect(calculatePalaceComprehensiveScore(makeChart([own]), undefined)).toBe(3);
    expect(calculatePalaceComprehensiveScore(makeChart([]), own)).toBe(5);
  });
});

describe('hồi quy cung một sao sáng', () => {
  it('một sao Miếu/Vượng/Đắc không thể ≤2 chỉ vì phụ tinh, Tuần, Triệt', () => {
    for (const brightness of ['mieu', 'vuong', 'dac'] as const) {
      const palace = makePalace({
        id: 'menh',
        majorStars: [makeMajorStar('sao', 'Sao', brightness)],
        maleficStars: makeStars(10, 'hung', { nature: 'hung' }),
        hasTuan: true,
        hasTriet: true,
      });

      expect(calculatePalaceFortuneScore(palace)).toBeGreaterThan(2);
    }
  });

  it('mẫu thật không có cung một sao sáng nào bị ≤2', () => {
    const brightBrightnesses: BrightnessLevel[] = ['mieu', 'vuong', 'dac'];

    for (const palace of sampleChart.palaces) {
      if (palace.majorStars.length !== 1) continue;
      const brightness = palace.majorStars[0].brightness ?? 'binh';
      if (!brightBrightnesses.includes(brightness)) continue;

      expect(calculatePalaceFortuneScore(palace)).toBeGreaterThan(2);
    }
  });
});

describe('ChartSummary dùng chung điểm chuẩn hóa', () => {
  const ASPECT_PALACES = [
    ['Sự nghiệp', 'quanLoc'],
    ['Tài lộc', 'taiBach'],
    ['Tình duyên', 'phuThe'],
    ['Sức khỏe', 'tatAch'],
  ] as const;

  it('điểm từng chủ đề khớp calculatePalaceComprehensiveScore của cùng cung', () => {
    render(createElement(ChartSummary, { chart: sampleChart }));

    for (const [label, palaceId] of ASPECT_PALACES) {
      const palace = sampleChart.palaces.find((candidate) => candidate.id === palaceId)!;
      const meter = screen.getByRole('meter', { name: label });

      expect(Number(meter.getAttribute('aria-valuenow'))).toBe(
        calculatePalaceComprehensiveScore(sampleChart, palace)
      );
    }
  });

  it('mẫu 18/7/2004 có điểm Khái quát 4.3/4.7/4.7/3.1', () => {
    render(createElement(ChartSummary, { chart: sampleChart }));

    const expected = {
      'Sự nghiệp': 4.3,
      'Tài lộc': 4.7,
      'Tình duyên': 4.7,
      'Sức khỏe': 3.1,
    } as const;

    for (const [label, value] of Object.entries(expected)) {
      const meter = screen.getByRole('meter', { name: label });
      expect(Number(meter.getAttribute('aria-valuenow'))).toBe(value);
    }
  });
});

describe('fortuneLevelFromScore', () => {
  it('phân loại đúng các ngưỡng 3.75/2.75 và biên 5/1', () => {
    expect(fortuneLevelFromScore(5)).toBe('tốt');
    expect(fortuneLevelFromScore(4)).toBe('tốt');
    expect(fortuneLevelFromScore(3.9)).toBe('tốt');
    expect(fortuneLevelFromScore(3.75)).toBe('tốt');
    expect(fortuneLevelFromScore(3.7)).toBe('ổn định');
    expect(fortuneLevelFromScore(3)).toBe('ổn định');
    expect(fortuneLevelFromScore(2.75)).toBe('ổn định');
    expect(fortuneLevelFromScore(2.7)).toBe('xấu');
    expect(fortuneLevelFromScore(2)).toBe('xấu');
    expect(fortuneLevelFromScore(1)).toBe('xấu');
  });
});

describe('getFortuneRating', () => {
  it('phân loại đúng 5 mức với các ngưỡng 4.5/3.75/2.75/1.75', () => {
    expect(getFortuneRating(5)).toBe('ratTot');
    expect(getFortuneRating(4.5)).toBe('ratTot');
    expect(getFortuneRating(4.4)).toBe('tot');
    expect(getFortuneRating(3.75)).toBe('tot');
    expect(getFortuneRating(3.7)).toBe('onDinh');
    expect(getFortuneRating(2.75)).toBe('onDinh');
    expect(getFortuneRating(2.7)).toBe('bienDong');
    expect(getFortuneRating(1.75)).toBe('bienDong');
    expect(getFortuneRating(1.7)).toBe('khoKhan');
    expect(getFortuneRating(1)).toBe('khoKhan');
  });

  it('dùng đúng nhãn hiển thị 5 mức', () => {
    expect(FORTUNE_RATING_LABELS).toEqual({
      ratTot: 'Rất thuận lợi',
      tot: 'Thuận lợi',
      onDinh: 'Ổn định',
      bienDong: 'Biến động',
      khoKhan: 'Khó khăn',
    });
  });

  it('không còn nhãn UI cũ Cát lợi/Bình hòa/Cần lưu ý', () => {
    const labels = Object.values(FORTUNE_RATING_LABELS);

    expect(labels).not.toContain('Cát lợi');
    expect(labels).not.toContain('Bình hòa');
    expect(labels).not.toContain('Cần lưu ý');
  });
});

describe('calculateDecadeFortune', () => {
  it('trả về tất cả đại hạn hợp lệ (12), sắp xếp theo tuổi tăng dần', () => {
    const validDaiHan = chart.periods.filter(
      (period) =>
        period.type === 'daiHan' &&
        typeof period.startAge === 'number' &&
        typeof period.endAge === 'number'
    );
    const decades = calculateDecadeFortune(chart, 36, BIRTH_YEAR);

    expect(validDaiHan).toHaveLength(12);
    expect(decades).toHaveLength(validDaiHan.length);
    expect(decades.length).toBeGreaterThan(8);

    const expectedStartAges = validDaiHan
      .map((period) => period.startAge as number)
      .sort((a, b) => a - b);
    expect(decades.map((decade) => decade.ageRange[0])).toEqual(expectedStartAges);
    expect(new Set(decades.map((decade) => decade.decade)).size).toBe(decades.length);

    for (let i = 1; i < decades.length; i += 1) {
      expect(decades[i].ageRange[0]).toBeGreaterThan(decades[i - 1].ageRange[0]);
    }
  });

  it('mỗi đại hạn có ageRange, yearRange và cung hợp lệ', () => {
    const decades = calculateDecadeFortune(chart, 36, BIRTH_YEAR);

    for (const decade of decades) {
      expect(decade.ageRange[0]).toBeLessThanOrEqual(decade.ageRange[1]);
      expect(decade.yearRange[0]).toBe(BIRTH_YEAR + decade.ageRange[0]);
      expect(decade.yearRange[1]).toBe(BIRTH_YEAR + decade.ageRange[1]);
      expect(decade.decade).toBe(`${decade.ageRange[0]}-${decade.ageRange[1]}`);
      expect(chart.palaces.some((palace) => palace.id === decade.palaceId)).toBe(true);
      expect(decade.summary.length).toBeGreaterThan(0);
    }
  });

  it('đánh dấu đúng đại hạn hiện tại theo tuổi', () => {
    const decades = calculateDecadeFortune(chart, 36, BIRTH_YEAR);
    const current = decades.filter((decade) => decade.isCurrent);

    expect(current).toHaveLength(1);
    expect(current[0].ageRange[0]).toBeLessThanOrEqual(36);
    expect(current[0].ageRange[1]).toBeGreaterThanOrEqual(36);
  });

  it('score dùng điểm tổng hợp, một chữ số thập phân và rating/fortune luôn khớp', () => {
    const decades = calculateDecadeFortune(chart, 36, BIRTH_YEAR);

    for (const decade of decades) {
      const palace = chart.palaces.find((candidate) => candidate.id === decade.palaceId)!;
      expect(decade.score).toBeGreaterThanOrEqual(1);
      expect(decade.score).toBeLessThanOrEqual(5);
      expect(decade.score).toBe(Math.round(decade.score * 10) / 10);
      expect(decade.score).toBe(calculatePalaceComprehensiveScore(chart, palace));
      expect(decade.rating).toBe(getFortuneRating(decade.score));
      expect(decade.fortune).toBe(fortuneLevelFromScore(decade.score));
    }
  });
});

describe('calculateYearlyFortune', () => {
  it('tính đúng can chi của năm', () => {
    expect(calculateYearlyFortune(chart, 2026, BIRTH_YEAR).zodiac).toBe('Bính Ngọ');
    expect(calculateYearlyFortune(chart, 1990, BIRTH_YEAR).zodiac).toBe('Canh Ngọ');
    expect(calculateYearlyFortune(chart, 2024, BIRTH_YEAR).zodiac).toBe('Giáp Thìn');
  });

  it('trả về điểm trong khoảng 1-5 và cung lưu niên hợp lệ', () => {
    const fortune = calculateYearlyFortune(chart, 2026, BIRTH_YEAR);

    expect(fortune.year).toBe(2026);
    expect(fortune.score).toBeGreaterThanOrEqual(1);
    expect(fortune.score).toBeLessThanOrEqual(5);
    expect(chart.palaces.some((palace) => palace.id === fortune.palaceId)).toBe(true);
    expect(fortune.summary).toContain('2026');
    expect(fortune.advice.length).toBeGreaterThan(0);
  });

  it('áp dụng đúng công thức 65% đại hạn + 35% lưu niên', () => {
    // 2025: tuổi 35 thuộc đại hạn 26-35 (tổng hợp 4.8), cung lưu niên tổng hợp 1.5.
    const fortune2025 = calculateYearlyFortune(chart, 2025, BIRTH_YEAR);
    const expectedYearPalaceScore2025 = palaceComprehensiveScoreOfChart(
      fortune2025.palaceId
    );
    expect(fortune2025.decadeScore).toBe(4.8);
    expect(expectedYearPalaceScore2025).toBe(1.5);
    expect(fortune2025.score).toBe(
      Math.max(
        1,
        Math.min(
          5,
          Math.round((0.65 * 4.8 + 0.35 * expectedYearPalaceScore2025) * 10) / 10
        )
      )
    );
    expect(fortune2025.score).toBe(3.6);

    // 2026: tuổi 36 thuộc đại hạn 36-45 (tổng hợp 1.5), cung lưu niên tổng hợp 4.
    const fortune2026 = calculateYearlyFortune(chart, 2026, BIRTH_YEAR);
    const expectedYearPalaceScore2026 = palaceComprehensiveScoreOfChart(
      fortune2026.palaceId
    );
    expect(fortune2026.decadeScore).toBe(1.5);
    expect(expectedYearPalaceScore2026).toBe(4);
    expect(fortune2026.score).toBe(
      Math.max(
        1,
        Math.min(
          5,
          Math.round((0.65 * 1.5 + 0.35 * expectedYearPalaceScore2026) * 10) / 10
        )
      )
    );
    expect(fortune2026.score).toBe(2.4);
  });

  it('rating/fortune và nhãn 5 cấp luôn khớp điểm năm', () => {
    const years = [2024, 2025, 2026, 2027, 2030, 2034, 2035, 2036, 2040, 2045];

    for (const year of years) {
      const fortune = calculateYearlyFortune(sampleChart, year, SAMPLE_BIRTH_YEAR);
      expect(fortune.rating).toBe(getFortuneRating(fortune.score));
      expect(fortune.fortune).toBe(fortuneLevelFromScore(fortune.score));
      expect(FORTUNE_RATING_LABELS[fortune.rating]).not.toMatch(
        /Cát lợi|Bình hòa|Cần lưu ý/
      );
    }
  });
});

describe('tra cứu đại hạn theo tuổi', () => {
  it('chọn đúng đại hạn bao phủ tuổi của năm xem', () => {
    const decades = calculateDecadeFortune(sampleChart, 22, SAMPLE_BIRTH_YEAR);

    for (const age of [2, 11, 12, 21, 22, 31, 32, 41]) {
      const year = SAMPLE_BIRTH_YEAR + age;
      const fortune = calculateYearlyFortune(sampleChart, year, SAMPLE_BIRTH_YEAR);
      const expected = decades.find(
        (decade) => age >= decade.ageRange[0] && age <= decade.ageRange[1]
      );

      expect(expected).toBeDefined();
      expect(fortune.decadeScore).toBe(expected!.score);
      expect(fortune.decadeScore).toBe(
        samplePalaceComprehensiveScoreOfChart(expected!.palaceId)
      );
    }

    // Ranh giới 21/22 và 31/32 của mẫu.
    expect(calculateYearlyFortune(sampleChart, 2025, SAMPLE_BIRTH_YEAR).decadeScore).toBe(3.2);
    expect(calculateYearlyFortune(sampleChart, 2026, SAMPLE_BIRTH_YEAR).decadeScore).toBe(4.8);
    expect(calculateYearlyFortune(sampleChart, 2035, SAMPLE_BIRTH_YEAR).decadeScore).toBe(4.8);
    expect(calculateYearlyFortune(sampleChart, 2036, SAMPLE_BIRTH_YEAR).decadeScore).toBe(1.4);
  });

  it('không có đại hạn bao phủ thì chỉ dùng điểm cung lưu niên', () => {
    const fortune = calculateYearlyFortune(sampleChart, SAMPLE_BIRTH_YEAR, SAMPLE_BIRTH_YEAR);

    expect(fortune.decadeScore).toBeUndefined();
    expect(fortune.score).toBe(samplePalaceComprehensiveScoreOfChart(fortune.palaceId));
  });
});

describe('mẫu 18/7/2004 13:00 nam Hà Nội', () => {
  it('12 đại hạn có điểm tổng hợp đúng danh sách kỳ vọng', () => {
    const decades = calculateDecadeFortune(sampleChart, 22, SAMPLE_BIRTH_YEAR);

    expect(decades.map((decade) => decade.score)).toEqual([
      4.7, 3.2, 4.8, 1.4, 4.3, 1.4, 4.4, 3.1, 4.7, 1.4, 4.7, 1.4,
    ]);
    expect(decades.map((decade) => decade.rating)).toEqual([
      'ratTot',
      'onDinh',
      'ratTot',
      'khoKhan',
      'tot',
      'khoKhan',
      'tot',
      'onDinh',
      'ratTot',
      'khoKhan',
      'ratTot',
      'khoKhan',
    ]);
    expect(decades.map((decade) => decade.fortune)).toEqual([
      'tốt',
      'ổn định',
      'tốt',
      'xấu',
      'tốt',
      'xấu',
      'tốt',
      'ổn định',
      'tốt',
      'xấu',
      'tốt',
      'xấu',
    ]);

    for (const decade of decades) {
      const palace = sampleChart.palaces.find(
        (candidate) => candidate.id === decade.palaceId
      )!;
      expect(decade.score).toBe(Math.round(decade.score * 10) / 10);
      expect(decade.score).toBe(calculatePalaceComprehensiveScore(sampleChart, palace));
      expect(decade.rating).toBe(getFortuneRating(decade.score));
      expect(decade.fortune).toBe(fortuneLevelFromScore(decade.score));
    }
  });

  it('đại hạn 22-31 có điểm tổng hợp 4.8 (rất thuận lợi) và ánh xạ đúng năm 2026-2035', () => {
    const decades = calculateDecadeFortune(sampleChart, 2026 - SAMPLE_BIRTH_YEAR, SAMPLE_BIRTH_YEAR);
    const decade = decades.find(
      (candidate) => candidate.ageRange[0] === 22 && candidate.ageRange[1] === 31
    );

    expect(decade).toBeDefined();
    expect(decade!.yearRange).toEqual([2026, 2035]);
    expect(decade!.score).toBe(4.8);
    expect(decade!.rating).toBe('ratTot');
    expect(FORTUNE_RATING_LABELS[decade!.rating]).toBe('Rất thuận lợi');
    expect(decade!.fortune).toBe('tốt');
    expect(decade!.fortune).toBe(fortuneLevelFromScore(decade!.score));
  });

  it('các năm 2026-2035 có điểm/rating/label nhất quán', () => {
    const expectedScores = [4.7, 4.2, 4.8, 3.6, 4.8, 3.6, 4.8, 4.2, 4.8, 3.6];
    const expectedRatings = [
      'ratTot',
      'tot',
      'ratTot',
      'onDinh',
      'ratTot',
      'onDinh',
      'ratTot',
      'tot',
      'ratTot',
      'onDinh',
    ] as const;
    const expectedLabels = [
      'Rất thuận lợi',
      'Thuận lợi',
      'Rất thuận lợi',
      'Ổn định',
      'Rất thuận lợi',
      'Ổn định',
      'Rất thuận lợi',
      'Thuận lợi',
      'Rất thuận lợi',
      'Ổn định',
    ];
    const actual = Array.from({ length: 10 }, (_, index) => {
      const year = 2026 + index;
      const fortune = calculateYearlyFortune(sampleChart, year, SAMPLE_BIRTH_YEAR);
      expect(fortune.decadeScore).toBe(4.8);
      return {
        year,
        score: fortune.score,
        rating: fortune.rating,
        fortune: fortune.fortune,
      };
    });

    expect(actual.map((row) => row.year)).toEqual([
      2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
    ]);
    expect(actual.map((row) => row.score)).toEqual(expectedScores);
    expect(actual.map((row) => row.rating)).toEqual(expectedRatings);
    expect(actual.map((row) => FORTUNE_RATING_LABELS[row.rating])).toEqual(
      expectedLabels
    );

    for (const row of actual) {
      expect(row.rating).toBe(getFortuneRating(row.score));
      expect(row.fortune).toBe(fortuneLevelFromScore(row.score));
    }
  });

  it('timeline 2026-2035 bám đại hạn 22-31, avgScore/fortune khớp các năm', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0));

    const timeline = generateTimeline(sampleChart, SAMPLE_BIRTH_YEAR, 20);

    expect(timeline.startYear).toBe(2026);
    expect(timeline.endYear).toBe(2045);
    expect(timeline.years.map((year) => year.year)).toEqual(
      Array.from({ length: 20 }, (_, index) => 2026 + index)
    );
    expect(new Set(timeline.years.map((year) => year.year)).size).toBe(20);
    expect(timeline.decades.map((decade) => decade.decade)).toEqual([
      '2026-2035',
      '2036-2045',
    ]);

    const firstDecade = timeline.decades[0];
    const includedYears = timeline.years.filter(
      (year) => year.year >= 2026 && year.year <= 2035
    );
    expect(includedYears).toHaveLength(10);

    const expectedAvgScore =
      Math.round(
        (includedYears.reduce((sum, year) => sum + year.score, 0) / includedYears.length) * 10
      ) / 10;

    expect(firstDecade.avgScore).toBe(expectedAvgScore);
    expect(firstDecade.avgScore).toBe(4.3);
    expect(firstDecade.rating).toBe(getFortuneRating(firstDecade.avgScore));
    expect(firstDecade.rating).toBe('tot');
    expect(firstDecade.fortune).toBe(fortuneLevelFromScore(firstDecade.avgScore));
    expect(firstDecade.fortune).toBe('tốt');
    expect(FORTUNE_RATING_LABELS[firstDecade.rating!]).toBe('Thuận lợi');

    // Thập niên kế tiếp 2036-2045 có trung bình 2.1 -> Biến động.
    const secondDecade = timeline.decades[1];
    expect(secondDecade.avgScore).toBe(2.1);
    expect(secondDecade.rating).toBe('bienDong');
    expect(secondDecade.fortune).toBe('xấu');
    expect(FORTUNE_RATING_LABELS[secondDecade.rating!]).toBe('Biến động');

    // Mỗi năm trong timeline phải khớp kết quả tính trực tiếp, không lệch khối.
    for (const year of includedYears) {
      const direct = calculateYearlyFortune(sampleChart, year.year, SAMPLE_BIRTH_YEAR);
      expect(year.score).toBe(direct.score);
      expect(year.rating).toBe(getFortuneRating(year.score));
      expect(year.rating).toBe(direct.rating);
      expect(year.fortune).toBe(direct.fortune);
      expect(year.zodiac).toBe(direct.zodiac);
    }
  });
});

describe('star groups', () => {
  it('nhận diện bộ sao Tử Phủ đồng cung', () => {
    const palace = makePalace({
      id: 'menh',
      majorStars: [makeMajorStar('tuVi', 'Tử Vi'), makeMajorStar('thienPhu', 'Thiên Phủ')],
    });

    const groups = detectStarGroups(palace);
    const ids = groups.map((group) => group.id);

    expect(STAR_GROUPS.length).toBeGreaterThan(0);
    expect(ids).toContain('tu-phu-dong-cung');
  });

  it('gắn bộ sao vào luận giải từng cung', () => {
    const interpretation = new ZiweiInterpreter().interpret(chart);

    expect(interpretation.palaces).toHaveLength(12);
    for (const palace of interpretation.palaces) {
      expect(Array.isArray(palace.starGroups)).toBe(true);
    }
  });
});

describe('data style guard', () => {
  // Chỉ quét phần luận giải (meaning/description), không quét điều kiện nhận diện.
  const ABSOLUTE_FATALISTIC_PHRASES = [
    'chắc chắn',
    'tuyệt đối',
    'đảm bảo',
    'định mệnh',
    'số phận',
    'đe dọa tính mạng',
    'tai nạn nghiêm trọng',
    'tốt cho phụ nữ',
    'phú quý',
    'sung túc',
    'thịnh vượng',
    'sẽ thành công',
    'thi cử đỗ đạt',
  ] as const;

  function expectNoBannedPhrase(text: string, label: string): void {
    const normalized = text.toLowerCase();
    for (const phrase of ABSOLUTE_FATALISTIC_PHRASES) {
      expect(normalized, `${label} chứa "${phrase}": ${text}`).not.toContain(phrase);
    }
  }

  it('STAR_GROUPS dùng ngôn từ không tuyệt đối/hóa số phận', () => {
    for (const group of STAR_GROUPS) {
      expectNoBannedPhrase(group.meaning, `STAR_GROUPS[${group.id}]`);
    }
  });

  it('ADVANCED_COMBINATIONS dùng ngôn từ không tuyệt đối/hóa số phận', () => {
    for (const combination of ADVANCED_COMBINATIONS) {
      expectNoBannedPhrase(combination.description, `ADVANCED_COMBINATIONS[${combination.id}]`);
    }
  });
});
