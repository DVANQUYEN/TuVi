import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Tử Vi là đế tinh, chủ về quyền lực, lãnh đạo, quý hiển',
  career: 'Sự nghiệp thăng tiến, có vị trí cao',
  love: 'Tình cảm vững bền, được tôn trọng',
  health: 'Sức khỏe tốt, tinh thần minh mẫn',
  advice: 'Nên phát huy khả năng lãnh đạo, giúp đỡ người khác',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Tử Vi tọa Mệnh tạo cách "Quân vương tại vị". ' +
        'Đương số có tố chất lãnh đạo bẩm sinh, được mọi người nể phục và tôn trọng. ' +
        'Thích hợp với vai trò quản lý, chính trị hoặc làm chủ doanh nghiệp. ' +
        'Nhiều người có cách này trở thành CEO, lãnh đạo tổ chức lớn.',
      career:
        'Trong sự nghiệp, người có Tử Vi Miếu địa thường thăng tiến nhanh, được cấp trên tin tưởng và đồng nghiệp nể phục. ' +
        'Phù hợp với ngành quản lý, chính trị, tài chính và bất động sản. ' +
        'Cần tránh độc đoán để duy trì sự ủng hộ lâu dài.',
      love:
        'Về tình cảm, đương số thường tìm được người môn đăng hộ đối và có địa vị tương xứng. ' +
        'Tuy nhiên tính tự cao đôi khi khiến đối phương cảm thấy áp lực. ' +
        'Cần học cách chia sẻ và nhường nhịn trong quan hệ vợ chồng.',
      health:
        'Sức khỏe tốt, tinh thần minh mẫn và ít bệnh tật. ' +
        'Cần chú ý stress do áp lực công việc và dành thời gian nghỉ ngơi hợp lý.',
      advice:
        'Phát huy khả năng lãnh đạo nhưng cần học cách lắng nghe và nhường nhịn. ' +
        'Tránh kiêu ngạo, tự mãn và giữ mối quan hệ tốt với đồng nghiệp, cấp dưới.',
    },
    vuong: {
      meaning:
        'Tử Vi ở thế Vượng địa mang khí chất của người đứng đầu nhưng biết tiết chế. ' +
        'Đương số có tầm nhìn, quyết đoán và được tập thể tín nhiệm. ' +
        'Thích hợp với vai trò quản lý cấp trung hoặc chuyên gia đầu ngành. ' +
        'Thành công đến từ sự cân bằng giữa tham vọng và khả năng lắng nghe.',
      career:
        'Sự nghiệp thuận lợi, có nhiều cơ hội thăng tiến nhờ uy tín và năng lực tổ chức. ' +
        'Phù hợp với quản trị doanh nghiệp, tư vấn chiến lược hoặc khu vực công. ' +
        'Cần tránh ôm đồm để không đánh mất sự cân bằng.',
      love:
        'Tình cảm ổn định, đối phương thường là người trưởng thành và có chí hướng. ' +
        'Đôi khi công việc khiến đương số ít dành thời gian cho gia đình. ' +
        'Nên chủ động sắp xếp thời gian và bày tỏ sự quan tâm nhiều hơn.',
      health:
        'Thể trạng khá tốt nhưng dễ mệt mỏi khi làm việc quá độ. ' +
        'Cần chú ý các bệnh liên quan đến tim mạch và huyết áp.',
      advice:
        'Giữ vững bản lĩnh nhưng mềm mỏng trong giao tiếp. ' +
        'Học cách giao việc và tin tưởng đồng đội để giảm áp lực cho bản thân.',
    },
    dac: {
      meaning:
        'Tử Vi Đắc địa cho thấy đương số có tố chất lãnh đạo nhưng không quá phô trương. ' +
        'Bản tính chững chạc, có trách nhiệm và được người xung quanh tin cậy. ' +
        'Phù hợp với vai trò quản lý nhóm hoặc điều hành công việc chuyên môn. ' +
        'Cần rèn luyện sự tự tin để phát huy hết tiềm năng.',
      career:
        'Sự nghiệp phát triển ổn định, thăng tiến theo năng lực và kinh nghiệm. ' +
        'Thích hợp với các ngành quản lý, giáo dục, hành chính hoặc tài chính. ' +
        'Nên chủ động nhận việc khó để tạo dấu ấn cá nhân.',
      love:
        'Tình cảm chân thành, coi trọng sự tôn trọng lẫn nhau. ' +
        'Đương số cần tránh giữ thể diện quá mức khiến đối phương khó gần. ' +
        'Hãy học cách bộc lộ cảm xúc và chia sẻ khó khăn.',
      health:
        'Sức khỏe ở mức ổn định và ít bệnh nặng. ' +
        'Cần duy trì vận động đều đặn và tránh thức khuya kéo dài.',
      advice:
        'Phát huy tinh thần trách nhiệm và sự chững chạc. ' +
        'Đừng ngại thể hiện quan điểm nhưng cần lắng nghe phản biện.',
    },
    binh: {
      meaning:
        'Tử Vi Bình hòa cho thấy khí chất lãnh đạo có phần mờ nhạt, đương số thiên về ổn định hơn là đột phá. ' +
        'Bản tính điềm đạm, ít tranh giành nhưng đôi khi thiếu quyết đoán. ' +
        'Có thể thành công trong vai trò chuyên môn hoặc hỗ trợ hơn là đứng mũi chịu sào. ' +
        'Cần rèn luyện sự tự tin và kỹ năng ra quyết định.',
      career:
        'Sự nghiệp bình ổn, ít biến động lớn nhưng cũng khó bứt phá nếu không chủ động. ' +
        'Phù hợp với công việc hành chính, kỹ thuật hoặc chuyên môn ổn định. ' +
        'Nên đặt mục tiêu rõ ràng và học thêm kỹ năng quản lý.',
      love:
        'Tình cảm nhẹ nhàng, coi trọng sự bình yên hơn những xúc cảm mãnh liệt. ' +
        'Đôi khi đương số thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn bày tỏ mong muốn và quan tâm đến cảm xúc của nhau.',
      health:
        'Sức khỏe trung bình, dễ mệt mỏi khi căng thẳng kéo dài. ' +
        'Nên chú ý giấc ngủ và chế độ ăn uống cân bằng.',
      advice:
        'Xác định rõ mục tiêu và rèn luyện tính quyết đoán. ' +
        'Tránh để sự do dự khiến cơ hội tốt trôi qua.',
    },
    ham: {
      meaning:
        'Tử Vi Hãm địa cho thấy khí chất lãnh đạo bị suy giảm, đương số dễ cảm thấy lạc lõng giữa tập thể. ' +
        'Bản tính có hoài bão nhưng đôi khi tự cao hoặc bảo thủ khiến người khác khó gần. ' +
        'Công việc dễ gặp trở ngại vì thiếu sự đồng thuận. ' +
        'Cần học cách khiêm tốn và xây dựng quan hệ chân thành.',
      career:
        'Sự nghiệp gặp nhiều thử thách, dễ va chạm với cấp trên hoặc đồng nghiệp. ' +
        'Nên chọn môi trường ít cạnh tranh hoặc công việc chuyên môn độc lập. ' +
        'Cần kiên nhẫn tích lũy kinh nghiệm thay vì nóng vội chứng tỏ bản thân.',
      love:
        'Tình cảm dễ gặp hiểu lầm do tính tự ái và ít chịu lắng nghe. ' +
        'Đương số cần học cách đặt mình vào vị trí đối phương. ' +
        'Sự chân thành và kiên nhẫn sẽ giúp hàn gắn các rạn nứt.',
      health:
        'Cần chú ý sức khỏe tinh thần, đặc biệt là căng thẳng và lo âu. ' +
        'Nên duy trì thói quen vận động và tìm người tin cậy để chia sẻ.',
      advice:
        'Hạ bớt cái tôi, lắng nghe nhiều hơn và học cách hợp tác. ' +
        'Kiên trì xây dựng uy tín từ những việc nhỏ sẽ giúp cải thiện vận thế.',
    },
  },
};

export const TU_VI_MEANINGS = buildMajorStarMeanings(
  'tuVi' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
