// デバイスの電池交換履歴を表示するモーダルコンポーネント

import React, { useMemo } from 'react';
import { X, Battery, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDeviceUsageHistory } from '@/lib/api/devices';
import type { Database } from '@/lib/database.types';

type UsageHistory = Database['public']['Tables']['battery_usage_history']['Row'] & {
  batteries: (Database['public']['Tables']['batteries']['Row'] & {
    battery_groups: Database['public']['Tables']['battery_groups']['Row'];
  });
};

type GroupedUsageHistory = {
  timestamp: string;
  records: UsageHistory[];
  batteryCount: number;
  expanded?: boolean;
};

interface DeviceUsageHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  deviceName: string;
}

export function DeviceUsageHistory({ isOpen, onClose, deviceId, deviceName }: DeviceUsageHistoryProps) {
  const { data: history, isLoading } = useQuery<UsageHistory[]>({
    queryKey: ['deviceUsageHistory', deviceId],
    queryFn: async () => {
      const data = await getDeviceUsageHistory(deviceId);
      return data as UsageHistory[];
    },
    enabled: isOpen,
    initialData: []
  });

  const groupedHistory = useMemo(() => {
    if (!history || history.length === 0) return [];

    const groups = new Map<string, UsageHistory[]>();

    history.forEach(record => {
      const key = record.started_at;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(record);
    });

    return Array.from(groups.entries())
      .map(([timestamp, records]) => ({
        timestamp,
        records,
        batteryCount: records.length,
        expanded: false
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [history]);

  const [expandedGroups, setExpandedGroups] = React.useState<{ [key: string]: boolean }>({});

  const toggleGroupExpand = (timestamp: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [timestamp]: !prev[timestamp]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景のオーバーレイ */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* モーダルコンテンツ */}
        <div className="inline-block align-bottom bg-white dark:bg-dark-card rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-dark-card rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-text">
                {deviceName}の電池交換履歴
              </h3>

              {isLoading ? (
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                </div>
              ) : groupedHistory && groupedHistory.length > 0 ? (
                <div className="mt-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {groupedHistory.map((group, groupIdx) => (
                        <li key={group.timestamp}>
                          <div className="relative pb-8">
                            {groupIdx !== groupedHistory.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                                  <Battery className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div className="w-full">
                                  <div
                                    className="flex items-center cursor-pointer"
                                    onClick={() => toggleGroupExpand(group.timestamp)}
                                  >
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                                      {group.batteryCount}個の電池を設置
                                    </p>
                                    {expandedGroups[group.timestamp] ? (
                                      <ChevronUp className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(group.timestamp).toLocaleString()}
                                  </p>

                                  {expandedGroups[group.timestamp] && (
                                    <div className="mt-2 space-y-1">
                                      {group.records.map(record => (
                                        <div
                                          key={record.id}
                                          className="text-xs text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-blue-200"
                                        >
                                          {record.batteries.battery_groups.name} #{record.batteries.slot_number}
                                        </div>
                                      ))}
                                    </div>
                                  )}
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
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  電池交換履歴はありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
