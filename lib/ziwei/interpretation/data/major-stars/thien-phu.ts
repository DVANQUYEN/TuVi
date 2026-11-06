import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thiên Phủ là sao kho tàng, chủ về tích lũy, ổn định và quản lý tài sản',
  career: 'Sự nghiệp vững chắc, thích hợp quản lý kho bãi',
  love: 'Tình cảm bền vững, thiên về gia đình',
  health: 'Sức khỏe dồi dào, cần vận động đều đặn',
  advice: 'Nên tích lũy, giữ vững lập trường',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thiên Phủ Miếu địa tạo mẫu người điềm tĩnh, bao dung và có khả năng quản lý tài sản tốt. ' +
        'Đương số sống có trách nhiệm, biết tích lũy và thường là chỗ dựa cho gia đình. ' +
        'Phù hợp với tài chính, ngân hàng, bất động sản hoặc quản lý kho bãi. ' +
        'Cuộc sống nhìn chung sung túc, ổn định nếu biết giữ chữ tín.',
      career:
        'Sự nghiệp vững chắc nhờ khả năng quản lý và tính đáng tin cậy. ' +
        'Phù hợp với tài chính, ngân hàng, bất động sản hoặc quản trị doanh nghiệp. ' +
        'Cần tránh bảo thủ để không bỏ lỡ cơ hội đổi mới.',
      love:
        'Tình cảm bền vững, đương số coi trọng gia đình và sự chung thủy. ' +
        'Đôi khi sự điềm tĩnh khiến đối phương cảm thấy thiếu lãng mạn. ' +
        'Cần chủ động thể hiện cảm xúc và tạo không gian mới cho mối quan hệ.',
      health:
        'Sức khỏe dồi dào, tinh thần ổn định. ' +
        'Cần chú ý cân nặng và các bệnh do lười vận động.',
      advice:
        'Phát huy khả năng quản lý và tích lũy. ' +
        'Học cách cởi mở với cái mới để tránh bị tụt lại.',
    },
    vuong: {
      meaning:
        'Thiên Phủ Vượng địa cho thấy đương số có tầm nhìn tài chính và khả năng tổ chức tốt. ' +
        'Bản tính hào phóng, biết quan tâm đến người khác và thường được tin cậy. ' +
        'Phù hợp với quản lý tài sản, kinh doanh hoặc điều hành tổ chức. ' +
        'Cần tránh tích trữ quá mức mà quên tận hưởng cuộc sống.',
      career:
        'Công việc thuận lợi, đương số dễ được giao quản lý nguồn lực quan trọng. ' +
        'Phù hợp với tài chính, bất động sản, quản lý chuỗi cung ứng hoặc điều hành. ' +
        'Nên cân bằng giữa tiết kiệm và đầu tư để tối ưu hiệu quả.',
      love:
        'Tình cảm ổn định, đương số là người đáng tin cậy và có trách nhiệm. ' +
        'Đôi khi quá chú trọng vật chất khiến đối phương cảm thấy thiếu sự đồng cảm. ' +
        'Cần lắng nghe và chia sẻ cảm xúc nhiều hơn.',
      health:
        'Thể trạng ổn định, nhưng cần chú ý cân nặng và tiêu hóa. ' +
        'Nên duy trì vận động đều đặn và chế độ ăn hợp lý.',
      advice:
        'Tận dụng khả năng quản lý để tạo nền tảng vững chắc. ' +
        'Học cách chia sẻ và tận hưởng thành quả cùng người thân.',
    },
    dac: {
      meaning:
        'Thiên Phủ Đắc địa cho thấy đương số cẩn thận, biết tích lũy và có cuộc sống tương đối ổn định. ' +
        'Bản tính hiền hòa, coi trọng gia đình và sự an toàn. ' +
        'Phù hợp với kế toán, quản lý kho hoặc công việc hành chính. ' +
        'Cần tránh quá thận trọng khiến bỏ lỡ cơ hội phát triển.',
      career:
        'Sự nghiệp ổn định nhờ tính cẩn thận và đáng tin cậy. ' +
        'Thích hợp với kế toán, quản lý tài sản, hành chính hoặc giáo dục. ' +
        'Nên học thêm kỹ năng mới để mở rộng cơ hội nghề nghiệp.',
      love:
        'Tình cảm bền vững, đương số coi trọng sự an toàn và trách nhiệm. ' +
        'Đôi khi thiếu sự lãng mạn khiến mối quan hệ trở nên đơn điệu. ' +
        'Hãy chủ động tạo bất ngờ và thể hiện tình cảm nhiều hơn.',
      health:
        'Sức khỏe ổn định, cần chú ý cân nặng và tiêu hóa. ' +
        'Nên duy trì vận động nhẹ và chế độ ăn cân bằng.',
      advice:
        'Giữ vững tính cẩn thận và trách nhiệm. ' +
        'Học cách linh hoạt và mạnh dạn thử điều mới.',
    },
    binh: {
      meaning:
        'Thiên Phủ ổn định cho thấy đương số có ý thức tích lũy nhưng chưa thật sự nhạy bén với cơ hội. ' +
        'Bản tính hiền lành, thích sự ổn định và ngại thay đổi. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần nâng cao kiến thức tài chính và kỹ năng quản lý.',
      career:
        'Sự nghiệp bình ổn, ít biến động nhưng cũng ít cơ hội bứt phá. ' +
        'Phù hợp với công việc văn phòng, kế toán hoặc dịch vụ. ' +
        'Nên chủ động học hỏi và mở rộng kỹ năng để tăng giá trị bản thân.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến đối phương hiểu lầm. ' +
        'Cần thẳng thắn chia sẻ mong muốn và cảm xúc.',
      health:
        'Sức khỏe ở mức ổn định, cần chú ý cân nặng và tiêu hóa. ' +
        'Nên vận động thường xuyên và hạn chế đồ ăn nhiều dầu mỡ.',
      advice:
        'Chủ động nâng cao kỹ năng và mở rộng hiểu biết. ' +
        'Đừng ngại thay đổi để tạo bước tiến mới.',
    },
    ham: {
      meaning:
        'Thiên Phủ Hãm địa khiến đương số dễ gặp khó khăn trong việc quản lý tài chính và dễ bảo thủ. ' +
        'Bản tính có thể trở nên lo xa quá mức hoặc thiếu linh hoạt. ' +
        'Công việc dễ gặp trục trặc vì thiếu sự đổi mới. ' +
        'Cần học cách cân bằng giữa tiết kiệm và đầu tư hợp lý.',
      career:
        'Sự nghiệp nhiều thử thách, dễ bị tụt lại nếu không chịu thay đổi. ' +
        'Nên chọn công việc ổn định và tránh đầu tư mạo hiểm. ' +
        'Kiên trì học hỏi sẽ giúp cải thiện năng lực và vị thế.',
      love:
        'Tình cảm dễ gặp hiểu lầm do thiếu chia sẻ và quá chú trọng vật chất. ' +
        'Đương số cần học cách lắng nghe và tôn trọng cảm xúc đối phương. ' +
        'Sự chân thành sẽ giúp hàn gắn mối quan hệ.',
      health:
        'Cần chú ý cân nặng, tiêu hóa và các bệnh do lười vận động. ' +
        'Nên xây dựng lối sống năng động và chế độ ăn lành mạnh.',
      advice:
        'Học cách linh hoạt và cởi mở với cái mới. ' +
        'Quản lý tài chính có kế hoạch thay vì chỉ tích trữ.',
    },
  },
};

export const THIEN_PHU_MEANINGS = buildMajorStarMeanings(
  'thienPhu' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
