import type { AuditTrail, ChartWarning } from './audit';
import type { ResolvedZiweiConfig } from './config';
import type {
  BrightnessLevel,
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  MutagenType,
  PalaceId,
} from './enums';
import type { BirthInfo } from './input';

/** Nhóm sao trong lá số Tử Vi. */
export type StarCategory =
  'major' | 'lucCat' | 'lucSat' | 'tuHoa' | 'locMa' | 'phuTinh' | 'trangSinh' | 'thaiTue' | 'bacSi';

/** Thông tin của một ngôi sao trong cung. */
export interface Star {
  id: string;
  name: string;
  category: StarCategory;
  element: FiveElement;
  yinYang?: 'am' | 'duong';
  nature: 'cat' | 'hung' | 'trung';
  brightness?: BrightnessLevel;
  brightnessLabel?: 'M' | 'V' | 'Đ' | 'B' | 'H';
  rawIztroBrightness?: string;
  brightnessSource?: 'tanBien1956' | 'iztroMapped7To5' | 'none';
  mutagen?: MutagenType;
}

/** Một hạn trong lá số: Đại Hạn, Tiểu Hạn, Lưu Niên hoặc Lưu Nguyệt. */
export interface Period {
  type: 'daiHan' | 'tieuHan' | 'luuNien' | 'luuNguyet';
  palaceBranch: EarthlyBranch;
  startAge?: number;
  endAge?: number;
  nominalAges?: number[];
  solarYear?: number;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

/** Cặp Địa Chi và cung chính cho Tuần hoặc Triệt. */
export interface TuanTrietPair {
  branches: readonly [EarthlyBranch, EarthlyBranch];
  primaryBranch: EarthlyBranch | null;
}

/** Thông tin Tuần Không và Triệt Lộc toàn cục của lá số. */
export interface TuanTrietInfo {
  tuan: TuanTrietPair;
  triet: TuanTrietPair;
  isOverlapping: boolean;
  primaryMode: 'none' | 'first' | 'nearMenh';
}

/** Một cung trong lá số Tử Vi. */
export interface Palace {
  index: number;
  id: PalaceId;
  name: string;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  element: FiveElement;
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
  majorStars: Star[];
  auspiciousStars: Star[];
  maleficStars: Star[];
  otherStars: Star[];
  changsheng12: string;
  boshi12: string;
  suiqian12: string;
  majorPeriod: { startAge: number; endAge: number };
  minorPeriodAges: number[];
  hasTuan: boolean;
  hasTriet: boolean;
  tuanTrietRole: {
    tuan: 'equal' | 'primary' | 'secondary' | null;
    triet: 'equal' | 'primary' | 'secondary' | null;
  };
}

/** Nhãn Âm/Dương - Nam/Nữ. */
export type YinYangGenderLabel = 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ';

/** Lá số Tử Vi hoàn chỉnh, là đầu ra của engine. */
export interface ZiweiChart {
  schemaVersion: '1.0.0';
  birthInfo: BirthInfo;
  appliedConfig: ResolvedZiweiConfig;
  heavenPlate: {
    name: string;
    yinYangGenderLabel: YinYangGenderLabel;
    effectiveSolarDateStr: string;
    effectiveLunarDate: {
      year: number;
      month: number;
      day: number;
      isLeapMonthOriginal: boolean;
    };
    fourPillars: {
      year: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
      month: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
      day: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
      hour: { stem: HeavenlyStem; branch: EarthlyBranch; label: string };
    };
    napAm: { name: string; element: FiveElement };
    fiveElementsClass: { name: string; element: FiveElement; number: 2 | 3 | 4 | 5 | 6 };
    soulLord: string;
    bodyLord: string;
    soulPalaceBranch: EarthlyBranch;
    bodyPalaceBranch: EarthlyBranch;
    bodyPalaceName: string;
    elementRelationSummary: string;
  };
  palaces: readonly [
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
    Palace,
  ];
  tuanTriet: TuanTrietInfo;
  periods: Period[];
  warnings: ChartWarning[];
  auditTrail: AuditTrail;
}
