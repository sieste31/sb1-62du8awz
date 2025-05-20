// デバイス一覧画面の各デバイスを表示するコンポーネント

import React, { useState, useEffect } from 'react';
import { Smartphone, Radio, Camera, Gamepad, Lightbulb, ToyBrick, HelpCircle, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Battery, Clock, Hash, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  // 電池未設定の場合はnullを返す
  if (!device.last_battery_change || !device.has_batteries || device.battery_life_weeks === null || device.battery_life_weeks === undefined) {
    return null;
  }
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
  const navigate = useNavigate();
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

  return (
    <Link
      to={`/devices/${device.id}`}
      className="block bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex flex-col">
          {/* 名称とデバイス情報を一緒に表示 */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 mr-2">
                    <Icon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                    {t(`device.types.${device.type}`)}
                  </span>
                  <span className="text-xl font-medium text-gray-900 dark:text-dark-text max-w-[70%] truncate">
                    {device.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t(batteryShapeToTranslationKey(device.battery_shape))}
                    <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-1.5 py-0.5 text-xs font-medium">
                      {device.battery_count}{t('common.unit')}
                    </span>
                  </span>
                </div>
              </div>
              {/* メモと購入日（ある場合） */}
              {(device.notes || device.purchase_date) && (
                <div className="mt-1.5 flex items-start justify-between">
                  {device.notes ? (
                    <div className="flex items-start flex-1 mr-2">
                      <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{device.notes}</p>
                    </div>
                  ) : (
                    <div className="flex-1"></div>
                  )}
                  {device.purchase_date && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                      {t('common.purchase', { date: new Date(device.purchase_date).toLocaleDateString() })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 上部セクション：左に画像、右に電池状態 */}
          <div className="flex mb-4">
            {/* 上部左：画像 */}
            <div className="flex-shrink-0 mr-4">
              <img
                src={imageUrl || ''}
                alt={device.name}
                className="w-20 h-20 rounded-lg object-cover shadow-sm"
              />
            </div>

            {/* 上部右：電池状態 */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('device.status.batteryExchange')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {device.last_battery_change && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-400">
                    <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    {t('device.status.exchangeDate', { date: new Date(device.last_battery_change).toLocaleDateString() })}
                  </div>
                )}

                {batteryEndDate ? (
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${isOverdue
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : isNearingEnd
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    }`}>
                    <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    {t('device.status.scheduleDate', { date: batteryEndDate.toLocaleDateString() })}
                    {isOverdue && ` (${t('device.status.overdue')})`}
                    {isNearingEnd && ` (${t('device.status.soon')})`}
                  </div>
                ) : (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                    {t('device.status.notSet')} (-)
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
