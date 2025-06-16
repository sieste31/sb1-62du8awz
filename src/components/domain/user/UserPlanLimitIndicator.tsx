/**
 * UserPlanLimitIndicator Component
 * ユーザープラン制限表示インジケーターコンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { UserPlanLimitIndicatorProps } from './types';

export const UserPlanLimitIndicator = forwardRef<HTMLDivElement, UserPlanLimitIndicatorProps>(
  (
    {
      label,
      current,
      max,
      unit = '',
      showPercentage = false,
      variant = 'default',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    // 使用率の計算
    const percentage = Math.min((current / max) * 100, 100);
    const isUnlimited = max === -1 || max === Infinity;
    
    // バリアントの自動判定
    const getVariant = () => {
      if (variant !== 'default') return variant;
      if (isUnlimited) return 'default';
      if (percentage >= 90) return 'danger';
      if (percentage >= 75) return 'warning';
      return 'default';
    };

    const actualVariant = getVariant();

    // サイズ設定
    const sizeClasses = {
      sm: {
        text: tokens.typography.body.small,
        bar: 'h-2',
        container: 'space-y-1'
      },
      md: {
        text: tokens.typography.body.medium,
        bar: 'h-3',
        container: 'space-y-2'
      },
      lg: {
        text: tokens.typography.body.large,
        bar: 'h-4',
        container: 'space-y-3'
      }
    }[size];

    // バリアントの色設定
    const variantClasses = {
      default: {
        bar: 'bg-blue-500',
        bg: 'bg-gray-200',
        text: 'text-gray-900'
      },
      warning: {
        bar: 'bg-orange-500',
        bg: 'bg-orange-100',
        text: 'text-orange-900'
      },
      danger: {
        bar: 'bg-red-500',
        bg: 'bg-red-100',
        text: 'text-red-900'
      }
    }[actualVariant];

    return (
      <div
        ref={ref}
        className={cn(sizeClasses.container, className)}
        {...props}
      >
        {/* ラベルと数値 */}
        <div className="flex items-center justify-between">
          <span className={cn(
            sizeClasses.text,
            'font-medium text-gray-700'
          )}>
            {label}
          </span>
          
          <div className="flex items-center space-x-2">
            <span className={cn(
              sizeClasses.text,
              variantClasses.text,
              'font-medium'
            )}>
              {isUnlimited ? (
                `${current.toLocaleString()}${unit}`
              ) : (
                `${current.toLocaleString()} / ${max.toLocaleString()}${unit}`
              )}
            </span>
            
            {showPercentage && !isUnlimited && (
              <span className={cn(
                tokens.typography.body.small,
                'text-gray-500'
              )}>
                ({Math.round(percentage)}%)
              </span>
            )}
          </div>
        </div>

        {/* プログレスバー */}
        {!isUnlimited && (
          <div className={cn(
            'w-full rounded-full overflow-hidden',
            sizeClasses.bar,
            variantClasses.bg
          )}>
            <div
              className={cn(
                'h-full transition-all duration-300 ease-out rounded-full',
                variantClasses.bar
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}

        {/* 無制限の場合の表示 */}
        {isUnlimited && (
          <div className={cn(
            'flex items-center space-x-2 text-green-600',
            tokens.typography.body.small
          )}>
            <span>∞</span>
            <span>無制限</span>
          </div>
        )}

        {/* 警告メッセージ */}
        {actualVariant === 'danger' && !isUnlimited && (
          <p className={cn(
            tokens.typography.body.small,
            'text-red-600'
          )}>
            制限に近づいています。アップグレードをご検討ください。
          </p>
        )}
        
        {actualVariant === 'warning' && !isUnlimited && (
          <p className={cn(
            tokens.typography.body.small,
            'text-orange-600'
          )}>
            使用量が多くなっています。
          </p>
        )}
      </div>
    );
  }
);

UserPlanLimitIndicator.displayName = 'UserPlanLimitIndicator';