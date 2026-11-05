'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { getSavedCharts, deleteChart, type SavedChart } from '@/lib/utils/storage';
import { useAuth } from '@/lib/supabase/use-auth';

export function SavedChartsList(): React.ReactElement {
  const { user, loading: authLoading } = useAuth();
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCharts = useCallback(async (): Promise<void> => {
    const data = await getSavedCharts(user);
    setCharts(data);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    getSavedCharts(user)
      .then((data) => {
        if (!cancelled) setCharts(data);
      })
      .catch((error) => {
        console.error('Failed to load charts:', error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return (): void => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Bạn có chắc muốn xóa hồ sơ này?')) return;

    await deleteChart(user, id);
    await loadCharts();
  };

  if (loading) {
    return <div className="py-12 text-center text-muted">Đang tải hồ sơ...</div>;
  }

  if (charts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted">Chưa có hồ sơ nào được lưu.</p>
        <Link href="/lap-la-so" className="mt-4 inline-block text-gold hover:underline">
          Lập lá số đầu tiên →
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-10">
      {charts.map((chart) => (
        // Chiếu thư: giấy cuộn với hai trục cuộn (trái/phải) và viền đỏ-vàng
        <li key={chart.id} className="relative px-3">
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border-2 border-[#8b5a2b] bg-linear-to-b from-[#f7ecd0] via-[#f4e8c8] to-[#e9d7ad] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
              {/* Viền trên */}
              <div className="relative flex h-12 items-center justify-center bg-linear-to-b from-[#8a2a1f] to-[#6b1d15] px-12">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-1 h-px bg-[#e0b84f]/50"
                />
                <h2
                  title={chart.name}
                  className="max-w-full truncate font-heading text-xl font-bold text-gold-bright"
                >
                  {chart.name}
                </h2>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-1 h-px bg-[#e0b84f]/50"
                />
              </div>

              {/* Nội dung giấy */}
              <div className="relative px-6 py-6 sm:px-10">
                {/* Chữ Hán "命" làm watermark trang trí */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-han text-[160px] leading-none text-[#8b5a2b]/10 sm:text-[200px]"
                >
                  命
                </span>

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-3">
                    <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-[#5c4326]">Ngày sinh:</dt>
                        <dd className="font-semibold text-[#3d2b14]">
                          {chart.birthInfo.day}/{chart.birthInfo.month}/{chart.birthInfo.year}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-[#5c4326]">Giờ sinh:</dt>
                        <dd className="font-semibold text-[#3d2b14]">
                          {String(chart.birthInfo.hour).padStart(2, '0')}:
                          {String(chart.birthInfo.minute).padStart(2, '0')}
                        </dd>
                      </div>
                    </dl>
                    <p className="text-xs text-[#5c4326]">
                      Lưu ngày{' '}
                      {new Date(chart.updatedAt).toLocaleString('vi-VN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                    <p className="text-xs font-semibold text-[#7a4f12]">
                      {user ? '☁️ Đã đồng bộ đám mây' : '💾 Lưu trên thiết bị này'}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/lap-la-so?savedId=${encodeURIComponent(chart.id)}`}
                      className={buttonVariants({ variant: 'primary', size: 'sm' })}
                    >
                      Xem
                      <span className="sr-only"> hồ sơ {chart.name}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(chart.id)}
                      aria-label={`Xóa hồ sơ ${chart.name}`}
                      className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-[#7a2e1f] transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>

              {/* Viền dưới với họa tiết */}
              <div
                aria-hidden="true"
                className="flex h-8 items-center justify-center gap-1.5 overflow-hidden bg-linear-to-t from-[#8a2a1f] to-[#6b1d15]"
              >
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className="h-2 w-2 shrink-0 border border-[#e0b84f]/50" />
                ))}
              </div>
            </div>

            {/* Hai trục cuộn */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 inset-y-0 w-4 rounded-l-lg bg-linear-to-r from-[#5c1410] to-[#8a2a1f] shadow-lg"
            >
              <span className="absolute left-1/2 top-0 h-3 w-6 -translate-x-1/2 rounded-t-full bg-linear-to-b from-yellow-400 to-yellow-600" />
              <span className="absolute bottom-0 left-1/2 h-3 w-6 -translate-x-1/2 rounded-b-full bg-linear-to-b from-yellow-600 to-yellow-400" />
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 inset-y-0 w-4 rounded-r-lg bg-linear-to-l from-[#5c1410] to-[#8a2a1f] shadow-lg"
            >
              <span className="absolute left-1/2 top-0 h-3 w-6 -translate-x-1/2 rounded-t-full bg-linear-to-b from-yellow-400 to-yellow-600" />
              <span className="absolute bottom-0 left-1/2 h-3 w-6 -translate-x-1/2 rounded-b-full bg-linear-to-b from-yellow-600 to-yellow-400" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
