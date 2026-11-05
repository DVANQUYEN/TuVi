import type { BrightnessLevel, EarthlyBranch, MajorStarId } from '../types/enums';

/**
 * Metadata nguồn bảng độ sáng Tân Biên 1956.
 */
export const TAN_BIEN_SOURCE_METADATA = {
  title: 'Tử Vi Đẩu Số Tân Biên',
  author: 'Vân Đằng Thái Thứ Lang',
  publisher: 'NXB Sài Gòn',
  year: 1956,
  section: 'Quyển 2, Phần II, Mục 3: Đặc tính các sao, trang 33-38',
} as const;

/**
 * Bảng độ sáng 5 mức cho 14 Chính Tinh × 12 Địa Chi
 * theo Tử Vi Đẩu Số Tân Biên (1956).
 *
 * Nguồn: docs/BRIGHTNESS-COMPARISON.md
 */
export const TAN_BIEN_BRIGHTNESS_TABLE: Readonly<
  Record<MajorStarId, Readonly<Record<EarthlyBranch, BrightnessLevel>>>
> = {
  // 1. Tử Vi (10/12 cung lệch với iztro)
  tuVi: {
    ty: 'binh',
    suu: 'dac',
    dan: 'mieu',
    mao: 'binh',
    thin: 'vuong',
    ti: 'mieu',
    ngo: 'mieu',
    mui: 'dac',
    than: 'mieu',
    dau: 'binh',
    tuat: 'vuong',
    hoi: 'binh',
  },
  // 2. Thiên Cơ (12/12 cung lệch với iztro)
  thienCo: {
    ty: 'dac',
    suu: 'dac',
    dan: 'ham',
    mao: 'mieu',
    thin: 'mieu',
    ti: 'vuong',
    ngo: 'dac',
    mui: 'dac',
    than: 'vuong',
    dau: 'mieu',
    tuat: 'mieu',
    hoi: 'ham',
  },
  // 3. Thái Dương (6/12 cung lệch)
  thaiDuong: {
    ty: 'ham',
    suu: 'dac',
    dan: 'vuong',
    mao: 'vuong',
    thin: 'vuong',
    ti: 'mieu',
    ngo: 'mieu',
    mui: 'dac',
    than: 'ham',
    dau: 'ham',
    tuat: 'ham',
    hoi: 'ham',
  },
  // 4. Vũ Khúc (4/12 cung lệch)
  vuKhuc: {
    ty: 'vuong',
    suu: 'mieu',
    dan: 'vuong',
    mao: 'dac',
    thin: 'mieu',
    ti: 'ham',
    ngo: 'vuong',
    mui: 'mieu',
    than: 'vuong',
    dau: 'dac',
    tuat: 'mieu',
    hoi: 'ham',
  },
  // 5. Thiên Đồng (8/12 cung lệch)
  thienDong: {
    ty: 'vuong',
    suu: 'ham',
    dan: 'mieu',
    mao: 'dac',
    thin: 'ham',
    ti: 'dac',
    ngo: 'ham',
    mui: 'ham',
    than: 'mieu',
    dau: 'ham',
    tuat: 'ham',
    hoi: 'dac',
  },
  // 6. Liêm Trinh (8/12 cung lệch)
  liemTrinh: {
    ty: 'vuong',
    suu: 'dac',
    dan: 'vuong',
    mao: 'ham',
    thin: 'mieu',
    ti: 'ham',
    ngo: 'vuong',
    mui: 'dac',
    than: 'vuong',
    dau: 'ham',
    tuat: 'mieu',
    hoi: 'ham',
  },
  // 7. Thiên Phủ (8/12 cung lệch)
  thienPhu: {
    ty: 'mieu',
    suu: 'binh',
    dan: 'mieu',
    mao: 'binh',
    thin: 'vuong',
    ti: 'dac',
    ngo: 'mieu',
    mui: 'dac',
    than: 'mieu',
    dau: 'binh',
    tuat: 'vuong',
    hoi: 'dac',
  },
  // 8. Thái Âm (7/12 cung lệch)
  thaiAm: {
    ty: 'vuong',
    suu: 'dac',
    dan: 'ham',
    mao: 'ham',
    thin: 'ham',
    ti: 'ham',
    ngo: 'ham',
    mui: 'dac',
    than: 'vuong',
    dau: 'mieu',
    tuat: 'mieu',
    hoi: 'mieu',
  },
  // 9. Tham Lang (8/12 cung lệch)
  thamLang: {
    ty: 'ham',
    suu: 'mieu',
    dan: 'dac',
    mao: 'ham',
    thin: 'vuong',
    ti: 'ham',
    ngo: 'ham',
    mui: 'mieu',
    than: 'dac',
    dau: 'ham',
    tuat: 'vuong',
    hoi: 'ham',
  },
  // 10. Cự Môn (4/12 cung lệch)
  cuMon: {
    ty: 'vuong',
    suu: 'ham',
    dan: 'vuong',
    mao: 'mieu',
    thin: 'ham',
    ti: 'ham',
    ngo: 'vuong',
    mui: 'ham',
    than: 'dac',
    dau: 'mieu',
    tuat: 'ham',
    hoi: 'dac',
  },
  // 11. Thiên Tướng (5/12 cung lệch)
  thienTuong: {
    ty: 'vuong',
    suu: 'dac',
    dan: 'mieu',
    mao: 'ham',
    thin: 'vuong',
    ti: 'dac',
    ngo: 'vuong',
    mui: 'dac',
    than: 'mieu',
    dau: 'ham',
    tuat: 'vuong',
    hoi: 'dac',
  },
  // 12. Thiên Lương (7/12 cung lệch)
  thienLuong: {
    ty: 'vuong',
    suu: 'dac',
    dan: 'vuong',
    mao: 'vuong',
    thin: 'mieu',
    ti: 'ham',
    ngo: 'mieu',
    mui: 'dac',
    than: 'vuong',
    dau: 'ham',
    tuat: 'mieu',
    hoi: 'ham',
  },
  // 13. Thất Sát (10/12 cung lệch)
  thatSat: {
    ty: 'mieu',
    suu: 'dac',
    dan: 'mieu',
    mao: 'ham',
    thin: 'ham',
    ti: 'vuong',
    ngo: 'mieu',
    mui: 'dac',
    than: 'mieu',
    dau: 'ham',
    tuat: 'ham',
    hoi: 'vuong',
  },
  // 14. Phá Quân (6/12 cung lệch)
  phaQuan: {
    ty: 'mieu',
    suu: 'vuong',
    dan: 'ham',
    mao: 'ham',
    thin: 'dac',
    ti: 'ham',
    ngo: 'mieu',
    mui: 'vuong',
    than: 'ham',
    dau: 'ham',
    tuat: 'dac',
    hoi: 'ham',
  },
};

/**
 * Tra cứu độ sáng O(1) cho một chính tinh tại một cung.
 *
 * @param starId - Mã chính tinh.
 * @param branch - Mã địa chi của cung.
 * @returns Mức độ sáng theo Tân Biên.
 */
export function getTanBienBrightness(starId: MajorStarId, branch: EarthlyBranch): BrightnessLevel {
  return TAN_BIEN_BRIGHTNESS_TABLE[starId][branch];
}

/**
 * Kiểm tra bảng có đủ 168 ô không (14 sao × 12 cung).
 *
 * @returns `true` nếu bảng đầy đủ, ngược lại `false`.
 */
export function validateTanBienTable(): boolean {
  const starIds = Object.keys(TAN_BIEN_BRIGHTNESS_TABLE) as MajorStarId[];
  if (starIds.length !== 14) return false;

  for (const starId of starIds) {
    const branches = Object.keys(TAN_BIEN_BRIGHTNESS_TABLE[starId]) as EarthlyBranch[];
    if (branches.length !== 12) return false;
  }

  return true;
}
