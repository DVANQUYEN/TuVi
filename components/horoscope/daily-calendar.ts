import { BRANCH_NAMES } from '@/lib/ziwei/daily';
import { NAP_AM_60 } from '@/lib/ziwei/data/stems-branches';
import { getDayCanChi } from '@/lib/ziwei/utils/can-chi';
import { convertSolarToLunarVN, jdFromDate } from '@/lib/ziwei/utils/ho-ngoc-duc-lunar';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from '@/lib/ziwei/types/enums';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';

/** Chữ Hán của 12 địa chi, dùng làm biểu tượng trang trí (thay emoji). */
export const ZODIAC_HAN: Readonly<Record<EarthlyBranch, string>> = {
  ty: '子',
  suu: '丑',
  dan: '寅',
  mao: '卯',
  thin: '辰',
  ti: '巳',
  ngo: '午',
  mui: '未',
  than: '申',
  dau: '酉',
  tuat: '戌',
  hoi: '亥',
};

/** Quan hệ giữa chi của tuổi và chi của ngày (cùng quy tắc với lib/ziwei/daily.ts). */
export type BranchRelation = 'tamHop' | 'lucXung' | 'tuHinh' | 'binh';

export interface DailyCalendar {
  lunarDay: number;
  lunarMonth: number;
  isLeapMonth: boolean;
  /** Can Chi của ngày, ví dụ "Giáp Tý". */
  dayCanChi: string;
  /** Ngũ hành nạp âm của ngày, ví dụ "Hải Trung Kim". */
  napAm: string;
  /** Chi của ngày. */
  dayBranch: EarthlyBranch;
  /** Chi xung (đối nghịch lục xung) với chi ngày. */
  conflictBranch: EarthlyBranch;
  /** Trực của ngày (1 trong 12 trực), kèm đánh giá tốt/xấu. */
  truc: { name: string; lucky: boolean };
  /** Các giờ hoàng đạo trong ngày, theo thứ tự thời gian. */
  luckyHours: EarthlyBranch[];
}

/** 12 Trực, bắt đầu từ Trực Kiến tại chi của tháng âm lịch. */
export const TRUC_NAMES = [
  'Kiến',
  'Trừ',
  'Mãn',
  'Bình',
  'Định',
  'Chấp',
  'Phá',
  'Nguy',
  'Thành',
  'Thu',
  'Khai',
  'Bế',
] as const;

/** Trực hoàng đạo (ngày tốt). Các trực còn lại là hắc đạo (ngày xấu). */
const LUCKY_TRUC: ReadonlySet<string> = new Set(['Kiến', 'Mãn', 'Bình', 'Định', 'Thành', 'Khai']);

/** Độ lệch của 6 giờ hoàng đạo so với giờ Thanh Long (giờ đầu của chu kỳ 12 giờ). */
const LUCKY_HOUR_OFFSETS = [0, 1, 4, 5, 7, 10] as const;

/** Khung giờ (dương lịch) của từng chi. */
export const HOUR_SLOTS: Readonly<Record<EarthlyBranch, string>> = {
  ty: '23h-1h',
  suu: '1h-3h',
  dan: '3h-5h',
  mao: '5h-7h',
  thin: '7h-9h',
  ti: '9h-11h',
  ngo: '11h-13h',
  mui: '13h-15h',
  than: '15h-17h',
  dau: '17h-19h',
  tuat: '19h-21h',
  hoi: '21h-23h',
};

const STEM_LABELS: Readonly<Record<string, string>> = {
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

/**
 * Tính thông tin lịch cho ngày dạng "YYYY-MM-DD" (theo ngày local, khớp với DailyHoroscope.date).
 */
export function getDailyCalendar(isoDate: string): DailyCalendar {
  const [yy, mm, dd] = isoDate.split('-').map(Number);
  const jd = jdFromDate(dd, mm, yy);
  const lunar = convertSolarToLunarVN(dd, mm, yy);
  const dayCanChi = getDayCanChi(jd);

  const stemIndex = HEAVENLY_STEMS.indexOf(dayCanChi.stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(dayCanChi.branch);
  // Vị trí trong chu kỳ 60 Giáp Tý: k % 10 = can, k % 12 = chi
  const cycleIndex = Array.from({ length: 60 }, (_, k) => k).find(
    (k) => k % 10 === stemIndex && k % 12 === branchIndex
  );
  const napAmEntry = cycleIndex === undefined ? '' : (NAP_AM_60[cycleIndex] ?? '');

  // Trực: chi tháng âm lịch (tháng 1 = Dần, index 2) có Trực Kiến; đếm thuận theo chi ngày.
  const monthBranchIndex = (lunar.month + 1) % 12;
  const trucName = TRUC_NAMES[(branchIndex - monthBranchIndex + 12) % 12];

  // Giờ hoàng đạo: giờ Thanh Long khởi tại chi (8 + 2 × chi ngày) mod 12.
  const thanhLongIndex = (8 + 2 * branchIndex) % 12;
  const luckyHourIndexes = LUCKY_HOUR_OFFSETS.map((offset) => (thanhLongIndex + offset) % 12);
  // Lọc theo thứ tự chi để giữ đúng thứ tự thời gian trong ngày (Tý → Hợi).
  const luckyHours = EARTHLY_BRANCHES.filter((_, i) => luckyHourIndexes.includes(i));

  return {
    lunarDay: lunar.day,
    lunarMonth: lunar.month,
    isLeapMonth: lunar.isLeapMonth,
    dayCanChi: `${STEM_LABELS[dayCanChi.stem]} ${BRANCH_NAMES[dayCanChi.branch]}`,
    napAm: napAmEntry.split(' - ')[1] ?? '',
    dayBranch: dayCanChi.branch,
    conflictBranch: EARTHLY_BRANCHES[(branchIndex + 6) % 12],
    truc: { name: trucName, lucky: LUCKY_TRUC.has(trucName) },
    luckyHours,
  };
}

/** Quan hệ chi tuổi với chi ngày. Quy tắc giống calculateRelationship trong lib/ziwei/daily.ts. */
export function getBranchRelation(branch: EarthlyBranch, dayBranch: EarthlyBranch): BranchRelation {
  const diff = (EARTHLY_BRANCHES.indexOf(dayBranch) - EARTHLY_BRANCHES.indexOf(branch) + 12) % 12;
  if (diff === 4 || diff === 8) return 'tamHop';
  if (diff === 6) return 'lucXung';
  if (diff === 3 || diff === 9) return 'tuHinh';
  return 'binh';
}
