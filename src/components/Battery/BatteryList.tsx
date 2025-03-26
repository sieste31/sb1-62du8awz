// 電池一覧画面のコンポーネント

import React, { useState } from 'react';
import { Battery, Plus, Filter, Search, SortDesc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useBatteryGroups } from '@/lib/hooks';
import { BatteryListItem } from './BatteryListItem';
import { BatteryListFilter } from './BatteryListFilter';

const BATTERY_TYPES = ['すべて', '単1形', '単2形', '単3形', '単4形', '9V形'] as const;
const BATTERY_KINDS = ['すべて', 'disposable', 'rechargeable'] as const;
const SORT_OPTIONS = ['登録日（新しい順）', '登録日（古い順）', '名前（昇順）', '名前（降順）'] as const;


export function BatteryList() {
  const { batteryGroups, loading } = useBatteryGroups();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [selectedType, setSelectedType] = useState<typeof BATTERY_TYPES[number]>('すべて');
  const [selectedKind, setSelectedKind] = useState<typeof BATTERY_KINDS[number]>('すべて');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<typeof SORT_OPTIONS[number]>('登録日（新しい順）');

  // フィルタリングとソート
  const filteredAndSortedGroups = batteryGroups
    .filter(group => {
      const matchesType = selectedType === 'すべて' || group.shape === selectedType || group.type === selectedType;
      const matchesKind = selectedKind === 'すべて' || group.kind === selectedKind;
      const matchesSearch = searchTerm === '' || 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.notes && group.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesType && matchesKind && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case '登録日（新しい順）':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case '登録日（古い順）':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case '名前（昇順）':
          return a.name.localeCompare(b.name);
        case '名前（降順）':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

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
          <h2 className="text-xl font-semibold text-gray-900">電池一覧</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-grow max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="電池名を検索..."
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              フィルター
              {(selectedType !== 'すべて' || selectedKind !== 'すべて') && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedType !== 'すべて' && selectedKind !== 'すべて' ? '2' : '1'}
                </span>
              )}
            </button>
            <Link
              to="/batteries/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4">
            <BatteryListFilter 
              selectedType={selectedType} 
              setSelectedType={setSelectedType} 
              selectedKind={selectedKind} 
              setSelectedKind={setSelectedKind} 
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedType('すべて');
                  setSelectedKind('すべて');
                  setSearchTerm('');
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                フィルターをリセット
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        {filteredAndSortedGroups.length === 0 ? (
          <div className="text-center py-16">
            <Battery className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {batteryGroups.length === 0 ? '電池がありません' : '条件に一致する電池がありません'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              {batteryGroups.length === 0 
                ? '新しい電池を登録して、効率的に管理を始めましょう。' 
                : '検索条件やフィルター設定を変更して、再度お試しください。'}
            </p>
            {batteryGroups.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/batteries/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規登録
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredAndSortedGroups.map((group) => (
                <BatteryListItem key={group.id} group={group} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
