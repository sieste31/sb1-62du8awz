import { supabase } from '../supabase';
import type { Database } from '../database.types';

type UserPlan = Database['public']['Tables']['user_plans']['Row'];
type UserPlanInsert = Database['public']['Tables']['user_plans']['Insert'];
type UserPlanUpdate = Database['public']['Tables']['user_plans']['Update'];

// ユーザープランの取得
export async function getUserPlan(userId: string) {
  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    // ユーザープランが見つからない場合は、デフォルト値を返す
    if (error.code === 'PGRST116') {
      return {
        id: '',
        user_id: userId,
        plan_type: 'free' as const,
        max_battery_groups: 5,
        max_devices: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    throw error;
  }
  
  return data as UserPlan;
}

// ユーザープランの作成
export async function createUserPlan(data: UserPlanInsert) {
  const { data: planData, error } = await supabase
    .from('user_plans')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return planData as UserPlan;
}

// ユーザープランの更新
export async function updateUserPlan(userId: string, data: UserPlanUpdate) {
  const { data: updatedData, error } = await supabase
    .from('user_plans')
    .update(data)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return updatedData as UserPlan;
}

// ユーザープランの制限チェック
export function isLimitReached(userPlan: UserPlan, type: 'batteryGroups' | 'devices', currentCount: number) {
  if (type === 'batteryGroups') {
    return currentCount >= userPlan.max_battery_groups;
  } else {
    return currentCount >= userPlan.max_devices;
  }
}
