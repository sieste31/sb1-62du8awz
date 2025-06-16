/**
 * Grid Component
 * グリッドレイアウトコンポーネント
 */

import React, { forwardRef } from 'react';
import { layoutVariants } from '@/styles/variants';
import { cn } from '@/styles/utils';
import type { GridProps } from './types';

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols = 1,
      gap = 'md',
      responsive,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const responsiveClasses = responsive ? [
      responsive.sm && `sm:grid-cols-${responsive.sm}`,
      responsive.md && `md:grid-cols-${responsive.md}`,
      responsive.lg && `lg:grid-cols-${responsive.lg}`,
      responsive.xl && `xl:grid-cols-${responsive.xl}`,
    ].filter(Boolean).join(' ') : '';

    const baseClasses = cn(
      // 基本スタイル
      'grid',
      
      // カラム数
      layoutVariants.grid.cols[cols],
      
      // ギャップ
      layoutVariants.grid.gap[gap],
      
      // レスポンシブ
      responsiveClasses,
      
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

Grid.displayName = 'Grid';