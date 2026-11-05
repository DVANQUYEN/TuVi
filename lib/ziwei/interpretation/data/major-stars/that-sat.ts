import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thất Sát là sao uy võ, chủ về quyền lực, quyết đoán và biến động',
  career: 'Sự nghiệp đầy thách thức, cần dũng cảm đương đầu',
  love: 'Tình cảm mãnh liệt, dễ có xung đột',
  health: 'Cần chú ý tai nạn và bệnh đột ngột',
  advice: 'Nên kiềm chế bản tính nóng nảy, tính toán kỹ trước khi hành động',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thất Sát Miếu địa tạo mẫu người mạnh mẽ, quyết đoán và có ý chí tiến thủ. ' +
        'Đương số dám nghĩ dám làm, không ngại thử thách và thường đạt thành tựu trong môi trường cạnh tranh. ' +
        'Phù hợp với quân sự, thể thao, kinh doanh hoặc khởi nghiệp. ' +
        'Cần học cách tiết chế nóng nảy để tránh quyết định sai lầm.',
      career:
        'Sự nghiệp phát triển mạnh nhờ bản lĩnh và tinh thần tiên phong. ' +
        'Phù hợp với khởi nghiệp, quân sự, thể thao hoặc quản lý dự án. ' +
        'Cần tránh hành động bốc đồng và tính toán kỹ hậu quả trước khi quyết định.',
      love:
        'Tình cảm mãnh liệt, đương số yêu hết mình và bảo vệ người mình yêu. ' +
        'Tuy nhiên sự nóng nảy có thể gây xung đột. ' +
        'Cần học cách lắng nghe và nhường nhịn để mối quan hệ bền vững.',
      health:
        'Sức khỏe tốt nhưng cần chú ý tai nạn và các bệnh đột ngột. ' +
        'Nên tránh làm việc quá sức và duy trì lối sống điều độ.',
      advice:
        'Phát huy bản lĩnh và tinh thần tiên phong. ' +
        'Học cách kiềm chế nóng nảy và lắng nghe ý kiến của người khác.',
    },
    vuong: {
      meaning:
        'Thất Sát Vượng địa cho thấy đương số có nghị lực, dám đương đầu và luôn hướng về phía trước. ' +
        'Bản tính mạnh mẽ, coi trọng danh dự và không thích sự ràng buộc. ' +
        'Phù hợp với kinh doanh, thể thao, quân sự hoặc các lĩnh vực cần sự quyết đoán. ' +
        'Cần tránh độc đoán và bỏ qua ý kiến tập thể.',
      career:
        'Công việc thuận lợi nhờ tinh thần quyết đoán và khả năng chịu áp lực. ' +
        'Phù hợp với kinh doanh, thể thao, quân sự hoặc quản lý dự án. ' +
        'Nên học cách hợp tác và chia sẻ quyền quyết định khi cần.',
      love:
        'Tình cảm mạnh mẽ, đương số sẵn sàng bảo vệ người mình yêu. ' +
        'Tuy nhiên sự cứng rắn có thể khiến đối phương cảm thấy bị áp đặt. ' +
        'Cần học cách mềm mỏng và tôn trọng cảm xúc của nhau.',
      health:
        'Thể trạng tốt, nhưng cần chú ý tai nạn và các bệnh liên quan đến huyết áp. ' +
        'Nên duy trì vận động và tránh căng thẳng kéo dài.',
      advice:
        'Dùng nghị lực để theo đuổi mục tiêu dài hạn. ' +
        'Học cách lắng nghe và tôn trọng ý kiến của tập thể.',
    },
    dac: {
      meaning:
        'Thất Sát Đắc địa cho thấy đương số có bản lĩnh, cẩn thận và biết tính toán trước khi hành động. ' +
        'Bản tính mạnh mẽ nhưng biết tiết chế, coi trọng trách nhiệm. ' +
        'Phù hợp với quản lý, kỹ thuật, thể thao hoặc công việc cần sự quyết đoán. ' +
        'Cần tránh quá cứng nhắc khiến đồng nghiệp khó gần.',
      career:
        'Sự nghiệp ổn định nhờ bản lĩnh và tinh thần trách nhiệm. ' +
        'Thích hợp với quản lý, kỹ thuật, thể thao hoặc hành chính. ' +
        'Nên học cách linh hoạt hơn trong giao tiếp để xây dựng quan hệ tốt hơn.',
      love:
        'Tình cảm chân thành, đương số là người đáng tin cậy và có trách nhiệm. ' +
        'Đôi khi sự nghiêm túc khiến mối quan hệ thiếu sự lãng mạn. ' +
        'Hãy học cách bày tỏ cảm xúc và tạo bất ngờ nhỏ.',
      health:
        'Sức khỏe ổn định, cần chú ý tai nạn và huyết áp. ' +
        'Nên duy trì chế độ ăn uống lành mạnh và vận động đều đặn.',
      advice:
        'Phát huy bản lĩnh và tinh thần trách nhiệm. ' +
        'Học cách mềm mỏng và linh hoạt trong các mối quan hệ.',
    },
    binh: {
      meaning:
        'Thất Sát Bình hòa cho thấy đương số có ý chí nhưng đôi khi thiếu quyết tâm theo đuổi đến cùng. ' +
        'Bản tính khá mạnh mẽ nhưng dễ dao động khi gặp khó khăn. ' +
        'Có thể thành công trong công việc ổn định nếu kiên trì. ' +
        'Cần rèn luyện tính kỷ luật và bản lĩnh.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc kỹ thuật, hành chính hoặc dịch vụ. ' +
        'Nên đặt mục tiêu rõ ràng và kiên trì theo đuổi để tạo bước tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe trung bình, cần chú ý tai nạn và huyết áp. ' +
        'Nên vận động thường xuyên và tránh căng thẳng kéo dài.',
      advice:
        'Rèn luyện tính kỷ luật và kiên trì. ' +
        'Đừng bỏ cuộc giữa chừng khi gặp khó khăn.',
    },
    ham: {
      meaning:
        'Thất Sát Hãm địa khiến đương số dễ nóng nảy, bốc đồng và đưa ra quyết định thiếu suy xét. ' +
        'Bản tính mạnh mẽ nhưng đôi khi cứng nhắc và khó hợp tác. ' +
        'Công việc dễ gặp trục trặc vì xung đột với đồng nghiệp. ' +
        'Cần học cách kiềm chế cảm xúc và tính toán kỹ trước khi hành động.',
      career:
        'Sự nghiệp nhiều thử thách, dễ gặp xung đột và thay đổi liên tục. ' +
        'Nên chọn công việc ổn định, ít va chạm và tránh đầu tư mạo hiểm. ' +
        'Kiên trì học hỏi và rèn luyện kỷ luật sẽ giúp cải thiện tình hình.',
      love:
        'Tình cảm dễ gặp sóng gió do nóng nảy và thiếu nhường nhịn. ' +
        'Đương số cần học cách lắng nghe và tôn trọng cảm xúc đối phương. ' +
        'Sự chân thành và kiên nhẫn sẽ giúp hàn gắn mối quan hệ.',
      health:
        'Cần chú ý tai nạn, huyết áp và sức khỏe tinh thần. ' +
        'Nên tránh làm việc quá sức và duy trì lối sống lành mạnh.',
      advice:
        'Học cách kiềm chế nóng nảy và suy nghĩ kỹ trước khi hành động. ' +
        'Rèn luyện tính hợp tác và lắng nghe người khác.',
    },
  },
};

export const THAT_SAT_MEANINGS = buildMajorStarMeanings(
  'thatSat' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
