import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thiên Đồng là sao phúc tinh, chủ về may mắn, hưởng thụ và nhân duyên',
  career: 'Sự nghiệp êm ả, được quý nhân phù trợ',
  love: 'Tình cảm hài hòa, dễ được yêu thương',
  health: 'Sức khỏe ổn định, cần tránh ăn uống quá độ',
  advice: 'Nên biết hài lòng, tích lũy phúc đức',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thiên Đồng Miếu địa tạo mẫu người hiền hòa, dễ chịu và có duyên với may mắn. ' +
        'Đương số có tinh thần lạc quan, biết hưởng thụ cuộc sống và thường được quý nhân giúp đỡ. ' +
        'Phù hợp với công việc dịch vụ, du lịch, ẩm thực hoặc chăm sóc sức khỏe. ' +
        'Cuộc sống nhìn chung an nhàn, ít sóng gió nếu biết giữ thái độ lạc quan.',
      career:
        'Sự nghiệp êm ả, đương số dễ được đồng nghiệp yêu mến và cấp trên hỗ trợ. ' +
        'Phù hợp với ngành dịch vụ, du lịch, nhà hàng hoặc chăm sóc khách hàng. ' +
        'Cần tránh thói quen ỷ lại và thiếu mục tiêu dài hạn.',
      love:
        'Tình cảm hài hòa, đương số biết quan tâm và tạo không khí ấm áp. ' +
        'Tuy nhiên đôi khi quá dễ dãi khiến đối phương thiếu cảm giác an toàn. ' +
        'Cần thể hiện sự nghiêm túc và cam kết rõ ràng.',
      health:
        'Sức khỏe ổn định, tinh thần thoải mái. ' +
        'Cần chú ý cân nặng và các bệnh do ăn uống quá độ.',
      advice:
        'Tận hưởng cuộc sống nhưng vẫn cần mục tiêu rõ ràng. ' +
        'Tránh ỷ lại vào may mắn và chủ động xây dựng tương lai.',
    },
    vuong: {
      meaning:
        'Thiên Đồng Vượng địa cho thấy đương số có sức hút, khéo léo và dễ tạo thiện cảm. ' +
        'Bản tính vui vẻ, biết cân bằng giữa công việc và hưởng thụ. ' +
        'Phù hợp với kinh doanh dịch vụ, giải trí hoặc các ngành cần giao tiếp. ' +
        'Cần tránh chi tiêu hoang phí và thói quen trì hoãn.',
      career:
        'Công việc thuận lợi nhờ khả năng giao tiếp và tạo dựng quan hệ. ' +
        'Phù hợp với du lịch, nhà hàng, khách sạn hoặc marketing. ' +
        'Nên đặt mục tiêu cụ thể để tránh lãng phí thời gian và nguồn lực.',
      love:
        'Tình cảm vui vẻ, đương số biết tạo bất ngờ và mang lại niềm vui cho đối phương. ' +
        'Đôi khi sự dễ dãi khiến người khác hiểu lầm. ' +
        'Cần rõ ràng trong các mối quan hệ và tôn trọng cam kết.',
      health:
        'Thể trạng ổn định, nhưng cần chú ý tiêu hóa và cân nặng. ' +
        'Nên duy trì chế độ ăn uống hợp lý và vận động thường xuyên.',
      advice:
        'Phát huy sự khéo léo và tinh thần lạc quan. ' +
        'Học cách quản lý chi tiêu và cam kết với mục tiêu dài hạn.',
    },
    dac: {
      meaning:
        'Thiên Đồng Đắc địa cho thấy đương số hiền lành, biết quan tâm và có cuộc sống tương đối ổn định. ' +
        'Bản tính dễ chịu, ít tranh giành và thích giúp đỡ người khác. ' +
        'Phù hợp với công việc dịch vụ, giáo dục hoặc công tác xã hội. ' +
        'Cần rèn luyện tính quyết đoán để không bỏ lỡ cơ hội.',
      career:
        'Sự nghiệp ổn định, đương số được đồng nghiệp quý mến. ' +
        'Thích hợp với giáo dục, y tế, dịch vụ hoặc hành chính. ' +
        'Nên chủ động nhận thêm trách nhiệm để phát triển sự nghiệp.',
      love:
        'Tình cảm ấm áp, đương số coi trọng gia đình và sự hòa thuận. ' +
        'Đôi khi thiếu quyết đoán khiến đối phương phải chờ đợi. ' +
        'Cần thẳng thắn bày tỏ mong muốn và kế hoạch tương lai.',
      health:
        'Sức khỏe ổn định, cần chú ý tiêu hóa và cân nặng. ' +
        'Nên duy trì vận động nhẹ và chế độ ăn cân bằng.',
      advice:
        'Giữ tinh thần hòa nhã và biết quan tâm người khác. ' +
        'Rèn luyện tính quyết đoán và tránh trì hoãn.',
    },
    binh: {
      meaning:
        'Thiên Đồng ổn định cho thấy đương số có tính cách ôn hòa nhưng dễ thiếu động lực. ' +
        'Bản tính thích an nhàn, ngại va chạm và ít mạo hiểm. ' +
        'Có thể thành công trong công việc ổn định nếu biết kiên trì. ' +
        'Cần đặt mục tiêu rõ ràng để tránh sống buông thả.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội thăng tiến. ' +
        'Phù hợp với công việc hành chính, dịch vụ hoặc kỹ thuật. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tạo bước đột phá.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự yên bình. ' +
        'Đôi khi thiếu chủ động khiến mối quan hệ trở nên nhàm chán. ' +
        'Cần tạo không gian mới và thể hiện cảm xúc nhiều hơn.',
      health:
        'Sức khỏe ở mức ổn định, cần chú ý cân nặng và tiêu hóa. ' +
        'Nên vận động thường xuyên và hạn chế đồ ăn nhanh.',
      advice:
        'Đặt mục tiêu cụ thể và cam kết thực hiện. ' +
        'Tránh để sự thoải mái biến thành lối sống thụ động.',
    },
    ham: {
      meaning:
        'Thiên Đồng Hãm địa khiến đương số dễ ỷ lại, thiếu động lực và ngại khó khăn. ' +
        'Bản tính vẫn hiền lành nhưng dễ bị lợi dụng hoặc thiếu chính kiến. ' +
        'Công việc dễ gặp trở ngại vì thiếu sự nỗ lực và kỷ luật. ' +
        'Cần học cách tự lập và đối diện với thử thách.',
      career:
        'Sự nghiệp nhiều thử thách, dễ bị tụt lại nếu không chủ động. ' +
        'Nên chọn công việc có hướng dẫn rõ ràng và tránh môi trường cạnh tranh gay gắt. ' +
        'Kiên trì học hỏi sẽ giúp cải thiện năng lực và vị trí.',
      love:
        'Tình cảm dễ gặp hiểu lầm do thiếu chủ động và thiếu cam kết. ' +
        'Đương số cần học cách chịu trách nhiệm với cảm xúc của mình. ' +
        'Sự chân thành và nhất quán sẽ giúp xây dựng niềm tin.',
      health:
        'Cần chú ý sức khỏe tinh thần, cân nặng và tiêu hóa. ' +
        'Nên xây dựng lối sống kỷ luật và vận động đều đặn.',
      advice:
        'Xây dựng tính tự lập và kỷ luật bản thân. ' +
        'Đặt mục tiêu nhỏ rồi tăng dần để tạo động lực.',
    },
  },
};

export const THIEN_DONG_MEANINGS = buildMajorStarMeanings(
  'thienDong' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
