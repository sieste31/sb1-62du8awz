import { BatteryGroup, Battery, BatteryStatus } from '../types';
import { isLimitReached, UserPlanType } from '../../../lib/planUtils';

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
     * @param userPlan ユーザープラン情報
     * @returns 制限に達しているかどうか
     */
    static checkBatteryGroupLimit(
        currentGroupCount: number,
        userPlan: UserPlanType
    ): boolean {
        return isLimitReached(currentGroupCount,
            { ...userPlan, max_devices: 5 },
            'batteryGroups'
        );
    }

    /**
     * 電池グループ内の電池数の制限をチェック
     * @param currentBatteryCount 現在の電池数
     * @param userPlan ユーザープラン情報
     * @returns 制限に達しているかどうか
     */
    static checkBatteriesPerGroupLimit(
        currentBatteryCount: number,
        userPlan: UserPlanType
    ): boolean {
        return isLimitReached(currentBatteryCount,
            { ...userPlan, max_devices: 5 },
            'batteryGroups'
        );
    }
}
