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
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center">
          <FileText className="h-4 w-4 text-gray-400 mr-1" />
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
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={`${t('battery.detail.memo')}を入力してください`}
            />
          ) : (
            <div className="bg-gray-50 p-3 rounded-md text-gray-900 whitespace-pre-wrap">
              {batteryGroup.notes || '---'}
            </div>
          )}
        </dd>
      </div>
    );
    
  }
}
