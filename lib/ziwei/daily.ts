import type { EarthlyBranch } from './types/enums';
import { EARTHLY_BRANCHES } from './types/enums';
import { getDayCanChi } from './utils/can-chi';
import { jdFromDate } from './utils/ho-ngoc-duc-lunar';

export interface DailyHoroscope {
  date: string;
  branch: EarthlyBranch;
  overall: number; // 1-10
  career: number; // 1-10
  love: number; // 1-10
  wealth: number; // 1-10
  health: number; // 1-10
  luckyNumbers: number[];
  luckyColors: string[];
  advice: string;
}

/** Tên tiếng Việt của 12 con giáp. */
export const BRANCH_NAMES: Record<EarthlyBranch, string> = {
  ty: 'Tý',
  suu: 'Sửu',
  dan: 'Dần',
  mao: 'Mão',
  thin: 'Thìn',
  ti: 'Tỵ',
  ngo: 'Ngọ',
  mui: 'Mùi',
  than: 'Thân',
  dau: 'Dậu',
  tuat: 'Tuất',
  hoi: 'Hợi',
};

type Relationship = 'binh' | 'tamHop' | 'lucXung' | 'tuHinh';

export function generateDailyHoroscope(
  branch: EarthlyBranch,
  date: Date = new Date()
): DailyHoroscope {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Tính Can Chi ngày
  const jd = jdFromDate(day, month, year);
  const dayCanChi = getDayCanChi(jd);

  // Tính điểm dựa trên mối quan hệ giữa tuổi và ngày
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
  const dayBranchIndex = EARTHLY_BRANCHES.indexOf(dayCanChi.branch);

  // Tam hợp: (branchIndex + 4) % 12, (branchIndex + 8) % 12
  // Lục xung: (branchIndex + 6) % 12
  // Tứ hình: (branchIndex + 3) % 12, (branchIndex + 9) % 12
  // Bình hòa: cùng chi

  const relationship = calculateRelationship(branchIndex, dayBranchIndex);

  // Tính điểm (deterministic)
  const baseScore = getBaseScore(relationship);
  const variation = getVariation(day, month, year, branchIndex);

  const overall = clampScore(baseScore.overall + variation);
  const career = clampScore(baseScore.career + variation);
  const love = clampScore(baseScore.love + variation);
  const wealth = clampScore(baseScore.wealth + variation);
  const health = clampScore(baseScore.health + variation);

  // Số may mắn
  const luckyNumbers = generateLuckyNumbers(day, month, year, branchIndex);

  // Màu may mắn
  const luckyColors = generateLuckyColors(branch);

  // Lời khuyên
  const advice = generateAdvice(relationship, overall);

  return {
    date: formatLocalDate(date),
    branch,
    overall,
    career,
    love,
    wealth,
    health,
    luckyNumbers,
    luckyColors,
    advice,
  };
}

/** Format YYYY-MM-DD theo ngày local (không dùng toISOString vì lệch múi giờ). */
function formatLocalDate(date: Date): string {
  const yyyy = String(date.getFullYear()).padStart(4, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, value));
}

function calculateRelationship(branchIndex: number, dayBranchIndex: number): Relationship {
  const diff = (dayBranchIndex - branchIndex + 12) % 12;

  if (diff === 0) return 'binh'; // Bình hòa
  if (diff === 4 || diff === 8) return 'tamHop'; // Tam hợp
  if (diff === 6) return 'lucXung'; // Lục xung
  if (diff === 3 || diff === 9) return 'tuHinh'; // Tứ hình
  return 'binh'; // Khác
}

interface Scores {
  overall: number;
  career: number;
  love: number;
  wealth: number;
  health: number;
}

function getBaseScore(relationship: Relationship): Scores {
  const scores: Record<Relationship, Scores> = {
    tamHop: { overall: 8, career: 8, love: 7, wealth: 8, health: 8 },
    lucXung: { overall: 4, career: 5, love: 3, wealth: 4, health: 5 },
    tuHinh: { overall: 5, career: 5, love: 4, wealth: 5, health: 4 },
    binh: { overall: 6, career: 6, love: 6, wealth: 6, health: 6 },
  };

  return scores[relationship];
}

function getVariation(day: number, month: number, year: number, branchIndex: number): number {
  // Deterministic variation dựa trên ngày tháng năm và tuổi
  const seed = (day * 31 + month * 12 + year + branchIndex * 7) % 5;
  return seed - 2; // -2 đến +2
}

function generateLuckyNumbers(
  day: number,
  month: number,
  year: number,
  branchIndex: number
): number[] {
  const numbers: number[] = [];
  const seed = day + month + year + branchIndex;

  for (let i = 0; i < 3; i++) {
    const num = ((seed * (i + 1) * 7) % 99) + 1;
    numbers.push(num);
  }

  return numbers;
}

const ELEMENT_COLORS: Partial<Record<EarthlyBranch, string[]>> = {
  ty: ['xanh dương', 'đen'],
  suu: ['vàng', 'nâu'],
  dan: ['xanh lá', 'đỏ'],
  mao: ['xanh lá', 'đỏ'],
  thin: ['vàng', 'trắng'],
  ti: ['đỏ', 'tím'],
  ngo: ['đỏ', 'hồng'],
  mui: ['vàng', 'nâu'],
  than: ['trắng', 'bạc'],
  dau: ['trắng', 'vàng'],
  tuat: ['vàng', 'nâu'],
  hoi: ['xanh dương', 'đen'],
};

function generateLuckyColors(branch: EarthlyBranch): string[] {
  return [...(ELEMENT_COLORS[branch] ?? ['vàng', 'đỏ'])];
}

function generateAdvice(relationship: Relationship, overall: number): string {
  if (relationship === 'tamHop') {
    return 'Ngày tốt để bắt đầu dự án mới, gặp gỡ đối tác. Tinh thần lạc quan, công việc thuận lợi.';
  }
  if (relationship === 'lucXung') {
    return 'Cẩn thận trong giao tiếp và quyết định quan trọng. Nên dành thời gian suy nghĩ trước khi hành động.';
  }
  if (overall >= 7) {
    return 'Ngày thuận lợi, có thể tiến hành các kế hoạch đã đề ra. Giữ vững tinh thần tích cực.';
  }
  if (overall <= 4) {
    return 'Nên thận trọng, tránh rủi ro không cần thiết. Tập trung vào công việc thường nhật.';
  }
  return 'Ngày bình thường, duy trì nhịp độ làm việc ổn định. Cân bằng giữa công việc và nghỉ ngơi.';
}
