import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { IntroAnimation } from '@/components/animation/IntroAnimation';
import { ZodiacWheel } from '@/components/animation/ZodiacWheel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';

afterEach((): void => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('Phase B layout', () => {
  it('renders the footer navigation and copyright year', (): void => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Chính sách riêng tư' })).toHaveAttribute(
      'href',
      '/privacy'
    );
    expect(screen.getByRole('link', { name: 'Điều khoản' })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: 'Giới thiệu' })).toHaveAttribute('href', '/about');
    expect(
      screen.getByText(`© ${new Date().getFullYear()} Sao Mệnh. Tất cả quyền được bảo lưu.`)
    ).toBeInTheDocument();
  });

  it('toggles the document theme and persists the choice', (): void => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(screen.getByRole('button', { name: 'Chuyển sang chế độ sáng' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(screen.getByRole('button', { name: 'Chuyển sang chế độ tối' })).toBeInTheDocument();
  });
});

describe('Phase B animations', () => {
  it('renders the zodiac wheel with its accessible label', (): void => {
    render(<ZodiacWheel />);

    expect(screen.getByRole('img', { name: 'Vòng tròn 12 con giáp' })).toBeInTheDocument();
    expect(screen.getByText('Sao Mệnh')).toBeInTheDocument();
  });

  it('skips the intro when it has already been seen', (): void => {
    localStorage.setItem('introSeen', 'true');

    const { container } = render(<IntroAnimation />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('Phase B design system', () => {
  it('forwards native button props and renders children', (): void => {
    render(
      <Button variant="danger" size="lg" type="submit" disabled>
        Xoá
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Xoá' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toBeDisabled();
    expect(button.className).toContain('bg-red-600');
    expect(button.className).toContain('h-12');
  });

  it('applies error styling to inputs and selects', (): void => {
    render(
      <>
        <Input aria-label="Ngày sinh" error />
        <Select aria-label="Giới tính" error>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </Select>
      </>
    );

    expect(screen.getByLabelText('Ngày sinh').className).toContain('border-red-500');
    expect(screen.getByLabelText('Giới tính').className).toContain('border-red-500');
    expect(screen.getByRole('combobox', { name: 'Giới tính' })).toBeInTheDocument();
  });

  it('renders skeleton placeholders with the pulse animation', (): void => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass('animate-pulse');
  });
});
