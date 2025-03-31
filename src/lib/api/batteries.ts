import { supabase } from '../supabase';
import type { Database } from '../database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];
type BatteryGroupInsert = Database['public']['Tables']['battery_groups']['Insert'];
type BatteryGroupUpdate = Database['public']['Tables']['battery_groups']['Update'];

type Battery = Database['public']['Tables']['batteries']['Row'];
type BatteryInsert = Database['public']['Tables']['batteries']['Insert'];
type BatteryUpdate = Database['public']['Tables']['batteries']['Update'];

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

// 電池グループの取得
export async function getBatteryGroups() {
  const { data, error } = await supabase
    .from('battery_groups')
    .select(`
      *,
      batteries (
        *,
        devices (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BatteryGroup[];
}

// 電池グループの取得（ID指定）
export async function getBatteryGroup(id: string) {
  const { data, error } = await supabase
    .from('battery_groups')
    .select(`
      *,
      batteries (
        *,
        devices (
          *
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as BatteryGroup;
}

// 電池グループの作成
export async function createBatteryGroup(data: BatteryGroupInsert) {
  const { data: groupData, error } = await supabase
    .from('battery_groups')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return groupData as BatteryGroup;
}

// 電池グループの更新
export async function updateBatteryGroup(id: string, data: BatteryGroupUpdate) {
  const { data: updatedData, error } = await supabase
    .from('battery_groups')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedData as BatteryGroup;
}

// 電池グループの削除
export async function deleteBatteryGroup(id: string) {
  const { error } = await supabase
    .from('battery_groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// 電池の取得
export async function getBatteries(groupId?: string) {
  let query = supabase
    .from('batteries')
    .select(`
      *,
      battery_groups (*),
      devices (*)
    `);
    
  if (groupId) {
    query = query.eq('group_id', groupId);
  }
  
  const { data, error } = await query;

  if (error) throw error;
  return data as Battery[];
}

// 電池の作成
export async function createBatteries(batteries: BatteryInsert[]) {
  const { data, error } = await supabase
    .from('batteries')
    .insert(batteries)
    .select();

  if (error) throw error;
  return data as Battery[];
}

// 電池の更新
export async function updateBattery(id: string, data: BatteryUpdate) {
  const { data: updatedData, error } = await supabase
    .from('batteries')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return updatedData as Battery;
}

// 複数電池の更新
export async function updateBatteries(batteryIds: string[], data: BatteryUpdate) {
  if (batteryIds.length === 0) return [];
  
  const { data: updatedData, error } = await supabase
    .from('batteries')
    .update(data)
    .in('id', batteryIds)
    .select();

  if (error) throw error;
  return updatedData as Battery[];
}

// 電池の削除
export async function deleteBattery(id: string) {
  const { error } = await supabase
    .from('batteries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// 利用可能な電池の取得
export async function getAvailableBatteries(batteryType: string) {
  const { data, error } = await supabase
    .from('battery_groups')
    .select(`
      id,
      name,
      shape,
      type,
      kind,
      count,
      voltage,
      notes,
      image_url,
      created_at,
      user_id,
      batteries!inner (
        id,
        group_id,
        slot_number,
        status,
        last_checked,
        last_changed_at,
        device_id,
        created_at,
        user_id,
        devices:device_id (
          id,
          name
        )
      )
    `)
    .eq('type', batteryType)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BatteryGroup[];
}

// 電池の状態を更新
export async function updateBatteryStatus(
  batteryId: string, 
  newStatus: BatteryStatus
) {
  const now = new Date().toISOString();
  const updates: {
    status: string;
    last_checked: string;
    last_changed_at?: string;
  } = {
    status: newStatus,
    last_checked: now,
  };

  // 充電済みまたは使用中に変更する場合は交換日も更新
  if (newStatus === 'charged' || newStatus === 'in_use') {
    updates.last_changed_at = now;
  }

  const { data, error } = await supabase
    .from('batteries')
    .update(updates)
    .eq('id', batteryId)
    .select();

  if (error) throw error;
  return data;
}

// 電池の状態別カウントと設置状況を取得
export async function getBatteryStatusCounts(groupId: string) {
  const { data, error } = await supabase
    .from('batteries')
    .select('status, device_id')
    .eq('group_id', groupId);
  
  if (error) throw error;
  
  // 状態別のカウントを計算
  const counts = {
    charged: 0,
    in_use: 0,
    empty: 0,
    disposed: 0
  };
  
  data?.forEach(battery => {
    if (battery.status in counts) {
      counts[battery.status as keyof typeof counts]++;
    }
  });
  
  // 設置済み電池数も計算
  const installed = data?.filter(b => b.device_id !== null).length || 0;
  
  return { counts, installed };
}

// 電池をデバイスから取り外す
export async function removeBatteryFromDevice(batteryId: string) {
  try {
    // 現在時刻を取得
    const now = new Date().toISOString();
    
    // 電池情報を取得
    const { data: batteryData, error: batteryError } = await supabase
      .from('batteries')
      .select('device_id')
      .eq('id', batteryId)
      .single();
      
    if (batteryError) throw batteryError;
    if (!batteryData.device_id) return false; // すでにデバイスに設定されていない場合は何もしない
    
    const deviceId = batteryData.device_id;
    
    // 1. 電池の状態を更新
    const { error: updateBatteryError } = await supabase
      .from('batteries')
      .update({
        device_id: null,
        status: 'empty',
        last_changed_at: now
      })
      .eq('id', batteryId);
      
    if (updateBatteryError) throw updateBatteryError;
    
    // 2. 使用履歴を更新
    const { error: updateHistoryError } = await supabase
      .from('battery_usage_history')
      .update({
        ended_at: now
      })
      .eq('battery_id', batteryId)
      .is('ended_at', null);
      
    if (updateHistoryError) throw updateHistoryError;
    
    // 3. デバイスの電池装着状態を確認・更新
    const { data: deviceBatteries, error: deviceBatteriesError } = await supabase
      .from('batteries')
      .select('id')
      .eq('device_id', deviceId);
      
    if (deviceBatteriesError) throw deviceBatteriesError;
    
    // 取り外し後の電池数が0の場合、デバイスのhas_batteriesをfalseに更新
    if (deviceBatteries.length <= 1) { // 現在の電池を含めて1以下なら、取り外し後は0になる
      const { error: updateDeviceError } = await supabase
        .from('devices')
        .update({
          has_batteries: false
        })
        .eq('id', deviceId);
        
      if (updateDeviceError) throw updateDeviceError;
    }
    
    return true;
  } catch (err) {
    console.error('電池取り外しエラー:', err);
    throw err;
  }
}
