'use client';

import type { YearlyFortune } from '@/lib/ziwei/interpretation/yearly-fortune';
import type { FortuneLevel } from '@/lib/ziwei/interpretation/fortune-score';
import { FORTUNE_RATING_LABELS } from '@/lib/ziwei/interpretation/fortune-score';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface YearlyFortuneProps {
  fortune: YearlyFortune;
}

const FORTUNE_TEXT_CLASS: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'text-green-600',
  xấu: 'text-red-600',
  'ổn định': 'text-yellow-600',
};

const FORTUNE_HAN: Readonly<Record<FortuneLevel, string>> = {
  tốt: '吉',
  xấu: '厄',
  'ổn định': '平',
};

export function YearlyFortuneCard({ fortune }: YearlyFortuneProps): React.ReactElement {
  return (
    <section className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}>
      <CornerOrnaments size="md" />
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl">
        <HanIcon han="期" size="lg" />
        <span>
          Vận hạn năm {fortune.year} ({fortune.zodiac})
        </span>
      </h2>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-semibold">Khái quát tiểu vận</span>
          <div className="flex items-center gap-1" aria-label={`${fortune.score} trên 5 điểm`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= Math.round(fortune.score) ? 'text-gold' : 'text-muted'}
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div
          className={`mb-2 flex items-center gap-2 text-sm ${FORTUNE_TEXT_CLASS[fortune.fortune]}`}
        >
          <HanIcon han={FORTUNE_HAN[fortune.fortune]} size="sm" />
          <span>{FORTUNE_RATING_LABELS[fortune.rating]}</span>
        </div>
        <p className="mb-2 text-sm leading-relaxed">{fortune.summary}</p>
        <p className="flex items-start gap-2 text-sm leading-relaxed italic">
          <HanIcon han="吉" size="sm" />
          <span>{fortune.advice}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AspectCard han="官" title="Sự nghiệp" content={fortune.aspects.career} />
        <AspectCard han="財" title="Tài lộc" content={fortune.aspects.wealth} />
        <AspectCard han="婚" title="Tình cảm" content={fortune.aspects.love} />
        <AspectCard han="疾" title="Sức khỏe" content={fortune.aspects.health} />
      </div>
    </section>
  );
}

function AspectCard({
  han,
  title,
  content,
}: {
  han: string;
  title: string;
  content: string;
}): React.ReactElement {
  return (
    <div className="rounded bg-elevated p-4">
      <h4 className="mb-2 flex items-center gap-2 font-semibold">
        <HanIcon han={han} size="sm" />
        <span>{title}</span>
      </h4>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}
