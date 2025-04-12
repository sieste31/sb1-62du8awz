// 電池詳細画面のタイトルを表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';
import { DetailInfoTitle } from '@/components/common/DetailInfoTitle';

export function BatteryDetailElemTitle() {
    const { t } = useTranslation();
    const isEditing = useBatteryDetailStore(state => state.isEditing);
    const editData = useBatteryDetailStore(state => state.editData);
    const setEditData = useBatteryDetailStore(state => state.setEditData);

    if (!editData) return null;

    return (
        <DetailInfoTitle title={editData.name}
            aria_label={t('battery.detail.title')}
            placeholder={t('battery.detail.titlePlaceholder')}
            isEditing = {isEditing}
            setEditData={setEditData}/>
    )
}
