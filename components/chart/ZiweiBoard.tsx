'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import type { ZiweiChart } from '@/lib/ziwei/types';
import type { EarthlyBranch } from '@/lib/ziwei/types/enums';
import { EARTHLY_BRANCHES } from '@/lib/ziwei/types/enums';
import { PalaceCard } from './PalaceCard';
import { CenterHeavenPlate } from './CenterHeavenPlate';

export interface ZiweiBoardProps {
  chart: ZiweiChart;
}

interface GridCell {
  row: number;
  col: number;
}

const BRANCH_GRID: Readonly<Record<EarthlyBranch, GridCell>> = {
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

const BOARD_RING: readonly EarthlyBranch[] = [
  'ti',
  'ngo',
  'mui',
  'than',
  'dau',
  'tuat',
  'hoi',
  'ty',
  'suu',
  'dan',
  'mao',
  'thin',
];

const NEIGHBORS: Readonly<
  Record<
    EarthlyBranch,
    { up?: EarthlyBranch; down?: EarthlyBranch; left?: EarthlyBranch; right?: EarthlyBranch }
  >
> = {
  ti: { right: 'ngo', down: 'thin' },
  ngo: { left: 'ti', right: 'mui' },
  mui: { left: 'ngo', right: 'than' },
  than: { left: 'mui', down: 'dau' },
  dau: { up: 'than', down: 'tuat' },
  tuat: { up: 'dau', down: 'hoi' },
  hoi: { up: 'tuat', left: 'ty' },
  ty: { right: 'hoi', left: 'suu' },
  suu: { right: 'ty', left: 'dan' },
  dan: { right: 'suu', up: 'mao' },
  mao: { down: 'dan', up: 'thin' },
  thin: { down: 'mao', up: 'ti' },
};

const VIEWBOX_SIZE = 400;
const CELL_SIZE = VIEWBOX_SIZE / 4;

function getCellCenter(branch: EarthlyBranch): { x: number; y: number } {
  const { row, col } = BRANCH_GRID[branch];
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2,
  };
}

function getTamPhuongBranches(branch: EarthlyBranch): {
  self: EarthlyBranch;
  opposite: EarthlyBranch;
  trine1: EarthlyBranch;
  trine2: EarthlyBranch;
} {
  const idx = EARTHLY_BRANCHES.indexOf(branch);
  return {
    self: branch,
    opposite: EARTHLY_BRANCHES[(idx + 6) % 12],
    trine1: EARTHLY_BRANCHES[(idx + 4) % 12],
    trine2: EARTHLY_BRANCHES[(idx + 8) % 12],
  };
}

export function ZiweiBoard({ chart }: ZiweiBoardProps): React.ReactElement {
  const [hoveredBranch, setHoveredBranch] = useState<EarthlyBranch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<EarthlyBranch | null>(null);
  const [focusedBranch, setFocusedBranch] = useState<EarthlyBranch | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const activeBranch = selectedBranch ?? hoveredBranch ?? focusedBranch;

  const palaceByBranch = useMemo(() => {
    const map = new Map<EarthlyBranch, (typeof chart.palaces)[number]>();
    for (const palace of chart.palaces) {
      map.set(palace.branch, palace);
    }
    return map;
  }, [chart]);

  const getHighlightRole = useCallback(
    (branch: EarthlyBranch): 'self' | 'opposite' | 'trine' | 'dimmed' | 'none' => {
      if (!activeBranch) return 'none';
      if (branch === activeBranch) return 'self';
      const { opposite, trine1, trine2 } = getTamPhuongBranches(activeBranch);
      if (branch === opposite) return 'opposite';
      if (branch === trine1 || branch === trine2) return 'trine';
      return 'dimmed';
    },
    [activeBranch]
  );

  const handleSelect = useCallback((branch: EarthlyBranch): void => {
    setSelectedBranch((prev) => (prev === branch ? null : branch));
  }, []);

  const handleHover = useCallback((branch: EarthlyBranch | null): void => {
    setHoveredBranch(branch);
  }, []);

  const handleFocus = useCallback((branch: EarthlyBranch): void => {
    setFocusedBranch(branch);
  }, []);

  const handleBlur = useCallback((): void => {
    setFocusedBranch(null);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      const current = selectedBranch ?? focusedBranch;
      if (!current) return;

      const neighbors = NEIGHBORS[current];
      let next: EarthlyBranch | undefined;

      switch (event.key) {
        case 'ArrowRight':
          next = neighbors.right;
          break;
        case 'ArrowLeft':
          next = neighbors.left;
          break;
        case 'ArrowDown':
          next = neighbors.down;
          break;
        case 'ArrowUp':
          next = neighbors.up;
          break;
        case 'Escape':
          setSelectedBranch(null);
          setFocusedBranch(null);
          return;
        default:
          return;
      }

      if (next) {
        event.preventDefault();
        setFocusedBranch(next);
        const element = boardRef.current?.querySelector(
          `[data-branch="${next}"]`
        ) as HTMLElement | null;
        element?.focus();
      }
    },
    [selectedBranch, focusedBranch]
  );

  const overlayLines = useMemo(() => {
    if (!activeBranch) return null;
    const { self, opposite, trine1, trine2 } = getTamPhuongBranches(activeBranch);
    const selfCenter = getCellCenter(self);
    const oppositeCenter = getCellCenter(opposite);
    const trine1Center = getCellCenter(trine1);
    const trine2Center = getCellCenter(trine2);

    return (
      <>
        {/* Self → Opposite */}
        <line
          x1={selfCenter.x}
          y1={selfCenter.y}
          x2={oppositeCenter.x}
          y2={oppositeCenter.y}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="text-gold/70"
        />
        {/* Tam Phương triangle */}
        <polygon
          points={`${selfCenter.x},${selfCenter.y} ${trine1Center.x},${trine1Center.y} ${trine2Center.x},${trine2Center.y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gold-bright/60"
        />
      </>
    );
  }, [activeBranch]);

  // Mobile list view
  const listView = (
    <div className="space-y-3 lg:hidden" role="list" aria-label="Danh sách 12 cung">
      {BOARD_RING.map((branch) => {
        const palace = palaceByBranch.get(branch);
        if (!palace) return null;
        return (
          <div key={branch} role="listitem" onFocus={() => handleFocus(branch)} onBlur={handleBlur}>
            <PalaceCard
              palace={palace}
              highlightRole={getHighlightRole(branch)}
              onHover={handleHover}
              onSelect={handleSelect}
              isFocused={focusedBranch === branch}
              isSelected={selectedBranch === branch}
            />
          </div>
        );
      })}
    </div>
  );

  // Desktop 4x4 grid view
  const gridView = (
    <div
      ref={boardRef}
      className="relative mx-auto hidden lg:grid"
      style={{
        gridTemplateColumns: 'repeat(4, 1fr)',
        // Hàng tự co giãn theo nội dung (không cố định chiều cao) để card không bị cắt chữ
        gridTemplateRows: 'repeat(4, minmax(auto, 1fr))',
        gap: '0.25rem',
        // Giới hạn chiều rộng theo chiều cao viewport để cả bàn nằm gọn trên màn hình (không cần cuộn)
        width: 'min(100%, calc(100svh - 6rem))',
      }}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Bàn lá số Tử Vi 4x4"
    >
      {/* SVG overlay for Tam Phương Tứ Chính */}
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {overlayLines}
      </svg>

      {/* Palace cards placed in grid */}
      {BOARD_RING.map((branch) => {
        const palace = palaceByBranch.get(branch);
        if (!palace) return null;
        const { row, col } = BRANCH_GRID[branch];
        return (
          <div
            key={branch}
            data-branch={branch}
            className="h-full"
            style={{
              gridRow: `${row + 1} / ${row + 2}`,
              gridColumn: `${col + 1} / ${col + 2}`,
            }}
            onFocus={() => handleFocus(branch)}
            onBlur={handleBlur}
          >
            <PalaceCard
              palace={palace}
              highlightRole={getHighlightRole(branch)}
              onHover={handleHover}
              onSelect={handleSelect}
              isFocused={focusedBranch === branch}
              isSelected={selectedBranch === branch}
            />
          </div>
        );
      })}

      {/* Center heaven plate */}
      <div
        className="z-10"
        style={{
          gridRow: '2 / 4',
          gridColumn: '2 / 4',
        }}
      >
        <CenterHeavenPlate chart={chart} />
      </div>

    </div>
  );

  return (
    <section id="ziwei-board" className="w-full" aria-label="Bàn lá số Tử Vi">
      {listView}
      {gridView}
    </section>
  );
}
