/**
 * StatusCard Component
 * ステータス表示用カードコンポーネント
 */

import React, { forwardRef } from 'react';
import { Card, CardHeader, CardContent, Button } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { StatusCardProps, StatusType } from './types';

// ステータス設定
const statusConfig = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconColor: 'text-green-600',
    defaultIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-600',
    defaultIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  danger: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-600',
    defaultIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l1.293-1.293a1 1 0 011.414 1.414L10 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.707 10.586 7.414 9.293a1 1 0 011.414-1.414L10 8.586l1.293-1.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-600',
    defaultIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  neutral: {
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    iconColor: 'text-gray-600',
    defaultIcon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
} as const;

export const StatusCard = forwardRef<HTMLDivElement, StatusCardProps>(
  (
    {
      status,
      title,
      description,
      icon,
      action,
      dismissible = false,
      onDismiss,
      variant = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const config = statusConfig[status];
    const displayIcon = icon || config.defaultIcon;

    const cardClasses = cn(
      config.bgColor,
      config.borderColor,
      className
    );

    const dismissButton = dismissible && (
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        onClick={onDismiss}
        aria-label="閉じる"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    );

    const headerAction = (() => {
      if (action && dismissible) {
        return (
          <div className="flex items-center space-x-2">
            {action}
            {dismissButton}
          </div>
        );
      }
      return action || dismissButton;
    })();

    return (
      <Card
        ref={ref}
        variant={variant}
        className={cardClasses}
        {...props}
      >
        <CardHeader
          title={
            <div className="flex items-center space-x-2">
              {displayIcon && (
                <div className={cn('flex-shrink-0', config.iconColor)}>
                  {displayIcon}
                </div>
              )}
              <span className={config.textColor}>{title}</span>
            </div>
          }
          action={headerAction}
          divider={false}
        />
        
        {(description || children) && (
          <CardContent>
            {description && (
              <p className={cn(tokens.typography.body.small, config.textColor)}>
                {description}
              </p>
            )}
            {children && (
              <div className={conditionalClass(!!description, 'mt-2')}>
                {children}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    );
  }
);

StatusCard.displayName = 'StatusCard';