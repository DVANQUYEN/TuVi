import type { PalaceId, BrightnessLevel, MajorStarId } from '../../../types/enums';
import type { MajorStarMeaningContent } from '../../types';

/**
 * Kiểu mẫu cốt lõi của một chính tinh.
 */
export interface StarArchetype {
  /** Ý nghĩa cốt lõi. */
  coreMeaning: string;
  /** Ảnh hưởng sự nghiệp. */
  career: string;
  /** Ảnh hưởng tình cảm. */
  love: string;
  /** Ảnh hưởng sức khỏe. */
  health: string;
  /** Lời khuyên. */
  advice: string;
  /** Nội dung chi tiết theo từng độ sáng; nếu có sẽ được ưu tiên sử dụng. */
  brightnessMeanings?: Partial<Record<BrightnessLevel, MajorStarMeaningContent>>;
}

/**
 * Ngữ cảnh của cung đặt sao.
 */
export interface PalaceContext {
  /** Mã cung. */
  palaceId: PalaceId;
  /** Mô tả ngữ cảnh. */
  context: string;
}

/**
 * Hiệu chỉnh theo mức độ sáng.
 */
export interface BrightnessModifier {
  /** Mức độ sáng. */
  level: BrightnessLevel;
  /** Hệ số hiệu chỉnh từ -0.5 đến +0.5. */
  modifier: number;
  /** Mô tả hiệu chỉnh. */
  description: string;
}

/**
 * Xây dựng bảng nghĩa 60 ô (12 cung × 5 độ sáng) cho một chính tinh.
 *
 * @param starId - Mã chính tinh.
 * @param archetype - Kiểu mẫu cốt lõi.
 * @param palaceContexts - Danh sách ngữ cảnh 12 cung.
 * @param brightnessModifiers - Danh sách hiệu chỉnh 5 độ sáng.
 * @returns Bảng nghĩa theo cung và độ sáng.
 */
export function buildMajorStarMeanings(
  starId: MajorStarId,
  archetype: StarArchetype,
  palaceContexts: PalaceContext[],
  brightnessModifiers: BrightnessModifier[]
): Record<PalaceId, Record<BrightnessLevel, MajorStarMeaningContent>> {
  const result = {} as Record<PalaceId, Record<BrightnessLevel, MajorStarMeaningContent>>;

  for (const palace of palaceContexts) {
    result[palace.palaceId] = {} as Record<BrightnessLevel, MajorStarMeaningContent>;

    for (const brightness of brightnessModifiers) {
      result[palace.palaceId][brightness.level] = combineMeaning(
        starId,
        archetype,
        palace,
        brightness
      );
    }
  }

  return result;
}

/**
 * Kết hợp kiểu mẫu, ngữ cảnh cung và độ sáng thành nội dung luận giải.
 */
function combineMeaning(
  starId: MajorStarId,
  archetype: StarArchetype,
  palace: PalaceContext,
  brightness: BrightnessModifier
): MajorStarMeaningContent {
  const detail = archetype.brightnessMeanings?.[brightness.level];

  if (detail) {
    return {
      meaning: `${palace.context}. ${detail.meaning}`,
      career: detail.career,
      love: detail.love,
      health: detail.health,
      advice: detail.advice,
    };
  }

  const tendency = brightness.modifier > 0 ? 'tích cực' : 'tiêu cực';
  const careerTone = brightness.modifier > 0 ? 'thuận lợi' : 'thách thức';
  const loveTone = brightness.modifier > 0 ? 'tốt đẹp' : 'cần lưu ý';
  const healthTone = brightness.modifier > 0 ? 'tốt' : 'cần chú ý';
  const adviceTone = brightness.modifier > 0 ? 'phát huy' : 'hóa giải';

  return {
    meaning: `${archetype.coreMeaning}. ${palace.context}. ${brightness.description} (mức độ: ${tendency}).`,
    career: `${archetype.career}; tại cung này sự nghiệp ${careerTone}.`,
    love: `${archetype.love}; tình cảm ${loveTone}.`,
    health: `${archetype.health}; sức khỏe ${healthTone}.`,
    advice: `${archetype.advice}; nên ${adviceTone} trong hoàn cảnh hiện tại.`,
  };
}

/**
 * Các hiệu chỉnh độ sáng mặc định theo Tân Biên 1956.
 */
export const DEFAULT_BRIGHTNESS_MODIFIERS: BrightnessModifier[] = [
  { level: 'mieu', modifier: 0.5, description: 'Miếu địa, phát huy tối đa' },
  { level: 'vuong', modifier: 0.3, description: 'Vượng địa, rất tốt' },
  { level: 'dac', modifier: 0.1, description: 'Đắc địa, tốt' },
  { level: 'binh', modifier: 0, description: 'Bình hòa, trung bình' },
  { level: 'ham', modifier: -0.3, description: 'Hãm địa, giảm sút' },
];

/**
 * Ngữ cảnh 12 cung mặc định để áp dụng cho chính tinh.
 */
export const DEFAULT_PALACE_CONTEXTS: PalaceContext[] = [
  {
    palaceId: 'menh',
    context: 'Tại Mệnh, chủ về bản lĩnh, khí chất và vận mệnh đời đời của người',
  },
  { palaceId: 'phuMau', context: 'Tại Phụ Mẫu, ảnh hưởng đến cha mẹ và gia đình' },
  { palaceId: 'phucDuc', context: 'Tại Phúc Đức, liên quan đến phúc khí và dòng họ' },
  { palaceId: 'dienTrach', context: 'Tại Điền Trạch, tác động đến nhà cửa và bất động sản' },
  { palaceId: 'quanLoc', context: 'Tại Quan Lộc, định hình sự nghiệp và địa vị xã hội' },
  { palaceId: 'noBoc', context: 'Tại Nô Bộc, phản ánh bạn bè và người hầu cận' },
  { palaceId: 'thienDi', context: 'Tại Thiên Di, chủ về di chuyển và xuất ngoại' },
  { palaceId: 'tatAch', context: 'Tại Tật Ách, liên quan đến bệnh tật và tai họa' },
  { palaceId: 'taiBach', context: 'Tại Tài Bạch, quản lý tài lộc và của cải' },
  { palaceId: 'tuTuc', context: 'Tại Tử Tức, ảnh hưởng đến con cái và đời đằng sau' },
  { palaceId: 'phuThe', context: 'Tại Phu Thê, định hình hôn nhân và đối tác' },
  { palaceId: 'huynhDe', context: 'Tại Huynh Đệ, phản ánh anh chị em và quan hệ đồng lứa' },
];
