/**
 * Tính Tuần/Triệt 2 cung
 */

import type { EarthlyBranch, HeavenlyStem } from '../types/enums';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from '../types/enums';

/**
 * Tìm vị trí của một cặp Can Chi trong chu kỳ 60 Giáp Tý.
 * Trả về vị trí 0-59.
 */
function findSexagenaryPosition(stem: HeavenlyStem, branch: EarthlyBranch): number {
  const stemIndex = HEAVENLY_STEMS.indexOf(stem);
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);

  // Cùng một vị trí trong chu kỳ 60 phải thỏa mãn:
  // pos % 10 === stemIndex và pos % 12 === branchIndex
  for (let offset = 0; offset < 6; offset++) {
    const pos = stemIndex + offset * 10;
    if (pos % 12 === branchIndex) {
      return pos;
    }
  }

  throw new Error(`Không tìm thấy vị trí cho cặp Can Chi ${stem}-${branch}`);
}

/**
 * Tính 2 cung bị Triệt (Triệt Lộ Không Vong)
 * Dựa trên Lục Giáp: 6 cặp Can Chi
 *
 * @param yearStem - Thiên Can năm
 * @returns 2 Địa Chi bị Triệt
 */
export function calculateTrietBranches(
  yearStem: string,
  _yearBranch: string
): readonly [EarthlyBranch, EarthlyBranch] {
  const stemIndex = HEAVENLY_STEMS.indexOf(yearStem as HeavenlyStem);
  const group = stemIndex % 5;

  const trietMap: Record<number, readonly [EarthlyBranch, EarthlyBranch]> = {
    0: ['than', 'dau'],
    1: ['ngo', 'mui'],
    2: ['thin', 'ti'],
    3: ['dan', 'mao'],
    4: ['ty', 'suu'],
  };

  return trietMap[group];
}

/**
 * Tính 2 cung bị Tuần (Tuần Trung Không Vong)
 *
 * @param yearStem - Thiên Can năm
 * @param yearBranch - Địa Chi năm
 * @returns 2 Địa Chi bị Tuần
 */
export function calculateTuanBranches(
  yearStem: string,
  yearBranch: string
): readonly [EarthlyBranch, EarthlyBranch] {
  const pos = findSexagenaryPosition(yearStem as HeavenlyStem, yearBranch as EarthlyBranch);
  const tuanIndex = Math.floor(pos / 10);

  const tuanMap: Record<number, readonly [EarthlyBranch, EarthlyBranch]> = {
    0: ['tuat', 'hoi'],
    1: ['than', 'dau'],
    2: ['ngo', 'mui'],
    3: ['thin', 'ti'],
    4: ['dan', 'mao'],
    5: ['ty', 'suu'],
  };

  return tuanMap[tuanIndex];
}

/**
 * Tính cả Tuần và Triệt
 *
 * @param yearStem - Thiên Can năm
 * @param yearBranch - Địa Chi năm
 * @returns Cả hai cặp Tuần và Triệt
 */
export function calculateTuanTriet(
  yearStem: string,
  yearBranch: string
): {
  tuan: readonly [EarthlyBranch, EarthlyBranch];
  triet: readonly [EarthlyBranch, EarthlyBranch];
} {
  return {
    tuan: calculateTuanBranches(yearStem, yearBranch),
    triet: calculateTrietBranches(yearStem, yearBranch),
  };
}
