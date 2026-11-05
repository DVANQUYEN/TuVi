import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Cự Môn là sao khẩu thiệt, chủ về ăn nói, tranh cãi và sự nghiệp biến động',
  career: 'Sự nghiệp cần giao tiếp, dễ gặp thị phi',
  love: 'Tình cảm nhiều lỗi nhỏ, cần hòa nhã',
  health: 'Cần chú ý đường ruột và hệ tiêu hóa',
  advice: 'Nên cẩn thận lời nói, tránh đắc tội với người khác',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Cự Môn Miếu địa tạo mẫu người ăn nói có duyên, lập luận sắc bén và khả năng phân tích tốt. ' +
        'Đương số có thể trở thành người truyền đạt hiệu quả, luật sư hoặc nhà đàm phán. ' +
        'Phù hợp với luật, giáo dục, truyền thông hoặc kinh doanh. ' +
        'Cần tránh dùng lời nói để tranh hơn thua.',
      career:
        'Sự nghiệp phát triển nhờ khả năng diễn đạt và thuyết phục. ' +
        'Phù hợp với luật, tư vấn, giáo dục, bán hàng hoặc truyền thông. ' +
        'Cần xây dựng uy tín bằng sự chân thành thay vì chỉ dựa vào lời nói.',
      love:
        'Tình cảm sâu sắc nhưng đương số dễ tranh luận với đối phương. ' +
        'Cần học cách lắng nghe và tôn trọng quan điểm của nhau. ' +
        'Sự hài hước và nhường nhịn sẽ giúp mối quan hệ bền vững.',
      health:
        'Sức khỏe khá tốt nhưng cần chú ý họng, phổi và tiêu hóa. ' +
        'Nên tránh nói quá nhiều và duy trì lối sống điều độ.',
      advice:
        'Phát huy khả năng diễn đạt và phân tích. ' +
        'Học cách lắng nghe và dùng lời nói để xây dựng thay vì tranh cãi.',
    },
    vuong: {
      meaning:
        'Cự Môn Vượng địa cho thấy đương số thông minh, khéo ăn nói và có khả năng thuyết phục người khác. ' +
        'Bản tính thẳng thắn, thích tranh luận để tìm ra chân lý. ' +
        'Phù hợp với luật, tư vấn, truyền thông hoặc các công việc cần giao tiếp. ' +
        'Cần tránh lời nói sắc bén làm tổn thương người khác.',
      career:
        'Công việc thuận lợi nhờ khả năng giao tiếp và đàm phán. ' +
        'Phù hợp với luật, tư vấn, bán hàng, giáo dục hoặc truyền thông. ' +
        'Nên rèn luyện sự khéo léo để tránh mất lòng đồng nghiệp.',
      love:
        'Tình cảm nồng nhiệt nhưng dễ nảy sinh tranh cãi vì cả hai đều có chính kiến. ' +
        'Đương số cần học cách nhường nhịn và lắng nghe. ' +
        'Sự thấu hiểu sẽ giúp hóa giải mâu thuẫn.',
      health:
        'Thể trạng ổn, nhưng cần chú ý họng, phổi và tiêu hóa. ' +
        'Nên tránh căng thẳng và duy trì chế độ ăn uống lành mạnh.',
      advice:
        'Dùng khả năng ăn nói để truyền đạt tích cực. ' +
        'Học cách kiềm chế và tôn trọng cảm xúc của người khác.',
    },
    dac: {
      meaning:
        'Cự Môn Đắc địa cho thấy đương số cẩn thận trong lời nói, có khả năng phân tích và tư duy logic. ' +
        'Bản tính trung thực, thích tìm hiểu vấn đề đến cùng. ' +
        'Phù hợp với kế toán, nghiên cứu, giáo dục hoặc hành chính. ' +
        'Cần tránh thói quen chỉ trích và đòi hỏi sự hoàn hảo.',
      career:
        'Sự nghiệp ổn định nhờ khả năng phân tích và sự cẩn thận. ' +
        'Thích hợp với kế toán, nghiên cứu, giáo dục hoặc hành chính. ' +
        'Nên học cách giao tiếp mềm mỏng để xây dựng quan hệ tốt hơn.',
      love:
        'Tình cảm chân thành nhưng đương số đôi khi quá lý trí. ' +
        'Đối phương có thể cảm thấy thiếu sự lãng mạn. ' +
        'Hãy học cách bày tỏ cảm xúc và tạo bất ngờ nhỏ.',
      health:
        'Sức khỏe ổn định, cần chú ý họng, phổi và tiêu hóa. ' +
        'Nên duy trì vận động và tránh căng thẳng kéo dài.',
      advice:
        'Phát huy khả năng phân tích và tư duy logic. ' +
        'Học cách giao tiếp khéo léo và tránh chỉ trích người khác.',
    },
    binh: {
      meaning:
        'Cự Môn Bình hòa cho thấy đương số có khả năng ăn nói nhưng đôi khi thiếu tự tin. ' +
        'Bản tính hiền lành, ít tranh cãi và thích sự ổn định. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần rèn luyện sự tự tin và kỹ năng giao tiếp.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc văn phòng, kế toán hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng giá trị bản thân.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe trung bình, cần chú ý họng, phổi và tiêu hóa. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động nhẹ.',
      advice:
        'Rèn luyện sự tự tin và kỹ năng giao tiếp. ' +
        'Đừng ngại thể hiện ý kiến và bảo vệ quan điểm chính đáng.',
    },
    ham: {
      meaning:
        'Cự Môn Hãm địa tạo cách dễ gặp thị phi và tranh chấp trong quan hệ xã hội. ' +
        'Đương số có tính thẳng thắn, đôi khi quá thẳng khiến người khác phật ý. ' +
        'Công việc dễ gặp trục trặc vì lời nói và giấy tờ. ' +
        'Tuy nhiên nếu biết kiềm chế, đương số có thể trở thành luật sư hoặc nhà đàm phán giỏi.',
      career:
        'Sự nghiệp thường gặp thăng trầm, dễ có tranh chấp với đồng nghiệp và cấp trên. ' +
        'Phù hợp với ngành luật, tư vấn hoặc các công việc cần tranh luận, đàm phán. ' +
        'Cần học cách giao tiếp khéo léo và tránh thẳng thắn quá mức.',
      love:
        'Tình cảm thường có nhiều hiểu lầm và tranh cãi với người yêu hoặc vợ chồng. ' +
        'Đương số cần học cách lắng nghe và thấu hiểu đối phương. ' +
        'Nên chọn người biết nhường nhịn và bao dung.',
      health:
        'Sức khỏe trung bình, cần chú ý họng, phổi và tiêu hóa. ' +
        'Căng thẳng do thị phi có thể ảnh hưởng đến tinh thần, nên tập thiền hoặc yoga để giảm căng thẳng.',
      advice:
        'Học cách giao tiếp khéo léo và tránh nói thẳng quá mức. ' +
        'Kiềm chế thói quen tranh luận và tránh tham gia vào thị phi, đàm tiếu.',
    },
  },
};

export const CU_MON_MEANINGS = buildMajorStarMeanings(
  'cuMon' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
