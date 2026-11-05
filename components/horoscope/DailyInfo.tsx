import { BRANCH_NAMES } from '@/lib/ziwei/daily';
import { HOUR_SLOTS, getDailyCalendar } from './daily-calendar';

interface DailyInfoProps {
  date: Date;
}

/** Format YYYY-MM-DD theo ngày local (khớp với DailyHoroscope.date). */
function toLocalIsoDate(date: Date): string {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function DailyInfo({ date }: DailyInfoProps): React.ReactElement {
  const calendar = getDailyCalendar(toLocalIsoDate(date));
  const leap = calendar.isLeapMonth ? ' (nhuận)' : '';

  const items = [
    {
      label: 'Ngày âm lịch',
      value: `${calendar.lunarDay}/${calendar.lunarMonth}${leap}`,
    },
    {
      label: 'Can Chi ngày',
      value: calendar.dayCanChi,
    },
    {
      label: 'Ngũ hành',
      value: calendar.napAm,
    },
    {
      label: 'Xung khắc tuổi',
      value: `Tuổi ${BRANCH_NAMES[calendar.conflictBranch]}`,
    },
  ];

  return (
    <section
      aria-labelledby="daily-info-heading"
      className="mb-10 rounded-xl border border-border-subtle bg-surface p-6 shadow-[0_0_30px_rgba(212,175,55,0.08)]"
    >
      <h2 id="daily-info-heading" className="sr-only">
        Thông tin ngày hôm nay
      </h2>
      <dl className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="mb-1 text-xs uppercase tracking-wider text-muted">{item.label}</dt>
            <dd className="font-heading text-xl font-semibold text-gold">{item.value}</dd>
          </div>
        ))}
      </dl>
      <dl className="mt-6 grid gap-6 border-t border-border-subtle pt-6 text-center md:grid-cols-2">
        <div>
          <dt className="mb-1 text-xs uppercase tracking-wider text-muted">Trực</dt>
          <dd
            className={`font-heading text-xl font-semibold ${calendar.truc.lucky ? 'text-el-moc' : 'text-el-hoa'}`}
          >
            {calendar.truc.name}
            <span className="ml-2 text-sm font-normal">
              {calendar.truc.lucky ? '(ngày tốt)' : '(ngày xấu)'}
            </span>
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs uppercase tracking-wider text-muted">Giờ hoàng đạo</dt>
          <dd className="text-sm text-foreground">
            {calendar.luckyHours
              .map((hour) => `${BRANCH_NAMES[hour]} (${HOUR_SLOTS[hour]})`)
              .join(', ')}
          </dd>
        </div>
      </dl>
    </section>
  );
}
