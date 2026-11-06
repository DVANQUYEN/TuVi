'use client';

import type { PersonalSummary as PersonalSummaryType } from '@/lib/ziwei/interpretation/personal-summary';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface PersonalSummaryProps {
  summary: PersonalSummaryView;
}

/** Cho phép hiển thị cả summary cũ chưa có khẩu khí kết luận. */
type PersonalSummaryView = Omit<PersonalSummaryType, 'conclusionQuote' | 'conclusionTone'> & {
  conclusionQuote?: string;
  conclusionTone?: PersonalSummaryType['conclusionTone'];
};

/**
 * Render đoạn văn; các cụm đặt trong `**...**` được nhấn mạnh (thuật ngữ chiêm tinh).
 * Chỉ tạo text node của React, không chèn HTML.
 */
function renderEmphasizedText(text: string): React.ReactNode[] {
  return text.split('**').map((segment, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-gold">
        {segment}
      </strong>
    ) : (
      <span key={i}>{segment}</span>
    )
  );
}

export function PersonalSummaryCard({ summary }: PersonalSummaryProps): React.ReactElement {
  const narrative = [
    summary.introParagraph,
    summary.menhStarParagraph,
    summary.tamHopAndThanParagraph,
    summary.conclusionParagraph,
  ].filter((paragraph): paragraph is string => Boolean(paragraph));

  return (
    <section
      aria-labelledby="personal-summary-heading"
      className={`mb-8 rounded-lg border p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="personal-summary-heading"
        className="mb-2 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="命" size="lg" />
        <span>Luận giải</span>
      </h2>
      {summary.ownerName && (
        <p className="mb-4 text-sm text-muted">Lá số của {summary.ownerName}</p>
      )}

      <div className="mb-4 text-xl font-bold text-gold">{summary.headline}</div>

      {summary.conclusionQuote && (
        <p
          data-testid="personal-summary-conclusion"
          data-tone={summary.conclusionTone}
          className="mx-auto mb-6 max-w-2xl text-balance text-center font-serif text-lg font-semibold italic leading-relaxed text-gold-bright sm:text-xl"
        >
          “{summary.conclusionQuote}”
        </p>
      )}

      <div className="mb-6 space-y-4 leading-relaxed text-foreground">
        {narrative.length > 0 ? (
          narrative.map((paragraph, i) => <p key={i}>{renderEmphasizedText(paragraph)}</p>)
        ) : (
          <p>{summary.description}</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <HanIcon han="運" size="sm" />
          <span>Đặc điểm nổi bật</span>
        </h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {summary.keyTraits.map((trait, i) => (
            <div key={i} className="flex items-center gap-2 rounded bg-elevated px-3 py-2">
              <span aria-hidden="true" className="text-gold">
                •
              </span>
              <span className="text-sm">{trait}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-gold/20 bg-gold/10 p-4">
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <HanIcon han="禄" size="sm" />
          <span>Con đường phù hợp</span>
        </h3>
        <p className="text-foreground">{summary.lifePath}</p>
      </div>
    </section>
  );
}
