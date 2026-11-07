import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import { createChartEngine } from '@/lib/ziwei/engine';
import { ZiweiInterpreter } from '@/lib/ziwei/interpretation';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import { ChartSummary } from '../ChartSummary';
import { PalaceInterpretationList } from '../PalaceInterpretation';
import { CombinationsList } from '../CombinationsList';
import { AdviceCard } from '../AdviceCard';
import { PersonalSummaryCard } from '../PersonalSummary';
import { DecadeFortuneTimeline } from '../DecadeFortune';
import { YearlyFortuneCard } from '../YearlyFortune';
import { TimelineView } from '../Timeline';
import { TopicInterpretationTabs } from '../TopicInterpretation';
import type { TopicInterpretation } from '@/lib/ziwei/interpretation/topic-interpretation';
import { calculateDecadeFortune } from '@/lib/ziwei/interpretation/decade-fortune';
import { calculateYearlyFortune } from '@/lib/ziwei/interpretation/yearly-fortune';

const BIRTH_INFO: BirthInfo = {
  name: 'Test',
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

const chart: ZiweiChart = createChartEngine().generateChart(BIRTH_INFO);
const interpretation = new ZiweiInterpreter().interpret(chart);

function makeTopicFixture(
  overrides: Partial<TopicInterpretation> &
    Pick<TopicInterpretation, 'topic' | 'title' | 'conclusion' | 'conclusionBasis'>
): TopicInterpretation {
  return {
    overview: `Tổng quan ${overrides.title}`,
    strengths: [`Điểm mạnh ${overrides.title}`],
    challenges: [`Thách thức ${overrides.title}`],
    recommendations: [`Lời khuyên ${overrides.title}`],
    luckyYears: [2026],
    challengingYears: [2027],
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
});

describe('ChartSummary', () => {
  it('hiển thị thông tin cơ bản và các điểm khía cạnh', () => {
    render(<ChartSummary chart={chart} />);

    expect(screen.getByRole('heading', { name: /Khái quát lá số/ })).toBeInTheDocument();
    expect(screen.getByText(chart.heavenPlate.fiveElementsClass.name)).toBeInTheDocument();
    expect(screen.getByText(chart.heavenPlate.soulLord)).toBeInTheDocument();
    expect(screen.getByText(chart.heavenPlate.bodyLord)).toBeInTheDocument();

    const meters = screen.getAllByRole('meter');
    expect(meters).toHaveLength(4);
    for (const meter of meters) {
      const value = Number(meter.getAttribute('aria-valuenow'));
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
  });
});

describe('PalaceInterpretationList', () => {
  it('mở cung Mệnh mặc định và đóng/mở accordion bằng nút', () => {
    render(<PalaceInterpretationList chart={chart} interpretations={interpretation.palaces} />);

    const menhPalace = chart.palaces.find((p) => p.id === 'menh')!;
    const menhButton = screen.getByRole('button', { name: new RegExp(menhPalace.name) });
    expect(menhButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: new RegExp(menhPalace.name) })).toBeInTheDocument();

    const quanLoc = chart.palaces.find((p) => p.id === 'quanLoc')!;
    const quanLocButton = screen.getByRole('button', { name: new RegExp(quanLoc.name) });
    expect(quanLocButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(quanLocButton);
    expect(quanLocButton).toHaveAttribute('aria-expanded', 'true');
    expect(menhButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(quanLocButton);
    expect(quanLocButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region', { name: new RegExp(quanLoc.name) })).toBeNull();
  });

  it('hiển thị đủ 12 nút accordion', () => {
    render(<PalaceInterpretationList chart={chart} interpretations={interpretation.palaces} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(12);
  });
});

describe('CombinationsList', () => {
  it('không render gì khi không có cách cục', () => {
    const { container } = render(<CombinationsList combinations={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('nhóm cách cục theo mức độ tốt/xấu/trung bình', () => {
    render(
      <CombinationsList
        combinations={[
          { id: 'a', name: 'Cách A', meaning: 'Ý A', condition: { stars: [] }, level: 'tốt' },
          { id: 'b', name: 'Cách B', meaning: 'Ý B', condition: { stars: [] }, level: 'xấu' },
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: /Cách cục thuận lợi \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cách cục cần lưu tâm \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cách A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cách B' })).toBeInTheDocument();
  });
});

describe('AdviceCard', () => {
  it('hiển thị lời khuyên', () => {
    render(<AdviceCard advice="Giữ vững tinh thần" />);
    const section = screen.getByRole('region', { name: /Lời khuyên cho đương số/ });
    expect(within(section).getByText('Giữ vững tinh thần')).toBeInTheDocument();
  });
});

describe('PersonalSummaryCard', () => {
  it('hiển thị headline, mô tả, đặc điểm và con đường phù hợp', () => {
    render(
      <PersonalSummaryCard
        summary={{
          headline: 'Ngọn đèn không cần phô bày',
          description: 'Bạn có tố chất lãnh đạo và tầm nhìn xa.',
          keyTraits: ['Quyết đoán', 'Tầm nhìn xa'],
          lifePath: 'Lãnh đạo, quản lý',
        }}
      />
    );

    expect(screen.getByRole('heading', { name: /Luận giải/ })).toBeInTheDocument();
    expect(screen.getByText('Ngọn đèn không cần phô bày')).toBeInTheDocument();
    expect(screen.getByText('Bạn có tố chất lãnh đạo và tầm nhìn xa.')).toBeInTheDocument();
    expect(screen.getByText('Quyết đoán')).toBeInTheDocument();
    expect(screen.getByText('Tầm nhìn xa')).toBeInTheDocument();
    expect(screen.getByText('Lãnh đạo, quản lý')).toBeInTheDocument();
  });

  it('hiển thị các đoạn luận giải chi tiết, nhãn Mệnh và khối kỹ thuật', () => {
    const { container } = render(
      <PersonalSummaryCard
        summary={{
          ownerName: 'Nguyễn A',
          headline: 'Ngọn đèn không cần phô bày',
          description: 'Mô tả dự phòng',
          keyTraits: ['Quyết đoán'],
          lifePath: 'Lãnh đạo, quản lý',
          starName: 'Tử Vi',
          introParagraph:
            'Trong mỗi người đều có một **nhịp đi riêng**, thứ thường hiện ra trước khi ta kịp gọi tên nó.',
          menhStarParagraph:
            'Bạn giống một **dòng nước ngầm**, lặng mà vẫn soi rõ những điều người khác bỏ qua.',
          tamHopAndThanParagraph:
            'Về nửa sau cuộc đời, trọng tâm có xu hướng nghiêng về **bản thân và việc tự lập nghiệp**.',
          conclusionParagraph: '',
          technicalParagraphs: [
            'Bạn thuộc Âm Nam, Bản Mệnh Nạp Âm là Kim Tứ Cục.',
            'Cung Mệnh tọa Tý, có chính tinh Tử Vi (Miếu địa). Tam Hợp Mệnh - Tài Bạch - Quan Lộc hội tụ cách Tử Phủ Vũ Tướng.',
          ],
        }}
      />
    );

    expect(screen.queryByText(/Lá số của/)).not.toBeInTheDocument();
    expect(screen.queryByText('Mô tả dự phòng')).not.toBeInTheDocument();
    expect(screen.getByText('Mệnh Tử Vi')).toBeInTheDocument();
    expect(screen.getByText(/nửa sau cuộc đời/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Luận giải chi tiết' })).toBeInTheDocument();

    const technical = screen.getByTestId('personal-summary-technical');
    expect(within(technical).getByText(/Nạp Âm/)).toBeInTheDocument();
    expect(within(technical).getByText(/Cung Mệnh tọa Tý/)).toBeInTheDocument();

    const emphasized = Array.from(container.querySelectorAll('strong')).map(
      (node) => node.textContent
    );
    expect(emphasized).toEqual([
      'nhịp đi riêng',
      'dòng nước ngầm',
      'bản thân và việc tự lập nghiệp',
    ]);
    expect(container.textContent).not.toContain('**');
  });

  it('hiển thị khẩu khí sau headline, trước luận giải, kèm nháy kép và data-tone', () => {
    const quote = 'Sóng gió là thử thách để tôi luyện; giữ tâm vững thì hậu vận an khang.';
    render(
      <PersonalSummaryCard
        summary={{
          ownerName: 'Nguyễn A',
          headline: 'Ngọn đèn không cần phô bày',
          description: 'Mô tả dự phòng',
          keyTraits: ['Quyết đoán'],
          lifePath: 'Lãnh đạo, quản lý',
          introParagraph:
            'Trong mỗi người đều có một **nhịp đi riêng**, thứ thường hiện ra trước khi ta kịp gọi tên nó.',
          tamHopAndThanParagraph:
            'Về nửa sau cuộc đời, trọng tâm có xu hướng nghiêng về **bản thân và việc tự lập nghiệp**.',
          conclusionQuote: quote,
          conclusionTone: 'challenging',
        }}
      />
    );

    const heading = screen.getByRole('heading', { name: /Luận giải/ });
    const headline = screen.getByText('Ngọn đèn không cần phô bày');
    const banner = screen.getByTestId('personal-summary-conclusion');
    const narrative = screen.getByText(/nửa sau cuộc đời/);

    expect(banner).toHaveAttribute('data-tone', 'challenging');
    expect(banner.textContent).toBe(`“${quote}”`);
    expect(banner.textContent?.startsWith('“')).toBe(true);
    expect(banner.textContent?.endsWith('”')).toBe(true);
    expect(banner.textContent?.trim().length).toBeGreaterThan(2);

    expect(
      heading.compareDocumentPosition(headline) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      headline.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      banner.compareDocumentPosition(narrative) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('không crash và không render banner với summary cũ thiếu khẩu khí', () => {
    render(
      <PersonalSummaryCard
        summary={{
          headline: 'Ngọn đèn không cần phô bày',
          description: 'Mô tả dự phòng',
          keyTraits: ['Quyết đoán'],
          lifePath: 'Lãnh đạo, quản lý',
        }}
      />
    );

    expect(screen.queryByTestId('personal-summary-conclusion')).toBeNull();
    expect(screen.getByText('Mô tả dự phòng')).toBeInTheDocument();
  });
});

describe('TopicInterpretationTabs', () => {
  const topics: TopicInterpretation[] = [
    makeTopicFixture({
      topic: 'career',
      title: 'Sự nghiệp',
      conclusion: 'Câu sự nghiệp',
      conclusionBasis: 'Cung Quan Lộc: Tử Vi (Miếu)',
    }),
    makeTopicFixture({
      topic: 'love',
      title: 'Tình duyên',
      conclusion: 'Câu tình duyên',
      conclusionBasis: 'Cung Phu Thê: Tham Lang (Vượng)',
    }),
    makeTopicFixture({
      topic: 'wealth',
      title: 'Tài lộc',
      conclusion: 'Câu tài lộc',
      conclusionBasis: 'Cung Tài Bạch: Cự Môn (Bình)',
    }),
    makeTopicFixture({
      topic: 'health',
      title: 'Sức khỏe',
      conclusion: 'Câu sức khỏe',
      conclusionBasis: 'Cung Tật Ách: Phá Quân (Đắc)',
    }),
  ];

  it('hiển thị banner, dòng cơ sở và ghi chú ngay sau phần tổng quan', () => {
    render(<TopicInterpretationTabs topics={topics} />);

    const section = screen.getByRole('region', { name: /Luận giải theo chủ đề/ });
    const overview = within(section).getByText('Tổng quan Sự nghiệp');
    const banner = within(section).getByTestId('topic-conclusion-career');

    expect(
      within(section).getByRole('heading', { name: /Luận giải theo chủ đề/ })
    ).toBeInTheDocument();
    expect(banner.tagName).toBe('P');
    expect(banner.textContent).toBe('“Câu sự nghiệp”');
    expect(within(section).getByText('Cơ sở: Cung Quan Lộc: Tử Vi (Miếu)')).toBeInTheDocument();
    expect(within(section).getByText('Diễn giải từ cung/sao trong lá số')).toBeInTheDocument();

    expect(
      overview.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('đổi câu kết luận theo tab và giữ đúng trạng thái aria-pressed', () => {
    render(<TopicInterpretationTabs topics={topics} />);

    const group = screen.getByRole('group', { name: 'Chọn chủ đề luận giải' });
    const careerButton = within(group).getByRole('button', { name: /Sự nghiệp/ });
    const loveButton = within(group).getByRole('button', { name: /Tình duyên/ });

    expect(careerButton).toHaveAttribute('aria-pressed', 'true');
    expect(loveButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('topic-conclusion-career')).toHaveTextContent('“Câu sự nghiệp”');
    expect(screen.queryByTestId('topic-conclusion-love')).toBeNull();

    fireEvent.click(loveButton);

    expect(loveButton).toHaveAttribute('aria-pressed', 'true');
    expect(careerButton).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByTestId('topic-conclusion-love')).toHaveTextContent('“Câu tình duyên”');
    expect(screen.queryByTestId('topic-conclusion-career')).toBeNull();
    expect(screen.getByText('Cơ sở: Cung Phu Thê: Tham Lang (Vượng)')).toBeInTheDocument();
  });

  it('không render dòng cơ sở khi rỗng nhưng vẫn giữ ghi chú diễn giải', () => {
    const topicsWithoutBasis = [
      makeTopicFixture({
        topic: 'career',
        title: 'Sự nghiệp',
        conclusion: 'Câu sự nghiệp',
        conclusionBasis: '',
      }),
    ];

    render(<TopicInterpretationTabs topics={topicsWithoutBasis} />);

    expect(screen.queryByText(/Cơ sở:/)).toBeNull();
    expect(screen.getByText('Diễn giải từ cung/sao trong lá số')).toBeInTheDocument();
    expect(screen.getByTestId('topic-conclusion-career')).toHaveTextContent('“Câu sự nghiệp”');
  });
});

describe('DecadeFortuneTimeline', () => {
  it('hiển thị timeline và đại hạn hiện tại', () => {
    const decades = calculateDecadeFortune(chart, 36, chart.birthInfo.year);
    render(<DecadeFortuneTimeline decades={decades} />);

    expect(screen.getByRole('heading', { name: /Đại vận \(10 năm\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Đại vận hiện tại/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Sự nghiệp/).length).toBeGreaterThan(0);
  });
});

describe('YearlyFortuneCard', () => {
  it('hiển thị vận hạn năm và can chi', () => {
    const fortune = calculateYearlyFortune(chart, 2026, chart.birthInfo.year);
    render(<YearlyFortuneCard fortune={fortune} />);

    expect(screen.getByRole('heading', { name: /Vận hạn năm 2026/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Bính Ngọ/).length).toBeGreaterThan(0);
    expect(screen.getByText(fortune.advice, { exact: false })).toBeInTheDocument();
  });
});

describe('TimelineView', () => {
  it('nhãn thập niên khớp điểm trung bình, không gắn Thuận lợi cho mức dưới 2.5', () => {
    render(
      <TimelineView
        timeline={{
          startYear: 2026,
          endYear: 2055,
          years: [],
          decades: [
            { decade: '2026-2035', avgScore: 1.8, fortune: 'xấu' },
            { decade: '2036-2045', avgScore: 3.2, fortune: 'ổn định' },
            { decade: '2046-2055', avgScore: 4.2, fortune: 'tốt' },
          ],
        }}
      />
    );

    expect(screen.getByText('1.8')).toBeInTheDocument();
    expect(screen.getByText('3.2')).toBeInTheDocument();
    expect(screen.getByText('4.2')).toBeInTheDocument();
    expect(screen.getByText(/Biến động/)).toBeInTheDocument();
    expect(screen.getByText(/Ổn định/)).toBeInTheDocument();
    expect(screen.getByText(/Thuận lợi/)).toBeInTheDocument();
  });
});
