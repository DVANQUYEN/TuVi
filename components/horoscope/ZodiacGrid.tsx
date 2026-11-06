'use client';

import Link, { useLinkStatus } from 'next/link';
import { BRANCH_NAMES } from '@/lib/ziwei/daily';
import type { DailyHoroscope } from '@/lib/ziwei/daily';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';
import type { DailyContent } from './daily-content';

/** Ảnh nền trang trí cho từng con giáp (public/images/zodiac). Khóa khớp với EarthlyBranch. */
const ZODIAC_IMAGES: Partial<Record<EarthlyBranch, string>> = {
  ty: '/images/zodiac/ty.png', // Tý - chuột
  suu: '/images/zodiac/suu.png', // Sửu - trâu
  dan: '/images/zodiac/dan.png', // Dần - hổ
  mao: '/images/zodiac/mao.png', // Mão - mèo
  thin: '/images/zodiac/thin.png', // Thìn - rồng
  ti: '/images/zodiac/ran.png', // Tỵ - rắn
  ngo: '/images/zodiac/ngo.png', // Ngọ - ngựa
  mui: '/images/zodiac/mui.png', // Mùi - dê
  than: '/images/zodiac/than.png', // Thân - khỉ
  dau: '/images/zodiac/dau.png', // Dậu - gà
  tuat: '/images/zodiac/tuat.png', // Tuất - chó
  hoi: '/images/zodiac/hoi.png', // Hợi - lợn
};

/** Nhãn xu hướng trong ngày theo chỉ số tổng hợp (1-10). */
function getDailyStatus(score: number): string {
  if (score >= 7) return 'Thuận lợi';
  if (score >= 5) return 'Ổn định';
  return 'Biến động';
}

/** Spinner cố định kích thước, luôn render và chỉ đổi opacity để không gây layout shift. */
function PendingSpinner(): React.ReactElement {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden="true"
      className={`mx-auto mt-3 block h-5 w-5 rounded-full border-2 border-gold border-t-transparent transition-opacity duration-200 motion-safe:animate-spin ${
        pending ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

interface ZodiacGridProps {
  horoscopes: DailyHoroscope[];
  contents?: Record<EarthlyBranch, DailyContent>;
}

export function ZodiacGrid({ horoscopes, contents }: ZodiacGridProps): React.ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
      {horoscopes.map((horoscope) => {
        const branch = horoscope.branch;
        const name = BRANCH_NAMES[branch];
        const bgImage = ZODIAC_IMAGES[branch];
        const statusLabel = getDailyStatus(horoscope.overall);
        const content = contents?.[branch];

        return (
          <li key={branch}>
            <Link
              href={`/tu-vi-hang-ngay/${branch}`}
              aria-label={`Tuổi ${name}, ${statusLabel}, ${horoscope.overall} trên 10${
                content ? `, quan hệ ${content.relationLabel}` : ''
              }`}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-xl border border-border-subtle bg-gradient-to-b from-surface to-background p-4 text-center shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-gold hover:shadow-[0_12px_32px_rgba(212,175,55,0.3)] motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:min-h-[280px]"
            >
              {bgImage && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
              )}
              <div className="relative z-10 mt-auto flex flex-col items-center">
                <h2 className="font-heading text-xl font-semibold text-gold">{name}</h2>
                <div className="mt-1 text-sm text-muted">{statusLabel}</div>
                <div className="text-2xl font-bold text-foreground">
                  {horoscope.overall}
                  <span className="text-sm font-normal text-muted">/10</span>
                </div>
                {content && (
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted">
                    <span className="font-medium text-gold/90">{content.relationLabel}</span>
                    <span aria-hidden="true"> · </span>
                    {content.shouldDo[0]}
                  </p>
                )}
                <PendingSpinner />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
