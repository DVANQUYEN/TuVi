'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { BirthInfo, UserPreferences } from '@/lib/ziwei/types';
import type {
  SchoolType,
  LeapMonthRule,
  YearBoundaryRule,
  TuanTrietPrimaryRule,
} from '@/lib/ziwei/types/config';
import type { VietnamRegion } from '@/lib/ziwei/types/enums';
import { UserPreferencesSchema } from '@/lib/ziwei/config/schema';
import { defaultZiweiConfig } from '@/lib/ziwei/config/default-config';
import { DEFAULT_LOCATION } from '@/lib/ziwei/data';

export interface BirthFormProps {
  onSubmit: (birthInfo: BirthInfo, preferences?: UserPreferences) => void;
  defaultValues?: Partial<BirthInfo>;
  defaultPreferences?: UserPreferences;
  submitDisabled?: boolean;
}

export function BirthForm({
  onSubmit,
  defaultValues,
  defaultPreferences,
  submitDisabled,
}: BirthFormProps): React.ReactElement {
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [gender, setGender] = useState<'nam' | 'nu' | ''>(defaultValues?.gender ?? '');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>(
    defaultValues?.calendarType ?? 'solar'
  );
  const [day, setDay] = useState(defaultValues?.day?.toString() ?? '');
  const [month, setMonth] = useState(defaultValues?.month?.toString() ?? '');
  const [year, setYear] = useState(defaultValues?.year?.toString() ?? '');
  const [hour, setHour] = useState(defaultValues?.hour?.toString() ?? '');
  const [minute, setMinute] = useState(defaultValues?.minute?.toString() ?? '0');
  const [region, setRegion] = useState<VietnamRegion>(defaultValues?.location?.region ?? 'north');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences ?? {});
  const [error, setError] = useState<string | null>(null);

  const handleRegionChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRegion(event.target.value as VietnamRegion);
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (submitDisabled) return;
    setError(null);

    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    const hourNum = Number(hour);
    const minuteNum = Number(minute);

    if (!gender) {
      setError('Vui lòng chọn giới tính.');
      return;
    }
    if (!day || !month || !year || !hour) {
      setError('Vui lòng nhập đầy đủ ngày, tháng, năm và giờ sinh.');
      return;
    }
    if (yearNum < 1900 || yearNum > 2099) {
      setError('Năm sinh phải từ 1900 đến 2099.');
      return;
    }
    if (monthNum < 1 || monthNum > 12) {
      setError('Tháng sinh không hợp lệ.');
      return;
    }
    if (dayNum < 1 || dayNum > 31) {
      setError('Ngày sinh không hợp lệ.');
      return;
    }
    if (hourNum < 0 || hourNum > 23) {
      setError('Giờ sinh không hợp lệ.');
      return;
    }
    if (minuteNum < 0 || minuteNum > 59) {
      setError('Phút sinh không hợp lệ.');
      return;
    }

    const birthInfo: BirthInfo = {
      name: name.trim() || undefined,
      gender,
      calendarType,
      year: yearNum,
      month: monthNum,
      day: dayNum,
      hour: hourNum,
      minute: minuteNum,
      location: DEFAULT_LOCATION[region],
    };

    // Validate preferences if any options have been customized
    let validatedPreferences: UserPreferences | undefined;
    const hasPreferences = Object.keys(preferences).length > 0;
    if (hasPreferences) {
      try {
        validatedPreferences = UserPreferencesSchema.parse(preferences);
      } catch {
        setError('Tùy chọn nâng cao không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }
    }

    if (validatedPreferences) {
      onSubmit(birthInfo, validatedPreferences);
    } else {
      onSubmit(birthInfo);
    }
  };

  const hourNum = Number(hour);
  const isTyHour = hour !== '' && (hourNum === 23 || hourNum === 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div>
        <label htmlFor="chart-name" className="mb-1 block text-sm font-medium text-foreground">
          Họ tên
        </label>
        <Input
          id="chart-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập họ tên đương số"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="chart-gender" className="mb-1 block text-sm font-medium text-foreground">
            Giới tính <span className="text-gold">*</span>
          </label>
          <Select
            id="chart-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as 'nam' | 'nu')}
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="nam">Nam</option>
            <option value="nu">Nữ</option>
          </Select>
        </div>

        <div>
          <label
            htmlFor="chart-calendar"
            className="mb-1 block text-sm font-medium text-foreground"
          >
            Loại lịch
          </label>
          <Select
            id="chart-calendar"
            value={calendarType}
            onChange={(e) => setCalendarType(e.target.value as 'solar' | 'lunar')}
          >
            <option value="solar">Dương lịch</option>
            <option value="lunar">Âm lịch</option>
          </Select>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium text-foreground">
          Ngày sinh ({calendarType === 'solar' ? 'dương lịch' : 'âm lịch'}){' '}
          <span className="text-gold">*</span>
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <div>
            <label htmlFor="chart-day" className="sr-only">
              Ngày
            </label>
            <Input
              id="chart-day"
              type="number"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Ngày"
              required
            />
          </div>
          <div>
            <label htmlFor="chart-month" className="sr-only">
              Tháng
            </label>
            <Input
              id="chart-month"
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="Tháng"
              required
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="chart-year" className="sr-only">
              Năm
            </label>
            <Input
              id="chart-year"
              type="number"
              min={1900}
              max={2099}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Năm"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="chart-hour" className="mb-1 block text-sm font-medium text-foreground">
              Giờ sinh <span className="text-gold">*</span>
            </label>
            <Input
              id="chart-hour"
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="0 - 23"
              required
            />
          </div>

          <div>
            <label
              htmlFor="chart-minute"
              className="mb-1 block text-sm font-medium text-foreground"
            >
              Phút sinh
            </label>
            <Input
              id="chart-minute"
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {isTyHour && (
          <fieldset className="rounded bg-surface p-3">
            <legend className="mb-2 block text-sm font-medium text-foreground">
              Giờ Tý (23:00-01:00): Chọn quy tắc
            </legend>
            <div className="space-y-2">
              <label className="flex items-center text-sm text-foreground">
                <input
                  type="radio"
                  name="dayBoundary"
                  value="23:00"
                  checked={
                    preferences.dayBoundary === '23:00' ||
                    (!preferences.dayBoundary && defaultZiweiConfig.dayBoundary.default === '23:00')
                  }
                  onChange={() => updatePreference('dayBoundary', '23:00')}
                  className="h-4 w-4 accent-gold"
                />
                <span className="ml-2">23:00 tính sang ngày hôm sau (mặc định)</span>
              </label>
              <label className="flex items-center text-sm text-foreground">
                <input
                  type="radio"
                  name="dayBoundary"
                  value="00:00"
                  checked={
                    preferences.dayBoundary === '00:00' ||
                    (!preferences.dayBoundary && defaultZiweiConfig.dayBoundary.default === '00:00')
                  }
                  onChange={() => updatePreference('dayBoundary', '00:00')}
                  className="h-4 w-4 accent-gold"
                />
                <span className="ml-2">00:00 mới sang ngày mới</span>
              </label>
            </div>
          </fieldset>
        )}
      </div>

      <div>
        <label htmlFor="chart-region" className="mb-1 block text-sm font-medium text-foreground">
          Nơi sinh (vùng miền)
        </label>
        <Select id="chart-region" value={region} onChange={handleRegionChange}>
          <option value="north">Miền Bắc (Hà Nội, UTC+7)</option>
          <option value="south">Miền Nam (TP.HCM, UTC+7)</option>
        </Select>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
          className="flex items-center gap-2 text-gold transition-colors hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span aria-hidden="true">{showAdvanced ? '▼' : '▶'}</span>
          <span>Tùy chọn nâng cao</span>
        </button>

        {showAdvanced && (
          <div
            id="advanced-options"
            className="mt-4 space-y-4 rounded bg-surface p-4"
            aria-labelledby="advanced-options-label"
          >
            <h3 id="advanced-options-label" className="sr-only">
              Tùy chọn nâng cao
            </h3>

            <div>
              <label
                htmlFor="chart-school"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Trường phái
              </label>
              <Select
                id="chart-school"
                value={preferences.school ?? defaultZiweiConfig.school.default}
                onChange={(e) => updatePreference('school', e.target.value as SchoolType)}
              >
                <option value="namPhai">Nam phái (mặc định)</option>
                <option value="trungChau">Trung Châu</option>
                <option value="bacPhai">Bắc phái</option>
              </Select>
            </div>

            <div>
              <label
                htmlFor="chart-leap-month"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Quy tắc tháng nhuận
              </label>
              <Select
                id="chart-leap-month"
                value={preferences.leapMonth ?? defaultZiweiConfig.leapMonth.default}
                onChange={(e) => updatePreference('leapMonth', e.target.value as LeapMonthRule)}
              >
                <option value="split15">Chia đôi 15/15 (mặc định)</option>
                <option value="baseMonth">Cả tháng thuộc tháng gốc</option>
                <option value="nextMonth">Cả tháng thuộc tháng sau</option>
              </Select>
            </div>

            <div>
              <label
                htmlFor="chart-year-boundary"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Năm Can Chi đổi khi
              </label>
              <Select
                id="chart-year-boundary"
                value={preferences.yearBoundary ?? defaultZiweiConfig.yearBoundary.default}
                onChange={(e) =>
                  updatePreference('yearBoundary', e.target.value as YearBoundaryRule)
                }
              >
                <option value="tet">Mùng 1 Tết (mặc định)</option>
                <option value="lapXuan">Tiết Lập Xuân</option>
              </Select>
            </div>

            <div>
              <label
                htmlFor="chart-tuan-triet"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Tuần/Triệt
              </label>
              <Select
                id="chart-tuan-triet"
                value={preferences.tuanTrietPrimary ?? defaultZiweiConfig.tuanTriet.primary}
                onChange={(e) =>
                  updatePreference('tuanTrietPrimary', e.target.value as TuanTrietPrimaryRule)
                }
              >
                <option value="none">Không phân biệt chính/phó (mặc định)</option>
                <option value="first">Cung đầu là chính</option>
                <option value="nearMenh">Cung gần Mệnh là chính</option>
              </Select>
            </div>

            <div>
              <label className="flex items-center text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={preferences.useTrueSolarTime ?? defaultZiweiConfig.trueSolarTime.default}
                  onChange={(e) => updatePreference('useTrueSolarTime', e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <span className="ml-2">Hiệu chỉnh giờ mặt trời thật</span>
              </label>
              <p className="mt-1 text-xs text-muted">
                Áp dụng hiệu chỉnh theo kinh độ nơi sinh và phương trình thời gian
              </p>
            </div>

            <div>
              <label className="flex items-center text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={preferences.applyHistoricalTimezone ?? true}
                  onChange={(e) => updatePreference('applyHistoricalTimezone', e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <span className="ml-2">Áp dụng múi giờ lịch sử Việt Nam</span>
              </label>
              <p className="mt-1 text-xs text-muted">
                Tự động điều chỉnh múi giờ theo giai đoạn lịch sử (trước 1975)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={submitDisabled}>
        Lập lá số
      </Button>
    </form>
  );
}
