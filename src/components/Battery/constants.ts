import { BatteryStatus, BatteryKind, BatteryShape } from './types';
import { Battery, BatteryCharging, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

/**
 * 電池形状の選択肢
 * 翻訳キーと組み合わせて使用
 */
export const BATTERY_SHAPE_OPTIONS = [
    { value: '単1形', labelKey: 'battery.shape.d' },
    { value: '単2形', labelKey: 'battery.shape.c' },
    { value: '単3形', labelKey: 'battery.shape.aa' },
    { value: '単4形', labelKey: 'battery.shape.aaa' },
    { value: '9V形', labelKey: 'battery.shape.9v' },
] as const;

/**
 * 電池状態のスタイリング設定
 * 各状態に対するアイコン、色、テキストを定義
 */
export const BATTERY_STATUS_STYLES: Record<BatteryStatus, {
    icon: typeof Battery;
    color: {
        background: string;
        text: string;
    };
}> = {
    charged: {
        icon: BatteryCharging,
        color: {
            background: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-800 dark:text-green-300'
        }
    },
    in_use: {
        icon: BatteryMedium,
        color: {
            background: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-800 dark:text-blue-300'
        }
    },
    empty: {
        icon: BatteryLow,
        color: {
            background: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-800 dark:text-yellow-300'
        }
    },
    disposed: {
        icon: BatteryWarning,
        color: {
            background: 'bg-red-100 dark:bg-red-900/20',
            text: 'text-red-800 dark:text-red-300'
        }
    }
};

/**
 * 電池の種類に関する定数
 */
export const BATTERY_KIND_OPTIONS: Array<{
    value: BatteryKind;
    labelKey: string;
}> = [
        { value: 'disposable', labelKey: 'battery.kind.disposable' },
        { value: 'rechargeable', labelKey: 'battery.kind.rechargeable' }
    ];

/**
 * ユーザープランの制限に関する定数
 */
export const USER_PLAN_LIMITS = {
    FREE_MAX_BATTERY_GROUPS: 5,
    FREE_MAX_BATTERIES_PER_GROUP: 5
};
