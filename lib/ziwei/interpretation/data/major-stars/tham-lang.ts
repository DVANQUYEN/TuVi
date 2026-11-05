import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Tham Lang là sao dục vọng, chủ về ham muốn, giao tiếp và tài lộc đa biến',
  career: 'Sự nghiệp đa dạng, thích hợp kinh doanh và nghệ thuật',
  love: 'Tình cảm phong phú, dễ rung động',
  health: 'Cần chú ý thận và đường tiêu hóa',
  advice: 'Nên kiềm chế dục vọng, chọn lối sống lành mạnh',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Tham Lang Miếu địa tạo mẫu người đa tài, khéo giao tiếp và có sức hút mạnh mẽ. ' +
        'Đương số có tham vọng, biết nắm bắt cơ hội và thường thành công trong kinh doanh hoặc nghệ thuật. ' +
        'Phù hợp với giải trí, kinh doanh, marketing hoặc các ngành cần sự sáng tạo. ' +
        'Cần tránh để dục vọng và lối sống hưởng thụ chi phối.',
      career:
        'Sự nghiệp đa dạng, đương số dễ thành công nhờ khả năng giao tiếp và sáng tạo. ' +
        'Phù hợp với kinh doanh, giải trí, marketing hoặc nghệ thuật. ' +
        'Cần tránh ôm đồm nhiều dự án cùng lúc để đảm bảo chất lượng.',
      love:
        'Tình cảm phong phú, đương số biết tạo sự hấp dẫn và lãng mạn. ' +
        'Tuy nhiên sự đa tình có thể khiến đối phương thiếu an tâm. ' +
        'Cần học cách cam kết và tôn trọng ranh giới trong các mối quan hệ.',
      health:
        'Sức khỏe khá tốt nhưng cần chú ý thận, gan và đường tiêu hóa. ' +
        'Nên hạn chế rượu bia và duy trì lối sống lành mạnh.',
      advice:
        'Phát huy sự sáng tạo và khả năng giao tiếp. ' +
        'Học cách kiềm chế dục vọng và xây dựng lối sống cân bằng.',
    },
    vuong: {
      meaning:
        'Tham Lang Vượng địa cho thấy đương số năng động, khéo léo và có nhiều mối quan hệ. ' +
        'Bản tính thích khám phá, ham học hỏi và dễ tạo thiện cảm. ' +
        'Phù hợp với kinh doanh, truyền thông, du lịch hoặc nghệ thuật. ' +
        'Cần tránh thói quen tham lam và thiếu kiên định.',
      career:
        'Công việc thuận lợi nhờ khả năng kết nối và nắm bắt xu hướng. ' +
        'Phù hợp với kinh doanh, marketing, du lịch hoặc giải trí. ' +
        'Nên tập trung vào một mục tiêu chính để tránh phân tán nguồn lực.',
      love:
        'Tình cảm sôi nổi, đương số biết tạo bất ngờ và mang lại niềm vui cho đối phương. ' +
        'Tuy nhiên sự ham vui có thể khiến người khác hiểu lầm. ' +
        'Cần rõ ràng trong cam kết và tôn trọng cảm xúc của nhau.',
      health:
        'Thể trạng tốt, nhưng cần chú ý gan, thận và tiêu hóa. ' +
        'Nên hạn chế đồ uống có cồn và duy trì vận động.',
      advice:
        'Tận dụng sự năng động và khả năng kết nối. ' +
        'Học cách kiềm chế và tập trung vào mục tiêu dài hạn.',
    },
    dac: {
      meaning:
        'Tham Lang Đắc địa cho thấy đương số hoạt bát, khéo léo và có nhiều sở thích. ' +
        'Bản tính thích giao tiếp, ham học hỏi nhưng đôi khi thiếu kiên nhẫn. ' +
        'Phù hợp với kinh doanh, dịch vụ hoặc các công việc cần sự linh hoạt. ' +
        'Cần rèn luyện tính kỷ luật để phát huy hết tiềm năng.',
      career:
        'Sự nghiệp ổn định nhờ khả năng thích nghi và giao tiếp. ' +
        'Thích hợp với kinh doanh, dịch vụ, du lịch hoặc marketing. ' +
        'Nên đặt ra kế hoạch cụ thể và kiên trì theo đuổi.',
      love:
        'Tình cảm vui vẻ, đương số biết quan tâm và tạo không khí thoải mái. ' +
        'Đôi khi sự ham vui khiến đối phương thiếu cảm giác an toàn. ' +
        'Cần thể hiện sự nghiêm túc và cam kết rõ ràng.',
      health:
        'Sức khỏe ổn định, cần chú ý gan, thận và tiêu hóa. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động đều đặn.',
      advice:
        'Phát huy sự linh hoạt và khả năng giao tiếp. ' +
        'Học cách kiên định và tránh phân tán năng lượng.',
    },
    binh: {
      meaning:
        'Tham Lang Bình hòa cho thấy đương số có nhiều sở thích nhưng đôi khi thiếu mục tiêu rõ ràng. ' +
        'Bản tính vui vẻ, thích giao lưu nhưng dễ bị cuốn theo đám đông. ' +
        'Có thể thành công trong công việc dịch vụ nếu biết tập trung. ' +
        'Cần rèn luyện tính kỷ luật và khả năng quản lý thời gian.',
      career:
        'Sự nghiệp bình ổn, ít đột phá nếu không chủ động. ' +
        'Phù hợp với công việc dịch vụ, bán hàng hoặc hành chính. ' +
        'Nên đặt mục tiêu cụ thể và tránh thay đổi quá nhiều.',
      love:
        'Tình cảm nhẹ nhàng, đương số thích tạo không khí vui vẻ. ' +
        'Đôi khi thiếu sự sâu sắc khiến đối phương cảm thấy thiếu an toàn. ' +
        'Cần lắng nghe và chia sẻ cảm xúc nhiều hơn.',
      health:
        'Sức khỏe trung bình, cần chú ý gan, thận và tiêu hóa. ' +
        'Nên hạn chế đồ ăn nhiều dầu mỡ và duy trì vận động.',
      advice:
        'Tập trung vào một mục tiêu chính và kiên trì theo đuổi. ' +
        'Học cách quản lý thời gian và chi tiêu hợp lý.',
    },
    ham: {
      meaning:
        'Tham Lang Hãm địa khiến đương số dễ bị cuốn vào dục vọng và lối sống hưởng thụ. ' +
        'Bản tính vẫn hoạt bát nhưng đôi khi thiếu kiềm chế và dễ mắc sai lầm. ' +
        'Công việc dễ gặp trục trặc vì thiếu tập trung và kỷ luật. ' +
        'Cần học cách kiểm soát bản thân và xây dựng lối sống lành mạnh.',
      career:
        'Sự nghiệp nhiều thử thách, dễ gặp thất bại nếu làm việc theo cảm hứng. ' +
        'Nên chọn công việc ổn định và tránh đầu tư mạo hiểm. ' +
        'Kiên trì học hỏi và rèn luyện kỷ luật sẽ giúp cải thiện tình hình.',
      love:
        'Tình cảm dễ gặp sóng gió do thiếu cam kết và dễ bị cám dỗ. ' +
        'Đương số cần học cách chịu trách nhiệm với cảm xúc của mình. ' +
        'Sự chân thành và nhất quán sẽ giúp xây dựng niềm tin.',
      health:
        'Cần chú ý gan, thận, tiêu hóa và sức khỏe tinh thần. ' +
        'Nên hạn chế rượu bia, thức khuya và duy trì lối sống lành mạnh.',
      advice:
        'Học cách kiềm chế dục vọng và xây dựng kỷ luật bản thân. ' +
        'Đặt mục tiêu rõ ràng và tránh xa những cám dỗ không có lợi.',
    },
  },
};

export const THAM_LANG_MEANINGS = buildMajorStarMeanings(
  'thamLang' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
