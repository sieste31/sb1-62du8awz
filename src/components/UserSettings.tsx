import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getUserPlan } from '../lib/api/userPlans';
import { useAuth } from '../lib/auth';
import { LanguageSwitcher } from './LanguageSwitcher';

export function UserSettings() {
    const { t } = useTranslation();
    const { user } = useAuth();
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
        return <div className="p-4">{t('common.loading')}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">{t('userSettings.title')}</h1>

            {/* 言語設定セクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('userSettings.language')}</h2>
                <LanguageSwitcher />
            </section>

            {/* プラン制限セクション */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('userSettings.planLimits.title')}</h2>

                {/* 電池グループ制限 */}
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">{t('userSettings.planLimits.batteryGroups')}</span>
                        <span className="text-gray-900 font-medium">
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
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">{t('userSettings.planLimits.devices')}</span>
                        <span className="text-gray-900 font-medium">
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
        </div>
    );
}
