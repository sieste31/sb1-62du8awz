/**
 * CardFooter Component
 * カードフッターコンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { CardFooterProps } from './types';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      actions,
      divider = true,
      justify = 'end',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center', 
      end: 'justify-end',
      between: 'justify-between',
    };

    const baseClasses = cn(
      // 基本スタイル
      'flex items-center',
      tokens.spacingY.md,
      justifyClasses[justify],
      
      // 条件付きスタイル
      conditionalClass(divider, 'border-t border-gray-200 pt-4'),
      
      // カスタムクラス
      className
    );

    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {children}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';