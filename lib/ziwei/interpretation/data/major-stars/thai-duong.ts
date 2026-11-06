import {
  buildMajorStarMeanings,
  type StarArchetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS,
} from './base-builder';
import type { MajorStarId } from '../../../types/enums';

const archetype: StarArchetype = {
  coreMeaning: 'Thái Dương là sao dương cương, chủ về danh tiếng, quang minh và quyền uy',
  career: 'Sự nghiệp rực rỡ, dễ nổi danh',
  love: 'Tình cảm mãnh liệt, nồng nhiệt',
  health: 'Sức khỏe ổn định, cần tránh nóng giận',
  advice: 'Nên phát huy tinh thần lạc quan, giữ đạo đức',
  brightnessMeanings: {
    mieu: {
      meaning:
        'Thái Dương cư Mệnh ở thế Miếu địa tạo cách "Nhật xuất phù tang" - mặt trời mọc ở phương Đông. ' +
        'Đương số có tính cách phóng khoáng, nhiệt tình, luôn tràn đầy năng lượng và lạc quan. ' +
        'Thích hợp với vai trò lãnh đạo hoặc người truyền cảm hứng. ' +
        'Nhiều người thành công ở vị trí nhà lãnh đạo tinh thần, giáo viên hoặc diễn giả.',
      career:
        'Trong sự nghiệp, Thái Dương Miếu địa giúp thăng tiến nhanh, được cấp trên tin tưởng và đồng nghiệp yêu mến. ' +
        'Phù hợp với ngành giáo dục, truyền thông, chính trị hoặc các vai trò lãnh đạo. ' +
        'Cần tránh quá nhiệt tình mà ôm đồm quá nhiều việc.',
      love:
        'Về tình cảm, đương số có sức hút mạnh mẽ và dễ tìm được người bạn đời ưng ý. ' +
        'Tuy nhiên đôi khi quá tập trung vào sự nghiệp mà quên chăm sóc gia đình. ' +
        'Cần dành thời gian cho người thân, tránh để công việc chiếm hết quỹ thời gian.',
      health:
        'Sức khỏe ổn định, tinh thần lạc quan và ít bệnh tật. ' +
        'Cần chú ý các bệnh liên quan đến mắt và tim mạch do làm việc quá sức.',
      advice:
        'Phát huy tinh thần lạc quan và nhiệt tình, nhưng cần cân bằng giữa công việc và cuộc sống. ' +
        'Tránh ôm đồm quá nhiều và biết nhờ sự giúp đỡ của người khác.',
    },
    vuong: {
      meaning:
        'Thái Dương Vượng địa cho thấy đương số nổi bật, tự tin và có sức lan tỏa mạnh mẽ. ' +
        'Bản tính hào phóng, thích giúp đỡ người khác và dễ được yêu mến. ' +
        'Phù hợp với công việc đòi hỏi giao tiếp, thuyết trình hoặc dẫn dắt tập thể. ' +
        'Cần tránh tự ái và thói quen áp đặt quan điểm.',
      career:
        'Sự nghiệp rộng mở, dễ được giao vị trí đại diện hoặc phát ngôn. ' +
        'Phù hợp với truyền thông, kinh doanh, giáo dục hoặc dịch vụ khách hàng. ' +
        'Nên xây dựng uy tín bằng sự chân thành thay vì chỉ dựa vào sức hút cá nhân.',
      love:
        'Tình cảm nồng nhiệt, đương số biết quan tâm và tạo không khí vui vẻ. ' +
        'Đôi khi cái tôi lớn khiến đối phương khó góp ý. ' +
        'Cần học cách lắng nghe và tôn trọng khác biệt.',
      health:
        'Sức khỏe khá ổn định, nhưng cần chú ý tim mạch và các bệnh do nóng giận. ' +
        'Nên duy trì nhịp sinh hoạt điều độ và tránh thức khuya.',
      advice:
        'Dùng sự tự tin để truyền cảm hứng cho tập thể. ' +
        'Kiềm chế cái tôi và học cách tiếp nhận phê bình với thái độ cầu thị.',
    },
    dac: {
      meaning:
        'Thái Dương Đắc địa cho thấy đương số có tinh thần trách nhiệm, trung thực và được người khác tôn trọng. ' +
        'Bản tính ngay thẳng, thích cống hiến và không ngại việc khó. ' +
        'Phù hợp với công việc hành chính, giáo dục hoặc công tác xã hội. ' +
        'Cần tránh nóng vội khi kết quả chưa đến như mong đợi.',
      career:
        'Sự nghiệp phát triển ổn định nhờ sự chăm chỉ và uy tín. ' +
        'Thích hợp với giáo dục, y tế, hành chính hoặc quản lý nhân sự. ' +
        'Nên kiên nhẫn với lộ trình thăng tiến và không bỏ cuộc giữa chừng.',
      love:
        'Tình cảm chân thành, coi trọng trách nhiệm và sự chung thủy. ' +
        'Đương số đôi khi khô khan trong cách thể hiện tình cảm. ' +
        'Hãy học cách lãng mạn hơn để đối phương cảm nhận rõ sự quan tâm.',
      health:
        'Sức khỏe ổn định và ít bệnh nặng. ' +
        'Cần chú ý mắt, huyết áp và tránh làm việc quá giờ trong thời gian dài.',
      advice:
        'Giữ vững tinh thần trách nhiệm và sự chính trực. ' +
        'Học cách thư giãn và chia sẻ công việc để tránh quá tải.',
    },
    binh: {
      meaning:
        'Thái Dương ổn định cho thấy đương số có tinh thần lạc quan nhưng chưa thật sự nổi bật. ' +
        'Bản tính hòa nhã, thích ổn định và ít tranh giành quyền lực. ' +
        'Có thể thành công trong công việc chuyên môn nếu kiên trì. ' +
        'Cần rèn luyện sự tự tin để dám thể hiện bản thân.',
      career:
        'Sự nghiệp bình ổn, ít đột phá nếu không chủ động tạo cơ hội. ' +
        'Phù hợp với công việc hành chính, kỹ thuật hoặc dịch vụ. ' +
        'Nên đặt mục tiêu vừa sức và từng bước mở rộng phạm vi công việc.',
      love:
        'Tình cảm nhẹ nhàng, đương số coi trọng sự ổn định và an toàn. ' +
        'Đôi khi thiếu chủ động khiến mối quan hệ thiếu gia vị. ' +
        'Cần dành thời gian chất lượng và thể hiện cảm xúc rõ ràng hơn.',
      health:
        'Sức khỏe ở mức ổn định, cần chú ý tuần hoàn máu và thị lực. ' +
        'Nên vận động thường xuyên và tránh ngồi lâu trước màn hình.',
      advice:
        'Chủ động hơn trong công việc và các mối quan hệ. ' +
        'Đừng ngại thể hiện ý kiến và nhận những vai trò mới.',
    },
    ham: {
      meaning:
        'Thái Dương Hãm địa khiến đương số dễ cảm thấy thiếu tự tin và khó tỏa sáng. ' +
        'Bản tính vẫn tốt bụng nhưng dễ bị hiểu lầm hoặc không được ghi nhận. ' +
        'Công việc dễ gặp trở ngại vì thiếu sự ủng hộ từ cấp trên. ' +
        'Cần kiên nhẫn và tìm môi trường phù hợp với thế mạnh của mình.',
      career:
        'Sự nghiệp gặp nhiều thử thách, dễ bị lu mờ trước đồng nghiệp. ' +
        'Nên chọn công việc chuyên môn sâu thay vì cạnh tranh vị trí lãnh đạo. ' +
        'Kiên trì tích lũy thành tích sẽ giúp dần khẳng định bản thân.',
      love:
        'Tình cảm dễ gặp trắc trở do thiếu tự tin hoặc hiểu lầm về sự quan tâm của đối phương. ' +
        'Đương số cần học cách bày tỏ cảm xúc rõ ràng. ' +
        'Sự chân thành và kiên nhẫn sẽ giúp xây dựng niềm tin.',
      health:
        'Cần chú ý sức khỏe tim mạch, huyết áp và thị lực. ' +
        'Nên tránh căng thẳng kéo dài và duy trì chế độ ăn uống lành mạnh.',
      advice:
        'Tìm môi trường phù hợp thay vì cố gắng tỏa sáng ở nơi không phù hợp. ' +
        'Chăm sóc sức khỏe tinh thần và xây dựng sự tự tin từ những thành quả nhỏ.',
    },
  },
};

export const THAI_DUONG_MEANINGS = buildMajorStarMeanings(
  'thaiDuong' as MajorStarId,
  archetype,
  DEFAULT_PALACE_CONTEXTS,
  DEFAULT_BRIGHTNESS_MODIFIERS
);
