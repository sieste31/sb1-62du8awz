/**
 * TextArea Component
 * テキストエリアコンポーネント
 */

import React, { forwardRef } from 'react';
import { inputVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { TextAreaProps } from './types';

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      fullWidth = true,
      rounded = 'md',
      resize = true,
      minRows = 3,
      maxRows,
      error,
      helpText,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const textareaVariant = error ? 'error' : variant;
    
    const baseClasses = cn(
      // 基本スタイル
      'block w-full border transition-colors duration-200',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
      
      // バリアント
      inputVariants.variant[textareaVariant],
      
      // サイズ
      inputVariants.size[size],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // 条件付きスタイル
      conditionalClass(fullWidth, 'w-full'),
      conditionalClass(disabled || false, inputVariants.disabled),
      conditionalClass(!resize, 'resize-none'),
      
      // カスタムクラス
      className
    );

    const containerClasses = cn(
      conditionalClass(fullWidth, 'w-full')
    );

    const style = {
      minHeight: `${minRows * 1.5}rem`,
      ...(maxRows && { maxHeight: `${maxRows * 1.5}rem` }),
    };

    return (
      <div className={containerClasses}>
        <textarea
          ref={ref}
          disabled={disabled}
          className={baseClasses}
          style={style}
          {...props}
        />
        
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

TextArea.displayName = 'TextArea';