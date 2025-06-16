/**
 * CardHeader Component
 * カードヘッダーコンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { CardHeaderProps } from './types';

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      title,
      subtitle,
      action,
      divider = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      'flex items-start justify-between',
      tokens.spacingY.md,
      
      // 条件付きスタイル
      conditionalClass(divider, 'border-b border-gray-200 pb-4'),
      
      // カスタムクラス
      className
    );

    const hasContent = title || subtitle || children;

    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {hasContent && (
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className={cn(
                tokens.typography.heading.h4,
                'text-gray-900 mb-1'
              )}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={cn(
                tokens.typography.body.small,
                'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
            {children}
          </div>
        )}
        
        {action && (
          <div className="flex-shrink-0 ml-4">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';