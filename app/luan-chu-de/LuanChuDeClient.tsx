'use client';

import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TopicInterpretationTabs } from '@/components/interpretation/TopicInterpretation';
import { SavedChartFallback } from '@/components/storage/SavedChartFallback';
import { useSavedChart } from '@/components/storage/useSavedChart';
import { interpretByTopic } from '@/lib/ziwei/interpretation/topic-interpretation';

export interface LuanChuDeClientProps {
  savedId?: string;
}

export function LuanChuDeClient({ savedId }: LuanChuDeClientProps): React.ReactElement {
  const { chart, status } = useSavedChart(savedId);

  const topics = useMemo(() => {
    if (!chart) return [];
    return [
      interpretByTopic(chart, 'career'),
      interpretByTopic(chart, 'love'),
      interpretByTopic(chart, 'wealth'),
      interpretByTopic(chart, 'health'),
    ];
  }, [chart]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 md:py-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-center font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Luận giải <span className="text-gold">theo chủ đề</span>
          </h1>
          <p className="mb-8 text-center text-muted">
            Phân tích chi tiết theo từng khía cạnh cuộc sống
          </p>

          {chart && topics.length > 0 ? (
            <TopicInterpretationTabs topics={topics} />
          ) : (
            <SavedChartFallback status={status} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
