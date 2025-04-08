// デバイス一覧画面の各デバイスを表示するコンポーネント

import React, { useState, useEffect } from 'react';
import { Smartphone, Radio, Camera, Gamepad, Lightbulb, ToyBrick, HelpCircle, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Clock, Hash, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeviceImage } from '@/lib/deviceImages';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';

type Device = Database['public']['Tables']['devices']['Row'];

const iconMap = {
  remotecontroller: Smartphone,
  speaker: Radio,
  camera: Camera,
  gadget: Gamepad,
  light: Lightbulb,
  toy: ToyBrick,
  other: HelpCircle,
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
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const Icon = iconMap[device.type as keyof typeof iconMap];
  const shortId = device.id.slice(0, 8);

  // 電池切れ予想日を計算
  const batteryEndDate = calculateBatteryEndDate(device);
  const today = new Date();
  const daysUntilEnd = batteryEndDate 
    ? (new Date(batteryEndDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    : null;
  const isOverdue = daysUntilEnd !== null && daysUntilEnd <= 0;
  const isNearingEnd = daysUntilEnd !== null && daysUntilEnd > 0 && daysUntilEnd <= 7;

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
    <Link 
      to={`/devices/${device.id}`}
      className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <img
              src={imageUrl || ''}
              alt={device.name}
              className="w-full sm:w-24 h-24 rounded-lg object-cover shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* ヘッダー情報（名前、タイプ） */}
            <div className="flex flex-wrap items-start justify-between mb-2">
              <span className="text-xl font-medium text-gray-900">
                {device.name}
              </span>
              <div className="flex items-center mt-1 sm:mt-0">
                <Hash className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400 font-mono">{shortId}</span>
              </div>
            </div>
            
            {/* デバイス情報 */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-600">
                <Icon className="h-4 w-4 mr-1 text-gray-500" />
                {t(`device.types.${device.type}`)}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-600">
                {t(batteryShapeToTranslationKey(device.battery_shape))}
                <span className="ml-1 bg-gray-200 text-gray-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                  {device.battery_count}{t('common.unit')}
                </span>
              </span>
              {device.purchase_date && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {t('common.purchase', { date: new Date(device.purchase_date).toLocaleDateString() })}
                </span>
              )}
            </div>
            
            {/* 電池状態の表示 */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('device.status.batteryStatus')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                  device.has_batteries
                    ? 'bg-green-50 text-green-700'
                    : device.last_battery_change
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                }`}>
                  <BatteryIcon className="h-4 w-4 mr-1" />
                  {device.has_batteries
                    ? t('device.status.hasBatteries')
                    : device.last_battery_change
                      ? t('device.status.partiallySet')
                      : t('device.status.notSet')}
                </div>
                
                {device.last_battery_change && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-700">
                    <Clock className="h-4 w-4 mr-1" />
                    {t('device.status.exchangeDate', { date: new Date(device.last_battery_change).toLocaleDateString() })}
                  </div>
                )}
                
                {batteryEndDate && (
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                    isOverdue 
                      ? 'bg-red-50 text-red-700' 
                      : isNearingEnd 
                        ? 'bg-yellow-50 text-yellow-700' 
                        : 'bg-blue-50 text-blue-700'
                  }`}>
                    <Clock className="h-4 w-4 mr-1" />
                    {t('device.status.scheduleDate', { date: batteryEndDate.toLocaleDateString() })}
                    {isOverdue && ` (${t('device.status.overdue')})`}
                    {isNearingEnd && ` (${t('device.status.soon')})`}
                  </div>
                )}
              </div>
            </div>
            
            {/* メモ（ある場合） */}
            {device.notes && (
              <div className="mt-3 flex items-start">
                <Info className="h-3.5 w-3.5 text-gray-400 mt-0.5 mr-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-500 line-clamp-2">{device.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
