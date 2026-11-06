import { Card } from '@/components/ui/Card';
import { TinhDuyenEmblem, type LoveEmblemPhase } from './TinhDuyenEmblem';
import type { LoveEmblemPersonPreview } from './emblem-preview';

export interface LoveEmblemPanelProps {
  previews: [LoveEmblemPersonPreview, LoveEmblemPersonPreview];
  phase: LoveEmblemPhase;
  animate: boolean;
  /** Mã các sao chính tại Mệnh, Thân hoặc Phu Thê của hai lá số. */
  activeStarIds: ReadonlySet<string>;
}

/**
 * Khung trái của trang Tình Duyên: huy hiệu sống theo dữ liệu đang nhập và
 * phần tiêu đề giới thiệu. Toàn bộ nội dung nằm trong cây client để huy hiệu
 * chia sẻ state với biểu mẫu bên phải.
 */
export function LoveEmblemPanel({
  previews,
  phase,
  animate,
  activeStarIds,
}: LoveEmblemPanelProps): React.ReactElement {
  return (
    <aside aria-label="Thiên Bàn Tử Vi" className="min-w-0 lg:sticky lg:top-24">
      <Card variant="ancient-ember" className="overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            aria-hidden="true"
          >
            <g
              stroke="#d4af37"
              strokeOpacity="0.11"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M-20 86c22-26 52-34 78-16 14-18 42-20 59-3 20-5 34 8 32 25" />
              <path d="M6 64c7-9 19-11 27-4M58 60c7-8 17-8 23-2" />
              <path d="M318 300c-20-22-48-25-68-8-12-14-36-15-49-2-16-4-28 8-26 21" />
              <path d="M352 268c-8-9-20-10-29-4M300 273c-7-7-17-8-24-3" />
              <path d="M286 76c16-18 40-22 57-9 10-11 30-12 42-2" />
              <path d="M60 330c14-16 36-20 53-10 12-12 33-12 45-1" />
            </g>
          </svg>
        </div>

        <div className="relative">
          <TinhDuyenEmblem
            personPreviews={previews}
            phase={phase}
            animate={animate}
            activeStarIds={activeStarIds}
          />

          <div className="mt-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#f0d089]/80">
              Thiên Bàn Tử Vi
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
