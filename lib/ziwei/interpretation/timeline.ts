import type { ZiweiChart } from '../types';
import type { FortuneLevel } from './decade-fortune';
import { calculateYearlyFortune } from './yearly-fortune';

/** Vận hạn của một năm trong timeline. */
export interface YearFortune {
  year: number;
  zodiac: string;
  /** Điểm tổng quan (1-5). */
  score: number;
  fortune: FortuneLevel;
  summary: string;
}

/** Tổng quan vận hạn theo một thập niên. */
export interface TimelineDecade {
  decade: string;
  avgScore: number;
  fortune: FortuneLevel;
}

/** Timeline vận hạn nhiều năm. */
export interface Timeline {
  startYear: number;
  endYear: number;
  years: YearFortune[];
  decades: TimelineDecade[];
}

/**
 * Tạo timeline vận hạn từ năm hiện tại.
 *
 * @param chart - Lá số Tử Vi.
 * @param birthYear - Năm sinh dương lịch.
 * @param duration - Số năm cần hiển thị (mặc định 20).
 * @returns Timeline vận hạn theo từng năm và từng thập niên.
 */
export function generateTimeline(
  chart: ZiweiChart,
  birthYear: number,
  duration = 20
): Timeline {
  const currentYear = new Date().getFullYear();
  const years: YearFortune[] = [];

  for (let index = 0; index < duration; index += 1) {
    const year = currentYear + index;
    const fortune = calculateYearlyFortune(chart, year, birthYear);

    years.push({
      year,
      zodiac: fortune.zodiac,
      score: fortune.score,
      fortune: fortune.fortune,
      summary: fortune.summary,
    });
  }

  const decades: TimelineDecade[] = [];

  for (let index = 0; index < duration; index += 10) {
    const decadeYears = years.slice(index, index + 10);
    if (decadeYears.length === 0) continue;

    const avgScore =
      Math.round(
        (decadeYears.reduce((sum, year) => sum + year.score, 0) / decadeYears.length) * 10
      ) / 10;

    decades.push({
      decade: `${currentYear + index}-${currentYear + index + decadeYears.length - 1}`,
      avgScore,
      fortune: avgScore >= 4 ? 'tốt' : avgScore <= 2 ? 'xấu' : 'ổn định',
    });
  }

  return {
    startYear: currentYear,
    endYear: currentYear + duration - 1,
    years,
    decades,
  };
}
