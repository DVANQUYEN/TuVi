import type { ZiweiChart } from '../types';
import type { FortuneLevel, FortuneRating } from './decade-fortune';
import { calculateDecadeFortune, fortuneLevelFromScore } from './decade-fortune';
import { getFortuneRating } from './fortune-score';
import { calculateYearlyFortune } from './yearly-fortune';

/** Vận hạn của một năm trong timeline. */
export interface YearFortune {
  year: number;
  zodiac: string;
  /** Điểm tổng quan (1-5). */
  score: number;
  /** Mức độ vận hạn 5 cấp. */
  rating?: FortuneRating;
  /** Mức độ vận hạn 3 cấp. */
  fortune: FortuneLevel;
  summary: string;
}

/** Tổng quan vận hạn theo một thập niên. */
export interface TimelineDecade {
  /** Khoảng năm dương lịch thực tế của đại vận, dạng "2026-2035". */
  decade: string;
  avgScore: number;
  /** Mức độ vận hạn 5 cấp, suy ra từ avgScore. */
  rating?: FortuneRating;
  /** Mức độ vận hạn 3 cấp, suy ra từ avgScore. */
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
 * Mỗi thập niên trong timeline là một đại vận thật của lá số (theo tuổi),
 * không phải các khối 10 năm dương lịch tùy ý. Các năm được lấy trong cửa sổ
 * bắt đầu từ năm hiện tại, kéo dài `duration` năm và cắt theo ranh giới đại vận.
 *
 * @param chart - Lá số Tử Vi.
 * @param birthYear - Năm sinh dương lịch.
 * @param duration - Số năm cần hiển thị (mặc định 20).
 * @returns Timeline vận hạn theo từng năm và từng đại vận.
 */
export function generateTimeline(
  chart: ZiweiChart,
  birthYear: number,
  duration = 20
): Timeline {
  const currentYear = new Date().getFullYear();
  const windowEnd = currentYear + duration - 1;
  const decades = calculateDecadeFortune(chart, currentYear - birthYear, birthYear);

  const years: YearFortune[] = [];
  const timelineDecades: TimelineDecade[] = [];

  for (const decade of decades) {
    const decadeStart = Math.max(decade.yearRange[0], currentYear);
    const decadeEnd = Math.min(decade.yearRange[1], windowEnd);
    if (decadeStart > decadeEnd) continue;

    const decadeYears: YearFortune[] = [];

    for (let year = decadeStart; year <= decadeEnd; year += 1) {
      const fortune = calculateYearlyFortune(chart, year, birthYear);
      const yearFortune: YearFortune = {
        year,
        zodiac: fortune.zodiac,
        score: fortune.score,
        rating: fortune.rating,
        fortune: fortune.fortune,
        summary: fortune.summary,
      };

      decadeYears.push(yearFortune);
      years.push(yearFortune);
    }

    const avgScore =
      Math.round(
        (decadeYears.reduce((sum, year) => sum + year.score, 0) / decadeYears.length) * 10
      ) / 10;

    timelineDecades.push({
      decade: `${decade.yearRange[0]}-${decade.yearRange[1]}`,
      avgScore,
      rating: getFortuneRating(avgScore),
      fortune: fortuneLevelFromScore(avgScore),
    });
  }

  return {
    startYear: years.length > 0 ? years[0].year : currentYear,
    endYear: years.length > 0 ? years[years.length - 1].year : windowEnd,
    years,
    decades: timelineDecades,
  };
}
