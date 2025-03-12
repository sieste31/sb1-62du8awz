'use client';

import React, { useState, useEffect } from 'react';
import { Battery, ArrowLeft, History, Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import {
  useDevice,
  useAvailableBatteries,
  invalidateQueries,
} from '@/lib/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { BatteryStatusBadge } from '@/components/BatteryStatusBadge';
import { DeviceUsageHistory } from './DeviceUsageHistory';
import type { Database } from '@/lib/database.types';

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Database['public']['Tables']['batteries']['Row'] & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';
type BatteryKind = 'all' | 'disposable' | 'rechargeable';

const batteryStatusLabels: Record<BatteryStatus, string> = {
  charged: '満充電',
  in_use: '使用中',
  empty: '使用済み',
  disposed: '廃棄',
};

const batteryKindLabels: Record<BatteryKind, string> = {
  all: 'すべて',
  disposable: '使い切り',
  rechargeable: '充電池',
};

interface SelectBatteryProps {
  deviceId: string;
}

export function SelectBattery({ deviceId }: SelectBatteryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    device,
    batteries: installedBatteries,
    loading: deviceLoading,
  } = useDevice(deviceId);
  const { availableBatteryGroups, loading: batteriesLoading } =
    useAvailableBatteries(device?.battery_type ?? '');
  const [selectedBatteries, setSelectedBatteries] = useState<
    Array<{ groupId: string; batteryId: string; status: BatteryStatus }>
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BatteryStatus[]>([
    'charged',
    'in_use',
  ]);
  const [kindFilter, setKindFilter] = useState<BatteryKind>('all');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // フィルターの数を計算
  useEffect(() => {
    let count = 0;
    if (statusFilter.length !== Object.keys(batteryStatusLabels).length)
      count++;
    if (kindFilter !== 'all') count++;
    setActiveFiltersCount(count);
  }, [statusFilter, kindFilter]);

  // 初期選択状態を設定
  useEffect(() => {
    if (installedBatteries.length > 0) {
      setSelectedBatteries(
        installedBatteries.map((battery) => ({
          groupId: battery.group_id,
          batteryId: battery.id,
          status: battery.status as BatteryStatus,
        }))
      );
    }
  }, [installedBatteries]);

  if (deviceLoading || batteriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">デバイスが見つかりません</p>
          <button
            onClick={() => router.push('/devices')}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const handleToggleBattery = (
    groupId: string,
    batteryId: string,
    status: BatteryStatus
  ) => {
    setSelectedBatteries((prev) => {
      const isSelected = prev.some((b) => b.batteryId === batteryId);
      if (isSelected) {
        return prev.filter((b) => b.batteryId !== batteryId);
      } else if (prev.length < device.battery_count) {
        return [...prev, { groupId, batteryId, status }];
      }
      return prev;
    });
  };

  const handleConfirm = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      const now = new Date().toISOString();

      // 既存の電池を取り外し
      if (installedBatteries.length > 0) {
        // 使用履歴を更新
        const { data: historyData } = await supabase
          .from('battery_usage_history')
          .select('id')
          .eq('device_id', deviceId)
          .is('ended_at', null);

        if (historyData && historyData.length > 0) {
          await supabase
            .from('battery_usage_history')
            .update({ ended_at: now })
            .in(
              'id',
              historyData.map((h) => h.id)
            );
        }

        // 電池を取り外し
        const { error: removeError } = await supabase
          .from('batteries')
          .update({
            device_id: null,
            status: 'empty',
            last_checked: now,
          })
          .eq('device_id', deviceId);

        if (removeError) throw removeError;
      }

      // 選択された電池を設定
      if (selectedBatteries.length > 0) {
        // デバイスの最終電池交換日を更新
        const { error: deviceUpdateError } = await supabase
          .from('devices')
          .update({
            last_battery_change: now,
          })
          .eq('id', deviceId);

        if (deviceUpdateError) throw deviceUpdateError;

        // 電池を設定
        const { error: updateError } = await supabase
          .from('batteries')
          .update({
            device_id: deviceId,
            status: 'in_use',
            last_checked: now,
            last_changed_at: now,
          })
          .in(
            'id',
            selectedBatteries.map((b) => b.batteryId)
          );

        if (updateError) throw updateError;

        // 使用履歴を記録
        const historyRecords = selectedBatteries.map((battery) => ({
          battery_id: battery.batteryId,
          device_id: deviceId,
          started_at: now,
          user_id: user.id,
        }));

        const { error: historyError } = await supabase
          .from('battery_usage_history')
          .insert(historyRecords);

        if (historyError) throw historyError;
      }

      // キャッシュを無効化
      const { invalidateBatteries, invalidateDevices } =
        invalidateQueries(queryClient);
      await Promise.all([invalidateBatteries(), invalidateDevices()]);

      router.push(`/devices/${deviceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '電池の設定に失敗しました');
      setSaving(false);
    }
  };

  // フィルターをリセット
  const resetFilters = () => {
    setStatusFilter(['charged', 'in_use']);
    setKindFilter('all');
  };

  // 電池グループを名前でソート
  const sortedBatteryGroups = [...availableBatteryGroups]
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .filter((group) => kindFilter === 'all' || group.kind === kindFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/devices/${deviceId}`)}
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              デバイス詳細に戻る
            </button>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                フィルター
                {activeFiltersCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <History className="h-4 w-4 mr-1" />
                交換履歴
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? '設定中...' : '選択を確定'}
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">フィルター</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 hover:text-gray-900"
                >
                  <X className="h-3 w-3 mr-1" />
                  リセット
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電池の状態
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(batteryStatusLabels) as [
                      BatteryStatus,
                      string
                    ][]
                  ).map(([status, label]) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter((prev) =>
                          prev.includes(status)
                            ? prev.filter((s) => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        statusFilter.includes(status)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電池タイプ
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(batteryKindLabels) as [BatteryKind, string][]
                  ).map(([kind, label]) => (
                    <button
                      key={kind}
                      onClick={() => setKindFilter(kind)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        kindFilter === kind
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">電池の設定</h2>
            <p className="mt-1 text-sm text-gray-500">
              {device.name}に設定する電池を選択してください（最大
              {device.battery_count}本）
            </p>
          </div>

          {sortedBatteryGroups.length === 0 ? (
            <div className="p-6 text-center">
              <Battery className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                利用可能な電池がありません
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {device.battery_type}の新しい電池を登録してください
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedBatteryGroups.map((group) => {
                // フィルターに一致する電池のみを表示
                const batteries =
                  group.batteries
                    ?.filter((battery) =>
                      statusFilter.includes(battery.status as BatteryStatus)
                    )
                    .sort((a, b) => a.slot_number - b.slot_number) ?? [];

                if (batteries.length === 0) return null;

                return (
                  <div key={group.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {group.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          総数: {batteries.length}本
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            group.kind === 'rechargeable'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {group.kind === 'rechargeable'
                            ? '充電池'
                            : '使い切り'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {batteries.map((battery) => {
                        const isSelected = selectedBatteries.some(
                          (b) => b.batteryId === battery.id
                        );
                        const isInstalled = battery.device_id !== null;
                        const isInstalledInOtherDevice =
                          isInstalled && battery.device_id !== deviceId;
                        const isDisabled =
                          !isSelected &&
                          (selectedBatteries.length >= device.battery_count ||
                            isInstalledInOtherDevice);

                        return (
                          <button
                            key={battery.id}
                            onClick={() =>
                              !isInstalledInOtherDevice &&
                              handleToggleBattery(
                                group.id,
                                battery.id,
                                battery.status as BatteryStatus
                              )
                            }
                            disabled={isDisabled}
                            className={`relative flex items-center p-4 border rounded-lg ${
                              isSelected
                                ? 'border-blue-500 ring-2 ring-blue-500'
                                : isInstalledInOtherDevice
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-gray-300 hover:border-gray-400'
                            } ${
                              isDisabled && !isInstalledInOtherDevice
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                #{battery.slot_number}
                              </p>
                              <div className="mt-1">
                                <BatteryStatusBadge
                                  status={battery.status as BatteryStatus}
                                />
                              </div>
                              {isInstalledInOtherDevice && battery.devices && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {battery.devices.name}に設置中
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DeviceUsageHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          deviceId={deviceId}
          deviceName={device.name}
        />
      </div>
    </div>
  );
}