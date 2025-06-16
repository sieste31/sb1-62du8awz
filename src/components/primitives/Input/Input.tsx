/**
 * Input Component
 * 基本的な入力フィールドコンポーネント
 */

import React, { forwardRef } from 'react';
import { inputVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass, focusEffect } from '@/styles/utils';
import type { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = false,
      rounded = 'md',
      leftIcon,
      rightIcon,
      error,
      helpText,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const inputVariant = error ? 'error' : variant;
    
    const baseClasses = cn(
      // 基本スタイル
      'block w-full border transition-colors duration-200',
      'placeholder:text-gray-400',
      
      // バリアント
      inputVariants.variant[inputVariant],
      
      // サイズ
      inputVariants.size[size],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // 条件付きスタイル
      conditionalClass(fullWidth, 'w-full'),
      conditionalClass(disabled, inputVariants.disabled),
      conditionalClass(leftIcon !== undefined, 'pl-10'),
      conditionalClass(rightIcon !== undefined, 'pr-10'),
      
      // カスタムクラス
      className
    );

    const containerClasses = cn(
      'relative',
      conditionalClass(fullWidth, 'w-full')
    );

    const iconClasses = 'absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none';

    return (
      <div className={containerClasses}>
        {leftIcon && (
          <div className={cn(iconClasses, 'left-3')}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          disabled={disabled}
          className={baseClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn(iconClasses, 'right-3')}>
            {rightIcon}
          </div>
        )}
        
        {(error || helpText) && (
          <div className="mt-1 text-sm">
            {error && (
              <p className="text-red-600">
                {error}
              </p>
            )}
            {!error && helpText && (
              <p className="text-gray-500">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';