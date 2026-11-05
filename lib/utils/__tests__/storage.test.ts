import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import type { BirthInfo } from '@/lib/ziwei/types';

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  supabase: { from: fromMock },
}));

import {
  clearGuestCurrentChart,
  deleteChart,
  deleteLocalChart,
  getCurrentChart,
  getGuestCurrentChart,
  getLocalSavedChartById,
  getLocalSavedCharts,
  getOwnedLocalSavedChartById,
  getSavedChartById,
  getSavedCharts,
  migrateFromLocalStorage,
  saveChart,
  saveCurrentChart,
  saveLocalChart,
} from '@/lib/utils/storage';

interface QueryResult {
  data?: unknown;
  error?: { code?: string; message?: string } | Error | null;
}

interface QueryBuilder {
  insert: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: (resolve: (value: QueryResult) => unknown) => Promise<unknown>;
}

function createQuery(result: QueryResult): QueryBuilder {
  const builder = {} as QueryBuilder;
  for (const method of [
    'insert',
    'upsert',
    'update',
    'select',
    'delete',
    'eq',
    'order',
    'single',
  ] as const) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (resolve: (value: QueryResult) => unknown): Promise<unknown> =>
    Promise.resolve(result).then(resolve);
  return builder;
}

const birth = (overrides: Partial<BirthInfo> = {}): BirthInfo => ({
  name: 'Nguyễn A',
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
  ...overrides,
});

const input = (birthInfo: BirthInfo): { name: string; birthInfo: BirthInfo } => ({
  name: birthInfo.name ?? 'Không tên',
  birthInfo,
});

const user = { id: 'user-1' } as User;

const row = {
  id: 'chart-1',
  name: 'Nguyễn A',
  birth_info: birth(),
  preferences: { school: 'trungChau' as const },
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z',
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('local storage', () => {
  beforeEach(() => {
    localStorage.clear();
    fromMock.mockReset();
  });

  it('saves and lists a chart', () => {
    const saved = saveLocalChart(input(birth()));
    expect(saved.id).toMatch(/^chart_/);
    expect(getLocalSavedCharts()).toHaveLength(1);
    expect(getLocalSavedChartById(saved.id)?.name).toBe('Nguyễn A');
  });

  it('updates an existing chart with identical birth info instead of duplicating', () => {
    const first = saveLocalChart(input(birth()));
    const second = saveLocalChart(input(birth()));
    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(1);
    expect(second.id).toBe(first.id);
    expect(charts[0].createdAt).toBe(first.createdAt);
  });

  it('keeps different birth info as separate charts', () => {
    saveLocalChart(input(birth()));
    saveLocalChart(input(birth({ hour: 11 })));
    expect(getLocalSavedCharts()).toHaveLength(2);
  });

  it('scopes dedupe to the owner instead of overwriting another account chart', () => {
    const guest = saveLocalChart(input(birth()));
    const firstUser = saveLocalChart(input(birth()), 'user-1');
    const secondUser = saveLocalChart(input(birth()), 'user-2');

    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(3);
    expect(new Set([guest.id, firstUser.id, secondUser.id]).size).toBe(3);
    expect(charts.map((chart) => chart.userId ?? null).sort()).toEqual([
      null,
      'user-1',
      'user-2',
    ]);
  });

  it('looks up local charts with owner enforcement', () => {
    const guest = saveLocalChart(input(birth()));
    const firstUser = saveLocalChart(input(birth({ day: 1 })), 'user-1');
    const secondUser = saveLocalChart(input(birth({ day: 2 })), 'user-2');

    expect(getOwnedLocalSavedChartById(null, guest.id)?.id).toBe(guest.id);
    expect(getOwnedLocalSavedChartById(null, firstUser.id)).toBeNull();
    expect(getOwnedLocalSavedChartById('user-1', firstUser.id)?.id).toBe(firstUser.id);
    expect(getOwnedLocalSavedChartById('user-1', secondUser.id)).toBeNull();
    expect(getOwnedLocalSavedChartById('user-2', secondUser.id)?.id).toBe(secondUser.id);
  });


  it('deletes a chart by id', () => {
    const a = saveLocalChart(input(birth()));
    saveLocalChart(input(birth({ day: 1 })));
    deleteLocalChart(a.id);
    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(1);
    expect(getLocalSavedChartById(a.id)).toBeNull();
  });

  it('caps the list at 50 charts, dropping the least recently updated', () => {
    for (let i = 0; i < 51; i++) {
      saveLocalChart(input(birth({ year: 1900 + i })));
    }
    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(50);
    expect(charts.some((c) => c.birthInfo.year === 1900)).toBe(false);
    expect(charts.some((c) => c.birthInfo.year === 1950)).toBe(true);
  });

  it('ignores corrupted localStorage data', () => {
    localStorage.setItem('savedCharts', '{not json');
    expect(getLocalSavedCharts()).toEqual([]);
    localStorage.setItem('savedCharts', JSON.stringify([null, { foo: 1 }, 'x']));
    expect(getLocalSavedCharts()).toEqual([]);
  });
});

describe('Supabase storage wrapper', () => {
  beforeEach(() => {
    localStorage.clear();
    fromMock.mockReset();
  });

  it('falls back to local charts when no user is signed in', async () => {
    saveLocalChart(input(birth()));

    await expect(getSavedCharts(null)).resolves.toHaveLength(1);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('does not expose signed-in local charts to a guest', async () => {
    saveLocalChart(input(birth()), 'user-1');
    saveLocalChart(input(birth({ day: 1 })));

    const charts = await getSavedCharts(null);

    expect(charts).toHaveLength(1);
    expect(charts[0].userId).toBeUndefined();
  });

  it('maps Supabase rows to SavedChart objects for an authenticated user', async () => {
    const query = createQuery({ data: [row], error: null });
    fromMock.mockReturnValue(query);

    const result = await getSavedCharts(user);

    expect(fromMock).toHaveBeenCalledWith('charts');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual([
      {
        id: row.id,
        name: row.name,
        birthInfo: row.birth_info,
        preferences: row.preferences,
        createdAt: new Date(row.created_at).getTime(),
        updatedAt: new Date(row.updated_at).getTime(),
      },
    ]);
  });

  it('falls back to local charts when loading from Supabase fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    saveLocalChart(input(birth()));
    fromMock.mockReturnValue(createQuery({ data: null, error: new Error('network down') }));

    const result = await getSavedCharts(user);

    expect(result).toHaveLength(1);
  });

  it('does not expose local charts owned by another user when signed in', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    saveLocalChart(input(birth()), 'user-2');
    saveLocalChart(input(birth({ day: 1 })));
    fromMock.mockReturnValue(createQuery({ data: null, error: new Error('network down') }));

    const result = await getSavedCharts(user);

    expect(result).toHaveLength(1);
    expect(result[0].birthInfo.day).toBe(1);
  });

  it('saves locally when no user is signed in', async () => {
    const saved = await saveChart(null, input(birth()));

    expect(saved.id).toMatch(/^chart_/);
    expect(getLocalSavedCharts()).toHaveLength(1);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('inserts a chart for the authenticated user and maps the returned row', async () => {
    const query = createQuery({ data: row, error: null });
    fromMock.mockReturnValue(query);

    const saved = await saveChart(user, input(birth()));

    expect(query.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      name: row.name,
      birth_info: row.birth_info,
      preferences: undefined,
    });
    expect(saved.id).toBe(row.id);
    expect(saved.createdAt).toBe(new Date(row.created_at).getTime());
  });

  it('persists a signed-in chart locally and links it to the remote id', async () => {
    const query = createQuery({ data: row, error: null });
    fromMock.mockReturnValue(query);

    await saveChart(user, input(birth()));

    const local = getLocalSavedCharts();
    expect(local).toHaveLength(1);
    expect(local[0].id).toBe(row.id);
    expect(local[0].remoteId).toBe(row.id);
    expect(local[0].userId).toBe('user-1');
    expect(getLocalSavedChartById(row.id)?.name).toBe(row.name);
  });

  it('does not duplicate the local record when saving a chart that already exists locally', async () => {
    saveLocalChart(input(birth()), 'user-1');
    const query = createQuery({ data: row, error: null });
    fromMock.mockReturnValue(query);

    await saveChart(user, input(birth()));

    const local = getLocalSavedCharts();
    expect(local).toHaveLength(1);
    expect(local[0].id).toBe(row.id);
    expect(local[0].remoteId).toBe(row.id);
  });

  it('updates an existing remote chart instead of inserting a duplicate row on re-save', async () => {
    const insertQuery = createQuery({ data: row, error: null });
    fromMock.mockReturnValueOnce(insertQuery);

    await saveChart(user, input(birth()));

    const updateQuery = createQuery({ data: row, error: null });
    fromMock.mockReturnValueOnce(updateQuery);

    const updated = await saveChart(user, input(birth()));

    expect(updateQuery.update).toHaveBeenCalledWith({
      name: row.name,
      birth_info: row.birth_info,
      preferences: undefined,
    });
    expect(updateQuery.insert).not.toHaveBeenCalled();
    expect(updateQuery.eq).toHaveBeenNthCalledWith(1, 'id', row.id);
    expect(updateQuery.eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1');
    expect(updated.id).toBe(row.id);
    expect(getLocalSavedCharts()).toHaveLength(1);
  });

  it('falls back to local storage when the Supabase insert fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fromMock.mockReturnValue(createQuery({ data: null, error: new Error('insert failed') }));

    const saved = await saveChart(user, input(birth()));

    expect(saved.id).toMatch(/^chart_/);
    expect(saved.userId).toBe('user-1');
    expect(getLocalSavedCharts()).toHaveLength(1);
  });

  it('deletes locally when no user is signed in', async () => {
    const saved = saveLocalChart(input(birth()));

    await deleteChart(null, saved.id);

    expect(getLocalSavedCharts()).toEqual([]);
    expect(fromMock).not.toHaveBeenCalled();
  });

  it('deletes the authenticated user chart remotely', async () => {
    const query = createQuery({ error: null });
    fromMock.mockReturnValue(query);

    await deleteChart(user, 'chart-1');

    expect(query.delete).toHaveBeenCalledWith();
    expect(query.eq).toHaveBeenNthCalledWith(1, 'id', 'chart-1');
    expect(query.eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1');
  });

  it('removes the local copy after a successful remote delete', async () => {
    fromMock.mockReturnValueOnce(createQuery({ data: row, error: null }));
    await saveChart(user, input(birth()));
    expect(getLocalSavedCharts()).toHaveLength(1);

    fromMock.mockReturnValueOnce(createQuery({ error: null }));
    await deleteChart(user, row.id);

    expect(getLocalSavedCharts()).toEqual([]);
  });

  it('falls back to local deletion when the remote delete fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const saved = saveLocalChart(input(birth()));
    fromMock.mockReturnValue(createQuery({ error: new Error('delete failed') }));

    await deleteChart(user, saved.id);

    expect(getLocalSavedCharts()).toEqual([]);
  });

  it('loads a single chart from Supabase for the authenticated user', async () => {
    const query = createQuery({ data: row, error: null });
    fromMock.mockReturnValue(query);

    const saved = await getSavedChartById(user, 'chart-1');

    expect(query.eq).toHaveBeenNthCalledWith(1, 'id', 'chart-1');
    expect(query.eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1');
    expect(saved?.id).toBe(row.id);
  });

  it('falls back to a local chart when the remote lookup fails', async () => {
    const local = saveLocalChart(input(birth()));
    fromMock.mockReturnValue(createQuery({ data: null, error: { code: 'PGRST116' } }));

    await expect(getSavedChartById(user, local.id)).resolves.toMatchObject({ id: local.id });
  });

  it('does not fall back to another user local chart by id', async () => {
    const other = saveLocalChart(input(birth()), 'user-2');
    fromMock.mockReturnValue(createQuery({ data: null, error: { code: 'PGRST116' } }));

    await expect(getSavedChartById(user, other.id)).resolves.toBeNull();
  });
});

describe('current chart persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    fromMock.mockReset();
  });

  it('stores a guest current chart under its own key, never in saved charts', async () => {
    await saveCurrentChart(null, {
      birthInfo: birth(),
      preferences: { school: 'trungChau' },
    });

    expect(localStorage.getItem('currentChart')).not.toBeNull();
    expect(localStorage.getItem('savedCharts')).toBeNull();
    expect(getLocalSavedCharts()).toEqual([]);
    expect(fromMock).not.toHaveBeenCalled();

    await expect(getCurrentChart(null)).resolves.toEqual({
      birthInfo: birth(),
      preferences: { school: 'trungChau' },
    });
  });

  it('clears only the guest current chart key', async () => {
    saveLocalChart(input(birth()));
    await saveCurrentChart(null, { birthInfo: birth() });

    clearGuestCurrentChart();

    expect(getGuestCurrentChart()).toBeNull();
    expect(localStorage.getItem('currentChart')).toBeNull();
    expect(getLocalSavedCharts()).toHaveLength(1);
  });

  it('ignores corrupted or invalid guest current chart data', () => {
    localStorage.setItem('currentChart', '{not json');
    expect(getGuestCurrentChart()).toBeNull();

    localStorage.setItem('currentChart', JSON.stringify({ birthInfo: { year: 1800 } }));
    expect(getGuestCurrentChart()).toBeNull();
  });

  it('reads the authenticated user current chart from Supabase', async () => {
    const query = createQuery({
      data: { birth_info: birth(), preferences: { school: 'trungChau' } },
      error: null,
    });
    fromMock.mockReturnValue(query);

    const result = await getCurrentChart(user);

    expect(fromMock).toHaveBeenCalledWith('current_charts');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.single).toHaveBeenCalled();
    expect(result).toEqual({ birthInfo: birth(), preferences: { school: 'trungChau' } });
  });

  it('returns null for a signed-in user without a current row and never falls back locally', async () => {
    saveLocalChart(input(birth()));
    localStorage.setItem('currentChart', JSON.stringify({ birthInfo: birth({ day: 3 }) }));
    fromMock.mockReturnValue(createQuery({ data: null, error: { code: 'PGRST116' } }));

    await expect(getCurrentChart(user)).resolves.toBeNull();
  });

  it('propagates real query errors instead of treating them as no current chart', async () => {
    const missingTable = {
      code: '42P01',
      message: 'relation "public.current_charts" does not exist',
    };
    fromMock.mockReturnValue(createQuery({ data: null, error: missingTable }));

    await expect(getCurrentChart(user)).rejects.toMatchObject(missingTable);

    const rlsError = {
      code: '42501',
      message: 'new row violates row-level security policy',
    };
    fromMock.mockReturnValue(createQuery({ data: null, error: rlsError }));

    await expect(getCurrentChart(user)).rejects.toMatchObject(rlsError);
  });

  it('does not expose another account current chart through local storage', async () => {
    localStorage.setItem(
      'currentChart',
      JSON.stringify({ birthInfo: birth(), preferences: { school: 'namPhai' } })
    );
    const other = { id: 'user-2' } as User;
    const query = createQuery({ data: null, error: { code: 'PGRST116' } });
    fromMock.mockReturnValue(query);

    await expect(getCurrentChart(other)).resolves.toBeNull();

    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-2');
  });

  it('upserts the current chart with the authenticated user id and onConflict user_id', async () => {
    const query = createQuery({ data: null, error: null });
    fromMock.mockReturnValue(query);

    await saveCurrentChart(user, {
      birthInfo: birth(),
      preferences: { school: 'trungChau' },
    });

    expect(fromMock).toHaveBeenCalledWith('current_charts');
    expect(query.upsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        birth_info: birth(),
        preferences: { school: 'trungChau' },
      },
      { onConflict: 'user_id' }
    );
  });

  it('propagates a current chart upsert failure so the UI can report it', async () => {
    const error = {
      code: '42501',
      message: 'new row violates row-level security policy',
    };
    fromMock.mockReturnValue(createQuery({ data: null, error }));

    await expect(saveCurrentChart(user, { birthInfo: birth() })).rejects.toMatchObject(error);
  });

  it('always uses the authenticated session id as the current chart owner', async () => {
    const query = createQuery({ data: null, error: null });
    fromMock.mockReturnValue(query);

    await saveCurrentChart(user, {
      birthInfo: birth(),
      ...({ userId: 'user-2' } as object),
    });

    const payload = query.upsert.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.user_id).toBe('user-1');
    expect(payload).not.toHaveProperty('userId');
  });

  it('rejects invalid birth info before writing a current chart', async () => {
    await expect(
      saveCurrentChart(null, { birthInfo: birth({ year: 1800 }) })
    ).rejects.toThrow();
    expect(localStorage.getItem('currentChart')).toBeNull();
  });
});

describe('migration from localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    fromMock.mockReset();
  });

  it('links every local chart to its remote row and keeps both copies', async () => {
    const first = saveLocalChart(input(birth()));
    saveLocalChart(input(birth({ day: 1 })));
    const firstQuery = createQuery({ data: { id: 'remote-1' }, error: null });
    const secondQuery = createQuery({ data: { id: 'remote-2' }, error: null });
    fromMock.mockReturnValueOnce(firstQuery).mockReturnValueOnce(secondQuery);

    await migrateFromLocalStorage(user);

    expect(fromMock).toHaveBeenCalledTimes(2);
    expect(firstQuery.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      name: 'Nguyễn A',
      birth_info: birth(),
      preferences: undefined,
      created_at: new Date(first.createdAt).toISOString(),
      updated_at: new Date(first.updatedAt).toISOString(),
    });

    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(2);
    expect(charts.map((chart) => chart.id)).toEqual(['remote-1', 'remote-2']);
    expect(charts.map((chart) => chart.remoteId)).toEqual(['remote-1', 'remote-2']);
    expect(charts.every((chart) => chart.userId === 'user-1')).toBe(true);
  });

  it('does nothing when there are no local charts', async () => {
    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
  });

  it('keeps local charts when a Supabase insert fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    saveLocalChart(input(birth()));
    fromMock.mockReturnValue(createQuery({ data: null, error: new Error('insert failed') }));

    await migrateFromLocalStorage(user);

    expect(getLocalSavedCharts()).toHaveLength(1);
    expect(getLocalSavedCharts()[0].remoteId).toBeUndefined();
  });

  it('does not migrate charts owned by another user', async () => {
    saveLocalChart(input(birth()), 'user-2');

    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
    expect(getLocalSavedCharts()).toHaveLength(1);
  });

  it('migrates anonymous and current-user charts but keeps other users charts', async () => {
    const anonymous = saveLocalChart(input(birth()));
    saveLocalChart(input(birth({ day: 1 })), 'user-2');
    const query = createQuery({ data: { id: 'remote-1' }, error: null });
    fromMock.mockReturnValue(query);

    await migrateFromLocalStorage(user);

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', name: anonymous.name })
    );
    const remaining = getLocalSavedCharts();
    expect(remaining).toHaveLength(2);
    expect(remaining.find((chart) => chart.userId === 'user-1')?.remoteId).toBe('remote-1');
    expect(remaining.find((chart) => chart.userId === 'user-2')?.remoteId).toBeUndefined();
  });

  it('skips local charts that are already linked to a remote row', async () => {
    fromMock.mockReturnValueOnce(createQuery({ data: row, error: null }));
    const saved = await saveChart(user, input(birth()));
    fromMock.mockReset();

    await migrateFromLocalStorage(user);
    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
    const charts = getLocalSavedCharts();
    expect(charts).toHaveLength(1);
    expect(charts[0].remoteId).toBe(saved.id);
  });

  it('skips legacy local charts whose id is already a remote uuid', async () => {
    const legacyId = '11111111-1111-4111-8111-111111111111';
    localStorage.setItem(
      'savedCharts',
      JSON.stringify([
        {
          id: legacyId,
          name: 'Nguyễn A',
          birthInfo: birth(),
          userId: 'user-1',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ])
    );

    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
    expect(getLocalSavedCharts()[0].id).toBe(legacyId);
  });

  it('never migrates or modifies the guest current chart', async () => {
    const saved = saveLocalChart(input(birth()));
    localStorage.setItem(
      'currentChart',
      JSON.stringify({ birthInfo: birth({ day: 3 }), preferences: { school: 'namPhai' } })
    );
    const query = createQuery({ data: { id: 'remote-1' }, error: null });
    fromMock.mockReturnValue(query);

    await migrateFromLocalStorage(user);

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(query.insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user-1', name: saved.name })
    );
    expect(JSON.parse(localStorage.getItem('currentChart') ?? 'null')).toEqual({
      birthInfo: birth({ day: 3 }),
      preferences: { school: 'namPhai' },
    });
    expect(getLocalSavedCharts()).toHaveLength(1);
  });

  it('does nothing when only a guest current chart exists', async () => {
    localStorage.setItem('currentChart', JSON.stringify({ birthInfo: birth() }));

    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
    expect(localStorage.getItem('currentChart')).not.toBeNull();
    expect(getLocalSavedCharts()).toEqual([]);
  });

  it('coalesces concurrent migration calls for the same user', async () => {
    saveLocalChart(input(birth()));
    const query = createQuery({ data: { id: 'remote-1' }, error: null });
    fromMock.mockReturnValue(query);

    await Promise.all([migrateFromLocalStorage(user), migrateFromLocalStorage(user)]);

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(getLocalSavedCharts()[0].remoteId).toBe('remote-1');
  });

  it('does not resurrect a chart after it has been deleted remotely and locally', async () => {
    fromMock.mockReturnValueOnce(createQuery({ data: row, error: null }));
    await saveChart(user, input(birth()));

    fromMock.mockReturnValueOnce(createQuery({ error: null }));
    await deleteChart(user, row.id);
    expect(getLocalSavedCharts()).toEqual([]);

    fromMock.mockReset();
    await migrateFromLocalStorage(user);

    expect(fromMock).not.toHaveBeenCalled();
    expect(getLocalSavedCharts()).toEqual([]);
  });
});
