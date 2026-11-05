/** 10 Thiên Can dùng trong Tử Vi. */
export type HeavenlyStem =
  'giap' | 'at' | 'binh' | 'dinh' | 'mau' | 'ky' | 'canh' | 'tan' | 'nham' | 'quy';

/** 12 Địa Chi dùng trong Tử Vi, bắt đầu từ Tý. */
export type EarthlyBranch =
  'ty' | 'suu' | 'dan' | 'mao' | 'thin' | 'ti' | 'ngo' | 'mui' | 'than' | 'dau' | 'tuat' | 'hoi';

/** Ngũ Hành: Kim, Mộc, Thủy, Hỏa, Thổ. */
export type FiveElement = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

/** 5 mức độ sáng theo Tân Biên 1956. */
export type BrightnessLevel = 'mieu' | 'vuong' | 'dac' | 'binh' | 'ham';

/** 14 Chính Tinh của lá số Tử Vi. */
export type MajorStarId =
  | 'tuVi'
  | 'thienCo'
  | 'thaiDuong'
  | 'vuKhuc'
  | 'thienDong'
  | 'liemTrinh'
  | 'thienPhu'
  | 'thaiAm'
  | 'thamLang'
  | 'cuMon'
  | 'thienTuong'
  | 'thienLuong'
  | 'thatSat'
  | 'phaQuan';

/** 12 Cung chức năng trong lá số Tử Vi. */
export type PalaceId =
  | 'menh'
  | 'phuMau'
  | 'phucDuc'
  | 'dienTrach'
  | 'quanLoc'
  | 'noBoc'
  | 'thienDi'
  | 'tatAch'
  | 'taiBach'
  | 'tuTuc'
  | 'phuThe'
  | 'huynhDe';

/** Tứ Hóa: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ. */
export type MutagenType = 'hoaLoc' | 'hoaQuyen' | 'hoaKhoa' | 'hoaKy';

/** Vùng miền lịch sử của Việt Nam, dùng để áp dụng múi giờ. */
export type VietnamRegion = 'north' | 'south';

/** Danh sách 10 Thiên Can dùng cho iteration. */
export const HEAVENLY_STEMS: readonly HeavenlyStem[] = [
  'giap',
  'at',
  'binh',
  'dinh',
  'mau',
  'ky',
  'canh',
  'tan',
  'nham',
  'quy',
];

/** Danh sách 12 Địa Chi dùng cho iteration. */
export const EARTHLY_BRANCHES: readonly EarthlyBranch[] = [
  'ty',
  'suu',
  'dan',
  'mao',
  'thin',
  'ti',
  'ngo',
  'mui',
  'than',
  'dau',
  'tuat',
  'hoi',
];

/** Danh sách Ngũ Hành. */
export const FIVE_ELEMENTS: readonly FiveElement[] = ['kim', 'moc', 'thuy', 'hoa', 'tho'];

/** Danh sách 5 mức độ sáng. */
export const BRIGHTNESS_LEVELS: readonly BrightnessLevel[] = [
  'mieu',
  'vuong',
  'dac',
  'binh',
  'ham',
];

/** Danh sách 14 Chính Tinh. */
export const MAJOR_STAR_IDS: readonly MajorStarId[] = [
  'tuVi',
  'thienCo',
  'thaiDuong',
  'vuKhuc',
  'thienDong',
  'liemTrinh',
  'thienPhu',
  'thaiAm',
  'thamLang',
  'cuMon',
  'thienTuong',
  'thienLuong',
  'thatSat',
  'phaQuan',
];

/** Danh sách 12 Cung chức năng. */
export const PALACE_IDS: readonly PalaceId[] = [
  'menh',
  'phuMau',
  'phucDuc',
  'dienTrach',
  'quanLoc',
  'noBoc',
  'thienDi',
  'tatAch',
  'taiBach',
  'tuTuc',
  'phuThe',
  'huynhDe',
];
