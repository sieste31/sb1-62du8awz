import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type DeviceInsert = Database['public']['Tables']['devices']['Insert'];
type DeviceUpdate = Database['public']['Tables']['devices']['Update'];

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

// デバイスの取得
export async function getDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Device[];
}

// デバイスの取得（ID指定）
export async function getDevice(id: string) {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Device;
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

// デバイスに設置されている電池の取得
export async function getDeviceBatteries(deviceId: string) {
  const { data, error } = await supabase
    .from('batteries')
    .select(`
      *,
      battery_groups (*)
    `)
    .eq('device_id', deviceId)
    .order('slot_number', { ascending: true });

  if (error) throw error;
  return data as Battery[];
}

// デバイスの電池交換日を更新
export async function updateDeviceBatteryChange(deviceId: string) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('devices')
    .update({
      last_battery_change: now,
    })
    .eq('id', deviceId)
    .select()
    .single();

  if (error) throw error;
  return data as Device;
}

// デバイスから電池を取り外す
export async function removeBatteriesFromDevice(deviceId: string) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('batteries')
    .update({
      device_id: null,
      status: 'empty',
      last_checked: now,
    })
    .eq('device_id', deviceId)
    .select();

  if (error) throw error;
  return data as Battery[];
}
