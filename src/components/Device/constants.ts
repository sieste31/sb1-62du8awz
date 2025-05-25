import { Smartphone, Radio, Camera, Gamepad, Lightbulb, ToyBrick, HelpCircle, Pencil, Speaker } from 'lucide-react';
import type { Database } from '@/lib/database.types';

/**
 * デバイスタイプのアイコンマップ
 * デバイスタイプに対応するLucideアイコンを定義
 */
export const DEVICE_TYPE_ICONS = {
    remotecontroller: Radio,
    speaker: Speaker,
    camera: Camera,
    gadget: Gamepad,
    light: Lightbulb,
    toy: ToyBrick,
    other: Pencil,
} as const;

/**
 * デバイスタイプの選択肢
 * 翻訳キーと組み合わせて使用
 */
export const DEVICE_TYPE_OPTIONS = [
    { value: 'remotecontroller', labelKey: 'device.types.remotecontroller', icon: Radio },
    { value: 'speaker', labelKey: 'device.types.speaker', icon: Speaker },
    { value: 'camera', labelKey: 'device.types.camera', icon: Camera },
    { value: 'gadget', labelKey: 'device.types.gadget', icon: Gamepad },
    { value: 'light', labelKey: 'device.types.light', icon: Lightbulb },
    { value: 'toy', labelKey: 'device.types.toy', icon: ToyBrick },
    { value: 'other', labelKey: 'device.types.other', icon: Pencil },
] as const;

/**
 * デバイス状態のスタイリング設定
 * 電池切れ予想日に基づく状態のスタイリングを定義
 */
export const DEVICE_BATTERY_STATUS_STYLES = {
    overdue: {
        color: {
            background: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-400'
        }
    },
    nearingEnd: {
        color: {
            background: 'bg-yellow-50 dark:bg-yellow-900/20',
            text: 'text-yellow-700 dark:text-yellow-400'
        }
    },
    normal: {
        color: {
            background: 'bg-blue-50 dark:bg-blue-900/20',
            text: 'text-blue-700 dark:text-blue-400'
        }
    },
    notSet: {
        color: {
            background: 'bg-gray-50 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-300'
        }
    }
};

/**
 * ユーザープラン制限に関する定数
 * デバイス数の制限を定義
 */
export const USER_PLAN_DEVICE_LIMITS = {
    FREE_MAX_DEVICES: 5,
    STANDARD_MAX_DEVICES: 25,
    PRO_MAX_DEVICES: 50
};

/**
 * デバイスタイプの型
 */
export type DeviceType = typeof DEVICE_TYPE_OPTIONS[number]['value'];
