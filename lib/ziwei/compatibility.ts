import type { ZiweiChart } from './types';
import type { FiveElement, HeavenlyStem, EarthlyBranch } from './types/enums';
import { BRANCH_LABELS } from './zodiac-compatibility';

export interface CompatibilityResult {
  score: number; // 0-100
  level: 'tốt' | 'trung bình' | 'xấu';
  aspects: {
    fiveElements: AspectScore;
    heavenlyStems: AspectScore;
    earthlyBranches: AspectScore;
    palaces: AspectScore;
  };
  strengths: string[];
  challenges: string[];
  advice: string;
}

interface AspectScore {
  score: number;
  /** Nhãn ngắn của kết quả, ví dụ "Tương sinh tốt". */
  meaning: string;
  /** Giải thích vì sao đạt điểm này, dựa trên quy luật tương ứng. */
  explanation: string;
  /** Lời khuyên cụ thể cho khía cạnh này. */
  tip: string;
}

const ELEMENT_LABELS: Record<FiveElement, string> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

const STEM_LABELS: Record<HeavenlyStem, string> = {
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

// Tương sinh: mỗi hành sinh ra hành kế tiếp (Kim → Thủy → Mộc → Hỏa → Thổ → Kim)
const TUONG_SINH: Record<FiveElement, FiveElement> = {
  kim: 'thuy',
  thuy: 'moc',
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
};

// Tương khắc: mỗi hành khắc hành cách một bước (Kim → Mộc → Thổ → Thủy → Hỏa → Kim)
const TUONG_KHAC: Record<FiveElement, FiveElement> = {
  kim: 'moc',
  moc: 'tho',
  tho: 'thuy',
  thuy: 'hoa',
  hoa: 'kim',
};

// Ngũ hợp thiên can: Giáp-Kỷ hóa Thổ, Ất-Canh hóa Kim, Bính-Tân hóa Thủy, Đinh-Nhâm hóa Mộc, Mậu-Quý hóa Hỏa
const HEAVENLY_STEM_HOP: Partial<
  Record<HeavenlyStem, { partner: HeavenlyStem; element: FiveElement }>
> = {
  giap: { partner: 'ky', element: 'tho' },
  ky: { partner: 'giap', element: 'tho' },
  at: { partner: 'canh', element: 'kim' },
  canh: { partner: 'at', element: 'kim' },
  binh: { partner: 'tan', element: 'thuy' },
  tan: { partner: 'binh', element: 'thuy' },
  dinh: { partner: 'nham', element: 'moc' },
  nham: { partner: 'dinh', element: 'moc' },
  mau: { partner: 'quy', element: 'hoa' },
  quy: { partner: 'mau', element: 'hoa' },
};

// Tam hợp: Thân-Tý-Thìn, Hợi-Mão-Mùi, Dần-Ngọ-Tuất, Tỵ-Dậu-Sửu
const TAM_HOP_GROUPS: readonly (readonly EarthlyBranch[])[] = [
  ['than', 'ty', 'thin'],
  ['hoi', 'mao', 'mui'],
  ['dan', 'ngo', 'tuat'],
  ['ti', 'dau', 'suu'],
];

// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
const LUC_HOP: Partial<Record<EarthlyBranch, EarthlyBranch>> = {
  ty: 'suu',
  suu: 'ty',
  dan: 'hoi',
  hoi: 'dan',
  mao: 'tuat',
  tuat: 'mao',
  thin: 'dau',
  dau: 'thin',
  ti: 'than',
  than: 'ti',
  ngo: 'mui',
  mui: 'ngo',
};

// Lục xung: Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi
const LUC_XUNG: Partial<Record<EarthlyBranch, EarthlyBranch>> = {
  ty: 'ngo',
  ngo: 'ty',
  suu: 'mui',
  mui: 'suu',
  dan: 'than',
  than: 'dan',
  mao: 'dau',
  dau: 'mao',
  thin: 'tuat',
  tuat: 'thin',
  ti: 'hoi',
  hoi: 'ti',
};

/**
 * Tính điểm hợp tuổi giữa hai lá số. Kết quả là số nguyên 0-100 và không phụ thuộc vào
 * ngẫu nhiên, nên cùng đầu vào luôn cho cùng kết quả.
 */
export function calculateCompatibility(
  chart1: ZiweiChart,
  chart2: ZiweiChart
): CompatibilityResult {
  // 1. Ngũ hành Nạp Âm (30%)
  const fiveElementsScore = calculateFiveElements(
    chart1.heavenPlate.napAm.element,
    chart2.heavenPlate.napAm.element
  );

  // 2. Thiên Can (20%)
  const heavenlyStemsScore = calculateHeavenlyStems(
    chart1.heavenPlate.fourPillars.year.stem,
    chart2.heavenPlate.fourPillars.year.stem
  );

  // 3. Địa Chi (25%)
  const earthlyBranchesScore = calculateEarthlyBranches(
    chart1.heavenPlate.fourPillars.year.branch,
    chart2.heavenPlate.fourPillars.year.branch
  );

  // 4. Cung Mệnh (25%)
  const palacesScore = calculatePalaces(chart1, chart2);

  // Các khía cạnh chấm trên thang 0-10, nhân 10 để tổng nằm trong thang 0-100
  const weightedAverage =
    fiveElementsScore.score * 0.3 +
    heavenlyStemsScore.score * 0.2 +
    earthlyBranchesScore.score * 0.25 +
    palacesScore.score * 0.25;
  const totalScore = Math.min(100, Math.max(0, Math.round(weightedAverage * 10)));

  const level = totalScore >= 70 ? 'tốt' : totalScore >= 50 ? 'trung bình' : 'xấu';

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (fiveElementsScore.score >= 7) strengths.push('Ngũ hành tương sinh');
  if (heavenlyStemsScore.score >= 7) strengths.push('Thiên can hợp');
  if (earthlyBranchesScore.score >= 7) strengths.push('Địa chi tam hợp/lục hợp');

  if (fiveElementsScore.score <= 4) challenges.push('Ngũ hành tương khắc');
  if (earthlyBranchesScore.score <= 4) challenges.push('Địa chi xung/hình');

  const advice = generateAdvice(totalScore);

  return {
    score: totalScore,
    level,
    aspects: {
      fiveElements: fiveElementsScore,
      heavenlyStems: heavenlyStemsScore,
      earthlyBranches: earthlyBranchesScore,
      palaces: palacesScore,
    },
    strengths,
    challenges,
    advice,
  };
}

function calculateFiveElements(elem1: FiveElement, elem2: FiveElement): AspectScore {
  const a = ELEMENT_LABELS[elem1];
  const b = ELEMENT_LABELS[elem2];

  if (elem1 === elem2) {
    return {
      score: 7,
      meaning: 'Bình hòa - Ổn định',
      explanation: `Cả hai cùng mệnh ${a}. Cùng hành nên tính khí và nhịp sống gần nhau, dễ đồng cảm; ngược lại, khi bất đồng cả hai dễ cùng cố chấp.`,
      tip: 'Khi bất đồng, để một người nói trước và người kia lắng nghe đến hết để tránh cùng bế tắc.',
    };
  }

  // Quan hệ được lưu một chiều; kiểm tra cả hai chiều để kết quả không phụ thuộc thứ tự người.
  if (TUONG_SINH[elem1] === elem2) return fiveElementSheng(elem1, elem2);
  if (TUONG_SINH[elem2] === elem1) return fiveElementSheng(elem2, elem1);
  if (TUONG_KHAC[elem1] === elem2) return fiveElementKhac(elem1, elem2);
  if (TUONG_KHAC[elem2] === elem1) return fiveElementKhac(elem2, elem1);

  return {
    score: 5,
    meaning: 'Trung bình',
    explanation: `Ngũ hành ${a} và ${b} không sinh cũng không khắc trực tiếp nên không có lực hút hay lực đẩy rõ rệt.`,
    tip: 'Xây dựng mối quan hệ bằng thời gian và sự thấu hiểu thay vì dựa vào yếu tố bẩm sinh.',
  };
}

// Nguồn sinh -> bên được sinh: nguồn nuôi dưỡng, quan hệ bổ trợ
function fiveElementSheng(source: FiveElement, target: FiveElement): AspectScore {
  const a = ELEMENT_LABELS[source];
  const b = ELEMENT_LABELS[target];
  return {
    score: 9,
    meaning: `${a} sinh ${b} - Tương sinh tốt`,
    explanation: `${a} sinh ${b}: theo quy luật ngũ hành, ${a} nuôi dưỡng ${b} nên hai bên tạo thế bổ trợ. Người mệnh ${a} thường là bên cho đi, người mệnh ${b} dễ nhận được sự nâng đỡ.`,
    tip: `Bên ${a} chủ động quan tâm, bên ${b} biết ghi nhận và đáp lại để sự nuôi dưỡng diễn ra hai chiều.`,
  };
}

// Bên khắc -> bên bị khắc: áp chế, dễ có cảm giác một bên lấn át
function fiveElementKhac(controller: FiveElement, target: FiveElement): AspectScore {
  const a = ELEMENT_LABELS[controller];
  const b = ELEMENT_LABELS[target];
  return {
    score: 3,
    meaning: `${a} khắc ${b} - Tương khắc`,
    explanation: `${a} khắc ${b}: theo quy luật ngũ hành, ${a} áp chế ${b} nên dễ có cảm giác một bên lấn át. Quan hệ dễ căng thẳng nếu cả hai cùng muốn làm chủ.`,
    tip: `Bên ${a} nên nhẹ tay hơn, bên ${b} nên nói rõ nhu cầu thay vì im lặng chịu đựng.`,
  };
}

function calculateHeavenlyStems(stem1: HeavenlyStem, stem2: HeavenlyStem): AspectScore {
  const a = STEM_LABELS[stem1];
  const b = STEM_LABELS[stem2];

  const hop = HEAVENLY_STEM_HOP[stem1];
  if (hop && hop.partner === stem2) {
    return {
      score: 9,
      meaning: 'Thiên can ngũ hợp - Rất tốt',
      explanation: `${a} hợp ${b} theo ngũ hợp thiên can (${a}-${b} hóa ${ELEMENT_LABELS[hop.element]}). Hai can hút nhau tự nhiên nên dễ đồng điệu trong suy nghĩ và cách ứng xử.`,
      tip: 'Tận dụng sự đồng điệu này khi bàn bạc việc lớn, nhưng vẫn kiểm tra lại từng chi tiết.',
    };
  }

  if (stem1 === stem2) {
    return {
      score: 7,
      meaning: 'Thiên can bình hòa - Ổn định',
      explanation: `Cùng can ${a}: hai người có tính khí bẩm sinh giống nhau nên dễ hiểu nhau, nhưng ít bổ sung và có thể cùng gặp một loại khó khăn.`,
      tip: 'Phân chia việc theo thế mạnh riêng của mỗi người để tránh chồng chéo.',
    };
  }

  return {
    score: 5,
    meaning: 'Thiên can trung bình',
    explanation: `Can ${a} và ${b} không hợp nhau trực tiếp, cũng không cùng can nên khác biệt tính cách ở mức vừa phải. Mối quan hệ phụ thuộc nhiều vào cách hai bên tôn trọng nhau.`,
    tip: 'Tìm điểm chung về sở thích hoặc mục tiêu để tạo kết nối.',
  };
}

function calculateEarthlyBranches(branch1: EarthlyBranch, branch2: EarthlyBranch): AspectScore {
  const pair = `${BRANCH_LABELS[branch1]} và ${BRANCH_LABELS[branch2]}`;

  // Cùng một Địa chi: bình hòa, không tính là tam hợp
  if (branch1 === branch2) {
    return {
      score: 6,
      meaning: 'Địa chi bình hòa',
      explanation: `Cùng tuổi ${BRANCH_LABELS[branch1]}: không có quan hệ tam hợp, lục hợp hay xung nên quan hệ ở mức ổn định, không đặc biệt thuận lợi cũng không xung khắc.`,
      tip: 'Tạo thói quen chung, như cùng làm một việc định kỳ, để gắn kết hơn.',
    };
  }

  const tamHopGroup = TAM_HOP_GROUPS.find(
    (group) => group.includes(branch1) && group.includes(branch2)
  );
  if (tamHopGroup) {
    const groupLabel = tamHopGroup.map((b) => BRANCH_LABELS[b]).join(' - ');
    return {
      score: 9,
      meaning: 'Địa chi tam hợp - Rất tốt',
      explanation: `${pair} cùng thuộc bộ tam hợp ${groupLabel}. Ba chi này hỗ trợ nhau thành một nhóm, nên hai người thường bổ sung điểm mạnh và dễ cùng hướng tới mục tiêu.`,
      tip: 'Phối hợp trong những việc lớn cần hai người cùng gánh vác.',
    };
  }

  if (LUC_HOP[branch1] === branch2) {
    return {
      score: 8,
      meaning: 'Địa chi lục hợp - Tốt',
      explanation: `${pair} lục hợp: hai chi gắn bó tự nhiên, dễ hiểu và tin cậy nhau khi làm chung.`,
      tip: 'Tận dụng sự tin cậy này khi bàn chuyện quan trọng.',
    };
  }

  if (LUC_XUNG[branch1] === branch2) {
    return {
      score: 2,
      meaning: 'Địa chi lục xung - Xấu',
      explanation: `${pair} lục xung (đối nhau trên vòng 12 Địa chi): hai bên dễ đi theo hai hướng ngược nhau, nhanh nóng nhanh nguội và dễ va chạm khi ra quyết định.`,
      tip: 'Thống nhất mục tiêu trước khi quyết định; tránh tranh cãi khi đang bực.',
    };
  }

  return {
    score: 5,
    meaning: 'Địa chi trung bình',
    explanation: `${pair} không tam hợp, lục hợp hay lục xung trực tiếp nên địa chi không tạo lực hút hay lực đẩy rõ rệt.`,
    tip: 'Dành thời gian tìm hiểu nhau để tạo sự gắn kết.',
  };
}

function calculatePalaces(chart1: ZiweiChart, chart2: ZiweiChart): AspectScore {
  // So sánh cung Mệnh của hai lá số
  const menh1 = chart1.palaces.find((p) => p.id === 'menh');
  const menh2 = chart2.palaces.find((p) => p.id === 'menh');

  if (!menh1 || !menh2) {
    return {
      score: 5,
      meaning: 'Không xác định',
      explanation: 'Thiếu dữ liệu cung Mệnh của một trong hai lá số nên không thể so sánh.',
      tip: 'Kiểm tra lại ngày giờ sinh đã nhập.',
    };
  }

  if (menh1.element === menh2.element) {
    const a = ELEMENT_LABELS[menh1.element];
    return {
      score: 7,
      meaning: 'Cung Mệnh bình hòa - Ổn định',
      explanation: `Cung Mệnh của cả hai cùng hành ${a}, nên nền tảng tính cách và cách nhìn cuộc sống gần giống nhau.`,
      tip: 'Hợp tác trên thế mạnh chung, đồng thời để ý điểm yếu mà cả hai cùng có.',
    };
  }

  return {
    score: 5,
    meaning: 'Cung Mệnh trung bình',
    explanation: `Cung Mệnh hành ${ELEMENT_LABELS[menh1.element]} và ${ELEMENT_LABELS[menh2.element]} khác nhau, nên mỗi người có thế mạnh và cách nhìn riêng. Điều này bổ trợ nếu biết tôn trọng.`,
    tip: 'Lắng nghe góc nhìn của đối phương trước khi kết luận.',
  };
}

function generateAdvice(score: number): string {
  if (score >= 80) {
    return 'Hai bạn rất hợp nhau, có nhiều điểm tương đồng và bổ sung cho nhau. Đây là mối quan hệ tốt đẹp.';
  }
  if (score >= 60) {
    return 'Hai bạn có nhiều điểm hợp, cũng có một số khác biệt cần thấu hiểu. Với sự kiên nhẫn, mối quan hệ sẽ tốt đẹp.';
  }
  if (score >= 40) {
    return 'Hai bạn có một số điểm xung khắc, cần nỗ lực thấu hiểu và nhường nhịn nhau. Giao tiếp là chìa khóa.';
  }
  return 'Hai bạn có nhiều khác biệt, cần nỗ lực rất nhiều để duy trì mối quan hệ. Tuy nhiên, nếu cả hai đều cố gắng, mọi thứ đều có thể vượt qua.';
}
