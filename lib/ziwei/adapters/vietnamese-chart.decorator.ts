import type { RawAstrolabeOutput } from './iztro-engine.adapter';
import type { CalendarAdapterOutput } from './vietnamese-calendar.adapter';
import type { TimeAdapterOutput } from './true-solar-time.adapter';
import type { ZiweiChart, Palace } from '../types/chart';
import type { AuditTrail, ChartWarning } from '../types/audit';
import type { ResolvedZiweiConfig } from '../types/config';
import type { BirthInfo } from '../types/input';
import type { MajorStarId, EarthlyBranch, BrightnessLevel, HeavenlyStem } from '../types/enums';
import { getTanBienBrightness } from '../data/brightness-tan-bien';
import { calculateTuanTriet } from '../utils/tuan-triet';
import { NAP_AM_60, PALACE_MAP } from '../data';

/**
 * Layer 4: Override độ sáng Tân Biên, gắn Tuần/Triệt 2 cung và Việt hóa lá số.
 */
export class VietnameseChartDecorator {
  /**
   * Hoàn thiện lá số sau khi iztro đã an sao.
   *
   * @param rawOutput - Dữ liệu thô từ iztro.
   * @param calendarOutput - Dữ liệu lịch đã chuẩn hóa.
   * @param timeOutput - Dữ liệu thờ gian đã hiệu chỉnh.
   * @param birthInfo - Thông tin sinh.
   * @param config - Cấu hình đã resolve.
   * @param auditTrail - Audit trail từ engine điều phối.
   * @returns Lá số Tử Vi hoàn chỉnh.
   */
  decorate(
    rawOutput: RawAstrolabeOutput,
    calendarOutput: CalendarAdapterOutput,
    timeOutput: TimeAdapterOutput,
    birthInfo: BirthInfo,
    config: ResolvedZiweiConfig,
    auditTrail: Partial<AuditTrail>
  ): ZiweiChart {
    // 1. Override độ sáng 14 chính tinh bằng Tân Biên
    const decoratedPalaces = rawOutput.palaces.map((palace) =>
      this.overrideBrightness(palace, config)
    );

    // 2. Tính và gắn Tuần/Triệt
    const yearStem = calendarOutput.fourPillars.year.stem;
    const yearBranch = calendarOutput.fourPillars.year.branch;
    const tuanTriet = calculateTuanTriet(yearStem, yearBranch);

    const palacesWithTuanTriet = decoratedPalaces.map((palace) => ({
      ...palace,
      hasTuan: tuanTriet.tuan.includes(palace.branch),
      hasTriet: tuanTriet.triet.includes(palace.branch),
      tuanTrietRole: {
        tuan: tuanTriet.tuan.includes(palace.branch) ? ('equal' as const) : null,
        triet: tuanTriet.triet.includes(palace.branch) ? ('equal' as const) : null,
      },
    }));

    // 3. Hoàn thiện Audit Trail
    const fullAuditTrail: AuditTrail = {
      engineVersion: '1.0.0',
      configApplied: config,
      steps: auditTrail.steps ?? [],
      timeAdjustments: timeOutput.timeAdjustments,
      calendarResolution: calendarOutput.calendarResolution,
      totalDuration: auditTrail.totalDuration ?? 0,
    };

    // 4. Gộp warnings
    const allWarnings: ChartWarning[] = [...calendarOutput.warnings];

    // 5. Tạo ZiweiChart hoàn chỉnh
    return {
      schemaVersion: '1.0.0',
      birthInfo,
      appliedConfig: config,
      heavenPlate: {
        name: birthInfo.name ?? '',
        yinYangGenderLabel: this.getYinYangGenderLabel(
          calendarOutput.fourPillars.year.stem,
          birthInfo.gender
        ),
        effectiveSolarDateStr: calendarOutput.calendarResolution.solarDate,
        effectiveLunarDate: {
          year: calendarOutput.lunarYear,
          month: calendarOutput.lunarMonth,
          day: calendarOutput.lunarDay,
          isLeapMonthOriginal: calendarOutput.isLeapMonth,
        },
        fourPillars: calendarOutput.fourPillars,
        napAm: this.resolveNapAm(calendarOutput.fourPillars.year.label),
        fiveElementsClass: rawOutput.fiveElementsClass,
        soulLord: rawOutput.soulLord,
        bodyLord: rawOutput.bodyLord,
        soulPalaceBranch: rawOutput.soulPalaceBranch,
        bodyPalaceBranch: rawOutput.bodyPalaceBranch,
        bodyPalaceName: this.resolveBodyPalaceName(
          palacesWithTuanTriet,
          rawOutput.bodyPalaceBranch
        ),
        elementRelationSummary: 'Cần tính chi tiết',
      },
      palaces: palacesWithTuanTriet as unknown as ZiweiChart['palaces'],
      tuanTriet: {
        tuan: {
          branches: tuanTriet.tuan,
          primaryBranch: null,
        },
        triet: {
          branches: tuanTriet.triet,
          primaryBranch: null,
        },
        isOverlapping: this.isTuanTrietOverlapping(tuanTriet.tuan, tuanTriet.triet),
        primaryMode: config.tuanTrietPrimary,
      },
      periods: rawOutput.periods,
      warnings: allWarnings,
      auditTrail: fullAuditTrail,
    };
  }

  private overrideBrightness(palace: Palace, config: ResolvedZiweiConfig): Palace {
    if (!config.useVietnameseBrightnessTable) return palace;

    const overriddenMajorStars = palace.majorStars.map((star) => {
      if (star.category === 'major') {
        const tanBienBrightness = getTanBienBrightness(star.id as MajorStarId, palace.branch);

        return {
          ...star,
          brightness: tanBienBrightness,
          brightnessLabel: this.getBrightnessLabel(tanBienBrightness),
          brightnessSource: 'tanBien1956' as const,
        };
      }
      return star;
    });

    return {
      ...palace,
      majorStars: overriddenMajorStars,
    };
  }

  private getBrightnessLabel(level: BrightnessLevel): 'M' | 'V' | 'Đ' | 'B' | 'H' {
    const labels: Record<BrightnessLevel, 'M' | 'V' | 'Đ' | 'B' | 'H'> = {
      mieu: 'M',
      vuong: 'V',
      dac: 'Đ',
      binh: 'B',
      ham: 'H',
    };
    return labels[level];
  }

  private getYinYangGenderLabel(
    stem: HeavenlyStem,
    gender: 'nam' | 'nu'
  ): 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ' {
    const yangStems: HeavenlyStem[] = ['giap', 'binh', 'mau', 'canh', 'nham'];
    const isYang = yangStems.includes(stem);

    if (gender === 'nam') {
      return isYang ? 'Dương Nam' : 'Âm Nam';
    } else {
      return isYang ? 'Dương Nữ' : 'Âm Nữ';
    }
  }

  private resolveNapAm(yearLabel: string): {
    name: string;
    element: import('../types/enums').FiveElement;
  } {
    const normalizedLabel = yearLabel.replace(/\s+/g, '');
    const entry = NAP_AM_60.find(
      (item) => item.split(' - ')[0].replace(/\s+/g, '') === normalizedLabel
    );
    const defaultResult = { name: 'Hải Trung Kim', element: 'kim' as const };

    if (!entry) return defaultResult;

    const parts = entry.split(' - ');
    const name = parts[1] ?? defaultResult.name;
    const elementMap: Readonly<Record<string, import('../types/enums').FiveElement>> = {
      Kim: 'kim',
      Mộc: 'moc',
      Thủy: 'thuy',
      Hỏa: 'hoa',
      Thổ: 'tho',
    };

    let element: import('../types/enums').FiveElement = 'kim';
    for (const [key, value] of Object.entries(elementMap)) {
      if (name.includes(key)) {
        element = value;
        break;
      }
    }

    return { name, element };
  }

  private resolveBodyPalaceName(palaces: Palace[], bodyBranch: EarthlyBranch): string {
    const bodyPalace = palaces.find(
      (palace) => palace.branch === bodyBranch && palace.isBodyPalace
    );
    return bodyPalace ? PALACE_MAP[bodyPalace.id].name : 'Thân';
  }

  private isTuanTrietOverlapping(
    tuan: readonly EarthlyBranch[],
    triet: readonly EarthlyBranch[]
  ): boolean {
    return tuan.some((branch) => triet.includes(branch));
  }
}
