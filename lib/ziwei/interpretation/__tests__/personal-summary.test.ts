import { describe, it, expect } from 'vitest';
import { generatePersonalSummary } from '../personal-summary';
import type { BirthInfo, BrightnessLevel, Palace, PalaceId, Star, ZiweiChart } from '../../types';
import { createChartEngine } from '@/lib/ziwei/engine';
import { getBranchLabel } from '@/lib/chart/display-helpers';
import { ALL_FIXTURES } from '../../__tests__/golden/fixtures';

const STAR_CASES = [
  ['Tử Vi', 'Bạn là người lãnh đạo bẩm sinh'],
  ['Thiên Phủ', 'Bạn là người ổn định, đáng tin cậy'],
  ['Thái Dương', 'Bạn là người nhiệt tình, tràn đầy năng lượng'],
  ['Thái Âm', 'Bạn là người nhạy cảm, giàu tình cảm'],
  ['Vũ Khúc', 'Bạn là người thực tế, giỏi quản lý tài chính'],
  ['Liêm Trinh', 'Bạn là người chính trực, có nguyên tắc'],
  ['Tham Lang', 'Bạn là người tài năng, có sức hút'],
  ['Cự Môn', 'Bạn là người thẳng thắn, có tài phân tích'],
  ['Thiên Cơ', 'Bạn là người thông minh, có trí tuệ'],
  ['Thiên Đồng', 'Bạn là người hiền lành, tốt bụng'],
  ['Thiên Tướng', 'Bạn là người có trách nhiệm, đáng tin cậy'],
  ['Thiên Lương', 'Bạn là người thiện lương, có phúc đức'],
  ['Thất Sát', 'Bạn là người mạnh mẽ, quyết đoán'],
  ['Phá Quân', 'Bạn là người sáng tạo, không ngại thay đổi'],
] as const;

function makeChart(starNames: readonly string[]): ZiweiChart {
  return {
    palaces: [
      {
        id: 'menh',
        branch: 'ty',
        majorStars: starNames.map((name) => ({ name })),
        auspiciousStars: [],
        maleficStars: [],
        otherStars: [],
        hasTuan: false,
        hasTriet: false,
      },
    ],
  } as unknown as ZiweiChart;
}

describe('generatePersonalSummary', () => {
  it.each(STAR_CASES)('tạo kết luận phù hợp cho %s', (starName, expectedHeadline) => {
    const summary = generatePersonalSummary(makeChart([starName]));

    expect(summary.headline).toBe(expectedHeadline);
    expect(summary.description.length).toBeGreaterThan(0);
    expect(summary.keyTraits.length).toBeGreaterThanOrEqual(3);
    expect(summary.keyTraits.length).toBeLessThanOrEqual(5);
    expect(summary.lifePath.length).toBeGreaterThan(0);
  });

  it('dùng kết luận mặc định khi cung Mệnh Vô Chính Diệu', () => {
    const summary = generatePersonalSummary(makeChart([]));

    expect(summary.headline).toBe('Bạn là người linh hoạt, dễ thích nghi');
    expect(summary.keyTraits).toHaveLength(4);
  });

  it('dùng kết luận mặc định khi không xác định được chính tinh', () => {
    const summary = generatePersonalSummary(makeChart(['Sao Không Xác Định']));

    expect(summary.headline).toBe('Bạn là người linh hoạt, dễ thích nghi');
    expect(summary.lifePath).toBe('Đa dạng, phụ thuộc vào nỗ lực bản thân');
  });
});

describe('generatePersonalSummary - luận giải chi tiết', () => {
  const chart = createChartEngine().generateChart({
    name: 'Đương số kiểm thử',
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
  });

  it('có đủ các đoạn luận giải và tên đương số', () => {
    const summary = generatePersonalSummary(chart);

    expect(summary.ownerName).toBe('Đương số kiểm thử');
    expect(summary.introParagraph).toContain(chart.heavenPlate.napAm.name);
    expect(summary.introParagraph).toContain(chart.heavenPlate.yinYangGenderLabel);
    const menh = chart.palaces.find((p) => p.id === 'menh');
    expect(menh).toBeDefined();
    expect(summary.menhStarParagraph).toContain(getBranchLabel(menh?.branch ?? 'ty'));
    expect(summary.tamHopAndThanParagraph).toContain(
      getBranchLabel(chart.heavenPlate.bodyPalaceBranch)
    );
    expect(summary.conclusionParagraph).toContain(summary.description);
  });
});

type ExpectedTone = 'high' | 'balanced' | 'challenging';
type ExpectedQuoteCategory = ExpectedTone | 'voChinhDieu' | 'thanCuThienDi' | 'satPhaTham';

/** Bảng khẩu khí kỳ vọng, sao chép từ nguồn để kiểm tra đúng nhóm được chọn. */
const EXPECTED_QUOTES: Readonly<Record<ExpectedQuoteCategory, readonly string[]>> = {
  high: [
    'Phú quý tại thiên, sinh phùng thời vận, cả đời an khang thịnh vượng.',
    'Phúc trạch sâu dày, quý nhân phù trợ, gặp hung hóa cát.',
    'Mệnh đắc chính tinh, vận trình hanh thông, hậu vận an khang.',
    'Khí chất đường hoàng, tài lộc hanh thông, gia đạo vững bền.',
    'Căn cơ vững chắc, gặp thời thì phát, giữ đức thì bền lâu.',
    'Sao sáng chiếu mệnh, đường đời rộng mở, càng về sau càng hanh thông.',
  ],
  balanced: [
    'Cục diện trung hòa, có thăng có trầm, cốt ở chữ nhẫn mà vững bước.',
    'Không quá hiển đạt nhưng ổn định, biết tùy thời thì an khang.',
    'Tiền vận có chút chông gai, hậu vận dần yên ổn nếu biết giữ mình.',
    'Âm dương hòa hợp, được mất đan xen, giữ tâm bình thì đường dài an ổn.',
    'Vận trình không dồn dập, cốt ở sự bền bỉ và biết lượng sức mà tiến.',
    'Có lúc thuận có lúc nghịch, biết tiến thoái đúng lúc thì sự nghiệp hanh thông.',
  ],
  challenging: [
    'Cung Mệnh có nhiều sao cản trở, cuộc đời lắm đoạn thăng trầm, cần lấy nhẫn nại làm gốc.',
    'Tiền vận lắm nỗi gian nan, hậu vận mới dần yên ổn nếu biết tu tâm.',
    'Duyên khởi có phần trắc trở, cần lấy đức thắng số, lấy tĩnh chế động.',
    'Sóng gió là thử thách để tôi luyện; giữ tâm vững thì hậu vận an khang.',
    'Đường đời nhiều chông gai, càng giữ chí bền thì càng dễ chuyển hung thành cát.',
    'Vận có lúc ngặt nghèo, cốt lấy thiện tâm và nghị lực mà vượt qua.',
  ],
  voChinhDieu: [
    'Mệnh vô chính diệu, nên ly hương lập nghiệp, mượn thế tam phương mà dựng cơ đồ.',
    'Mệnh vô chính diệu, tiền vận nhiều phen thử sức, hậu vận vững vàng nếu biết bền chí.',
    'Mệnh vô chính diệu, linh hoạt ứng biến, càng đi xa càng gặp quý nhân nâng đỡ.',
    'Mệnh vô chính diệu, chẳng nên thủ cựu, biết tùy duyên mà lập nghiệp thì về sau yên ổn.',
    'Mệnh vô chính diệu, lấy tam phương chiếu về làm chỗ dựa, bền chí ắt có ngày nên.',
  ],
  thanCuThienDi: [
    'Thân cư Thiên Di, bôn ba bốn bể nhưng hậu vận viên mãn.',
    'Thân cư Thiên Di, càng đi xa càng mở rộng cơ duyên.',
    'Thân cư Thiên Di, nửa đời lưu động, đổi thay là lẽ thường nhưng càng về sau càng vững.',
    'Thân cư Thiên Di, lấy phương xa làm đất dụng võ, giữ tâm vững thì đường dài hanh thông.',
    'Thân cư Thiên Di, ra ngoài lập nghiệp dễ gặp quý nhân, nhưng cần giữ gốc gia đạo.',
  ],
  satPhaTham: [
    'Sát Phá Tham hội hợp, anh hùng tạo thời thế, thăng trầm bất định nhưng lập nên cơ đồ.',
    'Sát Phá Tham hội hợp, càng trải sóng gió càng mở rộng cơ nghiệp.',
    'Sát Phá Tham hội hợp, dám phá cũ lập mới, biết tiết chế thì thăng trầm hóa thành bản lĩnh.',
    'Sát Phá Tham hội hợp, tiền vận nhiều phen đổi dời, hậu vận vững vàng nếu biết tích lũy.',
    'Sát Phá Tham hội hợp, khí phách hơn người, cốt lấy nhẫn nại và chừng mực mà giữ thành quả.',
  ],
};

const FATALISTIC_PHRASES = ['yểu chiết', 'chắc chắn', 'tuyệt đối', 'đảm bảo', 'định mệnh'];

function makeStar(name: string, brightness?: BrightnessLevel): Star {
  return { id: name, name, brightness } as unknown as Star;
}

interface PalaceFixtureOptions {
  id: PalaceId;
  index?: number;
  branch?: Palace['branch'];
  majorStars?: Star[];
  auspiciousStars?: Star[];
  maleficStars?: Star[];
  hasTuan?: boolean;
  hasTriet?: boolean;
  isBodyPalace?: boolean;
}

function makePalaceFixture(options: PalaceFixtureOptions): Palace {
  return {
    id: options.id,
    index: options.index ?? 0,
    name: options.id,
    branch: options.branch ?? 'ty',
    majorStars: options.majorStars ?? [],
    auspiciousStars: options.auspiciousStars ?? [],
    maleficStars: options.maleficStars ?? [],
    otherStars: [],
    hasTuan: options.hasTuan ?? false,
    hasTriet: options.hasTriet ?? false,
    isBodyPalace: options.isBodyPalace ?? false,
  } as unknown as Palace;
}

interface ChartFixtureOptions {
  majorStars?: Star[];
  auspiciousStars?: Star[];
  maleficStars?: Star[];
  hasTuan?: boolean;
  hasTriet?: boolean;
  bodyPalaceId?: PalaceId;
}

/** Lá số tối giản chỉ gồm cung Mệnh (và cung Thân khi cần). */
function makeChartFixture(options: ChartFixtureOptions = {}): ZiweiChart {
  const palaces: Palace[] = [
    makePalaceFixture({
      id: 'menh',
      index: 0,
      majorStars: options.majorStars,
      auspiciousStars: options.auspiciousStars,
      maleficStars: options.maleficStars,
      hasTuan: options.hasTuan,
      hasTriet: options.hasTriet,
    }),
  ];

  if (options.bodyPalaceId) {
    palaces.push(
      makePalaceFixture({
        id: options.bodyPalaceId,
        index: 1,
        branch: 'ngo',
        isBodyPalace: true,
      })
    );
  }

  return { palaces } as unknown as ZiweiChart;
}

function makeFullChart(): ZiweiChart {
  return createChartEngine().generateChart({
    name: 'Đương số khẩu khí',
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
  });
}

describe('generatePersonalSummary - khẩu khí kết luận', () => {
  const fullChart = makeFullChart();
  const minimalChart = makeChart(['Tử Vi']);
  const chartWithoutHeavenPlate = { ...fullChart } as Partial<ZiweiChart>;
  delete chartWithoutHeavenPlate.heavenPlate;
  const missingHeavenPlateChart = chartWithoutHeavenPlate as ZiweiChart;

  const TONE_FIXTURES: ReadonlyArray<{ tone: ExpectedTone; chart: ZiweiChart }> = [
    {
      tone: 'high',
      chart: makeChartFixture({
        majorStars: [makeStar('Tử Vi', 'mieu')],
        auspiciousStars: [makeStar('Tả Phụ')],
      }),
    },
    {
      tone: 'balanced',
      chart: makeChartFixture({ majorStars: [makeStar('Tử Vi', 'binh')] }),
    },
    {
      tone: 'challenging',
      chart: makeChartFixture({ majorStars: [makeStar('Tử Vi', 'ham')] }),
    },
  ];

  const CATEGORY_FIXTURES: ReadonlyArray<{
    category: ExpectedQuoteCategory;
    marker: string;
    chart: ZiweiChart;
  }> = [
    {
      category: 'voChinhDieu',
      marker: 'Mệnh vô chính diệu',
      chart: makeChartFixture(),
    },
    {
      category: 'thanCuThienDi',
      marker: 'Thân cư Thiên Di',
      chart: makeChartFixture({
        majorStars: [makeStar('Tử Vi', 'mieu')],
        bodyPalaceId: 'thienDi',
      }),
    },
    {
      category: 'satPhaTham',
      marker: 'Sát Phá Tham',
      chart: makeChartFixture({ majorStars: [makeStar('Thất Sát', 'ham')] }),
    },
  ];

  const QUOTE_CHARTS: ReadonlyArray<readonly [string, ZiweiChart]> = [
    ['full chart', fullChart],
    ['minimal chart', minimalChart],
    ['missing heavenPlate', missingHeavenPlateChart],
    ...TONE_FIXTURES.map(({ tone, chart }) => [tone, chart] as const),
    ...CATEGORY_FIXTURES.map(({ category, chart }) => [category, chart] as const),
  ];

  it.each([
    ['full chart', fullChart],
    ['minimal chart', minimalChart],
    ['missing heavenPlate', missingHeavenPlateChart],
  ] as const)('có khẩu khí không rỗng cho %s', (_label, chart) => {
    const summary = generatePersonalSummary(chart);

    expect(summary.conclusionQuote.trim().length).toBeGreaterThan(0);
    expect(['high', 'balanced', 'challenging']).toContain(summary.conclusionTone);
  });

  it.each(TONE_FIXTURES)('sắc thái $tone khớp với cách tính', ({ tone, chart }) => {
    const summary = generatePersonalSummary(chart);

    expect(summary.conclusionTone).toBe(tone);
    expect(EXPECTED_QUOTES[tone]).toContain(summary.conclusionQuote);
  });

  it('ổn định khi gọi lại với cùng một lá số', () => {
    const first = generatePersonalSummary(fullChart);
    const second = generatePersonalSummary(fullChart);

    expect(second.conclusionQuote).toBe(first.conclusionQuote);
    expect(second.conclusionTone).toBe(first.conclusionTone);
  });

  it.each(CATEGORY_FIXTURES)('chọn đúng nhóm khẩu khí $category', ({ category, marker, chart }) => {
    const summary = generatePersonalSummary(chart);

    expect(EXPECTED_QUOTES[category]).toContain(summary.conclusionQuote);
    expect(summary.conclusionQuote).toContain(marker);
  });

  it.each(QUOTE_CHARTS)('khẩu khí của %s đúng chuẩn nội dung', (_label, chart) => {
    const quote = generatePersonalSummary(chart).conclusionQuote;

    expect(quote.length).toBeLessThanOrEqual(100);
    expect(quote).not.toMatch(/\d/);
    for (const phrase of FATALISTIC_PHRASES) {
      expect(quote.toLowerCase()).not.toContain(phrase);
    }
  });

  it('mọi lá số trong bộ fixture đều có khẩu khí hợp lệ', () => {
    const engine = createChartEngine();

    for (const fixture of ALL_FIXTURES) {
      const chart = engine.generateChart(fixture.birthInfo as BirthInfo);
      const summary = generatePersonalSummary(chart);

      expect(summary.conclusionQuote.trim(), fixture.id).not.toBe('');
      expect(summary.conclusionQuote.length, fixture.id).toBeLessThanOrEqual(100);
      expect(summary.conclusionQuote, fixture.id).not.toMatch(/\d/);
      expect(['high', 'balanced', 'challenging'], fixture.id).toContain(summary.conclusionTone);
    }
  });
});
