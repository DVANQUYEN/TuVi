import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BirthInfo } from '@/lib/ziwei/types';

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  supabase: { from: fromMock },
}));

import {
  deleteChart,
  getSavedChartById,
  getSavedCharts,
  saveChart,
  type SavedChart,
} from '@/lib/supabase/storage';

interface QueryResult {
  data?: unknown;
  error?: { code?: string; message?: string } | Error | null;
}

interface QueryBuilder {
  insert: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: (resolve: (value: QueryResult) => unknown) => Promise<unknown>;
}

function createQuery(result: QueryResult): QueryBuilder {
  const builder = {} as QueryBuilder;
  for (const method of ['insert', 'select', 'delete', 'eq', 'order', 'single'] as const) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (resolve: (value: QueryResult) => unknown): Promise<unknown> =>
    Promise.resolve(result).then(resolve);
  return builder;
}

const birthInfo: BirthInfo = {
  name: 'Nguyen A',
  gender: 'nam',
  calendarType: 'solar',
  year: 1990,
  month: 5,
  day: 15,
  hour: 10,
  minute: 30,
};

const savedChart: SavedChart = {
  id: 'chart-1',
  user_id: 'user-1',
  name: 'La so Nguyen A',
  birth_info: birthInfo,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
};

describe('supabase storage', () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it('inserts a chart with the owning user id and returns the saved row', async () => {
    const query = createQuery({ data: savedChart, error: null });
    fromMock.mockReturnValue(query);

    const result = await saveChart('user-1', {
      name: savedChart.name,
      birth_info: birthInfo,
    });

    expect(fromMock).toHaveBeenCalledWith('charts');
    expect(query.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      name: savedChart.name,
      birth_info: birthInfo,
      preferences: undefined,
      chart_data: undefined,
    });
    expect(query.select).toHaveBeenCalledWith();
    expect(query.single).toHaveBeenCalledWith();
    expect(result).toEqual(savedChart);
  });

  it('throws when the insert fails', async () => {
    const dbError = new Error('insert failed');
    fromMock.mockReturnValue(createQuery({ data: null, error: dbError }));

    await expect(
      saveChart('user-1', { name: savedChart.name, birth_info: birthInfo })
    ).rejects.toBe(dbError);
  });

  it('lists only the current user charts ordered by newest first', async () => {
    const query = createQuery({ data: [savedChart], error: null });
    fromMock.mockReturnValue(query);

    const result = await getSavedCharts('user-1');

    expect(fromMock).toHaveBeenCalledWith('charts');
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(query.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual([savedChart]);
  });

  it('returns an empty list when the query has no rows', async () => {
    fromMock.mockReturnValue(createQuery({ data: null, error: null }));

    await expect(getSavedCharts('user-1')).resolves.toEqual([]);
  });

  it('deletes a chart scoped to the current user', async () => {
    const query = createQuery({ error: null });
    fromMock.mockReturnValue(query);

    await deleteChart('chart-1', 'user-1');

    expect(fromMock).toHaveBeenCalledWith('charts');
    expect(query.delete).toHaveBeenCalledWith();
    expect(query.eq).toHaveBeenNthCalledWith(1, 'id', 'chart-1');
    expect(query.eq).toHaveBeenNthCalledWith(2, 'user_id', 'user-1');
  });

  it('returns a chart by id', async () => {
    const query = createQuery({ data: savedChart, error: null });
    fromMock.mockReturnValue(query);

    await expect(getSavedChartById('chart-1')).resolves.toEqual(savedChart);
    expect(query.select).toHaveBeenCalledWith('*');
    expect(query.eq).toHaveBeenCalledWith('id', 'chart-1');
    expect(query.single).toHaveBeenCalledWith();
  });

  it('returns null when the chart does not exist', async () => {
    fromMock.mockReturnValue(
      createQuery({ data: null, error: { code: 'PGRST116', message: 'not found' } })
    );

    await expect(getSavedChartById('missing')).resolves.toBeNull();
  });

  it('throws on unexpected lookup errors', async () => {
    const dbError = new Error('lookup failed');
    fromMock.mockReturnValue(createQuery({ data: null, error: dbError }));

    await expect(getSavedChartById('chart-1')).rejects.toBe(dbError);
  });
});
