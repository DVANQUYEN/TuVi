import { describe, it, expect } from 'vitest';
import { NAP_AM_60, NAP_AM_MEANINGS, getNapAmMeaning } from '../stems-branches';

/** Tên Nạp Âm là phần sau dấu " - " trong từng cặp Can Chi - Nạp Âm. */
function extractNapAmName(pair: string): string {
  const [, name] = pair.split(' - ');
  expect(name, `cặp Nạp Âm không đúng định dạng: "${pair}"`).toBeTruthy();
  return name;
}

describe('NAP_AM_MEANINGS', () => {
  it('có giải nghĩa cho mọi tên Nạp Âm duy nhất trong NAP_AM_60', () => {
    const names = NAP_AM_60.map(extractNapAmName);
    const uniqueNames = [...new Set(names)];

    expect(uniqueNames).toHaveLength(30);
    for (const name of uniqueNames) {
      const meaning = NAP_AM_MEANINGS[name];
      expect(meaning, `thiếu giải nghĩa cho "${name}"`).toBeTruthy();
      expect(meaning.trim().length, `giải nghĩa rỗng cho "${name}"`).toBeGreaterThan(0);
    }
  });

  it('tra cứu đúng một số nghĩa tiêu biểu', () => {
    expect(getNapAmMeaning('Hải Trung Kim')).toBe('vàng dưới biển');
    expect(getNapAmMeaning('Kiếm Phong Kim')).toBe('vàng đầu mũi kiếm');
  });

  it('trả về chuỗi rỗng cho tên không có trong bảng', () => {
    expect(getNapAmMeaning('Không Tồn Tại')).toBe('');
  });
});
