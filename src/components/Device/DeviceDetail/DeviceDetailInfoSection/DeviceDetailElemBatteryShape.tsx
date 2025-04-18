// デバイス詳細画面の電池形状の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Battery } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';
import { DetailInfoElemText } from '@/components/common/DetailInfoElemText';

type Device = Database['public']['Tables']['devices']['Row'];
type Battery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceDetailElemBatteryShapeProps {
  device: Device;
  batteries?: Battery[];
}

export function DeviceDetailElemBatteryShape({ device, batteries = [] }: DeviceDetailElemBatteryShapeProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);

  const installedCount = batteries.length;
  const hasBatteriesInstalled = installedCount > 0;

  if (!editData) return null;
  return (
    <div>
      <DetailInfoElemHead title={t('device.detail.batteryShape')} />
      <dd className="mt-1">
        {isEditing ? (
          <div>
            <select
              value={editData.batteryShape}
              onChange={(e) => {
                setEditData({
                  batteryShape: e.target.value,
                });
              }}
              disabled={hasBatteriesInstalled}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${hasBatteriesInstalled ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            >
              <option value="単1形">{t('battery.shape.d')}</option>
              <option value="単2形">{t('battery.shape.c')}</option>
              <option value="単3形">{t('battery.shape.aa')}</option>
              <option value="単4形">{t('battery.shape.aaa')}</option>
              <option value="9V形">{t('battery.shape.9v')}</option>
            </select>
            {hasBatteriesInstalled && (
              <p className="mt-1 text-xs text-amber-600">
                {t('device.detail.cannotChangeBatteryShape')}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <DetailInfoElemText>
              {t(batteryShapeToTranslationKey(device.battery_shape))}
            </DetailInfoElemText>
          </div>
        )}
      </dd>
    </div>
  );
}
