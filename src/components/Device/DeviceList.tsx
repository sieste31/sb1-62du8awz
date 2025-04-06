// デバイス一覧画面のコンポーネント

import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Filter, ArrowDownAZ, ArrowUpAZ, X, Clock, ChevronDown, ChevronRight, Search, SortDesc, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useDevices, useUserPlan } from '@/lib/hooks';
import { DeviceListItem } from './DeviceListItem';
import type { Database } from '@/lib/database.types';

type Device = Database['public']['Tables']['devices']['Row'];
type DeviceType = 'all' | 'remotecontroller' | 'speaker' | 'camera' | 'gadget' | 'light' | 'toy' | 'other';
type BatteryType = 'all' | '単1形' | '単2形' | '単3形' | '単4形' | '9V形';
type SortOrder = 'none' | 'asc' | 'desc' | 'battery-end-asc' | 'battery-end-desc' | 'name-asc' | 'name-desc';

const deviceTypeLabels: Record<DeviceType, string> = {
  all: 'すべて',
  remotecontroller: 'リモコン',
  speaker: 'ラジオ/スピーカー',
  camera: 'カメラ',
  gadget: 'ガジェット',
  light: 'ライト',
  toy: 'おもちゃ',
  other: 'その他'
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showWithBatteries, setShowWithBatteries] = useState(true);
  const [showWithoutBatteries, setShowWithoutBatteries] = useState(true);

  // Calculate active filters count
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (deviceTypeFilter !== 'all') count++;
    if (batteryTypeFilter !== 'all') count++;
    if (sortOrder !== 'none') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [deviceTypeFilter, batteryTypeFilter, sortOrder, searchTerm]);

  // Apply filters and sorting
  const filteredAndSortedDevices = React.useMemo(() => {
    let result = [...devices];
    
    // Apply search filter
    if (searchTerm !== '') {
      result = result.filter(device => 
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (device.notes && device.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
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
        } else if (sortOrder === 'name-asc' || sortOrder === 'name-desc') {
          // Handle name sorting
          return sortOrder === 'name-asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
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
  }, [devices, searchTerm, deviceTypeFilter, batteryTypeFilter, sortOrder]);

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
    setSearchTerm('');
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">デバイス一覧</h2>
          <div className="flex flex-wrap items-center gap-3">
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
            <DeviceAddButton devices={devices} />
          </div>
        </div>

        {/* ユーザープラン情報表示 */}
        <UserPlanInfo devices={devices} />

        {showFilters && (
          <div className="mb-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="デバイス名・メモを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="none">並び替え</option>
                    <option value="battery-end-asc">交換予定日が近い順</option>
                    <option value="battery-end-desc">交換予定日が遠い順</option>
                    <option value="asc">交換日が古い順</option>
                    <option value="desc">交換日が新しい順</option>
                    <option value="name-asc">名前（昇順）</option>
                    <option value="name-desc">名前（降順）</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SortDesc className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        )}
      </div>

      {devices.length === 0 ? (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="text-center py-16">
            <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">デバイスがありません</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">新しいデバイスを登録して、効率的に管理を始めましょう。</p>
            <div className="mt-6">
              <Link
                to="/devices/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規登録
              </Link>
            </div>
          </div>
        </div>
      ) : filteredAndSortedDevices.length === 0 ? (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="text-center py-16">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">条件に一致するデバイスがありません</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">検索条件やフィルター設定を変更して、再度お試しください。</p>
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
        <div className="bg-white shadow rounded-xl overflow-hidden">
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
        </div>
      )}
    </div>
  );
}

// デバイス追加ボタンコンポーネント
function DeviceAddButton({ devices }: { devices: Device[] }) {
  const { userPlan, isLimitReached } = useUserPlan();
  const isDeviceLimitReached = isLimitReached.devices(devices.length);

  if (isDeviceLimitReached) {
    return (
      <div className="relative inline-block">
        <button
          disabled
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規登録
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2">
          デバイスの上限に達しています
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-t-4 border-l-4 border-r-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/devices/new"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Plus className="h-4 w-4 mr-2" />
      新規登録
    </Link>
  );
}

// ユーザープラン情報表示コンポーネント
function UserPlanInfo({ devices }: { devices: Device[] }) {
  const { userPlan, loading } = useUserPlan();

  if (loading || !userPlan) return null;

  const deviceCount = devices.length;
  const maxDevices = userPlan.max_devices;
  const isLimitReached = deviceCount >= maxDevices;
  const planTypeDisplay = userPlan.plan_type === 'free' ? '無料' : 
                          userPlan.plan_type === 'premium' ? 'プレミアム' : 'ビジネス';

  return (
    <div className={`p-4 rounded-lg mb-4 ${isLimitReached ? 'bg-amber-50' : 'bg-blue-50'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          {isLimitReached && (
            <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm mt-1 ${isLimitReached ? 'text-amber-600' : 'text-blue-600'}`}>
              デバイス: {deviceCount} / {maxDevices}
              {isLimitReached && ' (上限に達しています)'}
            </p>
          </div>
        </div>
        {userPlan.plan_type === 'free' && (
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => alert('この機能は現在開発中です。')}
          >
            アップグレード
          </button>
        )}
      </div>
    </div>
  );
}
