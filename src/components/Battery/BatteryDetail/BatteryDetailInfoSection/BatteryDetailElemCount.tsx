// 電池詳細画面の電池本数を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { DetailInfoElemHead } from '@/components/DetailInfoElemHead';

export function BatteryDetailElemCount() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
  const installedCount = useBatteryDetailStore(state => state.installedCount);

  if (!editData || !batteryGroup) return null;

  return (
    <div>
      <DetailInfoElemHead title={t('battery.detail.count')} />
      <dd className="mt-1">
        {isEditing ? (
          <div>
            <input
              type="number"
              min="1"
              value={editData.count}
              onChange={(e) => setEditData({ count: parseInt(e.target.value) })}
              disabled={restrictTypeAndCountEditing}
              className={`block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text ${restrictTypeAndCountEditing
                  ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed border-gray-300 dark:border-gray-600'
                  : editData.count < batteryGroup.count && installedCount > 0
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
            />
            {restrictTypeAndCountEditing ? (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                {t('battery.detail.cannotChangeCount')}
              </p>
            ) : editData.count < batteryGroup.count && installedCount > 0 && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {t('battery.detail.cannotReduceCount')}
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-900 dark:text-dark-text">{batteryGroup.count}{t('common.unit')}</span>
        )}
      </dd>
    </div>
  );
}
