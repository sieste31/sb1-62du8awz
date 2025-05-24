import React from 'react';
import type { Database } from '@/lib/database.types';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { useTranslation } from 'react-i18next';

export function DeviceInfoSection({
    device,
    batteryShape
}: {
    device: Database['public']['Tables']['devices']['Row'],
    batteryShape: string
}) {
    const batteryTypeKey = batteryShapeToTranslationKey(batteryShape);
    const { t } = useTranslation();
    return (
        <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">{t('device.select.settingTitle')}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('device.select.settingDescription', {
                        deviceName: device.name,
                        batteryType: t(batteryTypeKey),
                        count: device.battery_count
                    })}
                </p>
            </div>
        </div>
    );
}
