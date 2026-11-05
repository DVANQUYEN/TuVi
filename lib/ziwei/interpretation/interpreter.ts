import type { ZiweiChart, Palace } from '../types';
import type {
  ChartInterpretation,
  PalaceInterpretation,
  CombinationInterpretation,
} from './types';
import { detectCombinations } from './data/combinations';
import { generateOverallAdvice } from './data/advice';
import { interpretPalaceWithTamPhuong as buildPalaceInterpretation } from './palace-meanings';

/**
 * Luận giải lá số Tử Vi dựa trên dữ liệu nghĩa sao và cách cục.
 */
export class ZiweiInterpreter {
  /**
   * Luận giải toàn bộ lá số.
   *
   * @param chart - Lá số Tử Vi.
   * @returns Kết quả luận giải.
   */
  interpret(chart: ZiweiChart): ChartInterpretation {
    const palaces = chart.palaces.map((palace) =>
      this.interpretPalaceWithTamPhuong(palace, chart)
    );
    const combinations = detectCombinations(chart);
    const overallAdvice = this.generateOverallAdvice(chart, combinations);

    return { palaces, combinations, overallAdvice };
  }

  /**
   * Luận giải một cung kèm phân tích tam phương tứ chính.
   *
   * @param palace - Cung cần luận giải.
   * @param chart - Lá số chứa cung.
   * @returns Luận giải cung.
   */
  interpretPalaceWithTamPhuong(palace: Palace, chart: ZiweiChart): PalaceInterpretation {
    return buildPalaceInterpretation(palace, chart);
  }

  private generateOverallAdvice(
    _chart: ZiweiChart,
    combinations: CombinationInterpretation[]
  ): string {
    const goodCount = combinations.filter((c) => c.level === 'tốt').length;
    const badCount = combinations.filter((c) => c.level === 'xấu').length;
    const hasSpecialPatterns = combinations.length > 0;

    return generateOverallAdvice(goodCount, badCount, hasSpecialPatterns);
  }
}
