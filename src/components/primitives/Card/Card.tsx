/**
 * Card Component
 * 基本的なカードコンポーネント
 */

import React, { forwardRef } from 'react';
import { cardVariants } from '@/styles/variants';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass, hoverEffect } from '@/styles/utils';
import type { CardProps } from './types';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      clickable = false,
      hoverable = false,
      rounded = 'md',
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      // 基本スタイル
      'relative overflow-hidden',
      tokens.transitions.all,
      
      // バリアント
      cardVariants.variant[variant],
      
      // パディング
      cardVariants.padding[padding],
      
      // 角の丸み
      tokens.rounded[rounded],
      
      // 条件付きスタイル
      conditionalClass(clickable, 'cursor-pointer'),
      conditionalClass(hoverable || clickable, 'hover:shadow-lg hover:scale-[1.02]'),
      conditionalClass(clickable, 'active:scale-[0.98]'),
      
      // カスタムクラス
      className
    );

    const Component = clickable ? 'button' : 'div';

    return (
      <Component
        ref={ref as any}
        className={baseClasses}
        onClick={onClick}
        {...(clickable && { type: 'button' })}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';