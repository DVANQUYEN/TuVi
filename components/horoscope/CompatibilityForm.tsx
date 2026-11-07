'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { createChartEngine } from '@/lib/ziwei';
import { DEFAULT_LOCATION } from '@/lib/ziwei/data';
import {
  calculateCompatibility,
  type CompatibilityResult as CompatibilityResultData,
} from '@/lib/ziwei/compatibility';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei';
import {
  REDUCED_MOTION_MEDIA_QUERY,
  usePrefersReducedMotion,
} from '@/lib/hooks/use-prefers-reduced-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  LoveProfileFields,
  type LoveProfileErrors,
  type LoveProfileField,
  type LoveProfileValue,
} from './love/LoveProfileFields';
import { saveLoveCompatibilityRequest } from '@/lib/supabase/love-requests';
import { LoveEmblemPanel } from './love/LoveEmblemPanel';
import { CompatibilityResult } from './love/CompatibilityResult';
import {
  buildLoveEmblemPreview,
  isValidLoveDate,
  type LoveEmblemPersonPreview,
} from './love/emblem-preview';
import type { LoveEmblemPhase } from './love/TinhDuyenEmblem';
import { LOVE_TOTAL_REVEAL_MS } from './love/merge-timing';

const engine = createChartEngine();

const RESULT_REVEAL_MS = LOVE_TOTAL_REVEAL_MS;

const INVALID_DATE_MESSAGE = 'Ngày sinh không hợp lệ với tháng/năm đã chọn.';

const NAME_REQUIRED_MESSAGE = 'Vui lòng nhập họ và tên.';

const NAME_TOO_LONG_MESSAGE = 'Họ tên không được vượt quá 120 ký tự.';

const SAME_GENDER_MESSAGE = 'Cần chọn một người nam và một người nữ.';

const FIELD_LABELS: Record<LoveProfileField, string> = {
  name: 'Họ tên',
  gender: 'Giới tính',
  calendarType: 'Loại lịch',
  day: 'Ngày sinh',
  month: 'Tháng sinh',
  year: 'Năm sinh',
  hour: 'Giờ sinh',
  minute: 'Phút sinh',
  region: 'Nơi sinh',
};

const GENERATE_ERROR = 'Chưa thể lập lá số. Vui lòng kiểm tra lại thông tin.';

/** Độ trễ ngắn trước khi lập lá số trực tiếp, tránh sinh lại theo từng phím gõ. */
const LIVE_CHART_DEBOUNCE_MS = 280;

/** Trạng thái mặc định: không có sao chính nào được thắp sáng. */
const NO_ACTIVE_STAR_IDS: ReadonlySet<string> = new Set();

interface ProfileErrors {
  first: LoveProfileErrors;
  second: LoveProfileErrors;
}

interface SummaryItem {
  id: string;
  text: string;
}

interface CompatibilityOutcome {
  phase: LoveEmblemPhase;
  /** Kết quả đã tính; chỉ hiển thị khi phase chuyển sang `revealed`. */
  result: CompatibilityResultData | null;
}

function createEmptyProfile(): LoveProfileValue {
  return {
    name: '',
    gender: '',
    calendarType: 'solar',
    day: '',
    month: '',
    year: '',
    hour: '',
    minute: '0',
    region: 'north',
  };
}

function isIntegerInRange(value: string, min: number, max: number): boolean {
  if (value === '') return false;
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max;
}

function hasErrors(errors: LoveProfileErrors): boolean {
  return Object.keys(errors).length > 0;
}

function validateProfile(value: LoveProfileValue): LoveProfileErrors {
  const errors: LoveProfileErrors = {};

  const trimmedName = value.name.trim();
  if (!trimmedName) {
    errors.name = NAME_REQUIRED_MESSAGE;
  } else if (trimmedName.length > 120) {
    errors.name = NAME_TOO_LONG_MESSAGE;
  }

  if (!value.gender) errors.gender = 'Vui lòng chọn giới tính.';

  if (!value.day) {
    errors.day = 'Vui lòng chọn ngày sinh.';
  } else if (!isIntegerInRange(value.day, 1, 31)) {
    errors.day = 'Ngày sinh không hợp lệ.';
  }

  if (!value.month) {
    errors.month = 'Vui lòng chọn tháng sinh.';
  } else if (!isIntegerInRange(value.month, 1, 12)) {
    errors.month = 'Tháng sinh không hợp lệ.';
  }

  if (!value.year) {
    errors.year = 'Vui lòng chọn năm sinh.';
  } else if (!isIntegerInRange(value.year, 1900, 2099)) {
    errors.year = 'Năm sinh phải từ 1900 đến 2099.';
  }

  if (!value.hour) {
    errors.hour = 'Vui lòng chọn giờ sinh.';
  } else if (!isIntegerInRange(value.hour, 0, 23)) {
    errors.hour = 'Giờ sinh không hợp lệ.';
  }

  if (value.minute !== '' && !isIntegerInRange(value.minute, 0, 59)) {
    errors.minute = 'Phút sinh không hợp lệ.';
  }

  // Chỉ kiểm tra ngày thật khi cả ba trường ngày/tháng/năm đã qua kiểm tra cơ bản,
  // tránh ghi đè thông báo thiếu trường cụ thể.
  const hasBasicDate =
    isIntegerInRange(value.day, 1, 31) &&
    isIntegerInRange(value.month, 1, 12) &&
    isIntegerInRange(value.year, 1900, 2099);

  if (
    hasBasicDate &&
    !isValidLoveDate(value.calendarType, Number(value.day), Number(value.month), Number(value.year))
  ) {
    errors.day = INVALID_DATE_MESSAGE;
  }

  return errors;
}

function toBirthInfo(value: LoveProfileValue, viewingYear: number): BirthInfo {
  return {
    name: value.name.trim() || undefined,
    gender: value.gender as 'nam' | 'nu',
    calendarType: value.calendarType,
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
    hour: Number(value.hour),
    minute: value.minute === '' ? 0 : Number(value.minute),
    location: DEFAULT_LOCATION[value.region],
    viewingYear,
  };
}

/**
 * Gom các sao chính tại Mệnh, Thân và Phu Thê của cả hai lá số.
 *
 * Huy hiệu chỉ có nhãn cho 14 chính tinh, nên các sao phụ không được đưa vào.
 */
function collectImportantMajorStarIds(charts: readonly ZiweiChart[]): ReadonlySet<string> {
  const ids = new Set<string>();

  charts.forEach((chart) => {
    chart.palaces.forEach((palace) => {
      if (palace.id !== 'menh' && palace.id !== 'phuThe' && !palace.isBodyPalace) return;

      palace.majorStars.forEach((star) => ids.add(star.id));
    });
  });

  return ids;
}

function buildSummaryItems(
  errors: LoveProfileErrors,
  idPrefix: string,
  profileLabel: string
): SummaryItem[] {
  return (Object.keys(FIELD_LABELS) as LoveProfileField[])
    .filter((field) => Boolean(errors[field]))
    .map((field) => ({
      id: `${idPrefix}-${field}`,
      text: `${profileLabel} · ${FIELD_LABELS[field]}: ${errors[field]}`,
    }));
}

export function CompatibilityForm(): React.ReactElement {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '') || 'form';
  const firstPrefix = `love-${reactId}-first`;
  const secondPrefix = `love-${reactId}-second`;
  const summaryHeadingId = `${firstPrefix}-errors-heading`;
  const resultHeadingId = `${firstPrefix}-result-heading`;
  const strengthsHeadingId = `${firstPrefix}-strengths-heading`;
  const challengesHeadingId = `${firstPrefix}-challenges-heading`;

  const [profiles, setProfiles] = useState<[LoveProfileValue, LoveProfileValue]>(() => [
    createEmptyProfile(),
    createEmptyProfile(),
  ]);
  const [errors, setErrors] = useState<ProfileErrors | null>(null);
  const [outcome, setOutcome] = useState<CompatibilityOutcome>({ phase: 'idle', result: null });
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [activeStarIds, setActiveStarIds] = useState<ReadonlySet<string>>(NO_ACTIVE_STAR_IDS);
  const reducedMotion = usePrefersReducedMotion();

  const emblemRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const mergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldFocusSummary = useRef(false);
  const shouldFocusFirstName = useRef(false);

  const { phase, result } = outcome;
  const visibleResult = phase === 'revealed' ? result : null;
  const liveStatusText =
    phase === 'merging'
      ? 'Đang hoà quyện hai lá số…'
      : phase === 'revealed'
        ? 'Đã hoàn tất luận giải duyên đôi lứa.'
        : '';

  const previews = useMemo<[LoveEmblemPersonPreview, LoveEmblemPersonPreview]>(
    () => [buildLoveEmblemPreview(profiles[0]), buildLoveEmblemPreview(profiles[1])],
    [profiles]
  );

  const bothProfilesValid = useMemo(
    () => profiles.every((profile) => !hasErrors(validateProfile(profile))),
    [profiles]
  );

  // Lập lá số trực tiếp khi cả hai hồ sơ đã đủ dữ liệu, chỉ để thắp sáng các
  // sao chính thực tế tại Mệnh/Thân/Phu Thê. Lỗi được giữ kín: huy hiệu trở về
  // trạng thái mờ thay vì hiện thông báo.
  useEffect(() => {
    if (!bothProfilesValid) return undefined;

    const timer = setTimeout(() => {
      try {
        const currentYear = new Date().getFullYear();
        const charts = profiles.map((profile) =>
          engine.generateChart(toBirthInfo(profile, currentYear))
        );
        setActiveStarIds(collectImportantMajorStarIds(charts));
      } catch {
        setActiveStarIds(NO_ACTIVE_STAR_IDS);
      }
    }, LIVE_CHART_DEBOUNCE_MS);

    return (): void => clearTimeout(timer);
  }, [bothProfilesValid, profiles]);

  // Hồ sơ chưa hợp lệ luôn hiển thị trạng thái mờ, kể cả khi còn giữ mã sao cũ.
  const emblemStarIds = bothProfilesValid ? activeStarIds : NO_ACTIVE_STAR_IDS;

  const summaryItems = errors
    ? [
        ...buildSummaryItems(errors.first, firstPrefix, 'Đệ Nhất'),
        ...buildSummaryItems(errors.second, secondPrefix, 'Đệ Nhị'),
      ]
    : [];

  const cancelMerge = (): void => {
    if (mergeTimerRef.current !== null) {
      clearTimeout(mergeTimerRef.current);
      mergeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return (): void => {
      if (mergeTimerRef.current !== null) {
        clearTimeout(mergeTimerRef.current);
        mergeTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (errors && shouldFocusSummary.current) {
      shouldFocusSummary.current = false;
      summaryRef.current?.focus();
    }
  }, [errors]);

  useEffect(() => {
    if (phase !== 'merging') return;
    const node = emblemRef.current;
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase === 'revealed' && result) resultRef.current?.focus({ preventScroll: true });
  }, [phase, result]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    if (phase === 'idle' && shouldFocusFirstName.current) {
      shouldFocusFirstName.current = false;
      document.getElementById(`${firstPrefix}-name`)?.focus();
    }
  }, [phase, firstPrefix]);

  // Người dùng bật giảm chuyển động giữa lúc gộp: huỷ timer và công bố ngay.
  // Đây là subscription vào media query bên ngoài React, nên setState nằm trong
  // callback thay đổi thay vì chạy đồng bộ trong thân effect.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
    const handleReducedMotionChange = (event: MediaQueryListEvent): void => {
      if (!event.matches) return;

      if (mergeTimerRef.current !== null) {
        clearTimeout(mergeTimerRef.current);
        mergeTimerRef.current = null;
      }

      setOutcome((current) =>
        current.phase === 'merging' && current.result
          ? { phase: 'revealed', result: current.result }
          : current
      );
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleReducedMotionChange);
      return (): void => mediaQuery.removeEventListener('change', handleReducedMotionChange);
    }

    // Safari <= 13 only implements the deprecated listener API.
    mediaQuery.addListener(handleReducedMotionChange);
    return (): void => mediaQuery.removeListener(handleReducedMotionChange);
  }, []);

  const updateProfile = (index: 0 | 1, patch: Partial<LoveProfileValue>): void => {
    setProfiles((previous) => {
      const next: [LoveProfileValue, LoveProfileValue] = [previous[0], previous[1]];
      next[index] = { ...next[index], ...patch };
      return next;
    });

    setErrors((previous) => {
      if (!previous) return previous;
      const nextFieldErrors = { ...(index === 0 ? previous.first : previous.second) };
      (Object.keys(patch) as LoveProfileField[]).forEach((field) => {
        delete nextFieldErrors[field];
      });
      return index === 0
        ? { first: nextFieldErrors, second: previous.second }
        : { first: previous.first, second: nextFieldErrors };
    });

    // Chỉnh sửa trong lúc gộp hoặc sau khi có kết quả đều phải huỷ kết quả cũ.
    cancelMerge();
    setOutcome({ phase: 'idle', result: null });
    setError(null);
    setSaveState('idle');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    cancelMerge();

    const firstErrors = validateProfile(profiles[0]);
    const secondErrors = validateProfile(profiles[1]);

    if (
      !hasErrors(firstErrors) &&
      !hasErrors(secondErrors) &&
      profiles[0].gender === profiles[1].gender
    ) {
      secondErrors.gender = SAME_GENDER_MESSAGE;
    }

    if (hasErrors(firstErrors) || hasErrors(secondErrors)) {
      shouldFocusSummary.current = true;
      setErrors({ first: firstErrors, second: secondErrors });
      setOutcome({ phase: 'idle', result: null });
      setError(null);
      return;
    }

    setErrors(null);
    setError(null);
    setSaveState('idle');

    try {
      const currentYear = new Date().getFullYear();
      const birthInfos: [BirthInfo, BirthInfo] = [
        toBirthInfo(profiles[0], currentYear),
        toBirthInfo(profiles[1], currentYear),
      ];
      const chart1 = engine.generateChart(birthInfos[0]);
      const chart2 = engine.generateChart(birthInfos[1]);
      setActiveStarIds(collectImportantMajorStarIds([chart1, chart2]));
      const nextResult = calculateCompatibility(chart1, chart2, { currentYear });

      // Ghi nhận yêu cầu ở chế độ nền, không chặn hiệu ứng/kết quả.
      void saveLoveCompatibilityRequest({ profiles, birthInfos, result: nextResult }).then(
        (status) => {
          if (status.ok) {
            setSaveState('saved');
          } else if (status.error !== 'not_configured') {
            setSaveState('error');
          }
        }
      );

      // Người dùng giảm chuyển động: bỏ qua chuỗi gộp, công bố kết quả ngay.
      if (reducedMotion) {
        setOutcome({ phase: 'revealed', result: nextResult });
        return;
      }

      // Tính ngay nhưng giữ kín cho tới khi huy hiệu gộp xong và hết khoảng lặng.
      setOutcome({ phase: 'merging', result: nextResult });
      mergeTimerRef.current = setTimeout(() => {
        mergeTimerRef.current = null;
        setOutcome({ phase: 'revealed', result: nextResult });
      }, RESULT_REVEAL_MS);
    } catch {
      cancelMerge();
      setOutcome({ phase: 'idle', result: null });
      setError(GENERATE_ERROR);
    }
  };

  const handleReset = (): void => {
    cancelMerge();
    shouldFocusFirstName.current = true;
    setOutcome({ phase: 'idle', result: null });
    setErrors(null);
    setError(null);
    setSaveState('idle');
  };

  return (
    <div>
      {/* Vùng thông báo sống: luôn tồn tại, chỉ đổi nội dung theo phase. */}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="love-live-status"
        data-phase={phase}
        className={
          phase === 'merging'
            ? 'mb-6 rounded-md border border-gold/25 bg-gold/5 px-3 py-2 text-center text-sm text-gold/90'
            : 'sr-only'
        }
      >
        {liveStatusText}
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div ref={emblemRef} className="min-w-0 scroll-mt-24 lg:order-1">
          <LoveEmblemPanel
            previews={previews}
            phase={phase}
            animate={!reducedMotion}
            activeStarIds={emblemStarIds}
          />
        </div>

        <div className="min-w-0 lg:order-2" aria-busy={phase === 'merging'}>
          {saveState === 'saved' && (
            <p role="status" className="mb-3 text-center text-[11px] text-muted">
              Đã ghi nhận thông tin
            </p>
          )}
          {visibleResult ? (
            <CompatibilityResult
              result={visibleResult}
              headingId={resultHeadingId}
              strengthsHeadingId={strengthsHeadingId}
              challengesHeadingId={challengesHeadingId}
              sectionRef={resultRef}
              onReset={handleReset}
            />
          ) : (
            <Card variant="ancient-soft" className="sm:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-gold">An lá số đôi lứa</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    Nhập thông tin của hai mệnh chủ để đối chiếu duyên phận.
                  </p>
                </div>
                <span
                  className="hidden font-han text-3xl leading-none text-gold/30 sm:block"
                  aria-hidden="true"
                >
                  緣
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {summaryItems.length > 0 && (
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    aria-labelledby={summaryHeadingId}
                    className="scroll-mt-24 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 focus:outline-none focus:ring-2 focus:ring-gold focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <h3 id={summaryHeadingId} className="mb-2 font-semibold text-red-200">
                      Vui lòng kiểm tra lại thông tin
                    </h3>
                    <ul className="list-inside list-disc space-y-1">
                      {summaryItems.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="underline decoration-red-300/40 underline-offset-2 hover:text-red-100"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {error && (
                  <div
                    ref={errorRef}
                    tabIndex={-1}
                    role="alert"
                    className="scroll-mt-24 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 focus:outline-none focus:ring-2 focus:ring-gold focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-8">
                  <LoveProfileFields
                    idPrefix={firstPrefix}
                    legend="Đệ Nhất Mệnh Chủ"
                    value={profiles[0]}
                    onChange={(patch) => updateProfile(0, patch)}
                    errors={errors?.first}
                  />

                  <div
                    aria-hidden="true"
                    className="h-px bg-linear-to-r from-transparent via-gold/30 to-transparent"
                  />

                  <LoveProfileFields
                    idPrefix={secondPrefix}
                    legend="Đệ Nhị Mệnh Chủ"
                    value={profiles[1]}
                    onChange={(patch) => updateProfile(1, patch)}
                    errors={errors?.second}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Button type="submit" size="lg" className="w-full font-serif">
                    Luận Định Duyên Đôi Lứa
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-muted">
                    Luận giải dựa trên Tử Vi cổ truyền.
                  </p>
                  <p className="text-center text-[11px] leading-relaxed text-muted/80">
                    Giờ sinh càng chính xác, lá số càng sát với thực tế.
                  </p>
                </div>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
