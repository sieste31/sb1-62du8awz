/**
 * CardContent Component
 * カードコンテンツコンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { CardContentProps } from './types';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      tokens.spacingY.md,
      
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
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';