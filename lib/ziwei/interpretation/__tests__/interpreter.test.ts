import { describe, it, expect } from 'vitest';
import { ZiweiInterpreter } from '../interpreter';
import { generateOverallAdvice, OVERALL_ADVICE_TEMPLATES } from '../data/advice';
import { MAJOR_STAR_MEANINGS } from '../data/major-stars';
import { COMBINATIONS } from '../data/combinations';
import { buildMinorStarInterpretation } from '../data/minor-stars';
import { MAJOR_STAR_IDS, PALACE_IDS, BRIGHTNESS_LEVELS } from '../../types/enums';
import type { Palace, Star, ZiweiChart } from '../../types';

/**
 * Tạo một ngôi sao tối thiểu cho fixture test.
 *
 * @param overrides - Các trường cần ghi đè.
 * @returns Ngôi sao đã được điền đầy đủ trường bắt buộc.
 */
function makeStar(overrides: Partial<Star> & Pick<Star, 'id' | 'name'>): Star {
  return {
    category: 'major',
    element: 'kim',
    nature: 'trung',
    ...overrides,
  };
}

/**
 * Tạo một cung tối thiểu cho fixture test.
 *
 * @param overrides - Các trường cần ghi đè.
 * @returns Cung đã được điền đầy đủ trường bắt buộc.
 */
function makePalace(overrides: Partial<Palace> & Pick<Palace, 'id' | 'majorStars'>): Palace {
  return {
    index: 0,
    name: overrides.id,
    stem: 'giap',
    branch: 'ty',
    element: 'moc',
    isBodyPalace: false,
    isOriginalPalace: false,
    auspiciousStars: [],
    maleficStars: [],
    otherStars: [],
    changsheng12: '',
    boshi12: '',
    suiqian12: '',
    majorPeriod: { startAge: 0, endAge: 10 },
    minorPeriodAges: [],
    hasTuan: false,
    hasTriet: false,
    tuanTrietRole: { tuan: null, triet: null },
    ...overrides,
  };
}

/**
 * Tạo lá số tối thiểu chỉ chứa các cung cần kiểm tra.
 *
 * @param palaces - Danh sách cung của lá số.
 * @returns Lá số Tử Vi dùng cho test.
 */
function makeChart(palaces: Palace[]): ZiweiChart {
  return { palaces } as unknown as ZiweiChart;
}

describe('ZiweiInterpreter', () => {
  const interpreter = new ZiweiInterpreter();

  it('luận giải chính tinh theo cung và độ sáng', () => {
    const chart = makeChart([
      makePalace({
        id: 'menh',
        majorStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' })],
      }),
    ]);

    const result = interpreter.interpret(chart);
    const palace = result.palaces[0];

    expect(palace.isEmpty).toBe(false);
    expect(palace.majorStars).toHaveLength(1);
    expect(palace.majorStars[0]).toMatchObject({
      starId: 'tuVi',
      brightness: 'mieu',
    });
    expect(palace.majorStars[0].content.meaning).toContain('Tử Vi');
  });

  it('ánh xạ cát tinh và hung tinh thành luận giải phụ tinh', () => {
    const chart = makeChart([
      makePalace({
        id: 'menh',
        majorStars: [],
        auspiciousStars: [
          makeStar({ id: 'vanXuong', name: 'Văn Xương', category: 'lucCat', nature: 'cat' }),
        ],
        maleficStars: [
          makeStar({ id: 'hoaTinh', name: 'Hỏa Tinh', category: 'lucSat', nature: 'hung' }),
        ],
      }),
    ]);

    const palace = interpreter.interpret(chart).palaces[0];

    expect(palace.minorStars).toEqual([
      expect.objectContaining({ starId: 'vanXuong', isAuspicious: true }),
      expect.objectContaining({ starId: 'hoaTinh', isAuspicious: false }),
    ]);
  });

  it('đánh dấu cung không có chính tinh là cung trống', () => {
    const chart = makeChart([makePalace({ id: 'menh', majorStars: [] })]);

    const palace = interpreter.interpret(chart).palaces[0];

    expect(palace.isEmpty).toBe(true);
  });

  it('nhận diện cách cục khớp với lá số', () => {
    const chart = makeChart([
      makePalace({
        id: 'menh',
        majorStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' })],
      }),
    ]);

    const result = interpreter.interpret(chart);

    expect(result.combinations.map((combo) => combo.id)).toContain('tu-vi-cu-menh');
  });
});

describe('generateOverallAdvice', () => {
  it('chọn lời khuyên theo số cách cục tốt/xấu và cách cục đặc biệt', () => {
    expect(generateOverallAdvice(3, 1, true)).toBe(OVERALL_ADVICE_TEMPLATES.total[0]);
    expect(generateOverallAdvice(1, 2, true)).toBe(OVERALL_ADVICE_TEMPLATES.total[1]);
    expect(generateOverallAdvice(1, 1, false)).toBe(OVERALL_ADVICE_TEMPLATES.total[3]);
    expect(generateOverallAdvice(1, 1, true)).toBe(OVERALL_ADVICE_TEMPLATES.total[2]);
  });
});

describe('interpretation data', () => {
  it('có đủ nghĩa cho 14 chính tinh x 12 cung x 5 độ sáng', () => {
    for (const starId of MAJOR_STAR_IDS) {
      const byPalace = MAJOR_STAR_MEANINGS[starId];
      expect(byPalace, starId).toBeDefined();

      for (const palaceId of PALACE_IDS) {
        expect(byPalace[palaceId], `${starId}/${palaceId}`).toBeDefined();

        for (const brightness of BRIGHTNESS_LEVELS) {
          const content = byPalace[palaceId][brightness];
          expect(content, `${starId}/${palaceId}/${brightness}`).toBeDefined();
          expect(content.meaning.length).toBeGreaterThan(0);
          expect(content.career.length).toBeGreaterThan(0);
          expect(content.love.length).toBeGreaterThan(0);
          expect(content.health.length).toBeGreaterThan(0);
          expect(content.advice.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('có id duy nhất và nội dung đầy đủ cho các cách cục', () => {
    const ids = COMBINATIONS.map((combo) => combo.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const combo of COMBINATIONS) {
      expect(combo.name.length).toBeGreaterThan(0);
      expect(combo.meaning.length).toBeGreaterThan(0);
      expect(combo.condition.stars.length).toBeGreaterThan(0);
      expect(['tốt', 'xấu', 'trung bình']).toContain(combo.level);
    }
  });

  it('luận giải phụ tinh đã biết và fallback cho phụ tinh chưa biết', () => {
    const known = buildMinorStarInterpretation('vanXuong', 'Văn Xương', true);
    const unknown = buildMinorStarInterpretation('unknownStar', 'Sao Lạ', false);

    expect(known.meaning).toContain('Văn Xương');
    expect(known.isAuspicious).toBe(true);
    expect(unknown.meaning).toBe('Sao Lạ: phụ tinh ảnh hưởng đến cung');
    expect(unknown.isAuspicious).toBe(false);
  });
});
