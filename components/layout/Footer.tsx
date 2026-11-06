'use client';

import Link from 'next/link';

const contactLinkClass =
  'underline decoration-current/30 underline-offset-2 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

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
            <section aria-labelledby="footer-owner-heading" className="mt-4">
              <h2
                id="footer-owner-heading"
                className="text-xs font-semibold uppercase tracking-wide text-gold"
              >
                Chủ sở hữu
              </h2>
              <ul className="mt-2 flex max-w-full flex-col items-center gap-1 text-sm text-muted md:items-start">
                <li className="max-w-full">
                  <a
                    href="mailto:daovanquyen26@gmail.com"
                    className={`${contactLinkClass} break-all`}
                  >
                    daovanquyen26@gmail.com
                  </a>
                </li>
                <li className="max-w-full">
                  <a
                    href="https://www.facebook.com/van.quyen.822065"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLinkClass} break-words`}
                  >
                    Facebook: Văn Quyên
                  </a>
                </li>
              </ul>
            </section>
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
