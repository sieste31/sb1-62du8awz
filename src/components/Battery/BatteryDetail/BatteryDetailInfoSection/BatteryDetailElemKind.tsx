// 電池詳細画面の電池タイプを表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemHead } from '@/components/DetailInfoElemHead';

export function BatteryDetailElemKind() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;

  return (
    <div>
      <DetailInfoElemHead title={t('battery.detail.kind')} />
      <dd className="mt-1">
        {isEditing ? (
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
        ) : (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${batteryGroup.kind === 'rechargeable' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
            {batteryGroup.kind === 'rechargeable' ? t('battery.kind.rechargeable') : t('battery.kind.disposable')}
          </span>
        )}
      </dd>
    </div>
  );
}
