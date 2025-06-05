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
export async function getBatteryGroups(userId?: string) {
  let query = supabase
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

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as BatteryGroup[];
}

// 電池グループの取得（ID指定）
export async function getBatteryGroup(id: string, userId?: string) {
  let query = supabase
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
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data as BatteryGroup;
}

// 電池の取得
export async function getBatteries(groupId?: string, userId?: string) {
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

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Battery[];
}

// 利用可能な電池の取得
export async function getAvailableBatteries(batteryType: string, userId?: string): Promise<BatteryGroup[]> {
  let query = supabase
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
    .eq('shape', batteryType)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as BatteryGroup[];
}

// 電池の一括更新
export async function updateBatteries(
  batteryIds: string[],
  updates: Partial<Battery>
) {
  const { data, error } = await supabase
    .from('batteries')
    .update(updates)
    .in('id', batteryIds)
    .select();

  if (error) throw error;
  return data as Battery[];
}

// 電池の更新
export async function updateBattery(
  batteryId: string,
  updates: Partial<Battery>
) {
  const { data, error } = await supabase
    .from('batteries')
    .update(updates)
    .eq('id', batteryId)
    .select()
    .single();

  if (error) throw error;
  return data as Battery;
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

// 電池の作成
export async function createBatteries(data: BatteryInsert[]) {
  const { data: batteriesData, error } = await supabase
    .from('batteries')
    .insert(data)
    .select();

  if (error) throw error;
  return batteriesData as Battery[];
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

// 電池の状態更新
export async function updateBatteryStatus(
  batteryId: string,
  status: BatteryStatus
) {
  const { data, error } = await supabase
    .from('batteries')
    .update({
      status,
      last_checked: new Date().toISOString()
    })
    .eq('id', batteryId)
    .select()
    .single();

  if (error) throw error;
  return data as Battery;
}

// 電池のステータス数を取得
export async function getBatteryStatusCounts(userId?: string) {
  let query = supabase
    .from('batteries')
    .select('status', { count: 'exact' });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { count, error } = await query;

  if (error) throw error;
  return count;
}

// デバイスから電池を取り外す
export async function removeBatteryFromDevice(batteryId: string) {
  const { data, error } = await supabase
    .from('batteries')
    .update({
      device_id: null,
      status: 'empty',
      last_changed_at: new Date().toISOString()
    })
    .eq('id', batteryId)
    .select()
    .single();

  if (error) throw error;
  return data as Battery;
}
