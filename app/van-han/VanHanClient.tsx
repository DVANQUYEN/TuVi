'use client';

import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DecadeFortuneTimeline } from '@/components/interpretation/DecadeFortune';
import { YearlyFortuneCard } from '@/components/interpretation/YearlyFortune';
import { TimelineView } from '@/components/interpretation/Timeline';
import { SavedChartFallback } from '@/components/storage/SavedChartFallback';
import { useSavedChart } from '@/components/storage/useSavedChart';
import { calculateDecadeFortune } from '@/lib/ziwei/interpretation/decade-fortune';
import { calculateYearlyFortune } from '@/lib/ziwei/interpretation/yearly-fortune';
import { generateTimeline } from '@/lib/ziwei/interpretation/timeline';

export interface VanHanClientProps {
  savedId?: string;
}

export function VanHanClient({ savedId }: VanHanClientProps): React.ReactElement {
  const { chart, status } = useSavedChart(savedId);

  const currentYear = new Date().getFullYear();
  const birthYear = chart?.birthInfo.year ?? 0;
  const currentAge = birthYear > 0 ? currentYear - birthYear : 0;

  const decadeFortune = useMemo(() => {
    if (!chart || birthYear <= 0) return [];
    return calculateDecadeFortune(chart, currentAge, birthYear);
  }, [chart, currentAge, birthYear]);

  const yearlyFortune = useMemo(() => {
    if (!chart) return null;
    return calculateYearlyFortune(chart, currentYear, birthYear);
  }, [chart, currentYear, birthYear]);

  const timeline = useMemo(() => {
    if (!chart || birthYear <= 0) return null;
    return generateTimeline(chart, birthYear, 20);
  }, [chart, birthYear]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 md:py-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-center font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Vận <span className="text-gold">hạn</span>
          </h1>
          <p className="mb-8 text-center text-muted">Đại hạn và lưu niên theo từng năm</p>

          {chart ? (
            <div>
              {timeline && <TimelineView timeline={timeline} />}
              {decadeFortune.length > 0 && <DecadeFortuneTimeline decades={decadeFortune} />}
              {yearlyFortune && <YearlyFortuneCard fortune={yearlyFortune} />}
            </div>
          ) : (
            <SavedChartFallback status={status} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
