import { describe, expect, it } from 'vitest';
import { getLoveYearLookup } from '../love-year-lookup';
import {
  BRANCH_LABELS,
  getZodiacCompatibility,
  MAX_ZODIAC_YEAR,
  MIN_ZODIAC_YEAR,
} from '../zodiac-compatibility';
import type { FiveElement } from '../types/enums';
import { getYearCanChi } from '../utils/can-chi';

/** Vòng tương sinh độc lập với implementation: Kim → Thủy → Mộc → Hỏa → Thổ → Kim. */
const ELEMENT_CYCLE = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'] as const;

const ELEMENT_LABELS: Readonly<Record<FiveElement, string>> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

/**
 * Hai hành tương sinh với một hành: hành sinh ra nó (trước trong vòng)
 * và hành nó sinh ra (sau trong vòng).
 */
function sinhNeighbors(elementLabel: string): [string, string] {
  const index = ELEMENT_CYCLE.indexOf(elementLabel as (typeof ELEMENT_CYCLE)[number]);
  expect(index).toBeGreaterThanOrEqual(0);
  return [ELEMENT_CYCLE[(index + 4) % 5], ELEMENT_CYCLE[(index + 1) % 5]];
}

function cautionLabels(year: number): string[] {
  return getZodiacCompatibility(year)
    .tuHanhXung.map((branch) => `Tuổi ${BRANCH_LABELS[branch]}: khác nhịp, cần thêm bao dung`)
    .sort();
}

describe('getLoveYearLookup — can chi và nạp âm chính xác', () => {
  it.each([
    {
      year: 1900,
      branch: 'ty',
      branchLabel: 'Tý',
      canChi: 'Canh Tý',
      napAm: { name: 'Bích Thượng Thổ', element: 'tho', elementLabel: 'Thổ' },
      partnerBranches: ['Thân', 'Thìn', 'Sửu'],
    },
    {
      year: 1990,
      branch: 'ngo',
      branchLabel: 'Ngọ',
      canChi: 'Canh Ngọ',
      napAm: { name: 'Lộ Bàng Thổ', element: 'tho', elementLabel: 'Thổ' },
      partnerBranches: ['Dần', 'Tuất', 'Mùi'],
    },
    {
      year: 2000,
      branch: 'thin',
      branchLabel: 'Thìn',
      canChi: 'Canh Thìn',
      napAm: { name: 'Bạch Lạp Kim', element: 'kim', elementLabel: 'Kim' },
      partnerBranches: ['Thân', 'Tý', 'Dậu'],
    },
    {
      year: 2099,
      branch: 'mui',
      branchLabel: 'Mùi',
      canChi: 'Kỷ Mùi',
      napAm: { name: 'Thiên Thượng Hỏa', element: 'hoa', elementLabel: 'Hỏa' },
      partnerBranches: ['Hợi', 'Mão', 'Ngọ'],
    },
  ])(
    'năm $year cho $canChi / $napAm.name và tuổi hợp duyên đúng',
    ({ year, branch, branchLabel, canChi, napAm, partnerBranches }) => {
      const result = getLoveYearLookup(year, { currentYear: year });

      expect(result.person).toMatchObject({
        year,
        branch,
        branchLabel,
        canChi,
        napAm,
      });
      expect(result.person.trait.trim().length).toBeGreaterThan(0);
      expect(result.partner.branches).toEqual(partnerBranches);
      expect([...result.partner.cautions].sort()).toEqual(cautionLabels(year));
    }
  );
});

describe('getLoveYearLookup — quan hệ địa chi và ngũ hành', () => {
  it('partner.branches là hợp duy nhất của tam hợp và lục hợp, không chứa chính tuổi đó', () => {
    for (let year = MIN_ZODIAC_YEAR; year <= MAX_ZODIAC_YEAR; year += 1) {
      const result = getLoveYearLookup(year, { currentYear: 2050 });
      const compatibility = getZodiacCompatibility(year);
      const expected = [
        ...new Set(
          [...compatibility.tamHop, compatibility.lucHop].map(
            (branch) => BRANCH_LABELS[branch]
          )
        ),
      ];

      expect(result.partner.branches).toEqual(expected);
      expect(new Set(result.partner.branches).size).toBe(result.partner.branches.length);
      expect(result.partner.branches).toHaveLength(3);
      expect(result.partner.branches).not.toContain(result.person.branchLabel);
    }
  });

  it('partner.elements là hai hành tương sinh theo cả hai chiều', () => {
    for (let year = MIN_ZODIAC_YEAR; year <= MAX_ZODIAC_YEAR; year += 1) {
      const result = getLoveYearLookup(year, { currentYear: 2050 });
      const [generator, generated] = sinhNeighbors(result.person.napAm.elementLabel);

      expect(result.partner.elements).toEqual([generator, generated]);
      expect(result.partner.elements).toHaveLength(2);
      expect(result.partner.elements).not.toContain(result.person.napAm.elementLabel);
      expect(ELEMENT_LABELS[result.person.napAm.element]).toBe(
        result.person.napAm.elementLabel
      );
    }
  });

  it('partner.cautions và guidance chỉ dùng nhóm tứ hành xung, không phải tam hợp/lục hợp', () => {
    for (let year = MIN_ZODIAC_YEAR; year <= MAX_ZODIAC_YEAR; year += 1) {
      const result = getLoveYearLookup(year, { currentYear: 2050 });
      const compatibility = getZodiacCompatibility(year);
      const xungLabels = compatibility.tuHanhXung.map((branch) => BRANCH_LABELS[branch]);

      expect([...result.partner.cautions].sort()).toEqual(cautionLabels(year));
      expect(result.partner.cautions).toHaveLength(3);

      xungLabels.forEach((label) => {
        expect(result.partner.guidance).toContain(label);
      });
      result.partner.branches.forEach((label) => {
        expect(result.partner.guidance).toContain(label);
      });
    }
  });
});

describe('getLoveYearLookup — cửa sổ năm thuận duyên và thận trọng', () => {
  const CURRENT_YEAR = 2050;

  it('chỉ trả về năm trong 12 năm kế tiếp và đúng nhóm chi', () => {
    for (let year = MIN_ZODIAC_YEAR; year <= MAX_ZODIAC_YEAR; year += 1) {
      const result = getLoveYearLookup(year, { currentYear: CURRENT_YEAR });
      const compatibility = getZodiacCompatibility(year);
      const favorableBranches = new Set([...compatibility.tamHop, compatibility.lucHop]);
      const cautiousBranches = new Set(compatibility.tuHanhXung);

      // Lục hợp của Dần/Hợi và Tỵ/Thân cũng nằm trong nhóm tứ hành xung,
      // nên năm thuận duyên chỉ còn 2 năm khi phải loại các năm thận trọng.
      const expectedFavorableCount = [...favorableBranches].filter(
        (branch) => !cautiousBranches.has(branch)
      ).length;
      expect(result.favorableYears).toHaveLength(expectedFavorableCount);
      expect(result.cautiousYears).toHaveLength(3);

      result.favorableYears.forEach((window) => {
        expect(window.year).toBeGreaterThanOrEqual(CURRENT_YEAR);
        expect(window.year).toBeLessThan(CURRENT_YEAR + 12);
        const { branch } = getYearCanChi(window.year);
        expect(favorableBranches.has(branch)).toBe(true);
        expect(cautiousBranches.has(branch)).toBe(false);
        expect(window.branchLabel).toBe(BRANCH_LABELS[branch]);
      });

      result.cautiousYears.forEach((window) => {
        expect(window.year).toBeGreaterThanOrEqual(CURRENT_YEAR);
        expect(window.year).toBeLessThan(CURRENT_YEAR + 12);
        const { branch } = getYearCanChi(window.year);
        expect(cautiousBranches.has(branch)).toBe(true);
        expect(window.branchLabel).toBe(BRANCH_LABELS[branch]);
      });

    }
  });

  it('favorableYears và cautiousYears tách rời nhau (hồi quy 1986 Dần)', () => {
    const result = getLoveYearLookup(1986, { currentYear: 2026 });
    const favorableYears = result.favorableYears.map((window) => window.year);
    const cautiousYears = result.cautiousYears.map((window) => window.year);
    const overlap = favorableYears.filter((year) => cautiousYears.includes(year));

    expect(overlap).toEqual([]);
    expect(favorableYears).not.toContain(2031);
    expect(cautiousYears).toContain(2031);
  });

  it('deterministic với cùng currentYear và đổi theo currentYear', () => {
    const first = getLoveYearLookup(1990, { currentYear: 2026 });
    const second = getLoveYearLookup(1990, { currentYear: 2026 });
    const later = getLoveYearLookup(1990, { currentYear: 2028 });

    expect(second).toEqual(first);
    expect(later.favorableYears).not.toEqual(first.favorableYears);
  });

  it('không trả về năm ngoài khoảng 1900–2099 ở biên', () => {
    for (const year of [MIN_ZODIAC_YEAR, MAX_ZODIAC_YEAR]) {
      const result = getLoveYearLookup(year, { currentYear: year });
      const windows = [...result.favorableYears, ...result.cautiousYears];

      windows.forEach((window) => {
        expect(window.year).toBeGreaterThanOrEqual(MIN_ZODIAC_YEAR);
        expect(window.year).toBeLessThanOrEqual(MAX_ZODIAC_YEAR);
      });
    }

    const nearUpperBound = getLoveYearLookup(1990, { currentYear: 2095 });
    [...nearUpperBound.favorableYears, ...nearUpperBound.cautiousYears].forEach((window) => {
      expect(window.year).toBeLessThanOrEqual(MAX_ZODIAC_YEAR);
    });
  });
});

describe('getLoveYearLookup — validation và nội dung', () => {
  it.each([1899, 2100, 1990.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'từ chối năm không hợp lệ: %s',
    (year) => {
      expect(() => getLoveYearLookup(year)).toThrow(RangeError);
      expect(() => getLoveYearLookup(year)).toThrow(/1900.*2099/);
    }
  );

  it('chấp nhận hai năm biên 1900 và 2099', () => {
    for (const year of [MIN_ZODIAC_YEAR, MAX_ZODIAC_YEAR]) {
      expect(() => getLoveYearLookup(year, { currentYear: year })).not.toThrow();
    }
  });

  it('summary và methodNote không rỗng, không có điểm số, không rơi vào fallback', () => {
    for (const year of [1900, 1990, 2000, 2099]) {
      const result = getLoveYearLookup(year, { currentYear: 2050 });

      expect(result.summary.trim().length).toBeGreaterThan(0);
      expect(result.methodNote.trim().length).toBeGreaterThan(0);
      expect(result.summary).toContain(result.person.canChi);
      expect(result.summary).toContain(result.person.napAm.name);
      expect(result.methodNote).toContain('Tính theo năm âm lịch');
      expect(result.methodNote).toContain('tham khảo');
      expect(result.methodNote).not.toContain('Chưa xác định');

      for (const text of [result.summary, result.methodNote, result.partner.guidance]) {
        expect(text).not.toMatch(/\b\d+(?:[.,]\d+)?\s*\/\s*(?:10|100)\b/);
        expect(text).not.toContain('/100');
        expect(text).not.toMatch(/điểm\s*(?:số)?\s*(?:\/|trên)/i);
      }
    }
  });
});
