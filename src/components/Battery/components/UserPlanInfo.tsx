import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BatteryGroup } from '../types';
import { UserPlanLimitChecker } from '../utils/batteryUtils';

interface UserPlanInfoProps {
    /**
     * 現在の電池グループリスト
     */
    batteryGroups: BatteryGroup[];

    /**
     * ユーザープランの種類
     */
    planType?: 'free' | 'premium' | 'business';

    /**
     * カスタムクラス名
     */
    className?: string;
}

export function UserPlanInfo({
    batteryGroups,
    planType = 'free',
    className = ''
}: UserPlanInfoProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // プランの最大電池グループ数
    const maxBatteryGroups = planType === 'free' ? 5 :
        planType === 'premium' ? 10 : 50;

    // 制限チェック
    const isLimitReached = UserPlanLimitChecker.checkBatteryGroupLimit(
        batteryGroups.length,
        planType
    );

    // プラン種別の表示テキスト
    const planTypeDisplay = planType === 'free' ? t('plan.free') :
        planType === 'premium' ? t('plan.premium') :
            t('plan.business');

    // コンポーネントが表示されない場合
    if (!isLimitReached && batteryGroups.length < maxBatteryGroups) {
        return null;
    }

    return (
        <div className={`p-4 rounded-lg mb-4 ${isLimitReached
                ? 'bg-amber-50 dark:bg-amber-900/20'
                : 'bg-blue-50 dark:bg-blue-900/20'
            } ${className}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                    {isLimitReached && (
                        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                        <p className={`text-sm mt-1 ${isLimitReached
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }`}>
                            {t('battery.list.groupCount', {
                                current: batteryGroups.length,
                                max: maxBatteryGroups
                            })}
                            {isLimitReached && ` ${t('battery.list.limitReachedSettings')}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('battery.list.currentPlan', { plan: planTypeDisplay })}
                        </p>
                    </div>
                </div>
                {isLimitReached && (
                    <button
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => navigate('/settings')}
                    >
                        {t('battery.list.changeInSettings')}
                    </button>
                )}
            </div>
        </div>
    );
}
