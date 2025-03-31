import { supabase } from '../supabase';
import type { Database } from '../database.types';
import { endDeviceCurrentUsageHistory } from './batteryUsageHistory';
import { updateDeviceBatteryChange, removeBatteriesFromDevice } from './devices';
import { updateBatteries } from './batteries';
import { createBatteryUsageHistory } from './batteryUsageHistory';

// デバイスに電池を割り当てる複合操作
export async function assignBatteriesToDevice(
  deviceId: string,
  batteryIds: string[],
  userId: string
) {
  const now = new Date().toISOString();
  
  try {
    // 1. 既存の電池の使用履歴を終了
    await endDeviceCurrentUsageHistory(deviceId);
    
    // 2. 既存の電池を取り外し
    await removeBatteriesFromDevice(deviceId);
    
    if (batteryIds.length > 0) {
      // 3. デバイスの最終電池交換日を更新
      await updateDeviceBatteryChange(deviceId);
      
      // 4. 選択された電池を設定
      await updateBatteries(
        batteryIds,
        {
          device_id: deviceId,
          status: 'in_use',
          last_checked: now,
          last_changed_at: now,
        }
      );
      
      // 5. 使用履歴を記録
      const historyRecords = batteryIds.map(batteryId => ({
        battery_id: batteryId,
        device_id: deviceId,
        started_at: now,
        user_id: userId,
      }));
      
      await createBatteryUsageHistory(historyRecords);
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning batteries to device:', error);
    throw error;
  }
}

// 電池グループと電池を一括で作成する複合操作
export async function createBatteryGroupWithBatteries(
  groupData: Database['public']['Tables']['battery_groups']['Insert'],
  count: number,
  status: 'charged' | 'empty',
  userId: string
) {
  try {
    // 1. 電池グループを作成
    const { data: createdGroup, error: groupError } = await supabase
      .from('battery_groups')
      .insert(groupData)
      .select()
      .single();

    if (groupError) throw groupError;

    // 2. 個々の電池を作成
    const batteries = Array.from({ length: count }, () => ({
      group_id: createdGroup.id,
      status: groupData.kind === 'disposable' ? 'empty' : status,
      user_id: userId,
    }));

    const { error: batteriesError } = await supabase
      .from('batteries')
      .insert(batteries);

    if (batteriesError) throw batteriesError;

    return createdGroup;
  } catch (error) {
    console.error('Error creating battery group with batteries:', error);
    throw error;
  }
}
