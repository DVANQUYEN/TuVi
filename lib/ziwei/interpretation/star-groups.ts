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
      'Đây là cách cục thiên về uy tín và khả năng quản trị nguồn lực, thuận cho việc giữ vững thành quả hơn là mạo hiểm. ' +
      'Đương số thường có tố chất lãnh đạo và biết vun vén, nhưng thành tựu còn tùy nỗ lực và môi trường. ' +
      'Nếu biết lắng nghe và tránh bảo thủ, thế mạnh này dễ phát huy trong tài chính, bất động sản hoặc quản lý.',
    level: 'tốt',
  },
  {
    id: 'tu-sat-dong-cung',
    name: 'Tử Sát đồng cung',
    stars: ['Tử Vi', 'Thất Sát'],
    meaning:
      'Tử Vi và Thất Sát cùng một cung tạo cách "Tử Sát đồng cung". ' +
      'Đây là thế kết hợp giữa uy quyền và sát khí, mang lại bản lĩnh nhưng cũng dễ tạo cảm giác đơn độc. ' +
      'Đương số có tài năng và dám quyết đoán, song dễ gặp trắc trở trong quan hệ nếu nóng vội. ' +
      'Nếu học cách nhường nhịn và lắng nghe, đương số có thể giữ được sự gắn kết và phát huy thế mạnh.',
    level: 'trung bình',
  },
  {
    id: 'sat-pha-tham',
    name: 'Sát Phá Tham',
    stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'],
    meaning:
      'Thất Sát, Phá Quân, Tham Lang tam hợp tạo cách "Sát Phá Tham". ' +
      'Đây là bộ sao của biến động và hành động tiên phong, cuộc đời có nhiều thay đổi và thăng trầm. ' +
      'Đương số có tính cách mạnh mẽ, dám nghĩ dám làm, nhưng cần tiết chế nóng nảy và giữ nhịp để tránh phân tán. ' +
      'Nếu biết tích lũy và kiểm soát rủi ro, đương số có thể tạo dựng thành quả bền hơn.',
    level: 'trung bình',
    scope: 'tamPhuong',
  },
  {
    id: 'co-nguyet-dong-luong',
    name: 'Cơ Nguyệt Đồng Lương',
    stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
    meaning:
      'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương tạo bộ "Cơ Nguyệt Đồng Lương". ' +
      'Đây là bộ sao thiên về trí tuệ, sự tinh tế và lòng trắc ẩn, phù hợp với nhiều người chứ không riêng giới nào. ' +
      'Đương số thường có khiếu văn chương, nghệ thuật và khả năng tham mưu, hoạch định. ' +
      'Nếu biết quyết đoán đúng lúc, đương số có thể phát huy trong giáo dục, y tế, tư vấn hoặc nghiên cứu.',
    level: 'tốt',
    scope: 'tamPhuong',
  },
  {
    id: 'duong-da-hoa-linh',
    name: 'Dương Đà Hỏa Linh',
    stars: ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'],
    meaning:
      'Kình Dương, Đà La, Hỏa Tinh, Linh Tinh tạo bộ "Tứ sát" Dương Đà Hỏa Linh. ' +
      'Đây là bộ sao dễ gây va chạm, nóng vội và thị phi dai dẳng trong những giai đoạn bất lợi. ' +
      'Đương số dễ gặp va chạm, cần cẩn trọng sức khỏe, giao thông và tranh chấp để giảm bớt rủi ro. ' +
      'Nếu giữ thiện ý, hành động chậm lại và tránh nóng vội, đương số có thể hóa giải phần lớn căng thẳng.',
    level: 'xấu',
    scope: 'tamPhuong',
  },
  {
    id: 'loc-ma',
    name: 'Lộc Mã',
    stars: ['Lộc Tồn', 'Thiên Mã'],
    meaning:
      'Lộc Tồn và Thiên Mã đồng cung tạo cách "Lộc Mã giao trì". ' +
      'Đây là cách cục gắn tài lộc với di chuyển, thuận cho công việc xa nhà hoặc kinh doanh lưu động. ' +
      'Đương số có thể có thêm thu nhập từ những chuyến đi và mối quan hệ mở rộng, nhưng còn tùy nỗ lực và cách quản lý. ' +
      'Nếu chủ động giao lưu và tính toán kỹ, đương số có thể biến cơ hội thành kết quả cụ thể.',
    level: 'tốt',
  },
  {
    id: 'xuong-khuc',
    name: 'Xương Khúc',
    stars: ['Văn Xương', 'Văn Khúc'],
    meaning:
      'Văn Xương và Văn Khúc tạo bộ "Xương Khúc". ' +
      'Đây là bộ sao thuận cho học hành, nghiên cứu và nghệ thuật, giúp đương số thông minh và có khiếu diễn đạt. ' +
      'Đương số có thể học hành tiến bộ và gặp thuận lợi trong thi cử nếu chăm chỉ, song kết quả vẫn tùy nỗ lực thực tế. ' +
      'Nếu biết trau dồi đều đặn, thế mạnh này dễ phát huy trong giáo dục, nghiên cứu hoặc sáng tạo.',
    level: 'tốt',
  },
  {
    id: 'khoi-viet',
    name: 'Khôi Việt',
    stars: ['Thiên Khôi', 'Thiên Việt'],
    meaning:
      'Thiên Khôi và Thiên Việt tạo bộ "Khôi Việt". ' +
      'Đây là bộ sao thiên về sự nâng đỡ và thiện duyên, giúp đương số dễ nhận được lời khuyên hữu ích. ' +
      'Đương số có thể có người giúp đỡ khi cần, nhưng sự trợ giúp còn tùy cách mình tạo dựng và giữ mối quan hệ. ' +
      'Nếu biết khiêm tốn và chủ động học hỏi, đương số có thể phát huy thế mạnh trong vai trò lãnh đạo hoặc quản lý.',
    level: 'tốt',
  },
  {
    id: 'khong-kiep',
    name: 'Không Kiếp',
    stars: ['Địa Không', 'Địa Kiếp'],
    meaning:
      'Địa Không và Địa Kiếp tạo bộ "Không Kiếp". ' +
      'Đây là bộ sao dễ mang biến động và hao tán, nhưng không hẳn chỉ bất lợi: trong sáng tạo, kỹ thuật hoặc tôn giáo, nó có thể thành động lực đổi mới. ' +
      'Đương số có thể gặp khó khăn, trở ngại lớn trong một số giai đoạn, nên cần cẩn trọng khi quyết định và tránh đầu tư mạo hiểm. ' +
      'Nếu biết chọn hướng phù hợp và giữ tâm ổn định, đương số có thể biến thử thách thành kinh nghiệm.',
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
