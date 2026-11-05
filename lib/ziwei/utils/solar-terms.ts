/**
 * Tính thời điểm tiết Lập Xuân
 * Lập Xuân khi kinh độ Mặt Trởi = 315°
 */

import { getSunLongitudeDegrees, jdFromDate, jdToDate } from './ho-ngoc-duc-lunar';

const LAP_XUAN_LONGITUDE = 315;

/**
 * Tính khoảng cách góc từ một kinh độ đến Lập Xuân (315°),
 * trả về giá trị trong khoảng (-180, 180]
 */
function longitudeDiffToLapXuan(longitude: number): number {
  return ((longitude - LAP_XUAN_LONGITUDE + 180 + 360) % 360) - 180;
}

/**
 * Tính thời điểm tiết Lập Xuân trong năm (UTC+7)
 * Lập Xuân là khi kinh độ Mặt Trởi đạt 315°
 *
 * @param year - Năm Dương lịch
 * @returns Date đại diện cho ngày Lập Xuân tại UTC+7
 */
export function getLapXuanMomentUtc7(year: number): Date {
  // Lập Xuân thường rơi vào khoảng 3-5/2, tìm trong khoảng 15/1 đến 15/2
  const startJd = jdFromDate(15, 1, year);
  const endJd = jdFromDate(15, 2, year);

  let crossingJd = startJd;
  let previousDiff = longitudeDiffToLapXuan(getSunLongitudeDegrees(startJd, 7));

  for (let jd = startJd + 1; jd <= endJd; jd++) {
    const currentDiff = longitudeDiffToLapXuan(getSunLongitudeDegrees(jd, 7));

    // Nếu dấu thay đổi từ âm sang dương, đã vượt qua 315°
    if (previousDiff < 0 && currentDiff >= 0) {
      crossingJd = previousDiff + currentDiff === 0 ? jd : jd - 1;
      break;
    }

    if (currentDiff === 0) {
      crossingJd = jd;
      break;
    }

    previousDiff = currentDiff;
  }

  const { day, month, year: y } = jdToDate(crossingJd);
  return new Date(y, month - 1, day);
}

/**
 * Kiểm tra ngày có trước Lập Xuân không
 *
 * @param day - Ngày
 * @param month - Tháng
 * @param year - Năm
 * @returns true nếu ngày nằm trước Lập Xuân trong năm đó
 */
export function isBeforeLapXuan(day: number, month: number, year: number): boolean {
  const lapXuan = getLapXuanMomentUtc7(year);
  const dateJd = jdFromDate(day, month, year);
  const lapXuanJd = jdFromDate(lapXuan.getDate(), lapXuan.getMonth() + 1, lapXuan.getFullYear());

  return dateJd < lapXuanJd;
}
