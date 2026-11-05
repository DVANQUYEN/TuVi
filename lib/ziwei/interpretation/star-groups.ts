import type { Palace } from '../types';
import type { StarGroup } from './types';
import { palaceHasAllStars, palaceHasStar } from './star-utils';

/**
 * Các bộ sao phổ biến trong Tử Vi, dùng để luận giải theo tương tác giữa các sao.
 */
export const STAR_GROUPS: StarGroup[] = [
  {
    id: 'tu-phu-dong-cung',
    name: 'Tử Phủ đồng cung',
    stars: ['Tử Vi', 'Thiên Phủ'],
    meaning:
      'Tử Vi và Thiên Phủ cùng một cung tạo cách "Tử Phủ đồng cung". ' +
      'Đây là cách cục phú quý song toàn, tài lộc vững bền. ' +
      'Đương số có tố chất lãnh đạo, được quý nhân phù trợ. ' +
      'Thích hợp với ngành tài chính, bất động sản, quản lý.',
    level: 'tốt',
  },
  {
    id: 'tu-sat-dong-cung',
    name: 'Tử Sát đồng cung',
    stars: ['Tử Vi', 'Thất Sát'],
    meaning:
      'Tử Vi và Thất Sát cùng một cung tạo cách "Tử Sát đồng cung". ' +
      'Đây là cách cục quyền lực nhưng cô độc, nhiều thăng trầm. ' +
      'Đương số có tài năng nhưng dễ gặp trắc trở trong quan hệ. ' +
      'Cần học cách nhường nhịn, tránh độc đoán.',
    level: 'trung bình',
  },
  {
    id: 'sat-pha-tham',
    name: 'Sát Phá Tham',
    stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'],
    meaning:
      'Thất Sát, Phá Quân, Tham Lang tam hợp tạo cách "Sát Phá Tham". ' +
      'Đây là bộ sao biến động, nhiều thay đổi trong cuộc đời. ' +
      'Đương số có tính cách mạnh mẽ, dám nghĩ dám làm. ' +
      'Cuộc đời nhiều thăng trầm, nhưng nếu kiên trì sẽ thành công.',
    level: 'trung bình',
    scope: 'tamPhuong',
  },
  {
    id: 'co-nguyet-dong-luong',
    name: 'Cơ Nguyệt Đồng Lương',
    stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
    meaning:
      'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương tạo bộ "Cơ Nguyệt Đồng Lương". ' +
      'Đây là bộ sao tốt cho phụ nữ, chủ về hiền lành, thông minh. ' +
      'Đương số có tài năng văn chương, nghệ thuật. ' +
      'Thích hợp với ngành giáo dục, y tế, tư vấn.',
    level: 'tốt',
    scope: 'tamPhuong',
  },
  {
    id: 'duong-da-hoa-linh',
    name: 'Dương Đà Hỏa Linh',
    stars: ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'],
    meaning:
      'Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tạo bộ "Tứ sát". ' +
      'Đây là bộ sao RẤT XẤU, chủ về tai nạn huyết quang, tranh chấp kiện tụng, thị phi liên miên. ' +
      'Đương số dễ gặp đại nạn, có thể phải nằm viện, hoặc gặp cảnh máu chảy đầu rơi. ' +
      'Nếu không cẩn thận, có thể gặp cảnh tù tội, hoặc tai nạn chết người. ' +
      'Cần đặc biệt cẩn trọng, làm việc thiện để hóa giải.',
    level: 'xấu',
    scope: 'tamPhuong',
  },
  {
    id: 'loc-ma',
    name: 'Lộc Mã',
    stars: ['Lộc Tồn', 'Thiên Mã'],
    meaning:
      'Lộc Tồn và Thiên Mã đồng cung tạo cách "Lộc Mã giao trì". ' +
      'Đây là cách cục tài lộc lớn, may mắn về tiền bạc. ' +
      'Đương số thường có thu nhập bất ngờ, được quý nhân phù trợ. ' +
      'Thích hợp với kinh doanh, đầu tư.',
    level: 'tốt',
  },
  {
    id: 'xuong-khuc',
    name: 'Xương Khúc',
    stars: ['Văn Xương', 'Văn Khúc'],
    meaning:
      'Văn Xương và Văn Khúc tạo bộ "Xương Khúc". ' +
      'Đây là bộ sao tốt về học hành, thi cử, nghệ thuật. ' +
      'Đương số thông minh, học hành tiến bộ, thi cử đỗ đạt. ' +
      'Thích hợp với ngành giáo dục, nghiên cứu, nghệ thuật.',
    level: 'tốt',
  },
  {
    id: 'khoi-viet',
    name: 'Khôi Việt',
    stars: ['Thiên Khôi', 'Thiên Việt'],
    meaning:
      'Thiên Khôi và Thiên Việt tạo bộ "Khôi Việt". ' +
      'Đây là bộ sao quý nhân phù trợ, may mắn trong cuộc sống. ' +
      'Đương số thường được người khác giúp đỡ, gặp khó khăn có người cứu. ' +
      'Thích hợp với vai trò lãnh đạo, quản lý.',
    level: 'tốt',
  },
  {
    id: 'khong-kiep',
    name: 'Không Kiếp',
    stars: ['Địa Không', 'Địa Kiếp'],
    meaning:
      'Địa Không và Địa Kiếp tạo bộ "Không Kiếp". ' +
      'Đây là bộ sao xấu, chủ về tai họa, mất mát. ' +
      'Đương số dễ gặp khó khăn, trở ngại lớn trong cuộc sống. ' +
      'Cần cẩn trọng trong quyết định, tránh đầu tư mạo hiểm.',
    level: 'xấu',
  },
];

/**
 * Nhận diện các bộ sao có trong một cung.
 *
 * @param palace - Cung cần kiểm tra.
 * @param relatedPalaces - Các cung tam phương của cung (tùy chọn).
 * @returns Danh sách bộ sao được nhận diện.
 */
export function detectStarGroups(
  palace: Palace,
  relatedPalaces: Palace[] = []
): StarGroup[] {
  return STAR_GROUPS.filter((group) => {
    if (group.scope === 'tamPhuong') {
      const palaces = [palace, ...relatedPalaces];
      return group.stars.every((star) =>
        palaces.some((candidate) => palaceHasStar(candidate, star))
      );
    }

    return palaceHasAllStars(palace, group.stars);
  });
}
