'use client';

import { useState } from 'react';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { PalaceId, BrightnessLevel } from '@/lib/ziwei/types/enums';
import type {
  PalaceInterpretation,
  PalaceContent,
  MajorStarInterpretation,
  MinorStarImpact,
} from '@/lib/ziwei/interpretation/types';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface PalaceInterpretationListProps {
  chart: ZiweiChart;
  interpretations: PalaceInterpretation[];
}

const BRIGHTNESS_LABELS: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu',
  vuong: 'Vượng',
  dac: 'Đắc',
  binh: 'Bình',
  ham: 'Hãm',
};

const IMPACT_LABELS: Readonly<Record<MinorStarImpact, string>> = {
  tốt: 'Thuận lợi',
  xấu: 'Biến động',
  'trung bình': 'Ổn định',
};

const CONTENT_SECTIONS: ReadonlyArray<{
  key: keyof PalaceContent;
  han: string;
  title: string;
}> = [
  { key: 'personality', han: '命', title: 'Tính cách' },
  { key: 'character', han: '運', title: 'Điểm mạnh' },
  { key: 'destiny', han: '福', title: 'Số mệnh' },
  { key: 'income', han: '財', title: 'Thu nhập' },
  { key: 'wealth', han: '旺', title: 'Tài lộc' },
  { key: 'career', han: '官', title: 'Công việc' },
  { key: 'profession', han: '禄', title: 'Nghề nghiệp' },
  { key: 'travel', han: '遷', title: 'Di chuyển' },
  { key: 'migration', han: '外', title: 'Xuất ngoại' },
  { key: 'spouse', han: '配', title: 'Người phối ngẫu' },
  { key: 'marriage', han: '婚', title: 'Hôn nhân' },
  { key: 'children', han: '子', title: 'Con cái' },
  { key: 'offspring', han: '學', title: 'Học hành của con' },
  { key: 'health', han: '疾', title: 'Sức khỏe' },
  { key: 'illness', han: '患', title: 'Bệnh cần chú ý' },
  { key: 'friends', han: '友', title: 'Bạn bè' },
  { key: 'social', han: '交', title: 'Quan hệ xã hội' },
  { key: 'property', han: '田', title: 'Nhà cửa' },
  { key: 'realEstate', han: '產', title: 'Bất động sản' },
  { key: 'fortune', han: '德', title: 'Phúc đức' },
  { key: 'ancestors', han: '先', title: 'Tổ tiên' },
  { key: 'parents', han: '親', title: 'Cha mẹ' },
  { key: 'family', han: '家', title: 'Gia đình' },
  { key: 'siblings', han: '兄', title: 'Anh chị em' },
  { key: 'brothers', han: '弟', title: 'Quan hệ anh em' },
];

export function PalaceInterpretationList({
  chart,
  interpretations,
}: PalaceInterpretationListProps): React.ReactElement {
  const [openPalace, setOpenPalace] = useState<PalaceId | null>('menh');

  return (
    <section
      aria-labelledby="palace-interpretation-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="palace-interpretation-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="解" size="lg" />
        <span>Luận giải 12 cung</span>
      </h2>

      <div className="space-y-2">
        {interpretations.map((interp) => {
          const palace = chart.palaces.find((p) => p.id === interp.palaceId);
          if (!palace) return null;

          const isOpen = openPalace === interp.palaceId;
          const panelId = `palace-panel-${interp.palaceId}`;
          const buttonId = `palace-button-${interp.palaceId}`;
          const specificContent = interp.specificContent ?? interp.content;

          return (
            <div
              key={interp.palaceId}
              className="overflow-hidden rounded border border-border-subtle"
            >
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenPalace(isOpen ? null : interp.palaceId)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-elevated focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{palace.name}</span>
                    {palace.isBodyPalace && (
                      <span className="rounded bg-gold px-2 py-0.5 text-xs text-background">
                        THÂN
                      </span>
                    )}
                    {interp.isEmpty && (
                      <span className="text-xs text-muted italic">Vô Chính Diệu</span>
                    )}
                  </span>
                  <span className="text-muted" aria-hidden="true">
                    {isOpen ? '▼' : '▶'}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="space-y-4 border-t border-border-subtle px-4 py-4"
                >
                  {/* Chính tinh */}
                  {interp.majorStars.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-semibold">Chính tinh</h4>
                      <div className="space-y-2">
                        {interp.majorStars.map((star) => (
                          <div key={star.starId} className="rounded bg-elevated p-3">
                            <div className="mb-1 font-medium">
                              {getStarName(palace, star)} ({BRIGHTNESS_LABELS[star.brightness]})
                            </div>
                            <p className="text-sm leading-relaxed">{star.content.meaning}</p>
                            {star.affected && star.description && (
                              <div className="mt-2 rounded bg-orange-500/10 px-2 py-1 text-xs text-orange-600">
                                <HanIcon han="厄" size="sm" className="mr-1" />
                                {star.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phụ tinh */}
                  {interp.minorStars.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <HanIcon han="運" size="sm" />
                        <span>Phụ tinh</span>
                      </h4>
                      <div className="space-y-2">
                        {interp.minorStars.map((star, index) => (
                          <div
                            key={`${star.starId}-${index}`}
                            className="rounded bg-elevated p-2 text-sm"
                          >
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-medium">{star.name ?? star.starId}</span>
                              {star.impact && (
                                <span
                                  className={`rounded px-2 py-0.5 text-xs ${getImpactClassName(star.impact)}`}
                                >
                                  {IMPACT_LABELS[star.impact]}
                                </span>
                              )}
                            </div>
                            <p className="mb-1 text-xs leading-relaxed text-muted">
                              {star.description ?? star.meaning}
                            </p>
                            {star.advice && (
                              <p className="flex items-start gap-1 text-xs leading-relaxed italic">
                                <HanIcon han="吉" size="sm" />
                                <span>{star.advice}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bộ sao */}
                  {interp.starGroups && interp.starGroups.length > 0 && (
                    <div className="border-t border-border-subtle pt-4">
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <HanIcon han="星" size="sm" />
                        <span>Bộ sao</span>
                      </h4>
                      <div className="space-y-2">
                        {interp.starGroups.map((group) => (
                          <div key={group.id} className="rounded bg-elevated p-3">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-medium">{group.name}</span>
                              <span
                                className={`rounded px-2 py-0.5 text-xs ${getImpactClassName(group.level)}`}
                              >
                                {IMPACT_LABELS[group.level]}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{group.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {specificContent && (
                    <div className="space-y-4 border-t border-border-subtle pt-4">
                      <div className="rounded bg-elevated p-3">
                        <p className="text-sm leading-relaxed italic">{specificContent.overview}</p>
                      </div>

                      {CONTENT_SECTIONS.map(({ key, han, title }) => {
                        const value = specificContent[key];
                        return typeof value === 'string' && value.length > 0 ? (
                          <Section key={key} han={han} title={title} content={value} />
                        ) : null;
                      })}

                      {specificContent.challenges && (
                        <Section
                          han="厄"
                          title="Thách thức"
                          content={specificContent.challenges}
                          warning
                        />
                      )}
                      {specificContent.advice && (
                        <Section
                          han="吉"
                          title="Lời khuyên"
                          content={specificContent.advice}
                          highlight
                        />
                      )}
                    </div>
                  )}

                  {/* Tam phương tứ chính */}
                  {interp.tamPhuong && interp.tamPhuong.palaces.length > 0 && (
                    <div className="border-t border-border-subtle pt-4">
                      <h4 className="mb-2 flex items-center gap-2 font-semibold">
                        <HanIcon han="三" size="sm" />
                        <span>Tam phương Tứ chính</span>
                      </h4>
                      <div className="mb-3 space-y-2">
                        {interp.tamPhuong.palaces.map((relatedPalace) => (
                          <div key={relatedPalace.id} className="rounded bg-elevated p-2 text-sm">
                            <span className="font-medium">{relatedPalace.name}:</span>{' '}
                            <span className="text-muted">{relatedPalace.analysis}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed italic">{interp.tamPhuong.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Section({
  han,
  title,
  content,
  highlight,
  warning,
}: {
  han?: string;
  title: string;
  content: string;
  highlight?: boolean;
  warning?: boolean;
}): React.ReactElement {
  const className = highlight
    ? 'rounded bg-gold/10 p-3'
    : warning
      ? 'rounded bg-yellow-500/10 p-3'
      : '';

  return (
    <div className={className}>
      <h4 className="mb-1 flex items-center gap-2 font-semibold">
        {han && <HanIcon han={han} size="sm" />}
        <span>{title}</span>
      </h4>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function getStarName(palace: Palace, star: MajorStarInterpretation): string {
  return palace.majorStars.find((s) => s.id === star.starId)?.name ?? star.starId;
}

function getImpactClassName(impact: MinorStarImpact): string {
  switch (impact) {
    case 'tốt':
      return 'bg-green-500/20 text-green-600';
    case 'xấu':
      return 'bg-red-500/20 text-red-600';
    default:
      return 'bg-yellow-500/20 text-yellow-600';
  }
}
