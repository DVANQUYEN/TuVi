'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/lib/supabase/use-auth';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/lap-la-so', label: 'Lập lá số' },
  { href: '/ho-so', label: 'Lá số đã lưu' },
  { href: '/tu-vi-hang-ngay', label: 'Tử vi hàng ngày' },
  { href: '/hop-tuoi', label: 'Tình duyên' },
  { href: '/xem-tuoi', label: 'Xem tuổi' },
];

export function Header(): React.ReactElement {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const links =
    !loading && !user ? [...navLinks, { href: '/dang-nhap', label: 'Đăng nhập' }] : navLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="min-w-0 truncate font-serif text-xl font-bold text-gold sm:text-2xl"
        >
          Sao Mệnh
        </Link>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} onSignOut={signOut} />
          ) : (
            !loading && (
              <Link
                href="/dang-nhap"
                className="text-sm font-medium text-gold transition-colors hover:underline"
              >
                Đăng nhập
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          {user && <UserMenu user={user} onSignOut={signOut} />}
          <Button
            variant="ghost"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={links}
      />
    </header>
  );
}
