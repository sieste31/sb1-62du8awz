/**
 * FormFieldGroup Component
 * 複数のフォームフィールドをグループ化するコンポーネント
 */

import React, { forwardRef } from 'react';
import { Stack } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { FormFieldGroupProps } from './types';

export const FormFieldGroup = forwardRef<HTMLDivElement, FormFieldGroupProps>(
  (
    {
      label,
      required = false,
      error,
      helpText,
      description,
      hideLabel = false,
      direction = 'vertical',
      spacing = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const stackDirection = direction === 'horizontal' ? 'horizontal' : 'vertical';
    const stackSpacing = spacing;

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {/* グループラベル */}
        {label && !hideLabel && (
          <div className="space-y-1">
            <label
              className={cn(
                tokens.typography.body.base,
                'font-medium text-gray-900',
                conditionalClass(required, "after:content-['*'] after:ml-1 after:text-red-500")
              )}
            >
              {label}
            </label>

            {/* グループ説明 */}
            {description && (
              <p
                className={cn(
                  tokens.typography.body.small,
                  'text-gray-600'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* フィールドグループ */}
        <Stack
          direction={stackDirection}
          spacing={stackSpacing}
          align={direction === 'horizontal' ? 'end' : 'stretch'}
        >
          {children}
        </Stack>

        {/* グループエラー */}
        {error && (
          <p
            className={cn(
              tokens.typography.body.small,
              'text-red-600'
            )}
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}

        {/* グループヘルプテキスト */}
        {helpText && !error && (
          <p
            className={cn(
              tokens.typography.body.small,
              'text-gray-500'
            )}
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

FormFieldGroup.displayName = 'FormFieldGroup';