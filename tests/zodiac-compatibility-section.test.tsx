import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { ZodiacCompatibilitySection } from '@/components/horoscope/ZodiacCompatibilitySection';
import { MAX_ZODIAC_YEAR, MIN_ZODIAC_YEAR } from '@/lib/ziwei/zodiac-compatibility';

const YEAR_LABEL = 'Năm sinh (dương lịch)';
const RANGE_ERROR = `Năm sinh phải là số từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}.`;

afterEach((): void => {
  cleanup();
});

function getYearInput(): HTMLInputElement {
  return screen.getByLabelText(YEAR_LABEL) as HTMLInputElement;
}

function submitButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Xem tam hợp' });
}

function submitYear(value: string): void {
  fireEvent.change(getYearInput(), { target: { value } });
  fireEvent.click(submitButton());
}

function getCardByHeading(heading: string): HTMLElement {
  const title = screen.getByRole('heading', { name: heading, level: 3 });
  return title.parentElement?.parentElement as HTMLElement;
}

describe('ZodiacCompatibilitySection', () => {
  it('renders the heading, labelled year input and submit control', (): void => {
    render(<ZodiacCompatibilitySection />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Tra cứu theo năm sinh' })
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
    expect(screen.queryByText(/Các năm sinh tuổi/)).not.toBeInTheDocument();
  });

  it.each(['', '1990.5', String(MIN_ZODIAC_YEAR - 1), String(MAX_ZODIAC_YEAR + 1)])(
    'shows the range alert and no result for invalid year %s',
    (value: string): void => {
      render(<ZodiacCompatibilitySection />);

      submitYear(value);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(RANGE_ERROR);
      expect(screen.queryByText(/Các năm sinh tuổi/)).not.toBeInTheDocument();

      const input = getYearInput();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', alert.id);
      expect(alert.id).not.toBe('');
    }
  );

  it('renders the year-2000 branch and its example years across every group', (): void => {
    render(<ZodiacCompatibilitySection />);

    submitYear('2000');

    const result = screen.getByRole('region', { name: 'Tuổi Thìn (2000)' });
    expect(
      within(result).getByRole('heading', { level: 3, name: 'Tuổi Thìn (2000)' })
    ).toBeInTheDocument();
    expect(result).toHaveTextContent('Các năm sinh tuổi Thìn: 1988 · 2000 · 2012 · 2024');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    const expectedChips: Array<{
      heading: string;
      chips: Array<[label: string, years: string]>;
    }> = [
      {
        heading: 'Tam hợp',
        chips: [
          ['Thân', '1992 · 2004 · 2016 · 2028'],
          ['Tý', '1984 · 1996 · 2008 · 2020'],
        ],
      },
      {
        heading: 'Lục hợp',
        chips: [['Dậu', '1993 · 2005 · 2017 · 2029']],
      },
      {
        heading: 'Tứ hành xung',
        chips: [
          ['Tuất', '1994 · 2006 · 2018 · 2030'],
          ['Sửu', '1985 · 1997 · 2009 · 2021'],
          ['Mùi', '1991 · 2003 · 2015 · 2027'],
        ],
      },
    ];

    expectedChips.forEach(({ heading, chips }) => {
      const items = within(getCardByHeading(heading)).getAllByRole('listitem');
      expect(items).toHaveLength(chips.length);

      chips.forEach(([label, years], index) => {
        expect(items[index]).toHaveTextContent(label);
        expect(items[index]).toHaveTextContent(years);
        expect(items[index].textContent).toMatch(/\d{4}(?: · \d{4}){3}/);
      });
    });
  });

  it('shows the 12-year/reference caveat with the result', (): void => {
    render(<ZodiacCompatibilitySection />);

    submitYear('2000');

    const result = screen.getByRole('region', { name: 'Tuổi Thìn (2000)' });
    expect(result).toHaveTextContent(/Năm sinh chỉ là ví dụ theo chu kỳ 12 năm/);
    expect(result).toHaveTextContent(/Tam hợp\/Lục hợp\/Tứ hành xung chỉ mang tính/);
    expect(result).toHaveTextContent(/tham khảo/);
  });

  it('replaces the previous result with a new valid year', (): void => {
    render(<ZodiacCompatibilitySection />);

    submitYear('2000');
    expect(screen.getByRole('region', { name: 'Tuổi Thìn (2000)' })).toBeInTheDocument();

    submitYear('1990');

    expect(screen.queryByRole('region', { name: 'Tuổi Thìn (2000)' })).not.toBeInTheDocument();
    const result = screen.getByRole('region', { name: 'Tuổi Ngọ (1990)' });
    expect(result).toHaveTextContent('Các năm sinh tuổi Ngọ: 1990 · 2002 · 2014 · 2026');
  });
});
