import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type DeviceInsert = Database['public']['Tables']['devices']['Insert'];
type DeviceUpdate = Database['public']['Tables']['devices']['Update'];

type Battery = Database['public']['Tables']['batteries']['Row'];

// デバイス一覧の取得
export async function getDevices(userId?: string) {
  let query = supabase
    .from('devices')
    .select(`
      *,
      batteries (
        *,
        battery_groups (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Device[];
}

// 特定のデバイスの取得
export async function getDevice(id: string, userId?: string) {
  let query = supabase
    .from('devices')
    .select(`
      *,
      batteries (
        *,
        battery_groups (*)
      )
    `)
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data as Device;
}

// デバイスに装着されている電池の取得
export async function getDeviceBatteries(deviceId: string, userId?: string) {
  let query = supabase
    .from('batteries')
    .select(`
      *,
      battery_groups (*),
      devices (*)
    `)
    .eq('device_id', deviceId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Battery[];
}

// デバイスの作成
export async function createDevice(data: DeviceInsert) {
  const { data: deviceData, error } = await supabase
    .from('devices')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return deviceData as Device;
}

// デバイスの更新
export async function updateDevice(id: string, data: DeviceUpdate) {
  const { data: updatedData, error } = await supabase
    .from('devices')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedData as Device;
}

// デバイスの削除
export async function deleteDevice(id: string) {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// デバイスから電池を取り外す
export async function removeBatteriesFromDevice(deviceId: string) {
  try {
    // 現在時刻を取得
    const now = new Date().toISOString();

    // 1. デバイスに装着されている電池を取得
    const { data: batteries, error: batteriesError } = await supabase
      .from('batteries')
      .select('id')
      .eq('device_id', deviceId);

    if (batteriesError) {
      console.error('電池取得エラー:', batteriesError);
      throw batteriesError;
    }

    if (batteries.length === 0) return true; // 電池が既に存在しない場合は何もしない

    const batteryIds = batteries.map(battery => battery.id);

    // トランザクションを使用して、電池と デバイスの状態を一括更新
    const { error } = await supabase.rpc('remove_batteries_from_device', {
      p_dev_id: deviceId,
      p_battery_ids: batteryIds,
      p_timestamp: now
    });

    if (error) {
      console.error('電池取り外しエラー:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('電池取り外し処理エラー:', error);
    throw error;
  }
}

// デバイスの最終電池交換日を更新
export async function updateDeviceBatteryChange(deviceId: string) {
  const now = new Date().toISOString();

  const { error } = await supabase
    .from('devices')
    .update({
      last_battery_change: now
    })
    .eq('id', deviceId);

  if (error) throw error;
  return true;
}

// デバイスに電池を追加
export async function addBatteryToDevice(deviceId: string, batteryId: string) {
  try {
    // 現在時刻を取得
    const now = new Date().toISOString();

    // トランザクション関数を使用して、電池とデバイスの状態を一括更新
    const { error } = await supabase.rpc('add_battery_to_device', {
      p_dev_id: deviceId,
      p_battery_id: batteryId,
      p_timestamp: now
    });

    if (error) throw error;

    return true;
  } catch (err) {
    console.error('電池追加エラー:', err);
    throw err;
  }
}

// デバイスの電池使用履歴を取得
export async function getDeviceUsageHistory(deviceId: string) {
  const { data, error } = await supabase
    .from('battery_usage_history')
    .select(`
      *,
      batteries (
        *,
        battery_groups (*)
      ),
      devices (*)
    `)
    .eq('device_id', deviceId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}
