'use client';

import { useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';
import {
  BRANCH_LABELS,
  getBranchExampleYears,
  getZodiacCompatibility,
  MAX_ZODIAC_YEAR,
  MIN_ZODIAC_YEAR,
  type ZodiacCompatibility,
} from '@/lib/ziwei/zodiac-compatibility';

function BranchList({ branches }: { branches: readonly EarthlyBranch[] }): React.ReactElement {
  return (
    <ul className="flex flex-wrap gap-2">
      {branches.map((branch) => (
        <li key={branch} className="rounded-md border border-border-subtle bg-elevated px-3 py-1.5">
          <span className="block text-sm font-medium text-foreground">{BRANCH_LABELS[branch]}</span>
          <span className="mt-0.5 block text-xs text-muted">
            {getBranchExampleYears(branch).join(' · ')}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ZodiacCompatibilitySection(): React.ReactElement {
  const inputId = useId();
  const errorId = useId();
  const resultTitleId = useId();
  const [yearText, setYearText] = useState('');
  const [result, setResult] = useState<ZodiacCompatibility | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed = yearText.trim();
    const year = Number(trimmed);

    if (
      trimmed === '' ||
      !Number.isInteger(year) ||
      year < MIN_ZODIAC_YEAR ||
      year > MAX_ZODIAC_YEAR
    ) {
      setResult(null);
      setError(`Năm sinh phải là số từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}.`);
      return;
    }

    setError(null);
    setResult(getZodiacCompatibility(year));
  };

  return (
    <section aria-labelledby={`${inputId}-heading`} className="space-y-6">
      <div>
        <h2 id={`${inputId}-heading`} className="mb-1 text-2xl font-bold">
          Tra cứu theo năm sinh
        </h2>
        <p className="text-sm text-muted">
          Nhập năm sinh để xem tam hợp, lục hợp và tứ hành xung của tuổi bạn.
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
            onChange={(event) => setYearText(event.target.value)}
            error={error !== null}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
          />
          {error && (
            <p id={errorId} role="alert" className="mt-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Xem tam hợp
        </Button>
      </form>

      {result && (
        <section aria-labelledby={resultTitleId} className="space-y-4">
          <div>
            <h3 id={resultTitleId} className="text-xl font-semibold">
              Tuổi {result.branchLabel} ({result.year})
            </h3>
            <p className="mt-1 text-xs text-muted">
              Các năm sinh tuổi {result.branchLabel}:{' '}
              {getBranchExampleYears(result.branch).join(' · ')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Tam hợp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Hai tuổi cùng bộ ba tam hợp với bạn:</p>
                <BranchList branches={result.tamHop} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lục hợp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Tuổi lục hợp với bạn:</p>
                <BranchList branches={[result.lucHop]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tứ hành xung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  Ba tuổi xung khắc với bạn, nên cân nhắc kỹ khi hợp tác lớn:
                </p>
                <BranchList branches={result.tuHanhXung} />
              </CardContent>
            </Card>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            Năm sinh chỉ là ví dụ theo chu kỳ 12 năm; Tam hợp/Lục hợp/Tứ hành xung chỉ mang tính
            tham khảo.
          </p>
        </section>
      )}
    </section>
  );
}
