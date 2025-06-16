/**
 * DeviceTypeSelector Component
 * デバイスタイプ選択コンポーネント
 */

import React, { forwardRef } from 'react';
import { Button, Stack } from '@/components/primitives';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { DeviceTypeSelectorProps, DeviceType } from './types';

// デバイスタイプ設定
const typeConfig: Record<DeviceType, {
  label: string;
  icon: string;
  description: string;
  category: 'common' | 'specialized';
}> = {
  remote: {
    label: 'リモコン',
    icon: '📺',
    description: 'テレビ・エアコンなどのリモコン',
    category: 'common'
  },
  clock: {
    label: '時計',
    icon: '⏰',
    description: '置時計・掛け時計',
    category: 'common'
  },
  toy: {
    label: 'おもちゃ',
    icon: '🎮',
    description: 'ゲーム機・電子玩具',
    category: 'common'
  },
  flashlight: {
    label: '懐中電灯',
    icon: '🔦',
    description: '懐中電灯・ランタン',
    category: 'common'
  },
  smoke_detector: {
    label: '火災警報器',
    icon: '🚨',
    description: '煙感知器・火災報知器',
    category: 'specialized'
  },
  scale: {
    label: '体重計',
    icon: '⚖️',
    description: 'デジタル体重計・キッチンスケール',
    category: 'specialized'
  },
  thermometer: {
    label: '温度計',
    icon: '🌡️',
    description: 'デジタル温度計・湿度計',
    category: 'specialized'
  },
  other: {
    label: 'その他',
    icon: '📱',
    description: 'その他の電子機器',
    category: 'common'
  }
};

const commonTypes: DeviceType[] = ['remote', 'clock', 'toy', 'flashlight', 'other'];
const specializedTypes: DeviceType[] = ['smoke_detector', 'scale', 'thermometer'];

export const DeviceTypeSelector = forwardRef<HTMLDivElement, DeviceTypeSelectorProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      error = false,
      helperText,
      layout = 'grid',
      className,
      ...props
    },
    ref
  ) => {
    const handleTypeSelect = (type: DeviceType) => {
      if (disabled) return;
      onChange?.(type);
    };

    const renderTypeButton = (type: DeviceType) => {
      const config = typeConfig[type];
      const isSelected = value === type;
      
      return (
        <Button
          key={type}
          variant={isSelected ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleTypeSelect(type)}
          disabled={disabled}
          className={cn(
            layout === 'grid' 
              ? 'flex flex-col items-center justify-center h-20 p-3'
              : 'flex items-center justify-start h-12 px-4',
            'border-2 transition-colors',
            isSelected && 'ring-2 ring-offset-1 ring-blue-500',
            error && !isSelected && 'border-red-300',
            !isSelected && !error && 'hover:border-gray-400'
          )}
          title={config.description}
        >
          {layout === 'grid' ? (
            <>
              <span className="text-xl mb-1">{config.icon}</span>
              <span className={cn(
                tokens.typography.body.small,
                'text-center leading-tight'
              )}>
                {config.label}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg mr-3">{config.icon}</span>
              <div className="text-left">
                <div className={cn(
                  tokens.typography.body.medium,
                  'font-medium'
                )}>
                  {config.label}
                </div>
                <div className={cn(
                  tokens.typography.body.small,
                  'text-gray-600'
                )}>
                  {config.description}
                </div>
              </div>
            </>
          )}
        </Button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        {...props}
      >
        {/* 一般的なデバイス */}
        <div>
          <h4 className={cn(
            tokens.typography.body.medium,
            'font-medium text-gray-900 mb-3'
          )}>
            一般的なデバイス
          </h4>
          
          {layout === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {commonTypes.map(renderTypeButton)}
            </div>
          ) : (
            <Stack spacing="xs">
              {commonTypes.map(renderTypeButton)}
            </Stack>
          )}
        </div>

        {/* 専門的なデバイス */}
        <div>
          <h4 className={cn(
            tokens.typography.body.medium,
            'font-medium text-gray-900 mb-3'
          )}>
            専門的なデバイス
          </h4>
          
          {layout === 'grid' ? (
            <div className="grid grid-cols-3 gap-3">
              {specializedTypes.map(renderTypeButton)}
            </div>
          ) : (
            <Stack spacing="xs">
              {specializedTypes.map(renderTypeButton)}
            </Stack>
          )}
        </div>

        {/* 選択中の詳細 */}
        {value && (
          <div className={cn(
            'p-4 rounded-lg bg-blue-50 border border-blue-200',
            error && 'bg-red-50 border-red-200'
          )}>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{typeConfig[value].icon}</span>
              <div>
                <p className={cn(
                  tokens.typography.body.medium,
                  'font-medium text-gray-900'
                )}>
                  {typeConfig[value].label}
                </p>
                <p className={cn(
                  tokens.typography.body.small,
                  'text-gray-600'
                )}>
                  {typeConfig[value].description}
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

DeviceTypeSelector.displayName = 'DeviceTypeSelector';