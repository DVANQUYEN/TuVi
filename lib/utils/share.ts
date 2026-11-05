import type { BirthInfo, UserPreferences } from '@/lib/ziwei/types';
import { BirthInfoSchema, UserPreferencesSchema } from '@/lib/ziwei/config/schema';

export interface ShareData {
  chartId: string;
  birthInfo: BirthInfo;
  preferences?: UserPreferences;
}

export function generateChartId(birthInfo: BirthInfo): string {
  const str = `${birthInfo.year}-${birthInfo.month}-${birthInfo.day}-${birthInfo.hour}-${birthInfo.minute}-${birthInfo.gender}`;
  return btoa(str).slice(0, 12);
}

export function encodeChartUrl(shareData: ShareData): string {
  const json = JSON.stringify({
    b: shareData.birthInfo,
    p: shareData.preferences,
  });

  const encoder = new TextEncoder();
  const bytes = encoder.encode(json);
  const base64 = btoa(String.fromCharCode(...bytes));
  const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return `/chia-se/${shareData.chartId}?data=${base64url}`;
}

export function decodeChartUrl(data: string): ShareData | null {
  try {
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decoder = new TextDecoder();
    const json = decoder.decode(bytes);
    const parsed = JSON.parse(json);

    const birthInfo = BirthInfoSchema.parse(parsed.b);
    const preferences = parsed.p ? UserPreferencesSchema.parse(parsed.p) : undefined;

    return {
      chartId: generateChartId(birthInfo),
      birthInfo,
      preferences,
    };
  } catch {
    return null;
  }
}
