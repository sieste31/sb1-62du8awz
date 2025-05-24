import type { Device } from '../types';

/**
 * 電池切れ予想日を計算する関数
 * @param device デバイス情報
 * @returns 電池切れ予想日（計算不可能な場合はnull）
 */
export function calculateBatteryEndDate(device: Device): Date | null {
    // 電池未設定の場合はnullを返す
    if (!device.last_battery_change || !device.has_batteries ||
        device.battery_life_weeks === null || device.battery_life_weeks === undefined) {
        return null;
    }

    const lastChange = new Date(device.last_battery_change);
    const endDate = new Date(lastChange);
    endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
    return endDate;
}

/**
 * デバイスの電池状態を判定する関数
 * @param device デバイス情報
 * @returns 電池状態（'overdue' | 'nearingEnd' | 'normal' | 'notSet'）
 */
export function getDeviceBatteryStatus(device: Device): 'overdue' | 'nearingEnd' | 'normal' | 'notSet' {
    const batteryEndDate = calculateBatteryEndDate(device);

    if (!batteryEndDate) return 'notSet';

    const today = new Date();
    const daysUntilEnd = (batteryEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (daysUntilEnd <= 0) return 'overdue';
    if (daysUntilEnd <= 7) return 'nearingEnd';
    return 'normal';
}

/**
 * デバイスのソート関数
 * @param devices デバイスリスト
 * @param sortOrder ソート順
 * @returns ソート済みデバイスリスト
 */
export function sortDevices(devices: Device[], sortOrder: string): Device[] {
    return [...devices].sort((a, b) => {
        switch (sortOrder) {
            case 'battery-end-asc':
            case 'battery-end-desc': {
                const dateA = calculateBatteryEndDate(a);
                const dateB = calculateBatteryEndDate(b);

                // nullハンドリング
                if (!dateA && !dateB) return 0;
                if (!dateA) return sortOrder === 'battery-end-asc' ? 1 : -1;
                if (!dateB) return sortOrder === 'battery-end-asc' ? -1 : 1;

                return sortOrder === 'battery-end-asc'
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
            }
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'last-change-asc':
            case 'last-change-desc': {
                // last_battery_changeのソート
                if (!a.last_battery_change && !b.last_battery_change) return 0;
                if (!a.last_battery_change) return sortOrder === 'last-change-asc' ? 1 : -1;
                if (!b.last_battery_change) return sortOrder === 'last-change-asc' ? -1 : 1;

                const dateA = new Date(a.last_battery_change).getTime();
                const dateB = new Date(b.last_battery_change).getTime();
                return sortOrder === 'last-change-asc' ? dateA - dateB : dateB - dateA;
            }
            default:
                return 0;
        }
    });
}

/**
 * デバイスをフィルタリングする関数
 * @param devices デバイスリスト
 * @param filters フィルター条件
 * @returns フィルタリング済みデバイスリスト
 */
export function filterDevices(devices: Device[], filters: {
    type?: string;
    batteryShape?: string;
    searchTerm?: string;
}): Device[] {
    return devices.filter(device => {
        const typeMatch = !filters.type || filters.type === 'all' || device.type === filters.type;
        const batteryShapeMatch = !filters.batteryShape || filters.batteryShape === 'all' || device.battery_shape === filters.batteryShape;
        const searchMatch = !filters.searchTerm ||
            device.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (device.notes && device.notes.toLowerCase().includes(filters.searchTerm.toLowerCase()));

        return typeMatch && batteryShapeMatch && searchMatch;
    });
}
