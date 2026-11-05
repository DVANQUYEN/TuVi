import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thiên Cơ là sao âm mưu, chủ về trí tuệ, biến động và cơ trí',
  career: 'Sự nghiệp cần tính toán, thích hợp công việc trí óc',
  love: 'Tình cảm đa biến, cần sự thông cảm',
  health: 'Dễ mệt về thần kinh, cần nghỉ ngơi',
  advice: 'Nên bình tĩnh suy tính, tránh vội vàng quyết định',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thiên Cơ Miếu địa tạo mẫu người mưu trí, phản ứng nhanh và có tầm nhìn chiến lược. ' +
        'Đương số giỏi phân tích, thích nghi tốt với hoàn cảnh thay đổi và thường tìm được lối đi riêng. ' +
        'Phù hợp với vai trò cố vấn, hoạch định chính sách hoặc quản lý dự án. ' +
        'Nhiều người thành công trong công nghệ, tài chính và tư vấn chiến lược.',
      career:
        'Sự nghiệp phát triển nhờ khả năng tính toán và thích ứng nhanh. ' +
        'Đương số dễ được trọng dụng ở vị trí cần chất xám như nghiên cứu, chiến lược hoặc công nghệ. ' +
        'Cần tránh thay đổi kế hoạch quá nhiều khiến đồng đội khó theo kịp.',
      love:
        'Tình cảm thông minh và nhiều trải nghiệm, nhưng đôi khi lý trí lấn át cảm xúc. ' +
        'Đương số cần người bạn đời biết thông cảm với nhịp sống bận rộn. ' +
        'Hãy dành thời gian lắng nghe thay vì cố phân tích mọi chuyện.',
      health:
        'Sức khỏe khá tốt nhưng dễ mệt mỏi về thần kinh do suy nghĩ nhiều. ' +
        'Cần ngủ đủ giấc và tránh làm việc liên tục trong thời gian dài.',
      advice:
        'Phát huy khả năng hoạch định và thích ứng. ' +
        'Học cách tin tưởng đồng đội và tránh tự mình ôm hết công việc.',
    },
    vuong: {
      meaning:
        'Thiên Cơ Vượng địa cho thấy đương số nhanh nhạy, khéo xoay xở và có khiếu phân tích. ' +
        'Bản tính linh hoạt, thích học hỏi và dễ thích nghi với môi trường mới. ' +
        'Thích hợp với công việc tư vấn, kinh doanh hoặc vận hành hệ thống. ' +
        'Cần kiểm soát thói quen thay đổi liên tục để giữ sự ổn định.',
      career:
        'Công việc thuận lợi nhờ tư duy linh hoạt và khả năng nắm bắt cơ hội. ' +
        'Đương số phù hợp với tư vấn, công nghệ, logistics hoặc quản lý vận hành. ' +
        'Nên cam kết dài hạn với mục tiêu đã chọn để tránh phân tán nguồn lực.',
      love:
        'Tình cảm khá thuận lợi, đương số biết cách làm mới mối quan hệ. ' +
        'Tuy nhiên tính thay đổi có thể khiến đối phương thiếu cảm giác an toàn. ' +
        'Cần minh bạch cảm xúc và giữ lời hứa để tạo niềm tin.',
      health:
        'Thể trạng ổn, nhưng cần chú ý hệ thần kinh và giấc ngủ. ' +
        'Nên dành thời gian thư giãn, hạn chế suy nghĩ quá nhiều.',
      advice:
        'Tận dụng sự linh hoạt để nắm bắt cơ hội. ' +
        'Đặt ra giới hạn rõ ràng và kiên định với lựa chọn của mình.',
    },
    dac: {
      meaning:
        'Thiên Cơ Đắc địa cho thấy đương số thông minh, cẩn thận và có khả năng tổ chức công việc tốt. ' +
        'Bản tính hay suy nghĩ, thích tìm hiểu trước khi hành động. ' +
        'Phù hợp với công việc chuyên môn, kế hoạch hoặc hành chính. ' +
        'Cần tránh do dự quá lâu khiến cơ hội trôi qua.',
      career:
        'Sự nghiệp ổn định, phát triển nhờ sự cẩn thận và tinh thần trách nhiệm. ' +
        'Thích hợp với kế toán, quản lý dự án, giáo dục hoặc công nghệ thông tin. ' +
        'Nên học cách ra quyết định nhanh hơn trong những tình huống đơn giản.',
      love:
        'Tình cảm chân thành nhưng đương số thường phân tích quá nhiều. ' +
        'Đối phương có thể cảm thấy thiếu sự lãng mạn và tự phát. ' +
        'Hãy học cách bộc lộ cảm xúc trực tiếp thay vì chỉ quan tâm bằng hành động.',
      health:
        'Sức khỏe ở mức ổn định, dễ căng thẳng khi công việc dồn dập. ' +
        'Cần duy trì chế độ nghỉ ngơi hợp lý và vận động nhẹ nhàng.',
      advice:
        'Rèn luyện sự quyết đoán và giảm bớt thói quen suy nghĩ quá mức. ' +
        'Tin vào năng lực bản thân để tự tin hơn trong công việc.',
    },
    binh: {
      meaning:
        'Thiên Cơ Bình hòa cho thấy đương số có trí tuệ nhưng chưa biết cách phát huy hết. ' +
        'Bản tính cẩn thận, đôi khi thiếu tự tin và dễ bị ảnh hưởng bởi ý kiến người khác. ' +
        'Phù hợp với công việc ổn định, ít biến động. ' +
        'Cần rèn luyện tính độc lập và kỹ năng ra quyết định.',
      career:
        'Sự nghiệp bình ổn, ít đột phá nếu không chủ động học hỏi. ' +
        'Đương số phù hợp với công việc chuyên môn hoặc hỗ trợ. ' +
        'Nên đặt mục tiêu cụ thể và kiên trì theo đuổi để tạo bước tiến.',
      love:
        'Tình cảm nhẹ nhàng, đương số cần thời gian để mở lòng. ' +
        'Đôi khi sự do dự khiến đối phương hiểu lầm là thiếu quan tâm. ' +
        'Cần chủ động chia sẻ suy nghĩ và cảm xúc nhiều hơn.',
      health:
        'Sức khỏe trung bình, cần chú ý đến thần kinh và tiêu hóa. ' +
        'Nên giảm căng thẳng bằng cách sắp xếp công việc khoa học.',
      advice:
        'Tăng cường tự tin bằng những mục tiêu nhỏ và hoàn thành đúng hạn. ' +
        'Tránh để sự do dự biến thành thói quen.',
    },
    ham: {
      meaning:
        'Thiên Cơ Hãm địa khiến đương số dễ lo nghĩ, thiếu kiên định và hay thay đổi quyết định. ' +
        'Bản tính thông minh nhưng đôi khi dùng sự khéo léo vào việc vụn vặt. ' +
        'Công việc dễ gặp trục trặc vì thiếu tập trung hoặc bỏ dở giữa chừng. ' +
        'Cần rèn luyện tính kiên nhẫn và kỷ luật bản thân.',
      career:
        'Sự nghiệp nhiều biến động, dễ đổi việc hoặc chuyển hướng liên tục. ' +
        'Nên chọn công việc có tính ổn định và tránh đầu tư mạo hiểm. ' +
        'Kiên trì với một lĩnh vực sẽ giúp tích lũy kinh nghiệm và uy tín.',
      love:
        'Tình cảm dễ nảy sinh hiểu lầm do thiếu ổn định và hay thay đổi. ' +
        'Đương số cần học cách cam kết và tôn trọng cảm xúc của đối phương. ' +
        'Sự thẳng thắn và nhất quán sẽ giúp mối quan hệ bền vững hơn.',
      health:
        'Cần đặc biệt chú ý sức khỏe thần kinh và giấc ngủ. ' +
        'Nên tránh thức khuya, giảm bớt lo âu bằng thiền hoặc vận động.',
      advice:
        'Xây dựng kế hoạch rõ ràng và bám sát mục tiêu. ' +
        'Học cách chấp nhận sự không hoàn hảo để bớt lo nghĩ.',
    },
  },
};

export const THIEN_CO_MEANINGS = buildMajorStarMeanings(
  'thienCo' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
