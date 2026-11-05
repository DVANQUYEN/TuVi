import type { Palace, PalaceId, ZiweiChart } from '../types';
import { palaceHasStar } from './star-utils';
import { calculateYearlyFortune } from './yearly-fortune';

/** Bốn chủ đề luận giải chuyên sâu. */
export type Topic = 'career' | 'love' | 'wealth' | 'health';

/** Luận giải chi tiết theo một chủ đề. */
export interface TopicInterpretation {
  topic: Topic;
  title: string;
  /** Tổng quan 3-4 câu. */
  overview: string;
  /** 3-5 điểm mạnh. */
  strengths: string[];
  /** 3-5 thách thức. */
  challenges: string[];
  /** 3-5 lời khuyên. */
  recommendations: string[];
  /** Chỉ dành cho chủ đề sự nghiệp: ngành phù hợp. */
  suitableFields?: string[];
  /** Chỉ dành cho chủ đề tình duyên: loại người phù hợp. */
  suitablePartner?: string[];
  /** Chỉ dành cho chủ đề tài lộc: nguồn thu nhập. */
  incomeSources?: string[];
  /** Chỉ dành cho chủ đề sức khỏe: bệnh cần chú ý. */
  healthConcerns?: string[];
  /** Năm may mắn trong 10 năm tới. */
  luckyYears: number[];
  /** Năm thách thức trong 10 năm tới. */
  challengingYears: number[];
}

const TOPIC_PALACE: Readonly<Record<Topic, PalaceId>> = {
  career: 'quanLoc',
  love: 'phuThe',
  wealth: 'taiBach',
  health: 'tatAch',
};

const CAREER_STRENGTH_DEFAULTS = [
  'Thăng tiến tốt khi kiên trì theo đuổi mục tiêu',
  'Có khả năng thích nghi với môi trường mới',
  'Được đồng nghiệp quý mến khi chủ động hợp tác',
] as const;

const CAREER_CHALLENGE_DEFAULTS = [
  'Cần học cách lắng nghe người khác, tránh độc đoán',
  'Dễ bị cuốn vào công việc, thiếu cân bằng cuộc sống',
  'Cần chủ động trau dồi kỹ năng mới, nếu không dễ bị đào thải',
] as const;

const CAREER_RECOMMENDATIONS = [
  'Phát huy khả năng lãnh đạo, nhưng cần học cách nhường nhịn',
  'Tránh độc đoán, biết lắng nghe ý kiến người khác',
  'Giữ mối quan hệ tốt với đồng nghiệp, cấp dưới',
  'Tập trung vào công việc, tránh phân tâm',
] as const;

const LOVE_STRENGTH_DEFAULTS = [
  'Có khả năng xây dựng mối quan hệ bền vững',
  'Biết quan tâm, chia sẻ với đối phương',
  'Gia đình là điểm tựa tinh thần',
] as const;

const LOVE_CHALLENGE_DEFAULTS = [
  'Cần học cách thấu hiểu, nhường nhịn đối phương, nếu không dễ chia ly',
  'Dễ kỳ vọng quá cao vào đối phương, dẫn đến thất vọng và chia tay',
  'Cần cân bằng giữa công việc và tình cảm, tránh cảnh cô độc',
] as const;

const LOVE_RECOMMENDATIONS = [
  'Dành thời gian cho gia đình, người thân',
  'Học cách lắng nghe, thấu hiểu đối phương',
  'Tránh cố chấp, bảo vệ ý kiến của mình quá mức',
  'Chung thủy, tránh đa tình',
] as const;

const WEALTH_STRENGTH_DEFAULTS = [
  'Thu nhập ổn định, không lo thiếu thốn',
  'Có ý thức tiết kiệm và tích lũy',
  'Biết nắm bắt cơ hội kiếm tiền',
] as const;

const WEALTH_CHALLENGE_DEFAULTS = [
  'Cần học cách quản lý tài chính, nếu không dễ phá sản',
  'Tránh chi tiêu cảm tính, dễ mất tiền lớn',
  'Cần dự phòng cho biến cố bất ngờ, tránh cảnh trắng tay',
] as const;

const WEALTH_RECOMMENDATIONS = [
  'Giữ tiền mặt, tránh cho vay mượn',
  'Đầu tư cẩn trọng, không nên mạo hiểm',
  'Học cách quản lý tài chính cá nhân',
  'Tiết kiệm cho tương lai',
] as const;

const HEALTH_STRENGTH_DEFAULTS = [
  'Ít bệnh tật nghiêm trọng',
  'Có ý thức chăm sóc sức khỏe',
  'Tinh thần lạc quan giúp hồi phục nhanh',
] as const;

const HEALTH_CHALLENGE_DEFAULTS = [
  'Cần duy trì lối sống lành mạnh, tránh bệnh nặng',
  'Cần chú ý nghỉ ngơi, tránh thức khuya, dễ suy nhược',
  'Nên khám sức khỏe định kỳ, phòng bệnh nặng',
] as const;

const HEALTH_RECOMMENDATIONS = [
  'Tập thể dục đều đặn, duy trì lối sống lành mạnh',
  'Khám sức khỏe định kỳ 6 tháng/lần',
  'Thiền, yoga để giảm stress',
  'Ăn uống điều độ, tránh thức khuya',
] as const;

/**
 * Luận giải lá số theo một chủ đề cụ thể.
 *
 * @param chart - Lá số Tử Vi.
 * @param topic - Chủ đề cần luận giải.
 * @returns Luận giải chi tiết của chủ đề.
 */
export function interpretByTopic(chart: ZiweiChart, topic: Topic): TopicInterpretation {
  switch (topic) {
    case 'career':
      return interpretCareer(chart);
    case 'love':
      return interpretLove(chart);
    case 'wealth':
      return interpretWealth(chart);
    case 'health':
      return interpretHealth(chart);
    default:
      throw new Error(`Unknown topic: ${String(topic)}`);
  }
}

function interpretCareer(chart: ZiweiChart): TopicInterpretation {
  const menhPalace = findPalace(chart, 'menh');
  const quanLocPalace = findPalace(chart, 'quanLoc');
  const careerPalaces = [menhPalace, quanLocPalace];

  const suitableFields = buildSuitableFields(careerPalaces);
  const strengths = buildStrengths(
    [
      {
        condition: hasBrightness(quanLocPalace, ['mieu', 'vuong']),
        text: 'Có tố chất lãnh đạo, được cấp trên tin tưởng',
      },
      {
        condition: hasStarIn([menhPalace], 'Tử Vi'),
        text: 'Khả năng quyết đoán, phù hợp vai trò quản lý',
      },
      {
        condition:
          hasStarIn(careerPalaces, 'Văn Xương') || hasStarIn(careerPalaces, 'Văn Khúc'),
        text: 'Tư duy phân tích, mạnh về học thuật và trình bày',
      },
    ],
    CAREER_STRENGTH_DEFAULTS
  );
  const challenges = buildCareerChallenges(quanLocPalace, menhPalace);
  const luckyYears = calculateLuckyYears(chart, 'career');
  const challengingYears = calculateChallengingYears(chart, 'career');

  const hasLeadership = hasStarIn([menhPalace], 'Tử Vi');
  const palacePhrase = quanLocPalace?.majorStars.length
    ? `Cung Quan Lộc với ${quanLocPalace.majorStars.map((star) => star.name).join(', ')} cho thấy`
    : 'Cung Quan Lộc cho thấy';

  return {
    topic: 'career',
    title: 'Sự nghiệp',
    overview:
      `Sự nghiệp của bạn ${hasLeadership ? 'có tố chất lãnh đạo từ khi sinh ra' : 'phụ thuộc nhiều vào nỗ lực bản thân'}. ` +
      `${palacePhrase} ${lowerFirst(strengths[0])}.`,
    strengths,
    challenges,
    recommendations: [...CAREER_RECOMMENDATIONS],
    suitableFields,
    luckyYears,
    challengingYears,
  };
}

function interpretLove(chart: ZiweiChart): TopicInterpretation {
  const phuThePalace = findPalace(chart, 'phuThe');
  const menhPalace = findPalace(chart, 'menh');
  const lovePalaces = [phuThePalace, menhPalace];

  const suitablePartner = buildSuitablePartner(lovePalaces);
  const strengths = buildStrengths(
    [
      {
        condition: hasBrightness(phuThePalace, ['mieu', 'vuong']),
        text: 'Tình duyên thuận lợi, dễ tìm được người ưng ý',
      },
      {
        condition:
          hasStarIn([phuThePalace], 'Hồng Loan') || hasStarIn([phuThePalace], 'Đào Hoa'),
        text: 'Có sức hút, dễ gặp được người tốt',
      },
      {
        condition: hasStarIn([menhPalace], 'Thiên Đồng'),
        text: 'Tính cách hòa nhã, dễ được yêu mến',
      },
    ],
    LOVE_STRENGTH_DEFAULTS
  );
  const challenges = buildLoveChallenges(phuThePalace, menhPalace);
  const luckyYears = calculateLuckyYears(chart, 'love');
  const challengingYears = calculateChallengingYears(chart, 'love');

  const palacePhrase = phuThePalace?.majorStars.length
    ? `Cung Phu Thê có ${phuThePalace.majorStars.map((star) => star.name).join(', ')} cho thấy`
    : 'Cung Phu Thê cho thấy';
  const hasDifficulty = hasBrightness(phuThePalace, ['ham']);

  return {
    topic: 'love',
    title: 'Tình duyên',
    overview:
      `Tình duyên của bạn: ${palacePhrase} ${lowerFirst(strengths[0])}. ` +
      (hasDifficulty ? 'Tuy nhiên, cần chú ý đến những thách thức trong quan hệ.' : ''),
    strengths,
    challenges,
    recommendations: [...LOVE_RECOMMENDATIONS],
    suitablePartner,
    luckyYears,
    challengingYears,
  };
}

function interpretWealth(chart: ZiweiChart): TopicInterpretation {
  const taiBachPalace = findPalace(chart, 'taiBach');
  const menhPalace = findPalace(chart, 'menh');
  const wealthPalaces = [taiBachPalace, menhPalace];

  const incomeSources = buildIncomeSources(wealthPalaces);
  const strengths = buildStrengths(
    [
      {
        condition: hasBrightness(taiBachPalace, ['mieu', 'vuong']),
        text: 'Tài lộc vững, có nhiều cơ hội kiếm tiền',
      },
      {
        condition: hasStarIn(wealthPalaces, 'Lộc Tồn'),
        text: 'Có lộc về tiền bạc, may mắn trong đầu tư',
      },
      {
        condition: hasStarIn([taiBachPalace], 'Vũ Khúc'),
        text: 'Giỏi tính toán, phù hợp công việc tài chính',
      },
    ],
    WEALTH_STRENGTH_DEFAULTS
  );
  const challenges = buildWealthChallenges(taiBachPalace, menhPalace);
  const luckyYears = calculateLuckyYears(chart, 'wealth');
  const challengingYears = calculateChallengingYears(chart, 'wealth');

  const palacePhrase = taiBachPalace?.majorStars.length
    ? `Cung Tài Bạch có ${taiBachPalace.majorStars.map((star) => star.name).join(', ')} cho thấy`
    : 'Cung Tài Bạch cho thấy';
  const hasDifficulty = hasBrightness(taiBachPalace, ['ham']);

  return {
    topic: 'wealth',
    title: 'Tài lộc',
    overview:
      `Tài lộc của bạn: ${palacePhrase} ${lowerFirst(strengths[0])}. ` +
      (hasDifficulty ? 'Tuy nhiên, cần chú ý đến những thách thức về tài chính.' : ''),
    strengths,
    challenges,
    recommendations: [...WEALTH_RECOMMENDATIONS],
    incomeSources,
    luckyYears,
    challengingYears,
  };
}

function interpretHealth(chart: ZiweiChart): TopicInterpretation {
  const tatAchPalace = findPalace(chart, 'tatAch');
  const menhPalace = findPalace(chart, 'menh');

  const healthConcerns = buildHealthConcerns(tatAchPalace, menhPalace);
  const strengths = buildStrengths(
    [
      {
        condition: hasBrightness(tatAchPalace, ['mieu', 'vuong']),
        text: 'Sức khỏe tốt, tinh thần minh mẫn',
      },
      {
        condition: hasStarIn([menhPalace], 'Thiên Lương'),
        text: 'Có quý nhân phù trợ khi gặp bệnh',
      },
      {
        condition: hasStarIn([menhPalace], 'Thiên Đồng'),
        text: 'Tinh thần thoải mái, ít bệnh vặt',
      },
    ],
    HEALTH_STRENGTH_DEFAULTS
  );
  const challenges = buildHealthChallenges(tatAchPalace, menhPalace);
  const luckyYears = calculateLuckyYears(chart, 'health');
  const challengingYears = calculateChallengingYears(chart, 'health');

  const palacePhrase = tatAchPalace?.majorStars.length
    ? `Cung Tật Ách có ${tatAchPalace.majorStars.map((star) => star.name).join(', ')} cho thấy`
    : 'Cung Tật Ách cho thấy';

  return {
    topic: 'health',
    title: 'Sức khỏe',
    overview:
      `Sức khỏe của bạn: ${palacePhrase} ${lowerFirst(strengths[0])}. ` +
      `Cần chú ý đến ${healthConcerns.slice(0, 2).join(', ').toLowerCase()}.`,
    strengths,
    challenges,
    recommendations: [...HEALTH_RECOMMENDATIONS],
    healthConcerns,
    luckyYears,
    challengingYears,
  };
}

function findPalace(chart: ZiweiChart, id: PalaceId): Palace | undefined {
  return chart.palaces.find((palace) => palace.id === id);
}

function hasStarIn(palaces: ReadonlyArray<Palace | undefined>, star: string): boolean {
  return palaces.some((palace) => (palace ? palaceHasStar(palace, star) : false));
}

function hasBrightness(palace: Palace | undefined, levels: ReadonlyArray<string>): boolean {
  return (
    palace?.majorStars.some((star) => star.brightness && levels.includes(star.brightness)) ?? false
  );
}

function buildSuitableFields(palaces: ReadonlyArray<Palace | undefined>): string[] {
  const fields: string[] = [];
  const add = (condition: boolean, field: string): void => {
    if (condition && !fields.includes(field)) fields.push(field);
  };

  add(hasStarIn(palaces, 'Tử Vi'), 'Quản lý, lãnh đạo');
  add(hasStarIn(palaces, 'Vũ Khúc'), 'Tài chính, ngân hàng');
  add(hasStarIn(palaces, 'Thái Dương'), 'Truyền thông, giáo dục');
  add(hasStarIn(palaces, 'Thiên Phủ'), 'Bất động sản, hành chính');
  add(hasStarIn(palaces, 'Liêm Trinh'), 'Chính trị, pháp luật');
  add(hasStarIn(palaces, 'Văn Xương') || hasStarIn(palaces, 'Văn Khúc'), 'Giáo dục, nghiên cứu');
  add(hasStarIn(palaces, 'Tham Lang'), 'Nghệ thuật, giải trí');
  add(hasStarIn(palaces, 'Cự Môn'), 'Kinh doanh, đàm phán');

  return fields.length > 0 ? fields : ['Công việc linh hoạt phù hợp năng lực cá nhân'];
}

function buildSuitablePartner(palaces: ReadonlyArray<Palace | undefined>): string[] {
  const partners: string[] = [];
  const add = (condition: boolean, partner: string): void => {
    if (condition && !partners.includes(partner)) partners.push(partner);
  };

  add(hasStarIn(palaces, 'Tử Vi'), 'Người có địa vị, khí chất');
  add(hasStarIn(palaces, 'Thái Âm'), 'Người hiền lành, nhu mì');
  add(hasStarIn(palaces, 'Tham Lang'), 'Người tài năng, có sức hút');
  add(hasStarIn(palaces, 'Thiên Phủ'), 'Người ổn định, đáng tin cậy');
  add(
    hasStarIn(palaces, 'Hồng Loan') || hasStarIn(palaces, 'Đào Hoa'),
    'Người mang lại duyên phận tốt'
  );

  partners.push('Người biết nhường nhịn, thấu hiểu');
  return partners;
}

function buildIncomeSources(palaces: ReadonlyArray<Palace | undefined>): string[] {
  const sources: string[] = ['Lương chính ổn định'];
  const add = (condition: boolean, source: string): void => {
    if (condition && !sources.includes(source)) sources.push(source);
  };

  add(hasStarIn(palaces, 'Vũ Khúc'), 'Đầu tư tài chính');
  add(hasStarIn(palaces, 'Tham Lang'), 'Kinh doanh');
  add(hasStarIn(palaces, 'Lộc Tồn'), 'Thu nhập bất ngờ');
  add(hasStarIn(palaces, 'Thiên Phủ'), 'Bất động sản');

  return sources;
}

function buildHealthConcerns(
  tatAchPalace: Palace | undefined,
  menhPalace: Palace | undefined
): string[] {
  const palaces = [tatAchPalace, menhPalace];
  const concerns: string[] = [];
  const add = (condition: boolean, concern: string): void => {
    if (condition && !concerns.includes(concern)) concerns.push(concern);
  };

  add(
    hasStarIn(palaces, 'Hỏa Tinh') || hasStarIn(palaces, 'Linh Tinh'),
    'Bệnh tim mạch, huyết áp'
  );
  add(hasStarIn(palaces, 'Thái Dương'), 'Bệnh về mắt');
  add(hasStarIn(palaces, 'Cự Môn'), 'Bệnh về họng, phổi');
  add(
    hasStarIn(palaces, 'Kình Dương') || hasStarIn(palaces, 'Đà La'),
    'Tai nạn, chấn thương'
  );
  add(true, 'Stress do áp lực công việc');

  return concerns;
}

function buildStrengths(
  conditions: ReadonlyArray<{ condition: boolean; text: string }>,
  defaults: readonly string[]
): string[] {
  const strengths = conditions
    .filter((entry) => entry.condition)
    .map((entry) => entry.text);

  return finalizeItems(strengths, defaults);
}

function buildCareerChallenges(
  quanLocPalace: Palace | undefined,
  menhPalace: Palace | undefined
): string[] {
  const challenges: string[] = [];
  const add = (condition: boolean, challenge: string): void => {
    if (condition && !challenges.includes(challenge)) challenges.push(challenge);
  };

  add(hasBrightness(quanLocPalace, ['ham']), 'Sự nghiệp nhiều thăng trầm, có thể bị sa thải, giáng chức');
  add(
    hasStarIn([menhPalace], 'Kình Dương') || hasStarIn([menhPalace], 'Đà La'),
    'Dễ có tranh chấp kiện tụng với đồng nghiệp, có thể bị tiểu nhân hãm hại'
  );
  add(
    hasStarIn([menhPalace], 'Hỏa Tinh') || hasStarIn([menhPalace], 'Linh Tinh'),
    'Có thể gặp tai nạn bất ngờ, cần cẩn trọng'
  );
  add(
    hasBrightness(menhPalace, ['ham']),
    'Số mệnh nghèo hèn, cuộc đời nhiều khổ nạn'
  );

  return finalizeItems(challenges, CAREER_CHALLENGE_DEFAULTS);
}

function buildLoveChallenges(
  phuThePalace: Palace | undefined,
  menhPalace: Palace | undefined
): string[] {
  const challenges: string[] = [];
  const add = (condition: boolean, challenge: string): void => {
    if (condition && !challenges.includes(challenge)) challenges.push(challenge);
  };

  add(hasBrightness(phuThePalace, ['ham']), 'Dễ gặp cảnh chia ly, cô độc');
  add(
    hasStarIn([phuThePalace, menhPalace], 'Kình Dương') ||
      hasStarIn([phuThePalace, menhPalace], 'Đà La'),
    'Dễ có tranh cãi, hiểu lầm, có thể dẫn đến ly hôn'
  );

  return finalizeItems(challenges, LOVE_CHALLENGE_DEFAULTS);
}

function buildWealthChallenges(
  taiBachPalace: Palace | undefined,
  menhPalace: Palace | undefined
): string[] {
  const challenges: string[] = [];
  const add = (condition: boolean, challenge: string): void => {
    if (condition && !challenges.includes(challenge)) challenges.push(challenge);
  };

  add(hasBrightness(taiBachPalace, ['ham']), 'Có thể phá sản, mất tiền lớn');
  add(
    hasStarIn([taiBachPalace, menhPalace], 'Địa Không') ||
      hasStarIn([taiBachPalace, menhPalace], 'Địa Kiếp'),
    'Tránh đầu tư mạo hiểm, dễ mất tiền lớn, có thể phá sản'
  );

  return finalizeItems(challenges, WEALTH_CHALLENGE_DEFAULTS);
}

function buildHealthChallenges(
  tatAchPalace: Palace | undefined,
  menhPalace: Palace | undefined
): string[] {
  const challenges: string[] = [];
  const add = (condition: boolean, challenge: string): void => {
    if (condition && !challenges.includes(challenge)) challenges.push(challenge);
  };

  add(hasBrightness(tatAchPalace, ['ham']), 'Có thể gặp bệnh nặng, cần phòng ngừa');
  add(
    hasStarIn([tatAchPalace, menhPalace], 'Hỏa Tinh'),
    'Có thể gặp tai nạn bất ngờ, nguy hiểm tính mạng'
  );

  return finalizeItems(challenges, HEALTH_CHALLENGE_DEFAULTS);
}

function finalizeItems(
  items: string[],
  defaults: readonly string[],
  min = 3,
  max = 5
): string[] {
  const unique = [...new Set(items)];

  for (const fallback of defaults) {
    if (unique.length >= min) break;
    if (!unique.includes(fallback)) unique.push(fallback);
  }

  return unique.slice(0, max);
}

function lowerFirst(text: string): string {
  return text.length > 0 ? text[0].toLowerCase() + text.slice(1) : text;
}

interface YearCandidate {
  year: number;
  score: number;
  palaceId: string;
}

function getYearCandidates(chart: ZiweiChart, duration = 10): YearCandidate[] {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: duration }, (_, index) => {
    const year = currentYear + index;
    const fortune = calculateYearlyFortune(chart, year, chart.birthInfo.year);

    return { year, score: fortune.score, palaceId: fortune.palaceId };
  });
}

function calculateLuckyYears(chart: ZiweiChart, topic: Topic): number[] {
  const topicPalace = TOPIC_PALACE[topic];
  const candidates = getYearCandidates(chart).map((candidate) => ({
    ...candidate,
    weight: candidate.score + (candidate.palaceId === topicPalace ? 1 : 0),
  }));

  const lucky = candidates.filter((candidate) => candidate.weight >= 4);

  if (lucky.length > 0) {
    return lucky.map((candidate) => candidate.year);
  }

  return [...candidates]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((candidate) => candidate.year);
}

function calculateChallengingYears(chart: ZiweiChart, topic: Topic): number[] {
  const topicPalace = TOPIC_PALACE[topic];
  const candidates = getYearCandidates(chart).map((candidate) => ({
    ...candidate,
    weight: candidate.score - (candidate.palaceId === topicPalace ? 1 : 0),
  }));

  const challenging = candidates.filter((candidate) => candidate.weight <= 2);

  if (challenging.length > 0) {
    return challenging.map((candidate) => candidate.year);
  }

  return [...candidates]
    .sort((a, b) => a.weight - b.weight)
    .slice(0, 3)
    .map((candidate) => candidate.year);
}
