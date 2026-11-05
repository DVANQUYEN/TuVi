/** Mã lỗi có thể xảy ra trong engine Tử Vi. */
export type ZiweiErrorCode =
  | 'INVALID_BIRTH_INFO'
  | 'INVALID_DATE_RANGE'
  | 'INVALID_CONFIG'
  | 'CALENDAR_CONVERSION_FAILED'
  | 'ENGINE_NOT_SUPPORTED'
  | 'MISSING_DATA';

/** Chi tiết bổ sung cho lỗi engine. */
export interface ZiweiErrorDetails {
  field?: string;
  value?: unknown;
  expected?: string;
}

/** Lớp lỗi tùy chỉnh của engine Tử Vi. */
export class ZiweiError extends Error {
  constructor(
    public code: ZiweiErrorCode,
    message: string,
    public details?: ZiweiErrorDetails
  ) {
    super(message);
    this.name = 'ZiweiError';
  }
}
