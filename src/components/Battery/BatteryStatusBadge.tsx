// 電池の状態を表すバッジを表示するコンポーネント

'use client';

import React from 'react';
import { Battery, BatteryCharging, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

interface BatteryStatusBadgeProps {
  status: BatteryStatus;
  className?: string;
}

export function BatteryStatusBadge({ status, className = '' }: BatteryStatusBadgeProps) {
  const { t } = useTranslation();
  
  const getStatusConfig = (status: BatteryStatus) => {
    switch (status) {
      case 'charged':
        return {
          icon: BatteryCharging,
          text: t('battery.status.charged'),
          color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
        };
      case 'in_use':
        return {
          icon: BatteryMedium,
          text: t('battery.status.in_use'),
          color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
        };
      case 'empty':
        return {
          icon: BatteryLow,
          text: t('battery.status.empty'),
          color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
        };
      case 'disposed':
        return {
          icon: BatteryWarning,
          text: t('battery.status.disposed'),
          color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
        };
      default:
        return {
          icon: Battery,
          text: t('battery.status.unknown'),
          color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </span>
  );
}
