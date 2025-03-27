// デバイス詳細画面のメモの表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemNotes() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  return (
    <div className="sm:col-span-2">
      <dt className="text-sm font-medium text-gray-500">メモ</dt>
      <dd className="mt-1">
        {isEditing ? (
          <textarea
            rows={3}
            value={editData.notes}
            onChange={(e) =>
              setEditData({ notes: e.target.value })
            }
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        ) : (
          <span className="text-sm text-gray-900">
            {device.notes || '---'}
          </span>
        )}
      </dd>
    </div>
  );
}
