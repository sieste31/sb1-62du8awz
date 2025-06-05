import React, { createContext, useContext } from 'react';
import { Database } from '@/lib/database.types';
import { Device as DeviceType, DeviceType as DeviceTypeValue } from '@/components/Device/types';
import { defaultDeviceImages } from '@/lib/deviceImages';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
    batteries?: (Database['public']['Tables']['batteries']['Row'] & {
        devices?: Database['public']['Tables']['devices']['Row'] | null;
    })[];
};

const DEMO_USER_ID = 'bc1b51a5-fe55-4597-9e5d-0a548be1ee69';

interface DemoModeContextType {
    batteryGroups: BatteryGroup[];
    devices: DeviceType[];
}

const DemoModeContext = createContext<DemoModeContextType>({
    batteryGroups: [],
    devices: [],
});

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
    // デモデータの定義
    const batteryGroups: BatteryGroup[] = [
        {
            id: 'demo-group-1',
            name: 'アルカリ単3電池グループ',
            shape: 'AA',
            type: 'alkaline',
            kind: 'rechargeable',
            count: 4,
            voltage: 1.5,
            notes: 'オフィス用の予備電池',
            image_url: null,
            created_at: new Date().toISOString(),
            user_id: DEMO_USER_ID,
            batteries: [
                {
                    id: 'demo-battery-1',
                    group_id: 'demo-group-1',
                    slot_number: 1,
                    status: 'in_use',
                    last_checked: new Date().toISOString(),
                    last_changed_at: new Date().toISOString(),
                    device_id: 'demo-device-1',
                    created_at: new Date().toISOString(),
                    user_id: DEMO_USER_ID,
                    devices: {
                        id: 'demo-device-1',
                        name: 'リモコン',
                        type: 'remotecontroller',
                        battery_shape: 'AA',
                        battery_count: 2,
                        battery_life_weeks: 12,
                        has_batteries: true,
                        created_at: new Date().toISOString(),
                        user_id: DEMO_USER_ID,
                        purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        notes: 'テレビ用リモコン',
                        last_battery_change: new Date().toISOString(),
                        image_url: defaultDeviceImages.remotecontroller,
                    }
                }
            ]
        },
        {
            id: 'demo-group-2',
            name: 'リチウムコイン電池グループ',
            shape: 'CR2032',
            type: 'lithium',
            kind: 'disposable',
            count: 5,
            voltage: 3.0,
            notes: '時計用の予備電池',
            image_url: null,
            created_at: new Date().toISOString(),
            user_id: DEMO_USER_ID,
            batteries: [
                {
                    id: 'demo-battery-3',
                    group_id: 'demo-group-2',
                    slot_number: 1,
                    status: 'in_use',
                    last_checked: new Date().toISOString(),
                    last_changed_at: new Date().toISOString(),
                    device_id: 'demo-device-2',
                    created_at: new Date().toISOString(),
                    user_id: DEMO_USER_ID,
                    devices: {
                        id: 'demo-device-2',
                        name: '腕時計',
                        type: 'remotecontroller',
                        battery_shape: 'CR2032',
                        battery_count: 1,
                        battery_life_weeks: 24,
                        has_batteries: true,
                        created_at: new Date().toISOString(),
                        user_id: DEMO_USER_ID,
                        purchase_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                        notes: 'デジタル腕時計',
                        last_battery_change: new Date().toISOString(),
                        image_url: defaultDeviceImages.remotecontroller,
                    }
                }
            ]
        }
    ];

    const devices: DeviceType[] = [
        {
            id: 'demo-device-1',
            name: 'リモコン',
            type: 'remotecontroller',
            battery_shape: 'AA',
            battery_count: 2,
            battery_life_weeks: 12,
            has_batteries: true,
            created_at: new Date().toISOString(),
            user_id: DEMO_USER_ID,
            purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'テレビ用リモコン',
            last_battery_change: new Date().toISOString(),
            image_url: defaultDeviceImages.remotecontroller,
        },
        {
            id: 'demo-device-2',
            name: '腕時計',
            type: 'remotecontroller',
            battery_shape: 'CR2032',
            battery_count: 1,
            battery_life_weeks: 24,
            has_batteries: true,
            created_at: new Date().toISOString(),
            user_id: DEMO_USER_ID,
            purchase_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'デジタル腕時計',
            last_battery_change: new Date().toISOString(),
            image_url: defaultDeviceImages.remotecontroller,
        }
    ];

    return (
        <DemoModeContext.Provider value={{ batteryGroups, devices }}>
            {children}
        </DemoModeContext.Provider>
    );
}

export function useDemoMode() {
    return useContext(DemoModeContext);
}
