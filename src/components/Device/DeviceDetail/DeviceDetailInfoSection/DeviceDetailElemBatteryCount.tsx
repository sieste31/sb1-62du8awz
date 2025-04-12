// デバイス詳細画面の必要本数の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';
import { Hash } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailElemBatteryCountProps {
  device: Device;
  batteries?: Battery[];
}

export function DeviceDetailElemBatteryCount({ device, batteries = [] }: DeviceDetailElemBatteryCountProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  
  const installedCount = batteries.length;
  const hasBatteriesInstalled = installedCount > 0;

  if (!editData) return null;

  return (
    <div>
      <DetailInfoElemHead title={t('device.detail.batteryCount')} />
      <dd className="mt-1">
        {isEditing ? (
          <div>
            <input
              type="number"
              min="1"
              value={editData.batteryCount}
              onChange={(e) =>
                setEditData({
                  batteryCount: parseInt(e.target.value),
                })
              }
              disabled={hasBatteriesInstalled}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                hasBatteriesInstalled ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
            {hasBatteriesInstalled && (
              <p className="mt-1 text-xs text-amber-600">
                {t('device.detail.cannotChangeBatteryShape')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900">
              {device.battery_count}{t('common.unit')}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
