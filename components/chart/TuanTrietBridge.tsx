'use client';

import type { EarthlyBranch } from '@/lib/ziwei/types/enums';

export interface TuanTrietBridgeProps {
  fromBranch: EarthlyBranch;
  toBranch: EarthlyBranch;
  label: string;
}

interface GridCoord {
  row: number;
  col: number;
}

const GRID_COORDS: Readonly<Record<EarthlyBranch, GridCoord>> = {
  ti: { row: 0, col: 0 },
  ngo: { row: 0, col: 1 },
  mui: { row: 0, col: 2 },
  than: { row: 0, col: 3 },
  dau: { row: 1, col: 3 },
  tuat: { row: 2, col: 3 },
  hoi: { row: 3, col: 3 },
  ty: { row: 3, col: 2 },
  suu: { row: 3, col: 1 },
  dan: { row: 3, col: 0 },
  mao: { row: 2, col: 0 },
  thin: { row: 1, col: 0 },
};

export function TuanTrietBridge({
  fromBranch,
  toBranch,
  label,
}: TuanTrietBridgeProps): React.ReactElement | null {
  const from = GRID_COORDS[fromBranch];
  const to = GRID_COORDS[toBranch];

  if (!from || !to) return null;

  const isHorizontal = from.row === to.row;
  const isVertical = from.col === to.col;

  if (!isHorizontal && !isVertical) return null;

  let top: string;
  let left: string;

  if (isHorizontal) {
    const row = from.row;
    const rightCol = Math.max(from.col, to.col);
    top = `${row * 25 + 12.5}%`;
    left = `${rightCol * 25}%`;
  } else {
    const col = from.col;
    const bottomRow = Math.max(from.row, to.row);
    top = `${bottomRow * 25}%`;
    left = `${col * 25 + 12.5}%`;
  }

  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
      aria-hidden="true"
    >
      <div className="whitespace-nowrap rounded-full border border-gold/40 bg-surface px-1.5 py-0.5 text-[9px] font-bold text-gold shadow-sm md:px-2 md:text-[10px]">
        {label}
      </div>
    </div>
  );
}
