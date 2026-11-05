'use client';

import { useEffect, useRef, useState } from 'react';
import { createChartEngine } from '@/lib/ziwei';
import { calculateCompatibility, type CompatibilityResult } from '@/lib/ziwei/compatibility';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei';
import { BirthForm } from '@/components/chart/BirthForm';
import { Button } from '@/components/ui/Button';

const engine = createChartEngine();

const ASPECT_LABELS: Record<keyof CompatibilityResult['aspects'], string> = {
  fiveElements: 'Ngũ hành',
  heavenlyStems: 'Thiên can',
  earthlyBranches: 'Địa chi',
  palaces: 'Cung mệnh',
};

const GENERATE_ERROR = 'Không thể lập lá số. Vui lòng kiểm tra lại thông tin.';

export function CompatibilityForm(): React.ReactElement {
  const [chart1, setChart1] = useState<ZiweiChart | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Đưa focus về tiêu đề mỗi khi chuyển bước (bỏ qua lần render đầu để không cướp focus khi tải trang)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const buildChart = (birthInfo: BirthInfo): ZiweiChart | null => {
    try {
      return engine.generateChart(birthInfo);
    } catch {
      setError(GENERATE_ERROR);
      return null;
    }
  };

  const handlePerson1 = (birthInfo: BirthInfo): void => {
    const chart = buildChart(birthInfo);
    if (!chart) return;
    setError(null);
    setChart1(chart);
    setStep(2);
  };

  const handlePerson2 = (birthInfo: BirthInfo): void => {
    if (!chart1) return;
    const chart2 = buildChart(birthInfo);
    if (!chart2) return;
    setError(null);
    setResult(calculateCompatibility(chart1, chart2));
    setStep(3);
  };

  const handleReset = (): void => {
    setChart1(null);
    setResult(null);
    setError(null);
    setStep(1);
  };

  return (
    <div className="space-y-8">
      {error && (
        <div
          className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="mb-1 text-2xl font-bold focus:outline-none">
            Người thứ nhất
          </h2>
          <p className="mb-4 text-sm text-muted">Bước 1/2</p>
          <BirthForm onSubmit={handlePerson1} />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="mb-1 text-2xl font-bold focus:outline-none">
            Người thứ hai
          </h2>
          <p className="mb-4 text-sm text-muted">Bước 2/2</p>
          <BirthForm onSubmit={handlePerson2} />
        </div>
      )}

      {step === 3 && result && (
        <div className="space-y-6">
          <section
            aria-labelledby="compatibility-score-heading"
            className="rounded-lg border border-border-subtle bg-surface p-8 text-center"
          >
            <h2
              id="compatibility-score-heading"
              ref={headingRef}
              tabIndex={-1}
              className="mb-4 text-2xl font-bold focus:outline-none"
            >
              Kết quả hợp tuổi
            </h2>
            <p className="mb-2 font-bold text-gold">
              <span className="text-6xl">{result.score}</span>
              <span className="text-2xl text-muted">/100</span>
            </p>
            <p className="mb-4 text-2xl font-semibold capitalize">{result.level}</p>
            <p className="text-muted">{result.advice}</p>
          </section>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(Object.keys(ASPECT_LABELS) as (keyof CompatibilityResult['aspects'])[]).map((key) => {
              const aspect = result.aspects[key];
              return (
                <li key={key} className="rounded bg-surface p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{ASPECT_LABELS[key]}</h3>
                    <span className="text-2xl font-bold text-gold">
                      {aspect.score}
                      <span className="text-sm text-muted">/10</span>
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{aspect.meaning}</p>
                  <p className="mt-2 text-sm text-muted">{aspect.explanation}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-gold">Lời khuyên: </span>
                    {aspect.tip}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="rounded bg-surface p-4" aria-labelledby="strengths-heading">
              <h3 id="strengths-heading" className="mb-2 text-lg font-semibold text-mutagen-loc">
                Điểm mạnh
              </h3>
              {result.strengths.length > 0 ? (
                <ul className="list-inside list-disc space-y-1">
                  {result.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Không có điểm mạnh nổi bật</p>
              )}
            </section>

            <section className="rounded bg-surface p-4" aria-labelledby="challenges-heading">
              <h3 id="challenges-heading" className="mb-2 text-lg font-semibold text-mutagen-quyen">
                Thách thức
              </h3>
              {result.challenges.length > 0 ? (
                <ul className="list-inside list-disc space-y-1">
                  {result.challenges.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Không có thách thức lớn</p>
              )}
            </section>
          </div>

          <Button type="button" onClick={handleReset} className="w-full">
            Xem lại
          </Button>
        </div>
      )}
    </div>
  );
}
