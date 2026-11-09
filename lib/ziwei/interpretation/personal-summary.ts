import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import type { BrightnessLevel, FiveElement, MutagenType, PalaceId } from '@/lib/ziwei/types/enums';
import { getBranchLabel } from '@/lib/chart/display-helpers';
import { getNapAmMeaning } from '@/lib/ziwei/data/stems-branches';

export interface PersonalSummary {
  /** Tên đương số, giữ lại cho tương thích dữ liệu cũ. */
  ownerName?: string;
  headline: string;
  description: string;
  keyTraits: string[];
  lifePath: string;
  /** Chính tinh chủ đạo của cung Mệnh; `Vô Chính Diệu` khi không có. */
  starName?: string;
  /** Các đoạn luận giải kỹ thuật (Cục diện, cung Mệnh, Tam Hợp, Tổng kết). */
  technicalParagraphs?: string[];
  /** Đoạn mở đầu về nhịp đi nội tâm. */
  introParagraph?: string;
  /** Đoạn về khí chất và thế mạnh của cung Mệnh. */
  menhStarParagraph?: string;
  /** Đoạn về phần tối và trọng tâm nửa sau cuộc đời. */
  tamHopAndThanParagraph?: string;
  /** Đoạn kết tổng hợp và bài học. */
  conclusionParagraph?: string;
  /** Khẩu khí một dòng, hiển thị đầu phần Luận giải. */
  conclusionQuote: string;
  /** Sắc thái tổng quan của lá số, dùng cho khẩu khí. */
  conclusionTone: 'high' | 'balanced' | 'challenging';
}

type ConclusionTone = PersonalSummary['conclusionTone'];

interface StarNarrative {
  headline: string;
  /** Hai câu mô tả khách quan ở ngôi thứ ba, dùng cho phần tóm tắt dễ đọc. */
  starNature: string;
  essence: string;
  gift: string;
  shadow: string;
  keyTraits: readonly string[];
  lifePath: string;
}

const BRIGHTNESS_LABELS_VI: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu địa',
  vuong: 'Vượng địa',
  dac: 'Đắc địa',
  binh: 'Ổn định',
  ham: 'Hãm địa',
};

const MUTAGEN_LABELS_VI: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'Hóa Lộc',
  hoaQuyen: 'Hóa Quyền',
  hoaKhoa: 'Hóa Khoa',
  hoaKy: 'Hóa Kỵ',
};

const BRIGHTNESS_RANK: Readonly<Record<BrightnessLevel, number>> = {
  ham: 1,
  binh: 2,
  dac: 3,
  vuong: 4,
  mieu: 5,
};

/** Vòng sinh: mộc -> hỏa -> thổ -> kim -> thủy -> mộc. */
const ELEMENT_GENERATION: Readonly<Record<FiveElement, FiveElement>> = {
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
  kim: 'thuy',
  thuy: 'moc',
};

/** Vòng khắc: mộc -> thổ -> thủy -> hỏa -> kim -> mộc. */
const ELEMENT_CONTROL: Readonly<Record<FiveElement, FiveElement>> = {
  moc: 'tho',
  tho: 'thuy',
  thuy: 'hoa',
  hoa: 'kim',
  kim: 'moc',
};

function describeElementRelation(menhElement: FiveElement, cucElement: FiveElement): string {
  if (menhElement === cucElement) {
    return 'Mệnh Cục Tỷ Hòa (thuận lợi, bản mệnh và hoàn cảnh hòa hợp)';
  }
  if (ELEMENT_GENERATION[cucElement] === menhElement) {
    return 'Cục sinh Mệnh (hoàn cảnh nâng đỡ bản mệnh, gặp nhiều trợ lực)';
  }
  if (ELEMENT_GENERATION[menhElement] === cucElement) {
    return 'Mệnh sinh Cục (bản thân phải nỗ lực cống hiến nhiều cho ngoại cảnh)';
  }
  if (ELEMENT_CONTROL[menhElement] === cucElement) {
    return 'Mệnh khắc Cục (vất vả tự lực cánh sinh nhưng làm chủ được hoàn cảnh)';
  }
  if (ELEMENT_CONTROL[cucElement] === menhElement) {
    return 'Cục khắc Mệnh (ngoại cảnh nhiều thử thách, cần kiên trì rèn luyện bản lĩnh)';
  }
  return '';
}

const FALLBACK_NARRATIVE: StarNarrative = {
  headline: 'Linh hoạt và biết tùy hoàn cảnh',
  starNature:
    'Người mang mệnh Vô Chính Diệu thường linh hoạt, dễ thích nghi và thay đổi cách ứng xử tùy hoàn cảnh. ' +
    'Họ giỏi quan sát môi trường, nhưng dễ chịu ảnh hưởng từ bên ngoài và thiếu định hướng nếu không biết mượn thế xung chiếu.',
  essence:
    'Bạn là người linh hoạt, dễ thích nghi với hoàn cảnh mới. ' +
    'Bạn thường quan sát xung quanh trước rồi mới chọn cách ứng xử phù hợp.',
  gift:
    'Bạn học nhanh từ nhiều môi trường khác nhau và có thể bắt nhịp với công việc mới trong thời gian ngắn. ' +
    'Bạn cũng dễ tạo thiện cảm vì biết lắng nghe và tôn trọng cách sống của người khác.',
  shadow:
    'Khi chịu ảnh hưởng mạnh từ môi trường, bạn dễ đổi hướng và thiếu định hướng lâu dài. ' +
    'Nếu biết mượn thế từ cung xung chiếu và chọn một mục tiêu đủ quan trọng, bạn sẽ vững hơn.',
  keyTraits: ['Linh hoạt', 'Học nhanh', 'Dễ thích nghi', 'Cần chọn hướng rõ hơn'],
  lifePath:
    'Nhiều ngành nghề đều có thể phù hợp; điều quan trọng là chọn một hướng đủ lâu để tích lũy kinh nghiệm và mượn được sự hỗ trợ từ môi trường xung quanh.',
};

const STAR_NARRATIVES: Readonly<Partial<Record<string, StarNarrative>>> = {
  'Tử Vi': {
    headline: 'Điềm tĩnh và biết dẫn dắt',
    starNature:
      'Người mang mệnh Tử Vi thường điềm tĩnh, có uy tín và biết nhìn toàn cảnh trước khi quyết định. ' +
      'Họ có khả năng dẫn dắt người khác, nhưng khi thiếu trợ lực dễ tự cao, độc đoán và thu mình.',
    essence:
      'Bạn là người điềm tĩnh, coi trọng thể diện và có uy tín trong tập thể. ' +
      'Bạn thường được giao việc quan trọng vì biết giữ lời và nhìn được toàn cảnh.',
    gift:
      'Bạn biết sắp xếp công việc thành một hướng rõ ràng và giữ thể diện cho người khác. ' +
      'Khi tập thể mất phương hướng, bạn có thể đưa ra quyết định để mọi người cùng theo.',
    shadow:
      'Khi thiếu người hỗ trợ, bạn dễ tự cao, độc đoán và thu mình vì nghĩ mình phải gánh hết. ' +
      'Nếu biết chia sẻ quyền quyết định, bạn sẽ bớt cô đơn và được đồng đội tin hơn.',
    keyTraits: ['Điềm tĩnh', 'Biết dẫn dắt', 'Giữ chữ tín', 'Dễ tự cao khi thiếu trợ lực'],
    lifePath:
      'Những vai trò cần tầm nhìn và sự tin cậy như quản lý, điều hành hoặc tự dẫn dắt một công việc riêng có thể phù hợp, miễn là bạn giữ được sự lắng nghe.',
  },
  'Thiên Phủ': {
    headline: 'Vững vàng và biết vun vén',
    starNature:
      'Người mang mệnh Thiên Phủ thường chín chắn, coi trọng sự an toàn và biết vun vén nguồn lực cho tương lai. ' +
      'Họ là chỗ dựa đáng tin khi mọi thứ rối ren, nhưng dễ bảo thủ và giữ chặt những gì đang có.',
    essence:
      'Bạn là người chín chắn, thích làm mọi việc từng bước và coi trọng sự ổn định. ' +
      'Bạn không thích hứa nhiều mà muốn để kết quả nói thay.',
    gift:
      'Bạn có cái nhìn thực tế về tiền bạc và nguồn lực, biết điều gì nên giữ và điều gì nên buông. ' +
      'Khi mọi thứ rối ren, bạn có thể sắp xếp lại thành trật tự.',
    shadow:
      'Khi quá coi trọng an toàn, bạn dễ bảo thủ, giữ chặt những gì đang có và ngại thử cái mới. ' +
      'Nếu cho phép mình thử nghiệm trong những việc lành mạnh, bạn sẽ không bị mắc kẹt trong vùng quen.',
    keyTraits: ['Chín chắn', 'Giỏi vun vén', 'Đáng tin cậy', 'Dễ bảo thủ'],
    lifePath:
      'Những công việc cần sự ổn định và quản trị dài hạn như tài chính, vận hành, bất động sản hoặc hành chính có thể là hướng phù hợp, tùy môi trường và lựa chọn của bạn.',
  },
  'Thái Dương': {
    headline: 'Nhiệt tình và hay giúp người',
    starNature:
      'Người mang mệnh Thái Dương thường rộng lượng, nhiệt tình và dễ truyền năng lượng cho người xung quanh. ' +
      'Họ thích giúp đỡ và được ghi nhận, nhưng dễ nóng, ôm đồm rồi kiệt sức hoặc háo danh.',
    essence:
      'Bạn là người rộng lượng, nhiệt tình và thích giúp đỡ người khác. ' +
      'Bạn thường đặt nỗi lo của mình xuống để lo cho người khác trước.',
    gift:
      'Bạn có khả năng truyền năng lượng và động viên tập thể bằng sự chân thành. ' +
      'Khi người khác mất phương hướng, bạn thường là người đưa ra hướng đi rõ ràng.',
    shadow:
      'Khi nhận quá nhiều việc hoặc quá muốn được ghi nhận, bạn dễ nóng, kiệt sức và ôm đồm. ' +
      'Nếu học cách nói không và để người khác cùng làm, bạn sẽ giữ được sức bền.',
    keyTraits: ['Rộng lượng', 'Nhiệt tình', 'Truyền cảm hứng', 'Dễ ôm đồm'],
    lifePath:
      'Những nơi cần sự hiện diện và truyền lửa như giáo dục, truyền thông, cộng đồng hoặc vai trò dẫn dắt tinh thần có thể phù hợp, nếu bạn biết giữ nhịp để không kiệt sức.',
  },
  'Thái Âm': {
    headline: 'Tinh tế và biết lắng nghe',
    starNature:
      'Người mang mệnh Thái Âm thường tinh tế, giàu cảm xúc và nhạy với những điều người khác chưa nói ra. ' +
      'Họ biết lắng nghe và chăm sóc người khác, nhưng dễ dao động, lo xa và khó nói ra nhu cầu của mình.',
    essence:
      'Bạn là người tinh tế, nhạy cảm và dễ nhận ra cảm xúc của người khác. ' +
      'Bạn thích những khoảng yên tĩnh để suy nghĩ và hồi phục.',
    gift:
      'Bạn giỏi lắng nghe và nhận ra điều người khác đang cần mà không cần họ nói ra. ' +
      'Bạn cũng có thể biến cảm xúc thành lời nói hoặc công việc có chiều sâu.',
    shadow:
      'Khi cảm xúc bị cuốn theo người khác, bạn dễ dao động, lo xa và giữ nhu cầu của mình trong lòng. ' +
      'Nếu tập nói ra điều mình cần, bạn sẽ bớt tự chịu đựng một mình.',
    keyTraits: ['Tinh tế', 'Biết lắng nghe', 'Giàu trực giác', 'Dễ dao động'],
    lifePath:
      'Những công việc chạm đến cảm xúc và sự chữa lành như nghệ thuật, tư vấn, giáo dục hoặc y tế có thể phù hợp, tùy cách bạn giữ ranh giới cho bản thân.',
  },
  'Vũ Khúc': {
    headline: 'Thực tế và làm việc chắc chắn',
    starNature:
      'Người mang mệnh Vũ Khúc thường thực tế, kỷ luật và coi trọng những gì đo đếm được. ' +
      'Họ làm việc chắc chắn và đáng tin, nhưng dễ khô khan, cô khắc hoặc quá đặt nặng giá trị vật chất.',
    essence:
      'Bạn là người thực tế, kỷ luật và làm việc đến nơi đến chốn. ' +
      'Bạn tin vào những gì làm ra được và kiểm chứng được.',
    gift:
      'Bạn biết biến nguồn lực thành công việc cụ thể và có kết quả. ' +
      'Bạn cũng giỏi đặt câu hỏi đúng lúc để tránh những quyết định vội vàng.',
    shadow:
      'Khi chỉ nhìn vào kết quả và vật chất, bạn dễ khô khan, cô khắc và khó mở lòng với người thân. ' +
      'Nếu để ý đến cảm xúc của người xung quanh, bạn sẽ giữ được các mối quan hệ bền hơn.',
    keyTraits: ['Thực tế', 'Kỷ luật', 'Làm việc chắc chắn', 'Dễ quá nặng vật chất'],
    lifePath:
      'Những lĩnh vực cần sự chính xác và tay nghề như tài chính, kinh doanh, kỹ thuật hoặc quản trị nguồn lực có thể phù hợp, nếu bạn không đánh đổi hết thời gian cho công việc.',
  },
  'Liêm Trinh': {
    headline: 'Nguyên tắc và thẳng thắn',
    starNature:
      'Người mang mệnh Liêm Trinh thường có nguyên tắc, thẳng thắn và coi trọng sự công bằng. ' +
      'Họ giữ lập trường vững vàng, nhưng dễ cực đoan, sa vào thị phi hoặc gặp rắc rối pháp lý, tình cảm khi mất cân bằng.',
    essence:
      'Bạn là người có nguyên tắc, thẳng thắn và coi trọng sự công bằng. ' +
      'Bạn không dễ bước qua những giới hạn mình đã đặt ra.',
    gift:
      'Bạn đủ kiên định để giữ một chuẩn mực khi xung quanh dao động. ' +
      'Sự ngay thẳng của bạn tạo được niềm tin ở người khác.',
    shadow:
      'Khi nguyên tắc bị đẩy quá xa, bạn dễ cực đoan, phán xét người khác và cuốn vào thị phi. ' +
      'Nếu mềm mỏng hơn mà vẫn giữ lập trường, bạn sẽ tránh được những rắc rối không cần thiết.',
    keyTraits: ['Ngay thẳng', 'Có nguyên tắc', 'Giữ lập trường', 'Dễ cực đoan'],
    lifePath:
      'Những nơi cần sự minh bạch và trách nhiệm như pháp lý, quản lý, giáo dục hoặc công việc đòi hỏi chuẩn mực rõ ràng có thể phù hợp, nếu bạn giữ được sự cân bằng giữa lý và tình.',
  },
  'Tham Lang': {
    headline: 'Tò mò và nhiều tài lẻ',
    starNature:
      'Người mang mệnh Tham Lang thường tò mò, nhiều tài lẻ và có sức hút tự nhiên với đám đông. ' +
      'Họ ham trải nghiệm và học nhanh, nhưng dễ phân tán, sa đà hoặc bỏ dở khi bị nhiều thứ cuốn đi.',
    essence:
      'Bạn là người tò mò, thích trải nghiệm và học nhiều thứ mới. ' +
      'Bạn có sức hút tự nhiên và dễ tạo không khí vui vẻ cho tập thể.',
    gift:
      'Bạn học nhanh qua trải nghiệm và biết nối những lĩnh vực khác nhau thành một việc có ích. ' +
      'Bạn cũng khéo giao tiếp nên dễ mở được nhiều cơ hội.',
    shadow:
      'Khi ham quá nhiều thứ, bạn dễ phân tán, sa đà vào những lựa chọn hấp dẫn và bỏ dở việc đang làm. ' +
      'Nếu chọn vài việc đủ sâu để theo lâu dài, bạn sẽ gặt được kết quả rõ hơn.',
    keyTraits: ['Tò mò', 'Nhiều tài lẻ', 'Có sức hút', 'Dễ phân tán'],
    lifePath:
      'Những công việc cần sự giao thoa và cảm hứng như kinh doanh, truyền thông, nghệ thuật hoặc ngoại giao có thể phù hợp, nếu bạn giữ được độ sâu trong một hướng chính.',
  },
  'Cự Môn': {
    headline: 'Sắc sảo và thẳng thắn',
    starNature:
      'Người mang mệnh Cự Môn thường sắc sảo, thẳng thắn và giỏi nhìn ra chỗ chưa thật của vấn đề. ' +
      'Họ có khả năng phân tích và diễn đạt tốt, nhưng dễ đa nghi và vướng khẩu thiệt thị phi.',
    essence:
      'Bạn là người sắc sảo, thích tìm hiểu vấn đề đến tận cùng. ' +
      'Bạn không thích sự mơ hồ và thường đặt câu hỏi để làm rõ mọi chuyện.',
    gift:
      'Bạn có khả năng diễn đạt những điều phức tạp thành câu dễ hiểu. ' +
      'Bạn cũng đủ can đảm nói ra điều cần nói, điều giúp tập thể tránh được sai lầm.',
    shadow:
      'Khi lời nói nhanh hơn sự thấu hiểu, bạn dễ đa nghi, làm người khác tổn thương và vướng thị phi. ' +
      'Nếu chậm lại và chọn cách nói phù hợp, bạn sẽ giữ được hòa khí mà vẫn thẳng thắn.',
    keyTraits: ['Sắc sảo', 'Thẳng thắn', 'Giỏi phân tích', 'Dễ vướng thị phi'],
    lifePath:
      'Những nơi cần tiếng nói và sự phân tích như tư vấn, luật, nghiên cứu, giảng dạy hoặc truyền thông có thể phù hợp, nếu bạn cẩn trọng với lời nói.',
  },
  'Thiên Cơ': {
    headline: 'Suy nghĩ kỹ và làm việc có kế hoạch',
    starNature:
      'Người mang mệnh Thiên Cơ thường thông minh, thích quan sát và suy nghĩ kỹ trước khi làm. ' +
      'Họ nhìn ra vấn đề trước người khác, nhưng dễ nghĩ quá nhiều, đổi ý và bỏ lỡ thời cơ.',
    essence:
      'Bạn là người thích quan sát, phân tích và tìm hiểu vấn đề đến tận gốc. ' +
      'Bạn không thích làm việc qua loa nên thường chuẩn bị kỹ trước khi bắt đầu.',
    gift:
      'Bạn học nhanh, nhìn ra điểm bất hợp lý và lập kế hoạch khá tốt. ' +
      'Bạn cũng biết điều chỉnh cách làm khi hoàn cảnh thay đổi.',
    shadow:
      'Khi chờ mọi thứ thật hoàn hảo, bạn dễ nghĩ quá nhiều, đổi ý liên tục và bỏ lỡ thời cơ. ' +
      'Nếu đặt mốc hành động rõ ràng, bạn sẽ quyết được đúng lúc hơn.',
    keyTraits: ['Sâu sắc', 'Cẩn trọng', 'Giỏi hoạch định', 'Dễ bỏ lỡ thời cơ'],
    lifePath:
      'Những công việc cần phân tích và chuẩn bị kỹ như nghiên cứu, giáo dục, công nghệ hoặc tư vấn có thể phù hợp, nếu bạn chấp nhận ra quyết định khi đã đủ thông tin.',
  },
  'Thiên Đồng': {
    headline: 'Hiền hòa và dễ chịu',
    starNature:
      'Người mang mệnh Thiên Đồng thường hiền hòa, dễ chịu và biết tìm niềm vui trong những điều giản dị. ' +
      'Họ dễ tạo cảm giác thân thiện, nhưng ngại va chạm, thiếu chí tiến thủ và dễ dựa dẫm khi gặp khó khăn.',
    essence:
      'Bạn là người hiền hòa, dễ chịu và biết tận hưởng những điều giản dị. ' +
      'Bạn ít khi tranh cãi và thường nhường nhịn người khác.',
    gift:
      'Bạn có mặt ở đâu là ở đó bớt căng thẳng, vì bạn biết lắng nghe và chấp nhận người khác. ' +
      'Bạn cũng biết tạo niềm vui từ những việc nhỏ.',
    shadow:
      'Khi ngại va chạm, bạn dễ đồng ý cho xong, thiếu chí tiến thủ và dựa vào người khác. ' +
      'Nếu học cách nói lời từ chối nhẹ nhàng và tự quyết một số việc, bạn sẽ bớt chịu thiệt.',
    keyTraits: ['Hiền hòa', 'Dễ chịu', 'Biết đủ', 'Dễ dựa dẫm'],
    lifePath:
      'Những công việc cần sự tận tâm và chăm sóc như y tế, dịch vụ, giáo dục hoặc nơi cần hóa giải căng thẳng có thể phù hợp, nếu bạn giữ được sự chủ động.',
  },
  'Thiên Tướng': {
    headline: 'Đáng tin và có trách nhiệm',
    starNature:
      'Người mang mệnh Thiên Tướng thường đáng tin, có trách nhiệm và giữ lời như một nguyên tắc sống. ' +
      'Họ thích sự rõ ràng và ổn định, nhưng dễ lệ thuộc, thiếu chính kiến hoặc bám vào khuôn mẫu khi đứng trước thay đổi.',
    essence:
      'Bạn là người đáng tin, có trách nhiệm và giữ lời. ' +
      'Bạn thích sự rõ ràng và làm việc theo kế hoạch đã định.',
    gift:
      'Bạn giữ cho công việc vận hành đúng nhịp và là điểm tựa khi mọi thứ chao đảo. ' +
      'Sự trung thực trong công việc của bạn khiến người khác nhớ lâu.',
    shadow:
      'Khi quá dựa vào người khác hoặc vào khuôn mẫu cũ, bạn dễ thiếu chính kiến và ngại thay đổi. ' +
      'Nếu tập tự quyết những việc nhỏ, bạn sẽ linh hoạt hơn trước hoàn cảnh mới.',
    keyTraits: ['Đáng tin', 'Có trách nhiệm', 'Giữ lời', 'Dễ lệ thuộc'],
    lifePath:
      'Những nơi cần sự vận hành và tin cậy như hành chính, quản lý, dịch vụ công hoặc điều phối công việc có thể phù hợp, nếu bạn học cách thích nghi với thay đổi.',
  },
  'Thiên Lương': {
    headline: 'Nhân hậu và điềm đạm',
    starNature:
      'Người mang mệnh Thiên Lương thường nhân hậu, điềm đạm và hay chăm sóc người khác trước khi nghĩ đến mình. ' +
      'Họ từng trải và biết lo xa, nhưng dễ mang gánh nặng, lo chuyện bao đồng và bảo thủ với cái cũ.',
    essence:
      'Bạn là người nhân hậu, điềm đạm và quan tâm đến người khác. ' +
      'Bạn thường nghĩ đến những điều lâu bền hơn là niềm vui trước mắt.',
    gift:
      'Bạn nhận ra điều gì đang cần được chăm sóc trước khi nó đổ vỡ, ở người khác cũng như trong tập thể. ' +
      'Sự điềm đạm của bạn khiến người khác thấy an tâm.',
    shadow:
      'Khi nhận quá nhiều trách nhiệm cho người khác, bạn dễ mang gánh nặng, lo chuyện bao đồng và bỏ quên nhu cầu của mình. ' +
      'Nếu giữ lại một phần năng lượng cho bản thân, bạn sẽ bền sức hơn.',
    keyTraits: ['Nhân hậu', 'Điềm đạm', 'Từng trải', 'Dễ mang gánh nặng'],
    lifePath:
      'Những công việc chạm tới sự chăm sóc và đạo đức như y tế, giáo dục, tâm lý hoặc công việc thiện nguyện có thể phù hợp, nếu bạn biết đặt giới hạn cho mình.',
  },
  'Thất Sát': {
    headline: 'Mạnh mẽ và quyết đoán',
    starNature:
      'Người mang mệnh Thất Sát thường mạnh mẽ, quyết đoán và không ngại đương đầu với thử thách. ' +
      'Họ dám đi đầu và chịu được áp lực, nhưng dễ cô độc, nóng nảy và tranh chấp khi căng thẳng kéo dài.',
    essence:
      'Bạn là người mạnh mẽ, quyết đoán và không ngại thử thách. ' +
      'Bạn thích hành động hơn là ngồi chờ và thường dám đi trước người khác.',
    gift:
      'Khi việc khó cần một người dám bước lên trước, bạn thường là người đó. ' +
      'Bạn có khả năng chịu áp lực và đứng dậy nhanh sau thất bại.',
    shadow:
      'Khi áp lực kéo dài, bạn dễ nóng nảy, tranh chấp và làm đứt gãy quan hệ thân thiết. ' +
      'Nếu học cách lắng nghe và giảm tốc đúng lúc, bạn sẽ giữ được người ở bên mình.',
    keyTraits: ['Mạnh mẽ', 'Quyết đoán', 'Dám đi đầu', 'Dễ cô độc'],
    lifePath:
      'Những lĩnh vực cần sự quyết liệt và bản lĩnh như kinh doanh, quản lý, công việc tiên phong hoặc xử lý khủng hoảng có thể phù hợp, nếu bạn biết tiết chế cái nóng của mình.',
  },
  'Phá Quân': {
    headline: 'Sáng tạo và thích đổi mới',
    starNature:
      'Người mang mệnh Phá Quân thường sáng tạo, ưa đổi mới và muốn tự tay dựng lại những gì đã cũ. ' +
      'Họ dám khởi đầu và học nhanh qua va chạm, nhưng dễ hao tán, bất ổn và phá trước khi kịp giữ.',
    essence:
      'Bạn là người sáng tạo, thích đổi mới và không muốn đứng yên. ' +
      'Bạn bị thu hút bởi những điều chưa có và muốn tự tay làm lại theo cách của mình.',
    gift:
      'Bạn dám tạo ra những khởi đầu mà người khác ngại làm. ' +
      'Bạn học rất nhanh qua va chạm và thường rút ra được bài học cụ thể.',
    shadow:
      'Khi đổi mới quá nhanh, bạn dễ phá bỏ cái cũ trước khi giữ lại những gì còn tốt, khiến nguồn lực hao tán và cuộc sống bất ổn. ' +
      'Nếu chậm lại để nhìn lại trước khi quyết định, bạn sẽ giữ được thành quả.',
    keyTraits: ['Sáng tạo', 'Dũng cảm', 'Thích đổi mới', 'Dễ hao tán'],
    lifePath:
      'Những nơi cần sự đổi mới và tinh thần khởi tạo như khởi nghiệp, sáng tạo, đổi mới sản phẩm hoặc công việc cần phá cách có thể phù hợp, nếu bạn biết giữ lại phần cốt lõi.',
  },
  fallback: FALLBACK_NARRATIVE,
};

/** Hướng luận cốt lõi của từng cung khi cung Thân đóng tại cung đó. */
const BODY_PALACE_FOCUS: Readonly<Record<PalaceId, string>> = {
  menh: 'bản thân và việc tự lập nghiệp',
  phuMau: 'nền tảng gia đình và học vấn',
  phucDuc: 'đời sống tinh thần và sự an yên',
  dienTrach: 'tài sản, nhà cửa và gia tộc',
  quanLoc: 'sự nghiệp và địa vị xã hội',
  noBoc: 'quan hệ bạn bè, cấp dưới và người giúp đỡ',
  thienDi: 'hoạt động bên ngoài, đi lại và mở rộng cơ hội',
  tatAch: 'sức khỏe và việc vượt qua thử thách',
  taiBach: 'tiền bạc và khả năng sinh lợi',
  tuTuc: 'con cái và thế hệ kế tiếp',
  phuThe: 'hôn nhân và đời sống tình cảm',
  huynhDe: 'anh em và các mối quan hệ đồng trang lứa',
};

interface TamHopArchetype {
  name: string;
  /** Các chính tinh phải xuất hiện (gộp) trong ba cung Mệnh, Tài Bạch, Quan Lộc. */
  stars: readonly string[];
  meaning: string;
  matches: (chart: ZiweiChart) => boolean;
}

/** Sắp xếp từ bộ nhiều sao đến ít sao để ưu tiên cách cục cụ thể nhất. */
const TAM_HOP_ARCHETYPES: readonly TamHopArchetype[] = [
  {
    name: 'Tử Phủ Vũ Tướng',
    stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
    meaning:
      'Tử Vi và Thiên Phủ mang lại uy tín, còn Vũ Khúc và Thiên Tướng cho năng lực quản trị, tài chính và sự tín nhiệm. ' +
      'Đây là cách cục của người lãnh đạo, quản lý hoặc điều hành có hệ thống, thiên về quản trị và giữ vững thành quả hơn là mạo hiểm. ' +
      'Cần tránh bảo thủ và đặt nặng thành tích đã có.',
    matches: (chart): boolean => {
      const stars = collectTamHopMajorStars(chart);
      return (
        hasAllStarNames(stars, ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng']) &&
        brightnessRankOf(stars, 'Tử Vi') >= BRIGHTNESS_RANK.binh &&
        brightnessRankOf(stars, 'Thiên Phủ') >= BRIGHTNESS_RANK.binh
      );
    },
  },
  {
    name: 'Cơ Nguyệt Đồng Lương',
    stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
    meaning:
      'Đây là cách cục của trí tuệ và tham mưu: đầu óc phân tích, tinh tế và nhiều lòng trắc ẩn. ' +
      'Phù hợp với hoạch định, tư vấn, hành chính, giáo dục hoặc các vai trò cần sự ổn định. ' +
      'Sự nghiệp thường đi theo lối bền bỉ, tích lũy dần hơn là bứt phá đột ngột; cần tránh thiếu quyết đoán khi phải chọn hướng.',
    matches: (chart): boolean => {
      const stars = collectTamHopMajorStars(chart);
      return (
        hasAllStarNames(stars, ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương']) &&
        brightnessRankOf(stars, 'Thái Âm') >= BRIGHTNESS_RANK.dac &&
        brightnessRankOf(stars, 'Thiên Cơ') >= BRIGHTNESS_RANK.binh
      );
    },
  },
  {
    name: 'Sát Phá Tham',
    stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'],
    meaning:
      'Đây là cách cục của hành động tiên phong: dám đương đầu, dám phá cũ lập mới và có tinh thần cạnh tranh cao. ' +
      'Phù hợp với khởi nghiệp, kinh doanh, đầu tư hoặc các lĩnh vực biến động. ' +
      'Cuộc đời thường nhiều thăng trầm, càng về sau càng cần biết tích lũy và kiểm soát rủi ro.',
    matches: (chart): boolean => {
      const stars = collectTamHopMajorStars(chart);
      const starNames = ['Thất Sát', 'Phá Quân', 'Tham Lang'];
      const stableCount = starNames.filter(
        (name) => brightnessRankOf(stars, name) >= BRIGHTNESS_RANK.binh
      ).length;
      return hasAllStarNames(stars, starNames) && stableCount >= 2;
    },
  },
  {
    name: 'Tử Vũ Liêm',
    stars: ['Tử Vi', 'Vũ Khúc', 'Liêm Trinh'],
    meaning:
      'Đây là cách cục của kỷ luật và trách nhiệm: người có nguyên tắc, làm việc chắc tay, phù hợp với quản lý tài chính, pháp chế hoặc điều hành tổ chức. ' +
      'Điểm mạnh là sự ngay thẳng và bền chí; cần tránh cứng nhắc quá mức.',
    matches: (chart): boolean => {
      const stars = collectTamHopMajorStars(chart);
      return (
        hasAllStarNames(stars, ['Tử Vi', 'Vũ Khúc', 'Liêm Trinh']) &&
        brightnessRankOf(stars, 'Tử Vi') >= BRIGHTNESS_RANK.binh &&
        (brightnessRankOf(stars, 'Vũ Khúc') >= BRIGHTNESS_RANK.dac ||
          brightnessRankOf(stars, 'Liêm Trinh') >= BRIGHTNESS_RANK.dac)
      );
    },
  },
  {
    name: 'Cự Nhật',
    stars: ['Cự Môn', 'Thái Dương'],
    meaning:
      'Đây là cách cục của ngôn từ và danh tiếng: khả năng thuyết phục, truyền đạt tốt, phù hợp với giảng dạy, truyền thông, tư vấn hoặc đàm phán. ' +
      'Sự nghiệp thường gắn với việc được nhiều người biết đến, nhưng cần cẩn trọng với lời nói.',
    matches: (chart): boolean => {
      const ids = ['menh', 'taiBach', 'quanLoc', 'thienDi'] as const;
      return ids.some((id) => {
        const palace = findPalace(chart, id);
        if (!palace) return false;
        if (palace.branch !== 'dan' && palace.branch !== 'than') return false;
        const names = new Set((palace.majorStars ?? []).map((star) => star.name));
        return names.has('Cự Môn') && names.has('Thái Dương');
      });
    },
  },
];

const TAM_HOP_PALACE_IDS = ['menh', 'taiBach', 'quanLoc'] as const;

function findTamHopArchetype(chart: ZiweiChart): TamHopArchetype | undefined {
  return TAM_HOP_ARCHETYPES.find((archetype) => archetype.matches(chart));
}

function collectTamHopMajorStars(chart: ZiweiChart): readonly Star[] {
  return TAM_HOP_PALACE_IDS.flatMap((id) => findPalace(chart, id)?.majorStars ?? []);
}

function hasAllStarNames(stars: readonly Star[], names: readonly string[]): boolean {
  return names.every((name) => stars.some((star) => star.name === name));
}

function brightnessRankOf(stars: readonly Star[], name: string): number {
  let rank = 0;
  for (const star of stars) {
    if (star.name !== name) continue;
    const starRank = star.brightness ? BRIGHTNESS_RANK[star.brightness] : 0;
    if (starRank > rank) rank = starRank;
  }
  return rank;
}

function findPalace(chart: ZiweiChart, id: PalaceId): Palace | undefined {
  return chart.palaces.find((p) => p.id === id);
}

/** Tên sao kèm thế sáng, ví dụ "Tử Vi (Miếu địa)". */
function describeStar(star: Star): string {
  return star.brightness ? `${star.name} (${BRIGHTNESS_LABELS_VI[star.brightness]})` : star.name;
}

function describeStars(stars: readonly Star[]): string {
  return stars.map(describeStar).join(', ');
}

function listNames(stars: readonly Star[] | undefined, limit = 4): string {
  return (stars ?? [])
    .slice(0, limit)
    .map((s) => s.name)
    .join(', ');
}

/** Thế sáng tốt nhất trong danh sách sao, bỏ qua sao không có thông tin độ sáng. */
function bestBrightness(stars: readonly Star[]): BrightnessLevel | undefined {
  let best: BrightnessLevel | undefined;
  for (const star of stars) {
    if (star.brightness && (!best || BRIGHTNESS_RANK[star.brightness] > BRIGHTNESS_RANK[best])) {
      best = star.brightness;
    }
  }
  return best;
}

function resolveStarNarrative(chart: ZiweiChart): StarNarrative {
  const menh = findPalace(chart, 'menh');
  for (const star of menh?.majorStars ?? []) {
    const narrative = STAR_NARRATIVES[star.name];
    if (narrative) return narrative;
  }
  return FALLBACK_NARRATIVE;
}

function buildIntroParagraph(narrative: StarNarrative): string {
  return narrative.starNature;
}

function buildMenhParagraph(narrative: StarNarrative): string {
  return `${narrative.essence} ${narrative.gift} ${narrative.shadow}`;
}

function buildTechnicalIntro(chart: ZiweiChart): string {
  const plate = chart.heavenPlate;
  if (!plate?.napAm || !plate.fiveElementsClass) return '';

  const relationSummary =
    plate.elementRelationSummary && plate.elementRelationSummary !== 'Cần tính chi tiết'
      ? plate.elementRelationSummary
      : describeElementRelation(plate.napAm.element, plate.fiveElementsClass.element);

  const meaning = getNapAmMeaning(plate.napAm.name);
  const napAm = meaning ? `**${plate.napAm.name}** (${meaning})` : `**${plate.napAm.name}**`;

  return [
    `Bạn thuộc **${plate.yinYangGenderLabel}**, mang **${plate.fiveElementsClass.name}**, bản mệnh nạp âm là ${napAm}.`,
    relationSummary,
    `Chủ Mệnh là **${plate.soulLord}**, Chủ Thân là **${plate.bodyLord}**.`,
  ]
    .filter(Boolean)
    .join(' ');
}

function buildTechnicalMenh(chart: ZiweiChart): string {
  const menh = findPalace(chart, 'menh');
  if (!menh) return '';

  const branchLabel = getBranchLabel(menh.branch);
  const stars = menh.majorStars ?? [];
  const parts: string[] = [];

  if (stars.length === 0) {
    const oppositeStars = findPalace(chart, 'thienDi')?.majorStars ?? [];
    const borrowed =
      oppositeStars.length > 0
        ? `Cần mượn sao từ cung Thiên Di xung chiếu (${describeStars(oppositeStars)}) để luận tính cách.`
        : 'Cần mượn sao từ cung Thiên Di xung chiếu để luận tính cách.';
    parts.push(
      `Cung Mệnh tọa **${branchLabel}** và **Mệnh Vô Chính Diệu**, không có chính tinh tọa thủ. ${borrowed} ` +
        'Người Mệnh Vô Chính Diệu thường linh hoạt, dễ thích nghi, nhưng chịu ảnh hưởng mạnh từ hoàn cảnh bên ngoài.'
    );
  } else {
    parts.push(`Cung Mệnh tọa **${branchLabel}**, có chính tinh **${describeStars(stars)}**.`);

    const best = bestBrightness(stars);
    if (best === 'mieu' || best === 'vuong' || best === 'dac') {
      parts.push(
        `Chính tinh ở thế **${BRIGHTNESS_LABELS_VI[best]}** nên năng lượng cốt lõi vững vàng, dễ phát huy thế mạnh khi có cơ hội.`
      );
    } else if (best === 'binh') {
      parts.push(
        'Chính tinh ở thế **Ổn định** nên năng lượng cốt lõi ở mức ổn định, thành công phụ thuộc nhiều vào nỗ lực và môi trường.'
      );
    } else if (best === 'ham') {
      parts.push(
        'Chính tinh ở thế **Hãm địa** nên năng lượng cốt lõi bị hạn chế, dễ thiếu tự tin hoặc vất vả hơn người khác; cần nhiều nỗ lực để bù đắp, và kiên trì tích lũy kinh nghiệm sẽ giúp chuyển hóa nghịch cảnh.'
      );
    }

    const auspicious = listNames(menh.auspiciousStars);
    if (auspicious) {
      parts.push(
        `Các cát tinh như **${auspicious}** hỗ trợ thêm cho sự nghiệp và các mối quan hệ.`
      );
    }
    const malefic = listNames(menh.maleficStars);
    if (malefic) {
      parts.push(
        `Các sao hung như **${malefic}** là điểm cần để ý: dễ gây áp lực nội tâm, nóng nảy hoặc quyết định vội vàng nếu không tiết chế.`
      );
    }
  }

  const mutagenStars = [
    ...(menh.majorStars ?? []),
    ...(menh.auspiciousStars ?? []),
    ...(menh.maleficStars ?? []),
    ...(menh.otherStars ?? []),
  ].filter((star): star is Star & { mutagen: MutagenType } => Boolean(star.mutagen));
  if (mutagenStars.length > 0) {
    parts.push(
      `Về Tứ Hóa, cung Mệnh có ${mutagenStars
        .map((star) => `**${MUTAGEN_LABELS_VI[star.mutagen]}** tại **${star.name}**`)
        .join(
          ', '
        )}, góp phần định hình duyên tài lộc, uy quyền, danh tiếng và những trở ngại cần vượt qua.`
    );
  }

  if (menh.hasTuan) {
    parts.push(
      'Cung Mệnh gặp **Tuần Không**, ý tưởng lớn thường đến muộn hoặc phải chiêm nghiệm lâu hơn; kiên nhẫn là chìa khóa.'
    );
  }
  if (menh.hasTriet) {
    parts.push(
      'Cung Mệnh gặp **Triệt Lộc**, đương số dễ đổi hướng, có lúc buông bỏ để tìm con đường mới; cần giữ mục tiêu rõ ràng.'
    );
  }

  return parts.join(' ');
}

function buildPalaceSentence(label: string, palace: Palace | undefined): string | null {
  if (!palace) return null;

  const stars = palace.majorStars ?? [];
  const body = stars.length > 0 ? `có chính tinh **${describeStars(stars)}**` : 'Vô Chính Diệu';
  return `Cung ${label} tọa **${getBranchLabel(palace.branch)}**, ${body}.`;
}

function buildTechnicalFormation(chart: ZiweiChart): string {
  const archetype = findTamHopArchetype(chart);
  const combined = new Set(collectTamHopMajorStars(chart).map((star) => star.name));

  const parts: string[] = [];
  if (archetype) {
    parts.push(
      `Tam Hợp Mệnh - Tài Bạch - Quan Lộc hội tụ cách **${archetype.name}**. ${archetype.meaning}`
    );
  } else if (combined.size > 0) {
    parts.push(
      `Tam Hợp Mệnh - Tài Bạch - Quan Lộc không hình thành cách cục nổi bật; các chính tinh chủ đạo gồm ${[...combined].join(', ')}, ` +
        'nên sự nghiệp và tài chính được quyết định chủ yếu bởi nỗ lực cá nhân và cung chiếu.'
    );
  }

  for (const sentence of [
    buildPalaceSentence('Tài Bạch', findPalace(chart, 'taiBach')),
    buildPalaceSentence('Quan Lộc', findPalace(chart, 'quanLoc')),
  ]) {
    if (sentence) parts.push(sentence);
  }

  const plate = chart.heavenPlate;
  if (plate) {
    const bodyPalace = chart.palaces.find((p) => p.branch === plate.bodyPalaceBranch);
    if (bodyPalace) {
      const bodyStars = bodyPalace.majorStars ?? [];
      const starText =
        bodyStars.length > 0
          ? `với chính tinh **${describeStars(bodyStars)}**`
          : 'nhưng Vô Chính Diệu, nên hậu vận phụ thuộc nhiều vào cung xung chiếu';
      parts.push(
        `Cung Thân an tại **${getBranchLabel(bodyPalace.branch)}** (${plate.bodyPalaceName}), ${starText}. ` +
          `Trọng tâm đời người ở trung và hậu vận dịch chuyển sang ${BODY_PALACE_FOCUS[bodyPalace.id]}.`
      );
    }
  }

  return parts.join(' ');
}

function buildTechnicalConclusion(chart: ZiweiChart): string {
  const menh = findPalace(chart, 'menh');
  const stars = menh?.majorStars ?? [];
  const best = bestBrightness(stars);

  let trajectory: string;
  if (stars.length === 0) {
    trajectory =
      'số mệnh thường thăng trầm theo hoàn cảnh, thành công đến khi đương số tự xác định được hướng đi và kiên trì theo đuổi.';
  } else if (best === 'mieu' || best === 'vuong' || best === 'dac') {
    trajectory =
      'nền tảng khá vững, tiềm năng tích lũy đều và càng về sau càng rõ nét, đặc biệt khi chọn đúng lĩnh vực.';
  } else if (best === 'binh') {
    trajectory =
      'số mệnh thăng trầm xen kẽ, giai đoạn đầu thường phải nỗ lực nhiều, thành quả đến từ sự bền bỉ và tích lũy kinh nghiệm.';
  } else if (best === 'ham') {
    trajectory =
      'số mệnh nhiều biến động, đương số dễ gặp thử thách lớn hơn người khác, nhưng nếu kiên trì vượt qua được thì bài học rút ra rất sâu sắc.';
  } else {
    trajectory =
      'số mệnh mang tính trung tính, thành công phụ thuộc vào sự cân bằng giữa nỗ lực bản thân và hoàn cảnh, càng về sau càng rõ nét khi biết phát huy thế mạnh.';
  }

  const lessons: string[] = [];
  if (menh?.hasTuan) lessons.push('học cách kiên nhẫn chờ thời cơ');
  if (menh?.hasTriet) lessons.push('giữ mục tiêu rõ ràng khi hoàn cảnh thay đổi');
  if (menh?.maleficStars?.length) {
    lessons.push('tiết chế những điểm mạnh đã thành thói quen cực đoan');
  }
  lessons.push('tin vào lộ trình dài hạn thay vì chỉ nhìn kết quả ngắn hạn');

  return (
    `Xét riêng cung Mệnh, ${trajectory} ` +
    `Bài học cần rèn luyện là ${lessons.join('; ')}. ` +
    'Điểm số từng chủ đề được trình bày riêng trong mục “Khái quát lá số”.'
  );
}

type ConclusionQuoteCategory = ConclusionTone | 'voChinhDieu' | 'thanCuThienDi' | 'satPhaTham';

const CONCLUSION_QUOTES: Readonly<Record<ConclusionQuoteCategory, readonly string[]>> = {
  high: [
    'Phúc lộc có lúc đến, biết nắm thời và giữ đức thì đường dài mới vững.',
    'Phúc trạch sâu dày là nền, song quý nhân chỉ đến khi mình biết tạo duyên.',
    'Mệnh đắc chính tinh, vận trình thuận hơn, song hậu vận an khang còn tùy sức giữ.',
    'Khí chất đường hoàng dễ tạo thiện cảm; tài lộc và gia đạo còn tùy cách vun vén.',
    'Căn cơ vững chắc, gặp thời thì phát, giữ đức thì bền lâu.',
    'Sao sáng chiếu mệnh mở nhiều cơ duyên, càng về sau càng cần biết giữ nhịp.',
  ],
  balanced: [
    'Cục diện trung hòa, có thăng có trầm, cốt ở chữ nhẫn mà vững bước.',
    'Không quá hiển đạt nhưng ổn định, biết tùy thời thì an khang.',
    'Tiền vận có chút chông gai, hậu vận dần yên ổn nếu biết giữ mình.',
    'Âm dương hòa hợp, được mất đan xen, giữ tâm bình thì đường dài an ổn.',
    'Vận trình không dồn dập, cốt ở sự bền bỉ và biết lượng sức mà tiến.',
    'Có lúc thuận có lúc nghịch, biết tiến thoái đúng lúc thì sự nghiệp hanh thông.',
  ],
  challenging: [
    'Cung Mệnh có nhiều sao cản trở, cuộc đời lắm đoạn thăng trầm, cần lấy nhẫn nại làm gốc.',
    'Tiền vận lắm nỗi gian nan, hậu vận mới dần yên ổn nếu biết tu tâm.',
    'Duyên khởi có phần trắc trở, cần lấy đức thắng số, lấy tĩnh chế động.',
    'Sóng gió là thử thách để tôi luyện; giữ tâm vững thì hậu vận an khang.',
    'Đường đời nhiều chông gai, càng giữ chí bền thì càng dễ chuyển hung thành cát.',
    'Vận có lúc ngặt nghèo, cốt lấy thiện tâm và nghị lực mà vượt qua.',
  ],
  voChinhDieu: [
    'Mệnh vô chính diệu, nên linh hoạt tùy thế, mượn sức tam phương mà định hướng.',
    'Mệnh vô chính diệu, tiền vận nhiều phen thử sức, hậu vận vững vàng nếu biết bền chí.',
    'Mệnh vô chính diệu, linh hoạt ứng biến, mở lòng học hỏi thì dễ gặp người nâng đỡ.',
    'Mệnh vô chính diệu, chẳng nên thủ cựu, biết tùy duyên mà lập nghiệp thì về sau yên ổn.',
    'Mệnh vô chính diệu, lấy tam phương chiếu về làm chỗ dựa, bền chí thì dần vững.',
  ],
  thanCuThienDi: [
    'Thân cư Thiên Di, bôn ba bốn bể, hậu vận an yên nếu biết giữ gốc gia đạo.',
    'Thân cư Thiên Di, đi xa mở được cơ duyên nếu biết giữ mình và kết giao.',
    'Thân cư Thiên Di, nửa đời lưu động, đổi thay là lẽ thường, giữ tâm thì dần vững.',
    'Thân cư Thiên Di, lấy phương xa làm đất dụng võ, giữ tâm vững thì đường dài hanh thông.',
    'Thân cư Thiên Di, ra ngoài lập nghiệp dễ gặp quý nhân, nhưng cần giữ gốc gia đạo.',
  ],
  satPhaTham: [
    'Sát Phá Tham hội hợp, khí phách mạnh mẽ, thăng trầm bất định, tiết chế thì giữ được thành quả.',
    'Sát Phá Tham hội hợp, trải sóng gió có thể mở rộng cơ nghiệp nếu biết giữ nhịp.',
    'Sát Phá Tham hội hợp, dám phá cũ lập mới, biết tiết chế thì thăng trầm hóa thành bản lĩnh.',
    'Sát Phá Tham hội hợp, tiền vận nhiều phen đổi dời, hậu vận vững vàng nếu biết tích lũy.',
    'Sát Phá Tham hội hợp, khí phách hơn người, cốt lấy nhẫn nại và chừng mực mà giữ thành quả.',
  ],
};

function findBodyPalace(chart: ZiweiChart): Palace | undefined {
  const palaces = chart.palaces ?? [];
  const flagged = palaces.find((palace) => palace.isBodyPalace);
  if (flagged) return flagged;
  const bodyBranch = chart.heavenPlate?.bodyPalaceBranch;
  if (!bodyBranch) return undefined;
  return palaces.find((palace) => palace.branch === bodyBranch);
}

function deriveConclusionTone(menh: Palace | undefined): ConclusionTone {
  const maleficCount = menh?.maleficStars?.length ?? 0;
  const auspiciousCount = menh?.auspiciousStars?.length ?? 0;
  const best = bestBrightness(menh?.majorStars ?? []);
  const hasTuanTriet = Boolean(menh?.hasTuan || menh?.hasTriet);

  if (
    best &&
    BRIGHTNESS_RANK[best] >= BRIGHTNESS_RANK.dac &&
    maleficCount <= 1 &&
    !hasTuanTriet &&
    auspiciousCount > 0
  ) {
    return 'high';
  }

  if (maleficCount >= 3 || best === 'ham' || (hasTuanTriet && maleficCount >= 1)) {
    return 'challenging';
  }

  return 'balanced';
}

/** Chọn câu cố định theo cung, số sao và độ sáng để cùng một lá số luôn ra cùng khẩu khí. */
function pickConclusionQuote(category: ConclusionQuoteCategory, menh: Palace | undefined): string {
  const quotes = CONCLUSION_QUOTES[category];
  const branchIndex = menh?.index ?? 0;
  const starCount = (menh?.majorStars?.length ?? 0) + (menh?.maleficStars?.length ?? 0);
  const best = bestBrightness(menh?.majorStars ?? []);
  const brightnessRank = best ? BRIGHTNESS_RANK[best] : 0;
  return quotes[(branchIndex + starCount + brightnessRank) % quotes.length];
}

function buildConclusionQuote(chart: ZiweiChart): { quote: string; tone: ConclusionTone } {
  const menh = findPalace(chart, 'menh');
  const hasMajorStars = (menh?.majorStars?.length ?? 0) > 0;
  const bodyPalace = findBodyPalace(chart);
  const tone = deriveConclusionTone(menh);

  let category: ConclusionQuoteCategory;
  if (menh && !hasMajorStars) {
    category = 'voChinhDieu';
  } else if (findTamHopArchetype(chart)?.name === 'Sát Phá Tham') {
    category = 'satPhaTham';
  } else if (bodyPalace?.id === 'thienDi') {
    category = 'thanCuThienDi';
  } else {
    category = tone;
  }

  return { quote: pickConclusionQuote(category, menh), tone };
}

export function generatePersonalSummary(chart: ZiweiChart): PersonalSummary {
  const narrative = resolveStarNarrative(chart);
  const menh = findPalace(chart, 'menh');
  const starName = menh?.majorStars?.[0]?.name ?? 'Vô Chính Diệu';
  const conclusion = buildConclusionQuote(chart);

  const introParagraph = buildIntroParagraph(narrative);
  const menhStarParagraph = buildMenhParagraph(narrative);
  const description = [introParagraph, menhStarParagraph].join(' ');

  const technicalParagraphs = [
    buildTechnicalIntro(chart),
    buildTechnicalMenh(chart),
    buildTechnicalFormation(chart),
    buildTechnicalConclusion(chart),
  ].filter((paragraph): paragraph is string => Boolean(paragraph));

  return {
    ownerName: chart.heavenPlate?.name || 'Đương số',
    headline: narrative.headline,
    description,
    keyTraits: [...narrative.keyTraits],
    lifePath: narrative.lifePath,
    starName,
    technicalParagraphs,
    introParagraph,
    menhStarParagraph,
    tamHopAndThanParagraph: '',
    conclusionParagraph: '',
    conclusionQuote: conclusion.quote,
    conclusionTone: conclusion.tone,
  };
}
