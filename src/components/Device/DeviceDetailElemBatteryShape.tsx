// デバイス詳細画面の電池形状の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemBatteryShape() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);
  const hasBatteriesInstalled = useDeviceDetailStore(state => state.hasBatteriesInstalled);

  if (!editData || !device) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">電池形状</dt>
      <dd className="mt-1">
        {isEditing ? (
          <div>
            <select
              value={editData.batteryShape}
              onChange={(e) =>
                setEditData({
                  batteryShape: e.target.value,
                })
              }
              disabled={hasBatteriesInstalled}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                hasBatteriesInstalled ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="単1形">単1形</option>
              <option value="単2形">単2形</option>
              <option value="単3形">単3形</option>
              <option value="単4形">単4形</option>
              <option value="9V形">9V形</option>
            </select>
            {hasBatteriesInstalled && (
              <p className="mt-1 text-xs text-amber-600">
                電池が設定されているため変更できません
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-900">
            {device.battery_type}
          </span>
        )}
      </dd>
    </div>
  );
}
