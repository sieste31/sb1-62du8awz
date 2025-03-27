// デバイス詳細画面の購入日の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemPurchaseDate() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">購入日</dt>
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
          <span className="text-sm text-gray-900">
            {device.purchase_date
              ? new Date(device.purchase_date).toLocaleDateString()
              : '---'}
          </span>
        )}
      </dd>
    </div>
  );
}
