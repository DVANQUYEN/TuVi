'use client';

import Link from 'next/link';

export function Footer(): React.ReactElement {
  const year = 2026;

  return (
    <footer className="border-t border-border-subtle bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted">
              Theo trường phái Nam phái, bảng độ sáng Tân Biên 1956
            </p>
            <p className="text-sm text-muted">Lịch âm theo Hồ Ngọc Đức (UTC+7)</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
            <Link href="/privacy" className="hover:text-gold">
              Chính sách riêng tư
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Điều khoản
            </Link>
            <Link href="/about" className="hover:text-gold">
              Giới thiệu
            </Link>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          © {year} Sao Mệnh. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
