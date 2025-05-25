// デバイス一覧画面の各デバイスを表示するコンポーネント

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Hash, Info } from 'lucide-react';
import { getDeviceImage } from '@/lib/deviceImages';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { DEVICE_TYPE_ICONS, DEVICE_BATTERY_STATUS_STYLES } from './constants';
import { calculateBatteryEndDate, getDeviceBatteryStatus } from './utils/deviceUtils';
import type { Device } from './types';

export function DeviceListItem({ device }: { device: Device }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // デバイスタイプに対応するアイコン
  const Icon = DEVICE_TYPE_ICONS[device.type];

  // 電池切れ予想日の計算
  const batteryEndDate = calculateBatteryEndDate(device);
  const batteryStatus = getDeviceBatteryStatus(device);

  // デバイス画像の取得
  useEffect(() => {
    getDeviceImage(device.type, device.image_url)
      .then(url => setImageUrl(url));
  }, [device.type, device.image_url]);

  // バッテリーステータスのスタイル取得
  const statusStyle = DEVICE_BATTERY_STATUS_STYLES[batteryStatus];

  return (
    <Link
      to={`/devices/${device.id}`}
      className="block bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex flex-col">
          {/* デバイス情報のヘッダー */}
          <div className="flex flex-wrap items-center mb-4 gap-2">
            <div className="flex flex-col w-full">
              {/* デバイス名称 */}
              <div className="flex items-center">
                <span className="text-xl font-medium text-gray-900 dark:text-dark-text truncate">
                  {device.name}
                </span>
              </div>

              {/* メモ */}
              {device.notes && (
                <div className="mt-1.5 flex items-start">
                  <div className="flex items-start flex-1 mr-2">
                    <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{device.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* デバイスタイプと電池形状と購入日 */}
          <div className="flex mb-2 gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
              <Icon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
              {t(`device.types.${device.type}`)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
              {t(batteryShapeToTranslationKey(device.battery_shape))}
              <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {device.battery_count}{t('common.unit')}
              </span>
            </span>
            {device.purchase_date && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                {t('common.purchase', { date: new Date(device.purchase_date).toLocaleDateString() })}
              </span>
            )}
          </div>

          {/* デバイス画像と電池状態 */}
          <div className="flex mb-4">
            {/* デバイス画像 */}
            <div className="flex-shrink-0 mr-4">
              <img
                src={imageUrl || ''}
                alt={device.name}
                className="w-20 h-20 rounded-lg object-cover shadow-sm"
              />
            </div>

            {/* 電池状態 */}
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
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${statusStyle.color.background} ${statusStyle.color.text}`}>
                    <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                    {t('device.status.scheduleDate', { date: batteryEndDate.toLocaleDateString() })}
                    {batteryStatus === 'overdue' && ` (${t('device.status.overdue')})`}
                    {batteryStatus === 'nearingEnd' && ` (${t('device.status.soon')})`}
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
