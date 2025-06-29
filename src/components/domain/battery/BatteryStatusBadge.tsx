/**
 * BatteryStatusBadge Component
 * 電池ステータス表示バッジコンポーネント
 */

import React, { forwardRef } from 'react';
import { Battery, BatteryCharging, BatteryMedium, BatteryLow, BatteryWarning } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/primitives';
import { cn } from '@/styles/utils';
import { STATUS_MAPPING, REVERSE_STATUS_MAPPING } from '@/lib/adapters/battery-shape-mapper';
import type { BatteryStatusBadgeProps, BatteryStatus } from './types';

// ステータス設定
const statusConfig: Record<BatteryStatus, {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  label: string;
  icon?: string;
}> = {
  new: {
    variant: 'success',
    label: '新品',
    icon: '🔋'
  },
  active: {
    variant: 'success',
    label: '正常',
    icon: '✅'
  },
  low: {
    variant: 'warning',
    label: '低下',
    icon: '⚠️'
  },
  empty: {
    variant: 'danger',
    label: '空',
    icon: '🪫'
  },
  expired: {
    variant: 'danger',
    label: '期限切れ',
    icon: '❌'
  },
  unknown: {
    variant: 'neutral',
    label: '不明',
    icon: '❓'
  }
};

export const BatteryStatusBadge = forwardRef<HTMLSpanElement, BatteryStatusBadgeProps>(
  (
    {
      status,
      showIcon = true,
      iconOnly = false,
      originalStatus,
      useTranslation = false,
      className,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    
    // 移行期間中は既存スタイルを使用するオプション
    if (useTranslation && originalStatus) {
      return renderLegacyStyle(originalStatus, className, t);
    }
    
    const config = statusConfig[status];
    
    const content = iconOnly 
      ? config.icon
      : showIcon 
        ? `${config.icon} ${config.label}`
        : config.label;

    return (
      <Badge
        ref={ref}
        variant={config.variant as any}
        className={cn(
          iconOnly && 'px-1.5 min-w-[24px] justify-center',
          className
        )}
        title={iconOnly ? config.label : undefined}
        {...props}
      >
        {content}
      </Badge>
    );
  }
);

// 既存スタイルでのレンダリング（移行期間用）
function renderLegacyStyle(
  status: 'charged' | 'in_use' | 'empty' | 'disposed',
  className?: string,
  t?: any
) {
  const getStatusConfig = (status: 'charged' | 'in_use' | 'empty' | 'disposed') => {
    switch (status) {
      case 'charged':
        return {
          icon: BatteryCharging,
          text: t?.('battery.status.charged') || '満充電',
          color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
        };
      case 'in_use':
        return {
          icon: BatteryMedium,
          text: t?.('battery.status.in_use') || '使用中',
          color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
        };
      case 'empty':
        return {
          icon: BatteryLow,
          text: t?.('battery.status.empty') || '空',
          color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
        };
      case 'disposed':
        return {
          icon: BatteryWarning,
          text: t?.('battery.status.disposed') || '廃棄済み',
          color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
        };
      default:
        return {
          icon: Battery,
          text: t?.('battery.status.unknown') || '不明',
          color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className || ''}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.text}
    </span>
  );
}

BatteryStatusBadge.displayName = 'BatteryStatusBadge';