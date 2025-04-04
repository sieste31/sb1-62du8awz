// デバイス詳細画面の必要本数の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Hash } from 'lucide-react';

export function DeviceDetailElemBatteryCount() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);
  const batteries = useDeviceDetailStore(state => state.batteries);
  const installedCount = batteries.length 
  const hasBatteriesInstalled = installedCount > 0;

  if (!editData || !device) return null;

  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">必要本数</dt>
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
                電池が設定されているため変更できません
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center p-1.5 bg-purple-50 rounded-md text-purple-700 mr-2">
              <Hash className="h-4 w-4" />
            </span>
            <span className="text-base font-medium text-gray-900">
              {device.battery_count}本
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
