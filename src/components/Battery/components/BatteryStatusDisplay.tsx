import React from 'react';
import { useTranslation } from 'react-i18next';
import { BatteryStatus } from '../types';
import { BATTERY_STATUS_STYLES } from '../constants';
import { BatteryStatusBadge } from '../BatteryStatusBadge';

interface BatteryStatusDisplayProps {
    /**
     * 各状態の電池数
     */
    statusCounts: Record<BatteryStatus, number>;

    /**
     * 全電池数
     */
    totalCount: number;

    /**
     * カスタムクラス名
     */
    className?: string;

    /**
     * 状態をクリック可能にするかどうか
     */
    interactive?: boolean;

    /**
     * 状態がクリックされた時のコールバック
     */
    onStatusClick?: (status: BatteryStatus) => void;
}

export function BatteryStatusDisplay({
    statusCounts,
    totalCount,
    className = '',
    interactive = false,
    onStatusClick
}: BatteryStatusDisplayProps) {
    const { t } = useTranslation();

    const renderStatusBadge = (status: BatteryStatus) => {
        const count = statusCounts[status];
        const { icon: Icon, color } = BATTERY_STATUS_STYLES[status];

        const badgeContent = (
            <div
                className={`inline-flex items-center px-2.5 py-1 rounded-full ${count > 0
                    ? `${color.background} ${color.text}`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 opacity-50'
                    } ${interactive && count > 0 ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => interactive && count > 0 && onStatusClick?.(status)}
            >
                <BatteryStatusBadge status={status} className="!bg-transparent !p-0" />
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${count > 0
                    ? `${color.background} ${color.text}`
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                    {count}{t('battery.list.unit')}
                </span>
            </div>
        );

        return badgeContent;
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            <div className="flex justify-between text-xs text-gray-500 mb-2 w-full">
                <span>{t('battery.list.batteryStatus')} ({t('battery.list.total', { count: totalCount })})</span>
            </div>
            {(Object.keys(BATTERY_STATUS_STYLES) as BatteryStatus[]).map(status => (
                <div key={status}>
                    {renderStatusBadge(status)}
                </div>
            ))}
        </div>
    );
}
