import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createChartEngine } from '@/lib/ziwei/engine';
import { getDailyCalendar } from '@/components/horoscope/daily-calendar';
import { buildPersonalizedDaily } from '@/lib/ziwei/interpretation/daily-personal';
import type { BirthInfo } from '@/lib/ziwei/types';

const SAMPLE_BIRTH_INFO: BirthInfo = {
  name: 'Mẫu 18/7/2004',
  gender: 'nam',
  calendarType: 'solar',
  year: 2004,
  month: 7,
  day: 18,
  hour: 13,
  minute: 0,
  location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
};

it('dump', () => {
  const chart = createChartEngine().generateChart(SAMPLE_BIRTH_INFO);
  const iso = '2004-07-18';
  const calendar = getDailyCalendar(iso);
  const result = buildPersonalizedDaily(chart, new Date(2004, 6, 18), calendar);
  const starPalaces = chart.palaces.map((p) => ({
    name: p.name,
    branch: p.branch,
    stars: [...p.majorStars, ...p.auspiciousStars, ...p.maleficStars, ...p.otherStars]
      .filter((s) => /Kình|Đà|Lộc/.test(s.name))
      .map((s) => s.name),
  }));
  writeFileSync('tmp-inspect-output5.json', JSON.stringify({ calendar, annual: result.annual, starPalaces }, null, 2), 'utf8');
});
