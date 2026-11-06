'use client';

import type { FortuneLevel } from '@/lib/ziwei/interpretation/decade-fortune';
import {
  FORTUNE_RATING_LABELS,
  getFortuneRating,
} from '@/lib/ziwei/interpretation/fortune-score';
import type { Timeline } from '@/lib/ziwei/interpretation/timeline';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface TimelineProps {
  timeline: Timeline;
}

const FORTUNE_TEXT_CLASS: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'text-green-600',
  xấu: 'text-red-600',
  'ổn định': 'text-yellow-600',
};

const FORTUNE_BORDER_CLASS: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'border-green-500 bg-green-500/10',
  xấu: 'border-red-500 bg-red-500/10',
  'ổn định': 'border-yellow-500 bg-yellow-500/10',
};

const FORTUNE_HAN: Readonly<Record<FortuneLevel, string>> = {
  tốt: '吉',
  xấu: '厄',
  'ổn định': '平',
};

export function TimelineView({ timeline }: TimelineProps): React.ReactElement {
  return (
    <section
      aria-labelledby="timeline-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="timeline-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="期" size="lg" />
        <span>
          Tiểu vận từ năm {timeline.startYear} đến {timeline.endYear}
        </span>
      </h2>

      <div className="mb-6">
        <h3 className="mb-3 font-semibold">Khái quát theo thập niên</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          {timeline.decades.map((decade) => (
            <div
              key={decade.decade}
              className={`flex-1 rounded-lg border-2 p-4 ${FORTUNE_BORDER_CLASS[decade.fortune]}`}
            >
              <div className="mb-1 text-sm text-muted">{decade.decade}</div>
              <div className="mb-1 text-2xl font-bold">
                {decade.avgScore.toFixed(1)}
                <span className="text-sm text-muted">/5</span>
              </div>
              <div className={`text-sm ${FORTUNE_TEXT_CLASS[decade.fortune]}`}>
                <HanIcon han={FORTUNE_HAN[decade.fortune]} size="sm" />{' '}
                {FORTUNE_RATING_LABELS[decade.rating ?? getFortuneRating(decade.avgScore)]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Chi tiết từng năm</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
          {timeline.years.map((year) => (
            <div
              key={year.year}
              title={year.summary}
              className={`rounded border p-3 ${FORTUNE_BORDER_CLASS[year.fortune]}`}
            >
              <div className="text-sm font-bold">{year.year}</div>
              <div className="mb-1 text-xs text-muted">{year.zodiac}</div>
              <div
                className="mb-1 flex items-center gap-1"
                aria-label={`${year.score} trên 5 điểm`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${star <= Math.round(year.score) ? 'text-gold' : 'text-muted'}`}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={`text-xs ${FORTUNE_TEXT_CLASS[year.fortune]}`}>
                <HanIcon han={FORTUNE_HAN[year.fortune]} size="sm" />{' '}
                {FORTUNE_RATING_LABELS[year.rating ?? getFortuneRating(year.score)]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
