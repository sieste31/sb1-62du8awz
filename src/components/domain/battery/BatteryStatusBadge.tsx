/**
 * BatteryStatusBadge Component
 * 電池ステータス表示バッジコンポーネント
 */

import React, { forwardRef } from 'react';
import { Badge } from '@/components/primitives';
import { cn } from '@/styles/utils';
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
      className,
      ...props
    },
    ref
  ) => {
    const config = statusConfig[status];
    
    const content = iconOnly 
      ? config.icon
      : showIcon 
        ? `${config.icon} ${config.label}`
        : config.label;

    return (
      <Badge
        ref={ref}
        variant={config.variant}
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

BatteryStatusBadge.displayName = 'BatteryStatusBadge';