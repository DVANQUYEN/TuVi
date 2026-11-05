import type { ReactElement } from 'react';
import type { PalaceId } from '@/lib/ziwei/types/enums';

/** Chữ Hán biểu tượng cho từng cung (dùng làm hình nền mờ trên thẻ cung). */
export const PALACE_GLYPHS: Readonly<Record<PalaceId, string>> = {
  menh: '命',
  taiBach: '財',
  quanLoc: '官',
  thienDi: '遷',
  phuThe: '婚',
  tuTuc: '子',
  tatAch: '疾',
  noBoc: '友',
  dienTrach: '田',
  phucDuc: '福',
  phuMau: '親',
  huynhDe: '兄',
};

/**
 * Chữ Hán lớn mờ làm nền trang trí. Ẩn khỏi screen reader và không nhận sự kiện chuột.
 * Đặt trong vùng `absolute inset-0` của thẻ cung.
 */
export function PalaceWatermark({ palaceId }: { palaceId: PalaceId }): ReactElement {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center font-han text-7xl leading-none text-gold/10"
    >
      {PALACE_GLYPHS[palaceId]}
    </span>
  );
}
