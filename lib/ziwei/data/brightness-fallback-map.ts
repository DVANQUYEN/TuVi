import type { BrightnessLevel } from '../types/enums';

/**
 * Bảng quy đổi 7 mức iztro → 5 mức Việt Nam.
 * Dùng cho phụ tinh khi iztro trả về độ sáng 7 mức.
 *
 * Quyết định: Lợi → Đắc, Bất → Hãm.
 */
export const IZTRO_TO_VIET_BRIGHTNESS_MAP: Readonly<Record<string, BrightnessLevel>> = {
  Miếu: 'mieu',
  Vượng: 'vuong',
  Đắc: 'dac',
  Lợi: 'dac', // Quyết định: Lợi → Đắc (ngữ nghĩa gần nhất)
  Bình: 'binh',
  Bất: 'ham', // Quyết định: Bất → Hãm (ngữ nghĩa gần nhất)
  Hãm: 'ham',
} as const;

/**
 * Map độ sáng iztro sang 5 mức Việt Nam.
 *
 * @param iztroBrightness - Độ sáng iztro dạng chuỗi.
 * @returns Mức độ sáng 5 cấp hoặc `null` nếu không khớp.
 */
export function mapIztroBrightnessTo5Levels(iztroBrightness: string): BrightnessLevel | null {
  return IZTRO_TO_VIET_BRIGHTNESS_MAP[iztroBrightness] ?? null;
}
