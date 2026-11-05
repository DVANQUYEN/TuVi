import type { BirthInfo, BirthLocation } from '../types/input';
import type { ResolvedZiweiConfig } from '../types/config';
import type { TimeAdjustmentAudit } from '../types/audit';
import {
  calculateEquationOfTimeMinutes,
  calculateLongitudeDeltaMinutes,
  calculateTrueSolarTime,
} from '../utils/equation-of-time';
import { resolveHistoricalUtcOffset } from '../data/vietnam-timezones';

/** Đầu ra của Layer 1 sau khi hiệu chỉnh thờ gian sinh. */
export interface TimeAdapterOutput {
  /** Giờ hiệu lực (đã qua chỉnh múi giờ lịch sử / giờ mặt trờ thật). */
  effectiveHour: number;
  /** Phút hiệu lực. */
  effectiveMinute: number;
  /** Ngày hiệu lực. */
  effectiveDay: number;
  /** Tháng hiệu lực. */
  effectiveMonth: number;
  /** Năm hiệu lực. */
  effectiveYear: number;
  /** Danh sách các khoản hiệu chỉnh đã áp dụng. */
  timeAdjustments: TimeAdjustmentAudit[];
  /** Ngày trong năm (1-366), dùng cho tính toán thiên văn. */
  dayOfYear: number;
}

/**
 * Layer 1: Hiệu chỉnh múi giờ lịch sử và giờ mặt trờ thật.
 *
 * Adapter này chuyển đổi thờ gian sinh đã nhập thành thờ gian hiệu lực
 * theo cấu hình: múi giờ lịch sử Việt Nam và/hoặc giờ mặt trờ thật.
 */
export class TrueSolarTimeAdapter {
  /**
   * Hiệu chỉnh thờ gian sinh.
   *
   * @param birthInfo - Thông tin sinh ban đầu.
   * @param config - Cấu hình đã resolve.
   * @returns Thờ gian hiệu lực và audit trail.
   */
  adjust(birthInfo: BirthInfo, config: ResolvedZiweiConfig): TimeAdapterOutput {
    const adjustments: TimeAdjustmentAudit[] = [];

    let hour = birthInfo.hour;
    let minute = birthInfo.minute;
    let day = birthInfo.day;
    let month = birthInfo.month;
    let year = birthInfo.year;

    const location: BirthLocation = birthInfo.location ?? {
      provinceId: 'HN',
      provinceName: 'Hà Nội',
      region: 'north',
      longitude: 105.8542,
      latitude: 21.0285,
    };

    // 1. Xác định múi giờ lịch sử và chuyển về UTC+7
    const historicalOffset = config.applyHistoricalTimezone
      ? resolveHistoricalUtcOffset(year, location.region)
      : 7;

    if (historicalOffset !== 7) {
      const deltaMinutes = Math.round((historicalOffset - 7) * 60);
      const originalTime = `${hour}:${minute} ${day}/${month}/${year}`;
      ({ day, month, year, hour, minute } = this.addMinutes(
        day,
        month,
        year,
        hour,
        minute,
        -deltaMinutes
      ));

      adjustments.push({
        originalTime,
        adjustedTime: `${hour}:${minute} ${day}/${month}/${year}`,
        deltaMinutes: -deltaMinutes,
        reason: `Múi giờ lịch sử UTC+${historicalOffset} → chuẩn UTC+7`,
      });
    }

    // 2. Hiệu chỉnh giờ mặt trờ thật (nếu bật)
    if (config.useTrueSolarTime) {
      const dayOfYear = this.getDayOfYear(day, month, year);
      const clockTime = hour * 60 + minute;

      const trueSolarTime = calculateTrueSolarTime(
        clockTime,
        dayOfYear,
        location.longitude,
        config.standardMeridian
      );

      const delta = Math.round(trueSolarTime - clockTime);

      if (delta !== 0) {
        const originalTime = `${hour}:${minute}`;
        ({ day, month, year, hour, minute } = this.addMinutes(
          day,
          month,
          year,
          hour,
          minute,
          delta
        ));

        const eot = Math.round(calculateEquationOfTimeMinutes(dayOfYear));
        const longitudeDelta = Math.round(
          calculateLongitudeDeltaMinutes(location.longitude, config.standardMeridian)
        );

        adjustments.push({
          originalTime,
          adjustedTime: `${hour}:${minute}`,
          deltaMinutes: delta,
          reason: `Giờ mặt trờ thật: EoT ${eot} phút, kinh độ ${longitudeDelta} phút`,
        });
      }
    }

    return {
      effectiveHour: hour,
      effectiveMinute: minute,
      effectiveDay: day,
      effectiveMonth: month,
      effectiveYear: year,
      timeAdjustments: adjustments,
      dayOfYear: this.getDayOfYear(day, month, year),
    };
  }

  private getDayOfYear(day: number, month: number, year: number): number {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  private addMinutes(
    day: number,
    month: number,
    year: number,
    hour: number,
    minute: number,
    deltaMinutes: number
  ): { day: number; month: number; year: number; hour: number; minute: number } {
    const date = new Date(year, month - 1, day, hour, minute);
    date.setMinutes(date.getMinutes() + deltaMinutes);

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }
}
