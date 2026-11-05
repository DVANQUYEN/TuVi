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

// Tam hợp: Thân-Tý-Thìn, Hợi-Mão-Mùi, Dần-Ngọ-Tuất, Tỵ-Dậu-Sửu
const TAM_HOP_GROUPS: readonly (readonly EarthlyBranch[])[] = [
  ['than', 'ty', 'thin'],
  ['hoi', 'mao', 'mui'],
  ['dan', 'ngo', 'tuat'],
  ['ti', 'dau', 'suu'],
];

// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
const LUC_HOP: Readonly<Record<EarthlyBranch, EarthlyBranch>> = {
  ty: 'suu',
  suu: 'ty',
  dan: 'hoi',
  hoi: 'dan',
  mao: 'tuat',
  tuat: 'mao',
  thin: 'dau',
  dau: 'thin',
  ti: 'than',
  than: 'ti',
  ngo: 'mui',
  mui: 'ngo',
};

// Tứ hành xung: Dần-Thân-Tỵ-Hợi, Tý-Ngọ-Mão-Dậu, Thìn-Tuất-Sửu-Mùi
const TU_HANH_XUNG_GROUPS: readonly (readonly EarthlyBranch[])[] = [
  ['dan', 'than', 'ti', 'hoi'],
  ['ty', 'ngo', 'mao', 'dau'],
  ['thin', 'tuat', 'suu', 'mui'],
];

export const MIN_ZODIAC_YEAR = 1900;
export const MAX_ZODIAC_YEAR = 2099;

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
