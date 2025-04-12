// デバイス詳細画面の購入日の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Calendar } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailElemPurchaseDateProps {
  device: Device;
}

export function DeviceDetailElemPurchaseDate({ device }: DeviceDetailElemPurchaseDateProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);

  if (!editData) return null;

  return (
    <div>
      <DetailInfoElemHead title={t('device.detail.purchaseDate')} />
      <dd className="mt-1">
        {isEditing ? (
          <input
            type="date"
            value={editData.purchaseDate}
            onChange={(e) =>
              setEditData({
                purchaseDate: e.target.value,
              })
            }
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        ) : (
          <div className="flex items-center">
            <span className="text-base font-medium text-gray-900">
              {device.purchase_date
                ? new Date(device.purchase_date).toLocaleDateString()
                : '---'}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
