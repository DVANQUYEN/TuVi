import { EARTHLY_BRANCHES, type EarthlyBranch } from '@/lib/ziwei/types/enums';
import {
  getDayCanChi,
  getHourBranch,
  getMonthCanChi,
  getYearCanChi,
} from '@/lib/ziwei/utils/can-chi';
import {
  convertLunarToSolarVN,
  convertSolarToLunarVN,
  jdFromDate,
  jdToDate,
} from '@/lib/ziwei/utils/ho-ngoc-duc-lunar';
import type { LoveProfileValue } from './LoveProfileFields';

export type LoveEmblemPillarKey = 'year' | 'month' | 'day' | 'hour';

export interface LoveEmblemPillar {
  key: LoveEmblemPillarKey;
  label: 'Năm' | 'Tháng' | 'Ngày' | 'Giờ';
  /**
   * Nhãn Địa chi, ví dụ "Ngọ".
   *
   * Huy hiệu chỉ hiển thị Địa chi vì Thiên Can của bản xem trước có thể lệch
   * với lá số chính thức (mốc 23:00, hiệu chỉnh giờ thật và Lập Xuân).
   */
  text: string;
  /** Chỉ số địa chi trên vòng Tý → Hợi của huy hiệu. */
  branchIndex: number;
}

export interface LoveEmblemPersonPreview {
  hasName: boolean;
  gender: '' | 'nam' | 'nu';
  hasDate: boolean;
  hasHour: boolean;
  /** Tứ trụ rút gọn, chỉ dựng khi dữ liệu tương ứng đã đủ. */
  pillars: LoveEmblemPillar[];
  /** Các địa chi cần thắp sáng, đã loại trùng. */
  branchIndices: number[];
  /**
   * Khoá ổn định của ngày sinh hợp lệ (loại lịch–ngày–tháng–năm).
   *
   * Dùng để khởi động lại chuỗi sáng Ngày → Tháng → Năm khi ngày đổi; rỗng khi
   * ngày chưa đủ hoặc không hợp lệ.
   */
  dateKey: string;
}

const BRANCH_LABELS: Record<EarthlyBranch, string> = {
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

const PILLAR_LABELS = {
  year: 'Năm',
  month: 'Tháng',
  day: 'Ngày',
  hour: 'Giờ',
} as const;

interface LunarContext {
  lunarYear: number;
  lunarMonth: number;
  jd: number;
}

function parseInteger(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : null;
}

/**
 * Kiểm tra một ngày/tháng/năm có thật theo loại lịch.
 *
 * Dương lịch dựa vào vòng quy đổi Julian Day để loại các ngày bị chuẩn hoá
 * (31/02, 29/02 năm không nhuận, ...). Âm lịch quy đổi sang dương rồi quy ngược
 * để loại ngày không tồn tại trong tháng thiếu; form không có trường tháng nhuận
 * nên ngày rơi vào tháng nhuận cũng được coi là không hợp lệ.
 *
 * Hàm thuần và dùng chung cho cả validate biểu mẫu lẫn bản xem trước huy hiệu.
 */
export function isValidLoveDate(
  calendarType: 'solar' | 'lunar',
  day: number,
  month: number,
  year: number
): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
    return false;
  }
  if (year < 1900 || year > 2099 || month < 1 || month > 12) return false;

  if (calendarType === 'solar') {
    if (day < 1 || day > 31) return false;

    const jd = jdFromDate(day, month, year);
    const roundTrip = jdToDate(jd);
    return roundTrip.day === day && roundTrip.month === month && roundTrip.year === year;
  }

  if (day < 1 || day > 30) return false;

  const solar = convertLunarToSolarVN(day, month, year, false);
  if (solar.day === 0 || solar.month === 0 || solar.year === 0) return false;

  const roundTrip = convertSolarToLunarVN(solar.day, solar.month, solar.year);
  return (
    roundTrip.day === day &&
    roundTrip.month === month &&
    roundTrip.year === year &&
    !roundTrip.isLeapMonth
  );
}

function parseValidSolarDate(
  value: LoveProfileValue
): { day: number; month: number; year: number; jd: number } | null {
  const day = parseInteger(value.day);
  const month = parseInteger(value.month);
  const year = parseInteger(value.year);

  if (day === null || month === null || year === null) return null;
  if (!isValidLoveDate('solar', day, month, year)) return null;

  return { day, month, year, jd: jdFromDate(day, month, year) };
}

function buildLunarContext(value: LoveProfileValue): LunarContext | null {
  if (value.calendarType === 'lunar') {
    const day = parseInteger(value.day);
    const month = parseInteger(value.month);
    const year = parseInteger(value.year);

    if (day === null || month === null || year === null) return null;
    if (!isValidLoveDate('lunar', day, month, year)) return null;

    const solar = convertLunarToSolarVN(day, month, year, false);
    return {
      lunarYear: year,
      lunarMonth: month,
      jd: jdFromDate(solar.day, solar.month, solar.year),
    };
  }

  const solar = parseValidSolarDate(value);
  if (!solar) return null;

  const lunar = convertSolarToLunarVN(solar.day, solar.month, solar.year);
  return {
    lunarYear: lunar.year,
    lunarMonth: lunar.month,
    jd: solar.jd,
  };
}

function toBranchIndex(branch: EarthlyBranch): number {
  return EARTHLY_BRANCHES.indexOf(branch);
}

/**
 * Dựng bản xem trước Địa chi cho huy hiệu Tình Duyên.
 *
 * Hàm thuần, không gọi engine và chỉ dùng dữ liệu người dùng đã nhập. Đây là
 * gợi ý trang trí, không phải lá số chính thức: ngày thiếu/không hợp lệ sẽ không
 * thắp sáng bất kỳ chi nào; giờ vẫn có thể thắp chi giờ nếu đã chọn.
 *
 * Chỉ trả về Địa chi, không trả về Thiên Can: Can của bản xem trước có thể lệch
 * với lá số cuối cùng do mốc 23:00, hiệu chỉnh giờ thật và Lập Xuân.
 */
export function buildLoveEmblemPreview(value: LoveProfileValue): LoveEmblemPersonPreview {
  const hasName = value.name.trim().length > 0;
  const hour = parseInteger(value.hour);
  const hasHour = hour !== null && hour >= 0 && hour <= 23;
  const day = parseInteger(value.day);
  const month = parseInteger(value.month);
  const year = parseInteger(value.year);
  const context = buildLunarContext(value);
  const dateKey =
    context && day !== null && month !== null && year !== null
      ? `${value.calendarType}-${day}-${month}-${year}`
      : '';
  const pillars: LoveEmblemPillar[] = [];
  const branchIndices = new Set<number>();

  if (context) {
    const year = getYearCanChi(context.lunarYear);
    const month = getMonthCanChi(context.lunarYear, context.lunarMonth);
    const day = getDayCanChi(context.jd);

    const basePillars: LoveEmblemPillar[] = [
      {
        key: 'year',
        label: PILLAR_LABELS.year,
        text: BRANCH_LABELS[year.branch],
        branchIndex: toBranchIndex(year.branch),
      },
      {
        key: 'month',
        label: PILLAR_LABELS.month,
        text: BRANCH_LABELS[month.branch],
        branchIndex: toBranchIndex(month.branch),
      },
      {
        key: 'day',
        label: PILLAR_LABELS.day,
        text: BRANCH_LABELS[day.branch],
        branchIndex: toBranchIndex(day.branch),
      },
    ];

    basePillars.forEach((pillar) => {
      pillars.push(pillar);
      branchIndices.add(pillar.branchIndex);
    });

    if (hour !== null && hasHour) {
      const branch = getHourBranch(hour);
      pillars.push({
        key: 'hour',
        label: PILLAR_LABELS.hour,
        text: BRANCH_LABELS[branch],
        branchIndex: toBranchIndex(branch),
      });
      branchIndices.add(toBranchIndex(branch));
    }
  } else if (hour !== null && hour >= 0 && hour <= 23) {
    // Chưa đủ ngày để dựng đủ trụ, nhưng chi giờ vẫn là dữ liệu có thật.
    const branch = getHourBranch(hour);
    branchIndices.add(toBranchIndex(branch));
    pillars.push({
      key: 'hour',
      label: PILLAR_LABELS.hour,
      text: BRANCH_LABELS[branch],
      branchIndex: toBranchIndex(branch),
    });
  }

  return {
    hasName,
    gender: value.gender,
    hasDate: context !== null,
    hasHour,
    pillars,
    branchIndices: Array.from(branchIndices).sort((a, b) => a - b),
    dateKey,
  };
}
