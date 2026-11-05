import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thiên Lương là sao phúc thọ, chủ về tuổi thọ, lương thiện và sự che chở',
  career: 'Sự nghiệp êm đềm, được bảo vệ trong khó khăn',
  love: 'Tình cảm ấm áp, có trách nhiệm với gia đình',
  health: 'Sức khỏe tốt, tuổi thọ cao',
  advice: 'Nên sống lương thiện, giúp đỡ người khác',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thiên Lương Miếu địa tạo mẫu người lương thiện, bao dung và có tầm nhìn xa. ' +
        'Đương số sống có trách nhiệm, thích giúp đỡ người khác và thường được quý nhân phù trợ. ' +
        'Phù hợp với giáo dục, y tế, từ thiện, tôn giáo hoặc công tác xã hội. ' +
        'Cuộc sống nhìn chung bình an, tuổi thọ cao nếu biết giữ tâm thiện.',
      career:
        'Sự nghiệp êm đềm, đương số được đồng nghiệp và cấp trên tin tưởng. ' +
        'Phù hợp với giáo dục, y tế, từ thiện hoặc công tác xã hội. ' +
        'Cần tránh quá bao dung dẫn đến bị lợi dụng.',
      love:
        'Tình cảm ấm áp, đương số là chỗ dựa vững chắc cho gia đình. ' +
        'Đôi khi sự nghiêm túc khiến mối quan hệ thiếu sự lãng mạn. ' +
        'Cần học cách tạo không khí vui vẻ và bày tỏ cảm xúc nhiều hơn.',
      health:
        'Sức khỏe tốt, tuổi thọ cao. ' +
        'Cần chú ý hệ tiêu hóa và duy trì lối sống lành mạnh.',
      advice:
        'Phát huy lòng nhân ái và tinh thần trách nhiệm. ' +
        'Học cách bảo vệ bản thân và tránh bị lợi dụng.',
    },
    vuong: {
      meaning:
        'Thiên Lương Vượng địa cho thấy đương số hiền hòa, sâu sắc và có khả năng che chở người khác. ' +
        'Bản tính chín chắn, coi trọng đạo lý và các giá trị truyền thống. ' +
        'Phù hợp với giáo dục, y tế, tư vấn tâm lý hoặc công tác xã hội. ' +
        'Cần tránh thói quen lo xa quá mức khiến bản thân căng thẳng.',
      career:
        'Công việc thuận lợi nhờ uy tín và sự đáng tin cậy. ' +
        'Phù hợp với giáo dục, y tế, tư vấn hoặc quản lý cộng đồng. ' +
        'Nên cân bằng giữa việc giúp đỡ người khác và chăm sóc bản thân.',
      love:
        'Tình cảm bền vững, đương số coi trọng trách nhiệm và sự chung thủy. ' +
        'Đôi khi sự nghiêm khắc khiến đối phương cảm thấy bị áp lực. ' +
        'Cần học cách lắng nghe và tôn trọng cảm xúc của nhau.',
      health:
        'Thể trạng tốt, nhưng cần chú ý tiêu hóa và tinh thần. ' +
        'Nên duy trì vận động và tránh lo lắng quá mức.',
      advice:
        'Phát huy lòng nhân ái và sự chín chắn. ' +
        'Học cách thư giãn và tin tưởng vào khả năng của người khác.',
    },
    dac: {
      meaning:
        'Thiên Lương Đắc địa cho thấy đương số hiền lành, cẩn thận và có tinh thần trách nhiệm. ' +
        'Bản tính coi trọng gia đình, sống có đạo lý và biết quan tâm người khác. ' +
        'Phù hợp với giáo dục, y tế, hành chính hoặc công tác xã hội. ' +
        'Cần tránh quá cầu toàn khiến bản thân mệt mỏi.',
      career:
        'Sự nghiệp ổn định nhờ sự đáng tin cậy và tinh thần trách nhiệm. ' +
        'Thích hợp với giáo dục, y tế, hành chính hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng cơ hội thăng tiến.',
      love:
        'Tình cảm chân thành, đương số coi trọng sự chung thủy và trách nhiệm. ' +
        'Đôi khi thiếu sự lãng mạn khiến mối quan hệ trở nên đơn điệu. ' +
        'Hãy chủ động tạo bất ngờ và thể hiện tình cảm nhiều hơn.',
      health:
        'Sức khỏe ổn định, cần chú ý tiêu hóa và tinh thần. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động nhẹ.',
      advice:
        'Giữ vững lòng nhân ái và tinh thần trách nhiệm. ' +
        'Học cách chấp nhận sự không hoàn hảo và chăm sóc bản thân tốt hơn.',
    },
    binh: {
      meaning:
        'Thiên Lương Bình hòa cho thấy đương số hiền lành nhưng đôi khi thiếu động lực phấn đấu. ' +
        'Bản tính an phận, thích sự yên tĩnh và ít mạo hiểm. ' +
        'Có thể thành công trong công việc ổn định nếu kiên trì. ' +
        'Cần đặt mục tiêu rõ ràng để tránh sống thụ động.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc hành chính, giáo dục hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tạo bước tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe trung bình, cần chú ý tiêu hóa và tinh thần. ' +
        'Nên vận động thường xuyên và giữ tâm trạng tích cực.',
      advice:
        'Đặt mục tiêu cụ thể và chủ động hành động. ' +
        'Tránh để sự an phận biến thành lối sống thụ động.',
    },
    ham: {
      meaning:
        'Thiên Lương Hãm địa khiến đương số dễ lo xa quá mức và thiếu quyết đoán. ' +
        'Bản tính vẫn lương thiện nhưng đôi khi bị lợi dụng vì quá bao dung. ' +
        'Công việc dễ gặp trở ngại vì thiếu sự quyết liệt. ' +
        'Cần học cách bảo vệ bản thân và đưa ra quyết định rõ ràng.',
      career:
        'Sự nghiệp nhiều thử thách, dễ bị giao việc mà không được ghi nhận. ' +
        'Nên chọn môi trường làm việc rõ ràng và tránh bị lợi dụng. ' +
        'Kiên trì học hỏi và thể hiện năng lực sẽ giúp cải thiện vị thế.',
      love:
        'Tình cảm dễ gặp hiểu lầm do thiếu chia sẻ và hay lo xa. ' +
        'Đương số cần học cách bày tỏ nhu cầu và cảm xúc của mình. ' +
        'Sự chân thành và thẳng thắn sẽ giúp mối quan hệ cân bằng hơn.',
      health:
        'Cần chú ý sức khỏe tinh thần, tiêu hóa và giấc ngủ. ' +
        'Nên tránh lo âu kéo dài và duy trì lối sống lành mạnh.',
      advice:
        'Học cách bảo vệ bản thân và nói không khi cần thiết. ' +
        'Đặt mục tiêu rõ ràng và hành động quyết đoán hơn.',
    },
  },
};

export const THIEN_LUONG_MEANINGS = buildMajorStarMeanings(
  'thienLuong' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
