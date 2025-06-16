/**
 * FormModal Component
 * フォーム用モーダルコンポーネント
 */

import React, { forwardRef, useState } from 'react';
import { BaseModal } from './BaseModal';
import { Button, Stack } from '@/components/primitives';
import { cn } from '@/styles/utils';
import type { FormModalProps } from './types';

export const FormModal = forwardRef<HTMLDivElement, FormModalProps>(
  (
    {
      onSubmit,
      submitLabel = '送信',
      cancelLabel = 'キャンセル',
      submitVariant = 'primary',
      submitDisabled = false,
      loading = false,
      onCancel,
      onClose,
      hideFooter = false,
      footer,
      children,
      ...modalProps
    },
    ref
  ) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      if (!onSubmit) return;

      try {
        setIsSubmitting(true);
        await onSubmit(event);
      } catch (error) {
        // エラーハンドリングは親コンポーネントに委ねる
        console.error('Form submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };

    const isLoading = loading || isSubmitting;

    return (
      <BaseModal
        ref={ref}
        onClose={handleCancel}
        {...modalProps}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* コンテンツエリア */}
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>

          {/* フッター */}
          {!hideFooter && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              {footer ? (
                footer
              ) : (
                <Stack direction="horizontal" spacing="sm" justify="end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant={submitVariant}
                    loading={isLoading}
                    disabled={submitDisabled || isLoading}
                  >
                    {submitLabel}
                  </Button>
                </Stack>
              )}
            </div>
          )}
        </form>
      </BaseModal>
    );
  }
);

FormModal.displayName = 'FormModal';