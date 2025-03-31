// 電池の使用履歴を表示するモーダルコンポーネント
// 使用履歴はSupabaseのbattery_usage_historyテーブルから取得

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBatteryUsageHistory } from '@/lib/api';
import type { Database } from '@/lib/database.types';

type UsageHistory = Database['public']['Tables']['battery_usage_history']['Row'] & {
  devices: Database['public']['Tables']['devices']['Row'];
};

interface BatteryUsageHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  batteryId: string;
  batteryName: string;
}

export function BatteryUsageHistory({ isOpen, onClose, batteryId, batteryName }: BatteryUsageHistoryProps) {
  const { data: history, isLoading } = useQuery({
    queryKey: ['batteryUsageHistory', batteryId],
    queryFn: async () => {
      const data = await getBatteryUsageHistory(batteryId);
      return data as UsageHistory[];
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景のオーバーレイ */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* モーダルコンテンツ */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {batteryName}の使用履歴
              </h3>

              {isLoading ? (
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : history && history.length > 0 ? (
                <div className="mt-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {history.map((record, recordIdx) => (
                        <li key={record.id}>
                          <div className="relative pb-8">
                            {recordIdx !== history.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                                  <Calendar className="h-5 w-5 text-blue-600" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {record.devices.name}で使用
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {new Date(record.started_at).toLocaleString()}
                                    {record.ended_at && (
                                      <>
                                        {' → '}
                                        {new Date(record.ended_at).toLocaleString()}
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  使用履歴はありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
