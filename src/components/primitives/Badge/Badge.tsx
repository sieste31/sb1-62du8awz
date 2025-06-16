/**
 * Badge Component
 * バッジコンポーネント
 */

import React, { forwardRef } from 'react';
import { badgeVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { BadgeProps } from './types';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'primary',
      size = 'sm',
      dot = false,
      rounded = 'full',
      leftIcon,
      rightIcon,
      removable = false,
      onRemove,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (dot) {
      return (
        <span
          ref={ref}
          className={cn(
            badgeVariants.dot,
            badgeVariants.variant[variant].split(' ')[0], // bg色のみ取得
            className
          )}
          {...props}
        />
      );
    }

    const baseClasses = cn(
      // 基本スタイル
      'inline-flex items-center font-medium',
      
      // バリアント
      badgeVariants.variant[variant],
      
      // サイズ
      badgeVariants.size[size],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // カスタムクラス
      className
    );

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <span
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {leftIcon && (
          <span className={cn(children && 'mr-1')}>
            {leftIcon}
          </span>
        )}
        
        {children}
        
        {rightIcon && !removable && (
          <span className={cn(children && 'ml-1')}>
            {rightIcon}
          </span>
        )}
        
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              'ml-1 inline-flex items-center justify-center',
              'hover:bg-black hover:bg-opacity-10 rounded-full',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-1 focus:ring-current',
              size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
            )}
            aria-label="削除"
          >
            <svg
              className={cn(
                size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';