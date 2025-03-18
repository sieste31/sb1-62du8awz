'use client';

import React, { useState } from 'react';
import { Battery, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';
import { useBatteryGroups } from '@/lib/hooks';
import { BatteryListItem } from './BatteryListItem';
import { BatteryListFilter } from './BatteryListFilter';

const BATTERY_TYPES = ['すべて', '単1形', '単2形', '単3形', '単4形', '9V形'] as const;
const BATTERY_KINDS = ['すべて', 'disposable', 'rechargeable'] as const;


export function BatteryList() {
  const { batteryGroups, loading } = useBatteryGroups();
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const [selectedType, setSelectedType] = useState<typeof BATTERY_TYPES[number]>('すべて');
  const [selectedKind, setSelectedKind] = useState<typeof BATTERY_KINDS[number]>('すべて');
  const [showFilters, setShowFilters] = useState(false);

  const filteredGroups = batteryGroups.filter(group => {
    const matchesType = selectedType === 'すべて' || group.type === selectedType;
    const matchesKind = selectedKind === 'すべて' || group.kind === selectedKind;
    return matchesType && matchesKind;
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">電池一覧</h2>
          <div className="flex items-center space-x-4">
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
              href="/batteries/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </div>
        </div>

        {showFilters &&
          BatteryListFilter({ selectedType, setSelectedType, selectedKind, setSelectedKind })}
      </div>

      <div className="bg-white shadow rounded-lg">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Battery className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {batteryGroups.length === 0 ? '電池がありません' : '条件に一致する電池がありません'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {batteryGroups.length === 0 ? '新しい電池を登録してください。' : 'フィルター条件を変更してください。'}
            </p>
            {batteryGroups.length === 0 && (
              <div className="mt-6">
                <Link
                  href="/batteries/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規登録
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className={`p-4 grid gap-4 ${isDesktop ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {filteredGroups.map((group) => (
              <BatteryListItem key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}