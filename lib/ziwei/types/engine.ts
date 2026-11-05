import type { ZiweiChart } from './chart';
import type { ResolvedZiweiConfig, UserPreferences, ZiweiConfig } from './config';
import type { BirthInfo } from './input';

/** Interface cho các engine sinh lá số Tử Vi. */
export interface ChartEngine {
  readonly engineName: string;
  readonly engineVersion: string;

  /** Sinh lá số từ thông tin sinh và tùy chọn ngườ dùng. */
  generateChart(birthInfo: BirthInfo, preferences?: UserPreferences): ZiweiChart;

  /** Trả về cấu hình mặc định của engine. */
  getDefaultConfig(): ZiweiConfig;

  /** Trả về cấu hình đã được merge với tùy chọn ngườ dùng. */
  resolveConfig(preferences?: UserPreferences): ResolvedZiweiConfig;
}
