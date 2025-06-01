import React from 'react';
import { Smartphone, Plus, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDemoMode } from './DemoModeContext';
import { DeviceListItem } from '@/components/Device/DeviceListItem';

export function DemoDeviceList() {
    const { t } = useTranslation();
    const { devices, isDemo } = useDemoMode();

    const withBatteries = devices.filter(device => device.has_batteries);
    const withoutBatteries = devices.filter(device => !device.has_batteries);

    return (
        <div>
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                        {t('device.list.title')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                            <Filter className="h-4 w-4 mr-2" />
                            {t('device.list.filter')}
                        </div>
                        <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed">
                            <Plus className="h-4 w-4 mr-2" />
                            {t('device.list.addNew')}
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                                {t('device.list.deviceCount', {
                                    current: devices.length,
                                    max: 5
                                })} (デモモード)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {devices.length === 0 ? (
                <div className="bg-white dark:bg-dark-card shadow rounded-xl overflow-hidden">
                    <div className="text-center py-16">
                        <Smartphone className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text">
                            {t('device.list.noDevices')}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {t('device.list.emptyStateMessage')}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-xl overflow-hidden dark:bg-dark-bg">
                    <div className="bg-white dark:bg-dark-card shadow rounded-lg mb-4">
                        <button
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text flex items-center">
                                {t('device.list.withBatteries')}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    ({withBatteries.length})
                                </span>
                            </h3>
                        </button>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {withBatteries.map((device) => (
                                <div key={device.id} className="opacity-80 relative">
                                    <DeviceListItem device={device} />
                                    <div className="absolute inset-0 bg-gray-500/10 z-10 pointer-events-none"></div>
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        デモモード
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card shadow rounded-lg">
                        <button
                            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-t-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text flex items-center">
                                {t('device.list.withoutBatteries')}
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    ({withoutBatteries.length})
                                </span>
                            </h3>
                        </button>
                        {withoutBatteries.length > 0 && (
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {withoutBatteries.map((device) => (
                                    <div key={device.id} className="opacity-80 relative">
                                        <DeviceListItem device={device} />
                                        <div className="absolute inset-0 bg-gray-500/10 z-10 pointer-events-none"></div>
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            デモモード
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
