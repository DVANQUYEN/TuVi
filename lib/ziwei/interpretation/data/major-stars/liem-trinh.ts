import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Liêm Trinh là sao công danh, chủ về danh dự, liêm khiết và sự nghiệp',
  career: 'Sự nghiệp cần uy tín, thích hợp quản lý nhân sự',
  love: 'Tình cảm nghiêm túc, đòi hỏi sự chung thủy',
  health: 'Cần chú ý huyết áp và tim mạch',
  advice: 'Nên giữ gìn danh tiếng, tránh tham lam vật chất',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Liêm Trinh Miếu địa tạo mẫu người chính trực, kỷ luật và có uy tín cao. ' +
        'Đương số coi trọng danh dự, sống có nguyên tắc và thường được giao trọng trách. ' +
        'Phù hợp với luật, quản lý nhân sự, hành chính hoặc các vị trí cần sự công bằng. ' +
        'Nhiều người thành công trong lĩnh vực tư pháp, giáo dục hoặc quản trị tổ chức.',
      career:
        'Sự nghiệp thăng tiến nhờ uy tín và sự chính trực. ' +
        'Phù hợp với luật, tư pháp, quản lý nhân sự hoặc khu vực công. ' +
        'Cần tránh quá cứng nhắc để duy trì sự hòa hợp với đồng nghiệp.',
      love:
        'Tình cảm nghiêm túc, đương số coi trọng sự chung thủy và trách nhiệm. ' +
        'Đôi khi sự nguyên tắc khiến đối phương cảm thấy bị gò bó. ' +
        'Cần học cách linh hoạt và lắng nghe cảm xúc của nhau.',
      health:
        'Sức khỏe khá tốt nhưng cần chú ý tim mạch và huyết áp. ' +
        'Nên tránh căng thẳng kéo dài và duy trì lối sống điều độ.',
      advice:
        'Giữ vững sự chính trực và uy tín. ' +
        'Học cách mềm mỏng hơn trong giao tiếp để tránh gây áp lực cho người khác.',
    },
    vuong: {
      meaning:
        'Liêm Trinh Vượng địa cho thấy đương số có tinh thần trách nhiệm, kỷ luật và biết giữ chữ tín. ' +
        'Bản tính nghiêm túc, thích sự rõ ràng và ghét sự thiếu công bằng. ' +
        'Phù hợp với quản lý, luật, giáo dục hoặc các vai trò giám sát. ' +
        'Cần tránh thói quen phán xét và đòi hỏi quá cao ở người khác.',
      career:
        'Công việc thuận lợi nhờ uy tín và năng lực tổ chức. ' +
        'Phù hợp với quản lý nhân sự, luật, hành chính hoặc giám sát chất lượng. ' +
        'Nên xây dựng văn hóa làm việc tích cực thay vì chỉ dựa vào kỷ luật.',
      love:
        'Tình cảm ổn định, đương số là người đáng tin cậy và có trách nhiệm. ' +
        'Tuy nhiên sự nghiêm khắc đôi khi khiến đối phương khó gần. ' +
        'Cần thể hiện sự quan tâm bằng lời nói và hành động nhẹ nhàng hơn.',
      health:
        'Thể trạng tốt, nhưng cần chú ý tim mạch và huyết áp. ' +
        'Nên duy trì vận động và tránh thức khuya.',
      advice:
        'Phát huy tinh thần kỷ luật và chính trực. ' +
        'Học cách bao dung và tôn trọng sự khác biệt của người khác.',
    },
    dac: {
      meaning:
        'Liêm Trinh Đắc địa cho thấy đương số có ý thức trách nhiệm và biết giữ gìn danh dự. ' +
        'Bản tính cẩn thận, trung thực và coi trọng nguyên tắc. ' +
        'Phù hợp với công việc hành chính, kế toán hoặc quản lý nhân sự. ' +
        'Cần tránh quá cầu toàn khiến bản thân và người khác căng thẳng.',
      career:
        'Sự nghiệp ổn định nhờ sự đáng tin cậy và tinh thần trách nhiệm. ' +
        'Thích hợp với hành chính, kế toán, nhân sự hoặc giáo dục. ' +
        'Nên học cách giao việc và tin tưởng đồng nghiệp để giảm áp lực.',
      love:
        'Tình cảm chân thành, đương số coi trọng sự chung thủy và an toàn. ' +
        'Đôi khi thiếu sự lãng mạn khiến mối quan hệ trở nên khô khan. ' +
        'Hãy học cách bày tỏ cảm xúc và tạo bất ngờ nhỏ.',
      health:
        'Sức khỏe ổn định, cần chú ý huyết áp và tim mạch. ' +
        'Nên giảm căng thẳng bằng cách sắp xếp công việc hợp lý.',
      advice:
        'Giữ vững sự trung thực và trách nhiệm. ' +
        'Học cách linh hoạt và bao dung hơn trong các mối quan hệ.',
    },
    binh: {
      meaning:
        'Liêm Trinh Bình hòa cho thấy đương số có ý thức về đúng sai nhưng đôi khi thiếu quyết tâm theo đuổi. ' +
        'Bản tính hiền lành, ít tranh giành và thích sự ổn định. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần rèn luyện bản lĩnh để bảo vệ quan điểm chính đáng.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc hành chính, kế toán hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng cơ hội thăng tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe trung bình, cần chú ý huyết áp và tim mạch. ' +
        'Nên duy trì chế độ ăn uống lành mạnh và vận động đều đặn.',
      advice:
        'Rèn luyện bản lĩnh và sự tự tin. ' +
        'Đừng ngại lên tiếng bảo vệ điều đúng đắn.',
    },
    ham: {
      meaning:
        'Liêm Trinh Hãm địa khiến đương số dễ gặp mâu thuẫn giữa nguyên tắc và thực tế. ' +
        'Bản tính có thể trở nên cứng nhắc hoặc dễ dao động khi bị áp lực. ' +
        'Công việc dễ gặp trục trặc liên quan đến danh dự và chữ tín. ' +
        'Cần học cách linh hoạt và giữ vững giá trị cốt lõi.',
      career:
        'Sự nghiệp nhiều thử thách, dễ gặp tranh chấp hoặc hiểu lầm. ' +
        'Nên chọn công việc ít va chạm và tránh tham gia vào các cuộc tranh đấu quyền lực. ' +
        'Kiên trì xây dựng uy tín sẽ giúp cải thiện vị thế.',
      love:
        'Tình cảm dễ gặp sóng gió do bất đồng quan điểm và thiếu sự thấu hiểu. ' +
        'Đương số cần học cách lắng nghe và tôn trọng cảm xúc đối phương. ' +
        'Sự chân thành sẽ giúp hàn gắn các rạn nứt.',
      health:
        'Cần chú ý huyết áp, tim mạch và sức khỏe tinh thần. ' +
        'Nên tránh căng thẳng kéo dài và duy trì lối sống lành mạnh.',
      advice:
        'Giữ vững giá trị cốt lõi nhưng linh hoạt trong cách ứng xử. ' +
        'Học cách buông bỏ những tranh chấp không cần thiết.',
    },
  },
};

export const LIEM_TRINH_MEANINGS = buildMajorStarMeanings(
  'liemTrinh' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
