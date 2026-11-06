import type { DailyCalendar } from '@/components/horoscope/daily-calendar';
import type { EarthlyBranch, HeavenlyStem, PalaceId, ZiweiChart } from '../types';
import type { Palace } from '../types/chart';
import { EARTHLY_BRANCHES } from '../types/enums';
import { getMonthCanChi, getYearCanChi } from '../utils/can-chi';
import { BRANCH_LABELS } from '../zodiac-compatibility';
import { calculateDecadeFortune } from './decade-fortune';
import type { DecadeFortune, FortuneLevel } from './decade-fortune';
import { calculatePalaceFortuneScore, fortuneLevelFromScore } from './fortune-score';
import { collectPalaceStars } from './star-utils';

/**
 * Lớp luận giải hàng ngày minh bạch, dựa trên lá số đã lưu cộng với
 * Tứ Hóa năm, Thái Tuế, Lộc Tồn và các lớp lưu nguyệt/lưu nhật cơ bản.
 *
 * Đây chưa phải hệ thống an sao lưu nguyệt/lưu nhật đầy đủ: các lớp này chỉ
 * ánh xạ chi của tháng/ngày sang cung, không sinh thêm sao.
 */

export interface PersonalizedDailySignal {
  type: string;
  star?: string;
  palace: string;
  note: string;
}

export type PersonalizedDailyMutagenType = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';

export interface PersonalizedDaily {
  chartName?: string;
  age: number;
  decade: {
    ageRange: string;
    palaceName: string;
    majorStars: string[];
    score: number;
    level: FortuneLevel;
  };
  minor: {
    palaceName: string;
    majorStars: string[];
    score: number;
    level: FortuneLevel;
  } | null;
  annual: {
    branchLabel: string;
    palaceName: string;
    taiSuiPalace: string;
    locTonPalace?: string;
    kinhDuongPalace?: string;
    daLaPalace?: string;
    mutagens: Array<{
      type: PersonalizedDailyMutagenType;
      star: string;
      palace: string;
    }>;
  };
  activatedPalaces: Array<{ name: string; reasons: string[] }>;
  signals: PersonalizedDailySignal[];
  shouldDo: string[];
  shouldAvoid: string[];
  advice: string;
  basis: string[];
}

interface ResolvedMutagen {
  type: PersonalizedDailyMutagenType;
  star: string;
  palace: Palace;
}

const STEM_LABELS: Readonly<Record<HeavenlyStem, string>> = {
  giap: 'Giáp',
  at: 'Ất',
  binh: 'Bính',
  dinh: 'Đinh',
  mau: 'Mậu',
  ky: 'Kỷ',
  canh: 'Canh',
  tan: 'Tân',
  nham: 'Nhâm',
  quy: 'Quý',
};

const MUTAGEN_ORDER: readonly PersonalizedDailyMutagenType[] = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];

/** Tứ Hóa theo Thiên Can của năm: Lộc, Quyền, Khoa, Kỵ. */
const YEAR_MUTAGEN_STARS: Readonly<
  Record<HeavenlyStem, readonly [string, string, string, string]>
> = {
  giap: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
  at: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
  binh: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
  dinh: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
  mau: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
  ky: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
  canh: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
  tan: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
  nham: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],
  quy: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
};

/** Lộc Tồn theo Thiên Can của năm. */
const LOC_TON_BRANCH_BY_STEM: Readonly<Record<HeavenlyStem, EarthlyBranch>> = {
  giap: 'dan',
  at: 'mao',
  binh: 'ti',
  dinh: 'ngo',
  mau: 'ti',
  ky: 'ngo',
  canh: 'than',
  tan: 'dau',
  nham: 'hoi',
  quy: 'ty',
};

const KEY_PALACE_IDS: ReadonlySet<PalaceId> = new Set<PalaceId>([
  'menh',
  'taiBach',
  'quanLoc',
  'phuThe',
]);

const PALACE_TOPICS: Readonly<Record<PalaceId, string>> = {
  menh: 'bản thân',
  phuMau: 'cha mẹ, gia đình nội ngoại',
  phucDuc: 'phúc đức, tinh thần',
  dienTrach: 'nhà cửa, đất đai',
  quanLoc: 'công việc, sự nghiệp',
  noBoc: 'bạn bè, đồng nghiệp',
  thienDi: 'đi lại, quan hệ bên ngoài',
  tatAch: 'sức khỏe',
  taiBach: 'tài chính',
  tuTuc: 'con cái',
  phuThe: 'tình cảm, hôn nhân',
  huynhDe: 'anh chị em',
};

const LEVEL_TONE: Readonly<Record<FortuneLevel, string>> = {
  tốt: 'tạo đà thuận nhịp',
  xấu: 'cần tiết chế và giữ biên độ an toàn',
  'ổn định': 'giữ nhịp ổn định',
};

const UNKNOWN_PALACE_NAME = 'Chưa xác định';

function topicForPalace(palace?: Palace): string {
  return (palace && PALACE_TOPICS[palace.id]) ?? 'các việc liên quan';
}

function starNames(palace?: Palace): string[] {
  return palace?.majorStars.map((star) => star.name) ?? [];
}

function starText(palace?: Palace): string {
  return starNames(palace).join(', ') || 'Vô Chính Diệu';
}

function findPalaceByBranch(chart: ZiweiChart, branch: EarthlyBranch): Palace | undefined {
  return chart.palaces.find((palace) => palace.branch === branch);
}

function findStarPalace(chart: ZiweiChart, starName: string): Palace | undefined {
  return chart.palaces.find((palace) =>
    collectPalaceStars(palace).some((star) => star.name === starName)
  );
}

function shiftBranch(branch: EarthlyBranch, offset: number): EarthlyBranch {
  const index = EARTHLY_BRANCHES.indexOf(branch);
  return EARTHLY_BRANCHES[(index + offset + 12) % 12];
}

function resolveDecade(chart: ZiweiChart, age: number): DecadeFortune | null {
  const decades = calculateDecadeFortune(chart, age, chart.birthInfo.year);
  const current = decades.find((decade) => decade.isCurrent);
  if (current) return current;

  let nearest: DecadeFortune | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const decade of decades) {
    const distance =
      age < decade.ageRange[0]
        ? decade.ageRange[0] - age
        : age > decade.ageRange[1]
          ? age - decade.ageRange[1]
          : 0;
    if (distance < nearestDistance) {
      nearest = decade;
      nearestDistance = distance;
    }
  }
  return nearest;
}

function findMinorPalace(chart: ZiweiChart, age: number): Palace | null {
  const period =
    chart.periods.find(
      (candidate) => candidate.type === 'tieuHan' && candidate.nominalAges?.includes(age)
    ) ??
    chart.periods.find(
      (candidate) =>
        candidate.type === 'tieuHan' &&
        typeof candidate.startAge === 'number' &&
        typeof candidate.endAge === 'number' &&
        age >= candidate.startAge &&
        age <= candidate.endAge
    );

  if (period) {
    const palace = findPalaceByBranch(chart, period.palaceBranch);
    if (palace) return palace;
  }

  return chart.palaces.find((palace) => palace.minorPeriodAges.includes(age)) ?? null;
}

function formatLuckyHours(calendar: DailyCalendar): string {
  return calendar.luckyHours.map((branch) => BRANCH_LABELS[branch]).join(', ');
}

function takeThree(candidates: string[], fallbacks: string[]): string[] {
  const result: string[] = [];
  for (const item of [...candidates, ...fallbacks]) {
    if (!item || result.includes(item)) continue;
    result.push(item);
    if (result.length === 3) break;
  }
  return result;
}

/**
 * Xây dựng luận giải Tử Vi cá nhân cho một ngày cụ thể.
 *
 * Tuổi dùng cùng quy ước với phần đại vận trên UI: năm dương lịch của ngày xem
 * trừ năm sinh. Các lớp lưu niên dùng năm âm lịch của ngày xem.
 */
export function buildPersonalizedDaily(
  chart: ZiweiChart,
  date: Date,
  calendar: DailyCalendar,
  options?: { name?: string }
): PersonalizedDaily {
  const targetDate = date instanceof Date ? date : new Date(date as unknown as string);
  const solarYear = targetDate.getFullYear();
  const fallbackYear = Number.isFinite(solarYear) ? solarYear : chart.birthInfo.year;
  const age = fallbackYear - chart.birthInfo.year;

  const decadeFortune = resolveDecade(chart, age);
  const decadePalace =
    (decadeFortune
      ? chart.palaces.find((palace) => palace.id === decadeFortune.palaceId)
      : undefined) ?? chart.palaces[0];

  const decade = decadeFortune
    ? {
        ageRange: decadeFortune.decade,
        palaceName: decadePalace?.name ?? UNKNOWN_PALACE_NAME,
        majorStars: decadeFortune.majorStars,
        score: decadeFortune.score,
        level: decadeFortune.fortune,
      }
    : {
        ageRange: 'chưa xác định',
        palaceName: decadePalace?.name ?? UNKNOWN_PALACE_NAME,
        majorStars: starNames(decadePalace),
        score: calculatePalaceFortuneScore(decadePalace),
        level: fortuneLevelFromScore(calculatePalaceFortuneScore(decadePalace)),
      };

  const minorPalace = findMinorPalace(chart, age);
  const minorScore = minorPalace ? calculatePalaceFortuneScore(minorPalace) : null;
  const minor =
    minorPalace && minorScore !== null
      ? {
          palaceName: minorPalace.name,
          majorStars: starNames(minorPalace),
          score: minorScore,
          level: fortuneLevelFromScore(minorScore),
        }
      : null;

  const annualYear =
    Number.isFinite(calendar.lunarYear) && calendar.lunarYear > 0
      ? calendar.lunarYear
      : fallbackYear;
  const yearCanChi = getYearCanChi(annualYear);
  const yearBranchLabel = BRANCH_LABELS[yearCanChi.branch];

  const taiSuiPalace = findPalaceByBranch(chart, yearCanChi.branch) ?? chart.palaces[0];
  const taiSuiPalaceName = taiSuiPalace?.name ?? UNKNOWN_PALACE_NAME;

  const locTonBranch = LOC_TON_BRANCH_BY_STEM[yearCanChi.stem];
  const locTonPalace = findPalaceByBranch(chart, locTonBranch);
  const kinhDuongPalace = findPalaceByBranch(chart, shiftBranch(locTonBranch, 1));
  const daLaPalace = findPalaceByBranch(chart, shiftBranch(locTonBranch, -1));

  const resolvedMutagens: ResolvedMutagen[] = MUTAGEN_ORDER.map((type, index) => {
    const star = YEAR_MUTAGEN_STARS[yearCanChi.stem][index];
    const palace = findStarPalace(chart, star);
    return palace ? { type, star, palace } : null;
  }).filter((item): item is ResolvedMutagen => item !== null);

  const monthCanChi = getMonthCanChi(annualYear, calendar.lunarMonth);
  const monthPalace = findPalaceByBranch(chart, monthCanChi.branch);
  const dayPalace = findPalaceByBranch(chart, calendar.dayBranch);

  const activatedMap = new Map<string, { name: string; reasons: string[] }>();
  const activate = (palace: Palace | null | undefined, reason: string): void => {
    if (!palace) return;
    const existing = activatedMap.get(palace.id);
    if (existing) {
      if (!existing.reasons.includes(reason)) existing.reasons.push(reason);
      return;
    }
    activatedMap.set(palace.id, { name: palace.name, reasons: [reason] });
  };

  activate(decadePalace, 'Đại vận');
  activate(minorPalace, 'Tiểu vận');
  activate(taiSuiPalace, 'Lưu niên/Thái Tuế');
  activate(monthPalace, 'Lưu nguyệt');
  activate(dayPalace, 'Lưu nhật');
  activate(locTonPalace, 'Lưu Lộc Tồn');
  activate(kinhDuongPalace, 'Lưu Kình Dương');
  activate(daLaPalace, 'Lưu Đà La');
  for (const mutagen of resolvedMutagens) {
    activate(mutagen.palace, `Lưu Hóa ${mutagen.type}`);
  }

  const signals: PersonalizedDailySignal[] = [];

  if (decade.level === 'tốt') {
    signals.push({
      type: 'dai-van-thuan',
      palace: decade.palaceName,
      note: `Đại vận ${decade.ageRange} tại cung ${decade.palaceName} có ${starText(decadePalace)} làm nền tảng thuận nhịp cho ${topicForPalace(decadePalace)}.`,
    });
  } else if (decade.level === 'xấu') {
    signals.push({
      type: 'dai-van-bien-dong',
      palace: decade.palaceName,
      note: `Đại vận ${decade.ageRange} tại cung ${decade.palaceName} với ${starText(decadePalace)} cần tiết chế ở lĩnh vực ${topicForPalace(decadePalace)}.`,
    });
  }

  if (minor && minorPalace) {
    if (minor.level === 'tốt') {
      signals.push({
        type: 'tieu-van-thuan',
        palace: minor.palaceName,
        note: `Tiểu vận tại cung ${minor.palaceName} với ${starText(minorPalace)} tạo thuận lợi cho ${topicForPalace(minorPalace)}.`,
      });
    } else if (minor.level === 'xấu') {
      signals.push({
        type: 'tieu-van-bien-dong',
        palace: minor.palaceName,
        note: `Tiểu vận tại cung ${minor.palaceName} với ${starText(minorPalace)} cần giữ biên độ an toàn cho ${topicForPalace(minorPalace)}.`,
      });
    }
  }

  if (locTonPalace && KEY_PALACE_IDS.has(locTonPalace.id)) {
    signals.push({
      type: 'luu-loc-ton',
      star: 'Lộc Tồn',
      palace: locTonPalace.name,
      note: `Lưu Lộc Tồn nhập cung ${locTonPalace.name}: ưu tiên ${topicForPalace(locTonPalace)} và giữ khoản tích lũy.`,
    });
  }

  for (const mutagen of resolvedMutagens) {
    if (!KEY_PALACE_IDS.has(mutagen.palace.id)) continue;

    if (mutagen.type === 'Kỵ') {
      signals.push({
        type: 'luu-hoa-ky',
        star: mutagen.star,
        palace: mutagen.palace.name,
        note: `Lưu Hóa Kỵ của ${mutagen.star} nhập cung ${mutagen.palace.name}: rà soát kỹ ${topicForPalace(mutagen.palace)}, tránh cam kết vội.`,
      });
      continue;
    }

    const signalType =
      mutagen.type === 'Lộc'
        ? 'luu-hoa-loc'
        : mutagen.type === 'Quyền'
          ? 'luu-hoa-quyen'
          : 'luu-hoa-khoa';
    const effect =
      mutagen.type === 'Lộc'
        ? 'mở dòng tiền và cơ hội'
        : mutagen.type === 'Quyền'
          ? 'tăng quyền chủ động'
          : 'hỗ trợ hồ sơ, học tập và trao đổi';
    signals.push({
      type: signalType,
      star: mutagen.star,
      palace: mutagen.palace.name,
      note: `Lưu Hóa ${mutagen.type} của ${mutagen.star} nhập cung ${mutagen.palace.name}: ${effect} cho ${topicForPalace(mutagen.palace)}.`,
    });
  }

  if (kinhDuongPalace && KEY_PALACE_IDS.has(kinhDuongPalace.id)) {
    signals.push({
      type: 'luu-kinh-duong',
      star: 'Kình Dương',
      palace: kinhDuongPalace.name,
      note: `Lưu Kình Dương nhập cung ${kinhDuongPalace.name}: giữ biên bản rõ ràng khi trao đổi ${topicForPalace(kinhDuongPalace)}.`,
    });
  }

  if (daLaPalace && KEY_PALACE_IDS.has(daLaPalace.id)) {
    signals.push({
      type: 'luu-da-la',
      star: 'Đà La',
      palace: daLaPalace.name,
      note: `Lưu Đà La nhập cung ${daLaPalace.name}: chậm lại ở ${topicForPalace(daLaPalace)}, kiểm tra giấy tờ trước khi gửi.`,
    });
  }

  const focusPalace =
    minorPalace ?? monthPalace ?? dayPalace ?? taiSuiPalace ?? decadePalace ?? chart.palaces[0];
  const focusPalaceName = focusPalace?.name ?? UNKNOWN_PALACE_NAME;
  const focusTopic = topicForPalace(focusPalace);
  const luckyHours = formatLuckyHours(calendar);

  const shouldDoCandidates: string[] = [];
  for (const mutagen of resolvedMutagens) {
    if (!KEY_PALACE_IDS.has(mutagen.palace.id)) continue;
    if (mutagen.type === 'Lộc') {
      shouldDoCandidates.push(
        `Chốt các khoản thu và đàm phán ${topicForPalace(mutagen.palace)} ở cung ${mutagen.palace.name} (${mutagen.star} Hóa Lộc).`
      );
    } else if (mutagen.type === 'Quyền') {
      shouldDoCandidates.push(
        `Chủ động nhận vai trò quyết định trong ${topicForPalace(mutagen.palace)} tại cung ${mutagen.palace.name} (${mutagen.star} Hóa Quyền).`
      );
    } else if (mutagen.type === 'Khoa') {
      shouldDoCandidates.push(
        `Ưu tiên hồ sơ, học tập và trao đổi giấy tờ ở cung ${mutagen.palace.name} (${mutagen.star} Hóa Khoa).`
      );
    }
  }
  if (locTonPalace && KEY_PALACE_IDS.has(locTonPalace.id)) {
    shouldDoCandidates.push(
      `Giữ khoản dự phòng và dùng nguồn lực sẵn có ở cung ${locTonPalace.name} (Lưu Lộc Tồn).`
    );
  }
  if (decade.level === 'tốt') {
    shouldDoCandidates.push(
      `Đặt mục tiêu dài hơi cho ${topicForPalace(decadePalace)} theo cung ${decade.palaceName} (${starText(decadePalace)}).`
    );
  }
  if (minor && minorPalace && minor.level === 'tốt') {
    shouldDoCandidates.push(
      `Xử lý việc ${topicForPalace(minorPalace)} trong ngày tại cung ${minorPalace.name} (${starText(minorPalace)}).`
    );
  }
  if (calendar.truc.lucky) {
    shouldDoCandidates.push(
      `Tận dụng trực ${calendar.truc.name} để hoàn tất việc ở cung ${focusPalaceName}.`
    );
  }
  if (luckyHours) {
    shouldDoCandidates.push(
      `Đặt việc cần tập trung vào giờ ${luckyHours} để trao đổi ${focusTopic}.`
    );
  }

  const shouldDo = takeThree(shouldDoCandidates, [
    `Dành một khoảng tập trung cho ${focusTopic} tại cung ${focusPalaceName} trước khi chuyển việc.`,
    `Ghi rõ thỏa thuận ở cung ${focusPalaceName} trước khi thực hiện.`,
    `Dành thời gian cho ${topicForPalace(dayPalace ?? taiSuiPalace)} vào cuối ngày.`,
    `Đặt việc cần tập trung vào giờ ${luckyHours || 'đầu ngày'}.`,
  ]);

  const shouldAvoidCandidates: string[] = [];
  for (const mutagen of resolvedMutagens) {
    if (mutagen.type !== 'Kỵ' || !KEY_PALACE_IDS.has(mutagen.palace.id)) continue;
    shouldAvoidCandidates.push(
      `Tránh ký kết hoặc cam kết lớn ở cung ${mutagen.palace.name} (${mutagen.star} Hóa Kỵ); đối chiếu điều khoản ${topicForPalace(mutagen.palace)}.`
    );
  }
  if (kinhDuongPalace && KEY_PALACE_IDS.has(kinhDuongPalace.id)) {
    shouldAvoidCandidates.push(
      `Không tranh luận gay gắt về ${topicForPalace(kinhDuongPalace)} tại cung ${kinhDuongPalace.name} (Lưu Kình Dương); ghi lại thỏa thuận.`
    );
  }
  if (daLaPalace && KEY_PALACE_IDS.has(daLaPalace.id)) {
    shouldAvoidCandidates.push(
      `Chậm lại ở ${topicForPalace(daLaPalace)} tại cung ${daLaPalace.name} (Lưu Đà La); kiểm tra giấy tờ trước khi gửi.`
    );
  }
  if (decade.level === 'xấu') {
    shouldAvoidCandidates.push(
      `Không mở rộng ${topicForPalace(decadePalace)} khi chưa có phương án dự phòng (cung ${decade.palaceName}).`
    );
  }
  if (minor && minorPalace && minor.level === 'xấu') {
    shouldAvoidCandidates.push(
      `Hạn chế quyết định lớn về ${topicForPalace(minorPalace)} trong ngày (cung ${minorPalace.name}).`
    );
  }
  if (!calendar.truc.lucky) {
    shouldAvoidCandidates.push(
      `Không khởi việc mới trong trực ${calendar.truc.name}; xử lý việc đã có kế hoạch.`
    );
  }

  const shouldAvoid = takeThree(shouldAvoidCandidates, [
    `Tránh tranh luận với người tuổi ${BRANCH_LABELS[calendar.conflictBranch]} khi cảm xúc đang căng.`,
    `Không đổi kế hoạch ở cung ${focusPalaceName} nếu chưa có phương án thay thế.`,
    `Kiểm tra lại điều khoản liên quan ${focusTopic} trước khi cam kết.`,
    `Giữ khoảng cách với quyết định đầu tư mới khi chưa đối chiếu cung ${decade.palaceName}.`,
  ]);

  const minorAdvice = minor
    ? `Tiểu vận tại cung ${minor.palaceName} (${minor.majorStars.join(', ') || 'Vô Chính Diệu'}) ${LEVEL_TONE[minor.level]} và là lớp điều chỉnh trong ngày.`
    : 'Chưa đủ dữ liệu tiểu vận nên chỉ bám theo đại vận và lưu niên.';
  const focusLine =
    focusPalace && decadePalace && focusPalace.id === decadePalace.id
      ? `Giữ nhịp ${focusTopic} theo kế hoạch đã định`
      : `Ưu tiên ${topicForPalace(decadePalace)} ở mức vừa phải, xử lý ${focusTopic} theo nhịp đã định`;
  const advice =
    `Bối cảnh đại vận ${decade.ageRange} tại cung ${decade.palaceName} (${starText(decadePalace)}) ${LEVEL_TONE[decade.level]}, đóng góp khoảng 70% nền tảng. ` +
    `${minorAdvice} ${focusLine} và dùng giờ ${luckyHours || 'thuận tiện'} cho việc cần sự rõ ràng. ` +
    'Đây là lớp tham khảo từ lá số đã lưu, không phải kết luận cố định.';

  const basis: string[] = [
    `Đại vận ${decade.ageRange} tuổi – cung ${decade.palaceName} (${decade.majorStars.join(', ') || 'Vô Chính Diệu'}), điểm ${decade.score}/5`,
  ];
  if (minor) {
    basis.push(
      `Tiểu vận – cung ${minor.palaceName} (${minor.majorStars.join(', ') || 'Vô Chính Diệu'}), điểm ${minor.score}/5`
    );
  }
  basis.push(`Lưu niên ${STEM_LABELS[yearCanChi.stem]} ${yearBranchLabel} – cung ${taiSuiPalaceName}`);
  if (monthPalace) {
    basis.push(`Lưu nguyệt ${BRANCH_LABELS[monthCanChi.branch]} – cung ${monthPalace.name}`);
  }
  if (dayPalace) {
    basis.push(`Lưu nhật ${BRANCH_LABELS[calendar.dayBranch]} – cung ${dayPalace.name}`);
  }
  if (locTonPalace) {
    basis.push(`Lưu Lộc Tồn tại chi ${BRANCH_LABELS[locTonBranch]} – cung ${locTonPalace.name}`);
  }
  if (kinhDuongPalace) {
    basis.push(`Lưu Kình Dương – cung ${kinhDuongPalace.name}`);
  }
  if (daLaPalace) {
    basis.push(`Lưu Đà La – cung ${daLaPalace.name}`);
  }
  for (const mutagen of resolvedMutagens) {
    basis.push(
      `Lưu Hóa ${mutagen.type} – ${mutagen.star} tại cung ${mutagen.palace.name}`
    );
  }
  basis.push(
    `Ngày ${calendar.dayCanChi}, trực ${calendar.truc.name}, giờ hoàng đạo ${luckyHours || 'không có dữ liệu'}`
  );

  const chartName = options?.name?.trim() || chart.birthInfo.name?.trim() || undefined;

  return {
    chartName,
    age,
    decade,
    minor,
    annual: {
      branchLabel: yearBranchLabel,
      palaceName: taiSuiPalaceName,
      taiSuiPalace: taiSuiPalaceName,
      locTonPalace: locTonPalace?.name,
      kinhDuongPalace: kinhDuongPalace?.name,
      daLaPalace: daLaPalace?.name,
      mutagens: resolvedMutagens.map((mutagen) => ({
        type: mutagen.type,
        star: mutagen.star,
        palace: mutagen.palace.name,
      })),
    },
    activatedPalaces: [...activatedMap.values()],
    signals,
    shouldDo,
    shouldAvoid,
    advice,
    basis,
  };
}
