import type { MinorStarInterpretation } from '../types';
import { getMinorStarMeaning } from '../minor-star-meanings';

/**
 * Luận giải các phụ tinh phổ biến.
 */
export const MINOR_STAR_MEANINGS: Record<string, string> = {
  // Lục Cát
  taPhu: 'Tả Phù: trợ giúp, quý nhân bên trái',
  huuBat: 'Hữu Bật: trợ giúp, quý nhân bên phải',
  vanXuong: 'Văn Xương: học vấn, văn chương, thi cử',
  vanKhuc: 'Văn Khúc: nghệ thuật, tài hoa, danh tiếng',
  thienKhoi: 'Thiên Khôi: quý nhân nam, thăng tiến',
  thienViet: 'Thiên Việt: quý nhân nữ, danh dự',
  // Lục Sát
  diaKhong: 'Địa Không: hao tán, biến động bất ngờ',
  diaKiep: 'Địa Kiếp: phá hoại, tai ương khó lường',
  hoaTinh: 'Hỏa Tinh: nóng nảy, tai nạn về lửa',
  linhTinh: 'Linh Tinh: linh cảm, dễ gặp chuyện huyền bí',
  dauQuan: 'Đẩu Quân: tranh đấu, thị phi',
  // Tứ Hóa
  hoaLoc: 'Hóa Lộc: phúc lộc, may mắn về tài chính',
  hoaQuyen: 'Hóa Quyền: quyền lực, uy tín tăng thêm',
  hoaKhoa: 'Hóa Khoa: danh tiếng, học vấn, thi cử',
  hoaKy: 'Hóa Kỵ: trở ngại, tiểu nhân, hao tổn',
  // Lộc Mã
  taIch: 'Tài Ích: tài lộc, lợi ích',
  locTon: 'Lộc Tồn: của cải tích lũy',
  // Phụ tinh khác
  thaiTue: 'Thái Tuế: năm chủ, ảnh hưởng lớn trong năm',
  longTri: 'Long Trì: quyền uy, danh dự',
  phuongCac: 'Phượng Các: văn chương, danh tiếng',
  hongLoan: 'Hồng Loan: hôn nhân, duyên phận',
  thienHy: 'Thiên Hỷ: vui vẻ, tin mừng',
};

/**
 * Tạo luận giải phụ tinh từ mã sao.
 *
 * @param starId - Mã sao.
 * @param name - Tên hiển thị.
 * @param isAuspicious - Là sao cát hay không.
 * @returns Luận giải phụ tinh.
 */
export function buildMinorStarInterpretation(
  starId: string,
  name: string,
  isAuspicious: boolean
): MinorStarInterpretation {
  const detailed = getMinorStarMeaning(starId, name);
  const meaning = detailed
    ? `${name}: ${detailed.description}`
    : (MINOR_STAR_MEANINGS[starId] ?? `${name}: phụ tinh ảnh hưởng đến cung`);

  return {
    starId,
    name,
    meaning,
    isAuspicious,
    impact: detailed?.impact,
    aspect: detailed?.aspect,
    description: detailed?.description,
    advice: detailed?.advice,
  };
}
