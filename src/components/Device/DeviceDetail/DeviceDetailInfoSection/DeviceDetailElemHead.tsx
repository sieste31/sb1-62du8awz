// デバイス詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, Pencil, Radio, X, Check, ToyBrick } from 'lucide-react';
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
  remotecontroller: Radio,
  other: Pencil, // 他のデバイスはPencilアイコンを使用
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
  const setShowDeleteConfirm = useDeviceDetailStore(state => state.setShowDeleteConfirm);
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
      onClickDelete={() => setShowDeleteConfirm(true)}
      onClickEdit={() => setIsEditing(true)}
    />
  );
}
