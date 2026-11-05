import { describe, it, expect } from 'vitest';
import { generateDailyHoroscope } from '../daily';
import { EARTHLY_BRANCHES } from '../types/enums';

describe('generateDailyHoroscope', () => {
  const sameDay = new Date(2026, 10, 4, 12, 0, 0);

  it('returns identical results for the same date (deterministic)', () => {
    for (const branch of EARTHLY_BRANCHES) {
      const a = generateDailyHoroscope(branch, sameDay);
      const b = generateDailyHoroscope(branch, new Date(2026, 10, 4, 12, 0, 0));
      expect(a).toEqual(b);
    }
  });

  it('formats date using local calendar day, not UTC', () => {
    // 00:30 local time on 5 Jan: toISOString() would give the previous day in UTC+7
    const earlyMorning = new Date(2026, 0, 5, 0, 30, 0);
    expect(generateDailyHoroscope('ty', earlyMorning).date).toBe('2026-01-05');
  });

  it('keeps all scores within 1-10', () => {
    for (const branch of EARTHLY_BRANCHES) {
      for (let day = 1; day <= 28; day++) {
        const h = generateDailyHoroscope(branch, new Date(2026, 2, day));
        for (const score of [h.overall, h.career, h.love, h.wealth, h.health]) {
          expect(score).toBeGreaterThanOrEqual(1);
          expect(score).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  it('returns 3 lucky numbers between 1 and 99 and a non-empty color list', () => {
    for (const branch of EARTHLY_BRANCHES) {
      const h = generateDailyHoroscope(branch, sameDay);
      expect(h.luckyNumbers).toHaveLength(3);
      for (const n of h.luckyNumbers) {
        expect(Number.isInteger(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(99);
      }
      expect(h.luckyColors.length).toBeGreaterThan(0);
      expect(h.advice.length).toBeGreaterThan(0);
    }
  });
});
