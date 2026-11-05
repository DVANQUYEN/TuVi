import type { VietnamRegion } from '../types/enums';

/** Tọa độ của một tỉnh thành Việt Nam. */
export interface ProvinceCoords {
  /** Mã tỉnh thành (2-3 ký tự). */
  id: string;
  /** Tên đầy đủ tiếng Việt. */
  name: string;
  /** Vùng miền lịch sử: `north` hoặc `south`. */
  region: VietnamRegion;
  /** Kinh độ (độ Đông). */
  longitude: number;
  /** Vĩ độ (độ Bắc). */
  latitude: number;
}

/**
 * Bảng tọa độ 63 tỉnh thành Việt Nam.
 * Nguồn tham khảo: Tổng cục Thống kê Việt Nam (tọa độ trung tâm hành chính).
 */
export const VIETNAM_PROVINCE_COORDS: readonly ProvinceCoords[] = [
  // Miền Bắc (28 đơn vị)
  { id: 'HN', name: 'Hà Nội', region: 'north', longitude: 105.8542, latitude: 21.0285 },
  { id: 'HP', name: 'Hải Phòng', region: 'north', longitude: 106.6881, latitude: 20.8449 },
  { id: 'HG', name: 'Hà Giang', region: 'north', longitude: 104.9833, latitude: 22.8333 },
  { id: 'CB', name: 'Cao Bằng', region: 'north', longitude: 106.75, latitude: 22.6667 },
  { id: 'LS', name: 'Lạng Sơn', region: 'north', longitude: 106.7333, latitude: 21.85 },
  { id: 'BG', name: 'Bắc Giang', region: 'north', longitude: 106.2, latitude: 21.2833 },
  { id: 'BK', name: 'Bắc Kạn', region: 'north', longitude: 105.8333, latitude: 22.15 },
  { id: 'TN', name: 'Thái Nguyên', region: 'north', longitude: 105.85, latitude: 21.6 },
  { id: 'TQ', name: 'Tuyên Quang', region: 'north', longitude: 105.2167, latitude: 21.8167 },
  { id: 'PT', name: 'Phú Thọ', region: 'north', longitude: 105.2167, latitude: 21.4 },
  { id: 'HB', name: 'Hòa Bình', region: 'north', longitude: 105.3333, latitude: 20.8 },
  { id: 'SL', name: 'Sơn La', region: 'north', longitude: 103.9, latitude: 21.3333 },
  { id: 'DB', name: 'Điện Biên', region: 'north', longitude: 103.0167, latitude: 21.3833 },
  { id: 'LCH', name: 'Lai Châu', region: 'north', longitude: 103.45, latitude: 22.4 },
  { id: 'LCA', name: 'Lào Cai', region: 'north', longitude: 103.9667, latitude: 22.5 },
  { id: 'YB', name: 'Yên Bái', region: 'north', longitude: 104.9167, latitude: 21.7167 },
  { id: 'HNA', name: 'Hà Nam', region: 'north', longitude: 105.9167, latitude: 20.55 },
  { id: 'ND', name: 'Nam Định', region: 'north', longitude: 106.1667, latitude: 20.4167 },
  { id: 'TB', name: 'Thái Bình', region: 'north', longitude: 106.3333, latitude: 20.45 },
  { id: 'HY', name: 'Hưng Yên', region: 'north', longitude: 106.0667, latitude: 20.65 },
  { id: 'HD', name: 'Hải Dương', region: 'north', longitude: 106.3167, latitude: 20.9333 },
  { id: 'BN', name: 'Bắc Ninh', region: 'north', longitude: 106.0833, latitude: 21.1833 },
  { id: 'VP', name: 'Vĩnh Phúc', region: 'north', longitude: 105.7167, latitude: 21.3167 },
  { id: 'QN', name: 'Quảng Ninh', region: 'north', longitude: 107.25, latitude: 21.0 },
  { id: 'NB', name: 'Ninh Bình', region: 'north', longitude: 105.975, latitude: 20.25 },
  { id: 'TH', name: 'Thanh Hóa', region: 'north', longitude: 105.7833, latitude: 19.8 },
  { id: 'NA', name: 'Nghệ An', region: 'north', longitude: 105.6, latitude: 18.6667 },
  { id: 'HT', name: 'Hà Tĩnh', region: 'north', longitude: 105.9, latitude: 18.3333 },

  // Miền Nam (35 đơn vị, bao gồm Trung Trung Bộ và Nam Bộ)
  { id: 'QB', name: 'Quảng Bình', region: 'south', longitude: 106.6, latitude: 17.4667 },
  { id: 'QTR', name: 'Quảng Trị', region: 'south', longitude: 107.1, latitude: 16.75 },
  { id: 'TTH', name: 'Thừa Thiên Huế', region: 'south', longitude: 107.5833, latitude: 16.4667 },
  { id: 'DNA', name: 'Đà Nẵng', region: 'south', longitude: 108.2208, latitude: 16.0471 },
  { id: 'QNA', name: 'Quảng Nam', region: 'south', longitude: 108.33, latitude: 15.8833 },
  { id: 'QNG', name: 'Quảng Ngãi', region: 'south', longitude: 108.8, latitude: 15.1167 },
  { id: 'BDI', name: 'Bình Định', region: 'south', longitude: 109.2167, latitude: 13.7833 },
  { id: 'PY', name: 'Phú Yên', region: 'south', longitude: 109.3, latitude: 13.0833 },
  { id: 'KH', name: 'Khánh Hòa', region: 'south', longitude: 109.1833, latitude: 12.25 },
  { id: 'NT', name: 'Ninh Thuận', region: 'south', longitude: 108.9833, latitude: 11.5667 },
  { id: 'BTH', name: 'Bình Thuận', region: 'south', longitude: 108.0667, latitude: 10.9333 },
  { id: 'KT', name: 'Kon Tum', region: 'south', longitude: 108.05, latitude: 14.35 },
  { id: 'GL', name: 'Gia Lai', region: 'south', longitude: 108.25, latitude: 13.7833 },
  { id: 'DLK', name: 'Đắk Lắk', region: 'south', longitude: 108.05, latitude: 12.6667 },
  { id: 'DNO', name: 'Đắk Nông', region: 'south', longitude: 107.6167, latitude: 12.0 },
  { id: 'LD', name: 'Lâm Đồng', region: 'south', longitude: 108.45, latitude: 11.9333 },
  { id: 'BRVT', name: 'Bà Rịa - Vũng Tàu', region: 'south', longitude: 107.0843, latitude: 10.348 },
  { id: 'BD', name: 'Bình Dương', region: 'south', longitude: 106.65, latitude: 11.1667 },
  { id: 'DNAI', name: 'Đồng Nai', region: 'south', longitude: 106.8333, latitude: 10.95 },
  { id: 'TNI', name: 'Tây Ninh', region: 'south', longitude: 106.1, latitude: 11.3167 },
  { id: 'BP', name: 'Bình Phước', region: 'south', longitude: 106.9167, latitude: 11.75 },
  { id: 'HCM', name: 'TP. Hồ Chí Minh', region: 'south', longitude: 106.6602, latitude: 10.7626 },
  { id: 'LA', name: 'Long An', region: 'south', longitude: 106.4167, latitude: 10.6667 },
  { id: 'DT', name: 'Đồng Tháp', region: 'south', longitude: 105.6333, latitude: 10.4667 },
  { id: 'TG', name: 'Tiền Giang', region: 'south', longitude: 106.3667, latitude: 10.35 },
  { id: 'AG', name: 'An Giang', region: 'south', longitude: 105.1167, latitude: 10.5 },
  { id: 'BT', name: 'Bến Tre', region: 'south', longitude: 106.3667, latitude: 10.2333 },
  { id: 'VL', name: 'Vĩnh Long', region: 'south', longitude: 105.9667, latitude: 10.25 },
  { id: 'TV', name: 'Trà Vinh', region: 'south', longitude: 106.3333, latitude: 9.9333 },
  { id: 'HGI', name: 'Hậu Giang', region: 'south', longitude: 105.7833, latitude: 9.7833 },
  { id: 'KG', name: 'Kiên Giang', region: 'south', longitude: 105.1667, latitude: 10.0167 },
  { id: 'ST', name: 'Sóc Trăng', region: 'south', longitude: 105.9667, latitude: 9.6 },
  { id: 'BL', name: 'Bạc Liêu', region: 'south', longitude: 105.7167, latitude: 9.2833 },
  { id: 'CM', name: 'Cà Mau', region: 'south', longitude: 105.15, latitude: 9.1833 },
  { id: 'CT', name: 'Cần Thơ', region: 'south', longitude: 105.7833, latitude: 10.0333 },
] as const;

/** Một khoảng thờ gian múi giờ lịch sử. */
export interface HistoricalTimezone {
  /** Năm bắt đầu áp dụng. */
  startYear: number;
  /** Năm kết thúc áp dụng. */
  endYear: number;
  /** Vùng miền áp dụng: `north`, `south` hoặc `all`. */
  region: VietnamRegion | 'all';
  /** Độ lệch UTC (ví dụ: 7, 7.5, 8). */
  utcOffset: number;
  /** Ghi chú nguồn gốc. */
  note: string;
}

/**
 * Lịch sử múi giờ Việt Nam.
 * Nguồn tham khảo: Hồ Ngọc Đức, Wikipedia "Giờ Việt Nam".
 */
export const VIETNAM_HISTORICAL_TIMEZONES: readonly HistoricalTimezone[] = [
  {
    startYear: 1906,
    endYear: 1911,
    region: 'all',
    utcOffset: 6.95,
    note: 'UTC+6:57:09 (Đông Dương)',
  },
  {
    startYear: 1911,
    endYear: 1942,
    region: 'all',
    utcOffset: 7,
    note: 'UTC+7 (Đông Dương theo giờ Pháp)',
  },
  {
    startYear: 1943,
    endYear: 1945,
    region: 'all',
    utcOffset: 8,
    note: 'UTC+8 (Chính quyền Vichy)',
  },
  { startYear: 1945, endYear: 1947, region: 'north', utcOffset: 7, note: 'UTC+7 (Hà Nội, VNDCCH)' },
  { startYear: 1955, endYear: 1960, region: 'south', utcOffset: 7, note: 'UTC+7 (Miền Nam)' },
  { startYear: 1960, endYear: 1975, region: 'south', utcOffset: 8, note: 'UTC+8 (Giờ Sài Gòn)' },
  {
    startYear: 1968,
    endYear: 1975,
    region: 'north',
    utcOffset: 7,
    note: 'UTC+7 (Miền Bắc từ 01/01/1968)',
  },
  { startYear: 1976, endYear: 2099, region: 'all', utcOffset: 7, note: 'UTC+7 (Toàn quốc)' },
] as const;

/**
 * Xác định múi giờ lịch sử tại một thờ điểm và vùng miền.
 *
 * @param year - Năm cần tra cứu.
 * @param region - Vùng miền `north` hoặc `south`.
 * @returns Độ lệch UTC tính bằng giờ, mặc định UTC+7 nếu không tìm thấy.
 */
export function resolveHistoricalUtcOffset(year: number, region: VietnamRegion): number {
  const entry = VIETNAM_HISTORICAL_TIMEZONES.find(
    (tz) =>
      year >= tz.startYear && year <= tz.endYear && (tz.region === 'all' || tz.region === region)
  );

  return entry?.utcOffset ?? 7;
}
