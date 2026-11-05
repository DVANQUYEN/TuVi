import type { PalaceId } from '../types/enums';

/** Metadata mô tả một cung chức năng. */
export interface PalaceMetadata {
  /** Mã cung. */
  id: PalaceId;
  /** Tên tiếng Việt. */
  name: string;
  /** Tên hiển thị đầy đủ (có thể thêm "Cung"). */
  displayName: string;
  /** Mô tả ngắn về ý nghĩa cung. */
  description: string;
}

/**
 * Metadata 12 Cung chức năng.
 */
export const PALACE_METADATA: readonly PalaceMetadata[] = [
  {
    id: 'menh',
    name: 'Mệnh',
    displayName: 'Cung Mệnh',
    description: 'Bản mệnh, tính cách, vận mệnh',
  },
  {
    id: 'phuMau',
    name: 'Phụ Mẫu',
    displayName: 'Cung Phụ Mẫu',
    description: 'Cha mẹ, gia đình nội ngoại',
  },
  {
    id: 'phucDuc',
    name: 'Phúc Đức',
    displayName: 'Cung Phúc Đức',
    description: 'Phúc đức, họ hàng, tâm linh',
  },
  {
    id: 'dienTrach',
    name: 'Điền Trạch',
    displayName: 'Cung Điền Trạch',
    description: 'Nhà cửa, đất đai, bất động sản',
  },
  {
    id: 'quanLoc',
    name: 'Quan Lộc',
    displayName: 'Cung Quan Lộc',
    description: 'Sự nghiệp, công danh, chức vụ',
  },
  {
    id: 'noBoc',
    name: 'Nô Bộc',
    displayName: 'Cung Nô Bộc',
    description: 'Bạn bè, đồng nghiệp, quan hệ xã hội',
  },
  {
    id: 'thienDi',
    name: 'Thiên Di',
    displayName: 'Cung Thiên Di',
    description: 'Di chuyển, xuất ngoại, ra ngoài',
  },
  {
    id: 'tatAch',
    name: 'Tật Ách',
    displayName: 'Cung Tật Ách',
    description: 'Bệnh tật, tai nạn, sức khỏe',
  },
  {
    id: 'taiBach',
    name: 'Tài Bạch',
    displayName: 'Cung Tài Bạch',
    description: 'Tiền bạc, tài sản, thu nhập',
  },
  {
    id: 'tuTuc',
    name: 'Tử Tức',
    displayName: 'Cung Tử Tức',
    description: 'Con cái, sinh sản, hậu duệ',
  },
  {
    id: 'phuThe',
    name: 'Phu Thê',
    displayName: 'Cung Phu Thê',
    description: 'Vợ chồng, hôn nhân, tình cảm',
  },
  {
    id: 'huynhDe',
    name: 'Huynh Đệ',
    displayName: 'Cung Huynh Đệ',
    description: 'Anh chị em, anh em ruột',
  },
] as const;

/**
 * Map từ PalaceId sang PalaceMetadata để tra cứu nhanh.
 */
export const PALACE_MAP: Readonly<Record<PalaceId, PalaceMetadata>> = Object.fromEntries(
  PALACE_METADATA.map((palace) => [palace.id, palace])
) as Record<PalaceId, PalaceMetadata>;
