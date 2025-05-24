import React from 'react';
import { useTranslation } from 'react-i18next';
import { BatteryKind } from '../types';
import { BATTERY_KIND_OPTIONS } from '../constants';

interface BatteryKindSelectorProps {
    /**
     * 現在選択されている電池の種類
     */
    value: BatteryKind;

    /**
     * 電池の種類が変更された時のコールバック
     */
    onChange: (kind: BatteryKind) => void;

    /**
     * コンポーネントが無効化されるかどうか
     */
    disabled?: boolean;

    /**
     * カスタムクラス名
     */
    className?: string;

    /**
     * 種類変更時に連動して変更される状態のコールバック
     * 例: 使い捨て電池選択時に状態を空に変更
     */
    onRelatedStateChange?: (kind: BatteryKind) => void;
}

export function BatteryKindSelector({
    value,
    onChange,
    disabled = false,
    className = '',
    onRelatedStateChange
}: BatteryKindSelectorProps) {
    const { t } = useTranslation();

    const handleKindChange = (kind: BatteryKind) => {
        if (disabled) return;

        onChange(kind);

        // 関連する状態の変更（例: 使い捨て電池選択時に状態を空に変更）
        if (onRelatedStateChange) {
            onRelatedStateChange(kind);
        }
    };

    return (
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            {BATTERY_KIND_OPTIONS.map(option => (
                <div
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${value === option.value
                            ? 'border-blue-500 dark:border-blue-700 ring-2 ring-blue-500 dark:ring-blue-700 bg-white dark:bg-dark-card'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleKindChange(option.value as BatteryKind)}
                >
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-sm">
                                <p className="font-medium text-gray-900 dark:text-dark-text">
                                    {t(option.labelKey)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
