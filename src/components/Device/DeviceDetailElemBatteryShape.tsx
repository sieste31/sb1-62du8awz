// デバイス詳細画面の電池形状の表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Battery } from 'lucide-react';

export function DeviceDetailElemBatteryShape() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);
  const batteries  = useDeviceDetailStore(state => state.batteries);

  const installedCount = batteries.length 
  const hasBatteriesInstalled = installedCount> 0;

  if (!editData || !device　|| !batteries) return null;
  console.log('batteries:', batteries);
  console.log('lenght:', batteries.length);
  console.log('hasBatteriesInstalled:', hasBatteriesInstalled);
  console.log('installedCount:', installedCount);

  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">電池形状</dt>
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
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center p-1.5 bg-green-50 rounded-md text-green-700 mr-2">
              <Battery className="h-4 w-4" />
            </span>
            <span className="text-base font-medium text-gray-900">
              {device.battery_type}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
