import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import type {
  BrightnessLevel,
  FiveElement,
  MutagenType,
  PalaceId,
} from '@/lib/ziwei/types/enums';
import { getBranchLabel } from '@/lib/chart/display-helpers';

export interface PersonalSummary {
  /** Tên đương số, hiển thị làm ngữ cảnh "Tổng quan lá số của ...". */
  ownerName?: string;
  headline: string;
  description: string;
  keyTraits: string[];
  lifePath: string;
  /** Đoạn mở đầu: nền tảng lá số (Âm Dương, Nạp Âm, Cục, Chủ Mệnh/Chủ Thân). */
  introParagraph?: string;
  /** Đoạn phân tích cung Mệnh và chính tinh. */
  menhStarParagraph?: string;
  /** Đoạn phân tích Tam Hợp (Mệnh - Tài - Quan) và cung Thân. */
  tamHopAndThanParagraph?: string;
  /** Đoạn kết tổng hợp, kèm nội dung `description`. */
  conclusionParagraph?: string;
}

const BRIGHTNESS_LABELS_VI: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu địa',
  vuong: 'Vượng địa',
  dac: 'Đắc địa',
  binh: 'Bình hòa',
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
}

/** Sắp xếp từ bộ nhiều sao đến ít sao để ưu tiên cách cục cụ thể nhất. */
const TAM_HOP_ARCHETYPES: readonly TamHopArchetype[] = [
  {
    name: 'Tử Phủ Vũ Tướng',
    stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
    meaning:
      'Tử Vi và Thiên Phủ mang lại uy tín, còn Vũ Khúc và Thiên Tướng cho năng lực quản trị, tài chính và sự tín nhiệm. ' +
      'Đây là cách cục của người lãnh đạo, quản lý hoặc điều hành có hệ thống, thiên về quản trị và giữ vững thành quả hơn là mạo hiểm.',
  },
  {
    name: 'Cơ Nguyệt Đồng Lương',
    stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
    meaning:
      'Đây là cách cục của trí tuệ và tham mưu: đầu óc phân tích, tinh tế và nhiều lòng trắc ẩn. ' +
      'Phù hợp với hoạch định, tư vấn, hành chính, giáo dục hoặc các vai trò cần sự ổn định. ' +
      'Sự nghiệp thường đi theo lối bền bỉ, tích lũy dần hơn là bứt phá đột ngột.',
  },
  {
    name: 'Sát Phá Tham',
    stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'],
    meaning:
      'Đây là cách cục của hành động tiên phong: dám đương đầu, dám phá cũ lập mới và có tinh thần cạnh tranh cao. ' +
      'Phù hợp với khởi nghiệp, kinh doanh, đầu tư hoặc các lĩnh vực biến động. ' +
      'Cuộc đời thường nhiều thăng trầm, càng về sau càng cần biết tích lũy và kiểm soát rủi ro.',
  },
  {
    name: 'Tử Vũ Liêm',
    stars: ['Tử Vi', 'Vũ Khúc', 'Liêm Trinh'],
    meaning:
      'Đây là cách cục của kỷ luật và trách nhiệm: người có nguyên tắc, làm việc chắc tay, phù hợp với quản lý tài chính, pháp chế hoặc điều hành tổ chức. ' +
      'Điểm mạnh là sự ngay thẳng và bền chí; cần tránh cứng nhắc quá mức.',
  },
  {
    name: 'Cự Nhật',
    stars: ['Cự Môn', 'Thái Dương'],
    meaning:
      'Đây là cách cục của ngôn từ và danh tiếng: khả năng thuyết phục, truyền đạt tốt, phù hợp với giảng dạy, truyền thông, tư vấn hoặc đàm phán. ' +
      'Sự nghiệp thường gắn với việc được nhiều người biết đến, nhưng cần cẩn trọng với lời nói.',
  },
];

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

function buildIntroParagraph(chart: ZiweiChart): string {
  const plate = chart.heavenPlate;
  if (!plate) return '';

  const relationSummary =
    plate.elementRelationSummary && plate.elementRelationSummary !== 'Cần tính chi tiết'
      ? plate.elementRelationSummary
      : describeElementRelation(plate.napAm.element, plate.fiveElementsClass.element);

  return (
    `Lá số của **${plate.name || 'Đương số'}** thuộc **${plate.yinYangGenderLabel}**, ` +
    `Bản Mệnh Nạp Âm là **${plate.napAm.name}**, lập ở **${plate.fiveElementsClass.name}**. ` +
    `${relationSummary} ` +
    `Chủ Mệnh là **${plate.soulLord}**, Chủ Thân là **${plate.bodyLord}**. ` +
    'Đây là nền tảng cho tính cách và cách đương số đối diện với hoàn cảnh sống.'
  );
}

function buildMenhParagraph(chart: ZiweiChart): string {
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
        'Chính tinh ở thế **Bình hòa** nên năng lượng cốt lõi trung bình, thành công phụ thuộc nhiều vào nỗ lực và môi trường.'
      );
    } else if (best === 'ham') {
      parts.push(
        'Chính tinh ở thế **Hãm địa** nên năng lượng cốt lõi bị hạn chế, dễ thiếu tự tin hoặc vất vả hơn người khác; cần tích lũy kinh nghiệm để bù đắp.'
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
        .join(', ')}, góp phần định hình duyên tài lộc, uy quyền, danh tiếng và những trở ngại cần vượt qua.`
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

function buildTamHopAndThanParagraph(chart: ZiweiChart): string {
  const tamHopPalaces = (['menh', 'taiBach', 'quanLoc'] as const)
    .map((id) => findPalace(chart, id))
    .filter((p): p is Palace => p !== undefined);
  const combined = new Set(tamHopPalaces.flatMap((p) => (p.majorStars ?? []).map((s) => s.name)));
  const archetype = TAM_HOP_ARCHETYPES.find((a) => a.stars.every((name) => combined.has(name)));

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

function buildConclusionParagraph(chart: ZiweiChart, description: string): string {
  const menh = findPalace(chart, 'menh');
  const stars = menh?.majorStars ?? [];
  const best = bestBrightness(stars);

  let trajectory: string;
  if (stars.length === 0) {
    trajectory =
      'số mệnh thường thăng trầm theo hoàn cảnh, thành công đến khi đương số tự xác định được hướng đi và kiên trì theo đuổi.';
  } else if (best === 'mieu' || best === 'vuong' || best === 'dac') {
    trajectory =
      'số mệnh có nền tảng khá vững, thành tựu tích lũy đều và càng về sau càng rõ nét, đặc biệt khi chọn đúng lĩnh vực.';
  } else if (best === 'binh') {
    trajectory =
      'số mệnh thăng trầm xen kẽ, giai đoạn đầu thường phải nỗ lực nhiều, thành quả đến từ sự bền bỉ và tích lũy kinh nghiệm.';
  } else if (best === 'ham') {
    trajectory =
      'số mệnh nhiều biến động, đương số dễ gặp thử thách lớn hơn người khác, nhưng nếu vượt qua được thì bài học rút ra rất sâu sắc.';
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
    `${description} Nhìn tổng thể, ${trajectory} ` +
    `Bài học cần rèn luyện là ${lessons.join('; ')}.`
  );
}

export function generatePersonalSummary(chart: ZiweiChart): PersonalSummary {
  const menhPalace = chart.palaces.find((p) => p.id === 'menh');
  const majorStars = menhPalace?.majorStars || [];
  const starNames = majorStars.map((s) => s.name);

  let headline = '';
  let description = '';
  let keyTraits: string[] = [];
  let lifePath = '';

  if (starNames.includes('Tử Vi')) {
    headline = 'Bạn là người lãnh đạo bẩm sinh';
    description =
      'Với khí chất cao quý và tố chất lãnh đạo, bạn được mọi người tôn trọng và nể phục. ' +
      'Bạn có khả năng quyết đoán, tầm nhìn xa, và thích hợp với vai trò quản lý. ' +
      'Tuy nhiên, quá tự cao và cố chấp, dễ gây mất lòng người khác. ' +
      'Nếu không biết kiềm chế, dễ gặp cảnh cô độc, không người thân cận. ' +
      'Con đường thành công của bạn là trở thành lãnh đạo, quản lý, hoặc entrepreneur.';
    keyTraits = [
      'Khí chất cao quý, được tôn trọng',
      'Khả năng lãnh đạo, quyết đoán',
      'Tầm nhìn xa, chiến lược',
      'Quá tự cao, dễ cô độc',
    ];
    lifePath = 'Lãnh đạo, quản lý, chính trị, kinh doanh';
  } else if (starNames.includes('Thiên Phủ')) {
    headline = 'Bạn là người ổn định, đáng tin cậy';
    description =
      'Với tính cách ổn định và đáng tin cậy, bạn là chỗ dựa vững chắc cho gia đình và bạn bè. ' +
      'Bạn có khả năng quản lý tài chính tốt, thích sự an toàn và ổn định. ' +
      'Bạn không thích rủi ro, nhưng bù lại rất kiên nhẫn và bền bỉ. ' +
      'Con đường thành công của bạn là trong lĩnh vực tài chính, bất động sản, hoặc hành chính.';
    keyTraits = [
      'Ổn định, đáng tin cậy',
      'Quản lý tài chính tốt',
      'Kiên nhẫn, bền bỉ',
      'Không thích rủi ro',
    ];
    lifePath = 'Tài chính, bất động sản, hành chính';
  } else if (starNames.includes('Thái Dương')) {
    headline = 'Bạn là người nhiệt tình, tràn đầy năng lượng';
    description =
      'Với tính cách phóng khoáng và nhiệt tình, bạn luôn tràn đầy năng lượng và lạc quan. ' +
      'Bạn có khả năng truyền cảm hứng cho người khác, thích hợp với vai trò lãnh đạo tinh thần. ' +
      'Tuy nhiên, đôi khi bạn quá nhiệt tình mà ôm đồm quá nhiều việc. ' +
      'Con đường thành công của bạn là trong lĩnh vực giáo dục, truyền thông, hoặc diễn thuyết.';
    keyTraits = [
      'Nhiệt tình, lạc quan',
      'Có khả năng truyền cảm hứng',
      'Phóng khoáng, rộng rãi',
      'Đôi khi ôm đồm quá nhiều',
    ];
    lifePath = 'Giáo dục, truyền thông, diễn thuyết';
  } else if (starNames.includes('Thái Âm')) {
    headline = 'Bạn là người nhạy cảm, giàu tình cảm';
    description =
      'Với tính cách nhạy cảm và giàu tình cảm, bạn có trực giác tốt và thấu hiểu người khác. ' +
      'Bạn thích sự yên tĩnh, nghệ thuật, và có tài năng sáng tạo. ' +
      'Tuy nhiên, đôi khi bạn quá nhạy cảm và dễ bị ảnh hưởng bởi cảm xúc. ' +
      'Con đường thành công của bạn là trong lĩnh vực nghệ thuật, tâm lý, hoặc y tế.';
    keyTraits = [
      'Nhạy cảm, giàu tình cảm',
      'Trực giác tốt, thấu hiểu người khác',
      'Có tài năng nghệ thuật',
      'Đôi khi quá nhạy cảm',
    ];
    lifePath = 'Nghệ thuật, tâm lý, y tế';
  } else if (starNames.includes('Vũ Khúc')) {
    headline = 'Bạn là người thực tế, giỏi quản lý tài chính';
    description =
      'Với tính cách thực tế và giỏi quản lý, bạn có khả năng kiếm tiền và giữ tiền tốt. ' +
      'Bạn thích sự rõ ràng, minh bạch, và không thích những thứ mơ hồ. ' +
      'Bạn có khả năng kinh doanh tốt, nhưng đôi khi quá tập trung vào tiền bạc. ' +
      'Con đường thành công của bạn là trong lĩnh vực tài chính, ngân hàng, hoặc kinh doanh.';
    keyTraits = [
      'Thực tế, giỏi quản lý',
      'Khả năng kiếm tiền tốt',
      'Thích sự rõ ràng, minh bạch',
      'Đôi khi quá tập trung vào tiền bạc',
    ];
    lifePath = 'Tài chính, ngân hàng, kinh doanh';
  } else if (starNames.includes('Liêm Trinh')) {
    headline = 'Bạn là người chính trực, có nguyên tắc';
    description =
      'Với tính cách chính trực và có nguyên tắc, bạn luôn giữ vững lập trường và không dễ bị lung lay. ' +
      'Bạn có khả năng lãnh đạo, nhưng đôi khi quá cứng nhắc và không linh hoạt. ' +
      'Bạn thích sự công bằng, minh bạch, và không thích những thứ mờ ám. ' +
      'Con đường thành công của bạn là trong lĩnh vực pháp luật, chính trị, hoặc quản lý.';
    keyTraits = [
      'Chính trực, có nguyên tắc',
      'Giữ vững lập trường',
      'Thích sự công bằng, minh bạch',
      'Đôi khi quá cứng nhắc',
    ];
    lifePath = 'Pháp luật, chính trị, quản lý';
  } else if (starNames.includes('Tham Lang')) {
    headline = 'Bạn là người tài năng, có sức hút';
    description =
      'Với tính cách tài năng và có sức hút, bạn dễ dàng thu hút người khác và có nhiều cơ hội trong cuộc sống. ' +
      'Bạn có khả năng giao tiếp tốt, thích hợp với vai trò ngoại giao, kinh doanh. ' +
      'Tuy nhiên, quá đào hoa, dễ vướng vào thị phi tình cảm, có thể gặp cảnh ly tán. ' +
      'Con đường thành công của bạn là trong lĩnh vực kinh doanh, ngoại giao, hoặc nghệ thuật.';
    keyTraits = [
      'Tài năng, có sức hút',
      'Khả năng giao tiếp tốt',
      'Nhiều cơ hội trong cuộc sống',
      'Quá đào hoa, dễ vướng thị phi',
    ];
    lifePath = 'Kinh doanh, ngoại giao, nghệ thuật';
  } else if (starNames.includes('Cự Môn')) {
    headline = 'Bạn là người thẳng thắn, có tài phân tích';
    description =
      'Với tính cách thẳng thắn và có tài phân tích, bạn có khả năng nhìn nhận vấn đề một cách sắc bén. ' +
      'Bạn thích tranh luận, nghiên cứu, và không sợ đối mặt với sự thật. ' +
      'Tuy nhiên, quá khẩu thiệt, dễ gây thù oán, cuộc đời nhiều thị phi. ' +
      'Con đường thành công của bạn là trong lĩnh vực luật, tư vấn, hoặc nghiên cứu.';
    keyTraits = [
      'Thẳng thắn, có tài phân tích',
      'Nhìn nhận vấn đề sắc bén',
      'Thích tranh luận, nghiên cứu',
      'Quá khẩu thiệt, dễ gây thù oán',
    ];
    lifePath = 'Luật, tư vấn, nghiên cứu';
  } else if (starNames.includes('Thiên Cơ')) {
    headline = 'Bạn là người thông minh, có trí tuệ';
    description =
      'Với trí tuệ thông minh và khả năng phân tích tốt, bạn dễ dàng giải quyết các vấn đề phức tạp. ' +
      'Bạn thích học hỏi, nghiên cứu, và không ngừng phát triển bản thân. ' +
      'Tuy nhiên, đôi khi bạn quá suy nghĩ mà không hành động. ' +
      'Con đường thành công của bạn là trong lĩnh vực giáo dục, nghiên cứu, hoặc công nghệ.';
    keyTraits = [
      'Thông minh, có trí tuệ',
      'Khả năng phân tích tốt',
      'Thích học hỏi, nghiên cứu',
      'Đôi khi quá suy nghĩ',
    ];
    lifePath = 'Giáo dục, nghiên cứu, công nghệ';
  } else if (starNames.includes('Thiên Đồng')) {
    headline = 'Bạn là người hiền lành, tốt bụng';
    description =
      'Với tính cách hiền lành và tốt bụng, bạn được mọi người yêu mến và tin tưởng. ' +
      'Bạn thích sự hòa bình, không thích tranh chấp, và luôn sẵn sàng giúp đỡ người khác. ' +
      'Tuy nhiên, đôi khi bạn quá nhu mì và dễ bị người khác lợi dụng. ' +
      'Con đường thành công của bạn là trong lĩnh vực y tế, từ thiện, hoặc dịch vụ khách hàng.';
    keyTraits = [
      'Hiền lành, tốt bụng',
      'Được mọi người yêu mến',
      'Thích sự hòa bình',
      'Đôi khi quá nhu mì',
    ];
    lifePath = 'Y tế, từ thiện, dịch vụ khách hàng';
  } else if (starNames.includes('Thiên Tướng')) {
    headline = 'Bạn là người có trách nhiệm, đáng tin cậy';
    description =
      'Với tính cách có trách nhiệm và đáng tin cậy, bạn luôn hoàn thành nhiệm vụ được giao. ' +
      'Bạn thích sự ổn định, không thích thay đổi, và là người bạn đồng hành lý tưởng. ' +
      'Tuy nhiên, đôi khi bạn quá bảo thủ và không thích nghi với thay đổi. ' +
      'Con đường thành công của bạn là trong lĩnh vực hành chính, quản lý, hoặc dịch vụ công.';
    keyTraits = [
      'Có trách nhiệm, đáng tin cậy',
      'Hoàn thành nhiệm vụ',
      'Thích sự ổn định',
      'Đôi khi quá bảo thủ',
    ];
    lifePath = 'Hành chính, quản lý, dịch vụ công';
  } else if (starNames.includes('Thiên Lương')) {
    headline = 'Bạn là người thiện lương, có phúc đức';
    description =
      'Với tính cách thiện lương và có phúc đức, bạn được quý nhân phù trợ và gặp nhiều may mắn. ' +
      'Bạn thích giúp đỡ người khác, làm việc thiện, và luôn giữ tâm hồn trong sáng. ' +
      'Tuy nhiên, đôi khi bạn quá tin người và dễ bị lợi dụng. ' +
      'Con đường thành công của bạn là trong lĩnh vực y tế, giáo dục, hoặc từ thiện.';
    keyTraits = [
      'Thiện lương, có phúc đức',
      'Được quý nhân phù trợ',
      'Thích giúp đỡ người khác',
      'Đôi khi quá tin người',
    ];
    lifePath = 'Y tế, giáo dục, từ thiện';
  } else if (starNames.includes('Thất Sát')) {
    headline = 'Bạn là người mạnh mẽ, quyết đoán';
    description =
      'Với tính cách mạnh mẽ và quyết đoán, bạn không sợ khó khăn và luôn tiến về phía trước. ' +
      'Bạn có khả năng lãnh đạo, nhưng quá cứng nhắc và độc đoán, dễ gây mất lòng người khác. ' +
      'Cuộc đời nhiều thăng trầm, có thể gặp nhiều tai nạn, thị phi. ' +
      'Nếu không biết kiềm chế, dễ gặp cảnh cô độc, không người thân cận.';
    keyTraits = [
      'Mạnh mẽ, quyết đoán',
      'Không sợ khó khăn',
      'Thích sự thách thức',
      'Quá cứng nhắc, dễ gây thù oán',
    ];
    lifePath = 'Quân đội, cảnh sát, kinh doanh mạo hiểm';
  } else if (starNames.includes('Phá Quân')) {
    headline = 'Bạn là người sáng tạo, không ngại thay đổi';
    description =
      'Với tính cách sáng tạo và không ngại thay đổi, bạn luôn tìm kiếm những điều mới mẻ. ' +
      'Bạn có khả năng đột phá, không thích sự gò bó, và luôn muốn thay đổi thế giới. ' +
      'Tuy nhiên, quá bốc đồng, dễ phá hoại cơ nghiệp, cuộc đời bấp bênh. ' +
      'Con đường thành công của bạn là trong lĩnh vực khởi nghiệp, sáng tạo, hoặc nghiên cứu.';
    keyTraits = [
      'Sáng tạo, không ngại thay đổi',
      'Khả năng đột phá',
      'Không thích sự gò bó',
      'Quá bốc đồng, dễ phá hoại cơ nghiệp',
    ];
    lifePath = 'Khởi nghiệp, sáng tạo, nghiên cứu';
  } else {
    headline = 'Bạn là người linh hoạt, dễ thích nghi';
    description =
      'Với tính cách linh hoạt và dễ thích nghi, bạn có thể phù hợp với nhiều môi trường khác nhau. ' +
      'Bạn cần xác định mục tiêu rõ ràng và tập trung vào đó. ' +
      'Bạn có tiềm năng lớn, nhưng cần nỗ lực nhiều hơn để đạt được thành công. ' +
      'Con đường thành công của bạn phụ thuộc vào nỗ lực và lựa chọn của bản thân.';
    keyTraits = [
      'Linh hoạt, dễ thích nghi',
      'Có tiềm năng lớn',
      'Cần xác định mục tiêu rõ ràng',
      'Cần nỗ lực nhiều hơn',
    ];
    lifePath = 'Đa dạng, phụ thuộc vào nỗ lực bản thân';
  }

  return {
    ownerName: chart.heavenPlate?.name || 'Đương số',
    headline,
    description,
    keyTraits,
    lifePath,
    introParagraph: buildIntroParagraph(chart),
    menhStarParagraph: buildMenhParagraph(chart),
    tamHopAndThanParagraph: buildTamHopAndThanParagraph(chart),
    conclusionParagraph: buildConclusionParagraph(chart, description),
  };
}
