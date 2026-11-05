import { describe, it, expect } from 'vitest';
import { ZiweiInterpreter } from '../interpreter';
import {
  getTamPhuong,
  applyTuanTrietEffect,
  interpretMajorStar,
} from '../palace-meanings';
import { getMinorStarMeaning } from '../minor-star-meanings';
import { COMBINATIONS } from '../data/combinations';
import { MAJOR_STAR_MEANINGS } from '../data/major-stars';
import { createChartEngine } from '../../engine/sao-menh.engine';
import { PALACE_IDS } from '../../types/enums';
import type { MajorStarId } from '../../types/enums';
import type { Palace, Star, ZiweiChart, PalaceId } from '../../types';
import type { BirthInfo } from '../../types/input';

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

/**
 * Tạo lá số đầy đủ từ engine để kiểm tra tích hợp luận giải.
 *
 * @returns Lá số Tử Vi hoàn chỉnh.
 */
function createTestChart(): ZiweiChart {
  const birthInfo: BirthInfo = {
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
  };

  return createChartEngine().generateChart(birthInfo);
}

/**
 * Tạo cung có Tuần án ngữ.
 *
 * @returns Cung Mệnh có Tuần.
 */
function createPalaceWithTuan(): Palace {
  return makePalace({
    id: 'menh',
    majorStars: [],
    hasTuan: true,
    tuanTrietRole: { tuan: 'primary', triet: null },
  });
}

/**
 * Tạo cung có Triệt án ngữ.
 *
 * @returns Cung Mệnh có Triệt.
 */
function createPalaceWithTriet(): Palace {
  return makePalace({
    id: 'menh',
    majorStars: [],
    hasTriet: true,
    tuanTrietRole: { tuan: null, triet: 'primary' },
  });
}

/**
 * Tạo cung không có Tuần/Triệt.
 *
 * @returns Cung Mệnh bình thường.
 */
function createPalaceWithoutTuanTriet(): Palace {
  return makePalace({ id: 'menh', majorStars: [] });
}

describe('Tam phương Tứ chính', () => {
  it('trả về đúng tam phương cho cung Mệnh', () => {
    const tamPhuong = getTamPhuong('menh');

    expect(tamPhuong.center).toBe('menh');
    expect(tamPhuong.related).toHaveLength(3);
    expect(tamPhuong.related).toEqual(
      expect.arrayContaining<PalaceId>(['taiBach', 'quanLoc', 'thienDi'])
    );
  });

  it('mọi cung có 3 cung liên quan, không tự tham chiếu và có quan hệ đối xứng', () => {
    for (const palaceId of PALACE_IDS) {
      const tamPhuong = getTamPhuong(palaceId);

      expect(tamPhuong.center).toBe(palaceId);
      expect(tamPhuong.related).toHaveLength(3);
      expect(new Set(tamPhuong.related).size).toBe(3);
      expect(tamPhuong.related).not.toContain(palaceId);

      for (const relatedId of tamPhuong.related) {
        expect(getTamPhuong(relatedId).related).toContain(palaceId);
      }
    }
  });

  it('bao gồm tam phương trong luận giải cung', () => {
    const chart = createTestChart();
    const interpretation = new ZiweiInterpreter().interpret(chart);
    const menhInterp = interpretation.palaces.find((p) => p.palaceId === 'menh');

    expect(menhInterp).toBeDefined();
    if (!menhInterp?.tamPhuong) {
      throw new Error('Cung Mệnh phải có phân tích tam phương tứ chính');
    }

    expect(menhInterp.tamPhuong.palaces).toHaveLength(3);
    expect(menhInterp.tamPhuong.palaces.map((p) => p.id)).toEqual(
      expect.arrayContaining([...getTamPhuong('menh').related])
    );
    expect(menhInterp.tamPhuong.summary.length).toBeGreaterThan(0);
  });
});

describe('Minor star interpretation', () => {
  it('trả về impact cho phụ tinh đã biết', () => {
    const meaning = getMinorStarMeaning('loc-ton', 'Lộc Tồn');

    expect(meaning).toBeDefined();
    expect(meaning?.impact).toBe('tốt');
    expect(meaning?.aspect).toBe('tài lộc');
  });

  it('trả về undefined cho phụ tinh chưa biết', () => {
    expect(getMinorStarMeaning('khong-ro', 'Sao Không Rõ')).toBeUndefined();
  });

  it('bao gồm phụ tinh trong luận giải cung', () => {
    const chart = createTestChart();
    const interpretation = new ZiweiInterpreter().interpret(chart);
    const menhInterp = interpretation.palaces.find((p) => p.palaceId === 'menh');

    expect(menhInterp).toBeDefined();
    expect(menhInterp?.minorStars).toBeDefined();
    expect(Array.isArray(menhInterp?.minorStars)).toBe(true);
  });

  it('gắn impact và aspect cho phụ tinh nhận diện được trong cung', () => {
    const chart = makeChart([
      makePalace({
        id: 'menh',
        majorStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' })],
        auspiciousStars: [
          makeStar({
            id: 'locTon',
            name: 'Lộc Tồn',
            category: 'locMa',
            nature: 'cat',
          }),
        ],
      }),
    ]);

    const palace = new ZiweiInterpreter().interpret(chart).palaces[0];
    const locTon = palace.minorStars.find((star) => star.starId === 'locTon');

    expect(locTon).toBeDefined();
    expect(locTon).toMatchObject({
      starId: 'locTon',
      name: 'Lộc Tồn',
      impact: 'tốt',
      aspect: 'tài lộc',
      isAuspicious: true,
    });
  });
});

describe('Tuần/Triệt effect', () => {
  it('giảm độ sáng 2 bậc khi bị Tuần án ngữ', () => {
    const star = makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' });

    const effect = applyTuanTrietEffect(star, createPalaceWithTuan());

    expect(effect.affected).toBe(true);
    expect(effect.affectedBy).toBe('Tuần');
    expect(effect.originalBrightness).toBe('mieu');
    expect(effect.brightness).toBe('dac');
    expect(effect.reduction).toBe(2);
    expect(effect.description).toContain('Tuần');
  });

  it('giảm độ sáng 2 bậc khi bị Triệt án ngữ', () => {
    const star = makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' });

    const effect = applyTuanTrietEffect(star, createPalaceWithTriet());

    expect(effect.affected).toBe(true);
    expect(effect.affectedBy).toBe('Triệt');
    expect(effect.originalBrightness).toBe('mieu');
    expect(effect.brightness).toBe('dac');
    expect(effect.reduction).toBe(2);
  });

  it('không thay đổi độ sáng khi không có Tuần/Triệt', () => {
    const star = makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' });

    const effect = applyTuanTrietEffect(star, createPalaceWithoutTuanTriet());

    expect(effect.affected).toBe(false);
    expect(effect.affectedBy).toBeUndefined();
    expect(effect.brightness).toBe('mieu');
    expect(effect.reduction).toBe(0);
  });

  it('không giảm độ sáng xuống dưới Hãm', () => {
    const star = makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'ham' });

    const effect = applyTuanTrietEffect(star, createPalaceWithTuan());

    expect(effect.affected).toBe(true);
    expect(effect.brightness).toBe('ham');
    expect(effect.reduction).toBe(0);
  });

  it('phản ánh tác động Tuần/Triệt trong luận giải chính tinh', () => {
    const star = makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' });
    const palace = makePalace({
      id: 'menh',
      majorStars: [star],
      hasTuan: true,
      tuanTrietRole: { tuan: 'primary', triet: null },
    });

    const interpretation = interpretMajorStar(star, palace);

    expect(interpretation).not.toBeNull();
    expect(interpretation).toMatchObject({
      starId: 'tuVi',
      brightness: 'dac',
      originalBrightness: 'mieu',
      reduction: 2,
      affected: true,
      affectedBy: 'Tuần',
    });
    expect(interpretation?.content.meaning.length).toBeGreaterThan(0);
  });
});

/**
 * Đếm số câu trong một đoạn văn bản dựa trên dấu kết câu.
 *
 * @param text - Đoạn văn bản cần đếm.
 * @returns Số câu ước tính.
 */
function countSentences(text: string): number {
  return (text.match(/[.!?](?:\s|$)/g) ?? []).length;
}

describe('Độ sâu nội dung Phase 1', () => {
  it('mọi cách cục có luận giải tối thiểu 150 ký tự và 3 câu', () => {
    expect(COMBINATIONS.length).toBeGreaterThan(0);

    for (const combination of COMBINATIONS) {
      expect(combination.meaning.length, combination.id).toBeGreaterThanOrEqual(150);
      expect(countSentences(combination.meaning), combination.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('mọi luận giải chính tinh có nội dung tối thiểu 150 ký tự và 3 câu', () => {
    const starIds = Object.keys(MAJOR_STAR_MEANINGS) as MajorStarId[];
    expect(starIds.length).toBe(14);

    for (const starId of starIds) {
      const byPalace = MAJOR_STAR_MEANINGS[starId];

      for (const [palaceId, byBrightness] of Object.entries(byPalace)) {
        for (const [brightness, content] of Object.entries(byBrightness)) {
          const label = `${starId}/${palaceId}/${brightness}`;

          expect(content.meaning.length, label).toBeGreaterThanOrEqual(150);
          expect(countSentences(content.meaning), label).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });
});
