// 電池一覧画面のフィルターを表示するコンポーネント

'use client';

import React from 'react';
import { Battery, Zap, Search, SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useBatteryFilterStore,
  BATTERY_TYPES,
  BATTERY_KINDS,
  SORT_OPTIONS
} from '@/lib/batteryFilterStore';


const batteryKindIcons = {
  'すべて': null,
  'disposable': null,
  'rechargeable': <Zap className="h-3 w-3 mr-1" />,
} as const;

export function BatteryListFilter() {
  const { t } = useTranslation();
  
  // 電池の種類
  const batteryKindLabels = {
    'すべて': t('common.all'),
    'disposable': t('battery.kind.disposable'),
    'rechargeable': t('battery.kind.rechargeable'),
  } as const;
  // Zustandストアから状態と関数を取得
  // Zustandストアから状態と関数を取得
  const {
    selectedType,
    selectedKind,
    searchTerm,
    sortOption,
    showFilters,
    setSelectedType,
    setSelectedKind,
    setSearchTerm,
    setSortOption,
    setShowFilters,
    resetFilters,
    getFilteredAndSortedGroups
  } = useBatteryFilterStore();

  if (showFilters){
    return (
      <div className="mb-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('battery.list.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as typeof SORT_OPTIONS[number])}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SortDesc className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
  
  
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Battery className="h-4 w-4 mr-1.5 text-gray-500" />
                  {t('battery.list.batteryType')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {BATTERY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedType === type
                          ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-1.5 text-gray-500" />
                  {t('device.select.batteryType')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {BATTERY_KINDS.map((kind) => (
                    <button
                      key={kind}
                      onClick={() => setSelectedKind(kind)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedKind === kind
                          ? kind === 'rechargeable'
                            ? 'bg-green-100 text-green-800 ring-1 ring-green-300'
                            : kind === 'disposable'
                              ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
                              : 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {batteryKindIcons[kind]}
                      {batteryKindLabels[kind]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {t('device.select.reset')}
          </button>
        </div>
      </div>
    );
  }
  else{
    // フィルターが非表示の場合は何も表示しない
    return null;
  }
}
