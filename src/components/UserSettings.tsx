import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPlan } from '../lib/api/userPlans';
import { useAuth } from '../lib/auth';
import { signOut } from '../lib/api/auth';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useDarkMode } from '../lib/hooks';
import { Sun, Moon } from 'lucide-react';

export function UserSettings() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const darkMode = useDarkMode();
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<{
        max_battery_groups: number;
        max_devices: number;
    } | null>(null);

    useEffect(() => {
        if (user) {
            getUserPlan(user.id).then(setUserPlan);
        }
    }, [user]);

    if (!userPlan) {
        return <div className="p-4 dark:text-dark-text">{t('common.loading')}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 dark:bg-dark-bg min-h-screen">
            <h1 className="text-2xl font-bold mb-8 dark:text-dark-text">{t('userSettings.title')}</h1>

            {/* ダークモード設定セクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">{t('userSettings.darkMode.title')}</h2>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-700 dark:text-dark-text">{t('userSettings.darkMode.description')}</p>
                        </div>
                        <button
                            onClick={darkMode.toggle}
                            className="relative inline-flex items-center gap-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            role="switch"
                            aria-checked={darkMode.isDark}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === ' ' || e.key === 'Enter') {
                                    e.preventDefault();
                                    darkMode.toggle();
                                }
                            }}
                        >
                            <Sun className={`w-5 h-5 transition-transform ${darkMode.isDark ? 'text-gray-400' : 'text-yellow-500 rotate-0'}`} />
                            <div
                                className={`relative w-14 h-7 rounded-full transition-colors ${
                                    darkMode.isDark ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transform transition-transform ${
                                        darkMode.isDark ? 'translate-x-7' : 'translate-x-0'
                                    }`}
                                />
                            </div>
                            <Moon className={`w-5 h-5 transition-transform ${darkMode.isDark ? 'text-blue-200' : 'text-gray-400'}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* 言語設定セクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">{t('userSettings.language')}</h2>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <LanguageSwitcher />
                </div>
            </section>

            {/* プラン制限セクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">{t('userSettings.planLimits.title')}</h2>

                {/* 電池グループ制限 */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-dark-text">{t('userSettings.planLimits.batteryGroups')}</span>
                        <span className="text-gray-900 dark:text-dark-text font-medium">
                            {t('userSettings.planLimits.of', { max: userPlan.max_battery_groups })}
                        </span>
                        <span>
                            <button
                                className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
                                onClick={() => {
                                    // TODO: 購入ページへのリンク
                                    alert(t('battery.form.upgradeInDevelopment'));
                                }}
                            >
                                {t('userSettings.planLimits.upgrade.batteryGroups')}
                            </button>
                        </span>
                    </div>
                </div>

                {/* デバイス制限 */}
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-dark-text">{t('userSettings.planLimits.devices')}</span>
                        <span className="text-gray-900 dark:text-dark-text font-medium">
                            {t('userSettings.planLimits.of', { max: userPlan.max_devices })}
                        </span>
                        <span>
                            <button
                                className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
                                onClick={() => {
                                    // TODO: 購入ページへのリンク
                                    alert(t('device.form.upgradeInDevelopment'));
                                }}
                            >
                                {t('userSettings.planLimits.upgrade.devices')}
                            </button>
                        </span>
                    </div>
                </div>
            </section>

            {/* ログアウトセクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">{t('userSettings.logout.title')}</h2>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-4">
                    <div className="flex flex-col space-y-4">
                        <p className="text-gray-700 dark:text-dark-text">{t('userSettings.logout.description')}</p>
                        
                        {logoutError && (
                            <div className="text-sm text-center text-red-600">
                                {logoutError}
                            </div>
                        )}
                        
                        <button
                            onClick={async () => {
                                try {
                                    setLogoutLoading(true);
                                    setLogoutError(null);
                                    await signOut();
                                    navigate('/login');
                                } catch (err) {
                                    setLogoutError(
                                        err instanceof Error 
                                            ? err.message 
                                            : t('userSettings.logout.error')
                                    );
                                } finally {
                                    setLogoutLoading(false);
                                }
                            }}
                            disabled={logoutLoading}
                            className="w-full bg-red-500 text-white rounded-md py-2 px-4 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {logoutLoading ? t('userSettings.logout.processing') : t('userSettings.logout.button')}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
