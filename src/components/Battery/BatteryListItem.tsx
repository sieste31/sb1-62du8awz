// 電池一覧画面の各電池グループの表示を担当するコンポーネント

import React, { useEffect, useState } from 'react';
import { Battery, Smartphone, Info, Calendar, Hash } from 'lucide-react';
import { BatteryStatusBadge } from './BatteryStatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { getBatteryImage, defaultBatteryImages } from '@/lib/batteryImages';
import { getBatteryStatusCounts } from '@/lib/api';
import type { Database } from '@/lib/database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

interface BatteryListItemProps {
  group: BatteryGroup;
}

export function BatteryListItem({ group }: BatteryListItemProps) {
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
      className="block bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 hover:scale-[1.01] transition-all duration-200"
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <img
              src={imageUrl || ''}
              alt={`${group.shape || group.type}の画像`}
              className="w-full sm:w-24 h-24 rounded-lg object-cover shadow-sm"
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* ヘッダー情報（名前、タイプ、種別） */}
            <div className="flex flex-wrap items-start justify-between mb-2">
              <span className="text-xl font-medium text-gray-900">
                {group.name}
              </span>
              <div className="flex items-center mt-1 sm:mt-0">
                <Hash className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400 font-mono">{shortId}</span>
              </div>
            </div>
            
            {/* 電池情報 */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-sm font-medium text-gray-600">
                {group.shape || group.type}
                <span className="ml-1 bg-gray-200 text-gray-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                  {totalCount}本
                </span>
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                group.kind === 'rechargeable' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {group.kind === 'rechargeable' ? '充電池' : '使い切り'}
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(group.created_at).toLocaleDateString()}
              </span>
            </div>
            
            {/* 電池状態の表示 */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>電池状態:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {batteryStatusCounts.charged > 0 && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-xs text-green-700">
                    <BatteryStatusBadge status="charged" className="!bg-transparent !p-0" />
                    <span className="ml-1 bg-green-200 text-green-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                      {batteryStatusCounts.charged}本
                    </span>
                  </div>
                )}
                {batteryStatusCounts.in_use > 0 && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-700">
                    <BatteryStatusBadge status="in_use" className="!bg-transparent !p-0" />
                    <span className="ml-1 bg-blue-200 text-blue-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                      {batteryStatusCounts.in_use}本
                    </span>
                  </div>
                )}
                {batteryStatusCounts.empty > 0 && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-yellow-50 text-xs text-yellow-700">
                    <BatteryStatusBadge status="empty" className="!bg-transparent !p-0" />
                    <span className="ml-1 bg-yellow-200 text-yellow-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                      {batteryStatusCounts.empty}本
                    </span>
                  </div>
                )}
                {batteryStatusCounts.disposed > 0 && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-xs text-red-700">
                    <BatteryStatusBadge status="disposed" className="!bg-transparent !p-0" />
                    <span className="ml-1 bg-red-200 text-red-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                      {batteryStatusCounts.disposed}本
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* メモ（ある場合） */}
            {group.notes && (
              <div className="mt-3 flex items-start">
                <Info className="h-3.5 w-3.5 text-gray-400 mt-0.5 mr-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-500 line-clamp-2">{group.notes}</p>
              </div>
            )}
            
            {/* 設置中デバイス */}
            {group.batteries?.some(b => b.device_id && b.devices) && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-600 flex items-center">
                  <Smartphone className="h-3 w-3 mr-1.5" />
                  設置中のデバイス:
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
                        className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // クリックイベントの伝播を停止
                          navigate(`/devices/${device.id}`);
                        }}
                      >
                        <span className="max-w-[120px] truncate">{device.name}</span>
                        <span className="ml-1 bg-blue-200 text-blue-800 rounded-full px-1.5 py-0.5 text-xs font-medium">
                          {device.count}本
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
