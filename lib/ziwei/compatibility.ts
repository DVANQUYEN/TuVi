import type { ZiweiChart, Palace, Star } from './types';
import type {
  BrightnessLevel,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  MutagenType,
  PalaceId,
} from './types/enums';
import { BRANCH_LABELS } from './zodiac-compatibility';

export type CompatibilityAspectKey =
  | 'foundation'
  | 'marriagePalace'
  | 'starSynergy'
  | 'canChi'
  | 'crossPalace';

export type CompatibilityAspectQuality = 'cat' | 'binh' | 'canLuuY';

export interface CompatibilityAspect {
  /** Điểm trên thang điểm 10. */
  score: number;
  /** Nhãn ngắn của kết quả. */
  meaning: string;
  /** Nhãn định tính đi kèm meaning, do tầng dữ liệu quyết định. */
  quality: CompatibilityAspectQuality;
  /** Giải thích vì sao đạt điểm này, dựa trên các sao và cung liên quan. */
  explanation: string;
  /** Lời khuyên cụ thể cho khía cạnh này. */
  tip: string;
}

export interface CompatibilityTiming {
  year: number;
  /** Điểm tham khảo trên thang điểm 10, không nằm trong tỷ lệ tương hợp. */
  score: number;
  meaning: string;
  detail: string;
}

export type CompatibilityConclusionTone = 'high' | 'balanced' | 'challenging';

export interface CompatibilityConclusion {
  /** Câu khẩu khí ngắn thay cho điểm số ở phần kết luận. */
  quote: string;
  /** Sắc thái tổng quát để giao diện chọn cách trình bày. */
  tone: CompatibilityConclusionTone;
}

export interface CompatibilityResult {
  /** Điểm tổng trên thang 0-100, chỉ dùng nội bộ và không hiển thị cho người dùng. */
  score: number;
  level: 'tốt' | 'trung bình' | 'xấu';
  /** Kết luận khẩu khí thay cho điểm số hiển thị. */
  conclusion: CompatibilityConclusion;
  aspects: Record<CompatibilityAspectKey, CompatibilityAspect>;
  timing: CompatibilityTiming;
  /**
   * `partial` khi thiếu cung trọng yếu, trụ can chi hoặc chính tinh trong dữ liệu đầu vào.
   * Khi đó kết quả vẫn được trả về nhưng chỉ nên đọc như mô hình tham chiếu.
   */
  dataQuality: 'full' | 'partial';
  /** Danh sách dữ liệu còn thiếu, dùng để hiển thị cảnh báo. */
  dataWarnings: string[];
  strengths: string[];
  challenges: string[];
  advice: string;
  method: {
    version: string;
    weights: Record<CompatibilityAspectKey, number>;
    caveat: string;
  };
}

export interface CompatibilityOptions {
  /** Năm dùng để tra đại hạn/lưu niên. Mặc định là năm hiện tại. */
  currentYear?: number;
}

const ELEMENT_LABELS: Readonly<Record<FiveElement, string>> = {
  kim: 'Kim',
  moc: 'Mộc',
  thuy: 'Thủy',
  hoa: 'Hỏa',
  tho: 'Thổ',
};

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

const MUTAGEN_LABELS: Readonly<Record<MutagenType, string>> = {
  hoaLoc: 'Hóa Lộc',
  hoaQuyen: 'Hóa Quyền',
  hoaKhoa: 'Hóa Khoa',
  hoaKy: 'Hóa Kỵ',
};

const BRIGHTNESS_LABELS: Readonly<Record<BrightnessLevel, string>> = {
  mieu: 'Miếu',
  vuong: 'Vượng',
  dac: 'Đắc',
  binh: 'Bình',
  ham: 'Hãm',
};

const BRIGHTNESS_SCORE: Readonly<Record<BrightnessLevel, number>> = {
  mieu: 3,
  vuong: 2.5,
  dac: 2,
  binh: 0,
  ham: -3,
};

const BRIGHTNESS_ALIASES: Readonly<Record<string, BrightnessLevel>> = {
  mieu: 'mieu',
  'miếu': 'mieu',
  m: 'mieu',
  vuong: 'vuong',
  'vượng': 'vuong',
  v: 'vuong',
  dac: 'dac',
  'đắc': 'dac',
  'đ': 'dac',
  d: 'dac',
  binh: 'binh',
  'bình': 'binh',
  b: 'binh',
  ham: 'ham',
  'hãm': 'ham',
  h: 'ham',
};

const MUTAGEN_SCORE: Readonly<Record<MutagenType, number>> = {
  hoaLoc: 1.2,
  hoaQuyen: 0.8,
  hoaKhoa: 0.8,
  hoaKy: -1.8,
};

// Tương sinh: Kim → Thủy → Mộc → Hỏa → Thổ → Kim
const TUONG_SINH: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'thuy',
  thuy: 'moc',
  moc: 'hoa',
  hoa: 'tho',
  tho: 'kim',
};

// Tương khắc: Kim → Mộc → Thổ → Thủy → Hỏa → Kim
const TUONG_KHAC: Readonly<Record<FiveElement, FiveElement>> = {
  kim: 'moc',
  moc: 'tho',
  tho: 'thuy',
  thuy: 'hoa',
  hoa: 'kim',
};

// Ngũ hợp thiên can: Giáp-Kỷ hóa Thổ, Ất-Canh hóa Kim, Bính-Tân hóa Thủy, Đinh-Nhâm hóa Mộc, Mậu-Quý hóa Hỏa
const HEAVENLY_STEM_HOP: Partial<
  Readonly<Record<HeavenlyStem, { partner: HeavenlyStem; element: FiveElement }>>
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
const LUC_HOP: Readonly<Partial<Record<EarthlyBranch, EarthlyBranch>>> = {
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
const LUC_XUNG: Readonly<Partial<Record<EarthlyBranch, EarthlyBranch>>> = {
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

// Lục hại: Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất
const LUC_HAI: Readonly<Partial<Record<EarthlyBranch, EarthlyBranch>>> = {
  ty: 'mui',
  mui: 'ty',
  suu: 'ngo',
  ngo: 'suu',
  dan: 'ti',
  ti: 'dan',
  mao: 'thin',
  thin: 'mao',
  than: 'hoi',
  hoi: 'than',
  dau: 'tuat',
  tuat: 'dau',
};

// Tam phương của cung Phu Thê: ba cung Phúc Đức, Quan Lộc, Thiên Di (không tính lại chính cung).
const PHU_THE_TAM_PHUONG: readonly PalaceId[] = ['phucDuc', 'quanLoc', 'thienDi'];

// Giá trị trung tính dùng chung khi thiếu cung, không có chính tinh hoặc thiếu tam phương.
const PALACE_NEUTRAL = 5.5;

// Quan hệ ngũ hành/địa chi khi thiếu dữ liệu vẫn dùng trung tính 5; đây là mức của một
// quan hệ chưa xác định, không phải mức của cả một cung bị thiếu.
const RELATION_NEUTRAL = 5;

const PILLAR_KEYS = ['year', 'month', 'day', 'hour'] as const;
type PillarKey = (typeof PILLAR_KEYS)[number];

const PILLAR_LABELS: Readonly<Record<PillarKey, string>> = {
  year: 'Năm',
  month: 'Tháng',
  day: 'Ngày',
  hour: 'Giờ',
};

const PILLAR_WEIGHTS: Readonly<Record<PillarKey, number>> = {
  year: 0.35,
  month: 0.2,
  day: 0.3,
  hour: 0.15,
};

// Thiên can bốn trụ dùng trọng số riêng, nhấn ngày sinh nhiều hơn năm một chút.
const STEM_PILLAR_WEIGHTS: Readonly<Record<PillarKey, number>> = {
  year: 0.3,
  month: 0.2,
  day: 0.35,
  hour: 0.15,
};

interface StarBonus {
  label: string;
  aliases: readonly string[];
  value: number;
}

const LOVE_STAR_BONUSES: readonly StarBonus[] = [
  { label: 'Đào Hoa', aliases: ['daoHoa', 'Đào Hoa'], value: 0.8 },
  { label: 'Hồng Loan', aliases: ['hongLoan', 'Hồng Loan'], value: 0.8 },
  { label: 'Thiên Hỷ', aliases: ['thienHy', 'Thiên Hỷ'], value: 0.8 },
  { label: 'Thiên Diêu', aliases: ['thienDieu', 'Thiên Diêu'], value: 0.4 },
  { label: 'Hàm Trì', aliases: ['hamTri', 'Hàm Trì'], value: 0.3 },
  { label: 'Mộc Dục', aliases: ['mocDuc', 'Mộc Dục'], value: 0.2 },
  { label: 'Thai', aliases: ['thai', 'Thai'], value: 0.3 },
  { label: 'Văn Xương', aliases: ['vanXuong', 'Văn Xương'], value: 0.3 },
  { label: 'Văn Khúc', aliases: ['vanKhuc', 'Văn Khúc'], value: 0.3 },
  { label: 'Tả Phù', aliases: ['taPhu', 'Tả Phù'], value: 0.3 },
  { label: 'Hữu Bật', aliases: ['huuBat', 'Hữu Bật'], value: 0.3 },
  { label: 'Thiên Riêu', aliases: ['thienRieu', 'Thiên Riêu'], value: 0.3 },
];

const OBSTACLE_PENALTIES: readonly StarBonus[] = [
  { label: 'Cô Thần', aliases: ['coThan', 'Cô Thần'], value: -0.9 },
  { label: 'Quả Tú', aliases: ['quaTu', 'Quả Tú'], value: -0.9 },
  { label: 'Địa Không', aliases: ['diaKhong', 'Địa Không'], value: -0.8 },
  { label: 'Địa Kiếp', aliases: ['diaKiep', 'Địa Kiếp'], value: -0.8 },
  { label: 'Kình Dương', aliases: ['kinhDuong', 'Kình Dương'], value: -0.7 },
  { label: 'Đà La', aliases: ['daLa', 'Đà La'], value: -0.6 },
  { label: 'Hỏa Tinh', aliases: ['hoaTinh', 'Hỏa Tinh'], value: -0.6 },
  { label: 'Linh Tinh', aliases: ['linhTinh', 'Linh Tinh'], value: -0.6 },
  { label: 'Thiên Hình', aliases: ['thienHinh', 'Thiên Hình'], value: -0.3 },
  { label: 'Thiên Khốc', aliases: ['thienKhoc', 'Thiên Khốc'], value: -0.3 },
  { label: 'Thiên Hư', aliases: ['thienHu', 'Thiên Hư'], value: -0.3 },
];

const HOA_KY_ALIASES: readonly string[] = ['hoaKy', 'Hóa Kỵ'];

const ROMANCE_ANCHOR_ALIASES: readonly string[] = [
  'daoHoa',
  'Đào Hoa',
  'hongLoan',
  'Hồng Loan',
  'thienHy',
  'Thiên Hỷ',
];

// Thời vận chỉ cộng thưởng cho ba sao tình cảm chủ chốt, không dùng toàn bộ
// danh sách phụ tinh tình cảm của khía cạnh Cung Phu Thê.
const TIMING_ROMANCE_STARS: readonly StarBonus[] = LOVE_STAR_BONUSES.filter((entry) =>
  entry.aliases.some((alias) => ROMANCE_ANCHOR_ALIASES.includes(alias))
);

const WEIGHTS: Readonly<Record<CompatibilityAspectKey, number>> = {
  foundation: 0.2,
  marriagePalace: 0.3,
  starSynergy: 0.2,
  canChi: 0.2,
  crossPalace: 0.1,
};

const METHOD_CAVEAT =
  'Đây là mô hình tham chiếu có chọn lọc, không phải bản luận giải đầy đủ và không phải công thức số học chính thống của Tử Vi. Trọng số do người biên soạn đặt ra từ các nguyên lý cổ điển (nạp âm, ngũ hành cung Mệnh/Thân/Cục, cung Phu Thê, tam phương, can chi, tương tác cung vị) và có thể điều chỉnh. Các khía cạnh có phần chồng lấn: sao tại cung Phu Thê cũng được dùng cho Tương hợp tinh tú và Tương tác cung vị; khía cạnh Cung Phu Thê phản ánh chất lượng nền duyên hôn nhân của mỗi người, không phải một phép đo thuần túy cặp đôi. Phần thời vận lấy theo lá số thứ nhất và không nằm trong tỷ lệ tương hợp. Kết quả phụ thuộc vào độ chính xác của ngày giờ sinh, cách quy đổi âm dương lịch và trường phái an sao; đây là tài liệu tham khảo chứ không phải phán quyết định mệnh.';

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function palaceById(chart: ZiweiChart, id: PalaceId): Palace | undefined {
  return chart.palaces?.find((palace) => palace.id === id);
}

function bodyPalace(chart: ZiweiChart): Palace | undefined {
  const palaces = chart.palaces ?? [];
  const byFlag = palaces.find((palace) => palace.isBodyPalace);
  if (byFlag) return byFlag;

  const bodyBranch = chart.heavenPlate?.bodyPalaceBranch;
  return bodyBranch ? palaces.find((palace) => palace.branch === bodyBranch) : undefined;
}

function palaceByBranch(chart: ZiweiChart, branch: EarthlyBranch | undefined): Palace | undefined {
  if (!branch) return undefined;
  return chart.palaces?.find((palace) => palace.branch === branch);
}

function collectStars(palace: Palace | undefined): Star[] {
  if (!palace) return [];
  return [
    ...(palace.majorStars ?? []),
    ...(palace.auspiciousStars ?? []),
    ...(palace.maleficStars ?? []),
    ...(palace.otherStars ?? []),
  ];
}

function palaceStarKeys(palace: Palace | undefined): Set<string> {
  const keys = new Set<string>();
  for (const star of collectStars(palace)) {
    if (star.id) keys.add(star.id);
    if (star.name) keys.add(star.name);
  }
  return keys;
}

function palaceHasAnyAlias(palace: Palace | undefined, aliases: readonly string[]): boolean {
  const keys = palaceStarKeys(palace);
  return aliases.some((alias) => keys.has(alias));
}

function palaceHasHoaKy(palace: Palace | undefined): boolean {
  if (!palace) return false;
  if (palaceHasAnyAlias(palace, HOA_KY_ALIASES)) return true;
  return collectStars(palace).some((star) => starMutagen(star) === 'hoaKy');
}

/**
 * Hóa Kỵ của một chính tinh đã được tính trong điều chỉnh Tứ Hóa trung bình của
 * khía cạnh Cung Phu Thê hay chưa. Nếu đã tính thì không trừ thêm lần nữa.
 */
function majorStarHoaKyCounted(palace: Palace | undefined): boolean {
  if (!palace) return false;
  // Chỉ tính là đã trừ ở điều chỉnh Tứ Hóa khi chính tinh thực sự mang mutagen Hóa Kỵ.
  return (palace.majorStars ?? []).some((star) => star.mutagen === 'hoaKy');
}

/**
 * Hóa Kỵ chỉ xuất hiện như một sao phụ hoặc tên sao, chưa được tính trong
 * điều chỉnh Tứ Hóa của chính tinh.
 */
function standaloneHoaKyPresent(palace: Palace | undefined): boolean {
  if (!palace) return false;
  if (palaceHasAnyAlias(palace, HOA_KY_ALIASES)) return true;
  return collectStars(palace).some(
    (star) => star.category !== 'major' && starMutagen(star) === 'hoaKy'
  );
}

function starIdentity(star: Star): string {
  return star.id || star.name;
}

function normalizeBrightness(star: Star): BrightnessLevel | null {
  const candidates: (string | undefined)[] = [
    star.brightness,
    star.brightnessLabel,
    star.rawIztroBrightness,
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const key = candidate.toString().trim().toLowerCase();
    const level = BRIGHTNESS_ALIASES[key];
    if (level) return level;
  }
  return null;
}

function brightnessAdjustment(star: Star): number {
  const level = normalizeBrightness(star);
  return level ? BRIGHTNESS_SCORE[level] : 0;
}

function natureAdjustment(star: Star): number {
  if (star.nature === 'cat') return 0.8;
  if (star.nature === 'hung') return -1.2;
  return 0;
}

function mutagenAdjustment(star: Star): number {
  return star.mutagen ? MUTAGEN_SCORE[star.mutagen] : 0;
}

function majorStarQuality(star: Star): number {
  return brightnessAdjustment(star) + natureAdjustment(star) + mutagenAdjustment(star);
}

function formatMajorStar(star: Star): string {
  const brightness = normalizeBrightness(star);
  const parts = [star.name];
  if (brightness) parts.push(`(${BRIGHTNESS_LABELS[brightness]})`);
  if (star.mutagen) parts.push(`– ${MUTAGEN_LABELS[star.mutagen]}`);
  return parts.join(' ');
}

function describeMajorStars(palace: Palace | undefined): string {
  if (!palace) return 'thiếu dữ liệu';
  const stars = palace.majorStars ?? [];
  if (stars.length === 0) return 'Vô chính diệu';
  return stars.map((star) => formatMajorStar(star)).join(', ');
}

function presentStarLabels(
  palace: Palace | undefined,
  entries: readonly StarBonus[]
): string[] {
  const keys = palaceStarKeys(palace);
  return entries
    .filter((entry) => entry.aliases.some((alias) => keys.has(alias)))
    .map((entry) => entry.label);
}

function minorLoveAdjustment(palace: Palace | undefined): number {
  if (!palace) return 0;
  const keys = palaceStarKeys(palace);

  let total = 0;
  for (const entry of LOVE_STAR_BONUSES) {
    if (entry.aliases.some((alias) => keys.has(alias))) total += entry.value;
  }
  for (const entry of OBSTACLE_PENALTIES) {
    if (entry.aliases.some((alias) => keys.has(alias))) total += entry.value;
  }

  // Hóa Kỵ của chính tinh đã được trừ trong điều chỉnh Tứ Hóa trung bình ở
  // phuTheOwnScore. Chỉ trừ mức phụ tinh khi Hóa Kỵ chưa được tính ở đó.
  if (!majorStarHoaKyCounted(palace) && standaloneHoaKyPresent(palace)) total -= 1;

  return clamp(total, -2, 2);
}

interface ElementRelation {
  score: number;
  kind: 'same' | 'sinh' | 'khac' | 'neutral';
}

function elementRelation(
  a: FiveElement | undefined,
  b: FiveElement | undefined
): ElementRelation {
  if (!a || !b) return { score: RELATION_NEUTRAL, kind: 'neutral' };
  if (a === b) return { score: 7, kind: 'same' };
  if (TUONG_SINH[a] === b || TUONG_SINH[b] === a) return { score: 9, kind: 'sinh' };
  if (TUONG_KHAC[a] === b || TUONG_KHAC[b] === a) return { score: 3, kind: 'khac' };
  return { score: RELATION_NEUTRAL, kind: 'neutral' };
}

function elementLabel(element: FiveElement | undefined): string {
  return element ? ELEMENT_LABELS[element] : 'không rõ';
}

function describeElementRelation(
  a: FiveElement | undefined,
  b: FiveElement | undefined
): string {
  const relation = elementRelation(a, b);
  const first = elementLabel(a);
  const second = elementLabel(b);

  switch (relation.kind) {
    case 'same':
      return `cùng hành ${first}`;
    case 'sinh': {
      const source = a && TUONG_SINH[a] === b ? first : second;
      const target = source === first ? second : first;
      return `${source} sinh ${target}`;
    }
    case 'khac': {
      const controller = a && TUONG_KHAC[a] === b ? first : second;
      const controlled = controller === first ? second : first;
      return `${controller} khắc ${controlled}`;
    }
    default:
      return `${first} và ${second} ở thế trung tính`;
  }
}

interface BranchRelation {
  score: number;
  kind: 'same' | 'tamHop' | 'lucHop' | 'lucXung' | 'lucHai' | 'neutral';
}

function branchRelation(
  a: EarthlyBranch | undefined,
  b: EarthlyBranch | undefined
): BranchRelation {
  if (!a || !b) return { score: RELATION_NEUTRAL, kind: 'neutral' };
  if (a === b) return { score: 6, kind: 'same' };

  const tamHop = TAM_HOP_GROUPS.find((group) => group.includes(a) && group.includes(b));
  if (tamHop) return { score: 9, kind: 'tamHop' };
  if (LUC_HOP[a] === b) return { score: 8, kind: 'lucHop' };
  if (LUC_XUNG[a] === b) return { score: 2, kind: 'lucXung' };
  if (LUC_HAI[a] === b) return { score: 3.5, kind: 'lucHai' };
  return { score: RELATION_NEUTRAL, kind: 'neutral' };
}

function branchLabel(branch: EarthlyBranch | undefined): string {
  return branch ? BRANCH_LABELS[branch] : 'không rõ';
}

function describeBranchRelation(
  a: EarthlyBranch | undefined,
  b: EarthlyBranch | undefined
): string {
  const relation = branchRelation(a, b);
  switch (relation.kind) {
    case 'same':
      return `cùng chi ${branchLabel(a)}`;
    case 'tamHop':
      return `${branchLabel(a)} – ${branchLabel(b)} tam hợp`;
    case 'lucHop':
      return `${branchLabel(a)} – ${branchLabel(b)} lục hợp`;
    case 'lucXung':
      return `${branchLabel(a)} – ${branchLabel(b)} lục xung`;
    case 'lucHai':
      return `${branchLabel(a)} – ${branchLabel(b)} lục hại`;
    default:
      return `${branchLabel(a)} – ${branchLabel(b)} trung tính`;
  }
}

function stemRelationScore(
  a: HeavenlyStem | undefined,
  b: HeavenlyStem | undefined
): number {
  if (!a || !b) return RELATION_NEUTRAL;
  const hop = HEAVENLY_STEM_HOP[a];
  if (hop && hop.partner === b) return 9;
  if (a === b) return 7;
  return RELATION_NEUTRAL;
}

function describeStemRelation(
  a: HeavenlyStem | undefined,
  b: HeavenlyStem | undefined
): string {
  if (!a || !b) return 'thiếu dữ liệu';
  const hop = HEAVENLY_STEM_HOP[a];
  if (hop && hop.partner === b) {
    return `${STEM_LABELS[a]} – ${STEM_LABELS[b]} ngũ hợp hóa ${ELEMENT_LABELS[hop.element]}`;
  }
  if (a === b) return `cùng can ${STEM_LABELS[a]}`;
  return `${STEM_LABELS[a]} và ${STEM_LABELS[b]} ổn định`;
}

function analyzeFoundation(chart1: ZiweiChart, chart2: ZiweiChart): CompatibilityAspect {
  const napAm1 = chart1.heavenPlate?.napAm?.element;
  const napAm2 = chart2.heavenPlate?.napAm?.element;
  const menh1 = palaceById(chart1, 'menh')?.element;
  const menh2 = palaceById(chart2, 'menh')?.element;
  const cuc1 = chart1.heavenPlate?.fiveElementsClass?.element;
  const cuc2 = chart2.heavenPlate?.fiveElementsClass?.element;
  const body1 = bodyPalace(chart1);
  const body2 = bodyPalace(chart2);
  const than1 = body1?.element;
  const than2 = body2?.element;

  const napAm = elementRelation(napAm1, napAm2);
  const menh = elementRelation(menh1, menh2);
  const cuc = elementRelation(cuc1, cuc2);
  const than = elementRelation(than1, than2);

  // Khi cung Thân trùng cung Mệnh ở cả hai lá số, cặp ngũ hành Mệnh và Thân là
  // cùng một cặp. Bỏ trọng số Thân và chuẩn hóa lại các trọng số còn lại để
  // không tính cùng một yếu tố hai lần.
  const bodyIsMenhForBoth = body1?.id === 'menh' && body2?.id === 'menh';
  const components: { score: number; weight: number }[] = [
    { score: napAm.score, weight: 0.35 },
    { score: menh.score, weight: 0.35 },
    { score: cuc.score, weight: 0.2 },
  ];
  if (!bodyIsMenhForBoth) components.push({ score: than.score, weight: 0.1 });

  const weightSum = components.reduce((sum, component) => sum + component.weight, 0);
  const weightedScore = components.reduce(
    (sum, component) => sum + component.score * component.weight,
    0
  );
  const score = round1(clamp(weightedScore / weightSum, 0, 10));

  const meaning =
    score >= 7.5
      ? 'Nền tảng bản mệnh tương sinh, dễ nương tựa'
      : score >= 5.5
        ? 'Nền tảng bản mệnh cân bằng'
        : 'Nền tảng bản mệnh có chỗ khác biệt';
  const quality: CompatibilityAspect['quality'] =
    score >= 7.5 ? 'cat' : score >= 5.5 ? 'binh' : 'canLuuY';

  const thanExplanation = bodyIsMenhForBoth
    ? 'Cung Thân trùng cung Mệnh ở cả hai lá số nên không tính thêm lần nữa.'
    : `Cung Thân: ${describeElementRelation(than1, than2)}.`;

  const explanation =
    `Nạp âm: ${describeElementRelation(napAm1, napAm2)}. ` +
    `Cung Mệnh: ${describeElementRelation(menh1, menh2)}. ` +
    `Ngũ hành Cục: ${describeElementRelation(cuc1, cuc2)}. ` +
    thanExplanation;

  const tip =
    score >= 7.5
      ? 'Giữ nhịp sinh hoạt và cách quan tâm mà cả hai đang thấy dễ chịu; nền tảng này sẽ bền hơn khi được nuôi dưỡng đều đặn.'
      : score >= 5.5
        ? 'Chọn những việc chung để cùng làm đều đặn, qua đó hiểu cách bổ trợ thế mạnh của nhau.'
        : 'Khi bất đồng, nên nói rõ nhu cầu của mình thay vì mong đối phương tự hiểu; sự khác biệt về ngũ hành không phải điều bất biến.';

  return { score, meaning, quality, explanation, tip };
}

interface PhuTheReading {
  palace: Palace | undefined;
  own: number | null;
  tamPhuong: number;
  score: number | null;
}

function phuTheOwnScore(palace: Palace | undefined): number | null {
  if (!palace) return null;

  const majors = palace.majorStars ?? [];
  const base = majors.length === 0 ? 5.5 : 6;

  let score = base;
  if (majors.length > 0) {
    score += average(majors.map((star) => brightnessAdjustment(star)));
    score += average(majors.map((star) => natureAdjustment(star)));
    score += average(majors.map((star) => mutagenAdjustment(star)));
  }

  score += minorLoveAdjustment(palace);
  if (palace.hasTuan) score -= 1;
  if (palace.hasTriet) score -= 1;

  return round1(clamp(score, 0, 10));
}

function palaceMajorQuality(palace: Palace | undefined): number {
  if (!palace) return PALACE_NEUTRAL;
  const majors = palace.majorStars ?? [];
  if (majors.length === 0) return PALACE_NEUTRAL;

  const adjustments = average(majors.map((star) => majorStarQuality(star)));
  return clamp(PALACE_NEUTRAL + adjustments, 0, 10);
}

function phuTheTamPhuongScore(chart: ZiweiChart): number {
  const palaces = PHU_THE_TAM_PHUONG.map((id) => palaceById(chart, id));
  if (palaces.every((palace) => !palace)) return PALACE_NEUTRAL;
  return round1(average(palaces.map((palace) => palaceMajorQuality(palace))));
}

function readPhuThe(chart: ZiweiChart): PhuTheReading {
  const palace = palaceById(chart, 'phuThe');
  const own = phuTheOwnScore(palace);
  const tamPhuong = phuTheTamPhuongScore(chart);
  const score = own === null ? null : round1(clamp(own * 0.65 + tamPhuong * 0.35, 0, 10));

  return { palace, own, tamPhuong, score };
}

function describePhuThe(palace: Palace | undefined): string {
  if (!palace) return 'chưa có dữ liệu cung Phu Thê';

  const parts = [describeMajorStars(palace)];
  const loveStars = presentStarLabels(palace, LOVE_STAR_BONUSES);
  const obstacles = presentStarLabels(palace, OBSTACLE_PENALTIES);

  if (loveStars.length > 0) parts.push(`phụ tinh tình cảm: ${loveStars.join(', ')}`);
  if (obstacles.length > 0) parts.push(`sao cần lưu tâm: ${obstacles.join(', ')}`);
  if (palace.hasTuan) parts.push('có Tuần');
  if (palace.hasTriet) parts.push('có Triệt');

  return parts.join('; ');
}

function analyzeMarriagePalace(chart1: ZiweiChart, chart2: ZiweiChart): CompatibilityAspect {
  const first = readPhuThe(chart1);
  const second = readPhuThe(chart2);
  const scores = [
    first.score ?? PALACE_NEUTRAL,
    second.score ?? PALACE_NEUTRAL,
  ];
  const score = round1(clamp(average(scores), 0, 10));

  const meaning =
    score >= 7
      ? 'Cung Phu Thê thuận hòa, nhiều trợ lực'
      : score >= 5
        ? 'Cung Phu Thê cân bằng, cần vun đắp'
        : 'Cung Phu Thê cần thêm chú tâm';
  const quality: CompatibilityAspect['quality'] =
    score >= 7 ? 'cat' : score >= 5 ? 'binh' : 'canLuuY';

  const explanation =
    `Đây là chất lượng nền duyên hôn nhân của mỗi người, không phải phép đo thuần túy cặp đôi. ` +
    `Cung Phu Thê thứ nhất: ${describePhuThe(first.palace)}. ` +
    `Cung Phu Thê thứ hai: ${describePhuThe(second.palace)}. ` +
    `Tự thân và tam phương (Phúc Đức, Quan Lộc, Thiên Di) được tổng hợp theo trọng số 65/35.`;

  const tip =
    score >= 7
      ? 'Nên tiếp tục giữ sự chân thành và những thói quen chung đang phát huy tác dụng; đừng để sự an yên khiến hai bên ngừng lắng nghe.'
      : score >= 5
        ? 'Dành thời gian bàn rõ về kỳ vọng trong đời sống chung; các sao tình cảm chỉ là gợi ý, còn nhịp điệu do hai người tạo nên.'
        : 'Tránh để im lặng kéo dài khi có điều chưa hài lòng; hỏi lại cho rõ và tách vấn đề khỏi cảm xúc cá nhân sẽ giúp cung Phu Thê nhẹ dần.';

  return { score, meaning, quality, explanation, tip };
}

function keyPalaces(chart: ZiweiChart): Palace[] {
  const result: Palace[] = [];
  const menh = palaceById(chart, 'menh');
  if (menh) result.push(menh);

  const phuThe = palaceById(chart, 'phuThe');
  if (phuThe && !result.some((palace) => palace.id === phuThe.id)) result.push(phuThe);

  const than = bodyPalace(chart);
  if (than && !result.some((palace) => palace.id === than.id)) result.push(than);

  return result;
}

function keyMajorStars(chart: ZiweiChart): Star[] {
  return keyPalaces(chart).flatMap((palace) => palace.majorStars ?? []);
}

function topMajorStars(stars: readonly Star[], count: number): Star[] {
  return [...stars]
    .sort((a, b) => {
      const diff = majorStarQuality(b) - majorStarQuality(a);
      if (Math.abs(diff) > 1e-9) return diff;
      const aKey = starIdentity(a);
      const bKey = starIdentity(b);
      return aKey < bKey ? -1 : aKey > bKey ? 1 : 0;
    })
    .slice(0, count);
}

function starMutagen(star: Star): MutagenType | null {
  if (star.mutagen) return star.mutagen;
  const id = star.id;
  if (id === 'hoaLoc' || id === 'hoaQuyen' || id === 'hoaKhoa' || id === 'hoaKy') {
    return id;
  }
  const name = star.name;
  if (name === 'Hóa Lộc') return 'hoaLoc';
  if (name === 'Hóa Quyền') return 'hoaQuyen';
  if (name === 'Hóa Khoa') return 'hoaKhoa';
  if (name === 'Hóa Kỵ') return 'hoaKy';
  return null;
}

function hasRomanceAnchor(chart: ZiweiChart): boolean {
  const palaces = [palaceById(chart, 'menh'), palaceById(chart, 'phuThe')];
  return palaces.some((palace) => palaceHasAnyAlias(palace, ROMANCE_ANCHOR_ALIASES));
}

function analyzeStarSynergy(chart1: ZiweiChart, chart2: ZiweiChart): CompatibilityAspect {
  const stars1 = keyMajorStars(chart1);
  const stars2 = keyMajorStars(chart2);

  const ids1 = new Set(stars1.map((star) => starIdentity(star)));
  const ids2 = new Set(stars2.map((star) => starIdentity(star)));
  const sharedIds = [...ids1].filter((id) => ids2.has(id));
  const nameById = new Map<string, string>();
  for (const star of [...stars1, ...stars2]) nameById.set(starIdentity(star), star.name);

  const sameStarBonus = Math.min(3, sharedIds.length * 1.5);

  const top1 = topMajorStars(stars1, 2);
  const top2 = topMajorStars(stars2, 2);
  const pairRelations: number[] = [];
  for (const a of top1) {
    for (const b of top2) {
      pairRelations.push(elementRelation(a.element, b.element).score);
    }
  }

  let score = 5.5;
  if (pairRelations.length > 0) {
    score = 5.5 * 0.5 + average(pairRelations) * 0.5;
  }
  score += sameStarBonus;

  const palaces1 = keyPalaces(chart1);
  const palaces2 = keyPalaces(chart2);
  const allKeyPalaces = [...palaces1, ...palaces2];
  const allKeyStars = allKeyPalaces.flatMap((palace) => collectStars(palace));

  let mutagenContribution = 0;
  for (const star of allKeyStars) {
    const mutagen = starMutagen(star);
    if (!mutagen) continue;
    if (mutagen === 'hoaKy') mutagenContribution -= 0.8;
    else mutagenContribution += 0.5;
  }
  mutagenContribution = clamp(mutagenContribution, -2, 2);
  score += mutagenContribution;

  const firstHasRomance = hasRomanceAnchor(chart1);
  const secondHasRomance = hasRomanceAnchor(chart2);
  const romanceCount = (firstHasRomance ? 1 : 0) + (secondHasRomance ? 1 : 0);
  const romanceBonus = romanceCount === 2 ? 0.8 : romanceCount === 1 ? 0.2 : 0;
  score += romanceBonus;

  const hungMajors = [...(palaces1.flatMap((palace) => palace.majorStars ?? [])),
    ...(palaces2.flatMap((palace) => palace.majorStars ?? []))].filter(
    (star) => star.nature === 'hung'
  );
  const hungPenalty = Math.max(-1.5, hungMajors.length * -0.4);
  score += hungPenalty;

  score = round1(clamp(score, 1, 10));

  const meaning =
    score >= 7
      ? 'Chính tinh hai lá số có nhiều điểm đồng điệu'
      : score >= 5
        ? 'Chính tinh hai lá số ở mức cân bằng'
        : 'Chính tinh hai lá số có khác biệt cần thấu hiểu';
  const quality: CompatibilityAspect['quality'] =
    score >= 7 ? 'cat' : score >= 5 ? 'binh' : 'canLuuY';

  const sharedText =
    sharedIds.length > 0
      ? `Chính tinh trùng nhau: ${sharedIds.map((id) => nameById.get(id) ?? id).join(', ')}.`
      : 'Không có chính tinh nào trùng nhau trong Mệnh, Phu Thê và Thân.';

  const pairText =
    pairRelations.length > 0
      ? 'Quan hệ ngũ hành giữa các chính tinh chủ chốt đã được đối chiếu theo mức tương sinh, tương khắc hoặc trung tính.'
      : 'Chưa đủ chính tinh chủ chốt để đối chiếu ngũ hành.';

  const mutagenNames = allKeyStars
    .map((star) => starMutagen(star))
    .filter((mutagen): mutagen is MutagenType => Boolean(mutagen))
    .map((mutagen) => MUTAGEN_LABELS[mutagen]);
  const mutagenText =
    mutagenNames.length > 0
      ? `Tứ Hóa nơi các cung chủ chốt: ${[...new Set(mutagenNames)].join(', ')}.`
      : 'Không ghi nhận Tứ Hóa nơi các cung chủ chốt.';

  const romanceText =
    romanceCount === 2
      ? 'Cả hai lá số đều có sao tình cảm nơi Mệnh hoặc Phu Thê.'
      : romanceCount === 1
        ? 'Một trong hai lá số có sao tình cảm nơi Mệnh hoặc Phu Thê.'
        : 'Không có Đào Hoa, Hồng Loan hay Thiên Hỷ nơi Mệnh/Phu Thê của hai lá số.';

  const hungText =
    hungMajors.length > 0
      ? `Có ${hungMajors.length} chính tinh mang tính hung trong các cung chủ chốt.`
      : 'Không có chính tinh hung trong các cung chủ chốt.';

  const explanation = `${sharedText} ${pairText} ${mutagenText} ${romanceText} ${hungText}`;

  const tip =
    score >= 7
      ? 'Phát huy những điểm chung đã có; đồng thời giữ không gian riêng để mỗi người không đánh mất cá tính.'
      : score >= 5
        ? 'Đặt tên cho những khác biệt thay vì quy chúng thành lỗi của nhau; hiểu cách phản ứng của mỗi người sẽ giảm va chạm.'
        : 'Tìm một hoạt động chung nhẹ nhàng để tạo kết nối mới, thay vì chỉ xoay quanh những khác biệt đã biết.';

  return { score, meaning, quality, explanation, tip };
}

function analyzeCanChi(chart1: ZiweiChart, chart2: ZiweiChart): CompatibilityAspect {
  let branchComposite = 0;
  let stemComposite = 0;
  const branchParts: string[] = [];
  const stemParts: string[] = [];

  for (const key of PILLAR_KEYS) {
    const pillar1 = chart1.heavenPlate?.fourPillars?.[key];
    const pillar2 = chart2.heavenPlate?.fourPillars?.[key];

    const branch = branchRelation(pillar1?.branch, pillar2?.branch);
    branchComposite += branch.score * PILLAR_WEIGHTS[key];
    branchParts.push(
      `${PILLAR_LABELS[key]}: ${describeBranchRelation(pillar1?.branch, pillar2?.branch)}`
    );

    const stemScore = stemRelationScore(pillar1?.stem, pillar2?.stem);
    stemComposite += stemScore * STEM_PILLAR_WEIGHTS[key];
    stemParts.push(
      `${PILLAR_LABELS[key]}: ${describeStemRelation(pillar1?.stem, pillar2?.stem)}`
    );
  }

  const score = round1(clamp(branchComposite * 0.8 + stemComposite * 0.2, 0, 10));

  const meaning =
    score >= 7
      ? 'Can Chi bốn trụ có nhiều quan hệ hỗ trợ'
      : score >= 5
        ? 'Can Chi bốn trụ ở mức cân bằng'
        : 'Can Chi bốn trụ có chỗ xung khắc cần lưu tâm';
  const quality: CompatibilityAspect['quality'] =
    score >= 7 ? 'cat' : score >= 5 ? 'binh' : 'canLuuY';

  const explanation = `Thiên can bốn trụ: ${stemParts.join('; ')}. ` +
    `Địa chi bốn trụ: ${branchParts.join('; ')}.`;

  const tip =
    score >= 7
      ? 'Tận dụng sự đồng điệu của can chi khi bàn việc lớn, nhưng vẫn kiểm tra lại từng bước để không chủ quan.'
      : score >= 5
        ? 'Các khác biệt can chi chỉ là nền tảng tham khảo; điều quan trọng là cách hai người xử lý bất đồng trong đời sống.'
        : 'Khi căng thẳng, nên tạm dừng để mỗi người lắng lại rồi nói tiếp; tránh quyết định lớn lúc cảm xúc đang cao.';

  return { score, meaning, quality, explanation, tip };
}

interface CrossPalacePair {
  label: string;
  first: Palace | undefined;
  second: Palace | undefined;
  weight: number;
}

function analyzeCrossPalace(chart1: ZiweiChart, chart2: ZiweiChart): CompatibilityAspect {
  const pairs: CrossPalacePair[] = [
    {
      label: 'Phu Thê thứ nhất với Mệnh thứ hai',
      first: palaceById(chart1, 'phuThe'),
      second: palaceById(chart2, 'menh'),
      weight: 0.35,
    },
    {
      label: 'Phu Thê thứ hai với Mệnh thứ nhất',
      first: palaceById(chart2, 'phuThe'),
      second: palaceById(chart1, 'menh'),
      weight: 0.35,
    },
    {
      label: 'Phu Thê hai bên',
      first: palaceById(chart1, 'phuThe'),
      second: palaceById(chart2, 'phuThe'),
      weight: 0.3,
    },
  ];

  let score = 0;
  const parts: string[] = [];

  for (const pair of pairs) {
    const relation =
      pair.first && pair.second
        ? branchRelation(pair.first.branch, pair.second.branch)
        : ({ score: PALACE_NEUTRAL, kind: 'neutral' } as BranchRelation);
    score += relation.score * pair.weight;

    const branchText =
      pair.first && pair.second
        ? describeBranchRelation(pair.first.branch, pair.second.branch)
        : 'thiếu dữ liệu cung';
    const elementText =
      pair.first && pair.second
        ? describeElementRelation(pair.first.element, pair.second.element)
        : 'thiếu dữ liệu ngũ hành cung';
    parts.push(`${pair.label}: ${branchText}; ${elementText}`);
  }

  score = round1(clamp(score, 0, 10));

  const meaning =
    score >= 7
      ? 'Cung vị hai bên ăn khớp, dễ tạo cảm giác được hiểu'
      : score >= 5
        ? 'Cung vị hai bên ở mức cân bằng'
        : 'Cung vị hai bên có chỗ lệch nhịp cần điều chỉnh';
  const quality: CompatibilityAspect['quality'] =
    score >= 7 ? 'cat' : score >= 5 ? 'binh' : 'canLuuY';

  const explanation = `${parts.join('. ')}.`;

  const tip =
    score >= 7
      ? 'Ghi nhận những điểm dễ chịu mà hai bên đang tạo cho nhau và duy trì chúng như một thói quen.'
      : score >= 5
        ? 'Hỏi lại điều đối phương thực sự cần trong từng tình huống; sự lệch nhịp của cung vị không cố định.'
        : 'Chọn thời điểm bình tĩnh để bàn những việc hệ trọng; tránh diễn giải câu nói của nhau theo hướng tiêu cực.';

  return { score, meaning, quality, explanation, tip };
}

function analyzeTiming(chart: ZiweiChart, currentYear: number): CompatibilityTiming {
  const periods = chart.periods ?? [];
  const birthYear = chart.birthInfo?.year;
  const age = typeof birthYear === 'number' ? currentYear - birthYear + 1 : null;

  const daiHan =
    age === null
      ? undefined
      : periods.find(
          (period) =>
            period.type === 'daiHan' &&
            typeof period.startAge === 'number' &&
            typeof period.endAge === 'number' &&
            age >= period.startAge &&
            age <= period.endAge
        );

  const luuNien = periods.find(
    (period) => period.type === 'luuNien' && period.solarYear === currentYear
  );

  const daiHanPalace = palaceByBranch(chart, daiHan?.palaceBranch);
  const luuNienPalace = palaceByBranch(chart, luuNien?.palaceBranch);

  if (!daiHan && !luuNien) {
    return {
      year: currentYear,
      score: 5,
      meaning: 'Chưa đủ dữ liệu thời vận',
      detail:
        'Phần thời vận được tính theo lá số thứ nhất. Lá số này chưa có thông tin đại vận và lưu niên cho năm này; đây là phần tham khảo riêng, không ảnh hưởng đến tỷ lệ tương hợp.',
    };
  }

  let score = 5;
  const segments: string[] = [];

  if (age !== null) segments.push(`Năm ${currentYear}, đương số ${age} tuổi.`);
  if (daiHan && daiHanPalace) {
    segments.push(`Đại vận đi qua cung ${daiHanPalace.name}.`);
    if (daiHanPalace.id === 'phuThe') score += 2;
    else if (daiHanPalace.id === 'menh' || daiHanPalace.isBodyPalace) score += 1;
  }
  if (luuNien && luuNienPalace) {
    segments.push(`Lưu niên nhập cung ${luuNienPalace.name}.`);
    const loveStars = presentStarLabels(luuNienPalace, TIMING_ROMANCE_STARS);
    const obstacles = presentStarLabels(luuNienPalace, OBSTACLE_PENALTIES);
    if (loveStars.length > 0) {
      score += 1.5;
      segments.push(`Có ${loveStars.join(', ')} tại cung lưu niên.`);
    }
    if (palaceHasHoaKy(luuNienPalace) || obstacles.length > 0) {
      score -= 2;
      const obstacleText = palaceHasHoaKy(luuNienPalace)
        ? [...new Set([...obstacles, 'Hóa Kỵ'])].join(', ')
        : obstacles.join(', ');
      segments.push(`Cần lưu tâm ${obstacleText} tại cung lưu niên.`);
    }
  }

  score = round1(clamp(score, 1, 10));

  const meaning =
    score >= 7
      ? 'Thời vận thuận cho việc vun đắp tình cảm'
      : score >= 5
        ? 'Thời vận ở mức trung hòa'
        : 'Thời vận cần thêm chú tâm';

  const detail =
    `${segments.join(' ')} Phần thời vận được tính theo lá số thứ nhất, chỉ mang tính tham khảo cho năm ${currentYear}, ` +
    'không nằm trong tỷ lệ tương hợp và không quyết định hướng đi của mối quan hệ.';

  return { year: currentYear, score, meaning, detail };
}

const CONCLUSION_QUOTES: Readonly<Record<CompatibilityConclusionTone, readonly string[]>> = {
  high: [
    'Âm dương thuận hòa, phu thê vinh hiển khi cả hai đồng lòng.',
    'Đôi bên tương sinh tương trợ, gia đạo hưng long nhờ đồng tâm vun đắp.',
    'Duyên lành gặp hội, trăm năm viên mãn bởi lòng người vun đắp.',
    'Thiên định lương duyên, còn bền lâu là nhờ nghĩa tình và nhường nhịn.',
    'Tơ hồng se mối, đôi người nâng đỡ nhau thì đường dài cũng vững.',
  ],
  balanced: [
    'Duyên phận do trời, hạnh phúc do người; biết nhường nhịn thì êm ấm.',
    'Căn duyên tiền định, dẫu trắc trở nhưng đồng lòng thì vượt qua.',
    'Âm dương lệch pha đôi chút, cốt ở chữ nhẫn và sự thấu hiểu.',
    'Vợ chồng hòa hợp, bước đầu cần bao dung, lâu dài cần cùng vun đắp.',
    'Duyên đến từ thương, bền từ nhịn, hai bên cùng giữ thì mới nên duyên.',
  ],
  challenging: [
    'Duyên mỏng nợ sâu, càng cần lấy nhẫn nhịn và đức độ mà giữ lấy nhau.',
    'Đường duyên trắc trở, cần tu tâm dưỡng tính, lấy đức thắng số.',
    'Nhiều điểm xung, khẩu thiệt dễ sinh, cần khắc chế cái tôi giữ gia đạo.',
    'Duyên khởi có nhiều thử thách, cần bền tâm và nhẫn nhịn lẫn nhau.',
    'Duyên chưa thuận, lấy chân thành và nhẫn nại làm nền mới mong dài lâu.',
  ],
};

function pickConclusionQuote(
  tone: CompatibilityConclusionTone,
  aspects: Record<CompatibilityAspectKey, CompatibilityAspect>
): string {
  const foundation = aspects.foundation.score;
  const marriagePalace = aspects.marriagePalace.score;
  const starSynergy = aspects.starSynergy.score;
  const canChi = aspects.canChi.score;
  const crossPalace = aspects.crossPalace.score;
  const quotes = CONCLUSION_QUOTES[tone];

  if (tone === 'high') {
    if (marriagePalace >= 7 && starSynergy >= 7) return quotes[0];
    if (foundation >= 7 && crossPalace >= 7) return quotes[1];
    if (canChi >= 7) return quotes[3];
    if (crossPalace >= 7) return quotes[4];
    return quotes[2];
  }

  if (tone === 'balanced') {
    if (crossPalace >= 6) return quotes[0];
    if (canChi >= 5.5) return quotes[1];
    if (marriagePalace >= 6) return quotes[3];
    if (foundation >= 6) return quotes[4];
    return quotes[2];
  }

  if (marriagePalace < 5) return quotes[0];
  if (foundation < 5) return quotes[1];
  if (crossPalace < 5) return quotes[3];
  if (canChi < 5) return quotes[4];
  return quotes[2];
}

function buildConclusion(
  totalScore: number,
  aspects: Record<CompatibilityAspectKey, CompatibilityAspect>
): CompatibilityConclusion {
  const tone: CompatibilityConclusionTone =
    totalScore >= 70 ? 'high' : totalScore >= 50 ? 'balanced' : 'challenging';
  return { quote: pickConclusionQuote(tone, aspects), tone };
}

function generateAdvice(score: number): string {
  if (score >= 70) {
    return 'Hai lá số có nhiều điểm nương tựa và bổ trợ. Đây là nền tảng thuận lợi để cùng vun đắp mối quan hệ bền lâu, trong đó sự chủ động của cả hai vẫn là điều quyết định.';
  }
  if (score >= 50) {
    return 'Hai lá số có nhiều điểm hòa hợp, bên cạnh những khác biệt cần thấu hiểu. Kiên nhẫn và lắng nghe sẽ giúp mối quan hệ hanh thông hơn.';
  }
  return 'Hai lá số có một số khác biệt về nền tảng và cung vị cần được nhìn nhận thẳng thắn. Nếu cả hai cùng chủ động vun đắp, giao tiếp chân thành và biết nhường nhịn đúng lúc, những khác biệt này vẫn có thể được chuyển hóa.';
}

function buildStrengths(
  aspects: Record<CompatibilityAspectKey, CompatibilityAspect>,
  first: PhuTheReading,
  second: PhuTheReading
): string[] {
  const strengths: string[] = [];

  if (aspects.foundation.score >= 7) {
    strengths.push('Nền tảng ngũ hành bản mệnh tương sinh, tạo cảm giác dễ nương tựa.');
  }
  if (aspects.marriagePalace.score >= 7) {
    strengths.push('Cung Phu Thê của hai lá số có nhiều sao sáng và phụ tinh tình cảm trợ lực.');
  }
  if (aspects.starSynergy.score >= 7) {
    strengths.push('Chính tinh nơi Mệnh và Phu Thê có điểm đồng điệu, dễ hiểu nhau.');
  }
  if (aspects.canChi.score >= 7) {
    strengths.push('Can Chi bốn trụ có nhiều quan hệ tam hợp hoặc lục hợp.');
  }
  if (aspects.crossPalace.score >= 7) {
    strengths.push('Cung Phu Thê và cung Mệnh hai bên ăn khớp về địa chi.');
  }

  const loveStars = [...presentStarLabels(first.palace, LOVE_STAR_BONUSES),
    ...presentStarLabels(second.palace, LOVE_STAR_BONUSES)];
  if (loveStars.length > 0) {
    strengths.push(`Cung Phu Thê có ${[...new Set(loveStars)].join(', ')} tượng trưng cho duyên tình.`);
  }

  return strengths;
}

function buildChallenges(
  aspects: Record<CompatibilityAspectKey, CompatibilityAspect>,
  first: PhuTheReading,
  second: PhuTheReading
): string[] {
  const challenges: string[] = [];

  if (aspects.foundation.score <= 4) {
    challenges.push('Nền tảng ngũ hành bản mệnh có tương khắc, dễ nảy sinh khác biệt về nhịp sống.');
  }
  if (aspects.marriagePalace.score <= 4) {
    challenges.push('Cung Phu Thê có yếu tố cần lưu tâm, nên bàn rõ kỳ vọng trong đời sống chung.');
  }
  if (aspects.starSynergy.score <= 4) {
    challenges.push('Chính tinh nơi Mệnh và Phu Thê khác biệt, cần thời gian để hiểu cách phản ứng của nhau.');
  }
  if (aspects.canChi.score <= 4) {
    challenges.push('Can Chi bốn trụ có chỗ xung hoặc hại, nên thận trọng khi quyết định việc lớn.');
  }
  if (aspects.crossPalace.score <= 4) {
    challenges.push('Cung vị hai bên có chỗ lệch nhịp, cần điều chỉnh cách giao tiếp.');
  }

  const obstacles = [...presentStarLabels(first.palace, OBSTACLE_PENALTIES),
    ...presentStarLabels(second.palace, OBSTACLE_PENALTIES)];
  if (obstacles.length > 0) {
    challenges.push(`Cung Phu Thê có ${[...new Set(obstacles)].join(', ')} cần được nhìn nhận nhẹ nhàng.`);
  }
  if (first.palace?.hasTuan || first.palace?.hasTriet || second.palace?.hasTuan || second.palace?.hasTriet) {
    challenges.push('Cung Phu Thê có Tuần hoặc Triệt, duyên khởi đầu có thể chậm nhưng không phải điều bất biến.');
  }

  return challenges;
}

interface DataQualityAssessment {
  level: 'full' | 'partial';
  warnings: string[];
}

/**
 * Kiểm tra những dữ liệu trọng yếu mà phần luận giải phụ thuộc vào.
 * Chỉ đánh dấu thiếu khi toàn bộ chính tinh vắng mặt, không coi một cung
 * Vô chính diệu là dữ liệu lỗi.
 */
function assessDataQuality(chart1: ZiweiChart, chart2: ZiweiChart): DataQualityAssessment {
  const warnings: string[] = [];
  const charts: { label: string; chart: ZiweiChart }[] = [
    { label: 'Lá số thứ nhất', chart: chart1 },
    { label: 'Lá số thứ hai', chart: chart2 },
  ];

  for (const { label, chart } of charts) {
    const palaces: readonly Palace[] = chart?.palaces ?? [];
    if (palaces.length === 0) {
      warnings.push(`${label}: thiếu toàn bộ 12 cung.`);
      continue;
    }

    if (!palaceById(chart, 'menh')) warnings.push(`${label}: thiếu cung Mệnh.`);
    if (!palaceById(chart, 'phuThe')) warnings.push(`${label}: thiếu cung Phu Thê.`);
    if (!bodyPalace(chart)) warnings.push(`${label}: thiếu cung Thân.`);

    const missingPillars = PILLAR_KEYS.filter(
      (key) => !chart.heavenPlate?.fourPillars?.[key]
    );
    if (missingPillars.length > 0) {
      warnings.push(
        `${label}: thiếu trụ ${missingPillars.map((key) => PILLAR_LABELS[key]).join(', ')}.`
      );
    }

    const hasMajorStar = palaces.some((palace) => (palace.majorStars ?? []).length > 0);
    if (!hasMajorStar) warnings.push(`${label}: không có chính tinh nào trong 12 cung.`);
    if (!chart.heavenPlate?.napAm?.element) warnings.push(`${label}: thiếu ngũ hành nạp âm.`);
    if (!chart.heavenPlate?.fiveElementsClass?.element) {
      warnings.push(`${label}: thiếu ngũ hành Cục.`);
    }
  }

  return {
    level: warnings.length > 0 ? 'partial' : 'full',
    warnings,
  };
}

/**
 * Tính độ tương hợp tình cảm giữa hai lá số Tử Vi.
 *
 * Kết quả được tổng hợp từ nền tảng bản mệnh, cung Phu Thê và tam phương,
 * tương hợp tinh tú, can chi bốn trụ và tương tác cung vị. Điểm số là thang tham chiếu
 * có trọng số biên soạn, không phải công thức chính thống của Tử Vi.
 *
 * @param chart1 - Lá số thứ nhất.
 * @param chart2 - Lá số thứ hai.
 * @param options - Tùy chọn năm dùng cho phần thời vận.
 * @returns Kết quả tương hợp. Điểm và meaning của các khía cạnh không phụ thuộc thứ tự
 * hai lá số; phần giải thích chi tiết, thứ tự strengths/challenges và thời vận có thể
 * lấy theo lá số thứ nhất.
 */
export function calculateCompatibility(
  chart1: ZiweiChart,
  chart2: ZiweiChart,
  options: CompatibilityOptions = {}
): CompatibilityResult {
  const aspects: Record<CompatibilityAspectKey, CompatibilityAspect> = {
    foundation: analyzeFoundation(chart1, chart2),
    marriagePalace: analyzeMarriagePalace(chart1, chart2),
    starSynergy: analyzeStarSynergy(chart1, chart2),
    canChi: analyzeCanChi(chart1, chart2),
    crossPalace: analyzeCrossPalace(chart1, chart2),
  };

  const weightedAverage = (Object.keys(WEIGHTS) as CompatibilityAspectKey[]).reduce(
    (sum, key) => sum + aspects[key].score * WEIGHTS[key],
    0
  );
  const totalScore = Math.min(100, Math.max(0, Math.round(weightedAverage * 10)));
  const level = totalScore >= 70 ? 'tốt' : totalScore >= 50 ? 'trung bình' : 'xấu';

  const currentYear = options.currentYear ?? new Date().getFullYear();
  const timing = analyzeTiming(chart1, currentYear);

  const first = readPhuThe(chart1);
  const second = readPhuThe(chart2);
  const dataQuality = assessDataQuality(chart1, chart2);

  return {
    score: totalScore,
    level,
    conclusion: buildConclusion(totalScore, aspects),
    aspects,
    timing,
    dataQuality: dataQuality.level,
    dataWarnings: dataQuality.warnings,
    strengths: buildStrengths(aspects, first, second),
    challenges: buildChallenges(aspects, first, second),
    advice: generateAdvice(totalScore),
    method: {
      version: '2.0.0',
      weights: { ...WEIGHTS },
      caveat: METHOD_CAVEAT,
    },
  };
}
