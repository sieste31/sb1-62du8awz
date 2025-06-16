/**
 * Stack Component
 * スタック（垂直・水平配置）コンポーネント
 */

import React, { forwardRef } from 'react';
import { layoutVariants } from '@/styles/variants';
import { cn, conditionalClass } from '@/styles/utils';
import type { StackProps } from './types';

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'vertical',
      spacing = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      layoutVariants.stack.direction[direction],
      
      // スペーシング
      layoutVariants.stack.spacing[spacing],
      
      // アライメント
      layoutVariants.stack.align[align],
      
      // ジャスティファイ
      layoutVariants.stack.justify[justify],
      
      // 条件付きスタイル
      conditionalClass(wrap, 'flex-wrap'),
      
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

Stack.displayName = 'Stack';