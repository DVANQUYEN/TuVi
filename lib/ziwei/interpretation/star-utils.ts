import type { Palace, Star } from '../types';

/**
 * Bí danh giữa mã sao (camelCase) và tên hiển thị tiếng Việt.
 * Giúp việc nhận diện bộ sao hoạt động với cả dữ liệu thật lẫn fixture test.
 */
export const MINOR_STAR_ALIASES: Readonly<Record<string, readonly string[]>> = {
  vanXuong: ['vanXuong', 'Văn Xương'],
  vanKhuc: ['vanKhuc', 'Văn Khúc'],
  thienKhoi: ['thienKhoi', 'Thiên Khôi'],
  thienViet: ['thienViet', 'Thiên Việt'],
  locTon: ['locTon', 'Lộc Tồn'],
  thienMa: ['thienMa', 'Thiên Mã'],
  kinhDuong: ['kinhDuong', 'Kình Dương'],
  daLa: ['daLa', 'Đà La'],
  hoaTinh: ['hoaTinh', 'Hỏa Tinh'],
  linhTinh: ['linhTinh', 'Linh Tinh'],
  diaKhong: ['diaKhong', 'Địa Không'],
  diaKiep: ['diaKiep', 'Địa Kiếp'],
  daoHoa: ['daoHoa', 'Đào Hoa'],
  hongLoan: ['hongLoan', 'Hồng Loan'],
  longTri: ['longTri', 'Long Trì'],
  phuongCac: ['phuongCac', 'Phụng Các', 'Phượng Các'],
};

/**
 * Gom toàn bộ sao trong một cung.
 *
 * @param palace - Cung cần lấy sao.
 * @returns Danh sách sao thuộc cung.
 */
export function collectPalaceStars(palace: Palace): Star[] {
  return [
    ...palace.majorStars,
    ...palace.auspiciousStars,
    ...palace.maleficStars,
    ...palace.otherStars,
  ];
}

/**
 * Tập hợp mã và tên của mọi sao trong cung.
 *
 * @param palace - Cung cần lấy khóa sao.
 * @returns Tập khóa sao.
 */
export function palaceStarKeys(palace: Palace): Set<string> {
  const keys = new Set<string>();
  for (const star of collectPalaceStars(palace)) {
    keys.add(star.id);
    keys.add(star.name);
  }
  return keys;
}

/**
 * Kiểm tra cung có chứa một sao hay không, hỗ trợ bí danh.
 *
 * @param palace - Cung cần kiểm tra.
 * @param star - Mã hoặc tên sao.
 * @returns `true` nếu cung có sao.
 */
export function palaceHasStar(palace: Palace, star: string): boolean {
  const aliases = MINOR_STAR_ALIASES[star] ?? [star];
  const keys = palaceStarKeys(palace);
  return aliases.some((alias) => keys.has(alias));
}

/**
 * Kiểm tra cung có đủ tất cả các sao yêu cầu.
 *
 * @param palace - Cung cần kiểm tra.
 * @param stars - Danh sách mã hoặc tên sao.
 * @returns `true` nếu cung có đủ sao.
 */
export function palaceHasAllStars(palace: Palace, stars: readonly string[]): boolean {
  return stars.every((star) => palaceHasStar(palace, star));
}

/**
 * Kiểm tra cung có ít nhất một trong các sao yêu cầu.
 *
 * @param palace - Cung cần kiểm tra.
 * @param stars - Danh sách mã hoặc tên sao.
 * @returns `true` nếu cung có ít nhất một sao.
 */
export function palaceHasAnyStar(palace: Palace, stars: readonly string[]): boolean {
  return stars.some((star) => palaceHasStar(palace, star));
}
