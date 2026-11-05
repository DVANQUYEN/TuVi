import { describe, it, expect } from 'vitest';
import {
  calculateEquationOfTimeMinutes,
  calculateLongitudeDeltaMinutes,
  calculateTrueSolarTime,
} from '../equation-of-time';

describe('equation-of-time', () => {
  it('EoT ranges from -16 to +16 minutes', () => {
    for (let day = 1; day <= 365; day++) {
      const eot = calculateEquationOfTimeMinutes(day);
      expect(eot).toBeGreaterThanOrEqual(-17);
      expect(eot).toBeLessThanOrEqual(17);
    }
  });

  it('True Solar Time at Hà Nội on 01/11/2026 14:58', () => {
    // Hà Nội: 105.85°E
    // Day of year for Nov 1 = 305
    const clockTime = 14 * 60 + 58; // 14:58
    const tst = calculateTrueSolarTime(clockTime, 305, 105.85);

    // Expected: ~15:18 (EoT ≈ +16.4min, longitude delta ≈ +3.4min)
    // Đầu tháng 11 EoT đạt cực đại khoảng +16 phút.
    expect(tst).toBeCloseTo(15 * 60 + 18, -1);
  });

  it('longitude delta is 4 minutes per degree', () => {
    expect(calculateLongitudeDeltaMinutes(105, 105)).toBe(0);
    expect(calculateLongitudeDeltaMinutes(106, 105)).toBe(4);
    expect(calculateLongitudeDeltaMinutes(103, 105)).toBe(-8);
  });
});
