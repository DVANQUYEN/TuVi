'use client';

import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { PalaceId } from '@/lib/ziwei/types/enums';
import { calculatePalaceComprehensiveScore } from '@/lib/ziwei/interpretation/fortune-score';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface ChartSummaryProps {
  chart: ZiweiChart;
}

interface ChartScores {
  career: number;
  wealth: number;
  love: number;
  health: number;
  strengths: string[];
  challenges: string[];
}

const ASPECTS: ReadonlyArray<{
  key: 'career' | 'wealth' | 'love' | 'health';
  palaceId: PalaceId;
  label: string;
}> = [
  { key: 'career', palaceId: 'quanLoc', label: 'Sự nghiệp' },
  { key: 'wealth', palaceId: 'taiBach', label: 'Tài lộc' },
  { key: 'love', palaceId: 'phuThe', label: 'Tình duyên' },
  { key: 'health', palaceId: 'tatAch', label: 'Sức khỏe' },
];

export function ChartSummary({ chart }: ChartSummaryProps): React.ReactElement {
  const scores = calculateScores(chart);

  return (
    <section
      aria-labelledby="chart-summary-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="chart-summary-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="福" size="lg" />
        <span>Khái quát lá số</span>
      </h2>

      {/* Thông tin cơ bản */}
      <dl className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoItem label="Mệnh" value={formatMenh(chart)} han="命" />
        <InfoItem label="Cục" value={chart.heavenPlate.fiveElementsClass.name} han="禄" />
        <InfoItem label="Chủ Mệnh" value={chart.heavenPlate.soulLord} han="主" />
        <InfoItem label="Chủ Thân" value={chart.heavenPlate.bodyLord} han="身" />
      </dl>

      {/* Điểm các khía cạnh */}
      <div className="mb-6 space-y-3">
        <ScoreBar label="Sự nghiệp" value={scores.career} han="官" />
        <ScoreBar label="Tài lộc" value={scores.wealth} han="財" />
        <ScoreBar label="Tình duyên" value={scores.love} han="婚" />
        <ScoreBar label="Sức khỏe" value={scores.health} han="疾" />
      </div>

      {/* Điểm mạnh / Lưu ý */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded bg-green-500/10 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-el-moc">
            <HanIcon han="吉" size="sm" />
            <span>Điểm mạnh</span>
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {scores.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded bg-yellow-500/10 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-el-tho">
            <HanIcon han="厄" size="sm" />
            <span>Điều cần lưu tâm</span>
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            {scores.challenges.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
  han,
}: {
  label: string;
  value: string;
  han: string;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-3">
      <HanIcon han={han} size="lg" />
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="font-semibold break-words">{value}</dd>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  han,
}: {
  label: string;
  value: number;
  han: string;
}): React.ReactElement {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <HanIcon han={han} size="sm" />
          <span className="font-medium">{label}</span>
        </span>
        <span className="font-bold text-gold">{value}/5</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={`${value} trên 5`}
        className="h-2 overflow-hidden rounded-full bg-elevated"
      >
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Tính điểm heuristic (1-5) cho từng khía cạnh bằng điểm vận hạn dùng chung
 * với đại hạn/lưu niên, rồi suy ra điểm mạnh / lưu ý.
 */
function calculateScores(chart: ZiweiChart): ChartScores {
  const aspectScores = Object.fromEntries(
    ASPECTS.map((a) => [
      a.key,
      calculatePalaceComprehensiveScore(chart, findPalace(chart, a.palaceId)),
    ])
  ) as Record<(typeof ASPECTS)[number]['key'], number>;

  const strengths = ASPECTS.filter((a) => aspectScores[a.key] >= 4).map(
    (a) => `${a.label} thuận lợi`
  );
  const challenges = ASPECTS.filter((a) => aspectScores[a.key] <= 2).map(
    (a) => `${a.label} cần chú ý`
  );

  return {
    career: aspectScores.career,
    wealth: aspectScores.wealth,
    love: aspectScores.love,
    health: aspectScores.health,
    strengths: strengths.length > 0 ? strengths : ['Chưa có điểm nổi bật rõ rệt'],
    challenges: challenges.length > 0 ? challenges : ['Không có điểm đặc biệt cần lưu ý'],
  };
}

function findPalace(chart: ZiweiChart, id: PalaceId): Palace | undefined {
  return chart.palaces.find((p) => p.id === id);
}

function formatMenh(chart: ZiweiChart): string {
  const menhPalace = findPalace(chart, 'menh');
  if (!menhPalace) return 'Không xác định';

  const majorStars = menhPalace.majorStars.map((s) => s.name).join(', ');
  return majorStars || 'Vô Chính Diệu';
}
