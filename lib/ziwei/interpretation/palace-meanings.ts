import type { ZiweiChart, Palace, Star, MajorStarId, PalaceId, BrightnessLevel } from '../types';
import type {
  PalaceInterpretation,
  PalaceContent,
  PalaceSpecificContent,
  MajorStarInterpretation,
  MinorStarInterpretation,
  TamPhuongAnalysis,
} from './types';
import { MAJOR_STAR_MEANINGS } from './data/major-stars';
import { buildMinorStarInterpretation } from './data/minor-stars';
import { getMinorStarMeaning } from './minor-star-meanings';
import { detectStarGroups } from './star-groups';
import {
  PALACE_TEMPLATES,
  STAR_PALACE_TRAITS,
  type PalaceTemplate,
  type StarPalaceTrait,
} from './data/palace-contents';

/** Bảng tam phương tứ chính của 12 cung (cung xung chiếu và hai cung tam hợp). */
export const TAM_PHUONG: Readonly<
  Record<PalaceId, { center: PalaceId; related: readonly PalaceId[] }>
> = {
  menh: { center: 'menh', related: ['taiBach', 'quanLoc', 'thienDi'] },
  phuMau: { center: 'phuMau', related: ['noBoc', 'tatAch', 'tuTuc'] },
  phucDuc: { center: 'phucDuc', related: ['taiBach', 'thienDi', 'phuThe'] },
  dienTrach: { center: 'dienTrach', related: ['tatAch', 'tuTuc', 'huynhDe'] },
  quanLoc: { center: 'quanLoc', related: ['menh', 'taiBach', 'phuThe'] },
  noBoc: { center: 'noBoc', related: ['phuMau', 'tuTuc', 'huynhDe'] },
  thienDi: { center: 'thienDi', related: ['menh', 'phucDuc', 'phuThe'] },
  tatAch: { center: 'tatAch', related: ['phuMau', 'dienTrach', 'huynhDe'] },
  taiBach: { center: 'taiBach', related: ['menh', 'phucDuc', 'quanLoc'] },
  tuTuc: { center: 'tuTuc', related: ['phuMau', 'dienTrach', 'noBoc'] },
  phuThe: { center: 'phuThe', related: ['phucDuc', 'quanLoc', 'thienDi'] },
  huynhDe: { center: 'huynhDe', related: ['dienTrach', 'noBoc', 'tatAch'] },
};

const BRIGHTNESS_LABELS: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu',
  vuong: 'Vượng',
  dac: 'Đắc',
  binh: 'Bình',
  ham: 'Hãm',
};

/** Thang độ sáng từ thấp đến cao, dùng khi Tuần/Triệt làm giảm độ sáng. */
const BRIGHTNESS_SCALE: readonly BrightnessLevel[] = ['ham', 'binh', 'dac', 'vuong', 'mieu'];

const BRIGHTNESS_SCORE: Readonly<Record<BrightnessLevel, number>> = {
  mieu: 3,
  vuong: 2,
  dac: 1,
  binh: 0,
  ham: -2,
};

/** Kết quả tác động của Tuần/Triệt lên một ngôi sao. */
export interface StarEffect {
  /** Độ sáng sau tác động. */
  brightness: BrightnessLevel;
  /** Có bị Tuần/Triệt án ngữ hay không. */
  affected: boolean;
  /** Sao bị Tuần hay Triệt án ngữ. */
  affectedBy?: 'Tuần' | 'Triệt';
  /** Độ sáng ban đầu. */
  originalBrightness: BrightnessLevel;
  /** Số bậc độ sáng bị giảm. */
  reduction: number;
  /** Mô tả tác động. */
  description?: string;
}

/**
 * Lấy tam phương tứ chính của một cung.
 *
 * @param palaceId - Mã cung.
 * @returns Cung trung tâm và ba cung liên quan.
 */
export function getTamPhuong(palaceId: PalaceId): {
  center: PalaceId;
  related: readonly PalaceId[];
} {
  return TAM_PHUONG[palaceId];
}

/**
 * Áp dụng tác động của Tuần/Triệt lên độ sáng của sao.
 *
 * @param star - Ngôi sao cần xét.
 * @param palace - Cung chứa sao.
 * @returns Độ sáng sau tác động và mô tả.
 */
export function applyTuanTrietEffect(star: Star, palace: Palace): StarEffect {
  const originalBrightness = (star.brightness ?? 'binh') as BrightnessLevel;

  if (!palace.hasTuan && !palace.hasTriet) {
    return {
      brightness: originalBrightness,
      affected: false,
      originalBrightness,
      reduction: 0,
    };
  }

  const currentIndex = BRIGHTNESS_SCALE.indexOf(originalBrightness);
  const newIndex = Math.max(0, currentIndex - 2);
  const brightness = BRIGHTNESS_SCALE[newIndex];
  const affectedBy: 'Tuần' | 'Triệt' = palace.hasTuan ? 'Tuần' : 'Triệt';
  const reduction = currentIndex - newIndex;

  return {
    brightness,
    affected: true,
    affectedBy,
    originalBrightness,
    reduction,
    description: `${star.name} bị ${affectedBy} án ngữ, độ sáng giảm từ ${BRIGHTNESS_LABELS[originalBrightness]} xuống ${BRIGHTNESS_LABELS[brightness]}.`,
  };
}

/**
 * Luận giải một chính tinh tại cung, có xét tác động Tuần/Triệt.
 *
 * @param star - Chính tinh.
 * @param palace - Cung chứa sao.
 * @returns Luận giải hoặc null nếu chưa có dữ liệu.
 */
export function interpretMajorStar(star: Star, palace: Palace): MajorStarInterpretation | null {
  const starId = star.id as MajorStarId;
  const meanings = MAJOR_STAR_MEANINGS[starId];

  if (!meanings) {
    return null;
  }

  const palaceMeanings = meanings[palace.id];
  if (!palaceMeanings) {
    return null;
  }

  const effect = applyTuanTrietEffect(star, palace);
  const content = palaceMeanings[effect.brightness];

  if (!content) {
    return null;
  }

  return {
    starId,
    brightness: effect.brightness,
    content,
    affected: effect.affected,
    affectedBy: effect.affectedBy,
    originalBrightness: effect.originalBrightness,
    reduction: effect.reduction,
    description: effect.description,
  };
}

/**
 * Luận giải danh sách phụ tinh trong một cung.
 *
 * @param minorStars - Các phụ tinh.
 * @param palaceId - Mã cung chứa sao.
 * @returns Danh sách luận giải phụ tinh.
 */
export function interpretMinorStars(
  minorStars: Star[],
  palaceId: PalaceId
): MinorStarInterpretation[] {
  return minorStars.map((star) => ({
    ...buildMinorStarInterpretation(star.id, star.name, star.nature === 'cat'),
    context: `Trong cung ${palaceId}`,
  }));
}

/**
 * Tính điểm tương quan của một cung dựa trên độ sáng và tính cát/hung.
 */
function palaceTone(palace: Palace): number {
  return palace.majorStars.reduce((sum, star) => {
    const natureScore = star.nature === 'cat' ? 1 : star.nature === 'hung' ? -1 : 0;
    return sum + (BRIGHTNESS_SCORE[star.brightness ?? 'binh'] ?? 0) + natureScore;
  }, 0);
}

/**
 * Mô tả ngắn gọn một cung trong tam phương.
 */
function describePalace(palace: Palace): string {
  if (palace.majorStars.length === 0) {
    return `Cung ${palace.name}: Vô Chính Diệu, cần xét kỹ phụ tinh và cung xung chiếu`;
  }

  const stars = palace.majorStars
    .map((star) =>
      star.brightness ? `${star.name} (${BRIGHTNESS_LABELS[star.brightness]})` : star.name
    )
    .join(', ');
  const tone = palaceTone(palace);
  const verdict =
    tone >= 3
      ? 'rất thuận lợi'
      : tone >= 1
        ? 'khá thuận lợi'
        : tone === 0
          ? 'bình hòa'
          : tone >= -2
            ? 'có thử thách'
            : 'nhiều trở ngại';

  return `Cung ${palace.name}: ${stars}, ${verdict}`;
}

/**
 * Tổng hợp tương quan giữa cung trung tâm và các cung tam phương.
 */
function generateTamPhuongSummary(center: Palace, related: Palace[]): string {
  if (related.length === 0) {
    return `Không đủ dữ liệu các cung liên quan để phân tích tam phương tứ chính của cung ${center.name}.`;
  }

  const allPalaces = [center, ...related];
  const allStars = allPalaces.flatMap((palace) => palace.majorStars);
  const catStars = allStars.filter((star) => star.nature === 'cat').map((star) => star.name);
  const hungStars = allStars.filter((star) => star.nature === 'hung').map((star) => star.name);
  const centerStars = center.majorStars.map((star) => star.name).join(', ') || 'Vô Chính Diệu';
  const relatedNames = related.map((palace) => palace.name).join(', ');
  const totalTone = allPalaces.reduce((sum, palace) => sum + palaceTone(palace), 0);

  const verdict =
    totalTone >= 4
      ? 'rất vững vàng và nhiều thuận lợi cho đương số'
      : totalTone > 0
        ? 'khá cân bằng, có cả thuận lợi lẫn thử thách'
        : totalTone === 0
          ? 'bình hòa, cần phát huy phụ tinh cát để tăng trợ lực'
          : 'có nhiều thử thách, cần chủ động hóa giải';

  const starNote =
    hungStars.length > 0
      ? `Các sao hung như ${hungStars.join(', ')} cần được lưu ý.`
      : 'Không có hung tinh đáng kể trong tam phương.';

  const advice =
    totalTone > 0
      ? `Nên phát huy thế mạnh từ ${relatedNames} để hỗ trợ cho cung ${center.name}.`
      : `Cần thận trọng trước các yếu tố bất lợi từ ${relatedNames} và tăng cường phụ tinh cát để hóa giải.`;

  return `Cung ${center.name} hội tụ tam phương tứ chính với ${relatedNames}. Chính tinh tại ${center.name} là ${centerStars}; toàn bộ tam phương có ${catStars.length} sao cát và ${hungStars.length} sao hung. Tổng thể tương quan ${verdict}. ${starNote} ${advice}`;
}

/**
 * Phân tích tam phương tứ chính từ cung trung tâm và các cung liên quan.
 *
 * @param center - Cung trung tâm.
 * @param related - Các cung tam phương.
 * @returns Kết quả phân tích.
 */
export function analyzeTamPhuong(center: Palace, related: Palace[]): TamPhuongAnalysis {
  return {
    palaces: related.map((palace) => ({
      id: palace.id,
      name: palace.name,
      majorStars: palace.majorStars.map((star) => star.name),
      analysis: describePalace(palace),
    })),
    summary: generateTamPhuongSummary(center, related),
  };
}

/**
 * Lấy và phân tích tam phương tứ chính của một cung trong lá số.
 *
 * @param palace - Cung trung tâm.
 * @param chart - Lá số chứa cung.
 * @returns Kết quả phân tích.
 */
export function buildTamPhuongAnalysis(palace: Palace, chart: ZiweiChart): TamPhuongAnalysis {
  const relatedPalaces = getTamPhuong(palace.id)
    .related.map((id) => chart.palaces.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Palace => Boolean(candidate));

  return analyzeTamPhuong(palace, relatedPalaces);
}

/** Ngữ cảnh dùng để sinh nội dung luận giải theo loại cung. */
interface PalaceContentContext {
  palace: Palace;
  template: PalaceTemplate;
  traits: StarPalaceTrait[];
  brightness: BrightnessLevel;
}

/**
 * Lấy độ sáng trung bình của các chính tinh trong cung.
 *
 * @param stars - Các chính tinh cần xét.
 * @returns Mức độ sáng đại diện.
 */
export function getAverageBrightness(stars: Star[]): BrightnessLevel {
  if (stars.length === 0) {
    return 'binh';
  }

  const average =
    stars.reduce((sum, star) => sum + (BRIGHTNESS_SCORE[star.brightness ?? 'binh'] ?? 0), 0) /
    stars.length;

  if (average >= 2.5) return 'mieu';
  if (average >= 1.5) return 'vuong';
  if (average >= 0.5) return 'dac';
  if (average >= -0.5) return 'binh';
  return 'ham';
}

/**
 * Mô tả ngắn gọn mức độ thuận lợi theo độ sáng.
 */
function brightnessVerdict(brightness: BrightnessLevel): string {
  switch (brightness) {
    case 'mieu':
      return 'Cách cục rất thuận lợi, phát huy tối đa ý nghĩa tốt đẹp của cung.';
    case 'vuong':
      return 'Cách cục thuận lợi, có nhiều yếu tố hỗ trợ tích cực.';
    case 'dac':
      return 'Cách cục khá tốt, cần phát huy thế mạnh và giữ sự cân bằng.';
    case 'binh':
      return 'Cách cục bình hòa, cần chủ động nỗ lực để đạt kết quả mong muốn.';
    case 'ham':
      return 'Cách cục có nhiều thử thách, cần thận trọng và chủ động hóa giải.';
  }
}

/**
 * Lấy đặc điểm của các chính tinh đã biết trong cung.
 */
function resolveStarTraits(palace: Palace): StarPalaceTrait[] {
  return palace.majorStars
    .map((star) => STAR_PALACE_TRAITS[star.id as MajorStarId])
    .filter((trait): trait is StarPalaceTrait => Boolean(trait));
}

/**
 * Ghép nội dung của một khía cạnh từ tất cả chính tinh trong cung.
 */
function pickTraits(
  traits: StarPalaceTrait[],
  selector: (trait: StarPalaceTrait) => string
): string {
  return traits
    .map(selector)
    .filter((text) => text.length > 0)
    .join(' ');
}

/**
 * Lấy nội dung khía cạnh hoặc câu mô tả cung trống.
 */
function fieldOrEmpty(
  context: PalaceContentContext,
  selector: (trait: StarPalaceTrait) => string
): string {
  return pickTraits(context.traits, selector) || context.template.empty;
}

/**
 * Thêm gợi ý riêng của cung vào khía cạnh thứ hai.
 */
function withDetail(text: string, context: PalaceContentContext): string {
  return text ? `${text} ${context.template.detail}` : context.template.detail;
}

/**
 * Tạo phần tổng quan cho cung dựa trên chính tinh và độ sáng.
 */
function buildOverview(context: PalaceContentContext): string {
  if (context.traits.length === 0) {
    return `Cung ${context.palace.name} bàn về ${context.template.theme}. ${context.template.empty}`;
  }

  const stars = context.palace.majorStars
    .map((star) => {
      const label = star.brightness ? ` (${BRIGHTNESS_LABELS[star.brightness]})` : '';
      return `${star.name}${label}`;
    })
    .join(', ');

  return `Cung ${context.palace.name} bàn về ${context.template.theme}. Chính tinh tại cung là ${stars}. ${brightnessVerdict(context.brightness)}`;
}

/**
 * Tạo phần thách thức riêng của cung.
 */
function buildChallenges(context: PalaceContentContext): string {
  const parts = [fieldOrEmpty(context, (trait) => trait.weakness), context.template.challenge];

  if (context.brightness === 'ham') {
    parts.push('Khi chính tinh Hãm địa, các thách thức càng rõ nét và cần được xử lý sớm.');
  }

  return parts.join(' ');
}

/**
 * Tạo phần lời khuyên riêng của cung.
 */
function buildAdvice(context: PalaceContentContext): string {
  const personal = pickTraits(context.traits, (trait) => trait.advice);
  return personal ? `${personal} ${context.template.advice}` : context.template.advice;
}

function interpretMenhPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    personality: fieldOrEmpty(context, (trait) => trait.personality),
    character: fieldOrEmpty(context, (trait) => trait.strength),
    destiny: withDetail(
      fieldOrEmpty(context, (trait) => trait.destiny),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretTaiBachPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    income: fieldOrEmpty(context, (trait) => trait.income),
    wealth: withDetail(
      fieldOrEmpty(context, (trait) => trait.wealth),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretQuanLocPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    career: fieldOrEmpty(context, (trait) => trait.career),
    profession: withDetail(
      fieldOrEmpty(context, (trait) => trait.profession),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretThienDiPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    travel: fieldOrEmpty(context, (trait) => trait.travel),
    migration: withDetail(
      fieldOrEmpty(context, (trait) => trait.travel),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretPhuThePalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    spouse: fieldOrEmpty(context, (trait) => trait.love),
    marriage: withDetail(
      fieldOrEmpty(context, (trait) => trait.love),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretTuTucPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    children: fieldOrEmpty(context, (trait) => trait.family),
    offspring: withDetail(
      fieldOrEmpty(context, (trait) => trait.family),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretTatAchPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    health: fieldOrEmpty(context, (trait) => trait.health),
    illness: withDetail(
      fieldOrEmpty(context, (trait) => trait.health),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretNoBocPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    friends: fieldOrEmpty(context, (trait) => trait.social),
    social: withDetail(
      fieldOrEmpty(context, (trait) => trait.social),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretDienTrachPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    property: fieldOrEmpty(context, (trait) => trait.property),
    realEstate: withDetail(
      fieldOrEmpty(context, (trait) => trait.property),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretPhucDucPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    fortune: fieldOrEmpty(context, (trait) => trait.fortune),
    ancestors: withDetail(
      fieldOrEmpty(context, (trait) => trait.fortune),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretPhuMauPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    parents: fieldOrEmpty(context, (trait) => trait.parents),
    family: withDetail(
      fieldOrEmpty(context, (trait) => trait.parents),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretHuynhDePalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    siblings: fieldOrEmpty(context, (trait) => trait.siblings),
    brothers: withDetail(
      fieldOrEmpty(context, (trait) => trait.siblings),
      context
    ),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

function interpretDefaultPalace(context: PalaceContentContext): PalaceContent {
  return {
    overview: buildOverview(context),
    challenges: buildChallenges(context),
    advice: buildAdvice(context),
  };
}

/**
 * Luận giải một cung theo đúng ý nghĩa của loại cung đó.
 *
 * @param palace - Cung cần luận giải.
 * @param palaceType - Loại cung cần áp dụng, mặc định lấy từ cung.
 * @returns Nội dung luận giải chỉ gồm các khía cạnh phù hợp với cung.
 */
export function interpretPalaceSpecificContent(
  palace: Palace,
  palaceType: PalaceId = palace.id
): PalaceSpecificContent {
  const context: PalaceContentContext = {
    palace,
    template: PALACE_TEMPLATES[palaceType],
    traits: resolveStarTraits(palace),
    brightness: getAverageBrightness(palace.majorStars),
  };

  switch (palaceType) {
    case 'menh':
      return interpretMenhPalace(context);
    case 'taiBach':
      return interpretTaiBachPalace(context);
    case 'quanLoc':
      return interpretQuanLocPalace(context);
    case 'thienDi':
      return interpretThienDiPalace(context);
    case 'phuThe':
      return interpretPhuThePalace(context);
    case 'tuTuc':
      return interpretTuTucPalace(context);
    case 'tatAch':
      return interpretTatAchPalace(context);
    case 'noBoc':
      return interpretNoBocPalace(context);
    case 'dienTrach':
      return interpretDienTrachPalace(context);
    case 'phucDuc':
      return interpretPhucDucPalace(context);
    case 'phuMau':
      return interpretPhuMauPalace(context);
    case 'huynhDe':
      return interpretHuynhDePalace(context);
    default:
      return interpretDefaultPalace(context);
  }
}

/**
 * Tên cũ của hàm luận giải cung theo loại cung.
 *
 * @param palace - Cung cần luận giải.
 * @param palaceType - Loại cung cần áp dụng, mặc định lấy từ cung.
 * @returns Nội dung luận giải chỉ gồm các khía cạnh phù hợp với cung.
 */
export function interpretPalaceByType(
  palace: Palace,
  palaceType: PalaceId = palace.id
): PalaceContent {
  return interpretPalaceSpecificContent(palace, palaceType);
}

/**
 * Luận giải một cung kèm phân tích tam phương tứ chính.
 *
 * @param palace - Cung cần luận giải.
 * @param chart - Lá số chứa cung.
 * @returns Luận giải cung.
 */
export function interpretPalaceWithTamPhuong(
  palace: Palace,
  chart: ZiweiChart
): PalaceInterpretation {
  const majorStars = palace.majorStars
    .map((star) => interpretMajorStar(star, palace))
    .filter((interpretation): interpretation is MajorStarInterpretation => Boolean(interpretation));

  const recognizedOtherStars = palace.otherStars.filter((star) =>
    getMinorStarMeaning(star.id, star.name)
  );

  const minorStars = [
    ...interpretMinorStars(palace.auspiciousStars, palace.id),
    ...interpretMinorStars(palace.maleficStars, palace.id),
    ...interpretMinorStars(recognizedOtherStars, palace.id),
  ];

  const relatedPalaces = getTamPhuong(palace.id)
    .related.map((id) => chart.palaces.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Palace => Boolean(candidate));

  const specificContent = interpretPalaceSpecificContent(palace);

  return {
    palaceId: palace.id,
    content: specificContent,
    specificContent,
    majorStars,
    minorStars,
    combinations: [],
    starGroups: detectStarGroups(palace, relatedPalaces),
    isEmpty: palace.majorStars.length === 0,
    tamPhuong: analyzeTamPhuong(palace, relatedPalaces),
  };
}
