import { describe, expect, it } from 'vitest';
import { decodeChartUrl, encodeChartUrl, generateChartId } from '../share';
import type { BirthInfo, UserPreferences } from '@/lib/ziwei/types';

const sampleBirthInfo: BirthInfo = {
  name: 'Nguyễn Văn A',
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  location: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

const samplePreferences: UserPreferences = {
  school: 'namPhai',
  yearBoundary: 'tet',
  useTrueSolarTime: true,
};

describe('share utilities', () => {
  it('generates a stable chart id from birth info', () => {
    const id1 = generateChartId(sampleBirthInfo);
    const id2 = generateChartId(sampleBirthInfo);

    expect(id1).toBe(id2);
    expect(id1).toHaveLength(12);
  });

  it('round-trips birth info through encode/decode', () => {
    const shareData = {
      chartId: generateChartId(sampleBirthInfo),
      birthInfo: sampleBirthInfo,
      preferences: samplePreferences,
    };

    const url = encodeChartUrl(shareData);
    const dataParam = url.split('?data=')[1];
    const decoded = decodeChartUrl(dataParam);

    expect(decoded).not.toBeNull();
    expect(decoded?.birthInfo).toEqual(sampleBirthInfo);
    expect(decoded?.preferences).toEqual(samplePreferences);
    expect(decoded?.chartId).toBe(shareData.chartId);
  });

  it('round-trips without optional preferences', () => {
    const shareData = {
      chartId: generateChartId(sampleBirthInfo),
      birthInfo: sampleBirthInfo,
    };

    const url = encodeChartUrl(shareData);
    const dataParam = url.split('?data=')[1];
    const decoded = decodeChartUrl(dataParam);

    expect(decoded?.birthInfo).toEqual(sampleBirthInfo);
    expect(decoded?.preferences).toBeUndefined();
  });

  it('handles vietnamese characters in names', () => {
    const birthInfo: BirthInfo = {
      ...sampleBirthInfo,
      name: 'Trần Thị Bích Ngọc',
    };

    const shareData = {
      chartId: generateChartId(birthInfo),
      birthInfo,
    };

    const url = encodeChartUrl(shareData);
    const dataParam = url.split('?data=')[1];
    const decoded = decodeChartUrl(dataParam);

    expect(decoded?.birthInfo.name).toBe('Trần Thị Bích Ngọc');
  });

  it('returns null for invalid data', () => {
    expect(decodeChartUrl('not-valid-base64!!!')).toBeNull();
    expect(decodeChartUrl('')).toBeNull();
  });
});
