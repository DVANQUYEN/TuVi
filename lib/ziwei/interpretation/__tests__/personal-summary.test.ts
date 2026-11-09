import { describe, it, expect } from 'vitest';
import { generatePersonalSummary } from '../personal-summary';
import type { BirthInfo, BrightnessLevel, Palace, PalaceId, Star, ZiweiChart } from '../../types';
import { createChartEngine } from '@/lib/ziwei/engine';
import { ALL_FIXTURES } from '../../__tests__/golden/fixtures';

const MAJOR_STARS = [
  'Tử Vi',
  'Thiên Phủ',
  'Thái Dương',
  'Thái Âm',
  'Vũ Khúc',
  'Liêm Trinh',
  'Tham Lang',
  'Cự Môn',
  'Thiên Cơ',
  'Thiên Đồng',
  'Thiên Tướng',
  'Thiên Lương',
  'Thất Sát',
  'Phá Quân',
] as const;

const TOP_NARRATIVE_KEYS = ['introParagraph', 'menhStarParagraph'] as const;

const TECHNICAL_JARGON = [
  'nạp âm',
  'Cục',
  'Mệnh sinh Cục',
  'Tam hợp',
  'Tài Bạch',
  'Quan Lộc',
  'cung Thân',
  'Đắc địa',
  'Hãm địa',
  'cát tinh',
  'hung tinh',
  'Tứ Hóa',
  'Tuần',
  'Triệt',
] as const;

const OWNER_NAME = 'Đương số kiểm thử';

function makeChart(starNames: readonly string[]): ZiweiChart {
  return {
    heavenPlate: { name: OWNER_NAME },
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
  it.each(MAJOR_STARS)('tạo kết luận phù hợp cho %s', (starName) => {
    const summary = generatePersonalSummary(makeChart([starName]));

    expect(summary.ownerName).toBe(OWNER_NAME);
    expect(summary.starName).toBe(starName);
    expect(summary.headline.trim().length).toBeGreaterThan(0);
    expect(summary.headline).not.toContain('Bạn là người');
    expect(summary.description.trim().length).toBeGreaterThan(0);
    expect(summary.introParagraph?.startsWith('Người mang mệnh')).toBe(true);
    expect(summary.menhStarParagraph?.trim().length).toBeGreaterThan(0);
    expect(summary.menhStarParagraph?.startsWith('Bạn')).toBe(true);
    expect(summary.tamHopAndThanParagraph).toBe('');
    expect(summary.conclusionParagraph).toBe('');
    for (const key of TOP_NARRATIVE_KEYS) {
      expect(summary[key]?.trim().length ?? 0, `${starName} thiếu ${key}`).toBeGreaterThan(0);
    }
    expect(summary.description).toBe(
      [summary.introParagraph, summary.menhStarParagraph].join(' ')
    );
    expect(summary.keyTraits.length).toBeGreaterThanOrEqual(3);
    expect(summary.keyTraits.length).toBeLessThanOrEqual(5);
    expect(summary.lifePath.trim().length).toBeGreaterThan(0);
  });

  it('dùng kết luận mặc định khi cung Mệnh Vô Chính Diệu', () => {
    const summary = generatePersonalSummary(makeChart([]));

    expect(summary.starName).toBe('Vô Chính Diệu');
    expect(summary.headline.trim().length).toBeGreaterThan(0);
    expect(summary.headline).not.toContain('Bạn là người');
    expect(summary.introParagraph?.startsWith('Người mang mệnh')).toBe(true);
    expect(summary.menhStarParagraph?.trim().length).toBeGreaterThan(0);
    expect(summary.tamHopAndThanParagraph).toBe('');
    expect(summary.conclusionParagraph).toBe('');
    expect(summary.keyTraits).toHaveLength(4);
    expect(summary.lifePath.trim().length).toBeGreaterThan(0);
  });

  it('dùng cùng kết luận mặc định khi không xác định được chính tinh', () => {
    const empty = generatePersonalSummary(makeChart([]));
    const unknown = generatePersonalSummary(makeChart(['Sao Không Xác Định']));

    expect(unknown.headline).toBe(empty.headline);
    expect(unknown.description).toBe(empty.description);
    expect(unknown.lifePath).toBe(empty.lifePath);
    expect(unknown.starName).toBe('Sao Không Xác Định');
    expect(empty.starName).toBe('Vô Chính Diệu');
  });

  it('đặt headline khác nhau cho 14 chính tinh và fallback', () => {
    const charts = [...MAJOR_STARS.map((starName) => makeChart([starName])), makeChart([])];
    const headlines = charts.map((chart) => generatePersonalSummary(chart).headline);

    expect(headlines).toHaveLength(MAJOR_STARS.length + 1);
    expect(new Set(headlines).size).toBe(headlines.length);
    for (const headline of headlines) {
      expect(headline).not.toContain('Bạn là người');
    }
  });

  it('không dùng thuật ngữ kỹ thuật trong các đoạn luận giải', () => {
    const charts = [...MAJOR_STARS.map((starName) => makeChart([starName])), makeChart([])];

    for (const chart of charts) {
      const summary = generatePersonalSummary(chart);
      for (const key of TOP_NARRATIVE_KEYS) {
        const paragraph = summary[key] ?? '';
        for (const term of TECHNICAL_JARGON) {
          expect(paragraph, `${key} không được chứa "${term}"`).not.toContain(term);
        }
      }
    }
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

  it('có đủ hai đoạn luận giải cấp cao, các đoạn còn lại rỗng và không lặp description', () => {
    const summary = generatePersonalSummary(chart);

    expect(summary.ownerName).toBe('Đương số kiểm thử');
    expect(summary.starName?.trim().length).toBeGreaterThan(0);
    expect(summary.introParagraph?.startsWith('Người mang mệnh')).toBe(true);
    expect(summary.introParagraph).not.toContain(chart.heavenPlate.napAm.name);
    expect(summary.introParagraph).not.toContain(chart.heavenPlate.yinYangGenderLabel);
    expect(chart.palaces.find((p) => p.id === 'menh')).toBeDefined();
    expect(summary.menhStarParagraph?.trim().length).toBeGreaterThan(0);
    expect(summary.menhStarParagraph?.startsWith('Bạn')).toBe(true);
    expect(summary.tamHopAndThanParagraph).toBe('');
    expect(summary.conclusionParagraph).toBe('');

    const topNarrative = [
      summary.introParagraph as string,
      summary.menhStarParagraph as string,
    ];
    expect(summary.description).toBe(topNarrative.join(' '));
    for (const paragraph of topNarrative) {
      expect(summary.description.split(paragraph)).toHaveLength(2);
    }
    expect(summary.description).not.toContain('Nhìn tổng thể');
  });

  it('tách riêng khối luận giải kỹ thuật dạng đoạn văn cho lá số đầy đủ', () => {
    const summary = generatePersonalSummary(chart);
    const technicalParagraphs = summary.technicalParagraphs ?? [];
    const technicalText = technicalParagraphs.join(' ');

    expect(technicalParagraphs.length).toBeGreaterThanOrEqual(3);
    for (const term of ['nạp âm', 'Cục', 'Cung Mệnh', 'Tam Hợp']) {
      expect.soft(technicalText, `khối kỹ thuật thiếu "${term}"`).toContain(term);
    }
    expect(technicalText).not.toContain('Lá số của');

    expect(chart.heavenPlate.napAm.name).toBe('Lộ Bàng Thổ');
    const technicalIntro = technicalParagraphs[0];
    expect(technicalIntro).toContain('Lộ Bàng Thổ');
    expect(technicalIntro).toContain('(đất ven đường)');

    const technicalConclusion = technicalParagraphs[technicalParagraphs.length - 1];
    expect(technicalConclusion.startsWith('Xét riêng cung Mệnh')).toBe(true);
    expect(technicalConclusion).toContain('Khái quát lá số');
  });
});

type ExpectedTone = 'high' | 'balanced' | 'challenging';
type ExpectedQuoteCategory = ExpectedTone | 'voChinhDieu' | 'thanCuThienDi' | 'satPhaTham';

/** Bảng khẩu khí kỳ vọng, sao chép từ nguồn để kiểm tra đúng nhóm được chọn. */
const EXPECTED_QUOTES: Readonly<Record<ExpectedQuoteCategory, readonly string[]>> = {
  high: [
    'Phúc lộc có lúc đến, biết nắm thời và giữ đức thì đường dài mới vững.',
    'Phúc trạch sâu dày là nền, song quý nhân chỉ đến khi mình biết tạo duyên.',
    'Mệnh đắc chính tinh, vận trình thuận hơn, song hậu vận an khang còn tùy sức giữ.',
    'Khí chất đường hoàng dễ tạo thiện cảm; tài lộc và gia đạo còn tùy cách vun vén.',
    'Căn cơ vững chắc, gặp thời thì phát, giữ đức thì bền lâu.',
    'Sao sáng chiếu mệnh mở nhiều cơ duyên, càng về sau càng cần biết giữ nhịp.',
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
    'Mệnh vô chính diệu, nên linh hoạt tùy thế, mượn sức tam phương mà định hướng.',
    'Mệnh vô chính diệu, tiền vận nhiều phen thử sức, hậu vận vững vàng nếu biết bền chí.',
    'Mệnh vô chính diệu, linh hoạt ứng biến, mở lòng học hỏi thì dễ gặp người nâng đỡ.',
    'Mệnh vô chính diệu, chẳng nên thủ cựu, biết tùy duyên mà lập nghiệp thì về sau yên ổn.',
    'Mệnh vô chính diệu, lấy tam phương chiếu về làm chỗ dựa, bền chí thì dần vững.',
  ],
  thanCuThienDi: [
    'Thân cư Thiên Di, bôn ba bốn bể, hậu vận an yên nếu biết giữ gốc gia đạo.',
    'Thân cư Thiên Di, đi xa mở được cơ duyên nếu biết giữ mình và kết giao.',
    'Thân cư Thiên Di, nửa đời lưu động, đổi thay là lẽ thường, giữ tâm thì dần vững.',
    'Thân cư Thiên Di, lấy phương xa làm đất dụng võ, giữ tâm vững thì đường dài hanh thông.',
    'Thân cư Thiên Di, ra ngoài lập nghiệp dễ gặp quý nhân, nhưng cần giữ gốc gia đạo.',
  ],
  satPhaTham: [
    'Sát Phá Tham hội hợp, khí phách mạnh mẽ, thăng trầm bất định, tiết chế thì giữ được thành quả.',
    'Sát Phá Tham hội hợp, trải sóng gió có thể mở rộng cơ nghiệp nếu biết giữ nhịp.',
    'Sát Phá Tham hội hợp, dám phá cũ lập mới, biết tiết chế thì thăng trầm hóa thành bản lĩnh.',
    'Sát Phá Tham hội hợp, tiền vận nhiều phen đổi dời, hậu vận vững vàng nếu biết tích lũy.',
    'Sát Phá Tham hội hợp, khí phách hơn người, cốt lấy nhẫn nại và chừng mực mà giữ thành quả.',
  ],
};

const FATALISTIC_PHRASES = [
  'yểu chiết',
  'chắc chắn',
  'tuyệt đối',
  'đảm bảo',
  'định mệnh',
  'phú quý',
  'cả đời',
  'thịnh vượng',
  'sung túc',
  'mãn nguyện',
  'cam kết',
  'số phận',
  'đe dọa tính mạng',
  'tai nạn nghiêm trọng',
] as const;

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
  taiBachStars?: Star[];
  quanLocStars?: Star[];
  auspiciousStars?: Star[];
  maleficStars?: Star[];
  hasTuan?: boolean;
  hasTriet?: boolean;
  bodyPalaceId?: PalaceId;
}

/** Lá số tối giản gồm cung Mệnh, tùy chọn thêm Tài Bạch, Quan Lộc và cung Thân. */
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

  if (options.taiBachStars) {
    palaces.push(
      makePalaceFixture({
        id: 'taiBach',
        index: palaces.length,
        branch: 'ngo',
        majorStars: options.taiBachStars,
      })
    );
  }

  if (options.quanLocStars) {
    palaces.push(
      makePalaceFixture({
        id: 'quanLoc',
        index: palaces.length,
        branch: 'tuat',
        majorStars: options.quanLocStars,
      })
    );
  }

  if (options.bodyPalaceId) {
    palaces.push(
      makePalaceFixture({
        id: options.bodyPalaceId,
        index: palaces.length,
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
      chart: makeChartFixture({
        // Đủ bộ Sát Phá Tham trải trên Mệnh/Tài/Quan, ít nhất 2 sao từ Bình trở lên.
        majorStars: [makeStar('Thất Sát', 'binh')],
        taiBachStars: [makeStar('Phá Quân', 'dac')],
        quanLocStars: [makeStar('Tham Lang', 'ham')],
      }),
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

  it.each(['Thất Sát', 'Phá Quân', 'Tham Lang'] as const)(
    'không chọn nhóm Sát Phá Tham khi chỉ có %s tại cung Mệnh',
    (starName) => {
      const chart = makeChartFixture({ majorStars: [makeStar(starName, 'binh')] });
      const summary = generatePersonalSummary(chart);

      expect(EXPECTED_QUOTES.satPhaTham).not.toContain(summary.conclusionQuote);
      expect(summary.conclusionQuote).not.toContain('Sát Phá Tham');
      expect(EXPECTED_QUOTES[summary.conclusionTone]).toContain(summary.conclusionQuote);
      expect(summary.conclusionTone).toBe('balanced');
    }
  );

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
