import type { LoveEmblemPersonPreview, LoveEmblemPillarKey } from './emblem-preview';
import { LOVE_EMBLEM_MERGE_DURATION_MS } from './merge-timing';

const GOLD = '#d4af37';
const GOLD_LIGHT = '#f0d089';
const GOLD_BRIGHT = '#fbbf24';
const GOLD_DEEP = '#8a6a1a';
const JADE_BRIGHT = '#7fe0b4';
const HAN_FONT = "'Noto Serif SC', 'Noto Serif CJK SC', 'Songti SC', 'SimSun', serif";

type ZodiacAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'cat'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

interface BranchMeta {
  han: string;
  /** Tên tệp ảnh con giáp trong `public/images/zodiac-love`. */
  slug: string;
  animal: ZodiacAnimal;
}

const BRANCHES: readonly BranchMeta[] = [
  { han: '子', slug: 'ty', animal: 'rat' },
  { han: '丑', slug: 'suu', animal: 'ox' },
  { han: '寅', slug: 'dan', animal: 'tiger' },
  { han: '卯', slug: 'mao', animal: 'cat' },
  { han: '辰', slug: 'thin', animal: 'dragon' },
  { han: '巳', slug: 'ran', animal: 'snake' },
  { han: '午', slug: 'ngo', animal: 'horse' },
  { han: '未', slug: 'mui', animal: 'goat' },
  { han: '申', slug: 'than', animal: 'monkey' },
  { han: '酉', slug: 'dau', animal: 'rooster' },
  { han: '戌', slug: 'tuat', animal: 'dog' },
  { han: '亥', slug: 'hoi', animal: 'pig' },
] as const;

/** Bán kính vành 12 con giáp: ảnh nằm giữa, chữ Hán ở mép trong. */
const ANIMAL_RING_INNER = 140;
const ANIMAL_RING_OUTER = 188;
const ANIMAL_CENTER_RADIUS = 169.5;
const ANIMAL_CLIP_RADIUS = 18;
const ANIMAL_DISC_RADIUS = 19.5;
const ANIMAL_GLYPH_RADIUS = 145;

/** 14 chính tinh trên vòng trong, xếp thành hai cung để chừa chỗ cho hai nửa Phu Thê. */
const STARS = [
  { key: 'tu-vi', engineId: 'tuVi', han: '紫微' },
  { key: 'thien-co', engineId: 'thienCo', han: '天機' },
  { key: 'thai-duong', engineId: 'thaiDuong', han: '太陽' },
  { key: 'vu-khuc', engineId: 'vuKhuc', han: '武曲' },
  { key: 'thien-dong', engineId: 'thienDong', han: '天同' },
  { key: 'liem-trinh', engineId: 'liemTrinh', han: '廉貞' },
  { key: 'thien-phu', engineId: 'thienPhu', han: '天府' },
  { key: 'thai-am', engineId: 'thaiAm', han: '太陰' },
  { key: 'tham-lang', engineId: 'thamLang', han: '貪狼' },
  { key: 'cu-mon', engineId: 'cuMon', han: '巨門' },
  { key: 'thien-tuong', engineId: 'thienTuong', han: '天相' },
  { key: 'thien-luong', engineId: 'thienLuong', han: '天梁' },
  { key: 'that-sat', engineId: 'thatSat', han: '七殺' },
  { key: 'pha-quan', engineId: 'phaQuan', han: '破軍' },
] as const;

/**
 * Góc của 14 chính tinh: hai cung trên/dưới, mỗi cung 7 sao.
 *
 * Hai khoảng trống ở 3 giờ và 9 giờ giữ cho vòng sao thoáng, không chen vào
 * nửa bát quái của hai mệnh chủ ở tâm.
 */
const STAR_ANGLES = [
  -140, -123.33, -106.67, -90, -73.33, -56.67, -40, 40, 56.67, 73.33, 90, 106.67, 123.33, 140,
] as const;

interface TrigramMeta {
  han: string;
  /** Thứ tự vạch từ trên xuống: true = liền, false = đứt. */
  lines: readonly [boolean, boolean, boolean];
}

const TRIGRAMS: readonly TrigramMeta[] = [
  { han: '乾', lines: [true, true, true] },
  { han: '兌', lines: [false, true, true] },
  { han: '離', lines: [true, false, true] },
  { han: '震', lines: [false, false, true] },
  { han: '巽', lines: [true, true, false] },
  { han: '坎', lines: [false, true, false] },
  { han: '艮', lines: [true, false, false] },
  { han: '坤', lines: [false, false, false] },
] as const;

const TRIGRAM_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5] as const;

const CENTER = 200;

/**
 * Vùng đen của âm dương cổ điển: nửa trái + thuỳ dưới, chia theo đường S chứ
 * không cắt bằng một đường thẳng đứng. Nền tròn phía sau đóng vai trò nửa trắng.
 */
const YIN_YANG_AM_PATH =
  'M200,170 A30,30 0 0,0 200,230 A15,15 0 0,0 200,200 A15,15 0 0,1 200,170 Z';

/** Thứ tự bật chi sau khi đủ ngày sinh: Ngày → Tháng → Năm. */
const DATE_PILLAR_RANK: Partial<Record<LoveEmblemPillarKey, number>> = {
  day: 0,
  month: 1,
  year: 2,
};

const BRANCH_POP_DELAYS_MS = [0, 180, 360] as const;

/** Không có dữ liệu lá số: mọi nhãn sao chính giữ trạng thái mờ. */
const EMPTY_STAR_IDS: ReadonlySet<string> = new Set();

/** Vạch khắc độ trên vành ngoài: dày mỗi 3°, đậm mỗi 30°. */
const RIM_TICKS = Array.from({ length: 120 }, (_, index) => ({
  angle: index * 3,
  major: index % 10 === 0,
}));

/**
 * Gán hạng sớm nhất cho từng chi thuộc các trụ ngày/tháng/năm của một người.
 *
 * Chi trùng giữa nhiều trụ lấy hạng nhỏ nhất để chuỗi sáng không bị bỏ qua.
 */
function dateBranchRanks(preview: LoveEmblemPersonPreview | undefined): Map<number, number> {
  const ranks = new Map<number, number>();

  preview?.pillars.forEach((pillar) => {
    const rank = DATE_PILLAR_RANK[pillar.key];
    if (rank === undefined) return;

    const existing = ranks.get(pillar.branchIndex);
    if (existing === undefined || rank < existing) {
      ranks.set(pillar.branchIndex, rank);
    }
  });

  return ranks;
}

export type LoveEmblemPhase = 'idle' | 'merging' | 'revealed';

export interface TinhDuyenEmblemProps {
  personPreviews?: [LoveEmblemPersonPreview, LoveEmblemPersonPreview];
  phase?: LoveEmblemPhase;
  /**
   * Mã sao chính xuất hiện tại Mệnh, Thân hoặc Phu Thê của hai lá số.
   * Rỗng khi chưa có lá số: toàn bộ 14 nhãn giữ trạng thái mờ.
   */
  activeStarIds?: ReadonlySet<string>;
  /** Khi false (prefers-reduced-motion hoặc trước hydration), bỏ toàn bộ chuyển động. */
  animate?: boolean;
}

interface Point {
  x: number;
  y: number;
}

function polar(radius: number, degrees: number): Point {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: Number((CENTER + radius * Math.cos(radians)).toFixed(2)),
    y: Number((CENTER + radius * Math.sin(radians)).toFixed(2)),
  };
}

/** Xoay chữ Hán theo phương tiếp tuyến nhưng vẫn giữ hướng đọc thuận. */
function tangentRotation(angle: number): number {
  let rotation = angle + 90;
  if (rotation > 90) rotation -= 180;
  if (rotation < -90) rotation += 180;
  return Number(rotation.toFixed(2));
}

function completionScore(preview: LoveEmblemPersonPreview | undefined): number {
  if (!preview) return 0;

  // Chỉ hồng nối duyên dựa trên lá số đã đủ dữ liệu (giới tính + ngày + giờ).
  // Họ tên chỉ cá nhân hoá huy hiệu, không quyết định kết nối.
  return (preview.gender ? 1 : 0) + (preview.hasDate ? 1 : 0) + (preview.hasHour ? 1 : 0);
}

/**
 * Bát giác đều liền mạch, xoay 22.5° để có cạnh trên/dưới nằm ngang.
 *
 * Dùng một đường khép kín duy nhất thay cho hai nửa, nên không còn đường nối
 * thẳng đứng cắt đôi bát quái.
 */
function octagonPath(radius: number): string {
  const points = Array.from({ length: 8 }, (_, index) => polar(radius, 22.5 + index * 45));

  return `${points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ')} Z`;
}

interface TrigramMarkProps {
  trigram: TrigramMeta;
  index: number;
}

/** Một quẻ đơn: ba vạch liền/đứt, xoay theo phương tiếp tuyến. */
function TrigramMark({ trigram, index }: TrigramMarkProps): React.ReactElement {
  const angle = TRIGRAM_ANGLES[index];
  const position = polar(58, angle);

  return (
    <g
      data-trigram={trigram.han}
      transform={`translate(${position.x} ${position.y}) rotate(${angle + 90})`}
    >
      {trigram.lines.map((solid, lineIndex) => {
        const y = (lineIndex - 1) * 4.4;
        if (solid) {
          return (
            <line
              key={lineIndex}
              x1="-6.4"
              y1={y}
              x2="6.4"
              y2={y}
              stroke={GOLD_LIGHT}
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeOpacity="0.86"
            />
          );
        }
        return (
          <g key={lineIndex}>
            <line
              x1="-6.4"
              y1={y}
              x2="-2.1"
              y2={y}
              stroke={GOLD_LIGHT}
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeOpacity="0.86"
            />
            <line
              x1="2.1"
              y1={y}
              x2="6.4"
              y2={y}
              stroke={GOLD_LIGHT}
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeOpacity="0.86"
            />
          </g>
        );
      })}
    </g>
  );
}

/**
 * Huy hiệu trang trí cho trang Tình Duyên: Thiên Bàn Tử Vi với vòng 12 con giáp,
 * vòng 14 chính tinh, bát quái trung tính và âm dương đen–trắng ở tâm. Hai phía
 * âm dương sáng lên theo giới tính xuất hiện trong hồ sơ: Dương cho nam, Âm cho nữ.
 *
 * Không có prop thì huy hiệu giữ nguyên trạng thái tĩnh như cũ. Khi có dữ liệu
 * xem trước, các ký hiệu sáng dần theo thông tin đã nhập; hiệu ứng gộp hai bên
 * chỉ chạy khi `phase="merging"` và `animate` bật.
 */
export function TinhDuyenEmblem({
  personPreviews,
  phase = 'idle',
  activeStarIds,
  animate = true,
}: TinhDuyenEmblemProps = {}): React.ReactElement {
  const live = Boolean(personPreviews) && animate;
  const smoothClass = live ? 'love-emblem-smooth' : undefined;
  const showMerging = animate && phase === 'merging';
  const showMerged = animate && phase === 'revealed';

  const firstBranches = new Set(personPreviews?.[0].branchIndices ?? []);
  const secondBranches = new Set(personPreviews?.[1].branchIndices ?? []);
  const firstDateRanks = dateBranchRanks(personPreviews?.[0]);
  const secondDateRanks = dateBranchRanks(personPreviews?.[1]);
  // Đổi ngày hợp lệ sẽ đổi khoá và khởi động lại chuỗi; tên/giới tính/giờ thì không.
  const dateKey = personPreviews ? `${personPreviews[0].dateKey}|${personPreviews[1].dateKey}` : '';
  const firstCompletion = completionScore(personPreviews?.[0]);
  const secondCompletion = completionScore(personPreviews?.[1]);
  const bothComplete = firstCompletion === 3 && secondCompletion === 3;
  const activeStars = activeStarIds ?? EMPTY_STAR_IDS;

  // Giới tính là thuộc tính của cả huy hiệu, không gán trái/phải cho từng người:
  // có nam thì Dương sáng, có nữ thì Âm sáng, có cả hai thì cả hai cùng sáng.
  const hasMale = personPreviews?.some((person) => person.gender === 'nam') ?? false;
  const hasFemale = personPreviews?.some((person) => person.gender === 'nu') ?? false;
  const hasAnyGender = hasMale || hasFemale;

  const branchTone = (index: number): string | null => {
    const first = firstBranches.has(index);
    const second = secondBranches.has(index);

    if (first && second) return '#ffe9a8';
    if (first) return GOLD_LIGHT;
    if (second) return JADE_BRIGHT;
    return null;
  };

  // Chỉ vành con giáp, vòng chính tinh và âm dương quay tại chỗ quanh tâm.
  const layerMotionClass = (layer: 'ring' | 'stars' | 'center'): string | undefined => {
    if (showMerging) return `love-emblem-merge-${layer}`;
    if (showMerged) return `love-emblem-merged-${layer}`;
    return undefined;
  };

  const centerMotionClass = layerMotionClass('center');
  const starsClassName = layerMotionClass('stars');

  return (
    <div
      data-testid="tinh-duyen-emblem"
      data-phase={phase}
      data-animate={String(Boolean(animate))}
      data-live={String(live)}
      data-both-complete={String(bothComplete)}
      data-merge-duration-ms={LOVE_EMBLEM_MERGE_DURATION_MS}
      data-merge-duration={LOVE_EMBLEM_MERGE_DURATION_MS}
      data-date-key={dateKey}
      style={
        {
          '--love-emblem-merge-duration': `${LOVE_EMBLEM_MERGE_DURATION_MS}ms`,
        } as React.CSSProperties
      }
      aria-hidden="true"
      className={`mx-auto w-full max-w-[29rem] sm:max-w-[32rem]${live ? ' love-emblem-live' : ''}`}
    >
      <svg
        viewBox="0 0 400 400"
        className="h-auto w-full"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="love-emblem-bg" cx="42%" cy="34%" r="76%">
            <stop offset="0%" stopColor="#1c0505" />
            <stop offset="58%" stopColor="#160404" />
            <stop offset="100%" stopColor="#120303" />
          </radialGradient>
          <radialGradient id="love-emblem-bronze" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#4a3514" />
            <stop offset="52%" stopColor="#2a1a08" />
            <stop offset="100%" stopColor="#160d04" />
          </radialGradient>
          <radialGradient id="love-emblem-bagua" cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor="#5a1712" />
            <stop offset="58%" stopColor="#3a0c0c" />
            <stop offset="100%" stopColor="#240707" />
          </radialGradient>
          <radialGradient id="love-emblem-animal-vignette" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#120303" stopOpacity="0" />
            <stop offset="100%" stopColor="#120303" stopOpacity="0.78" />
          </radialGradient>
          <linearGradient id="love-emblem-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.92" />
            <stop offset="48%" stopColor={GOLD} stopOpacity="0.6" />
            <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0.78" />
          </linearGradient>
          <pattern
            id="love-emblem-cloud-pattern"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)"
          >
            <g
              stroke={GOLD_LIGHT}
              strokeOpacity="0.1"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 70c10-10 22-12 30-4 6-9 19-11 26-2 8-3 16 2 18 10" />
              <path d="M18 58c4-6 12-7 17-2M42 55c4-5 10-5 14-1" />
              <path d="M52 22c8-7 17-8 24-2 5-5 13-4 16 2 6 0 10 4 10 9" />
              <path d="M64 14c3-4 9-4 12 0" />
            </g>
          </pattern>
          <filter id="love-emblem-glow-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="3.6"
              floodColor={GOLD_BRIGHT}
              floodOpacity="0.36"
            />
          </filter>
          <filter id="love-emblem-glow-gold" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.4"
              floodColor={GOLD_LIGHT}
              floodOpacity="0.9"
            />
          </filter>
          <filter id="love-emblem-glow-jade" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.4"
              floodColor={JADE_BRIGHT}
              floodOpacity="0.9"
            />
          </filter>
          {/* Ánh trắng–vàng cho phía âm dương đang hoạt động. */}
          <filter id="love-emblem-glow-polarity" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.8"
              floodColor="#f8ecc8"
              floodOpacity="0.92"
            />
          </filter>
          {BRANCHES.map((branch, index) => {
            const position = polar(ANIMAL_CENTER_RADIUS, index * 30 - 90);
            return (
              <clipPath key={branch.slug} id={`love-emblem-animal-clip-${branch.slug}`}>
                <circle cx={position.x} cy={position.y} r={ANIMAL_CLIP_RADIUS} />
              </clipPath>
            );
          })}
        </defs>

        {/* Nền đỏ đen + mây chìm, giữ tương phản tối để vàng nổi lên. */}
        <circle cx={CENTER} cy={CENTER} r="196" fill="url(#love-emblem-bg)" />
        <circle cx={CENTER} cy={CENTER} r="194" fill="url(#love-emblem-cloud-pattern)" />
        <g
          stroke={GOLD_LIGHT}
          strokeOpacity="0.13"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M34 116c18-24 44-30 66-14 12-16 38-18 52-2 18-4 30 8 28 22" />
          <path d="M52 104c7-8 18-10 26-4M90 100c7-7 16-7 22-1" />
          <path d="M312 302c-16-18-40-20-58-6-10-12-32-13-43-1-14-4-24 6-23 18" />
          <path d="M292 292c-6-6-15-7-21-2M264 291c-6-5-13-5-18-1" />
        </g>

        <circle cx={CENTER} cy={CENTER} r="194" stroke="url(#love-emblem-ring)" strokeWidth="1.2" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="188.5"
          stroke={GOLD}
          strokeWidth="0.45"
          strokeOpacity="0.34"
          strokeDasharray="2 6"
        />

        {/* Vạch khắc độ trên vành ngoài: cố định, không tham gia hiệu ứng gộp. */}
        <g>
          {RIM_TICKS.map(({ angle, major }) => {
            const inner = polar(major ? 189.4 : 191.2, angle);
            const outer = polar(193.8, angle);
            return (
              <line
                key={angle}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={major ? GOLD_LIGHT : GOLD}
                strokeWidth={major ? 0.9 : 0.42}
                strokeOpacity={major ? 0.7 : 0.34}
              />
            );
          })}
        </g>

        {/* Vành 12 con giáp: nền đồng hun, chia 12 ô đều nhau. */}
        <circle cx={CENTER} cy={CENTER} r={ANIMAL_RING_OUTER} fill="url(#love-emblem-bronze)" />
        <circle cx={CENTER} cy={CENTER} r={ANIMAL_RING_INNER} fill="url(#love-emblem-bg)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ANIMAL_RING_OUTER}
          stroke="url(#love-emblem-ring)"
          strokeWidth="1.1"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="183.5"
          stroke={GOLD}
          strokeWidth="0.4"
          strokeOpacity="0.28"
          strokeDasharray="1 5"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ANIMAL_RING_INNER}
          stroke={GOLD}
          strokeWidth="0.8"
          strokeOpacity="0.58"
        />

        <g className={layerMotionClass('ring')} filter="url(#love-emblem-glow-soft)">
          {BRANCHES.map((branch, index) => {
            const angle = index * 30 - 90;
            const animalPos = polar(ANIMAL_CENTER_RADIUS, angle);
            const glyph = polar(ANIMAL_GLYPH_RADIUS, angle);
            const boundaryInner = polar(ANIMAL_RING_INNER, angle - 15);
            const boundaryOuter = polar(ANIMAL_RING_OUTER, angle - 15);
            const imageSize = ANIMAL_CLIP_RADIUS * 2;
            const imageX = animalPos.x - ANIMAL_CLIP_RADIUS;
            const imageY = animalPos.y - ANIMAL_CLIP_RADIUS;
            const activeTone = branchTone(index);
            const firstRank = firstDateRanks.get(index);
            const secondRank = secondDateRanks.get(index);
            // Hai người dùng chung chi: lấy hạng sớm nhất trong các trụ ngày/tháng/năm.
            const popRank =
              firstRank !== undefined && secondRank !== undefined
                ? Math.min(firstRank, secondRank)
                : (firstRank ?? secondRank);
            const popDelay = popRank !== undefined ? BRANCH_POP_DELAYS_MS[popRank] : undefined;
            const popClass = live && popRank !== undefined ? 'love-emblem-branch-pop' : undefined;
            const glow = activeTone
              ? activeTone === JADE_BRIGHT
                ? 'url(#love-emblem-glow-jade)'
                : 'url(#love-emblem-glow-gold)'
              : undefined;
            const imageFilter = activeTone
              ? 'sepia(0.16) saturate(1.42) brightness(1.16) contrast(1.05)'
              : 'sepia(0.38) saturate(1.15) brightness(0.94) contrast(1.04)';

            return (
              <g
                key={`${branch.slug}-${dateKey}`}
                className={smoothClass}
                data-branch-index={index}
                data-animal={branch.animal}
                data-active-tone={
                  firstBranches.has(index) && secondBranches.has(index)
                    ? 'both'
                    : firstBranches.has(index)
                      ? 'first'
                      : secondBranches.has(index)
                        ? 'second'
                        : 'none'
                }
                data-pop-rank={popRank !== undefined ? String(popRank) : 'none'}
                {...(popDelay !== undefined ? { 'data-pop-delay': String(popDelay) } : {})}
              >
                <line
                  x1={boundaryInner.x}
                  y1={boundaryInner.y}
                  x2={boundaryOuter.x}
                  y2={boundaryOuter.y}
                  stroke={GOLD}
                  strokeWidth="0.5"
                  strokeOpacity="0.34"
                />

                {/* Đĩa tối + vành vàng để ảnh con giáp hòa vào ô. */}
                <circle
                  cx={animalPos.x}
                  cy={animalPos.y}
                  r={ANIMAL_DISC_RADIUS}
                  fill="#0b0403"
                  fillOpacity="0.94"
                  stroke={GOLD}
                  strokeWidth="0.5"
                  strokeOpacity={activeTone ? 0.7 : 0.5}
                />
                <g
                  className={popClass}
                  style={
                    popClass && popDelay !== undefined
                      ? ({
                          '--love-emblem-branch-delay': `${popDelay}ms`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <g filter={glow}>
                    <image
                      href={`/images/zodiac-love/${branch.slug}.webp`}
                      x={imageX}
                      y={imageY}
                      width={imageSize}
                      height={imageSize}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#love-emblem-animal-clip-${branch.slug})`}
                      style={{ filter: imageFilter }}
                    />
                    <circle
                      cx={animalPos.x}
                      cy={animalPos.y}
                      r={ANIMAL_CLIP_RADIUS}
                      fill="url(#love-emblem-animal-vignette)"
                    />
                  </g>
                  <circle
                    cx={animalPos.x}
                    cy={animalPos.y}
                    r={ANIMAL_CLIP_RADIUS}
                    fill="none"
                    stroke={activeTone ?? GOLD_LIGHT}
                    strokeWidth={activeTone ? 0.85 : 0.45}
                    strokeOpacity={activeTone ? 0.9 : 0.42}
                  />
                  <circle
                    cx={animalPos.x}
                    cy={animalPos.y}
                    r="17.8"
                    fill="none"
                    stroke={activeTone ?? GOLD}
                    strokeWidth={activeTone ? 1.15 : 0.55}
                    strokeOpacity={activeTone ? 0.95 : 0.4}
                    filter={glow}
                  />
                  {activeTone && (
                    <circle
                      cx={animalPos.x}
                      cy={animalPos.y}
                      r="15"
                      fill="none"
                      stroke={activeTone}
                      strokeWidth="0.6"
                      strokeOpacity="0.55"
                    />
                  )}
                </g>
                <text
                  x={glyph.x}
                  y={glyph.y + 2.7}
                  textAnchor="middle"
                  fontSize="7.6"
                  fill={activeTone ?? GOLD_LIGHT}
                  fillOpacity={activeTone ? 1 : 0.82}
                  fontWeight={activeTone ? 600 : 400}
                  fontFamily={HAN_FONT}
                  filter={activeTone ? glow : undefined}
                >
                  {branch.han}
                </text>
              </g>
            );
          })}
        </g>

        {/* Vòng trong: 14 chính tinh chạy theo cung tròn. */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="136"
          fill="#190606"
          stroke={GOLD}
          strokeWidth="0.55"
          strokeOpacity="0.58"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="102"
          fill="#140404"
          stroke={GOLD}
          strokeWidth="0.45"
          strokeOpacity="0.42"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="132.5"
          stroke={GOLD_LIGHT}
          strokeWidth="0.35"
          strokeOpacity="0.22"
          strokeDasharray="1 4"
        />
        <g
          className={starsClassName}
          data-stars-complete={String(bothComplete)}
          filter="url(#love-emblem-glow-soft)"
        >
          {STARS.map((star, index) => {
            const angle = STAR_ANGLES[index];
            const position = polar(119, angle);
            const isActive = activeStars.has(star.engineId);
            const starClass =
              [isActive ? 'love-emblem-star-active' : undefined, live && isActive ? 'love-emblem-star-pop' : undefined]
                .filter(Boolean)
                .join(' ') || undefined;

            return (
              <g
                key={star.key}
                data-star={star.han}
                data-star-key={star.key}
                data-star-active={String(isActive)}
                transform={`translate(${position.x} ${position.y}) rotate(${tangentRotation(angle)})`}
              >
                <g className={starClass}>
                  <text
                    textAnchor="middle"
                    y="2.6"
                    fontSize="7.4"
                    fill={isActive ? GOLD_BRIGHT : GOLD_LIGHT}
                    fillOpacity={isActive ? 1 : 0.5}
                    fontFamily={HAN_FONT}
                  >
                    {star.han}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Bát quái trung tính, liền mạch: một bát giác duy nhất không đường nối.
            Giới tính chỉ thể hiện ở hai phía âm dương nơi tâm. */}
        <g className={smoothClass}>
          <path
            d={octagonPath(68)}
            fill="url(#love-emblem-bagua)"
            stroke={GOLD}
            strokeWidth="0.85"
            strokeOpacity="0.72"
          />
          <path
            d={octagonPath(48)}
            fill="#120303"
            stroke={GOLD_LIGHT}
            strokeWidth="0.5"
            strokeOpacity="0.52"
          />
          {TRIGRAMS.map((trigram, index) => (
            <TrigramMark key={trigram.han} trigram={trigram} index={index} />
          ))}
        </g>

        {/* Trung tâm: âm dương đen–trắng cổ điển. Mặc định cả hai phía xám mờ;
            Dương (nam) làm sáng nền tròn trắng, Âm (nữ) làm đậm vùng đen. Cụm
            quay tại chỗ và lóe sáng khi gộp. Chữ 緣 nằm ngoài cụm. */}
        <g
          className={centerMotionClass}
          data-testid="love-emblem-yinyang"
          data-duong-active={String(hasMale)}
          data-am-active={String(hasFemale)}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r="33"
            fill="#0b0a04"
            stroke={GOLD}
            strokeWidth="0.7"
            strokeOpacity="0.55"
          />
          <g
            data-polarity="duong"
            data-active={String(hasMale)}
            className={[smoothClass, live && hasMale ? 'love-emblem-polarity-pop' : undefined]
              .filter(Boolean)
              .join(' ') || undefined}
          >
            {/* Dương: nền tròn trắng + chấm đen trong thuỳ trên. */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r="30"
              fill={hasMale ? '#f4efe2' : '#8a8a8a'}
              filter={hasMale ? 'url(#love-emblem-glow-polarity)' : undefined}
            />
            <circle
              cx={CENTER}
              cy="185"
              r="4.9"
              fill={hasMale ? '#050505' : '#3a3a3a'}
            />
          </g>
          <g
            data-polarity="am"
            data-active={String(hasFemale)}
            className={[smoothClass, live && hasFemale ? 'love-emblem-polarity-pop' : undefined]
              .filter(Boolean)
              .join(' ') || undefined}
          >
            {/* Âm: nửa trái + thuỳ dưới, phủ lên nền trắng; chấm trắng trong thuỳ dưới. */}
            <path
              d={YIN_YANG_AM_PATH}
              fill={hasFemale ? '#080808' : '#333333'}
              filter={hasFemale ? 'url(#love-emblem-glow-polarity)' : undefined}
            />
            <circle
              cx={CENTER}
              cy="215"
              r="4.9"
              fill={hasFemale ? '#f7f2e6' : '#9a9a9a'}
            />
          </g>
          <circle
            cx={CENTER}
            cy={CENTER}
            r="30"
            stroke={GOLD_LIGHT}
            strokeWidth="0.5"
            strokeOpacity={hasAnyGender ? 0.8 : 0.4}
            className={smoothClass}
          />
        </g>
        <text
          x={CENTER}
          y="258.5"
          textAnchor="middle"
          fontSize="13.5"
          fill={GOLD_LIGHT}
          fillOpacity={bothComplete ? 1 : 0.82}
          fontFamily={HAN_FONT}
          letterSpacing="1.5"
          filter={bothComplete ? 'url(#love-emblem-glow-gold)' : undefined}
        >
          緣
        </text>

        <g fill={GOLD} fillOpacity="0.55">
          <circle cx={CENTER} cy="8" r="1.4" />
          <circle cx="392" cy={CENTER} r="1.4" />
          <circle cx={CENTER} cy="392" r="1.4" />
          <circle cx="8" cy={CENTER} r="1.4" />
        </g>
      </svg>
    </div>
  );
}
