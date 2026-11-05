import type { BrightnessLevel, ZiweiChart } from '../../types';
import type { CombinationInterpretation } from '../types';
import { ADVANCED_COMBINATIONS, detectAdvancedCombinations } from './advanced-combinations';

/**
 * Các cách cục sao phổ biến trong Tử Vi.
 */
export const COMBINATIONS: CombinationInterpretation[] = [
  {
    id: 'tu-vi-cu-menh',
    name: 'Tử Vi cư Mệnh',
    condition: {
      stars: ['tuVi'],
      palace: 'menh',
      brightness: ['mieu', 'vuong', 'dac'],
    },
    meaning:
      'Tử Vi tọa Mệnh tạo cách "Quân vương tại vị". ' +
      'Đương số có tố chất lãnh đạo bẩm sinh, được mọi người nể phục và tôn trọng. ' +
      'Thích hợp với vai trò quản lý, chính trị hoặc làm chủ doanh nghiệp. ' +
      'Nhiều người có cách này trở thành CEO, lãnh đạo tổ chức lớn.',
    level: 'tốt',
  },
  {
    id: 'tu-phu-vu-tuong',
    name: 'Tử Phủ Vũ Tướng',
    condition: {
      stars: ['tuVi', 'thienPhu', 'vuKhuc', 'thienTuong'],
    },
    meaning:
      'Bộ Tử Phủ Vũ Tướng hội đủ bốn sao chủ về quyền lực, tài lộc và ổn định. ' +
      'Đương số có tư duy chiến lược, biết quản lý nguồn lực và thường được quý nhân trợ giúp. ' +
      'Cách này đặc biệt phù hợp với lĩnh vực tài chính, bất động sản và quản trị doanh nghiệp. ' +
      'Cuộc đời nhìn chung sung túc, ít biến động lớn nếu biết giữ chữ tín.',
    level: 'tốt',
  },
  {
    id: 'co-xuong-khuc',
    name: 'Cơ Xương Khúc',
    condition: {
      stars: ['thienCo', 'vanXuong', 'vanKhuc'],
    },
    meaning:
      'Thiên Cơ gặp Văn Xương, Văn Khúc tạo nên mẫu người thông minh, học rộng và có năng khiếu văn chương. ' +
      'Đương số thường thành công trong học tập, thi cử và các nghề cần chất xám. ' +
      'Phù hợp với giáo dục, nghiên cứu, luật, truyền thông hoặc công nghệ. ' +
      'Cần tránh suy nghĩ quá nhiều dẫn đến do dự và bỏ lỡ cơ hội.',
    level: 'tốt',
  },
  {
    id: 'nhat-nguyet-dong-cung',
    name: 'Nhật Nguyệt đồng cung',
    condition: {
      stars: ['thaiDuong', 'thaiAm'],
    },
    meaning:
      'Thái Dương và Thái Âm đồng cung tạo thế cân bằng giữa lý trí và cảm xúc. ' +
      'Đương số có khả năng dung hòa các mối quan hệ, vừa quyết đoán vừa biết lắng nghe. ' +
      'Cách này chủ về danh lợi song hành, dễ thành công trong kinh doanh lẫn công tác xã hội. ' +
      'Tuy nhiên cần chú ý sự thay đổi thất thường của cảm xúc và lịch làm việc.',
    level: 'tốt',
  },
  {
    id: 'tham-vu-hinh-cu',
    name: 'Tham Vũ Hình Cự',
    condition: {
      stars: ['thamLang', 'vuKhuc'],
    },
    meaning:
      'Tham Lang và Vũ Khúc đồng cung tạo cách giàu có nhưng tiềm ẩn sóng gió. ' +
      'Đương số có tham vọng lớn, giỏi nắm bắt cơ hội kinh doanh và dám chấp nhận rủi ro. ' +
      'Thành công thường đến từ lĩnh vực tài chính, đầu tư hoặc bất động sản. ' +
      'Cần đề phòng thị phi, tranh chấp phát sinh từ lòng tham và các quyết định thiếu minh bạch.',
    level: 'trung bình',
  },
  {
    id: 'co-cu-hoa-linh',
    name: 'Cơ Cự Hỏa Linh',
    condition: {
      stars: ['thienCo', 'cuMon'],
    },
    meaning:
      'Thiên Cơ và Cự Môn gặp Hỏa Tinh, Linh Tinh tạo thế dễ tranh cãi và biến động. ' +
      'Đương số có tư duy nhanh nhưng lời nói đôi khi sắc bén, dễ mất lòng người khác. ' +
      'Công việc thường gặp trục trặc về giấy tờ, hợp đồng hoặc mâu thuẫn nội bộ. ' +
      'Nên chọn môi trường ít va chạm, học cách kiềm chế cảm xúc và kiểm tra kỹ thông tin trước khi phát ngôn.',
    level: 'xấu',
  },
  {
    id: 'liem-tham-phuc-dam',
    name: 'Liêm Tham Phược Đàm',
    condition: {
      stars: ['liemTrinh', 'thamLang'],
    },
    meaning:
      'Liêm Trinh và Tham Lang đồng cung tạo cách dễ bị cuốn vào dục vọng và cám dỗ. ' +
      'Đương số có sức hút, khéo giao tiếp nhưng dễ vướng thị phi tình cảm hoặc tranh chấp lợi ích. ' +
      'Cần đặc biệt thận trọng trong các mối quan hệ hợp tác và chuyện tiền bạc. ' +
      'Giữ nguyên tắc sống rõ ràng, tránh đầu tư mạo hiểm sẽ giúp hóa giải phần lớn rủi ro.',
    level: 'xấu',
  },
  {
    id: 'phu-thuong-phu-quy',
    name: 'Phú Thương Phú Quý',
    condition: {
      stars: ['vuKhuc', 'thienPhu'],
    },
    meaning:
      'Vũ Khúc và Thiên Phủ đồng cung tạo cách chủ về tiền tài và sự nghiệp kinh doanh. ' +
      'Đương số có đầu óc tính toán, biết tích lũy và quản lý tài sản hiệu quả. ' +
      'Thích hợp với ngân hàng, kế toán, bất động sản hoặc điều hành doanh nghiệp. ' +
      'Thành công đến bền vững nếu giữ được chữ tín và tránh ham lợi trước mắt.',
    level: 'tốt',
  },
  {
    id: 'sat-pho-can-qua',
    name: 'Sát Phá Can Qua',
    condition: {
      stars: ['thatSat', 'phaQuan'],
    },
    meaning:
      'Thất Sát và Phá Quân đồng cung tạo cuộc đời nhiều biến động và thử thách. ' +
      'Đương số có ý chí mạnh mẽ, dám phá bỏ lối mòn để tạo dựng con đường riêng. ' +
      'Phù hợp với khởi nghiệp, quân sự, thể thao hoặc các lĩnh vực cần tinh thần tiên phong. ' +
      'Cần học cách tiết chế nóng nảy và tính toán hậu quả trước khi hành động.',
    level: 'trung bình',
  },
  {
    id: 'dong-luong-tuong-ngo',
    name: 'Đồng Lương tương ngộ',
    condition: {
      stars: ['thienDong', 'thienLuong'],
    },
    meaning:
      'Thiên Đồng và Thiên Lương gặp nhau tạo cách phúc thọ và an nhàn. ' +
      'Đương số có tính cách hiền hòa, sống có tình nghĩa, thường được người khác yêu mến và giúp đỡ. ' +
      'Công việc phù hợp với giáo dục, y tế, từ thiện hoặc dịch vụ chăm sóc cộng đồng. ' +
      'Cuộc sống tuy không quá giàu sang nhưng bình an, ít sóng gió nếu biết trân trọng hiện tại.',
    level: 'tốt',
  },
  {
    id: 'tu-vi-ham-dia',
    name: 'Tử Vi hãm địa',
    condition: {
      stars: ['tuVi'],
      brightness: ['ham'],
    },
    meaning:
      'Tử Vi rơi vào hãm địa khiến khí chất lãnh đạo bị giảm sút, dễ cảm thấy cô lập. ' +
      'Đương số có hoài bão lớn nhưng đôi khi thiếu người đồng hành hoặc bị hiểu lầm. ' +
      'Công việc dễ gặp trở ngại vì tâm lý tự cao hoặc không chịu lắng nghe. ' +
      'Cần học cách khiêm tốn, xây dựng quan hệ chân thành để dần lấy lại vị thế.',
    level: 'xấu',
  },
  {
    id: 'hoa-linh-hoa-ky',
    name: 'Hỏa Linh Hóa Kỵ',
    condition: {
      stars: ['hoaTinh', 'linhTinh'],
    },
    meaning:
      'Hỏa Tinh và Linh Tinh gặp Hóa Kỵ tạo thế dễ gặp tai nạn, thị phi và căng thẳng. ' +
      'Đương số có phản ứng nhanh nhưng dễ bốc đồng, quyết định thiếu suy xét. ' +
      'Cần thận trọng khi tham gia giao thông, ký kết hợp đồng và xử lý mâu thuẫn. ' +
      'Giữ tinh thần bình tĩnh, tránh tranh cãi vô ích sẽ giúp giảm bớt phần lớn rủi ro.',
    level: 'xấu',
  },
];

/**
 * Kiểm tra một cách cục cơ bản có thỏa điều kiện trong lá số hay không.
 *
 * @param chart - Lá số Tử Vi.
 * @param condition - Điều kiện của cách cục.
 * @returns `true` nếu lá số thỏa điều kiện.
 */
export function checkCombinationCondition(
  chart: ZiweiChart,
  condition: CombinationInterpretation['condition']
): boolean {
  if (!condition.stars || condition.stars.length === 0) {
    return false;
  }

  if (condition.palace) {
    const palace = chart.palaces.find((p) => p.id === condition.palace);
    if (!palace) {
      return false;
    }

    const palaceStarIds = [
      ...palace.majorStars,
      ...palace.auspiciousStars,
      ...palace.maleficStars,
    ].map((s) => s.id);

    if (!condition.stars.every((starId) => palaceStarIds.includes(starId))) {
      return false;
    }
  } else {
    const allStarIds = chart.palaces
      .flatMap((p) => [...p.majorStars, ...p.auspiciousStars, ...p.maleficStars])
      .map((s) => s.id);

    if (!condition.stars.every((starId) => allStarIds.includes(starId))) {
      return false;
    }
  }

  if (condition.brightness && condition.brightness.length > 0) {
    const allStars = chart.palaces.flatMap((p) => [
      ...p.majorStars,
      ...p.auspiciousStars,
      ...p.maleficStars,
    ]);

    const relevantStars = allStars.filter((s) => condition.stars!.includes(s.id));
    const hasValidBrightness = relevantStars.some((s) =>
      condition.brightness!.includes((s.brightness ?? 'binh') as BrightnessLevel)
    );

    if (!hasValidBrightness) {
      return false;
    }
  }

  return true;
}

/**
 * Nhận diện toàn bộ cách cục (cơ bản và nâng cao) trong lá số.
 *
 * @param chart - Lá số Tử Vi.
 * @returns Danh sách cách cục được nhận diện.
 */
export function detectCombinations(chart: ZiweiChart): CombinationInterpretation[] {
  const basicCombinations = COMBINATIONS.filter((combination) =>
    checkCombinationCondition(chart, combination.condition)
  );

  const advancedCombinations = detectAdvancedCombinations(chart)
    .map((id) => ADVANCED_COMBINATIONS.find((combination) => combination.id === id))
    .filter(
      (combination): combination is (typeof ADVANCED_COMBINATIONS)[number] =>
        Boolean(combination)
    )
    .map((combination) => ({
      id: combination.id,
      name: combination.name,
      meaning: combination.description,
      level: combination.level,
      condition: { stars: [] },
    }));

  return [...basicCombinations, ...advancedCombinations];
}
