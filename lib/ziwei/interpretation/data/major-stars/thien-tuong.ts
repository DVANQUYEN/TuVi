import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thiên Tướng là sao phụ tá, chủ về sự trợ giúp, trung thành và ổn định',
  career: 'Sự nghiệp phát triển nhờ hợp tác, thích hợp làm phụ tá',
  love: 'Tình cảm tin tưởng, là chỗ dựa vững chắc',
  health: 'Sức khỏe ổn định, cần tránh lo âu',
  advice: 'Nên phát huy tinh thần đồng đội, trung thành với mục tiêu',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thiên Tướng Miếu địa tạo mẫu người trung thành, đáng tin cậy và có khả năng hỗ trợ tập thể. ' +
        'Đương số sống có trách nhiệm, biết dung hòa các mối quan hệ và thường được cấp trên tin tưởng. ' +
        'Phù hợp với quản lý nhân sự, hành chính, ngoại giao hoặc các vai trò cố vấn. ' +
        'Cuộc sống nhìn chung ổn định nếu biết phát huy tinh thần hợp tác.',
      career:
        'Sự nghiệp vững chắc nhờ sự trung thành và khả năng phối hợp. ' +
        'Phù hợp với quản lý nhân sự, hành chính, ngoại giao hoặc trợ lý lãnh đạo. ' +
        'Cần tránh đứng sau quá lâu mà không dám thể hiện năng lực.',
      love:
        'Tình cảm bền vững, đương số là chỗ dựa đáng tin cậy cho đối phương. ' +
        'Đôi khi sự nhường nhịn quá mức khiến bản thân thiệt thòi. ' +
        'Cần học cách bày tỏ nhu cầu và cảm xúc của mình.',
      health:
        'Sức khỏe ổn định, tinh thần thoải mái. ' +
        'Cần chú ý các bệnh do lo âu và làm việc quá sức.',
      advice:
        'Phát huy tinh thần trung thành và khả năng hợp tác. ' +
        'Học cách tự tin thể hiện ý kiến và nhận vai trò lãnh đạo khi cần.',
    },
    vuong: {
      meaning:
        'Thiên Tướng Vượng địa cho thấy đương số khéo léo, biết lắng nghe và có năng lực dung hòa xung đột. ' +
        'Bản tính trung thực, coi trọng chữ tín và các mối quan hệ lâu dài. ' +
        'Phù hợp với nhân sự, ngoại giao, tư vấn hoặc quản lý dự án. ' +
        'Cần tránh thói quen hy sinh bản thân quá mức.',
      career:
        'Công việc thuận lợi nhờ khả năng phối hợp và xây dựng quan hệ. ' +
        'Phù hợp với nhân sự, ngoại giao, tư vấn hoặc quản lý dự án. ' +
        'Nên học cách đưa ra quyết định độc lập thay vì chỉ dựa vào người khác.',
      love:
        'Tình cảm ấm áp, đương số biết quan tâm và tôn trọng đối phương. ' +
        'Đôi khi sự nhường nhịn khiến đối phương không nhận ra mong muốn thật của đương số. ' +
        'Cần thẳng thắn chia sẻ để tránh tích tụ ấm ức.',
      health:
        'Thể trạng ổn định, nhưng cần chú ý hệ tiêu hóa và tinh thần. ' +
        'Nên duy trì vận động và tránh lo âu quá mức.',
      advice:
        'Tận dụng khả năng dung hòa và xây dựng quan hệ. ' +
        'Học cách bảo vệ quyền lợi chính đáng của bản thân.',
    },
    dac: {
      meaning:
        'Thiên Tướng Đắc địa cho thấy đương số hiền lành, trung thực và có tinh thần trách nhiệm. ' +
        'Bản tính biết quan tâm, thích giúp đỡ người khác và coi trọng sự hòa thuận. ' +
        'Phù hợp với hành chính, nhân sự, giáo dục hoặc công tác xã hội. ' +
        'Cần rèn luyện tính quyết đoán để không bị động.',
      career:
        'Sự nghiệp ổn định nhờ sự đáng tin cậy và tinh thần hợp tác. ' +
        'Thích hợp với hành chính, nhân sự, giáo dục hoặc dịch vụ. ' +
        'Nên chủ động nhận thêm trách nhiệm để phát triển sự nghiệp.',
      love:
        'Tình cảm chân thành, đương số coi trọng sự chung thủy và trách nhiệm. ' +
        'Đôi khi thiếu sự lãng mạn khiến mối quan hệ trở nên đơn điệu. ' +
        'Hãy chủ động tạo bất ngờ và thể hiện tình cảm nhiều hơn.',
      health:
        'Sức khỏe ổn định, cần chú ý tiêu hóa và tinh thần. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động nhẹ.',
      advice:
        'Giữ vững sự trung thực và tinh thần trách nhiệm. ' +
        'Học cách tự tin hơn và đưa ra quyết định của riêng mình.',
    },
    binh: {
      meaning:
        'Thiên Tướng ổn định cho thấy đương số có tinh thần hợp tác nhưng đôi khi thiếu chính kiến. ' +
        'Bản tính hiền lành, ít tranh giành và thích sự ổn định. ' +
        'Có thể thành công trong công việc hỗ trợ nếu kiên trì. ' +
        'Cần rèn luyện sự tự tin và khả năng ra quyết định.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc hành chính, hỗ trợ hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng cơ hội thăng tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe ở mức ổn định, cần chú ý tiêu hóa và tinh thần. ' +
        'Nên vận động thường xuyên và giữ tâm trạng lạc quan.',
      advice:
        'Rèn luyện sự tự tin và khả năng ra quyết định. ' +
        'Đừng ngại thể hiện ý kiến và nhận vai trò mới.',
    },
    ham: {
      meaning:
        'Thiên Tướng Hãm địa khiến đương số dễ thiếu chính kiến và bị ảnh hưởng bởi người khác. ' +
        'Bản tính vẫn hiền lành nhưng đôi khi nhường nhịn quá mức dẫn đến thiệt thòi. ' +
        'Công việc dễ gặp trở ngại vì thiếu quyết đoán. ' +
        'Cần học cách tự lập và bảo vệ quan điểm của mình.',
      career:
        'Sự nghiệp nhiều thử thách, dễ bị giao việc mà không được ghi nhận. ' +
        'Nên chọn môi trường làm việc rõ ràng và tránh bị lợi dụng. ' +
        'Kiên trì học hỏi và thể hiện năng lực sẽ giúp cải thiện vị thế.',
      love:
        'Tình cảm dễ gặp hiểu lầm do thiếu chia sẻ và hay nhường nhịn. ' +
        'Đương số cần học cách bày tỏ nhu cầu và cảm xúc của mình. ' +
        'Sự chân thành và thẳng thắn sẽ giúp mối quan hệ cân bằng hơn.',
      health:
        'Cần chú ý sức khỏe tinh thần, tiêu hóa và giấc ngủ. ' +
        'Nên tránh lo âu kéo dài và duy trì lối sống lành mạnh.',
      advice:
        'Học cách tự lập và bảo vệ quyền lợi chính đáng. ' +
        'Đừng hy sinh bản thân quá mức để làm hài lòng người khác.',
    },
  },
};

export const THIEN_TUONG_MEANINGS = buildMajorStarMeanings(
  'thienTuong' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
