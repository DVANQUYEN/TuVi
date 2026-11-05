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

  return (
    <div
      className={[
        'relative isolate flex h-full flex-col justify-between overflow-hidden',
        `border-2 ${theme.border} rounded-sm bg-surface shadow-[0_0_15px_rgba(212,175,55,0.2)]`,
        'p-2 transition-all duration-200 cursor-pointer',
        'hover:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        HIGHLIGHT_STYLES[highlightRole],
        isFocused ? 'bg-elevated' : '',
      ].join(' ')}
      onMouseEnter={() => onHover(palace.branch)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(palace.branch)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Cung ${palace.name} tại ${getBranchLabel(palace.branch)}, ${palace.majorStars.length} chính tinh`}
    >
      {/* Lớp nền trang trí (-z-10): gradient ngũ hành, chữ Hán mờ, viền kép bên trong */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 bg-linear-to-br ${theme.gradient} ${theme.glow}`}
      />
      <PalaceWatermark palaceId={palace.id} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] -z-10 rounded-[2px] border border-gold/40"
      />

      <CornerOrnaments size="sm" />

      {/* Tuần/Triệt: góc trên phải. Header được đệm trên khi có badge để không bị che đại hạn. */}
      {hasTuanOrTriet && (
        <div className="absolute right-5 top-1 z-10 flex gap-1">
          {palace.hasTuan && (
            <span className="rounded bg-gold px-1 py-0.5 text-[9px] font-semibold leading-none text-background">
              TUẦN
            </span>
          )}
          {palace.hasTriet && (
            <span className="rounded bg-gold px-1 py-0.5 text-[9px] font-semibold leading-none text-background">
              TRIỆT
            </span>
          )}
        </div>
      )}

      {/* Header: Can Chi | Tên cung | Đại hạn */}
      <div
        className={`flex items-center justify-between text-xs mb-1 gap-1 ${hasTuanOrTriet ? 'pt-4' : ''}`}
      >
        <span className="text-muted font-mono shrink-0">
          {getStemBranchLabel(palace.stem, palace.branch)}
        </span>
        <span className="font-serif font-bold text-foreground uppercase text-center leading-tight">
          {palace.name}
          {palace.isBodyPalace && <span className="ml-1 text-gold text-[10px]">&lt;THÂN&gt;</span>}
        </span>
        <span className="text-muted font-mono shrink-0">
          {palace.majorPeriod.startAge}-{palace.majorPeriod.endAge}
        </span>
      </div>

      {/* Chính tinh */}
      <div className="min-h-[2.75rem] flex flex-col items-center justify-center gap-0.5 mb-1">
        {palace.majorStars.length > 0 ? (
          palace.majorStars.map((star) => <StarDisplay key={star.id} star={star} />)
        ) : (
          <span className="text-muted text-xs italic">Vô Chính Diệu</span>
        )}
      </div>

      {/* Phụ tinh 2 cột */}
      <div className="grid grid-cols-2 gap-x-2 text-[11px] leading-tight mb-1">
        <div className="text-left">
          {hasAuspicious ? (
            palace.auspiciousStars.slice(0, 6).map((star) => (
              <div key={star.id}>
                <StarInline star={star} />
              </div>
            ))
          ) : (
            <span className="invisible">-</span>
          )}
        </div>
        <div className="text-right">
          {hasMalefic ? (
            palace.maleficStars.slice(0, 6).map((star) => (
              <div key={star.id}>
                <StarInline star={star} />
              </div>
            ))
          ) : (
            <span className="invisible">-</span>
          )}
        </div>
      </div>

      {/* Footer: Vòng | Cục | Thần sát | Chi */}
      <div className="flex items-center justify-between text-[10px] text-muted border-t border-border-subtle pt-1 gap-1">
        <span className="truncate">{palace.boshi12}</span>
        <span className="truncate">{palace.changsheng12}</span>
        <span className="truncate">{palace.suiqian12}</span>
        <span className="font-mono shrink-0">{getBranchLabel(palace.branch)}</span>
      </div>
    </div>
  );
}

function StarDisplay({ star }: { star: Star }): React.ReactElement {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`font-semibold ${ELEMENT_TEXT_COLORS[star.element]}`}>{star.name}</span>
      {star.brightnessLabel && (
        <span className="text-[10px] text-muted">({star.brightnessLabel})</span>
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
      className={`inline-block ml-0.5 ${MUTAGEN_COLORS[mutagen]} text-background text-[9px] px-1 rounded`}
    >
      {MUTAGEN_LABELS[mutagen]}
    </span>
  );
}
