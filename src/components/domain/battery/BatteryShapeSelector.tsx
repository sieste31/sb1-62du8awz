/**
 * BatteryShapeSelector Component
 * 電池形状選択コンポーネント
 */

import React, { forwardRef, useMemo } from 'react';
import { Button, Stack } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import { SHAPE_MAPPING, REVERSE_SHAPE_MAPPING } from '@/lib/adapters/battery-shape-mapper';
import type { BatteryShapeSelectorProps, BatteryShape } from './types';

// 電池形状設定
const shapeConfig: Record<BatteryShape, {
  label: string;
  icon: string;
  description: string;
}> = {
  aa: {
    label: 'AA',
    icon: '🔋',
    description: '単3電池'
  },
  aaa: {
    label: 'AAA',
    icon: '🔋',
    description: '単4電池'
  },
  c: {
    label: 'C',
    icon: '🔋',
    description: '単2電池'
  },
  d: {
    label: 'D',
    icon: '🔋',
    description: '単1電池'
  },
  '9v': {
    label: '9V',
    icon: '⚡',
    description: '9V電池'
  },
  cr2032: {
    label: 'CR2032',
    icon: '🪙',
    description: 'コイン電池'
  },
  cr2025: {
    label: 'CR2025',
    icon: '🪙',
    description: 'コイン電池'
  },
  button: {
    label: 'ボタン',
    icon: '🔘',
    description: 'ボタン電池'
  }
};

const shapeOrder: BatteryShape[] = ['aa', 'aaa', 'c', 'd', '9v', 'cr2032', 'cr2025', 'button'];

export const BatteryShapeSelector = forwardRef<HTMLDivElement, BatteryShapeSelectorProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      error = false,
      helperText,
      orientation = 'horizontal',
      legacyValue,
      onLegacyChange,
      className,
      ...props
    },
    ref
  ) => {
    // 互換性処理：legacyValueがある場合は変換して使用
    const actualValue = useMemo(() => {
      if (legacyValue && !value) {
        return SHAPE_MAPPING[legacyValue] as BatteryShape;
      }
      return value;
    }, [value, legacyValue]);

    const handleShapeSelect = (shape: BatteryShape) => {
      if (disabled) return;
      
      // 新型のハンドラを呼ぶ
      onChange?.(shape);
      
      // 互換性のため、legacyハンドラも呼ぶ
      if (onLegacyChange) {
        const legacyShape = REVERSE_SHAPE_MAPPING[shape];
        if (legacyShape) {
          onLegacyChange(legacyShape as any);
        }
      }
    };

    const gridClass = orientation === 'horizontal' 
      ? 'grid-cols-4 sm:grid-cols-8'
      : 'grid-cols-2 sm:grid-cols-3';

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-3',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        {/* 選択グリッド */}
        <div className={cn('grid gap-2', gridClass)}>
          {shapeOrder.map((shape) => {
            const config = shapeConfig[shape];
            const isSelected = actualValue === shape;
            
            return (
              <Button
                key={shape}
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleShapeSelect(shape)}
                disabled={disabled}
                className={cn(
                  'flex flex-col items-center justify-center h-16 p-2',
                  'border-2 transition-colors',
                  isSelected && 'ring-2 ring-offset-1 ring-blue-500',
                  error && !isSelected && 'border-red-300',
                  !isSelected && !error && 'hover:border-gray-400'
                )}
                title={config.description}
              >
                <span className="text-lg mb-1">{config.icon}</span>
                <span className={cn(
                  tokens.typography.body.xsmall,
                  'text-center leading-tight'
                )}>
                  {config.label}
                </span>
              </Button>
            );
          })}
        </div>

        {/* 選択中の詳細 */}
        {actualValue && (
          <div className={cn(
            'p-3 rounded-lg bg-blue-50 border border-blue-200',
            error && 'bg-red-50 border-red-200'
          )}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{shapeConfig[actualValue].icon}</span>
              <div>
                <p className={cn(
                  tokens.typography.body.small,
                  'font-medium text-gray-900'
                )}>
                  {shapeConfig[actualValue].label}
                </p>
                <p className={cn(
                  tokens.typography.body.xs,
                  'text-gray-600'
                )}>
                  {shapeConfig[actualValue].description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ヘルプテキスト */}
        {helperText && (
          <p className={cn(
            tokens.typography.body.small,
            error ? 'text-red-600' : 'text-gray-600'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

BatteryShapeSelector.displayName = 'BatteryShapeSelector';