import type { ResolvedZiweiConfig } from './config';

/** Ghi chép về việc hiệu chỉnh thờ gian (múi giờ lịch sử / giờ mặt trờ thật). */
export interface TimeAdjustmentAudit {
  originalTime: string;
  adjustedTime: string;
  deltaMinutes: number;
  reason: string;
}

/** Ghi chép về quá trình chuyển đổi lịch Dương - Âm. */
export interface CalendarResolutionAudit {
  solarDate: string;
  lunarDate: string;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  solarToLunarDiffWithChina: boolean;
  leapMonthResolution: string;
  historicalTimezoneApplied: boolean;
}

/** Một bước trong audit trail của engine. */
export interface AuditStep {
  step: string;
  input: unknown;
  output: unknown;
  timestamp: number;
  duration?: number;
}

/** Audit trail đầy đủ, dùng để truy vết và debug. */
export interface AuditTrail {
  engineVersion: string;
  configApplied: ResolvedZiweiConfig;
  steps: AuditStep[];
  timeAdjustments: TimeAdjustmentAudit[];
  calendarResolution: CalendarResolutionAudit;
  totalDuration: number;
}

/** Cảnh báo hoặc thông tin cho ngườ dùng về các trường hợp đặc biệt. */
export interface ChartWarning {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  context?: Record<string, unknown>;
}
