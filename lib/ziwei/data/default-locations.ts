import type { BirthLocation, VietnamRegion } from '../types';

/**
 * Vị trí mặc định khi người dùng chỉ chọn vùng miền.
 * Dùng chung cho các biểu mẫu lập lá số để tránh lặp cấu hình.
 */
export const DEFAULT_LOCATION: Readonly<Record<VietnamRegion, BirthLocation>> = {
  north: {
    region: 'north',
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
  south: {
    region: 'south',
    longitude: 106.6602,
    provinceId: 'HCM',
    provinceName: 'TP.HCM',
  },
};
