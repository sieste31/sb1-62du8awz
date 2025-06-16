/**
 * BaseModal Component
 * 基本的なモーダルコンポーネント
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass, position } from '@/styles/utils';
import type { BaseModalProps } from './types';

const sizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-none w-full h-full',
};

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
  (
    {
      open = false,
      onClose,
      title,
      showCloseButton = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      size = 'md',
      focusTrap = true,
      initialFocus,
      restoreFocus,
      className,
      overlayClassName,
      children,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    // ESCキーでの閉じる処理
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, onClose]);

    // フォーカス管理
    useEffect(() => {
      if (!open) return;

      // 現在のアクティブ要素を保存
      previousActiveElement.current = document.activeElement;

      // 初期フォーカスの設定
      const focusElement = initialFocus?.current || modalRef.current;
      if (focusElement) {
        focusElement.focus();
      }

      // フォーカストラップ
      if (focusTrap) {
        const handleTabKey = (event: KeyboardEvent) => {
          if (event.key !== 'Tab') return;

          const modal = modalRef.current;
          if (!modal) return;

          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
      }
    }, [open, focusTrap, initialFocus]);

    // モーダルが閉じられた時のフォーカス復帰
    useEffect(() => {
      return () => {
        const elementToFocus = restoreFocus?.current || previousActiveElement.current;
        if (elementToFocus && typeof (elementToFocus as HTMLElement).focus === 'function') {
          (elementToFocus as HTMLElement).focus();
        }
      };
    }, [restoreFocus]);

    // body スクロール制御
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [open]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    if (!open) return null;

    const modalContent = (
      <div
        className={cn(
          // オーバーレイ
          'fixed inset-0 z-50 overflow-y-auto',
          'bg-black bg-opacity-50',
          'flex items-center justify-center p-4',
          overlayClassName
        )}
        onClick={handleOverlayClick}
      >
        <div
          ref={modalRef}
          className={cn(
            // モーダルコンテナ
            'relative bg-white rounded-lg shadow-xl',
            'w-full mx-auto',
            sizeClasses[size],
            conditionalClass(size === 'full', 'h-full'),
            'max-h-full overflow-hidden',
            tokens.transitions.all,
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          {...props}
        >
          {/* ヘッダー */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              {title && (
                <h2
                  id="modal-title"
                  className={cn(tokens.typography.heading.h3, 'text-gray-900')}
                >
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  onClick={onClose}
                  aria-label="モーダルを閉じる"
                  className="ml-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}

          {/* コンテンツ */}
          <div
            className={cn(
              'flex-1',
              conditionalClass(size === 'full', 'overflow-y-auto')
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );

    // ポータルでrenderする
    return createPortal(modalContent, document.body);
  }
);

BaseModal.displayName = 'BaseModal';