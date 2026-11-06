import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { User } from '@supabase/supabase-js';
import { LapLaSoClient } from '@/app/lap-la-so/LapLaSoClient';
import { SaveChartButton } from '@/components/storage/SaveChartButton';
import { SavedChartsList } from '@/components/storage/SavedChartsList';
import type { SavedChart } from '@/lib/utils/storage';
import type { ZiweiChart } from '@/lib/ziwei/types';

const {
  authMock,
  deleteChartMock,
  getCurrentChartMock,
  getOwnedLocalSavedChartByIdMock,
  getSavedChartByIdMock,
  getSavedChartsMock,
  migrateMock,
  saveChartMock,
  saveChartToSupabaseMock,
  saveCurrentChartMock,
  saveLocalChartMock,
} = vi.hoisted(() => ({
  authMock: vi.fn(),
  deleteChartMock: vi.fn(),
  getCurrentChartMock: vi.fn(),
  getOwnedLocalSavedChartByIdMock: vi.fn(),
  getSavedChartByIdMock: vi.fn(),
  getSavedChartsMock: vi.fn(),
  migrateMock: vi.fn(),
  saveChartMock: vi.fn(),
  saveChartToSupabaseMock: vi.fn(),
  saveCurrentChartMock: vi.fn(),
  saveLocalChartMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: (): { push: () => void; refresh: () => void } => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/lib/supabase/use-auth', () => ({
  useAuth: authMock,
}));

vi.mock('@/lib/utils/storage', () => ({
  deleteChart: deleteChartMock,
  getCurrentChart: getCurrentChartMock,
  getLocalSavedChartById: vi.fn(() => null),
  getOwnedLocalSavedChartById: getOwnedLocalSavedChartByIdMock,
  getSavedChartById: getSavedChartByIdMock,
  getSavedCharts: getSavedChartsMock,
  migrateFromLocalStorage: migrateMock,
  saveChart: saveChartMock,
  saveChartToSupabase: saveChartToSupabaseMock,
  saveCurrentChart: saveCurrentChartMock,
  saveLocalChart: saveLocalChartMock,
  updateLocalChartId: vi.fn(),
}));

const user = { id: 'user-1', email: 'user@example.com' } as User;
const otherUser = { id: 'user-2', email: 'other@example.com' } as User;

const sampleBirthInfo = {
  name: 'Đương số mẫu',
  gender: 'nam' as const,
  calendarType: 'solar' as const,
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  location: {
    region: 'north' as const,
    longitude: 105.8542,
    provinceId: 'HN',
    provinceName: 'Hà Nội',
  },
};

const chart = {
  birthInfo: {
    name: 'Nguyễn A',
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
  },
  appliedConfig: { school: 'trungChau' },
} as unknown as ZiweiChart;

const savedChart: SavedChart = {
  id: 'chart-1',
  name: 'Nguyễn A',
  birthInfo: { ...chart.birthInfo, year: 1988 },
  preferences: chart.appliedConfig,
  createdAt: Date.parse('2026-01-01T00:00:00.000Z'),
  updatedAt: Date.parse('2026-01-02T00:00:00.000Z'),
};

function mockAuth(currentUser: User | null, loading = false): void {
  authMock.mockReturnValue({
    user: currentUser,
    loading,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  });
}

function fillBirthForm(overrides: Partial<typeof sampleBirthInfo> = {}): void {
  const values = { ...sampleBirthInfo, ...overrides };
  fireEvent.change(screen.getByLabelText('Họ tên'), { target: { value: values.name } });
  fireEvent.change(screen.getByLabelText(/Giới tính/), { target: { value: values.gender } });
  fireEvent.change(screen.getByLabelText('Ngày'), { target: { value: String(values.day) } });
  fireEvent.change(screen.getByLabelText('Tháng'), { target: { value: String(values.month) } });
  fireEvent.change(screen.getByLabelText('Năm'), { target: { value: String(values.year) } });
  fireEvent.change(screen.getByLabelText(/Giờ sinh/), { target: { value: String(values.hour) } });
  fireEvent.change(screen.getByLabelText(/Phút sinh/), {
    target: { value: String(values.minute) },
  });
}

function submitForm(): void {
  const submitButton = screen.getByRole('button', { name: 'Lập lá số' });
  fireEvent.submit(submitButton.closest('form') as HTMLFormElement);
}

async function renderClient(props: { savedId?: string } = {}): Promise<void> {
  render(<LapLaSoClient {...props} />);
  if (!props.savedId) {
    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalled());
    await act(async () => {});
  }
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  authMock.mockReset();
  deleteChartMock.mockReset();
  getCurrentChartMock.mockReset();
  getCurrentChartMock.mockResolvedValue(null);
  getOwnedLocalSavedChartByIdMock.mockReset();
  getOwnedLocalSavedChartByIdMock.mockReturnValue(null);
  getSavedChartByIdMock.mockReset();
  getSavedChartsMock.mockReset();
  migrateMock.mockReset();
  saveChartMock.mockReset();
  saveChartToSupabaseMock.mockReset();
  saveCurrentChartMock.mockReset();
  saveCurrentChartMock.mockResolvedValue(undefined);
  saveLocalChartMock.mockReset();
  saveLocalChartMock.mockReturnValue({ id: 'chart-local' });
  migrateMock.mockResolvedValue(undefined);
});

describe('SaveChartButton', () => {
  it('saves for the signed-in user and reports progress then success', async () => {
    mockAuth(user);

    let resolveSave!: (value: SavedChart) => void;
    saveChartMock.mockReturnValue(
      new Promise<SavedChart>((resolve) => {
        resolveSave = resolve;
      })
    );

    render(<SaveChartButton chart={chart} />);
    fireEvent.click(screen.getByRole('button', { name: 'Lưu hồ sơ' }));

    await waitFor(() =>
      expect(saveChartMock).toHaveBeenCalledWith(user, {
        name: 'Nguyễn A',
        birthInfo: chart.birthInfo,
        preferences: chart.appliedConfig,
      })
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Đang lưu...');
    expect(button).toBeDisabled();

    await act(async () => {
      resolveSave(savedChart);
    });

    await waitFor(() => expect(button).toHaveTextContent('✓ Đã lưu'));
  });

  it('saves a guest chart locally through saveChart', async () => {
    mockAuth(null);
    saveChartMock.mockResolvedValue(savedChart);

    render(<SaveChartButton chart={chart} />);
    fireEvent.click(screen.getByRole('button', { name: 'Lưu hồ sơ' }));

    await waitFor(() =>
      expect(saveChartMock).toHaveBeenCalledWith(null, {
        name: 'Nguyễn A',
        birthInfo: chart.birthInfo,
        preferences: chart.appliedConfig,
      })
    );
  });

  it('does not save when the chart is already saved', () => {
    mockAuth(user);

    render(<SaveChartButton chart={chart} savedId="chart-1" />);

    expect(screen.getByRole('button', { name: '✓ Đã lưu' })).toBeDisabled();
    expect(saveChartMock).not.toHaveBeenCalled();
  });
});

describe('SavedChartsList', () => {
  it('shows charts stored on the device for a signed-out visitor', async () => {
    mockAuth(null);
    getSavedChartsMock.mockResolvedValue([savedChart]);

    render(<SavedChartsList />);

    expect(await screen.findByText('Nguyễn A')).toBeInTheDocument();
    expect(screen.getByText('💾 Lưu trên thiết bị này')).toBeInTheDocument();
    expect(getSavedChartsMock).toHaveBeenCalledWith(null);
  });

  it('shows cloud charts for a signed-in user', async () => {
    mockAuth(user);
    getSavedChartsMock.mockResolvedValue([savedChart]);

    render(<SavedChartsList />);

    expect(await screen.findByText('Nguyễn A')).toBeInTheDocument();
    expect(screen.getByText('☁️ Đã đồng bộ đám mây')).toBeInTheDocument();
    expect(getSavedChartsMock).toHaveBeenCalledWith(user);
  });

  it('waits for the auth session before loading charts', () => {
    mockAuth(null, true);

    render(<SavedChartsList />);

    expect(screen.getByText('Đang tải hồ sơ...')).toBeInTheDocument();
    expect(getSavedChartsMock).not.toHaveBeenCalled();
  });

  it('deletes a chart and reloads the list', async () => {
    mockAuth(user);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    getSavedChartsMock.mockResolvedValueOnce([savedChart]).mockResolvedValueOnce([]);

    render(<SavedChartsList />);
    await screen.findByText('Nguyễn A');

    fireEvent.click(screen.getByRole('button', { name: /Xóa hồ sơ Nguyễn A/ }));

    await waitFor(() => expect(deleteChartMock).toHaveBeenCalledWith(user, 'chart-1'));
    await waitFor(() => expect(screen.queryByText('Nguyễn A')).not.toBeInTheDocument());
    expect(getSavedChartsMock).toHaveBeenCalledTimes(2);
  });
});

describe('LapLaSoClient migration', () => {
  it('migrates local charts once the user is signed in', async () => {
    mockAuth(user);

    render(<LapLaSoClient />);

    await waitFor(() => expect(migrateMock).toHaveBeenCalledWith(user));
  });
});

describe('LapLaSoClient personal summary', () => {
  it('renders the detailed "Luận giải" narrative after generating a chart', async () => {
    mockAuth(null);

    await renderClient();
    fillBirthForm();
    submitForm();

    expect(await screen.findByRole('heading', { name: 'Luận giải' })).toBeInTheDocument();
    expect(screen.getByText(/Lá số của Đương số mẫu/)).toBeInTheDocument();
    expect(screen.getByText(/Bản Mệnh Nạp Âm/)).toBeInTheDocument();
  });
});

describe('LapLaSoClient saving', () => {
  it('does not persist a generated chart until the user saves it explicitly', async () => {
    mockAuth(user);
    saveChartMock.mockResolvedValue(savedChart);

    await renderClient();
    fillBirthForm();
    submitForm();

    expect(await screen.findByRole('heading', { name: 'Luận giải' })).toBeInTheDocument();
    expect(saveLocalChartMock).not.toHaveBeenCalled();
    expect(saveChartToSupabaseMock).not.toHaveBeenCalled();
    expect(saveChartMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Lưu hồ sơ' }));

    await waitFor(() => expect(saveChartMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '✓ Đã lưu' })).toBeDisabled()
    );
  });
});

describe('LapLaSoClient current chart', () => {
  it('starts with no chart and a blank form for an account without a current chart', async () => {
    mockAuth(user);

    render(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(user));
    await act(async () => {});

    expect(screen.queryByText(/Lá số của/)).not.toBeInTheDocument();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Ngày') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Tháng') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Năm') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/Giờ sinh/) as HTMLInputElement).value).toBe('');
    expect(screen.queryByDisplayValue('Đương số mẫu')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(getSavedChartsMock).not.toHaveBeenCalled();
    expect(getSavedChartByIdMock).not.toHaveBeenCalled();
  });

  it('shows an explicit error when the current-chart read fails instead of looking like a new account', async () => {
    mockAuth(user);
    getCurrentChartMock.mockRejectedValue(
      new Error('relation "public.current_charts" does not exist')
    );

    render(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(user));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/không thể tải lá số hiện tại từ tài khoản/i);
    expect(alert).not.toHaveTextContent(/does not exist/i);
    expect(screen.queryByText(/Lá số của/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '✓ Đã lưu' })).not.toBeInTheDocument();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('');
  });

  it('persists a guest submission as the current chart without saving a Saved Chart', async () => {
    mockAuth(null);

    await renderClient();
    fillBirthForm();
    submitForm();

    await waitFor(() => expect(saveCurrentChartMock).toHaveBeenCalledTimes(1));
    expect(saveCurrentChartMock).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        birthInfo: expect.objectContaining({
          name: 'Đương số mẫu',
          day: 15,
          month: 5,
          year: 1990,
          hour: 10,
          minute: 30,
        }),
      })
    );
    expect(saveChartMock).not.toHaveBeenCalled();
    expect(saveLocalChartMock).not.toHaveBeenCalled();
    expect(saveChartToSupabaseMock).not.toHaveBeenCalled();
  });

  it('persists a signed-in submission as the current chart and updates the active chart', async () => {
    mockAuth(user);

    await renderClient();
    fillBirthForm();
    submitForm();

    await waitFor(() => expect(saveCurrentChartMock).toHaveBeenCalledWith(user, expect.anything()));
    expect(saveChartMock).not.toHaveBeenCalled();
    expect(saveChartToSupabaseMock).not.toHaveBeenCalled();
    expect(saveLocalChartMock).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Họ tên'), { target: { value: 'Nguyễn B' } });
    fireEvent.change(screen.getByLabelText('Ngày'), { target: { value: '20' } });
    submitForm();

    await waitFor(() => expect(saveCurrentChartMock).toHaveBeenCalledTimes(2));
    expect(saveCurrentChartMock.mock.calls[1][0]).toBe(user);
    expect(saveCurrentChartMock.mock.calls[1][1]).toMatchObject({
      birthInfo: expect.objectContaining({ name: 'Nguyễn B', day: 20 }),
    });
    expect(await screen.findByText(/Lá số của Nguyễn B/)).toBeInTheDocument();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('Nguyễn B');
  });

  it('shows an explicit error when the signed-in current-chart save fails, keeping the chart visible', async () => {
    mockAuth(user);
    saveCurrentChartMock.mockRejectedValue(
      new Error('relation "public.current_charts" does not exist')
    );

    await renderClient();
    fillBirthForm();
    submitForm();

    expect(await screen.findByText(/Lá số của Đương số mẫu/)).toBeInTheDocument();

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/không thể lưu lên tài khoản/i);
    expect(alert).toHaveTextContent(/chưa được đồng bộ/i);
    expect(alert).toHaveTextContent(/chỉ khả dụng trong phiên làm việc này/i);
    expect(alert).toHaveTextContent(/đăng xuất hoặc xóa bộ nhớ đệm/i);
    expect(alert).not.toHaveTextContent(/does not exist/i);
    expect(screen.getByRole('button', { name: 'Lưu hồ sơ' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: '✓ Đã lưu' })).not.toBeInTheDocument();
  });

  it('restores and hydrates a guest current chart on remount', async () => {
    mockAuth(null);
    getCurrentChartMock.mockResolvedValue({
      birthInfo: sampleBirthInfo,
      preferences: { school: 'trungChau' },
    });

    render(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(null));
    expect(
      await screen.findByText(/Lá số của Đương số mẫu/)
    ).toBeInTheDocument();
    await waitFor(() =>
      expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe(
        sampleBirthInfo.name
      )
    );
    expect((screen.getByLabelText('Ngày') as HTMLInputElement).value).toBe('15');
    expect((screen.getByLabelText('Năm') as HTMLInputElement).value).toBe('1990');
    expect(screen.getByRole('button', { name: 'Lưu hồ sơ' })).toBeEnabled();
  });

  it('restores only the authenticated user current chart on mount', async () => {
    mockAuth(user);
    getCurrentChartMock.mockResolvedValue({ birthInfo: sampleBirthInfo });

    render(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(user));
    expect(
      await screen.findByText(/Lá số của Đương số mẫu/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu hồ sơ' })).toBeEnabled();
    expect(getSavedChartsMock).not.toHaveBeenCalled();
  });

  it('does not let a delayed current-chart load overwrite a newer submission', async () => {
    mockAuth(null);
    let resolveCurrent!: (value: { birthInfo: typeof sampleBirthInfo } | null) => void;
    getCurrentChartMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCurrent = resolve;
      })
    );

    render(<LapLaSoClient />);
    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(null));

    fillBirthForm({ name: 'Nguyễn Mới', day: 2, month: 6, year: 1992 });
    submitForm();

    await waitFor(() => expect(saveCurrentChartMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      resolveCurrent({ birthInfo: sampleBirthInfo });
    });

    expect(screen.getByText(/Lá số của Nguyễn Mới/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Lá số của Đương số mẫu/)
    ).not.toBeInTheDocument();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('Nguyễn Mới');
  });

  it('drops the account current chart and shows the guest state on logout', async () => {
    mockAuth(user);
    getCurrentChartMock.mockResolvedValueOnce({ birthInfo: sampleBirthInfo });

    const { rerender } = render(<LapLaSoClient />);
    expect(
      await screen.findByText(/Lá số của Đương số mẫu/)
    ).toBeInTheDocument();

    mockAuth(null);
    getCurrentChartMock.mockResolvedValueOnce(null);
    rerender(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenLastCalledWith(null));
    await waitFor(() =>
      expect(screen.queryByText(/Lá số của/)).not.toBeInTheDocument()
    );
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('');
  });

  it('does not refetch or reset the form when the user object is refreshed with the same id', async () => {
    mockAuth(user);
    getCurrentChartMock.mockResolvedValueOnce({ birthInfo: sampleBirthInfo });

    const { rerender } = render(<LapLaSoClient />);
    expect(
      await screen.findByText(/Lá số của Đương số mẫu/)
    ).toBeInTheDocument();
    await waitFor(() =>
      expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe(
        sampleBirthInfo.name
      )
    );

    fireEvent.change(screen.getByLabelText('Họ tên'), {
      target: { value: 'Nguyễn Đang Sửa' },
    });

    mockAuth({ ...user } as User);
    rerender(<LapLaSoClient />);
    await act(async () => {});

    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe(
      'Nguyễn Đang Sửa'
    );
    expect(getCurrentChartMock).toHaveBeenCalledTimes(1);
    expect(getCurrentChartMock).toHaveBeenCalledWith(user);
  });

  it('clears hydrated form data when chart reconstruction fails and identity changes', async () => {
    mockAuth(user);
    getCurrentChartMock.mockResolvedValueOnce({
      birthInfo: { ...sampleBirthInfo, year: 1800 },
    });

    const { rerender } = render(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(user));
    await waitFor(() =>
      expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe(
        sampleBirthInfo.name
      )
    );
    expect(screen.queryByText(/Lá số của/)).not.toBeInTheDocument();
    expect((screen.getByLabelText('Năm') as HTMLInputElement).value).toBe('1800');

    mockAuth(null);
    rerender(<LapLaSoClient />);

    await waitFor(() =>
      expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('')
    );
    expect(screen.queryByDisplayValue(sampleBirthInfo.name)).not.toBeInTheDocument();
    expect((screen.getByLabelText('Năm') as HTMLInputElement).value).toBe('');
  });

  it('keeps in-progress input and does not save as guest while auth is unresolved', async () => {
    mockAuth(null, true);

    const { rerender } = render(<LapLaSoClient />);

    fillBirthForm({ name: 'Nguyễn Nháp', day: 3, month: 4, year: 1991 });
    expect(screen.getByRole('button', { name: 'Lập lá số' })).toBeDisabled();

    submitForm();
    expect(saveCurrentChartMock).not.toHaveBeenCalled();

    mockAuth(user);
    getCurrentChartMock.mockResolvedValue(null);
    rerender(<LapLaSoClient />);

    await waitFor(() => expect(getCurrentChartMock).toHaveBeenCalledWith(user));
    await act(async () => {});

    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('Nguyễn Nháp');
    expect(screen.getByRole('button', { name: 'Lập lá số' })).toBeEnabled();
    expect(saveCurrentChartMock).not.toHaveBeenCalled();
  });
});

describe('LapLaSoClient saved chart loading', () => {
  it('keeps a newly generated chart when a stale saved chart load resolves late', async () => {
    mockAuth(user);

    let resolveSaved!: (value: SavedChart) => void;
    getSavedChartByIdMock.mockReturnValue(
      new Promise<SavedChart>((resolve) => {
        resolveSaved = resolve;
      })
    );

    render(<LapLaSoClient savedId="chart-old" />);

    expect(screen.getByText('Đang tải lá số...')).toBeInTheDocument();
    await waitFor(() => expect(getSavedChartByIdMock).toHaveBeenCalledWith(user, 'chart-old'));

    // Người dùng lập lá số mới trong khi hồ sơ cũ vẫn đang tải.
    fillBirthForm();
    submitForm();

    expect(await screen.findByText(/Lá số của Đương số mẫu/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu hồ sơ' })).toBeEnabled();

    // Yêu cầu tải hồ sơ cũ về muộn không được ghi đè lá số mới.
    await act(async () => {
      resolveSaved(savedChart);
    });

    expect(screen.getByText(/Lá số của Đương số mẫu/)).toBeInTheDocument();
    expect(screen.queryByText(/Lá số của Nguyễn A/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Lưu hồ sơ' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: '✓ Đã lưu' })).not.toBeInTheDocument();
  });

  it('adopts a remote saved chart and marks it as already saved', async () => {
    mockAuth(user);
    getSavedChartByIdMock.mockResolvedValue({ ...savedChart, id: 'chart-remote' });

    render(<LapLaSoClient savedId="chart-remote" />);

    expect(await screen.findByText(/Lá số của Nguyễn A/)).toBeInTheDocument();
    expect(getSavedChartByIdMock).toHaveBeenCalledWith(user, 'chart-remote');
    expect(await screen.findByRole('button', { name: '✓ Đã lưu' })).toBeDisabled();
  });

  it('clears the previous account saved chart when switching to guest', async () => {
    mockAuth(user);
    getSavedChartByIdMock.mockResolvedValue({ ...savedChart, id: 'chart-remote' });

    const { rerender } = render(<LapLaSoClient savedId="chart-remote" />);
    expect(await screen.findByText(/Lá số của Nguyễn A/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✓ Đã lưu' })).toBeDisabled();

    mockAuth(null);
    rerender(<LapLaSoClient savedId="chart-remote" />);

    await waitFor(() =>
      expect(
        screen.queryByText(/Lá số của Nguyễn A/)
      ).not.toBeInTheDocument()
    );
    expect(screen.queryByRole('button', { name: '✓ Đã lưu' })).not.toBeInTheDocument();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe('');
  });

  it('clears the previous account saved chart when another account lookup returns null', async () => {
    mockAuth(user);
    getSavedChartByIdMock
      .mockResolvedValueOnce({ ...savedChart, id: 'chart-remote' })
      .mockResolvedValueOnce(null);

    const { rerender } = render(<LapLaSoClient savedId="chart-remote" />);
    expect(await screen.findByText(/Lá số của Nguyễn A/)).toBeInTheDocument();

    mockAuth(otherUser);
    rerender(<LapLaSoClient savedId="chart-remote" />);

    await waitFor(() =>
      expect(getSavedChartByIdMock).toHaveBeenLastCalledWith(otherUser, 'chart-remote')
    );
    await waitFor(() =>
      expect(
        screen.queryByText(/Lá số của Nguyễn A/)
      ).not.toBeInTheDocument()
    );
    expect(screen.queryByRole('button', { name: '✓ Đã lưu' })).not.toBeInTheDocument();
  });

  it('does not refetch a saved chart or clear saved state on same-user token refresh', async () => {
    mockAuth(user);
    getSavedChartByIdMock.mockResolvedValue({ ...savedChart, id: 'chart-remote' });

    const { rerender } = render(<LapLaSoClient savedId="chart-remote" />);
    expect(await screen.findByRole('button', { name: '✓ Đã lưu' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Họ tên'), {
      target: { value: 'Nguyễn Đang Sửa' },
    });

    mockAuth({ ...user } as User);
    rerender(<LapLaSoClient savedId="chart-remote" />);
    await act(async () => {});

    expect(getSavedChartByIdMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: '✓ Đã lưu' })).toBeDisabled();
    expect((screen.getByLabelText('Họ tên') as HTMLInputElement).value).toBe(
      'Nguyễn Đang Sửa'
    );
  });
});

