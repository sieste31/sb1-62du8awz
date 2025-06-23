/**
 * Select Component
 * セレクトボックスコンポーネント
 */

import React, { forwardRef } from 'react';
import { inputVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { SelectProps } from './types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = true,
      rounded = 'md',
      options,
      placeholder,
      error,
      helpText,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const selectVariant = error ? 'error' : variant;
    
    const baseClasses = cn(
      // 基本スタイル
      'block w-full border transition-colors duration-200',
      'bg-white dark:bg-gray-700 appearance-none cursor-pointer',
      
      // バリアント
      inputVariants.variant[selectVariant],
      
      // サイズ
      inputVariants.size[size],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // 条件付きスタイル
      conditionalClass(fullWidth, 'w-full'),
      conditionalClass(!!disabled, inputVariants.disabled),
      
      // 矢印アイコンのための右パディング
      'pr-10',
      
      // カスタムクラス
      className
    );

    const containerClasses = cn(
      'relative',
      conditionalClass(fullWidth, 'w-full')
    );

    return (
      <div className={containerClasses}>
        <select
          ref={ref}
          disabled={disabled}
          className={baseClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* 矢印アイコン */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        
        {(error || helpText) && (
          <div className="mt-1 text-sm">
            {error && (
              <p className="text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {!error && helpText && (
              <p className="text-gray-500 dark:text-gray-400">
                {helpText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';