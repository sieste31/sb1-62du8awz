// デバイス詳細画面のデバイスタイプの表示と編集を担当するコンポーネント

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, ToyBrick } from 'lucide-react';

export function DeviceDetailElemType() {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  // デバイスタイプに対応するアイコンとラベルを取得
  const getDeviceTypeInfo = (type: string) => {
    switch (type) {
      case 'smartphone':
        return { label: t('device.types.smartphone') };
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
      default:
        return { label: t('device.types.camera') };
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
            <option value="smartphone">
              {t('device.types.smartphone')}
            </option>
            <option value="speaker">{t('device.types.speaker')}</option>
            <option value="camera">{t('device.types.camera')}</option>
            <option value="gadget">{t('device.types.gadget')}</option>
            <option value="light">{t('device.types.light')}</option>
            <option value="toy">{t('device.types.toy')}</option>
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
