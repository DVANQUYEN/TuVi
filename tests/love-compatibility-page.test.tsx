import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { CompatibilityForm } from '@/components/horoscope/CompatibilityForm';
import { CompatibilityResult } from '@/components/horoscope/love/CompatibilityResult';
import { TinhDuyenEmblem } from '@/components/horoscope/love/TinhDuyenEmblem';
import { buildLoveEmblemPreview } from '@/components/horoscope/love/emblem-preview';
import {
  LOVE_EMBLEM_MERGE_DURATION_MS,
  LOVE_RESULT_REVEAL_DELAY_MS,
  LOVE_TOTAL_REVEAL_MS,
} from '@/components/horoscope/love/merge-timing';
import type { LoveProfileValue } from '@/components/horoscope/love/LoveProfileFields';
import { SaoMenhChartEngine, createChartEngine } from '@/lib/ziwei';
import { calculateCompatibility } from '@/lib/ziwei/compatibility';
import { DEFAULT_LOCATION } from '@/lib/ziwei/data';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import HopTuoiPage from '@/app/hop-tuoi/page';
import { installReducedMotion } from './helpers/match-media';

vi.mock('@/lib/supabase/use-auth', () => ({
  useAuth: (): { user: null; loading: boolean; signOut: () => Promise<void> } => ({
    user: null,
    loading: false,
    signOut: async (): Promise<void> => {},
  }),
}));

const { saveLoveCompatibilityRequestMock } = vi.hoisted(() => ({
  saveLoveCompatibilityRequestMock: vi.fn(),
}));

vi.mock('@/lib/supabase/love-requests', () => ({
  saveLoveCompatibilityRequest: saveLoveCompatibilityRequestMock,
}));

interface ProfileValues {
  name: string;
  gender: 'nam' | 'nu';
  year: string;
  month: string;
  day: string;
  hour: string;
}

const EMPTY_PROFILE: LoveProfileValue = {
  name: '',
  gender: '',
  calendarType: 'solar',
  day: '',
  month: '',
  year: '',
  hour: '',
  minute: '0',
  region: 'north',
};

const FIRST_PROFILE: ProfileValues = {
  name: 'Mệnh chủ thứ nhất',
  gender: 'nam',
  day: '15',
  month: '5',
  year: '1990',
  hour: '10',
};

const SECOND_PROFILE: ProfileValues = {
  name: 'Mệnh chủ thứ hai',
  gender: 'nu',
  day: '20',
  month: '8',
  year: '1992',
  hour: '14',
};

const MERGE_DURATION_MS = LOVE_EMBLEM_MERGE_DURATION_MS;
const REVEAL_DELAY_MS = LOVE_RESULT_REVEAL_DELAY_MS;
const TOTAL_REVEAL_MS = LOVE_TOTAL_REVEAL_MS;

const CONCLUSION_QUOTES = {
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

// Năm khía cạnh của hồ sơ cố định trong test merge (tone balanced).
const ASPECT_CARDS = [
  { key: 'foundation', label: 'Nền tảng bản mệnh' },
  { key: 'marriagePalace', label: 'Cung Phu Thê' },
  { key: 'starSynergy', label: 'Tương hợp tinh tú' },
  { key: 'canChi', label: 'Can Chi bốn trụ' },
  { key: 'crossPalace', label: 'Tương tác cung vị' },
] as const;

const ASPECT_KEYS = [
  'foundation',
  'marriagePalace',
  'starSynergy',
  'canChi',
  'crossPalace',
] as const;

const LOVE_BRANCHES = [
  { han: '子', label: 'Tý', animal: 'rat', slug: 'ty' },
  { han: '丑', label: 'Sửu', animal: 'ox', slug: 'suu' },
  { han: '寅', label: 'Dần', animal: 'tiger', slug: 'dan' },
  { han: '卯', label: 'Mão', animal: 'cat', slug: 'mao' },
  { han: '辰', label: 'Thìn', animal: 'dragon', slug: 'thin' },
  { han: '巳', label: 'Tỵ', animal: 'snake', slug: 'ran' },
  { han: '午', label: 'Ngọ', animal: 'horse', slug: 'ngo' },
  { han: '未', label: 'Mùi', animal: 'goat', slug: 'mui' },
  { han: '申', label: 'Thân', animal: 'monkey', slug: 'than' },
  { han: '酉', label: 'Dậu', animal: 'rooster', slug: 'dau' },
  { han: '戌', label: 'Tuất', animal: 'dog', slug: 'tuat' },
  { han: '亥', label: 'Hợi', animal: 'pig', slug: 'hoi' },
] as const;

const ANIMAL_CENTER_RADIUS = 169.5;
const ANIMAL_CLIP_RADIUS = 18;
const ANIMAL_DISC_RADIUS = 19.5;
const ANIMAL_IMAGE_SIZE = 36;
const ANIMAL_GLYPH_RADIUS = 145;
const EMBLEM_CENTER = 200;

/**
 * Tập sao chính sáng cho hai hồ sơ cố định của test, lấy từ engine thật:
 * Mệnh/Thân/Phu Thê của lá số nam 15/05/1990 giờ 10 và nữ 20/08/1992 giờ 14.
 */
const FIXED_ACTIVE_STAR_IDS = ['liemTrinh', 'phaQuan', 'thatSat', 'tuVi', 'vuKhuc'].sort();

/** Đổi năm sinh hồ sơ thứ nhất sang 1991 làm đổi các cung quan trọng. */
const CHANGED_ACTIVE_STAR_IDS = [
  'liemTrinh',
  'phaQuan',
  'thatSat',
  'thienCo',
  'thienLuong',
  'tuVi',
].sort();

/** `data-star-key` uses kebab-case; the engine ids use camelCase. */
function toStarKey(engineId: string): string {
  return engineId.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

const FIXED_ACTIVE_STAR_KEYS = FIXED_ACTIVE_STAR_IDS.map(toStarKey).sort();
const CHANGED_ACTIVE_STAR_KEYS = CHANGED_ACTIVE_STAR_IDS.map(toStarKey).sort();

function fillProfile(index: number, values: ProfileValues): void {
  fireEvent.change(screen.getAllByLabelText(/^Họ tên/)[index], {
    target: { value: values.name },
  });
  fireEvent.change(screen.getAllByLabelText(/^Giới tính/)[index], {
    target: { value: values.gender },
  });
  fireEvent.change(screen.getAllByLabelText(/^Ngày/)[index], {
    target: { value: values.day },
  });
  fireEvent.change(screen.getAllByLabelText(/^Tháng/)[index], {
    target: { value: values.month },
  });
  fireEvent.change(screen.getAllByLabelText(/^Năm/)[index], {
    target: { value: values.year },
  });
  fireEvent.change(screen.getAllByLabelText(/^Giờ sinh/)[index], {
    target: { value: values.hour },
  });
}

function fillBothProfiles(): void {
  fillProfile(0, FIRST_PROFILE);
  fillProfile(1, SECOND_PROFILE);
}

function changeField(label: RegExp, index: number, value: string): void {
  fireEvent.change(screen.getAllByLabelText(label)[index], { target: { value } });
}

function preview(patch: Partial<LoveProfileValue> = {}): ReturnType<typeof buildLoveEmblemPreview> {
  return buildLoveEmblemPreview({ ...EMPTY_PROFILE, ...patch });
}

function getEmblem(): HTMLElement {
  return screen.getByTestId('tinh-duyen-emblem');
}

// The bagua is now one continuous group rather than two person-bound halves.
function getBagua(): SVGGElement {
  const trigram = getEmblem().querySelector<SVGElement>('[data-trigram]');
  expect(trigram).not.toBeNull();
  return (trigram as SVGElement).parentNode as unknown as SVGGElement;
}

function getStarsGroup(): SVGGElement {
  const stars = getEmblem().querySelector<SVGGElement>('[data-stars-complete]');
  expect(stars).not.toBeNull();
  return stars as SVGGElement;
}

function getPathPoints(d: string): { x: number; y: number }[] {
  return Array.from(d.matchAll(/[ML](-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g), (match) => ({
    x: Number(match[1]),
    y: Number(match[2]),
  }));
}

function getOctagonRadius(pathElement: SVGPathElement): number {
  const points = getPathPoints(pathElement.getAttribute('d') ?? '');
  expect(points).toHaveLength(8);
  const radii = points.map((point) =>
    Math.hypot(point.x - EMBLEM_CENTER, point.y - EMBLEM_CENTER)
  );
  radii.forEach((radius) => expect(radius).toBeCloseTo(radii[0], 2));
  return radii[0];
}

function getYinYang(): SVGElement {
  const yinYang = within(getEmblem()).getByTestId('love-emblem-yinyang');
  return yinYang as unknown as SVGElement;
}

function getPolarity(polarity: 'duong' | 'am'): SVGGElement {
  const group = getYinYang().querySelector<SVGGElement>(`[data-polarity="${polarity}"]`);
  expect(group).not.toBeNull();
  return group as SVGGElement;
}

/** The Dương half is now the white base circle (plus its black top dot). */
function getDuongBase(): SVGCircleElement {
  const base = getPolarity('duong').querySelector<SVGCircleElement>('circle[r="30"]');
  expect(base).not.toBeNull();
  return base as SVGCircleElement;
}

/** Both polarity dots are r4.9; there is no separate r4.4 muted base dot any more. */
function getPolarityDot(polarity: 'duong' | 'am'): SVGCircleElement {
  const dot = getPolarity(polarity).querySelector<SVGCircleElement>('circle[r="4.9"]');
  expect(dot).not.toBeNull();
  return dot as SVGCircleElement;
}

/** Only the Âm half is a path: the complementary left outer + bottom lobe S-curve. */
function getAmPath(): SVGPathElement {
  const amPath = getPolarity('am').querySelector<SVGPathElement>('path');
  expect(amPath).not.toBeNull();
  return amPath as SVGPathElement;
}

function getArcSweeps(d: string): string[] {
  return Array.from(
    d.matchAll(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\s+(\d+)\s+([01]),([01])/g),
    (match) => match[5]
  );
}

function animalCenter(index: number): { x: number; y: number } {
  const radians = ((index * 30 - 90) * Math.PI) / 180;
  return {
    x: Number((EMBLEM_CENTER + ANIMAL_CENTER_RADIUS * Math.cos(radians)).toFixed(2)),
    y: Number((EMBLEM_CENTER + ANIMAL_CENTER_RADIUS * Math.sin(radians)).toFixed(2)),
  };
}

function animalGlyphPosition(index: number): { x: number; y: number } {
  const radians = ((index * 30 - 90) * Math.PI) / 180;
  return {
    x: Number((EMBLEM_CENTER + ANIMAL_GLYPH_RADIUS * Math.cos(radians)).toFixed(2)),
    y: Number((EMBLEM_CENTER + ANIMAL_GLYPH_RADIUS * Math.sin(radians)).toFixed(2)),
  };
}

function getBranch(index: number): SVGElement {
  const branch = getEmblem().querySelector<SVGElement>(`[data-branch-index="${index}"]`);
  expect(branch).not.toBeNull();
  return branch as SVGElement;
}

function activeBranchIndices(): number[] {
  return Array.from(getEmblem().querySelectorAll<SVGElement>('[data-branch-index]'))
    .filter((branch) => branch.getAttribute('data-active-tone') !== 'none')
    .map((branch) => Number(branch.getAttribute('data-branch-index')))
    .sort((left, right) => left - right);
}

/** The old pillar list/fallback below the SVG is gone; none of its text may return. */
function expectNoPillarFallback(): void {
  const emblem = getEmblem();
  expect(emblem.querySelectorAll('ul')).toHaveLength(0);
  expect(emblem).not.toHaveTextContent(/Đệ\s*(nhất|nhị)/i);
  expect(emblem).not.toHaveTextContent(/Chưa đủ Địa chi/i);
  ['Năm', 'Tháng', 'Ngày', 'Giờ'].forEach((label) => {
    expect(within(emblem).queryByText(label, { exact: true })).not.toBeInTheDocument();
  });
  LOVE_BRANCHES.forEach(({ label }) => {
    expect(within(emblem).queryByText(label, { exact: true })).not.toBeInTheDocument();
  });
}

function starKeys(): string[] {
  return Array.from(getEmblem().querySelectorAll<SVGElement>('[data-star-key]')).map(
    (star) => star.getAttribute('data-star-key') ?? ''
  );
}

function activeStarKeys(): string[] {
  return Array.from(getEmblem().querySelectorAll<SVGElement>('[data-star-key]'))
    .filter((star) => star.getAttribute('data-star-active') === 'true')
    .map((star) => star.getAttribute('data-star-key') ?? '')
    .sort();
}

function importantMajorStarIds(profiles: readonly ProfileValues[]): string[] {
  const engine = createChartEngine();
  const ids = new Set<string>();

  profiles.forEach((profile) => {
    const chart = engine.generateChart(toTestBirthInfo(profile));
    chart.palaces.forEach((palace) => {
      if (palace.id !== 'menh' && palace.id !== 'phuThe' && !palace.isBodyPalace) return;
      palace.majorStars.forEach((star) => ids.add(star.id));
    });
  });

  return Array.from(ids).sort();
}

function toTestBirthInfo(values: ProfileValues): BirthInfo {
  return {
    name: values.name.trim() || undefined,
    gender: values.gender,
    calendarType: 'solar',
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: 0,
    location: DEFAULT_LOCATION.north,
    viewingYear: new Date().getFullYear(),
  };
}

function getDirectTexts(element: SVGElement | HTMLElement): string[] {
  return Array.from(element.querySelectorAll('text')).map((text) => text.textContent?.trim() ?? '');
}

function getLiveStatus(): HTMLElement {
  return screen.getByTestId('love-live-status');
}

function getRightColumn(): HTMLElement {
  const aside = getEmblem().closest('aside') as HTMLElement | null;
  // Mobile order wrappers sit between the grid and the emblem aside.
  const grid = aside?.parentElement?.parentElement as HTMLElement | null;
  const rightColumn =
    (grid?.children[1] as HTMLElement | undefined) ??
    grid?.querySelector<HTMLElement>('[aria-busy]') ??
    null;
  expect(rightColumn).not.toBeNull();
  return rightColumn as HTMLElement;
}

/** The grid wrapper around the emblem aside that owns the mobile/desktop order classes. */
function getEmblemWrapper(): HTMLElement {
  const aside = getEmblem().closest('aside');
  expect(aside).not.toBeNull();
  return (aside as HTMLElement).parentElement as HTMLElement;
}

/**
 * jsdom does not implement `scrollIntoView`, so install a spy only when needed
 * and always restore the original prototype entry afterwards.
 */
function stubScrollIntoView(): { scrollIntoView: ReturnType<typeof vi.fn>; restore: () => void } {
  const original = Element.prototype.scrollIntoView;
  const scrollIntoView = vi.fn();

  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoView,
  });

  return {
    scrollIntoView,
    restore: (): void => {
      if (original === undefined) {
        delete (Element.prototype as Partial<Element>).scrollIntoView;
        return;
      }

      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        configurable: true,
        writable: true,
        value: original,
      });
    },
  };
}

function advanceMerge(milliseconds: number = TOTAL_REVEAL_MS): void {
  act((): void => {
    vi.advanceTimersByTime(milliseconds);
  });
}

beforeEach((): void => {
  installReducedMotion(false);
  saveLoveCompatibilityRequestMock.mockReset();
  saveLoveCompatibilityRequestMock.mockResolvedValue({
    ok: false,
    error: 'not_configured',
  });
});

afterEach((): void => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Tình Duyên compatibility experience', () => {
  it('renders two simultaneous profiles with unique field ids', (): void => {
    const { container } = render(<CompatibilityForm />);

    expect(screen.getByText('Đệ Nhất Mệnh Chủ')).toBeInTheDocument();
    expect(screen.getByText('Đệ Nhị Mệnh Chủ')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/^Họ tên/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/^Giới tính/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/^Ngày/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/^Tháng/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/^Năm/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/^Giờ sinh/)).toHaveLength(2);

    const form = container.querySelector('form') as HTMLFormElement;
    const ids = Array.from(form.querySelectorAll<HTMLElement>('input, select')).map(
      (element) => element.id
    );

    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' })).toBeInTheDocument();

    const status = getLiveStatus();
    expect(status).toBeEmptyDOMElement();
    expect(status).toHaveAttribute('data-phase', 'idle');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-atomic', 'true');
  });

  it('uses a numeric text input for the birth year instead of a select', (): void => {
    render(<CompatibilityForm />);

    const yearFields = screen.getAllByLabelText(/^Năm/) as HTMLInputElement[];
    expect(yearFields).toHaveLength(2);

    yearFields.forEach((field): void => {
      expect(field).toBeInstanceOf(HTMLInputElement);
      expect(field.tagName).toBe('INPUT');
      expect(field).toHaveAttribute('type', 'text');
      expect(field).toHaveAttribute('inputMode', 'numeric');
      expect(field).toHaveAttribute('maxLength', '4');
      expect(field).toHaveAttribute('placeholder', 'VD: 1990');
    });

    // The year is no longer a combobox; the other date/gender selects remain.
    expect(screen.queryByRole('combobox', { name: /^Năm/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: /^Giới tính/ })).toHaveLength(2);
    expect(screen.getAllByRole('combobox', { name: /^Tháng/ })).toHaveLength(2);
  });

  it('sanitizes the birth year input to digits and caps it at four characters', (): void => {
    render(<CompatibilityForm />);

    const yearInput = screen.getAllByLabelText(/^Năm/)[0] as HTMLInputElement;

    fireEvent.change(yearInput, { target: { value: '19a90x' } });
    expect(yearInput).toHaveValue('1990');

    fireEvent.change(yearInput, { target: { value: '19901' } });
    expect(yearInput).toHaveValue('1990');
  });

  it.each(['1899', '2100'])(
    'still rejects an out-of-range birth year (%s)',
    (year: string): void => {
      render(<CompatibilityForm />);
      fillBothProfiles();
      changeField(/^Năm/, 0, year);
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('Năm sinh phải từ 1900 đến 2099.');
      expect(summary).toHaveTextContent('Đệ Nhất');
      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(getLiveStatus()).toBeEmptyDOMElement();
      expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
    }
  );

  it('keeps advanced location collapsed until each profile requests it', (): void => {
    render(<CompatibilityForm />);

    expect(screen.queryByLabelText(/Nơi sinh/)).not.toBeInTheDocument();

    const toggles = screen.getAllByRole('button', { name: 'Tùy chọn nâng cao' });
    expect(toggles).toHaveLength(2);
    toggles.forEach((toggle) => {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).not.toHaveAttribute('aria-controls');
    });

    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);

    toggles.forEach((toggle) => {
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(toggle).toHaveAttribute('aria-controls');
    });

    const locationSelects = screen.getAllByLabelText(/Nơi sinh/);
    expect(locationSelects).toHaveLength(2);
    const locationIds = locationSelects.map((select) => select.id);
    expect(locationIds.every(Boolean)).toBe(true);
    expect(new Set(locationIds).size).toBe(2);
  });

  it('validates required gender, time and date fields for both profiles', (): void => {
    render(<CompatibilityForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    const summary = screen.getByRole('alert');
    expect(summary).toHaveTextContent('Vui lòng kiểm tra lại thông tin');
    expect(summary).toHaveTextContent('Đệ Nhất');
    expect(summary).toHaveTextContent('Đệ Nhị');
    expect(summary).toHaveTextContent(/giới tính/i);
    expect(summary).toHaveTextContent(/ngày sinh/i);
    expect(summary).toHaveTextContent(/tháng sinh/i);
    expect(summary).toHaveTextContent(/năm sinh/i);
    expect(summary).toHaveTextContent(/giờ sinh/i);
    expect(summary).toHaveFocus();
    expect(within(summary).getAllByRole('link').length).toBeGreaterThanOrEqual(12);

    screen.getAllByLabelText(/^Giới tính/).forEach((field) => {
      expect(field).toHaveAttribute('aria-invalid', 'true');
      expect(field.className).toContain('scroll-mt-24');
    });
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
  });

  it.each([0, 1])(
    'requires a non-empty name for profile %i before calculating',
    (index: number): void => {
      render(<CompatibilityForm />);
      fillBothProfiles();
      changeField(/^Họ tên/, index, '   ');
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('Vui lòng nhập họ và tên.');
      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(getLiveStatus()).toBeEmptyDOMElement();
      expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
      expect(saveLoveCompatibilityRequestMock).not.toHaveBeenCalled();
    }
  );

  it.each([0, 1])(
    'requires a non-empty birth year for profile %i before calculating',
    (index: number): void => {
      render(<CompatibilityForm />);
      fillBothProfiles();
      changeField(/^Năm/, index, '');
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('Vui lòng nhập năm sinh.');
      expect(summary).toHaveTextContent(index === 0 ? 'Đệ Nhất' : 'Đệ Nhị');
      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(saveLoveCompatibilityRequestMock).not.toHaveBeenCalled();
    }
  );

  it('rejects a 121-character name and accepts exactly 120 characters', async (): Promise<void> => {
    const { unmount } = render(<CompatibilityForm />);
    fillBothProfiles();
    changeField(/^Họ tên/, 0, 'a'.repeat(121));
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Họ tên không được vượt quá 120 ký tự.'
    );
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
    expect(saveLoveCompatibilityRequestMock).not.toHaveBeenCalled();
    unmount();

    vi.useFakeTimers();
    render(<CompatibilityForm />);
    fillBothProfiles();
    changeField(/^Họ tên/, 0, 'a'.repeat(120));
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(saveLoveCompatibilityRequestMock).toHaveBeenCalledTimes(1);

    await act(async (): Promise<void> => {
      await Promise.resolve();
    });
    advanceMerge();
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
  });

  it.each([
    ['nam', 'nam'],
    ['nu', 'nu'],
  ])(
    'blocks a %s/%s pair with an opposite-gender error and no result',
    (firstGender: string, secondGender: string): void => {
      render(<CompatibilityForm />);
      fillBothProfiles();
      changeField(/^Giới tính/, 0, firstGender);
      changeField(/^Giới tính/, 1, secondGender);
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('Cần chọn một người nam và một người nữ.');
      expect(summary).toHaveTextContent(/giới tính/i);
      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(getLiveStatus()).toBeEmptyDOMElement();
      expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
      expect(saveLoveCompatibilityRequestMock).not.toHaveBeenCalled();
    }
  );

  it('accepts a nam/nữ pair and reveals the result', async (): Promise<void> => {
    vi.useFakeTimers();
    render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(saveLoveCompatibilityRequestMock).toHaveBeenCalledTimes(1);

    await act(async (): Promise<void> => {
      await Promise.resolve();
    });
    advanceMerge();
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
  });

  it('keeps the helper lines next to the submit CTA and omits the old privacy notice', (): void => {
    render(<CompatibilityForm />);

    const submitButton = screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' });
    const methodLine = screen.getByText('Luận giải dựa trên Tử Vi cổ truyền.');
    const accuracyLine = screen.getByText(
      'Giờ sinh càng chính xác, lá số càng sát với thực tế.'
    );

    expect(submitButton.parentElement).toContainElement(methodLine);
    expect(submitButton.parentElement).toContainElement(accuracyLine);
    expect(
      screen.queryByText(
        (_content, element) =>
          element?.tagName === 'P' &&
          Boolean(element.textContent?.includes('Thông tin của hai người được lưu'))
      )
    ).not.toBeInTheDocument();
    expect(document.body.textContent ?? '').not.toContain(
      'Thông tin của hai người được lưu để cải thiện luận giải và không hiển thị công khai.'
    );
  });

  it('shows the subtle saved notice only when the background save succeeds', async (): Promise<void> => {
    installReducedMotion(true);

    // Not configured: the result is still revealed and nothing claims it was saved.
    const unconfigured = render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    await act(async (): Promise<void> => {
      await Promise.resolve();
    });
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
    expect(screen.queryByText('Đã ghi nhận thông tin')).not.toBeInTheDocument();
    unconfigured.unmount();

    // Insert failure: the result still reveals and no saved notice appears.
    saveLoveCompatibilityRequestMock.mockResolvedValue({
      ok: false,
      error: 'insert_failed',
    });
    const failed = render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    await act(async (): Promise<void> => {
      await Promise.resolve();
    });
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
    expect(screen.queryByText('Đã ghi nhận thông tin')).not.toBeInTheDocument();
    failed.unmount();

    // Success: the subtle confirmation is rendered.
    saveLoveCompatibilityRequestMock.mockClear();
    saveLoveCompatibilityRequestMock.mockResolvedValue({ ok: true });
    render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    const savedNotice = await screen.findByText('Đã ghi nhận thông tin');
    expect(savedNotice).toHaveAttribute('role', 'status');
    expect(savedNotice.className).toContain('text-muted');
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
    expect(saveLoveCompatibilityRequestMock).toHaveBeenCalledTimes(1);
  });

  it('saves exactly once on a successful submit and never on validation or reset', async (): Promise<void> => {
    vi.useFakeTimers();
    const invalid = render(<CompatibilityForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng nhập họ và tên.');
    expect(saveLoveCompatibilityRequestMock).not.toHaveBeenCalled();
    invalid.unmount();

    render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    expect(saveLoveCompatibilityRequestMock).toHaveBeenCalledTimes(1);

    await act(async (): Promise<void> => {
      await Promise.resolve();
    });
    advanceMerge();
    const result = screen.getByTestId('compatibility-result');
    fireEvent.click(within(result).getByRole('button', { name: 'Chỉnh sửa thông tin' }));

    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(saveLoveCompatibilityRequestMock).toHaveBeenCalledTimes(1);
  });

  it('lights the yin-yang polarity groups and branches progressively only from the profile being filled', (): void => {
    render(<CompatibilityForm />);

    // A name alone no longer tints the yin-yang; polarity is gender-driven.
    changeField(/^Họ tên/, 0, 'Mệnh chủ thứ nhất');
    const yinYang = getYinYang();
    expect(yinYang).toHaveAttribute('data-duong-active', 'false');
    expect(yinYang).toHaveAttribute('data-am-active', 'false');
    expect(getPolarity('duong')).toHaveAttribute('data-active', 'false');
    expect(getPolarity('am')).toHaveAttribute('data-active', 'false');
    // The continuous bagua stays neutral and has no live polarity attributes.
    const bagua = getBagua();
    expect(bagua).not.toHaveAttribute('data-active');
    expect(bagua).not.toHaveAttribute('data-polarity');
    expect(bagua.querySelectorAll('[data-person], [data-half]')).toHaveLength(0);

    changeField(/^Giới tính/, 0, 'nam');
    expect(yinYang).toHaveAttribute('data-duong-active', 'true');
    expect(yinYang).toHaveAttribute('data-am-active', 'false');
    expect(getPolarity('duong')).toHaveAttribute('data-active', 'true');
    expect(getPolarity('duong').getAttribute('opacity') ?? '1').toBe('1');
    expect(getDuongBase()).toHaveAttribute('fill', '#f4efe2');
    expect(getDuongBase()).toHaveAttribute('filter', 'url(#love-emblem-glow-polarity)');
    expect(getPolarityDot('duong')).toHaveAttribute('fill', '#050505');
    expect(getPolarity('am')).toHaveAttribute('data-active', 'false');
    expect(getPolarity('am').getAttribute('opacity') ?? '1').toBe('1');
    expect(getAmPath()).toHaveAttribute('fill', '#333333');
    expect(getPolarityDot('am')).toHaveAttribute('fill', '#9a9a9a');
    expect(getAmPath()).not.toHaveAttribute('filter');
    expect(getPolarity('duong')).not.toHaveTextContent('日');
    expect(getPolarity('duong')).not.toHaveTextContent('DƯƠNG');

    changeField(/^Giới tính/, 1, 'nu');
    expect(yinYang).toHaveAttribute('data-duong-active', 'true');
    expect(yinYang).toHaveAttribute('data-am-active', 'true');
    expect(getPolarity('am')).toHaveAttribute('data-active', 'true');
    expect(getPolarity('am').getAttribute('opacity') ?? '1').toBe('1');
    expect(getAmPath()).toHaveAttribute('fill', '#080808');
    expect(getAmPath()).toHaveAttribute('filter', 'url(#love-emblem-glow-polarity)');
    expect(getPolarityDot('am')).toHaveAttribute('fill', '#f7f2e6');
    expect(getPolarity('am')).not.toHaveTextContent('月');
    expect(getPolarity('am')).not.toHaveTextContent('ÂM');

    // A partial date (no year) must not invent a year/month/day pillar. The
    // pillar list below the SVG is removed, so assert its text is absent instead.
    expectNoPillarFallback();
    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    expect(activeBranchIndices()).toEqual([]);
    expect(getBranch(6)).toHaveAttribute('data-active-tone', 'none');
    expect(getBranch(6).querySelector('.love-emblem-branch-pop')).toBeNull();
    expectNoPillarFallback();

    changeField(/^Năm/, 0, '1990');
    expect(activeBranchIndices()).toEqual([4, 5, 6]);
    [4, 5, 6].forEach((index) => {
      expect(getBranch(index)).toHaveAttribute('data-active-tone', 'first');
    });
    [0, 1, 2, 3, 7, 8, 9, 10, 11].forEach((index) => {
      expect(getBranch(index)).toHaveAttribute('data-active-tone', 'none');
    });
    expectNoPillarFallback();
    // The preview is branch-only: heavenly stems must not leak into it.
    expect(getEmblem()).not.toHaveTextContent('Canh');
    expect(getEmblem()).not.toHaveTextContent('Tân');
    expect(getEmblem()).not.toHaveTextContent('Ất');

    // Hour 18 belongs to Dậu (index 9), which was not lit by the date pillars.
    changeField(/^Giờ sinh/, 0, '18');
    expect(activeBranchIndices()).toEqual([4, 5, 6, 9]);
    expect(getBranch(9)).toHaveAttribute('data-active-tone', 'first');
    expectNoPillarFallback();
    expect(getEmblem()).not.toHaveTextContent('Ất');
  });

  it('does not highlight invented date branches when the date is partial or invalid', (): void => {
    render(<CompatibilityForm />);

    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    expect(activeBranchIndices()).toEqual([]);

    // With no complete date the real hour branch is still valid information.
    changeField(/^Giờ sinh/, 0, '10');
    expect(activeBranchIndices()).toEqual([5]);
    expect(getBranch(5)).toHaveAttribute('data-active-tone', 'first');
    expect(within(getEmblem()).getAllByText('巳').length).toBeGreaterThanOrEqual(1);
    expectNoPillarFallback();

    changeField(/^Năm/, 0, '1990');
    expect(activeBranchIndices()).toEqual([4, 5, 6]);

    // 31/02 is not a real solar date, so only the hour branch may stay lit.
    changeField(/^Ngày/, 0, '31');
    changeField(/^Tháng/, 0, '2');
    expect(activeBranchIndices()).toEqual([5]);
    expect(getBranch(4)).toHaveAttribute('data-active-tone', 'none');
    expect(getBranch(6)).toHaveAttribute('data-active-tone', 'none');
    expect(getBranch(4).querySelector('.love-emblem-branch-pop')).toBeNull();
    expect(getBranch(6).querySelector('.love-emblem-branch-pop')).toBeNull();
    expectNoPillarFallback();
    expect(getEmblem()).not.toHaveTextContent('Canh');
    expect(getEmblem()).not.toHaveTextContent('Tân');
  });

  it.each([
    ['31', '2', '1990'],
    ['31', '4', '1990'],
    ['30', '2', '1990'],
  ])(
    'rejects impossible solar date %s/%s/%s before generating a chart',
    (day, month, year): void => {
      const generateChart = vi.spyOn(SaoMenhChartEngine.prototype, 'generateChart');
      render(<CompatibilityForm />);

      fillProfile(0, { ...FIRST_PROFILE, day, month, year });
      fillProfile(1, SECOND_PROFILE);
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('Ngày sinh không hợp lệ với tháng/năm đã chọn.');
      expect(summary).toHaveTextContent('Đệ Nhất');
      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(getLiveStatus()).toBeEmptyDOMElement();
      expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
      expect(generateChart).not.toHaveBeenCalled();
    }
  );

  it('accepts the real leap day 29/02/2000 and generates both charts', (): void => {
    vi.useFakeTimers();
    const generateChart = vi.spyOn(SaoMenhChartEngine.prototype, 'generateChart');
    render(<CompatibilityForm />);

    fillProfile(0, { ...FIRST_PROFILE, day: '29', month: '2', year: '2000' });
    fillProfile(1, SECOND_PROFILE);
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(generateChart).toHaveBeenCalledTimes(2);
    expect(getLiveStatus()).toHaveTextContent('Đang hoà quyện hai lá số…');

    advanceMerge();
    expect(screen.getByTestId('compatibility-result')).toBeInTheDocument();
    expect(getLiveStatus()).toHaveTextContent('Đã hoàn tất luận giải duyên đôi lứa.');
  });

  it('renders no red thread path or merge-thread in any emblem phase', (): void => {
    const person = preview({
      name: 'Mệnh chủ thứ nhất',
      gender: 'nam',
      day: '15',
      month: '5',
      year: '1990',
      hour: '10',
    });
    const { rerender } = render(
      <TinhDuyenEmblem personPreviews={[person, person]} phase="idle" animate />
    );

    const assertNoThread = (): void => {
      const emblem = getEmblem();
      expect(within(emblem).queryByTestId('love-emblem-thread')).not.toBeInTheDocument();
      expect(emblem.querySelector('.love-emblem-merge-thread')).toBeNull();
      expect(emblem.querySelectorAll('[class*="love-emblem-thread"]')).toHaveLength(0);
      // The removed red thread spanned M132,200 → 268,200 across the badge.
      const threadLikePaths = Array.from(emblem.querySelectorAll('path')).filter((pathNode) => {
        const d = pathNode.getAttribute('d') ?? '';
        return d.trim().startsWith('M132,200') && d.trim().endsWith('268,200');
      });
      expect(threadLikePaths).toHaveLength(0);
    };

    assertNoThread();

    rerender(<TinhDuyenEmblem personPreviews={[person, person]} phase="merging" animate />);
    assertNoThread();

    rerender(<TinhDuyenEmblem personPreviews={[person, person]} phase="revealed" animate />);
    assertNoThread();
  });

  it('holds the result during the merge, announces status, then reveals it in the right column', (): void => {
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    const status = getLiveStatus();
    expect(status).toBeEmptyDOMElement();
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');

    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getLiveStatus()).toBe(status);
    expect(status).toHaveTextContent('Đang hoà quyện hai lá số…');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'true');
    expect(getEmblem()).toHaveAttribute('data-phase', 'merging');
    expect(getEmblem()).toHaveAttribute('data-animate', 'true');

    expect(MERGE_DURATION_MS).toBe(3000);
    expect(REVEAL_DELAY_MS).toBe(1000);
    expect(TOTAL_REVEAL_MS).toBe(4000);
    expect(getEmblem()).toHaveAttribute('data-merge-duration-ms', '3000');
    expect(getEmblem()).toHaveAttribute('data-merge-duration', '3000');
    expect(getEmblem().style.getPropertyValue('--love-emblem-merge-duration')).toBe('3000ms');

    // The 3000ms animation ends, but the result stays hidden through the 1000ms pause.
    advanceMerge(MERGE_DURATION_MS);
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getLiveStatus()).toBe(status);
    expect(status).toHaveTextContent('Đang hoà quyện hai lá số…');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'true');
    expect(getEmblem()).toHaveAttribute('data-phase', 'merging');

    advanceMerge(REVEAL_DELAY_MS - 1);
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getLiveStatus()).toBe(status);
    expect(status).toHaveTextContent('Đang hoà quyện hai lá số…');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'true');

    // 4000ms total: the reveal pause has elapsed and the result is announced.
    advanceMerge(1);
    const result = screen.getByTestId('compatibility-result');
    expect(getLiveStatus()).toBe(status);
    expect(status).toHaveTextContent('Đã hoàn tất luận giải duyên đôi lứa.');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');
    expect(getEmblem()).toHaveAttribute('data-phase', 'revealed');
    expect(result).toHaveFocus();

    // Post-merge classes settle only on the animal ring, the star ring and the
    // centre. Ticks and the continuous bagua stay static, and no class keeps the
    // old merge name.
    ['ring', 'stars', 'center'].forEach((layer) => {
      expect(getEmblem().querySelector(`.love-emblem-merged-${layer}`)).not.toBeNull();
    });
    ['ticks', 'bagua'].forEach((layer) => {
      expect(getEmblem().querySelector(`.love-emblem-merged-${layer}`)).toBeNull();
      expect(getEmblem().querySelector(`.love-emblem-merge-${layer}`)).toBeNull();
    });
    expect(getEmblem().querySelector('[class*="love-emblem-merge-"]')).toBeNull();
    const baguaClassName = getBagua().getAttribute('class') ?? '';
    expect(baguaClassName).toContain('love-emblem-smooth');
    expect(baguaClassName).not.toContain('love-emblem-merged');
    expect(baguaClassName).not.toContain('love-emblem-merge');
    expect(getEmblem().querySelector('.love-emblem-merge-thread')).toBeNull();

    expect(
      within(result).getByRole('heading', { name: 'Duyên phận đôi lứa', level: 2 })
    ).toBeInTheDocument();

    // Điểm tổng hiển thị công khai dạng x/100 kèm nhãn "Điểm hợp nhau".
    const score = within(result).getByTestId('compatibility-score');
    expect(score.textContent ?? '').toMatch(/\d{1,3}\/100/);
    expect(score).toHaveTextContent('Điểm hợp nhau');
    expect(score).toHaveAttribute('role', 'img');
    expect(score.getAttribute('aria-label') ?? '').toMatch(
      /^Điểm hợp nhau \d{1,3} trên 100$/
    );

    // Nhãn tổng kết định tính đã bị gỡ bỏ hoàn toàn.
    expect(within(result).queryByTestId('compatibility-level')).not.toBeInTheDocument();

    const conclusion = within(result).getByTestId('compatibility-conclusion');
    expect(conclusion).toHaveAttribute('data-tone', 'balanced');
    const conclusionQuote = (conclusion.textContent ?? '').replace(/[“”"]/g, '').trim();
    expect(conclusionQuote.length).toBeGreaterThan(0);
    expect(CONCLUSION_QUOTES.balanced).toContain(conclusionQuote);
    expect(conclusionQuote).not.toMatch(/\d+(?:[.,]\d+)?\s*\/\s*(?:10|100)\b/);

    // Hồ sơ cố định tạo lá số đầy đủ: không có cảnh báo dữ liệu và tiêu đề luận giải.
    expect(within(result).getByText('Kết quả luận giải')).toBeInTheDocument();
    expect(within(result).queryByTestId('compatibility-data-quality')).not.toBeInTheDocument();

    // Năm khía cạnh hiển thị điểm số x/10, không còn nhãn định tính.
    for (const { key, label } of ASPECT_CARDS) {
      expect(within(result).getByRole('heading', { name: label, level: 3 })).toBeInTheDocument();

      const aspectBadge = within(result).getByTestId(`compatibility-aspect-${key}`);
      const badgeText = (aspectBadge.textContent ?? '').trim();
      expect(badgeText).toMatch(/^\d+(?:[.,]\d+)?\/10$/);
      // A numeric badge cannot carry a qualitative level/quality label.
      expect(badgeText).not.toMatch(/[A-Za-zÀ-ỹ]/);
      expect(aspectBadge).toHaveAttribute('role', 'img');
      const ariaLabel = aspectBadge.getAttribute('aria-label') ?? '';
      expect(ariaLabel).toContain(`${label}: `);
      expect(ariaLabel).toMatch(/\d+(?:[.,]\d+)?\/10$/);

      const card = aspectBadge.closest('li') as HTMLElement | null;
      expect(card).not.toBeNull();
      const cardElement = card as HTMLElement;

      const paragraphs = Array.from(cardElement.querySelectorAll('p'));
      expect(paragraphs.length).toBeGreaterThanOrEqual(3);
      // Meaning and explanation remain visible, followed by the aspect tip.
      expect(paragraphs[0].textContent?.trim().length).toBeGreaterThan(0);
      const explanation = paragraphs[1].textContent ?? '';
      expect(explanation.trim().length).toBeGreaterThan(0);
      expect(paragraphs[2]).toHaveTextContent(/Lời khuyên:/);
    }

    expect(
      within(result).getByRole('heading', { name: 'Điểm hòa hợp', level: 3 })
    ).toBeInTheDocument();
    expect(
      within(result).getByRole('heading', { name: 'Điều cần lưu tâm', level: 3 })
    ).toBeInTheDocument();

    // The standalone timing block was removed from the result panel.
    expect(within(result).queryByTestId('compatibility-timing')).not.toBeInTheDocument();
    expect(within(result).queryByText('Thời vận tham khảo')).not.toBeInTheDocument();
    expect(
      within(result).queryByRole('heading', { name: 'Thời vận tham khảo' })
    ).not.toBeInTheDocument();

    // Phương pháp nêu phiên bản, trọng số 20/30/20/20/10 và caveat.
    const method = within(result).getByTestId('compatibility-method');
    expect(method).toHaveTextContent('Mô hình tham chiếu phiên bản 2.0.0');
    expect(method).toHaveTextContent('Nền tảng bản mệnh: 20%');
    expect(method).toHaveTextContent('Cung Phu Thê: 30%');
    expect(method).toHaveTextContent('Tương hợp tinh tú: 20%');
    expect(method).toHaveTextContent('Can Chi bốn trụ: 20%');
    expect(method).toHaveTextContent('Tương tác cung vị: 10%');
    expect(method).toHaveTextContent(/không phải công thức số học chính thống/i);

    // Phương pháp nêu rõ phần chồng lấn và bản chất biên soạn, không phải quy định cổ điển.
    expect(method).toHaveTextContent(/chồng lấn/i);
    expect(method).toHaveTextContent(/biên soạn/i);
    expect(method).toHaveTextContent(/không phải quy định cổ điển/i);

    // Ngoài phần phương pháp, kết quả có điểm tổng /100 và đủ năm khía cạnh /10.
    const resultWithoutMethod = result.cloneNode(true) as HTMLElement;
    resultWithoutMethod.querySelector('[data-testid="compatibility-method"]')?.remove();
    const renderedText = resultWithoutMethod.textContent ?? '';
    expect(renderedText).toMatch(/\d{1,3}\/100/);

    const scoreWithoutMethod = resultWithoutMethod.querySelector<HTMLElement>(
      '[data-testid="compatibility-score"]'
    );
    expect(scoreWithoutMethod).not.toBeNull();
    expect(scoreWithoutMethod?.textContent ?? '').toMatch(/\d{1,3}\/100/);

    const aspectBadges = Array.from(
      resultWithoutMethod.querySelectorAll<HTMLElement>('[data-testid^="compatibility-aspect-"]')
    );
    expect(aspectBadges).toHaveLength(5);
    aspectBadges.forEach((badge) => {
      expect((badge.textContent ?? '').trim()).toMatch(/^\d+(?:[.,]\d+)?\/10$/);
    });

    // Lời khuyên chung là khối riêng, tách khỏi câu kết luận ở đầu kết quả.
    const adviceHeading = within(result).getByRole('heading', {
      name: 'Lời khuyên chung',
      level: 3,
    });
    expect(adviceHeading).toBeInTheDocument();
    const adviceSection = adviceHeading.closest('section') as HTMLElement | null;
    expect(adviceSection).not.toBeNull();
    const adviceElement = adviceSection as HTMLElement;
    expect(adviceElement).not.toBe(conclusion.closest('section'));
    expect(adviceElement).not.toContainElement(conclusion);
    expect(conclusion).not.toContainElement(adviceElement);
    expect(adviceElement.textContent ?? '').not.toMatch(/\d+(?:[.,]\d+)?\s*\/\s*(?:100|10)\b/);
    const adviceText = Array.from(adviceElement.querySelectorAll('p'))
      .map((paragraph) => paragraph.textContent?.trim() ?? '')
      .join(' ');
    expect(adviceText.length).toBeGreaterThan(0);

    // The result replaces the form in the second (right) column of the grid.
    const aside = getEmblem().closest('aside') as HTMLElement;
    // The grid is the parent of the aside's mobile order wrapper.
    const grid = aside.parentElement?.parentElement as HTMLElement;
    const rightColumn = result.parentElement as HTMLElement;
    expect(grid.className).toContain('lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]');
    expect(Array.from(grid.children).indexOf(rightColumn)).toBe(1);
    expect(grid).toContainElement(result);
    expect(aside).not.toContainElement(result);

    fireEvent.click(within(result).getByRole('button', { name: 'Chỉnh sửa thông tin' }));

    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
    expect(getLiveStatus()).toHaveTextContent('');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');
    expect(screen.getAllByLabelText(/^Họ tên/)[0]).toHaveFocus();
  });

  it('renders one responsive overall score badge and /10 aspect labels for mobile and desktop', (): void => {
    const partial = calculateCompatibility({} as ZiweiChart, {} as ZiweiChart, {
      currentYear: 2026,
    });
    render(
      <CompatibilityResult
        result={partial}
        headingId="responsive-score-heading"
        strengthsHeadingId="responsive-strengths-heading"
        challengesHeadingId="responsive-challenges-heading"
        sectionRef={createRef<HTMLElement>()}
        onReset={(): void => {}}
      />
    );

    // The same element carries the mobile (h-28 w-28) and sm+ (h-32 w-32)
    // sizes, so mobile and desktop share one responsive score badge.
    const score = screen.getByTestId('compatibility-score');
    expect(score).toHaveClass('h-28', 'w-28', 'sm:h-32', 'sm:w-32');
    expect(score.textContent ?? '').toMatch(/\d{1,3}\/100/);
    expect(score).toHaveTextContent('Điểm hợp nhau');
    expect(screen.queryByTestId('compatibility-level')).not.toBeInTheDocument();

    // Every aspect badge exposes a numeric x/10 in both its text and its
    // accessible label, regardless of viewport.
    ASPECT_KEYS.forEach((key) => {
      const badge = screen.getByTestId(`compatibility-aspect-${key}`);
      expect(badge).toHaveAttribute('role', 'img');
      expect((badge.textContent ?? '').trim()).toMatch(/^\d+(?:[.,]\d+)?\/10$/);
      expect(badge.getAttribute('aria-label') ?? '').toMatch(/\d+(?:[.,]\d+)?\/10$/);
    });
  });

  it('scrolls the emblem wrapper to the start when a valid submit enters merging', (): void => {
    const { scrollIntoView, restore } = stubScrollIntoView();

    try {
      render(<CompatibilityForm />);
      fillBothProfiles();
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
      expect(getEmblem()).toHaveAttribute('data-phase', 'merging');
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(scrollIntoView.mock.contexts[0]).toBe(getEmblemWrapper());
    } finally {
      restore();
    }
  });

  it('does not scroll the emblem wrapper when the submit is invalid', (): void => {
    const { scrollIntoView, restore } = stubScrollIntoView();

    try {
      render(<CompatibilityForm />);
      fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
      expect(scrollIntoView).not.toHaveBeenCalled();
    } finally {
      restore();
    }
  });

  it('keeps the emblem first on mobile while preserving the desktop column order', (): void => {
    render(<CompatibilityForm />);

    const emblemWrapper = getEmblemWrapper();
    const grid = emblemWrapper.parentElement as HTMLElement;
    const rightWrapper = grid.children[1] as HTMLElement;

    expect(grid.children).toHaveLength(2);
    expect(grid.children[0]).toBe(emblemWrapper);
    expect(Array.from(emblemWrapper.classList)).toContain('lg:order-1');
    expect(Array.from(emblemWrapper.classList)).not.toContain('order-2');
    expect(Array.from(rightWrapper.classList)).toContain('lg:order-2');
    expect(Array.from(rightWrapper.classList)).not.toContain('order-1');
  });

  it('keeps a revealed result below the emblem in the mobile grid order', (): void => {
    installReducedMotion(true);
    render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    const result = screen.getByTestId('compatibility-result');
    const emblemWrapper = getEmblemWrapper();
    const grid = emblemWrapper.parentElement as HTMLElement;
    const rightWrapper = result.parentElement as HTMLElement;

    expect(grid.children[0]).toBe(emblemWrapper);
    expect(grid.children[1]).toBe(rightWrapper);
    expect(grid.children.length).toBe(2);
    expect(Array.from(grid.children).indexOf(rightWrapper)).toBeGreaterThan(
      Array.from(grid.children).indexOf(emblemWrapper)
    );
    expect(rightWrapper).toContainElement(result);
  });

  it('gives the revealed result a desktop-only fixed-height scroll area', (): void => {
    installReducedMotion(true);
    render(<CompatibilityForm />);
    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    const result = screen.getByTestId('compatibility-result');
    // Tokenize via classList: `lg:overflow-y-auto` contains `overflow-y-auto`
    // as a substring, so a raw string check would give a false positive.
    const resultClasses = Array.from(result.classList);

    // Scroll chaining stays at the page default: no overscroll containment.
    expect(resultClasses).not.toContain('overscroll-contain');
    expect(resultClasses).toContain('lg:h-[calc(100svh_-_8rem)]');
    expect(resultClasses).toContain('lg:overflow-y-auto');

    // Mobile keeps its natural height: no unprefixed overflow or height token.
    expect(resultClasses).not.toContain('overflow-y-auto');
    expect(
      resultClasses.filter((token) => /^(?:min-|max-)?h-/.test(token))
    ).toEqual([]);
  });

  it('reveals immediately and renders the static emblem path under reduced motion', (): void => {
    installReducedMotion(true);
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    // No timer advance: the result is already revealed before any merge delay.
    const result = screen.getByTestId('compatibility-result');
    expect(result).toBeInTheDocument();
    expect(getLiveStatus()).toHaveTextContent('Đã hoàn tất luận giải duyên đôi lứa.');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');

    const emblem = getEmblem();
    expect(emblem).toHaveAttribute('data-phase', 'revealed');
    expect(emblem).toHaveAttribute('data-animate', 'false');
    expect(emblem).toHaveAttribute('data-live', 'false');
    expect(emblem.className).not.toContain('love-emblem-live');
    expect(
      emblem.querySelectorAll(
        '.love-emblem-smooth, [class*="love-emblem-merge"], [class*="love-emblem-merged"]'
      )
    ).toHaveLength(0);
    expect(emblem.querySelectorAll('[class*="animate-"]')).toHaveLength(0);
  });

  it('reveals immediately when reduced motion turns on mid-merge', (): void => {
    const media = installReducedMotion(false);
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));

    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getLiveStatus()).toHaveTextContent('Đang hoà quyện hai lá số…');
    expect(getEmblem()).toHaveAttribute('data-phase', 'merging');
    expect(getEmblem()).toHaveAttribute('data-animate', 'true');

    act((): void => media.setMatches(true));

    // The pending timer is cancelled and the already-computed result is revealed.
    const result = screen.getByTestId('compatibility-result');
    expect(result).toBeInTheDocument();
    expect(getLiveStatus()).toHaveTextContent('Đã hoàn tất luận giải duyên đôi lứa.');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');
    expect(getEmblem()).toHaveAttribute('data-phase', 'revealed');
    expect(getEmblem()).toHaveAttribute('data-animate', 'false');
    expect(
      getEmblem().querySelectorAll(
        '.love-emblem-smooth, [class*="love-emblem-merge"], [class*="love-emblem-merged"]'
      )
    ).toHaveLength(0);

    // Even after the original merge timer would have elapsed, nothing stale appears.
    advanceMerge();
    expect(screen.getByTestId('compatibility-result')).toBe(result);
    expect(getLiveStatus()).toHaveTextContent('Đã hoàn tất luận giải duyên đôi lứa.');
  });

  it('resets a revealed result to idle and keeps it idle when either profile is edited', (): void => {
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    advanceMerge();
    const firstResult = screen.getByTestId('compatibility-result');
    expect(firstResult).toBeInTheDocument();

    // The form is replaced by the result, so the edit control is the only way
    // back to the fields; it must fully reset the revealed outcome.
    fireEvent.click(within(firstResult).getByRole('button', { name: 'Chỉnh sửa thông tin' }));

    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
    expect(getLiveStatus()).toBeEmptyDOMElement();
    expect(screen.getAllByLabelText(/^Họ tên/)[0]).toHaveFocus();

    fireEvent.change(screen.getAllByLabelText(/^Năm/)[0], { target: { value: '1991' } });
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');

    fireEvent.change(screen.getAllByLabelText(/^Giờ sinh/)[1], { target: { value: '15' } });
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');

    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    advanceMerge();
    const secondResult = screen.getByTestId('compatibility-result');
    expect(secondResult).toBeInTheDocument();

    fireEvent.click(within(secondResult).getByRole('button', { name: 'Chỉnh sửa thông tin' }));
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
    expect(getLiveStatus()).toBeEmptyDOMElement();
    expect(screen.getAllByLabelText(/^Họ tên/)[0]).toHaveFocus();
  });

  it('cancels a pending merge when a profile is edited and never reveals a stale result', (): void => {
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    fillBothProfiles();
    fireEvent.click(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' }));
    expect(getLiveStatus()).toHaveTextContent('Đang hoà quyện hai lá số…');
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'true');

    advanceMerge(500);
    fireEvent.change(screen.getAllByLabelText(/^Năm/)[0], { target: { value: '1991' } });

    expect(getLiveStatus()).toBeEmptyDOMElement();
    expect(getRightColumn()).toHaveAttribute('aria-busy', 'false');
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');

    advanceMerge(MERGE_DURATION_MS * 2);
    expect(screen.queryByTestId('compatibility-result')).not.toBeInTheDocument();
    expect(getLiveStatus()).toBeEmptyDOMElement();
    expect(getEmblem()).toHaveAttribute('data-phase', 'idle');
  });

  it('shows the data-quality warning and reference header only for partial results', (): void => {
    const partial = calculateCompatibility({} as ZiweiChart, {} as ZiweiChart, {
      currentYear: 2026,
    });
    const sectionRef = createRef<HTMLElement>();
    const { rerender } = render(
      <CompatibilityResult
        result={partial}
        headingId="partial-result-heading"
        strengthsHeadingId="partial-strengths-heading"
        challengesHeadingId="partial-challenges-heading"
        sectionRef={sectionRef}
        onReset={(): void => {}}
      />
    );

    expect(screen.getByText('Kết quả tham khảo')).toBeInTheDocument();
    const quality = screen.getByTestId('compatibility-data-quality');
    expect(quality).toHaveTextContent('Dữ liệu chưa đầy đủ');
    expect(quality).toHaveTextContent('thiếu toàn bộ 12 cung');
    expect(screen.queryByText('Kết quả luận giải')).not.toBeInTheDocument();

    const full = { ...partial, dataQuality: 'full' as const, dataWarnings: [] };
    rerender(
      <CompatibilityResult
        result={full}
        headingId="full-result-heading"
        strengthsHeadingId="full-strengths-heading"
        challengesHeadingId="full-challenges-heading"
        sectionRef={sectionRef}
        onReset={(): void => {}}
      />
    );

    expect(screen.getByText('Kết quả luận giải')).toBeInTheDocument();
    expect(screen.queryByTestId('compatibility-data-quality')).not.toBeInTheDocument();
    expect(screen.queryByText('Kết quả tham khảo')).not.toBeInTheDocument();
  });

  it('renders the decorative emblem with eyebrow and honest trust line without the old hero title', (): void => {
    render(<HopTuoiPage />);

    // The old "Tình Duyên / Tử Vi" h1 hero was removed; only the panel eyebrow remains.
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByText('Tình Duyên')).not.toBeInTheDocument();

    const panel = screen.getByLabelText('Thiên Bàn Tử Vi');
    expect(panel.tagName.toLowerCase()).toBe('aside');
    expect(within(panel).getByText('Thiên Bàn Tử Vi')).toBeInTheDocument();
    expect(within(panel).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(panel).queryByText('Tình Duyên')).not.toBeInTheDocument();
    expect(within(panel).queryByText('Tử Vi')).not.toBeInTheDocument();

    const emblem = screen.getByTestId('tinh-duyen-emblem');
    expect(emblem).toHaveAttribute('aria-hidden', 'true');
    expect(emblem.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(emblem.querySelector('svg')).toHaveAttribute('focusable', 'false');

    expect(screen.getByRole('button', { name: 'Luận Định Duyên Đôi Lứa' })).toBeInTheDocument();

    const pageText = document.body.textContent ?? '';
    expect(pageText).not.toMatch(/12[.,\s]?847|cặp duyên|khách hàng đã|đánh giá từ/i);
  });

  it('renders the redesigned Thiên Bàn Tử Vi emblem with animal images, stars and continuous bagua', (): void => {
    render(<TinhDuyenEmblem />);

    const emblem = getEmblem();
    const svg = emblem.querySelector('svg') as SVGSVGElement;

    // The larger wrapper is 29rem on mobile and 32rem from sm upward.
    expect(emblem.className).toContain('max-w-[29rem]');
    expect(emblem.className).toContain('sm:max-w-[32rem]');
    expect(emblem.className).not.toContain('max-w-[27rem]');
    expect(emblem.className).not.toContain('sm:max-w-[30rem]');
    expect(emblem.className).not.toContain('max-w-[24rem]');
    expect(emblem.className).not.toContain('sm:max-w-[26rem]');

    // Deep red-black background and the cloud-pattern layer.
    const background = svg.querySelector('radialGradient#love-emblem-bg');
    expect(background).not.toBeNull();
    const backgroundStops = Array.from(background?.querySelectorAll('stop') ?? []).map((stop) =>
      stop.getAttribute('stop-color')
    );
    expect(backgroundStops).toContain('#1c0505');
    expect(backgroundStops).toContain('#120303');
    const cloudPattern = svg.querySelector('pattern#love-emblem-cloud-pattern');
    expect(cloudPattern).not.toBeNull();
    expect(cloudPattern?.querySelectorAll('path').length).toBeGreaterThanOrEqual(3);
    expect(svg.querySelector('circle[fill="url(#love-emblem-cloud-pattern)"]')).not.toBeNull();

    // 12 animal cells: local WebP images clipped into centered circles with
    // only the Han branch glyph as text (no Vietnamese animal captions).
    const branches = Array.from(emblem.querySelectorAll<SVGElement>('[data-branch-index]'));
    expect(branches).toHaveLength(12);
    expect(branches.map((branch) => branch.getAttribute('data-branch-index'))).toEqual(
      LOVE_BRANCHES.map((_, index) => String(index))
    );
    expect(new Set(branches.map((branch) => branch.getAttribute('data-animal'))).size).toBe(12);

    const images = Array.from(emblem.querySelectorAll<SVGImageElement>('image'));
    expect(images).toHaveLength(12);
    expect(svg.querySelectorAll('image')).toHaveLength(12);
    const hrefs = images.map((image) => image.getAttribute('href') ?? '');
    expect(hrefs).toEqual(LOVE_BRANCHES.map((branch) => `/images/zodiac-love/${branch.slug}.webp`));
    expect(new Set(hrefs).size).toBe(12);

    // The old 29px images and r14.5 clips are gone.
    expect(emblem.querySelectorAll('image[width="29"], image[height="29"]')).toHaveLength(0);
    expect(emblem.querySelectorAll('circle[r="14.5"]')).toHaveLength(0);

    LOVE_BRANCHES.forEach((expected, index) => {
      const branch = branches[index];
      const image = images[index];
      const href = `/images/zodiac-love/${expected.slug}.webp`;
      const center = animalCenter(index);
      const glyph = animalGlyphPosition(index);

      expect(branch).toHaveAttribute('data-animal', expected.animal);
      // The Han glyph remains; the old Vietnamese caption is gone.
      expect(getDirectTexts(branch)).toEqual([expected.han]);
      expect(branch).not.toHaveTextContent(expected.label);
      expect(branch.querySelector('image')).toBe(image);

      expect(image.getAttribute('href')).toBe(href);
      expect(existsSync(path.join(process.cwd(), 'public', href))).toBe(true);
      expect(image).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
      expect(image.getAttribute('clip-path')).toBe(
        `url(#love-emblem-animal-clip-${expected.slug})`
      );

      const clipPath = svg.querySelector(`clipPath#love-emblem-animal-clip-${expected.slug}`);
      expect(clipPath).not.toBeNull();
      const clipCircle = clipPath?.querySelector('circle') as SVGCircleElement | null;
      expect(clipCircle).not.toBeNull();
      expect(Number(clipCircle?.getAttribute('r'))).toBe(18);
      expect(Number(clipCircle?.getAttribute('r'))).toBe(ANIMAL_CLIP_RADIUS);
      expect(Number(clipCircle?.getAttribute('cx'))).toBeCloseTo(center.x, 2);
      expect(Number(clipCircle?.getAttribute('cy'))).toBeCloseTo(center.y, 2);

      // The dark disc behind each image is r19.5 and shares the same centre.
      const disc = branch.querySelector<SVGCircleElement>('circle[r="19.5"]');
      expect(disc).not.toBeNull();
      expect(Number(disc?.getAttribute('r'))).toBe(ANIMAL_DISC_RADIUS);
      expect(Number(disc?.getAttribute('cx'))).toBeCloseTo(center.x, 2);
      expect(Number(disc?.getAttribute('cy'))).toBeCloseTo(center.y, 2);

      const size = Number(image.getAttribute('width'));
      expect(size).toBe(36);
      expect(size).toBe(ANIMAL_IMAGE_SIZE);
      expect(Number(image.getAttribute('height'))).toBe(ANIMAL_IMAGE_SIZE);
      expect(Number(image.getAttribute('x')) + size / 2).toBeCloseTo(center.x, 2);
      expect(Number(image.getAttribute('y')) + size / 2).toBeCloseTo(center.y, 2);

      // The Han marker sits on the inner edge at radius 145, not on the image.
      const glyphText = branch.querySelector<SVGTextElement>('text');
      expect(glyphText).not.toBeNull();
      expect(Number(glyphText?.getAttribute('x'))).toBeCloseTo(glyph.x, 2);
      expect(Number(glyphText?.getAttribute('y'))).toBeCloseTo(glyph.y + 2.7, 2);
    });
    LOVE_BRANCHES.forEach(({ label }) => expect(emblem).not.toHaveTextContent(label));
    // The outer ring still includes the degree ticks.
    expect(svg.querySelectorAll('line').length).toBeGreaterThanOrEqual(120);

    // 14 major-star Han glyphs on the inner ring.
    const stars = Array.from(emblem.querySelectorAll<SVGElement>('[data-star]'));
    expect(stars).toHaveLength(14);
    expect(new Set(stars.map((star) => star.getAttribute('data-star'))).size).toBe(14);
    stars.forEach((star) => {
      const han = star.getAttribute('data-star') ?? '';
      expect(han).not.toBe('');
      expect(getDirectTexts(star)).toContain(han);
    });

    // One neutral, continuous bagua replaces the old person medallions: an outer
    // r68 octagon, an inner r48 octagon and all eight unique trigrams. There are
    // no halves, closing seams or live tone/name/gender data attributes.
    const bagua = getBagua();
    const baguaPaths = Array.from(bagua.children).filter(
      (child): child is SVGPathElement => child.tagName.toLowerCase() === 'path'
    );
    expect(baguaPaths).toHaveLength(2);
    const outerBagua = baguaPaths.find(
      (pathNode) => pathNode.getAttribute('fill') === 'url(#love-emblem-bagua)'
    );
    const innerBagua = baguaPaths.find(
      (pathNode) => pathNode.getAttribute('fill') === '#120303'
    );
    expect(outerBagua).toBeDefined();
    expect(innerBagua).toBeDefined();
    expect(getOctagonRadius(outerBagua as SVGPathElement)).toBeCloseTo(68, 2);
    expect(getOctagonRadius(innerBagua as SVGPathElement)).toBeCloseTo(48, 2);
    expect(outerBagua?.getAttribute('d')).toMatch(/Z$/);
    expect(innerBagua?.getAttribute('d')).toMatch(/Z$/);

    // No closing seam: the bagua group has no direct line child, and the old
    // per-person/per-half markers are gone.
    expect(
      Array.from(bagua.children).filter((child) => child.tagName.toLowerCase() === 'line')
    ).toHaveLength(0);
    expect(bagua.querySelectorAll('[data-person], [data-half]')).toHaveLength(0);
    expect(bagua).not.toHaveAttribute('data-tone');
    expect(bagua).not.toHaveAttribute('data-name-active');
    expect(bagua).not.toHaveAttribute('data-gender-active');
    expect(bagua).not.toHaveAttribute('data-polarity');
    expect(bagua).not.toHaveAttribute('data-active');
    expect(getDirectTexts(bagua)).toHaveLength(0);

    const trigrams = Array.from(bagua.querySelectorAll<SVGElement>('[data-trigram]'));
    expect(trigrams).toHaveLength(8);
    expect(new Set(trigrams.map((trigram) => trigram.getAttribute('data-trigram'))).size).toBe(8);
    trigrams.forEach((trigram) => {
      expect(trigram.parentElement).toBe(bagua);
      expect(trigram.querySelectorAll('line').length).toBeGreaterThanOrEqual(3);
    });
    ['PHU THÊ', '夫妻', '日', '月', 'DƯƠNG', 'ÂM'].forEach((label) => {
      expect(emblem).not.toHaveTextContent(label);
    });

    // The vertical divider through the centre is gone (it used to sit between
    // the two bagua halves).
    const verticalDividers = Array.from(svg.querySelectorAll('line')).filter((line) => {
      const x1 = Number(line.getAttribute('x1'));
      const x2 = Number(line.getAttribute('x2'));
      const y1 = Number(line.getAttribute('y1'));
      const y2 = Number(line.getAttribute('y2'));
      return (
        x1 === EMBLEM_CENTER &&
        x2 === EMBLEM_CENTER &&
        Math.min(y1, y2) < EMBLEM_CENTER &&
        Math.max(y1, y2) > EMBLEM_CENTER
      );
    });
    expect(verticalDividers).toHaveLength(0);

    // The yin-yang root exposes the two polarity flags; it is now a classic
    // black/white emblem rather than two person-bound halves or gold/jade drops.
    const yinYang = getYinYang();
    expect(yinYang).toHaveAttribute('data-duong-active', 'false');
    expect(yinYang).toHaveAttribute('data-am-active', 'false');
    expect(yinYang.querySelectorAll('[data-person], [data-half]')).toHaveLength(0);
    expect(
      yinYang.querySelectorAll('[data-tone], [data-name-active], [data-gender-active]')
    ).toHaveLength(0);
    expect(yinYang.querySelectorAll('[clip-path]')).toHaveLength(0);
    expect(
      Array.from(svg.querySelectorAll('clipPath')).filter((clipPath) =>
        /yin-yang|half|left|right/i.test(clipPath.getAttribute('id') ?? '')
      )
    ).toHaveLength(0);

    // Both polarity groups are always rendered at full opacity; only their
    // fills and glow change with the genders present.
    const duong = getPolarity('duong');
    const am = getPolarity('am');
    [duong, am].forEach((group) => {
      expect(group).toHaveAttribute('data-active', 'false');
      expect(group.getAttribute('opacity') ?? '1').toBe('1');
      expect(group).not.toHaveAttribute('filter');
    });

    // No standalone grey base layer; the Dương base circle lives in its group.
    expect(yinYang.querySelector('.love-emblem-yinyang-base')).toBeNull();
    const duongBase = getDuongBase();
    expect(duongBase).toHaveAttribute('cx', '200');
    expect(duongBase).toHaveAttribute('cy', '200');
    expect(duongBase).toHaveAttribute('fill', '#8a8a8a');
    expect(duongBase).not.toHaveAttribute('filter');

    // The Dương top dot and Âm bottom dot are both r4.9 and muted by default.
    const duongDot = getPolarityDot('duong');
    expect(duongDot).toHaveAttribute('cx', '200');
    expect(duongDot).toHaveAttribute('cy', '185');
    expect(duongDot).toHaveAttribute('fill', '#3a3a3a');
    expect(duongDot.parentElement).toBe(duong);
    const amDot = getPolarityDot('am');
    expect(amDot).toHaveAttribute('cx', '200');
    expect(amDot).toHaveAttribute('cy', '215');
    expect(amDot).toHaveAttribute('fill', '#9a9a9a');
    expect(amDot.parentElement).toBe(am);
    expect(yinYang.querySelectorAll('[data-polarity] circle[r="4.4"]')).toHaveLength(0);

    // The Âm half is a single classic S-path (left outer + bottom lobe), not a
    // mirrored teardrop. Its muted default is dark grey, with no glow.
    expect(duong.querySelectorAll('path')).toHaveLength(0);
    const amPath = getAmPath();
    const amD = amPath.getAttribute('d') ?? '';
    expect(amD).toMatch(/^M200,170/);
    expect(amD.endsWith('Z')).toBe(true);
    expect(getArcSweeps(amD)).toHaveLength(3);
    expect(amPath).toHaveAttribute('fill', '#333333');
    expect(amPath).not.toHaveAttribute('filter');

    // No gold/jade fills anywhere in the yin-yang.
    const yinYangFills = Array.from(yinYang.querySelectorAll('[fill]')).map((element) =>
      element.getAttribute('fill')
    );
    expect(yinYangFills).not.toContain('url(#love-emblem-gold)');
    expect(yinYangFills).not.toContain('url(#love-emblem-jade)');
    expect(yinYangFills).not.toContain('#d4af37');
    expect(yinYangFills).not.toContain('#7fe0b4');

    // The 緣 glyph still sits at the centre.
    expect(emblem).toHaveTextContent('緣');

    // The old person medallions and their r=35 glow circles are gone.
    expect(emblem.querySelectorAll('[data-person] circle[r="35"]')).toHaveLength(0);
    expect(svg.querySelectorAll('circle[r="35"]')).toHaveLength(0);

    // Glow filters exist and are wired to the branch/star rings; the white/gold
    // polarity glow is available for the active yin-yang half. The red glow
    // belonged to the removed red thread, so it is gone too.
    [
      'love-emblem-glow-soft',
      'love-emblem-glow-gold',
      'love-emblem-glow-jade',
      'love-emblem-glow-polarity',
    ].forEach((id) => {
      expect(svg.querySelector(`filter[id="${id}"]`)).not.toBeNull();
    });
    expect(svg.querySelector('filter[id="love-emblem-glow-red"]')).toBeNull();
    expect((branches[0].parentElement as unknown as SVGElement).getAttribute('filter')).toBe(
      'url(#love-emblem-glow-soft)'
    );
    expect((stars[0].parentElement as unknown as SVGElement).getAttribute('filter')).toBe(
      'url(#love-emblem-glow-soft)'
    );
  });

  it('maps yin-yang polarity to the genders present with classic black/white/grey tones', (): void => {
    const unset = preview();
    const nam = preview({ name: 'Mệnh chủ thứ nhất', gender: 'nam' });
    const nu = preview({ gender: 'nu' });
    const { rerender } = render(
      <TinhDuyenEmblem personPreviews={[unset, unset]} phase="idle" animate />
    );

    const assertPolarity = (duongActive: boolean, amActive: boolean): void => {
      const yinYang = getYinYang();
      expect(yinYang).toHaveAttribute('data-duong-active', String(duongActive));
      expect(yinYang).toHaveAttribute('data-am-active', String(amActive));

      const duong = getPolarity('duong');
      const am = getPolarity('am');
      expect(duong).toHaveAttribute('data-active', String(duongActive));
      expect(am).toHaveAttribute('data-active', String(amActive));

      // Both groups are always rendered at full opacity; no fading either way.
      expect(duong.getAttribute('opacity') ?? '1').toBe('1');
      expect(am.getAttribute('opacity') ?? '1').toBe('1');

      // Dương: white base circle + black top dot when a male is present.
      const duongBase = getDuongBase();
      expect(duongBase).toHaveAttribute('fill', duongActive ? '#f4efe2' : '#8a8a8a');
      expect(getPolarityDot('duong')).toHaveAttribute(
        'fill',
        duongActive ? '#050505' : '#3a3a3a'
      );

      // Âm: black S-path + white bottom dot when a female is present.
      const amPath = getAmPath();
      expect(amPath).toHaveAttribute('fill', amActive ? '#080808' : '#333333');
      expect(getPolarityDot('am')).toHaveAttribute('fill', amActive ? '#f7f2e6' : '#9a9a9a');

      // Only the active half receives the white/gold polarity glow; the other
      // stays muted and the group wrappers never carry the old gold/jade filters.
      if (duongActive) {
        expect(duongBase).toHaveAttribute('filter', 'url(#love-emblem-glow-polarity)');
      } else {
        expect(duongBase).not.toHaveAttribute('filter');
      }
      if (amActive) {
        expect(amPath).toHaveAttribute('filter', 'url(#love-emblem-glow-polarity)');
      } else {
        expect(amPath).not.toHaveAttribute('filter');
      }
      expect(duong).not.toHaveAttribute('filter');
      expect(am).not.toHaveAttribute('filter');

      // No gold/jade fills in any polarity state.
      const fills = Array.from(yinYang.querySelectorAll('[fill]')).map((element) =>
        element.getAttribute('fill')
      );
      expect(fills).not.toContain('url(#love-emblem-gold)');
      expect(fills).not.toContain('url(#love-emblem-jade)');
      expect(fills).not.toContain('#d4af37');
      expect(fills).not.toContain('#7fe0b4');
    };

    // Default (no gender): both halves muted grey/dark grey, no glow.
    assertPolarity(false, false);
    const svg = getEmblem().querySelector('svg') as SVGSVGElement;
    expect(svg.querySelector('#love-emblem-gold')).toBeNull();
    expect(svg.querySelector('#love-emblem-jade')).toBeNull();
    expect(getYinYang().querySelector('.love-emblem-yinyang-base')).toBeNull();

    // One nam → only Dương active.
    rerender(<TinhDuyenEmblem personPreviews={[nam, unset]} phase="idle" animate />);
    assertPolarity(true, false);
    expect(getPolarity('duong')).not.toHaveTextContent('日');
    expect(getPolarity('duong')).not.toHaveTextContent('DƯƠNG');

    // One nữ → only Âm active.
    rerender(<TinhDuyenEmblem personPreviews={[unset, nu]} phase="idle" animate />);
    assertPolarity(false, true);
    expect(getPolarity('am')).not.toHaveTextContent('月');
    expect(getPolarity('am')).not.toHaveTextContent('ÂM');

    // Both genders → both active.
    rerender(<TinhDuyenEmblem personPreviews={[nam, nu]} phase="idle" animate />);
    assertPolarity(true, true);

    // Two nam → only Dương; two nữ → only Âm.
    rerender(<TinhDuyenEmblem personPreviews={[nam, nam]} phase="idle" animate />);
    assertPolarity(true, false);
    rerender(<TinhDuyenEmblem personPreviews={[nu, nu]} phase="idle" animate />);
    assertPolarity(false, true);

    // A name alone never changes polarity.
    rerender(
      <TinhDuyenEmblem
        personPreviews={[preview({ name: 'Chỉ có tên' }), unset]}
        phase="idle"
        animate
      />
    );
    assertPolarity(false, false);
  });

  it('keeps all 14 star labels dim by default and never lights them just because both profiles are complete', (): void => {
    const completeFirst = preview({
      name: 'Mệnh chủ thứ nhất',
      gender: 'nam',
      day: '15',
      month: '5',
      year: '1990',
      hour: '10',
    });
    const completeSecond = preview({
      name: 'Mệnh chủ thứ hai',
      gender: 'nu',
      day: '20',
      month: '8',
      year: '1992',
      hour: '14',
    });

    const { rerender } = render(<TinhDuyenEmblem />);

    const assertAllDim = (): void => {
      const stars = getStarsGroup();
      const starNodes = Array.from(stars.querySelectorAll<SVGElement>('[data-star-key]'));
      expect(starNodes).toHaveLength(14);
      starNodes.forEach((star) => {
        expect(star).toHaveAttribute('data-star-active', 'false');
        expect(star.querySelector('.love-emblem-star-active')).toBeNull();
        expect(star.querySelector('.love-emblem-star-pop')).toBeNull();
      });

      const texts = Array.from(stars.querySelectorAll<SVGTextElement>('text'));
      expect(texts).toHaveLength(14);
      texts.forEach((text) => {
        expect(text).toHaveAttribute('fill', '#f0d089');
        expect(text).toHaveAttribute('fill-opacity', '0.5');
      });
      expect(stars.querySelectorAll('.love-emblem-star-pop')).toHaveLength(0);
    };

    // Default emblem without chart data: every label is dim.
    assertAllDim();

    // Both profiles are complete, but no active star ids were supplied. The old
    // "complete ring lights all 14" behaviour must not return.
    rerender(
      <TinhDuyenEmblem personPreviews={[completeFirst, completeSecond]} phase="idle" animate />
    );
    expect(getStarsGroup()).toHaveAttribute('data-stars-complete', 'true');
    assertAllDim();
  });

  it('lights exactly the major stars in Mệnh, Thân or Phu Thê after both live charts load', (): void => {
    vi.useFakeTimers();
    render(<CompatibilityForm />);

    // Empty form: nothing is active.
    expect(starKeys()).toHaveLength(14);
    expect(activeStarKeys()).toEqual([]);

    fillBothProfiles();
    act((): void => {
      vi.advanceTimersByTime(280);
    });

    // The real engine confirms the fixed profile set; the form must match it.
    expect(importantMajorStarIds([FIRST_PROFILE, SECOND_PROFILE])).toEqual(
      FIXED_ACTIVE_STAR_IDS
    );
    expect(activeStarKeys()).toEqual(FIXED_ACTIVE_STAR_KEYS);
    expect(activeStarKeys()).toHaveLength(5);
    expect(activeStarKeys().length).toBeLessThan(starKeys().length);

    const starNodes = Array.from(getEmblem().querySelectorAll<SVGElement>('[data-star-key]'));
    starNodes.forEach((star) => {
      const key = star.getAttribute('data-star-key') ?? '';
      const isActive = FIXED_ACTIVE_STAR_KEYS.includes(key);
      const text = star.querySelector('text') as SVGTextElement;
      expect(star).toHaveAttribute('data-star-active', String(isActive));
      expect(text).toHaveAttribute('fill', isActive ? '#fbbf24' : '#f0d089');
      expect(text).toHaveAttribute('fill-opacity', isActive ? '1' : '0.5');

      if (isActive) {
        expect(star.querySelector('.love-emblem-star-active')).not.toBeNull();
        expect(star.querySelector('.love-emblem-star-pop')).not.toBeNull();
      } else {
        expect(star.querySelector('.love-emblem-star-active')).toBeNull();
        expect(star.querySelector('.love-emblem-star-pop')).toBeNull();
      }
    });

    // Changing the first profile's year moves its important palaces, so after
    // the debounce the active set changes as well.
    changeField(/^Năm/, 0, '1991');
    act((): void => {
      vi.advanceTimersByTime(279);
    });
    expect(activeStarKeys()).toEqual(FIXED_ACTIVE_STAR_KEYS);

    act((): void => {
      vi.advanceTimersByTime(1);
    });
    expect(importantMajorStarIds([{ ...FIRST_PROFILE, year: '1991' }, SECOND_PROFILE])).toEqual(
      CHANGED_ACTIVE_STAR_IDS
    );
    expect(activeStarKeys()).toEqual(CHANGED_ACTIVE_STAR_KEYS);
    expect(activeStarKeys()).not.toContain('vu-khuc');
    expect(activeStarKeys()).toEqual(expect.arrayContaining(['thien-co', 'thien-luong']));
  });

  it('keeps active stars bright but drops star, polarity and animal pop under reduced motion', (): void => {
    const completeFirst = preview({
      name: 'Mệnh chủ thứ nhất',
      gender: 'nam',
      day: '15',
      month: '5',
      year: '1990',
      hour: '10',
    });
    const completeSecond = preview({
      name: 'Mệnh chủ thứ hai',
      gender: 'nu',
      day: '20',
      month: '8',
      year: '1992',
      hour: '14',
    });
    const active = new Set(FIXED_ACTIVE_STAR_IDS);

    const { rerender } = render(
      <TinhDuyenEmblem
        personPreviews={[completeFirst, completeSecond]}
        activeStarIds={active}
        phase="idle"
        animate
      />
    );

    // Motion path: active stars pop, both active polarities pop, animals keep pop.
    expect(getEmblem()).toHaveAttribute('data-animate', 'true');
    expect(activeStarKeys()).toEqual(FIXED_ACTIVE_STAR_KEYS);
    expect(getEmblem().querySelectorAll('.love-emblem-star-pop')).toHaveLength(active.size);
    expect(getPolarity('duong').getAttribute('class') ?? '').toContain(
      'love-emblem-polarity-pop'
    );
    expect(getPolarity('am').getAttribute('class') ?? '').toContain('love-emblem-polarity-pop');
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop').length).toBeGreaterThan(0);

    rerender(
      <TinhDuyenEmblem
        personPreviews={[completeFirst, completeSecond]}
        activeStarIds={active}
        phase="revealed"
        animate={false}
      />
    );

    // Reduced motion: bright active stars, but no pop animation classes anywhere.
    expect(getEmblem()).toHaveAttribute('data-animate', 'false');
    expect(activeStarKeys()).toEqual(FIXED_ACTIVE_STAR_KEYS);
    expect(getEmblem().querySelectorAll('.love-emblem-star-pop')).toHaveLength(0);
    expect(getPolarity('duong').getAttribute('class') ?? '').not.toContain(
      'love-emblem-polarity-pop'
    );
    expect(getPolarity('am').getAttribute('class') ?? '').not.toContain(
      'love-emblem-polarity-pop'
    );
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);

    const activeStar = Array.from(
      getEmblem().querySelectorAll<SVGElement>('[data-star-key]')
    ).find((star) => star.getAttribute('data-star-key') === FIXED_ACTIVE_STAR_KEYS[0]);
    expect(activeStar?.querySelector('.love-emblem-star-active')).not.toBeNull();
    expect(activeStar?.querySelector('text')).toHaveAttribute('fill', '#fbbf24');
    expect(activeStar?.querySelector('text')).toHaveAttribute('fill-opacity', '1');

    // Static path: no merge classes, CSS animations or inline transitions.
    expect(
      getEmblem().querySelectorAll(
        '[class*="love-emblem-merge"], [class*="love-emblem-merged"], [class*="animate-"]'
      )
    ).toHaveLength(0);
    expect(getEmblem().querySelectorAll('[style*="animation"], [style*="transition"]')).toHaveLength(
      0
    );
  });

  it('gives active stars a gold glow and gates star/polarity pop to motion preference', (): void => {
    const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');

    const activeRuleStart = css.indexOf('.love-emblem-star-active text');
    expect(activeRuleStart).toBeGreaterThan(-1);
    const activeRuleEnd = css.indexOf('}', activeRuleStart);
    const activeRule = css.slice(activeRuleStart, activeRuleEnd);
    expect(activeRule).toMatch(/filter:\s*drop-shadow/);
    expect(activeRule).toMatch(/rgba\(251,\s*191,\s*36/);
    expect(activeRule).toMatch(/rgba\(240,\s*208,\s*137/);

    // The component pop keyframes themselves never animate; only the
    // no-preference media block applies them to active stars and polarity.
    const popKeyframesStart = css.indexOf('@keyframes love-emblem-component-pop');
    const popMediaStart = css.indexOf(
      '@media (prefers-reduced-motion: no-preference)',
      popKeyframesStart
    );
    const mergeKeyframesStart = css.indexOf('@keyframes love-emblem-merge-ring');
    expect(popKeyframesStart).toBeGreaterThan(-1);
    expect(popMediaStart).toBeGreaterThan(popKeyframesStart);

    expect(css.slice(popKeyframesStart, popMediaStart)).not.toMatch(/animation\s*:/);
    const popMedia = css.slice(popMediaStart, mergeKeyframesStart);
    expect(popMedia).toMatch(/\.love-emblem-star-pop,\s*\.love-emblem-polarity-pop/);
    expect(popMedia).toMatch(/love-emblem-component-pop\s+560ms ease-out both/);
    expect(popMedia).not.toMatch(/\binfinite\b/);
  });

  it('renders the classic yin-yang base circle and two r4.9 polarity dots', (): void => {
    const nam = preview({ gender: 'nam' });
    const nu = preview({ gender: 'nu' });
    render(<TinhDuyenEmblem personPreviews={[nam, nu]} phase="idle" animate />);

    const yinYang = getYinYang();
    // No separate muted base layer and no old r4.4 dots.
    expect(yinYang.querySelector('.love-emblem-yinyang-base')).toBeNull();
    expect(yinYang.querySelectorAll('[data-polarity] circle[r="4.4"]')).toHaveLength(0);

    // The base circle now belongs to the Dương group.
    const base = getDuongBase();
    expect(base).toHaveAttribute('r', '30');
    expect(base).toHaveAttribute('cx', '200');
    expect(base).toHaveAttribute('cy', '200');

    const dots = Array.from(
      yinYang.querySelectorAll<SVGCircleElement>('[data-polarity] circle[r="4.9"]')
    );
    expect(dots).toHaveLength(2);

    const duongDot = getPolarityDot('duong');
    expect(duongDot).toHaveAttribute('cx', '200');
    expect(duongDot).toHaveAttribute('cy', '185');
    expect(duongDot).toHaveAttribute('r', '4.9');
    expect(duongDot).toHaveAttribute('fill', '#050505');
    expect(duongDot.parentElement).toBe(getPolarity('duong'));

    const amDot = getPolarityDot('am');
    expect(amDot).toHaveAttribute('cx', '200');
    expect(amDot).toHaveAttribute('cy', '215');
    expect(amDot).toHaveAttribute('r', '4.9');
    expect(amDot).toHaveAttribute('fill', '#f7f2e6');
    expect(amDot.parentElement).toBe(getPolarity('am'));
  });

  it('renders the deep ember panel with gold border, cloud decor and fixed light text', (): void => {
    render(<CompatibilityForm />);

    const aside = getEmblem().closest('aside') as HTMLElement;
    expect(aside).not.toBeNull();
    const panel = aside.firstElementChild as HTMLElement;

    // The panel uses the dark ember card treatment: gold border and a deep
    // red-black radial gradient (the variant name itself is not a DOM class).
    expect(panel.className).toContain('border-gold/40');
    expect(panel.className).toContain(
      'bg-[radial-gradient(circle_at_50%_16%,#240808_0%,#1c0505_44%,#120303_100%)]'
    );
    expect(panel.className).toContain('shadow-[0_0_38px_rgba(251,191,36,0.16)]');

    const cloudDecor = panel.querySelector('.pointer-events-none svg');
    expect(cloudDecor).not.toBeNull();
    expect(cloudDecor?.querySelectorAll('path').length).toBeGreaterThanOrEqual(4);

    const eyebrow = within(panel).getByText('Thiên Bàn Tử Vi');
    expect(eyebrow.className).toContain('text-[#f0d089]/80');

    // The old "Tình Duyên / Tử Vi" h1 and divider were removed; the eyebrow and
    // the panel aria-label are now the only heading-like labels.
    expect(aside).toHaveAttribute('aria-label', 'Thiên Bàn Tử Vi');
    expect(within(panel).queryByRole('heading')).not.toBeInTheDocument();
    expect(within(panel).queryByText('Tình Duyên')).not.toBeInTheDocument();
    expect(within(panel).queryByText('Tử Vi')).not.toBeInTheDocument();

    // The old panel description and the "Địa chi tạm tính…" footer were removed.
    expect(within(panel).queryByText(/Đối chiếu hai lá số/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Địa chi tạm tính/)).not.toBeInTheDocument();

    // The dark panel must not fall back to light-theme token utility classes.
    const panelMarkup = panel.innerHTML;
    [
      'text-foreground',
      'text-muted',
      'text-background',
      'bg-surface',
      'bg-background',
      'border-border-subtle',
    ].forEach((token) => {
      expect(panelMarkup).not.toContain(token);
    });
  });

  it('lets the idle emblem transition and glow without merge animation', (): void => {
    const person = preview({
      name: 'Mệnh chủ thứ nhất',
      gender: 'nam',
      day: '15',
      month: '5',
      year: '1990',
      hour: '10',
    });
    const { container } = render(
      <TinhDuyenEmblem personPreviews={[person, person]} phase="idle" animate />
    );

    const emblem = getEmblem();
    expect(emblem).toHaveAttribute('aria-hidden', 'true');
    expect(emblem).toHaveAttribute('data-phase', 'idle');
    expect(emblem).toHaveAttribute('data-animate', 'true');
    expect(emblem).toHaveAttribute('data-live', 'true');
    expect(emblem.className).toContain('love-emblem-live');
    expect(emblem.querySelectorAll('.love-emblem-smooth').length).toBeGreaterThan(0);
    // Both previews are nam, so only the Dương polarity lights up.
    expect(getYinYang()).toHaveAttribute('data-duong-active', 'true');
    expect(getYinYang()).toHaveAttribute('data-am-active', 'false');
    const duong = getPolarity('duong');
    const am = getPolarity('am');
    expect(duong).toHaveAttribute('data-active', 'true');
    expect(duong.getAttribute('opacity') ?? '1').toBe('1');
    expect(getDuongBase()).toHaveAttribute('fill', '#f4efe2');
    expect(getDuongBase()).toHaveAttribute('filter', 'url(#love-emblem-glow-polarity)');
    expect(getPolarityDot('duong')).toHaveAttribute('fill', '#050505');
    expect(am).toHaveAttribute('data-active', 'false');
    expect(am.getAttribute('opacity') ?? '1').toBe('1');
    expect(getAmPath()).toHaveAttribute('fill', '#333333');
    expect(getPolarityDot('am')).toHaveAttribute('fill', '#9a9a9a');
    expect(getAmPath()).not.toHaveAttribute('filter');
    expect(duong).not.toHaveAttribute('filter');
    expect(am).not.toHaveAttribute('filter');
    // The continuous bagua keeps all eight trigrams but no live polarity attributes.
    const bagua = getBagua();
    expect(bagua.querySelectorAll('[data-trigram]')).toHaveLength(8);
    expect(bagua).not.toHaveAttribute('data-tone');
    expect(bagua).not.toHaveAttribute('data-name-active');
    expect(bagua).not.toHaveAttribute('data-gender-active');
    expect(bagua).not.toHaveAttribute('data-polarity');
    expect(bagua).not.toHaveAttribute('data-active');
    expect(bagua.querySelectorAll('[data-person], [data-half]')).toHaveLength(0);
    // The obsolete r=35 medallion glow circles are gone.
    expect(emblem.querySelectorAll('[data-person] circle[r="35"]')).toHaveLength(0);
    expect(emblem.querySelectorAll('circle[r="35"]')).toHaveLength(0);

    expect(
      emblem.querySelectorAll('[class*="love-emblem-merge"], [class*="love-emblem-merged"]')
    ).toHaveLength(0);
    expect(container.querySelectorAll('[class*="animate-"]')).toHaveLength(0);
    expect(container.querySelectorAll('animate, animateTransform, animateMotion')).toHaveLength(0);
    expect(container.querySelectorAll('[style*="animation"], [style*="transition"]')).toHaveLength(
      0
    );
  });

  it('uses finite, media-gated merge animations that disappear on the reduced-motion path', (): void => {
    const person = preview({
      name: 'Mệnh chủ thứ nhất',
      gender: 'nam',
      day: '15',
      month: '5',
      year: '1990',
      hour: '10',
    });
    const { unmount } = render(
      <TinhDuyenEmblem personPreviews={[person, person]} phase="merging" animate />
    );

    const animatedEmblem = getEmblem();
    expect(animatedEmblem).toHaveAttribute('data-phase', 'merging');
    expect(animatedEmblem).toHaveAttribute('data-animate', 'true');
    expect(animatedEmblem).toHaveAttribute('data-merge-duration-ms', '3000');
    expect(animatedEmblem).toHaveAttribute('data-merge-duration', '3000');
    expect(MERGE_DURATION_MS).toBe(3000);
    expect(REVEAL_DELAY_MS).toBe(1000);
    expect(TOTAL_REVEAL_MS).toBe(4000);
    expect(animatedEmblem.style.getPropertyValue('--love-emblem-merge-duration')).toBe('3000ms');

    // Only the animal ring, star ring and centre rotate; ticks and bagua stay put.
    const mergingRing = animatedEmblem.querySelector('.love-emblem-merge-ring');
    const mergingStars = animatedEmblem.querySelector('.love-emblem-merge-stars');
    const mergingCenter = animatedEmblem.querySelector('.love-emblem-merge-center');
    expect(mergingRing).not.toBeNull();
    expect(mergingStars).not.toBeNull();
    expect(mergingCenter).not.toBeNull();
    expect(mergingRing?.querySelectorAll('[data-branch-index]')).toHaveLength(12);
    expect(mergingStars?.querySelectorAll('[data-star]')).toHaveLength(14);
    expect(mergingCenter).toHaveAttribute('data-testid', 'love-emblem-yinyang');

    expect(animatedEmblem.querySelector('.love-emblem-merge-ticks')).toBeNull();
    expect(animatedEmblem.querySelector('.love-emblem-merge-bagua')).toBeNull();
    expect(animatedEmblem.querySelector('.love-emblem-merge-thread')).toBeNull();
    expect(animatedEmblem.querySelector('.love-emblem-merge-left')).toBeNull();
    expect(animatedEmblem.querySelector('.love-emblem-merge-right')).toBeNull();
    const baguaClassName = getBagua().getAttribute('class') ?? '';
    // The continuous bagua never receives a merge/merged class; only the rings move.
    expect(baguaClassName).not.toContain('love-emblem-merge');
    expect(baguaClassName).not.toContain('love-emblem-merged');

    const mergingLayers = Array.from(
      animatedEmblem.querySelectorAll('[class*="love-emblem-merge-"]'),
      (element) => element.getAttribute('class')
    );
    // Merge classes remain confined to the three rotating layers; the old
    // stars-complete class is gone.
    expect(mergingLayers).toEqual([
      'love-emblem-merge-ring',
      'love-emblem-merge-stars',
      'love-emblem-merge-center',
    ]);

    // 緣 sits outside the animated centre group so the glyph stays fixed.
    const yuan = Array.from(animatedEmblem.querySelectorAll('text')).find(
      (node) => node.textContent?.trim() === '緣'
    );
    expect(yuan).toBeDefined();
    expect(yuan?.closest('.love-emblem-merge-center')).toBeNull();

    expect(
      animatedEmblem.querySelectorAll('[class*="love-emblem-merged"], [class*="animate-"]')
    ).toHaveLength(0);

    const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
    const ringStart = css.indexOf('@keyframes love-emblem-merge-ring');
    const starsStart = css.indexOf('@keyframes love-emblem-merge-stars');
    const centerStart = css.indexOf('@keyframes love-emblem-merge-center');
    expect(ringStart).toBeGreaterThan(-1);
    expect(starsStart).toBeGreaterThan(ringStart);
    expect(centerStart).toBeGreaterThan(starsStart);

    const mergeMediaStart = css.indexOf(
      '@media (prefers-reduced-motion: no-preference)',
      centerStart
    );
    expect(mergeMediaStart).toBeGreaterThan(centerStart);

    const ringKeyframes = css.slice(ringStart, starsStart);
    const starsKeyframes = css.slice(starsStart, centerStart);
    const centerKeyframes = css.slice(centerStart, mergeMediaStart);
    const preMedia = css.slice(ringStart, mergeMediaStart);

    // Merge animations live only inside the motion-preference media gate.
    expect(preMedia).not.toMatch(/animation\s*:/);
    // Scope the slice to the merge media block only; it is currently the last
    // media query in globals.css, so the slice runs to the end of the file.
    const nextMediaStart = css.indexOf('@media', mergeMediaStart + 1);
    const mergeMediaCss = css.slice(
      mergeMediaStart,
      nextMediaStart === -1 ? css.length : nextMediaStart
    );
    const animationDeclarations = Array.from(
      mergeMediaCss.matchAll(/animation:\s*([^;]+);/g),
      (match) => match[1].trim()
    );
    expect(animationDeclarations).toHaveLength(3);
    animationDeclarations.forEach((declaration) => {
      // The duration is driven by the inline CSS variable with a 3000ms fallback.
      expect(declaration).toContain('var(--love-emblem-merge-duration, 3000ms)');
      expect(declaration).not.toMatch(/\b(?:1700|2400)ms\b/);
      expect(declaration).toMatch(/\bforwards\b/);
      expect(declaration).not.toMatch(/\binfinite\b/);
    });
    expect(css).not.toMatch(/\binfinite\b/);

    // The old tick/bagua/thread keyframes and classes are gone entirely.
    [
      'love-emblem-merge-ticks',
      'love-emblem-merge-bagua',
      'love-emblem-merge-thread',
      'love-emblem-thread-draw',
      'love-emblem-merge-left',
      'love-emblem-merge-right',
      'love-emblem-merged-left',
      'love-emblem-merged-right',
    ].forEach((token) => {
      expect(css).not.toContain(`@keyframes ${token}`);
      expect(css).not.toContain(`.${token}`);
    });
    expect(mergeMediaCss).not.toMatch(/translate\(/);

    // Ring spins -360deg and stars +360deg across the full 3000ms; no layer translates.
    expect(ringKeyframes).toMatch(/rotate\(\s*-360deg\s*\)/);
    expect(ringKeyframes).not.toMatch(/translate\(/);
    expect(starsKeyframes).toMatch(/rotate\(\s*360deg\s*\)/);
    expect(starsKeyframes).not.toMatch(/translate\(/);
    expect(centerKeyframes).not.toMatch(/translate\(/);

    // The centre reaches 720deg evenly at 50%, then holds that rotation while
    // shining through 50-100%: brightness/glow and scale <= 1.08.
    expect(centerKeyframes).toMatch(/0%\s*\{[^}]*rotate\(\s*0deg\s*\)/s);
    expect((centerKeyframes.match(/rotate\(\s*720deg\s*\)/g) ?? []).length).toBeGreaterThanOrEqual(
      3
    );
    expect(centerKeyframes).not.toMatch(/rotate\(\s*360deg\s*\)/);
    expect(centerKeyframes).toMatch(/brightness\(/);
    expect(centerKeyframes).toMatch(/drop-shadow\(/);
    expect(centerKeyframes).not.toMatch(/1\.55/);

    const center50 = centerKeyframes.slice(
      centerKeyframes.indexOf('50%'),
      centerKeyframes.indexOf('75%')
    );
    const center75 = centerKeyframes.slice(
      centerKeyframes.indexOf('75%'),
      centerKeyframes.indexOf('100%')
    );
    const center100 = centerKeyframes.slice(centerKeyframes.indexOf('100%'));
    [center50, center75, center100].forEach((block) => {
      expect(block).toMatch(/rotate\(\s*720deg\s*\)/);
      expect(block).toMatch(/brightness\(/);
      expect(block).toMatch(/drop-shadow\(/);
    });

    const centerScales = Array.from(
      centerKeyframes.matchAll(/scale\(\s*(\d+(?:\.\d+)?)\s*\)/g),
      (match) => Number(match[1])
    );
    expect(centerScales.length).toBeGreaterThanOrEqual(3);
    expect(Math.max(...centerScales)).toBeLessThanOrEqual(1.08);
    expect(Math.max(...centerScales)).toBeGreaterThan(1);

    // Animated and settled layers rotate around the viewBox centre.
    const transformBoxStart = mergeMediaCss.indexOf('transform-box: view-box');
    expect(transformBoxStart).toBeGreaterThan(-1);
    const transformBoxBrace = mergeMediaCss.lastIndexOf('{', transformBoxStart);
    const transformBoxSelector = mergeMediaCss.slice(
      mergeMediaCss.lastIndexOf('}', transformBoxBrace) + 1,
      transformBoxBrace
    );
    ['ring', 'stars', 'center'].forEach((layer) => {
      expect(transformBoxSelector).toContain(`.love-emblem-merge-${layer}`);
      expect(transformBoxSelector).toContain(`.love-emblem-merged-${layer}`);
    });
    ['ticks', 'bagua'].forEach((layer) => {
      expect(transformBoxSelector).not.toContain(`.love-emblem-merge-${layer}`);
      expect(transformBoxSelector).not.toContain(`.love-emblem-merged-${layer}`);
    });
    const transformBoxRule = mergeMediaCss.slice(
      transformBoxBrace,
      mergeMediaCss.indexOf('}', transformBoxStart)
    );
    expect(transformBoxRule).toMatch(/transform-box:\s*view-box/);
    expect(transformBoxRule).toMatch(/transform-origin:\s*50% 50%/);

    // Settled rings keep no transform; the settled centre keeps only a soft glow.
    const mergedRuleStart = mergeMediaCss.lastIndexOf('.love-emblem-merged-ring');
    expect(mergedRuleStart).toBeGreaterThan(-1);
    const mergedRuleBrace = mergeMediaCss.indexOf('{', mergedRuleStart);
    const mergedRule = mergeMediaCss.slice(
      mergeMediaCss.lastIndexOf('}', mergedRuleBrace) + 1,
      mergeMediaCss.indexOf('}', mergedRuleBrace)
    );
    ['ring', 'stars', 'center'].forEach((layer) => {
      expect(mergedRule).toContain(`.love-emblem-merged-${layer}`);
    });
    expect(mergedRule).toMatch(/transform:\s*none/);
    expect(mergedRule).not.toMatch(/translate\(/);
    expect(mergedRule).not.toMatch(/rotate\(/);

    const mergedCenterStart = mergeMediaCss.lastIndexOf('.love-emblem-merged-center');
    expect(mergedCenterStart).toBeGreaterThan(mergedRuleStart);
    const mergedCenterBrace = mergeMediaCss.indexOf('{', mergedCenterStart);
    const mergedCenterRule = mergeMediaCss.slice(
      mergedCenterBrace,
      mergeMediaCss.indexOf('}', mergedCenterBrace)
    );
    expect(mergedCenterRule).toMatch(/filter:\s*drop-shadow/);
    expect(mergedCenterRule).not.toMatch(/transform\s*:/);
    expect(mergedCenterRule).not.toMatch(/scale\(/);
    expect(mergedCenterRule).not.toMatch(/translate\(/);
    expect(mergedCenterRule).not.toMatch(/animation\s*:/);

    unmount();
    render(<TinhDuyenEmblem personPreviews={[person, person]} phase="merging" animate={false} />);

    const staticEmblem = getEmblem();
    expect(staticEmblem).toHaveAttribute('data-phase', 'merging');
    expect(staticEmblem).toHaveAttribute('data-animate', 'false');
    expect(staticEmblem).toHaveAttribute('data-live', 'false');
    expect(staticEmblem.className).not.toContain('love-emblem-live');
    expect(
      staticEmblem.querySelectorAll(
        '.love-emblem-smooth, [class*="love-emblem-merge"], [class*="love-emblem-merged"]'
      )
    ).toHaveLength(0);
    expect(staticEmblem.querySelectorAll('[class*="animate-"]')).toHaveLength(0);
    expect(staticEmblem.querySelectorAll('[style*="animation"]')).toHaveLength(0);
  });

  it('pops the day, month and year branches in order with distinct delays once the date is complete', (): void => {
    render(<CompatibilityForm />);

    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    changeField(/^Năm/, 0, '1990');

    const day = getBranch(4);
    const month = getBranch(5);
    const year = getBranch(6);

    expect([day, month, year].map((branch) => branch.getAttribute('data-pop-rank'))).toEqual([
      '0',
      '1',
      '2',
    ]);
    expect([day, month, year].map((branch) => branch.getAttribute('data-pop-delay'))).toEqual([
      '0',
      '180',
      '360',
    ]);

    const delays = [day, month, year].map((branch) => branch.getAttribute('data-pop-delay'));
    expect(new Set(delays).size).toBe(3);

    expect(getEmblem()).toHaveAttribute('data-live', 'true');
    expect(getEmblem().className).toContain('love-emblem-live');
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop')).toHaveLength(3);

    [day, month, year].forEach((branch, index): void => {
      expect(branch).toHaveAttribute('data-active-tone', 'first');
      const overlay = branch.querySelector<SVGElement>('.love-emblem-branch-pop');
      expect(overlay).not.toBeNull();
      expect((overlay as SVGElement).style.getPropertyValue('--love-emblem-branch-delay')).toBe(
        `${index * 180}ms`
      );
    });
  });

  it('lights an hour-only branch immediately without any date pop rank or class', (): void => {
    render(<CompatibilityForm />);

    changeField(/^Giờ sinh/, 0, '10');

    const hourBranch = getBranch(5);
    expect(hourBranch).toHaveAttribute('data-active-tone', 'first');
    expect(hourBranch).toHaveAttribute('data-pop-rank', 'none');
    expect(hourBranch).not.toHaveAttribute('data-pop-delay');
    expect(hourBranch.querySelector('.love-emblem-branch-pop')).toBeNull();

    // The active tone is rendered immediately even though there is no date pop.
    expect(hourBranch.querySelector('circle[r="15"]')).not.toBeNull();

    const emblem = getEmblem();
    expect(emblem.querySelectorAll('[data-pop-rank]:not([data-pop-rank="none"])')).toHaveLength(0);
    expect(emblem.querySelectorAll('[data-pop-delay]')).toHaveLength(0);
    expect(emblem.querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);
  });

  it('uses the earliest pop rank when one branch is shared across pillars or people', (): void => {
    // Day and year both land on branch 5 (Thìn): the day rank 0 must win.
    const sharedDayYear = preview({ day: '4', month: '1', year: '1990' });
    const { unmount } = render(
      <TinhDuyenEmblem personPreviews={[sharedDayYear, sharedDayYear]} phase="idle" animate />
    );

    expect(getBranch(5)).toHaveAttribute('data-pop-rank', '0');
    expect(getBranch(5)).toHaveAttribute('data-pop-delay', '0');
    expect(getBranch(1)).toHaveAttribute('data-pop-rank', '1');

    unmount();

    // First person's day branch (rank 0) is also the second person's month branch (rank 1).
    const first = preview({ day: '15', month: '5', year: '1990' });
    const second = preview({ day: '27', month: '3', year: '1990' });
    render(<TinhDuyenEmblem personPreviews={[first, second]} phase="idle" animate />);

    expect(getBranch(4)).toHaveAttribute('data-pop-rank', '0');
    expect(getBranch(4)).toHaveAttribute('data-pop-delay', '0');
  });

  it('renders branch tone immediately without pop or live classes under reduced motion', (): void => {
    const person = preview({ day: '15', month: '5', year: '1990' });
    const { unmount } = render(
      <TinhDuyenEmblem personPreviews={[person, person]} phase="idle" animate={false} />
    );

    const animatedOff = getEmblem();
    expect(animatedOff).toHaveAttribute('data-animate', 'false');
    expect(animatedOff).toHaveAttribute('data-live', 'false');
    expect(animatedOff.className).not.toContain('love-emblem-live');
    expect(getBranch(4)).toHaveAttribute('data-active-tone', 'both');
    expect(getBranch(4).querySelector('circle[r="15"]')).not.toBeNull();
    expect(getBranch(4)).toHaveAttribute('data-pop-rank', '0');
    expect(animatedOff.querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);

    unmount();

    installReducedMotion(true);
    render(<CompatibilityForm />);
    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    changeField(/^Năm/, 0, '1990');

    const emblem = getEmblem();
    expect(emblem).toHaveAttribute('data-animate', 'false');
    expect(emblem).toHaveAttribute('data-live', 'false');
    expect(emblem.className).not.toContain('love-emblem-live');
    expect(getBranch(4)).toHaveAttribute('data-active-tone', 'first');
    expect(getBranch(4).querySelector('circle[r="15"]')).not.toBeNull();
    expect(emblem.querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);
  });

  it('restarts the branch pop sequence when a complete date changes but not for name, gender or hour', (): void => {
    render(<CompatibilityForm />);

    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    changeField(/^Năm/, 0, '1990');

    const originalKey = getEmblem().getAttribute('data-date-key') as string;
    expect(originalKey).toBe('solar-15-5-1990|');
    const branchBefore = getBranch(5);
    expect(branchBefore).toHaveAttribute('data-pop-rank', '1');

    changeField(/^Họ tên/, 0, 'Mệnh chủ thứ nhất');
    changeField(/^Giới tính/, 0, 'nam');
    changeField(/^Giờ sinh/, 0, '18');

    expect(getEmblem()).toHaveAttribute('data-date-key', originalKey);
    expect(getBranch(4)).toHaveAttribute('data-pop-rank', '0');
    expect(getBranch(4)).toHaveAttribute('data-pop-delay', '0');
    expect(getBranch(5)).toHaveAttribute('data-pop-rank', '1');

    changeField(/^Ngày/, 0, '4');
    changeField(/^Tháng/, 0, '1');
    changeField(/^Năm/, 0, '1990');

    const newKey = getEmblem().getAttribute('data-date-key');
    expect(newKey).toBe('solar-4-1-1990|');
    expect(newKey).not.toBe(originalKey);

    // The day/year branch is rebuilt for the new date, so the pop sequence restarts.
    const branchAfter = getBranch(5);
    expect(branchAfter).not.toBe(branchBefore);
    expect(branchAfter).toHaveAttribute('data-pop-rank', '0');
    expect(branchAfter).toHaveAttribute('data-pop-delay', '0');
    expect(branchAfter.querySelector('.love-emblem-branch-pop')).not.toBeNull();
  });

  it('emits no date pop metadata for partial or invalid dates while the real hour branch lights', (): void => {
    render(<CompatibilityForm />);

    changeField(/^Ngày/, 0, '15');
    changeField(/^Tháng/, 0, '5');
    changeField(/^Giờ sinh/, 0, '10');

    // Both empty profile keys: the form always passes two previews.
    expect(getEmblem()).toHaveAttribute('data-date-key', '|');
    expect(getBranch(5)).toHaveAttribute('data-active-tone', 'first');
    expect(getBranch(5)).toHaveAttribute('data-pop-rank', 'none');
    expect(getBranch(5)).not.toHaveAttribute('data-pop-delay');
    expect(getBranch(5).querySelector('circle[r="15"]')).not.toBeNull();
    expect(
      getEmblem().querySelectorAll('[data-pop-rank]:not([data-pop-rank="none"])')
    ).toHaveLength(0);
    expect(getEmblem().querySelectorAll('[data-pop-delay]')).toHaveLength(0);
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);

    changeField(/^Năm/, 0, '1990');
    expect(getBranch(4)).toHaveAttribute('data-pop-rank', '0');
    expect(getBranch(5)).toHaveAttribute('data-pop-rank', '1');
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop').length).toBeGreaterThan(0);

    // 31/02 is not a real solar date, so the date ranks disappear again.
    changeField(/^Ngày/, 0, '31');
    changeField(/^Tháng/, 0, '2');

    expect(getEmblem()).toHaveAttribute('data-date-key', '|');
    expect(
      getEmblem().querySelectorAll('[data-pop-rank]:not([data-pop-rank="none"])')
    ).toHaveLength(0);
    expect(getEmblem().querySelectorAll('[data-pop-delay]')).toHaveLength(0);
    expect(getEmblem().querySelectorAll('.love-emblem-branch-pop')).toHaveLength(0);
    expect(getBranch(5)).toHaveAttribute('data-active-tone', 'first');
    expect(getBranch(5)).toHaveAttribute('data-pop-rank', 'none');
  });

  it('scopes the finite branch-pop animation to no-preference and settles at normal scale', (): void => {
    const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
    const popStart = css.indexOf('@keyframes love-emblem-branch-pop');
    const mergeStart = css.indexOf('@keyframes love-emblem-merge-ring');

    expect(popStart).toBeGreaterThan(-1);
    expect(mergeStart).toBeGreaterThan(popStart);

    const popCss = css.slice(popStart, mergeStart);
    const keyframesEnd = popCss.indexOf('\n}\n');
    expect(keyframesEnd).toBeGreaterThan(-1);
    const keyframes = popCss.slice(0, keyframesEnd + 2);
    const finalState = keyframes.slice(keyframes.lastIndexOf('100%'));

    expect(keyframes).not.toMatch(/\binfinite\b/);
    expect(finalState).toMatch(/transform:\s*scale\(1\)\s*translateY\(0\)/);
    expect(finalState).toMatch(/opacity:\s*1/);
    expect(finalState).toMatch(/filter:\s*none/);

    const mediaStart = popCss.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(mediaStart).toBeGreaterThan(-1);
    // No animation declarations may escape the reduced-motion gate.
    expect(popCss.slice(0, mediaStart)).not.toMatch(/animation\s*:/);

    const mediaCss = popCss.slice(mediaStart);
    expect(mediaCss).toMatch(/\.love-emblem-branch-pop\s*\{/);
    expect(mediaCss).toMatch(/animation-delay:\s*var\(--love-emblem-branch-delay,\s*0ms\)/);

    const animationDeclarations = Array.from(mediaCss.matchAll(/animation:\s*([^;]+);/g), (match) =>
      match[1].trim()
    );
    expect(animationDeclarations.length).toBeGreaterThanOrEqual(2);
    animationDeclarations.forEach((declaration): void => {
      expect(declaration).not.toMatch(/\binfinite\b/);
    });

    // Animal pop keeps its 650ms sequence and staggered delay.
    const branchPopDeclarations = animationDeclarations.filter((declaration) =>
      declaration.includes('love-emblem-branch-pop')
    );
    expect(branchPopDeclarations).toHaveLength(1);
    expect(branchPopDeclarations[0]).toMatch(/\b650ms\b/);
    expect(branchPopDeclarations[0]).toMatch(/\bboth\b/);

    // Star and polarity pop share the component animation, also motion-gated.
    const componentPopDeclarations = animationDeclarations.filter((declaration) =>
      declaration.includes('love-emblem-component-pop')
    );
    expect(componentPopDeclarations).toHaveLength(1);
    expect(componentPopDeclarations[0]).toMatch(/\b560ms\b/);
    expect(componentPopDeclarations[0]).toMatch(/\bboth\b/);
    expect(popCss).not.toMatch(/\binfinite\b/);
  });
});
