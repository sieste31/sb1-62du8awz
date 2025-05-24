// デバイスの電池スロットを表示するコンポーネント

import React from 'react';
import { Battery } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { BATTERY_STATUS_STYLES } from '@/components/Battery/constants';

type InstalledBattery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceBatterySlotProps {
  slotNumber: number;
  battery?: InstalledBattery;
}

export function DeviceBatterySlot({
  slotNumber,
  battery,
}: DeviceBatterySlotProps) {
  const { t } = useTranslation();

  // バッテリーが設定されていない場合のレンダリング
  if (!battery) {
    return (
      <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="mb-2 sm:mb-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs mr-2 flex-shrink-0">
                {slotNumber}
              </span>
              {t('device.batterySlot')} #{slotNumber}
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('device.status.notSet')}
            </p>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              {t('device.status.notSet')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // バッテリーステータスのスタイル取得
  const statusStyle = BATTERY_STATUS_STYLES[battery.status];
  const StatusIcon = statusStyle.icon;

  return (
    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div className="mb-2 sm:mb-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs mr-2 flex-shrink-0">
              {slotNumber}
            </span>
            {battery.battery_groups?.name} #{battery.slot_number}
          </h4>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span className="w-24 inline-block flex-shrink-0">{t('device.detail.lastCheck')}:</span>
              <span className="font-medium dark:text-gray-200">
                {battery.last_checked
                  ? new Date(battery.last_checked).toLocaleDateString()
                  : '---'}
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span className="w-24 inline-block flex-shrink-0">{t('device.detail.lastChange')}:</span>
              <span className="font-medium dark:text-gray-200">
                {battery.last_changed_at
                  ? new Date(battery.last_changed_at).toLocaleDateString()
                  : '---'}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.color.background} ${statusStyle.color.text}`}
          >
            <StatusIcon className="h-4 w-4 mr-1" />
            {t(`battery.status.${battery.status}`)}
          </span>
        </div>
      </div>
    </div>
  );
}
