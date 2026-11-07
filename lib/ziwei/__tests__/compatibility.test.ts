import { describe, it, expect } from 'vitest';
import { calculateCompatibility, type CompatibilityAspectKey } from '../compatibility';
import type { ZiweiChart, Palace, Star, Period } from '../types';
import {
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  HEAVENLY_STEMS,
  type BrightnessLevel,
  type EarthlyBranch,
  type FiveElement,
  type HeavenlyStem,
  type MutagenType,
  type PalaceId,
} from '../types/enums';

const ASPECT_KEYS: readonly CompatibilityAspectKey[] = [
  'foundation',
  'marriagePalace',
  'starSynergy',
  'canChi',
  'crossPalace',
];

// Khía cạnh nền tảng dùng ngưỡng 7,5/5,5; bốn khía cạnh còn lại dùng 7/5.
const ASPECT_THRESHOLDS: Readonly<Record<CompatibilityAspectKey, { cat: number; binh: number }>> = {
  foundation: { cat: 7.5, binh: 5.5 },
  marriagePalace: { cat: 7, binh: 5 },
  starSynergy: { cat: 7, binh: 5 },
  canChi: { cat: 7, binh: 5 },
  crossPalace: { cat: 7, binh: 5 },
};

const NUMERIC_SCORE_TEXT = /\b\d+(?:\.\d+)?\/(?:10|100)\b/;

function expectedQuality(key: CompatibilityAspectKey, score: number): 'cat' | 'binh' | 'canLuuY' {
  const threshold = ASPECT_THRESHOLDS[key];
  return score >= threshold.cat ? 'cat' : score >= threshold.binh ? 'binh' : 'canLuuY';
}

type PillarKey = 'year' | 'month' | 'day' | 'hour';

interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

interface StarParts {
  id: string;
  name?: string;
  element?: FiveElement;
  nature?: 'cat' | 'hung' | 'trung';
  brightness?: BrightnessLevel;
  mutagen?: MutagenType;
  category?: Star['category'];
}

function makeStar(parts: StarParts): Star {
  return {
    id: parts.id,
    name: parts.name ?? parts.id,
    category: parts.category ?? 'major',
    element: parts.element ?? 'kim',
    nature: parts.nature ?? 'trung',
    ...(parts.brightness ? { brightness: parts.brightness } : {}),
    ...(parts.mutagen ? { mutagen: parts.mutagen } : {}),
  } as Star;
}

interface PalaceParts {
  id: PalaceId;
  branch?: EarthlyBranch;
  element?: FiveElement;
  majorStars?: Star[];
  auspiciousStars?: Star[];
  maleficStars?: Star[];
  otherStars?: Star[];
  isBodyPalace?: boolean;
  hasTuan?: boolean;
  hasTriet?: boolean;
}

function makePalace(parts: PalaceParts): Palace {
  return {
    id: parts.id,
    name: parts.id,
    branch: parts.branch ?? 'ty',
    element: parts.element ?? 'kim',
    isBodyPalace: parts.isBodyPalace ?? false,
    majorStars: parts.majorStars ?? [],
    auspiciousStars: parts.auspiciousStars ?? [],
    maleficStars: parts.maleficStars ?? [],
    otherStars: parts.otherStars ?? [],
    hasTuan: parts.hasTuan ?? false,
    hasTriet: parts.hasTriet ?? false,
  } as unknown as Palace;
}

interface ChartParts {
  napAm?: FiveElement;
  cuc?: FiveElement;
  menhElement?: FiveElement;
  menhBranch?: EarthlyBranch;
  menhStars?: Star[];
  menhOtherStars?: Star[];
  menhMaleficStars?: Star[];
  phuTheElement?: FiveElement;
  phuTheBranch?: EarthlyBranch;
  phuTheStars?: Star[];
  phuTheOtherStars?: Star[];
  phuTheHasTuan?: boolean;
  phuTheHasTriet?: boolean;
  menhIsBodyPalace?: boolean;
  bodyBranch?: EarthlyBranch;
  extraPalaces?: PalaceParts[];
  pillars?: Partial<Record<PillarKey, Partial<Pillar>>>;
  periods?: Period[];
  birthYear?: number;
}

const BASE_PILLAR: Pillar = { stem: 'giap', branch: 'ty' };

// Chỉ tạo các field mà calculateCompatibility đọc tới, giữ fixture nhỏ và dễ đọc.
function makeChart(parts: ChartParts = {}): ZiweiChart {
  const pillar = (key: PillarKey): Pillar => ({ ...BASE_PILLAR, ...(parts.pillars?.[key] ?? {}) });
  const fourPillars = {
    year: { ...pillar('year'), label: 'test' },
    month: { ...pillar('month'), label: 'test' },
    day: { ...pillar('day'), label: 'test' },
    hour: { ...pillar('hour'), label: 'test' },
  };

  const palaces: Palace[] = [
    makePalace({
      id: 'menh',
      branch: parts.menhBranch,
      element: parts.menhElement,
      majorStars: parts.menhStars,
      otherStars: parts.menhOtherStars,
      maleficStars: parts.menhMaleficStars,
      isBodyPalace: parts.menhIsBodyPalace ?? true,
    }),
    makePalace({
      id: 'phuThe',
      branch: parts.phuTheBranch,
      element: parts.phuTheElement,
      majorStars: parts.phuTheStars,
      otherStars: parts.phuTheOtherStars,
      hasTuan: parts.phuTheHasTuan,
      hasTriet: parts.phuTheHasTriet,
    }),
    ...(parts.extraPalaces ?? []).map((palace) => makePalace(palace)),
  ];

  return {
    birthInfo: parts.birthYear === undefined ? undefined : { year: parts.birthYear },
    heavenPlate: {
      napAm: { name: 'test', element: parts.napAm ?? 'kim' },
      fiveElementsClass: { name: 'test', element: parts.cuc ?? 'kim', number: 2 },
      fourPillars,
      bodyPalaceBranch: parts.bodyBranch ?? parts.menhBranch ?? 'ty',
    },
    palaces,
    periods: parts.periods ?? [],
  } as unknown as ZiweiChart;
}

function allPillars(patch: Partial<Pillar>): Partial<Record<PillarKey, Partial<Pillar>>> {
  return {
    year: patch,
    month: patch,
    day: patch,
    hour: patch,
  };
}

const BASE = makeChart();

const TU_VI = makeStar({ id: 'tuVi', name: 'Tử Vi', element: 'hoa', nature: 'cat' });
const TU_VI_MIEU = makeStar({
  id: 'tuVi',
  name: 'Tử Vi',
  element: 'hoa',
  nature: 'cat',
  brightness: 'mieu',
});
const TU_VI_HOA_LOC = makeStar({
  id: 'tuVi',
  name: 'Tử Vi',
  element: 'hoa',
  nature: 'cat',
  brightness: 'mieu',
  mutagen: 'hoaLoc',
});

const TIMING_CHART = makeChart({
  birthYear: 1990,
  menhBranch: 'suu',
  menhOtherStars: [makeStar({ id: 'hongLoan', name: 'Hồng Loan' })],
  phuTheBranch: 'ty',
  periods: [
    { type: 'daiHan', palaceBranch: 'ty', startAge: 35, endAge: 44, stem: 'giap', branch: 'ty' },
    { type: 'luuNien', palaceBranch: 'suu', solarYear: 2026, stem: 'giap', branch: 'suu' },
  ],
});

describe('calculateCompatibility – hợp đồng 5 khía cạnh', () => {
  it('trả về đúng khoá aspects, điểm và metadata phương pháp', () => {
    const result = calculateCompatibility(BASE, BASE, { currentYear: 2026 });

    expect(Object.keys(result.aspects).sort()).toEqual([...ASPECT_KEYS].sort());
    expect(result.score).toBe(60);
    expect(result.level).toBe('trung bình');

    for (const key of ASPECT_KEYS) {
      const aspect = result.aspects[key];
      expect(aspect.score).toBeGreaterThanOrEqual(0);
      expect(aspect.score).toBeLessThanOrEqual(10);
      expect(aspect.meaning.trim().length).toBeGreaterThan(0);
      expect(aspect.explanation.trim().length).toBeGreaterThan(0);
      expect(aspect.tip.trim().length).toBeGreaterThan(0);
      expect(aspect.quality).toBe(expectedQuality(key, aspect.score));
      expect(aspect.explanation).not.toMatch(NUMERIC_SCORE_TEXT);
    }

    expect(result.timing).toMatchObject({ year: 2026 });
    expect(result.timing.score).toBeGreaterThanOrEqual(1);
    expect(result.timing.score).toBeLessThanOrEqual(10);
    expect(result.timing.meaning.trim().length).toBeGreaterThan(0);
    expect(result.timing.detail.trim().length).toBeGreaterThan(0);

    expect(result.strengths.every((item) => item.trim().length > 0)).toBe(true);
    expect(result.challenges.every((item) => item.trim().length > 0)).toBe(true);
    expect(result.advice.trim().length).toBeGreaterThan(0);
  });

  it('pin điểm số cho fixture nền tảng tất định', () => {
    const result = calculateCompatibility(BASE, BASE, { currentYear: 2026 });

    expect(result.aspects.foundation.score).toBe(7);
    expect(result.aspects.marriagePalace.score).toBe(5.5);
    expect(result.aspects.starSynergy.score).toBe(5.5);
    expect(result.aspects.canChi.score).toBe(6.2);
    expect(result.aspects.crossPalace.score).toBe(6);
    expect(result.score).toBe(60);
  });

  it('gán quality định tính đúng ngưỡng và không nhúng điểm số vào explanation', () => {
    const goodA = makeChart({
      napAm: 'kim',
      cuc: 'moc',
      menhElement: 'tho',
      menhBranch: 'ty',
      menhStars: [TU_VI_MIEU],
      phuTheElement: 'tho',
      phuTheBranch: 'ty',
      phuTheStars: [TU_VI_HOA_LOC],
      pillars: allPillars({ stem: 'giap', branch: 'ty' }),
    });
    const goodB = makeChart({
      napAm: 'thuy',
      cuc: 'hoa',
      menhElement: 'tho',
      menhBranch: 'thin',
      menhStars: [TU_VI_MIEU],
      phuTheElement: 'tho',
      phuTheBranch: 'thin',
      phuTheStars: [TU_VI_HOA_LOC],
      pillars: allPillars({ stem: 'ky', branch: 'thin' }),
    });
    const badChart = makeChart({
      napAm: 'moc',
      cuc: 'hoa',
      menhElement: 'hoa',
      menhBranch: 'ngo',
      phuTheElement: 'hoa',
      phuTheBranch: 'ngo',
      pillars: allPillars({ stem: 'at', branch: 'ngo' }),
    });
    const emptyChart = {} as ZiweiChart;

    const results = [
      calculateCompatibility(BASE, BASE, { currentYear: 2026 }),
      calculateCompatibility(goodA, goodB, { currentYear: 2026 }),
      calculateCompatibility(BASE, badChart, { currentYear: 2026 }),
      calculateCompatibility(emptyChart, emptyChart, { currentYear: 2026 }),
    ];

    for (const result of results) {
      for (const key of ASPECT_KEYS) {
        const aspect = result.aspects[key];
        expect(aspect.quality, `${key} score ${aspect.score}`).toBe(
          expectedQuality(key, aspect.score)
        );
        expect(aspect.explanation, key).not.toMatch(NUMERIC_SCORE_TEXT);
      }
    }
  });

  it('trọng số cộng đủ 100% và tổng điểm chỉ lấy từ năm khía cạnh', () => {
    const result = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2026 });
    const weights = result.method.weights;

    expect(Object.keys(weights).sort()).toEqual([...ASPECT_KEYS].sort());
    expect(weights).toEqual({
      foundation: 0.2,
      marriagePalace: 0.3,
      starSynergy: 0.2,
      canChi: 0.2,
      crossPalace: 0.1,
    });
    expect(Object.values(weights).reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);

    const weighted = ASPECT_KEYS.reduce(
      (sum, key) => sum + result.aspects[key].score * weights[key],
      0
    );
    expect(result.score).toBe(Math.round(weighted * 10));

    expect(result.method.version).toBe('2.0.0');
    expect(result.method.version.trim().length).toBeGreaterThan(0);
    expect(result.method.caveat.trim().length).toBeGreaterThan(0);
  });

  it('score trong khoảng 0-100 và mọi khía cạnh trong 0-10 cho mọi tổ hợp đầu vào', () => {
    for (const e1 of FIVE_ELEMENTS) {
      for (const e2 of FIVE_ELEMENTS) {
        for (const b1 of EARTHLY_BRANCHES) {
          for (const b2 of EARTHLY_BRANCHES) {
            const result = calculateCompatibility(
              makeChart({
                napAm: e1,
                menhElement: e1,
                phuTheElement: e1,
                menhBranch: b1,
                phuTheBranch: b1,
                pillars: allPillars({ branch: b1 }),
              }),
              makeChart({
                napAm: e2,
                menhElement: e2,
                phuTheElement: e2,
                menhBranch: b2,
                phuTheBranch: b2,
                pillars: allPillars({ branch: b2 }),
              }),
              { currentYear: 2026 }
            );

            expect(Number.isInteger(result.score)).toBe(true);
            expect(result.score).toBeGreaterThanOrEqual(0);
            expect(result.score).toBeLessThanOrEqual(100);
            for (const key of ASPECT_KEYS) {
              const score = result.aspects[key].score;
              expect(Number.isFinite(score)).toBe(true);
              expect(score).toBeGreaterThanOrEqual(0);
              expect(score).toBeLessThanOrEqual(10);
            }
          }
        }
      }
    }
  });

  it('level khớp chính xác với ngưỡng của score', () => {
    for (const stem of HEAVENLY_STEMS) {
      for (const branch of EARTHLY_BRANCHES) {
        const result = calculateCompatibility(
          makeChart({ pillars: allPillars({ stem }) }),
          makeChart({
            napAm: 'thuy',
            menhElement: 'thuy',
            pillars: allPillars({ stem: 'binh', branch }),
          }),
          { currentYear: 2026 }
        );
        const expected = result.score >= 70 ? 'tốt' : result.score >= 50 ? 'trung bình' : 'xấu';
        expect(result.level).toBe(expected);
      }
    }
  });

  it('pin level tốt, trung bình và xấu cho các fixture điển hình', () => {
    const goodA = makeChart({
      napAm: 'kim',
      cuc: 'moc',
      menhElement: 'tho',
      menhBranch: 'ty',
      menhStars: [TU_VI_MIEU],
      phuTheElement: 'tho',
      phuTheBranch: 'ty',
      phuTheStars: [TU_VI_HOA_LOC],
      pillars: allPillars({ stem: 'giap', branch: 'ty' }),
    });
    const goodB = makeChart({
      napAm: 'thuy',
      cuc: 'hoa',
      menhElement: 'tho',
      menhBranch: 'thin',
      menhStars: [TU_VI_MIEU],
      phuTheElement: 'tho',
      phuTheBranch: 'thin',
      phuTheStars: [TU_VI_HOA_LOC],
      pillars: allPillars({ stem: 'ky', branch: 'thin' }),
    });
    const good = calculateCompatibility(goodA, goodB, { currentYear: 2026 });
    expect(good.score).toBe(86);
    expect(good.level).toBe('tốt');
    expect(good.aspects.foundation.score).toBe(8.2);
    expect(good.aspects.marriagePalace.score).toBe(8.4);
    expect(good.aspects.starSynergy.score).toBe(8.8);
    expect(good.aspects.canChi.score).toBe(9);
    expect(good.aspects.crossPalace.score).toBe(9);

    // Cùng ngũ hành, cùng can chi, Mệnh/Phu Thê trung tính.
    const mid = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(mid.score).toBe(60);
    expect(mid.level).toBe('trung bình');

    // Tương khắc toàn bộ nền tảng và lục xung ở can chi/cung vị.
    const bad = calculateCompatibility(
      BASE,
      makeChart({
        napAm: 'moc',
        cuc: 'hoa',
        menhElement: 'hoa',
        menhBranch: 'ngo',
        phuTheElement: 'hoa',
        phuTheBranch: 'ngo',
        pillars: allPillars({ stem: 'at', branch: 'ngo' }),
      }),
      { currentYear: 2026 }
    );
    expect(bad.score).toBe(41);
    expect(bad.level).toBe('xấu');
    expect(bad.aspects.foundation.score).toBe(3);
    expect(bad.aspects.canChi.score).toBe(2.6);
    expect(bad.aspects.crossPalace.score).toBe(2);
  });

  it('đối xứng: đổi thứ tự hai lá số không đổi overall và điểm từng khía cạnh', () => {
    const forward = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2026 });
    const reverse = calculateCompatibility(BASE, TIMING_CHART, { currentYear: 2026 });

    expect(forward.score).toBe(reverse.score);
    for (const key of ASPECT_KEYS) {
      expect(forward.aspects[key].score).toBe(reverse.aspects[key].score);
      expect(forward.aspects[key].meaning).toBe(reverse.aspects[key].meaning);
    }

    // Thời vận được tính từ lá số thứ nhất, nên có thể khác khi đổi thứ tự.
    expect(forward.timing.score).toBe(8.5);
    expect(reverse.timing.score).toBe(5);
  });

  it('tháng/ngày/giờ trụ đều ảnh hưởng canChi, không chỉ năm', () => {
    const base = calculateCompatibility(BASE, BASE, { currentYear: 2026 });

    const variants: { label: string; chart: ZiweiChart; canChi: number; score: number }[] = [
      {
        label: 'tháng',
        chart: makeChart({ pillars: { month: { branch: 'ngo' } } }),
        canChi: 5.6,
        score: 59,
      },
      {
        label: 'ngày',
        chart: makeChart({ pillars: { day: { branch: 'ngo' } } }),
        canChi: 5.2,
        score: 58,
      },
      {
        label: 'giờ',
        chart: makeChart({ pillars: { hour: { branch: 'ngo' } } }),
        canChi: 5.7,
        score: 59,
      },
      {
        label: 'năm',
        chart: makeChart({ pillars: { year: { branch: 'ngo' } } }),
        canChi: 5.1,
        score: 58,
      },
    ];

    for (const variant of variants) {
      const result = calculateCompatibility(BASE, variant.chart, { currentYear: 2026 });
      expect(result.aspects.canChi.score, variant.label).toBe(variant.canChi);
      expect(result.score, variant.label).toBe(variant.score);
      expect(result.aspects.canChi.score, variant.label).not.toBe(base.aspects.canChi.score);
    }
  });

  it('sao, độ sáng, tính chất, Tứ Hóa và Tuần/Triệt ở Phu Thê đều đổi marriagePalace', () => {
    const base = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(base.aspects.marriagePalace.score).toBe(5.5);

    const variants: { label: string; chart: ZiweiChart; score: number }[] = [
      {
        label: 'chính tinh sáng',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'mieu' })],
        }),
        score: 6.7,
      },
      {
        label: 'chính tinh hãm',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'ham' })],
        }),
        score: 4.7,
      },
      {
        label: 'tính chất cát',
        chart: makeChart({ phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', nature: 'cat' })] }),
        score: 5.9,
      },
      {
        label: 'tính chất hung',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', nature: 'hung' })],
        }),
        score: 5.3,
      },
      {
        label: 'Hóa Lộc',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', mutagen: 'hoaLoc' })],
        }),
        score: 6.1,
      },
      {
        label: 'Hóa Kỵ',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', mutagen: 'hoaKy' })],
        }),
        score: 5.1,
      },
      { label: 'Tuần', chart: makeChart({ phuTheHasTuan: true }), score: 5.2 },
      { label: 'Triệt', chart: makeChart({ phuTheHasTriet: true }), score: 5.2 },
      {
        label: 'sao khác',
        chart: makeChart({
          phuTheStars: [makeStar({ id: 'thienPhu', name: 'Thiên Phủ', brightness: 'ham' })],
        }),
        score: 4.7,
      },
    ];

    for (const variant of variants) {
      const result = calculateCompatibility(BASE, variant.chart, { currentYear: 2026 });
      expect(result.aspects.marriagePalace.score, variant.label).toBe(variant.score);
      expect(result.aspects.marriagePalace.score, variant.label).not.toBe(
        base.aspects.marriagePalace.score
      );
    }
  });

  it('chính tinh trùng, Tứ Hóa và sao tình cảm đều đổi starSynergy', () => {
    const base = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(base.aspects.starSynergy.score).toBe(5.5);

    const bothSame = calculateCompatibility(
      makeChart({ menhStars: [TU_VI] }),
      makeChart({ menhStars: [TU_VI] }),
      { currentYear: 2026 }
    );
    expect(bothSame.aspects.starSynergy.score).toBe(7.8);
    expect(bothSame.aspects.starSynergy.explanation).toContain('Chính tinh trùng nhau: Tử Vi');

    const differentElements = calculateCompatibility(
      makeChart({ menhStars: [makeStar({ id: 'vuKhuc', name: 'Vũ Khúc', element: 'kim' })] }),
      makeChart({ menhStars: [makeStar({ id: 'thamLang', name: 'Tham Lang', element: 'moc' })] }),
      { currentYear: 2026 }
    );
    expect(differentElements.aspects.starSynergy.score).toBe(4.3);

    const romance = calculateCompatibility(
      makeChart({
        menhOtherStars: [makeStar({ id: 'hongLoan', name: 'Hồng Loan' })],
      }),
      makeChart({
        phuTheOtherStars: [makeStar({ id: 'daoHoa', name: 'Đào Hoa' })],
      }),
      { currentYear: 2026 }
    );
    expect(romance.aspects.starSynergy.score).toBe(6.3);
    expect(romance.aspects.starSynergy.explanation).toContain('sao tình cảm');

    const hoaKy = calculateCompatibility(
      makeChart({ menhStars: [TU_VI] }),
      makeChart({
        menhStars: [
          makeStar({ id: 'tuVi', name: 'Tử Vi', element: 'hoa', nature: 'cat', mutagen: 'hoaKy' }),
        ],
      }),
      { currentYear: 2026 }
    );
    expect(hoaKy.aspects.starSynergy.score).toBe(7);
    expect(hoaKy.aspects.starSynergy.explanation).toContain('Hóa Kỵ');
  });

  it('quan hệ chi của cung vị đổi crossPalace', () => {
    const variants: { label: string; chart: ZiweiChart; score: number; text: string }[] = [
      {
        label: 'cùng chi',
        chart: BASE,
        score: 6,
        text: 'cùng chi Tý',
      },
      {
        label: 'tam hợp',
        chart: makeChart({ menhBranch: 'thin', phuTheBranch: 'thin' }),
        score: 9,
        text: 'tam hợp',
      },
      {
        label: 'lục hợp',
        chart: makeChart({ menhBranch: 'suu', phuTheBranch: 'suu' }),
        score: 8,
        text: 'lục hợp',
      },
      {
        label: 'lục xung',
        chart: makeChart({ menhBranch: 'ngo', phuTheBranch: 'ngo' }),
        score: 2,
        text: 'lục xung',
      },
    ];

    for (const variant of variants) {
      const result = calculateCompatibility(BASE, variant.chart, { currentYear: 2026 });
      expect(result.aspects.crossPalace.score, variant.label).toBe(variant.score);
      expect(result.aspects.crossPalace.explanation, variant.label).toContain(variant.text);
    }
  });

  it('quan hệ ngũ hành nền tảng đổi foundation và giữ đúng chiều sinh/khắc', () => {
    const same = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(same.aspects.foundation.score).toBe(7);

    const sinh = calculateCompatibility(BASE, makeChart({ napAm: 'thuy', menhElement: 'thuy' }), {
      currentYear: 2026,
    });
    expect(sinh.aspects.foundation.score).toBe(8.6);
    expect(sinh.aspects.foundation.explanation).toContain('Kim sinh Thủy');

    const khac = calculateCompatibility(BASE, makeChart({ napAm: 'moc', menhElement: 'moc' }), {
      currentYear: 2026,
    });
    expect(khac.aspects.foundation.score).toBe(3.9);
    expect(khac.aspects.foundation.explanation).toContain('Kim khắc Mộc');

    // Đổi thứ tự người không đổi nội dung giải thích ngũ hành.
    const forward = calculateCompatibility(
      makeChart({ napAm: 'kim' }),
      makeChart({ napAm: 'moc' }),
      { currentYear: 2026 }
    );
    const reverse = calculateCompatibility(
      makeChart({ napAm: 'moc' }),
      makeChart({ napAm: 'kim' }),
      { currentYear: 2026 }
    );
    expect(forward.aspects.foundation.explanation).toBe(reverse.aspects.foundation.explanation);
    expect(forward.aspects.foundation.explanation).toContain('Kim khắc Mộc');
  });

  it('giữ kỳ vọng tam hợp, lục hợp, lục xung và ngũ hợp thiên can', () => {
    const relationCases: { label: string; chart: ZiweiChart; score: number; text: string }[] = [
      {
        label: 'tam hợp',
        chart: makeChart({ pillars: allPillars({ branch: 'thin' }) }),
        score: 8.6,
        text: 'tam hợp',
      },
      {
        label: 'lục hợp',
        chart: makeChart({ pillars: allPillars({ branch: 'suu' }) }),
        score: 7.8,
        text: 'lục hợp',
      },
      {
        label: 'lục xung',
        chart: makeChart({ pillars: allPillars({ branch: 'ngo' }) }),
        score: 3,
        text: 'lục xung',
      },
    ];

    for (const relation of relationCases) {
      const result = calculateCompatibility(BASE, relation.chart, { currentYear: 2026 });
      expect(result.aspects.canChi.score, relation.label).toBe(relation.score);
      expect(result.aspects.canChi.explanation, relation.label).toContain(relation.text);
    }

    const sameBranch = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(sameBranch.aspects.canChi.score).toBe(6.2);
    expect(sameBranch.aspects.canChi.explanation).toContain('cùng chi Tý');
    expect(sameBranch.aspects.canChi.explanation).not.toContain('tam hợp');

    const nguHop = calculateCompatibility(
      BASE,
      makeChart({ pillars: allPillars({ stem: 'ky' }) }),
      { currentYear: 2026 }
    );
    expect(nguHop.aspects.canChi.score).toBe(6.6);
    expect(nguHop.aspects.canChi.explanation).toContain('Giáp – Kỷ ngũ hợp hóa Thổ');
  });

  it('timing tất định theo currentYear, tách khỏi overall và có fallback an toàn', () => {
    const first = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2026 });
    const again = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2026 });
    expect(again.timing).toEqual(first.timing);
    expect(first.timing.year).toBe(2026);
    expect(first.timing.score).toBe(8.5);
    expect(first.timing.meaning).toBe('Thời vận thuận cho việc vun đắp tình cảm');
    expect(first.timing.detail).toContain('Năm 2026');
    expect(first.timing.detail).toContain('37 tuổi');
    expect(first.timing.detail).toContain('không nằm trong tỷ lệ tương hợp');

    // Overall và aspects không phụ thuộc năm thời vận.
    const later = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2030 });
    expect(later.score).toBe(first.score);
    expect(later.aspects).toEqual(first.aspects);
    expect(later.timing).not.toEqual(first.timing);

    const missing = calculateCompatibility(BASE, BASE, { currentYear: 2031 });
    expect(missing.timing.year).toBe(2031);
    expect(missing.timing.score).toBe(5);
    expect(missing.timing.meaning).toBe('Chưa đủ dữ liệu thời vận');
    expect(missing.timing.detail).toContain('không ảnh hưởng đến tỷ lệ tương hợp');

    const obstacle = calculateCompatibility(
      makeChart({
        birthYear: 1990,
        menhBranch: 'suu',
        menhMaleficStars: [makeStar({ id: 'diaKhong', name: 'Địa Không' })],
        periods: [
          { type: 'luuNien', palaceBranch: 'suu', solarYear: 2026, stem: 'giap', branch: 'suu' },
        ],
      }),
      BASE,
      { currentYear: 2026 }
    );
    expect(obstacle.timing.score).toBe(3);
    expect(obstacle.timing.detail).toContain('Địa Không');

    for (const year of [1900, 2000, 2026, 2099]) {
      const result = calculateCompatibility(TIMING_CHART, BASE, { currentYear: year });
      expect(result.timing.year).toBe(year);
      expect(result.timing.score).toBeGreaterThanOrEqual(1);
      expect(result.timing.score).toBeLessThanOrEqual(10);
    }
  });

  it('lá số rỗng/thiếu cung và sao dùng fallback trung tính, không có NaN', () => {
    const empty = {} as ZiweiChart;
    const result = calculateCompatibility(empty, empty, { currentYear: 2026 });

    expect(result.aspects.foundation.score).toBe(5);
    expect(result.aspects.marriagePalace.score).toBe(5.5);
    expect(result.aspects.starSynergy.score).toBe(5.5);
    expect(result.aspects.canChi.score).toBe(5);
    expect(result.aspects.crossPalace.score).toBe(5.5);
    expect(result.score).toBe(53);

    for (const key of ASPECT_KEYS) {
      expect(Number.isFinite(result.aspects[key].score), key).toBe(true);
      expect(result.aspects[key].explanation.trim().length, key).toBeGreaterThan(0);
      expect(result.aspects[key].tip.trim().length, key).toBeGreaterThan(0);
    }
    expect(Number.isFinite(result.score)).toBe(true);
    expect(Number.isFinite(result.timing.score)).toBe(true);
    expect(result.strengths).toEqual([]);
    expect(result.challenges).toEqual([]);

    const noPalaces = { ...BASE, palaces: [] } as unknown as ZiweiChart;
    const partial = calculateCompatibility(noPalaces, BASE, { currentYear: 2026 });
    expect(partial.aspects.marriagePalace.score).toBe(5.5);
    expect(Number.isFinite(partial.score)).toBe(true);
  });

  it('Hóa Kỵ tại Phu Thê chỉ được tính một lần, marker độc lập vẫn bị trừ', () => {
    const majorHoaKy = makeChart({
      phuTheStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', nature: 'cat', mutagen: 'hoaKy' })],
    });
    const majorOnly = calculateCompatibility(majorHoaKy, majorHoaKy, { currentYear: 2026 });
    // 6 nền + 0,8 cát - 1,8 Hóa Kỵ = 5,0; nếu trừ thêm 1,0 sẽ thành 4,0.
    expect(majorOnly.aspects.marriagePalace.score).toBe(5.2);
    expect(majorOnly.aspects.marriagePalace.meaning).toBe('Cung Phu Thê cân bằng, cần vun đắp');
    expect(majorOnly.aspects.marriagePalace.quality).toBe('binh');
    expect(majorOnly.aspects.marriagePalace.explanation).toContain(
      'Tự thân và tam phương (Phúc Đức, Quan Lộc, Thiên Di)'
    );
    expect(majorOnly.aspects.marriagePalace.explanation).not.toMatch(NUMERIC_SCORE_TEXT);

    const majorWithDuplicateMarker = makeChart({
      phuTheStars: [
        makeStar({ id: 'tuVi', name: 'Tử Vi', nature: 'cat', mutagen: 'hoaKy' }),
        makeStar({ id: 'hoaKy', name: 'Hóa Kỵ' }),
      ],
    });
    const withMarker = calculateCompatibility(majorWithDuplicateMarker, majorWithDuplicateMarker, {
      currentYear: 2026,
    });
    // Chỉ trừ 1,8 cho chính tinh; marker trùng không cộng thêm -1,0 (nếu có sẽ là 4,5).
    expect(withMarker.aspects.marriagePalace.score).toBe(5.5);
    expect(withMarker.aspects.marriagePalace.meaning).toBe('Cung Phu Thê cân bằng, cần vun đắp');
    expect(withMarker.aspects.marriagePalace.quality).toBe('binh');
    expect(withMarker.aspects.marriagePalace.explanation).not.toMatch(NUMERIC_SCORE_TEXT);

    const standalone = makeChart({
      phuTheOtherStars: [makeStar({ id: 'hoaKy', name: 'Hóa Kỵ', category: 'tuHoa' })],
    });
    const standaloneOnly = calculateCompatibility(standalone, standalone, { currentYear: 2026 });
    // Không có chính tinh: 5,5 nền - 1,0 marker = 4,5; nếu bỏ sót sẽ là 5,5.
    expect(standaloneOnly.aspects.marriagePalace.score).toBe(4.9);
    expect(standaloneOnly.aspects.marriagePalace.meaning).toBe('Cung Phu Thê cần thêm chú tâm');
    expect(standaloneOnly.aspects.marriagePalace.quality).toBe('canLuuY');
    expect(standaloneOnly.aspects.marriagePalace.explanation).not.toMatch(NUMERIC_SCORE_TEXT);
  });

  it('dataQuality phân biệt lá số đầy đủ và thiếu dữ liệu kèm cảnh báo', () => {
    const fullChart = makeChart({
      napAm: 'kim',
      cuc: 'moc',
      menhElement: 'tho',
      menhStars: [TU_VI_MIEU],
      phuTheElement: 'tho',
      phuTheStars: [TU_VI_HOA_LOC],
      pillars: allPillars({ stem: 'giap', branch: 'ty' }),
    });
    const full = calculateCompatibility(fullChart, fullChart, { currentYear: 2026 });
    expect(full.dataQuality).toBe('full');
    expect(full.dataWarnings).toEqual([]);

    const empty = {} as ZiweiChart;
    const emptyResult = calculateCompatibility(empty, empty, { currentYear: 2026 });
    expect(emptyResult.dataQuality).toBe('partial');
    expect(emptyResult.dataWarnings.length).toBeGreaterThan(0);
    expect(emptyResult.dataWarnings.join(' ')).toContain('thiếu toàn bộ 12 cung');

    const noMajor = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(noMajor.dataQuality).toBe('partial');
    expect(noMajor.dataWarnings.join(' ')).toContain('không có chính tinh nào');
  });

  it('bốn thiên can đều ảnh hưởng canChi, không chỉ địa chi', () => {
    const base = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(base.aspects.canChi.score).toBe(6.2);

    const pillarLabels: Record<PillarKey, string> = {
      year: 'Năm',
      month: 'Tháng',
      day: 'Ngày',
      hour: 'Giờ',
    };

    for (const key of ['year', 'month', 'day', 'hour'] as const) {
      const nonHopPillars: Partial<Record<PillarKey, Partial<Pillar>>> = {};
      nonHopPillars[key] = { stem: 'binh' };
      const nonHop = calculateCompatibility(BASE, makeChart({ pillars: nonHopPillars }), {
        currentYear: 2026,
      });

      const hopPillars: Partial<Record<PillarKey, Partial<Pillar>>> = {};
      hopPillars[key] = { stem: 'ky' };
      const hop = calculateCompatibility(BASE, makeChart({ pillars: hopPillars }), {
        currentYear: 2026,
      });

      expect(nonHop.aspects.canChi.score, key).toBe(6.1);
      expect(nonHop.aspects.canChi.score, key).not.toBe(base.aspects.canChi.score);
      expect(nonHop.aspects.canChi.explanation, `${key} Bính`).toContain('Bính');

      expect(hop.aspects.canChi.score, key).toBe(6.3);
      expect(hop.aspects.canChi.score, key).not.toBe(base.aspects.canChi.score);
      expect(hop.aspects.canChi.explanation, `${key} Kỷ`).toContain('Kỷ');
    }

    expect(Object.values(base.method.weights).reduce((sum, value) => sum + value, 0)).toBeCloseTo(
      1,
      10
    );
    expect(base.aspects.canChi.explanation).toContain('Thiên can bốn trụ');
    expect(base.aspects.canChi.explanation).toContain('Địa chi bốn trụ');
    for (const label of Object.values(pillarLabels)) {
      expect(base.aspects.canChi.explanation, label).toContain(`${label}:`);
    }
  });

  it('Thân trùng Mệnh không bị tính hai lần; cung Thân khác lấy thêm trọng số', () => {
    const bodyMenh = makeChart({ napAm: 'hoa' });
    const bodyMenhResult = calculateCompatibility(bodyMenh, BASE, { currentYear: 2026 });
    // Nạp âm Hỏa khắc Kim (3), Mệnh/Cục đồng Kim (7). Chuẩn hóa lại 0,35 + 0,35 + 0,2.
    const renormalized = Math.round(((3 * 0.35 + 7 * 0.35 + 7 * 0.2) / 0.9) * 10) / 10;
    expect(bodyMenhResult.aspects.foundation.score).toBe(5.4);
    expect(bodyMenhResult.aspects.foundation.score).toBe(renormalized);
    expect(bodyMenhResult.aspects.foundation.explanation).toContain('Cung Thân trùng cung Mệnh');
    expect(bodyMenhResult.aspects.foundation.explanation).not.toContain('Cung Thân:');

    const distinctBody = makeChart({
      napAm: 'hoa',
      menhIsBodyPalace: false,
      bodyBranch: 'ngo',
      extraPalaces: [{ id: 'quanLoc', branch: 'ngo', element: 'kim' }],
    });
    const distinctResult = calculateCompatibility(distinctBody, BASE, { currentYear: 2026 });
    const withBody = Math.round(((3 * 0.35 + 7 * 0.35 + 7 * 0.2 + 7 * 0.1) / 1) * 10) / 10;
    expect(distinctResult.aspects.foundation.score).toBe(5.6);
    expect(distinctResult.aspects.foundation.score).toBe(withBody);
    expect(distinctResult.aspects.foundation.explanation).toContain('Cung Thân:');
  });

  it('giá trị trung tính: thiếu cung/chính tinh/tam phương dùng 5,5, quan hệ chưa rõ dùng 5', () => {
    const noPhuThe = {
      ...BASE,
      palaces: [makePalace({ id: 'menh', branch: 'ty', element: 'kim', isBodyPalace: true })],
    } as unknown as ZiweiChart;
    expect(
      calculateCompatibility(noPhuThe, noPhuThe, { currentYear: 2026 }).aspects.marriagePalace.score
    ).toBe(5.5);

    const noMajor = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    expect(noMajor.aspects.marriagePalace.score).toBe(5.5);
    expect(noMajor.aspects.marriagePalace.quality).toBe('binh');
    expect(noMajor.aspects.marriagePalace.explanation).toContain(
      'Tự thân và tam phương (Phúc Đức, Quan Lộc, Thiên Di) được tổng hợp theo trọng số 65/35.'
    );
    expect(noMajor.aspects.marriagePalace.explanation).not.toMatch(NUMERIC_SCORE_TEXT);

    const majorPhuThe = makeChart({ phuTheStars: [TU_VI] });
    const majorPhuTheResult = calculateCompatibility(majorPhuThe, majorPhuThe, {
      currentYear: 2026,
    });
    // Chính tinh nền 6 + tính cát 0,8; tam phương thiếu dùng 5,5; (6,8 * 0,65) + (5,5 * 0,35) = 6,3.
    expect(majorPhuTheResult.aspects.marriagePalace.score).toBe(6.3);
    expect(majorPhuTheResult.aspects.marriagePalace.quality).toBe('binh');
    expect(majorPhuTheResult.aspects.marriagePalace.explanation).toContain(
      'Tự thân và tam phương (Phúc Đức, Quan Lộc, Thiên Di) được tổng hợp theo trọng số 65/35.'
    );
    expect(majorPhuTheResult.aspects.marriagePalace.explanation).not.toMatch(NUMERIC_SCORE_TEXT);

    // Tý và Dần không cùng chi, tam hợp, lục hợp, lục xung hay lục hại -> quan hệ trung tính 5.
    const unknown = calculateCompatibility(
      BASE,
      makeChart({ pillars: allPillars({ branch: 'dan' }) }),
      { currentYear: 2026 }
    );
    expect(unknown.aspects.canChi.score).toBe(5.4);
    expect(unknown.aspects.canChi.explanation).toContain('trung tính');
  });

  it('thời vận nêu lá số thứ nhất và nhận diện toàn bộ danh sách sao cản trở', () => {
    const first = calculateCompatibility(TIMING_CHART, BASE, { currentYear: 2026 });
    expect(first.timing.detail).toContain('theo lá số thứ nhất');

    const obstacleIds = [
      'coThan',
      'quaTu',
      'diaKhong',
      'diaKiep',
      'kinhDuong',
      'daLa',
      'hoaTinh',
      'linhTinh',
      'thienHinh',
      'thienKhoc',
      'thienHu',
    ];

    for (const id of obstacleIds) {
      const chart = makeChart({
        birthYear: 1990,
        menhBranch: 'suu',
        menhMaleficStars: [makeStar({ id })],
        periods: [
          { type: 'luuNien', palaceBranch: 'suu', solarYear: 2026, stem: 'giap', branch: 'suu' },
        ],
      });
      const result = calculateCompatibility(chart, BASE, { currentYear: 2026 });
      expect(result.timing.score, id).toBe(3);
      expect(result.timing.detail, id).toContain('Cần lưu tâm');
    }

    const hoaKy = makeChart({
      birthYear: 1990,
      menhBranch: 'suu',
      menhStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', mutagen: 'hoaKy' })],
      periods: [
        { type: 'luuNien', palaceBranch: 'suu', solarYear: 2026, stem: 'giap', branch: 'suu' },
      ],
    });
    const hoaKyResult = calculateCompatibility(hoaKy, BASE, { currentYear: 2026 });
    expect(hoaKyResult.timing.score).toBe(3);
    expect(hoaKyResult.timing.detail).toContain('Hóa Kỵ');
  });

  it('kết quả deterministic: cùng đầu vào cho cùng kết quả', () => {
    const c1 = makeChart({
      napAm: 'hoa',
      menhElement: 'hoa',
      menhBranch: 'dan',
      pillars: allPillars({ stem: 'dinh', branch: 'dan' }),
    });
    const c2 = makeChart({
      napAm: 'tho',
      menhElement: 'tho',
      menhBranch: 'hoi',
      pillars: allPillars({ stem: 'nham', branch: 'hoi' }),
    });

    expect(calculateCompatibility(c1, c2, { currentYear: 2026 })).toEqual(
      calculateCompatibility(c1, c2, { currentYear: 2026 })
    );
  });
});

describe('kết luận định tính', () => {
  const EXPECTED_CONCLUSION_QUOTES = {
    high: [
      'Âm dương thuận hòa, phu thê vinh hiển khi cả hai đồng lòng.',
      'Đôi bên tương sinh tương trợ, gia đạo hưng long nhờ đồng tâm vun đắp.',
      'Duyên lành gặp hội, trăm năm viên mãn bởi lòng người vun đắp.',
      'Thiên định lương duyên, còn bền lâu là nhờ nghĩa tình và nhường nhịn.',
      'Tơ hồng se mối, đôi người nâng đỡ nhau thì đường dài cũng vững.',
    ],
    balanced: [
      'Duyên phận do trời, hạnh phúc do người; biết nhường nhịn thì êm ấm.',
      'Căn duyên tiền định, dẫu trắc trở nhưng đồng lòng thì vượt qua.',
      'Âm dương lệch pha đôi chút, cốt ở chữ nhẫn và sự thấu hiểu.',
      'Vợ chồng hòa hợp, bước đầu cần bao dung, lâu dài cần cùng vun đắp.',
      'Duyên đến từ thương, bền từ nhịn, hai bên cùng giữ thì mới nên duyên.',
    ],
    challenging: [
      'Duyên mỏng nợ sâu, càng cần lấy nhẫn nhịn và đức độ mà giữ lấy nhau.',
      'Đường duyên trắc trở, cần tu tâm dưỡng tính, lấy đức thắng số.',
      'Nhiều điểm xung, khẩu thiệt dễ sinh, cần khắc chế cái tôi giữ gia đạo.',
      'Duyên khởi có nhiều thử thách, cần bền tâm và nhẫn nhịn lẫn nhau.',
      'Duyên chưa thuận, lấy chân thành và nhẫn nại làm nền mới mong dài lâu.',
    ],
  } as const;

  const goodA = makeChart({
    napAm: 'kim',
    cuc: 'moc',
    menhElement: 'tho',
    menhBranch: 'ty',
    menhStars: [TU_VI_MIEU],
    phuTheElement: 'tho',
    phuTheBranch: 'ty',
    phuTheStars: [TU_VI_HOA_LOC],
    pillars: allPillars({ stem: 'giap', branch: 'ty' }),
  });
  const goodB = makeChart({
    napAm: 'thuy',
    cuc: 'hoa',
    menhElement: 'tho',
    menhBranch: 'thin',
    menhStars: [TU_VI_MIEU],
    phuTheElement: 'tho',
    phuTheBranch: 'thin',
    phuTheStars: [TU_VI_HOA_LOC],
    pillars: allPillars({ stem: 'ky', branch: 'thin' }),
  });
  const badChart = makeChart({
    napAm: 'moc',
    cuc: 'hoa',
    menhElement: 'hoa',
    menhBranch: 'ngo',
    phuTheElement: 'hoa',
    phuTheBranch: 'ngo',
    pillars: allPillars({ stem: 'at', branch: 'ngo' }),
  });

  const expectedTone = (score: number): 'high' | 'balanced' | 'challenging' =>
    score >= 70 ? 'high' : score >= 50 ? 'balanced' : 'challenging';

  it('chọn quote cấp cao, tone high khi điểm tổng từ 70 trở lên', () => {
    const result = calculateCompatibility(goodA, goodB, { currentYear: 2026 });

    expect(result.score).toBe(86);
    expect(result.level).toBe('tốt');
    expect(result.conclusion.tone).toBe('high');
    expect(result.conclusion.tone).toBe(expectedTone(result.score));
    expect(EXPECTED_CONCLUSION_QUOTES.high).toContain(result.conclusion.quote);
    expect(result.conclusion.quote.trim().length).toBeGreaterThan(0);
    // Điểm tổng hiển thị dạng x/100 nên vẫn là số nguyên trong khoảng 0-100.
    expect(Number.isInteger(result.score)).toBe(true);
  });

  it('chọn quote trung hòa, tone balanced khi điểm tổng 50-69', () => {
    const result = calculateCompatibility(BASE, BASE, { currentYear: 2026 });

    expect(result.score).toBe(60);
    expect(result.level).toBe('trung bình');
    expect(result.conclusion.tone).toBe('balanced');
    expect(result.conclusion.tone).toBe(expectedTone(result.score));
    expect(EXPECTED_CONCLUSION_QUOTES.balanced).toContain(result.conclusion.quote);
    expect(result.conclusion.quote.trim().length).toBeGreaterThan(0);
  });

  it('chọn quote thử thách, tone challenging khi điểm tổng dưới 50', () => {
    const result = calculateCompatibility(BASE, badChart, { currentYear: 2026 });

    expect(result.score).toBe(41);
    expect(result.level).toBe('xấu');
    expect(result.conclusion.tone).toBe('challenging');
    expect(result.conclusion.tone).toBe(expectedTone(result.score));
    expect(EXPECTED_CONCLUSION_QUOTES.challenging).toContain(result.conclusion.quote);
    expect(result.conclusion.quote.trim().length).toBeGreaterThan(0);
  });

  it('cùng tone nhưng hồ sơ khía cạnh khác chọn quote khác', () => {
    const base = calculateCompatibility(BASE, BASE, { currentYear: 2026 });
    const variant = calculateCompatibility(
      BASE,
      makeChart({ menhBranch: 'dan', phuTheBranch: 'dan' }),
      { currentYear: 2026 }
    );

    expect(base.conclusion.tone).toBe('balanced');
    expect(variant.conclusion.tone).toBe('balanced');
    expect(base.conclusion.quote).not.toBe(variant.conclusion.quote);
    expect(EXPECTED_CONCLUSION_QUOTES.balanced).toContain(base.conclusion.quote);
    expect(EXPECTED_CONCLUSION_QUOTES.balanced).toContain(variant.conclusion.quote);
  });

  it('kết luận deterministic cho cùng đầu vào và không phụ thuộc năm thời vận', () => {
    const first = calculateCompatibility(goodA, goodB, { currentYear: 2026 });
    const second = calculateCompatibility(goodA, goodB, { currentYear: 2026 });
    const later = calculateCompatibility(goodA, goodB, { currentYear: 2030 });

    expect(first.conclusion).toEqual(second.conclusion);
    expect(later.conclusion).toEqual(first.conclusion);
    expect(later.score).toBe(first.score);
  });

  it('mọi quote thực tế đều thuộc bộ của tone, có dấu hiệu chủ động và không tuyệt đối hóa', () => {
    const fatalisticPhrases = [
      'chắc chắn',
      '100%',
      'tuyệt đối',
      'đảm bảo',
      'cam kết',
      'định mệnh',
      'số phận',
    ];
    // Cụm "trăm năm viên mãn" được giữ có chủ đích trong văn phong văn hóa,
    // nhưng mỗi câu phải kèm dấu hiệu hành động/điều kiện của con người.
    const agencyCues = [
      'cần',
      'nhờ',
      'bởi',
      'cùng',
      'đồng lòng',
      'đồng tâm',
      'nhẫn',
      'nhường nhịn',
      'vun đắp',
      'nâng đỡ',
      'thấu hiểu',
      'bao dung',
      'giữ',
      'lấy',
      'chân thành',
      'do người',
      'biết',
      'tu tâm',
      'khắc chế',
      'bền',
    ];
    const maxLength: Record<'high' | 'balanced' | 'challenging', number> = {
      high: 69,
      balanced: 69,
      challenging: 70,
    };
    const quotes = new Map<string, 'high' | 'balanced' | 'challenging'>();
    const results = [
      calculateCompatibility(goodA, goodB, { currentYear: 2026 }),
      calculateCompatibility(BASE, BASE, { currentYear: 2026 }),
      calculateCompatibility(BASE, badChart, { currentYear: 2026 }),
    ];

    for (const e1 of FIVE_ELEMENTS) {
      for (const e2 of FIVE_ELEMENTS) {
        for (const branch of EARTHLY_BRANCHES) {
          results.push(
            calculateCompatibility(
              makeChart({
                napAm: e1,
                menhElement: e1,
                menhBranch: branch,
                phuTheBranch: branch,
                pillars: allPillars({ branch }),
              }),
              makeChart({
                napAm: e2,
                menhElement: e2,
                menhBranch: branch,
                phuTheBranch: branch,
                pillars: allPillars({ branch }),
              }),
              { currentYear: 2026 }
            )
          );
        }
      }
    }

    for (const result of results) {
      const { tone, quote } = result.conclusion;
      expect(tone).toBe(expectedTone(result.score));
      expect(EXPECTED_CONCLUSION_QUOTES[tone]).toContain(quote);
      quotes.set(quote, tone);
    }

    expect(quotes.size).toBeGreaterThan(0);
    for (const [quote, tone] of quotes) {
      expect(quote.trim().length, `${tone}: ${quote}`).toBeGreaterThan(0);
      expect([...quote].length, `${tone}: ${quote}`).toBeLessThanOrEqual(maxLength[tone]);
      expect(quote).not.toMatch(NUMERIC_SCORE_TEXT);
      const lower = quote.toLowerCase();
      expect(
        agencyCues.some((cue) => lower.includes(cue)),
        `missing agency cue in ${tone}: ${quote}`
      ).toBe(true);
      for (const phrase of fatalisticPhrases) {
        expect(lower, `${tone}: ${quote}`).not.toContain(phrase);
      }
    }
  });
});
