import type { BirthInfo } from '../types/input';
import type { ResolvedZiweiConfig } from '../types/config';
import type { CalendarResolutionAudit, ChartWarning } from '../types/audit';
import type { EarthlyBranch, HeavenlyStem } from '../types/enums';
import {
  convertLunarToSolarVN,
  convertSolarToLunarVN,
  jdFromDate,
} from '../utils/ho-ngoc-duc-lunar';
import { getLapXuanMomentUtc7 } from '../utils/solar-terms';
import { getFourPillars } from '../utils/can-chi';

const HEAVENLY_STEM_LABELS: Readonly<Record<HeavenlyStem, string>> = {
  giap: 'Giáp',
  at: 'Ất',
  binh: 'Bính',
  dinh: 'Đinh',
  mau: 'Mậu',
  ky: 'Kỷ',
  canh: 'Canh',
  tan: 'Tân',
  nham: 'Nhâm',
  quy: 'Quý',
};

const EARTHLY_BRANCH_LABELS: Readonly<Record<EarthlyBranch, string>> = {
  ty: 'Tý',
  suu: 'Sửu',
  dan: 'Dần',
  mao: 'Mão',
  thin: 'Thìn',
  ti: 'Tỵ',
  ngo: 'Ngọ',
  mui: 'Mùi',
  than: 'Thân',
  dau: 'Dậu',
  tuat: 'Tuất',
  hoi: 'Hợi',
};

function buildFourPillarsWithLabels(fourPillars: ReturnType<typeof getFourPillars>): {
  year: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
  month: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
  day: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
  hour: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
} {
  const addLabel = (item: {
    stem: HeavenlyStem;
    branch: EarthlyBranch;
  }): { stem: HeavenlyStem; branch: EarthlyBranch; label: string } => ({
    ...item,
    label: `${HEAVENLY_STEM_LABELS[item.stem]}${EARTHLY_BRANCH_LABELS[item.branch]}`,
  });

  return {
    year: addLabel(fourPillars.year),
    month: addLabel(fourPillars.month),
    day: addLabel(fourPillars.day),
    hour: addLabel(fourPillars.hour),
  };
}

/** Đầu ra của Layer 2 sau khi chuyển đổi và hiệu chỉnh lịch. */
export interface CalendarAdapterOutput {
  /** Năm âm lịch gốc (trước khi điều chỉnh Lập Xuân). */
  lunarYear: number;
  /** Tháng âm lịch hiệu lực (đã xử lý tháng nhuận). */
  lunarMonth: number;
  /** Ngày âm lịch. */
  lunarDay: number;
  /** Cờ tháng nhuận gốc. */
  isLeapMonth: boolean;
  /** Năm Can Chi hiệu lực (có thể khác lunarYear nếu chọn Lập Xuân). */
  effectiveLunarYear: number;
  /** Tứ trụ Can Chi kèm nhãn đọc. */
  fourPillars: {
    year: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
    month: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
    day: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
    hour: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
  };
  /** Julian Day Number của ngày dương hiệu lực. */
  jd: number;
  /** Audit về quá trình chuyển đổi lịch. */
  calendarResolution: CalendarResolutionAudit;
  /** Cảnh báo phát sinh trong quá trình xử lý lịch. */
  warnings: ChartWarning[];
}

/**
 * Layer 2: Đổi Dương → Âm UTC+7, xử lý giờ Tý, tháng nhuận và ranh giới năm Can Chi.
 */
export class VietnameseCalendarAdapter {
  /**
   * Chuyển đổi và hiệu chỉnh lịch.
   *
   * @param birthInfo - Thông tin sinh ban đầu.
   * @param timeOutput - Đầu ra từ {@link TrueSolarTimeAdapter}.
   * @param config - Cấu hình đã resolve.
   * @returns Thông tin lịch âm đã chuẩn hóa.
   */
  convert(
    birthInfo: BirthInfo,
    timeOutput: {
      effectiveDay: number;
      effectiveMonth: number;
      effectiveYear: number;
      effectiveHour: number;
    },
    config: ResolvedZiweiConfig
  ): CalendarAdapterOutput {
    const warnings: ChartWarning[] = [];

    let day = timeOutput.effectiveDay;
    let month = timeOutput.effectiveMonth;
    let year = timeOutput.effectiveYear;
    const hour = timeOutput.effectiveHour;

    // 1. Xử lý giờ Tý (23:00-00:59)
    if (config.dayBoundary === '23:00' && hour >= 23) {
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 1);
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
    }

    // 2. Chuyển đổi Dương → Âm
    let lunarDate;
    if (birthInfo.calendarType === 'solar') {
      lunarDate = convertSolarToLunarVN(day, month, year);
    } else {
      const solarDate = convertLunarToSolarVN(
        day,
        month,
        year,
        birthInfo.isLeapMonthInput ?? false
      );
      lunarDate = {
        day: solarDate.day,
        month: solarDate.month,
        year: solarDate.year,
        isLeapMonth: birthInfo.isLeapMonthInput ?? false,
      };
    }

    // 3. Xử lý tháng nhuận
    let effectiveLunarMonth = lunarDate.month;
    if (lunarDate.isLeapMonth) {
      warnings.push({
        code: 'LEAP_MONTH_BIRTH',
        message: 'Đương số sinh trong tháng nhuận',
        severity: 'info',
      });

      if (config.leapMonth === 'split15' && lunarDate.day > 15) {
        effectiveLunarMonth += 1;
      } else if (config.leapMonth === 'nextMonth') {
        effectiveLunarMonth += 1;
      }

      if (effectiveLunarMonth > 12) {
        effectiveLunarMonth = 1;
      }
    }

    // 4. Xác định năm Can Chi
    let effectiveLunarYear = lunarDate.year;
    if (config.yearBoundary === 'lapXuan') {
      const lapXuan = getLapXuanMomentUtc7(year);
      const birthDate = new Date(year, month - 1, day);

      if (birthDate < lapXuan) {
        effectiveLunarYear -= 1;
      }
    }

    // 5. Tính Julian Day và Tứ trụ
    const jd = jdFromDate(day, month, year);
    const fourPillars = buildFourPillarsWithLabels(
      getFourPillars(effectiveLunarYear, effectiveLunarMonth, jd, hour)
    );

    // 6. Kiểm tra lệch lịch Việt-Trung
    const solarToLunarDiffWithChina = this.checkVietnamChinaDivergence(day, month, year);
    if (solarToLunarDiffWithChina) {
      warnings.push({
        code: 'VIETNAM_CHINA_DIVERGENCE',
        message: 'Ngày này lịch Việt Nam lệch lịch Trung Quốc',
        severity: 'warning',
      });
    }

    return {
      lunarYear: lunarDate.year,
      lunarMonth: effectiveLunarMonth,
      lunarDay: lunarDate.day,
      isLeapMonth: lunarDate.isLeapMonth,
      effectiveLunarYear,
      fourPillars,
      jd,
      calendarResolution: {
        solarDate: `${day}/${month}/${year}`,
        lunarDate: `${lunarDate.day}/${effectiveLunarMonth}/${lunarDate.year}${lunarDate.isLeapMonth ? ' (nhuận)' : ''}`,
        lunarYear: lunarDate.year,
        lunarMonth: effectiveLunarMonth,
        lunarDay: lunarDate.day,
        isLeapMonth: lunarDate.isLeapMonth,
        solarToLunarDiffWithChina,
        leapMonthResolution: config.leapMonth,
        historicalTimezoneApplied: true,
      },
      warnings,
    };
  }

  private checkVietnamChinaDivergence(day: number, month: number, year: number): boolean {
    const divergentYears = [1925, 1968, 1969, 1985, 2007, 2030, 2053];

    if (year === 1985 && month === 1 && day >= 21 && day <= 31) return true;
    if (year === 1985 && month === 2 && day <= 19) return true;
    if (divergentYears.includes(year)) return true;

    return false;
  }
}
