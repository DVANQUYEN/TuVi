import type { ZiweiConfig } from '../types/config';
import type { BrightnessLevel } from '../types/enums';

/**
 * Cấu hình mặc định cho engine Tử Vi Sao Mệnh
 * Dựa trên 7 quyết định đã duyệt (xem docs/FINAL-DECISIONS.md)
 */
export const defaultZiweiConfig: ZiweiConfig = {
  // 1. Trường phái: Nam phái (mặc định)
  school: {
    default: 'namPhai',
    options: ['namPhai', 'trungChau', 'bacPhai'] as const,
    supportedInMvp: ['namPhai', 'trungChau'] as const,
    displayOnResult: true,
  },

  // 2. Giờ Tý: 23:00 = ngày hôm sau
  dayBoundary: {
    default: '23:00',
    options: ['23:00', '00:00'] as const,
    showOnlyWhen: '23:00-01:00',
    source: 'lasotuvi.ai.vn, Vienaoc - Phổ biến trong Tử Vi Việt Nam',
  },

  // 3. Tháng nhuận: Chia đôi 15/15
  leapMonth: {
    default: 'split15',
    options: ['split15', 'baseMonth', 'nextMonth'] as const,
    showWarning: true,
    source: 'Vienaoc, OpenFate - Phổ biến nhất',
  },

  // 4. Năm Can Chi: Mùng 1 Tết
  yearBoundary: {
    default: 'tet',
    options: ['tet', 'lapXuan'] as const,
    source: 'Tử Vi Đẩu Số Tân Biên, Vienaoc',
  },

  // 5. Tuần/Triệt: Không phân biệt chính/phó
  tuanTriet: {
    display: 'bothPalaces',
    primary: 'none',
    options: {
      primary: ['none', 'first', 'nearMenh'] as const,
    },
    source: 'Đang nghiên cứu thêm - mặc định không phân biệt',
  },

  // 6. Độ sáng: Bảng Tân Biên 1956 (5 mức)
  brightness: {
    dataLevels: 5,
    displayLevels: 5,
    fallbackMapping7To5: {
      Miếu: 'mieu',
      Vượng: 'vuong',
      Đắc: 'dac',
      Lợi: 'dac', // Quyết định: Lợi → Đắc
      Bình: 'binh',
      Bất: 'ham', // Quyết định: Bất → Hãm
      Hãm: 'ham',
    } as Readonly<Record<string, BrightnessLevel>>,
    useVietnameseTable: true,
    vietnameseTableSource:
      'Tử Vi Đẩu Số Tân Biên, Vân Đằng Thái Thứ Lang, NXB Sài Gòn 1956, tr. 33-38',
  },

  // 7. Giờ mặt trờ thật: Mặc định TẮT
  trueSolarTime: {
    default: false,
    showInAdvanced: true,
    displayCorrection: true,
    standardMeridian: 105, // Kinh tuyến chuẩn Việt Nam (105°E)
    source: 'lasotuvi.ai.vn, OpenFate - Mặc định tắt cho Tử Vi',
  },
} as const;
