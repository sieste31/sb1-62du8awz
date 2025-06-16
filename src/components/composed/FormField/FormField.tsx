/**
 * FormField Component
 * ラベル、入力フィールド、エラー表示を組み合わせたフォームフィールド
 */

import React, { forwardRef, useId } from 'react';
import { Input, TextArea, Select } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { FormFieldProps } from './types';

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(
  (
    {
      as = 'input',
      label,
      required = false,
      error,
      helpText,
      description,
      hideLabel = false,
      className,
      inputProps,
      textareaProps,
      selectProps,
      children,
      ...props
    },
    ref
  ) => {
    const fieldId = useId();
    const errorId = useId();
    const descriptionId = useId();
    const helpTextId = useId();

    const hasError = !!error;
    const variant = hasError ? 'error' : 'default';

    // aria-describedby の構築
    const describedBy = [
      description && descriptionId,
      helpText && helpTextId,
      error && errorId,
    ]
      .filter(Boolean)
      .join(' ');

    const renderInput = () => {
      const commonProps = {
        id: fieldId,
        variant,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': hasError,
        'aria-required': required,
        ...props,
      };

      switch (as) {
        case 'textarea':
          return (
            <TextArea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...commonProps}
              {...textareaProps}
            />
          );
        case 'select':
          return (
            <Select
              ref={ref as React.Ref<HTMLSelectElement>}
              {...commonProps}
              {...selectProps}
            />
          );
        default:
          return (
            <Input
              ref={ref as React.Ref<HTMLInputElement>}
              {...commonProps}
              {...inputProps}
            />
          );
      }
    };

    return (
      <div className={cn('space-y-1', className)}>
        {/* ラベル */}
        {label && !hideLabel && (
          <label
            htmlFor={fieldId}
            className={cn(
              tokens.typography.body.small,
              'font-medium text-gray-700',
              conditionalClass(required, "after:content-['*'] after:ml-1 after:text-red-500")
            )}
          >
            {label}
          </label>
        )}

        {/* 説明文 */}
        {description && (
          <p
            id={descriptionId}
            className={cn(
              tokens.typography.body.small,
              'text-gray-600'
            )}
          >
            {description}
          </p>
        )}

        {/* 入力フィールドまたは子要素 */}
        {children ? children : renderInput()}

        {/* エラーメッセージ */}
        {error && (
          <p
            id={errorId}
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

        {/* ヘルプテキスト */}
        {helpText && !error && (
          <p
            id={helpTextId}
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

FormField.displayName = 'FormField';