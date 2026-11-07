'use client';

const EARTHLY_BRANCHES = [
  { han: '子', label: 'Tý', element: 'Thủy' },
  { han: '丑', label: 'Sửu', element: 'Thổ' },
  { han: '寅', label: 'Dần', element: 'Mộc' },
  { han: '卯', label: 'Mão', element: 'Mộc' },
  { han: '辰', label: 'Thìn', element: 'Thổ' },
  { han: '巳', label: 'Tỵ', element: 'Hỏa' },
  { han: '午', label: 'Ngọ', element: 'Hỏa' },
  { han: '未', label: 'Mùi', element: 'Thổ' },
  { han: '申', label: 'Thân', element: 'Kim' },
  { han: '酉', label: 'Dậu', element: 'Kim' },
  { han: '戌', label: 'Tuất', element: 'Thổ' },
  { han: '亥', label: 'Hợi', element: 'Thủy' },
] as const;

const GOLD = '#d4af37';
const GOLD_NODE = '#ffe27a';
const GOLD_LIGHT = '#f0d089';
const GOLD_DEEP = '#8a6a1a';

/** Ngọc bích cho một nửa âm dương, đối trọng với vàng kim. */
const JADE = '#1fae7d';
const JADE_BRIGHT = '#6ef0bd';
const JADE_DEEP = '#0a5c43';

/**
 * Bán kính quỹ đạo địa chi, tính theo % đường kính (responsive, không dùng px cố định).
 * Tâm nút đặt tại bán kính 40% để nằm gọn giữa các vòng trang trí.
 */
const ORBIT_RADIUS_PERCENT = 40;
const WHEEL_CENTER = 200;
const TICK_COUNT = 60;

/** Một vòng quay chậm, đều: 90 giây/vòng, chỉ bật khi người dùng không giảm chuyển động. */
const WHEEL_SPIN_DURATION_SECONDS = 90;
const WHEEL_SPIN_CLASS = 'motion-safe:animate-[spin_90s_linear_infinite]';
const WHEEL_COUNTER_SPIN_CLASS = 'motion-safe:animate-[spin_90s_linear_infinite_reverse]';

/** Nhãn thay thế đầy đủ 12 địa chi cho trình đọc màn hình. */
const WHEEL_ARIA_LABEL = `Vòng tròn 12 con giáp: ${EARTHLY_BRANCHES.map(
  (branch) => branch.label
).join(', ')}`;

function roundPercent(value: number): number {
  return Number(value.toFixed(3));
}

function roundCoord(value: number): number {
  return Number(value.toFixed(2));
}

/** Tý ở đỉnh (12 giờ), đi theo chiều kim đồng hồ như la bàn tử vi. */
function getBranchPosition(index: number): { left: string; top: string } {
  const rad = ((index * 30 - 90) * Math.PI) / 180;
  return {
    left: `${roundPercent(50 + ORBIT_RADIUS_PERCENT * Math.cos(rad))}%`,
    top: `${roundPercent(50 + ORBIT_RADIUS_PERCENT * Math.sin(rad))}%`,
  };
}

interface TickMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  major: boolean;
}

const TICK_MARKS: readonly TickMark[] = Array.from({ length: TICK_COUNT }, (_, index) => {
  const major = index % 5 === 0;
  const angle = ((index * (360 / TICK_COUNT) - 90) * Math.PI) / 180;
  const innerRadius = major ? 181 : 186;
  return {
    x1: roundCoord(WHEEL_CENTER + 192 * Math.cos(angle)),
    y1: roundCoord(WHEEL_CENTER + 192 * Math.sin(angle)),
    x2: roundCoord(WHEEL_CENTER + innerRadius * Math.cos(angle)),
    y2: roundCoord(WHEEL_CENTER + innerRadius * Math.sin(angle)),
    major,
  };
});

/** 12 nan hoa mảnh nằm giữa các địa chi, tăng cảm giác trang trí mà không cản nhãn. */
const SPOKE_MARKS = Array.from({ length: 12 }, (_, index) => {
  const angle = ((index * 30 + 15 - 90) * Math.PI) / 180;
  return {
    x1: roundCoord(WHEEL_CENTER + 126 * Math.cos(angle)),
    y1: roundCoord(WHEEL_CENTER + 126 * Math.sin(angle)),
    x2: roundCoord(WHEEL_CENTER + 192 * Math.cos(angle)),
    y2: roundCoord(WHEEL_CENTER + 192 * Math.sin(angle)),
  };
});

function YinYang(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
      data-testid="yin-yang"
      style={{
        filter:
          'drop-shadow(0 0 6px rgba(110,240,189,0.35)) drop-shadow(0 0 18px rgba(212,175,55,0.42))',
      }}
    >
      <defs>
        <radialGradient id="yin-yang-jade" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={JADE_BRIGHT} />
          <stop offset="48%" stopColor={JADE} />
          <stop offset="100%" stopColor={JADE_DEEP} />
        </radialGradient>
        <radialGradient id="yin-yang-gold" cx="38%" cy="30%" r="82%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="46%" stopColor={GOLD} />
          <stop offset="100%" stopColor="#7a5a12" />
        </radialGradient>
      </defs>

      {/* Nền ngọc bích (một nửa của âm dương). */}
      <circle
        data-testid="yin-yang-white"
        data-tone="jade"
        cx="50"
        cy="50"
        r="48"
        fill="url(#yin-yang-jade)"
      />
      {/* Nửa vàng kim với đường S chuẩn: hai cung bán kính 24 lệch nhau. */}
      <path
        data-testid="yin-yang-black"
        data-tone="gold"
        d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z"
        fill="url(#yin-yang-gold)"
      />
      {/* Chấm vàng nằm trong nửa ngọc bích. */}
      <circle
        data-testid="yin-yang-black-dot"
        data-tone="gold"
        cx="50"
        cy="26"
        r="6.4"
        fill="url(#yin-yang-gold)"
      />
      {/* Chấm ngọc bích nằm trong nửa vàng kim. */}
      <circle
        data-testid="yin-yang-white-dot"
        data-tone="jade"
        cx="50"
        cy="74"
        r="6.4"
        fill="url(#yin-yang-jade)"
      />
      {/* Vành vàng kim mảnh bao quanh toàn bộ âm dương. */}
      <circle
        data-testid="yin-yang-rim"
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * Hệ vòng đồng tâm: quầng vàng ấm, vành ngoài, vạch chia và nan hoa mảnh.
 * Cả lớp quay chậm để thấy rõ chuyển động; chỉ dùng CSS và tôn trọng reduced-motion.
 */
function WheelRings(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`absolute inset-0 h-full w-full origin-center ${WHEEL_SPIN_CLASS}`}
      aria-hidden="true"
      focusable="false"
      data-testid="wheel-rings"
      data-spin-duration={WHEEL_SPIN_DURATION_SECONDS}
    >
      <defs>
        <radialGradient id="zodiac-halo" cx="50%" cy="50%" r="50%">
          <stop offset="52%" stopColor={GOLD} stopOpacity="0" />
          <stop offset="74%" stopColor={GOLD} stopOpacity="0.10" />
          <stop offset="92%" stopColor={GOLD_LIGHT} stopOpacity="0.08" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="zodiac-ring-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.85" />
          <stop offset="45%" stopColor={GOLD} stopOpacity="0.55" />
          <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0.70" />
        </linearGradient>
        <linearGradient id="zodiac-ring-amber" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.70" />
          <stop offset="55%" stopColor={GOLD} stopOpacity="0.42" />
          <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="198" fill="url(#zodiac-halo)" />

      <circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke="url(#zodiac-ring-gold)"
        strokeWidth="1.1"
      />
      <circle
        cx="200"
        cy="200"
        r="191.5"
        fill="none"
        stroke="url(#zodiac-ring-amber)"
        strokeWidth="0.6"
        opacity="0.42"
      />

      <g strokeLinecap="round">
        {TICK_MARKS.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? 'url(#zodiac-ring-gold)' : GOLD}
            strokeWidth={tick.major ? 1 : 0.55}
            opacity={tick.major ? 0.72 : 0.32}
          />
        ))}
      </g>

      <g stroke={GOLD} strokeWidth="0.45" opacity="0.12">
        {SPOKE_MARKS.map((line, index) => (
          <line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
        ))}
      </g>

      {/* Đường quỹ đạo 12 địa chi: viền vàng ấm mảnh. */}
      <circle cx="200" cy="200" r="160" fill="none" stroke={GOLD} strokeWidth="6" opacity="0.06" />
      <circle
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke="url(#zodiac-ring-amber)"
        strokeWidth="1.3"
        opacity="0.66"
      />
      <circle
        cx="200"
        cy="200"
        r="166"
        fill="none"
        stroke="url(#zodiac-ring-gold)"
        strokeWidth="0.6"
        opacity="0.34"
        strokeDasharray="3 6"
      />

      <circle
        cx="200"
        cy="200"
        r="176"
        fill="none"
        stroke={GOLD}
        strokeWidth="0.6"
        opacity="0.18"
        strokeDasharray="2 7"
      />
      <circle
        cx="200"
        cy="200"
        r="118"
        fill="none"
        stroke="url(#zodiac-ring-amber)"
        strokeWidth="1"
        opacity="0.52"
      />
      <circle
        cx="200"
        cy="200"
        r="108"
        fill="none"
        stroke="url(#zodiac-ring-gold)"
        strokeWidth="0.55"
        opacity="0.28"
        strokeDasharray="1 6"
      />
      <circle cx="200" cy="200" r="96" fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.22" />
      <circle
        cx="200"
        cy="200"
        r="88"
        fill="none"
        stroke="url(#zodiac-ring-gold)"
        strokeWidth="0.45"
        opacity="0.16"
      />
    </svg>
  );
}

interface BranchMedallionProps {
  han: string;
  label: string;
  /** Nhánh ở đáy vòng tròn cần siết nhãn để không bị `overflow-hidden` cắt. */
  isBottom?: boolean;
}

/**
 * Mỗi địa chi là một medallion tròn tối xanh-đen với vành vàng mảnh, chữ Hán ở tâm
 * và tên nhánh tiếng Việt ngay bên dưới. Nhãn không có nền/viền để giữ bố cục tĩnh,
 * nhẹ như ảnh tham chiếu.
 */
function BranchMedallion({
  han,
  label,
  isBottom = false,
}: BranchMedallionProps): React.ReactElement {
  return (
    <span
      data-testid="branch-content"
      data-counter-spin-duration={WHEEL_SPIN_DURATION_SECONDS}
      className={`relative flex flex-col items-center gap-1 origin-center max-sm:gap-0.5 ${WHEEL_COUNTER_SPIN_CLASS}`}
    >
      <span
        data-testid="branch-medallion"
        className="relative flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10 md:h-12 md:w-12"
      >
        {/* Quầng vàng rất nhẹ quanh medallion. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-18%] rounded-full blur-md max-sm:inset-[-10%] max-sm:blur-sm"
          style={{
            background:
              'radial-gradient(circle, rgba(212,175,55,0.24) 0%, rgba(212,175,55,0.10) 48%, transparent 74%)',
          }}
        />

        {/* Vành vàng kim mảnh trên nền tối xanh-đen. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 42% 30%, #263a2c 0%, #12211a 46%, #060d09 78%, #020403 100%)',
            border: '1px solid rgba(212,175,55,0.62)',
            boxShadow:
              '0 0 7px rgba(212,175,55,0.28), inset 0 0 0 1px rgba(212,175,55,0.12)',
          }}
        />

        {/* Lõi tối tròn giữ tương phản cho chữ Hán. */}
        <span
          aria-hidden="true"
          className="absolute inset-[13%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 38% 30%, rgba(38,66,49,0.82) 0%, rgba(7,15,11,0.98) 64%, rgba(2,5,4,1) 100%)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.72)',
          }}
        />

        <span
          data-testid="branch-glyph"
          className="relative z-10 font-han text-base font-semibold leading-none md:text-lg"
          style={{
            color: GOLD_NODE,
            textShadow: '0 0 8px rgba(255,215,0,0.62), 0 0 16px rgba(212,175,55,0.30)',
          }}
        >
          {han}
        </span>
      </span>

      {/* Nhãn tiếng Việt nhỏ, in nghiêng, màu bạc mờ — không nền, viền hay pill.
          Đặt tuyệt đối bên dưới medallion để không đẩy tâm medallion lệch khỏi quỹ đạo 40%. */}
      <span
        data-testid="branch-label"
        className={`absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap font-serif text-[11px] italic leading-none text-[#d8ccae] max-sm:text-[10px] sm:text-xs ${
          isBottom ? 'mt-0 max-sm:leading-none' : 'mt-0.5 max-sm:leading-tight'
        }`}
      >
        {label}
      </span>
    </span>
  );
}

interface ZodiacWheelProps {
  /** Lớp kích thước của vòng tròn (mặc định: 352px mobile, 416px từ md). */
  sizeClassName?: string;
}

export function ZodiacWheel({
  sizeClassName = 'w-[22rem] md:w-[26rem]',
}: ZodiacWheelProps = {}): React.ReactElement {
  return (
    <div className="flex w-full max-w-full min-w-0 flex-col items-center gap-4 lg:w-auto">
      <div
        role="img"
        aria-label={WHEEL_ARIA_LABEL}
        data-testid="zodiac-wheel"
        className={`zodiac-wheel relative aspect-square max-w-full min-w-0 overflow-hidden ${sizeClassName}`}
      >
        <WheelRings />

        {/* Quầng sáng ngọc bích/vàng kim ấm, tĩnh, nằm sau âm dương. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[20%] rounded-full blur-lg"
          style={{
            background:
              'radial-gradient(circle, rgba(110,240,189,0.22) 0%, rgba(212,175,55,0.18) 38%, rgba(212,175,55,0.10) 60%, transparent 80%)',
          }}
        />

        {/* Âm dương ngọc bích/vàng kim quay chậm cùng vòng ngoài. */}
        <div
          data-testid="yin-yang-shell"
          data-spin-duration={WHEEL_SPIN_DURATION_SECONDS}
          className={`absolute inset-[27%] origin-center ${WHEEL_SPIN_CLASS}`}
        >
          <YinYang />
        </div>

        {/* 12 địa chi giữ nguyên vị trí trên lớp quỹ đạo quay; nội dung tự quay ngược để luôn thẳng. */}
        <div
          data-testid="branch-nodes"
          data-spin-duration={WHEEL_SPIN_DURATION_SECONDS}
          className={`absolute inset-0 origin-center max-sm:inset-[2%] ${WHEEL_SPIN_CLASS}`}
        >
          {EARTHLY_BRANCHES.map((branch, index) => (
            <div
              key={branch.label}
              data-testid="branch-node"
              data-branch={branch.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={getBranchPosition(index)}
            >
              <BranchMedallion
                han={branch.han}
                label={branch.label}
                isBottom={index === 6}
              />
            </div>
          ))}
        </div>
      </div>

      <p
        className="font-heading text-lg tracking-[0.3em] text-[#e8cf87]"
        style={{ textShadow: '0 0 18px rgba(212,175,55,0.35)' }}
      >
        Sao Mệnh
      </p>
    </div>
  );
}
