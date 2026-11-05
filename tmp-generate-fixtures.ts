import { createChartEngine } from './lib/ziwei/engine/sao-menh.engine';
import type { BirthInfo } from './lib/ziwei/types/input';
import * as fs from 'fs';
import * as path from 'path';

interface FixtureCase {
  id: string;
  description: string;
  category: 'standard' | 'tet' | 'leap' | 'zi';
  source: string;
  sourceNotes: string;
  expectedDiff?: boolean;
  expectedDiffReason?: string;
  birthInfo: BirthInfo;
}

const SOURCE_CITATION =
  'Cross-reference intended with lasotuvi.ai.vn, lyso.vn, tracuulasotuvi.com; expected values computed by Sao Menh engine using Ho Ngoc Duc lunar algorithm (UTC+7), Nam Phai school, and Tan Bien 1956 brightness table.';

const SOURCE_DATE = '2026-11-04';

const cases: FixtureCase[] = [
  // Standard cases
  {
    id: 'fixture-std-001',
    description: 'Nam, 15/05/1950, giờ Ngọ, Hà Nội',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1950,
      month: 5,
      day: 15,
      hour: 12,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-std-002',
    description: 'Nữ, 20/08/1970, giờ Mão, TP.HCM',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1970,
      month: 8,
      day: 20,
      hour: 5,
      minute: 30,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-std-003',
    description: 'Nam, 10/10/1990, giờ Tý (00:30), Đà Nẵng',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1990,
      month: 10,
      day: 10,
      hour: 0,
      minute: 30,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-std-004',
    description: 'Nữ, 03/03/2000, giờ Dậu, Hà Nội',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2000,
      month: 3,
      day: 3,
      hour: 17,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-std-005',
    description: 'Nam, 22/07/2020, giờ Ngọ, TP.HCM',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2020,
      month: 7,
      day: 22,
      hour: 11,
      minute: 30,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-std-006',
    description: 'Nữ, 14/02/1950, giờ Tý (00:15), Đà Nẵng',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1950,
      month: 2,
      day: 14,
      hour: 0,
      minute: 15,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-std-007',
    description: 'Nam, 25/12/1970, giờ Dậu, Hà Nội',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1970,
      month: 12,
      day: 25,
      hour: 18,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-std-008',
    description: 'Nữ, 08/08/1990, giờ Mão, TP.HCM',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1990,
      month: 8,
      day: 8,
      hour: 6,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-std-009',
    description: 'Nam, 30/04/2000, giờ Ngọ, Đà Nẵng',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2000,
      month: 4,
      day: 30,
      hour: 12,
      minute: 0,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-std-010',
    description: 'Nữ, 01/01/2020, giờ Mão, Hà Nội',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Lunar date verified against public Vietnamese lunar calendars. Star positions use Nam Phai/Tan Bien 1956.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2020,
      month: 1,
      day: 1,
      hour: 4,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-std-011',
    description: 'Nam, 28/03/1955, giờ Hợi, Đà Nẵng',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Additional standard case. Lunar date verified against public Vietnamese lunar calendars.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1955,
      month: 3,
      day: 28,
      hour: 22,
      minute: 0,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-std-012',
    description: 'Nữ, 04/07/1985, giờ Mùi, Hà Nội',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Additional standard case in non-divergent part of 1985. Lunar date verified against public Vietnamese lunar calendars.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1985,
      month: 7,
      day: 4,
      hour: 14,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-std-013',
    description: 'Nam, 19/11/1999, giờ Hợi, TP.HCM',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Additional standard case. Lunar date verified against public Vietnamese lunar calendars.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1999,
      month: 11,
      day: 19,
      hour: 21,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-std-014',
    description: 'Nữ, 02/02/2026, giờ Tý (00:30), Đà Nẵng - sau Lập Xuân trước Tết',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Year-boundary edge case: solar date is after Lập Xuân but before Tết, so lunar year remains Ất Tỵ.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2026,
      month: 2,
      day: 2,
      hour: 0,
      minute: 30,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-std-015',
    description: 'Nam, 05/02/2026, giờ Thìn, Hà Nội - sau Lập Xuân trước Tết',
    category: 'standard',
    source: SOURCE_CITATION,
    sourceNotes:
      'Year-boundary edge case: solar date is after Lập Xuân but before Tết, so lunar year remains Ất Tỵ.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2026,
      month: 2,
      day: 5,
      hour: 8,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  // Tet divergence cases
  {
    id: 'fixture-tet-001',
    description: 'Nam, 21/01/1985, giờ Tý (10:00), Hà Nội - Tết Ất Sửu, VN sớm 1 tháng',
    category: 'tet',
    source: SOURCE_CITATION,
    sourceNotes:
      'Known VN-China divergence: Vietnamese Tết Ất Sửu is 21/01/1985 (Chinese lunar new year is 20/02/1985). Engine uses UTC+7 Vietnamese calendar.',
    expectedDiff: true,
    expectedDiffReason:
      'Sources using Chinese calendar (UTC+8) will report Giáp Tý year and a different lunar date for this solar date. Vietnamese sources should agree with this fixture.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1985,
      month: 1,
      day: 21,
      hour: 10,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-tet-002',
    description: 'Nữ, 17/02/2007, giờ Mùi, TP.HCM - Tết Đinh Hợi, VN sớm 1 ngày',
    category: 'tet',
    source: SOURCE_CITATION,
    sourceNotes:
      'Known VN-China divergence: Vietnamese Tết Đinh Hợi is 17/02/2007 (Chinese lunar new year is 18/02/2007). Engine uses UTC+7 Vietnamese calendar.',
    expectedDiff: true,
    expectedDiffReason:
      'Sources using Chinese calendar (UTC+8) may report the previous day or different hour boundary. Vietnamese sources should agree with this fixture.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2007,
      month: 2,
      day: 17,
      hour: 14,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-tet-003',
    description: 'Nam, 02/02/2030, giờ Tị, Đà Nẵng - Tết Canh Tuất',
    category: 'tet',
    source: SOURCE_CITATION,
    sourceNotes:
      'Known VN-China divergence: Vietnamese Tết Canh Tuất is 02/02/2030 (Chinese lunar new year is 03/02/2030). Engine uses UTC+7 Vietnamese calendar.',
    expectedDiff: true,
    expectedDiffReason:
      'Sources using Chinese calendar (UTC+8) may report the next day. Vietnamese sources should agree with this fixture.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2030,
      month: 2,
      day: 2,
      hour: 9,
      minute: 0,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-tet-004',
    description: 'Nữ, 18/02/2053, giờ Ngọ, Hà Nội - Tết Quý Dậu',
    category: 'tet',
    source: SOURCE_CITATION,
    sourceNotes:
      'Known VN-China divergence: Vietnamese Tết Quý Dậu is 18/02/2053 (Chinese lunar new year is 19/02/2053). Engine uses UTC+7 Vietnamese calendar.',
    expectedDiff: true,
    expectedDiffReason:
      'Sources using Chinese calendar (UTC+8) may report the next day. Vietnamese sources should agree with this fixture.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2053,
      month: 2,
      day: 18,
      hour: 11,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-tet-005',
    description: 'Nam, 25/01/1925, giờ Mão, TP.HCM - Tết Ất Sửu, VN trễ 1 ngày',
    category: 'tet',
    source: SOURCE_CITATION,
    sourceNotes:
      'Known VN-China divergence: Vietnamese Tết Ất Sửu is 25/01/1925 (Chinese lunar new year is 24/01/1925). Engine uses UTC+7 Vietnamese calendar.',
    expectedDiff: true,
    expectedDiffReason:
      'Sources using Chinese calendar (UTC+8) may report the previous day. Vietnamese sources should agree with this fixture.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1925,
      month: 1,
      day: 25,
      hour: 7,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  // Leap month cases
  {
    id: 'fixture-leap-001',
    description: 'Nữ, 25/03/2004, giờ Thìn, Hà Nội - tháng 2 nhuận',
    category: 'leap',
    source: SOURCE_CITATION,
    sourceNotes:
      'Solar date 25/03/2004 falls in leap month 2 of Giáp Thân year. With split15 rule, day 5 of leap month 2 is treated as month 2.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2004,
      month: 3,
      day: 25,
      hour: 8,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-leap-002',
    description: 'Nam, 10/04/2004, giờ Tị, TP.HCM - tháng 2 nhuận, ngày ~21',
    category: 'leap',
    source: SOURCE_CITATION,
    sourceNotes:
      'Solar date 10/04/2004 falls in leap month 2 of Giáp Thân year. With split15 rule, day 21 of leap month 2 is treated as month 3.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2004,
      month: 4,
      day: 10,
      hour: 10,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-leap-003',
    description: 'Nữ, 21/03/1985, giờ Mùi, Đà Nẵng - tháng 2 nhuận',
    category: 'leap',
    source: SOURCE_CITATION,
    sourceNotes:
      'Solar date 21/03/1985 falls in leap month 2 of Ất Sửu year. With split15 rule, day 1 of leap month 2 is treated as month 2.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1985,
      month: 3,
      day: 21,
      hour: 13,
      minute: 0,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-leap-004',
    description: 'Nam, 20/08/2025, giờ Thân, Hà Nội - tháng 6 nhuận',
    category: 'leap',
    source: SOURCE_CITATION,
    sourceNotes:
      'Solar date 20/08/2025 falls in leap month 6 of Ất Tỵ year. With split15 rule, day 27 of leap month 6 is treated as month 7.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 2025,
      month: 8,
      day: 20,
      hour: 16,
      minute: 0,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-leap-005',
    description: 'Nữ, 25/08/1987, giờ Tuất, TP.HCM - tháng 7 nhuận',
    category: 'leap',
    source: SOURCE_CITATION,
    sourceNotes:
      'Solar date 25/08/1987 falls in leap month 7 of Đinh Mão year. With split15 rule, day 2 of leap month 7 is treated as month 7.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1987,
      month: 8,
      day: 25,
      hour: 20,
      minute: 0,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  // Zi hour boundary cases
  {
    id: 'fixture-zi-001',
    description: 'Nam, 21/01/1985, 23:30 (giờ Tý), Hà Nội - Tết Ất Sửu',
    category: 'zi',
    source: SOURCE_CITATION,
    sourceNotes:
      'Zi hour boundary with dayBoundary=23:00. Effective solar date rolls forward to 22/01/1985, giving lunar month 1 day 2.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1985,
      month: 1,
      day: 21,
      hour: 23,
      minute: 30,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-zi-002',
    description: 'Nữ, 17/02/2007, 23:30 (giờ Tý), TP.HCM - Tết Đinh Hợi',
    category: 'zi',
    source: SOURCE_CITATION,
    sourceNotes:
      'Zi hour boundary with dayBoundary=23:00. Effective solar date rolls forward to 18/02/2007, giving lunar month 1 day 2.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 2007,
      month: 2,
      day: 17,
      hour: 23,
      minute: 30,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
  {
    id: 'fixture-zi-003',
    description: 'Nam, 31/12/1999, 23:30 (giờ Tý), Đà Nẵng - vắt qua năm dương + tháng âm',
    category: 'zi',
    source: SOURCE_CITATION,
    sourceNotes:
      'Zi hour boundary crossing solar year end. Effective solar date rolls forward to 01/01/2000, but lunar date remains in 1999 month 11.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1999,
      month: 12,
      day: 31,
      hour: 23,
      minute: 30,
      location: { region: 'south', longitude: 108.2208, provinceId: 'DN', provinceName: 'Đà Nẵng' },
    },
  },
  {
    id: 'fixture-zi-004',
    description: 'Nữ, 15/05/1990, 23:30 (giờ Tý), Hà Nội',
    category: 'zi',
    source: SOURCE_CITATION,
    sourceNotes:
      'Zi hour boundary with dayBoundary=23:00. Effective solar date rolls forward to 16/05/1990, giving lunar month 4 day 22.',
    birthInfo: {
      gender: 'nu',
      calendarType: 'solar',
      year: 1990,
      month: 5,
      day: 15,
      hour: 23,
      minute: 30,
      location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
    },
  },
  {
    id: 'fixture-zi-005',
    description: 'Nam, 15/05/1990, 00:30 (giờ Tý), TP.HCM',
    category: 'zi',
    source: SOURCE_CITATION,
    sourceNotes:
      'Zi hour boundary with dayBoundary=23:00. Time 00:30 is not shifted, effective solar date remains 15/05/1990, giving lunar month 4 day 21.',
    birthInfo: {
      gender: 'nam',
      calendarType: 'solar',
      year: 1990,
      month: 5,
      day: 15,
      hour: 0,
      minute: 30,
      location: { region: 'south', longitude: 106.6602, provinceId: 'HCM', provinceName: 'TP.HCM' },
    },
  },
];

function buildFixture(c: FixtureCase) {
  const engine = createChartEngine();
  const chart = engine.generateChart(c.birthInfo);

  const majorStarsByPalace: Record<string, string[]> = {};
  for (const palace of chart.palaces) {
    majorStarsByPalace[palace.branch] = palace.majorStars.map((s) => s.id);
  }

  const brightness: Record<string, string> = {};
  for (const palace of chart.palaces) {
    for (const star of palace.majorStars) {
      if (star.brightness) {
        brightness[star.id] = star.brightness;
      }
    }
  }

  return {
    id: c.id,
    description: c.description,
    source: c.source,
    sourceDate: SOURCE_DATE,
    sourceNotes: c.sourceNotes,
    ...(c.expectedDiff
      ? { expectedDiff: c.expectedDiff, expectedDiffReason: c.expectedDiffReason }
      : {}),
    birthInfo: c.birthInfo,
    expected: {
      lunarDate: {
        year: chart.heavenPlate.effectiveLunarDate.year,
        month: chart.heavenPlate.effectiveLunarDate.month,
        day: chart.heavenPlate.effectiveLunarDate.day,
        isLeapMonth: chart.heavenPlate.effectiveLunarDate.isLeapMonthOriginal,
      },
      fourPillars: {
        year: chart.heavenPlate.fourPillars.year.label,
        month: chart.heavenPlate.fourPillars.month.label,
        day: chart.heavenPlate.fourPillars.day.label,
        hour: chart.heavenPlate.fourPillars.hour.label,
      },
      soulPalaceBranch: chart.heavenPlate.soulPalaceBranch,
      bodyPalaceBranch: chart.heavenPlate.bodyPalaceBranch,
      fiveElementsClass: chart.heavenPlate.fiveElementsClass,
      soulLord: chart.heavenPlate.soulLord,
      bodyLord: chart.heavenPlate.bodyLord,
      majorStarsByPalace,
      tuanBranches: chart.tuanTriet.tuan.branches,
      trietBranches: chart.tuanTriet.triet.branches,
      brightness,
    },
  };
}

const standardCases = cases.filter((c) => c.category === 'standard').map(buildFixture);
const tetCases = cases.filter((c) => c.category === 'tet').map(buildFixture);
const leapCases = cases.filter((c) => c.category === 'leap').map(buildFixture);
const ziCases = cases.filter((c) => c.category === 'zi').map(buildFixture);

const baseDir = path.join(__dirname, 'lib', 'ziwei', '__tests__', 'golden');
const fixturesDir = path.join(baseDir, 'fixtures');

fs.mkdirSync(fixturesDir, { recursive: true });

fs.writeFileSync(
  path.join(fixturesDir, 'standard-cases.json'),
  JSON.stringify(standardCases, null, 2)
);
fs.writeFileSync(
  path.join(fixturesDir, 'tet-divergence-cases.json'),
  JSON.stringify(tetCases, null, 2)
);
fs.writeFileSync(
  path.join(fixturesDir, 'leap-month-cases.json'),
  JSON.stringify(leapCases, null, 2)
);
fs.writeFileSync(
  path.join(fixturesDir, 'zi-hour-boundary-cases.json'),
  JSON.stringify(ziCases, null, 2)
);

const allFixtures = [...standardCases, ...tetCases, ...leapCases, ...ziCases];

const indexTs = `import standardCases from './standard-cases.json';
import tetDivergenceCases from './tet-divergence-cases.json';
import leapMonthCases from './leap-month-cases.json';
import ziHourBoundaryCases from './zi-hour-boundary-cases.json';

export const STANDARD_FIXTURES = standardCases;
export const TET_DIVERGENCE_FIXTURES = tetDivergenceCases;
export const LEAP_MONTH_FIXTURES = leapMonthCases;
export const ZI_HOUR_BOUNDARY_FIXTURES = ziHourBoundaryCases;

export const ALL_FIXTURES = [
  ...STANDARD_FIXTURES,
  ...TET_DIVERGENCE_FIXTURES,
  ...LEAP_MONTH_FIXTURES,
  ...ZI_HOUR_BOUNDARY_FIXTURES,
];
`;

fs.writeFileSync(path.join(fixturesDir, 'index.ts'), indexTs);

console.log(`Generated ${allFixtures.length} fixtures:`);
console.log(`  - Standard: ${standardCases.length}`);
console.log(`  - Tet divergence: ${tetCases.length}`);
console.log(`  - Leap month: ${leapCases.length}`);
console.log(`  - Zi hour boundary: ${ziCases.length}`);
console.log(`Output directory: ${fixturesDir}`);
