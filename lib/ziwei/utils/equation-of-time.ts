/**
 * Tính phương trình thời gian (Equation of Time - EoT)
 * theo công thức Spencer (1971)
 */

/**
 * Tính phương trình thời gian (Equation of Time - EoT)
 * theo công thức Spencer (1971)
 *
 * @param dayOfYear - Ngày trong năm (1-366)
 * @returns EoT tính bằng phút (-16 đến +16 phút)
 */
export function calculateEquationOfTimeMinutes(dayOfYear: number): number {
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

  const eot =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  return eot;
}

/**
 * Tính độ lệch kinh độ địa phương so với kinh tuyến chuẩn
 *
 * @param longitude - Kinh độ địa điểm (độ thập phân)
 * @param standardMeridian - Kinh tuyến chuẩn (105°E cho Việt Nam)
 * @returns Độ lệch tính bằng phút (4 phút/độ)
 */
export function calculateLongitudeDeltaMinutes(
  longitude: number,
  standardMeridian: number = 105
): number {
  return 4 * (longitude - standardMeridian);
}

/**
 * Tính Giờ Mặt Trởi Thật (True Solar Time)
 *
 * @param clockTime - Giờ đồng hồ (phút từ 00:00)
 * @param dayOfYear - Ngày trong năm (1-366)
 * @param longitude - Kinh độ địa điểm
 * @param standardMeridian - Kinh tuyến chuẩn (mặc định 105°E)
 * @returns Giờ mặt trởi thật (phút từ 00:00)
 */
export function calculateTrueSolarTime(
  clockTime: number,
  dayOfYear: number,
  longitude: number,
  standardMeridian: number = 105
): number {
  const eot = calculateEquationOfTimeMinutes(dayOfYear);
  const lonDelta = calculateLongitudeDeltaMinutes(longitude, standardMeridian);

  return clockTime + eot + lonDelta;
}
