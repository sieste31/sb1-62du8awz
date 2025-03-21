import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

export function BatteryDetailElemKind() {
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  
  if (!editData || !batteryGroup) return null;
  if (isEditing) {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電池タイプ</dt>
        <dd className="mt-1">
          <div>
            <select
              value={editData.kind}
              onChange={(e) => setEditData({ kind: e.target.value as 'disposable' | 'rechargeable' })}
              disabled={restrictTypeAndCountEditing}
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                restrictTypeAndCountEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="rechargeable">充電池</option>
              <option value="disposable">使い切り</option>
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
  } else {
    return (
      <div>
        <dt className="text-sm font-medium text-gray-500">電池タイプ</dt>
        <dd className="mt-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            batteryGroup.kind === 'rechargeable' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {batteryGroup.kind === 'rechargeable' ? '充電池' : '使い切り'}
          </span>
        </dd>
      </div>
    );
  }
}
