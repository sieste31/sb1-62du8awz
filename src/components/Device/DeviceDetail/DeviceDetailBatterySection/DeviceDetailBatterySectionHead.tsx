import React from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
    battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailBatterySectionHeadProps {
    device: Device;
    batteries: Battery[];
    onClickShowHistory: () => void;
}

export function DeviceDetailBatterySectionHead({ device, batteries, onClickShowHistory }: DeviceDetailBatterySectionHeadProps) {
    const { t } = useTranslation();
    const installedCount = batteries.length;
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">{t('device.batterySection')}</h3>
                <span className="ml-4 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {t('device.detail.installedBatteries', {
                        installed: installedCount,
                        remaining: device.battery_count - installedCount
                    })}
                </span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                    onClick={onClickShowHistory}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                    <History className="h-4 w-4 mr-1" />
                    {t('device.select.history')}
                </button>
                <Link
                    to={`/devices/${device.id}/select-battery`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    <Battery className="h-4 w-4 mr-2" />
                    {t('device.selectBattery')}
                </Link>
            </div>
        </div>
    );
};
