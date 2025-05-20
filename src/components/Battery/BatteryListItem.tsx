// 電池一覧画面の各電池グループの表示を担当するコンポーネント

import React, { useEffect, useState } from 'react';
import { Battery, Smartphone, Info, Calendar, Hash } from 'lucide-react';
import { BatteryStatusBadge } from './BatteryStatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { getBatteryStatusCounts } from '@/lib/api';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

interface BatteryListItemProps {
  group: BatteryGroup;
}

export function BatteryListItem({ group }: BatteryListItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [installedCount, setInstalledCount] = useState(0);
  const [batteryStatusCounts, setBatteryStatusCounts] = useState({
    charged: 0,
    in_use: 0,
    empty: 0,
    disposed: 0
  });
  const totalCount = group.count;
  const shortId = group.id.slice(0, 8);

  useEffect(() => {
    getBatteryImage((group.shape || group.type) as keyof typeof defaultBatteryImages, group.image_url)
      .then(url => setImageUrl(url));

    // 電池の状態別カウントと設置状況を取得
    async function fetchBatteryStatusCounts() {
      try {
        const { counts, installed } = await getBatteryStatusCounts(group.id);
        setBatteryStatusCounts(counts);
        setInstalledCount(installed);
      } catch (err) {
        console.error('Error fetching battery status counts:', err);
      }
    }

    fetchBatteryStatusCounts();
  }, [group.type, group.image_url, group.id]);

  return (
    <Link
      to={`/batteries/${group.id}`}
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
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('battery.list.batteryStatus')} (全{totalCount}本)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* 満充電 */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${batteryStatusCounts.charged > 0
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-50'
                  }`}>
                  <BatteryStatusBadge status="charged" className="!bg-transparent !p-0" />
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${batteryStatusCounts.charged > 0
                    ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                    {batteryStatusCounts.charged}{t('battery.list.unit')}
                  </span>
                </div>

                {/* 使用中 */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${batteryStatusCounts.in_use > 0
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-50'
                  }`}>
                  <BatteryStatusBadge status="in_use" className="!bg-transparent !p-0" />
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${batteryStatusCounts.in_use > 0
                    ? 'bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                    {batteryStatusCounts.in_use}{t('battery.list.unit')}
                  </span>
                </div>

                {/* 空 */}
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full ${batteryStatusCounts.empty > 0
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-50'
                  }`}>
                  <BatteryStatusBadge status="empty" className="!bg-transparent !p-0" />
                  <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${batteryStatusCounts.empty > 0
                    ? 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                    {batteryStatusCounts.empty}{t('battery.list.unit')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 下部セクション：電池情報 */}
          <div>
            {/* 設置中デバイス */}
            {group.batteries?.some(b => b.device_id && b.devices) && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center">
                  <Smartphone className="h-3 w-3 mr-1.5" />
                  {t('battery.list.installedDevices')}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(() => {
                    // デバイスIDごとに電池数をカウント
                    const deviceCounts: Record<string, { count: number; name: string; id: string }> = {};

                    group.batteries
                      ?.filter(b => b.device_id && b.devices)
                      .forEach(b => {
                        const deviceId = b.device_id as string;
                        if (!deviceCounts[deviceId]) {
                          deviceCounts[deviceId] = {
                            count: 0,
                            name: b.devices?.name || '',
                            id: deviceId
                          };
                        }
                        deviceCounts[deviceId].count++;
                      });

                    // デバイスごとにまとめて表示
                    return Object.values(deviceCounts).map(device => (
                      <button
                        key={device.id}
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // クリックイベントの伝播を停止
                          navigate(`/devices/${device.id}`);
                        }}
                      >
                        <span className="max-w-[120px] truncate">{device.name}</span>
                        <span className="ml-1 bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-xs font-medium">
                          {device.count}{t('battery.list.unit')}
                        </span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
