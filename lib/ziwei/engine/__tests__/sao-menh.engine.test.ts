import { describe, it, expect } from 'vitest';
import { createChartEngine } from '../sao-menh.engine';
import type { BirthInfo } from '../../types/input';

const sampleBirthInfo: BirthInfo = {
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
};

describe('SaoMenhChartEngine', () => {
  it('creates engine instance', () => {
    const engine = createChartEngine();
    expect(engine.engineName).toBe('SaoMenhChartEngine');
    expect(engine.engineVersion).toBe('1.0.0');
  });

  it('returns default config', () => {
    const engine = createChartEngine();
    const config = engine.getDefaultConfig();

    expect(config.school.default).toBe('namPhai');
    expect(config.dayBoundary.default).toBe('23:00');
    expect(config.brightness.useVietnameseTable).toBe(true);
  });

  it('resolves config with defaults', () => {
    const engine = createChartEngine();
    const resolved = engine.resolveConfig();

    expect(resolved.school).toBe('namPhai');
    expect(resolved.dayBoundary).toBe('23:00');
    expect(resolved.useTrueSolarTime).toBe(false);
  });

  it('resolves config with user preferences', () => {
    const engine = createChartEngine();
    const resolved = engine.resolveConfig({
      school: 'trungChau',
      useTrueSolarTime: true,
    });

    expect(resolved.school).toBe('trungChau');
    expect(resolved.useTrueSolarTime).toBe(true);
  });

  it('generates a complete chart from birth info (end-to-end)', () => {
    const engine = createChartEngine();
    const chart = engine.generateChart(sampleBirthInfo);

    expect(chart.schemaVersion).toBe('1.0.0');
    expect(chart.birthInfo).toEqual(sampleBirthInfo);
    expect(chart.palaces).toHaveLength(12);
    expect(chart.appliedConfig.school).toBe('namPhai');
    expect(chart.appliedConfig.dayBoundary).toBe('23:00');
    expect(chart.appliedConfig.useTrueSolarTime).toBe(false);
    expect(chart.heavenPlate.effectiveSolarDateStr).toBe('15/5/1990');
  });

  it('returns a complete audit trail', () => {
    const engine = createChartEngine();
    const chart = engine.generateChart(sampleBirthInfo);

    expect(chart.auditTrail.engineVersion).toBe('1.0.0');
    expect(chart.auditTrail.configApplied).toEqual(chart.appliedConfig);
    expect(chart.auditTrail.steps.map((step) => step.step)).toEqual([
      'resolveConfig',
      'trueSolarTime',
      'vietnameseCalendar',
      'iztroEngine',
    ]);
    expect(chart.auditTrail.timeAdjustments).toBeInstanceOf(Array);
    expect(chart.auditTrail.calendarResolution.solarDate).toBe('15/5/1990');
    expect(Number.isFinite(chart.auditTrail.totalDuration)).toBe(true);
    expect(chart.auditTrail.totalDuration).toBeGreaterThanOrEqual(0);
  });

  it('returns the cached chart for identical input', () => {
    const engine = createChartEngine();
    const first = engine.generateChart(sampleBirthInfo);
    const second = engine.generateChart(sampleBirthInfo);

    expect(second).toBe(first);
  });

  it('does not reuse the cached chart when preferences differ', () => {
    const engine = createChartEngine();
    const first = engine.generateChart(sampleBirthInfo);
    const second = engine.generateChart(sampleBirthInfo, { useTrueSolarTime: true });

    expect(second).not.toBe(first);
    expect(second.appliedConfig.useTrueSolarTime).toBe(true);
    expect(second.auditTrail.steps.map((step) => step.step)).toContain('trueSolarTime');
  });

  it('refreshes the display identity on a cache hit when only the name changes', () => {
    const engine = createChartEngine();
    const first = engine.generateChart({ ...sampleBirthInfo, name: 'Nguyễn A' });
    const second = engine.generateChart({ ...sampleBirthInfo, name: 'Nguyễn B' });

    expect(second).not.toBe(first);
    expect(second.birthInfo.name).toBe('Nguyễn B');
    expect(second.heavenPlate.name).toBe('Nguyễn B');
    expect(second.palaces).toBe(first.palaces);
    expect(second.heavenPlate.effectiveSolarDateStr).toBe(first.heavenPlate.effectiveSolarDateStr);

    expect(first.birthInfo.name).toBe('Nguyễn A');
    expect(first.heavenPlate.name).toBe('Nguyễn A');

    const third = engine.generateChart({ ...sampleBirthInfo, name: 'Nguyễn B' });
    expect(third).toBe(second);
    expect(third.birthInfo.name).toBe('Nguyễn B');
    expect(third.heavenPlate.name).toBe('Nguyễn B');
  });

  it('does not reuse the cached chart when isLeapMonthInput differs', () => {
    const engine = createChartEngine();
    const lunarBirthInfo: BirthInfo = {
      ...sampleBirthInfo,
      calendarType: 'lunar',
      year: 1990,
      month: 5,
      day: 15,
    };

    const first = engine.generateChart({ ...lunarBirthInfo, isLeapMonthInput: false });
    const second = engine.generateChart({ ...lunarBirthInfo, isLeapMonthInput: true });

    expect(second).not.toBe(first);
    expect(second.palaces).not.toBe(first.palaces);
  });

  it('does not reuse the cached chart when viewingYear differs', () => {
    const engine = createChartEngine();
    const first = engine.generateChart(sampleBirthInfo);
    const second = engine.generateChart({ ...sampleBirthInfo, viewingYear: 2026 });

    expect(second).not.toBe(first);
    expect(second.periods.find((period) => period.type === 'luuNien')?.solarYear).toBe(2026);
  });

  it('does not reuse the cached chart when location region differs', () => {
    const engine = createChartEngine();
    const base = { ...sampleBirthInfo, year: 1970 };
    const north = engine.generateChart({
      ...base,
      location: { region: 'north', longitude: 105.8542 },
    });
    const south = engine.generateChart({
      ...base,
      location: { region: 'south', longitude: 105.8542 },
    });

    expect(south).not.toBe(north);
    expect(south.palaces).not.toBe(north.palaces);
  });

  it('does not reuse the cached chart when tuanTrietPrimary differs', () => {
    const engine = createChartEngine();
    const first = engine.generateChart(sampleBirthInfo);
    const second = engine.generateChart(sampleBirthInfo, { tuanTrietPrimary: 'first' });

    expect(second).not.toBe(first);
    expect(second.appliedConfig.tuanTrietPrimary).toBe('first');
  });

  it('does not reuse the cached chart when applyHistoricalTimezone differs', () => {
    const engine = createChartEngine();
    const first = engine.generateChart(sampleBirthInfo);
    const second = engine.generateChart(sampleBirthInfo, { applyHistoricalTimezone: false });

    expect(second).not.toBe(first);
    expect(second.appliedConfig.applyHistoricalTimezone).toBe(false);
  });

  it('rejects invalid birth info', () => {
    const engine = createChartEngine();

    expect(() => engine.generateChart({ ...sampleBirthInfo, year: 1800 })).toThrow();
  });

  it('produces the same chart for lunar 1/3/2003 and solar 2/4/2003', () => {
    const engine = createChartEngine();
    const lunarBirthInfo: BirthInfo = {
      name: 'Hồ Xuân Huy',
      gender: 'nam',
      calendarType: 'lunar',
      year: 2003,
      month: 3,
      day: 1,
      hour: 1,
      minute: 45,
      location: { region: 'north', longitude: 105.8542 },
    };
    const solarBirthInfo: BirthInfo = {
      ...lunarBirthInfo,
      calendarType: 'solar',
      month: 4,
      day: 2,
    };

    const lunarChart = engine.generateChart(lunarBirthInfo);
    const solarChart = engine.generateChart(solarBirthInfo);

    for (const chart of [lunarChart, solarChart]) {
      expect(chart.auditTrail.calendarResolution.solarDate).toBe('2/4/2003');
      expect(chart.auditTrail.calendarResolution.lunarDate).toBe('1/3/2003');
      expect(chart.heavenPlate.effectiveLunarDate).toMatchObject({
        year: 2003,
        month: 3,
        day: 1,
        isLeapMonthOriginal: false,
      });
      expect(chart.heavenPlate.soulPalaceBranch).toBe('mao');
      expect(chart.heavenPlate.soulLord).toBe('Văn Khúc');
      expect(chart.heavenPlate.bodyLord).toBe('Thiên Tướng');
      expect(chart.heavenPlate.fiveElementsClass).toMatchObject({
        name: 'Thủy Nhị Cục',
        element: 'thuy',
        number: 2,
      });
      expect(chart.heavenPlate.napAm).toEqual({ name: 'Dương Liễu Mộc', element: 'moc' });

      const menhPalace = chart.palaces.find((palace) => palace.id === 'menh');
      expect(menhPalace?.branch).toBe('mao');
      expect(menhPalace?.majorStars.map((star) => star.id)).toContain('thienPhu');
    }

    const majorsByPalace = (chart: (typeof lunarChart)): Record<string, string[]> =>
      Object.fromEntries(
        chart.palaces.map((palace) => [palace.branch, palace.majorStars.map((star) => star.id)])
      );
    expect(majorsByPalace(lunarChart)).toEqual(majorsByPalace(solarChart));
  });

  it('resolves Nạp Âm from the year Can Chi', () => {
    const engine = createChartEngine();
    const cases: Array<[year: number, expected: string]> = [
      [2003, 'Dương Liễu Mộc'],
      [1984, 'Hải Trung Kim'],
      [2000, 'Bạch Lạp Kim'],
    ];

    for (const [year, expected] of cases) {
      const chart = engine.generateChart({
        gender: 'nam',
        calendarType: 'solar',
        year,
        month: 7,
        day: 15,
        hour: 12,
        minute: 0,
      });

      expect(chart.heavenPlate.napAm.name).toBe(expected);
    }
  });
});
