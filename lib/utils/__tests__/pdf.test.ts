import { describe, expect, it } from 'vitest';
import { generateChartPdf } from '../pdf';
import { createChartEngine } from '@/lib/ziwei/engine';
import type { BirthInfo } from '@/lib/ziwei/types';

const sampleBirthInfo: BirthInfo = {
  name: 'Đương số mẫu',
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

const chart = createChartEngine().generateChart(sampleBirthInfo);

describe('pdf export', () => {
  it('generates a valid multi-page PDF blob from a chart', async () => {
    const blob = generateChartPdf(chart);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(1000);

    const content = await blob.text();

    expect(content.startsWith('%PDF-')).toBe(true);
    expect(content.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(content.match(/\/Type \/Page\b/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it('strips Vietnamese diacritics for the built-in Helvetica font', async () => {
    const content = await generateChartPdf(chart).text();

    expect(content).toContain('Duong so mau');
    expect(content).not.toContain('Đương số mẫu');
  });
});
