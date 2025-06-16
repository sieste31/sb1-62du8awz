/**
 * LoadingSpinner Component
 * 汎用ローディングスピナーコンポーネント
 */

import React, { forwardRef } from 'react';
import { cn } from '@/styles/utils';
import { tokens } from '@/styles/tokens';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * スピナーのサイズ
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * スピナーの色
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  
  /**
   * 中央配置するかどうか
   * @default false
   */
  centered?: boolean;
  
  /**
   * ラベルテキスト
   */
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const colorClasses = {
  primary: 'border-blue-600 dark:border-blue-400',
  secondary: 'border-gray-600 dark:border-gray-400', 
  white: 'border-white',
  gray: 'border-gray-400 dark:border-gray-500'
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      centered = false,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const spinnerElement = (
      <div
        className={cn(
          'animate-spin rounded-full border-b-2',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        role="status"
        aria-label={label || "読み込み中..."}
      />
    );

    if (!centered && !label) {
      return (
        <div ref={ref} {...props}>
          {spinnerElement}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          centered && 'justify-center py-12',
          className
        )}
        {...props}
      >
        {spinnerElement}
        {label && (
          <span className={cn(
            tokens.typography.body.medium,
            'text-gray-600 dark:text-gray-400'
          )}>
            {label}
          </span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';