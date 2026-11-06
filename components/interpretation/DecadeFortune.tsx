'use client';

import type { DecadeFortune, FortuneLevel } from '@/lib/ziwei/interpretation/decade-fortune';
import { FORTUNE_RATING_LABELS } from '@/lib/ziwei/interpretation/fortune-score';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface DecadeFortuneProps {
  decades: DecadeFortune[];
}

const FORTUNE_CLASS: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'text-green-600',
  xấu: 'text-red-600',
  'ổn định': 'text-yellow-600',
};

const FORTUNE_HAN: Readonly<Record<FortuneLevel, string>> = {
  tốt: '吉',
  xấu: '厄',
  'ổn định': '平',
};

export function DecadeFortuneTimeline({ decades }: DecadeFortuneProps): React.ReactElement {
  const currentDecade = decades.find((decade) => decade.isCurrent);

  return (
    <section className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}>
      <CornerOrnaments size="md" />
      <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl">
        <HanIcon han="期" size="lg" />
        <span>Đại vận (10 năm)</span>
      </h2>

      <p className="mb-1 text-[11px] text-muted sm:hidden" aria-hidden="true">
        Vuốt ngang để xem thêm →
      </p>
      <div className="mb-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
        {decades.map((decade) => (
          <div
            key={decade.decade}
            className={`snap-start flex-shrink-0 rounded-lg border-2 px-4 py-2 ${
              decade.isCurrent ? 'border-gold bg-gold/10' : 'border-border-subtle'
            }`}
          >
            <div className="text-xs text-muted">Tuổi</div>
            <div className="font-bold">{decade.decade}</div>
            <div className={`mt-1 text-xs ${FORTUNE_CLASS[decade.fortune]}`}>
              <HanIcon han={FORTUNE_HAN[decade.fortune]} size="sm" />{' '}
              {FORTUNE_RATING_LABELS[decade.rating]}
            </div>
          </div>
        ))}
      </div>

      {currentDecade && (
        <div className="border-t border-border-subtle pt-4">
          <h3 className="mb-3 text-xl font-bold">
            Đại vận hiện tại: {currentDecade.decade} tuổi ({currentDecade.yearRange[0]}-
            {currentDecade.yearRange[1]})
          </h3>
          <p className="mb-4 text-sm leading-relaxed">{currentDecade.summary}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AspectCard han="官" title="Sự nghiệp" content={currentDecade.aspects.career} />
            <AspectCard han="財" title="Tài lộc" content={currentDecade.aspects.wealth} />
            <AspectCard han="婚" title="Tình cảm" content={currentDecade.aspects.love} />
            <AspectCard han="疾" title="Sức khỏe" content={currentDecade.aspects.health} />
          </div>
        </div>
      )}
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
