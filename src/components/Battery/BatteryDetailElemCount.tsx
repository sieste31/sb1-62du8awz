// 電池詳細画面の電池本数を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

export function BatteryDetailElemCount() {
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  const installedCount = useBatteryDetailStore(state => state.installedCount);
  
  if (!editData || !batteryGroup) return null;
  if (isEditing) {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">本数</dt>
        <dd className="mt-1">
          <div>
            <input
              type="number"
              min="1"
              value={editData.count}
              onChange={(e) => setEditData({ count: parseInt(e.target.value) })}
              disabled={restrictTypeAndCountEditing}
              className={`block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                restrictTypeAndCountEditing
                  ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                  : editData.count < batteryGroup.count && installedCount > 0
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {restrictTypeAndCountEditing ? (
              <p className="mt-1 text-xs text-amber-600">
                使用中の電池があるため変更できません
              </p>
            ) : editData.count < batteryGroup.count && installedCount > 0 && (
              <p className="mt-1 text-sm text-red-600">
                デバイスに設定されている電池があるため、本数を減らすことはできません
              </p>
            )}
          </div>
        </dd>
      </div>
    );
  } else {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">本数</dt>
        <dd className="mt-1">
          <span className="text-sm text-gray-900">{batteryGroup.count}本</span>
        </dd>
      </div>
    );
  }
}
