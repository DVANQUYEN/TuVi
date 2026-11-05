import { describe, it, expect } from 'vitest';
import { createChartEngine } from '../../engine/sao-menh.engine';
import { ZiweiInterpreter } from '../interpreter';
import { interpretPalaceSpecificContent } from '../palace-meanings';
import type { PalaceId } from '../../types/enums';
import type { BirthInfo } from '../../types/input';

const BIRTH_INFO: BirthInfo = {
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  location: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

const EXPECTED_FIELDS: Readonly<Record<PalaceId, readonly string[]>> = {
  menh: ['overview', 'personality', 'character', 'destiny', 'challenges', 'advice'],
  taiBach: ['overview', 'income', 'wealth', 'challenges', 'advice'],
  quanLoc: ['overview', 'career', 'profession', 'challenges', 'advice'],
  thienDi: ['overview', 'travel', 'migration', 'challenges', 'advice'],
  phuThe: ['overview', 'spouse', 'marriage', 'challenges', 'advice'],
  tuTuc: ['overview', 'children', 'offspring', 'challenges', 'advice'],
  tatAch: ['overview', 'health', 'illness', 'challenges', 'advice'],
  noBoc: ['overview', 'friends', 'social', 'challenges', 'advice'],
  dienTrach: ['overview', 'property', 'realEstate', 'challenges', 'advice'],
  phucDuc: ['overview', 'fortune', 'ancestors', 'challenges', 'advice'],
  phuMau: ['overview', 'parents', 'family', 'challenges', 'advice'],
  huynhDe: ['overview', 'siblings', 'brothers', 'challenges', 'advice'],
};

describe('Nội dung luận giải riêng theo loại cung', () => {
  const chart = createChartEngine().generateChart(BIRTH_INFO);
  const interpretation = new ZiweiInterpreter().interpret(chart);

  it('mỗi cung chỉ chứa các khía cạnh đúng với ý nghĩa của cung', () => {
    for (const palace of chart.palaces) {
      const content = interpretPalaceSpecificContent(palace);

      expect(Object.keys(content).sort(), palace.id).toEqual(
        [...EXPECTED_FIELDS[palace.id]].sort()
      );

      for (const [key, value] of Object.entries(content)) {
        expect(typeof value, `${palace.id}/${key}`).toBe('string');
        expect((value as string).length, `${palace.id}/${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('gắn specificContent vào kết quả luận giải toàn bộ lá số', () => {
    for (const palace of interpretation.palaces) {
      expect(palace.specificContent).toBeDefined();
      expect(palace.specificContent).toEqual(palace.content);
    }
  });
});
