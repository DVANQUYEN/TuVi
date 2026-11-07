import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { BirthForm } from '@/components/chart/BirthForm';
import { CenterHeavenPlate } from '@/components/chart/CenterHeavenPlate';
import { PalaceCard } from '@/components/chart/PalaceCard';
import { TuanTrietBridge } from '@/components/chart/TuanTrietBridge';
import { ZiweiBoard } from '@/components/chart/ZiweiBoard';
import { getBranchLabel } from '@/lib/chart/display-helpers';
import { createChartEngine } from '@/lib/ziwei/engine';
import type { BirthInfo } from '@/lib/ziwei/types';

const SAMPLE_BIRTH_INFO: BirthInfo = {
  name: 'Đương số mẫu',
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

const chart = createChartEngine().generateChart(SAMPLE_BIRTH_INFO);

afterEach((): void => {
  cleanup();
});

describe('B6 PalaceCard', () => {
  it('renders palace metadata and forwards interaction callbacks', (): void => {
    const palace = chart.palaces[0];
    const onHover = vi.fn();
    const onSelect = vi.fn();

    render(
      <PalaceCard palace={palace} highlightRole="self" onHover={onHover} onSelect={onSelect} />
    );

    const card = screen.getByRole('button', {
      name: `Cung ${palace.name} tại ${getBranchLabel(palace.branch)}, ${palace.majorStars.length} chính tinh`,
    });

    expect(card.className).toContain('ring-2');
    expect(screen.getByText(palace.name)).toBeInTheDocument();

    fireEvent.mouseEnter(card);
    expect(onHover).toHaveBeenCalledWith(palace.branch);

    fireEvent.mouseLeave(card);
    expect(onHover).toHaveBeenCalledWith(null);

    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(palace.branch);

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('renders the Vô Chính Diệu label when a palace has no major star', (): void => {
    const palace = chart.palaces.find((item) => item.majorStars.length === 0);

    if (!palace) {
      return;
    }

    render(
      <PalaceCard palace={palace} highlightRole="none" onHover={vi.fn()} onSelect={vi.fn()} />
    );

    expect(screen.getByText('Vô Chính Diệu')).toBeInTheDocument();
  });
});

describe('B6 CenterHeavenPlate', () => {
  it('renders the birth details, four pillars and core chart metadata', (): void => {
    render(<CenterHeavenPlate chart={chart} />);

    const { heavenPlate, birthInfo } = chart;

    expect(screen.getByRole('heading', { name: birthInfo.name })).toBeInTheDocument();
    expect(screen.getByText(heavenPlate.yinYangGenderLabel)).toBeInTheDocument();

    for (const pillar of Object.values(heavenPlate.fourPillars)) {
      expect(screen.getAllByText(pillar.label).length).toBeGreaterThan(0);
    }

    expect(screen.getByText(heavenPlate.napAm.name)).toBeInTheDocument();
    expect(screen.getByText(heavenPlate.fiveElementsClass.name)).toBeInTheDocument();
    expect(screen.getAllByText(heavenPlate.soulLord).length).toBeGreaterThan(0);
    expect(screen.getAllByText(heavenPlate.bodyLord).length).toBeGreaterThan(0);
    expect(screen.getByText(getBranchLabel(heavenPlate.soulPalaceBranch))).toBeInTheDocument();
    expect(screen.getByText(getBranchLabel(heavenPlate.bodyPalaceBranch))).toBeInTheDocument();
  });
});

describe('B6 TuanTrietBridge', () => {
  it('renders a bridge label for two aligned branches', (): void => {
    render(<TuanTrietBridge fromBranch="ty" toBranch="suu" label="TUẦN" />);

    expect(screen.getByText('TUẦN')).toBeInTheDocument();
  });

  it('renders nothing when the branches are not on the same row or column', (): void => {
    const { container } = render(<TuanTrietBridge fromBranch="ty" toBranch="ti" label="TRIỆT" />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('B6 BirthForm', () => {
  it('blocks submission and shows a validation error when gender is missing', (): void => {
    const onSubmit = vi.fn();
    const { container } = render(<BirthForm onSubmit={onSubmit} />);

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng chọn giới tính.');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects birth years outside the supported range', (): void => {
    const onSubmit = vi.fn();
    const { container } = render(<BirthForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Giới tính/), { target: { value: 'nu' } });
    fireEvent.change(screen.getByLabelText('Ngày'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Tháng'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Năm'), { target: { value: '1899' } });
    fireEvent.change(screen.getByLabelText(/Giờ sinh/), { target: { value: '10' } });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(screen.getByRole('alert')).toHaveTextContent('Năm sinh phải từ 1900 đến 2099.');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a normalized BirthInfo with the selected region', (): void => {
    const onSubmit = vi.fn();
    const { container } = render(
      <BirthForm onSubmit={onSubmit} defaultValues={SAMPLE_BIRTH_INFO} />
    );

    fireEvent.change(screen.getByLabelText('Họ tên'), { target: { value: '  Nguyễn Văn A  ' } });
    fireEvent.change(screen.getByLabelText('Nơi sinh (vùng miền)'), {
      target: { value: 'south' },
    });
    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Nguyễn Văn A',
      gender: 'nam',
      calendarType: 'solar',
      year: 1990,
      month: 5,
      day: 15,
      hour: 10,
      minute: 30,
      location: {
        region: 'south',
        longitude: 106.6602,
        provinceId: 'HCM',
        provinceName: 'TP.HCM',
      },
    });
  });
});

describe('B6 ZiweiBoard', () => {
  it('renders a single 4x4 board with 12 palace buttons and the center plate', (): void => {
    render(<ZiweiBoard chart={chart} />);

    const board = screen.getByRole('region', { name: 'Bàn lá số Tử Vi 4x4' });
    expect(board).toBeInTheDocument();

    const section = screen.getByRole('region', { name: 'Bàn lá số Tử Vi' });
    expect(section).toBeInTheDocument();
    expect(section.tagName).toBe('SECTION');

    expect(screen.queryByRole('list', { name: 'Danh sách 12 cung' })).not.toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    // The single board is a 4-column grid containing all 12 palace cells.
    expect(board.className).toContain('grid-cols-4');
    expect(board.querySelectorAll('[data-branch]')).toHaveLength(12);

    const palaceButtons = screen.getAllByRole('button', {
      name: /^Cung .+ tại .+, \d+ chính tinh$/,
    });
    expect(palaceButtons).toHaveLength(12);

    // Center plate metadata is still rendered inside the board.
    expect(screen.getByText(/Nạp Âm:/)).toBeInTheDocument();
    expect(screen.getByText(/Cục:/)).toBeInTheDocument();
    expect(screen.getAllByText(chart.heavenPlate.soulLord).length).toBeGreaterThan(0);
    expect(screen.getAllByText(chart.heavenPlate.bodyLord).length).toBeGreaterThan(0);
  });
});
