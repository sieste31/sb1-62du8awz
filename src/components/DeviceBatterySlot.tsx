import React from 'react';
import { Battery } from 'lucide-react';
import type { Database } from '../lib/database.types';

type InstalledBattery = Database['public']['Tables']['batteries']['Row'] & {
  battery_groups?: Database['public']['Tables']['battery_groups']['Row'];
};

interface DeviceBatterySlotProps {
  slotNumber: number;
  battery?: InstalledBattery;
}

export function DeviceBatterySlot({
  slotNumber,
  battery,
}: DeviceBatterySlotProps) {
  if (!battery) {
    return (
      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              スロット #{slotNumber}
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              電池が設定されていません
            </p>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              未設定
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            スロット #{slotNumber}: {battery.battery_groups?.name} #
            {battery.slot_number}
          </h4>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-500">
              最終チェック日:{' '}
              {battery.last_checked
                ? new Date(battery.last_checked).toLocaleDateString()
                : '---'}
            </p>
            <p className="text-sm text-gray-500">
              最終交換日:{' '}
              {battery.last_changed_at
                ? new Date(battery.last_changed_at).toLocaleDateString()
                : '---'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              battery.status === 'charged'
                ? 'bg-green-100 text-green-800'
                : battery.status === 'in_use'
                ? 'bg-blue-100 text-blue-800'
                : battery.status === 'empty'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {battery.status === 'charged'
              ? '満充電'
              : battery.status === 'in_use'
              ? '使用中'
              : battery.status === 'empty'
              ? '使用済み'
              : '廃棄'}
          </span>
        </div>
      </div>
    </div>
  );
}