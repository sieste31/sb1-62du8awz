import type { Database } from '@/lib/database.types';

export type Battery = Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
    slot_number: number;
};

export type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
    batteries?: (Battery & {
        devices?: Database['public']['Tables']['devices']['Row'] | null;
    })[];
};

export type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';
export type BatteryKind = 'all' | 'disposable' | 'rechargeable';

export type Device = Database['public']['Tables']['devices']['Row'] & {
    battery_count: number;
};
export type SelectedBatteries = Array<{ groupId: string; batteryId: string; status: BatteryStatus }>;