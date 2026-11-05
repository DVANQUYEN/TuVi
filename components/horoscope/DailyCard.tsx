import type { DailyHoroscope } from '@/lib/ziwei/daily';
import { BRANCH_NAMES } from '@/lib/ziwei/daily';
import { HanIcon } from '@/components/ui/HanIcon';
import {
  ZODIAC_HAN,
  HOUR_SLOTS,
  getBranchRelation,
  getDailyCalendar,
  type BranchRelation,
  type DailyCalendar,
} from './daily-calendar';

const RING_CIRCUMFERENCE = 2 * Math.PI * 45;

/** Giải thích quan hệ địa chi giữa tuổi và ngày (tam hợp, lục xung, tứ hình). */
function explainRelation(relation: BranchRelation, name: string, dayName: string): string {
  switch (relation) {
    case 'tamHop':
      return `Ngày ${dayName} tam hợp với tuổi ${name}: các khí trong ngày hỗ trợ tuổi này, nên điểm tổng quan ở mức cao.`;
    case 'lucXung':
      return `Ngày ${dayName} lục xung với tuổi ${name}: hai khí đối nghịch dễ gây va chạm, nên điểm tổng quan thấp hơn bình thường.`;
    case 'tuHinh':
      return `Ngày ${dayName} tứ hình với tuổi ${name}: dễ phát sinh bất đồng nhỏ, cần giữ bình tĩnh trong giao tiếp.`;
    case 'binh':
      return `Ngày ${dayName} không có quan hệ tam hợp, lục xung hay tứ hình với tuổi ${name}; điểm số phụ thuộc vào biến động trong ngày.`;
  }
}

/** Giải thích ngày: quan hệ địa chi, nạp âm và trực của ngày. */
function getDailyExplanation(
  name: string,
  relation: BranchRelation,
  calendar: DailyCalendar
): string {
  const dayName = BRANCH_NAMES[calendar.dayBranch];
  const parts = [explainRelation(relation, name, dayName)];

  if (calendar.napAm) {
    parts.push(`Ngày ${calendar.dayCanChi} thuộc mệnh ${calendar.napAm}.`);
  }

  parts.push(
    `Trực ${calendar.truc.name} là ngày ${
      calendar.truc.lucky ? 'hoàng đạo, thuận cho việc lớn' : 'hắc đạo, nên hạn chế việc lớn'
    }.`
  );

  return parts.join(' ');
}

/** Gợi ý làm được, theo quan hệ địa chi (nội dung tĩnh, cần chuyên gia nội dung rà soát). */
const GOOD_BY_RELATION: Record<BranchRelation, string[]> = {
  tamHop: ['Khởi động dự án mới', 'Gặp gỡ đối tác, đề xuất ý tưởng'],
  lucXung: ['Rà soát lại kế hoạch đang có', 'Nghỉ ngơi, giữ gìn sức khỏe'],
  tuHinh: ['Làm việc theo quy trình, kiểm tra kỹ', 'Lắng nghe trước khi phản hồi'],
  binh: ['Duy trì nhịp làm việc đều đặn'],
};

/** Việc nên tránh theo quan hệ địa chi. */
const AVOID_BY_RELATION: Record<BranchRelation, string[]> = {
  tamHop: [],
  lucXung: ['Ký kết hợp đồng quan trọng', 'Tranh cãi hoặc nóng vội trong giao tiếp'],
  tuHinh: ['Tranh luận với người thân, đồng nghiệp', 'Mạo hiểm tài chính'],
  binh: [],
};

/** Việc nên tránh theo tên trực (chỉ các trực hắc đạo). */
const AVOID_BY_TRUC: Partial<Record<string, string>> = {
  Trừ: 'Cưới hỏi, khởi công xây dựng',
  Chấp: 'Vay mượn tiền hoặc bảo lãnh người khác',
  Phá: 'Khởi công, động thổ, xây dựng',
  Nguy: 'Leo trèo, làm việc trên cao',
  Thu: 'Đầu tư mạo hiểm hoặc cho vay',
  Bế: 'Khai trương, nhập học, xuất hành xa',
};

/** Tối đa 3 việc cụ thể nên tránh trong ngày, suy ra từ địa chi và trực. */
function getShouldAvoid(relation: BranchRelation, calendar: DailyCalendar): string[] {
  const items = [...AVOID_BY_RELATION[relation]];
  const trucAvoid = AVOID_BY_TRUC[calendar.truc.name];
  if (trucAvoid) items.push(trucAvoid);

  const unique = [...new Set(items)].slice(0, 3);
  return unique.length > 0 ? unique : ['Quyết định vội vàng khi chưa đủ thông tin'];
}

export function DailyCard({ horoscope }: { horoscope: DailyHoroscope }): React.ReactElement {
  const name = BRANCH_NAMES[horoscope.branch];
  const calendar = getDailyCalendar(horoscope.date);
  const relation = getBranchRelation(horoscope.branch, calendar.dayBranch);
  const advice = {
    good: GOOD_BY_RELATION[relation],
    avoid: getShouldAvoid(relation, calendar),
  };

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

      {/* Điểm tổng quan */}
      <section className="mb-8 flex flex-col items-center" aria-labelledby="overall-heading">
        <h2 id="overall-heading" className="sr-only">
          Điểm tổng quan
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
        <p className="mt-2 text-lg text-muted">Điểm tổng quan</p>
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
        <p className="leading-relaxed text-foreground">
          {getDailyExplanation(name, relation, calendar)}
        </p>
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
          <ul className="list-inside list-disc space-y-1 text-foreground">
            {advice.good.map((item) => (
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
          <ul className="list-inside list-disc space-y-1 text-foreground">
            {advice.avoid.map((item) => (
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
          {calendar.luckyHours.map((hour) => (
            <li
              key={hour}
              className="rounded-full border border-border-subtle bg-elevated px-4 py-2 font-medium"
            >
              {BRANCH_NAMES[hour]} <span className="text-sm text-muted">({HOUR_SLOTS[hour]})</span>
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
        <p className="leading-relaxed text-foreground">{horoscope.advice}</p>
      </section>
    </article>
  );
}
