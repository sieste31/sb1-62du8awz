/**
 * StatusIndicator Component
 * ステータス表示用インジケーターコンポーネント
 */

import React, { forwardRef } from 'react';
import { cn, conditionalClass } from '@/styles/utils';
import type { StatusIndicatorProps, StatusType } from './types';

// ステータス色設定
const statusColors = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  neutral: 'bg-gray-500',
} as const;

// サイズ設定
const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
} as const;

export const StatusIndicator = forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    {
      status,
      size = 'md',
      pulse = false,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      'rounded-full',
      
      // サイズ
      sizeClasses[size],
      
      // 色
      statusColors[status],
      
      // アニメーション
      conditionalClass(pulse, 'animate-pulse'),
      
      // カスタムクラス
      className
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        role="status"
        aria-label={label || `Status: ${status}`}
        {...props}
      />
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';