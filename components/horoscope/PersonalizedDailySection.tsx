'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSavedChart } from '@/components/storage/useSavedChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDailyCalendar } from '@/components/horoscope/daily-calendar';
import {
  buildPersonalizedDaily,
  type PersonalizedDaily,
} from '@/lib/ziwei/interpretation/daily-personal';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';
import { BRANCH_LABELS } from '@/lib/ziwei/zodiac-compatibility';

type FortuneLevel = PersonalizedDaily['decade']['level'];

const LEVEL_LABEL: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'Thuận lợi',
  'ổn định': 'Ổn định',
  xấu: 'Biến động',
};

const LEVEL_CLASS: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'border-el-moc/40 bg-el-moc/10 text-el-moc',
  'ổn định': 'border-el-tho/40 bg-el-tho/10 text-el-tho',
  xấu: 'border-el-hoa/40 bg-el-hoa/10 text-el-hoa',
};

const CARD_CLASS =
  'mt-8 rounded-xl border border-gold/30 bg-background p-4 shadow-[0_0_24px_rgba(212,175,55,0.12)] sm:p-6';

const CHIP_CLASS =
  'inline-flex max-w-full flex-wrap items-center gap-x-1.5 rounded-full border border-border-subtle bg-elevated px-3 py-1.5 text-sm leading-snug';

/** Định dạng YYYY-MM-DD theo ngày local (tránh lệch múi giờ của toISOString). */
function formatLocalDate(date: Date): string {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** Hiển thị ngày dạng DD/MM/YYYY từ chuỗi ISO. */
function formatDisplayDate(isoDate: string): string {
  const [yyyy, mm, dd] = isoDate.split('-');
  return `${dd}/${mm}/${yyyy}`;
}

function LevelBadge({ level }: { level: FortuneLevel }): React.ReactElement {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${LEVEL_CLASS[level]}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {LEVEL_LABEL[level]}
    </span>
  );
}

function InfoChip({ label, value }: { label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <li className={CHIP_CLASS}>
      <span className="font-semibold text-foreground">{label}</span>
      <span className="text-muted">{value}</span>
    </li>
  );
}

function Stars({ stars }: { stars: string[] }): React.ReactElement {
  return <>{stars.length > 0 ? stars.join(', ') : 'Vô Chính Diệu'}</>;
}

export interface PersonalizedDailySectionProps {
  /** Chi của trang hiện tại (/tu-vi-hang-ngay/[con-giap]). */
  branch?: EarthlyBranch;
  /** Tên thay thế cho prop `branch`, dùng khi cần diễn đạt rõ chi đang xem. */
  currentBranch?: EarthlyBranch;
}

/**
 * Luận giải Tử Vi cá nhân trong ngày, gắn với lá số đã lưu gần nhất.
 *
 * Component chủ động tải lá số ở client để không chặn phần tử vi chung của trang.
 * Khi chưa có lá số, hiển thị lời mời lưu lá số thay vì lỗi.
 */
export function PersonalizedDailySection({
  branch,
  currentBranch,
}: PersonalizedDailySectionProps): React.ReactElement {
  const pageBranch = currentBranch ?? branch;
  const { chart, status } = useSavedChart(undefined);

  const view = useMemo(() => {
    if (!chart) return null;

    const today = new Date();
    const isoDate = formatLocalDate(today);
    const calendar = getDailyCalendar(isoDate);
    const data = buildPersonalizedDaily(chart, today, calendar, {
      name: chart.birthInfo.name,
    });
    const chartBranch = chart.heavenPlate?.fourPillars?.year?.branch;

    return { data, isoDate, chartBranch };
  }, [chart]);

  if (status === 'loading') {
    return (
      <section
        aria-labelledby="personalized-daily-heading"
        className={CARD_CLASS}
        data-testid="personalized-daily"
      >
        <h2
          id="personalized-daily-heading"
          className="font-heading text-xl font-semibold text-gold sm:text-2xl"
        >
          Tử Vi hôm nay theo lá số của bạn
        </h2>
        <div role="status" className="mt-4 space-y-3">
          <span className="sr-only">Đang tải lá số...</span>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </section>
    );
  }

  if (!chart || !view) {
    const isError = status === 'error';

    return (
      <section
        aria-labelledby="personalized-daily-heading"
        className={CARD_CLASS}
        data-testid="personalized-daily"
      >
        <h2
          id="personalized-daily-heading"
          className="font-heading text-xl font-semibold text-gold sm:text-2xl"
        >
          Tử Vi hôm nay theo lá số của bạn
        </h2>

        {isError ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Chưa tải được lá số đã lưu. Bạn vẫn có thể xem tử vi chung ở trên.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/ho-so" className="font-medium text-gold hover:underline">
                Mở lá số đã lưu
              </Link>
              <span aria-hidden="true" className="text-muted">
                {' '}
                →
              </span>
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed">
            <Link href="/lap-la-so" className="font-medium text-gold hover:underline">
              Lưu lá số để xem Tử Vi hôm nay theo lá số của bạn
            </Link>
            <span aria-hidden="true" className="text-muted">
              {' '}
              →
            </span>
          </p>
        )}
      </section>
    );
  }

  const { data, isoDate, chartBranch } = view;
  const showBranchMismatch = Boolean(pageBranch && chartBranch && pageBranch !== chartBranch);

  return (
    <section
      aria-labelledby="personalized-daily-heading"
      className={CARD_CLASS}
      data-testid="personalized-daily"
    >
      <header className="mb-5">
        <h2
          id="personalized-daily-heading"
          className="font-heading text-xl font-semibold text-gold sm:text-2xl"
        >
          Tử Vi hôm nay theo lá số của bạn
        </h2>
        <p className="mt-1 text-sm text-muted">
          <span className="font-medium text-foreground">{data.chartName ?? 'Lá số đã lưu'}</span>
          {' · '}
          {data.age} tuổi
          {' · '}
          ngày {formatDisplayDate(isoDate)}
        </p>
      </header>

      {showBranchMismatch && pageBranch && chartBranch && (
        <p className="mb-5 rounded-lg border border-gold/20 bg-gold/5 p-3 text-sm leading-relaxed text-muted">
          Lá số đã lưu thuộc tuổi {BRANCH_LABELS[chartBranch]}.{' '}
          <Link
            href={`/tu-vi-hang-ngay/${chartBranch}`}
            className="font-medium text-gold hover:underline"
          >
            Xem tử vi hôm nay cho tuổi {BRANCH_LABELS[chartBranch]}
          </Link>
        </p>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <section
          aria-labelledby="personalized-decade-heading"
          className="rounded-lg border border-border-subtle bg-elevated p-3 sm:p-4"
        >
          <h3
            id="personalized-decade-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Đại vận hiện tại
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-foreground">
              Tuổi {data.decade.ageRange} · cung {data.decade.palaceName}
            </p>
            <LevelBadge level={data.decade.level} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <Stars stars={data.decade.majorStars} />
          </p>
        </section>

        {data.minor && (
          <section
            aria-labelledby="personalized-minor-heading"
            className="rounded-lg border border-border-subtle bg-elevated p-3 sm:p-4"
          >
            <h3
              id="personalized-minor-heading"
              className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted"
            >
              Tiểu vận
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-foreground">Cung {data.minor.palaceName}</p>
              <LevelBadge level={data.minor.level} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              <Stars stars={data.minor.majorStars} />
            </p>
          </section>
        )}
      </div>

      <section
        aria-labelledby="personalized-annual-heading"
        className="mb-5 rounded-lg border border-border-subtle bg-elevated p-3 sm:p-4"
      >
        <h3
          id="personalized-annual-heading"
          className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Lưu niên
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-foreground">
          Năm {data.annual.branchLabel} · Thái Tuế tại cung {data.annual.taiSuiPalace}
        </p>
        <ul className="flex flex-wrap gap-2">
          <InfoChip label="Thái Tuế" value={data.annual.taiSuiPalace} />
          {data.annual.locTonPalace && (
            <InfoChip label="Lộc Tồn" value={data.annual.locTonPalace} />
          )}
          {data.annual.kinhDuongPalace && (
            <InfoChip label="Kình Dương" value={data.annual.kinhDuongPalace} />
          )}
          {data.annual.daLaPalace && <InfoChip label="Đà La" value={data.annual.daLaPalace} />}
          {data.annual.mutagens.map((mutagen) => (
            <InfoChip
              key={`${mutagen.type}-${mutagen.star}`}
              label={`Hóa ${mutagen.type}`}
              value={`${mutagen.star} · ${mutagen.palace}`}
            />
          ))}
        </ul>
      </section>

      {data.activatedPalaces.length > 0 && (
        <section aria-labelledby="personalized-activated-heading" className="mb-5">
          <h3
            id="personalized-activated-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted"
          >
            Cung đang kích hoạt
          </h3>
          <ul className="flex flex-wrap gap-2">
            {data.activatedPalaces.map((palace) => (
              <li key={palace.name} className={CHIP_CLASS}>
                <span className="font-semibold text-foreground">{palace.name}</span>
                <span className="text-muted">
                  <span className="sr-only"> — lý do: </span>· {palace.reasons.join(' · ')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <section
          aria-labelledby="personalized-should-do-heading"
          className="rounded-lg border border-el-moc/30 bg-el-moc/10 p-3 sm:p-4"
        >
          <h3
            id="personalized-should-do-heading"
            className="mb-2 text-base font-semibold text-el-moc"
          >
            Nên làm
          </h3>
          <ul
            data-testid="personalized-should-do"
            className="list-inside list-disc space-y-1 text-sm leading-relaxed text-foreground"
          >
            {data.shouldDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="personalized-should-avoid-heading"
          className="rounded-lg border border-el-hoa/30 bg-el-hoa/10 p-3 sm:p-4"
        >
          <h3
            id="personalized-should-avoid-heading"
            className="mb-2 text-base font-semibold text-el-hoa"
          >
            Nên tránh
          </h3>
          <ul
            data-testid="personalized-should-avoid"
            className="list-inside list-disc space-y-1 text-sm leading-relaxed text-foreground"
          >
            {data.shouldAvoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="personalized-advice-heading"
        className="mb-5 rounded-lg bg-elevated p-3 sm:p-4"
      >
        <h3 id="personalized-advice-heading" className="mb-2 text-base font-semibold">
          Lời khuyên
        </h3>
        <p data-testid="personalized-advice" className="text-sm leading-relaxed text-foreground">
          {data.advice}
        </p>
      </section>

      <details className="rounded-lg border border-border-subtle bg-surface/60 p-3 sm:p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Cơ sở luận giải
        </summary>
        <ul className="mt-3 list-inside list-disc space-y-1 text-xs leading-relaxed text-muted">
          {data.basis.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Dựa trên lá số đã lưu + Can Chi ngày; chưa bao gồm toàn bộ lưu nguyệt/lưu nhật tinh.
      </p>
    </section>
  );
}
