import type { EarthlyBranch } from './types/enums';
import { getYearCanChi } from './utils/can-chi';

export interface ZodiacCompatibility {
  year: number;
  branch: EarthlyBranch;
  branchLabel: string;
  /** 2 tuổi cùng tam hợp với tuổi của bạn (không tính bạn). */
  tamHop: EarthlyBranch[];
  /** Tuổi lục hợp (không tính bạn). */
  lucHop: EarthlyBranch;
  /** 3 tuổi cùng tứ hành xung với tuổi của bạn (không tính bạn). */
  tuHanhXung: EarthlyBranch[];
}

export const BRANCH_LABELS: Readonly<Record<EarthlyBranch, string>> = {
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

export type ZodiacBranchGroup = readonly EarthlyBranch[];
export type ZodiacBranchPair = readonly [EarthlyBranch, EarthlyBranch];

// Tam hợp: Thân-Tý-Thìn, Dần-Ngọ-Tuất, Hợi-Mão-Mùi, Tỵ-Dậu-Sửu
export const TAM_HOP_GROUPS: readonly ZodiacBranchGroup[] = [
  ['than', 'ty', 'thin'],
  ['dan', 'ngo', 'tuat'],
  ['hoi', 'mao', 'mui'],
  ['ti', 'dau', 'suu'],
];

// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
export const LUC_HOP_PAIRS: readonly ZodiacBranchPair[] = [
  ['ty', 'suu'],
  ['dan', 'hoi'],
  ['mao', 'tuat'],
  ['thin', 'dau'],
  ['ti', 'than'],
  ['ngo', 'mui'],
];

const LUC_HOP: Readonly<Record<EarthlyBranch, EarthlyBranch>> = Object.fromEntries(
  LUC_HOP_PAIRS.flatMap(([left, right]) => [
    [left, right],
    [right, left],
  ])
) as Record<EarthlyBranch, EarthlyBranch>;

// Tứ hành xung: Tý-Ngọ-Mão-Dậu, Dần-Thân-Tỵ-Hợi, Thìn-Tuất-Sửu-Mùi
export const TU_HANH_XUNG_GROUPS: readonly ZodiacBranchGroup[] = [
  ['ty', 'ngo', 'mao', 'dau'],
  ['dan', 'than', 'ti', 'hoi'],
  ['thin', 'tuat', 'suu', 'mui'],
];

export const MIN_ZODIAC_YEAR = 1900;
export const MAX_ZODIAC_YEAR = 2099;

const BRANCH_CYCLE_YEARS = 12;
const DEFAULT_EXAMPLE_START_YEAR = 1984;
const DEFAULT_EXAMPLE_COUNT = 4;

/**
 * Trả về các năm sinh ví dụ thuộc một Địa chi, bắt đầu từ mốc 1984 (Tý) và lặp lại mỗi 12 năm.
 * Năm bắt đầu được kẹp trong [MIN_ZODIAC_YEAR, MAX_ZODIAC_YEAR]; kết quả không vượt quá MAX_ZODIAC_YEAR.
 * Ném lỗi nếu chi không hợp lệ hoặc tham số không phải số nguyên dương.
 */
export function getBranchExampleYears(
  branch: EarthlyBranch,
  options: { startYear?: number; count?: number } = {}
): number[] {
  if (!(branch in BRANCH_LABELS)) {
    throw new RangeError(`Địa chi không hợp lệ: ${String(branch)}`);
  }

  const { startYear = DEFAULT_EXAMPLE_START_YEAR, count = DEFAULT_EXAMPLE_COUNT } = options;

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('Số năm ví dụ phải là số nguyên dương');
  }

  if (!Number.isInteger(startYear)) {
    throw new RangeError(
      `Năm bắt đầu phải là số nguyên từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}`
    );
  }

  const firstYear = Math.min(Math.max(startYear, MIN_ZODIAC_YEAR), MAX_ZODIAC_YEAR);
  const years: number[] = [];

  for (let year = firstYear; year <= MAX_ZODIAC_YEAR; year += 1) {
    if (getYearCanChi(year).branch !== branch) continue;

    for (
      let example = year;
      example <= MAX_ZODIAC_YEAR && years.length < count;
      example += BRANCH_CYCLE_YEARS
    ) {
      years.push(example);
    }
    break;
  }

  return years;
}

/**
 * Tra cứu tam hợp, lục hợp và tứ hành xung của một năm sinh.
 * Tính theo năm dương lịch đầu vào; người sinh trước Tết âm lịch cần dùng năm âm lịch trước đó.
 * Ném lỗi nếu năm không phải số nguyên trong khoảng [MIN_ZODIAC_YEAR, MAX_ZODIAC_YEAR].
 */
export function getZodiacCompatibility(year: number): ZodiacCompatibility {
  if (!Number.isInteger(year) || year < MIN_ZODIAC_YEAR || year > MAX_ZODIAC_YEAR) {
    throw new RangeError(`Năm sinh phải là số nguyên từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}`);
  }

  const { branch } = getYearCanChi(year);

  const tamHopGroup = TAM_HOP_GROUPS.find((group) => group.includes(branch)) ?? [];
  const xungGroup = TU_HANH_XUNG_GROUPS.find((group) => group.includes(branch)) ?? [];

  return {
    year,
    branch,
    branchLabel: BRANCH_LABELS[branch],
    tamHop: tamHopGroup.filter((b) => b !== branch),
    lucHop: LUC_HOP[branch],
    tuHanhXung: xungGroup.filter((b) => b !== branch),
  };
}
