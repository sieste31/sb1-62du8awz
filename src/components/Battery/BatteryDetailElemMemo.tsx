import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

export function BatteryDetailElemMemo() {
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  
  if (!editData || !batteryGroup) return null;
  if (isEditing) {
    return (
      <div className="sm:col-span-2">
        <dt className="text-sm font-medium text-gray-500">メモ</dt>
        <dd className="mt-1">
          <textarea
            rows={3}
            value={editData.notes}
            onChange={(e) => setEditData({ notes: e.target.value })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </dd>
      </div>
    );
  } else {
    return (
      <div className="sm:col-span-2">
        <dt className="text-sm font-medium text-gray-500">メモ</dt>
        <dd className="mt-1">
          <span className="text-sm text-gray-900">{batteryGroup.notes || '---'}</span>
        </dd>
      </div>
    );
  }
}
