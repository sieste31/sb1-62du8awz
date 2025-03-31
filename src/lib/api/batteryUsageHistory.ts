import { supabase } from '../supabase';
import type { Database } from '../database.types';

type BatteryUsageHistory = Database['public']['Tables']['battery_usage_history']['Row'];
type BatteryUsageHistoryInsert = Database['public']['Tables']['battery_usage_history']['Insert'];
type BatteryUsageHistoryUpdate = Database['public']['Tables']['battery_usage_history']['Update'];

// 電池使用履歴の取得
export async function getBatteryUsageHistory(batteryId: string) {
  const { data, error } = await supabase
    .from('battery_usage_history')
    .select(`
      *,
      devices (*)
    `)
    .eq('battery_id', batteryId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}

// デバイスの電池使用履歴の取得
export async function getDeviceUsageHistory(deviceId: string) {
  const { data, error } = await supabase
    .from('battery_usage_history')
    .select(`
      *,
      batteries (
        *,
        battery_groups (*)
      )
    `)
    .eq('device_id', deviceId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}

// 電池使用履歴の作成
export async function createBatteryUsageHistory(data: BatteryUsageHistoryInsert[]) {
  const { data: historyData, error } = await supabase
    .from('battery_usage_history')
    .insert(data)
    .select();

  if (error) throw error;
  return historyData;
}

// 電池使用履歴の更新（終了日時の設定など）
export async function updateBatteryUsageHistory(historyIds: string[], data: BatteryUsageHistoryUpdate) {
  if (historyIds.length === 0) return [];
  
  const { data: updatedData, error } = await supabase
    .from('battery_usage_history')
    .update(data)
    .in('id', historyIds)
    .select();

  if (error) throw error;
  return updatedData;
}

// デバイスの現在の使用履歴を終了
export async function endDeviceCurrentUsageHistory(deviceId: string) {
  const now = new Date().toISOString();
  
  // 終了していない使用履歴を取得
  const { data: historyData } = await supabase
    .from('battery_usage_history')
    .select('id')
    .eq('device_id', deviceId)
    .is('ended_at', null);

  if (historyData && historyData.length > 0) {
    // 使用履歴を終了
    const { error } = await supabase
      .from('battery_usage_history')
      .update({ ended_at: now })
      .in('id', historyData.map(h => h.id));
      
    if (error) throw error;
  }
  
  return true;
}
