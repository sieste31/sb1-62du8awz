// デバイス詳細画面の電池寿命の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemBatteryLife() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">電池寿命（週）</dt>
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
              placeholder="例: 12"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">週</span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-900">
            {device.battery_life_weeks ? `${device.battery_life_weeks}週` : '---'}
          </span>
        )}
      </dd>
    </div>
  );
}
