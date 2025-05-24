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
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">{t('device.select.settingTitle')}</h2>
                <p className="mt-1 text-sm text-gray-500">
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
