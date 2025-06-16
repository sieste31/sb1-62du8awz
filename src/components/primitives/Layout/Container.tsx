/**
 * Container Component
 * コンテナコンポーネント
 */

import React, { forwardRef } from 'react';
import { layoutVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { ContainerProps } from './types';

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      maxWidth = 'lg',
      padding = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: '',
      xs: tokens.spacingX.xs,
      sm: tokens.spacingX.sm,
      md: tokens.spacingX.md,
      lg: tokens.spacingX.lg,
      xl: tokens.spacingX.xl,
    };

    const baseClasses = cn(
      // 基本スタイル
      'w-full',
      
      // 最大幅
      layoutVariants.container[maxWidth],
      
      // パディング
      paddingClasses[padding],
      
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

Container.displayName = 'Container';