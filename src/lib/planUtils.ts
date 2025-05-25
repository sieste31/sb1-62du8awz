export const PLAN_BONUS = {
    free: { batteryGroups: 0, devices: 0 },
    standard: { batteryGroups: 20, devices: 20 },
    pro: { batteryGroups: 45, devices: 45 }
};

export interface PlanLimits {
    max_battery_groups: number;
    max_devices: number;
    plan_type: 'free' | 'standard' | 'pro';
}

export type UserPlanType = Pick<PlanLimits, 'max_battery_groups' | 'plan_type'>;

export function getActualPlanLimits(userPlan: PlanLimits) {
    const bonus = PLAN_BONUS[userPlan.plan_type];
    return {
        batteryGroups: userPlan.max_battery_groups + bonus.batteryGroups,
        devices: userPlan.max_devices + bonus.devices
    };
}

export function isLimitReached(
    currentCount: number,
    userPlan: PlanLimits,
    type: 'batteryGroups' | 'devices'
): boolean {
    const actualLimits = getActualPlanLimits(userPlan);
    const limit = type === 'batteryGroups'
        ? actualLimits.batteryGroups
        : actualLimits.devices;

    return currentCount >= limit;
}
