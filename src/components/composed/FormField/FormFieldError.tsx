/**
 * FormFieldError Component
 * フォームフィールドのエラー表示専用コンポーネント
 */

import React, { forwardRef } from 'react';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { FormFieldErrorProps } from './types';

export const FormFieldError = forwardRef<HTMLDivElement, FormFieldErrorProps>(
  (
    {
      error,
      errors,
      className,
      ...props
    },
    ref
  ) => {
    // エラーリストを構築
    const errorList = (() => {
      if (errors && errors.length > 0) {
        return errors;
      }
      if (error) {
        return [error];
      }
      return [];
    })();

    // エラーがない場合は何も表示しない
    if (errorList.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-1', className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {errorList.length === 1 ? (
          // 単一エラーの場合
          <p
            className={cn(
              tokens.typography.body.small,
              'text-red-600'
            )}
          >
            {errorList[0]}
          </p>
        ) : (
          // 複数エラーの場合
          <ul
            className={cn(
              tokens.typography.body.small,
              'text-red-600 space-y-1'
            )}
          >
            {errorList.map((errorMessage, index) => (
              <li
                key={index}
                className="flex items-start space-x-1"
              >
                <span className="text-red-500 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>{errorMessage}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FormFieldError.displayName = 'FormFieldError';