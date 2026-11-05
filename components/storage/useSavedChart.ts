'use client';

import { useEffect, useState } from 'react';
import { createChartEngine } from '@/lib/ziwei/engine';
import {
  getLatestLocalChart,
  getOwnedLocalSavedChartById,
  getSavedChartById,
} from '@/lib/utils/storage';
import { useAuth } from '@/lib/supabase/use-auth';
import type { ZiweiChart } from '@/lib/ziwei/types';

const engine = createChartEngine();

export type SavedChartStatus = 'missing' | 'loading' | 'ready' | 'error';

interface SavedChartState {
  chart: ZiweiChart | null;
  status: SavedChartStatus;
}

/**
 * Tải lá số để luận giải theo savedId (lá số đã lưu, local hoặc đám mây tùy phiên đăng nhập).
 * Không có savedId hoặc savedId là 'local' thì tải lá số local gần nhất.
 * Lá số được dựng lại từ thông tin sinh đã lưu.
 */
export function useSavedChart(savedId: string | undefined): SavedChartState {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<SavedChartState>({ chart: null, status: 'loading' });

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const buildChart = (
      saved: ReturnType<typeof getOwnedLocalSavedChartById>
    ): void => {
      if (cancelled) return;

      if (!saved) {
        setState({ chart: null, status: 'missing' });
        return;
      }

      setState({
        chart: engine.generateChart(saved.birthInfo, saved.preferences),
        status: 'ready',
      });
    };

    const load = async (): Promise<void> => {
      try {
        if (!savedId || savedId === 'local') {
          buildChart(getLatestLocalChart(user?.id));
          return;
        }

        if (savedId.startsWith('local_')) {
          buildChart(getOwnedLocalSavedChartById(user?.id ?? null, savedId));
          return;
        }

        buildChart(await getSavedChartById(user, savedId));
      } catch (error) {
        console.error('Failed to load saved chart:', error);
        if (!cancelled) setState({ chart: null, status: 'error' });
      }
    };

    void load();

    return (): void => {
      cancelled = true;
    };
  }, [authLoading, savedId, user]);

  return state;
}
