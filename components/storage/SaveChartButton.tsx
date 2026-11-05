'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { saveChart } from '@/lib/utils/storage';
import { useAuth } from '@/lib/supabase/use-auth';
import type { ZiweiChart } from '@/lib/ziwei/types';

interface SaveChartButtonProps {
  chart: ZiweiChart;
  /** Id hồ sơ đã lưu (mở từ đã lưu hoặc vừa lưu). Có giá trị thì nút ở trạng thái đã lưu. */
  savedId?: string;
  onSaved?: (id: string) => void;
}

export function SaveChartButton({
  chart,
  savedId,
  onSaved,
}: SaveChartButtonProps): React.ReactElement {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    return (): void => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isSaved = Boolean(savedId) || saved;

  const handleSave = async (): Promise<void> => {
    if (savedId) return;
    setLoading(true);

    try {
      const savedChart = await saveChart(user, {
        name: chart.birthInfo.name || 'Không tên',
        birthInfo: chart.birthInfo,
        preferences: chart.appliedConfig,
      });

      onSaved?.(savedChart.id);
      setSaved(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save chart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      variant="secondary"
      disabled={loading || Boolean(savedId)}
      aria-live="polite"
    >
      {loading ? 'Đang lưu...' : isSaved ? '✓ Đã lưu' : 'Lưu hồ sơ'}
    </Button>
  );
}
