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

/**
 * Bán kính quỹ đạo địa chi, tính theo % đường kính (responsive, không dùng px cố định).
 * Vòng trong: inset 18% => bán kính 32%. Vòng ngoài: bán kính 50%.
 * Chính giữa = (32 + 50) / 2 = 41%.
 */
const ORBIT_RADIUS_PERCENT = 41;

function roundPercent(value: number): number {
  return Number(value.toFixed(3));
}

/** Tý ở đỉnh (12 giờ), đi theo chiều kim đồng hồ như la bàn tử vi. */
function getBranchPosition(index: number): { left: string; top: string } {
  const rad = ((index * 30 - 90) * Math.PI) / 180;
  return {
    left: `${roundPercent(50 + ORBIT_RADIUS_PERCENT * Math.cos(rad))}%`,
    top: `${roundPercent(50 + ORBIT_RADIUS_PERCENT * Math.sin(rad))}%`,
  };
}

function YinYang(): React.ReactElement {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="48" className="fill-[#0a0a0a] stroke-gold" strokeWidth="1.5" />
      <path
        d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,1 50,50 A24,24 0 0,0 50,2 Z"
        className="fill-gold"
      />
      <circle cx="50" cy="26" r="6" className="fill-gold" />
      <circle cx="50" cy="74" r="6" className="fill-[#0a0a0a]" />
    </svg>
  );
}

export function ZodiacWheel(): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="img"
        aria-label="Vòng tròn 12 con giáp"
        className="relative aspect-square w-72 md:w-[26rem]"
      >
        {/* Vành đai sao Thổ: nền gradient giữa vòng trong và vòng ngoài */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle closest-side, transparent 64%, rgba(212,175,55,0.12) 82%, rgba(212,175,55,0.04) 100%)',
          }}
        />
        {/* Vòng ngoài: xoay chậm ngược chiều */}
        <div className="absolute inset-0 rounded-full border border-dashed border-gold/40 animate-[spin_60s_linear_infinite_reverse] motion-reduce:animate-none" />
        {/* Vòng trong */}
        <div className="absolute inset-[18%] rounded-full border border-gold/30" />

        {/* Container xoay 60s: chứa âm dương + 12 địa chi */}
        <div className="absolute inset-0 animate-[spin_60s_linear_infinite] motion-reduce:animate-none">
          {/* Âm dương ở giữa: xoay ngược 30s */}
          <div className="absolute inset-[27%] animate-[spin_30s_linear_infinite_reverse] motion-reduce:animate-none">
            <YinYang />
          </div>

          {/* 12 địa chi chữ Hán quanh âm dương, nằm giữa 2 vòng tròn */}
          <div aria-hidden="true">
            {EARTHLY_BRANCHES.map((branch, index) => (
              <div
                key={branch.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={getBranchPosition(index)}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-background/80 font-han text-lg text-gold shadow-[0_0_10px_rgba(212,175,55,0.25)] md:h-12 md:w-12 md:text-xl">
                  {branch.han}
                </span>
                <span className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted md:text-xs">
                  {branch.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="font-heading text-lg tracking-[0.3em] text-gold">Sao Mệnh</p>
    </div>
  );
}
