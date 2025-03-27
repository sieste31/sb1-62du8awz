// デバイス詳細画面の電池設定セクションを担当するコンポーネント

import React from 'react';
import { Battery, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';
import { DeviceBatterySlot } from './DeviceBatterySlot';

export function DeviceDetailBatterySection() {
  const device = useDeviceDetailStore(state => state.device);
  const batteries = useDeviceDetailStore(state => state.batteries);
  const installedCount = useDeviceDetailStore(state => state.installedCount);
  const setShowHistory = useDeviceDetailStore(state => state.setShowHistory);

  if (!device) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">電池の設定</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              設置済み: {installedCount}本 / 未設置:{' '}
              {device.battery_count - installedCount}本
            </span>
            <button
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <History className="h-4 w-4 mr-1" />
              交換履歴
            </button>
            <Link
              to={`/devices/${device.id}/select-battery`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Battery className="h-4 w-4 mr-2" />
              電池を設定
            </Link>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {batteries.map((battery, index) => (
          <DeviceBatterySlot
            key={battery.id}
            slotNumber={index + 1}
            battery={battery}
          />
        ))}
        {Array.from({ length: device.battery_count - batteries.length }).map((_, index) => (
          <DeviceBatterySlot
            key={`empty-${index}`}
            slotNumber={batteries.length + index + 1}
          />
        ))}
      </div>
    </div>
  );
}
