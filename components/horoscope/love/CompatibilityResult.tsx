import type { RefObject } from 'react';
import { Button } from '@/components/ui/Button';
import type {
  CompatibilityAspectKey,
  CompatibilityResult as CompatibilityResultData,
} from '@/lib/ziwei/compatibility';

const ASPECT_LABELS: Record<CompatibilityAspectKey, string> = {
  foundation: 'Nền tảng bản mệnh',
  marriagePalace: 'Cung Phu Thê',
  starSynergy: 'Tương hợp tinh tú',
  canChi: 'Can Chi bốn trụ',
  crossPalace: 'Tương tác cung vị',
};

/** Điểm khía cạnh trên thang 10: tối đa một chữ số thập phân, bỏ đuôi ".0". */
function formatAspectScore(score: number): string {
  const rounded = Math.round(score * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export interface CompatibilityResultProps {
  result: CompatibilityResultData;
  headingId: string;
  strengthsHeadingId: string;
  challengesHeadingId: string;
  sectionRef: RefObject<HTMLElement | null>;
  onReset: () => void;
}

/**
 * Panel kết quả đặt ở cột phải sau khi huy hiệu hoàn tất hiệu ứng gộp.
 * Các test id chính được giữ cho hợp đồng hiển thị hiện tại; nhãn khía cạnh đã
 * chuyển sang mô hình năm khía cạnh thay vì bốn khía cạnh cũ.
 */
export function CompatibilityResult({
  result,
  headingId,
  strengthsHeadingId,
  challengesHeadingId,
  sectionRef,
  onReset,
}: CompatibilityResultProps): React.ReactElement {
  const adviceHeadingId = `${headingId}-advice`;
  const aspectKeys = Object.keys(ASPECT_LABELS) as CompatibilityAspectKey[];

  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      data-testid="compatibility-result"
      aria-labelledby={headingId}
      className="scroll-mt-24 rounded-xl border border-gold/35 bg-linear-to-b from-surface to-background p-5 shadow-[0_0_28px_rgba(212,175,55,0.12)] focus:outline-none focus:ring-2 focus:ring-gold focus-visible:ring-2 focus-visible:ring-gold sm:p-7 lg:h-[calc(100svh_-_8rem)] lg:overflow-y-auto"
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-gold/75">
          {result.dataQuality === 'partial' ? 'Kết quả tham khảo' : 'Kết quả luận giải'}
        </p>
        <h2 id={headingId} className="mt-2 font-serif text-3xl font-semibold text-gold">
          Duyên phận đôi lứa
        </h2>
        <div
          data-testid="compatibility-score"
          role="img"
          aria-label={`Điểm hợp nhau ${result.score} trên 100`}
          className="mx-auto mt-4 flex h-28 w-28 flex-col items-center justify-center rounded-full border-2 border-gold/50 bg-gold/10 text-center shadow-[0_0_24px_rgba(212,175,55,0.18)] sm:h-32 sm:w-32"
        >
          <p className="font-serif text-3xl font-semibold leading-none text-gold sm:text-4xl">
            {result.score}/100
          </p>
          <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold/80 sm:text-xs">
            Điểm hợp nhau
          </p>
        </div>
        <p
          data-testid="compatibility-conclusion"
          data-tone={result.conclusion.tone}
          className="mx-auto mt-3 max-w-md text-balance font-serif text-lg font-semibold italic leading-relaxed text-gold-bright sm:text-xl"
        >
          “{result.conclusion.quote}”
        </p>
      </div>

      {result.dataQuality === 'partial' && (
        <div
          data-testid="compatibility-data-quality"
          role="status"
          className="mt-5 rounded-lg border border-mutagen-quyen/30 bg-mutagen-quyen/5 p-4 text-left text-sm text-muted"
        >
          <p className="font-semibold text-mutagen-quyen">Dữ liệu chưa đầy đủ</p>
          <p className="mt-1 leading-relaxed">
            Kết quả dưới đây chỉ nên được đọc như mô hình tham chiếu. Các phần còn thiếu có thể
            làm điểm số lệch khỏi lá số thực tế; không nên xem đây là kết luận chắc chắn.
          </p>
          {result.dataWarnings.length > 0 && (
            <ul className="mt-2 list-inside list-disc space-y-1">
              {result.dataWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {aspectKeys.map((key) => {
          const aspect = result.aspects[key];
          return (
            <li key={key} className="rounded-lg border border-border-subtle bg-background/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-lg font-semibold text-gold">{ASPECT_LABELS[key]}</h3>
                <span
                  data-testid={`compatibility-aspect-${key}`}
                  role="img"
                  aria-label={`${ASPECT_LABELS[key]}: ${formatAspectScore(aspect.score)}/10`}
                  className="shrink-0 font-mono text-sm font-semibold tabular-nums text-gold"
                >
                  {formatAspectScore(aspect.score)}/10
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">{aspect.meaning}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {aspect.explanation}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-gold">Lời khuyên: </span>
                {aspect.tip}
              </p>
            </li>
          );
        })}
      </ul>

      <section
        aria-labelledby={adviceHeadingId}
        className="mt-6 rounded-lg border border-border-subtle bg-background/40 p-4"
      >
        <h3 id={adviceHeadingId} className="mb-2 font-serif text-lg font-semibold text-gold">
          Lời khuyên chung
        </h3>
        <p className="text-sm leading-relaxed text-muted">{result.advice}</p>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <section
          className="rounded-lg border border-mutagen-loc/30 bg-mutagen-loc/5 p-4"
          aria-labelledby={strengthsHeadingId}
        >
          <h3 id={strengthsHeadingId} className="mb-2 font-serif text-lg font-semibold text-mutagen-loc">
            Điểm hòa hợp
          </h3>
          {result.strengths.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-sm text-muted">
              {result.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Chưa có điểm nổi bật được ghi nhận.</p>
          )}
        </section>

        <section
          className="rounded-lg border border-mutagen-quyen/30 bg-mutagen-quyen/5 p-4"
          aria-labelledby={challengesHeadingId}
        >
          <h3
            id={challengesHeadingId}
            className="mb-2 font-serif text-lg font-semibold text-mutagen-quyen"
          >
            Điều cần lưu tâm
          </h3>
          {result.challenges.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 text-sm text-muted">
              {result.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Không có điều gì đáng ngại được ghi nhận.</p>
          )}
        </section>
      </div>

      <details
        data-testid="compatibility-method"
        className="mt-6 rounded-lg border border-border-subtle bg-background/40 p-4"
      >
        <summary className="cursor-pointer font-serif text-lg font-semibold text-gold">
          Cơ sở luận giải
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
          <p>
            Mô hình tham chiếu phiên bản {result.method.version}. Điểm tổng là tổng có trọng số của
            năm khía cạnh, mỗi khía cạnh chấm trên thang điểm 10 rồi nhân 10.
          </p>
          <ul className="list-inside list-disc space-y-1">
            {aspectKeys.map((key) => (
              <li key={key}>
                <span className="text-foreground">{ASPECT_LABELS[key]}: </span>
                {Math.round(result.method.weights[key] * 100)}%
              </li>
            ))}
          </ul>
          <p>
            Các khía cạnh có phần chồng lấn: sao tại cung Phu Thê cũng góp phần vào Tương hợp tinh
            tú và Tương tác cung vị. Khía cạnh Cung Phu Thê phản ánh chất lượng nền duyên hôn nhân
            của mỗi người, không phải một phép đo thuần túy cặp đôi.
          </p>
          <p>
            Trọng số mang tính biên soạn, không phải quy định cổ điển. Phần thời vận được tính theo
            lá số thứ nhất, chỉ mang tính tham khảo và không nằm trong tỷ lệ tương hợp.
          </p>
          <p>{result.method.caveat}</p>
        </div>
      </details>

      <div className="mt-6 flex justify-center">
        <Button type="button" variant="secondary" onClick={onReset}>
          Chỉnh sửa thông tin
        </Button>
      </div>
    </section>
  );
}
