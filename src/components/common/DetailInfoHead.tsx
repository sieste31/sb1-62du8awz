// 電池詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { Battery, Pencil, X, Check, ArrowLeft, Trash2, LucideIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DetailInfoTitle } from './DetailInfoTitle';

interface DetailInfoHeadProps {
    icon: LucideIcon;
    title: string;
    title_label: string;
    title_placeholder: string;
    cannotDelete: string;
    deleteGroup: string;
    created_at: string;
    installedCount: number;
    saving: boolean;
    isEditing: boolean;
    setEditData: (data: { name: string }) => void;
    onClickCancelEdit: () => void;
    onClickSave: () => void;
    onClickDelete: () => void;
    onClickEdit: () => void;
}

export function DetailInfoHead(prop: DetailInfoHeadProps) {

    const { t } = useTranslation();

    // const editData = useBatteryDetailStore(state => state.editData);
    // const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);

    // const queryClient = useQueryClient();

    // const handleSave = useBatteryDetailStore(state => state.handleSave);
    // const handleCancelEdit = useBatteryDetailStore(state => state.handleCancelEdit);
    // const setIsEditing = useBatteryDetailStore(state => state.setIsEditing);
    // const setShowDeleteConfirm = useBatteryDetailStore(state => state.setShowDeleteConfirm);




    // if (!editData || !batteryGroup) return null;

    // const title_label = t('battery.detail.title');
    // const title_placeholder = t('battery.detail.titlePlaceholder');
    // const cannotDelete = t('battery.detail.cannotDelete');
    // const deleteGroup = t('battery.list.deleteGroup');

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
                <prop.icon className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                    <DetailInfoTitle title={prop.title}
                        aria_label={prop.title_label}
                        placeholder={prop.title_placeholder}
                        isEditing={prop.isEditing}
                        setEditData={prop.setEditData} />
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                <div className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                    {t('common.registrationDate', { date: prop.created_at })}
                </div>
                {prop.isEditing ? (
                    <div className="flex space-x-2">
                        { /* 編集終了ボタン */}
                        <button
                            onClick={prop.onClickCancelEdit}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        { /* 保存ボタン */}
                        <button
                            onClick={prop.onClickSave}
                            disabled={prop.saving}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 disabled:opacity-50"
                        >
                            <Check className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        { /* 編集ボタン */}
                        <button
                            onClick={prop.onClickEdit}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <Pencil className="h-5 w-5" />
                        </button>
                        { /* 削除ボタン */}
                        <button
                            onClick={prop.onClickDelete}
                            disabled={prop.installedCount > 0}
                            title={prop.installedCount > 0 ? prop.cannotDelete : prop.deleteGroup}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:hover:text-gray-400 dark:disabled:hover:text-gray-500"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>);
}
