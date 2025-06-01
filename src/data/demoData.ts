import { Database } from '@/lib/database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'];
type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'];

export const demoBatteryGroups: BatteryGroup[] = [
    {
        id: 'demo-group-1',
        name: 'リモコン用単3電池',
        shape: '単3形',
        type: '単3形',
        kind: 'rechargeable',
        count: 4,
        voltage: 1.2,
        notes: 'リモコン用の充電池セット',
        image_url: null,
        created_at: new Date().toISOString(),
        user_id: 'demo-user'
    },
    {
        id: 'demo-group-2',
        name: 'カメラ用単4電池',
        shape: '単4形',
        type: '単4形',
        kind: 'disposable',
        count: 3,
        voltage: 1.5,
        notes: 'デジタルカメラ用電池',
        image_url: null,
        created_at: new Date().toISOString(),
        user_id: 'demo-user'
    }
];

export const demoBatteries: Battery[] = [
    {
        id: 'demo-battery-1',
        group_id: 'demo-group-1',
        slot_number: 1,
        status: 'charged',
        last_checked: new Date().toISOString(),
        last_changed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        device_id: 'demo-device-1',
        created_at: new Date().toISOString(),
        user_id: 'demo-user'
    },
    {
        id: 'demo-battery-2',
        group_id: 'demo-group-1',
        slot_number: 2,
        status: 'in_use',
        last_checked: new Date().toISOString(),
        last_changed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        device_id: 'demo-device-1',
        created_at: new Date().toISOString(),
        user_id: 'demo-user'
    }
];

export const demoDevices: Device[] = [
    {
        id: 'demo-device-1',
        name: 'テレビリモコン',
        type: 'remotecontroller',
        battery_shape: '単3形',
        battery_count: 2,
        battery_life_weeks: 12,
        purchase_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        notes: '家のテレビ用リモコン',
        image_url: null,
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
        last_battery_change: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        has_batteries: true
    },
    {
        id: 'demo-device-2',
        name: 'デジタルカメラ',
        type: 'camera',
        battery_shape: '単4形',
        battery_count: 2,
        battery_life_weeks: 8,
        purchase_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        notes: '家族の思い出用カメラ',
        image_url: null,
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
        last_battery_change: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        has_batteries: true
    }
];
