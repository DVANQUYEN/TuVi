import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { validateBirthInfo, validateUserPreferences } from '@/lib/ziwei/config/schema';
import type { BirthInfo, UserPreferences, ZiweiChart } from '@/lib/ziwei/types';

export interface SavedChart {
  id: string;
  name: string;
  birthInfo: BirthInfo;
  preferences?: UserPreferences;
  /** Chủ sở hữu khi hồ sơ được lưu tạm trên thiết bị (dùng để tránh migrate nhầm tài khoản). */
  userId?: string;
  /** Id của bản ghi Supabase tương ứng khi hồ sơ đã được đồng bộ lên đám mây. */
  remoteId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CurrentChart {
  birthInfo: BirthInfo;
  preferences?: UserPreferences;
}

interface ChartRow {
  id: string;
  name: string;
  birth_info: BirthInfo;
  preferences: UserPreferences | null;
  created_at: string;
  updated_at: string;
}

interface CurrentChartRow {
  birth_info: unknown;
  preferences: unknown;
}

const STORAGE_KEY = 'savedCharts';
const CURRENT_CHART_KEY = 'currentChart';
const MAX_CHARTS = 50;
const REMOTE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const migrationsInFlight = new Map<string, Promise<void>>();

function birthInfoKey(birthInfo: BirthInfo): string {
  return JSON.stringify(birthInfo);
}

function belongsToUser(chart: SavedChart, userId: string): boolean {
  return !chart.userId || chart.userId === userId;
}

function belongsToOwner(chart: SavedChart, userId: string | null): boolean {
  return userId ? belongsToUser(chart, userId) : !chart.userId;
}

function ownerIdOf(user: User | string | null | undefined): string | null {
  if (!user) return null;
  return typeof user === 'string' ? user : user.id;
}

function remoteIdOf(chart: SavedChart): string | undefined {
  if (chart.remoteId) return chart.remoteId;
  // Dữ liệu cũ đã bị ghi đè id local bằng id DB nhưng chưa có remoteId.
  return REMOTE_ID_PATTERN.test(chart.id) ? chart.id : undefined;
}

function matchesChartId(chart: SavedChart, id: string): boolean {
  return chart.id === id || chart.remoteId === id;
}

function writeLocalSavedCharts(charts: SavedChart[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
  } catch (error) {
    console.error('Failed to save charts:', error);
  }
}

function mapRow(row: ChartRow): SavedChart {
  return {
    id: row.id,
    name: row.name,
    birthInfo: row.birth_info,
    preferences: row.preferences ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

function parseCurrentChart(data: unknown): CurrentChart | null {
  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;

  try {
    const birthInfo = validateBirthInfo(record.birthInfo);
    const preferences =
      record.preferences === undefined || record.preferences === null
        ? undefined
        : validateUserPreferences(record.preferences);

    return { birthInfo, preferences };
  } catch {
    return null;
  }
}

export function getGuestCurrentChart(): CurrentChart | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(CURRENT_CHART_KEY);
    if (!data) return null;

    return parseCurrentChart(JSON.parse(data));
  } catch (error) {
    console.error('Failed to load current chart:', error);
    return null;
  }
}

export function saveGuestCurrentChart(chart: CurrentChart): void {
  const parsed = parseCurrentChart(chart);
  if (!parsed) {
    throw new Error('Thông tin sinh không hợp lệ.');
  }

  try {
    localStorage.setItem(CURRENT_CHART_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Failed to save current chart:', error);
  }
}

export function clearGuestCurrentChart(): void {
  try {
    localStorage.removeItem(CURRENT_CHART_KEY);
  } catch (error) {
    console.error('Failed to clear current chart:', error);
  }
}

export async function getCurrentChart(user: User | null): Promise<CurrentChart | null> {
  if (!user) {
    return getGuestCurrentChart();
  }

  const { data, error } = await supabase
    .from('current_charts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    // PGRST116 = không có dòng nào cho user này (tài khoản mới hoặc chưa có lá số hiện tại).
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data) return null;

  const row = data as CurrentChartRow;
  return parseCurrentChart({
    birthInfo: row.birth_info,
    preferences: row.preferences,
  });
}

export async function saveCurrentChart(
  user: User | null,
  chart: CurrentChart
): Promise<void> {
  const parsed = parseCurrentChart(chart);
  if (!parsed) {
    throw new Error('Thông tin sinh không hợp lệ.');
  }

  if (!user) {
    saveGuestCurrentChart(parsed);
    return;
  }

  const { error } = await supabase.from('current_charts').upsert(
    {
      user_id: user.id,
      birth_info: parsed.birthInfo,
      preferences: parsed.preferences ?? null,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    throw error;
  }
}

export function saveLocalChart(
  chart: Omit<SavedChart, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'remoteId'>,
  userId?: string
): SavedChart {
  const charts = getLocalSavedCharts();

  const now = Date.now();
  const newChart: SavedChart = {
    ...chart,
    id: `chart_${now}_${Math.random().toString(36).slice(2, 9)}`,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  // Cùng thông tin sinh và cùng chủ sở hữu thì cập nhật hồ sơ cũ.
  // Không gộp giữa các tài khoản/khách để tránh ghi đè chéo dữ liệu.
  const key = birthInfoKey(chart.birthInfo);
  const ownerId = userId ?? null;
  const existingIndex = charts.findIndex(
    (c) => (c.userId ?? null) === ownerId && birthInfoKey(c.birthInfo) === key
  );
  let result: SavedChart = newChart;
  if (existingIndex >= 0) {
    const existing = charts[existingIndex];
    result = {
      ...newChart,
      id: existing.id,
      userId: userId ?? existing.userId,
      remoteId: existing.remoteId,
      createdAt: existing.createdAt,
    };
    charts[existingIndex] = result;
  } else {
    charts.push(newChart);
  }

  // Giới hạn số lượng: bỏ hồ sơ cũ nhất theo updatedAt
  if (charts.length > MAX_CHARTS) {
    charts.sort((a, b) => a.updatedAt - b.updatedAt);
    charts.splice(0, charts.length - MAX_CHARTS);
  }

  writeLocalSavedCharts(charts);

  return result;
}

export function updateLocalChartId(localId: string, dbId: string, userId?: string): void {
  const charts = getLocalSavedCharts();
  const index = charts.findIndex((c) => matchesChartId(c, localId));

  if (index === -1) return;

  charts[index] = {
    ...charts[index],
    id: dbId,
    remoteId: dbId,
    userId: userId ?? charts[index].userId,
  };

  writeLocalSavedCharts(charts);
}

export function getLocalSavedCharts(): SavedChart[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const charts: unknown = JSON.parse(data);
    if (!Array.isArray(charts)) return [];

    return charts.filter(
      (c): c is SavedChart =>
        !!c && typeof c === 'object' && 'id' in c && !!c.id && 'birthInfo' in c && !!c.birthInfo
    );
  } catch (error) {
    console.error('Failed to load charts:', error);
    return [];
  }
}

export function deleteLocalChart(id: string): void {
  const charts = getLocalSavedCharts().filter((c) => !matchesChartId(c, id));

  writeLocalSavedCharts(charts);
}

export function getLocalSavedChartById(id: string): SavedChart | null {
  return getLocalSavedCharts().find((c) => matchesChartId(c, id)) ?? null;
}

/**
 * Tra cứu hồ sơ local theo id hoặc remoteId, có kiểm tra chủ sở hữu.
 * Khách chỉ thấy hồ sơ khách; người đã đăng nhập chỉ thấy hồ sơ của mình
 * (cùng các hồ sơ khách chưa được migrate).
 */
export function getOwnedLocalSavedChartById(
  user: User | string | null,
  id: string
): SavedChart | null {
  const chart = getLocalSavedChartById(id);
  return chart && belongsToOwner(chart, ownerIdOf(user)) ? chart : null;
}

export async function getSavedCharts(user: User | null): Promise<SavedChart[]> {
  if (!user) {
    return getLocalSavedCharts().filter((chart) => belongsToOwner(chart, null));
  }

  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load charts:', error);
    return getLocalSavedCharts().filter((chart) => belongsToUser(chart, user.id));
  }

  return ((data ?? []) as ChartRow[]).map(mapRow);
}

export async function getLatestSavedChart(user: User | null): Promise<SavedChart | null> {
  if (!user) {
    return getLatestLocalChart();
  }

  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') {
      console.error('Failed to load latest chart:', error);
    }
    return getLatestLocalChart(user.id);
  }

  return mapRow(data as ChartRow);
}

export function getLatestLocalChart(userId?: string | null): SavedChart | null {
  const charts = getLocalSavedCharts().filter((chart) => belongsToOwner(chart, userId ?? null));
  if (charts.length === 0) return null;

  return charts.reduce((latest, chart) => (chart.updatedAt > latest.updatedAt ? chart : latest));
}

export async function saveChartToSupabase(
  user: User,
  chart: ZiweiChart,
  birthInfo: BirthInfo
): Promise<string> {
  const dateLabel = `${birthInfo.day}/${birthInfo.month}/${birthInfo.year}`;
  const name = birthInfo.name || `Lá số ${dateLabel}`;

  const { data, error } = await supabase
    .from('charts')
    .insert({
      user_id: user.id,
      name,
      birth_info: birthInfo,
      preferences: chart.appliedConfig,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw error ?? new Error('Failed to save chart');
  }

  return (data as { id: string }).id;
}

export async function saveChart(
  user: User | null,
  chart: Omit<SavedChart, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'remoteId'>
): Promise<SavedChart> {
  const localChart = saveLocalChart(chart, user?.id);

  if (!user) {
    return localChart;
  }

  const existingRemoteId = remoteIdOf(localChart);

  if (existingRemoteId) {
    const { data, error } = await supabase
      .from('charts')
      .update({
        name: chart.name,
        birth_info: chart.birthInfo,
        preferences: chart.preferences,
      })
      .eq('id', existingRemoteId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to save chart:', error);
      return localChart;
    }

    const updated = mapRow(data as ChartRow);
    updateLocalChartId(localChart.id, updated.id, user.id);
    return updated;
  }

  const { data, error } = await supabase
    .from('charts')
    .insert({
      user_id: user.id,
      name: chart.name,
      birth_info: chart.birthInfo,
      preferences: chart.preferences,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Failed to save chart:', error);
    return localChart;
  }

  const saved = mapRow(data as ChartRow);
  updateLocalChartId(localChart.id, saved.id, user.id);
  return saved;
}

export async function deleteChart(user: User | null, id: string): Promise<void> {
  if (!user) {
    deleteLocalChart(id);
    return;
  }

  const { error } = await supabase.from('charts').delete().eq('id', id).eq('user_id', user.id);

  if (error) {
    console.error('Failed to delete chart:', error);
  }

  // Luôn xóa bản local tương ứng (theo id hoặc remoteId) để migration
  // không đẩy hồ sơ đã xóa trở lại đám mây.
  deleteLocalChart(id);
}

export async function getSavedChartById(user: User | null, id: string): Promise<SavedChart | null> {
  if (!user) {
    return getOwnedLocalSavedChartById(null, id);
  }

  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Failed to load chart:', error);
    }
    return getOwnedLocalSavedChartById(user.id, id);
  }

  return data ? mapRow(data as ChartRow) : getOwnedLocalSavedChartById(user.id, id);
}

async function runMigration(userId: string): Promise<void> {
  const localCharts = getLocalSavedCharts().filter((chart) => belongsToUser(chart, userId));
  const pendingCharts = localCharts.filter((chart) => !remoteIdOf(chart));

  for (const chart of pendingCharts) {
    // Giữ nguyên thời điểm lưu gốc, không để DB gán thời điểm migrate
    const { data, error } = await supabase
      .from('charts')
      .insert({
        user_id: userId,
        name: chart.name,
        birth_info: chart.birthInfo,
        preferences: chart.preferences,
        created_at: new Date(chart.createdAt).toISOString(),
        updated_at: new Date(chart.updatedAt).toISOString(),
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('Failed to migrate chart:', error);
      return;
    }

    // Liên kết bản local với bản remote và giữ lại cả hai (local + DB).
    updateLocalChartId(chart.id, (data as { id: string }).id, userId);
  }
}

export async function migrateFromLocalStorage(user: User | string): Promise<void> {
  if (typeof window === 'undefined') return;

  const userId = typeof user === 'string' ? user : user.id;
  const inFlight = migrationsInFlight.get(userId);
  if (inFlight) return inFlight;

  const task = runMigration(userId);
  migrationsInFlight.set(userId, task);

  const clearInFlight = (): void => {
    if (migrationsInFlight.get(userId) === task) {
      migrationsInFlight.delete(userId);
    }
  };
  void task.then(clearInFlight, clearInFlight);

  return task;
}
