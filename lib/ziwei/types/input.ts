import type { VietnamRegion } from './enums';

/** Thông tin về địa điểm sinh, dùng cho múi giờ lịch sử và giờ mặt trờ thật. */
export interface BirthLocation {
  /** Mã tỉnh thành, ví dụ 'HN', 'HCM'. */
  provinceId?: string;
  /** Tên tỉnh thành, ví dụ 'Hà Nội', 'TP. Hồ Chí Minh'. */
  provinceName?: string;
  /** Vùng miền lịch sử ('north' | 'south'). */
  region: VietnamRegion;
  /** Kinh độ địa lý, nằm trong khoảng 102.0 - 110.0. */
  longitude: number;
  /** Vĩ độ địa lý, nằm trong khoảng 8.0 - 24.0. */
  latitude?: number;
}

/** Thông tin đầu vào để sinh lá số Tử Vi. */
export interface BirthInfo {
  /** Họ tên đương số. */
  name?: string;
  /** Giới tính: 'nam' hoặc 'nu'. */
  gender: 'nam' | 'nu';
  /** Loại lịch nhập vào: 'solar' (dương lịch) hoặc 'lunar' (âm lịch). */
  calendarType: 'solar' | 'lunar';
  /** Năm sinh, nằm trong khoảng 1900 - 2099. */
  year: number;
  /** Tháng sinh, từ 1 đến 12. */
  month: number;
  /** Ngày sinh. Dương lịch: 1 - 31, Âm lịch: 1 - 30. */
  day: number;
  /** Cờ tháng nhuận, chỉ có ý nghĩa khi nhập âm lịch. */
  isLeapMonthInput?: boolean;
  /** Giờ sinh theo 24h, từ 0 đến 23. */
  hour: number;
  /** Phút sinh, từ 0 đến 59. */
  minute: number;
  /** Nơi sinh. Mặc định sẽ là Hà Nội nếu không cung cấp. */
  location?: BirthLocation;
  /** Năm xem Tiểu Hạn/Lưu Niên. Mặc định là năm hiện tại. */
  viewingYear?: number;
}
