import { supabase } from '../supabase';
import { PLAN_BONUS } from '../planUtils';

type SupabasePlanType = 'free' | 'premium' | 'business';
type AppPlanType = 'free' | 'standard' | 'pro';

export interface PlanLimits {
  max_battery_groups: number;
  max_devices: number;
  plan_type: AppPlanType;
}

function convertPlanType(planType: SupabasePlanType): AppPlanType {
  switch (planType) {
    case 'premium':
      return 'standard';
    case 'business':
      return 'pro';
    default:
      return planType;
  }
}

export function isLimitReached(
  currentCount: number,
  userPlan: PlanLimits,
  type: 'batteryGroups' | 'devices'
): boolean {
  const bonus = PLAN_BONUS[userPlan.plan_type];
  const limit = type === 'batteryGroups'
    ? userPlan.max_battery_groups + bonus.batteryGroups
    : userPlan.max_devices + bonus.devices;

  return currentCount >= limit;
}

export async function getUserPlan(userId: string): Promise<PlanLimits> {
  const { data, error } = await supabase
    .from('user_plans')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return {
    max_battery_groups: data.max_battery_groups,
    max_devices: data.max_devices,
    plan_type: convertPlanType(data.plan_type)
  };
}

export async function updateUserPlan(userId: string, planType: AppPlanType) {
  const supbasePlanType = planType === 'standard' ? 'premium' :
    planType === 'pro' ? 'business' :
      planType;

  const { data, error } = await supabase
    .from('user_plans')
    .update({ plan_type: supbasePlanType })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    max_battery_groups: data.max_battery_groups,
    max_devices: data.max_devices,
    plan_type: convertPlanType(data.plan_type)
  };
}
