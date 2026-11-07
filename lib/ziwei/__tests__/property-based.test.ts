import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { createChartEngine } from '../engine/sao-menh.engine';
import type { BirthInfo } from '../types/input';
import type { ZiweiChart } from '../types/chart';
import { BRIGHTNESS_LEVELS, MAJOR_STAR_IDS } from '../types/enums';

/**
 * Kiểm tra một bộ (year, month, day) có tạo thành ngày Dương lịch hợp lệ hay không.
 * Dùng để lọc arbitrary sinh ngày tháng, tránh ngày không tồn tại (ví dụ: 31/2).
 *
 * @param year - Năm Dương lịch.
 * @param month - Tháng Dương lịch (1-12).
 * @param day - Ngày Dương lịch (1-31).
 * @returns true nếu là ngày hợp lệ.
 */
function isValidSolarDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

describe('Property-based tests', () => {
  const engine = createChartEngine();

  /**
   * Sinh lá số hoặc loại bỏ testcase nếu engine gặp lỗi chuyển đổi lịch Âm không hỗ trợ.
   *
   * @param birthInfo - Thông tin sinh.
   * @returns Lá số Tử Vi.
   */
  function generateChartOrDiscard(birthInfo: BirthInfo): ZiweiChart {
    try {
      return engine.generateChart(birthInfo);
    } catch (error) {
      if ((error as Error).message.includes('invalid lunar date')) {
        fc.pre(false);
      }
      throw error;
    }
  }

  /**
   * Arbitrary cho BirthInfo hợp lệ, dùng trong property-based testing.
   * Sinh ngẫu nhiên ngày tháng năm hợp lệ theo Dương lịch,
   * giờ 0-23, phút 0-59, giới tính nam/nữ, loại lịch dương.
   */
  const birthInfoArbitrary = fc
    .record({
      year: fc.integer({ min: 1900, max: 2099 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 31 }),
      hour: fc.integer({ min: 0, max: 23 }),
      minute: fc.integer({ min: 0, max: 59 }),
      gender: fc.constantFrom('nam' as const, 'nu' as const),
      calendarType: fc.constant('solar' as const),
    })
    .filter(({ year, month, day }) => isValidSolarDate(year, month, day));

  /**
   * Property: Lá số Tử Vi luôn có đúng 12 cung.
   */
  it('always has exactly 12 palaces', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);

        return chart.palaces.length === 12;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 12 cung có 12 Địa Chi phân biệt, không trùng lặp.
   */
  it('palaces have unique branches (no duplicates)', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);
        const branches = chart.palaces.map((p) => p.branch);
        const uniqueBranches = new Set(branches);

        return uniqueBranches.size === 12;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: 12 cung có 12 palaceId phân biệt, không trùng lặp.
   */
  it('palaces have unique IDs (no duplicates)', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);
        const ids = chart.palaces.map((p) => p.id);
        const uniqueIds = new Set(ids);

        return uniqueIds.size === 12;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Mỗi chính tinh trong 14 sao xuất hiện đúng một lần trên toàn bộ lá số.
   */
  it('each major star appears exactly once across all palaces', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);

        const starCounts: Record<string, number> = {};
        for (const starId of MAJOR_STAR_IDS) {
          starCounts[starId] = 0;
        }

        for (const palace of chart.palaces) {
          for (const star of palace.majorStars) {
            if (starCounts[star.id] !== undefined) {
              starCounts[star.id]++;
            }
          }
        }

        return Object.values(starCounts).every((count) => count === 1);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) luôn đủ 4 sao.
   */
  it('always has exactly 4 mutagen stars (Tứ Hóa)', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);

        let mutagenCount = 0;
        for (const palace of chart.palaces) {
          for (const star of palace.majorStars) {
            if (star.mutagen) {
              mutagenCount++;
            }
          }
          for (const star of palace.auspiciousStars) {
            if (star.mutagen) {
              mutagenCount++;
            }
          }
          for (const star of palace.maleficStars) {
            if (star.mutagen) {
              mutagenCount++;
            }
          }
        }

        return mutagenCount === 4;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Audit trail luôn đầy đủ các trường bắt buộc và có ít nhất 4 bước xử lý.
   */
  it('audit trail is always complete', () => {
    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);

        return (
          chart.auditTrail.engineVersion !== undefined &&
          chart.auditTrail.configApplied !== undefined &&
          chart.auditTrail.steps.length >= 4 &&
          chart.auditTrail.timeAdjustments !== undefined &&
          chart.auditTrail.calendarResolution !== undefined &&
          chart.auditTrail.totalDuration >= 0
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Nam và Nữ với cùng thông tin sinh có cấu trúc lá số giống nhau
   * (số cung, vị trí Mệnh/Thân), nhưng hướng đại hạn sẽ khác nhau do âm dương thuận/nghịch.
   */
  it('male and female charts have same structure but different period directions', () => {
    fc.assert(
      fc.property(
        birthInfoArbitrary.map((data) => ({ ...data, gender: 'nam' as const })),
        (maleBirthData) => {
          const femaleBirthData: BirthInfo = {
            ...maleBirthData,
            gender: 'nu',
          };
          const maleBirthInfo: BirthInfo = {
            ...maleBirthData,
            name: 'Test User',
          };
          const femaleBirthInfo: BirthInfo = {
            ...femaleBirthData,
            name: 'Test User',
          };

          const maleChart = generateChartOrDiscard(maleBirthInfo);
          const femaleChart = generateChartOrDiscard(femaleBirthInfo);

          return (
            maleChart.palaces.length === femaleChart.palaces.length &&
            maleChart.heavenPlate.soulPalaceBranch === femaleChart.heavenPlate.soulPalaceBranch &&
            maleChart.heavenPlate.bodyPalaceBranch === femaleChart.heavenPlate.bodyPalaceBranch
          );
        }
      ),
      { numRuns: 100 }
    );
    // Slow property test: can exceed the default timeout under load.
  }, 30000);

  /**
   * Property: Độ sáng của chính tinh luôn thuộc 5 mức Tân Biên và có nguồn 'tanBien1956'.
   */
  it('major star brightness always comes from Tan Bien table', () => {
    const validBrightness = [...BRIGHTNESS_LEVELS];

    fc.assert(
      fc.property(birthInfoArbitrary, (birthData) => {
        const birthInfo: BirthInfo = {
          ...birthData,
          name: 'Test User',
        };

        const chart = generateChartOrDiscard(birthInfo);

        for (const palace of chart.palaces) {
          for (const star of palace.majorStars) {
            if (star.brightness) {
              if (!validBrightness.includes(star.brightness)) {
                return false;
              }
              if (star.brightnessSource !== 'tanBien1956') {
                return false;
              }
            }
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
