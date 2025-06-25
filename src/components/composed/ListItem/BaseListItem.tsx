/**
 * BaseListItem Component
 * 基本的なリストアイテムコンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { BaseListItemProps } from './types';

export const BaseListItem = forwardRef<HTMLDivElement | HTMLButtonElement, BaseListItemProps>(
  (
    {
      title,
      subtitle,
      description,
      startIcon,
      endIcon,
      avatar,
      disabled = false,
      clickable = false,
      hoverable = false,
      divider = true,
      padding = 'md',
      className,
      children,
      details,
      onClick,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    const Component = clickable ? 'button' : 'div';

    const baseClasses = cn(
      // 基本スタイル
      'w-full text-left',
      paddingClasses[padding],
      tokens.transitions.colors,
      
      // 境界線
      conditionalClass(divider, 'border-b border-gray-200 dark:border-gray-700'),
      
      // インタラクション
      conditionalClass(clickable, 'cursor-pointer focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700'),
      conditionalClass(hoverable || clickable, 'hover:bg-gray-50 dark:hover:bg-gray-700'),
      conditionalClass(disabled, 'opacity-50 cursor-not-allowed pointer-events-none'),
      
      // カスタムクラス
      className
    );

    const hasContent = title || subtitle || description || children;
    const hasStartContent = startIcon || avatar;
    const hasEndContent = endIcon;

    return (
      <Component
        ref={ref as any}
        className={baseClasses}
        disabled={clickable ? disabled : undefined}
        onClick={disabled ? undefined : onClick}
        {...(clickable && { type: 'button' })}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {/* 左側のコンテンツ */}
          {hasStartContent && (
            <div className="flex-shrink-0">
              {avatar && (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {avatar}
                </div>
              )}
              {startIcon && !avatar && (
                <div className="w-6 h-6 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                  {startIcon}
                </div>
              )}
            </div>
          )}

          {/* メインコンテンツ */}
          {hasContent && (
            <div className="flex-1 min-w-0">
              {title && (
                <div
                  className={cn(
                    tokens.typography.body.base,
                    'font-medium text-gray-900 dark:text-white'
                  )}
                >
                  {title}
                </div>
              )}
              
              {subtitle && (
                <div
                  className={cn(
                    tokens.typography.body.small,
                    'text-gray-600 dark:text-gray-300',
                    title && 'mt-1'
                  )}
                >
                  {subtitle}
                </div>
              )}
              
              {description && (
                <div
                  className={cn(
                    tokens.typography.body.small,
                    'text-gray-500 dark:text-gray-400 mt-1'
                  )}
                >
                  {description}
                </div>
              )}
              
              {children && (
                <div className={cn((title || subtitle || description) && 'mt-2')}>
                  {children}
                </div>
              )}
            </div>
          )}

          {/* 右側のコンテンツ */}
          {hasEndContent && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-6 h-6 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                {endIcon}
              </div>
            </div>
          )}
        </div>
        
        {/* 詳細コンテンツ */}
        {details && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {details}
          </div>
        )}
      </Component>
    );
  }
);

BaseListItem.displayName = 'BaseListItem';