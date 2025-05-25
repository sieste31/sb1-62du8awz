import type { Database } from '@/lib/database.types';

/**
 * 電池の状態を表す型
 * - charged: 満充電
 * - in_use: 使用中
 * - empty: 空
 * - disposed: 廃棄済み
 */
export type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

/**
 * 電池の種類を表す型
 * - disposable: 使い捨て
 * - rechargeable: 充電式
 */
export type BatteryKind = 'disposable' | 'rechargeable';

/**
 * 電池形状の定数
 */
export const BATTERY_SHAPES = ['単1形', '単2形', '単3形', '単4形', '単５形', 'LR44/SR44', 'CR2032', 'CR2025', 'CR2016', '9V形', 'その他'] as const;

/**
 * 電池形状の型
 */
export type BatteryShape = typeof BATTERY_SHAPES[number];

/**
 * 電池グループの拡張型
 * デバイス情報を含む電池グループの詳細な型定義
 */
export type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
    batteries?: (Battery & {
        devices?: Database['public']['Tables']['devices']['Row'] | null;
    })[];
};

/**
 * 電池の拡張型
 * デバイス情報を含む電池の詳細な型定義
 */
export type Battery = Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
};

/**
 * 電池作成時の状態型
 * createBatteryGroupWithBatteriesメソッドに合わせた型定義
 */
export type BatteryCreationStatus = 'charged' | 'empty';
