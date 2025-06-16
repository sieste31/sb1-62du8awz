/**
 * DeviceBatterySlot Component
 * デバイス電池スロットコンポーネント
 */

import React, { forwardRef } from 'react';
import { Button } from '@/components/primitives';
import { BatteryStatusBadge } from '../battery';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { DeviceBatterySlotProps } from './types';

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

export const DeviceBatterySlot = forwardRef<HTMLDivElement, DeviceBatterySlotProps>(
  (
    {
      slot,
      onBatteryClick,
      onSlotClick,
      showShapeInfo = true,
      compact = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleSlotClick = () => {
      onSlotClick?.(slot);
    };

    const handleBatteryClick = (event: React.MouseEvent) => {
      event.stopPropagation();
      if (slot.battery) {
        onBatteryClick?.(slot.battery);
      }
    };

    const supportedShapesText = slot.supportedShapes
      .map(shape => shapeLabels[shape])
      .join(', ');

    const isEmpty = !slot.battery;
    const isRequired = slot.required;

    return (
      <div
        ref={ref}
        className={cn(
          'relative border-2 rounded-lg transition-all duration-200',
          isEmpty 
            ? isRequired 
              ? 'border-dashed border-red-300 bg-red-50'
              : 'border-dashed border-gray-300 bg-gray-50'
            : 'border-solid border-green-300 bg-green-50',
          'hover:shadow-sm cursor-pointer',
          compact ? 'p-3' : 'p-4',
          className
        )}
        onClick={handleSlotClick}
        {...props}
      >
        {/* スロット番号 */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            tokens.typography.body.small,
            'font-medium text-gray-700'
          )}>
            スロット {slot.slotNumber}
          </span>
          
          {isRequired && (
            <span className={cn(
              tokens.typography.body.xsmall,
              'px-2 py-1 bg-red-100 text-red-700 rounded-full'
            )}>
              必須
            </span>
          )}
        </div>

        {/* 電池情報 */}
        {slot.battery ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-lg">🔋</span>
                <div className="min-w-0">
                  <p className={cn(
                    tokens.typography.body.medium,
                    'font-medium text-gray-900 truncate'
                  )}>
                    {slot.battery.name}
                  </p>
                  
                  {!compact && (
                    <p className={cn(
                      tokens.typography.body.small,
                      'text-gray-600'
                    )}>
                      {shapeLabels[slot.battery.shape]}
                      {slot.battery.voltage && ` • ${slot.battery.voltage}V`}
                    </p>
                  )}
                </div>
              </div>
              
              <div onClick={handleBatteryClick}>
                <BatteryStatusBadge 
                  status={slot.battery.status}
                  iconOnly={compact}
                />
              </div>
            </div>
            
            {!compact && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleBatteryClick}
              >
                電池の詳細
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-3xl text-gray-400 mb-2">
                  {isEmpty ? '🔋' : '❌'}
                </div>
                <p className={cn(
                  tokens.typography.body.medium,
                  isEmpty ? 'text-gray-600' : 'text-red-600',
                  'font-medium'
                )}>
                  {isEmpty ? '電池なし' : '電池切れ'}
                </p>
              </div>
            </div>
            
            {showShapeInfo && (
              <div className={cn(
                'p-2 bg-white border border-gray-200 rounded',
                compact && 'text-xs'
              )}>
                <p className={cn(
                  tokens.typography.body.small,
                  'text-gray-600'
                )}>
                  対応: {supportedShapesText}
                </p>
              </div>
            )}
            
            {!compact && (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleSlotClick}
              >
                電池を設置
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

DeviceBatterySlot.displayName = 'DeviceBatterySlot';