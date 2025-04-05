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
        return { label: 'スマートフォン/リモコン' };
      case 'speaker':
        return { label: 'スピーカー' };
      case 'camera':
        return { label: 'カメラ' };
      case 'gadget':
        return { label: 'ガジェット' };
      case 'light':
        return { label: 'ライト' };
      case 'toy':
        return { label: 'おもちゃ' };
      default:
        return { label: 'カメラ' };
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
            <span className="text-base font-medium text-gray-900">
              {deviceTypeInfo.label}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
