import React, { useState, useEffect } from 'react';
import { Battery } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-provider';
import {
  useDevice,
  useAvailableBatteries,
  invalidateQueriesCompat,
} from '@/lib/hooks';
import { assignBatteriesToDevice } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { DeviceUsageHistory } from '../DeviceUsageHistory';
import { useTranslation } from 'react-i18next';
import { batteryShapeToTranslationKey } from '@/lib/i18nUtils';

import { Battery as BatteryType, BatteryGroup, BatteryStatus, BatteryKind, SelectedBatteries } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DeviceNotFound } from './components/DeviceNotFound';
import { SelectBatteryHeader } from './components/SelectBatteryHeader';
import { BatteryFilters } from './components/BatteryFilters';
import { DeviceInfoSection } from './components/DeviceInfoSection';
import { BatteryGroups } from './components/BatteryGroup';

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
    SelectedBatteries
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
    return <DeviceNotFound navigate={navigate} />;
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
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            activeFiltersCount={activeFiltersCount}
            resetFilters={resetFilters}
          />
        )}

        <DeviceInfoSection
          device={device}
          batteryShape={device.battery_shape}
        />

        {/* 電池スロットの選択 */}
        {sortedBatteryGroups.length === 0 ? (
          <div className="p-6 text-center">
            <Battery className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-dark-text">
              {t('device.select.noBatteries')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('device.select.registerNew', { batteryType: t(noBatteriesTypeKey) })}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden mb-6">
            <div className="divide-y divide-gray-200 dark:divide-dark-border">
              {/* 電池グループごと */
                sortedBatteryGroups.map((group) => {
                  const batteries = (group.batteries || [])
                    .filter((battery: BatteryType) =>
                      statusFilter.includes(battery.status as BatteryStatus)
                    )
                    .sort((a: BatteryType, b: BatteryType) => a.slot_number - b.slot_number);

                  if (batteries.length === 0) return null;

                  return (
                    <div key={group.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text">
                            {group.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('battery.list.total', { count: batteries.length })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.kind === 'rechargeable'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}
                          >
                            {group.kind === 'rechargeable'
                              ? t('battery.kind.rechargeable')
                              : t('battery.kind.disposable')}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        { /* 電池スロットごと */}
                        {batteries.map((battery: BatteryType) => (
                          <BatteryGroups
                            key={battery.id}
                            battery={battery}
                            group={group}
                            device={device}
                            deviceId={deviceId || ''}
                            selectedBatteries={selectedBatteries}
                            handleToggleBattery={handleToggleBattery}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
