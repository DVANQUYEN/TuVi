import { describe, it, expect } from 'vitest';
import {
  TAN_BIEN_BRIGHTNESS_TABLE,
  getTanBienBrightness,
  validateTanBienTable,
} from '../brightness-tan-bien';
import { MAJOR_STAR_IDS, EARTHLY_BRANCHES } from '../../types/enums';
import { VIETNAM_PROVINCE_COORDS } from '../vietnam-timezones';
import { NAP_AM_60 } from '../stems-branches';
import { MAJOR_STAR_METADATA } from '../star-metadata';
import { PALACE_METADATA } from '../palace-metadata';

describe('brightness-tan-bien', () => {
  it('has all 14 major stars', () => {
    expect(Object.keys(TAN_BIEN_BRIGHTNESS_TABLE)).toHaveLength(14);
  });

  it('each star has all 12 branches', () => {
    for (const starId of MAJOR_STAR_IDS) {
      expect(Object.keys(TAN_BIEN_BRIGHTNESS_TABLE[starId])).toHaveLength(12);
    }
  });

  it('validateTanBienTable returns true', () => {
    expect(validateTanBienTable()).toBe(true);
  });

  it('getTanBienBrightness returns correct value', () => {
    // Tử Vi tại Sửu = Đắc (theo Tân Biên)
    expect(getTanBienBrightness('tuVi', 'suu')).toBe('dac');

    // Thiên Cơ tại Tý = Đắc
    expect(getTanBienBrightness('thienCo', 'ty')).toBe('dac');
  });

  it('contains only valid brightness levels for all 168 cells', () => {
    const validLevels = ['mieu', 'vuong', 'dac', 'binh', 'ham'];

    for (const starId of MAJOR_STAR_IDS) {
      for (const branch of EARTHLY_BRANCHES) {
        expect(validLevels).toContain(TAN_BIEN_BRIGHTNESS_TABLE[starId][branch]);
      }
    }
  });
});

describe('vietnam-timezones', () => {
  it('has all 63 provinces and municipalities', () => {
    expect(VIETNAM_PROVINCE_COORDS).toHaveLength(63);
  });

  it('has unique province ids', () => {
    const ids = VIETNAM_PROVINCE_COORDS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has valid longitude and latitude ranges', () => {
    for (const province of VIETNAM_PROVINCE_COORDS) {
      expect(province.longitude).toBeGreaterThanOrEqual(102);
      expect(province.longitude).toBeLessThanOrEqual(110);
      expect(province.latitude).toBeGreaterThanOrEqual(8);
      expect(province.latitude).toBeLessThanOrEqual(24);
    }
  });
});

describe('stems-branches', () => {
  it('has 60 Nap Am pairs', () => {
    expect(NAP_AM_60).toHaveLength(60);
  });
});

describe('star-metadata', () => {
  it('has metadata for all 14 major stars', () => {
    expect(MAJOR_STAR_METADATA).toHaveLength(14);
  });
});

describe('palace-metadata', () => {
  it('has metadata for all 12 palaces', () => {
    expect(PALACE_METADATA).toHaveLength(12);
  });
});
