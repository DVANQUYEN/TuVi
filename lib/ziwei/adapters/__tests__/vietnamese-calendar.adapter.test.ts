import { describe, it, expect } from 'vitest';
import { VietnameseCalendarAdapter } from '../vietnamese-calendar.adapter';
import { resolveZiweiConfig } from '../../config/config-resolver';
import type { BirthInfo } from '../../types/input';

function identityTime(birthInfo: BirthInfo): {
  effectiveDay: number;
  effectiveMonth: number;
  effectiveYear: number;
  effectiveHour: number;
} {
  return {
    effectiveDay: birthInfo.day,
    effectiveMonth: birthInfo.month,
    effectiveYear: birthInfo.year,
    effectiveHour: birthInfo.hour,
  };
}

describe('VietnameseCalendarAdapter', () => {
  const adapter = new VietnameseCalendarAdapter();
  const config = resolveZiweiConfig();

  it('converts lunar 1/3/2003 to solar 2/4/2003', () => {
    const birthInfo: BirthInfo = {
      gender: 'nam',
      calendarType: 'lunar',
      year: 2003,
      month: 3,
      day: 1,
      hour: 1,
      minute: 45,
    };

    const output = adapter.convert(birthInfo, identityTime(birthInfo), config);

    expect(output.lunarYear).toBe(2003);
    expect(output.lunarMonth).toBe(3);
    expect(output.lunarDay).toBe(1);
    expect(output.calendarResolution.solarDate).toBe('2/4/2003');
    expect(output.calendarResolution.lunarDate).toBe('1/3/2003');
  });

  it('converts solar 2/4/2003 to lunar 1/3/2003', () => {
    const birthInfo: BirthInfo = {
      gender: 'nam',
      calendarType: 'solar',
      year: 2003,
      month: 4,
      day: 2,
      hour: 1,
      minute: 45,
    };

    const output = adapter.convert(birthInfo, identityTime(birthInfo), config);

    expect(output.lunarYear).toBe(2003);
    expect(output.lunarMonth).toBe(3);
    expect(output.lunarDay).toBe(1);
    expect(output.calendarResolution.solarDate).toBe('2/4/2003');
    expect(output.calendarResolution.lunarDate).toBe('1/3/2003');
  });
});
