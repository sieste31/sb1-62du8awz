// 電池詳細画面のメモを表示するコンポーネント

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { FileText } from 'lucide-react';
import { DetailInfoElemHead } from '@/components/DetailInfoElemHead';

export function BatteryDetailElemMemo() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;
  return (
    <div className="sm:col-span-2">
      <DetailInfoElemHead title={t('battery.detail.memo')} />
      <dd className="mt-1">
        {isEditing ? (
          <textarea
            rows={3}
            value={editData.notes}
            onChange={(e) =>
              setEditData({ notes: e.target.value })
            }
            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
            placeholder={t('battery.detail.memoPlaceholder')}
          />
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-gray-900 dark:text-dark-text whitespace-pre-wrap">
            {batteryGroup.notes || '---'}
          </div>
        )}
      </dd>
    </div>
  );
}
