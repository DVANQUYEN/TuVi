import type { EarthlyBranch, FiveElement, HeavenlyStem } from './types/enums';
import { NAP_AM_60 } from './data/stems-branches';
import { getYearCanChi } from './utils/can-chi';
import {
  BRANCH_LABELS,
  MAX_ZODIAC_YEAR,
  MIN_ZODIAC_YEAR,
  getZodiacCompatibility,
} from './zodiac-compatibility';

export interface LoveYearPerson {
  year: number;
  branch: EarthlyBranch;
  branchLabel: string;
  canChi: string;
  napAm: { name: string; element: FiveElement; elementLabel: string };
  trait: string;
}

export interface LoveYearPartner {
  branches: string[];
  elements: string[];
  guidance: string;
  cautions: string[];
}

export interface LoveYearWindow {
  year: number;
  canChi: string;
  branchLabel: string;
}

export interface LoveYearLookup {
  person: LoveYearPerson;
  partner: LoveYearPartner;
  favorableYears: LoveYearWindow[];
  cautiousYears: LoveYearWindow[];
  summary: string;
  methodNote: string;
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

const ELEMENT_LABELS: Readonly<Record<FiveElement, string>> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

const ELEMENT_BY_LABEL: Readonly<Record<string, FiveElement>> = {
  Kim: 'kim',
  Mộc: 'moc',
  Thủy: 'thuy',
  Hỏa: 'hoa',
  Thổ: 'tho',
};

// Tương sinh: Kim → Thủy → Mộc → Hỏa → Thổ → Kim
const TUONG_SINH: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'thuy',
  thuy: 'moc',
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
};

// Hành sinh ra mỗi hành (chiều ngược của tương sinh).
const ELEMENT_GENERATOR: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'tho',
  moc: 'thuy',
  thuy: 'kim',
  hoa: 'moc',
  tho: 'hoa',
};

const ELEMENT_TRAITS: Readonly<Record<FiveElement, string>> = {
  kim: 'Bản mệnh Kim trọng nghĩa khí, yêu bằng sự chân thành và giữ lời đã hứa.',
  moc: 'Bản mệnh Mộc giàu lòng vị tha, tình cảm nảy nở khi được chăm sóc bằng sự kiên nhẫn.',
  thuy: 'Bản mệnh Thủy mềm mỏng, thấu hiểu, dễ tạo cảm giác gần gũi nhưng cần sự ổn định để an lòng.',
  hoa: 'Bản mệnh Hỏa nồng nhiệt, chân thành; tình cảm bền khi cả hai biết giữ nhịp lắng nghe.',
  tho: 'Bản mệnh Thổ điềm đạm, đáng tin; yêu bằng sự vun đắp đều đặn và bao dung.',
};

const NAP_AM_FALLBACK: LoveYearPerson['napAm'] = {
  name: 'Chưa xác định',
  element: 'tho',
  elementLabel: 'Thổ',
};

const METHOD_NOTE =
  'Tính theo năm âm lịch; phần năm thuận duyên chỉ mang tính tham khảo, không thay thế lá số đầy đủ.';

const FALLBACK_NOTE =
  ' Không tìm thấy nạp âm tương ứng nên phần bản mệnh dùng giá trị trung tính.';

function resolveNapAm(canChi: string): { napAm: LoveYearPerson['napAm']; usedFallback: boolean } {
  const entry = NAP_AM_60.find((item) => item.startsWith(`${canChi} - `));
  if (!entry) return { napAm: NAP_AM_FALLBACK, usedFallback: true };

  const name = entry.slice(canChi.length + 3);
  const elementLabel = name.split(' ').pop() ?? '';
  const element = ELEMENT_BY_LABEL[elementLabel];

  if (!element) {
    return {
      napAm: { name, element: 'tho', elementLabel: ELEMENT_LABELS.tho },
      usedFallback: true,
    };
  }

  return { napAm: { name, element, elementLabel }, usedFallback: false };
}

function canChiLabel(stem: HeavenlyStem, branch: EarthlyBranch): string {
  return `${STEM_LABELS[stem]} ${BRANCH_LABELS[branch]}`;
}

function yearWindow(year: number): LoveYearWindow {
  const { stem, branch } = getYearCanChi(year);
  return {
    year,
    canChi: canChiLabel(stem, branch),
    branchLabel: BRANCH_LABELS[branch],
  };
}

/**
 * Tra cứu tình duyên theo năm sinh dựa trên Can Chi và nạp âm bản mệnh.
 * Tính theo năm âm lịch; kết quả chỉ mang tính tham khảo, không thay thế lá số đầy đủ.
 * Ném lỗi nếu năm không phải số nguyên trong khoảng [MIN_ZODIAC_YEAR, MAX_ZODIAC_YEAR].
 */
export function getLoveYearLookup(
  year: number,
  options: { currentYear?: number } = {}
): LoveYearLookup {
  if (!Number.isInteger(year) || year < MIN_ZODIAC_YEAR || year > MAX_ZODIAC_YEAR) {
    throw new RangeError(`Năm sinh phải là số nguyên từ ${MIN_ZODIAC_YEAR} đến ${MAX_ZODIAC_YEAR}`);
  }

  const compatibility = getZodiacCompatibility(year);
  const { stem, branch } = getYearCanChi(year);
  const branchLabel = BRANCH_LABELS[branch];
  const canChi = canChiLabel(stem, branch);
  const { napAm, usedFallback } = resolveNapAm(canChi);
  const personElement = napAm.element;

  const person: LoveYearPerson = {
    year,
    branch,
    branchLabel,
    canChi,
    napAm,
    trait: ELEMENT_TRAITS[personElement],
  };

  const partnerBranchLabels = [
    ...new Set(
      [...compatibility.tamHop, compatibility.lucHop].map((item) => BRANCH_LABELS[item])
    ),
  ];
  const partnerElements = [
    ELEMENT_LABELS[ELEMENT_GENERATOR[personElement]],
    ELEMENT_LABELS[TUONG_SINH[personElement]],
  ];
  const xungLabels = compatibility.tuHanhXung.map((item) => BRANCH_LABELS[item]);

  const partner: LoveYearPartner = {
    branches: partnerBranchLabels,
    elements: partnerElements,
    guidance:
      `Hợp duyên với tuổi ${partnerBranchLabels.join(', ')}; ` +
      `ưu tiên người mệnh ${partnerElements.join(', ')}; ` +
      `nên thận trọng với tuổi ${xungLabels.join(', ')} (tứ hành xung).`,
    cautions: xungLabels.map((label) => `Tuổi ${label}: khác nhịp, cần thêm bao dung`),
  };

  const favorableBranches = new Set<EarthlyBranch>([
    ...compatibility.tamHop,
    compatibility.lucHop,
  ]);
  const cautiousBranches = new Set<EarthlyBranch>(compatibility.tuHanhXung);
  const currentYear = options.currentYear ?? new Date().getFullYear();

  const favorableYears: LoveYearWindow[] = [];
  const cautiousYears: LoveYearWindow[] = [];

  for (let offset = 0; offset < 12; offset += 1) {
    const candidate = currentYear + offset;
    if (candidate < MIN_ZODIAC_YEAR || candidate > MAX_ZODIAC_YEAR) continue;

    const candidateBranch = getYearCanChi(candidate).branch;

    if (cautiousBranches.has(candidateBranch) && cautiousYears.length < 3) {
      cautiousYears.push(yearWindow(candidate));
    }
  }

  for (let offset = 0; offset < 12; offset += 1) {
    const candidate = currentYear + offset;
    if (candidate < MIN_ZODIAC_YEAR || candidate > MAX_ZODIAC_YEAR) continue;

    const candidateBranch = getYearCanChi(candidate).branch;

    if (
      favorableBranches.has(candidateBranch) &&
      !cautiousBranches.has(candidateBranch) &&
      favorableYears.length < 4
    ) {
      favorableYears.push(yearWindow(candidate));
    }
  }

  const summary =
    `Sinh năm ${year} can chi ${canChi}, nạp âm ${napAm.name} thuộc hành ${napAm.elementLabel}; ` +
    `tình duyên thuận khi gặp người cùng nhịp và tương sinh về ngũ hành, còn lại cần vun đắp bằng sự thấu hiểu.`;

  return {
    person,
    partner,
    favorableYears,
    cautiousYears,
    summary,
    methodNote: usedFallback ? METHOD_NOTE + FALLBACK_NOTE : METHOD_NOTE,
  };
}
