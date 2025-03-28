// デバイス詳細画面のデバイスタイプの表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, ToyBrick } from 'lucide-react';

export function DeviceDetailElemType() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  // デバイスタイプに対応するアイコンとラベルを取得
  const getDeviceTypeInfo = (type: string) => {
    switch (type) {
      case 'smartphone':
        return { icon: <Smartphone className="h-4 w-4" />, label: 'スマートフォン/リモコン' };
      case 'speaker':
        return { icon: <Speaker className="h-4 w-4" />, label: 'スピーカー' };
      case 'camera':
        return { icon: <Camera className="h-4 w-4" />, label: 'カメラ' };
      case 'gadget':
        return { icon: <Gamepad className="h-4 w-4" />, label: 'ガジェット' };
      case 'light':
        return { icon: <Lightbulb className="h-4 w-4" />, label: 'ライト' };
      case 'toy':
        return { icon: <ToyBrick className="h-4 w-4" />, label: 'おもちゃ' };
      default:
        return { icon: <Camera className="h-4 w-4" />, label: 'カメラ' };
    }
  };

  const deviceTypeInfo = getDeviceTypeInfo(device.type);

  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        デバイスタイプ
      </dt>
      <dd className="mt-1">
        {isEditing ? (
          <select
            value={editData.type}
            onChange={(e) =>
              setEditData({
                type: e.target.value as any,
              })
            }
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="smartphone">
              スマートフォン/リモコン
            </option>
            <option value="speaker">スピーカー</option>
            <option value="camera">カメラ</option>
            <option value="gadget">ガジェット</option>
            <option value="light">ライト</option>
            <option value="toy">おもちゃ</option>
          </select>
        ) : (
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center p-1.5 bg-blue-50 rounded-md text-blue-700 mr-2">
              {deviceTypeInfo.icon}
            </span>
            <span className="text-base font-medium text-gray-900">
              {deviceTypeInfo.label}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
