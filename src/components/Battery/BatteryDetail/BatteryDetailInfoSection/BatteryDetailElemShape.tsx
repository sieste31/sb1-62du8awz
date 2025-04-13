// 電池詳細画面の電池形状の表示・編集を行うコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { DetailInfoElem } from '@/components/common/DetailInfoElem';

export function BatteryDetailElemShape() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;
  return (
    <DetailInfoElem title={t('battery.detail.shape')} value={t(batteryShapeToTranslationKey(batteryGroup.shape))} isEditing={isEditing}>
      <div>
        <select
          value={editData.shape}
          onChange={(e) => setEditData({ shape: e.target.value })}
          disabled={restrictTypeAndCountEditing}
          className={`block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text ${restrictTypeAndCountEditing ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
            }`}
        >
          <option value="単1形">{t('battery.shape.d')}</option>
          <option value="単2形">{t('battery.shape.c')}</option>
          <option value="単3形">{t('battery.shape.aa')}</option>
          <option value="単4形">{t('battery.shape.aaa')}</option>
          <option value="9V形">{t('battery.shape.9v')}</option>
        </select>
        {restrictTypeAndCountEditing && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            {t('battery.detail.cannotChangeShape')}
          </p>
        )}
      </div>
    </DetailInfoElem>
  );
}
