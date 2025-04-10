import React from 'react';
import { BatteryDetailElemHead } from './BatteryDetailElemHead';
import { BatteryDetailImage } from './BatteryDetailImage';
import { BatteryDetailElemShape } from './BatteryDetailElemShape';
import { BatteryDetailElemKind } from './BatteryDetailElemKind';
import { BatteryDetailElemCount } from './BatteryDetailElemCount';
import { BatteryDetailElemVolt } from './BatteryDetailElemVolt';
import { BatteryDetailElemMemo } from './BatteryDetailElemMemo';
import { useBatteryDetailStore } from '@/lib/batteryDetailStore';

interface BatteryDetailInfoSectionProps {
  // Define your props here
}

export function BatteryDetailInfoSection({ }: BatteryDetailInfoSectionProps) {
  // Zustandストアから状態と関数を取得
  const {
    isEditing, setIsEditing,
    editData, initializeEditData,
    error, setError,
    imageUrl, setImageUrl,
    showDeleteConfirm, setShowDeleteConfirm,
    saving, deleting,
    handleSave, handleDelete, handleCancelEdit,
    batteryGroup, setBatteryGroup, batteries, setBatteries,
  } = useBatteryDetailStore();


  return (
    <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden mb-6">
      <BatteryDetailElemHead />
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200 dark:border-dark-border">
        <div className="flex space-x-6">
          {batteryGroup && (
            <BatteryDetailImage
              imageUrl={imageUrl}
              batteryGroup={{
                id: batteryGroup.id,
                type: batteryGroup.type,
                image_url: batteryGroup.image_url,
              }}
              setError={setError}
            />
          )}
          <div className="flex-1">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 sm:grid-cols-2">
              <BatteryDetailElemShape />
              <BatteryDetailElemKind />
              <BatteryDetailElemCount />
              <BatteryDetailElemVolt />
            </dl>
          </div>
        </div>
        <div className="mt-6">
          <BatteryDetailElemMemo />
        </div>
      </div>
    </div>
  );
};