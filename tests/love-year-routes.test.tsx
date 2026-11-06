import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import HopTuoiPage, { metadata as hopTuoiMetadata } from '@/app/hop-tuoi/page';
import XemTuoiPage, { metadata as xemTuoiMetadata } from '@/app/xem-tuoi/page';
import { Header } from '@/components/layout/Header';
import { installReducedMotion } from './helpers/match-media';

vi.mock('@/lib/supabase/use-auth', () => ({
  useAuth: (): { user: null; loading: boolean; signOut: () => Promise<void> } => ({
    user: null,
    loading: false,
    signOut: async (): Promise<void> => {},
  }),
}));

beforeEach((): void => {
  installReducedMotion(false);
});

afterEach((): void => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  vi.unstubAllGlobals();
});

describe('/hop-tuoi page', () => {
  it('shows the love-year lookup and not the generic zodiac lookup', (): void => {
    render(<HopTuoiPage />);

    expect(
      screen.getByRole('heading', { name: 'Tra cứu tình duyên theo năm sinh' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Xem duyên' })).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Tra cứu theo năm sinh' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Xem tam hợp' })).not.toBeInTheDocument();
    ['Tam hợp', 'Lục hợp', 'Tứ hành xung'].forEach((name) => {
      expect(screen.queryByRole('heading', { name })).not.toBeInTheDocument();
    });
  });

  it('keeps metadata focused on the pair reading plus the year-birth lookup', (): void => {
    expect(hopTuoiMetadata.title).toBe('Tình Duyên Tử Vi - Sao Mệnh');
    expect(hopTuoiMetadata.description).toEqual(expect.stringContaining('tra cứu tình duyên'));
  });
});

describe('/xem-tuoi page', () => {
  it('renders the generic tam hợp/lục hợp/tứ hành xung section', (): void => {
    render(<XemTuoiPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tam hợp – Lục hợp – Tứ hành xung' })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tra cứu theo năm sinh' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Xem tam hợp' })).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Tra cứu tình duyên theo năm sinh' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Xem duyên' })).not.toBeInTheDocument();
  });

  it('exposes the Xem tuổi nav link and page metadata', (): void => {
    render(<XemTuoiPage />);

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('link', { name: 'Xem tuổi' })).toHaveAttribute(
      'href',
      '/xem-tuoi'
    );

    expect(xemTuoiMetadata.title).toBe('Xem tuổi hợp – Sao Mệnh');
    expect(xemTuoiMetadata.description).toEqual(expect.stringContaining('tam hợp'));
  });

  it('renders the three explanation cards with group and pair examples', (): void => {
    render(<XemTuoiPage />);

    expect(
      screen.getByRole('heading', { name: 'Tam hợp – Lục hợp – Tứ hành xung là gì?' })
    ).toBeInTheDocument();

    ['Tam hợp', 'Lục hợp', 'Tứ hành xung'].forEach((name) => {
      expect(screen.getByRole('heading', { level: 3, name })).toBeInTheDocument();
    });

    [
      'Thân – Tý – Thìn',
      'Dần – Ngọ – Tuất',
      'Hợi – Mão – Mùi',
      'Tỵ – Dậu – Sửu',
      'Tý – Sửu',
      'Dần – Hợi',
      'Mão – Tuất',
      'Thìn – Dậu',
      'Tỵ – Thân',
      'Ngọ – Mùi',
      'Tý – Ngọ – Mão – Dậu',
      'Dần – Thân – Tỵ – Hợi',
      'Thìn – Tuất – Sửu – Mùi',
    ].forEach((example) => {
      expect(screen.getByText(example)).toBeInTheDocument();
    });
  });

  it('shows the caveat and avoids fatalistic wording', (): void => {
    render(<XemTuoiPage />);

    const caveat = screen.getByText(/Đây là cách nhìn tham khảo, không phải cấm kỵ tuyệt đối/);
    expect(caveat).toHaveTextContent(/Sự thấu hiểu và bao dung vẫn là nền tảng/);

    const pageText = document.body.textContent ?? '';
    [
      'định mệnh',
      'tai họa',
      'tuyệt giao',
      'xấu số',
      'sẽ ly tán',
      'phải tránh',
      'không thể',
    ].forEach((wording) => {
      expect(pageText.toLowerCase()).not.toContain(wording);
    });
  });
});

describe('Header navigation', () => {
  it('includes both Tình duyên and Xem tuổi', (): void => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('link', { name: 'Tình duyên' })).toHaveAttribute(
      'href',
      '/hop-tuoi'
    );
    expect(within(header).getByRole('link', { name: 'Xem tuổi' })).toHaveAttribute(
      'href',
      '/xem-tuoi'
    );
  });
});
