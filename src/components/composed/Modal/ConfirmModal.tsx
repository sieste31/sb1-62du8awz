/**
 * ConfirmModal Component
 * 確認ダイアログモーダルコンポーネント
 */

import React, { forwardRef, useState } from 'react';
import { BaseModal } from './BaseModal';
import { Button, Stack } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { ConfirmModalProps } from './types';

export const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(
  (
    {
      message,
      description,
      confirmLabel = '確認',
      cancelLabel = 'キャンセル',
      confirmVariant = 'primary',
      destructive = false,
      loading = false,
      onConfirm,
      onCancel,
      onClose,
      ...modalProps
    },
    ref
  ) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
      if (!onConfirm) return;

      try {
        setIsSubmitting(true);
        await onConfirm();
        onClose?.();
      } catch (error) {
        // エラーハンドリングは親コンポーネントに委ねる
        console.error('Confirm action failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onClose?.();
    };

    const actualConfirmVariant = destructive ? 'danger' : confirmVariant;
    const isLoading = loading || isSubmitting;

    return (
      <BaseModal
        ref={ref}
        onClose={handleCancel}
        size="sm"
        {...modalProps}
      >
        {/* アイコン */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {destructive ? (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* メッセージ */}
            <div className="flex-1">
              <h3
                className={cn(
                  tokens.typography.heading.h4,
                  'text-gray-900 mb-2'
                )}
              >
                {message}
              </h3>
              
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
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Stack direction="horizontal" spacing="sm" justify="end">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            
            <Button
              variant={actualConfirmVariant}
              onClick={handleConfirm}
              loading={isLoading}
              disabled={isLoading}
            >
              {confirmLabel}
            </Button>
          </Stack>
        </div>
      </BaseModal>
    );
  }
);

ConfirmModal.displayName = 'ConfirmModal';