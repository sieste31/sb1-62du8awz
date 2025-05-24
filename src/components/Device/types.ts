import type { Database } from '@/lib/database.types';
import { DEVICE_TYPE_OPTIONS } from './constants';

/**
 * デバイスの基本型
 * データベースのデバイステーブルの行型を拡張
 */
export type Device = Database['public']['Tables']['devices']['Row'] & {
    battery_count: number;
    has_batteries?: boolean;
};

/**
 * デバイスタイプの型
 * 定数から動的に生成
 */
export type DeviceType = typeof DEVICE_TYPE_OPTIONS[number]['value'];

/**
 * デバイスフィルタの型
 * デバイス一覧画面でのフィルタリングに使用
 */
export type DeviceFilter = {
    type: DeviceType | 'all';
    batteryShape: string | 'all';
    searchTerm: string;
};

/**
 * デバイス作成時のフォームデータ型
 * デバイス作成画面で使用するデータ構造
 */
export type DeviceFormData = {
    name: string;
    type: DeviceType;
    batteryShape: string;
    batteryCount: number;
    batteryLifeWeeks: number | null;
    purchaseDate: string | null;
    notes: string | null;
};

/**
 * デバイスソートオプションの型
 * デバイス一覧画面でのソート順に使用
 */
export type DeviceSortOrder =
    | 'none'
    | 'battery-end-asc'
    | 'battery-end-desc'
    | 'name-asc'
    | 'name-desc'
    | 'last-change-asc'
    | 'last-change-desc';
