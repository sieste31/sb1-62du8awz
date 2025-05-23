// デバイス詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, Pencil, X, Check, ToyBrick } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { DetailInfoTitle } from '@/components/common/DetailInfoTitle';
import { DetailInfoHead } from '@/components/common/DetailInfoHead';

type Device = Database['public']['Tables']['devices']['Row'];

interface DeviceDetailElemHeadProps {
  device: Device;
}

const deviceTypeIcons = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

export function DeviceDetailElemHead({ device }: DeviceDetailElemHeadProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const handleSave = useDeviceDetailStore(state => state.handleSave);
  const handleCancelEdit = useDeviceDetailStore(state => state.handleCancelEdit);
  const setIsEditing = useDeviceDetailStore(state => state.setIsEditing);
  const saving = useDeviceDetailStore(state => state.saving);

  if (!editData) return null;

  const DeviceIcon = deviceTypeIcons[device.type as keyof typeof deviceTypeIcons];

  return (
    <DetailInfoHead icon={DeviceIcon}
      title={editData.name}
      title_label={t('device.detail.titleLabel')}
      title_placeholder={t('device.detail.titlePlaceholder')}
      cannotDelete={t('device.detail.cannotDelete')}
      deleteGroup={t('device.list.deleteGroup')}
      created_at={new Date(device.created_at).toLocaleDateString()}
      installedCount={0} // デバイスグループのインストール数は0
      saving={saving}
      isEditing={isEditing}
      setEditData={setEditData}
      onClickCancelEdit={() => handleCancelEdit(device)}
      onClickSave={() => handleSave(queryClient)}
      onClickDelete={() => setIsEditing(true)}
      onClickEdit={() => setIsEditing(true)}
    />
  );

  // return (
  //   <div className="px-4 py-5 sm:px-6 bg-gray-50">
  //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
  //       <div className="flex items-center mb-4 sm:mb-0">
  //         <DeviceIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
  //         <div className="min-w-0 flex-1">
  //           <DetailInfoTitle title={editData.name} aria_label={t('device.detail.title')} placeholder={t('device.detail.titlePlaceholder')} isEditing={isEditing} setEditData={setEditData} />
  //         </div>
  //       </div>
  //       <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
  //         <div className="text-sm text-gray-500 mr-4">
  //           {t('common.registrationDate', { date: new Date(device.created_at).toLocaleDateString() })}
  //         </div>
  //         {isEditing ? (
  //           <div className="flex space-x-2">
  //             <button
  //               onClick={() => handleCancelEdit(device)}
  //               className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
  //               aria-label={t('common.cancel')}
  //             >
  //               <X className="h-5 w-5" />
  //             </button>
  //             <button
  //               onClick={() => handleSave(queryClient)}
  //               disabled={saving}
  //               className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 disabled:opacity-50"
  //               aria-label={t('common.save')}
  //             >
  //               <Check className="h-5 w-5" />
  //             </button>
  //           </div>
  //         ) : (
  //           <button
  //             onClick={() => setIsEditing(true)}
  //             className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
  //             aria-label={t('common.edit')}
  //           >
  //             <Pencil className="h-5 w-5" />
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}
