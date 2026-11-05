import { astro } from 'iztro';
import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  MajorStarId,
  MutagenType,
  PalaceId,
} from '../types/enums';
import type { BirthInfo } from '../types/input';
import type { ResolvedZiweiConfig } from '../types/config';
import type { Palace, Period, Star } from '../types/chart';
import { EARTHLY_BRANCHES_DATA } from '../data/stems-branches';
import { MAJOR_STAR_MAP, PALACE_MAP } from '../data';
import { mapIztroBrightnessTo5Levels } from '../data/brightness-fallback-map';

/** Kiểu astrolabe trả về từ iztro. */
type IztroAstrolabe = ReturnType<typeof astro.withOptions>;

/** Kiểu cung iztro. */
type IztroPalace = IztroAstrolabe['palaces'][number];

/** Kiểu sao iztro. */
type IztroStar = IztroPalace['majorStars'][number];

/** Đầu ra thô từ Layer 3 trước khi Việt hóa và override độ sáng. */
export interface RawAstrolabeOutput {
  /** 12 cung của lá số. */
  palaces: Palace[];
  /** Các hạn (Đại hạn, Tiểu hạn, Lưu niên...). */
  periods: Period[];
  /** Chi của cung Mệnh. */
  soulPalaceBranch: EarthlyBranch;
  /** Chi của cung Thân. */
  bodyPalaceBranch: EarthlyBranch;
  /** Ngũ hành cục. */
  fiveElementsClass: { name: string; element: FiveElement; number: 2 | 3 | 4 | 5 | 6 };
  /** Chủ Mệnh. */
  soulLord: string;
  /** Chủ Thân. */
  bodyLord: string;
}

const IZTRO_BRANCH_TO_EARTHLY: Readonly<Record<string, EarthlyBranch>> = {
  Tý: 'ty',
  Sửu: 'suu',
  Dần: 'dan',
  Mão: 'mao',
  Thìn: 'thin',
  Tỵ: 'ti',
  Ngọ: 'ngo',
  Mùi: 'mui',
  Thân: 'than',
  Dậu: 'dau',
  Tuất: 'tuat',
  Hợi: 'hoi',
};

const IZTRO_STEM_TO_HEAVENLY: Readonly<Record<string, HeavenlyStem>> = {
  Giáp: 'giap',
  Ất: 'at',
  Bính: 'binh',
  Đinh: 'dinh',
  Mậu: 'mau',
  Kỷ: 'ky',
  Canh: 'canh',
  Tân: 'tan',
  Nhâm: 'nham',
  Quý: 'quy',
};

const IZTRO_PALACE_NAME_TO_ID: Readonly<Record<string, PalaceId>> = {
  Mệnh: 'menh',
  'Phụ Mẫu': 'phuMau',
  'Phúc Đức': 'phucDuc',
  'Điền Trạch': 'dienTrach',
  'Quan Lộc': 'quanLoc',
  'Nô Bộc': 'noBoc',
  'Thiên Di': 'thienDi',
  'Tật Ách': 'tatAch',
  'Tài Bạch': 'taiBach',
  'Tử Nữ': 'tuTuc',
  'Phu Thê': 'phuThe',
  'Huynh Đệ': 'huynhDe',
};

const IZTRO_MAJOR_STAR_NAME_TO_ID: Readonly<Record<string, MajorStarId>> = {
  'Tử Vi': 'tuVi',
  'Thiên Cơ': 'thienCo',
  'Thái Dương': 'thaiDuong',
  'Vũ Khúc': 'vuKhuc',
  'Thiên Đồng': 'thienDong',
  'Liêm Trinh': 'liemTrinh',
  'Thiên Phủ': 'thienPhu',
  'Thái Âm': 'thaiAm',
  'Tham Lang': 'thamLang',
  'Cự Môn': 'cuMon',
  'Thiên Tướng': 'thienTuong',
  'Thiên Lương': 'thienLuong',
  'Thất Sát': 'thatSat',
  'Phá Quân': 'phaQuan',
};

const IZTRO_MUTAGEN_TO_TYPE: Readonly<Record<string, MutagenType>> = {
  Lộc: 'hoaLoc',
  Quyền: 'hoaQuyen',
  Khoa: 'hoaKhoa',
  Kỵ: 'hoaKy',
};

const CATEGORY_FALLBACK_ELEMENT: Readonly<Record<Star['category'], FiveElement>> = {
  major: 'tho',
  lucCat: 'moc',
  lucSat: 'kim',
  tuHoa: 'hoa',
  locMa: 'hoa',
  phuTinh: 'tho',
  trangSinh: 'thuy',
  thaiTue: 'tho',
  bacSi: 'kim',
};

const AUXILIARY_STAR_ELEMENT: Readonly<Record<string, FiveElement>> = {
  'Tả Phù': 'moc',
  'Hữu Bật': 'kim',
  'Văn Xương': 'kim',
  'Văn Khúc': 'thuy',
  'Lộc Tồn': 'tho',
  'Thiên Mã': 'hoa',
  'Kình Dương': 'kim',
  'Đà La': 'kim',
  'Hỏa Tinh': 'hoa',
  'Linh Tinh': 'hoa',
  'Thiên Khôi': 'hoa',
  'Thiên Việt': 'thuy',
  'Địa Không': 'hoa',
  'Địa Kiếp': 'hoa',
};

/**
 * Layer 3: Bọc iztro 2.6.4, gọi `withOptions` với ngày Âm lịch đã quy chuẩn.
 */
export class IztroEngineAdapter {
  /**
   * Gọi iztro để an sao.
   *
   * @param calendarOutput - Đầu ra từ {@link VietnameseCalendarAdapter}.
   * @param birthInfo - Thông tin sinh.
   * @param config - Cấu hình đã resolve.
   * @returns Dữ liệu lá số thô đã Việt hóa cơ bản.
   */
  generate(
    calendarOutput: {
      lunarYear: number;
      lunarMonth: number;
      lunarDay: number;
      isLeapMonth: boolean;
      fourPillars: { hour: { branch: EarthlyBranch } };
    },
    birthInfo: BirthInfo,
    config: ResolvedZiweiConfig
  ): RawAstrolabeOutput {
    const dateStr = `${calendarOutput.lunarYear}-${calendarOutput.lunarMonth}-${calendarOutput.lunarDay}`;
    const timeIndex = this.getHourIndex(calendarOutput.fourPillars.hour.branch);
    const gender = birthInfo.gender === 'nam' ? 'Nam' : 'Nữ';
    const isLeapMonth = this.resolveLeapMonthFlag(calendarOutput, config);

    const astrolabe = astro.withOptions({
      type: 'lunar',
      dateStr,
      timeIndex,
      gender,
      isLeapMonth,
      fixLeap: false,
      language: 'vi-VN',
      config: {
        algorithm: config.school === 'trungChau' ? 'zhongzhou' : 'default',
      },
    });

    return {
      palaces: this.extractPalaces(astrolabe),
      periods: this.extractPeriods(astrolabe, birthInfo, timeIndex),
      soulPalaceBranch: this.mapBranch(astrolabe.earthlyBranchOfSoulPalace),
      bodyPalaceBranch: this.mapBranch(astrolabe.earthlyBranchOfBodyPalace),
      fiveElementsClass: this.parseFiveElementsClass(astrolabe.fiveElementsClass),
      soulLord: astrolabe.soul,
      bodyLord: astrolabe.body,
    };
  }

  private resolveLeapMonthFlag(
    calendarOutput: { isLeapMonth: boolean; lunarDay: number },
    config: ResolvedZiweiConfig
  ): boolean {
    if (!calendarOutput.isLeapMonth) return false;
    if (config.leapMonth === 'baseMonth') return true;
    if (config.leapMonth === 'split15' && calendarOutput.lunarDay <= 15) return true;
    return false;
  }

  private getHourIndex(branch: EarthlyBranch): number {
    const branchToIndex: Record<EarthlyBranch, number> = {
      ty: 0,
      suu: 1,
      dan: 2,
      mao: 3,
      thin: 4,
      ti: 5,
      ngo: 6,
      mui: 7,
      than: 8,
      dau: 9,
      tuat: 10,
      hoi: 11,
    };
    return branchToIndex[branch];
  }

  private extractPalaces(astrolabe: IztroAstrolabe): Palace[] {
    return astrolabe.palaces.map((iztroPalace) => this.mapPalace(iztroPalace));
  }

  private mapPalace(iztroPalace: IztroPalace): Palace {
    const raw = iztroPalace.toJSON();
    const palaceId = this.mapPalaceId(raw.name);
    const branch = this.mapBranch(raw.earthlyBranch);
    const stem = this.mapStem(raw.heavenlyStem);

    return {
      index: raw.index,
      id: palaceId,
      name: PALACE_MAP[palaceId].name,
      stem,
      branch,
      element: this.getBranchElement(branch),
      isBodyPalace: raw.isBodyPalace,
      isOriginalPalace: raw.isOriginalPalace,
      majorStars: iztroPalace.majorStars.map((star) => this.mapStar(star, 'major')),
      auspiciousStars: iztroPalace.minorStars
        .filter((star) => this.mapStarCategory(star.type) !== 'lucSat')
        .map((star) => this.mapStar(star)),
      maleficStars: iztroPalace.minorStars
        .filter((star) => this.mapStarCategory(star.type) === 'lucSat')
        .map((star) => this.mapStar(star)),
      otherStars: iztroPalace.adjectiveStars.map((star) => this.mapStar(star)),
      changsheng12: raw.changsheng12,
      boshi12: raw.boshi12,
      suiqian12: raw.suiqian12,
      majorPeriod: {
        startAge: raw.decadal.range[0],
        endAge: raw.decadal.range[1],
      },
      minorPeriodAges: raw.ages,
      hasTuan: false,
      hasTriet: false,
      tuanTrietRole: { tuan: null, triet: null },
    };
  }

  private mapStar(iztroStar: IztroStar, overrideCategory?: Star['category']): Star {
    const data = iztroStar.toJSON();
    const category = overrideCategory ?? this.mapStarCategory(data.type);
    const majorStarId = category === 'major' ? this.mapMajorStarId(data.name) : null;
    const majorStarMeta = majorStarId ? MAJOR_STAR_MAP[majorStarId] : null;
    const mutagen = data.mutagen ? IZTRO_MUTAGEN_TO_TYPE[data.mutagen] : undefined;
    const mappedBrightness = data.brightness
      ? mapIztroBrightnessTo5Levels(data.brightness)
      : undefined;
    const brightness = mappedBrightness ?? undefined;
    const nature = majorStarMeta?.nature ?? this.getStarNature(category, mutagen);

    return {
      id: majorStarId ?? data.name,
      name: data.name,
      category,
      element:
        majorStarMeta?.element ??
        this.getStarElement(data.name, category, majorStarId ?? undefined),
      yinYang: majorStarMeta?.yinYang,
      nature,
      brightness,
      brightnessLabel: brightness ? this.getBrightnessLabel(brightness) : undefined,
      rawIztroBrightness: data.brightness,
      brightnessSource: brightness ? 'iztroMapped7To5' : 'none',
      mutagen,
    };
  }

  private mapStarCategory(type: IztroStar['type']): Star['category'] {
    switch (type) {
      case 'major':
        return 'major';
      case 'soft':
      case 'helper':
        return 'lucCat';
      case 'tough':
        return 'lucSat';
      case 'lucun':
      case 'tianma':
        return 'locMa';
      case 'adjective':
      case 'flower':
      default:
        return 'phuTinh';
    }
  }

  private mapMajorStarId(name: string): MajorStarId | null {
    return IZTRO_MAJOR_STAR_NAME_TO_ID[name] ?? null;
  }

  private getStarNature(category: Star['category'], mutagen?: Star['mutagen']): Star['nature'] {
    switch (category) {
      case 'lucCat':
      case 'trangSinh':
      case 'bacSi':
        return 'cat';
      case 'lucSat':
      case 'thaiTue':
        return 'hung';
      case 'tuHoa':
        return mutagen === 'hoaKy' ? 'hung' : 'cat';
      case 'locMa':
      case 'phuTinh':
      default:
        return 'trung';
    }
  }

  private getStarElement(
    name: string,
    category: Star['category'],
    majorStarId?: MajorStarId
  ): FiveElement {
    if (majorStarId) {
      return MAJOR_STAR_MAP[majorStarId].element;
    }
    return AUXILIARY_STAR_ELEMENT[name] ?? CATEGORY_FALLBACK_ELEMENT[category];
  }

  private getBrightnessLabel(
    level: NonNullable<Star['brightness']>
  ): NonNullable<Star['brightnessLabel']> {
    const labels: Record<NonNullable<Star['brightness']>, NonNullable<Star['brightnessLabel']>> = {
      mieu: 'M',
      vuong: 'V',
      dac: 'Đ',
      binh: 'B',
      ham: 'H',
    };
    return labels[level];
  }

  private getBranchElement(branch: EarthlyBranch): FiveElement {
    const data = EARTHLY_BRANCHES_DATA.find((item) => item.branch === branch);
    return data?.element ?? 'tho';
  }

  private mapPalaceId(name: string): PalaceId {
    return IZTRO_PALACE_NAME_TO_ID[name] ?? 'menh';
  }

  private mapBranch(iztroBranch: string): EarthlyBranch {
    return IZTRO_BRANCH_TO_EARTHLY[iztroBranch] ?? 'ty';
  }

  private mapStem(iztroStem: string): HeavenlyStem {
    return IZTRO_STEM_TO_HEAVENLY[iztroStem] ?? 'giap';
  }

  private parseFiveElementsClass(name: string): {
    name: string;
    element: FiveElement;
    number: 2 | 3 | 4 | 5 | 6;
  } {
    const elementMap: Readonly<Record<string, FiveElement>> = {
      Thủy: 'thuy',
      Mộc: 'moc',
      Kim: 'kim',
      Hỏa: 'hoa',
      Thổ: 'tho',
    };

    const numberMap: Readonly<Record<string, 2 | 3 | 4 | 5 | 6>> = {
      Nhị: 2,
      Tam: 3,
      Tứ: 4,
      Ngũ: 5,
      Lục: 6,
    };

    let element: FiveElement = 'thuy';
    for (const [key, value] of Object.entries(elementMap)) {
      if (name.includes(key)) {
        element = value;
        break;
      }
    }

    let number: 2 | 3 | 4 | 5 | 6 = 2;
    for (const [key, value] of Object.entries(numberMap)) {
      if (name.includes(key)) {
        number = value;
        break;
      }
    }

    return { name, element, number };
  }

  private extractPeriods(
    astrolabe: IztroAstrolabe,
    birthInfo: BirthInfo,
    timeIndex: number
  ): Period[] {
    const periods: Period[] = [];

    for (const iztroPalace of astrolabe.palaces) {
      const raw = iztroPalace.toJSON();
      const branch = this.mapBranch(raw.earthlyBranch);
      const stem = this.mapStem(raw.heavenlyStem);

      periods.push({
        type: 'daiHan',
        palaceBranch: branch,
        startAge: raw.decadal.range[0],
        endAge: raw.decadal.range[1],
        stem: this.mapStem(raw.decadal.heavenlyStem),
        branch: this.mapBranch(raw.decadal.earthlyBranch),
      });

      periods.push({
        type: 'tieuHan',
        palaceBranch: branch,
        nominalAges: raw.ages,
        stem,
        branch,
      });
    }

    if (birthInfo.viewingYear) {
      try {
        const horoscope = astrolabe.horoscope(`${birthInfo.viewingYear}-06-15`, timeIndex);
        periods.push({
          type: 'luuNien',
          palaceBranch: this.mapBranch(horoscope.yearly.earthlyBranch),
          solarYear: birthInfo.viewingYear,
          stem: this.mapStem(horoscope.yearly.heavenlyStem),
          branch: this.mapBranch(horoscope.yearly.earthlyBranch),
        });
      } catch {
        // Không thể tính lưu niên cho năm xem – bỏ qua để không làm hỏng toàn bộ lá số.
      }
    }

    return periods;
  }
}
