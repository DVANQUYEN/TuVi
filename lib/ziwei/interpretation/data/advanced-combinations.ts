import type { Palace, ZiweiChart } from '../../types';
import type { BrightnessLevel, EarthlyBranch, PalaceId } from '../../types/enums';
import { palaceHasAllStars, palaceHasAnyStar, palaceHasStar } from '../star-utils';

/** Mức độ của một cách cục nâng cao. */
export type AdvancedCombinationLevel = 'tốt' | 'xấu' | 'trung bình';

/** Định nghĩa một cách cục nâng cao. */
export interface AdvancedCombination {
  /** Mã cách cục. */
  id: string;
  /** Tên cách cục. */
  name: string;
  /** Mức độ tốt xấu. */
  level: AdvancedCombinationLevel;
  /** Luận giải chi tiết. */
  description: string;
  /** Điều kiện nhận diện dạng mô tả. */
  conditions: string[];
}

/**
 * 30 cách cục nâng cao trong Tử Vi.
 */
export const ADVANCED_COMBINATIONS: AdvancedCombination[] = [
  {
    id: 'thach-trung-an-ngoc',
    name: 'Thạch trung ẩn ngọc',
    level: 'tốt',
    description:
      'Ngọc ẩn trong đá là hình ảnh của người có tài năng tiềm ẩn nhưng phải trải qua nhiều thử thách mới bộc lộ. ' +
      'Đương số thường thành công muộn, sau tuổi trung niên mới gặt hái được thành tựu rõ rệt. ' +
      'Những năm tháng vất vả ban đầu chính là quá trình mài giũa bản lĩnh và tích lũy kinh nghiệm. ' +
      'Càng kiên trì, hậu vận càng vững chắc và được mọi người nể trọng. ' +
      'Ví dụ, nhiều doanh nhân thành đạt có cách này từng thất bại nhiều lần trước khi đạt đỉnh cao.',
    conditions: ['Tử Vi tại Thìn hoặc Tuất', 'Có Văn Xương hoặc Văn Khúc đồng cung'],
  },
  {
    id: 'nhat-nguyet-tinh-minh',
    name: 'Nhật nguyệt tịnh minh',
    level: 'tốt',
    description:
      'Thái Dương tại Mão và Thái Âm tại Hợi tạo thế Nhật Nguyệt tịnh minh, ánh sáng hai mặt trời mặt trăng cùng chiếu rọi. ' +
      'Đương số có sự cân bằng hiếm có giữa lý trí và cảm xúc, vừa quyết đoán vừa tinh tế. ' +
      'Cách cục này chủ về phú quý, danh tiếng và sự nghiệp hanh thông, đặc biệt khi biết phát huy thế mạnh giao tiếp. ' +
      'Gia đạo thường êm ấm, con cái thành đạt và có quý nhân phù trợ. ' +
      'Cần tránh tự mãn để giữ vững vận may dài lâu.',
    conditions: ['Thái Dương tại Mão', 'Thái Âm tại Hợi'],
  },
  {
    id: 'co-nguyet-dong-luong',
    name: 'Cơ nguyệt đồng lương',
    level: 'tốt',
    description:
      'Thiên Cơ, Thái Âm và Thiên Lương hội tụ tại Mệnh, Tài Bạch hoặc Quan Lộc tạo nên cách Cơ Nguyệt Đồng Lương. ' +
      'Đây là bộ sao chủ về trí tuệ, lòng nhân hậu và khả năng học vấn sâu rộng. ' +
      'Đương số thường hiền lành, thông minh, có duyên với văn chương nghệ thuật và công việc thiện nguyện. ' +
      'Cách cục đặc biệt tốt cho phụ nữ, giúp cuộc sống bình an và được nhiều người yêu mến. ' +
      'Nên chọn giáo dục, y tế, tư vấn hoặc nghiên cứu để phát huy tối đa tiềm năng.',
    conditions: ['Thiên Cơ, Thái Âm, Thiên Lương tại Mệnh/Tài/Quan', 'Tam phương hội tụ đủ bộ sao'],
  },
  {
    id: 'sat-pha-tham',
    name: 'Sát phá tham',
    level: 'trung bình',
    description:
      'Thất Sát, Phá Quân và Tham Lang kết hợp thành bộ Sát Phá Tham, bộ sao của sự biến động và bứt phá. ' +
      'Đương số có cá tính mạnh mẽ, dám nghĩ dám làm và không ngại đối mặt với thử thách. ' +
      'Cuộc đời thường trải qua nhiều thay đổi lớn về công việc, nơi ở hoặc mối quan hệ. ' +
      'Nếu biết kiên trì và tiết chế nóng nảy, đương số có thể tạo dựng sự nghiệp đáng nể. ' +
      'Cần tránh quyết định bốc đồng trong giai đoạn vận hạn mạnh.',
    conditions: ['Thất Sát, Phá Quân, Tham Lang tam hợp', 'Bộ sao chủ về biến động'],
  },
  {
    id: 'phu-tuong-trieu-vien',
    name: 'Phủ tướng triều viên',
    level: 'tốt',
    description:
      'Thiên Phủ và Thiên Tướng cùng chiếu về cung Mệnh tạo thành cách Phủ Tướng triều viên. ' +
      'Đây là cách cục chủ về phú quý, quyền uy và sự ổn định lâu dài. ' +
      'Đương số có tố chất lãnh đạo, biết quản lý tài chính và thường được cấp trên tin tưởng. ' +
      'Cách này phù hợp với ngành ngân hàng, bất động sản, quản trị hoặc công tác nhà nước. ' +
      'Cần giữ chữ tín và tránh tham lam để duy trì vận may bền vững.',
    conditions: ['Thiên Phủ và Thiên Tướng chiếu Mệnh', 'Có thể nằm trong tam phương tứ chính'],
  },
  {
    id: 'duong-da-hoa-linh',
    name: 'Dương Đà Hỏa Linh',
    level: 'xấu',
    description:
      'Kình Dương, Đà La, Hỏa Tinh và Linh Tinh hội đủ tạo thành bộ Tứ Sát Dương Đà Hỏa Linh. ' +
      'Đây là bộ sao RẤT XẤU, chủ về tai nạn huyết quang, tranh chấp kiện tụng và thị phi liên miên. ' +
      'Đương số dễ gặp đại nạn, có thể phải nằm viện, hoặc gặp cảnh máu chảy đầu rơi. ' +
      'Nếu không cẩn thận, có thể gặp cảnh tù tội, hoặc tai nạn chết người. ' +
      'Cần đặc biệt cẩn trọng, làm việc thiện để hóa giải bớt hung khí.',
    conditions: ['Kình Dương, Đà La, Hỏa Tinh, Linh Tinh hội tụ', 'Bộ Tứ Sát chủ về tai họa'],
  },
  {
    id: 'khong-kiep-lam-than',
    name: 'Không Kiếp lâm thân',
    level: 'xấu',
    description:
      'Địa Không và Địa Kiếp cùng chiếu về cung Thân tạo thành cách Không Kiếp lâm thân. ' +
      'Đây là cách cục báo hiệu những biến động lớn, hao tán tài lộc và tai họa khó lường. ' +
      'Đương số có thể gặp mất mát về tiền bạc, sự nghiệp hoặc tình cảm vào những giai đoạn vận hạn xấu. ' +
      'Tuy nhiên, nếu biết sống thiện, làm việc có đạo đức và tránh tham lam thì hung khí sẽ giảm đáng kể. ' +
      'Cần đặc biệt thận trọng khi ký kết hợp đồng hoặc đầu tư lớn.',
    conditions: ['Địa Không và Địa Kiếp chiếu Thân', 'Thân cung hoặc tam phương của Thân'],
  },
  {
    id: 'loc-ma-giao-tri',
    name: 'Lộc Mã giao trì',
    level: 'tốt',
    description:
      'Lộc Tồn và Thiên Mã đồng cung tạo thành cách Lộc Mã giao trì, biểu tượng của tài lộc gắn liền với di chuyển. ' +
      'Đương số thường có thu nhập bất ngờ từ những chuyến đi, công việc xa nhà hoặc kinh doanh lưu động. ' +
      'Cách cục này chủ về phú quý, may mắn về tiền bạc và được quý nhân phù trợ. ' +
      'Nên chủ động mở rộng thị trường, giao lưu và nắm bắt cơ hội ở nơi xa. ' +
      'Cần tránh ở yên một chỗ quá lâu vì sẽ làm giảm vận may.',
    conditions: ['Lộc Tồn và Thiên Mã đồng cung', 'Tài lộc gắn với di chuyển'],
  },
  {
    id: 'song-loc-giap-menh',
    name: 'Song lộc giáp Mệnh',
    level: 'tốt',
    description:
      'Lộc Tồn và Hóa Lộc nằm ở hai cung giáp cung Mệnh tạo thành cách Song Lộc giáp Mệnh. ' +
      'Đây là cách cục chủ về phú quý, tiền tài dồi dào và cuộc sống sung túc. ' +
      'Đương số thường được thừa hưởng tài lộc từ gia đình hoặc có quý nhân giúp đỡ về vật chất. ' +
      'Cách này đặc biệt thuận lợi cho kinh doanh, đầu tư và quản lý tài sản. ' +
      'Cần giữ lòng biết ơn và tránh khoe khoang để bảo vệ vận may.',
    conditions: ['Lộc Tồn và Hóa Lộc giáp cung Mệnh', 'Hai cung liền kề cung Mệnh'],
  },
  {
    id: 'nguyet-lang-thien-mon',
    name: 'Nguyệt lãng thiên môn',
    level: 'tốt',
    description:
      'Thái Âm tọa tại cung Hợi tạo thành cách Nguyệt lãng thiên môn, ánh trăng sáng chiếu cửa trời. ' +
      'Đây là cách cục chủ về sự thanh tao, trí tuệ và lòng nhân hậu. ' +
      'Đương số có tâm hồn nghệ sĩ, trực giác nhạy bén và khả năng cảm thụ cái đẹp tinh tế. ' +
      'Cách này thuận cho văn chương, nghệ thuật, tôn giáo hoặc công việc thiện nguyện. ' +
      'Nên sống chân thành, tránh bon chen để giữ được sự bình an trong tâm hồn.',
    conditions: ['Thái Âm tại Hợi', 'Cung Hợi là vị trí sáng đẹp của Thái Âm'],
  },
  {
    id: 'tu-phu-dong-cung',
    name: 'Tử Phủ đồng cung',
    level: 'tốt',
    description:
      'Tử Vi và Thiên Phủ đồng cung tạo thành cách Tử Phủ đồng cung, biểu tượng của quyền lực và tài lộc song toàn. ' +
      'Đương số có tố chất lãnh đạo, biết quản lý nguồn lực và thường được mọi người kính trọng. ' +
      'Cách cục này chủ về phú quý, sự nghiệp vững chắc và cuộc sống sung túc. ' +
      'Phù hợp với tài chính, bất động sản, quản trị doanh nghiệp hoặc chính trị. ' +
      'Cần tránh độc đoán và biết lắng nghe để giữ vững thành quả.',
    conditions: ['Tử Vi và Thiên Phủ đồng cung', 'Thường tại Dần hoặc Thân'],
  },
  {
    id: 'tu-sat-dong-cung',
    name: 'Tử Sát đồng cung',
    level: 'trung bình',
    description:
      'Tử Vi và Thất Sát đồng cung tạo thành cách Tử Sát đồng cung, sự kết hợp giữa quyền uy và sát khí. ' +
      'Đương số có tài năng lãnh đạo nhưng cuộc đời nhiều thăng trầm và dễ rơi vào cô độc. ' +
      'Tính cách mạnh mẽ, quyết đoán nhưng đôi khi cứng nhắc, khó gần. ' +
      'Cách này phù hợp với quân sự, chính trị, kinh doanh hoặc công việc đòi hỏi bản lĩnh. ' +
      'Cần học cách nhường nhịn và xây dựng quan hệ để giảm bớt cô đơn.',
    conditions: ['Tử Vi và Thất Sát đồng cung', 'Thường tại Tỵ hoặc Hợi'],
  },
  {
    id: 'tu-pha-dong-cung',
    name: 'Tử Phá đồng cung',
    level: 'trung bình',
    description:
      'Tử Vi và Phá Quân đồng cung tạo thành cách Tử Phá đồng cung, biểu tượng của sự phá cách và tái tạo. ' +
      'Đương số có tư duy đổi mới, dám phá bỏ lối mòn để tạo dựng con đường riêng. ' +
      'Cuộc đời thường có nhiều biến động lớn về sự nghiệp, nơi ở hoặc gia đạo. ' +
      'Nếu biết kiểm soát sự nóng nảy và tính toán hậu quả, đương số có thể đạt thành tựu lớn. ' +
      'Cần tránh thay đổi liên tục thiếu định hướng.',
    conditions: ['Tử Vi và Phá Quân đồng cung', 'Thường tại Sửu hoặc Mùi'],
  },
  {
    id: 'tu-tham-dong-cung',
    name: 'Tử Tham đồng cung',
    level: 'trung bình',
    description:
      'Tử Vi và Tham Lang đồng cung tạo thành cách Tử Tham đồng cung, sự kết hợp giữa quyền uy và dục vọng. ' +
      'Đương số có sức hút mạnh, khéo giao tiếp và dễ được lòng người khác. ' +
      'Cách cục này chủ về đào hoa, tài lộc nhưng cũng tiềm ẩn nhiều phức tạp trong tình cảm. ' +
      'Cần giữ nguyên tắc sống rõ ràng, tránh sa vào cám dỗ và thị phi. ' +
      'Nếu biết tiết chế, đương số có thể thành công trong kinh doanh và nghệ thuật.',
    conditions: ['Tử Vi và Tham Lang đồng cung', 'Thường tại Mão hoặc Dậu'],
  },
  {
    id: 'co-luong-dong-cung',
    name: 'Cơ Lương đồng cung',
    level: 'tốt',
    description:
      'Thiên Cơ và Thiên Lương đồng cung tạo thành cách Cơ Lương đồng cung, biểu tượng của trí tuệ và lòng nhân hậu. ' +
      'Đương số thông minh, ham học hỏi và có khả năng phân tích sắc bén. ' +
      'Cách cục này chủ về học vấn, thi cử và những nghề cần chất xám. ' +
      'Phù hợp với giáo dục, nghiên cứu, y tế, luật hoặc tư vấn. ' +
      'Cần tránh suy nghĩ quá nhiều dẫn đến do dự và bỏ lỡ cơ hội.',
    conditions: ['Thiên Cơ và Thiên Lương đồng cung', 'Thường tại Thìn hoặc Tuất'],
  },
  {
    id: 'dong-am-dong-cung',
    name: 'Đồng Âm đồng cung',
    level: 'trung bình',
    description:
      'Thiên Đồng và Thái Âm đồng cung tạo thành cách Đồng Âm đồng cung, sự hòa quyện giữa cảm xúc và trực giác. ' +
      'Đương số có tâm hồn nhạy cảm, giàu lòng thương người và khả năng cảm thụ nghệ thuật tốt. ' +
      'Tuy nhiên, tình cảm thường phức tạp, dễ bị dao động bởi ngoại cảnh. ' +
      'Cần học cách cân bằng cảm xúc và giữ khoảng cách với những mối quan hệ độc hại. ' +
      'Cách này phù hợp với nghệ thuật, tâm lý, giáo dục hoặc công việc chăm sóc.',
    conditions: ['Thiên Đồng và Thái Âm đồng cung', 'Thường tại Tý hoặc Ngọ'],
  },
  {
    id: 'vu-khuc-tham-lang',
    name: 'Vũ Khúc Tham Lang',
    level: 'trung bình',
    description:
      'Vũ Khúc và Tham Lang đồng cung tạo thành cách Vũ Khúc Tham Lang, sự kết hợp giữa tài chính và dục vọng. ' +
      'Đương số có đầu óc kinh doanh nhạy bén, biết nắm bắt cơ hội kiếm tiền. ' +
      'Cách cục này chủ về tài lộc nhưng cũng dễ vướng vào đào hoa và thị phi. ' +
      'Cần đặc biệt thận trọng trong các mối quan hệ hợp tác và chuyện tiền bạc. ' +
      'Nếu biết tiết chế lòng tham, đương số có thể xây dựng sự nghiệp vững chắc.',
    conditions: ['Vũ Khúc và Tham Lang đồng cung', 'Thường tại Sửu hoặc Mùi'],
  },
  {
    id: 'liem-trinh-that-sat',
    name: 'Liêm Trinh Thất Sát',
    level: 'trung bình',
    description:
      'Liêm Trinh và Thất Sát đồng cung tạo thành cách Liêm Trinh Thất Sát, sự kết hợp giữa nguyên tắc và sát khí. ' +
      'Đương số có bản lĩnh mạnh mẽ, quyết đoán và không ngại đối đầu với khó khăn. ' +
      'Cách cục này chủ về quyền lực nhưng cuộc đời dễ rơi vào cô độc và tranh chấp. ' +
      'Cần học cách mềm mỏng, tránh cực đoan và biết lắng nghe người khác. ' +
      'Phù hợp với quân sự, luật pháp, kinh doanh hoặc công tác quản lý.',
    conditions: ['Liêm Trinh và Thất Sát đồng cung', 'Thường tại Sửu hoặc Mùi'],
  },
  {
    id: 'thai-duong-cu-mon',
    name: 'Thái Dương Cự Môn',
    level: 'xấu',
    description:
      'Thái Dương và Cự Môn đồng cung tạo thành cách Thái Dương Cự Môn, sự kết hợp giữa ánh sáng và lời nói. ' +
      'Đương số có tư duy sắc bén, khả năng tranh luận tốt nhưng dễ vướng vào thị phi. ' +
      'Cách cục này chủ về tranh chấp, kiện tụng và những mâu thuẫn trong giao tiếp. ' +
      'Cần học cách kiềm chế lời nói, kiểm tra thông tin trước khi phát ngôn. ' +
      'Nếu biết dùng lời nói để giúp người, đương số có thể thành công trong luật, giáo dục hoặc truyền thông.',
    conditions: ['Thái Dương và Cự Môn đồng cung', 'Thường tại Dần hoặc Thân'],
  },
  {
    id: 'thien-dong-cu-mon',
    name: 'Thiên Đồng Cự Môn',
    level: 'trung bình',
    description:
      'Thiên Đồng và Cự Môn đồng cung tạo thành cách Thiên Đồng Cự Môn, sự kết hợp giữa an nhàn và biến động. ' +
      'Đương số có tính cách hiền hòa nhưng cuộc sống thường xuyên thay đổi, ít khi yên ổn lâu dài. ' +
      'Cách cục này chủ về sự thay đổi công việc, nơi ở hoặc mối quan hệ. ' +
      'Cần học cách thích nghi linh hoạt và giữ tâm bình ổn trước biến động. ' +
      'Nếu biết tận dụng sự thay đổi, đương số có thể mở ra nhiều cơ hội mới.',
    conditions: ['Thiên Đồng và Cự Môn đồng cung', 'Thường tại Sửu hoặc Mùi'],
  },
  {
    id: 'menh-vo-chinh-dieu',
    name: 'Mệnh Vô Chính Diệu',
    level: 'trung bình',
    description:
      'Cung Mệnh không có chính tinh tạo thành cách Mệnh Vô Chính Diệu, phải mượn sao từ cung xung chiếu. ' +
      'Đương số có cuộc đời phụ thuộc nhiều vào hoàn cảnh và sự hỗ trợ của người khác. ' +
      'Tính cách linh hoạt, dễ thích nghi nhưng đôi khi thiếu lập trường và dễ bị ảnh hưởng. ' +
      'Cần phát huy phụ tinh cát, xây dựng bản lĩnh và học cách tự quyết định. ' +
      'Nếu biết mượn thế từ tam phương tứ chính, đương số vẫn có thể thành công.',
    conditions: ['Cung Mệnh không có chính tinh', 'Phải mượn sao từ cung xung chiếu'],
  },
  {
    id: 'than-cu-menh',
    name: 'Thân cư Mệnh',
    level: 'tốt',
    description:
      'Cung Thân trùng với cung Mệnh tạo thành cách Thân cư Mệnh, cuộc đời nhất quán từ đầu đến cuối. ' +
      'Đương số có lý tưởng rõ ràng, sống theo đuổi mục tiêu đã định và ít thay đổi. ' +
      'Cách cục này chủ về sự tự lập, bản lĩnh và khả năng tự quyết định số phận. ' +
      'Càng về hậu vận, thành quả càng bền vững nếu đương số kiên trì. ' +
      'Cần tránh bảo thủ và biết lắng nghe để không bỏ lỡ cơ hội.',
    conditions: ['Cung Thân trùng cung Mệnh', 'Thân và Mệnh cùng một cung'],
  },
  {
    id: 'than-cu-tai',
    name: 'Thân cư Tài',
    level: 'tốt',
    description:
      'Cung Thân trùng với cung Tài Bạch tạo thành cách Thân cư Tài, cuộc đời gắn liền với tài lộc. ' +
      'Đương số coi trọng tiền bạc, giỏi kiếm tiền và biết quản lý chi tiêu. ' +
      'Cách cục này chủ về sự nghiệp kinh doanh, đầu tư hoặc công việc liên quan đến tài chính. ' +
      'Cần tránh đặt nặng vật chất quá mức dẫn đến mất cân bằng cuộc sống. ' +
      'Nếu biết chia sẻ và giữ chữ tín, tài lộc sẽ ngày càng vững bền.',
    conditions: ['Cung Thân trùng cung Tài Bạch', 'Cuộc đời gắn với tài lộc'],
  },
  {
    id: 'than-cu-quan',
    name: 'Thân cư Quan',
    level: 'tốt',
    description:
      'Cung Thân trùng với cung Quan Lộc tạo thành cách Thân cư Quan, cuộc đời gắn liền với sự nghiệp. ' +
      'Đương số có chí hướng lớn, ham công danh và thường đặt công việc lên hàng đầu. ' +
      'Cách cục này chủ về sự thăng tiến, quyền lực và thành tựu trong nghề nghiệp. ' +
      'Cần chú ý cân bằng giữa công việc và gia đình để tránh cô đơn. ' +
      'Nếu biết hợp tác và khiêm tốn, đương số sẽ được cấp trên và đồng nghiệp quý trọng.',
    conditions: ['Cung Thân trùng cung Quan Lộc', 'Cuộc đời gắn với sự nghiệp'],
  },
  {
    id: 'than-cu-di',
    name: 'Thân cư Di',
    level: 'trung bình',
    description:
      'Cung Thân trùng với cung Thiên Di tạo thành cách Thân cư Di, cuộc đời gắn liền với sự di chuyển. ' +
      'Đương số thích khám phá, dễ thay đổi nơi ở và thường thành công khi hoạt động xa nhà. ' +
      'Cách cục này chủ về xuất ngoại, kinh doanh lưu động hoặc công việc cần giao tiếp rộng. ' +
      'Cần học cách ổn định cảm xúc và giữ liên lạc với gia đình. ' +
      'Nếu biết tận dụng mạng lưới quan hệ, đương số có thể mở rộng sự nghiệp nhanh chóng.',
    conditions: ['Cung Thân trùng cung Thiên Di', 'Cuộc đời gắn với di chuyển'],
  },
  {
    id: 'than-cu-phu-the',
    name: 'Thân cư Phu Thê',
    level: 'trung bình',
    description:
      'Cung Thân trùng với cung Phu Thê tạo thành cách Thân cư Phu Thê, cuộc đời gắn liền với hôn nhân và gia đình. ' +
      'Đương số coi trọng tình cảm, biết chăm sóc người thân và thường đặt gia đình lên hàng đầu. ' +
      'Cách cục này chủ về hôn nhân êm ấm, được bạn đời hỗ trợ trong sự nghiệp. ' +
      'Cần tránh phụ thuộc quá mức và giữ không gian riêng cho bản thân. ' +
      'Nếu biết dung hòa, cuộc sống gia đình sẽ là chỗ dựa vững chắc.',
    conditions: ['Cung Thân trùng cung Phu Thê', 'Cuộc đời gắn với gia đình'],
  },
  {
    id: 'than-cu-phuc-duc',
    name: 'Thân cư Phúc Đức',
    level: 'tốt',
    description:
      'Cung Thân trùng với cung Phúc Đức tạo thành cách Thân cư Phúc Đức, cuộc đời gắn liền với phúc phần và hưởng thụ. ' +
      'Đương số thường được thừa hưởng phúc khí từ gia đình, sống an nhàn và ít bon chen. ' +
      'Cách cục này chủ về sự bình an, may mắn và được quý nhân phù trợ. ' +
      'Cần biết trân trọng những gì đang có và tránh ỷ lại vào may mắn. ' +
      'Nếu biết tích đức, phúc phần sẽ ngày càng dày thêm.',
    conditions: ['Cung Thân trùng cung Phúc Đức', 'Cuộc đời gắn với phúc phần'],
  },
  {
    id: 'menh-manh-than-yeu',
    name: 'Mệnh mạnh Thân yếu',
    level: 'trung bình',
    description:
      'Mệnh mạnh hơn Thân tạo thành thế đầu xuôi đuôi lọt, khởi đầu thuận lợi nhưng hậu vận cần nỗ lực. ' +
      'Đương số có nền tảng tốt, được gia đình hỗ trợ và có nhiều cơ hội trong giai đoạn đầu đời. ' +
      'Tuy nhiên, về sau đương số cần tự lập nhiều hơn để duy trì thành quả. ' +
      'Cách cục này nhắc nhở phải chuẩn bị kỹ cho tương lai, tránh chủ quan. ' +
      'Nếu biết tiết kiệm và trau dồi bản lĩnh, đương số vẫn giữ được vị thế ổn định.',
    conditions: ['Cung Mệnh mạnh hơn cung Thân', 'Khởi đầu thuận lợi, hậu vận cần cố gắng'],
  },
  {
    id: 'menh-yeu-than-manh',
    name: 'Mệnh yếu Thân mạnh',
    level: 'tốt',
    description:
      'Mệnh yếu hơn Thân tạo thành thế hậu vận tốt, khởi đầu vất vả nhưng càng về sau càng thuận lợi. ' +
      'Đương số có thể gặp nhiều khó khăn trong giai đoạn đầu đời nhưng dần khẳng định được bản thân. ' +
      'Cách cục này chủ về sự trưởng thành từ thử thách và thành công bền vững ở tuổi trung niên. ' +
      'Cần kiên nhẫn, không bỏ cuộc giữa chừng và biết học hỏi từ thất bại. ' +
      'Nếu biết nắm bắt cơ hội, hậu vận sẽ rất sung túc.',
    conditions: ['Cung Thân mạnh hơn cung Mệnh', 'Hậu vận tốt hơn tiền vận'],
  },
  {
    id: 'tu-linh-hoi-tu',
    name: 'Tứ Linh hội tụ',
    level: 'tốt',
    description:
      'Long Trì, Phụng Các, Hồng Loan và Đào Hoa hội tụ tạo thành cách Tứ Linh, biểu tượng của sự quý hiển. ' +
      'Đương số có dung mạo thanh tú, khí chất sang trọng và sức hút tự nhiên. ' +
      'Cách cục này chủ về danh tiếng, hôn nhân tốt đẹp và được quý nhân phù trợ. ' +
      'Phù hợp với nghệ thuật, truyền thông, ngoại giao hoặc công việc cần hình ảnh cá nhân. ' +
      'Cần giữ phẩm hạnh và tránh kiêu ngạo để bảo vệ vận may.',
    conditions: ['Long Trì, Phụng Các, Hồng Loan, Đào Hoa hội tụ', 'Thường trong tam phương tứ chính'],
  },
];

/** Bảng tam phương tứ chính dùng nội bộ để tránh phụ thuộc vòng. */
const RELATED_PALACE_IDS: Readonly<Record<PalaceId, readonly PalaceId[]>> = {
  menh: ['taiBach', 'quanLoc', 'thienDi'],
  phuMau: ['noBoc', 'tatAch', 'tuTuc'],
  phucDuc: ['taiBach', 'thienDi', 'phuThe'],
  dienTrach: ['tatAch', 'tuTuc', 'huynhDe'],
  quanLoc: ['menh', 'taiBach', 'phuThe'],
  noBoc: ['phuMau', 'tuTuc', 'huynhDe'],
  thienDi: ['menh', 'phucDuc', 'phuThe'],
  tatAch: ['phuMau', 'dienTrach', 'huynhDe'],
  taiBach: ['menh', 'phucDuc', 'quanLoc'],
  tuTuc: ['phuMau', 'dienTrach', 'noBoc'],
  phuThe: ['phucDuc', 'quanLoc', 'thienDi'],
  huynhDe: ['dienTrach', 'noBoc', 'tatAch'],
};

/** Các nhóm tam hợp địa chi. */
const TAM_HOP_GROUPS: readonly (readonly EarthlyBranch[])[] = [
  ['ty', 'thin', 'than'],
  ['suu', 'ti', 'dau'],
  ['dan', 'ngo', 'tuat'],
  ['mao', 'mui', 'hoi'],
];

/** Điểm độ sáng dùng để so sánh mạnh yếu giữa Mệnh và Thân. */
const BRIGHTNESS_SCORE: Readonly<Record<BrightnessLevel, number>> = {
  mieu: 3,
  vuong: 2,
  dac: 1,
  binh: 0,
  ham: -2,
};

type CombinationDetector = (chart: ZiweiChart) => boolean;

function getMenh(chart: ZiweiChart): Palace | undefined {
  return chart.palaces.find((palace) => palace.id === 'menh');
}

function getBodyPalace(chart: ZiweiChart): Palace | undefined {
  const byFlag = chart.palaces.find((palace) => palace.isBodyPalace);
  if (byFlag) return byFlag;

  const bodyBranch = chart.heavenPlate?.bodyPalaceBranch;
  return bodyBranch
    ? chart.palaces.find((palace) => palace.branch === bodyBranch)
    : undefined;
}

function getRelatedPalaces(chart: ZiweiChart, palace: Palace): Palace[] {
  return RELATED_PALACE_IDS[palace.id]
    .map((id) => chart.palaces.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Palace => Boolean(candidate));
}

function getMenhTamPhuong(chart: ZiweiChart): Palace[] {
  const menh = getMenh(chart);
  if (!menh) return [];
  return [menh, ...getRelatedPalaces(chart, menh)];
}

function hasStarAtBranch(chart: ZiweiChart, star: string, branch: EarthlyBranch): boolean {
  return chart.palaces.some(
    (palace) => palace.branch === branch && palaceHasStar(palace, star)
  );
}

function chartHasAllStars(chart: ZiweiChart, stars: readonly string[]): boolean {
  return stars.every((star) =>
    chart.palaces.some((palace) => palaceHasStar(palace, star))
  );
}

function areInSameTamHop(chart: ZiweiChart, stars: readonly string[]): boolean {
  const branches: EarthlyBranch[] = [];

  for (const star of stars) {
    const palace = chart.palaces.find((candidate) => palaceHasStar(candidate, star));
    if (!palace) return false;
    branches.push(palace.branch);
  }

  return TAM_HOP_GROUPS.some((group) =>
    branches.every((branch) => group.includes(branch))
  );
}

function palaceStrength(palace: Palace): number {
  const majorScore = palace.majorStars.reduce(
    (score, star) => score + (BRIGHTNESS_SCORE[star.brightness ?? 'binh'] ?? 0),
    0
  );

  return majorScore + palace.auspiciousStars.length - palace.maleficStars.length;
}

const DETECTORS: Readonly<Record<string, CombinationDetector>> = {
  'thach-trung-an-ngoc': (chart) => {
    const menh = getMenh(chart);
    if (!menh) return false;

    return (
      palaceHasStar(menh, 'tuVi') &&
      (menh.branch === 'thin' || menh.branch === 'tuat') &&
      palaceHasAnyStar(menh, ['vanXuong', 'vanKhuc'])
    );
  },
  'nhat-nguyet-tinh-minh': (chart) =>
    hasStarAtBranch(chart, 'thaiDuong', 'mao') &&
    hasStarAtBranch(chart, 'thaiAm', 'hoi'),
  'co-nguyet-dong-luong': (chart) => {
    const palaces = getMenhTamPhuong(chart);
    return ['thienCo', 'thaiAm', 'thienLuong'].every((star) =>
      palaces.some((palace) => palaceHasStar(palace, star))
    );
  },
  'sat-pha-tham': (chart) =>
    areInSameTamHop(chart, ['thatSat', 'phaQuan', 'thamLang']),
  'phu-tuong-trieu-vien': (chart) => {
    const palaces = getMenhTamPhuong(chart);
    return ['thienPhu', 'thienTuong'].every((star) =>
      palaces.some((palace) => palaceHasStar(palace, star))
    );
  },
  'duong-da-hoa-linh': (chart) =>
    chartHasAllStars(chart, ['kinhDuong', 'daLa', 'hoaTinh', 'linhTinh']),
  'khong-kiep-lam-than': (chart) => {
    const bodyPalace = getBodyPalace(chart);
    if (!bodyPalace) return false;

    const palaces = [bodyPalace, ...getRelatedPalaces(chart, bodyPalace)];
    return ['diaKhong', 'diaKiep'].every((star) =>
      palaces.some((palace) => palaceHasStar(palace, star))
    );
  },
  'loc-ma-giao-tri': (chart) =>
    chart.palaces.some(
      (palace) =>
        palaceHasStar(palace, 'locTon') && palaceHasStar(palace, 'thienMa')
    ),
  'song-loc-giap-menh': (chart) => {
    const menh = getMenh(chart);
    if (!menh) return false;

    const menhPosition = chart.palaces.findIndex((palace) => palace.id === menh.id);
    const previous =
      chart.palaces[(menhPosition - 1 + chart.palaces.length) % chart.palaces.length];
    const next = chart.palaces[(menhPosition + 1) % chart.palaces.length];

    const hasLoc = (palace: Palace): boolean =>
      palaceHasStar(palace, 'locTon') ||
      [...palace.majorStars, ...palace.auspiciousStars, ...palace.otherStars].some(
        (star) => star.mutagen === 'hoaLoc'
      );

    return hasLoc(previous) && hasLoc(next);
  },
  'nguyet-lang-thien-mon': (chart) => hasStarAtBranch(chart, 'thaiAm', 'hoi'),
  'tu-phu-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['tuVi', 'thienPhu'])),
  'tu-sat-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['tuVi', 'thatSat'])),
  'tu-pha-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['tuVi', 'phaQuan'])),
  'tu-tham-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['tuVi', 'thamLang'])),
  'co-luong-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['thienCo', 'thienLuong'])),
  'dong-am-dong-cung': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['thienDong', 'thaiAm'])),
  'vu-khuc-tham-lang': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['vuKhuc', 'thamLang'])),
  'liem-trinh-that-sat': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['liemTrinh', 'thatSat'])),
  'thai-duong-cu-mon': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['thaiDuong', 'cuMon'])),
  'thien-dong-cu-mon': (chart) =>
    chart.palaces.some((palace) => palaceHasAllStars(palace, ['thienDong', 'cuMon'])),
  'menh-vo-chinh-dieu': (chart) => {
    const menh = getMenh(chart);
    return Boolean(menh && menh.majorStars.length === 0);
  },
  'than-cu-menh': (chart) => getBodyPalace(chart)?.id === 'menh',
  'than-cu-tai': (chart) => getBodyPalace(chart)?.id === 'taiBach',
  'than-cu-quan': (chart) => getBodyPalace(chart)?.id === 'quanLoc',
  'than-cu-di': (chart) => getBodyPalace(chart)?.id === 'thienDi',
  'than-cu-phu-the': (chart) => getBodyPalace(chart)?.id === 'phuThe',
  'than-cu-phuc-duc': (chart) => getBodyPalace(chart)?.id === 'phucDuc',
  'menh-manh-than-yeu': (chart) => {
    const menh = getMenh(chart);
    const body = getBodyPalace(chart);
    return Boolean(menh && body && palaceStrength(menh) > palaceStrength(body));
  },
  'menh-yeu-than-manh': (chart) => {
    const menh = getMenh(chart);
    const body = getBodyPalace(chart);
    return Boolean(menh && body && palaceStrength(menh) < palaceStrength(body));
  },
  'tu-linh-hoi-tu': (chart) => {
    const palaces = getMenhTamPhuong(chart);
    return ['longTri', 'phuongCac', 'hongLoan', 'daoHoa'].every((star) =>
      palaces.some((palace) => palaceHasStar(palace, star))
    );
  },
};

/**
 * Nhận diện các cách cục nâng cao có trong lá số.
 *
 * @param chart - Lá số Tử Vi.
 * @returns Danh sách mã cách cục được nhận diện.
 */
export function detectAdvancedCombinations(chart: ZiweiChart): string[] {
  return ADVANCED_COMBINATIONS.filter((combination) => {
    const detector = DETECTORS[combination.id];
    return detector ? detector(chart) : false;
  }).map((combination) => combination.id);
}
