/**
 * Button Component
 * 基本的なボタンコンポーネント
 */

import React, { forwardRef } from 'react';
import { buttonVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass, disabledState, loadingState } from '@/styles/utils';
import type { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      rightIcon,
      rounded = 'md',
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      'inline-flex items-center justify-center font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      tokens.transitions.all,
      
      // バリアント
      buttonVariants.variant[variant],
      
      // サイズ
      buttonVariants.size[size],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // 条件付きスタイル
      conditionalClass(fullWidth, 'w-full'),
      conditionalClass(iconOnly, 'aspect-square p-0', ''),
      conditionalClass(loading, loadingState('')),
      conditionalClass(disabled || loading, disabledState('')),
      
      // カスタムクラス
      className
    );

    const showLeftIcon = leftIcon && !loading;
    const showRightIcon = rightIcon && !loading;
    const showLoadingIcon = loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={baseClasses}
        {...props}
      >
        {showLoadingIcon && (
          <svg
            className={cn(
              'animate-spin h-4 w-4',
              children && !iconOnly && 'mr-2'
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {showLeftIcon && (
          <span className={cn(children && !iconOnly && 'mr-2')}>
            {leftIcon}
          </span>
        )}
        
        {!iconOnly && children}
        
        {showRightIcon && (
          <span className={cn(children && !iconOnly && 'ml-2')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';