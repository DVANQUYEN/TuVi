import { describe, it, expect } from 'vitest';
import { buildTopicConclusion, interpretByTopic, type Topic } from '../topic-interpretation';
import { TOPIC_CONCLUSIONS } from '../data/topic-conclusions';
import { MAJOR_STAR_IDS } from '../../types/enums';
import type {
  BrightnessLevel,
  MutagenType,
  Palace,
  PalaceId,
  Star,
  StarCategory,
} from '../../types';
import type { BirthInfo } from '../../types/input';
import { createChartEngine } from '@/lib/ziwei/engine';

const TOPICS: readonly Topic[] = ['career', 'love', 'wealth', 'health'];

const TOPIC_PALACE: Readonly<Record<Topic, { id: PalaceId; name: string }>> = {
  career: { id: 'quanLoc', name: 'Quan Lộc' },
  love: { id: 'phuThe', name: 'Phu Thê' },
  wealth: { id: 'taiBach', name: 'Tài Bạch' },
  health: { id: 'tatAch', name: 'Tật Ách' },
};

const BRIGHTNESS_LABELS: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu',
  vuong: 'Vượng',
  dac: 'Đắc',
  binh: 'Bình',
  ham: 'Hãm',
};

const FORBIDDEN_PHRASES = [
  'cổ thư',
  'nguyên văn',
  'sách cổ',
  'thiên định',
  'chắc chắn',
  'tuyệt đối',
  'định mệnh',
  'nghèo hèn',
  'chết',
] as const;

const REPRESENTATIVE_STARS = [
  { id: 'tuVi', name: 'Tử Vi' },
  { id: 'thamLang', name: 'Tham Lang' },
  { id: 'cuMon', name: 'Cự Môn' },
  { id: 'phaQuan', name: 'Phá Quân' },
] as const;

interface PalaceOptions {
  id: PalaceId;
  name?: string;
  majorStars?: Star[];
  auspiciousStars?: Star[];
  maleficStars?: Star[];
  otherStars?: Star[];
}

function makeStar(overrides: Partial<Star> & Pick<Star, 'id' | 'name'>): Star {
  return {
    category: 'major',
    element: 'kim',
    nature: 'trung',
    ...overrides,
  };
}

function makeMinorStar(
  id: string,
  name: string,
  options: { mutagen?: MutagenType; category?: StarCategory } = {}
): Star {
  return makeStar({
    id,
    name,
    category: options.category ?? (options.mutagen ? 'tuHoa' : 'phuTinh'),
    mutagen: options.mutagen,
  });
}

function makePalace(options: PalaceOptions): Palace {
  return {
    index: 0,
    id: options.id,
    name: options.name ?? options.id,
    stem: 'giap',
    branch: 'ty',
    element: 'moc',
    isBodyPalace: false,
    isOriginalPalace: false,
    majorStars: options.majorStars ?? [],
    auspiciousStars: options.auspiciousStars ?? [],
    maleficStars: options.maleficStars ?? [],
    otherStars: options.otherStars ?? [],
    changsheng12: '',
    boshi12: '',
    suiqian12: '',
    majorPeriod: { startAge: 0, endAge: 10 },
    minorPeriodAges: [],
    hasTuan: false,
    hasTriet: false,
    tuanTrietRole: { tuan: null, triet: null },
  };
}

function makeMajorPalace(
  topic: Topic,
  star: { id: string; name: string },
  brightness: BrightnessLevel = 'mieu'
): Palace {
  const topicPalace = TOPIC_PALACE[topic];
  return makePalace({
    id: topicPalace.id,
    name: topicPalace.name,
    majorStars: [makeStar({ id: star.id, name: star.name, brightness })],
  });
}

interface SpecialSignalFixture {
  topic: Topic;
  label: string;
  majorId: string;
  majorName: string;
  signalId: string;
  extra?: Star;
}

const SPECIAL_FIXTURES: readonly SpecialSignalFixture[] = [
  {
    topic: 'career',
    label: 'Văn Xương',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'vanXuong',
    extra: makeMinorStar('vanXuong', 'Văn Xương'),
  },
  {
    topic: 'career',
    label: 'Văn Khúc',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'vanKhuc',
    extra: makeMinorStar('vanKhuc', 'Văn Khúc'),
  },
  {
    topic: 'career',
    label: 'Tả Phù',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'taPhu',
    extra: makeMinorStar('taPhu', 'Tả Phù'),
  },
  {
    topic: 'career',
    label: 'Hữu Bật',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'huuBat',
    extra: makeMinorStar('huuBat', 'Hữu Bật'),
  },
  {
    topic: 'career',
    label: 'Hóa Kỵ',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hoaKy',
    extra: makeMinorStar('hoaKy', 'Hóa Kỵ', { mutagen: 'hoaKy' }),
  },
  {
    topic: 'love',
    label: 'Đào Hoa',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'daoHoa',
    extra: makeMinorStar('daoHoa', 'Đào Hoa'),
  },
  {
    topic: 'love',
    label: 'Hồng Loan',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hongLoan',
    extra: makeMinorStar('hongLoan', 'Hồng Loan'),
  },
  {
    topic: 'love',
    label: 'Cô Thần',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'coThan',
    extra: makeMinorStar('coThan', 'Cô Thần'),
  },
  {
    topic: 'love',
    label: 'Quả Tú',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'quaTu',
    extra: makeMinorStar('quaTu', 'Quả Tú'),
  },
  {
    topic: 'love',
    label: 'Tả Phù',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'taPhu',
    extra: makeMinorStar('taPhu', 'Tả Phù'),
  },
  {
    topic: 'love',
    label: 'Hữu Bật',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'huuBat',
    extra: makeMinorStar('huuBat', 'Hữu Bật'),
  },
  {
    topic: 'love',
    label: 'Hóa Kỵ',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hoaKy',
    extra: makeMinorStar('hoaKy', 'Hóa Kỵ', { mutagen: 'hoaKy' }),
  },
  {
    topic: 'wealth',
    label: 'Lộc Tồn',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'locTon',
    extra: makeMinorStar('locTon', 'Lộc Tồn'),
  },
  {
    topic: 'wealth',
    label: 'Địa Không',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'diaKhong',
    extra: makeMinorStar('diaKhong', 'Địa Không'),
  },
  {
    topic: 'wealth',
    label: 'Địa Kiếp',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'diaKiep',
    extra: makeMinorStar('diaKiep', 'Địa Kiếp'),
  },
  {
    topic: 'wealth',
    label: 'Hóa Lộc',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hoaLoc',
    extra: makeMinorStar('hoaLoc', 'Hóa Lộc', { mutagen: 'hoaLoc' }),
  },
  {
    topic: 'wealth',
    label: 'Hóa Kỵ',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hoaKy',
    extra: makeMinorStar('hoaKy', 'Hóa Kỵ', { mutagen: 'hoaKy' }),
  },
  {
    topic: 'health',
    label: 'Kình Dương',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'kinhDuong',
    extra: makeMinorStar('kinhDuong', 'Kình Dương'),
  },
  {
    topic: 'health',
    label: 'Đà La',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'daLa',
    extra: makeMinorStar('daLa', 'Đà La'),
  },
  {
    topic: 'health',
    label: 'Hỏa Tinh',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'hoaTinh',
    extra: makeMinorStar('hoaTinh', 'Hỏa Tinh'),
  },
  {
    topic: 'health',
    label: 'Linh Tinh',
    majorId: 'tuVi',
    majorName: 'Tử Vi',
    signalId: 'linhTinh',
    extra: makeMinorStar('linhTinh', 'Linh Tinh'),
  },
  {
    topic: 'health',
    label: 'Thiên Lương',
    majorId: 'thienLuong',
    majorName: 'Thiên Lương',
    signalId: 'thienLuong',
  },
];

function makeSpecialPalace(
  fixture: SpecialSignalFixture,
  brightness: BrightnessLevel = 'mieu'
): Palace {
  return makePalace({
    id: 'menh',
    majorStars: [makeStar({ id: fixture.majorId, name: fixture.majorName, brightness })],
    otherStars: fixture.extra ? [fixture.extra] : [],
  });
}

function expectedSpecialQuote(fixture: SpecialSignalFixture): string {
  const config = TOPIC_CONCLUSIONS[fixture.topic];
  const entry = config.special.find((item) => item.stars.includes(fixture.signalId));
  if (!entry) {
    throw new Error(`Thiếu cấu hình special cho ${fixture.topic}/${fixture.signalId}`);
  }
  return entry.quote;
}

function allConclusionQuotes(): string[] {
  const quotes: string[] = [];

  for (const topic of TOPICS) {
    const config = TOPIC_CONCLUSIONS[topic];
    quotes.push(
      ...Object.values(config.byStar),
      config.noMajor,
      config.ham,
      config.fallback,
      ...config.special.map((entry) => entry.quote)
    );
  }

  return quotes;
}

const BIRTH_INFO: BirthInfo = {
  name: 'Topic conclusion test',
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  location: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

describe('TOPIC_CONCLUSIONS - cấu trúc dữ liệu', () => {
  for (const topic of TOPICS) {
    it(`${topic}: đủ 14 chính tinh, câu riêng không rỗng và không trùng`, () => {
      const config = TOPIC_CONCLUSIONS[topic];

      expect(Object.keys(config.byStar).sort()).toEqual([...MAJOR_STAR_IDS].sort());

      const quotes = MAJOR_STAR_IDS.map((starId) => config.byStar[starId]);
      for (const [index, quote] of quotes.entries()) {
        expect(quote, `${topic}/${MAJOR_STAR_IDS[index]}`).toBeTruthy();
        expect(quote.trim(), `${topic}/${MAJOR_STAR_IDS[index]}`).not.toBe('');
      }
      expect(new Set(quotes).size).toBe(MAJOR_STAR_IDS.length);
    });
  }
});

describe('buildTopicConclusion - kết luận và cơ sở', () => {
  for (const topic of TOPICS) {
    it(`${topic}: mọi chủ đề có câu kết luận và cơ sở gồm cung, chính tinh, độ sáng`, () => {
      const star = { id: 'tuVi', name: 'Tử Vi' };
      const palace = makeMajorPalace(topic, star, 'mieu');
      const result = buildTopicConclusion(topic, palace);

      expect(result.quote.trim()).not.toBe('');
      expect(result.basis).toContain(`Cung ${TOPIC_PALACE[topic].name}`);
      expect(result.basis).toContain(star.name);
      expect(result.basis).toContain(`(${BRIGHTNESS_LABELS.mieu})`);
    });
  }

  for (const topic of TOPICS) {
    it(`${topic}: câu kết luận riêng cho từng chính tinh đại diện và khác nhau giữa các sao`, () => {
      const quotes = new Set<string>();

      for (const star of REPRESENTATIVE_STARS) {
        const palace = makeMajorPalace(topic, star, 'mieu');
        const { quote } = buildTopicConclusion(topic, palace);

        expect(quote).toBe(TOPIC_CONCLUSIONS[topic].byStar[star.id]);
        expect(quote.trim()).not.toBe('');
        quotes.add(quote);
      }

      expect(quotes.size).toBe(REPRESENTATIVE_STARS.length);
    });
  }

  it('ổn định khi gọi lặp lại với cùng một cung', () => {
    const palace = makeMajorPalace('career', { id: 'tuVi', name: 'Tử Vi' }, 'vuong');
    const first = buildTopicConclusion('career', palace);

    for (let index = 0; index < 5; index += 1) {
      expect(buildTopicConclusion('career', palace)).toEqual(first);
    }
  });

  it('mọi chủ đề luôn có câu kết luận với mọi dạng cung', () => {
    const palaces: Array<Palace | undefined> = [
      undefined,
      makePalace({ id: 'menh' }),
      makePalace({ id: 'menh', majorStars: [makeStar({ id: 'tuVi', name: 'Tử Vi' })] }),
      makePalace({
        id: 'menh',
        majorStars: [makeStar({ id: 'tuVi', name: 'Tử Vi', brightness: 'ham' })],
      }),
      makePalace({
        id: 'menh',
        majorStars: [
          makeStar({ id: 'khongXacDinh', name: 'Sao Không Xác Định', brightness: 'binh' }),
        ],
      }),
    ];

    for (const topic of TOPICS) {
      for (const palace of palaces) {
        const { quote } = buildTopicConclusion(topic, palace);
        expect(quote.trim(), `${topic}/${palace?.id ?? 'undefined'}`).not.toBe('');
      }
    }
  });
});

describe('buildTopicConclusion - ưu tiên tín hiệu đặc biệt', () => {
  for (const fixture of SPECIAL_FIXTURES) {
    it(`${fixture.topic}: ${fixture.label} được ưu tiên hơn câu theo chính tinh`, () => {
      const config = TOPIC_CONCLUSIONS[fixture.topic];
      const { quote } = buildTopicConclusion(fixture.topic, makeSpecialPalace(fixture));

      expect(quote).toBe(expectedSpecialQuote(fixture));
      expect(quote).not.toBe(config.byStar[fixture.majorId]);
      expect(quote).not.toBe(config.ham);
      expect(quote).not.toBe(config.fallback);
    });
  }

  for (const topic of TOPICS) {
    it(`${topic}: tín hiệu đặc biệt được ưu tiên trước thế Hãm`, () => {
      const fixture = SPECIAL_FIXTURES.find(
        (item) => item.topic === topic && item.majorId === 'tuVi'
      );
      expect(fixture).toBeDefined();

      const { quote } = buildTopicConclusion(topic, makeSpecialPalace(fixture!, 'ham'));

      expect(quote).toBe(expectedSpecialQuote(fixture!));
      expect(quote).not.toBe(TOPIC_CONCLUSIONS[topic].ham);
    });
  }

  for (const topic of TOPICS) {
    it(`${topic}: Vô Chính Diệu được ưu tiên trước tín hiệu đặc biệt`, () => {
      const fixture = SPECIAL_FIXTURES.find((item) => item.topic === topic && item.extra);
      expect(fixture).toBeDefined();

      const palace = makePalace({ id: 'menh', otherStars: [fixture!.extra!] });
      const { quote, basis } = buildTopicConclusion(topic, palace);

      expect(quote).toBe(TOPIC_CONCLUSIONS[topic].noMajor);
      expect(basis).toContain('Vô Chính Diệu');
    });
  }
});

describe('buildTopicConclusion - các nhánh dự phòng', () => {
  for (const topic of TOPICS) {
    it(`${topic}: dùng câu Hãm khi chính tinh Hãm không có tín hiệu đặc biệt`, () => {
      const palace = makeMajorPalace(topic, { id: 'tuVi', name: 'Tử Vi' }, 'ham');
      expect(buildTopicConclusion(topic, palace).quote).toBe(TOPIC_CONCLUSIONS[topic].ham);
    });

    it(`${topic}: dùng câu Vô Chính Diệu khi cung không có chính tinh`, () => {
      const palace = makePalace({ id: 'menh' });
      const { quote, basis } = buildTopicConclusion(topic, palace);

      expect(quote).toBe(TOPIC_CONCLUSIONS[topic].noMajor);
      expect(basis).toContain('Vô Chính Diệu');
    });

    it(`${topic}: dùng câu dự phòng khi chính tinh không có trong bảng`, () => {
      const palace = makePalace({
        id: 'menh',
        majorStars: [
          makeStar({ id: 'khongXacDinh', name: 'Sao Không Xác Định', brightness: 'binh' }),
        ],
      });
      const { quote, basis } = buildTopicConclusion(topic, palace);

      expect(quote).toBe(TOPIC_CONCLUSIONS[topic].fallback);
      expect(basis).toContain('Sao Không Xác Định');
    });

    it(`${topic}: dùng câu dự phòng và cơ sở rỗng khi không có cung chủ đề`, () => {
      const result = buildTopicConclusion(topic, undefined);

      expect(result.quote).toBe(TOPIC_CONCLUSIONS[topic].fallback);
      expect(result.basis).toBe('');
    });
  }
});

describe('interpretByTopic - tích hợp với lá số thật', () => {
  const chart = createChartEngine().generateChart(BIRTH_INFO);

  for (const topic of TOPICS) {
    it(`${topic}: luận giải có kết luận và cơ sở khớp cung chủ đề`, () => {
      const result = interpretByTopic(chart, topic);
      const palace = chart.palaces.find((item) => item.id === TOPIC_PALACE[topic].id);

      expect(palace).toBeDefined();
      expect(result.conclusion.trim()).not.toBe('');
      expect(result.conclusionBasis).toContain(`Cung ${palace!.name}`);

      if (palace!.majorStars.length === 0) {
        expect(result.conclusionBasis).toContain('Vô Chính Diệu');
      } else {
        for (const star of palace!.majorStars) {
          expect(result.conclusionBasis).toContain(star.name);
          if (star.brightness) {
            expect(result.conclusionBasis).toContain(BRIGHTNESS_LABELS[star.brightness]);
          }
        }
      }
    });
  }
});

describe('chất lượng câu kết luận', () => {
  const quotes = allConclusionQuotes();

  it('có đủ 82 câu: 56 câu theo sao, 12 câu nhánh, 14 câu tín hiệu', () => {
    expect(quotes).toHaveLength(82);
  });

  it('không rỗng và dài tối đa 100 ký tự (mục tiêu ≤ 70)', () => {
    for (const quote of quotes) {
      expect(quote.trim(), quote).not.toBe('');
      expect(quote.length, quote).toBeLessThanOrEqual(100);
    }

    const maxLength = Math.max(...quotes.map((quote) => quote.length));
    expect(maxLength).toBeLessThanOrEqual(70);
  });

  it('không chứa số điểm hay số liệu', () => {
    for (const quote of quotes) {
      expect(quote, quote).not.toMatch(/[0-9]/);
    }
  });

  it('không gán trích dẫn cổ thư, khẳng định tuyệt đối hay định mệnh', () => {
    for (const quote of quotes) {
      const normalized = quote.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        expect(normalized, `${phrase} trong: ${quote}`).not.toContain(phrase);
      }
    }
  });
});
