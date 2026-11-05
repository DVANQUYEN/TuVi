import { describe, it, expect } from 'vitest';
import { getZodiacCompatibility, MAX_ZODIAC_YEAR, MIN_ZODIAC_YEAR } from '../zodiac-compatibility';

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
