import type { MinorStarMeaningContent } from './types';

/**
 * Luận giải 10 phụ tinh có ảnh hưởng lớn, tra cứu theo tên hiển thị.
 */
export const MINOR_STAR_MEANINGS: Readonly<Record<string, MinorStarMeaningContent>> = {
  'Lộc Tồn': {
    impact: 'tốt',
    aspect: 'tài lộc',
    description:
      'Chủ về tài lộc, may mắn về tiền bạc. Gặp Lộc Tồn thường có thu nhập bất ngờ, được quý nhân phù trợ.',
    advice:
      'Nên nắm bắt cơ hội đầu tư, kinh doanh. Tuy nhiên cần giữ kín kế hoạch, tránh khoe khoang.',
  },
  'Thiên Mã': {
    impact: 'trung bình',
    aspect: 'di chuyển',
    description:
      'Chủ về di chuyển, thay đổi. Thiên Mã thường có nhiều chuyến đi, có thể thay đổi công việc, nơi ở.',
    advice: 'Nên chủ động di chuyển, đi xa sẽ có lợi. Tránh ở yên một chỗ.',
  },
  'Đào Hoa': {
    impact: 'trung bình',
    aspect: 'tình duyên',
    description:
      'Chủ về tình duyên, sức hút. Đào Hoa có nhiều người theo đuổi, dễ có quan hệ phức tạp.',
    advice: 'Cần chung thủy, tránh đa tình. Nếu đã kết hôn cần giữ khoảng cách với người khác giới.',
  },
  'Hồng Loan': {
    impact: 'tốt',
    aspect: 'hỷ sự',
    description:
      'Chủ về hỷ sự, kết hôn. Hồng Loan báo hiệu chuyện vui về tình cảm, có thể kết hôn, sinh con.',
    advice: 'Đây là thời điểm tốt để kết hôn, mở rộng quan hệ xã giao.',
  },
  'Kình Dương': {
    impact: 'xấu',
    aspect: 'tranh chấp',
    description:
      'Sát tinh chủ về tranh chấp, kiện tụng. Dễ có mâu thuẫn với người khác, có thể gặp tai nạn.',
    advice:
      'Cần nhẫn nhịn, tránh xung đột. Không nên ký hợp đồng quan trọng trong giai đoạn này.',
  },
  'Đà La': {
    impact: 'xấu',
    aspect: 'trì trệ',
    description:
      'Sát tinh chủ về sự trì trệ, khó khăn. Công việc thường gặp trở ngại, chậm tiến triển.',
    advice: 'Cần kiên nhẫn, không nên nóng vội. Nên lùi một bước để tiến ba bước.',
  },
  'Hỏa Tinh': {
    impact: 'xấu',
    aspect: 'tai nạn',
    description:
      'Sát tinh chủ về tai nạn bất ngờ, hỏa hoạn. Cần chú ý an toàn khi đi lại, tránh nơi nguy hiểm.',
    advice: 'Giữ bình tĩnh, tránh nóng giận. Có thể dùng nước để hóa giải.',
  },
  'Linh Tinh': {
    impact: 'xấu',
    aspect: 'thị phi',
    description:
      'Sát tinh chủ về tranh cãi, thị phi. Dễ bị người khác nói xấu, có mâu thuẫn trong quan hệ.',
    advice: 'Giữ im lặng, không nên tranh luận. Tránh xa những người thị phi.',
  },
  'Văn Xương': {
    impact: 'tốt',
    aspect: 'học hành',
    description:
      'Chủ về học hành, thi cử. Văn Xương giúp thông minh, học hành tiến bộ, thi cử đỗ đạt.',
    advice:
      'Nên tập trung vào học tập, nghiên cứu. Có thể đạt thành công trong lĩnh vực trí thức.',
  },
  'Văn Khúc': {
    impact: 'tốt',
    aspect: 'nghệ thuật',
    description:
      'Chủ về nghệ thuật, sáng tạo. Văn Khúc giúp có tài năng văn chương, nghệ thuật.',
    advice: 'Nên phát huy tài năng nghệ thuật. Có thể thành công trong lĩnh vực sáng tạo.',
  },
};

/**
 * Tra cứu luận giải phụ tinh theo tên hoặc mã sao.
 *
 * @param starId - Mã sao.
 * @param name - Tên hiển thị.
 * @returns Nội dung luận giải nếu có.
 */
export function getMinorStarMeaning(
  starId: string,
  name: string
): MinorStarMeaningContent | undefined {
  return MINOR_STAR_MEANINGS[name] ?? MINOR_STAR_MEANINGS[starId];
}
