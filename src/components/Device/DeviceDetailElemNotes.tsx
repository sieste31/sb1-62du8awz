// デバイス詳細画面のメモの表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { FileText } from 'lucide-react';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';

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
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center">
        <FileText className="h-4 w-4 text-gray-400 mr-1" />
        {t('device.detail.notes')}
      </dt>
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
