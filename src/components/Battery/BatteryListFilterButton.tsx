import { useBatteryFilterStore } from '@/lib/batteryFilterStore';
import { Filter } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function BatteryListFilterButton() {
  const { t } = useTranslation();
  // Zustandストアから状態と関数を取得
  const {
    selectedShape,
    selectedKind,
    searchTerm,
    showFilters,
    setShowFilters,
  } = useBatteryFilterStore();

    return (
        <button
        onClick={() => setShowFilters(!showFilters)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Filter className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
        {t('battery.list.filter')}
        {(selectedShape !== 'すべて' || selectedKind !== 'すべて' || searchTerm !== '') && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
            {[
              selectedShape !== 'すべて' ? 1 : 0,
              selectedKind !== 'すべて' ? 1 : 0,
              searchTerm !== '' ? 1 : 0
            ].reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>
    );
};
