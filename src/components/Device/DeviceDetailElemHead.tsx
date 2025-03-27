// デバイス詳細画面のヘッダー部を表示するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, Pencil, X, Check, ToyBrick } from 'lucide-react';

const deviceTypeIcons = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

export function DeviceDetailElemHead() {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DeviceIcon className="h-6 w-6 text-gray-400 mr-3" />
          {isEditing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ name: e.target.value })
              }
              className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent"
            />
          ) : (
            <h2 className="text-xl font-bold text-gray-900">
              {device.name}
            </h2>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            登録日: {new Date(device.created_at).toLocaleDateString()}
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
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
