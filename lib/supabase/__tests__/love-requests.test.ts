import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoveProfileValue } from '@/components/horoscope/love/LoveProfileFields';
import type { CompatibilityResult } from '@/lib/ziwei/compatibility';
import type { BirthInfo } from '@/lib/ziwei/types';
import type { LoveRequestPayload } from '@/lib/supabase/love-requests';

const { clientState, fromMock, insertMock, getUserMock } = vi.hoisted(() => ({
  clientState: { configured: true },
  fromMock: vi.fn(),
  insertMock: vi.fn(),
  getUserMock: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  get isSupabaseConfigured(): boolean {
    return clientState.configured;
  },
  supabase: {
    auth: { getUser: getUserMock },
    from: fromMock,
  },
}));

import { saveLoveCompatibilityRequest } from '@/lib/supabase/love-requests';

const FIRST_PROFILE: LoveProfileValue = {
  name: '  Nguyễn Văn A  ',
  gender: 'nam',
  calendarType: 'solar',
  day: '15',
  month: '5',
  year: '1990',
  hour: '10',
  minute: '30',
  region: 'north',
};

const SECOND_PROFILE: LoveProfileValue = {
  name: ' Trần Thị B ',
  gender: 'nu',
  calendarType: 'solar',
  day: '20',
  month: '8',
  year: '1992',
  hour: '14',
  minute: '0',
  region: 'south',
};

const BIRTH_INFOS: [BirthInfo, BirthInfo] = [
  {
    name: 'Nguyễn Văn A',
    gender: 'nam',
    calendarType: 'solar',
    year: 1990,
    month: 5,
    day: 15,
    hour: 10,
    minute: 30,
  },
  {
    name: 'Trần Thị B',
    gender: 'nu',
    calendarType: 'solar',
    year: 1992,
    month: 8,
    day: 20,
    hour: 14,
    minute: 0,
  },
];

const RESULT = {
  score: 72,
  level: 'tốt',
  conclusion: { quote: 'Duyên lành gặp hội.', tone: 'high' },
  aspects: {},
  timing: { year: 2026, score: 7, meaning: '', detail: '' },
  dataQuality: 'full',
  dataWarnings: [],
  strengths: [],
  challenges: [],
  advice: 'Cùng nhau vun đắp.',
  method: { version: '2.0.0', weights: {}, caveat: '' },
} as unknown as CompatibilityResult;

const PAYLOAD: LoveRequestPayload = {
  profiles: [FIRST_PROFILE, SECOND_PROFILE],
  birthInfos: BIRTH_INFOS,
  result: RESULT,
};

function expectNoPiiInLog(calls: unknown[]): void {
  const serialized = JSON.stringify(calls);
  expect(serialized).not.toContain('Nguyễn Văn A');
  expect(serialized).not.toContain('Trần Thị B');
  expect(serialized).not.toContain('1990');
  expect(serialized).not.toContain('1992');
  expect(serialized).not.toContain('birth_info');
  expect(serialized).not.toContain('person1_name');
  expect(serialized).not.toContain('person2_name');
}

describe('saveLoveCompatibilityRequest', () => {
  beforeEach(() => {
    clientState.configured = true;
    fromMock.mockReset();
    insertMock.mockReset();
    getUserMock.mockReset();
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    insertMock.mockResolvedValue({ error: null });
    fromMock.mockReturnValue({ insert: insertMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('inserts one mapped row for the signed-in user', async () => {
    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({ ok: true });

    expect(fromMock).toHaveBeenCalledTimes(1);
    expect(fromMock).toHaveBeenCalledWith('love_compatibility_requests');
    expect(getUserMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock).toHaveBeenCalledWith({
      user_id: 'user-1',
      person1_name: 'Nguyễn Văn A',
      person2_name: 'Trần Thị B',
      person1_gender: 'nam',
      person2_gender: 'nu',
      person1_birth_info: BIRTH_INFOS[0],
      person2_birth_info: BIRTH_INFOS[1],
      compatibility_score: 72,
      compatibility_level: 'tốt',
      result: RESULT,
    });
  });

  it('stores a null user id when nobody is signed in', async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({ ok: true });

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ user_id: null });
  });

  it('continues with a null user id when auth lookup throws', async () => {
    getUserMock.mockRejectedValue(new Error('auth unavailable'));

    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({ ok: true });

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0][0]).toMatchObject({ user_id: null });
  });

  it('swallows and logs insert errors without leaking PII', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    insertMock.mockResolvedValue({ error: { code: '23514' } });

    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({
      ok: false,
      error: '23514',
    });

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expectNoPiiInLog(consoleError.mock.calls);
  });

  it('swallows and logs thrown errors without leaking PII', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    insertMock.mockRejectedValue({ code: 'NETWORK' });

    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({
      ok: false,
      error: 'NETWORK',
    });

    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledTimes(1);
    expectNoPiiInLog(consoleError.mock.calls);
  });

  it('returns not_configured without touching the client when Supabase is unconfigured', async () => {
    clientState.configured = false;

    await expect(saveLoveCompatibilityRequest(PAYLOAD)).resolves.toEqual({
      ok: false,
      error: 'not_configured',
    });

    expect(fromMock).not.toHaveBeenCalled();
    expect(getUserMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });
});
