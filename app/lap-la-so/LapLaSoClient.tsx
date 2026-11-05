'use client';

import { useState, useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ZiweiBoard } from '@/components/chart/ZiweiBoard';
import { BirthForm } from '@/components/chart/BirthForm';
import { AncientScroll } from '@/components/chart/AncientScroll';
import { ShareButton } from '@/components/share/ShareButton';
import { PdfButton } from '@/components/pdf/PdfButton';
import { SaveChartButton } from '@/components/storage/SaveChartButton';
import { ChartSummary } from '@/components/interpretation/ChartSummary';
import { PersonalSummaryCard } from '@/components/interpretation/PersonalSummary';
import { PalaceInterpretationList } from '@/components/interpretation/PalaceInterpretation';
import { CombinationsList } from '@/components/interpretation/CombinationsList';
import { AdviceCard } from '@/components/interpretation/AdviceCard';
import { DecadeFortuneTimeline } from '@/components/interpretation/DecadeFortune';
import { YearlyFortuneCard } from '@/components/interpretation/YearlyFortune';
import { TimelineView } from '@/components/interpretation/Timeline';
import { TopicInterpretationTabs } from '@/components/interpretation/TopicInterpretation';
import { createChartEngine } from '@/lib/ziwei/engine';
import { ZiweiInterpreter } from '@/lib/ziwei/interpretation';
import { generatePersonalSummary } from '@/lib/ziwei/interpretation/personal-summary';
import { calculateDecadeFortune } from '@/lib/ziwei/interpretation/decade-fortune';
import { calculateYearlyFortune } from '@/lib/ziwei/interpretation/yearly-fortune';
import { generateTimeline } from '@/lib/ziwei/interpretation/timeline';
import { interpretByTopic } from '@/lib/ziwei/interpretation/topic-interpretation';
import {
  getCurrentChart,
  getOwnedLocalSavedChartById,
  getSavedChartById,
  migrateFromLocalStorage,
  saveCurrentChart,
} from '@/lib/utils/storage';
import type { CurrentChart } from '@/lib/utils/storage';
import { useAuth } from '@/lib/supabase/use-auth';
import type { ZiweiChart } from '@/lib/ziwei/types';
import type { BirthInfo, UserPreferences } from '@/lib/ziwei/types';

const engine = createChartEngine();
const interpreter = new ZiweiInterpreter();

const subscribeNoop = (): (() => void) => () => {};

const FORM_COLLAPSED_KEY = 'lapLaSo.formCollapsed';
const FORM_COLLAPSED_EVENT = 'lapLaSo:formCollapsedChange';

const CURRENT_CHART_LOAD_ERROR =
  'Không thể tải lá số hiện tại từ tài khoản. Vui lòng kiểm tra kết nối mạng và cấu hình Supabase rồi thử lại.';
const CURRENT_CHART_SAVE_ERROR =
  'Lá số đã được tạo nhưng không thể lưu lên tài khoản và chưa được đồng bộ lên đám mây. Lá số chỉ khả dụng trong phiên làm việc này và có thể bị mất khi đăng xuất hoặc xóa bộ nhớ đệm. Vui lòng kiểm tra kết nối mạng và cấu hình Supabase rồi thử lại.';

function subscribeFormCollapsed(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  window.addEventListener(FORM_COLLAPSED_EVENT, onChange);
  return (): void => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(FORM_COLLAPSED_EVENT, onChange);
  };
}

function getFormCollapsed(): boolean {
  try {
    return localStorage.getItem(FORM_COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

function setFormCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(FORM_COLLAPSED_KEY, collapsed ? '1' : '0');
  } catch {
    // localStorage không khả dụng: vẫn cập nhật giao diện trong phiên hiện tại
  }
  window.dispatchEvent(new Event(FORM_COLLAPSED_EVENT));
}

function loadChartFromStorage(savedId?: string): ZiweiChart | null {
  if (!savedId) return null;

  const saved = getOwnedLocalSavedChartById(null, savedId);
  if (!saved) return null;

  try {
    return engine.generateChart(saved.birthInfo, saved.preferences);
  } catch {
    return null;
  }
}

export interface LapLaSoClientProps {
  savedId?: string;
}

export function LapLaSoClient({ savedId }: LapLaSoClientProps): React.ReactElement {
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  // Giữ tham chiếu mới nhất nhưng chỉ phụ thuộc vào id ổn định trong các effect.
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  const isFormCollapsed = useSyncExternalStore(
    subscribeFormCollapsed,
    getFormCollapsed,
    () => false
  );
  const [chart, setChart] = useState<ZiweiChart | null>(() => loadChartFromStorage(savedId));
  const [formValues, setFormValues] = useState<CurrentChart | null>(() => {
    if (!savedId) return null;
    const saved = getOwnedLocalSavedChartById(null, savedId);
    return saved ? { birthInfo: saved.birthInfo, preferences: saved.preferences } : null;
  });
  // Chủ sở hữu của form/lá số đang hiển thị (id tài khoản, null cho khách, undefined khi trống).
  const loadedChartOwnerIdRef = useRef<string | null | undefined>(
    formValues ? null : undefined
  );
  const [formVersion, setFormVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSavedChart, setIsLoadingSavedChart] = useState(
    (): boolean => Boolean(savedId) && !chart
  );
  // Cuộn giấy mở ngay khi có lá số (sau khi mount để tránh lệch hydration).
  const isBoardOpen = isMounted && chart !== null;
  const isSavedChartLoading =
    isMounted &&
    Boolean(savedId) &&
    !chart &&
    (authLoading || (Boolean(user) && isLoadingSavedChart));
  const interpretation = useMemo(() => (chart ? interpreter.interpret(chart) : null), [chart]);

  const currentYear = new Date().getFullYear();
  const birthYear = chart?.birthInfo.year ?? 0;
  const currentAge = birthYear > 0 ? currentYear - birthYear : 0;

  // Đại hạn
  const decadeFortune = useMemo(() => {
    if (!chart || birthYear <= 0) return [];
    return calculateDecadeFortune(chart, currentAge, birthYear);
  }, [chart, currentAge, birthYear]);

  // Lưu niên
  const yearlyFortune = useMemo(() => {
    if (!chart) return null;
    return calculateYearlyFortune(chart, currentYear, birthYear);
  }, [chart, currentYear, birthYear]);

  // Timeline 20 năm
  const timeline = useMemo(() => {
    if (!chart || birthYear <= 0) return null;
    return generateTimeline(chart, birthYear, 20);
  }, [chart, birthYear]);

  // Luận theo chủ đề
  const topics = useMemo(() => {
    if (!chart) return [];
    return [
      interpretByTopic(chart, 'career'),
      interpretByTopic(chart, 'love'),
      interpretByTopic(chart, 'wealth'),
      interpretByTopic(chart, 'health'),
    ];
  }, [chart]);

  // Id lá số đã lưu: lấy từ URL, hoặc từ lần lưu gần nhất trong phiên này.
  const [currentSavedId, setCurrentSavedId] = useState<string | undefined>(savedId);
  // Tăng mỗi khi người dùng lập lá số mới để bỏ qua kết quả tải hồ sơ cũ về muộn.
  const savedLoadSeqRef = useRef(0);
  // Người dùng đã chủ động lập lá số trong phiên này chưa.
  const hasManualChartRef = useRef(false);
  // Lần đầu useAuth trả về kết quả (đăng nhập/khách) đã xử lý chưa.
  const authResolvedRef = useRef(false);
  // Danh tính đã được xác nhận gần nhất, dùng để phát hiện đổi tài khoản.
  const previousIdentityRef = useRef<{ resolved: boolean; id: string | null }>({
    resolved: false,
    id: null,
  });

  const personalSummary = useMemo(() => {
    if (!isMounted || !chart) return null;
    return generatePersonalSummary(chart);
  }, [chart, isMounted]);

  useEffect(() => {
    if (!userId) return;

    const currentUser = userRef.current;
    if (!currentUser) return;

    migrateFromLocalStorage(currentUser).catch((err) => {
      console.error('Failed to migrate local charts:', err);
    });
  }, [userId]);

  // Đổi tài khoản/đăng xuất: không giữ lá số của chủ sở hữu cũ trên giao diện.
  useEffect(() => {
    if (authLoading) return;

    const previous = previousIdentityRef.current;
    previousIdentityRef.current = { resolved: true, id: userId };

    if (!previous.resolved || previous.id === userId) return;

    const ownerId = loadedChartOwnerIdRef.current;
    // Chỉ xóa dữ liệu đã gắn với một chủ sở hữu; không xóa form trống do người dùng tự nhập.
    if (ownerId === undefined || ownerId === userId) return;

    setChart(null);
    setFormValues(null);
    setFormVersion((version) => version + 1);
    setCurrentSavedId(undefined);
    loadedChartOwnerIdRef.current = undefined;
  }, [authLoading, userId]);

  // Lá số hiện tại luôn theo đúng danh tính đang đăng nhập (khách hoặc tài khoản).
  // Không lấy từ danh sách Quẻ đã lưu và không tự mở lá số mới nhất trong charts.
  useEffect(() => {
    if (authLoading || savedId) return;

    const isFirstAuthResolution = !authResolvedRef.current;
    authResolvedRef.current = true;

    // Người dùng đã lập lá số trước khi phiên đăng nhập hoàn tất: giữ lá số vừa lập.
    if (isFirstAuthResolution && hasManualChartRef.current) return;

    let cancelled = false;
    const requestId = ++savedLoadSeqRef.current;
    const isStale = (): boolean => cancelled || requestId !== savedLoadSeqRef.current;

    const apply = (current: CurrentChart | null): void => {
      if (isStale()) return;

      // Không có lá số hiện tại: giữ nguyên form đang nhập dở (nhất là khi auth vừa xong).
      if (!current) return;

      setFormValues(current);
      setFormVersion((version) => version + 1);
      setCurrentSavedId(undefined);
      loadedChartOwnerIdRef.current = userId;

      try {
        setChart(engine.generateChart(current.birthInfo, current.preferences));
      } catch (err) {
        setChart(null);
        setError(err instanceof Error ? err.message : 'Không thể tải lá số hiện tại.');
      }
    };

    getCurrentChart(userRef.current)
      .then(apply)
      .catch((err) => {
        if (isStale()) return;
        console.error('Failed to load current chart:', err);
        setError(CURRENT_CHART_LOAD_ERROR);
      });

    return (): void => {
      cancelled = true;
    };
  }, [authLoading, savedId, userId]);

  useEffect(() => {
    if (!savedId || authLoading) return;

    if (hasManualChartRef.current) {
      setIsLoadingSavedChart(false);
      return;
    }

    let cancelled = false;
    const requestId = ++savedLoadSeqRef.current;
    const isStale = (): boolean => cancelled || requestId !== savedLoadSeqRef.current;

    const adopt = (saved: NonNullable<ReturnType<typeof getOwnedLocalSavedChartById>>): void => {
      if (isStale()) return;

      setFormValues({ birthInfo: saved.birthInfo, preferences: saved.preferences });
      setFormVersion((version) => version + 1);
      loadedChartOwnerIdRef.current = userId;

      try {
        setChart(engine.generateChart(saved.birthInfo, saved.preferences));
        setCurrentSavedId(saved.remoteId ?? saved.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải hồ sơ đã lưu.');
      } finally {
        setIsLoadingSavedChart(false);
      }
    };

    const local = getOwnedLocalSavedChartById(userId, savedId);
    if (local) {
      adopt(local);
      return (): void => {
        cancelled = true;
      };
    }

    const currentUser = userRef.current;

    if (!userId || !currentUser) {
      queueMicrotask(() => {
        if (!isStale()) setIsLoadingSavedChart(false);
      });
      return (): void => {
        cancelled = true;
      };
    }

    getSavedChartById(currentUser, savedId)
      .then((saved) => {
        if (saved) {
          adopt(saved);
        } else if (!isStale()) {
          setIsLoadingSavedChart(false);
        }
      })
      .catch((err) => {
        if (isStale()) return;
        setError(err instanceof Error ? err.message : 'Không thể tải hồ sơ đã lưu.');
        setIsLoadingSavedChart(false);
      });

    return (): void => {
      cancelled = true;
    };
  }, [authLoading, savedId, userId]);

  const generateChart = useCallback(
    (birthInfo: BirthInfo, preferences?: UserPreferences): void => {
      // Chưa biết phiên đăng nhập: không lưu nhầm lá số hiện tại vào kho khách.
      if (authLoading) {
        setError('Đang xác thực phiên đăng nhập. Vui lòng thử lại sau giây lát.');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const result = engine.generateChart(birthInfo, preferences);
        // Vô hiệu hóa mọi yêu cầu tải hồ sơ/lá số hiện tại còn đang chờ.
        savedLoadSeqRef.current += 1;
        hasManualChartRef.current = true;
        loadedChartOwnerIdRef.current = userId;
        setChart(result);
        // Lá số mới chưa được lưu vào Quẻ đã lưu: chỉ "Lưu hồ sơ" mới ghi vào danh sách.
        setCurrentSavedId(undefined);

        const currentUser = userRef.current;
        const saveSeq = savedLoadSeqRef.current;
        void saveCurrentChart(currentUser, {
          birthInfo: result.birthInfo,
          preferences,
        }).catch((err) => {
          console.error('Failed to save current chart:', err);
          if (currentUser && saveSeq === savedLoadSeqRef.current) {
            setError(CURRENT_CHART_SAVE_ERROR);
          }
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Không thể lập lá số. Vui lòng kiểm tra lại thông tin.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, userId]
  );

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 md:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-center font-serif text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Lập lá số <span className="text-gold">Tử Vi</span>
          </h1>

          {/* PHẦN 1: Chiếu thư + lá số - luôn căn giữa, không phụ thuộc form */}
          <section aria-label="Kết quả lá số" className="mx-auto w-full min-w-0 max-w-6xl">
            {isSavedChartLoading ? (
              <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface text-muted">
                <p className="font-serif text-lg">Đang tải lá số...</p>
              </div>
            ) : (
              <AncientScroll isOpen={isBoardOpen}>
                {isBoardOpen && chart ? <ZiweiBoard chart={chart} /> : undefined}
              </AncientScroll>
            )}
          </section>

          {/* PHẦN 2: Hành động và diễn giải - nằm dưới lá số */}
          {isBoardOpen && chart && (
            <div className="mx-auto mt-8 w-full min-w-0 max-w-4xl">
              <div className="flex flex-wrap justify-center gap-3">
                <SaveChartButton
                  chart={chart}
                  savedId={currentSavedId}
                  onSaved={setCurrentSavedId}
                />
                <ShareButton chart={chart} />
                <PdfButton chart={chart} />
              </div>
              {personalSummary && <PersonalSummaryCard summary={personalSummary} />}
              {decadeFortune.length > 0 && <DecadeFortuneTimeline decades={decadeFortune} />}
              {yearlyFortune && <YearlyFortuneCard fortune={yearlyFortune} />}
              {timeline && <TimelineView timeline={timeline} />}
              <TopicInterpretationTabs topics={topics} />
              {interpretation && (
                <div className="mt-8">
                  <ChartSummary chart={chart} />
                  <CombinationsList combinations={interpretation.combinations} />
                  <PalaceInterpretationList
                    chart={chart}
                    interpretations={interpretation.palaces}
                  />
                  <AdviceCard advice={interpretation.overallAdvice} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Form thông tin sinh - floating overlay, nằm ngoài luồng layout nên không đẩy lá số */}
      <aside
        aria-label="Thông tin sinh"
        className="fixed bottom-4 left-0 z-40 flex items-start lg:bottom-auto lg:top-20"
      >
        <div
          id="birth-form-panel"
          hidden={isFormCollapsed}
          className="w-[calc(100vw-2.5rem)] max-h-[60vh] overflow-y-auto rounded-md shadow-xl sm:w-80 lg:max-h-[calc(100vh-7rem)]"
        >
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sinh</CardTitle>
            </CardHeader>
            <CardContent>
              <BirthForm
                key={formVersion}
                onSubmit={generateChart}
                defaultValues={formValues?.birthInfo}
                defaultPreferences={formValues?.preferences}
                submitDisabled={authLoading}
              />
            </CardContent>
          </Card>

          {isLoading && (
            <div className="mt-4 rounded-md border border-gold/20 bg-surface p-4 text-center text-sm text-muted">
              Đang lập lá số...
            </div>
          )}

          {error && (
            <div
              className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(): void => setFormCollapsed(!isFormCollapsed)}
          aria-expanded={!isFormCollapsed}
          aria-controls="birth-form-panel"
          aria-label={isFormCollapsed ? 'Mở form thông tin sinh' : 'Thu gọn form thông tin sinh'}
          className={[
            'mt-4 flex h-10 w-8 shrink-0 items-center justify-center border border-border-subtle bg-surface text-lg leading-none text-gold shadow-xl transition-colors',
            'hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
            isFormCollapsed ? 'rounded-r-md' : 'rounded-l-md',
          ].join(' ')}
        >
          <span aria-hidden="true">{isFormCollapsed ? '›' : '‹'}</span>
        </button>
      </aside>

      <Footer />
    </div>
  );
}
