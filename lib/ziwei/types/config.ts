import type { BrightnessLevel } from './enums';

/** Trường phái Tử Vi được hỗ trợ. */
export type SchoolType = 'namPhai' | 'trungChau' | 'bacPhai';

/** Quy tắc ranh giới ngày (giờ Tý). */
export type DayBoundaryRule = '23:00' | '00:00';

/** Quy tắc xử lý tháng nhuận. */
export type LeapMonthRule = 'split15' | 'baseMonth' | 'nextMonth';

/** Quy tắc chuyển năm Can Chi. */
export type YearBoundaryRule = 'tet' | 'lapXuan';

/** Quy tắc chọn cung chính khi hiển thị Tuần/Triệt. */
export type TuanTrietPrimaryRule = 'none' | 'first' | 'nearMenh';

/** Cấu hình mặc định và các tùy chọn hiển thị của engine Tử Vi. */
export interface ZiweiConfig {
  /** Cấu hình trường phái. */
  school: {
    default: SchoolType;
    options: readonly SchoolType[];
    supportedInMvp: readonly SchoolType[];
    displayOnResult: boolean;
  };
  /** Cấu hình ranh giới ngày. */
  dayBoundary: {
    default: DayBoundaryRule;
    options: readonly DayBoundaryRule[];
    showOnlyWhen: '23:00-01:00';
    source: string;
  };
  /** Cấu hình tháng nhuận. */
  leapMonth: {
    default: LeapMonthRule;
    options: readonly LeapMonthRule[];
    showWarning: boolean;
    source: string;
  };
  /** Cấu hình chuyển năm Can Chi. */
  yearBoundary: {
    default: YearBoundaryRule;
    options: readonly YearBoundaryRule[];
    source: string;
  };
  /** Cấu hình Tuần/Triệt. */
  tuanTriet: {
    display: 'bothPalaces';
    primary: TuanTrietPrimaryRule;
    options: { primary: readonly TuanTrietPrimaryRule[] };
    source: string;
  };
  /** Cấu hình độ sáng sao. */
  brightness: {
    dataLevels: 5;
    displayLevels: 5;
    fallbackMapping7To5: Readonly<Record<string, BrightnessLevel>>;
    useVietnameseTable: boolean;
    vietnameseTableSource: string;
  };
  /** Cấu hình giờ mặt trờ thật. */
  trueSolarTime: {
    default: boolean;
    showInAdvanced: boolean;
    displayCorrection: boolean;
    standardMeridian: number;
    source: string;
  };
}

/** Cấu hình đã được merge từ mặc định và tùy chọn ngườ dùng. */
export interface ResolvedZiweiConfig {
  school: SchoolType;
  dayBoundary: DayBoundaryRule;
  leapMonth: LeapMonthRule;
  yearBoundary: YearBoundaryRule;
  tuanTrietPrimary: TuanTrietPrimaryRule;
  useVietnameseBrightnessTable: boolean;
  useTrueSolarTime: boolean;
  applyHistoricalTimezone: boolean;
  standardMeridian: number;
}

/** Tùy chọn ngườ dùng có thể override cấu hình mặc định. */
export interface UserPreferences {
  school?: SchoolType;
  dayBoundary?: DayBoundaryRule;
  leapMonth?: LeapMonthRule;
  yearBoundary?: YearBoundaryRule;
  tuanTrietPrimary?: TuanTrietPrimaryRule;
  useTrueSolarTime?: boolean;
  applyHistoricalTimezone?: boolean;
}
