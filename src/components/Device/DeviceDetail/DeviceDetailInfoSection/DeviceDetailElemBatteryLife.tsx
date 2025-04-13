// デバイス詳細画面の電池寿命の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';
import { Clock } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemText } from '@/components/common/DetailInfoElemText';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailElemBatteryLifeProps {
  device: Device;
}

export function DeviceDetailElemBatteryLife({ device }: DeviceDetailElemBatteryLifeProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);

  if (!editData) return null;

  return (
    <div>
      <DetailInfoElemHead title={t('device.detail.batteryLife')} />
      <dd className="mt-1">
        {isEditing ? (
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              min="1"
              value={editData.batteryLifeWeeks}
              onChange={(e) =>
                setEditData({
                  batteryLifeWeeks: e.target.value,
                })
              }
              className="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-8"
              placeholder={t('device.detail.batteryLifePlaceholder')}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{t('device.detail.weeks')}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <DetailInfoElemText>
              {device.battery_life_weeks ? t('device.detail.weeksValue', { weeks: device.battery_life_weeks }) : '---'}
            </DetailInfoElemText>
          </div>
        )}
      </dd>
    </div>
  );
}
