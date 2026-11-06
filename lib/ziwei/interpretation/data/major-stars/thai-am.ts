import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thái Âm là sao âm nhu, chủ về tài lộc, tình cảm và nội tâm',
  career: 'Sự nghiệp phát triển âm thầm, thích hợp nghề dịch vụ',
  love: 'Tình cảm sâu sắc, giàu lòng yêu thương',
  health: 'Cần chú ý hệ tiêu hóa và thận',
  advice: 'Nên nhẫn nại, lắng nghe cảm xúc bản thân',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thái Âm Miếu địa tạo mẫu người dịu dàng, sâu sắc và có trực giác tốt. ' +
        'Đương số giàu cảm xúc, biết quan tâm và thường có duyên với tài lộc. ' +
        'Phù hợp với nghệ thuật, giáo dục, chăm sóc sức khỏe hoặc tài chính. ' +
        'Cuộc sống nhìn chung êm đềm nếu biết cân bằng cảm xúc và lý trí.',
      career:
        'Sự nghiệp phát triển âm thầm nhưng bền vững nhờ sự cẩn thận và khả năng thấu hiểu. ' +
        'Phù hợp với giáo dục, y tế, nghệ thuật, tài chính hoặc dịch vụ. ' +
        'Cần tránh để cảm xúc chi phối các quyết định quan trọng.',
      love:
        'Tình cảm sâu sắc, đương số biết quan tâm và chăm sóc người mình yêu. ' +
        'Đôi khi quá nhạy cảm khiến bản thân dễ tổn thương. ' +
        'Cần học cách bày tỏ cảm xúc và tin tưởng đối phương.',
      health:
        'Sức khỏe ổn định nhưng cần chú ý hệ tiêu hóa và thận. ' +
        'Nên duy trì lối sống điều độ và tránh suy nghĩ bi quan.',
      advice:
        'Phát huy trực giác và sự dịu dàng. ' +
        'Học cách cân bằng cảm xúc và chủ động hơn trong công việc.',
    },
    vuong: {
      meaning:
        'Thái Âm Vượng địa cho thấy đương số tinh tế, khéo léo và có khiếu thẩm mỹ. ' +
        'Bản tính nhẹ nhàng, biết lắng nghe và thường được mọi người yêu mến. ' +
        'Phù hợp với nghệ thuật, truyền thông, giáo dục hoặc chăm sóc khách hàng. ' +
        'Cần tránh thói quen do dự và để cảm xúc lấn át lý trí.',
      career:
        'Công việc thuận lợi nhờ khả năng giao tiếp mềm mỏng và sự tinh tế. ' +
        'Phù hợp với truyền thông, thiết kế, giáo dục hoặc dịch vụ chăm sóc. ' +
        'Nên đặt ra thời hạn rõ ràng để tránh trì hoãn.',
      love:
        'Tình cảm lãng mạn, đương số biết tạo không gian ấm áp cho đối phương. ' +
        'Tuy nhiên sự nhạy cảm có thể khiến cả hai dễ hiểu lầm. ' +
        'Cần thẳng thắn trao đổi và học cách tha thứ.',
      health:
        'Thể trạng ổn, nhưng cần chú ý tiêu hóa, thận và giấc ngủ. ' +
        'Nên dành thời gian thư giãn và tránh thức khuya.',
      advice:
        'Tận dụng sự tinh tế và khả năng thấu hiểu. ' +
        'Học cách quyết đoán và bảo vệ cảm xúc của bản thân.',
    },
    dac: {
      meaning:
        'Thái Âm Đắc địa cho thấy đương số hiền hòa, cẩn thận và có đời sống nội tâm phong phú. ' +
        'Bản tính biết quan tâm, coi trọng gia đình và sự ổn định. ' +
        'Phù hợp với giáo dục, kế toán, chăm sóc sức khỏe hoặc công việc văn phòng. ' +
        'Cần tránh quá khép kín khiến người khác khó tiếp cận.',
      career:
        'Sự nghiệp ổn định nhờ sự cẩn thận và tinh thần trách nhiệm. ' +
        'Thích hợp với giáo dục, y tế, kế toán hoặc hành chính. ' +
        'Nên chủ động thể hiện ý tưởng để được ghi nhận.',
      love:
        'Tình cảm chân thành, đương số coi trọng sự an toàn và chung thủy. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm là lạnh nhạt. ' +
        'Hãy học cách bộc lộ cảm xúc rõ ràng hơn.',
      health:
        'Sức khỏe ổn định, cần chú ý tiêu hóa và thận. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động nhẹ.',
      advice:
        'Giữ sự dịu dàng và tinh tế nhưng cần mạnh dạn hơn trong giao tiếp. ' +
        'Học cách nói ra mong muốn của bản thân.',
    },
    binh: {
      meaning:
        'Thái Âm ổn định cho thấy đương số có đời sống nội tâm phong phú nhưng đôi khi thiếu tự tin. ' +
        'Bản tính hiền lành, ít tranh giành và thích sự yên tĩnh. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần rèn luyện sự tự tin và kỹ năng giao tiếp.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc văn phòng, kế toán hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng mối quan hệ.',
      love:
        'Tình cảm nhẹ nhàng, đương số cần thời gian để mở lòng. ' +
        'Đôi khi sự im lặng khiến đối phương hiểu lầm. ' +
        'Cần chủ động chia sẻ cảm xúc và lắng nghe nhiều hơn.',
      health:
        'Sức khỏe ở mức ổn định, cần chú ý tiêu hóa, thận và tinh thần. ' +
        'Nên vận động thường xuyên và giữ tâm trạng lạc quan.',
      advice:
        'Tăng cường tự tin bằng những mục tiêu nhỏ. ' +
        'Đừng ngại thể hiện bản thân và mở lòng với người khác.',
    },
    ham: {
      meaning:
        'Thái Âm Hãm địa khiến đương số dễ nhạy cảm quá mức, hay lo nghĩ và dễ bị tổn thương. ' +
        'Bản tính vẫn dịu dàng nhưng đôi khi thiếu quyết đoán và dễ dao động. ' +
        'Công việc dễ gặp trở ngại vì thiếu tự tin. ' +
        'Cần học cách cân bằng cảm xúc và xây dựng sự tự tin.',
      career:
        'Sự nghiệp nhiều thử thách, dễ bị ảnh hưởng bởi cảm xúc và môi trường xung quanh. ' +
        'Nên chọn công việc ổn định, ít áp lực và tránh môi trường cạnh tranh gay gắt. ' +
        'Kiên trì học hỏi sẽ giúp cải thiện năng lực.',
      love:
        'Tình cảm dễ gặp sóng gió do nhạy cảm và thiếu chia sẻ. ' +
        'Đương số cần học cách bày tỏ cảm xúc và tôn trọng không gian của đối phương. ' +
        'Sự chân thành và kiên nhẫn sẽ giúp hàn gắn.',
      health:
        'Cần chú ý sức khỏe tinh thần, tiêu hóa và thận. ' +
        'Nên tránh suy nghĩ bi quan và duy trì lối sống lành mạnh.',
      advice:
        'Học cách cân bằng cảm xúc và xây dựng sự tự tin. ' +
        'Tìm người tin cậy để chia sẻ thay vì giữ mọi thứ trong lòng.',
    },
  },
};

export const THAI_AM_MEANINGS = buildMajorStarMeanings(
  'thaiAm' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
