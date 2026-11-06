import type { DailyHoroscope } from '@/lib/ziwei/daily';
import { BRANCH_NAMES } from '@/lib/ziwei/daily';
import { HanIcon } from '@/components/ui/HanIcon';
import { ZODIAC_HAN, getDailyCalendar } from './daily-calendar';
import { generateDailyContent } from './daily-content';
import { PersonalizedDailySection } from './PersonalizedDailySection';

const RING_CIRCUMFERENCE = 2 * Math.PI * 45;

export function DailyCard({ horoscope }: { horoscope: DailyHoroscope }): React.ReactElement {
  const name = BRANCH_NAMES[horoscope.branch];
  const calendar = getDailyCalendar(horoscope.date);
  const content = generateDailyContent(horoscope.branch, calendar);

  const stats = [
    { label: 'Sự nghiệp', han: '業', value: horoscope.career },
    { label: 'Tình cảm', han: '情', value: horoscope.love },
    { label: 'Tài lộc', han: '財', value: horoscope.wealth },
    { label: 'Sức khỏe', han: '健', value: horoscope.health },
  ];

  return (
    <article className="rounded-xl border border-border-subtle bg-surface p-6 shadow-[0_0_40px_rgba(212,175,55,0.12)] md:p-8">
      <header className="mb-8 flex flex-col items-center text-center">
        <span className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-background shadow-[0_0_24px_rgba(212,175,55,0.3)]">
          <span aria-hidden="true" className="font-han text-5xl leading-none text-gold">
            {ZODIAC_HAN[horoscope.branch]}
          </span>
        </span>
        <h1 className="mb-2 font-heading text-3xl font-semibold text-gold">Tuổi {name}</h1>
        <p className="text-muted">
          Tử vi ngày {horoscope.date} · Âm lịch {calendar.lunarDay}/{calendar.lunarMonth}
          {calendar.isLeapMonth ? ' (nhuận)' : ''} · {calendar.dayCanChi}
        </p>
      </header>

      {/* Vận khí trong ngày */}
      <section className="mb-8 flex flex-col items-center" aria-labelledby="overall-heading">
        <h2 id="overall-heading" className="sr-only">
          Vận khí trong ngày
        </h2>
        <div className="relative h-36 w-36">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-gold/20" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className="stroke-gold"
              strokeDasharray={`${(horoscope.overall / 10) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gold">{horoscope.overall}</span>
            <span className="text-sm text-muted">trên 10</span>
          </div>
        </div>
        <p className="mt-2 text-lg text-muted">Vận khí trong ngày</p>
      </section>

      {/* Chỉ số */}
      <section className="mb-8 grid grid-cols-2 gap-4" aria-label="Chỉ số chi tiết">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-elevated p-4">
            <div className="mb-2 flex items-center gap-2">
              <HanIcon han={stat.han} size="sm" />
              <span className="font-semibold">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-gold">
              {stat.value}
              <span className="text-sm text-muted">/10</span>
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-background"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
                style={{ width: `${stat.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Giải thích ngày */}
      <section
        className="mb-8 rounded-lg border border-gold/30 bg-elevated p-4"
        aria-labelledby="daily-explain-heading"
      >
        <h2 id="daily-explain-heading" className="mb-2 text-lg font-semibold text-gold">
          Ngày hôm nay
        </h2>
        <p className="font-medium leading-relaxed text-foreground">{content.headline}</p>
        <p className="mt-2 leading-relaxed text-muted">{content.relationNote}</p>
        <p className="mt-2 leading-relaxed text-muted">{content.elementNote}</p>
      </section>

      {/* Nên làm / Nên tránh */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <section
          className="rounded-lg border border-el-moc/30 bg-el-moc/10 p-4"
          aria-labelledby="good-heading"
        >
          <h2 id="good-heading" className="mb-2 text-lg font-semibold text-el-moc">
            Nên làm
          </h2>
          <ul
            data-testid="daily-should-do"
            className="list-inside list-disc space-y-1 text-foreground"
          >
            {content.shouldDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section
          className="rounded-lg border border-el-hoa/30 bg-el-hoa/10 p-4"
          aria-labelledby="avoid-heading"
        >
          <h2 id="avoid-heading" className="mb-2 text-lg font-semibold text-el-hoa">
            Nên tránh
          </h2>
          <ul
            data-testid="daily-should-avoid"
            className="list-inside list-disc space-y-1 text-foreground"
          >
            {content.shouldAvoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Giờ hoàng đạo */}
      <section className="mb-8" aria-labelledby="lucky-hours-heading">
        <h2 id="lucky-hours-heading" className="mb-2 text-lg font-semibold">
          Giờ hoàng đạo hôm nay
        </h2>
        <ul className="flex flex-wrap gap-3">
          {content.luckyHours.map((hour) => (
            <li
              key={hour.branch}
              className="rounded-full border border-border-subtle bg-elevated px-4 py-2 font-medium"
            >
              {hour.label} <span className="text-sm text-muted">({hour.time})</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Số & màu may mắn */}
      <section className="mb-8" aria-labelledby="lucky-numbers-heading">
        <h2 id="lucky-numbers-heading" className="mb-2 text-lg font-semibold">
          Số may mắn
        </h2>
        <ul className="flex flex-wrap gap-3">
          {horoscope.luckyNumbers.map((num) => (
            <li
              key={num}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-gold font-bold text-lg text-background shadow-[0_0_14px_rgba(212,175,55,0.35)]"
            >
              {num}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8" aria-labelledby="lucky-colors-heading">
        <h2 id="lucky-colors-heading" className="mb-2 text-lg font-semibold">
          Màu may mắn
        </h2>
        <ul className="flex flex-wrap gap-3">
          {horoscope.luckyColors.map((color) => (
            <li
              key={color}
              className="rounded-full border border-border-subtle bg-elevated px-4 py-2 font-medium"
            >
              {color}
            </li>
          ))}
        </ul>
      </section>

      {/* Lời khuyên */}
      <section className="rounded-lg bg-elevated p-4" aria-labelledby="advice-heading">
        <h2 id="advice-heading" className="mb-2 text-lg font-semibold">
          Lời khuyên
        </h2>
        <p data-testid="daily-advice" className="leading-relaxed text-foreground">
          {content.advice}
        </p>
      </section>

      {/* Tử Vi cá nhân theo lá số đã lưu */}
      <PersonalizedDailySection branch={horoscope.branch} />
    </article>
  );
}
