import { Component } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, BatteryGroup, Device, BatteryStatus } from '../types';
import { SelectedBatteries } from '../types';
import { BatteryStatusBadge } from '@/components/Battery/BatteryStatusBadge';

// type BatteryStatus = string; // Replace with your actual BatteryStatus type

// interface Device {
//     id: number;
//     battery_count: number;
// }

// interface Battery {
//     id: number;
//     slot_number: number;
//     device_id: number | null;
//     status: BatteryStatus;
//     devices?: { name: string };
// }

interface BatteryGroupProps {
    battery: Battery;
    group: BatteryGroup;
    device: Device;
    deviceId: string;
    selectedBatteries: SelectedBatteries;
    handleToggleBattery: (groupId: string, batteryId: string, status: BatteryStatus) => void;
    // BatteryStatusBadge: React.ComponentType<{ status: BatteryStatus }>;
}

export function BatteryGroups({
    battery,
    group,
    device,
    deviceId,
    selectedBatteries,
    handleToggleBattery
    // BatteryStatusBadge,
}: BatteryGroupProps) {
    const { t } = useTranslation();
    const isSelected = selectedBatteries.some(
        (b) => b.batteryId === battery.id
    );
    const isInstalled = battery.device_id !== null;
    const isInstalledInOtherDevice =
        isInstalled && battery.device_id !== deviceId;
    const isDisabled =
        !isSelected &&
        (selectedBatteries.length >= device.battery_count ||
            isInstalledInOtherDevice);

    return (
        <button
            key={battery.id}
            onClick={() =>
                !isInstalledInOtherDevice &&
                handleToggleBattery(
                    group.id,
                    battery.id,
                    battery.status as BatteryStatus
                )
            }
            disabled={isDisabled}
            className={`relative flex items-center p-4 border rounded-lg ${isSelected
                ? 'border-blue-500 ring-2 ring-blue-500'
                : isInstalledInOtherDevice
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400'
                } ${isDisabled && !isInstalledInOtherDevice
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
        >
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                    #{battery.slot_number}
                </p>
                <div className="mt-1">
                    <BatteryStatusBadge
                        status={battery.status as BatteryStatus}
                    />
                </div>
                {isInstalledInOtherDevice && battery.devices && (
                    <p className="mt-1 text-xs text-gray-500">
                        {t('device.status.installedIn', { deviceName: battery.devices.name })}
                    </p>
                )}
            </div>
        </button>
    );

}