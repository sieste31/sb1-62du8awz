import { BatteryGroup, Battery, BatteryStatus } from '../types';
import { USER_PLAN_LIMITS } from '../constants';

/**
 * 電池グループ内の電池状態別カウントを取得
 * @param batteryGroup 電池グループ
 * @returns 各状態の電池数
 */
export function getBatteryStatusCounts(batteryGroup: BatteryGroup): Record<BatteryStatus, number> {
    if (!batteryGroup.batteries) {
        return {
            charged: 0,
            in_use: 0,
            empty: 0,
            disposed: 0
        };
    }

    return batteryGroup.batteries.reduce((counts, battery) => {
        const status = battery.status as BatteryStatus;
        counts[status]++;
        return counts;
    }, {
        charged: 0,
        in_use: 0,
        empty: 0,
        disposed: 0
    });
}

/**
 * デバイス別の電池数を集計
 * @param batteryGroup 電池グループ
 * @returns デバイスごとの電池数と詳細
 */
export function getDeviceBatteryCounts(batteryGroup: BatteryGroup): Array<{
    deviceId: string;
    deviceName: string;
    batteryCount: number;
}> {
    if (!batteryGroup.batteries) return [];

    const deviceCounts: Record<string, { deviceName: string; batteryCount: number }> = {};

    batteryGroup.batteries
        .filter(battery => battery.device_id && battery.devices)
        .forEach(battery => {
            const deviceId = battery.device_id as string;
            const deviceName = battery.devices?.name || '';

            if (!deviceCounts[deviceId]) {
                deviceCounts[deviceId] = { deviceName, batteryCount: 0 };
            }
            deviceCounts[deviceId].batteryCount++;
        });

    return Object.entries(deviceCounts).map(([deviceId, details]) => ({
        deviceId,
        deviceName: details.deviceName,
        batteryCount: details.batteryCount
    }));
}

/**
 * ユーザープランの制限をチェック
 */
export class UserPlanLimitChecker {
    /**
     * 電池グループ数の制限をチェック
     * @param currentGroupCount 現在の電池グループ数
     * @param planType ユーザープランの種類
     * @returns 制限に達しているかどうか
     */
    static checkBatteryGroupLimit(
        currentGroupCount: number,
        planType: 'free' | 'premium' | 'business' = 'free'
    ): boolean {
        switch (planType) {
            case 'free':
                return currentGroupCount >= USER_PLAN_LIMITS.FREE_MAX_BATTERY_GROUPS;
            case 'premium':
                return currentGroupCount >= 10; // プレミアムプランの制限（仮）
            case 'business':
                return currentGroupCount >= 50; // ビジネスプランの制限（仮）
            default:
                return false;
        }
    }

    /**
     * 電池グループ内の電池数の制限をチェック
     * @param currentBatteryCount 現在の電池数
     * @param planType ユーザープランの種類
     * @returns 制限に達しているかどうか
     */
    static checkBatteriesPerGroupLimit(
        currentBatteryCount: number,
        planType: 'free' | 'premium' | 'business' = 'free'
    ): boolean {
        switch (planType) {
            case 'free':
                return currentBatteryCount >= USER_PLAN_LIMITS.FREE_MAX_BATTERIES_PER_GROUP;
            case 'premium':
                return currentBatteryCount >= 10; // プレミアムプランの制限（仮）
            case 'business':
                return currentBatteryCount >= 50; // ビジネスプランの制限（仮）
            default:
                return false;
        }
    }
}
