import React from 'react';
import { X } from 'lucide-react';
import { BatteryStatus, BatteryKind } from '../types';
import { getBatteryStatusLabel, getBatteryKindLabel } from '../utils';
import { useTranslation } from 'react-i18next';

export function BatteryFilters({
    statusFilter,
    setStatusFilter,
    kindFilter,
    setKindFilter,
    activeFiltersCount,
    resetFilters
}: {
    statusFilter: BatteryStatus[],
    setStatusFilter: (filters: BatteryStatus[]) => void,
    kindFilter: BatteryKind,
    setKindFilter: (kind: BatteryKind) => void,
    activeFiltersCount: number,
    resetFilters: () => void
}) {
    const { t } = useTranslation();
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
