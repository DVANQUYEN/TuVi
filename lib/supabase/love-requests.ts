import { isSupabaseConfigured, supabase } from './client';
import type { BirthInfo } from '@/lib/ziwei';
import type { CompatibilityResult } from '@/lib/ziwei/compatibility';
import type { LoveProfileValue } from '@/components/horoscope/love/LoveProfileFields';

export interface LoveRequestPayload {
  profiles: [LoveProfileValue, LoveProfileValue];
  birthInfos: [BirthInfo, BirthInfo];
  result: CompatibilityResult;
}

export interface LoveRequestSaveResult {
  ok: boolean;
  error?: string;
}

function errorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && code) return code;
  }
  return 'unknown';
}

export async function saveLoveCompatibilityRequest(
  payload: LoveRequestPayload
): Promise<LoveRequestSaveResult> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'not_configured' };
  }

  try {
    let userId: string | null = null;

    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    } catch {
      userId = null;
    }

    const { profiles, birthInfos, result } = payload;

    const { error } = await supabase.from('love_compatibility_requests').insert({
      user_id: userId,
      person1_name: profiles[0].name.trim(),
      person2_name: profiles[1].name.trim(),
      person1_gender: profiles[0].gender,
      person2_gender: profiles[1].gender,
      person1_birth_info: birthInfos[0],
      person2_birth_info: birthInfos[1],
      compatibility_score: result.score,
      compatibility_level: result.level,
      result,
    });

    if (error) {
      console.error('Failed to save love compatibility request:', { code: error.code });
      return { ok: false, error: error.code || 'insert_failed' };
    }

    return { ok: true };
  } catch (error) {
    console.error('Failed to save love compatibility request:', { code: errorCode(error) });
    return { ok: false, error: errorCode(error) };
  }
}
