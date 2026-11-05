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

afterEach(() => {
  cleanup();
});

describe('ChartSummary', () => {
  it('hiển thị thông tin cơ bản và các điểm khía cạnh', () => {
    render(<ChartSummary chart={chart} />);

    expect(screen.getByRole('heading', { name: /Tổng quan lá số/ })).toBeInTheDocument();
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

    expect(screen.getByRole('heading', { name: /Cách cục tốt \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cách cục cần lưu ý \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cách A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cách B' })).toBeInTheDocument();
  });
});

describe('AdviceCard', () => {
  it('hiển thị lời khuyên', () => {
    render(<AdviceCard advice="Giữ vững tinh thần" />);
    const section = screen.getByRole('region', { name: /Lời khuyên tổng quan/ });
    expect(within(section).getByText('Giữ vững tinh thần')).toBeInTheDocument();
  });
});

describe('PersonalSummaryCard', () => {
  it('hiển thị headline, mô tả, đặc điểm và con đường phù hợp', () => {
    render(
      <PersonalSummaryCard
        summary={{
          headline: 'Bạn là người lãnh đạo bẩm sinh',
          description: 'Bạn có tố chất lãnh đạo và tầm nhìn xa.',
          keyTraits: ['Quyết đoán', 'Tầm nhìn xa'],
          lifePath: 'Lãnh đạo, quản lý',
        }}
      />
    );

    expect(screen.getByRole('heading', { name: /Luận giải/ })).toBeInTheDocument();
    expect(screen.getByText('Bạn là người lãnh đạo bẩm sinh')).toBeInTheDocument();
    expect(screen.getByText('Bạn có tố chất lãnh đạo và tầm nhìn xa.')).toBeInTheDocument();
    expect(screen.getByText('Quyết đoán')).toBeInTheDocument();
    expect(screen.getByText('Tầm nhìn xa')).toBeInTheDocument();
    expect(screen.getByText('Lãnh đạo, quản lý')).toBeInTheDocument();
  });

  it('hiển thị các đoạn luận giải chi tiết và nhấn mạnh thuật ngữ', () => {
    const { container } = render(
      <PersonalSummaryCard
        summary={{
          ownerName: 'Nguyễn A',
          headline: 'Bạn là người lãnh đạo bẩm sinh',
          description: 'Mô tả dự phòng',
          keyTraits: ['Quyết đoán'],
          lifePath: 'Lãnh đạo, quản lý',
          introParagraph: 'Lá số của **Nguyễn A** thuộc **Dương Nam**.',
          menhStarParagraph: 'Cung Mệnh tọa **Tý**.',
          tamHopAndThanParagraph: 'Cung Thân an tại **Ngọ**.',
          conclusionParagraph: 'Nhìn tổng thể, **thành tựu** tích lũy đều.',
        }}
      />
    );

    expect(screen.getByText(/Tổng quan lá số của Nguyễn A/)).toBeInTheDocument();
    expect(screen.queryByText('Mô tả dự phòng')).not.toBeInTheDocument();
    expect(screen.getByText(/Cung Thân an tại/)).toBeInTheDocument();

    const emphasized = Array.from(container.querySelectorAll('strong')).map(
      (node) => node.textContent
    );
    expect(emphasized).toEqual(['Nguyễn A', 'Dương Nam', 'Tý', 'Ngọ', 'thành tựu']);
    expect(container.textContent).not.toContain('**');
  });
});

describe('DecadeFortuneTimeline', () => {
  it('hiển thị timeline và đại hạn hiện tại', () => {
    const decades = calculateDecadeFortune(chart, 36, chart.birthInfo.year);
    render(<DecadeFortuneTimeline decades={decades} />);

    expect(screen.getByRole('heading', { name: /Đại hạn \(10 năm\)/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Đại hạn hiện tại/ })).toBeInTheDocument();
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
