import Link from 'next/link';
import type { SavedChartStatus } from './useSavedChart';

interface SavedChartFallbackProps {
  status: SavedChartStatus;
}

/** Trạng thái thay thế khi chưa có lá số để luận giải (đang tải, lỗi, hoặc thiếu savedId). */
export function SavedChartFallback({ status }: SavedChartFallbackProps): React.ReactElement | null {
  if (status === 'ready') return null;

  if (status === 'loading') {
    return (
      <p role="status" className="py-12 text-center text-muted">
        Đang tải lá số...
      </p>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400"
      >
        Chưa tải được lá số đã lưu. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <div className="py-12 text-center">
      <p className="text-muted">Chưa có lá số. Vui lòng chọn một hồ sơ đã lưu để xem.</p>
      <Link href="/ho-so" className="mt-4 inline-block text-gold hover:underline">
        Đến lá số đã lưu →
      </Link>
    </div>
  );
}
