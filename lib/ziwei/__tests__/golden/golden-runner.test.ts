import { describe, it, expect } from 'vitest';
import { createChartEngine } from '../../engine/sao-menh.engine';
import type { BirthInfo } from '../../types/input';
import { ALL_FIXTURES } from './fixtures';

describe('Golden Fixtures', () => {
  const engine = createChartEngine();

  for (const fixture of ALL_FIXTURES) {
    it(`fixture ${fixture.id}: ${fixture.description}`, () => {
      const chart = engine.generateChart(fixture.birthInfo as BirthInfo);

      expect(chart.heavenPlate.effectiveLunarDate.year).toBe(fixture.expected.lunarDate.year);
      expect(chart.heavenPlate.effectiveLunarDate.month).toBe(fixture.expected.lunarDate.month);
      expect(chart.heavenPlate.effectiveLunarDate.day).toBe(fixture.expected.lunarDate.day);
      expect(chart.heavenPlate.effectiveLunarDate.isLeapMonthOriginal).toBe(
        fixture.expected.lunarDate.isLeapMonth
      );

      expect(chart.heavenPlate.fourPillars.year.label).toBe(fixture.expected.fourPillars.year);
      expect(chart.heavenPlate.fourPillars.month.label).toBe(fixture.expected.fourPillars.month);
      expect(chart.heavenPlate.fourPillars.day.label).toBe(fixture.expected.fourPillars.day);
      expect(chart.heavenPlate.fourPillars.hour.label).toBe(fixture.expected.fourPillars.hour);

      expect(chart.heavenPlate.soulPalaceBranch).toBe(fixture.expected.soulPalaceBranch);
      expect(chart.heavenPlate.bodyPalaceBranch).toBe(fixture.expected.bodyPalaceBranch);

      expect(chart.heavenPlate.fiveElementsClass.name).toBe(
        fixture.expected.fiveElementsClass.name
      );
      expect(chart.heavenPlate.fiveElementsClass.element).toBe(
        fixture.expected.fiveElementsClass.element
      );
      expect(chart.heavenPlate.fiveElementsClass.number).toBe(
        fixture.expected.fiveElementsClass.number
      );

      expect(chart.heavenPlate.soulLord).toBe(fixture.expected.soulLord);
      expect(chart.heavenPlate.bodyLord).toBe(fixture.expected.bodyLord);

      expect(chart.tuanTriet.tuan.branches).toEqual(fixture.expected.tuanBranches);
      expect(chart.tuanTriet.triet.branches).toEqual(fixture.expected.trietBranches);

      const actualMajorStarsByPalace: Record<string, string[]> = {};
      for (const palace of chart.palaces) {
        actualMajorStarsByPalace[palace.branch] = palace.majorStars.map((s) => s.id);
      }
      expect(actualMajorStarsByPalace).toEqual(fixture.expected.majorStarsByPalace);

      for (const [starId, expectedBrightness] of Object.entries(fixture.expected.brightness)) {
        const palace = chart.palaces.find((p) => p.majorStars.some((s) => s.id === starId));
        if (!palace) {
          throw new Error(`Star ${starId} not found in any palace for fixture ${fixture.id}`);
        }
        const star = palace.majorStars.find((s) => s.id === starId);
        expect(star?.brightness).toBe(expectedBrightness);
      }
    });
  }
});
