import type { Topic } from '../topic-interpretation';

/** Một tín hiệu phụ tinh/Tứ Hóa ưu tiên khi chọn câu kết luận. */
export interface TopicConclusionSpecial {
  /** Các mã hoặc tên sao kích hoạt câu kết luận này. */
  stars: string[];
  /** Câu kết luận tương ứng. */
  quote: string;
}

/** Nội dung câu kết luận của một chủ đề. */
export interface TopicConclusionContent {
  /** Câu kết luận theo mã chính tinh. */
  byStar: Record<string, string>;
  /** Câu dùng khi cung không có chính tinh. */
  noMajor: string;
  /** Câu dùng khi chính tinh ở thế Hãm. */
  ham: string;
  /** Câu dự phòng khi không khớp tín hiệu nào. */
  fallback: string;
  /** Các tín hiệu phụ tinh/Tứ Hóa được ưu tiên. */
  special: TopicConclusionSpecial[];
}

/**
 * Câu kết luận châm ngôn theo chủ đề, diễn giải từ ý nghĩa cung và sao Tử Vi.
 * Đây là văn phong diễn giải, không trích dẫn cổ thư.
 */
export const TOPIC_CONCLUSIONS: Record<Topic, TopicConclusionContent> = {
  career: {
    byStar: {
      tuVi: 'Khí chất dẫn dắt mở đường; giữ khiêm nhường để người theo.',
      thienCo: 'Mưu lược sắc bén; biết tùy thời thì sự nghiệp hanh thông.',
      thaiDuong: 'Danh vọng tỏa sáng khi làm việc minh bạch và công khai.',
      vuKhuc: 'Kỷ luật và tay nghề vững giúp giữ chắc thành quả sự nghiệp.',
      thienDong: 'An nhàn bền lâu khi chăm vun đắp quan hệ và tay nghề.',
      liemTrinh: 'Nguyên tắc rõ ràng giữ vững lập trường; giao tế cần chừng mực.',
      thienPhu: 'Quản trị chắc tay, trân trọng nguồn lực thì sự nghiệp vững.',
      thaiAm: 'Tế nhị là lợi thế; cần nói rõ ý mình để cộng sự thấu hiểu.',
      thamLang: 'Đa tài, giao tế rộng; tiết chế tham vọng để đi đường dài.',
      cuMon: 'Tài ăn nói mở cửa cơ hội; giữ lời để tránh thị phi.',
      thienTuong: 'Giỏi phụ tá, ngoại giao; chân thành để được tín nhiệm.',
      thienLuong: 'Hợp y đức, giáo dục; giữ tâm trong sáng thì đường bền.',
      thatSat: 'Quyết đoán tạo uy quyền; bền chí trước biến động mới vững.',
      phaQuan: 'Dám phá cũ lập mới; thấu hiểu trước khi đổi thay sẽ bền.',
    },
    noMajor: 'Cung Vô Chính Diệu: sự nghiệp linh hoạt, phụ thuộc nỗ lực.',
    ham: 'Chính tinh Hãm địa: sự nghiệp nhiều thử thách, cần kiên trì.',
    fallback: 'Sự nghiệp định hình bởi nỗ lực và sự bền bỉ của bản thân.',
    special: [
      {
        stars: ['vanXuong', 'Văn Xương', 'vanKhuc', 'Văn Khúc'],
        quote: 'Văn Xương, Văn Khúc: hợp học thuật, trình bày và giấy tờ.',
      },
      {
        stars: ['taPhu', 'Tả Phù', 'huuBat', 'Hữu Bật'],
        quote: 'Tả Phù, Hữu Bật: được quý nhân nâng đỡ trên đường sự nghiệp.',
      },
      {
        stars: ['hoaKy', 'Hóa Kỵ'],
        quote: 'Hóa Kỵ: sự nghiệp dễ gặp trở ngại; cẩn trọng lời nói.',
      },
    ],
  },
  love: {
    byStar: {
      tuVi: 'Tình cảm có khí chất cao quý; khiêm nhường giúp duyên bền.',
      thienCo: 'Duyên đến từ thấu hiểu; biết tùy thời thì tình cảm an hòa.',
      thaiDuong: 'Yêu thương rộng mở, minh bạch; chân thành nuôi bền duyên.',
      vuKhuc: 'Tình cảm thực tế, kỷ luật; giữ chắc và vun đắp mỗi ngày.',
      thienDong: 'Duyên phận hiền hòa, an nhàn; cần chăm vun đắp mỗi ngày.',
      liemTrinh: 'Tình duyên nhiều nguyên tắc; chừng mực giữ được sự trong sáng.',
      thienPhu: 'Duyên ổn định, đáng tin; trân trọng người bên cạnh thì bền lâu.',
      thaiAm: 'Tình cảm tế nhị, sâu lắng; cần nói rõ để người hiểu lòng mình.',
      thamLang: 'Duyên phận đa sắc, dễ thu hút; tiết chế để giữ mối quan hệ.',
      cuMon: 'Lời nói dễ sinh thị phi trong tình cảm; giữ lời, giữ hòa khí.',
      thienTuong: 'Duyên hôn nhân cần chân thành và tinh thần phụ tá lẫn nhau.',
      thienLuong: 'Tình duyên được quý nhân nâng đỡ; giữ tâm thiện thì an yên.',
      thatSat: 'Tình cảm mãnh liệt, nhiều biến động; bền chí và mềm mỏng.',
      phaQuan: 'Duyên có lúc đổi thay; thấu hiểu và bao dung giúp tình bền.',
    },
    noMajor: 'Cung Vô Chính Diệu: duyên phận cần chủ động vun đắp.',
    ham: 'Chính tinh Hãm địa: tình duyên cần nhiều thấu hiểu và nhẫn nại.',
    fallback: 'Tình duyên cần chân thành, thấu hiểu và vun đắp mỗi ngày.',
    special: [
      {
        stars: ['daoHoa', 'Đào Hoa', 'hongLoan', 'Hồng Loan'],
        quote: 'Duyên đào hoa, sức hút tốt; giữ chừng mực để tình bền.',
      },
      {
        stars: ['coThan', 'Cô Thần', 'quaTu', 'Quả Tú'],
        quote: 'Cô Thần, Quả Tú: cần chủ động mở lòng, vun đắp kết nối.',
      },
      {
        stars: ['taPhu', 'Tả Phù', 'huuBat', 'Hữu Bật'],
        quote: 'Tả Phù, Hữu Bật: được quý nhân phù trợ trong tình cảm.',
      },
      {
        stars: ['hoaKy', 'Hóa Kỵ'],
        quote: 'Hóa Kỵ: tình cảm dễ hiểu lầm; cần giữ lời và thấu hiểu.',
      },
    ],
  },
  wealth: {
    byStar: {
      tuVi: 'Tài lộc gắn với vị thế; giữ khiêm nhường thì của cải bền.',
      thienCo: 'Tài lộc đến từ mưu lược; biết tùy thời mà tính toán.',
      thaiDuong: 'Tài lộc công khai, minh bạch; rõ ràng giúp giữ tiền bền.',
      vuKhuc: 'Giỏi tích lũy, kỷ luật; giữ chắc vốn liếng thì tài lộc vững.',
      thienDong: 'Tài lộc an nhàn, đều đặn; vun đắp dần thì bền lâu.',
      liemTrinh: 'Tiền bạc gắn với nguyên tắc; chừng mực giữ được thanh sạch.',
      thienPhu: 'Kho lộc vững vàng; trân trọng đồng tiền thì của cải thêm.',
      thaiAm: 'Tài lộc ngầm, tế nhị; nói rõ kế hoạch để tránh hiểu lầm.',
      thamLang: 'Tài lộc rộng mở từ giao tế; tiết chế dục vọng để giữ của.',
      cuMon: 'Tiền bạc dễ sinh thị phi; giữ lời và giấy tờ rõ ràng.',
      thienTuong: 'Tài lộc đến từ phụ tá, hợp tác; chân thành thì được chia sẻ.',
      thienLuong: 'Tài lộc gắn với thiện tâm; giữ tâm trong sáng thì bền.',
      thatSat: 'Tài lộc biến động; bền chí và kỷ luật để giữ thành quả.',
      phaQuan: 'Tài lộc đổi thay khi phá cũ lập mới; hiểu rõ rủi ro trước.',
    },
    noMajor: 'Cung Vô Chính Diệu: tài lộc nương theo nỗ lực và cẩn trọng.',
    ham: 'Chính tinh Hãm địa: tài lộc chớ vội mạo hiểm, giữ chắc vốn nhỏ.',
    fallback: 'Tài lộc cần cẩn trọng, tích lũy và giữ chắc thành quả.',
    special: [
      {
        stars: ['locTon', 'Lộc Tồn'],
        quote: 'Lộc Tồn: có lộc tích lũy; giữ chắc và trân trọng đồng tiền.',
      },
      {
        stars: ['diaKhong', 'Địa Không', 'diaKiep', 'Địa Kiếp'],
        quote: 'Không, Kiếp: tài lộc dễ hao; cẩn trọng, tránh mạo hiểm.',
      },
      {
        stars: ['hoaLoc', 'Hóa Lộc'],
        quote: 'Hóa Lộc: tài lộc hanh thông; biết tích lũy thì bền.',
      },
      {
        stars: ['hoaKy', 'Hóa Kỵ'],
        quote: 'Hóa Kỵ: tiền bạc dễ trắc trở; giữ rõ ràng, tránh vay mượn.',
      },
    ],
  },
  health: {
    byStar: {
      tuVi: 'Sức khỏe có nền tảng; khiêm nhường, điều độ để giữ bền.',
      thienCo: 'Thân thể cần vận động và nghỉ ngơi; tùy thời mà giữ sức.',
      thaiDuong: 'Tinh thần sáng, minh bạch; giữ nhịp sống lành mạnh, công khai.',
      vuKhuc: 'Sức khỏe cần kỷ luật; giữ nếp sinh hoạt đều đặn.',
      thienDong: 'Tinh thần an nhàn, phúc hậu; chăm vun đắp sức khỏe mỗi ngày.',
      liemTrinh: 'Sức khỏe cần chừng mực; giữ nguyên tắc ăn ở, sinh hoạt.',
      thienPhu: 'Nền sức khỏe ổn định; trân trọng giấc ngủ và bữa ăn.',
      thaiAm: 'Sức khỏe tế nhị, dễ hao tâm; nói rõ để giải tỏa lo lắng.',
      thamLang: 'Sức lực dồi dào nhưng dễ quá độ; tiết chế để giữ thăng bằng.',
      cuMon: 'Cần giữ lời và hơi thở; tránh thị phi hao tâm tổn sức.',
      thienTuong: 'Sức khỏe ổn định nhờ nếp sống chân thành, điều độ.',
      thienLuong: 'Có quý nhân phù trợ sức khỏe; giữ tâm thiện thì nhẹ nhàng.',
      thatSat: 'Sức khỏe nhiều biến động; bền chí rèn luyện, tránh xung động.',
      phaQuan: 'Thân thể cần đổi mới nếp sống; hiểu rõ giới hạn của mình.',
    },
    noMajor: 'Cung Vô Chính Diệu: sức khỏe cần chủ động chăm sóc, điều độ.',
    ham: 'Chính tinh Hãm địa: sức khỏe cần chủ động phòng ngừa, giữ nếp.',
    fallback: 'Sức khỏe cần điều độ, nghỉ ngơi và chăm sóc chủ động.',
    special: [
      {
        stars: ['kinhDuong', 'Kình Dương', 'daLa', 'Đà La'],
        quote: 'Kình Dương, Đà La: cần phòng chấn thương, giữ an toàn.',
      },
      {
        stars: ['hoaTinh', 'Hỏa Tinh', 'linhTinh', 'Linh Tinh'],
        quote: 'Hỏa Tinh, Linh Tinh: cần điều độ, tránh nóng nảy và tai nạn.',
      },
      {
        stars: ['thienLuong', 'Thiên Lương'],
        quote: 'Thiên Lương: có quý nhân phù trợ sức khỏe, giữ tâm thiện.',
      },
    ],
  },
};
