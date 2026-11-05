import type { EarthlyBranch, HeavenlyStem } from '@/lib/ziwei/types/enums';

/** Ánh xạ Thiên Can sang tên tiếng Việt. */
export const HEAVENLY_STEM_LABELS: Readonly<Record<HeavenlyStem, string>> = {
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

/** Ánh xạ Địa Chi sang tên tiếng Việt. */
export const EARTHLY_BRANCH_LABELS: Readonly<Record<EarthlyBranch, string>> = {
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

/** Trả về tên Thiên Can tiếng Việt. */
export function getStemLabel(stem: HeavenlyStem): string {
  return HEAVENLY_STEM_LABELS[stem] ?? stem;
}

/** Trả về tên Địa Chi tiếng Việt. */
export function getBranchLabel(branch: EarthlyBranch): string {
  return EARTHLY_BRANCH_LABELS[branch] ?? branch;
}

/** Trả về cặp Can Chi đầy đủ. */
export function getStemBranchLabel(stem: HeavenlyStem, branch: EarthlyBranch): string {
  return `${getStemLabel(stem)} ${getBranchLabel(branch)}`;
}
