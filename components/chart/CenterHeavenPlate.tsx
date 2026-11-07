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
    <div className="relative isolate flex h-full w-full flex-col justify-center gap-1 overflow-hidden rounded-sm border-2 border-gold/50 bg-linear-to-br from-amber-950/40 via-surface to-violet-950/40 p-1.5 text-center shadow-[inset_0_0_40px_rgba(212,175,55,0.18),0_0_24px_rgba(212,175,55,0.18)] sm:gap-1.5 sm:p-2 lg:gap-2 lg:p-3">
      {/* Lớp trang trí (không đọc bởi screen reader): biểu tượng Thái Cực mờ, viền kép, góc, ánh sáng */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex select-none items-center justify-center font-han text-[11rem] leading-none text-gold/10 motion-safe:animate-[spin_120s_linear_infinite] max-sm:hidden sm:text-[8rem] md:text-[15rem]"
      >
        太极
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[4px] -z-10 rounded-[2px] border border-gold/30 max-sm:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gold/5 motion-safe:animate-pulse max-sm:hidden"
      />
      <div aria-hidden="true" className="contents max-sm:hidden">
        <CornerOrnaments size="md" />
      </div>

      <div>
        <h2 className="font-serif text-[10px] font-bold leading-tight text-foreground sm:text-sm md:text-lg">
          {birthInfo.name?.trim() || 'Đương số'}
        </h2>
        <p className="text-[8px] leading-tight text-gold sm:text-[10px] md:text-sm">
          {heavenPlate.yinYangGenderLabel}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px] sm:gap-x-2 sm:gap-y-1 sm:text-[10px] md:text-xs">
        {infoRows.map((row) => (
          <div key={row.label} className="flex min-w-0 flex-col">
            <span className="text-[7px] leading-tight text-muted sm:text-[9px] md:text-[10px]">
              {row.label}
            </span>
            <span className="truncate font-medium leading-tight text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border-subtle pt-1 sm:pt-1.5 lg:pt-2">
        <p className="text-[8px] font-medium leading-tight text-foreground sm:text-[10px] md:text-xs">
          Nạp Âm: <span className="text-gold">{napAm.name}</span>
        </p>
        <p className="text-[8px] leading-tight text-muted sm:text-[10px] md:text-xs">
          Cục: <span className="font-medium text-foreground">{fiveElementsClass.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[7px] sm:gap-2 sm:text-[9px] md:text-xs">
        <div className="min-w-0 rounded bg-elevated p-0.5 sm:p-1">
          <span className="block truncate text-muted">Chủ Mệnh</span>
          <span className="block truncate font-medium text-foreground">{soulLord}</span>
          <span className="block text-[6px] text-gold sm:text-[8px] md:text-[9px]">
            {getBranchLabel(soulPalaceBranch)}
          </span>
        </div>
        <div className="min-w-0 rounded bg-elevated p-0.5 sm:p-1">
          <span className="block truncate text-muted">Chủ Thân</span>
          <span className="block truncate font-medium text-foreground">{bodyLord}</span>
          <span className="block text-[6px] text-gold sm:text-[8px] md:text-[9px]">
            {getBranchLabel(bodyPalaceBranch)}
          </span>
        </div>
      </div>
    </div>
  );
}
