// 電池詳細画面の電池タイプを表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { DetailInfoElem } from '@/components/common/DetailInfoElem';

export function BatteryDetailElemKind() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;

  return (
    <DetailInfoElem title={t('battery.detail.kind')} value={batteryGroup.kind === 'rechargeable' ? t('battery.kind.rechargeable') : t('battery.kind.disposable')} isEditing={isEditing}>
      <div>
        <select
          value={editData.kind}
          onChange={(e) => setEditData({ kind: e.target.value as 'disposable' | 'rechargeable' })}
          disabled={restrictTypeAndCountEditing}
          className={`block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text ${restrictTypeAndCountEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
            }`}
        >
          <option value="rechargeable">{t('battery.kind.rechargeable')}</option>
          <option value="disposable">{t('battery.kind.disposable')}</option>
        </select>
        {restrictTypeAndCountEditing && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            {t('battery.detail.cannotChangeKind')}
          </p>
        )}
      </div>
    </DetailInfoElem>
  );
}
