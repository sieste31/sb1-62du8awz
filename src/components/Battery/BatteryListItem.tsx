// 電池一覧画面の各電池グループの表示を担当するコンポーネント

import React, { useEffect, useState } from 'react';
import { Smartphone, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import { BatteryGroup } from './types';
import { BatteryStatusDisplay } from './components/BatteryStatusDisplay';
import { getDeviceBatteryCounts, getBatteryStatusCounts } from './utils/batteryUtils';

interface BatteryListItemProps {
  /**
   * 表示する電池グループ
   */
  group: BatteryGroup;
  /**
   * デモモードかどうか
   */
  isDemoMode?: boolean;
}

export function BatteryListItem({ group, isDemoMode = false }: BatteryListItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [batteryStatusCounts, setBatteryStatusCounts] = useState({
    charged: 0,
    in_use: 0,
    empty: 0,
    disposed: 0
  });
  const [deviceBatteryCounts, setDeviceBatteryCounts] = useState<Array<{
    deviceId: string;
    deviceName: string;
    batteryCount: number;
  }>>([]);

  const totalCount = group.count;
  const shortId = group.id.slice(0, 8);

  useEffect(() => {
    // 画像の取得
    getBatteryImage((group.shape || group.type) as keyof typeof defaultBatteryImages, group.image_url)
      .then(url => setImageUrl(url));

    // 電池の状態別カウントと設置状況を取得
    const statusCounts = getBatteryStatusCounts(group);
    setBatteryStatusCounts(statusCounts);

    // デバイス別電池数の集計
    const deviceCounts = getDeviceBatteryCounts(group);
    setDeviceBatteryCounts(deviceCounts);
  }, [group]);

  const linkTo = isDemoMode
    ? `/demo/batteries/${group.id}`
    : `/app/batteries/${group.id}`;

  const navigateToDevice = (e: React.MouseEvent, deviceId: string) => {
    e.stopPropagation(); // クリックイベントの伝播を停止
    navigate(isDemoMode ? `/demo/devices/${deviceId}` : `/app/devices/${deviceId}`);
  };

  return (
    <Link
      to={linkTo}
      className="block bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex flex-col">
          {/* タイトル部分 */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <span className="text-xl font-medium text-gray-900 dark:text-dark-text max-w-[70%] truncate">
                  {group.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                    {t(batteryShapeToTranslationKey(group.shape))}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${group.kind === 'rechargeable'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                    }`}>
                    {group.kind === 'rechargeable'
                      ? t('battery.kind.rechargeable')
                      : t('battery.kind.disposable')}
                  </span>
                </div>
              </div>
              {/* メモ（ある場合） */}
              {group.notes && (
                <div className="mt-1.5 flex items-start">
                  <Info className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{group.notes}</p>
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
                alt={t('battery.image.alt', { type: group.shape || group.type })}
                className="w-20 h-20 rounded-lg object-cover shadow-sm"
              />
            </div>

            {/* 上部右：電池状態 */}
            <div className="flex-1 min-w-0">
              <BatteryStatusDisplay
                statusCounts={batteryStatusCounts}
                totalCount={totalCount}
                interactive={false}
              />
            </div>
          </div>

          {/* 下部セクション：電池情報 */}
          <div>
            {/* 設置中デバイス */}
            {deviceBatteryCounts.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <Smartphone className="h-3 w-3 mr-1.5" />
                  {t('battery.list.installedDevices')}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {deviceBatteryCounts.map(device => (
                    <button
                      key={device.deviceId}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      onClick={(e) => navigateToDevice(e, device.deviceId)}
                    >
                      <span className="max-w-[120px] truncate">{device.deviceName}</span>
                      <span className="ml-1 bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-xs font-medium">
                        {device.batteryCount}{t('battery.list.unit')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
