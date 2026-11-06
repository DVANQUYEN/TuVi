import { describe, it, expect } from 'vitest';
import {
  BRANCH_LABELS,
  getBranchExampleYears,
  getZodiacCompatibility,
  LUC_HOP_PAIRS,
  MAX_ZODIAC_YEAR,
  MIN_ZODIAC_YEAR,
  TAM_HOP_GROUPS,
  TU_HANH_XUNG_GROUPS,
} from '../zodiac-compatibility';
import type { EarthlyBranch } from '../types/enums';

describe('getZodiacCompatibility', () => {
  it('năm 1990 (Ngọ): tam hợp Dần-Tuất, lục hợp Mùi, tứ hành xung Tý-Mão-Dậu', () => {
    const result = getZodiacCompatibility(1990);

    expect(result.branch).toBe('ngo');
    expect(result.branchLabel).toBe('Ngọ');
    expect([...result.tamHop].sort()).toEqual(['dan', 'tuat'].sort());
    expect(result.lucHop).toBe('mui');
    expect([...result.tuHanhXung].sort()).toEqual(['dau', 'mao', 'ty'].sort());
  });

  it('năm 2000 (Thìn): tam hợp Thân-Tý, lục hợp Dậu, tứ hành xung Tuất-Sửu-Mùi', () => {
    const result = getZodiacCompatibility(2000);

    expect(result.branch).toBe('thin');
    expect(result.branchLabel).toBe('Thìn');
    expect([...result.tamHop].sort()).toEqual(['than', 'ty'].sort());
    expect(result.lucHop).toBe('dau');
    expect([...result.tuHanhXung].sort()).toEqual(['mui', 'suu', 'tuat'].sort());
  });

  it('mọi năm đều cho 2 tam hợp, 1 lục hợp và 3 tứ hành xung, không chứa chính tuổi đó', () => {
    for (let year = MIN_ZODIAC_YEAR; year <= MAX_ZODIAC_YEAR; year++) {
      const result = getZodiacCompatibility(year);
      expect(result.tamHop).toHaveLength(2);
      expect(result.tuHanhXung).toHaveLength(3);
      expect(result.tamHop).not.toContain(result.branch);
      expect(result.tuHanhXung).not.toContain(result.branch);
      expect(result.lucHop).not.toBe(result.branch);
    }
  });

  it.each([1899, 2100, 1990.5, Number.NaN])('từ chối năm không hợp lệ: %s', (year) => {
    expect(() => getZodiacCompatibility(year)).toThrow(RangeError);
  });
});

describe('getBranchExampleYears', () => {
  it('trả về đúng bộ năm mặc định cho Tý, Thìn và Hợi', () => {
    expect(getBranchExampleYears('ty')).toEqual([1984, 1996, 2008, 2020]);
    expect(getBranchExampleYears('thin')).toEqual([1988, 2000, 2012, 2024]);
    expect(getBranchExampleYears('hoi')).toEqual([1995, 2007, 2019, 2031]);
  });

  it('tôn trọng startYear và count', () => {
    expect(getBranchExampleYears('thin', { startYear: 2000, count: 2 })).toEqual([2000, 2012]);
    expect(getBranchExampleYears('ty', { startYear: 2001, count: 3 })).toEqual([2008, 2020, 2032]);
    expect(getBranchExampleYears('hoi', { count: 2 })).toEqual([1995, 2007]);
  });

  it('kẹp startYear trong khoảng 1900–2099 và không vượt quá MAX_ZODIAC_YEAR', () => {
    expect(getBranchExampleYears('thin', { startYear: 1800, count: 2 })).toEqual([1904, 1916]);
    expect(getBranchExampleYears('mui', { startYear: 3000, count: 5 })).toEqual([2099]);

    const years = getBranchExampleYears('ty', { count: 100 });
    expect(years[0]).toBe(1984);
    expect(years).toHaveLength(10);
    expect(years.every((year) => year >= MIN_ZODIAC_YEAR && year <= MAX_ZODIAC_YEAR)).toBe(true);
    expect(years.every((year, index) => index === 0 || year - years[index - 1] === 12)).toBe(true);
  });

  it.each(['khong-hop-le', '', 'TY'])('từ chối địa chi không hợp lệ: %s', (branch) => {
    expect(() => getBranchExampleYears(branch as EarthlyBranch)).toThrow(RangeError);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'từ chối số năm không hợp lệ: %s',
    (count) => {
      expect(() => getBranchExampleYears('ty', { count })).toThrow(RangeError);
    }
  );

  it('từ chối startYear không phải số nguyên', () => {
    expect(() => getBranchExampleYears('ty', { startYear: 1990.5 })).toThrow(RangeError);
  });
});

describe('nhóm địa chi xuất khẩu', () => {
  it('tam hợp có 4 nhóm 3 tuổi đúng thứ tự', () => {
    expect(TAM_HOP_GROUPS).toEqual([
      ['than', 'ty', 'thin'],
      ['dan', 'ngo', 'tuat'],
      ['hoi', 'mao', 'mui'],
      ['ti', 'dau', 'suu'],
    ]);
    expect(TAM_HOP_GROUPS).toHaveLength(4);
    TAM_HOP_GROUPS.forEach((group) => expect(group).toHaveLength(3));
  });

  it('lục hợp có 6 cặp đúng thứ tự', () => {
    expect(LUC_HOP_PAIRS).toEqual([
      ['ty', 'suu'],
      ['dan', 'hoi'],
      ['mao', 'tuat'],
      ['thin', 'dau'],
      ['ti', 'than'],
      ['ngo', 'mui'],
    ]);
    expect(LUC_HOP_PAIRS).toHaveLength(6);
    LUC_HOP_PAIRS.forEach((pair) => expect(pair).toHaveLength(2));
  });

  it('tứ hành xung có 3 nhóm 4 tuổi đúng thứ tự', () => {
    expect(TU_HANH_XUNG_GROUPS).toEqual([
      ['ty', 'ngo', 'mao', 'dau'],
      ['dan', 'than', 'ti', 'hoi'],
      ['thin', 'tuat', 'suu', 'mui'],
    ]);
    expect(TU_HANH_XUNG_GROUPS).toHaveLength(3);
    TU_HANH_XUNG_GROUPS.forEach((group) => expect(group).toHaveLength(4));
  });

  it('mỗi cách nhóm dùng đủ 12 địa chi, không trùng lặp', () => {
    const allBranches = Object.keys(BRANCH_LABELS).sort();

    [TAM_HOP_GROUPS, LUC_HOP_PAIRS, TU_HANH_XUNG_GROUPS].forEach((groups) => {
      const flattened = groups.flat();
      expect(flattened).toHaveLength(12);
      expect(new Set(flattened).size).toBe(12);
      expect([...flattened].sort()).toEqual(allBranches);
    });
  });
});
