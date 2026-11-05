import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Phá Quân là sao phá cách, chủ về đổi mới, phá vỡ và tái tạo',
  career: 'Sự nghiệp nhiều thay đổi, thích hợp khởi nghiệp hoặc cải tổ',
  love: 'Tình cảm biến động, cần sự tin tưởng',
  health: 'Cần chú ý sức khỏe tinh thần và giấc ngủ',
  advice: 'Nên biến thách thức thành cơ hội, không nên bảo thủ',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Phá Quân Miếu địa tạo mẫu người đổi mới, sáng tạo và dám phá bỏ lối mòn. ' +
        'Đương số có tầm nhìn khác biệt, thích khám phá và thường thành công trong môi trường cần sự đột phá. ' +
        'Phù hợp với khởi nghiệp, công nghệ, nghệ thuật hoặc cải tổ tổ chức. ' +
        'Cần học cách duy trì sự ổn định sau khi đã tạo ra thay đổi.',
      career:
        'Sự nghiệp phát triển nhờ tư duy đổi mới và khả năng thích nghi. ' +
        'Phù hợp với khởi nghiệp, công nghệ, nghệ thuật hoặc tư vấn cải tổ. ' +
        'Cần tránh thay đổi quá nhanh khiến đồng đội khó theo kịp.',
      love:
        'Tình cảm phong phú, đương số biết tạo bất ngờ và làm mới mối quan hệ. ' +
        'Tuy nhiên sự thay đổi thất thường có thể khiến đối phương thiếu an tâm. ' +
        'Cần học cách cam kết và duy trì sự ổn định.',
      health:
        'Sức khỏe khá tốt nhưng cần chú ý sức khỏe tinh thần và giấc ngủ. ' +
        'Nên tránh làm việc quá sức và duy trì lối sống điều độ.',
      advice:
        'Phát huy tinh thần đổi mới và sáng tạo. ' +
        'Học cách duy trì sự ổn định và cam kết với mục tiêu dài hạn.',
    },
    vuong: {
      meaning:
        'Phá Quân Vượng địa cho thấy đương số năng động, sáng tạo và có khả năng tạo ra thay đổi tích cực. ' +
        'Bản tính mạnh mẽ, thích tự do và không ngại thử điều mới. ' +
        'Phù hợp với khởi nghiệp, công nghệ, nghệ thuật hoặc các lĩnh vực cần sự đổi mới. ' +
        'Cần tránh bốc đồng và thiếu kiên định.',
      career:
        'Công việc thuận lợi nhờ tư duy đổi mới và khả năng thích nghi. ' +
        'Phù hợp với khởi nghiệp, công nghệ, truyền thông hoặc nghệ thuật. ' +
        'Nên xây dựng kế hoạch dài hạn để tránh phân tán nguồn lực.',
      love:
        'Tình cảm sôi nổi, đương số biết tạo không khí mới mẻ cho mối quan hệ. ' +
        'Tuy nhiên sự thay đổi có thể khiến đối phương thiếu cảm giác an toàn. ' +
        'Cần rõ ràng trong cam kết và tôn trọng cảm xúc của nhau.',
      health:
        'Thể trạng tốt, nhưng cần chú ý sức khỏe tinh thần và giấc ngủ. ' +
        'Nên duy trì vận động và tránh thức khuya.',
      advice:
        'Tận dụng sự sáng tạo để tạo ra giá trị mới. ' +
        'Học cách kiên định và cam kết với mục tiêu đã chọn.',
    },
    dac: {
      meaning:
        'Phá Quân Đắc địa cho thấy đương số có tư duy đổi mới nhưng biết cân nhắc trước khi hành động. ' +
        'Bản tính năng động, thích học hỏi và không ngại thay đổi. ' +
        'Phù hợp với công việc cần sự sáng tạo, cải tiến quy trình hoặc khởi nghiệp. ' +
        'Cần tránh thay đổi quá nhiều khiến bản thân mất phương hướng.',
      career:
        'Sự nghiệp ổn định nhờ khả năng thích nghi và tinh thần đổi mới. ' +
        'Thích hợp với công nghệ, truyền thông, nghệ thuật hoặc quản lý dự án. ' +
        'Nên đặt mục tiêu rõ ràng và kiên trì theo đuổi.',
      love:
        'Tình cảm chân thành, đương số biết làm mới mối quan hệ và tạo bất ngờ. ' +
        'Đôi khi sự thay đổi khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cam kết rõ ràng.',
      health:
        'Sức khỏe ổn định, cần chú ý sức khỏe tinh thần và giấc ngủ. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động đều đặn.',
      advice:
        'Phát huy tư duy đổi mới nhưng cần kiên định với mục tiêu. ' +
        'Học cách lắng nghe và tôn trọng ý kiến của người khác.',
    },
    binh: {
      meaning:
        'Phá Quân Bình hòa cho thấy đương số có ý muốn đổi mới nhưng đôi khi thiếu quyết tâm. ' +
        'Bản tính năng động nhưng dễ chán nản khi gặp khó khăn. ' +
        'Có thể thành công trong công việc sáng tạo nếu kiên trì. ' +
        'Cần rèn luyện tính kỷ luật và khả năng tập trung.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc sáng tạo, truyền thông hoặc dịch vụ. ' +
        'Nên đặt mục tiêu cụ thể và kiên trì theo đuổi để tạo bước tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số thích tạo không khí mới mẻ. ' +
        'Đôi khi thiếu sự ổn định khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe trung bình, cần chú ý sức khỏe tinh thần và giấc ngủ. ' +
        'Nên vận động thường xuyên và tránh thức khuya.',
      advice:
        'Rèn luyện tính kỷ luật và khả năng tập trung. ' +
        'Đừng bỏ cuộc giữa chừng khi gặp khó khăn.',
    },
    ham: {
      meaning:
        'Phá Quân Hãm địa khiến đương số dễ bốc đồng, thay đổi thất thường và thiếu kiên định. ' +
        'Bản tính mạnh mẽ nhưng đôi khi phá vỡ những thứ tốt đẹp mà không suy xét. ' +
        'Công việc dễ gặp trục trặc vì thiếu sự ổn định. ' +
        'Cần học cách kiềm chế và xây dựng kế hoạch rõ ràng.',
      career:
        'Sự nghiệp nhiều biến động, dễ đổi việc hoặc thất bại trong kinh doanh. ' +
        'Nên chọn công việc ổn định và tránh đầu tư mạo hiểm. ' +
        'Kiên trì học hỏi và rèn luyện kỷ luật sẽ giúp cải thiện tình hình.',
      love:
        'Tình cảm dễ gặp sóng gió do thay đổi thất thường và thiếu cam kết. ' +
        'Đương số cần học cách chịu trách nhiệm với cảm xúc của mình. ' +
        'Sự chân thành và nhất quán sẽ giúp xây dựng niềm tin.',
      health:
        'Cần chú ý sức khỏe tinh thần, giấc ngủ và các bệnh do căng thẳng. ' +
        'Nên xây dựng lối sống kỷ luật và duy trì vận động đều đặn.',
      advice:
        'Học cách kiềm chế bốc đồng và xây dựng kế hoạch dài hạn. ' +
        'Tránh phá bỏ những giá trị tốt đẹp chỉ vì nhất thời nóng vội.',
    },
  },
};

export const PHA_QUAN_MEANINGS = buildMajorStarMeanings(
  'phaQuan' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
