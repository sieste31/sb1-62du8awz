/**
 * BatteryListItem Component
 * 電池リストアイテムコンポーネント
 */

import React, { forwardRef } from 'react';
import { SelectableListItem } from '@/components/composed';
import { BatteryStatusBadge } from './BatteryStatusBadge';
import { BatteryDataAdapter } from '@/lib/adapters/battery-data-adapter';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { BatteryListItemProps } from './types';

// 電池形状の表示名
const shapeLabels = {
  aa: '単3',
  aaa: '単4',
  c: '単2',
  d: '単1',
  '9v': '9V',
  cr2032: 'CR2032',
  cr2025: 'CR2025',
  button: 'ボタン'
};

// 日付フォーマット
const formatDate = (date: Date | undefined): string => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// 日数計算
const getDaysAgo = (date: Date | undefined): string => {
  if (!date) return '';
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return '今日';
  if (days === 1) return '昨日';
  return `${days}日前`;
};

export const BatteryListItem = forwardRef<HTMLDivElement, BatteryListItemProps>(
  (
    {
      battery,
      onClick,
      onStatusClick,
      showDevice = true,
      showDetails = false,
      selectable = false,
      selected = false,
      originalGroup,
      legacyMode = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      onClick?.(battery);
    };

    const handleStatusClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      onStatusClick?.(battery);
    };

    // メイン情報
    const title = (
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0">
            <span className="text-lg">🔋</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={cn(
              tokens.typography.body.base,
              'font-medium text-gray-900 truncate'
            )}>
              {battery.name}
            </h3>

            <div className="flex items-center space-x-2 mt-1">
              <span className={cn(
                tokens.typography.body.small,
                'text-gray-600'
              )}>
                {shapeLabels[battery.shape]}
              </span>

              {battery.voltage && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className={cn(
                    tokens.typography.body.small,
                    'text-gray-600'
                  )}>
                    {battery.voltage}V
                  </span>
                </>
              )}

              {battery.capacity && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className={cn(
                    tokens.typography.body.small,
                    'text-gray-600'
                  )}>
                    {battery.capacity}mAh
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={handleStatusClick}
        >
          <BatteryStatusBadge 
            status={battery.status} 
            {...(legacyMode && originalGroup && {
              originalStatus: BatteryDataAdapter.findOriginalBattery(battery.id, [originalGroup])?.status,
              useTranslation: true
            })}
          />
        </div>
      </div>
    );

    // デバイス情報
    const deviceInfo = showDevice && battery.deviceName && (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>📱</span>
        <span>使用中: {battery.deviceName}</span>
      </div>
    );

    // 詳細情報
    const details = showDetails && (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">設置日:</span>
          <div className="text-gray-900">
            {formatDate(battery.installDate)}
            {battery.installDate && (
              <span className="text-gray-500 ml-1">
                ({getDaysAgo(battery.installDate)})
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="text-gray-500">最終確認:</span>
          <div className="text-gray-900">
            {formatDate(battery.lastChecked)}
            {battery.lastChecked && (
              <span className="text-gray-500 ml-1">
                ({getDaysAgo(battery.lastChecked)})
              </span>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <SelectableListItem
        ref={ref}
        title={title}
        subtitle={deviceInfo}
        details={details}
        onClick={handleClick}
        selectable={selectable}
        selected={selected}
        className={cn(
          'hover:bg-gray-50 transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);

BatteryListItem.displayName = 'BatteryListItem';