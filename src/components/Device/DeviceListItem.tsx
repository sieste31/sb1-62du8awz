// デバイス一覧画面の各デバイスを表示するコンポーネント

import React, { useState, useEffect } from 'react';
import { Smartphone, Speaker, Camera, Gamepad, Lightbulb, ToyBrick, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeviceImage } from '@/lib/deviceImages';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];

const iconMap = {
  smartphone: Smartphone,
  speaker: Speaker,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
};

// 電池切れ予想日を計算する関数
function calculateBatteryEndDate(device: Device) {
  if (!device.last_battery_change || !device.battery_life_weeks) return null;
  const lastChange = new Date(device.last_battery_change);
  const endDate = new Date(lastChange);
  endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
  return endDate;
}

interface DeviceListItemProps {
  device: Device;
}

export function DeviceListItem({ device }: DeviceListItemProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const Icon = iconMap[device.type as keyof typeof iconMap];
  const shortId = device.id.slice(0, 8);

  // 電池切れ予想日を計算
  const batteryEndDate = calculateBatteryEndDate(device);
  const isNearingEnd = batteryEndDate && (new Date(batteryEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7;

  useEffect(() => {
    getDeviceImage(device.type as keyof typeof iconMap, device.image_url)
      .then(url => setImageUrl(url));
  }, [device.type, device.image_url]);

  // Choose the appropriate battery icon based on installation status
  const BatteryIcon = device.has_batteries
    ? BatteryFull
    : device.last_battery_change
      ? BatteryMedium
      : BatteryWarning;

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col">
          <Link to={`/devices/${device.id}`} className="flex-1">
            <div className="flex items-start space-x-4">
              <img
                src={imageUrl || ''}
                alt={device.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-400 mr-2" />
                  <p className="text-lg font-medium text-gray-900">{device.name}</p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {device.battery_type} × {device.battery_count}本
                  </span>
                  <span className="text-xs text-gray-400 font-mono">#{shortId}</span>
                </div>
                
                {/* Battery status indicator */}
                <div className="mt-2 flex items-center">
                  <BatteryIcon 
                    className={`h-5 w-5 mr-2 ${
                      device.has_batteries
                        ? 'text-green-500'
                        : device.last_battery_change
                          ? 'text-amber-500'
                          : 'text-red-500'
                    }`} 
                  />
                  <span className={`text-sm ${
                    device.has_batteries
                      ? 'text-green-600'
                      : device.last_battery_change
                        ? 'text-amber-600'
                        : 'text-red-600'
                  }`}>
                    {device.has_batteries
                      ? '電池設定完了'
                      : device.last_battery_change
                        ? '電池設定不足'
                        : '電池未設定'}
                  </span>
                </div>

                {/* Battery end date */}
                {batteryEndDate && (
                  <div className={`mt-2 flex items-center ${
                    isNearingEnd ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      電池交換予定: {batteryEndDate.toLocaleDateString()}
                      {isNearingEnd && ' (まもなく交換時期)'}
                    </span>
                  </div>
                )}
                
                {device.notes && (
                  <p className="mt-2 text-sm text-gray-500 truncate">{device.notes}</p>
                )}
                {device.purchase_date && (
                  <p className="mt-1 text-sm text-gray-500">
                    購入日: {new Date(device.purchase_date).toLocaleDateString()}
                  </p>
                )}
                {device.last_battery_change && (
                  <p className="mt-1 text-sm text-gray-500">
                    前回電池交換: {new Date(device.last_battery_change).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
