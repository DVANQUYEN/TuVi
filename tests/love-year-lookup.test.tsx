import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LoveYearLookupSection } from '@/components/horoscope/love/LoveYearLookupSection';
import { MAX_ZODIAC_YEAR, MIN_ZODIAC_YEAR } from '@/lib/ziwei/zodiac-compatibility';

const EMPTY_YEAR_ERROR = 'Vui lòng nhập năm sinh.';
const RANGE_YEAR_ERROR = `Năm sinh phải là số nguyên từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}.`;

afterEach((): void => {
  cleanup();
  localStorage.clear();
});

function getYearInput(): HTMLInputElement {
  return screen.getByLabelText('Năm sinh (dương lịch)') as HTMLInputElement;
}

function submitButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Xem duyên' });
}

function submitYear(value: string): void {
  fireEvent.change(getYearInput(), { target: { value } });
  fireEvent.click(submitButton());
}

describe('LoveYearLookupSection', () => {
  it('renders the heading, labelled year input and submit control', (): void => {
    render(<LoveYearLookupSection />);

    expect(
      screen.getByRole('heading', { name: 'Tra cứu tình duyên theo năm sinh' })
    ).toBeInTheDocument();

    const input = getYearInput();
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', String(MIN_ZODIAC_YEAR));
    expect(input).toHaveAttribute('max', String(MAX_ZODIAC_YEAR));
    expect(input).toHaveAttribute('step', '1');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');

    expect(submitButton()).toHaveAttribute('type', 'submit');
    expect(screen.queryByTestId('love-year-lookup-result')).not.toBeInTheDocument();
  });

  it('shows a Vietnamese alert and focuses it for an empty year', (): void => {
    render(<LoveYearLookupSection />);

    fireEvent.click(submitButton());

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(EMPTY_YEAR_ERROR);
    expect(alert).toHaveFocus();
    expect(screen.queryByTestId('love-year-lookup-result')).not.toBeInTheDocument();

    const input = getYearInput();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
    expect(alert.id).not.toBe('');
  });

  it.each(['1990.5', String(MIN_ZODIAC_YEAR - 1), String(MAX_ZODIAC_YEAR + 1)])(
    'shows the range alert and no result for invalid year %s',
    (value: string): void => {
      render(<LoveYearLookupSection />);

      submitYear(value);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(RANGE_YEAR_ERROR);
      expect(alert).toHaveFocus();
      expect(screen.queryByTestId('love-year-lookup-result')).not.toBeInTheDocument();
      expect(getYearInput()).toHaveAttribute('aria-invalid', 'true');
    }
  );

  it('clears the error while typing and renders the 1990 lookup on success', (): void => {
    render(<LoveYearLookupSection />);

    fireEvent.click(submitButton());
    expect(screen.getByRole('alert')).toHaveTextContent(EMPTY_YEAR_ERROR);

    fireEvent.change(getYearInput(), { target: { value: '1990' } });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    fireEvent.click(submitButton());

    const result = screen.getByTestId('love-year-lookup-result');
    expect(result).toBeVisible();
    expect(result).toHaveFocus();
    expect(result).toHaveAttribute(
      'aria-label',
      'Kết quả tra cứu tình duyên cho năm sinh 1990'
    );

    const input = getYearInput();
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    expect(result).toHaveTextContent('Canh Ngọ');
    expect(result).toHaveTextContent('Lộ Bàng Thổ · Thổ');
    expect(result).toHaveTextContent(/Hợp duyên với tuổi Dần, Tuất, Mùi/);
    expect(result).toHaveTextContent(/mệnh Hỏa, Kim/);
    expect(result).toHaveTextContent(/Tính theo năm âm lịch/);
    expect(result).toHaveTextContent(/Kết quả chỉ mang tính tham khảo/);

    expect(within(result).getByRole('heading', { name: 'Bản mệnh', level: 3 })).toBeInTheDocument();
    expect(
      within(result).getByRole('heading', { name: 'Nên yêu người', level: 3 })
    ).toBeInTheDocument();
    expect(
      within(result).getByRole('heading', { name: 'Năm thuận duyên', level: 3 })
    ).toBeInTheDocument();
    expect(
      within(result).getByRole('heading', { name: 'Năm cần thận trọng', level: 3 })
    ).toBeInTheDocument();

    // The generic zodiac cards belong to /xem-tuoi and must not leak in here.
    ['Tam hợp', 'Lục hợp', 'Tứ hành xung'].forEach((name) => {
      expect(within(result).queryByRole('heading', { name })).not.toBeInTheDocument();
    });
  });

  it('replaces a previous result when a boundary year is submitted', (): void => {
    render(<LoveYearLookupSection />);

    submitYear(String(MAX_ZODIAC_YEAR));
    const first = screen.getByTestId('love-year-lookup-result');
    expect(first).toHaveTextContent(`Kỷ Mùi`);
    expect(first).toHaveTextContent('Thiên Thượng Hỏa');
    expect(first).not.toHaveTextContent('Canh Tý');

    fireEvent.change(getYearInput(), { target: { value: String(MIN_ZODIAC_YEAR) } });
    fireEvent.click(submitButton());

    const second = screen.getByTestId('love-year-lookup-result');
    expect(second).toHaveTextContent('Canh Tý');
    expect(second).toHaveTextContent('Bích Thượng Thổ');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
