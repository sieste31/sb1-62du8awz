// 電池詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';
import { Battery, Pencil, X, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { BatteryDetailElemTitle } from '@/components/Battery/BatteryDetailElemTitle'; // Adjust the import path as necessary

export function BatteryDetailElemHead() {
    const isEditing = useBatteryDetailStore(state => state.isEditing);
    const editData = useBatteryDetailStore(state => state.editData);
    const setEditData = useBatteryDetailStore(state => state.setEditData);
    const restrictTypeAndCountEditing = useBatteryDetailStore(state => state.restrictTypeAndCountEditing);
    const batteryGroup = useBatteryDetailStore(state => state.batteryGroup);
    const installedCount = useBatteryDetailStore(state => state.installedCount);
    const handleSave = useBatteryDetailStore(state => state.handleSave);
    const handleCancelEdit = useBatteryDetailStore(state => state.handleCancelEdit);
    const setIsEditing = useBatteryDetailStore(state => state.setIsEditing);
    const setShowDeleteConfirm = useBatteryDetailStore(state => state.setShowDeleteConfirm);
    const saving = useBatteryDetailStore(state => state.saving);

    if (!editData || !batteryGroup) return null;
    return (<div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
                <Battery className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                    <BatteryDetailElemTitle />
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                <div className="text-sm text-gray-500 mr-4">
                    登録日: {new Date(batteryGroup.created_at).toLocaleDateString()}
                </div>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleCancelEdit}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 disabled:opacity-50"
                        >
                            <Check className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                        >
                            <Pencil className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={installedCount > 0}
                            title={installedCount > 0 ? 'デバイスに設定されている電池があるため削除できません' : '電池グループを削除'}
                            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:hover:text-gray-400"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>);
}
