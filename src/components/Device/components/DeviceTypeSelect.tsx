import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEVICE_TYPE_OPTIONS } from '../constants';
import type { DeviceType } from '../types';
import type { LucideIcon } from 'lucide-react';

interface DeviceTypeSelectProps {
    value: DeviceType;
    onChange: (type: DeviceType) => void;
    className?: string;
}

export function DeviceTypeSelect({
    value,
    onChange,
    className = ''
}: DeviceTypeSelectProps) {
    const { t } = useTranslation();

    return (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}>
            {DEVICE_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                    <div
                        key={option.value}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${value === option.value
                                ? 'border-blue-500 ring-2 ring-blue-500 dark:border-blue-600 dark:ring-blue-600'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}
                        onClick={() => onChange(option.value as DeviceType)}
                    >
                        <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                                    <p className="font-medium text-gray-900 dark:text-dark-text">
                                        {t(option.labelKey)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
