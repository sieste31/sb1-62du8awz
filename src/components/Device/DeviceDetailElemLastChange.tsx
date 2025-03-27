// デバイス詳細画面の最終電池交換日の表示を担当するコンポーネント

import React from 'react';
import { Clock } from 'lucide-react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemLastChange() {
  const device = useDeviceDetailStore(state => state.device);
  const calculateBatteryEndDate = useDeviceDetailStore(state => state.calculateBatteryEndDate);

  if (!device) return null;

  const batteryEndDate = calculateBatteryEndDate();
  const isNearingEnd = batteryEndDate && (new Date(batteryEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;

  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">最終電池交換日</dt>
      <dd className="mt-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900">
            {device.last_battery_change
              ? new Date(device.last_battery_change).toLocaleDateString()
              : '---'}
          </span>
          {batteryEndDate && (
            <div className={`flex items-center text-sm ${
              isNearingEnd ? 'text-red-600' : 'text-gray-500'
            }`}>
              <Clock className="h-4 w-4 mr-1" />
              <span>
                交換予定: {batteryEndDate.toLocaleDateString()}
                {isNearingEnd && ' (まもなく交換時期)'}
              </span>
            </div>
          )}
        </div>
      </dd>
    </div>
  );
}
