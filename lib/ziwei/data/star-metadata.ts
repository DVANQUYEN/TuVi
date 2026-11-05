import type { FiveElement, MajorStarId } from '../types/enums';

/** Metadata mô tả một chính tinh. */
export interface StarMetadata {
  /** Mã chính tinh. */
  id: MajorStarId;
  /** Tên tiếng Việt. */
  name: string;
  /** Ngũ hành. */
  element: FiveElement;
  /** Âm Dương. */
  yinYang: 'am' | 'duong';
  /** Tính chất: Cát, Hung hoặc Trung. */
  nature: 'cat' | 'hung' | 'trung';
  /** Luôn là `true` vì đây là chính tinh. */
  isMajorStar: true;
}

/**
 * Metadata 14 Chính Tinh.
 */
export const MAJOR_STAR_METADATA: readonly StarMetadata[] = [
  { id: 'tuVi', name: 'Tử Vi', element: 'tho', yinYang: 'duong', nature: 'cat', isMajorStar: true },
  {
    id: 'thienCo',
    name: 'Thiên Cơ',
    element: 'moc',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thaiDuong',
    name: 'Thái Dương',
    element: 'hoa',
    yinYang: 'duong',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'vuKhuc',
    name: 'Vũ Khúc',
    element: 'kim',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thienDong',
    name: 'Thiên Đồng',
    element: 'thuy',
    yinYang: 'duong',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'liemTrinh',
    name: 'Liêm Trinh',
    element: 'hoa',
    yinYang: 'am',
    nature: 'hung',
    isMajorStar: true,
  },
  {
    id: 'thienPhu',
    name: 'Thiên Phủ',
    element: 'tho',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thaiAm',
    name: 'Thái Âm',
    element: 'thuy',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thamLang',
    name: 'Tham Lang',
    element: 'moc',
    yinYang: 'duong',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'cuMon',
    name: 'Cự Môn',
    element: 'thuy',
    yinYang: 'am',
    nature: 'hung',
    isMajorStar: true,
  },
  {
    id: 'thienTuong',
    name: 'Thiên Tướng',
    element: 'thuy',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thienLuong',
    name: 'Thiên Lương',
    element: 'tho',
    yinYang: 'am',
    nature: 'cat',
    isMajorStar: true,
  },
  {
    id: 'thatSat',
    name: 'Thất Sát',
    element: 'kim',
    yinYang: 'duong',
    nature: 'hung',
    isMajorStar: true,
  },
  {
    id: 'phaQuan',
    name: 'Phá Quân',
    element: 'thuy',
    yinYang: 'duong',
    nature: 'hung',
    isMajorStar: true,
  },
] as const;

/**
 * Map từ MajorStarId sang StarMetadata để tra cứu nhanh.
 */
export const MAJOR_STAR_MAP: Readonly<Record<MajorStarId, StarMetadata>> = Object.fromEntries(
  MAJOR_STAR_METADATA.map((star) => [star.id, star])
) as Record<MajorStarId, StarMetadata>;
