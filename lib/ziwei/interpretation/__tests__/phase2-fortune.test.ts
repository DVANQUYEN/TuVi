import { describe, it, expect } from 'vitest';
import { createChartEngine } from '../../engine/sao-menh.engine';
import { calculateDecadeFortune } from '../decade-fortune';
import { calculateYearlyFortune } from '../yearly-fortune';
import { detectStarGroups, STAR_GROUPS } from '../star-groups';
import { ZiweiInterpreter } from '../interpreter';
import type { Palace, Star } from '../../types';
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

function makeMajorStar(id: string, name: string): Star {
  return {
    id,
    name,
    category: 'major',
    element: 'kim',
    nature: 'cat',
    brightness: 'mieu',
  };
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

describe('calculateDecadeFortune', () => {
  it('trả về tối đa 8 đại hạn sắp xếp theo tuổi tăng dần', () => {
    const decades = calculateDecadeFortune(chart, 36, BIRTH_YEAR);

    expect(decades).toHaveLength(8);
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
