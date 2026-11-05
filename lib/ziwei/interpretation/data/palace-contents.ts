import type { MajorStarId, PalaceId } from '../../types/enums';

/**
 * Đặc điểm của một chính tinh theo từng khía cạnh của cung.
 * Mỗi trường chỉ dùng cho các cung tương ứng để tránh lặp nội dung.
 */
export interface StarPalaceTrait {
  /** Tính cách, bản chất con người. */
  personality: string;
  /** Điểm mạnh. */
  strength: string;
  /** Điểm yếu. */
  weakness: string;
  /** Số mệnh chung. */
  destiny: string;
  /** Công việc, mức thăng tiến. */
  career: string;
  /** Nghề nghiệp phù hợp. */
  profession: string;
  /** Nguồn thu nhập. */
  income: string;
  /** Tài lộc, khả năng tích lũy. */
  wealth: string;
  /** Di chuyển, đi xa. */
  travel: string;
  /** Tình duyên, đặc điểm người phối ngẫu. */
  love: string;
  /** Con cái, hậu vận. */
  family: string;
  /** Sức khỏe tổng quát. */
  health: string;
  /** Bạn bè, quan hệ xã hội. */
  social: string;
  /** Nhà cửa, tài sản. */
  property: string;
  /** Phúc đức, tổ tiên. */
  fortune: string;
  /** Quan hệ với cha mẹ. */
  parents: string;
  /** Anh chị em. */
  siblings: string;
  /** Lời khuyên chung của sao. */
  advice: string;
}

/** Bổ sung nội dung riêng của từng loại cung. */
export interface PalaceTemplate {
  /** Chủ đề chính của cung. */
  theme: string;
  /** Mô tả khi cung Vô Chính Diệu. */
  empty: string;
  /** Thách thức đặc thù của cung. */
  challenge: string;
  /** Gợi ý chi tiết cho khía cạnh thứ hai. */
  detail: string;
  /** Lời khuyên đặc thù của cung. */
  advice: string;
}

/** Đặc điểm cốt lõi của 14 chính tinh. */
export const STAR_PALACE_TRAITS: Readonly<Record<MajorStarId, StarPalaceTrait>> = {
  tuVi: {
    personality: 'Lãnh đạo bẩm sinh, khí chất cao quý, quyết đoán và được mọi người tôn trọng. Nhưng quá tự cao, dễ cô độc.',
    strength: 'Có tầm nhìn xa, biết tổ chức và quy tụ người khác về một mục tiêu chung.',
    weakness: 'Đôi khi cố chấp, tự cao và khó tiếp nhận ý kiến trái chiều.',
    destiny: 'Số mệnh gắn với vai trò đứng đầu, dễ đạt địa vị cao nếu biết tiết chế cái tôi.',
    career: 'Công việc thăng tiến nhờ uy tín và năng lực quản lý, phù hợp môi trường có vị trí lãnh đạo.',
    profession: 'Quản lý, chính trị, tài chính, bất động sản hoặc điều hành doanh nghiệp.',
    income: 'Thu nhập chủ yếu từ vị trí quản lý, lương chức vụ và các khoản thưởng theo thành tích.',
    wealth: 'Tài lộc vững vàng, có khả năng tích lũy tài sản lớn và giữ được tiền.',
    travel: 'Di chuyển thuận lợi, được quý nhân hỗ trợ và dễ tạo dựng uy tín khi đi xa.',
    love: 'Người phối ngẫu thường có địa vị, bản lĩnh và môn đăng hộ đối.',
    family: 'Con cái ngoan ngoãn, có chí hướng và thường được hưởng nền tảng giáo dục tốt.',
    health: 'Thể trạng nhìn chung tốt, tinh thần minh mẫn, ít bệnh vặt nhưng cần chú ý tim mạch và huyết áp.',
    social: 'Bạn bè phần lớn là người có địa vị, trung thành và có thể hỗ trợ sự nghiệp.',
    property: 'Có duyên với nhà cửa, đất đai và thường sở hữu bất động sản giá trị.',
    fortune: 'Phúc đức dồi dào, có nền tảng tổ tiên và quý nhân phù trợ.',
    parents: 'Cha mẹ có uy quyền, nghiêm khắc nhưng hết lòng hỗ trợ con cái.',
    siblings: 'Anh chị em khá giả, có người nổi bật và thường giúp đỡ lẫn nhau.',
    advice: 'Phát huy khả năng lãnh đạo nhưng cần khiêm tốn, lắng nghe và nhường nhịn.',
  },
  thienCo: {
    personality: 'Thông minh, nhanh nhạy, giàu tư duy chiến lược và thích nghi tốt.',
    strength: 'Giỏi phân tích, lập kế hoạch và nắm bắt cơ hội trước người khác.',
    weakness: 'Dễ suy nghĩ quá nhiều, thiếu quyết đoán và hay thay đổi kế hoạch.',
    destiny: 'Số mệnh gắn với trí tuệ và sự linh hoạt, thành công nhờ học hỏi không ngừng.',
    career: 'Công việc phát triển nhờ khả năng tính toán, thích nghi và xử lý tình huống.',
    profession: 'Tư vấn, hoạch định, công nghệ, tài chính, nghiên cứu hoặc giáo dục.',
    income: 'Thu nhập đến từ kiến thức, chất xám và các dự án tư vấn, sáng tạo.',
    wealth: 'Tài lộc có lúc thăng trầm, cần quản lý dòng tiền chặt chẽ để tránh thất thoát.',
    travel: 'Hay đi xa, di chuyển nhiều và dễ gặp cơ hội mới trên đường.',
    love: 'Người phối ngẫu thông minh, nhanh nhẹn nhưng cần nhiều thời gian trò chuyện.',
    family: 'Con cái thông minh, hiếu động và sớm thể hiện tính tự lập.',
    health: 'Sức khỏe khá nhưng dễ mệt mỏi do lo nghĩ và làm việc liên tục, cần chú ý hệ thần kinh và giấc ngủ.',
    social: 'Bạn bè thiên về trí tuệ, ít nhưng chất lượng và có thể tư vấn hữu ích.',
    property: 'Nhà cửa thay đổi vài lần, hợp với không gian linh hoạt hoặc gần nơi làm việc.',
    fortune: 'Phúc đức khá, hưởng lộc từ tri thức và sự hỗ trợ của người hiểu mình.',
    parents: 'Cha mẹ thông minh, quan tâm đến giáo dục nhưng đôi khi kỳ vọng cao.',
    siblings: 'Anh chị em thông minh, có thể cùng nhau học hỏi và hỗ trợ sự nghiệp.',
    advice: 'Phát huy tư duy chiến lược nhưng cần quyết đoán hơn và tin vào trực giác.',
  },
  thaiDuong: {
    personality: 'Rộng lượng, nhiệt tình, hướng ngoại và có tinh thần trách nhiệm với cộng đồng.',
    strength: 'Khả năng lãnh đạo bằng sự bao dung, truyền cảm hứng và được nhiều người yêu quý.',
    weakness: 'Dễ ôm việc, đôi khi tự cao và kiệt sức vì cố gắng lo cho mọi người.',
    destiny: 'Số mệnh nổi bật, dễ được công nhận và có vai trò trong xã hội.',
    career: 'Sự nghiệp sáng sủa khi làm việc trước công chúng hoặc trong tổ chức lớn.',
    profession: 'Chính trị, giáo dục, y tế, truyền thông, quản lý công hoặc nghề cần uy tín.',
    income: 'Thu nhập từ vị trí công khai, chuyên môn và danh tiếng cá nhân.',
    wealth: 'Tài lộc khá nhưng dễ chi tiêu rộng rãi vì coi trọng thể diện.',
    travel: 'Di chuyển thuận lợi, có duyên xuất ngoại và mở rộng quan hệ quốc tế.',
    love: 'Người phối ngẫu sáng sủa, hoạt bát và có tinh thần trách nhiệm.',
    family: 'Con cái hoạt bát, được nhiều người yêu mến và có tố chất lãnh đạo.',
    health: 'Sức khỏe nhìn chung tốt nhưng dễ suy nhược khi làm việc quá sức, cần chú ý tim mạch, huyết áp và mắt.',
    social: 'Bạn bè đông, nhiều người quý mến và sẵn sàng hỗ trợ khi cần.',
    property: 'Thích nhà ở sáng sủa, rộng rãi và có vị trí thuận lợi.',
    fortune: 'Phúc đức tốt, thường gặp quý nhân và được hưởng thành quả từ việc giúp người.',
    parents: 'Cha mẹ nhiệt tình, có uy tín và dành nhiều tâm huyết cho con.',
    siblings: 'Anh chị em hòa thuận, có người thành đạt và sẵn lòng giúp đỡ.',
    advice: 'Phát huy tinh thần cống hiến nhưng cần giữ sức khỏe và tránh ôm đồm.',
  },
  vuKhuc: {
    personality: 'Quyết đoán, thực tế, kỷ luật và coi trọng hiệu quả công việc.',
    strength: 'Giỏi tổ chức, quản lý tiền bạc và biến kế hoạch thành hành động.',
    weakness: 'Đôi khi cứng nhắc, thẳng thắn quá mức và thiếu mềm mỏng trong giao tiếp.',
    destiny: 'Số mệnh tự lập, thành công nhờ nỗ lực và khả năng quản lý tài chính.',
    career: 'Công việc ổn định, thăng tiến theo năng lực và kết quả cụ thể.',
    profession: 'Tài chính, kế toán, kỹ thuật, quân sự, quản lý hoặc kinh doanh.',
    income: 'Thu nhập từ lương chính, đầu tư và các nguồn thực tế, ít phụ thuộc may mắn.',
    wealth: 'Tài lộc vững, giỏi tích lũy nhưng đôi khi quá tiết kiệm.',
    travel: 'Di chuyển vì công việc, ít gặp trở ngại lớn nếu chuẩn bị kỹ.',
    love: 'Người phối ngẫu thực tế, chăm lo gia đình và coi trọng trách nhiệm.',
    family: 'Con cái có tính tự lập, kỷ luật và ý thức trách nhiệm cao.',
    health: 'Thể trạng khá vững nhưng dễ gặp vấn đề khi làm việc quá độ, cần chú ý hô hấp và xương khớp.',
    social: 'Bạn bè thực tế, ít nhưng đáng tin và có thể hợp tác làm ăn.',
    property: 'Có duyên tích lũy nhà đất, thích tài sản có giá trị sử dụng lâu dài.',
    fortune: 'Phúc đức khá, thành quả đến từ nỗ lực hơn là may mắn.',
    parents: 'Cha mẹ nghiêm khắc, thực tế và dạy con biết tự lập từ sớm.',
    siblings: 'Anh chị em độc lập, có thể hỗ trợ nhau về công việc và tài chính.',
    advice: 'Giữ vững sự quyết đoán nhưng cần mềm mỏng và quan tâm cảm xúc người khác.',
  },
  thienDong: {
    personality: 'Hiền hòa, dễ gần, lạc quan và thích cuộc sống an nhàn.',
    strength: 'Biết tận hưởng, khéo dung hòa mối quan hệ và tạo không khí thoải mái.',
    weakness: 'Dễ lười biếng, thiếu quyết tâm và ngại va chạm khi cần đấu tranh.',
    destiny: 'Số mệnh êm đềm, hưởng phúc nếu biết giữ kỷ luật và tránh ỷ lại.',
    career: 'Công việc ổn định, phù hợp môi trường ít áp lực và có tính phục vụ.',
    profession: 'Dịch vụ, ẩm thực, du lịch, chăm sóc, giáo dục hoặc công việc an sinh.',
    income: 'Thu nhập đều đặn, không quá cao nhưng đủ đầy nếu biết chi tiêu hợp lý.',
    wealth: 'Tài lộc bình ổn, ít biến động mạnh và có xu hướng hưởng thụ.',
    travel: 'Thích đi du lịch, di chuyển nhẹ nhàng và dễ có chuyến đi thú vị.',
    love: 'Người phối ngẫu dịu dàng, biết chăm sóc và tạo không khí gia đình ấm áp.',
    family: 'Con cái vui vẻ, dễ nuôi và có cuộc sống tinh thần thoải mái.',
    health: 'Sức khỏe khá, tinh thần thoải mái nhưng dễ tăng cân và lười vận động, cần chú ý tiêu hóa.',
    social: 'Bạn bè vui vẻ, hòa đồng và thường mang lại niềm vui, sự thư giãn.',
    property: 'Nhà cửa ấm cúng, thích không gian nghỉ ngơi và tiện nghi.',
    fortune: 'Phúc đức tốt, cuộc sống nhiều an nhàn và được người thân che chở.',
    parents: 'Cha mẹ hiền lành, chăm lo cho con nhưng đôi khi bao bọc quá mức.',
    siblings: 'Anh chị em hòa nhã, ít tranh chấp và thường giúp nhau việc nhỏ.',
    advice: 'Tận hưởng cuộc sống nhưng cần rèn tính kỷ luật và chủ động hơn.',
  },
  liemTrinh: {
    personality: 'Nguyên tắc, sắc sảo, có chí tiến thủ và coi trọng lẽ phải.',
    strength: 'Có năng lực chuyên môn, biết giữ nguyên tắc và dám đấu tranh.',
    weakness: 'Dễ đa nghi, cứng nhắc và khắt khe khiến người khác khó gần.',
    destiny: 'Số mệnh nhiều thử thách nhưng có thể đạt thành tựu nhờ bản lĩnh.',
    career: 'Công việc đòi hỏi nguyên tắc, kỷ luật và khả năng xử lý xung đột.',
    profession: 'Luật, quản lý, chính trị, công an, hành chính hoặc chuyên môn kỹ thuật.',
    income: 'Thu nhập từ chuyên môn và vị trí công việc, có thể có khoản từ tranh tụng.',
    wealth: 'Tài lộc khá nhưng dễ phát sinh tranh chấp, cần giấy tờ rõ ràng.',
    travel: 'Di chuyển cần chuẩn bị kỹ, tránh nóng vội để không gặp rắc rối.',
    love: 'Người phối ngẫu cá tính, nguyên tắc và có thể khá nóng tính.',
    family: 'Con cái nghiêm túc, có ý thức kỷ luật nhưng cần được lắng nghe.',
    health: 'Sức khỏe cần chú ý vì dễ căng thẳng và áp lực tinh thần, cần đề phòng bệnh về máu và gan.',
    social: 'Bạn bè chọn lọc, ít nhưng chân thành và có thể hỗ trợ chuyên môn.',
    property: 'Nhà cửa cần pháp lý rõ ràng, tránh mua bán qua trung gian thiếu minh bạch.',
    fortune: 'Phúc đức có phần thử thách, thành quả đến từ việc giữ đúng đạo lý.',
    parents: 'Cha mẹ nghiêm khắc, coi trọng lễ nghĩa và kỷ luật.',
    siblings: 'Anh chị em có thể va chạm về quan điểm, cần học cách lắng nghe.',
    advice: 'Giữ nguyên tắc nhưng cần linh hoạt, bớt đa nghi và học cách tha thứ.',
  },
  thienPhu: {
    personality: 'Điềm tĩnh, bao dung, đáng tin cậy và có tư duy quản lý.',
    strength: 'Giỏi tổ chức, tích lũy và duy trì sự ổn định cho tập thể.',
    weakness: 'Dễ bảo thủ, ngại thay đổi và đôi khi thiếu quyết đoán.',
    destiny: 'Số mệnh ổn định, hưởng phúc nhờ biết vun vén và giữ gìn.',
    career: 'Công việc phát triển bền vững trong môi trường quản lý, hành chính.',
    profession: 'Quản lý, tài chính, hành chính, ngân hàng hoặc điều hành doanh nghiệp.',
    income: 'Thu nhập ổn định từ lương và các nguồn tích lũy lâu dài.',
    wealth: 'Tài lộc dồi dào, giỏi giữ tiền và quản lý tài sản.',
    travel: 'Di chuyển an toàn, thích chuyến đi có kế hoạch rõ ràng.',
    love: 'Người phối ngẫu chững chạc, biết vun vén và coi trọng gia đình.',
    family: 'Con cái được chăm sóc chu đáo, có nền tảng tốt để phát triển.',
    health: 'Sức khỏe tốt, ít bệnh nặng nhưng dễ trì trệ nếu lười vận động, cần chú ý tiêu hóa.',
    social: 'Bạn bè đáng tin, ít biến động và thường gắn bó lâu dài.',
    property: 'Có duyên tích lũy nhà đất, thích tài sản an toàn và lâu bền.',
    fortune: 'Phúc đức hậu hĩnh, được hưởng thành quả từ sự chăm chỉ và tiết kiệm.',
    parents: 'Cha mẹ chăm lo, có nền tảng kinh tế và mong con sống an toàn.',
    siblings: 'Anh chị em hòa thuận, có thể hỗ trợ nhau về tài chính và nhà cửa.',
    advice: 'Giữ sự ổn định nhưng cần cởi mở với cái mới và quyết đoán hơn.',
  },
  thaiAm: {
    personality: 'Dịu dàng, nhạy cảm, giàu lòng trắc ẩn và có trực giác tinh tế.',
    strength: 'Khéo chăm sóc, thấu hiểu cảm xúc và có năng khiếu nghệ thuật.',
    weakness: 'Dễ xúc động, hay lo nghĩ và dễ bị ảnh hưởng bởi môi trường.',
    destiny: 'Số mệnh thiên về tình cảm, thành công trong lĩnh vực chăm sóc và sáng tạo.',
    career: 'Công việc phát triển nhờ sự tỉ mỉ, thấu hiểu và khả năng làm việc âm thầm.',
    profession: 'Giáo dục, y tế, nghệ thuật, chăm sóc khách hàng hoặc tài chính cá nhân.',
    income: 'Thu nhập ổn định, có thể đến từ công việc chăm sóc hoặc sáng tạo.',
    wealth: 'Tài lộc khá, biết tiết kiệm nhưng đôi khi chi tiêu vì tình cảm.',
    travel: 'Di chuyển thuận lợi, đặc biệt các chuyến đi nhẹ nhàng hoặc gần nước.',
    love: 'Người phối ngẫu dịu dàng, tinh tế và biết quan tâm đến cảm xúc.',
    family: 'Con cái ngoan ngoãn, giàu tình cảm và được chăm sóc chu đáo.',
    health: 'Sức khỏe khá nhưng dễ bị ảnh hưởng bởi căng thẳng và cảm xúc, cần chú ý tiêu hóa và nội tiết.',
    social: 'Bạn bè thân thiết, giàu cảm xúc và thường chia sẻ sâu sắc.',
    property: 'Thích nhà cửa ấm cúng, tinh tế và gần gũi thiên nhiên.',
    fortune: 'Phúc đức tốt, được hưởng sự che chở của người thân và quý nhân.',
    parents: 'Cha mẹ dịu dàng, quan tâm và gắn bó sâu sắc với con cái.',
    siblings: 'Anh chị em gắn bó, hay chia sẻ và giúp nhau trong khó khăn.',
    advice: 'Phát huy trực giác và lòng nhân ái nhưng cần cân bằng cảm xúc.',
  },
  thamLang: {
    personality: 'Sôi nổi, giao tiếp giỏi, nhiều tham vọng và thích trải nghiệm. Nhưng quá đào hoa, dễ vướng vào thị phi tình cảm, có thể gặp cảnh ly tán.',
    strength: 'Có sức hút, khả năng thuyết phục và tinh thần kinh doanh nhạy bén.',
    weakness: 'Dễ ham vui, bốc đồng và khó kiểm soát dục vọng, lời ăn tiếng nói.',
    destiny: 'Số mệnh nhiều biến động, thành công lớn nếu biết kiềm chế và chọn lối sống lành mạnh.',
    career: 'Công việc năng động, nhiều cơ hội nhưng cần tránh ôm đồm quá nhiều.',
    profession: 'Kinh doanh, marketing, giải trí, nghệ thuật, du lịch hoặc bất động sản.',
    income: 'Thu nhập đa dạng, có thể từ nhiều nguồn nhưng dễ thất thường.',
    wealth: 'Tài lộc có lúc bùng nổ, cần quản lý chặt để tránh thất thoát.',
    travel: 'Rất hợp di chuyển, đi xa nhiều và dễ gặp cơ hội mới.',
    love: 'Người phối ngẫu hấp dẫn, hoạt bát nhưng cần sự chung thủy.',
    family: 'Con cái hoạt bát, nhiều tài lẻ và thích khám phá.',
    health: 'Sức khỏe khá nhưng dễ hao tổn vì sinh hoạt thiếu điều độ, cần chú ý gan và tiêu hóa.',
    social: 'Bạn bè đông, nhiều mối quan hệ xã hội và cơ hội hợp tác.',
    property: 'Thích nhà cửa tiện nghi, sang trọng và có tính thẩm mỹ.',
    fortune: 'Phúc đức khá, hưởng lộc từ giao tiếp và các mối quan hệ rộng.',
    parents: 'Cha mẹ năng động, cởi mở nhưng có thể ít thời gian bên con.',
    siblings: 'Anh chị em có nhiều mối quan hệ, có thể hỗ trợ nhau trong kinh doanh.',
    advice: 'Phát huy sự sáng tạo và khả năng giao tiếp nhưng cần kiềm chế ham muốn.',
  },
  cuMon: {
    personality: 'Thông minh, ăn nói có duyên, thích tranh luận và có tư duy phản biện. Nhưng quá khẩu thiệt, dễ gây thù oán, cuộc đời nhiều thị phi.',
    strength: 'Khả năng hùng biện, phân tích và thuyết phục người khác.',
    weakness: 'Dễ đa nghi, lời nói sắc bén và hay gây tranh cãi không cần thiết.',
    destiny: 'Số mệnh gắn với tiếng nói và tranh luận, cần học cách giữ hòa khí.',
    career: 'Công việc phát triển nhờ khả năng nói, viết và đàm phán.',
    profession: 'Luật, bán hàng, giáo dục, truyền thông, ngoại giao hoặc tư vấn.',
    income: 'Thu nhập đến từ khả năng ngôn ngữ, đàm phán và chuyên môn.',
    wealth: 'Tài lộc khá nhưng dễ phát sinh kiện tụng hoặc tranh chấp tiền bạc.',
    travel: 'Di chuyển tốt, đặc biệt đi xa để học hỏi hoặc mở rộng công việc.',
    love: 'Người phối ngẫu thông minh, nói giỏi nhưng cần tránh tranh cãi.',
    family: 'Con cái nhanh nhẹn, ăn nói giỏi và thích tìm hiểu.',
    health: 'Sức khỏe khá nhưng dễ mất ngủ vì suy nghĩ nhiều, cần chú ý miệng, họng và tiêu hóa.',
    social: 'Bạn bè nhiều nhưng dễ có thị phi, cần chọn người chân thành.',
    property: 'Nhà cửa có thể phát sinh tranh chấp, cần giấy tờ minh bạch.',
    fortune: 'Phúc đức có phần thử thách, hưởng lộc nhờ khéo ăn nói và học hỏi.',
    parents: 'Cha mẹ khéo nói, đôi khi nghiêm khắc và hay nhắc nhở con.',
    siblings: 'Anh chị em ăn nói giỏi, có thể tranh cãi nhưng vẫn giúp nhau.',
    advice: 'Dùng lời nói để kết nối thay vì tranh hơn thua, và học cách lắng nghe.',
  },
  thienTuong: {
    personality: 'Điềm đạm, trung hậu, biết quan tâm và coi trọng sự hài hòa.',
    strength: 'Có khả năng phối hợp, hỗ trợ người khác và giữ được lòng tin.',
    weakness: 'Dễ thiếu quyết đoán, ngại va chạm và đôi khi dựa dẫm vào người khác.',
    destiny: 'Số mệnh ổn định, được quý nhân giúp đỡ nếu biết sống chân thành.',
    career: 'Công việc phát triển nhờ khả năng điều phối và làm việc nhóm.',
    profession: 'Quản lý, hành chính, giáo dục, y tế hoặc công tác xã hội.',
    income: 'Thu nhập ổn định từ lương và các khoản hỗ trợ công việc.',
    wealth: 'Tài lộc khá, ít biến động và thường được người khác giúp đỡ.',
    travel: 'Di chuyển an toàn, thuận lợi khi có người đồng hành.',
    love: 'Người phối ngẫu hiền hòa, biết chăm sóc và coi trọng gia đình.',
    family: 'Con cái ngoan ngoãn, biết nghe lời và hòa đồng với bạn bè.',
    health: 'Sức khỏe khá, tinh thần ổn định nhưng dễ mệt khi cố làm hài lòng người khác, cần chú ý da liễu và tiêu hóa.',
    social: 'Bạn bè trung thành, ít nhưng đáng tin và sẵn sàng giúp đỡ.',
    property: 'Nhà cửa ổn định, thích không gian gọn gàng và an toàn.',
    fortune: 'Phúc đức tốt, thường gặp quý nhân và được hưởng sự che chở.',
    parents: 'Cha mẹ hiền hòa, quan tâm và tôn trọng ý kiến của con.',
    siblings: 'Anh chị em hòa nhã, biết nhường nhịn và hỗ trợ nhau.',
    advice: 'Giữ lòng tốt nhưng cần quyết đoán hơn và đặt giới hạn rõ ràng.',
  },
  thienLuong: {
    personality: 'Nhân hậu, chín chắn, có trách nhiệm và được người khác kính trọng.',
    strength: 'Biết quan tâm, che chở và có khả năng truyền đạt kinh nghiệm.',
    weakness: 'Hay lo lắng, đôi khi gia trưởng và khó buông bỏ trách nhiệm.',
    destiny: 'Số mệnh được hưởng phúc, càng lớn tuổi càng có uy tín.',
    career: 'Công việc bền vững, phù hợp vai trò cố vấn, giảng dạy hoặc chữa trị.',
    profession: 'Giáo dục, y tế, luật, tôn giáo, tư vấn hoặc công tác xã hội.',
    income: 'Thu nhập ổn định từ chuyên môn và các công việc mang tính phục vụ.',
    wealth: 'Tài lộc khá, biết chia sẻ và thường được hưởng phúc về sau.',
    travel: 'Di chuyển thuận lợi, có duyên học hỏi và gặp gỡ người hiền.',
    love: 'Người phối ngẫu chững chạc, có thể lớn tuổi hơn và biết chăm sóc.',
    family: 'Con cái hiếu thảo, biết nghe lời và có nền tảng đạo đức tốt.',
    health: 'Sức khỏe khá nhưng dễ mắc bệnh mãn tính khi lớn tuổi, cần chú ý tiêu hóa và gan.',
    social: 'Bạn bè đáng kính, nhiều người là bậc lớn tuổi hoặc thầy cô.',
    property: 'Có duyên thừa hưởng hoặc tích lũy nhà đất từ gia đình.',
    fortune: 'Phúc đức sâu dày, tổ tiên che chở và bản thân sống có âm đức.',
    parents: 'Cha mẹ nhân hậu, sống lâu và là chỗ dựa tinh thần cho con.',
    siblings: 'Anh chị em hiếu thuận, thường là chỗ dựa và giúp nhau nhiều.',
    advice: 'Tiếp tục sống thiện lành nhưng cần biết buông bớt lo lắng để an nhàn.',
  },
  thatSat: {
    personality: 'Dũng cảm, quyết liệt, độc lập và có tinh thần tiên phong. Nhưng quá cứng nhắc, dễ gây thù oán, cuộc đời nhiều tai nạn.',
    strength: 'Dám nghĩ dám làm, chịu được áp lực và có khả năng xung phong.',
    weakness: 'Dễ nóng nảy, bốc đồng và gây xung đột với người xung quanh.',
    destiny: 'Số mệnh nhiều thử thách, thành công lớn thường đến sau va vấp.',
    career: 'Công việc cần bản lĩnh, môi trường cạnh tranh hoặc nhiều thách thức.',
    profession: 'Quân sự, kỹ thuật, xây dựng, kinh doanh hoặc nghề cần sự quyết liệt.',
    income: 'Thu nhập có thể cao nhưng biến động, phụ thuộc vào mức độ mạo hiểm.',
    wealth: 'Tài lộc thăng trầm, nên tránh đầu tư tất tay hoặc vay mượn quá mức.',
    travel: 'Di chuyển nhiều, có thể gặp chuyến đi bất ngờ hoặc vất vả.',
    love: 'Người phối ngẫu cá tính mạnh, nóng tính nhưng chân thành.',
    family: 'Con cái cá tính, tự lập nhưng cần được hướng dẫn kiềm chế.',
    health: 'Sức khỏe cần chú ý vì dễ gặp chấn thương hoặc phải phẫu thuật, cần đề phòng bệnh về máu và gan.',
    social: 'Bạn bè ít nhưng cá tính, dễ có xung đột nếu không chọn lọc.',
    property: 'Nhà cửa có thể thay đổi vài lần, nên chọn nơi an cư ổn định.',
    fortune: 'Phúc đức có phần gian nan, thành quả đến từ nỗ lực và bản lĩnh cá nhân.',
    parents: 'Cha mẹ nghiêm khắc, đôi khi xa cách và ít chia sẻ cảm xúc.',
    siblings: 'Anh chị em dễ cạnh tranh, cần tránh xung đột về quyền lợi.',
    advice: 'Phát huy bản lĩnh nhưng cần kiềm chế nóng giận và hành động có kế hoạch.',
  },
  phaQuan: {
    personality: 'Phá cách, sáng tạo, thích đổi mới và không ngại thử thách. Nhưng quá bốc đồng, dễ phá hoại cơ nghiệp, cuộc đời bấp bênh.',
    strength: 'Có tư duy đột phá, dám thay đổi và khả năng xoay chuyển tình thế.',
    weakness: 'Dễ bốc đồng, phá vỡ kế hoạch và thiếu kiên nhẫn với sự ổn định.',
    destiny: 'Số mệnh nhiều biến động, thành công khi biết đổi mới có kiểm soát.',
    career: 'Công việc phù hợp môi trường năng động, cải cách hoặc khởi nghiệp.',
    profession: 'Kinh doanh, công nghệ, truyền thông, nghệ thuật hoặc lĩnh vực cải cách.',
    income: 'Thu nhập biến động, có thể đến từ nhiều nguồn và dự án mới.',
    wealth: 'Tài lộc lúc thịnh lúc suy, cần giữ khoản dự phòng và tránh đầu cơ.',
    travel: 'Di chuyển nhiều, thường xuyên thay đổi nơi ở hoặc nơi làm việc.',
    love: 'Người phối ngẫu cá tính, thích tự do và có tư duy đổi mới.',
    family: 'Con cái năng động, sáng tạo nhưng cần kỷ luật và định hướng rõ ràng.',
    health: 'Sức khỏe dễ biến động, cần chú ý khi làm việc quá độ hoặc mất ngủ, đề phòng bệnh gan.',
    social: 'Bạn bè thay đổi theo từng giai đoạn, nhiều mối quan hệ xã hội.',
    property: 'Nhà cửa có thể thay đổi, thích không gian mới và phong cách riêng.',
    fortune: 'Phúc đức lúc thịnh lúc suy, cần tích đức và giữ tâm ổn định.',
    parents: 'Cha mẹ có quan điểm khác biệt, đôi khi xung đột với con.',
    siblings: 'Anh chị em ít gắn bó hoặc có quan điểm trái ngược.',
    advice: 'Phát huy tinh thần đổi mới nhưng cần xây dựng kế hoạch và giữ chữ tín.',
  },
};

/** Nội dung riêng của 12 loại cung. */
export const PALACE_TEMPLATES: Readonly<Record<PalaceId, PalaceTemplate>> = {
  menh: {
    theme: 'bản chất, tính cách và số mệnh',
    empty: 'Cung Mệnh Vô Chính Diệu, tính cách chịu ảnh hưởng từ cung xung chiếu và phụ tinh nên cần quan sát thực tế.',
    challenge: 'Cần nhận diện rõ điểm yếu để tránh lặp lại sai lầm trong cuộc sống.',
    detail: 'Bản chất con người là nền tảng chi phối các cung còn lại.',
    advice: 'Sống đúng với bản chất, phát huy điểm mạnh và kiểm soát điểm yếu.',
  },
  taiBach: {
    theme: 'tiền bạc, thu nhập và khả năng tích lũy',
    empty: 'Cung Tài Bạch Vô Chính Diệu, tài lộc phụ thuộc nhiều vào cung xung chiếu và phụ tinh.',
    challenge: 'Cần quản lý chi tiêu chặt chẽ và tránh đầu tư mạo hiểm.',
    detail: 'Nên duy trì khoản dự phòng và ghi chép thu chi rõ ràng.',
    advice: 'Giữ tiền mặt hợp lý, tránh cho vay thiếu giấy tờ và đầu tư trong khả năng.',
  },
  quanLoc: {
    theme: 'công việc, sự nghiệp và nghề nghiệp phù hợp',
    empty: 'Cung Quan Lộc Vô Chính Diệu, sự nghiệp chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần tránh tranh chấp với đồng nghiệp và chọn đúng môi trường phát huy năng lực.',
    detail: 'Nên xây dựng uy tín từ chuyên môn thay vì chỉ dựa vào quan hệ.',
    advice: 'Chọn nghề phù hợp năng lực, học cách lắng nghe và hợp tác.',
  },
  thienDi: {
    theme: 'di chuyển, xuất ngoại và cơ hội khi đi xa',
    empty: 'Cung Thiên Di Vô Chính Diệu, vận di chuyển phụ thuộc vào cung xung chiếu và phụ tinh.',
    challenge: 'Cần chuẩn bị kỹ giấy tờ, sức khỏe và tài chính trước mỗi chuyến đi.',
    detail: 'Đi xa có thể gặp quý nhân nhưng cũng cần giữ an toàn và đề phòng rủi ro.',
    advice: 'Chủ động ra ngoài học hỏi, nhưng tránh quyết định lớn khi đang mệt mỏi.',
  },
  phuThe: {
    theme: 'hôn nhân, tình duyên và đặc điểm người phối ngẫu',
    empty: 'Cung Phu Thê Vô Chính Diệu, hôn nhân chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần học cách nhường nhịn, tránh để cái tôi làm rạn nứt quan hệ.',
    detail: 'Hôn nhân bền vững khi cả hai cùng chia sẻ trách nhiệm và tôn trọng nhau.',
    advice: 'Chọn bạn đời dựa trên sự chân thành, kiên nhẫn và khả năng đồng hành.',
  },
  tuTuc: {
    theme: 'con cái, học hành và hậu vận',
    empty: 'Cung Tử Tức Vô Chính Diệu, con cái chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần quan tâm giáo dục, tránh nuông chiều hoặc áp đặt con cái.',
    detail: 'Nên đồng hành cùng con trong học tập và tôn trọng cá tính của con.',
    advice: 'Dành thời gian lắng nghe con, định hướng thay vì kiểm soát.',
  },
  tatAch: {
    theme: 'sức khỏe, bệnh tật và phòng ngừa',
    empty: 'Cung Tật Ách Vô Chính Diệu, sức khỏe chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần khám sức khỏe định kỳ và tránh chủ quan với các dấu hiệu bất thường.',
    detail: 'Phòng bệnh bằng lối sống điều độ, vận động và ngủ đủ giấc.',
    advice: 'Xây dựng thói quen sinh hoạt lành mạnh và đi khám khi cần.',
  },
  noBoc: {
    theme: 'bạn bè, đồng nghiệp và quan hệ xã hội',
    empty: 'Cung Nô Bộc Vô Chính Diệu, quan hệ bạn bè chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần chọn lọc bạn bè, tránh bị lợi dụng hoặc lôi kéo vào chuyện thị phi.',
    detail: 'Quan hệ xã hội tốt giúp mở rộng cơ hội nhưng cần giữ ranh giới rõ ràng.',
    advice: 'Kết giao chân thành, giữ chữ tín và tránh đặt niềm tin mù quáng.',
  },
  dienTrach: {
    theme: 'nhà cửa, bất động sản và tài sản tích lũy',
    empty: 'Cung Điền Trạch Vô Chính Diệu, nhà cửa chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần kiểm tra pháp lý kỹ lưỡng và tránh mua bán vội vàng.',
    detail: 'Tài sản nên được tích lũy dần và ưu tiên giá trị sử dụng lâu dài.',
    advice: 'Chọn nhà phù hợp nhu cầu ở thực, tránh đầu tư theo cảm hứng.',
  },
  phucDuc: {
    theme: 'phúc đức, tổ tiên và quý nhân',
    empty: 'Cung Phúc Đức Vô Chính Diệu, phúc khí chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần tích đức, giữ tâm thiện và tránh làm việc tổn hại người khác.',
    detail: 'Phúc đức được vun đắp từ lối sống chân thành và sự hiếu thảo.',
    advice: 'Sống thiện lành, biết ơn tổ tiên và giúp đỡ người khó khăn.',
  },
  phuMau: {
    theme: 'cha mẹ và quan hệ gia đình',
    empty: 'Cung Phụ Mẫu Vô Chính Diệu, quan hệ cha mẹ chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần kiên nhẫn lắng nghe và tránh bất đồng quan điểm với cha mẹ.',
    detail: 'Gia đình là chỗ dựa nhưng cần giữ sự tôn trọng và ranh giới hợp lý.',
    advice: 'Quan tâm cha mẹ nhiều hơn, bày tỏ lòng biết ơn bằng hành động.',
  },
  huynhDe: {
    theme: 'anh chị em và quan hệ đồng lứa',
    empty: 'Cung Huynh Đệ Vô Chính Diệu, quan hệ anh em chịu ảnh hưởng từ cung xung chiếu và phụ tinh.',
    challenge: 'Cần tránh tranh chấp quyền lợi và so sánh thành tích với anh chị em.',
    detail: 'Anh em nên hỗ trợ nhau nhưng cần minh bạch trong tiền bạc và trách nhiệm.',
    advice: 'Giữ hòa khí, chủ động chia sẻ và giúp đỡ anh chị em khi cần.',
  },
};
