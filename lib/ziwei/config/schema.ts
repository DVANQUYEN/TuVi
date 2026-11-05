import { z } from 'zod';
import type { BirthInfo } from '../types/input';
import type { UserPreferences } from '../types/config';

/**
 * Schema Zod cho thông tin sinh (BirthInfo).
 */
export const BirthInfoSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['nam', 'nu']),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
  year: z.number().int().min(1900).max(2099),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  isLeapMonthInput: z.boolean().optional(),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  location: z
    .object({
      provinceId: z.string().optional(),
      provinceName: z.string().optional(),
      region: z.enum(['north', 'south']),
      longitude: z.number().min(102).max(110),
      latitude: z.number().min(8).max(24).optional(),
    })
    .optional(),
  viewingYear: z.number().int().min(1900).max(2099).optional(),
});

/**
 * Schema Zod cho tùy chọn ngườ dùng (UserPreferences).
 */
export const UserPreferencesSchema = z.object({
  school: z.enum(['namPhai', 'trungChau', 'bacPhai']).optional(),
  dayBoundary: z.enum(['23:00', '00:00']).optional(),
  leapMonth: z.enum(['split15', 'baseMonth', 'nextMonth']).optional(),
  yearBoundary: z.enum(['tet', 'lapXuan']).optional(),
  tuanTrietPrimary: z.enum(['none', 'first', 'nearMenh']).optional(),
  useTrueSolarTime: z.boolean().optional(),
  applyHistoricalTimezone: z.boolean().optional(),
});

/**
 * Kiểm tra và ép kiểu dữ liệu đầu vào thành BirthInfo.
 *
 * @param data Dữ liệu cần kiểm tra.
 * @returns BirthInfo hợp lệ.
 * @throws ZodError nếu dữ liệu không hợp lệ.
 */
export function validateBirthInfo(data: unknown): BirthInfo {
  return BirthInfoSchema.parse(data);
}

/**
 * Kiểm tra và ép kiểu dữ liệu đầu vào thành UserPreferences.
 *
 * @param data Dữ liệu cần kiểm tra.
 * @returns UserPreferences hợp lệ.
 * @throws ZodError nếu dữ liệu không hợp lệ.
 */
export function validateUserPreferences(data: unknown): UserPreferences {
  return UserPreferencesSchema.parse(data);
}
