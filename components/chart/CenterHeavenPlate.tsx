'use client';

import type { ZiweiChart } from '@/lib/ziwei/types';
import { getBranchLabel } from '@/lib/chart/display-helpers';
import { CornerOrnaments } from '@/components/ui/Card';

export interface CenterHeavenPlateProps {
  chart: ZiweiChart;
}

export function CenterHeavenPlate({ chart }: CenterHeavenPlateProps): React.ReactElement {
  const { heavenPlate, birthInfo } = chart;
  const {
    fourPillars,
    napAm,
    fiveElementsClass,
    soulLord,
    bodyLord,
    soulPalaceBranch,
    bodyPalaceBranch,
  } = heavenPlate;

  const infoRows = [
    { label: 'Tứ trụ năm', value: fourPillars.year.label },
    { label: 'Tứ trụ tháng', value: fourPillars.month.label },
    { label: 'Tứ trụ ngày', value: fourPillars.day.label },
    { label: 'Tứ trụ giờ', value: fourPillars.hour.label },
  ];

  return (
    <div className="relative isolate flex h-full w-full flex-col justify-center gap-2 overflow-hidden rounded-sm border-2 border-gold/50 bg-linear-to-br from-amber-950/40 via-surface to-violet-950/40 p-3 text-center shadow-[inset_0_0_40px_rgba(212,175,55,0.18),0_0_24px_rgba(212,175,55,0.18)]">
      {/* Lớp trang trí (không đọc bởi screen reader): biểu tượng Thái Cực mờ, viền kép, góc, ánh sáng */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center font-han text-[11rem] leading-none text-gold/10 motion-safe:animate-[spin_120s_linear_infinite] md:text-[15rem]"
      >
        太极
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[4px] -z-10 rounded-[2px] border border-gold/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gold/5 motion-safe:animate-pulse"
      />
      <CornerOrnaments size="md" />

      <div>
        <h2 className="font-serif text-base font-bold text-foreground md:text-lg">
          {birthInfo.name?.trim() || 'Đương số'}
        </h2>
        <p className="text-xs text-gold md:text-sm">{heavenPlate.yinYangGenderLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] md:text-xs">
        {infoRows.map((row) => (
          <div key={row.label} className="flex flex-col">
            <span className="text-[10px] text-muted">{row.label}</span>
            <span className="font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border-subtle pt-2">
        <p className="text-xs font-medium text-foreground">
          Nạp Âm: <span className="text-gold">{napAm.name}</span>
        </p>
        <p className="text-xs text-muted">
          Cục: <span className="font-medium text-foreground">{fiveElementsClass.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] md:text-xs">
        <div className="rounded bg-elevated p-1">
          <span className="block text-muted">Chủ Mệnh</span>
          <span className="font-medium text-foreground">{soulLord}</span>
          <span className="block text-[9px] text-gold">{getBranchLabel(soulPalaceBranch)}</span>
        </div>
        <div className="rounded bg-elevated p-1">
          <span className="block text-muted">Chủ Thân</span>
          <span className="font-medium text-foreground">{bodyLord}</span>
          <span className="block text-[9px] text-gold">{getBranchLabel(bodyPalaceBranch)}</span>
        </div>
      </div>
    </div>
  );
}
