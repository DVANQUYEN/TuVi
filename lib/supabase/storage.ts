import { supabase } from './client';
import type { BirthInfo, UserPreferences, ZiweiChart } from '@/lib/ziwei/types';

export interface SavedChart {
  id: string;
  user_id: string;
  name: string;
  birth_info: BirthInfo;
  preferences?: UserPreferences;
  chart_data?: ZiweiChart;
  created_at: string;
  updated_at: string;
}

export async function saveChart(
  userId: string,
  chart: Omit<SavedChart, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<SavedChart> {
  const { data, error } = await supabase
    .from('charts')
    .insert({
      user_id: userId,
      name: chart.name,
      birth_info: chart.birth_info,
      preferences: chart.preferences,
      chart_data: chart.chart_data,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSavedCharts(userId: string): Promise<SavedChart[]> {
  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteChart(chartId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('charts').delete().eq('id', chartId).eq('user_id', userId);

  if (error) throw error;
}

export async function getSavedChartById(chartId: string): Promise<SavedChart | null> {
  const { data, error } = await supabase.from('charts').select('*').eq('id', chartId).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}
