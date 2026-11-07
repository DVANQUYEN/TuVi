import type { HeavenlyStem, EarthlyBranch, FiveElement } from '../types/enums';

/** Dữ liệu một Thiên Can gồm Can, Ngũ hành và Âm Dương. */
export interface HeavenlyStemData {
  stem: HeavenlyStem;
  element: FiveElement;
  yinYang: 'am' | 'duong';
}

/** Dữ liệu một Địa Chi gồm Chi, Ngũ hành và Âm Dương. */
export interface EarthlyBranchData {
  branch: EarthlyBranch;
  element: FiveElement;
  yinYang: 'am' | 'duong';
}

/**
 * 10 Thiên Can với Ngũ hành và Âm Dương.
 */
export const HEAVENLY_STEMS_DATA: readonly HeavenlyStemData[] = [
  { stem: 'giap', element: 'moc', yinYang: 'duong' },
  { stem: 'at', element: 'moc', yinYang: 'am' },
  { stem: 'binh', element: 'hoa', yinYang: 'duong' },
  { stem: 'dinh', element: 'hoa', yinYang: 'am' },
  { stem: 'mau', element: 'tho', yinYang: 'duong' },
  { stem: 'ky', element: 'tho', yinYang: 'am' },
  { stem: 'canh', element: 'kim', yinYang: 'duong' },
  { stem: 'tan', element: 'kim', yinYang: 'am' },
  { stem: 'nham', element: 'thuy', yinYang: 'duong' },
  { stem: 'quy', element: 'thuy', yinYang: 'am' },
] as const;

/**
 * 12 Địa Chi với Ngũ hành và Âm Dương.
 */
export const EARTHLY_BRANCHES_DATA: readonly EarthlyBranchData[] = [
  { branch: 'ty', element: 'thuy', yinYang: 'duong' },
  { branch: 'suu', element: 'tho', yinYang: 'am' },
  { branch: 'dan', element: 'moc', yinYang: 'duong' },
  { branch: 'mao', element: 'moc', yinYang: 'am' },
  { branch: 'thin', element: 'tho', yinYang: 'duong' },
  { branch: 'ti', element: 'hoa', yinYang: 'am' },
  { branch: 'ngo', element: 'hoa', yinYang: 'duong' },
  { branch: 'mui', element: 'tho', yinYang: 'am' },
  { branch: 'than', element: 'kim', yinYang: 'duong' },
  { branch: 'dau', element: 'kim', yinYang: 'am' },
  { branch: 'tuat', element: 'tho', yinYang: 'duong' },
  { branch: 'hoi', element: 'thuy', yinYang: 'am' },
] as const;

/**
 * Nạp Âm 60 Hoa Giáp (10 Can × 12 Chi).
 * Dùng để tính Bản Mệnh Ngũ Hành.
 */
export const NAP_AM_60: readonly string[] = [
  'Giáp Tý - Hải Trung Kim',
  'Ất Sửu - Hải Trung Kim',
  'Bính Dần - Lư Trung Hỏa',
  'Đinh Mão - Lư Trung Hỏa',
  'Mậu Thìn - Đại Lâm Mộc',
  'Kỷ Tỵ - Đại Lâm Mộc',
  'Canh Ngọ - Lộ Bàng Thổ',
  'Tân Mùi - Lộ Bàng Thổ',
  'Nhâm Thân - Kiếm Phong Kim',
  'Quý Dậu - Kiếm Phong Kim',
  'Giáp Tuất - Sơn Đầu Hỏa',
  'Ất Hợi - Sơn Đầu Hỏa',
  'Bính Tý - Giải Hạ Thủy',
  'Đinh Sửu - Giải Hạ Thủy',
  'Mậu Dần - Thành Đầu Thổ',
  'Kỷ Mão - Thành Đầu Thổ',
  'Canh Thìn - Bạch Lạp Kim',
  'Tân Tỵ - Bạch Lạp Kim',
  'Nhâm Ngọ - Dương Liễu Mộc',
  'Quý Mùi - Dương Liễu Mộc',
  'Giáp Thân - Tuyền Trung Thủy',
  'Ất Dậu - Tuyền Trung Thủy',
  'Bính Tuất - Ốc Thượng Thổ',
  'Đinh Hợi - Ốc Thượng Thổ',
  'Mậu Tý - Tích Lịch Hỏa',
  'Kỷ Sửu - Tích Lịch Hỏa',
  'Canh Dần - Tòng Bá Mộc',
  'Tân Mão - Tòng Bá Mộc',
  'Nhâm Thìn - Trường Lưu Thủy',
  'Quý Tỵ - Trường Lưu Thủy',
  'Giáp Ngọ - Sa Trung Kim',
  'Ất Mùi - Sa Trung Kim',
  'Bính Thân - Sơn Hạ Hỏa',
  'Đinh Dậu - Sơn Hạ Hỏa',
  'Mậu Tuất - Bình Địa Mộc',
  'Kỷ Hợi - Bình Địa Mộc',
  'Canh Tý - Bích Thượng Thổ',
  'Tân Sửu - Bích Thượng Thổ',
  'Nhâm Dần - Kim Bạc Kim',
  'Quý Mão - Kim Bạc Kim',
  'Giáp Thìn - Phú Đăng Hỏa',
  'Ất Tỵ - Phú Đăng Hỏa',
  'Bính Ngọ - Thiên Hà Thủy',
  'Đinh Mùi - Thiên Hà Thủy',
  'Mậu Thân - Đại Trạch Thổ',
  'Kỷ Dậu - Đại Trạch Thổ',
  'Canh Tuất - Thoa Xuyến Kim',
  'Tân Hợi - Thoa Xuyến Kim',
  'Nhâm Tý - Tang Đốc Mộc',
  'Quý Sửu - Tang Đốc Mộc',
  'Giáp Dần - Đại Khê Thủy',
  'Ất Mão - Đại Khê Thủy',
  'Bính Thìn - Sa Trung Thổ',
  'Đinh Tỵ - Sa Trung Thổ',
  'Mậu Ngọ - Thiên Thượng Hỏa',
  'Kỷ Mùi - Thiên Thượng Hỏa',
  'Canh Thân - Thạch Lựu Mộc',
  'Tân Dậu - Thạch Lựu Mộc',
  'Nhâm Tuất - Đại Hải Thủy',
  'Quý Hợi - Đại Hải Thủy',
] as const;

/**
 * Giải nghĩa tên 30 Nạp Âm, dùng để diễn giải Bản Mệnh Ngũ Hành cho người đọc.
 */
export const NAP_AM_MEANINGS: Readonly<Record<string, string>> = {
  'Hải Trung Kim': 'vàng dưới biển',
  'Lư Trung Hỏa': 'lửa trong lò',
  'Đại Lâm Mộc': 'gỗ rừng lớn',
  'Lộ Bàng Thổ': 'đất ven đường',
  'Kiếm Phong Kim': 'vàng đầu mũi kiếm',
  'Sơn Đầu Hỏa': 'lửa đầu núi',
  'Giải Hạ Thủy': 'nước dưới khe',
  'Thành Đầu Thổ': 'đất trên thành',
  'Bạch Lạp Kim': 'vàng sáp trắng',
  'Dương Liễu Mộc': 'gỗ cây dương liễu',
  'Tuyền Trung Thủy': 'nước trong suối',
  'Ốc Thượng Thổ': 'đất trên nóc nhà',
  'Tích Lịch Hỏa': 'lửa sấm sét',
  'Tòng Bá Mộc': 'gỗ tùng bách',
  'Trường Lưu Thủy': 'nước chảy dài',
  'Sa Trung Kim': 'vàng trong cát',
  'Sơn Hạ Hỏa': 'lửa dưới núi',
  'Bình Địa Mộc': 'gỗ đồng bằng',
  'Bích Thượng Thổ': 'đất trên vách',
  'Kim Bạc Kim': 'vàng trong vàng',
  'Phú Đăng Hỏa': 'lửa ngọn đèn',
  'Thiên Hà Thủy': 'nước sông trời',
  'Đại Trạch Thổ': 'đất đầm lớn',
  'Thoa Xuyến Kim': 'vàng trang sức',
  'Tang Đốc Mộc': 'gỗ cây dâu',
  'Đại Khê Thủy': 'nước khe lớn',
  'Sa Trung Thổ': 'đất trong cát',
  'Thiên Thượng Hỏa': 'lửa trên trời',
  'Thạch Lựu Mộc': 'gỗ cây thạch lựu',
  'Đại Hải Thủy': 'nước biển lớn',
};

/** Trả về nghĩa của tên Nạp Âm, hoặc chuỗi rỗng nếu không có trong bảng. */
export function getNapAmMeaning(name: string): string {
  return NAP_AM_MEANINGS[name] ?? '';
}
