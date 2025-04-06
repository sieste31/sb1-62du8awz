// デバイス詳細画面のデバイスタイプの表示と編集を担当するコンポーネント

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailElemTypeProps {
  device: Device;
}

export function DeviceDetailElemType({ device }: DeviceDetailElemTypeProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);

  if (!editData) return null;

  // デバイスタイプに対応するアイコンとラベルを取得
  const getDeviceTypeInfo = (type: string) => {
    switch (type) {
      case 'remotecontroller':
        return { label: t('device.types.remotecontroller') };
      case 'speaker':
        return { label: t('device.types.speaker') };
      case 'camera':
        return { label: t('device.types.camera') };
      case 'gadget':
        return { label: t('device.types.gadget') };
      case 'light':
        return { label: t('device.types.light') };
      case 'toy':
        return { label: t('device.types.toy') };
      case 'other':
        return { label: t('device.types.other') };
      default:
        return { label: t('device.types.other') };
    }
  };

  const deviceTypeInfo = getDeviceTypeInfo(device.type);

  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {t('device.detail.deviceType')}
      </dt>
      <dd className="mt-1">
        {isEditing ? (
          <select
            value={editData.type}
            onChange={(e) =>
              setEditData({
                type: e.target.value as any,
              })
            }
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="remotecontroller">
              {t('device.types.remotecontroller')}
            </option>
            <option value="speaker">{t('device.types.speaker')}</option>
            <option value="camera">{t('device.types.camera')}</option>
            <option value="gadget">{t('device.types.gadget')}</option>
            <option value="light">{t('device.types.light')}</option>
            <option value="toy">{t('device.types.toy')}</option>
            <option value="other">{t('device.types.other')}</option>
          </select>
        ) : (
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900">
              {deviceTypeInfo.label}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
