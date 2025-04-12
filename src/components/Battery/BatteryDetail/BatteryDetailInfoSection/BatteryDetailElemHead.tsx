// 電池詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { Battery } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DetailInfoHead } from '@/components/common/DetailInfoHead';

export function BatteryDetailElemHead() {
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


    // return (<div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800">
    //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    //         <div className="flex items-center mb-4 sm:mb-0">
    //             <Battery className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
    //             <div className="min-w-0 flex-1">
    //                 <BatteryDetailElemTitle />
    //             </div>
    //         </div>
    //         <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
    //             <div className="text-sm text-gray-500 dark:text-gray-400 mr-4">
    //                 {t('common.registrationDate', { date: new Date(batteryGroup.created_at).toLocaleDateString() })}
    //             </div>
    //             {isEditing ? (
    //                 <div className="flex space-x-2">
    //                     <button
    //                         onClick={handleCancelEdit}
    //                         className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
    //                     >
    //                         <X className="h-5 w-5" />
    //                     </button>
    //                     <button
    //                         onClick={() => handleSave(queryClient)}
    //                         disabled={saving}
    //                         className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 disabled:opacity-50"
    //                     >
    //                         <Check className="h-5 w-5" />
    //                     </button>
    //                 </div>
    //             ) : (
    //                 <div className="flex space-x-2">
    //                     <button
    //                         onClick={() => setIsEditing(true)}
    //                         className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
    //                     >
    //                         <Pencil className="h-5 w-5" />
    //                     </button>
    //                     <button
    //                         onClick={() => setShowDeleteConfirm(true)}
    //                         disabled={installedCount > 0}
    //                         title={installedCount > 0 ? t('battery.detail.cannotDelete') : t('battery.list.deleteGroup')}
    //                         className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:hover:text-gray-400 dark:disabled:hover:text-gray-500"
    //                     >
    //                         <Trash2 className="h-5 w-5" />
    //                     </button>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // </div>);
}
