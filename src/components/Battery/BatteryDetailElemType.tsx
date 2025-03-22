// 電池詳細画面の電池種別の表示・編集を行うコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

export function BatteryDetailElemType() {
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  
  if (!editData || !batteryGroup) return null;
  if (isEditing) {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電池種別</dt>
        <dd className="mt-1">
          <div>
            <select
              value={editData.type}
              onChange={(e) => setEditData({ type: e.target.value })}
              disabled={restrictTypeAndCountEditing}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${restrictTypeAndCountEditing ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            >
              <option value="単1形">単1形</option>
              <option value="単2形">単2形</option>
              <option value="単3形">単3形</option>
              <option value="単4形">単4形</option>
              <option value="9V形">9V形</option>
            </select>
            {restrictTypeAndCountEditing && (
              <p className="mt-1 text-xs text-amber-600">
                使用中の電池があるため変更できません
              </p>
            )}
          </div>
        </dd>
      </div>
    );
  }
  else {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電池種別</dt>
        <dd className="mt-1">
          <span className="text-sm text-gray-900">{batteryGroup.type}</span>
        </dd>
      </div>
    );
  }

}
