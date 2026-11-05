import type { ZiweiConfig, ResolvedZiweiConfig, UserPreferences } from '../types/config';
import { defaultZiweiConfig } from './default-config';
import { validateUserPreferences } from './schema';

/**
 * Hợp nhất cấu hình mặc định với tùy chọn ngườ dùng
 * Trả về cấu hình phẳng, dễ tra cứu
 *
 * @param preferences Tùy chọn ngườ dùng muốn ghi đè (nếu có).
 * @param baseConfig Cấu hình gốc để merge. Mặc định là {@link defaultZiweiConfig}.
 * @returns Cấu hình đã được resolve, kết hợp default và user preferences.
 * @throws ZodError nếu preferences không hợp lệ.
 */
export function resolveZiweiConfig(
  preferences?: UserPreferences,
  baseConfig: ZiweiConfig = defaultZiweiConfig
): ResolvedZiweiConfig {
  // Validate preferences nếu có
  if (preferences) {
    validateUserPreferences(preferences);
  }

  // Merge với default
  const resolved: ResolvedZiweiConfig = {
    school: preferences?.school ?? baseConfig.school.default,
    dayBoundary: preferences?.dayBoundary ?? baseConfig.dayBoundary.default,
    leapMonth: preferences?.leapMonth ?? baseConfig.leapMonth.default,
    yearBoundary: preferences?.yearBoundary ?? baseConfig.yearBoundary.default,
    tuanTrietPrimary: preferences?.tuanTrietPrimary ?? baseConfig.tuanTriet.primary,
    useVietnameseBrightnessTable: baseConfig.brightness.useVietnameseTable,
    useTrueSolarTime: preferences?.useTrueSolarTime ?? baseConfig.trueSolarTime.default,
    applyHistoricalTimezone: preferences?.applyHistoricalTimezone ?? true,
    standardMeridian: baseConfig.trueSolarTime.standardMeridian,
  };

  return resolved;
}
