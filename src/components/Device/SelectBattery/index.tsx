// 電池選択画面のコンポーネント

import React, { useState, useEffect } from 'react';
import { Battery, ArrowLeft, History, Filter, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-provider';
import {
  useDevice,
  useAvailableBatteries,
  invalidateQueriesCompat,
} from '@/lib/hooks';
import { assignBatteriesToDevice } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { BatteryStatusBadge } from '@/components/Battery/BatteryStatusBadge';
import { DeviceUsageHistory } from '../DeviceUsageHistory';
import type { Database } from '@/lib/database.types';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';

type Battery = Database['public']['Tables']['batteries']['Row'] & {
  devices?: Database['public']['Tables']['devices']['Row'] | null;
  slot_number: number;
};

type BatteryGroup = Database['public']['Tables']['battery_groups']['Row'] & {
  batteries?: (Battery & {
    devices?: Database['public']['Tables']['devices']['Row'] | null;
  })[];
};

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';
type BatteryKind = 'all' | 'disposable' | 'rechargeable';

// ユーティリティ関数
export function getBatteryStatusLabel(status: BatteryStatus, t: (key: string) => string): string {
  switch (status) {
    case 'charged': return t('battery.status.charged');
    case 'in_use': return t('battery.status.in_use');
    case 'empty': return t('battery.status.empty');
    case 'disposed': return t('battery.status.disposed');
    default: return t('battery.status.unknown');
  }
}

export function getBatteryKindLabel(kind: BatteryKind, t: (key: string) => string): string {
  switch (kind) {
    case 'all': return t('common.all');
    case 'disposable': return t('battery.kind.disposable');
    case 'rechargeable': return t('battery.kind.rechargeable');
    default: return kind;
  }
}

// ローディングスピナーコンポーネント
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

// デバイス未発見時のコンポーネント
function DeviceNotFound({
  t,
  navigate
}: {
  t: (key: string) => string,
  navigate: (path: string) => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600">{t('device.select.deviceNotFound')}</p>
        <button
          onClick={() => navigate('/devices')}
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('device.detail.backToList')}
        </button>
      </div>
    </div>
  );
}

// ヘッダーコンポーネント
function SelectBatteryHeader({
  t,
  navigate,
  deviceId,
  setShowFilters,
  showFilters,
  activeFiltersCount,
  setShowHistory,
  handleConfirm,
  saving
}: {
  t: (key: string) => string,
  navigate: (path: string) => void,
  deviceId?: string,
  setShowFilters: (show: boolean) => void,
  showFilters: boolean,
  activeFiltersCount: number,
  setShowHistory: (show: boolean) => void,
  handleConfirm: () => void,
  saving: boolean
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/devices/${deviceId}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('device.select.backToDevice')}
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('device.select.filter')}
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <History className="h-4 w-4 mr-1" />
            {t('device.select.history')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? t('device.select.saving') : t('device.select.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

// フィルターコンポーネント
function BatteryFilters({
  t,
  statusFilter,
  setStatusFilter,
  kindFilter,
  setKindFilter,
  activeFiltersCount,
  resetFilters
}: {
  t: (key: string) => string,
  statusFilter: BatteryStatus[],
  setStatusFilter: (filters: BatteryStatus[]) => void,
  kindFilter: BatteryKind,
  setKindFilter: (kind: BatteryKind) => void,
  activeFiltersCount: number,
  resetFilters: () => void
}) {
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('device.select.filterTitle')}</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X className="h-3 w-3 mr-1" />
            {t('device.select.reset')}
          </button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('device.select.batteryStatus')}
          </label>
          <div className="flex flex-wrap gap-2">
            {(['charged', 'in_use', 'empty', 'disposed'] as BatteryStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(
                    statusFilter.includes(status)
                      ? statusFilter.filter((s) => s !== status)
                      : [...statusFilter, status]
                  );
                }}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusFilter.includes(status)
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {getBatteryStatusLabel(status, t)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('device.select.batteryType')}
          </label>
          <div className="flex flex-wrap gap-2">
            {(['all', 'disposable', 'rechargeable'] as BatteryKind[]).map((kind) => (
              <button
                key={kind}
                onClick={() => setKindFilter(kind)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${kindFilter === kind
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {getBatteryKindLabel(kind, t)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// デバイス情報セクション
function DeviceInfoSection({
  t,
  device,
  batteryShape
}: {
  t: (key: string, options?: any) => string,
  device: Database['public']['Tables']['devices']['Row'],
  batteryShape: string
}) {
  const batteryTypeKey = batteryShapeToTranslationKey(batteryShape);
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">{t('device.select.settingTitle')}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('device.select.settingDescription', {
            deviceName: device.name,
            batteryType: t(batteryTypeKey),
            count: device.battery_count
          })}
        </p>
      </div>
    </div>
  );
}

// メインのSelectBatteryコンポーネント
export function SelectBattery() {
  const { t } = useTranslation();
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    device,
    batteries: installedBatteries,
    loading: deviceLoading,
  } = useDevice(deviceId || '');
  const { availableBatteryGroups, loading: batteriesLoading } =
    useAvailableBatteries(device?.battery_shape ?? '');
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
    if (statusFilter.length !== 4) count++;
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
    return <LoadingSpinner />;
  }

  if (!device) {
    return <DeviceNotFound t={t} navigate={navigate} />;
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
    if (!user || !deviceId) return;

    setSaving(true);
    setError(null);

    try {
      await assignBatteriesToDevice(
        deviceId,
        selectedBatteries.map(b => b.batteryId),
        user.id
      );

      const { invalidateBatteries, invalidateDevices } =
        invalidateQueriesCompat(queryClient);
      await Promise.all([invalidateBatteries(), invalidateDevices()]);

      navigate(`/devices/${deviceId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('device.select.createError'));
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setStatusFilter(['charged', 'in_use']);
    setKindFilter('all');
  };

  // 電池グループをソートとフィルタリング
  const sortedBatteryGroups = [...availableBatteryGroups]
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    .filter((group) => kindFilter === 'all' || group.kind === kindFilter)
    .map(group => {
      const extendedBatteries = (group as any).batteries
        ? (group as any).batteries.map((battery: any) => ({
          ...battery,
          slot_number: battery.slot_number || 0,
          status: battery.status || 'empty',
          devices: battery.devices || null,
          id: battery.id || '',
          group_id: battery.group_id || group.id,
          device_id: battery.device_id || null,
          created_at: battery.created_at || '',
          user_id: battery.user_id || ''
        }))
        : [];

      return {
        ...group,
        batteries: extendedBatteries
      };
    });

  const noBatteriesTypeKey = batteryShapeToTranslationKey(device.battery_shape);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SelectBatteryHeader
          t={t}
          navigate={navigate}
          deviceId={deviceId}
          setShowFilters={setShowFilters}
          showFilters={showFilters}
          activeFiltersCount={activeFiltersCount}
          setShowHistory={setShowHistory}
          handleConfirm={handleConfirm}
          saving={saving}
        />

        {showFilters && (
          <BatteryFilters
            t={t}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            activeFiltersCount={activeFiltersCount}
            resetFilters={resetFilters}
          />
        )}

        <DeviceInfoSection
          t={t}
          device={device}
          batteryShape={device.battery_shape}
        />

        {sortedBatteryGroups.length === 0 ? (
          <div className="p-6 text-center">
            <Battery className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t('device.select.noBatteries')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('device.select.registerNew', { batteryType: t(noBatteriesTypeKey) })}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="divide-y divide-gray-200">
              {sortedBatteryGroups.map((group) => {
                const batteries = (group.batteries || [])
                  .filter((battery: Battery) =>
                    statusFilter.includes(battery.status as BatteryStatus)
                  )
                  .sort((a: Battery, b: Battery) => a.slot_number - b.slot_number);

                if (batteries.length === 0) return null;

                return (
                  <div key={group.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {group.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {t('battery.list.total', { count: batteries.length })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.kind === 'rechargeable'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {group.kind === 'rechargeable'
                            ? t('battery.kind.rechargeable')
                            : t('battery.kind.disposable')}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {batteries.map((battery: Battery) => {
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
                            className={`relative flex items-center p-4 border rounded-lg ${isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500'
                              : isInstalledInOtherDevice
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-gray-300 hover:border-gray-400'
                              } ${isDisabled && !isInstalledInOtherDevice
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
                                  {t('device.status.installedIn', { deviceName: battery.devices.name })}
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
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <DeviceUsageHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          deviceId={deviceId || ''}
          deviceName={device.name}
        />
      </div>
    </div>
  );
}
