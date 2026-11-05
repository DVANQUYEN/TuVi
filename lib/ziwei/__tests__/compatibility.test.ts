import { describe, it, expect } from 'vitest';
import { calculateCompatibility } from '../compatibility';
import type { ZiweiChart } from '../types';
import type { EarthlyBranch, FiveElement, HeavenlyStem } from '../types/enums';
import { EARTHLY_BRANCHES, FIVE_ELEMENTS, HEAVENLY_STEMS } from '../types/enums';

interface ChartParts {
  napAm: FiveElement;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  menhElement?: FiveElement;
}

// Chỉ tạo các field mà calculateCompatibility đọc tới
function makeChart({ napAm, stem, branch, menhElement = 'kim' }: ChartParts): ZiweiChart {
  return {
    heavenPlate: {
      napAm: { name: 'test', element: napAm },
      fourPillars: { year: { stem, branch, label: 'test' } },
    },
    palaces: [{ id: 'menh', element: menhElement }],
  } as unknown as ZiweiChart;
}

const base: ChartParts = { napAm: 'kim', stem: 'giap', branch: 'ty' };

describe('calculateCompatibility', () => {
  it('trả về score trong khoảng 0-100 cho mọi tổ hợp đầu vào', () => {
    for (const e1 of FIVE_ELEMENTS) {
      for (const e2 of FIVE_ELEMENTS) {
        for (const b1 of EARTHLY_BRANCHES) {
          for (const b2 of EARTHLY_BRANCHES) {
            const result = calculateCompatibility(
              makeChart({ napAm: e1, stem: 'giap', branch: b1 }),
              makeChart({ napAm: e2, stem: 'at', branch: b2 })
            );
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            expect(Number.isInteger(result.score)).toBe(true);
          }
        }
      }
    }
  });

  it('level khớp với ngưỡng của score', () => {
    for (const s1 of HEAVENLY_STEMS) {
      for (const b2 of EARTHLY_BRANCHES) {
        const result = calculateCompatibility(
          makeChart({ ...base, stem: s1 }),
          makeChart({ napAm: 'thuy', stem: 'binh', branch: b2 })
        );
        const expected = result.score >= 70 ? 'tốt' : result.score >= 50 ? 'trung bình' : 'xấu';
        expect(result.level).toBe(expected);
      }
    }
  });

  it('level tốt, trung bình, xấu đúng với các tổ hợp điển hình', () => {
    // Tương sinh (9), ngũ hợp (9), tam hợp (9), cùng Mệnh (7)
    const good = calculateCompatibility(
      makeChart({ napAm: 'kim', stem: 'giap', branch: 'ty', menhElement: 'tho' }),
      makeChart({ napAm: 'thuy', stem: 'ky', branch: 'thin', menhElement: 'tho' })
    );
    expect(good.level).toBe('tốt');

    // Cùng ngũ hành (7), cùng thiên can (7), cùng địa chi (6), cùng Mệnh (7)
    const mid = calculateCompatibility(makeChart(base), makeChart(base));
    expect(mid.score).toBe(68);
    expect(mid.level).toBe('trung bình');

    // Tương khắc (3), thiên can thường (5), lục xung (2), Mệnh khác (5)
    const bad = calculateCompatibility(
      makeChart({ napAm: 'kim', stem: 'giap', branch: 'ty', menhElement: 'kim' }),
      makeChart({ napAm: 'moc', stem: 'at', branch: 'ngo', menhElement: 'hoa' })
    );
    expect(bad.score).toBe(37);
    expect(bad.level).toBe('xấu');
  });

  it('aspects có đủ 4 khía cạnh', () => {
    const result = calculateCompatibility(makeChart(base), makeChart(base));
    expect(Object.keys(result.aspects).sort()).toEqual(
      ['earthlyBranches', 'fiveElements', 'heavenlyStems', 'palaces'].sort()
    );
    for (const aspect of Object.values(result.aspects)) {
      expect(typeof aspect.score).toBe('number');
      expect(typeof aspect.meaning).toBe('string');
    }
  });

  it('mỗi khía cạnh có explanation và tip không rỗng, kể cả khi thiếu cung Mệnh', () => {
    const result = calculateCompatibility(
      makeChart({ napAm: 'kim', stem: 'giap', branch: 'ty' }),
      makeChart({ napAm: 'moc', stem: 'at', branch: 'ngo' })
    );
    for (const aspect of Object.values(result.aspects)) {
      expect(aspect.explanation.trim().length).toBeGreaterThan(0);
      expect(aspect.tip.trim().length).toBeGreaterThan(0);
    }

    const noMenh = calculateCompatibility(
      { ...makeChart(base), palaces: [] } as unknown as ZiweiChart,
      makeChart(base)
    );
    expect(noMenh.aspects.palaces.explanation.length).toBeGreaterThan(0);
    expect(noMenh.aspects.palaces.tip.length).toBeGreaterThan(0);
  });

  it('giải thích ngũ hành nêu đúng chiều sinh/khắc và không phụ thuộc thứ tự người', () => {
    const forward = calculateCompatibility(
      makeChart({ ...base, napAm: 'kim' }),
      makeChart({ ...base, napAm: 'moc' })
    );
    const reverse = calculateCompatibility(
      makeChart({ ...base, napAm: 'moc' }),
      makeChart({ ...base, napAm: 'kim' })
    );
    expect(forward.aspects.fiveElements.explanation).toBe(reverse.aspects.fiveElements.explanation);
    expect(forward.aspects.fiveElements.meaning).toBe('Kim khắc Mộc - Tương khắc');
    expect(forward.aspects.fiveElements.explanation).toContain('Kim khắc Mộc');
  });

  it('ngũ hợp thiên can nêu hành hóa đúng (Giáp-Kỷ hóa Thổ)', () => {
    const result = calculateCompatibility(
      makeChart({ ...base, stem: 'giap' }),
      makeChart({ ...base, stem: 'ky' })
    );
    expect(result.aspects.heavenlyStems.score).toBe(9);
    expect(result.aspects.heavenlyStems.explanation).toContain('hóa Thổ');
  });

  it('ngũ hành tương sinh = 9 điểm, không phụ thuộc thứ tự người', () => {
    const forward = calculateCompatibility(
      makeChart({ ...base, napAm: 'kim' }),
      makeChart({ ...base, napAm: 'thuy' })
    );
    const reverse = calculateCompatibility(
      makeChart({ ...base, napAm: 'thuy' }),
      makeChart({ ...base, napAm: 'kim' })
    );
    expect(forward.aspects.fiveElements.score).toBe(9);
    expect(reverse.aspects.fiveElements.score).toBe(9);
    expect(forward.score).toBe(reverse.score);
  });

  it('tam hợp = 9 điểm', () => {
    const result = calculateCompatibility(
      makeChart({ ...base, branch: 'than' }),
      makeChart({ ...base, branch: 'thin' })
    );
    expect(result.aspects.earthlyBranches.score).toBe(9);
  });

  it('cùng một Địa chi không được tính là tam hợp', () => {
    const result = calculateCompatibility(makeChart(base), makeChart(base));
    expect(result.aspects.earthlyBranches.score).toBe(6);
  });

  it('lục xung = 2 điểm', () => {
    const result = calculateCompatibility(
      makeChart({ ...base, branch: 'ty' }),
      makeChart({ ...base, branch: 'ngo' })
    );
    expect(result.aspects.earthlyBranches.score).toBe(2);
    expect(result.challenges).toContain('Địa chi xung/hình');
  });

  it('kết quả deterministic: cùng đầu vào cho cùng kết quả', () => {
    const c1 = makeChart({ napAm: 'hoa', stem: 'dinh', branch: 'dan' });
    const c2 = makeChart({ napAm: 'tho', stem: 'nham', branch: 'hoi' });
    expect(calculateCompatibility(c1, c2)).toEqual(calculateCompatibility(c1, c2));
  });
});
