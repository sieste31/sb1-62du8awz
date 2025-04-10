// デバイス詳細画面のメモの表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemHead } from '@/components/DetailInfoElemHead';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailElemNotesProps {
  device: Device;
}

export function DeviceDetailElemNotes({ device }: DeviceDetailElemNotesProps) {
  const { t } = useTranslation();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);

  if (!editData) return null;

  return (
    <div className="sm:col-span-2">
      <DetailInfoElemHead title={t('device.detail.notes')} />
      <dd className="mt-1">
        {isEditing ? (
          <textarea
            rows={3}
            value={editData.notes}
            onChange={(e) =>
              setEditData({ notes: e.target.value })
            }
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={t('device.detail.notesPlaceholder')}
          />
        ) : (
          <div className="bg-gray-50 p-3 rounded-md text-gray-900 whitespace-pre-wrap">
            {device.notes || '---'}
          </div>
        )}
      </dd>
    </div>
  );
}
