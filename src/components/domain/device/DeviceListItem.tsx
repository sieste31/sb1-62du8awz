/**
 * DeviceListItem Component
 * デバイスリストアイテムコンポーネント
 */

import React, { forwardRef } from 'react';
import { SelectableListItem } from '@/components/composed';
import { BatteryStatusBadge } from '../battery';
import { StatusIndicator } from '@/components/composed';
import { tokens } from '@/styles/tokens';
import { cn } from '@/styles/utils';
import type { DeviceListItemProps } from './types';

// デバイスタイプのアイコン
const deviceIcons = {
  remote: '📺',
  clock: '⏰',
  toy: '🎮',
  flashlight: '🔦',
  smoke_detector: '🚨',
  scale: '⚖️',
  thermometer: '🌡️',
  other: '📱'
};

// デバイスタイプの表示名
const deviceTypeLabels = {
  remote: 'リモコン',
  clock: '時計',
  toy: 'おもちゃ',
  flashlight: '懐中電灯',
  smoke_detector: '火災警報器',
  scale: '体重計',
  thermometer: '温度計',
  other: 'その他'
};

export const DeviceListItem = forwardRef<HTMLDivElement, DeviceListItemProps>(
  (
    {
      device,
      onClick,
      onBatteryClick,
      showBatteryStatus = true,
      showLocation = true,
      selectable = false,
      selected = false,
      className,
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      onClick?.(device);
    };

    const handleBatteryClick = (batteryId: string) => {
      const battery = device.batterySlots
        .find(slot => slot.battery?.id === batteryId)?.battery;

      if (battery) {
        onBatteryClick?.(battery, device);
      }
    };

    // 電池ステータスの計算
    const batteryStats = device.batterySlots.reduce((stats, slot) => {
      if (slot.battery) {
        stats.total++;
        if (slot.battery.status === 'low' || slot.battery.status === 'empty') {
          stats.needsAttention++;
        }
        if (slot.battery.status === 'empty' || slot.battery.status === 'expired') {
          stats.critical++;
        }
      } else if (slot.required) {
        stats.missing++;
      }
      return stats;
    }, { total: 0, needsAttention: 0, critical: 0, missing: 0 });

    // デバイスの全体ステータス
    const getDeviceStatus = () => {
      if (batteryStats.missing > 0 || batteryStats.critical > 0) {
        return { status: 'danger' as const, label: '要対応' };
      }
      if (batteryStats.needsAttention > 0) {
        return { status: 'warning' as const, label: '注意' };
      }
      if (batteryStats.total > 0) {
        return { status: 'success' as const, label: '正常' };
      }
      return { status: 'neutral' as const, label: '未設定' };
    };

    const deviceStatus = getDeviceStatus();

    // メイン情報
    const title = (
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0">
            <span className="text-xl">{deviceIcons[device.type]}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={cn(
              tokens.typography.body.base,
              'font-medium text-gray-900 truncate'
            )}>
              {device.name}
            </h3>

            <div className="flex items-center space-x-2 mt-1">
              <span className={cn(
                tokens.typography.body.small,
                'text-gray-600'
              )}>
                {deviceTypeLabels[device.type]}
              </span>

              <span className="text-gray-400">•</span>
              <span className={cn(
                tokens.typography.body.small,
                'text-gray-600'
              )}>
                {device.batterySlots.length}スロット
              </span>
            </div>
          </div>
        </div>

        {showBatteryStatus && (
          <div className="flex-shrink-0">
            <StatusIndicator
              status={deviceStatus.status}
              label={deviceStatus.label}
            />
          </div>
        )}
      </div>
    );

    // 場所情報
    const locationInfo = showLocation && device.location &&
      `📍 ${device.location}`;

    // 電池詳細情報
    const batteryDetails = showBatteryStatus && (
      <div className="space-y-2">
        {/* 電池統計 */}
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">
            電池: {batteryStats.total}/{device.batterySlots.length}
          </span>

          {batteryStats.needsAttention > 0 && (
            <span className="text-orange-600">
              注意: {batteryStats.needsAttention}個
            </span>
          )}

          {batteryStats.critical > 0 && (
            <span className="text-red-600">
              要交換: {batteryStats.critical}個
            </span>
          )}

          {batteryStats.missing > 0 && (
            <span className="text-red-600">
              未設置: {batteryStats.missing}個
            </span>
          )}
        </div>

        {/* 電池リスト */}
        <div className="flex flex-wrap gap-2">
          {device.batterySlots.map((slot) => (
            <div key={slot.id} className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">
                #{slot.slotNumber}
              </span>

              {slot.battery ? (
                <div
                  className="cursor-pointer"
                  onClick={() => handleBatteryClick(slot.battery!.id)}
                >
                  <BatteryStatusBadge
                    status={slot.battery.status}
                    iconOnly
                  />
                </div>
              ) : (
                <div className={cn(
                  'w-6 h-6 border-2 border-dashed rounded flex items-center justify-center',
                  slot.required
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-gray-50'
                )}>
                  <span className="text-xs text-gray-400">-</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <SelectableListItem
        ref={ref}
        title={title}
        subtitle={locationInfo}
        details={batteryDetails}
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

DeviceListItem.displayName = 'DeviceListItem';