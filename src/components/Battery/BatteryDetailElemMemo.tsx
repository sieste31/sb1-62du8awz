// 電池詳細画面のメモを表示するコンポーネント

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { FileText } from 'lucide-react';

export function BatteryDetailElemMemo() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  
  if (!editData || !batteryGroup) return null;
  if (isEditing) {
 
    return (
      <div className="sm:col-span-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center">
          <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
          {t('battery.detail.memo')}
        </dt>
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
    
  } else {
    return (
      <div className="sm:col-span-2">
        <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center">
          <FileText className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
          {t('battery.detail.memo')}
        </dt>
        <dd className="mt-1">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-gray-900 dark:text-dark-text whitespace-pre-wrap">
            {batteryGroup.notes || '---'}
          </div>
        </dd>
      </div>
    );
  }
}
