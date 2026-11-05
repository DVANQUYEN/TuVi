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

  it('rejects invalid birth info', () => {
    const engine = createChartEngine();

    expect(() => engine.generateChart({ ...sampleBirthInfo, year: 1800 })).toThrow();
  });
});
