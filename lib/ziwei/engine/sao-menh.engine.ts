import type { ChartEngine } from '../types/engine';
import type { ZiweiChart } from '../types/chart';
import type { ZiweiConfig, ResolvedZiweiConfig, UserPreferences } from '../types/config';
import type { BirthInfo } from '../types/input';
import type { AuditStep } from '../types/audit';
import { defaultZiweiConfig } from '../config/default-config';
import { resolveZiweiConfig } from '../config/config-resolver';
import { validateBirthInfo } from '../config/schema';
import { TrueSolarTimeAdapter } from '../adapters/true-solar-time.adapter';
import { VietnameseCalendarAdapter } from '../adapters/vietnamese-calendar.adapter';
import { IztroEngineAdapter } from '../adapters/iztro-engine.adapter';
import { VietnameseChartDecorator } from '../adapters/vietnamese-chart.decorator';
import { ChartCache } from './chart-cache';
import { ENGINE_VERSION, ENGINE_NAME } from '../index';

/**
 * Engine Tử Vi Sao Mệnh - Implementation chính của ChartEngine.
 * Kết nối 4 lớp adapters theo luồng một chiều.
 */
export class SaoMenhChartEngine implements ChartEngine {
  readonly engineName = ENGINE_NAME;
  readonly engineVersion = ENGINE_VERSION;

  private readonly timeAdapter: TrueSolarTimeAdapter;
  private readonly calendarAdapter: VietnameseCalendarAdapter;
  private readonly iztroAdapter: IztroEngineAdapter;
  private readonly decorator: VietnameseChartDecorator;
  private readonly cache: ChartCache;

  constructor() {
    this.timeAdapter = new TrueSolarTimeAdapter();
    this.calendarAdapter = new VietnameseCalendarAdapter();
    this.iztroAdapter = new IztroEngineAdapter();
    this.decorator = new VietnameseChartDecorator();
    this.cache = new ChartCache({ maxSize: 1000 });
  }

  /**
   * Lập lá số Tử Vi hoàn chỉnh.
   *
   * @param birthInfo - Thông tin sinh của đương số.
   * @param preferences - Tùy chọn cấu hình từ ngườ dùng.
   * @returns Lá số Tử Vi đã hoàn thiện.
   */
  generateChart(birthInfo: BirthInfo, preferences?: UserPreferences): ZiweiChart {
    const startTime = performance.now();
    const steps: AuditStep[] = [];

    // Bước 0: Validate đầu vào
    const validatedBirthInfo = validateBirthInfo(birthInfo);

    // Bước 1: Resolve cấu hình
    const config = this.resolveConfig(preferences);
    steps.push({
      step: 'resolveConfig',
      input: preferences,
      output: config,
      timestamp: Date.now(),
    });

    // Bước 2: Kiểm tra cache
    const cacheKey = this.buildCacheKey(validatedBirthInfo, config);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      // Tên chỉ ảnh hưởng hiển thị nên không nằm trong cache key; cập nhật lại
      // danh tính/ngữ cảnh đã gửi khi trả về để tránh hiển thị tên cũ.
      if (JSON.stringify(cached.birthInfo) === JSON.stringify(validatedBirthInfo)) {
        return cached;
      }

      const refreshed = {
        ...cached,
        birthInfo: validatedBirthInfo,
        heavenPlate: {
          ...cached.heavenPlate,
          name: validatedBirthInfo.name ?? '',
        },
      };
      this.cache.set(cacheKey, refreshed);

      return refreshed;
    }

    try {
      // Bước 3: Layer 1 - Giờ mặt trờ thật
      const timeOutput = this.timeAdapter.adjust(validatedBirthInfo, config);
      steps.push({
        step: 'trueSolarTime',
        input: { birthInfo: validatedBirthInfo, config },
        output: timeOutput,
        timestamp: Date.now(),
      });

      // Bước 4: Layer 2 - Lịch Việt Nam
      const calendarOutput = this.calendarAdapter.convert(validatedBirthInfo, timeOutput, config);
      steps.push({
        step: 'vietnameseCalendar',
        input: { birthInfo: validatedBirthInfo, timeOutput, config },
        output: calendarOutput,
        timestamp: Date.now(),
      });

      // Bước 5: Layer 3 - Iztro Engine
      const rawOutput = this.iztroAdapter.generate(
        {
          lunarYear: calendarOutput.lunarYear,
          lunarMonth: calendarOutput.lunarMonth,
          lunarDay: calendarOutput.lunarDay,
          isLeapMonth: calendarOutput.isLeapMonth,
          fourPillars: calendarOutput.fourPillars,
        },
        validatedBirthInfo,
        config
      );
      steps.push({
        step: 'iztroEngine',
        input: { calendarOutput, config },
        output: { palacesCount: rawOutput.palaces.length },
        timestamp: Date.now(),
      });

      // Bước 6: Layer 4 - Trang trí lá số Việt Nam
      const chart = this.decorator.decorate(
        rawOutput,
        calendarOutput,
        timeOutput,
        validatedBirthInfo,
        config,
        {
          engineVersion: this.engineVersion,
          configApplied: config,
          steps,
          timeAdjustments: timeOutput.timeAdjustments,
          calendarResolution: calendarOutput.calendarResolution,
          totalDuration: 0, // Sẽ được cập nhật bên dưới
        }
      );

      const totalDuration = performance.now() - startTime;

      // Cập nhật audit trail với tổng thờ gian thực tế
      const finalChart: ZiweiChart = {
        ...chart,
        auditTrail: {
          ...chart.auditTrail,
          totalDuration,
        },
      };

      // Lưu kết quả vào cache
      this.cache.set(cacheKey, finalChart);

      return finalChart;
    } catch (error) {
      // Chuyển tiếp lỗi để caller xử lý
      throw error;
    }
  }

  /**
   * Trả về cấu hình mặc định của engine.
   *
   * @returns Cấu hình mặc định.
   */
  getDefaultConfig(): ZiweiConfig {
    return defaultZiweiConfig;
  }

  /**
   * Resolve cấu hình từ tùy chọn ngườ dùng.
   *
   * @param preferences - Tùy chọn ngườ dùng.
   * @returns Cấu hình đã được merge.
   */
  resolveConfig(preferences?: UserPreferences): ResolvedZiweiConfig {
    return resolveZiweiConfig(preferences, defaultZiweiConfig);
  }

  /**
   * Xây dựng cache key từ birthInfo và config.
   *
   * @param birthInfo - Thông tin sinh đã validate.
   * @param config - Cấu hình đã resolve.
   * @returns Cache key dạng chuỗi.
   */
  private buildCacheKey(birthInfo: BirthInfo, config: ResolvedZiweiConfig): string {
    return JSON.stringify({
      birth: {
        year: birthInfo.year,
        month: birthInfo.month,
        day: birthInfo.day,
        hour: birthInfo.hour,
        minute: birthInfo.minute,
        gender: birthInfo.gender,
        calendarType: birthInfo.calendarType,
        isLeapMonthInput: birthInfo.isLeapMonthInput ?? false,
        viewingYear: birthInfo.viewingYear ?? null,
        region: birthInfo.location?.region ?? '',
        longitude: birthInfo.location?.longitude ?? 105.8542,
      },
      config: {
        school: config.school,
        dayBoundary: config.dayBoundary,
        leapMonth: config.leapMonth,
        yearBoundary: config.yearBoundary,
        tuanTrietPrimary: config.tuanTrietPrimary,
        useTrueSolarTime: config.useTrueSolarTime,
        applyHistoricalTimezone: config.applyHistoricalTimezone,
        useVietnameseBrightnessTable: config.useVietnameseBrightnessTable,
        standardMeridian: config.standardMeridian,
      },
    });
  }
}

/**
 * Factory function để tạo engine instance.
 *
 * @returns Instance của ChartEngine.
 */
export function createChartEngine(): ChartEngine {
  return new SaoMenhChartEngine();
}
