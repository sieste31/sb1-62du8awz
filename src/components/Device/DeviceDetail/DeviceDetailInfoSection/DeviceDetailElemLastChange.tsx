// デバイス詳細画面の最終電池交換日の表示を担当するコンポーネント

import React from 'react';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemText } from '@/components/common/DetailInfoElemText';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailElemLastChangeProps {
  device: Device;
  batteries?: Battery[];
}

export function DeviceDetailElemLastChange({ device, batteries = [] }: DeviceDetailElemLastChangeProps) {
  const { t } = useTranslation();
  const calculateBatteryEndDate = useDeviceDetailStore(state => state.calculateBatteryEndDate);

  const batteryEndDate = calculateBatteryEndDate(device);
  const today = new Date();
  const daysUntilEnd = batteryEndDate
    ? (new Date(batteryEndDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    : null;
  const isOverdue = daysUntilEnd !== null && daysUntilEnd <= 0;
  const isNearingEnd = daysUntilEnd !== null && daysUntilEnd > 0 && daysUntilEnd <= 7;
  const hasBatteriesFullInstalled = device.battery_count > 0 && batteries.length === device.battery_count;

  return (
    <div>
      <DetailInfoElemHead title={t('device.detail.lastChange')} />
      <dd className="mt-1">
        <div className="flex items-center">
          <DetailInfoElemText>
            {device.last_battery_change
              ? new Date(device.last_battery_change).toLocaleDateString()
              : '---'}
          </DetailInfoElemText>
        </div>

        {batteryEndDate && hasBatteriesFullInstalled && (
          <div className="mt-2 text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isOverdue
              ? 'bg-red-100 text-red-800'
              : isNearingEnd
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
              }`}>
              {t('device.status.scheduleDate', { date: batteryEndDate.toLocaleDateString() })}
              {isOverdue && ` (${t('device.status.overdue')})`}
              {isNearingEnd && ` (${t('device.status.soon')})`}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
