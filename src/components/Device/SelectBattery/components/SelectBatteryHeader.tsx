import React from 'react';
import { ArrowLeft, History, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SelectBatteryHeader({
    navigate,
    deviceId,
    setShowFilters,
    showFilters,
    activeFiltersCount,
    setShowHistory,
    handleConfirm,
    saving
}: {
    navigate: (path: string) => void,
    deviceId?: string,
    setShowFilters: (show: boolean) => void,
    showFilters: boolean,
    activeFiltersCount: number,
    setShowHistory: (show: boolean) => void,
    handleConfirm: () => void,
    saving: boolean
}) {
    const { t } = useTranslation();
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
