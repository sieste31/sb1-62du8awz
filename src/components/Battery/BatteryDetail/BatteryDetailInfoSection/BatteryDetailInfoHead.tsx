// 電池詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { Battery } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DetailInfoHead } from '@/components/common/DetailInfoHead';

export function BatteryDetailInfoHead() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const isEditing = useBatteryDetailStore(state => state.isEditing);
    const editData = useBatteryDetailStore(state => state.editData);
    const setEditData = useBatteryDetailStore(state => state.setEditData);
    const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
    const installedCount = useBatteryDetailStore(state => state.installedCount);
    const handleSave = useBatteryDetailStore(state => state.handleSave);
    const handleCancelEdit = useBatteryDetailStore(state => state.handleCancelEdit);
    const setIsEditing = useBatteryDetailStore(state => state.setIsEditing);
    const setShowDeleteConfirm = useBatteryDetailStore(state => state.setShowDeleteConfirm);
    const saving = useBatteryDetailStore(state => state.saving);

    if (!editData || !batteryGroup) return null;

    // const created_at = new Date(batteryGroup?.created_at).toLocaleDateString();
    // const installedCount = useBatteryDetailStore(state => state.installedCount);
    // const saving = useBatteryDetailStore(state => state.saving);
    // const isEditing = useBatteryDetailStore(state => state.isEditing);


    // const setEditData = useBatteryDetailStore(state => state.setEditData);
    // const onClickCancelEdit = ()=>handleCancelEdit();
    // const onClickSave = ()=> handleSave(queryClient);
    // const onClickDelete = ()=> setShowDeleteConfirm(true);
    // const onClickEdit = ()=> setIsEditing(true);

    return (
        <DetailInfoHead
            icon={Battery}
            title={editData.name}
            title_label={t('battery.detail.titleLabel')}
            title_placeholder={t('battery.detail.titlePlaceholder')}
            cannotDelete={t('battery.detail.cannotDelete')}
            deleteGroup={t('battery.list.deleteGroup')}
            created_at={new Date(batteryGroup.created_at).toLocaleDateString()}
            installedCount={installedCount}
            saving={saving}
            isEditing={isEditing}
            setEditData={setEditData}
            onClickCancelEdit={handleCancelEdit}
            onClickSave={() => handleSave(queryClient)}
            onClickDelete={() => setShowDeleteConfirm(true)}
            onClickEdit={() => setIsEditing(true)}
        />
    )
}
