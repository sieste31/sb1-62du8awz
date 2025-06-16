/**
 * SelectableListItem Component
 * 選択可能なリストアイテムコンポーネント
 */

import React, { forwardRef } from 'react';
import { BaseListItem } from './BaseListItem';
import { cn } from '@/styles/utils';
import type { SelectableListItemProps } from './types';

export const SelectableListItem = forwardRef<HTMLDivElement, SelectableListItemProps>(
  (
    {
      selected = false,
      selectable = true,
      multiSelect = false,
      singleSelect = false,
      onSelectionChange,
      name,
      value,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = onSelectionChange !== undefined;
    const inputType = multiSelect ? 'checkbox' : singleSelect ? 'radio' : null;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!selectable) return;

      if (inputType && isControlled) {
        onSelectionChange(!selected);
      }

      onClick?.(event);
    };

    const baseClasses = cn(
      // 選択状態のスタイル
      selected && 'bg-blue-50 border-blue-200',
      
      // 選択可能なスタイル
      selectable && 'cursor-pointer',
      
      className
    );

    const startIcon = (() => {
      if (!inputType || !selectable) return props.startIcon;

      return (
        <input
          type={inputType}
          checked={selected}
          onChange={() => {}} // ハンドリングはonClickで行う
          name={name}
          value={value}
          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          tabIndex={-1} // フォーカスはリストアイテム全体で管理
          aria-hidden="true" // スクリーンリーダーには親要素の状態を読み上げさせる
        />
      );
    })();

    return (
      <BaseListItem
        ref={ref}
        className={baseClasses}
        clickable={selectable}
        startIcon={startIcon}
        onClick={handleClick}
        aria-selected={selectable ? selected : undefined}
        role={selectable ? (multiSelect ? 'option' : 'option') : undefined}
        {...props}
      />
    );
  }
);

SelectableListItem.displayName = 'SelectableListItem';