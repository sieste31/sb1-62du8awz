// デバイス詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, Pencil, X, Check, ToyBrick } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const deviceTypeIcons = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

export function DeviceDetailElemHead() {
  const queryClient = useQueryClient();
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);
  const handleSave = useDeviceDetailStore(state => state.handleSave);
  const handleCancelEdit = useDeviceDetailStore(state => state.handleCancelEdit);
  const setIsEditing = useDeviceDetailStore(state => state.setIsEditing);
  const saving = useDeviceDetailStore(state => state.saving);

  if (!editData || !device) return null;

  const DeviceIcon = deviceTypeIcons[device.type as keyof typeof deviceTypeIcons];

  return (
    <div className="px-4 py-5 sm:px-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <DeviceIcon className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ name: e.target.value })
                }
                className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {device.name}
              </h2>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
          <div className="text-sm text-gray-500 mr-4">
            登録日: {new Date(device.created_at).toLocaleDateString()}
          </div>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
                aria-label="キャンセル"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleSave(queryClient)}
                disabled={saving}
                className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:text-green-700 disabled:opacity-50"
                aria-label="保存"
              >
                <Check className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
              aria-label="編集"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
