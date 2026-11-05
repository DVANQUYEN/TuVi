import { describe, it, expect } from 'vitest';
import type { BirthInfo } from '../../types/input';
import type { UserPreferences } from '../../types/config';
import { resolveZiweiConfig } from '../config-resolver';
import { defaultZiweiConfig } from '../default-config';
import { validateBirthInfo, validateUserPreferences } from '../schema';

describe('resolveZiweiConfig', () => {
  it('returns default config when no preferences provided', (): void => {
    const resolved = resolveZiweiConfig();

    expect(resolved.school).toBe('namPhai');
    expect(resolved.dayBoundary).toBe('23:00');
    expect(resolved.leapMonth).toBe('split15');
    expect(resolved.yearBoundary).toBe('tet');
    expect(resolved.tuanTrietPrimary).toBe('none');
    expect(resolved.useTrueSolarTime).toBe(false);
    expect(resolved.useVietnameseBrightnessTable).toBe(true);
    expect(resolved.standardMeridian).toBe(defaultZiweiConfig.trueSolarTime.standardMeridian);
  });

  it('overrides defaults with user preferences', (): void => {
    const resolved = resolveZiweiConfig({
      school: 'trungChau',
      dayBoundary: '00:00',
      useTrueSolarTime: true,
    });

    expect(resolved.school).toBe('trungChau');
    expect(resolved.dayBoundary).toBe('00:00');
    expect(resolved.useTrueSolarTime).toBe(true);
    // Others still default
    expect(resolved.leapMonth).toBe('split15');
  });

  it('throws on invalid preferences', (): void => {
    expect(() => resolveZiweiConfig({ school: 'invalid' } as unknown as UserPreferences)).toThrow();
  });
});

describe('validateBirthInfo', () => {
  it('accepts a valid solar birth info', (): void => {
    const data: BirthInfo = {
      gender: 'nam',
      calendarType: 'solar',
      year: 1990,
      month: 6,
      day: 15,
      hour: 10,
      minute: 30,
      location: {
        region: 'north',
        longitude: 105.8,
      },
    };

    expect(validateBirthInfo(data)).toEqual(data);
  });

  it('fills default calendar type when omitted', (): void => {
    const data = {
      gender: 'nu',
      year: 2000,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
    };

    const result = validateBirthInfo(data);
    expect(result.calendarType).toBe('solar');
  });

  it('throws on invalid birth info', (): void => {
    expect(() => validateBirthInfo({ year: 1800 } as unknown as BirthInfo)).toThrow();
  });
});

describe('validateUserPreferences', () => {
  it('accepts valid preferences', (): void => {
    const prefs: UserPreferences = {
      school: 'trungChau',
      useTrueSolarTime: true,
    };

    expect(validateUserPreferences(prefs)).toEqual(prefs);
  });

  it('throws on invalid preferences', (): void => {
    expect(() =>
      validateUserPreferences({ leapMonth: 'invalid' } as unknown as UserPreferences)
    ).toThrow();
  });
});
