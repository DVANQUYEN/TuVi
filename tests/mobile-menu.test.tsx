import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MobileMenu } from '@/components/layout/MobileMenu';

const { pathnameMock } = vi.hoisted(() => ({
  pathnameMock: vi.fn<() => string>(() => '/hop-tuoi'),
}));

vi.mock('next/navigation', () => ({
  usePathname: pathnameMock,
}));

const links = [
  { href: '/', label: 'Trang chủ' },
  { href: '/lap-la-so', label: 'Lập lá số' },
  { href: '/hop-tuoi', label: 'Tình duyên' },
  { href: '/xem-tuoi', label: 'Xem tuổi' },
];

beforeEach((): void => {
  pathnameMock.mockReset();
  pathnameMock.mockReturnValue('/hop-tuoi');
});

afterEach((): void => {
  cleanup();
});

describe('MobileMenu active link', () => {
  it('renders every link and marks only the current path as active', (): void => {
    render(<MobileMenu isOpen onClose={vi.fn()} links={links} />);

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('link')).toHaveLength(links.length);

    const active = within(dialog).getByRole('link', { name: 'Tình duyên' });
    expect(active).toHaveAttribute('href', '/hop-tuoi');
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(active).toHaveClass('text-gold');

    links
      .filter((link) => link.href !== '/hop-tuoi')
      .forEach((link) => {
        const element = within(dialog).getByRole('link', { name: link.label });
        expect(element).not.toHaveAttribute('aria-current');
        expect(element).not.toHaveClass('text-gold');
      });
  });

  it('matches nested paths but keeps the root link exclusive to "/"', (): void => {
    pathnameMock.mockReturnValue('/hop-tuoi/chi-tiet');
    const { unmount } = render(<MobileMenu isOpen onClose={vi.fn()} links={links} />);

    expect(screen.getByRole('link', { name: 'Tình duyên' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Trang chủ' })).not.toHaveAttribute('aria-current');
    unmount();

    pathnameMock.mockReturnValue('/');
    render(<MobileMenu isOpen onClose={vi.fn()} links={links} />);

    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Tình duyên' })).not.toHaveAttribute('aria-current');
  });
});
