import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Vũ Khúc là sao tài bạch, chủ về tài chính, quyết đoán và công lý',
  career: 'Sự nghiệp liên quan đến tiền bạc, quản lý',
  love: 'Tình cảm thực tế, cần sự chân thành',
  health: 'Cần chú ý hô hấp và da liễu',
  advice: 'Nên quản lý tài chính chặt chẽ, tránh hành động liều lĩnh',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Vũ Khúc Miếu địa tạo mẫu người quyết đoán, thực tế và có duyên với tài chính. ' +
        'Đương số giỏi tính toán, biết quản lý tiền bạc và thường đạt thành tựu trong kinh doanh. ' +
        'Phù hợp với ngân hàng, kế toán, đầu tư hoặc bất động sản. ' +
        'Nhiều người trở thành chuyên gia tài chính hoặc chủ doanh nghiệp thành đạt.',
      career:
        'Sự nghiệp phát triển mạnh nhờ khả năng quản lý nguồn lực và ra quyết định dứt khoát. ' +
        'Phù hợp với tài chính, ngân hàng, bất động sản hoặc điều hành doanh nghiệp. ' +
        'Cần tránh quá cứng nhắc để duy trì sự hợp tác lâu dài.',
      love:
        'Tình cảm thực tế, đương số quan tâm đến đối phương bằng hành động hơn lời nói. ' +
        'Đôi khi sự tập trung vào công việc khiến người bạn đời cảm thấy thiếu lãng mạn. ' +
        'Cần học cách thể hiện cảm xúc và dành thời gian cho gia đình.',
      health:
        'Sức khỏe khá tốt nhưng cần chú ý hệ hô hấp và da liễu. ' +
        'Nên tránh làm việc quá sức và duy trì chế độ nghỉ ngơi hợp lý.',
      advice:
        'Phát huy khả năng quản lý tài chính và tính quyết đoán. ' +
        'Học cách mềm mỏng hơn trong giao tiếp để tránh mất lòng người khác.',
    },
    vuong: {
      meaning:
        'Vũ Khúc Vượng địa cho thấy đương số có đầu óc kinh doanh và khả năng nắm bắt cơ hội tài chính. ' +
        'Bản tính chăm chỉ, kỷ luật và coi trọng hiệu quả công việc. ' +
        'Thích hợp với quản lý tài sản, đầu tư hoặc vận hành doanh nghiệp. ' +
        'Cần tránh đặt nặng vật chất đến mức bỏ qua cảm xúc.',
      career:
        'Công việc thuận lợi, dễ được giao trọng trách về tài chính hoặc vận hành. ' +
        'Phù hợp với ngân hàng, chứng khoán, bất động sản hoặc quản lý dự án. ' +
        'Nên cân bằng giữa mục tiêu lợi nhuận và trách nhiệm xã hội.',
      love:
        'Tình cảm ổn định, đương số là người đáng tin cậy và có trách nhiệm. ' +
        'Tuy nhiên sự thực dụng đôi khi khiến đối phương cảm thấy thiếu sự đồng cảm. ' +
        'Cần lắng nghe và chia sẻ cảm xúc nhiều hơn.',
      health:
        'Thể trạng tốt, nhưng cần chú ý hô hấp và các bệnh do căng thẳng. ' +
        'Nên duy trì thói quen vận động và nghỉ ngơi đều đặn.',
      advice:
        'Tận dụng khả năng tài chính để tạo nền tảng vững chắc. ' +
        'Học cách cân bằng giữa công việc và đời sống tình cảm.',
    },
    dac: {
      meaning:
        'Vũ Khúc Đắc địa cho thấy đương số cẩn thận, có trách nhiệm và biết quý trọng đồng tiền. ' +
        'Bản tính thực tế, thích sự rõ ràng và ghét sự giả dối. ' +
        'Phù hợp với kế toán, quản lý tài sản hoặc công việc hành chính. ' +
        'Cần tránh quá tiết kiệm đến mức bỏ lỡ cơ hội đầu tư hợp lý.',
      career:
        'Sự nghiệp ổn định nhờ tính cẩn thận và đáng tin cậy. ' +
        'Thích hợp với kế toán, kiểm toán, quản lý kho hoặc hành chính. ' +
        'Nên học thêm kỹ năng đầu tư để tận dụng tốt hơn nguồn lực hiện có.',
      love:
        'Tình cảm bền vững, đương số coi trọng sự chân thành và trách nhiệm. ' +
        'Đôi khi cách thể hiện tình cảm quá khô khan khiến đối phương thiếu cảm xúc. ' +
        'Hãy học cách nói lời yêu thương và tạo bất ngờ nhỏ.',
      health:
        'Sức khỏe ổn định, cần chú ý da liễu và hô hấp. ' +
        'Nên vận động thường xuyên để tăng sức đề kháng.',
      advice:
        'Giữ vững tính cẩn thận và trách nhiệm. ' +
        'Mở lòng hơn với những cơ hội mới và học cách linh hoạt trong chi tiêu.',
    },
    binh: {
      meaning:
        'Vũ Khúc Bình hòa cho thấy đương số có ý thức tiết kiệm nhưng chưa thật sự nhạy bén với tài chính. ' +
        'Bản tính hiền lành, ít mạo hiểm và thích sự ổn định. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần nâng cao kiến thức tài chính để cải thiện thu nhập.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc văn phòng, kế toán hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng giá trị bản thân.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự an toàn và ổn định. ' +
        'Đôi khi thiếu sự lãng mạn khiến mối quan hệ trở nên đơn điệu. ' +
        'Cần chủ động tạo không gian mới và thể hiện cảm xúc nhiều hơn.',
      health:
        'Sức khỏe trung bình, cần chú ý hô hấp và tiêu hóa. ' +
        'Nên duy trì chế độ ăn uống cân bằng và vận động nhẹ.',
      advice:
        'Chủ động nâng cao kỹ năng tài chính và nghề nghiệp. ' +
        'Đừng ngại thay đổi để tạo bước tiến mới.',
    },
    ham: {
      meaning:
        'Vũ Khúc Hãm địa khiến đương số dễ gặp khó khăn về tiền bạc và dễ đưa ra quyết định tài chính thiếu sáng suốt. ' +
        'Bản tính có thể trở nên cứng nhắc hoặc cố chấp khi bị áp lực. ' +
        'Công việc dễ gặp trục trặc liên quan đến hợp đồng, giấy tờ. ' +
        'Cần học cách quản lý tài chính chặt chẽ và tránh đầu tư mạo hiểm.',
      career:
        'Sự nghiệp nhiều thử thách, dễ gặp thất bại trong kinh doanh nếu nóng vội. ' +
        'Nên chọn công việc ổn định, tránh vay nợ để đầu tư rủi ro. ' +
        'Kiên nhẫn tích lũy sẽ giúp cải thiện tình hình tài chính.',
      love:
        'Tình cảm dễ gặp xung đột do bất đồng về tiền bạc hoặc quan điểm sống. ' +
        'Đương số cần học cách chia sẻ và tôn trọng ý kiến đối phương. ' +
        'Minh bạch trong chi tiêu sẽ giúp giảm bớt căng thẳng.',
      health:
        'Cần chú ý hệ hô hấp, da liễu và các bệnh do căng thẳng. ' +
        'Nên tránh làm việc quá sức và duy trì lối sống lành mạnh.',
      advice:
        'Lập kế hoạch tài chính rõ ràng và tránh quyết định cảm tính. ' +
        'Học cách mềm mỏng và lắng nghe để cải thiện các mối quan hệ.',
    },
  },
};

export const VU_KHUC_MEANINGS = buildMajorStarMeanings(
  'vuKhuc' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
