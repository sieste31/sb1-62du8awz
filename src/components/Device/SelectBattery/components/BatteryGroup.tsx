import { Component } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, BatteryGroup, Device, BatteryStatus } from '../types';
import { SelectedBatteries } from '../types';
import { BatteryStatusBadge } from '@/components/domain/battery/BatteryStatusBadge';
import { BatteryDataAdapter } from '@/lib/adapters/battery-data-adapter';
import type { BatteryStatus as LegacyBatteryStatus } from '@/components/Battery/types';

interface BatteryGroupProps {
    battery: Battery;
    group: BatteryGroup;
    device: Device;
    deviceId: string;
    selectedBatteries: SelectedBatteries;
    handleToggleBattery: (groupId: string, batteryId: string, status: BatteryStatus) => void;
}

export function BatteryGroups({
    battery,
    group,
    device,
    deviceId,
    selectedBatteries,
    handleToggleBattery
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
                ? 'border-blue-500 ring-2 ring-blue-500 dark:border-blue-600 dark:ring-blue-600'
                : isInstalledInOtherDevice
                    ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 cursor-not-allowed'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                } ${isDisabled && !isInstalledInOtherDevice
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                } bg-white dark:bg-dark-card`}
        >
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                    #{battery.slot_number}
                </p>
                <div className="mt-1">
                    <BatteryStatusBadge
                        status={BatteryDataAdapter.convertStatusToNew(battery.status as LegacyBatteryStatus)}
                        originalStatus={battery.status as LegacyBatteryStatus}
                        useTranslation={true}
                    />
                </div>
                {isInstalledInOtherDevice && battery.devices && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t('device.status.installedIn', { deviceName: battery.devices.name })}
                    </p>
                )}
            </div>
        </button>
    );
}
