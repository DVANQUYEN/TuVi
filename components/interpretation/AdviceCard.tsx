'use client';

import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface AdviceCardProps {
  advice: string;
}

export function AdviceCard({ advice }: AdviceCardProps): React.ReactElement {
  return (
    <section
      aria-labelledby="advice-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="advice-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="吉" size="lg" />
        <span>Lời khuyên tổng quan</span>
      </h2>
      <p className="text-base leading-relaxed md:text-lg">{advice}</p>
    </section>
  );
}
