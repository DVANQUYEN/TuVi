import { describe, it, expect } from 'vitest';
import { generatePersonalSummary } from '../personal-summary';
import type { ZiweiChart } from '../../types';
import { createChartEngine } from '@/lib/ziwei/engine';
import { getBranchLabel } from '@/lib/chart/display-helpers';

const STAR_CASES = [
  ['Tử Vi', 'Bạn là người lãnh đạo bẩm sinh'],
  ['Thiên Phủ', 'Bạn là người ổn định, đáng tin cậy'],
  ['Thái Dương', 'Bạn là người nhiệt tình, tràn đầy năng lượng'],
  ['Thái Âm', 'Bạn là người nhạy cảm, giàu tình cảm'],
  ['Vũ Khúc', 'Bạn là người thực tế, giỏi quản lý tài chính'],
  ['Liêm Trinh', 'Bạn là người chính trực, có nguyên tắc'],
  ['Tham Lang', 'Bạn là người tài năng, có sức hút'],
  ['Cự Môn', 'Bạn là người thẳng thắn, có tài phân tích'],
  ['Thiên Cơ', 'Bạn là người thông minh, có trí tuệ'],
  ['Thiên Đồng', 'Bạn là người hiền lành, tốt bụng'],
  ['Thiên Tướng', 'Bạn là người có trách nhiệm, đáng tin cậy'],
  ['Thiên Lương', 'Bạn là người thiện lương, có phúc đức'],
  ['Thất Sát', 'Bạn là người mạnh mẽ, quyết đoán'],
  ['Phá Quân', 'Bạn là người sáng tạo, không ngại thay đổi'],
] as const;

function makeChart(starNames: readonly string[]): ZiweiChart {
  return {
    palaces: [
      {
        id: 'menh',
        branch: 'ty',
        majorStars: starNames.map((name) => ({ name })),
        auspiciousStars: [],
        maleficStars: [],
        otherStars: [],
        hasTuan: false,
        hasTriet: false,
      },
    ],
  } as unknown as ZiweiChart;
}

describe('generatePersonalSummary', () => {
  it.each(STAR_CASES)('tạo kết luận phù hợp cho %s', (starName, expectedHeadline) => {
    const summary = generatePersonalSummary(makeChart([starName]));

    expect(summary.headline).toBe(expectedHeadline);
    expect(summary.description.length).toBeGreaterThan(0);
    expect(summary.keyTraits.length).toBeGreaterThanOrEqual(3);
    expect(summary.keyTraits.length).toBeLessThanOrEqual(5);
    expect(summary.lifePath.length).toBeGreaterThan(0);
  });

  it('dùng kết luận mặc định khi cung Mệnh Vô Chính Diệu', () => {
    const summary = generatePersonalSummary(makeChart([]));

    expect(summary.headline).toBe('Bạn là người linh hoạt, dễ thích nghi');
    expect(summary.keyTraits).toHaveLength(4);
  });

  it('dùng kết luận mặc định khi không xác định được chính tinh', () => {
    const summary = generatePersonalSummary(makeChart(['Sao Không Xác Định']));

    expect(summary.headline).toBe('Bạn là người linh hoạt, dễ thích nghi');
    expect(summary.lifePath).toBe('Đa dạng, phụ thuộc vào nỗ lực bản thân');
  });
});

describe('generatePersonalSummary - luận giải chi tiết', () => {
  const chart = createChartEngine().generateChart({
    name: 'Đương số kiểm thử',
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
    location: { region: 'north', longitude: 105.8542, provinceId: 'HN', provinceName: 'Hà Nội' },
  });

  it('có đủ các đoạn luận giải và tên đương số', () => {
    const summary = generatePersonalSummary(chart);

    expect(summary.ownerName).toBe('Đương số kiểm thử');
    expect(summary.introParagraph).toContain(chart.heavenPlate.napAm.name);
    expect(summary.introParagraph).toContain(chart.heavenPlate.yinYangGenderLabel);
    const menh = chart.palaces.find((p) => p.id === 'menh');
    expect(menh).toBeDefined();
    expect(summary.menhStarParagraph).toContain(getBranchLabel(menh?.branch ?? 'ty'));
    expect(summary.tamHopAndThanParagraph).toContain(
      getBranchLabel(chart.heavenPlate.bodyPalaceBranch)
    );
    expect(summary.conclusionParagraph).toContain(summary.description);
  });
});
