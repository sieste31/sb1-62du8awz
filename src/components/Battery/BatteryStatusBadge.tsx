// 電池の状態を表すバッジを表示するコンポーネント

'use client';

import React from 'react';
import { Battery, BatteryCharging, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';

type BatteryStatus = 'charged' | 'in_use' | 'empty' | 'disposed';

interface BatteryStatusBadgeProps {
  status: BatteryStatus;
  className?: string;
}

export function BatteryStatusBadge({ status, className = '' }: BatteryStatusBadgeProps) {
  const getStatusConfig = (status: BatteryStatus) => {
    switch (status) {
      case 'charged':
        return {
          icon: BatteryCharging,
          text: '満充電',
          color: 'bg-green-100 text-green-800',
        };
      case 'in_use':
        return {
          icon: BatteryMedium,
          text: '使用中',
          color: 'bg-blue-100 text-blue-800',
        };
      case 'empty':
        return {
          icon: BatteryLow,
          text: '使用済み',
          color: 'bg-yellow-100 text-yellow-800',
        };
      case 'disposed':
        return {
          icon: BatteryWarning,
          text: '廃棄',
          color: 'bg-red-100 text-red-800',
        };
      default:
        return {
          icon: Battery,
          text: '不明',
          color: 'bg-gray-100 text-gray-800',
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