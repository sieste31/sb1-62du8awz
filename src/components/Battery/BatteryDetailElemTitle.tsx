// 電池詳細画面のタイトルを表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { useTranslation } from 'react-i18next';

export function BatteryDetailElemTitle(){
    const { t } = useTranslation();
    const isEditing = useBatteryDetailStore(state => state.isEditing);
    const editData = useBatteryDetailStore(state => state.editData);
    const setEditData = useBatteryDetailStore(state => state.setEditData);
    
    if (!editData) return null;
    if (isEditing)
    {
        return (
            <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ name: e.target.value })}
            className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full truncate"
            aria-label={t('battery.detail.title')}
            placeholder={t('battery.detail.titlePlaceholder')}
            />);
    }
    else
    {
        return (
            <h2 className="text-xl font-bold text-gray-900 truncate">{editData.name}</h2>
        );
    }
}
