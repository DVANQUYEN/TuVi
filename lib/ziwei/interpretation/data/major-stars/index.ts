import { TU_VI_MEANINGS } from './tu-vi';
import { THIEN_CO_MEANINGS } from './thien-co';
import { THAI_DUONG_MEANINGS } from './thai-duong';
import { VU_KHUC_MEANINGS } from './vu-khuc';
import { THIEN_DONG_MEANINGS } from './thien-dong';
import { LIEM_TRINH_MEANINGS } from './liem-trinh';
import { THIEN_PHU_MEANINGS } from './thien-phu';
import { THAI_AM_MEANINGS } from './thai-am';
import { THAM_LANG_MEANINGS } from './tham-lang';
import { CU_MON_MEANINGS } from './cu-mon';
import { THIEN_TUONG_MEANINGS } from './thien-tuong';
import { THIEN_LUONG_MEANINGS } from './thien-luong';
import { THAT_SAT_MEANINGS } from './that-sat';
import { PHA_QUAN_MEANINGS } from './pha-quan';
import type { PalaceId, BrightnessLevel, MajorStarId } from '../../../types/enums';
import type { MajorStarMeaningContent } from '../../types';

/**
 * Bảng nghĩa tất cả 14 chính tinh.
 */
export const MAJOR_STAR_MEANINGS: Record<
  MajorStarId,
  Record<PalaceId, Record<BrightnessLevel, MajorStarMeaningContent>>
> = {
  tuVi: TU_VI_MEANINGS,
  thienCo: THIEN_CO_MEANINGS,
  thaiDuong: THAI_DUONG_MEANINGS,
  vuKhuc: VU_KHUC_MEANINGS,
  thienDong: THIEN_DONG_MEANINGS,
  liemTrinh: LIEM_TRINH_MEANINGS,
  thienPhu: THIEN_PHU_MEANINGS,
  thaiAm: THAI_AM_MEANINGS,
  thamLang: THAM_LANG_MEANINGS,
  cuMon: CU_MON_MEANINGS,
  thienTuong: THIEN_TUONG_MEANINGS,
  thienLuong: THIEN_LUONG_MEANINGS,
  thatSat: THAT_SAT_MEANINGS,
  phaQuan: PHA_QUAN_MEANINGS,
};

export * from './base-builder';
