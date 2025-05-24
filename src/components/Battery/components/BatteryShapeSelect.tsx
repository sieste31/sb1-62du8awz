import React from 'react';
import { useTranslation } from 'react-i18next';
import { BATTERY_SHAPE_OPTIONS } from '../constants';
import { BatteryShape } from '../types';

interface BatteryShapeSelectProps {
    /**
     * 現在選択されている電池形状
     */
    value: BatteryShape;

    /**
     * 形状が変更された時のコールバック
     */
    onChange: (shape: BatteryShape) => void;

    /**
     * コンポーネントが無効化されるかどうか
     */
    disabled?: boolean;

    /**
     * カスタムクラス名
     */
    className?: string;

    /**
     * 形状変更が制限されている場合のメッセージ
     */
    restrictionMessage?: string;
}

export function BatteryShapeSelect({
    value,
    onChange,
    disabled = false,
    className = '',
    restrictionMessage
}: BatteryShapeSelectProps) {
    const { t } = useTranslation();

    return (
        <div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as BatteryShape)}
                disabled={disabled}
                className={`block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
                    } ${className}`}
            >
                {BATTERY_SHAPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {t(option.labelKey)}
                    </option>
                ))}
            </select>
            {disabled && restrictionMessage && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {restrictionMessage}
                </p>
            )}
        </div>
    );
}
