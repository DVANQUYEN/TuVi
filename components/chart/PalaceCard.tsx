'use client';

import type { Palace, Star } from '@/lib/ziwei/types';
import type { EarthlyBranch, FiveElement, MutagenType, PalaceId } from '@/lib/ziwei/types/enums';
import { getStemBranchLabel, getBranchLabel } from '@/lib/chart/display-helpers';
import { CornerOrnaments } from '@/components/ui/Card';
import { PalaceWatermark } from './PalaceIcons';

export interface PalaceCardProps {
  palace: Palace;
  highlightRole: 'self' | 'opposite' | 'trine' | 'dimmed' | 'none';
  onHover: (branch: EarthlyBranch | null) => void;
  onSelect: (branch: EarthlyBranch) => void;
  isFocused?: boolean;
  isSelected?: boolean;
  /** Bản rút gọn cho danh sách mobile: bỏ footer và giới hạn phụ tinh. */
  compact?: boolean;
}

interface PalaceTheme {
  /** Gradient nền theo ngũ hành của cung (trong suốt ở giữa để giữ nền hover/focus). */
  gradient: string;
  /** Màu viền ngoài. */
  border: string;
  /** Ánh sáng bên trong theo màu cung. */
  glow: string;
}

const PALACE_THEMES: Readonly<Record<PalaceId, PalaceTheme>> = {
  // Mệnh: không thuộc ngũ hành riêng, dùng tím chàm
  menh: {
    gradient: 'from-violet-950/60 via-transparent to-indigo-950/50',
    border: 'border-violet-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(139,92,246,0.22)]',
  },
  // Kim: trắng/bạc
  taiBach: {
    gradient: 'from-slate-200/20 via-transparent to-slate-400/15',
    border: 'border-slate-300/60',
    glow: 'shadow-[inset_0_0_32px_rgba(226,232,240,0.18)]',
  },
  // Hỏa: đỏ/cam
  quanLoc: {
    gradient: 'from-red-950/60 via-transparent to-orange-950/50',
    border: 'border-red-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(248,113,113,0.2)]',
  },
  // Thủy: xanh dương/cyan
  thienDi: {
    gradient: 'from-blue-950/60 via-transparent to-cyan-950/50',
    border: 'border-sky-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(56,189,248,0.2)]',
  },
  // Hỏa: đỏ/hồng
  phuThe: {
    gradient: 'from-red-950/50 via-transparent to-pink-950/50',
    border: 'border-rose-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(244,63,94,0.2)]',
  },
  // Mộc: xanh lá
  tuTuc: {
    gradient: 'from-green-950/60 via-transparent to-emerald-950/50',
    border: 'border-green-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(74,222,128,0.2)]',
  },
  // Thổ: vàng/nâu
  tatAch: {
    gradient: 'from-yellow-900/50 via-transparent to-stone-900/60',
    border: 'border-yellow-700/60',
    glow: 'shadow-[inset_0_0_32px_rgba(251,191,36,0.18)]',
  },
  // Thủy: xanh dương
  noBoc: {
    gradient: 'from-blue-950/50 via-transparent to-sky-950/60',
    border: 'border-blue-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(59,130,246,0.2)]',
  },
  // Thổ: vàng đất
  dienTrach: {
    gradient: 'from-amber-950/60 via-transparent to-yellow-900/50',
    border: 'border-amber-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(245,158,11,0.2)]',
  },
  // Mộc: xanh lá/vàng kim
  phucDuc: {
    gradient: 'from-emerald-950/60 via-transparent to-yellow-900/40',
    border: 'border-emerald-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(16,185,129,0.2)]',
  },
  // Mộc: xanh lá
  phuMau: {
    gradient: 'from-green-950/50 via-transparent to-green-900/40',
    border: 'border-green-600/60',
    glow: 'shadow-[inset_0_0_32px_rgba(34,197,94,0.2)]',
  },
  // Mộc: xanh ngọc
  huynhDe: {
    gradient: 'from-teal-950/60 via-transparent to-green-950/50',
    border: 'border-teal-500/60',
    glow: 'shadow-[inset_0_0_32px_rgba(20,184,166,0.2)]',
  },
};

const HIGHLIGHT_STYLES: Readonly<Record<PalaceCardProps['highlightRole'], string>> = {
  self: 'ring-2 ring-gold-bright shadow-[0_0_20px_rgba(212,175,55,0.35)]',
  opposite: 'ring-2 ring-gold ring-dashed',
  trine: 'ring-1 ring-gold',
  dimmed: 'opacity-50',
  none: '',
};

const ELEMENT_TEXT_COLORS: Readonly<Record<FiveElement, string>> = {
  kim: 'text-el-kim',
  moc: 'text-el-moc',
  thuy: 'text-el-thuy',
  hoa: 'text-el-hoa',
  tho: 'text-el-tho',
};

const MUTAGEN_COLORS: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'bg-mutagen-loc',
  hoaQuyen: 'bg-mutagen-quyen',
  hoaKhoa: 'bg-mutagen-khoa',
  hoaKy: 'bg-mutagen-ky',
};

const MUTAGEN_LABELS: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'L',
  hoaQuyen: 'Q',
  hoaKhoa: 'K',
  hoaKy: 'Y',
};

export function PalaceCard({
  palace,
  highlightRole,
  onHover,
  onSelect,
  isFocused = false,
  isSelected = false,
  compact = false,
}: PalaceCardProps): React.ReactElement {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(palace.branch);
    }
  };

  const hasAuspicious = palace.auspiciousStars.length > 0;
  const hasMalefic = palace.maleficStars.length > 0;
  const hasTuanOrTriet = palace.hasTuan || palace.hasTriet;
  const theme = PALACE_THEMES[palace.id];
  const minorStarLimit = 6;

  return (
    <div
      className={[
        'relative isolate flex flex-col justify-between overflow-hidden',
        compact ? 'h-full min-h-0 p-1 text-[8px] sm:text-[9px] lg:p-2 lg:text-xs' : 'h-full p-2',
        `rounded-sm ${compact ? 'border sm:border-2' : 'border-2'} ${theme.border} bg-linear-to-b from-surface to-background shadow-[0_0_15px_rgba(212,175,55,0.2)]`,
        'transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-reduce:transition-none',
        'hover:border-gold/80 hover:bg-elevated hover:shadow-[0_10px_26px_rgba(212,175,55,0.28)] motion-safe:hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        HIGHLIGHT_STYLES[highlightRole],
        isSelected ? 'ring-2 ring-gold-bright' : '',
        isFocused ? 'bg-elevated' : '',
      ].join(' ')}
      onMouseEnter={() => onHover(palace.branch)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(palace.branch)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Cung ${palace.name} tại ${getBranchLabel(palace.branch)}, ${palace.majorStars.length} chính tinh`}
    >
      {/* Lớp nền trang trí (-z-10): gradient ngũ hành, chữ Hán mờ, viền kép bên trong */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 bg-linear-to-br ${theme.gradient} ${theme.glow}`}
      />
      <PalaceWatermark palaceId={palace.id} className={compact ? 'max-sm:hidden' : ''} />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[3px] -z-10 rounded-[2px] border border-gold/40 ${
          compact ? 'max-sm:hidden' : ''
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[6px] -z-10 rounded-[2px] border border-gold/15 ${
          compact ? 'max-sm:hidden' : ''
        }`}
      />

      <div aria-hidden="true" className={compact ? 'contents max-sm:hidden' : 'contents'}>
        <CornerOrnaments size="sm" />
      </div>

      {/* Tuần/Triệt: góc trên phải. Header được đệm trên khi có badge để không bị che đại hạn. */}
      {hasTuanOrTriet && (
        <div className="absolute right-1 top-0.5 z-10 flex gap-0.5 max-sm:hidden sm:right-5 sm:top-1 sm:gap-1">
          {palace.hasTuan && (
            <span className="rounded bg-gold px-1 py-0.5 text-[7px] font-semibold leading-none text-background sm:text-[9px]">
              TUẦN
            </span>
          )}
          {palace.hasTriet && (
            <span className="rounded bg-gold px-1 py-0.5 text-[7px] font-semibold leading-none text-background sm:text-[9px]">
              TRIỆT
            </span>
          )}
        </div>
      )}

      {/* Header: Can Chi | Tên cung | Đại vận */}
      <div
        className={`flex items-center justify-between ${
          compact
            ? 'mb-0.5 flex-wrap gap-x-0.5 gap-y-0.5 text-[8px] sm:gap-x-1 sm:text-[9px] lg:flex-nowrap lg:gap-1 lg:text-xs'
            : 'mb-1 gap-1 text-xs'
        } ${hasTuanOrTriet ? (compact ? 'sm:pt-4' : 'pt-4') : ''}`}
      >
        <span
          className={`text-muted font-mono shrink-0 ${
            compact ? 'text-[7px] sm:text-[8px] lg:text-[11px]' : ''
          }`}
        >
          {getStemBranchLabel(palace.stem, palace.branch)}
        </span>
        <span
          className={`font-serif font-bold text-foreground uppercase text-center leading-tight ${
            compact
              ? 'order-last basis-full min-w-0 max-w-full truncate text-[9px] sm:text-[10px] lg:order-none lg:basis-auto lg:text-sm'
              : ''
          }`}
        >
          {palace.name}
          {palace.isBodyPalace && (
            <span
              className={`ml-1 text-gold ${
                compact ? 'text-[6px] sm:text-[8px] lg:text-[10px]' : 'text-[11px] sm:text-[10px]'
              }`}
            >
              &lt;THÂN&gt;
            </span>
          )}
        </span>
        <span className="shrink-0 text-right leading-none">
          <span
            className={`block uppercase tracking-[0.14em] text-gold/80 ${
              compact
                ? 'max-sm:hidden text-[7px] sm:text-[8px] lg:text-[10px]'
                : 'text-[11px] sm:text-[8px]'
            }`}
          >
            Đại vận
          </span>
          <span
            className={`mt-0.5 block font-mono text-muted ${
              compact ? 'text-[7px] sm:text-[8px] lg:text-[10px]' : ''
            }`}
          >
            {palace.majorPeriod.startAge}-{palace.majorPeriod.endAge}
          </span>
        </span>
      </div>

      {/* Chính tinh */}
      <div
        className={`flex flex-col items-center justify-center ${
          compact
            ? 'mb-0.5 min-h-0 gap-0.5 text-[8px] sm:text-[10px] lg:text-sm'
            : 'mb-1 min-h-[2.75rem] gap-1'
        }`}
      >
        {palace.majorStars.length > 0 ? (
          palace.majorStars.map((star) => (
            <StarDisplay key={star.id} star={star} compact={compact} />
          ))
        ) : (
          <span
            className={`text-muted italic ${
              compact ? 'text-[7px] sm:text-[9px] lg:text-xs' : 'text-xs'
            }`}
          >
            Vô Chính Diệu
          </span>
        )}
      </div>

      {/* Phụ tinh 2 cột */}
      <div
        className={`grid grid-cols-2 leading-tight ${
          compact
            ? 'mb-0.5 gap-x-1 gap-y-0 text-[7px] sm:text-[8px] lg:gap-x-2 lg:text-[11px]'
            : 'mb-1 gap-x-2 gap-y-0.5 text-xs sm:text-[11px]'
        }`}
      >
        <div className="min-w-0 text-left">
          {hasAuspicious ? (
            palace.auspiciousStars.slice(0, minorStarLimit).map((star) => (
              <div key={star.id} className="min-w-0 truncate">
                <StarInline star={star} />
              </div>
            ))
          ) : (
            <span className="invisible">-</span>
          )}
        </div>
        <div className="min-w-0 text-right">
          {hasMalefic ? (
            palace.maleficStars.slice(0, minorStarLimit).map((star) => (
              <div key={star.id} className="min-w-0 truncate">
                <StarInline star={star} />
              </div>
            ))
          ) : (
            <span className="invisible">-</span>
          )}
        </div>
      </div>

      {/* Footer: Vòng | Cục | Thần sát | Chi — ẩn ở mobile, hiện đầy đủ từ desktop. */}
      <div
        className={`flex-wrap items-center justify-between gap-x-1 gap-y-0.5 border-t border-border-subtle pt-1 text-[11px] text-muted sm:text-[10px] ${
          compact ? 'hidden lg:flex' : 'flex'
        }`}
      >
        <span className="min-w-0 break-words">{palace.boshi12}</span>
        <span className="min-w-0 break-words">{palace.changsheng12}</span>
        <span className="min-w-0 break-words">{palace.suiqian12}</span>
        <span className="shrink-0 font-mono">{getBranchLabel(palace.branch)}</span>
      </div>
    </div>
  );
}

function StarDisplay({
  star,
  compact = false,
}: {
  star: Star;
  compact?: boolean;
}): React.ReactElement {
  return (
    <div
      className={
        compact
          ? 'flex max-w-full min-w-0 flex-wrap items-center justify-center gap-x-0.5 gap-y-0'
          : 'flex items-center gap-1.5'
      }
    >
      <span className={`font-semibold ${ELEMENT_TEXT_COLORS[star.element]}`}>{star.name}</span>
      {star.brightnessLabel && (
        <span
          className={
            compact
              ? 'text-[6px] text-muted sm:text-[8px] lg:text-[10px]'
              : 'text-[11px] text-muted sm:text-[10px]'
          }
        >
          ({star.brightnessLabel})
        </span>
      )}
      {star.mutagen && <MutagenBadge mutagen={star.mutagen} />}
    </div>
  );
}

function StarInline({ star }: { star: Star }): React.ReactElement {
  return (
    <span className={`${ELEMENT_TEXT_COLORS[star.element]} ${star.mutagen ? 'font-semibold' : ''}`}>
      {star.name}
      {star.mutagen && <MutagenBadge mutagen={star.mutagen} />}
    </span>
  );
}

function MutagenBadge({ mutagen }: { mutagen: MutagenType }): React.ReactElement {
  return (
    <span
      className={`inline-block shrink-0 ml-0.5 ${MUTAGEN_COLORS[mutagen]} rounded px-0.5 text-[6px] text-background sm:px-1 sm:text-[9px]`}
    >
      {MUTAGEN_LABELS[mutagen]}
    </span>
  );
}
