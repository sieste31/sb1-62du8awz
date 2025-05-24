// 電池詳細画面の電池形状の表示・編集を行うコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { DetailInfoElem } from '@/components/common/DetailInfoElem';
import { BatteryShapeSelect } from '@/components/Battery/components/BatteryShapeSelect';
import { BatteryShape } from '@/components/Battery/types';

export function BatteryDetailElemShape() {
  const { t } = useTranslation();
  const isEditing = useBatteryDetailStore(state => state.isEditing);
  const editData = useBatteryDetailStore(state => state.editData);
  const setEditData = useBatteryDetailStore(state => state.setEditData);
  const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
  const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

  if (!editData || !batteryGroup) return null;
  return (
    <DetailInfoElem
      title={t('battery.detail.shape')}
      value={t(batteryShapeToTranslationKey(batteryGroup.shape))}
      isEditing={isEditing}
    >
      <BatteryShapeSelect
        value={editData.shape as BatteryShape}
        onChange={(shape) => setEditData({ shape })}
        disabled={restrictTypeAndCountEditing}
        restrictionMessage={restrictTypeAndCountEditing ? t('battery.detail.cannotChangeShape') : undefined}
      />
    </DetailInfoElem>
  );
}
