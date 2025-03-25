// デバイス一覧画面のコンポーネント

'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Filter, ArrowDownAZ, ArrowUpAZ, X, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useDevices } from '@/lib/hooks';
import { DeviceListItem } from './DeviceListItem';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type DeviceType = 'all' | 'smartphone' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy';
type BatteryType = 'all' | '単1形' | '単2形' | '単3形' | '単4形' | '9V形';
type SortOrder = 'none' | 'asc' | 'desc' | 'battery-end-asc' | 'battery-end-desc';

const deviceTypeLabels: Record<DeviceType, string> = {
  all: 'すべて',
  smartphone: 'スマホ/リモコン',
  speaker: 'スピーカー',
  camera: 'カメラ',
  gadget: 'ガジェット',
  light: 'ライト',
  toy: 'おもちゃ'
};

// 電池切れ予想日を計算する関数
function calculateBatteryEndDate(device: Device) {
  if (!device.last_battery_change || !device.battery_life_weeks) return null;
  const lastChange = new Date(device.last_battery_change);
  const endDate = new Date(lastChange);
  endDate.setDate(endDate.getDate() + (device.battery_life_weeks * 7));
  return endDate;
}

interface DeviceListSectionProps {
  title: string;
  devices: Device[];
  isOpen: boolean;
  onToggle: () => void;
  isDesktop: boolean;
}

function DeviceListSection({ title, devices, isOpen, onToggle, isDesktop }: DeviceListSectionProps) {
  if (devices.length === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100"
      >
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          {isOpen ? <ChevronDown className="h-5 w-5 mr-2" /> : <ChevronRight className="h-5 w-5 mr-2" />}
          {title}
          <span className="ml-2 text-sm text-gray-500">({devices.length})</span>
        </h3>
      </button>
      {isOpen && (
        <div className={`p-4 grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {devices.map((device) => (
            <DeviceListItem key={device.id} device={device} />
          ))}
        </div>
      )}
    </div>
  );
}

export function DeviceList() {
  const { devices, loading } = useDevices();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [showFilters, setShowFilters] = useState(false);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceType>('all');
  const [batteryTypeFilter, setBatteryTypeFilter] = useState<BatteryType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [showWithBatteries, setShowWithBatteries] = useState(true);
  const [showWithoutBatteries, setShowWithoutBatteries] = useState(true);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (deviceTypeFilter !== 'all') count++;
    if (batteryTypeFilter !== 'all') count++;
    if (sortOrder !== 'none') count++;
    setActiveFiltersCount(count);
  }, [deviceTypeFilter, batteryTypeFilter, sortOrder]);

  // Apply filters and sorting
  const filteredAndSortedDevices = React.useMemo(() => {
    let result = [...devices];
    
    // Apply device type filter
    if (deviceTypeFilter !== 'all') {
      result = result.filter(device => device.type === deviceTypeFilter);
    }
    
    // Apply battery type filter
    if (batteryTypeFilter !== 'all') {
      result = result.filter(device => device.battery_type === batteryTypeFilter);
    }
    
    // Apply sorting
    if (sortOrder !== 'none') {
      result.sort((a, b) => {
        if (sortOrder === 'battery-end-asc' || sortOrder === 'battery-end-desc') {
          const dateA = calculateBatteryEndDate(a);
          const dateB = calculateBatteryEndDate(b);
          
          // Handle null values
          if (!dateA && !dateB) return 0;
          if (!dateA) return sortOrder === 'battery-end-asc' ? 1 : -1;
          if (!dateB) return sortOrder === 'battery-end-asc' ? -1 : 1;
          
          // Compare dates
          return sortOrder === 'battery-end-asc'
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        } else {
          // Handle last_battery_change sorting
          if (!a.last_battery_change && !b.last_battery_change) return 0;
          if (!a.last_battery_change) return sortOrder === 'asc' ? 1 : -1;
          if (!b.last_battery_change) return sortOrder === 'asc' ? -1 : 1;
          
          const dateA = new Date(a.last_battery_change).getTime();
          const dateB = new Date(b.last_battery_change).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
      });
    }
    
    return result;
  }, [devices, deviceTypeFilter, batteryTypeFilter, sortOrder]);

  // デバイスを電池の有無で分類
  const { withBatteries, withoutBatteries } = React.useMemo(() => {
    const withBatteries: Device[] = [];
    const withoutBatteries: Device[] = [];

    filteredAndSortedDevices.forEach(device => {
      if (device.has_batteries) {
        withBatteries.push(device);
      } else {
        withoutBatteries.push(device);
      }
    });

    return { withBatteries, withoutBatteries };
  }, [filteredAndSortedDevices]);

  // Reset all filters
  const resetFilters = () => {
    setDeviceTypeFilter('all');
    setBatteryTypeFilter('all');
    setSortOrder('none');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">デバイス一覧</h2>
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
            <Link
              href="/devices/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">フィルターとソート</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* デバイス種別フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  デバイス種別
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(deviceTypeLabels) as DeviceType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setDeviceTypeFilter(type)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        deviceTypeFilter === type
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {deviceTypeLabels[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 電池種別フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電池種別
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', '単1形', '単2形', '単3形', '単4形', '9V形'] as BatteryType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setBatteryTypeFilter(type)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                        batteryTypeFilter === type
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' ? 'すべて' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* ソート */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  並び替え
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'battery-end-asc' ? 'none' : 'battery-end-asc')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      sortOrder === 'battery-end-asc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    交換予定日が近い順
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'battery-end-desc' ? 'none' : 'battery-end-desc')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      sortOrder === 'battery-end-desc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    交換予定日が遠い順
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      sortOrder === 'asc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowUpAZ className="h-4 w-4 mr-1" />
                    交換日が古い順
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      sortOrder === 'desc'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <ArrowDownAZ className="h-4 w-4 mr-1" />
                    交換日が新しい順
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {devices.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">デバイスがありません</h3>
            <p className="mt-1 text-sm text-gray-500">新しいデバイスを登録してください。</p>
            <div className="mt-6">
              <Link
                href="/devices/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Link>
            </div>
          </div>
        </div>
      ) : filteredAndSortedDevices.length === 0 ? (
        <div className="bg-white shadow rounded-lg">
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">条件に一致するデバイスがありません</h3>
            <p className="mt-1 text-sm text-gray-500">フィルター条件を変更してください。</p>
            <div className="mt-6">
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                フィルターをリセット
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <DeviceListSection
            title="電池設定済みのデバイス"
            devices={withBatteries}
            isOpen={showWithBatteries}
            onToggle={() => setShowWithBatteries(!showWithBatteries)}
            isDesktop={isDesktop}
          />
          <DeviceListSection
            title="電池未設定のデバイス"
            devices={withoutBatteries}
            isOpen={showWithoutBatteries}
            onToggle={() => setShowWithoutBatteries(!showWithoutBatteries)}
            isDesktop={isDesktop}
          />
        </>
      )}
    </div>
  );
}