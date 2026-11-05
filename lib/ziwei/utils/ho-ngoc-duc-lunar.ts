/**
 * Chuyển đổi Dương lịch ↔ Âm lịch theo thuật toán Hồ Ngọc Đức
 * Phạm vi: 1900-2099, timezone UTC+7
 *
 * Tham khảo: https://www.xemamlich.uhm.vn/calrules.html
 */

export interface VietnameseLunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

/**
 * Hàm INT theo định nghĩa của Hồ Ngọc Đức:
 * số nguyên lớn nhất không vượt quá x.
 * Với số âm: INT(-3.2) = -4.
 */
function int(x: number): number {
  return Math.floor(x);
}

/**
 * Tính Julian Day Number từ ngày Dương lịch
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = int((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;

  let jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;

  if (jd < 2299161) {
    jd = dd + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083;
  }

  return jd;
}

/**
 * Chuyển Julian Day Number sang ngày Dương lịch
 */
export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a: number;
  let b: number;
  let c: number;

  if (jd > 2299160) {
    a = jd + 32044;
    b = int((4 * a + 3) / 146097);
    c = a - int((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }

  const d = int((4 * c + 3) / 1461);
  const e = c - int((1461 * d) / 4);
  const m = int((5 * e + 2) / 153);

  const day = e - int((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * int(m / 10);
  const year = b * 100 + d - 4800 + int(m / 10);

  return { day, month, year };
}

/**
 * Tính ngày Sóc (New Moon) thứ k từ 1900-01-00.5
 * Sử dụng công thức thiên văn với 13 số hạng điều hòa
 */
export function getNewMoonDay(k: number, timeZone: number = 7): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  // Mean new moon
  const Jd1 =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  // Sun's mean anomaly
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  // Moon's mean anomaly
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  // Moon's argument of latitude
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  // 13 correction terms
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  // Delta T (correction for Earth's rotation)
  let deltaT: number;
  if (T < -11) {
    deltaT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  const JdNew = Jd1 + C1 - deltaT;
  return int(JdNew + 0.5 + timeZone / 24);
}

/**
 * Tính kinh độ Mặt Trởi tại JDN
 * @returns Cung hoàng đạo (0-11), 0 = Xuân phân
 */
export function getSunLongitude(jdn: number, timeZone: number = 7): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;

  // Mean anomaly
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  // Mean longitude
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  // Equation of center
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M);
  DL = DL + 0.00029 * Math.sin(dr * 3 * M);

  // True longitude
  let L = L0 + DL;
  L = L * dr;
  L = L - 2 * Math.PI * int(L / (2 * Math.PI));

  return int((L / Math.PI) * 6);
}

/**
 * Tính kinh độ Mặt Trởi tại JDN (độ, 0-360)
 * Dùng cho việc tìm tiết khí chính xác.
 */
export function getSunLongitudeDegrees(jdn: number, timeZone: number = 7): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;

  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M);
  DL = DL + 0.00029 * Math.sin(dr * 3 * M);

  const L = L0 + DL;
  const normalized = ((L % 360) + 360) % 360;
  return normalized;
}

/**
 * Tìm ngày bắt đầu tháng 11 âm lịch
 */
export function getLunarMonth11(yy: number, timeZone: number = 7): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = int(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);

  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }

  return nm;
}

/**
 * Xác định vị trí tháng nhuận
 */
export function getLeapMonthOffset(a11: number, timeZone: number = 7): number {
  const k = int((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);

  while (arc !== last && i < 14) {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  }

  return i < 14 ? i - 1 : 0;
}

/**
 * Chuyển đổi Dương lịch → Âm lịch (UTC+7)
 */
export function convertSolarToLunarVN(
  day: number,
  month: number,
  year: number,
  timeZone: number = 7
): VietnameseLunarDate {
  const dayNumber = jdFromDate(day, month, year);
  const k = int((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);

  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  const b11 = getLunarMonth11(year, timeZone);
  let a11 = b11;
  let lunarYear: number;

  if (a11 >= monthStart) {
    lunarYear = year;
    a11 = getLunarMonth11(year - 1, timeZone);
  } else {
    lunarYear = year + 1;
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = int((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }

  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth: lunarLeap,
  };
}

/**
 * Chuyển đổi Âm lịch → Dương lịch (UTC+7)
 */
export function convertLunarToSolarVN(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean,
  timeZone: number = 7
): { day: number; month: number; year: number } {
  let a11: number;
  let b11: number;

  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }

    if (isLeapMonth && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 };
    }

    if (isLeapMonth || off >= leapOff) {
      off += 1;
    }
  }

  const k = int(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}
