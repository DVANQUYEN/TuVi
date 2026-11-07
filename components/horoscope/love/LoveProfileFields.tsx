'use client';

import { useId, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getHourBranch } from '@/lib/ziwei/utils/can-chi';
import type { EarthlyBranch, VietnamRegion } from '@/lib/ziwei/types/enums';

/** Dữ liệu một mệnh chủ, giữ dạng chuỗi để validate và hiển thị chính xác. */
export interface LoveProfileValue {
  name: string;
  gender: '' | 'nam' | 'nu';
  calendarType: 'solar' | 'lunar';
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  region: VietnamRegion;
}

export type LoveProfileField = keyof LoveProfileValue;
export type LoveProfileErrors = Partial<Record<LoveProfileField, string>>;

export interface LoveProfileFieldsProps {
  /** Tiền tố id duy nhất cho mỗi instance (hai người dùng hai tiền tố khác nhau). */
  idPrefix?: string;
  legend: string;
  value: LoveProfileValue;
  onChange: (patch: Partial<LoveProfileValue>) => void;
  errors?: LoveProfileErrors;
}

const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const HOURS = Array.from({ length: 24 }, (_, index) => index);

const HOUR_BRANCH_LABELS: Record<EarthlyBranch, string> = {
  ty: 'Tý',
  suu: 'Sửu',
  dan: 'Dần',
  mao: 'Mão',
  thin: 'Thìn',
  ti: 'Tỵ',
  ngo: 'Ngọ',
  mui: 'Mùi',
  than: 'Thân',
  dau: 'Dậu',
  tuat: 'Tuất',
  hoi: 'Hợi',
};

function FieldError({ id, message }: { id: string; message?: string }): React.ReactElement | null {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-red-400">
      {message}
    </p>
  );
}

/**
 * Hai cột thông tin mệnh chủ độc lập, dùng `useId`/tiền tố để có thể render đồng thời
 * mà không trùng id. Không tự mặc định giới tính hay giờ sinh.
 */
export function LoveProfileFields({
  idPrefix,
  legend,
  value,
  onChange,
  errors,
}: LoveProfileFieldsProps): React.ReactElement {
  const generatedId = useId();
  const prefix = idPrefix ?? `love-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const advancedId = `${prefix}-advanced`;
  const fieldId = (field: LoveProfileField): string => `${prefix}-${field}`;
  const errorId = (field: LoveProfileField): string => `${prefix}-${field}-error`;

  return (
    <fieldset className="min-w-0 space-y-4">
      <legend className="w-full border-b border-border-subtle/70 pb-2 font-serif text-xl font-semibold text-gold">
        {legend}
      </legend>

      <div>
        <label htmlFor={fieldId('name')} className="mb-1 block text-xs text-muted">
          Họ tên <span className="text-gold">*</span>
          <span className="ml-1 text-[11px] font-normal text-muted/80">Bắt buộc</span>
        </label>
        <Input
          id={fieldId('name')}
          type="text"
          className="scroll-mt-24"
          value={value.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="Nhập họ tên"
          required
          aria-required="true"
          maxLength={120}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={errors?.name ? errorId('name') : undefined}
        />
        <FieldError id={errorId('name')} message={errors?.name} />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold/80">
          Ngày sinh ({value.calendarType === 'solar' ? 'dương lịch' : 'âm lịch'})
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <div>
            <label htmlFor={fieldId('day')} className="mb-1 block text-xs text-muted">
              Ngày <span className="text-gold">*</span>
            </label>
            <Select
              id={fieldId('day')}
              className="scroll-mt-24"
              value={value.day}
              onChange={(event) => onChange({ day: event.target.value })}
              required
              error={Boolean(errors?.day)}
              aria-invalid={Boolean(errors?.day)}
              aria-describedby={errors?.day ? errorId('day') : undefined}
            >
              <option value="">Ngày</option>
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </Select>
            <FieldError id={errorId('day')} message={errors?.day} />
          </div>

          <div>
            <label htmlFor={fieldId('month')} className="mb-1 block text-xs text-muted">
              Tháng <span className="text-gold">*</span>
            </label>
            <Select
              id={fieldId('month')}
              className="scroll-mt-24"
              value={value.month}
              onChange={(event) => onChange({ month: event.target.value })}
              required
              error={Boolean(errors?.month)}
              aria-invalid={Boolean(errors?.month)}
              aria-describedby={errors?.month ? errorId('month') : undefined}
            >
              <option value="">Tháng</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
            <FieldError id={errorId('month')} message={errors?.month} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label htmlFor={fieldId('year')} className="mb-1 block text-xs text-muted">
              Năm <span className="text-gold">*</span>
            </label>
            <Input
              id={fieldId('year')}
              type="text"
              inputMode="numeric"
              autoComplete="bday-year"
              className="scroll-mt-24"
              value={value.year}
              onChange={(event) =>
                onChange({ year: event.target.value.replace(/\D/g, '').slice(0, 4) })
              }
              placeholder="VD: 1990"
              required
              maxLength={4}
              error={Boolean(errors?.year)}
              aria-invalid={Boolean(errors?.year)}
              aria-describedby={errors?.year ? errorId('year') : undefined}
            />
            <FieldError id={errorId('year')} message={errors?.year} />
          </div>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <div>
          <label htmlFor={fieldId('gender')} className="mb-1 block text-xs text-muted">
            Giới tính <span className="text-gold">*</span>
          </label>
          <Select
            id={fieldId('gender')}
            className="scroll-mt-24"
            value={value.gender}
            onChange={(event) =>
              onChange({ gender: event.target.value as LoveProfileValue['gender'] })
            }
            required
            error={Boolean(errors?.gender)}
            aria-invalid={Boolean(errors?.gender)}
            aria-describedby={errors?.gender ? errorId('gender') : undefined}
          >
            <option value="">Chọn giới tính</option>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </Select>
          <FieldError id={errorId('gender')} message={errors?.gender} />
        </div>

        <div>
          <label htmlFor={fieldId('calendarType')} className="mb-1 block text-xs text-muted">
            Loại lịch
          </label>
          <Select
            id={fieldId('calendarType')}
            className="scroll-mt-24"
            value={value.calendarType}
            onChange={(event) =>
              onChange({ calendarType: event.target.value as LoveProfileValue['calendarType'] })
            }
          >
            <option value="solar">Dương lịch</option>
            <option value="lunar">Âm lịch</option>
          </Select>
          <FieldError id={errorId('calendarType')} message={errors?.calendarType} />
        </div>

        <div>
          <label htmlFor={fieldId('hour')} className="mb-1 block text-xs text-muted">
            Giờ sinh <span className="text-gold">*</span>
          </label>
          <Select
            id={fieldId('hour')}
            className="scroll-mt-24"
            value={value.hour}
            onChange={(event) => onChange({ hour: event.target.value })}
            required
            error={Boolean(errors?.hour)}
            aria-invalid={Boolean(errors?.hour)}
            aria-describedby={errors?.hour ? errorId('hour') : undefined}
          >
            <option value="">Chọn giờ</option>
            {HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {String(hour).padStart(2, '0')}:00 · {HOUR_BRANCH_LABELS[getHourBranch(hour)]}
              </option>
            ))}
          </Select>
          <FieldError id={errorId('hour')} message={errors?.hour} />
        </div>

        <div>
          <label htmlFor={fieldId('minute')} className="mb-1 block text-xs text-muted">
            Phút sinh
          </label>
          <Input
            id={fieldId('minute')}
            type="number"
            inputMode="numeric"
            className="scroll-mt-24"
            min={0}
            max={59}
            step={1}
            value={value.minute}
            onChange={(event) => onChange({ minute: event.target.value })}
            placeholder="0"
            error={Boolean(errors?.minute)}
            aria-invalid={Boolean(errors?.minute)}
            aria-describedby={errors?.minute ? errorId('minute') : undefined}
          />
          <FieldError id={errorId('minute')} message={errors?.minute} />
        </div>
      </div>

      <AdvancedRegion
        id={advancedId}
        value={value.region}
        onChange={(region) => onChange({ region })}
      />
    </fieldset>
  );
}

function AdvancedRegion({
  id,
  value,
  onChange,
}: {
  id: string;
  value: VietnamRegion;
  onChange: (region: VietnamRegion) => void;
}): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        className="flex items-center gap-2 text-xs font-medium text-gold/90 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
        <span>Tùy chọn nâng cao</span>
      </button>

      {isOpen && (
        <div
          id={id}
          className="mt-2 rounded-md border border-border-subtle/60 bg-background/40 p-3"
        >
          <label htmlFor={`${id}-region`} className="mb-1 block text-xs text-muted">
            Nơi sinh (vùng miền)
          </label>
          <Select
            id={`${id}-region`}
            value={value}
            onChange={(event) => onChange(event.target.value as VietnamRegion)}
          >
            <option value="north">Miền Bắc (Hà Nội, UTC+7)</option>
            <option value="south">Miền Nam (TP.HCM, UTC+7)</option>
          </Select>
          <p className="mt-1 text-[11px] text-muted">
            Mặc định Hà Nội nếu không đổi, dùng khi cần hiệu chỉnh giờ theo khu vực.
          </p>
        </div>
      )}
    </div>
  );
}
