'use client';

import type { CombinationInterpretation } from '@/lib/ziwei/interpretation/types';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface CombinationsListProps {
  combinations: CombinationInterpretation[];
}

export function CombinationsList({
  combinations,
}: CombinationsListProps): React.ReactElement | null {
  if (combinations.length === 0) {
    return null;
  }

  const good = combinations.filter((c) => c.level === 'tốt');
  const bad = combinations.filter((c) => c.level === 'xấu');
  const neutral = combinations.filter((c) => c.level === 'trung bình');

  return (
    <section
      aria-labelledby="combinations-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="combinations-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="格" size="lg" />
        <span>Cách cục nổi bật</span>
      </h2>

      <div className="space-y-6">
        {good.length > 0 && (
          <CombinationGroup
            title={`Cách cục tốt (${good.length})`}
            han="福"
            titleClassName="text-el-moc"
            items={good}
          />
        )}

        {bad.length > 0 && (
          <CombinationGroup
            title={`Cách cục cần lưu ý (${bad.length})`}
            han="厄"
            titleClassName="text-el-hoa"
            items={bad}
          />
        )}

        {neutral.length > 0 && (
          <CombinationGroup
            title={`Cách cục trung bình (${neutral.length})`}
            han="平"
            titleClassName="text-el-tho"
            items={neutral}
          />
        )}
      </div>
    </section>
  );
}

function CombinationGroup({
  title,
  han,
  titleClassName,
  items,
}: {
  title: string;
  han: string;
  titleClassName: string;
  items: CombinationInterpretation[];
}): React.ReactElement {
  return (
    <div>
      <h3 className={`mb-3 flex items-center gap-2 font-semibold ${titleClassName}`}>
        <HanIcon han={han} size="sm" />
        <span>{title}</span>
      </h3>
      <ul className="space-y-2">
        {items.map((combo) => (
          <li key={combo.id}>
            <CombinationCard combo={combo} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CombinationCard({ combo }: { combo: CombinationInterpretation }): React.ReactElement {
  return (
    <div className="rounded bg-elevated p-4">
      <h4 className="mb-1 font-semibold">{combo.name}</h4>
      <p className="mb-2 text-sm text-muted">{combo.meaning}</p>
    </div>
  );
}
