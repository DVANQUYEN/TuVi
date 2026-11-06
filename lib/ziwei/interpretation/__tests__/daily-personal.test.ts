import { describe, it, expect } from 'vitest';
import { createChartEngine } from '../../engine/sao-menh.engine';
import { getDailyCalendar } from '@/components/horoscope/daily-calendar';
import { buildPersonalizedDaily } from '../daily-personal';
import type { PersonalizedDaily } from '../daily-personal';
import { calculateDecadeFortune } from '../decade-fortune';
import { getMonthCanChi, getYearCanChi } from '../../utils/can-chi';
import { BRANCH_LABELS } from '../../zodiac-compatibility';
import { EARTHLY_BRANCHES } from '../../types/enums';
import type { BirthInfo, Palace, Star, ZiweiChart } from '../../types';

/**
 * Mẫu thật: nam, 18/7/2004 13:00, dương lịch, Hà Nội.
 * Đây là cùng mẫu đã dùng ở phase2-fortune.test.ts để giữ kỳ vọng đồng bộ.
 */
const SAMPLE_BIRTH_INFO: BirthInfo = {
  name: 'Mẫu 18/7/2004',
  gender: 'nam',
  calendarType: 'solar',
  year: 2004,
  month: 7,
  day: 18,
  hour: 13,
  minute: 0,
  location: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

const sampleChart = createChartEngine().generateChart(SAMPLE_BIRTH_INFO);

const OTHER_BIRTH_INFO: BirthInfo = {
  ...SAMPLE_BIRTH_INFO,
  name: 'Mẫu 15/5/1990',
  year: 1990,
  month: 5,
  day: 15,
};

const otherChart = createChartEngine().generateChart(OTHER_BIRTH_INFO);

function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function buildView(
  isoDate: string,
  chart: ZiweiChart = sampleChart,
  options?: { name?: string }
): {
  calendar: ReturnType<typeof getDailyCalendar>;
  result: PersonalizedDaily;
} {
  const calendar = getDailyCalendar(isoDate);
  const result = buildPersonalizedDaily(chart, parseIsoDate(isoDate), calendar, options);
  return { calendar, result };
}

function findPalaceByBranch(chart: ZiweiChart, branch: Palace['branch']): Palace | undefined {
  return chart.palaces.find((palace) => palace.branch === branch);
}

function findPalaceByName(chart: ZiweiChart, name: string): Palace | undefined {
  return chart.palaces.find((palace) => palace.name === name);
}

function allStars(palace: Palace): Star[] {
  return [
    ...palace.majorStars,
    ...palace.auspiciousStars,
    ...palace.maleficStars,
    ...palace.otherStars,
  ];
}

function findPalaceWithStar(chart: ZiweiChart, starName: string): Palace | undefined {
  return chart.palaces.find((palace) => allStars(palace).some((star) => star.name === starName));
}

function withoutStars(chart: ZiweiChart, starNames: readonly string[]): ZiweiChart {
  const filterStars = (stars: Star[]): Star[] =>
    stars.filter((star) => !starNames.includes(star.name));

  return {
    ...chart,
    palaces: chart.palaces.map((palace) => ({
      ...palace,
      majorStars: filterStars(palace.majorStars),
      auspiciousStars: filterStars(palace.auspiciousStars),
      maleficStars: filterStars(palace.maleficStars),
      otherStars: filterStars(palace.otherStars),
    })),
  } as unknown as ZiweiChart;
}

function circularDistance(left: Palace['branch'], right: Palace['branch']): number {
  const diff = Math.abs(EARTHLY_BRANCHES.indexOf(left) - EARTHLY_BRANCHES.indexOf(right));
  return Math.min(diff, 12 - diff);
}

function activation(result: PersonalizedDaily, palaceName: string): string[] | undefined {
  return result.activatedPalaces.find((palace) => palace.name === palaceName)?.reasons;
}

describe('buildPersonalizedDaily - tuổi, đại vận và tiểu vận', () => {
  it('tính đúng tuổi, đại vận hiện tại và tiểu vận của mẫu 18/7/2004', () => {
    const { result } = buildView('2026-06-15');
    const expectedDecade = calculateDecadeFortune(sampleChart, 22, SAMPLE_BIRTH_INFO.year).find(
      (decade) => decade.isCurrent
    );

    expect(result.age).toBe(22);
    expect(expectedDecade).toBeDefined();
    expect(result.decade).toEqual({
      ageRange: expectedDecade!.decade,
      palaceName: expectedDecade!.palaceName,
      majorStars: expectedDecade!.majorStars,
      score: expectedDecade!.score,
      level: expectedDecade!.fortune,
    });
    expect(result.decade).toMatchObject({
      ageRange: '22-31',
      palaceName: 'Phúc Đức',
      majorStars: ['Tử Vi', 'Thiên Phủ'],
      score: 4.8,
      level: 'tốt',
    });

    expect(result.minor).toEqual({
      palaceName: 'Tật Ách',
      majorStars: ['Thiên Lương'],
      score: 3.8,
      level: 'tốt',
    });
  });

  it('đổi đại vận đúng tại mốc 21/22 và cập nhật tiểu vận theo tuổi', () => {
    const beforeBirthday = buildView('2025-12-31').result;
    const afterBirthday = buildView('2026-06-15').result;

    expect(beforeBirthday.age).toBe(21);
    expect(beforeBirthday.decade).toMatchObject({
      ageRange: '12-21',
      palaceName: 'Phụ Mẫu',
      score: 3.2,
      level: 'ổn định',
    });
    expect(beforeBirthday.minor).toMatchObject({
      palaceName: 'Thiên Di',
    });

    expect(afterBirthday.age).toBe(22);
    expect(afterBirthday.decade).toMatchObject({
      ageRange: '22-31',
      palaceName: 'Phúc Đức',
      level: 'tốt',
    });
    expect(afterBirthday.minor).toMatchObject({
      palaceName: 'Tật Ách',
    });

    const nextAge = buildView('2027-03-10').result;
    expect(nextAge.age).toBe(23);
    expect(nextAge.minor).toMatchObject({
      palaceName: 'Tài Bạch',
      majorStars: ['Thất Sát'],
      level: 'tốt',
    });
  });
});

describe('buildPersonalizedDaily - lưu niên, Lộc Tồn, Kình/Đà và Tứ Hóa', () => {
  it('xác định lưu niên theo năm âm lịch của ngày xem, không phải năm dương lịch', () => {
    const june = buildView('2026-06-15');
    expect(june.calendar.lunarYear).toBe(2026);
    expect(june.result.annual).toMatchObject({
      branchLabel: 'Ngọ',
      palaceName: 'Thiên Di',
      taiSuiPalace: 'Thiên Di',
    });

    const january = buildView('2026-01-15');
    // Ngày 15/01/2026 vẫn thuộc năm âm lịch Ất Tỵ (2025).
    expect(january.calendar.lunarYear).toBe(2025);
    expect(getYearCanChi(january.calendar.lunarYear)).toEqual({
      stem: 'at',
      branch: 'ti',
    });
    expect(january.result.age).toBe(22);
    expect(january.result.annual).toMatchObject({
      branchLabel: 'Tỵ',
      palaceName: 'Nô Bộc',
      taiSuiPalace: 'Nô Bộc',
    });
  });

  it('an Lộc Tồn đúng chi theo Thiên Can năm; Kình Dương và Đà La kề hai bên', () => {
    const { result } = buildView('2026-06-15');
    const { annual } = result;
    // Năm Bính: Lộc Tồn tại Tỵ.
    expect(annual.locTonPalace).toBe('Nô Bộc');

    const locTon = findPalaceByName(sampleChart, annual.locTonPalace!);
    const kinhDuong = findPalaceByName(sampleChart, annual.kinhDuongPalace!);
    const daLa = findPalaceByName(sampleChart, annual.daLaPalace!);

    expect(locTon).toBeDefined();
    expect(kinhDuong).toBeDefined();
    expect(daLa).toBeDefined();
    expect(circularDistance(locTon!.branch, kinhDuong!.branch)).toBe(1);
    expect(circularDistance(locTon!.branch, daLa!.branch)).toBe(1);
  });

  it('phân giải Tứ Hóa năm về đúng sao và cung thực tế trong lá số', () => {
    const { result, calendar } = buildView('2026-06-15');
    const yearCanChi = getYearCanChi(calendar.lunarYear);

    expect(yearCanChi).toEqual({ stem: 'binh', branch: 'ngo' });
    expect(result.annual.mutagens.map((mutagen) => mutagen.type)).toEqual([
      'Lộc',
      'Quyền',
      'Khoa',
      'Kỵ',
    ]);

    const expected = [
      ['Lộc', 'Thiên Đồng'],
      ['Quyền', 'Thiên Cơ'],
      ['Khoa', 'Văn Xương'],
      ['Kỵ', 'Liêm Trinh'],
    ] as const;

    for (const [type, star] of expected) {
      const palace = findPalaceWithStar(sampleChart, star);
      expect(palace, `Không tìm thấy sao ${star}`).toBeDefined();
      expect(result.annual.mutagens).toContainEqual({
        type,
        star,
        palace: palace!.name,
      });
    }
  });

  it('bỏ qua sao Tứ Hóa không có trong lá số thay vì bịa cung', () => {
    const missingVanXuong = withoutStars(sampleChart, ['Văn Xương']);
    const { result } = buildView('2026-06-15', missingVanXuong);

    expect(result.annual.mutagens.map((mutagen) => mutagen.type)).toEqual([
      'Lộc',
      'Quyền',
      'Kỵ',
    ]);
    expect(result.annual.mutagens.map((mutagen) => mutagen.star)).not.toContain('Văn Xương');

    const missingAll = withoutStars(sampleChart, [
      'Thiên Đồng',
      'Thiên Cơ',
      'Văn Xương',
      'Liêm Trinh',
    ]);
    const allMissing = buildView('2026-06-15', missingAll).result;

    expect(allMissing.annual.mutagens).toEqual([]);
    expect(allMissing.basis.some((line) => line.startsWith('Lưu Hóa'))).toBe(false);
  });

  it('kích hoạt cung đúng lý do, khử trùng lặp và không lặp tên cung', () => {
    const { result } = buildView('2026-06-15');

    expect(activation(result, 'Phúc Đức')).toEqual(['Đại vận']);
    expect(activation(result, 'Tật Ách')).toEqual(['Tiểu vận']);
    expect(activation(result, 'Thiên Di')).toEqual([
      'Lưu niên/Thái Tuế',
      'Lưu nguyệt',
      'Lưu Kình Dương',
      'Lưu Hóa Kỵ',
    ]);
    expect(activation(result, 'Tài Bạch')).toEqual(['Lưu nhật']);
    expect(activation(result, 'Nô Bộc')).toEqual(['Lưu Lộc Tồn']);
    expect(activation(result, 'Quan Lộc')).toEqual(['Lưu Đà La']);
    expect(activation(result, 'Tử Tức')).toEqual(['Lưu Hóa Lộc']);
    expect(activation(result, 'Phụ Mẫu')).toEqual(['Lưu Hóa Quyền']);
    expect(activation(result, 'Điền Trạch')).toEqual(['Lưu Hóa Khoa']);

    const names = result.activatedPalaces.map((palace) => palace.name);
    expect(new Set(names).size).toBe(names.length);
    for (const palace of result.activatedPalaces) {
      expect(new Set(palace.reasons).size).toBe(palace.reasons.length);
    }
  });

  it('gộp nhiều lớp vào cùng một cung mà không lặp lý do', () => {
    const { result } = buildView('2024-01-22');

    const menh = activation(result, 'Mệnh');
    expect(menh).toEqual(['Lưu Lộc Tồn', 'Lưu Hóa Lộc']);
    expect(new Set(menh).size).toBe(menh!.length);
    expect(result.activatedPalaces.filter((palace) => palace.name === 'Mệnh')).toHaveLength(1);
  });

  it('ánh xạ đúng chi lưu nguyệt và lưu nhật sang cung', () => {
    for (const isoDate of ['2026-06-15', '2026-01-15', '2024-01-22']) {
      const { result, calendar } = buildView(isoDate);
      const monthCanChi = getMonthCanChi(calendar.lunarYear, calendar.lunarMonth);
      const monthPalace = findPalaceByBranch(sampleChart, monthCanChi.branch);
      const dayPalace = findPalaceByBranch(sampleChart, calendar.dayBranch);

      expect(monthPalace, `Thiếu cung cho lưu nguyệt ${isoDate}`).toBeDefined();
      expect(dayPalace, `Thiếu cung cho lưu nhật ${isoDate}`).toBeDefined();
      expect(activation(result, monthPalace!.name)).toContain('Lưu nguyệt');
      expect(activation(result, dayPalace!.name)).toContain('Lưu nhật');
      expect(result.basis).toContain(
        `Lưu nguyệt ${BRANCH_LABELS[monthCanChi.branch]} – cung ${monthPalace!.name}`
      );
      expect(result.basis).toContain(
        `Lưu nhật ${BRANCH_LABELS[calendar.dayBranch]} – cung ${dayPalace!.name}`
      );
    }
  });
});

describe('buildPersonalizedDaily - tín hiệu tích cực và thận trọng', () => {
  it('tạo tín hiệu tích cực từ Lộc Tồn và Hóa Lộc trong cung trọng yếu', () => {
    const { result } = buildView('2024-01-22');
    const types = result.signals.map((signal) => signal.type);

    // Đại vận 12-21 của mẫu hiện chấm 3.2 (ổn định) nên không sinh tín hiệu đại vận thuận.
    expect(result.decade.level).toBe('ổn định');
    expect(types).not.toContain('dai-van-thuan');
    expect(types).toContain('luu-loc-ton');
    expect(types).toContain('luu-hoa-loc');

    const locTonSignal = result.signals.find((signal) => signal.type === 'luu-loc-ton');
    expect(locTonSignal).toMatchObject({
      star: 'Lộc Tồn',
      palace: 'Mệnh',
    });
    expect(locTonSignal!.note).toContain('Lộc Tồn');
    expect(locTonSignal!.note).toContain('Mệnh');

    const hoaLocSignal = result.signals.find((signal) => signal.type === 'luu-hoa-loc');
    expect(hoaLocSignal).toMatchObject({
      star: 'Phá Quân',
      palace: 'Mệnh',
    });
    expect(hoaLocSignal!.note).toContain('Hóa Lộc');
    expect(hoaLocSignal!.note).toContain('Phá Quân');
  });

  it('tạo tín hiệu thận trọng từ Hóa Kỵ, Kình Dương và tiểu vận xấu', () => {
    const january = buildView('2024-01-22').result;
    const januaryTypes = january.signals.map((signal) => signal.type);

    expect(januaryTypes).toContain('tieu-van-bien-dong');
    expect(januaryTypes).toContain('luu-hoa-ky');
    const hoaKySignal = january.signals.find((signal) => signal.type === 'luu-hoa-ky');
    expect(hoaKySignal).toMatchObject({
      star: 'Tham Lang',
      palace: 'Quan Lộc',
    });
    expect(hoaKySignal!.note).toContain('Hóa Kỵ');
    expect(hoaKySignal!.note).toContain('Tham Lang');

    // Ngày 15/01/2026: Lưu Kình Dương rơi vào cung trọng yếu Quan Lộc.
    const kinh = buildView('2026-01-15').result;
    const kinhTypes = kinh.signals.map((signal) => signal.type);
    expect(kinhTypes).toContain('luu-kinh-duong');
    const kinhSignal = kinh.signals.find((signal) => signal.type === 'luu-kinh-duong');
    expect(kinhSignal).toMatchObject({
      star: 'Kình Dương',
      palace: 'Quan Lộc',
    });
    expect(kinhSignal!.note).toContain('Kình Dương');
  });

  it('phản ánh đại vận và tiểu vận xấu bằng tín hiệu biến động', () => {
    const { result } = buildView('2036-06-15');

    expect(result.decade.level).toBe('xấu');
    expect(result.minor?.level).toBe('xấu');
    expect(result.signals.map((signal) => signal.type)).toEqual(
      expect.arrayContaining(['dai-van-bien-dong', 'tieu-van-bien-dong'])
    );
  });

  it('mọi tín hiệu đều trỏ tới một cung đang kích hoạt', () => {
    for (const isoDate of ['2024-01-22', '2028-02-08', '2026-06-15']) {
      const { result } = buildView(isoDate);
      const activatedNames = new Set(result.activatedPalaces.map((palace) => palace.name));

      for (const signal of result.signals) {
        expect(activatedNames.has(signal.palace), `${isoDate}: ${signal.palace}`).toBe(true);
      }
    }
  });
});

describe('buildPersonalizedDaily - nên làm, nên tránh và lời khuyên', () => {
  const GENERIC_PHRASES = ['tốt', 'xấu', 'cát lợi', 'bình hòa'];

  it('trả đúng 3 việc nên làm và 3 việc nên tránh, không trùng lặp', () => {
    for (const isoDate of ['2024-01-22', '2026-01-15', '2026-06-15', '2028-02-08']) {
      const { result } = buildView(isoDate);

      expect(result.shouldDo, isoDate).toHaveLength(3);
      expect(result.shouldAvoid, isoDate).toHaveLength(3);
      expect(new Set(result.shouldDo).size, isoDate).toBe(3);
      expect(new Set(result.shouldAvoid).size, isoDate).toBe(3);
      for (const item of result.shouldDo) expect(item.trim().length, isoDate).toBeGreaterThan(0);
      for (const item of result.shouldAvoid) expect(item.trim().length, isoDate).toBeGreaterThan(0);
    }
  });

  it('không dùng các từ chung chung trong nên làm, nên tránh và lời khuyên', () => {
    for (const isoDate of ['2024-01-22', '2026-01-15', '2026-06-15', '2028-02-08']) {
      const { result } = buildView(isoDate);
      const text = [...result.shouldDo, ...result.shouldAvoid, result.advice]
        .join(' ')
        .toLocaleLowerCase('vi');

      for (const phrase of GENERIC_PHRASES) {
        expect(text, `${isoDate}: ${phrase}`).not.toContain(phrase);
      }
    }
  });

  it('nhắc đúng cung, sao, trực và giờ hoàng đạo thật của ngày xem', () => {
    const { result, calendar } = buildView('2026-06-15');
    const luckyHourLabels = calendar.luckyHours.map((branch) => BRANCH_LABELS[branch]);
    const combined = [...result.shouldDo, ...result.shouldAvoid, result.advice].join(' ');

    expect(combined).toContain(result.decade.palaceName);
    expect(combined).toContain(result.minor!.palaceName);
    expect(combined).toContain(result.decade.majorStars[0]);
    expect(combined).toContain(result.minor!.majorStars[0]);
    expect(combined).toContain(calendar.truc.name);
    for (const label of luckyHourLabels) {
      expect(result.advice).toContain(label);
    }
    expect(result.advice).toContain('giờ');
  });

  it('dùng trực hắc đạo trong nên tránh khi ngày không hoàng đạo', () => {
    const { result } = buildView('2028-02-08');

    expect(result.shouldAvoid.join(' ')).toContain(`trực ${'Thu'}`);
  });

  it('lời khuyên nêu bối cảnh đại vận, tiểu vận và giới hạn tham khảo', () => {
    const { result } = buildView('2026-06-15');

    expect(result.advice).toMatch(/đại vận 22-31/i);
    expect(result.advice).toContain('Phúc Đức');
    expect(result.advice).toContain('Tiểu vận');
    expect(result.advice).toContain('Tật Ách');
    expect(result.advice).toContain('70%');
    expect(result.advice).toContain('không phải kết luận cố định');
  });
});

describe('buildPersonalizedDaily - cơ sở luận giải, tính lặp lại và khác biệt', () => {
  it('cơ sở luận giải chứa đủ các yếu tố thực tế đã dùng', () => {
    const { result, calendar } = buildView('2026-06-15');
    const basis = result.basis.join('\n');

    const expectedLines = [
      'Đại vận 22-31 tuổi – cung Phúc Đức (Tử Vi, Thiên Phủ), điểm 4.8/5',
      'Tiểu vận – cung Tật Ách (Thiên Lương), điểm 3.8/5',
      'Lưu niên Bính Ngọ – cung Thiên Di',
      'Lưu nguyệt Ngọ – cung Thiên Di',
      'Lưu nhật Thân – cung Tài Bạch',
      'Lưu Lộc Tồn tại chi Tỵ – cung Nô Bộc',
      'Lưu Kình Dương – cung Thiên Di',
      'Lưu Đà La – cung Quan Lộc',
      'Lưu Hóa Lộc – Thiên Đồng tại cung Tử Tức',
      'Lưu Hóa Quyền – Thiên Cơ tại cung Phụ Mẫu',
      'Lưu Hóa Khoa – Văn Xương tại cung Điền Trạch',
      'Lưu Hóa Kỵ – Liêm Trinh tại cung Thiên Di',
      `Ngày ${calendar.dayCanChi}, trực ${calendar.truc.name}, giờ hoàng đạo`,
    ];

    for (const line of expectedLines) {
      expect(basis).toContain(line);
    }
    for (const branch of calendar.luckyHours) {
      expect(basis).toContain(BRANCH_LABELS[branch]);
    }
  });

  it('là hàm thuần: gọi lại cùng tham số cho kết quả hoàn toàn giống nhau', () => {
    const calendar = getDailyCalendar('2026-06-15');
    const date = parseIsoDate('2026-06-15');
    const first = buildPersonalizedDaily(sampleChart, date, calendar, { name: 'Lan' });
    const second = buildPersonalizedDaily(sampleChart, date, calendar, { name: 'Lan' });

    expect(second).toEqual(first);
  });

  it('ngày khác nhau cho lưu niên, tiểu vận, kích hoạt cung và hành động khác nhau', () => {
    const first = buildView('2026-06-15').result;
    const second = buildView('2026-01-15').result;

    expect(first.age).toBe(second.age);
    expect(first.annual.branchLabel).not.toBe(second.annual.branchLabel);
    expect(first.annual.taiSuiPalace).not.toBe(second.annual.taiSuiPalace);
    expect(first.activatedPalaces).not.toEqual(second.activatedPalaces);
    expect(first.shouldDo).not.toEqual(second.shouldDo);
    expect(first.shouldAvoid).not.toEqual(second.shouldAvoid);
    expect(first.basis).not.toEqual(second.basis);
  });

  it('đương số khác nhau cho tuổi, đại vận, lưu niên và lời khuyên khác nhau', () => {
    const sameDate = '2026-06-15';
    const sample = buildView(sameDate, sampleChart).result;
    const other = buildView(sameDate, otherChart).result;

    expect(sample.age).toBe(22);
    expect(other.age).toBe(36);
    // Cùng ngày xem nên lưu niên trùng nhau; đại vận, tiểu vận và lời khuyên
    // phải khác vì phụ thuộc lá số của đương số.
    expect(sample.annual.branchLabel).toBe(other.annual.branchLabel);
    expect(sample.decade).not.toEqual(other.decade);
    expect(sample.minor).not.toEqual(other.minor);
    expect(sample.advice).not.toBe(other.advice);
  });

  it('ưu tiên tên truyền vào, sau đó tên trên lá số, và bỏ qua tên rỗng', () => {
    const withOption = buildView('2026-06-15', sampleChart, { name: 'Nguyễn Lan' }).result;
    const fallback = buildView('2026-06-15', sampleChart).result;
    const blankOption = buildView('2026-06-15', sampleChart, { name: '   ' }).result;

    expect(withOption.chartName).toBe('Nguyễn Lan');
    expect(fallback.chartName).toBe(SAMPLE_BIRTH_INFO.name);
    expect(blankOption.chartName).toBe(SAMPLE_BIRTH_INFO.name);

    const namelessChart = {
      ...sampleChart,
      birthInfo: { ...sampleChart.birthInfo, name: undefined },
    } as unknown as ZiweiChart;
    expect(buildView('2026-06-15', namelessChart).result.chartName).toBeUndefined();
  });
});

describe('buildPersonalizedDaily - lá số thiếu dữ liệu không được crash', () => {
  it('không có periods vẫn trả kết quả với đại vận dự phòng và tiểu vận an toàn', () => {
    const incomplete = { ...sampleChart, periods: [] } as unknown as ZiweiChart;
    const { result } = buildView('2026-06-15', incomplete);

    expect(result.decade.ageRange).toBe('chưa xác định');
    expect(result.decade.palaceName).toBe('Phúc Đức');
    // Không có periods nhưng palace.minorPeriodAges vẫn xác định được tiểu vận.
    expect(result.minor).toMatchObject({
      palaceName: 'Tật Ách',
      majorStars: ['Thiên Lương'],
      score: 3.8,
      level: 'tốt',
    });
    expect(result.basis.some((line) => line.startsWith('Tiểu vận'))).toBe(true);
    expect(result.shouldDo).toHaveLength(3);
    expect(result.shouldAvoid).toHaveLength(3);
  });

  it('chỉ có một cung vẫn không crash và dùng cung đó làm mốc dự phòng', () => {
    const incomplete = {
      ...sampleChart,
      periods: [],
      palaces: [sampleChart.palaces[0]],
    } as unknown as ZiweiChart;
    const { result } = buildView('2026-06-15', incomplete);

    expect(result.decade.palaceName).toBe(sampleChart.palaces[0].name);
    expect(result.annual.taiSuiPalace).toBe(sampleChart.palaces[0].name);
    expect(result.minor).toBeNull();
  });

  it('ngày không hợp lệ không crash và quy về tuổi 0', () => {
    const calendar = getDailyCalendar('2026-06-15');
    const result = buildPersonalizedDaily(sampleChart, new Date('invalid'), calendar);

    expect(result.age).toBe(0);
    expect(result.decade.ageRange).toBe('2-11');
    expect(result.shouldDo).toHaveLength(3);
    expect(result.advice.length).toBeGreaterThan(0);
  });

  it('calendar không có giờ hoàng đạo vẫn trả đủ 3 việc và lời khuyên hợp lệ', () => {
    const calendar = { ...getDailyCalendar('2026-06-15'), luckyHours: [] };
    const result = buildPersonalizedDaily(sampleChart, parseIsoDate('2026-06-15'), calendar);

    expect(result.shouldDo).toHaveLength(3);
    expect(result.shouldAvoid).toHaveLength(3);
    expect(result.advice).toContain('thuận tiện');
    expect(result.basis.join(' ')).toContain('không có dữ liệu');
  });
});

describe('buildPersonalizedDaily - chiều Kình Dương/Đà La so với lá số gốc', () => {
  it('Lưu Kình Dương và Lưu Đà La phải khớp chiều Kình/Đà đã an trong lá số', () => {
    const { result } = buildView('2004-07-18');
    const kinhDuongPalace = findPalaceWithStar(sampleChart, 'Kình Dương');
    const daLaPalace = findPalaceWithStar(sampleChart, 'Đà La');

    expect(result.annual.locTonPalace).toBe('Phúc Đức');
    expect(kinhDuongPalace).toBeDefined();
    expect(daLaPalace).toBeDefined();
    expect(result.annual.kinhDuongPalace).toBe(kinhDuongPalace!.name);
    expect(result.annual.daLaPalace).toBe(daLaPalace!.name);
  });
});
