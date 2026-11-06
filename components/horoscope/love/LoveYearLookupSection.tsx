'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  getLoveYearLookup,
  type LoveYearLookup,
  type LoveYearWindow,
} from '@/lib/ziwei/love-year-lookup';
import { MAX_ZODIAC_YEAR, MIN_ZODIAC_YEAR } from '@/lib/ziwei/zodiac-compatibility';

const EMPTY_YEAR_ERROR = 'Vui lòng nhập năm sinh.';
const RANGE_YEAR_ERROR = `Năm sinh phải là số nguyên từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}.`;

function TagList({ items }: { items: string[] }): React.ReactElement {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border-subtle bg-elevated px-3 py-1 text-sm font-medium text-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function YearList({
  years,
  tone,
}: {
  years: LoveYearWindow[];
  tone: 'favorable' | 'cautious';
}): React.ReactElement {
  if (years.length === 0) {
    return (
      <p className="text-sm leading-relaxed text-muted">
        {tone === 'favorable'
          ? 'Chưa có năm nổi bật trong khoảng mười hai năm tới.'
          : 'Không có năm nào cần đặc biệt lưu ý trong khoảng mười hai năm tới.'}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {years.map((year) => (
        <li
          key={year.year}
          className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-md border px-3 py-2 text-sm ${
            tone === 'favorable'
              ? 'border-gold/30 bg-gold/5'
              : 'border-border-subtle bg-elevated/60'
          }`}
        >
          <span className="font-serif text-lg font-semibold text-foreground">{year.year}</span>
          <span className="text-muted">
            {year.canChi} · tuổi {year.branchLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LoveYearLookupSection(): React.ReactElement {
  const inputId = useId();
  const errorId = useId();
  const headingId = useId();
  const [yearText, setYearText] = useState('');
  const [result, setResult] = useState<LoveYearLookup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = yearText.trim();

    if (trimmed === '') {
      setResult(null);
      setError(EMPTY_YEAR_ERROR);
      return;
    }

    const year = Number(trimmed);

    if (!Number.isInteger(year) || year < MIN_ZODIAC_YEAR || year > MAX_ZODIAC_YEAR) {
      setResult(null);
      setError(RANGE_YEAR_ERROR);
      return;
    }

    setError(null);
    setResult(getLoveYearLookup(year));
  };

  return (
    <section aria-labelledby={headingId} className="space-y-6">
      <div>
        <h2 id={headingId} className="mb-1 font-serif text-2xl font-bold text-foreground">
          Tra cứu tình duyên theo năm sinh
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          Nhập năm sinh để xem bản mệnh, người hợp duyên và những năm thuận lợi cho chuyện tình cảm.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium">
            Năm sinh (dương lịch)
          </label>
          <Input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={MIN_ZODIAC_YEAR}
            max={MAX_ZODIAC_YEAR}
            step={1}
            placeholder="1990"
            value={yearText}
            onChange={(event) => {
              setYearText(event.target.value);
              if (error) setError(null);
            }}
            error={error !== null}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
          />
          {error && (
            <p
              id={errorId}
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="mt-2 scroll-mt-24 rounded-md text-sm text-red-400 focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {error}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Xem duyên
        </Button>
      </form>

      {result && (
        <section
          ref={resultRef}
          tabIndex={-1}
          data-testid="love-year-lookup-result"
          aria-label={`Kết quả tra cứu tình duyên cho năm sinh ${result.person.year}`}
          className="scroll-mt-24 space-y-4 rounded-xl border border-gold/25 bg-linear-to-b from-surface/60 to-background/40 p-4 focus:outline-none focus:ring-2 focus:ring-gold focus-visible:ring-2 focus-visible:ring-gold sm:p-6"
        >
          <p className="text-sm leading-relaxed text-muted">{result.summary}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bản mệnh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                  <dt className="text-muted">Can Chi</dt>
                  <dd className="font-medium text-foreground">{result.person.canChi}</dd>
                  <dt className="text-muted">Nạp âm</dt>
                  <dd className="font-medium text-foreground">
                    {result.person.napAm.name} · {result.person.napAm.elementLabel}
                  </dd>
                </dl>
                <p className="leading-relaxed text-foreground">{result.person.trait}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nên yêu người</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 font-medium text-foreground">Tuổi hợp duyên</p>
                  <TagList items={result.partner.branches} />
                </div>
                <div>
                  <p className="mb-2 font-medium text-foreground">Mệnh tương sinh</p>
                  <TagList items={result.partner.elements} />
                </div>
                <p className="leading-relaxed">{result.partner.guidance}</p>
                <div>
                  <p className="mb-2 font-medium text-foreground">Điều cần lưu tâm</p>
                  <ul className="list-inside list-disc space-y-1 leading-relaxed">
                    {result.partner.cautions.map((caution) => (
                      <li key={caution}>{caution}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    Đây chỉ là gợi ý để cả hai thêm bao dung, không phải lời từ chối.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Năm thuận duyên</CardTitle>
              </CardHeader>
              <CardContent>
                <YearList years={result.favorableYears} tone="favorable" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Năm cần thận trọng</CardTitle>
              </CardHeader>
              <CardContent>
                <YearList years={result.cautiousYears} tone="cautious" />
              </CardContent>
            </Card>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            {result.methodNote} Kết quả chỉ mang tính tham khảo.
          </p>
        </section>
      )}
    </section>
  );
}
