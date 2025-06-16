/**
 * ExpandableListItem Component
 * 展開可能なリストアイテムコンポーネント
 */

import React, { forwardRef, useState } from 'react';
import { BaseListItem } from './BaseListItem';
import { tokens } from '@/styles/tokens';
import { cn, conditionalClass } from '@/styles/utils';
import type { ExpandableListItemProps } from './types';

export const ExpandableListItem = forwardRef<HTMLDivElement, ExpandableListItemProps>(
  (
    {
      expanded: expandedProp,
      expandable = true,
      onExpandChange,
      expandedContent,
      animated = true,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(false);
    
    const isControlled = expandedProp !== undefined;
    const expanded = isControlled ? expandedProp : internalExpanded;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!expandable) return;

      const newExpanded = !expanded;
      
      if (isControlled) {
        onExpandChange?.(newExpanded);
      } else {
        setInternalExpanded(newExpanded);
      }

      onClick?.(event);
    };

    const chevronIcon = expandable ? (
      <svg
        className={cn(
          'w-5 h-5 transition-transform duration-200',
          expanded && 'transform rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    ) : props.endIcon;

    return (
      <div ref={ref} className={className}>
        {/* メインアイテム */}
        <BaseListItem
          clickable={expandable}
          endIcon={chevronIcon}
          onClick={handleClick}
          aria-expanded={expandable ? expanded : undefined}
          aria-controls={expandable && expandedContent ? 'expanded-content' : undefined}
          {...props}
        />

        {/* 展開コンテンツ */}
        {expandable && expandedContent && (
          <div
            id="expanded-content"
            className={cn(
              'overflow-hidden',
              conditionalClass(animated, 'transition-all duration-200 ease-in-out'),
              expanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div
              className={cn(
                'border-t border-gray-200 bg-gray-50',
                tokens.spacing.md
              )}
            >
              {expandedContent}
            </div>
          </div>
        )}
      </div>
    );
  }
);

ExpandableListItem.displayName = 'ExpandableListItem';