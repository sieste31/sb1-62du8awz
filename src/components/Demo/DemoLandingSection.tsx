import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DemoBatteryList } from './DemoBatteryList';
import { DemoDeviceList } from './DemoDeviceList';
import { DemoModeProvider } from './DemoModeContext';

export function DemoLandingSection() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = React.useState<'batteries' | 'devices'>('batteries');

    return (
        <DemoModeProvider>
            <section className="bg-white dark:bg-dark-card shadow-lg rounded-xl p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                        {t('landingPage.demo.title', 'アプリの機能を体験')}
                    </h2>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded">
                        {t('landingPage.demo.mode', 'デモモード')}
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {t('landingPage.demo.description', 'ログイン不要で、アプリの主要機能をお試しいただけます。')}
                    </p>
                    <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('batteries')}
                            className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'batteries'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('battery.list.title')}
                        </button>
                        <button
                            onClick={() => setActiveTab('devices')}
                            className={`py-2 px-4 text-sm font-medium transition-colors ${activeTab === 'devices'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('device.list.title')}
                        </button>
                    </div>
                </div>

                {activeTab === 'batteries' ? <DemoBatteryList /> : <DemoDeviceList />}

                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {t('landingPage.cta.login', 'ログインして始める')}
                    </Link>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {t('landingPage.demo.loginNote', '無料で新規登録できます')}
                    </p>
                </div>
            </section>
        </DemoModeProvider>
    );
}
