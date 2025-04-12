// 電池詳細画面の電圧を表示するコンポーネント
// 編集モード時は入力フォームを表示し、非編集モード時はテキストを表示する

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { DetailInfoElemHead } from '@/components/common/DetailInfoElemHead';

export function BatteryDetailElemVolt() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;
  return (
    <div>
      <DetailInfoElemHead title={t('battery.voltage')} />
      <dd className="mt-1">
        {isEditing ? (
          <input
            type="number"
            step="0.1"
            value={editData.voltage}
            onChange={(e) => setEditData({ voltage: parseFloat(e.target.value) })}
            className="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text"
          />
        ) : (
          <div>
            <span className="text-sm text-gray-900 dark:text-dark-text">{batteryGroup.voltage}V</span>
          </div>
        )}
      </dd>
    </div>
  );
}
