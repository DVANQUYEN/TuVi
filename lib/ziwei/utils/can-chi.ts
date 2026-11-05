/**
 * Tính Can Chi 4 trụ: Năm, Tháng, Ngày, Giờ
 */

import type { EarthlyBranch, HeavenlyStem } from '../types/enums';
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from '../types/enums';

/**
 * Tính Can Chi năm âm lịch
 * Công thức: Can = (Y + 6) % 10, Chi = (Y + 8) % 12
 *
 * @param lunarYear - Năm âm lịch
 * @returns Can Chi của năm
 */
export function getYearCanChi(lunarYear: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const stemIndex = (lunarYear + 6) % 10;
  const branchIndex = (lunarYear + 8) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * Tính Can Chi tháng âm lịch
 * Tháng 11 = Tý, tháng 12 = Sửu, tháng 1 = Dần...
 *
 * @param lunarYear - Năm âm lịch
 * @param lunarMonth - Tháng âm lịch (1-12)
 * @returns Can Chi của tháng
 */
export function getMonthCanChi(
  lunarYear: number,
  lunarMonth: number
): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const stemIndex = (lunarYear * 12 + lunarMonth + 3) % 10;
  const branchIndex = (lunarMonth + 1) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * Tính Can Chi ngày từ Julian Day Number
 * Can = (JD + 9) % 10, Chi = (JD + 1) % 12
 *
 * @param jd - Julian Day Number
 * @returns Can Chi của ngày
 */
export function getDayCanChi(jd: number): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const stemIndex = (jd + 9) % 10;
  const branchIndex = (jd + 1) % 12;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
  };
}

/**
 * Xác định Chi của giờ (12 canh giờ)
 * Giờ Tý (23:00-01:00) = chi 0, giờ Sửu (01:00-03:00) = chi 1...
 *
 * @param hour - Giờ theo 24h (0-23)
 * @returns Địa Chi của giờ
 */
function getHourBranch(hour: number): EarthlyBranch {
  const branchIndex = Math.floor((hour + 1) / 2) % 12;
  return EARTHLY_BRANCHES[branchIndex];
}

/**
 * Tính Can Chi giờ (12 canh giờ)
 * Can của giờ Tý phụ thuộc vào Can của ngày:
 * - Giáp, Kỷ ngày → Giáp Tý
 * - Ất, Canh ngày → Bính Tý
 * - Bính, Tân ngày → Mậu Tý
 * - Đinh, Nhâm ngày → Canh Tý
 * - Mậu, Quý ngày → Nhâm Tý
 *
 * @param dayStem - Thiên Can của ngày
 * @param hour - Giờ theo 24h (0-23)
 * @returns Can Chi của giờ
 */
export function getHourCanChi(
  dayStem: HeavenlyStem,
  hour: number
): { stem: HeavenlyStem; branch: EarthlyBranch } {
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const baseStem = (dayStemIndex % 5) * 2;
  const stemIndex = (baseStem + hourBranchIndex) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex],
  };
}

/**
 * Tính Tứ trụ (Năm, Tháng, Ngày, Giờ) Can Chi
 *
 * @param lunarYear - Năm âm lịch
 * @param lunarMonth - Tháng âm lịch
 * @param jd - Julian Day Number của ngày
 * @param hour - Giờ theo 24h
 * @returns Tứ trụ Can Chi
 */
export function getFourPillars(
  lunarYear: number,
  lunarMonth: number,
  jd: number,
  hour: number
): {
  year: { stem: HeavenlyStem; branch: EarthlyBranch };
  month: { stem: HeavenlyStem; branch: EarthlyBranch };
  day: { stem: HeavenlyStem; branch: EarthlyBranch };
  hour: { stem: HeavenlyStem; branch: EarthlyBranch };
} {
  const dayCanChi = getDayCanChi(jd);

  return {
    year: getYearCanChi(lunarYear),
    month: getMonthCanChi(lunarYear, lunarMonth),
    day: dayCanChi,
    hour: getHourCanChi(dayCanChi.stem, hour),
  };
}

// Giữ lại hàm helper cho các module khác nếu cần
export { getHourBranch };
