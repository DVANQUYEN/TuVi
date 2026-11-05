/**
 * Các mẫu lời khuyên tổng quan cho lá số Tử Vi.
 */
export const OVERALL_ADVICE_TEMPLATES = {
  total: [
    'Lá số cho thấy đương số có nền tảng tốt để phát triển sự nghiệp và cuộc sống.',
    'Đương số cần chú ý cân bằng giữa công việc và gia đình để đạt được hạnh phúc toàn diện.',
    'Vận mệnh có thăng trầm, đương số nên giữ tâm bình ổn và chủ động thích nghi.',
    'Lá số có nhiều điểm sáng, đương số nên tự tin theo đuổi mục tiêu của mình.',
    'Cần chú ý đến các mối quan hệ xung quanh, tránh để thị phi ảnh hưởng đến tâm trạng.',
    'Đương số có tiềm năng lớn, quan trọng là biết nắm bắt thời cơ đúng lúc.',
    'Cuộc sống cần sự kiên nhẫn, không nên vội vàng kết luận về vận mệnh.',
    'Nên tích cực rèn luyện bản thân, nâng cao năng lực để đón nhận cơ hội.',
    'Đương số nên biết ơn những gì đang có và tiếp tục phấn đấu.',
    'Mọi thử thách đều là cơ hội học hỏi, giúp đương số trưởng thành hơn.',
    'Lá số khuyến khích đương số sống chân thành, giúp đỡ người khác khi có thể.',
    'Cần lập kế hoạch rõ ràng cho tương lai, tránh để mọi việc diễn ra bất chợt.',
    'Đương số nên chú trọng sức khỏe tinh thần, không để áp lực chi phối.',
  ],
  career: [
    'Sự nghiệp có nhiều cơ hội thăng tiến, đặc biệt trong giai đoạn trung niên.',
    'Nên chọn lĩnh vực phù hợp với năng lực và sở trường bản thân.',
    'Công việc cần sự kiên trì, không nên bỏ cuộc giữa chừng.',
    'Đương số có khả năng lãnh đạo, nên học cách quản lý và điều phối.',
    'Sự nghiệp phát triển nhờ sự hỗ trợ của quý nhân và đồng nghiệp.',
    'Cần cẩn trọng trong các quyết định đầu tư hay thay đổi công việc lớn.',
    'Nên xây dựng uy tín cá nhân, đây là nền tảng cho thành công lâu dài.',
    'Đương số nên chủ động học hỏi, cập nhật kiến thức để giữ vững vị thế.',
  ],
  love: [
    'Tình cảm gia đình đầm ấm, cần dành thời gian quan tâm đến người thân.',
    'Đương số nên lắng nghe và thấu hiểu đối tác để hôn nhân bền vững.',
    'Tình yêu cần sự chân thành, tránh để hiểu lầm làm rạn nứt quan hệ.',
    'Gia đình là chỗ dựa vững chắc, nên trân trọng những giây phút bên nhau.',
    'Đương số dễ gặp duyên tốt, quan trọng là biết nâng niu và giữ gìn.',
    'Nên hạn chế cái tôi trong các mối quan hệ để tránh xung đột không đáng có.',
    'Tình cảm phát triển tốt khi cả hai cùng chia sẻ trách nhiệm và ước mơ.',
  ],
  health: [
    'Sức khỏe nhìn chung tốt, cần chú ý chế độ ăn uống và nghỉ ngơi điều độ.',
    'Nên duy trì thói quen vận động thường xuyên để tăng cường thể lực.',
    'Cần tránh căng thẳng kéo dài, ảnh hưởng đến hệ thần kinh và tim mạch.',
    'Đương số nên quan tâm đến giấc ngủ, ngủ đủ giấc giúp phục hồi năng lượng.',
    'Chế độ dinh dưỡng hợp lý là yếu tố then chốt giúp sức khỏe ổn định.',
    'Nên định kỳ kiểm tra sức khỏe để phát hiện sớm các vấn đề tiềm ẩn.',
    'Tránh làm việc quá sức, cần biết cân bằng giữa lao động và nghỉ ngơi.',
  ],
};

/**
 * Sinh lời khuyên tổng quan dựa trên số lượng cách cục tốt/xấu.
 *
 * @param goodCount - Số cách cục tốt.
 * @param badCount - Số cách cục xấu.
 * @param hasSpecialPatterns - Có cách cục đặc biệt hay không.
 * @returns Lời khuyên phù hợp.
 */
export function generateOverallAdvice(
  goodCount: number,
  badCount: number,
  hasSpecialPatterns: boolean
): string {
  if (goodCount > badCount * 2) {
    return OVERALL_ADVICE_TEMPLATES.total[0];
  }

  if (badCount > goodCount) {
    return OVERALL_ADVICE_TEMPLATES.total[1];
  }

  if (!hasSpecialPatterns) {
    return OVERALL_ADVICE_TEMPLATES.total[3];
  }

  return OVERALL_ADVICE_TEMPLATES.total[2];
}
