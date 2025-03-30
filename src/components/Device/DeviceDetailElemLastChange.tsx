// デバイス詳細画面の最終電池交換日の表示を担当するコンポーネント

import React from 'react';
import { Clock } from 'lucide-react';
import { useDeviceDetailStore } from '@/lib/deviceDetailStore';

export function DeviceDetailElemLastChange() {
  const device = useDeviceDetailStore(state => state.device);
  const batteries = useDeviceDetailStore(state => state.batteries);
  const calculateBatteryEndDate = useDeviceDetailStore(state => state.calculateBatteryEndDate);

  if (!device) return null;

  const batteryEndDate = calculateBatteryEndDate();
  const today = new Date();
  const daysUntilEnd = batteryEndDate 
    ? (new Date(batteryEndDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    : null;
  const isOverdue = daysUntilEnd !== null && daysUntilEnd <= 0;
  const isNearingEnd = daysUntilEnd !== null && daysUntilEnd > 0 && daysUntilEnd <= 7;
  const hasBatteriesFullInstalled = device.battery_count > 0 && batteries.length === device.battery_count;

  return (
    <div>
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">最終電池交換日</dt>
      <dd className="mt-1">
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center p-1.5 bg-teal-50 rounded-md text-teal-700 mr-2">
            <Clock className="h-4 w-4" />
          </span>
          <span className="text-base font-medium text-gray-900">
            {device.last_battery_change
              ? new Date(device.last_battery_change).toLocaleDateString()
              : '---'}
          </span>
        </div>
        
        {batteryEndDate && hasBatteriesFullInstalled && (
          <div className="mt-2 text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isOverdue 
                ? 'bg-red-100 text-red-800' 
                : isNearingEnd 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
            }`}>
              交換予定: {batteryEndDate.toLocaleDateString()}
              {isOverdue && ' (交換時期超過)'}
              {isNearingEnd && ' (まもなく交換時期)'}
            </span>
          </div>
        )}
      </dd>
    </div>
  );
}
