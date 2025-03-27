// デバイス詳細画面のデバイスタイプの表示と編集を担当するコンポーネント

import React from 'react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemType() {
  const isEditing = useDeviceDetailStore(state => state.isEditing);
  const editData = useDeviceDetailStore(state => state.editData);
  const setEditData = useDeviceDetailStore(state => state.setEditData);
  const device = useDeviceDetailStore(state => state.device);

  if (!editData || !device) return null;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">
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
          <span className="text-sm text-gray-900">
            {device.type === 'smartphone'
              ? 'スマートフォン/リモコン'
              : device.type === 'speaker'
              ? 'スピーカー'
              : device.type === 'gadget'
              ? 'ガジェット'
              : device.type === 'light'
              ? 'ライト'
              : device.type === 'toy'
              ? 'おもちゃ'
              : 'カメラ'}
          </span>
        )}
      </dd>
    </div>
  );
}
